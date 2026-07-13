# Handover: News-/Trend-Automation ↔ SEO/GEO-Monitor

> Selbst-enthaltendes Übergabedokument. Wer die News-/Trend-Automation baut, braucht **nur** dieses
> Dokument + `standard.json` + das JSON-Schema, um sauber anzudocken. Kein Zugriff auf den Chatverlauf nötig.

## Worum es geht

Es gibt zwei Systeme, die sich **eine** Datei teilen:

- **News-/Trend-Automation** (dein Bau) — zieht in Intervallen verifizierte SEO/GEO-News aus qualitativen
  Quellen, validiert und gewichtet sie, und **schreibt wichtige Änderungen** in `standard.json`.
- **SEO/GEO-Monitor** (`shared/seo-monitor/`) — läuft wöchentlich (Hetzner-Cron), **liest** `standard.json`
  und prüft jede Kundenseite dagegen.

Die geteilte Datei ist die **einzige Schnittstelle**. Beide Systeme koppeln nur über sie — ihr könnt
unabhängig bauen. Der Monitor erfindet keine Regeln; alles Maßgebliche steht in `standard.json`.

| Datei | Rolle |
|---|---|
| `shared/knowledge/seo-geo/standard.json` | **Der Vertrag.** Maschinenlesbarer Soll-Zustand. Hier schreibt die Automation. |
| `shared/schemas/seo-standard.schema.json` | JSON-Schema — jede geschriebene Version MUSS dagegen validieren. |
| `shared/knowledge/seo-geo/geo-seo-playbook.md` | Prosa-Begleitung mit Belegen/Quellen (menschenlesbar). |

## Das Kernmodell: zwei Drift-Richtungen

- **Regression** — die *Site* fällt unter den Soll (Deploy/CMS zerschießt Schema, `noindex`, Canonical).
  → Erkennt der Monitor selbst (Live-vs-Baseline). **Nicht deine Aufgabe.**
- **Upgrade** — der *Soll steigt*, weil sich das Feld ändert (neue Deprecation, neue Best-Practice).
  → **Genau das schreibt deine Automation** in `standard.json`. Der Monitor erkennt dann automatisch
  „Soll > Site" und erzeugt ein `upgrade`-Finding.

Der Soll ist also **nicht statisch**. Deine Automation hält ihn aktuell.

## Wie der Monitor `standard.json` konsumiert

`shared/seo-monitor/evaluate.py` erzeugt drei Finding-Typen aus deinem Vertrag:

| Finding-Typ | Woraus | Beispiel |
|---|---|---|
| `gap` | `global.require[]` nicht erfüllt | Kein LocalBusiness-Schema (CRITICAL) |
| `deprecated` | Site nutzt einen `global.deprecated[]`-Eintrag | Seite hat noch FAQPage-Markup (INFO) |
| `upgrade` | `standardVersion` > der bei der Site gespeicherten `seoBaseline.standardVersion` | „Standard 1.0.0 → 1.1.0, re-reviewen" |

**Wichtig für die Upgrade-Mechanik:** Jede Kundenseite hat im Register (`registry/clients.json`) ein Feld
`seoBaseline.standardVersion` — die Version, gegen die sie zuletzt gebaut/geprüft wurde. Sobald du
`standardVersion` in `standard.json` bumpst, liegt jede Site „hinter" dem Soll → der Monitor meldet Upgrade.
**Deshalb ist der Versions-Bump dein wichtigster Hebel.**

## Dein Schreib-Vertrag (was die Automation an `standard.json` tun darf)

1. **`standardVersion` bumpen (SemVer) bei JEDER inhaltlichen Änderung.** Ohne Bump merkt der Monitor
   keinen Upgrade-Bedarf. Faustregel:
   - **PATCH** (1.0.0→1.0.1): Formulierung/Quelle präzisiert, keine Prüf-Änderung.
   - **MINOR** (1.0.x→1.1.0): neue `deprecated`-Regel oder neue akzeptierte Schema-Unterklasse.
   - **MAJOR** (1.x→2.0.0): eine bestehende `require`-Regel verschärft/entfernt (kann bestehende Sites „brechen").
2. **`updatedAt`** auf das Änderungsdatum setzen (ISO-Datum, `YYYY-MM-DD`).
3. **Neue Deprecation** = Objekt in `global.deprecated[]` anhängen. Pflichtfelder: `id` (kebab-case),
   `target`, `action`, `severity` (`CRITICAL|WARNING|INFO`). Empfohlen: `since`, `rationale`, `source` (Beleg-URL).
   Nur mit **verifizierter** Quelle schreiben — der `source`-Link ist der Nachweis.
4. **Schema-Unterklasse ändern** = `trades.<gewerk>.schemaTypes.accepted[]` bzw. `.recommended` anpassen.
5. **Neues Gewerk** = Eintrag unter `trades.*` UND (Voraussetzung) `shared/knowledge/trades/<gewerk>.md`.
6. **Immer gegen das Schema validieren, bevor geschrieben wird** (siehe unten). Ungültiges JSON würde
   den Monitor-Lauf stören.

**Was du NICHT tust:** Kundendaten, Secrets oder API-Keys in `standard.json` schreiben (rein Standard-Wissen).
Keine unbelegten „AI-Hacks" (der Playbook-Grundsatz: GEO = starkes SEO + E-E-A-T + echter Mehrwert).

## Struktur von `standard.json` (Kurzreferenz)

```jsonc
{
  "standardVersion": "1.0.0",           // ← dein wichtigster Hebel (SemVer)
  "updatedAt": "2026-07-13",
  "source": { "playbook": "…", "note": "…" },
  "global": {
    "require": [                        // Pflicht-Elemente → gap-Findings
      { "id": "…", "check": "…", "severity": "CRITICAL",
        "driftRule": "…|null", "params": {…}, "rationale": "…" }
    ],
    "deprecated": [                     // Überholtes → deprecated-/upgrade-Findings
      { "id": "…", "target": "FAQPage", "since": "2026-05-07",
        "action": "kein-ranking-signal-mehr", "severity": "INFO",
        "rationale": "…", "source": "https://…" }
    ]
  },
  "trades": {                           // je Gewerk erwartete Schema-Unterklasse
    "dachdecker": { "schemaTypes": {
      "base": "LocalBusiness", "accepted": ["RoofingContractor"],
      "recommended": "RoofingContractor", "dedicated": true } }
    // … elektriker, shk, maler, kfz, fliesenleger, galabau, tischler
  }
}
```

Die `check`-Namen in `require[]` sind symbolische Haken, die der Monitor implementiert
(`title_nonempty`, `canonical_present`, `schema_subclass_present`, …). **Neue `check`-Typen erfinden ist
NICHT rein datengetrieben** — sie brauchen zusätzlich Code im Monitor. Bleib für den Automatik-Betrieb bei den
vorhandenen Checks; wenn ein neuer Check nötig wird, ist das eine Monitor-Änderung (koordinieren).

## Validierung (Pflicht vor jedem Schreiben)

```bash
python - <<'PY'
import json, jsonschema
std = json.load(open("shared/knowledge/seo-geo/standard.json"))
sch = json.load(open("shared/schemas/seo-standard.schema.json"))
jsonschema.validate(std, sch)                 # wirft bei Vertragsbruch
print("standard.json ist schema-valide, Version", std["standardVersion"])
PY
```

## Übergabe-Checkliste für die Automation

- [ ] News aus **verifizierter, qualitativer** Quelle validiert + gewichtet.
- [ ] Relevante Änderung als `deprecated`-Eintrag ODER `trades.*`-Schema-Anpassung formuliert.
- [ ] `standardVersion` nach SemVer gebumpt, `updatedAt` gesetzt.
- [ ] Gegen `seo-standard.schema.json` validiert (grün).
- [ ] `geo-seo-playbook.md` (Prosa/Beleg) parallel gepflegt — optional, aber empfohlen für Nachvollziehbarkeit.
- [ ] Änderung committet → nächster wöchentlicher Monitor-Lauf zieht sie automatisch (kein manueller Eingriff).

## Verweise

- Monitor & Deployment: `shared/seo-monitor/README.md`
- Vendored Motor (Provenance/Sicherheit): `shared/seo-engine/SOURCE.md`
- Gesamtplan & Verzahnung (§4a): `tasks/todo.md`
