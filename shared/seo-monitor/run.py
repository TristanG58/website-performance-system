#!/usr/bin/env python3
"""
KAIROS SEO/GEO-Monitor — Cron-Runner (S3c).

Iteriert das Kundenregister, evaluiert jeden teilnahmeberechtigten Kunden gegen den
Soll-Vertrag (standard.json) und legt pro Kunde einen Report ab. Aktualisiert lastAudit.

Deterministisch, KEIN LLM. Gedacht für einen wöchentlichen systemd-Timer/cron
(z. B. auf einem Hetzner-Server) — läuft aber identisch lokal.

Teilnahmeberechtigt ist ein Kunde, wenn:
    status == "active"  UND  "seo-continuous" in enabledModules
    UND liveUrl gesetzt  UND trade gesetzt.

Nutzung:
    run.py [--registry registry/clients.json] [--out shared/seo-monitor/reports]
           [--only <clientId>] [--format json|md|both] [--dry-run]

Exit 0 = Lauf durchgelaufen (auch mit Findings). Exit 1 = harter Fehler (Register unlesbar).
Der Exit-Code hängt NICHT von gefundenen Problemen ab — Findings sind normaler Output.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from datetime import datetime, timezone

# Nachbar-Modul (gleicher Ordner) importieren
_THIS_DIR = os.path.dirname(os.path.abspath(__file__))
if _THIS_DIR not in sys.path:
    sys.path.insert(0, _THIS_DIR)
import evaluate as ev  # noqa: E402

_REPO_ROOT = os.path.abspath(os.path.join(_THIS_DIR, "..", ".."))
_DEFAULT_REGISTRY = os.path.join(_REPO_ROOT, "registry", "clients.json")
_DEFAULT_OUT = os.path.join(_THIS_DIR, "reports")


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _slug_date() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%d")


def is_eligible(client: dict) -> bool:
    return (
        client.get("status") == "active"
        and "seo-continuous" in (client.get("enabledModules") or [])
        and bool(client.get("liveUrl"))
        and bool(client.get("trade"))
    )


def evaluate_client(client: dict, standard: dict, engine_dir: str,
                    with_drift: bool = False, drift_db_dir: str | None = None) -> dict:
    """Ein Kunde -> Report-Dict (oder Fehler-Dict). Kapselt fetch+parse+evaluate (+drift)."""
    live_url = client["liveUrl"]
    trade = client.get("trade")
    client_id = client.get("clientId")
    baseline_std = (client.get("seoBaseline") or {}).get("standardVersion")

    try:
        parsed = ev.fetch_and_parse(engine_dir, live_url)
    except (RuntimeError, json.JSONDecodeError) as exc:
        return {"error": str(exc), "clientId": client_id, "liveUrl": live_url}

    findings, not_evaluated = ev.evaluate(parsed, standard, trade, baseline_std)
    drift_status = "disabled"
    if with_drift:
        drift_findings, drift_status = ev.collect_drift_regressions(engine_dir, live_url, drift_db_dir)
        findings = ev.merge_findings(findings, drift_findings)
    return ev.build_report(client_id, trade, live_url, standard,
                           findings, not_evaluated, baseline_std, drift_status)


def write_report(out_dir: str, client_id: str, report: dict, fmt: str) -> list[str]:
    os.makedirs(out_dir, exist_ok=True)
    base = f"{client_id or 'unknown'}-{_slug_date()}"
    written = []
    if fmt in ("json", "both"):
        path = os.path.join(out_dir, base + ".json")
        with open(path, "w", encoding="utf-8") as fh:
            json.dump(report, fh, indent=2, ensure_ascii=False)
        written.append(path)
    if fmt in ("md", "both"):
        path = os.path.join(out_dir, base + ".md")
        with open(path, "w", encoding="utf-8") as fh:
            fh.write(ev.render_markdown(report))
        written.append(path)
    return written


def main():
    p = argparse.ArgumentParser(description="KAIROS SEO/GEO-Monitor Cron-Runner")
    p.add_argument("--registry", default=_DEFAULT_REGISTRY)
    p.add_argument("--out", default=_DEFAULT_OUT)
    p.add_argument("--standard", default=ev._DEFAULT_STANDARD)
    p.add_argument("--engine", default=ev._DEFAULT_ENGINE)
    p.add_argument("--only", default=None, help="Nur diesen clientId verarbeiten.")
    p.add_argument("--format", choices=["json", "md", "both"], default="both")
    p.add_argument("--with-drift", action="store_true",
                   help="Zusätzlich Live-vs-Baseline-Regressionen prüfen (drift_compare).")
    p.add_argument("--drift-db-dir", default=os.path.join(_THIS_DIR, ".drift"),
                   help="Verzeichnis der Baseline-DB. Default: shared/seo-monitor/.drift (gitignored).")
    p.add_argument("--dry-run", action="store_true",
                   help="Keine Reports schreiben, kein lastAudit setzen — nur Zusammenfassung.")
    args = p.parse_args()

    try:
        with open(args.registry, "r", encoding="utf-8") as fh:
            registry = json.load(fh)
    except (OSError, json.JSONDecodeError) as exc:
        print(json.dumps({"error": f"Register unlesbar: {exc}", "registry": args.registry}))
        sys.exit(1)

    standard = ev.load_standard(args.standard)
    clients = registry.get("clients", [])
    if args.only:
        clients = [c for c in clients if c.get("clientId") == args.only]

    run_summary = {
        "startedAt": _now_iso(),
        "standardVersion": standard["standardVersion"],
        "registry": args.registry,
        "dryRun": args.dry_run,
        "clients": [],
        "totals": {"eligible": 0, "skipped": 0, "errors": 0,
                   "critical": 0, "warning": 0, "info": 0},
    }

    for client in clients:
        cid = client.get("clientId", "unknown")
        if not is_eligible(client):
            run_summary["totals"]["skipped"] += 1
            run_summary["clients"].append({"clientId": cid, "status": "skipped",
                                           "reason": "nicht teilnahmeberechtigt"})
            continue

        run_summary["totals"]["eligible"] += 1
        report = evaluate_client(client, standard, args.engine,
                                 with_drift=args.with_drift, drift_db_dir=args.drift_db_dir)

        if "error" in report:
            run_summary["totals"]["errors"] += 1
            run_summary["clients"].append({"clientId": cid, "status": "error",
                                           "error": report["error"]})
            continue

        s = report["summary"]
        for k in ("critical", "warning", "info"):
            run_summary["totals"][k] += s[k]

        entry = {"clientId": cid, "status": "ok", "summary": s}
        if not args.dry_run:
            written = write_report(args.out, cid, report, args.format)
            entry["reports"] = [os.path.relpath(w, _REPO_ROOT) for w in written]
            client["lastAudit"] = _now_iso()  # Register in-place aktualisieren
        run_summary["clients"].append(entry)

    # lastAudit-Änderungen zurückschreiben (nur wenn nicht dry-run und es lief sauber)
    if not args.dry_run and run_summary["totals"]["eligible"] > 0:
        with open(args.registry, "w", encoding="utf-8") as fh:
            json.dump(registry, fh, indent=2, ensure_ascii=False)
            fh.write("\n")

    run_summary["finishedAt"] = _now_iso()
    print(json.dumps(run_summary, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
