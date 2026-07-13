# shared/seo-monitor

Kontinuierlicher SEO/GEO-Monitor (Produkt "Version 2"). Prüft ausgelieferte Handwerk-Sites
wöchentlich gegen den versionierten Soll-Vertrag [`standard.json`](../knowledge/seo-geo/standard.json)
und legt pro Kunde einen Report ab.

- `evaluate.py` — Kern: **eine** Site gegen `standard.json` prüfen → Report (JSON/MD).
- `run.py` — Cron-Runner: iteriert das Register, ruft `evaluate` je Kunde, schreibt Reports, setzt `lastAudit`.
- Skill-Wrapper (Urteils-Ebene): [`handwerk-seo-monitor`](../../plugins/meisterwerk/skills/handwerk-seo-monitor/SKILL.md).

**Deterministisch, kein LLM.** Die KI kommt erst *nach* dem Lauf ins Spiel (Fixes/Upgrades bewerten) — on-demand, nicht im Cron.

## Architektur: wer läuft wo

| Ebene | Was | Wo | Takt |
|---|---|---|---|
| **Erkennung** | `run.py` → `evaluate.py` → Reports | Server (Hetzner), systemd-Timer | wöchentlich |
| **Urteil/Fix** | CRITICAL bewerten, Upgrade ausrollen | Claude/Agent **on-demand** | nur bei Findings |

Nicht über den Mac (muss dann dauerhaft an sein) und nicht „durch einen Chat-Agent laufen lassen"
(teuer + nicht-deterministisch für eine reine Python-Aufgabe).

## Lokal testen

```bash
# einmalig: Motor-venv (siehe ../seo-engine/README.md)
cd shared/seo-engine && /opt/homebrew/bin/python3.12 -m venv .venv && ./.venv/bin/pip install -r requirements.txt

# Einzelne Site
../seo-engine/.venv/bin/python evaluate.py --live-url https://kunde.de --trade dachdecker --format md

# Ganzer Lauf gegen die Beispiel-Fixture (dry-run = nichts schreiben)
../seo-engine/.venv/bin/python run.py --registry ../../registry/clients.example.json --dry-run
```

**Zwei Prüfrichtungen (§4a):**
- *Live-vs-Soll* (immer): Gaps/Deprecated/Upgrade gegen `standard.json`.
- *Live-vs-Baseline* (`--with-drift`): Regressionen ggü. dem ausgelieferten Zustand (`drift_compare`).
  Beim **ersten** Lauf pro URL wird nur die Baseline erfasst (`driftStatus: baseline_established`),
  ab dem zweiten wird verglichen (`compared`). Betrifft eine Regression dasselbe Element wie ein Gap,
  gewinnt die (informativere) Regression. Baseline-DB: `--drift-db-dir` (Default `shared/seo-monitor/.drift`, gitignored).

Register: `run.py` liest standardmäßig `registry/clients.json` (produktiv, entsteht separat).
`registry/clients.example.json` ist eine Fixture mit öffentlicher Test-URL — **keine** Kundendaten.
Reports landen in `shared/seo-monitor/reports/` (gitignored).

## Deployment auf Hetzner (systemd-Timer, empfohlen)

Voraussetzung: Python 3.10+ (`apt install python3 python3-venv`). Repo (oder die Ordner
`shared/`, `registry/`) nach `/opt/kairos` deployen und dort das venv anlegen.

`/etc/systemd/system/seo-monitor.service`:
```ini
[Unit]
Description=KAIROS SEO/GEO Monitor
After=network-online.target
Wants=network-online.target

[Service]
Type=oneshot
WorkingDirectory=/opt/kairos
ExecStart=/opt/kairos/shared/seo-engine/.venv/bin/python \
  /opt/kairos/shared/seo-monitor/run.py \
  --registry /opt/kairos/registry/clients.json \
  --out /opt/kairos/shared/seo-monitor/reports --format both \
  --with-drift --drift-db-dir /opt/kairos/shared/seo-monitor/.drift
```

`/etc/systemd/system/seo-monitor.timer`:
```ini
[Unit]
Description=KAIROS SEO/GEO Monitor — woechentlich

[Timer]
OnCalendar=Mon 06:00
Persistent=true

[Install]
WantedBy=timers.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now seo-monitor.timer
systemctl list-timers seo-monitor.timer   # naechster Lauf
sudo systemctl start seo-monitor.service  # sofort testen
journalctl -u seo-monitor.service         # Ausgabe (Run-Summary als JSON)
```

**cron-Alternative** (falls kein systemd gewünscht):
```
0 6 * * 1 cd /opt/kairos && shared/seo-engine/.venv/bin/python shared/seo-monitor/run.py --registry registry/clients.json --out shared/seo-monitor/reports --format both >> /var/log/seo-monitor.log 2>&1
```

## Reports → Dashboard (später)

`run.py` schreibt JSON konform zu [`seo-report.schema.json`](../schemas/seo-report.schema.json) — der stabile
Vertrag, den das (im Umbau befindliche) Dashboard einliest. Bis dahin ist die Markdown-Variante die
menschenlesbare Zwischenlösung. Anbindung ans Dashboard = reine Anzeige-Arbeit, kein Rework am Runner.
