---
name: handwerk-seo-monitor
description: >
  Kontinuierlicher SEO/GEO-Monitor für Handwerk-Sites (Produkt "Version 2"). Prüft eine Live-Site
  gegen den versionierten Soll-Vertrag (standard.json) und meldet Regressionen (Site unter Soll)
  sowie Upgrades (Soll hat sich weiterentwickelt). Nutzen für den wöchentlichen Wartungslauf, nach
  einem Deploy, oder wenn ein Kunde im Register das Modul "seo-continuous" aktiviert hat. Erzeugt
  einen strukturierten Report (JSON fürs Dashboard, Markdown für Menschen). Teil des Meisterwerk-Plugins.
license: MIT
---

# Handwerk SEO/GEO-Monitor

Du hältst ausgelieferte Handwerk-Sites auf dem aktuellen SEO/GEO-Stand. Der **deterministische Kern**
ist `shared/seo-monitor/evaluate.py` — du orchestrierst ihn, interpretierst den Report und triffst die
Urteils-Entscheidungen, die ein Script nicht treffen darf.

**Verwandte Skills:** `handwerk-seo-geo` (einmalige Aufsetzung, "Version 1"), `handwerk-site-builder` (Build).
**Wahrheitsquellen:** `shared/knowledge/seo-geo/standard.json` (Soll) · `shared/knowledge/seo-geo/geo-seo-playbook.md` (Prosa/Belege).

## Zwei Drift-Richtungen (Kernmodell)
- **Regression** — die *Site* fällt unter den Soll (Deploy/CMS zerschießt Schema, `noindex`, Canonical). → **Alert.**
- **Upgrade** — der *Soll* steigt (News-Automation bumpt `standard.json`, z. B. neue Deprecation). → **geplantes Upgrade.**

Der "Soll" ist **nicht statisch**: die separate News-/Trend-Automation schreibt `standard.json` fort.
Beide Systeme teilen diese eine Quelle — du liest sie, du erfindest keine Regeln.

## When to Use
Wöchentlicher Cron-Lauf · nach einem Deploy · Onboarding eines Kunden ins Modul `seo-continuous` · Ad-hoc-Check.

## Voraussetzung
Python-3.12-venv des Motors (einmalig, siehe `shared/seo-engine/README.md`):
```bash
cd shared/seo-engine && /opt/homebrew/bin/python3.12 -m venv .venv && ./.venv/bin/pip install -r requirements.txt
```

## Ablauf (pro Kunde)
1. **Kunde wählen:** aus `registry/clients.json` alle mit `enabledModules` ⊇ `["seo-continuous"]`,
   `status: active`, gesetztem `liveUrl` + `trade`.
2. **Evaluieren:**
   ```bash
   VENV=shared/seo-engine/.venv/bin/python
   $VENV shared/seo-monitor/evaluate.py \
     --live-url "<liveUrl>" --trade "<trade>" --client-id "<clientId>" \
     --baseline-standard-version "<seoBaseline.standardVersion oder weglassen>" \
     --format json      # md für menschliche Zwischenprüfung
   ```
   Liefert einen Report konform zu `shared/schemas/seo-report.schema.json`.
3. **Report ablegen:** JSON fürs (künftige) Dashboard; optional Markdown für den Wartungs-Report an den Kunden.
4. **Registry pflegen:** `lastAudit` = jetzt. Bei erster Baseline `seoBaseline` setzen
   (`source: "built-html"` bevorzugt — Soll aus unserem Build, nicht von der Live-Seite).

## Findings interpretieren (deine Urteils-Ebene)
- **CRITICAL / `gap` oder `regression`** (kein Schema, `noindex`, Canonical weg, falsche Schema-Unterklasse):
  sofort melden. Wenn `updatePolicy` es erlaubt (`scheduled`/`critical-only`) und ein sicherer Weg besteht
  (Staging/Rollback vorhanden), Fix vorbereiten — **nie** unbeaufsichtigt auf Prod ohne Rückweg.
- **`deprecated`** (FAQPage/HowTo/llms.txt): kein Notfall. In den Wartungs-Report; Markup nur entfernen,
  wenn es nicht-vorhandene Inhalte beschreibt (Playbook beachten).
- **`upgrade`** (`standard-advanced`): Standard hat sich bewegt → Site gegen die neuen Regeln re-reviewen,
  Änderungen bündeln, als geplantes Upgrade ausrollen (nicht als Alert behandeln).

## Do Not
- Keine unbeaufsichtigten Prod-Änderungen ohne Staging/Rollback (`stagingAvailable`/`rollbackAvailable` prüfen).
- Keine Regeln erfinden — nur `standard.json` ist maßgeblich. Neue Erkenntnisse gehören in die News-Automation → `standard.json`.
- Baseline bevorzugt aus dem Build (`built-html`), nicht von der evtl. schon degradierten Live-Seite.
- `notEvaluated`-Punkte (robots/sitemap/nap) nicht als "grün" ausgeben — sie sind noch nicht implementiert.

### Learn More
`shared/seo-monitor/evaluate.py` (Kern) · `shared/seo-engine/` (vendored Motor, Provenance in SOURCE.md) ·
`tasks/todo.md` (Gesamtplan, §4a Verzahnung mit der News-Automation).
