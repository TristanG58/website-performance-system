# Systemübersicht

Status: lebendes Dokument · Stand: 2026-07-10

## Was dieses Repository ist

Das zentrale Repository `website-performance-system` ist eine **Website-Factory
und Wartungsplattform**. Es produziert und pflegt mehrere Kunden-Websites, ist
aber **keine** klassische Multi-Tenant-Anwendung: Es gibt keine gemeinsam
laufende Anwendung, die alle Kunden-Sites ausliefert.

## Was es nicht ist

Kunden-Websites **bleiben eigenständige Projekte bzw. eigene Repositories** und
werden unabhängig deployt. Kundenspezifische Inhalte, Assets, Domains und Secrets
liegen ausschließlich dort — nie in diesem Repository.

## Bestandteile (zentral)

Das zentrale Repository enthält zukünftig:

| Bestandteil | Zweck | Status |
|---|---|---|
| **Plugins** | Claude-Code-Plugins, die Sites erzeugen/pflegen | **vorhanden** (`plugins/`) |
| **Skills & Agents** | Bau-, Design-, SEO/GEO-Logik | **vorhanden** (in den Plugins) |
| **Register** | Template- & Kundenregister | **teilweise** (`registry/templates.json`, Client-Schema) |
| **Templates** | flach ausgelagerte Starter je Level | _planned_ |
| **Shared Modules** | gemeinsame technische Module (SEO, Consent, Analytics, Performance, CMS) | _planned_ |
| **Qualitätsstandards** | Anti-Slop, a11y, Performance-Budgets, Review-Checklisten | _planned_ |
| **Automatisierungen** | n8n-Workflows, GitHub-Automation | _planned_ |
| **Migrationen** | versionierte Template-/Config-Transforms | _planned_ |
| **Tests / Audit** | Build-Smoke, Schema-Validierung, SEO-/Consent-Audit | _planned_ |

## Ist-Zustand (2026-07-10)

```text
website-performance-system/
├── plugins/
│   ├── meisterwerk/          # Level 1 — React + Vite + TypeScript (vorhanden)
│   └── meisterwerk-miller/   # Level 2 — HTML/CSS/JS, config-getrieben (vorhanden)
├── docs/
│   ├── architecture/system-overview.md
│   └── decisions/0001-template-level-convention.md
├── registry/
│   ├── templates.json
│   └── clients.schema.json
└── README.md
```

- Beide Plugins wurden **sanitisiert** importiert (nur fiktive Demo-Daten).
- Es existieren noch **keine** `shared/`- oder `templates/`-Ordner, keine
  Automatisierungen, Migrationen, gefüllten Kundenregister oder Tests.

## Zielarchitektur (geplant)

```text
website-performance-system/
├── plugins/                 # vorhanden
├── templates/               # planned — level-1 / level-2 / level-3 (Slots/Sichten)
├── shared/                  # planned — seo / consent / analytics / performance / cms / design-tokens
├── standards/               # planned — Qualitätslatte & Review-Checklisten
├── automation/              # planned — n8n/ + github/
├── migrations/              # planned — versionierte Transforms
├── tests/                   # planned — Audit-Harness
├── registry/                # vorhanden — templates.json, clients.schema.json (+ später clients.json)
└── docs/                    # vorhanden
```

Die Trennung Plugin ↔ genestetes Template bleibt vorerst bestehen; eine spätere
Auslagerung in flache `templates/` + `shared/` erfolgt als eigene, kontrollierte
Migration (nicht Teil dieser Phase).

## Klare Prozess-Trennung

Automatisierungen und Migrationen respektieren strikt getrennte Phasen — jede mit
eigenem Artefakt und Freigabe-Gate:

| Phase | Inhalt | Ausgabe |
|---|---|---|
| **Research** | bestehende Kundenseite/Anforderungen erfassen | Extrakt/Research-Notizen |
| **Bewertung** | Ist-Analyse, Scope, Risiken, Entscheidung | Bewertungsbericht |
| **Codeänderung** | Template/Config personalisieren oder migrieren | Diff / Branch |
| **Tests** | Build-Smoke, Schema-, Link-, SEO-/Consent-Audit | Testbericht |
| **Freigabe** | menschliche Bestätigung vor Wirkung nach außen | Approval |
| **Deployment** | Auslieferung im **Kunden**-Repo/-Hosting | Deploy-Log |

Grundsatz: **Research und Bewertung ändern nichts.** Codeänderungen sind eng
abgegrenzt und reversibel. Nach außen wirkende Schritte (Deployment) erfolgen erst
nach expliziter Freigabe und ausschließlich im jeweiligen Kunden-Kontext.

## Konventionen (Owner, Marke, Capability Tiers)

- **GitHub-Owner ≠ Produktmarke.** Technischer Owner ist `TristanG58`
  (Repository: <https://github.com/TristanG58/website-performance-system>);
  Produktmarke/Marketplace-Owner bleibt `Kairos Digital`. Repository-Links zeigen
  stets auf die reale Repo-URL.
- **Capability Tiers sind kontrollierte Werte:** `standard`, `premium`, `advanced`.
  Sie sind **unabhängig** von der Template-Level-Zahl — die Level-Zahl beschreibt
  Bau-/Produktreihenfolge, **nicht** Qualität oder Komplexität
  (siehe `docs/decisions/0001-template-level-convention.md`).
- **Kundenregister-Form:** die zukünftige `clients.json` verwendet die Root-Struktur
  `{ "schemaVersion", "clients": [] }` (validiert durch `registry/clients.schema.json`;
  in dieser Phase noch nicht angelegt).

## Kopplung ohne gemeinsame Laufzeit

Templates sind versioniert; jede Kunden-Site notiert im Register, welches
Template in welcher Version sie nutzt. Updates propagieren später via Migration +
Plugin-Re-Run gegen die Kunden-`config` und münden in einem Pull Request in das
Kunden-Repository — **kein** Live-Shared-Runtime.
