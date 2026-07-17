# Kurz-Briefing: SEO/GEO-News-Automation

> 60-Sekunden-Orientierung für die Session, die die News-/Trend-Automation baut.
> Vollständige Regeln + Struktur: **`AUTOMATION-HANDOVER.md`** (im selben Ordner).

## Die Lage
Es gibt bereits einen **SEO/GEO-Monitor**, der **wöchentlich auf einem Hetzner-Server** läuft und jede
KAIROS-Kundenseite prüft. Er liest **eine einzige Datei als "Wahrheit":**
`shared/knowledge/seo-geo/standard.json` (versionierter, maschinenlesbarer Standard).

## Dein Job (die andere Hälfte)
Verifizierte SEO/GEO-News aus **guten, belegbaren Quellen** ziehen, gewichten, und **wichtige Änderungen
in `standard.json` schreiben.** Konkret:
- **Neue Deprecation** (etwas ist überholt) → Objekt an `global.deprecated[]` anhängen (mit `source`-Beleg-URL).
- **Schema-Regel je Gewerk** geändert → `trades.<gewerk>.schemaTypes` anpassen.
- **Bei JEDER inhaltlichen Änderung `standardVersion` (SemVer) bumpen** — das ist der Auslöser, an dem der
  Monitor erkennt, dass Sites hinter dem Standard liegen und ein Upgrade brauchen. Ohne Bump passiert nichts.
- **Vor dem Schreiben** gegen `shared/schemas/seo-standard.schema.json` validieren (sonst stört es den Monitor-Lauf).

## Was du NICHT tust
- Keine Websites prüfen — das macht der Monitor.
- Keine Kundendaten/Secrets/API-Keys in `standard.json` — nur allgemeines Standard-Wissen.
- Keine unbelegten "AI-Hacks" — jede Deprecation braucht eine echte Quelle.
- Keine neuen `check`-Typen erfinden — die brauchen zusätzlich Monitor-Code (koordinieren). Deprecations
  und Schema-Typ-Änderungen dagegen greifen sofort, rein datengetrieben.

## Das mentale Modell
Zwei Systeme, **eine geteilte Datei** (`standard.json`):
- **Monitor** = liest. Findet: Site kaputt/fehlt (Regression/Gap).
- **Du** = schreibst. Hebst den Standard → Monitor meldet automatisch "Upgrade nötig" für hängende Sites.

→ Jetzt `AUTOMATION-HANDOVER.md` lesen für die genauen Feld-/Versions-/Validierungsregeln.
