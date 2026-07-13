#!/usr/bin/env python3
"""
KAIROS SEO/GEO-Monitor — Evaluator (S3-Kern).

Prueft eine Live-Site gegen den versionierten Soll-Vertrag (standard.json) und
erzeugt einen strukturierten Report (JSON, konform zu shared/schemas/seo-report.schema.json).

Deterministisch und ohne Netz-Nebenwirkungen ausser dem einen Seiten-Fetch
(via shared/seo-engine, SSRF-abgesichert durch url_safety).

Nutzung:
    evaluate.py --live-url https://kunde.de --trade dachdecker \
        [--client-id dachdecker-richert] \
        [--baseline-standard-version 1.0.0] \
        [--standard <pfad/standard.json>] [--engine <pfad/seo-engine>]

Gibt den Report als JSON auf stdout aus. Exit 0 auch bei Findings; Exit 1 nur bei
technischem Fehler (Fetch/Parse fehlgeschlagen).

Finding-Typen (siehe §4a im Plan):
    gap        — Live-Site erfuellt eine Pflicht-Regel nicht (absolute Nichteinhaltung).
    deprecated — Site nutzt/verlaesst sich auf ein ueberholtes Feature.
    upgrade    — Standard hat sich seit der Baseline weiterentwickelt (Soll > Site).
"""

from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
import tempfile
from datetime import datetime, timezone

REPORT_VERSION = "1.0.0"

# Pfade relativ zu diesem File: shared/seo-monitor/ -> repo-root
_THIS_DIR = os.path.dirname(os.path.abspath(__file__))
_REPO_ROOT = os.path.abspath(os.path.join(_THIS_DIR, "..", ".."))
_DEFAULT_STANDARD = os.path.join(_REPO_ROOT, "shared", "knowledge", "seo-geo", "standard.json")
_DEFAULT_ENGINE = os.path.join(_REPO_ROOT, "shared", "seo-engine")


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def load_standard(path: str) -> dict:
    with open(path, "r", encoding="utf-8") as fh:
        return json.load(fh)


def fetch_and_parse(engine_dir: str, url: str) -> dict:
    """Fetch die Live-Seite und parse sie via den vendored Motor. Wirft bei Fehler."""
    py = sys.executable
    scripts = os.path.join(engine_dir, "scripts")
    fetch_script = os.path.join(scripts, "fetch_page.py")
    parse_script = os.path.join(scripts, "parse_html.py")

    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".html")
    tmp.close()
    try:
        fetched = subprocess.run(
            [py, fetch_script, url, "--output", tmp.name],
            capture_output=True, text=True,
        )
        if fetched.returncode != 0:
            raise RuntimeError(f"Fetch fehlgeschlagen: {fetched.stderr.strip() or fetched.stdout.strip()}")

        parsed = subprocess.run(
            [py, parse_script, tmp.name, "--url", url, "--json"],
            capture_output=True, text=True,
        )
        if parsed.returncode != 0:
            raise RuntimeError(f"Parse fehlgeschlagen: {parsed.stderr.strip() or parsed.stdout.strip()}")
        return json.loads(parsed.stdout)
    finally:
        try:
            os.unlink(tmp.name)
        except OSError:
            pass


def _schema_types(parsed: dict) -> list[str]:
    """Alle @type-Werte aus den JSON-LD-Bloecken (flach, tolerant gegen Listen)."""
    types: list[str] = []
    for block in parsed.get("schema", []) or []:
        if not isinstance(block, dict):
            continue
        t = block.get("@type")
        if isinstance(t, str):
            types.append(t)
        elif isinstance(t, list):
            types.extend(x for x in t if isinstance(x, str))
    return types


def _finding(fid, ftype, severity, title, detail, expected=None, actual=None, rationale=None):
    f = {"id": fid, "type": ftype, "severity": severity, "title": title, "detail": detail}
    if expected is not None:
        f["expected"] = expected
    if actual is not None:
        f["actual"] = actual
    if rationale:
        f["rationale"] = rationale
    return f


def evaluate(parsed: dict, standard: dict, trade: str | None,
             baseline_standard_version: str | None) -> tuple[list[dict], list[str]]:
    """Kern-Logik: parsed page + standard.json -> (findings, not_evaluated)."""
    findings: list[dict] = []
    not_evaluated: list[str] = []

    schema_types = _schema_types(parsed)
    schema_types_lower = {t.lower() for t in schema_types}

    # --- global.require ------------------------------------------------------
    for rule in standard["global"]["require"]:
        check = rule["check"]
        sev = rule["severity"]
        rid = rule["id"]
        rationale = rule.get("rationale")

        if check == "title_nonempty":
            if not (parsed.get("title") or "").strip():
                findings.append(_finding(rid, "gap", sev, "Title fehlt",
                    "Die Seite hat keinen (nicht-leeren) <title>.", expected="nicht-leerer Title",
                    actual=parsed.get("title"), rationale=rationale))
        elif check == "meta_description_nonempty":
            if not (parsed.get("meta_description") or "").strip():
                findings.append(_finding(rid, "gap", sev, "Meta-Description fehlt",
                    "Die Seite hat keine (nicht-leere) Meta-Description.", expected="gepflegte Meta-Description",
                    actual=parsed.get("meta_description"), rationale=rationale))
        elif check == "canonical_present":
            if not (parsed.get("canonical") or "").strip():
                findings.append(_finding(rid, "gap", sev, "Canonical fehlt",
                    "Kein <link rel=canonical> gefunden.", expected="Canonical auf echte Domain",
                    actual=parsed.get("canonical"), rationale=rationale))
        elif check == "exactly_one_h1":
            h1 = parsed.get("h1") or []
            n = len(h1) if isinstance(h1, list) else (1 if h1 else 0)
            if n != 1:
                findings.append(_finding(rid, "gap", sev, f"H1-Anzahl = {n} (soll: 1)",
                    "Es muss genau eine H1 je Seite geben.", expected="genau 1 H1", actual=n,
                    rationale=rationale))
        elif check == "no_noindex":
            robots = (parsed.get("meta_robots") or "").lower()
            if "noindex" in robots:
                findings.append(_finding(rid, "gap", sev, "Seite steht auf noindex",
                    "meta robots enthaelt 'noindex' — Kernseite waere aus dem Index ausgeschlossen.",
                    expected="index,follow", actual=parsed.get("meta_robots"), rationale=rationale))
        elif check == "schema_subclass_present":
            # Basistyp/Unterklasse pruefen (trade-spezifisch, falls trade bekannt)
            accepted = None
            recommended = None
            if trade and trade in standard.get("trades", {}):
                st = standard["trades"][trade]["schemaTypes"]
                accepted = st["accepted"]
                recommended = st.get("recommended")
            if not schema_types:
                findings.append(_finding(rid, "gap", sev, "Kein LocalBusiness-Schema",
                    "Keine JSON-LD-Schema-Bloecke gefunden. LocalBusiness (+ Gewerke-Unterklasse) ist Pflicht.",
                    expected=(recommended or "LocalBusiness-Unterklasse"), actual="0 Schema-Bloecke",
                    rationale=rationale))
            elif accepted is not None and not (schema_types_lower & {a.lower() for a in accepted}):
                findings.append(_finding(rid, "gap", sev, "Falsche/fehlende Schema-Unterklasse",
                    f"Schema vorhanden ({', '.join(sorted(set(schema_types)))}), aber keine der fuer "
                    f"'{trade}' erwarteten Unterklassen.", expected=f"eine von {accepted}",
                    actual=sorted(set(schema_types)), rationale=rationale))
        elif check in ("robots_allows_bots", "sitemap_exists", "nap_consistent"):
            # Brauchen zusaetzliche Fetches (robots.txt/sitemap.xml/mehrere Seiten) -> spaetere Ausbaustufe.
            not_evaluated.append(rule["id"])
        else:
            not_evaluated.append(rule["id"])

    # --- global.deprecated ---------------------------------------------------
    for dep in standard["global"]["deprecated"]:
        target = dep.get("target", "")
        # Nur schema-basierte Deprecations sind aus dem Parse pruefbar (FAQPage, HowTo).
        if target.lower() in schema_types_lower:
            findings.append(_finding(dep["id"], "deprecated", dep.get("severity", "INFO"),
                f"Ueberholtes Feature im Einsatz: {target}",
                dep.get("rationale", ""), expected=f"{target} nicht mehr als Ranking-Signal einplanen",
                actual=f"{target} im JSON-LD vorhanden", rationale=dep.get("rationale")))

    # --- upgrade (Standard hat sich seit der Baseline bewegt) ----------------
    cur = standard["standardVersion"]
    if baseline_standard_version and baseline_standard_version != cur:
        findings.append(_finding("standard-advanced", "upgrade", "INFO",
            f"Standard weiterentwickelt: {baseline_standard_version} -> {cur}",
            "Der SEO/GEO-Standard hat sich seit der letzten Baseline geaendert. Site gegen die neuen "
            "Regeln (deprecated/Schema) re-reviewen und ggf. Upgrade ausrollen.",
            expected=cur, actual=baseline_standard_version))

    return findings, not_evaluated


def collect_drift_regressions(engine_dir: str, url: str, db_dir: str | None = None,
                              establish_if_missing: bool = True) -> tuple[list[dict], str]:
    """
    Live-vs-Baseline via vendored drift_compare. Ergebnis: (regression-findings, status).

    status: "compared" | "baseline_established" | "no_baseline" | "error: ..."
    Bei fehlender Baseline wird sie (falls establish_if_missing) aus der aktuellen Seite
    erfasst — d. h. beim ersten Lauf gibt es noch keinen Vergleich, nur die Baseline.
    """
    py = sys.executable
    scripts = os.path.join(engine_dir, "scripts")
    env = dict(os.environ)
    if db_dir:
        env["KAIROS_DRIFT_DB_DIR"] = db_dir

    proc = subprocess.run(
        [py, os.path.join(scripts, "drift_compare.py"), url, "--skip-cwv"],
        capture_output=True, text=True, env=env,
    )
    try:
        result = json.loads(proc.stdout) if proc.stdout.strip() else {}
    except json.JSONDecodeError:
        return [], f"error: drift_compare-Ausgabe nicht lesbar"

    if result.get("error"):
        if "No baseline found" in result["error"]:
            if establish_if_missing:
                base = subprocess.run(
                    [py, os.path.join(scripts, "drift_baseline.py"), url, "--skip-cwv"],
                    capture_output=True, text=True, env=env,
                )
                status = "baseline_established" if base.returncode == 0 else "error: baseline fehlgeschlagen"
                return [], status
            return [], "no_baseline"
        return [], f"error: {result['error']}"

    findings = []
    for tf in result.get("triggered_findings", []):
        findings.append(_finding(
            tf["rule"], "regression", tf.get("severity", "INFO"),
            f"Änderung ggü. Baseline: {tf['rule']}",
            tf.get("message", ""),
            expected=tf.get("old_value"), actual=tf.get("new_value"),
        ))
    return findings, "compared"


# Wenn eine Regression und ein Gap dasselbe Element betreffen, ist die Regression
# ("seit Auslieferung entfernt/geändert") informativer -> Gap verwerfen.
_REGRESSION_TO_REQUIRE = {
    "schema_removed": "localbusiness-schema",
    "canonical_removed": "canonical-present",
    "canonical_changed": "canonical-present",
    "title_removed": "title-present",
    "h1_removed": "single-h1",
    "noindex_added": "indexable",
    "meta_description_changed": "meta-description-present",
}


def merge_findings(standard_findings: list[dict], drift_findings: list[dict]) -> list[dict]:
    """Standard- (gap/deprecated/upgrade) und Drift-Findings (regression) zusammenführen + dedupen."""
    superseded = {
        _REGRESSION_TO_REQUIRE[f["id"]]
        for f in drift_findings if f["id"] in _REGRESSION_TO_REQUIRE
    }
    kept = [f for f in standard_findings if not (f["type"] == "gap" and f["id"] in superseded)]
    return kept + drift_findings


_SEV_ORDER = {"CRITICAL": 0, "WARNING": 1, "INFO": 2}


def build_report(client_id, trade, live_url, standard, findings, not_evaluated,
                 baseline_standard_version, drift_status="disabled") -> dict:
    findings = sorted(findings, key=lambda f: _SEV_ORDER.get(f["severity"], 9))
    summary = {
        "critical": sum(1 for f in findings if f["severity"] == "CRITICAL"),
        "warning": sum(1 for f in findings if f["severity"] == "WARNING"),
        "info": sum(1 for f in findings if f["severity"] == "INFO"),
        "total": len(findings),
    }
    return {
        "reportVersion": REPORT_VERSION,
        "clientId": client_id,
        "trade": trade,
        "liveUrl": live_url,
        "generatedAt": _now_iso(),
        "standardVersion": standard["standardVersion"],
        "baselineStandardVersion": baseline_standard_version,
        "driftStatus": drift_status,
        "summary": summary,
        "findings": findings,
        "notEvaluated": not_evaluated,
    }


_SEV_BADGE = {"CRITICAL": "🔴 CRITICAL", "WARNING": "🟡 WARNING", "INFO": "🔵 INFO"}


def render_markdown(report: dict) -> str:
    """Menschenlesbarer Report (Zwischenloesung bis das Dashboard das JSON liest)."""
    s = report["summary"]
    lines = [
        f"# SEO/GEO-Report — {report.get('clientId') or report['liveUrl']}",
        "",
        f"- **URL:** {report['liveUrl']}",
        f"- **Gewerk:** {report.get('trade') or '—'}",
        f"- **Standard:** v{report['standardVersion']}"
        + (f" (Baseline: v{report['baselineStandardVersion']})" if report.get("baselineStandardVersion") else ""),
        f"- **Erstellt:** {report['generatedAt']}",
        f"- **Drift-Prüfung:** {report.get('driftStatus', 'disabled')}",
        f"- **Findings:** {s['total']}  ·  🔴 {s['critical']}  🟡 {s['warning']}  🔵 {s['info']}",
        "",
    ]
    if not report["findings"]:
        lines.append("✅ Keine Findings — Site entspricht dem aktuellen Standard.")
    for f in report["findings"]:
        lines.append(f"### {_SEV_BADGE.get(f['severity'], f['severity'])} · `{f['type']}` · {f['title']}")
        lines.append(f["detail"])
        if "expected" in f:
            lines.append(f"- **Soll:** {f['expected']}")
        if "actual" in f:
            lines.append(f"- **Ist:** {f['actual']}")
        lines.append("")
    if report.get("notEvaluated"):
        lines.append(f"> _Noch nicht geprüft (spätere Ausbaustufe): {', '.join(report['notEvaluated'])}._")
    return "\n".join(lines) + "\n"


def main():
    p = argparse.ArgumentParser(description="KAIROS SEO/GEO-Monitor Evaluator")
    p.add_argument("--live-url", required=True)
    p.add_argument("--trade", default=None)
    p.add_argument("--client-id", default=None)
    p.add_argument("--baseline-standard-version", default=None)
    p.add_argument("--standard", default=_DEFAULT_STANDARD)
    p.add_argument("--engine", default=_DEFAULT_ENGINE)
    p.add_argument("--format", choices=["json", "md"], default="json",
                   help="Ausgabeformat: json (Maschinen-Vertrag, default) oder md (menschenlesbar).")
    p.add_argument("--with-drift", action="store_true",
                   help="Zusätzlich Live-vs-Baseline-Regressionen prüfen (drift_compare).")
    p.add_argument("--drift-db-dir", default=None,
                   help="Verzeichnis der Baseline-DB (Env KAIROS_DRIFT_DB_DIR). Default: ~/.cache/claude-seo/drift.")
    args = p.parse_args()

    standard = load_standard(args.standard)
    try:
        parsed = fetch_and_parse(args.engine, args.live_url)
    except (RuntimeError, json.JSONDecodeError) as exc:
        print(json.dumps({"error": str(exc), "liveUrl": args.live_url}, ensure_ascii=False))
        sys.exit(1)

    findings, not_evaluated = evaluate(parsed, standard, args.trade, args.baseline_standard_version)
    drift_status = "disabled"
    if args.with_drift:
        drift_findings, drift_status = collect_drift_regressions(
            args.engine, args.live_url, args.drift_db_dir)
        findings = merge_findings(findings, drift_findings)
    report = build_report(args.client_id, args.trade, args.live_url, standard,
                          findings, not_evaluated, args.baseline_standard_version, drift_status)
    if args.format == "md":
        print(render_markdown(report))
    else:
        print(json.dumps(report, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
