# website-performance-system

Zentrale **Website-Factory und Wartungsplattform** für die Erstellung,
Weiterentwicklung und Wartung mehrerer Kunden-Websites.

## Zweck

Dieses Repository bündelt das wiederverwendbare *„Wie"* — Templates, Plugins,
Skills/Agents, Qualitätsstandards, Automatisierungen, Migrationen und Register.
Es ist **keine** Multi-Tenant-Laufzeit: Kunden-Websites werden **nicht** aus einer
gemeinsam laufenden Anwendung ausgeliefert.

## Abgrenzung zu Kundenprojekten

Jede Kunden-Website bleibt ein **eigenständiges Projekt bzw. eigenes Repository**.
Dieses zentrale Repository enthält niemals das kundenspezifische *„Was"*:

| Zentral (hier) | Pro Kunde (getrennt) |
|---|---|
| Templates & Starter | die generierte Site selbst |
| Plugins, Skills, Agents | `config`/Kundendaten (NAP) |
| gemeinsame Module | `research/`, `assets/` (Fotos, Logo) |
| Qualitätsstandards & Audits | Deploy-Config, Domain, Secrets |
| Automatisierungen & Migrationen | eigene Git-History |
| Kunden- & Versionsregister | inhaltliche Kunden-Edits |

## Vorhandene Plugins

```text
plugins/
├── meisterwerk/          # Level 1 — React + Vite + TypeScript (Premium)
└── meisterwerk-miller/   # Level 2 — HTML/CSS/JS, config-getrieben (Static)
```

Registriert über `plugins/.claude-plugin/marketplace.json`
(Marketplace `kairos-plugins`). Zur Level-Konvention siehe
[`docs/decisions/0001-template-level-convention.md`](docs/decisions/0001-template-level-convention.md).

## Owner & Marke

GitHub-Owner und Produktmarke sind **getrennte Konzepte**:

- **Technischer GitHub-Owner:** `TristanG58` — das Repository liegt unter
  <https://github.com/TristanG58/website-performance-system>. Repository-Links
  (z. B. `homepage` in den Plugin-Manifesten) zeigen auf diese reale URL.
- **Organisation / Produktmarke:** `Kairos Digital` — bleibt als Marketplace-Owner
  bzw. Markenname bestehen (`plugins/.claude-plugin/marketplace.json`).

## Register

- `registry/templates.json` — Template-Register, validiert durch
  `registry/templates.schema.json`.
- `registry/clients.schema.json` — Schema für das *zukünftige* Kundenregister; die
  spätere `clients.json` verwendet die Root-Struktur `{ "schemaVersion", "clients": [] }`
  (in dieser Phase noch nicht angelegt).
- **Capability Tiers** sind kontrollierte Werte — `standard`, `premium`, `advanced`
  — und **unabhängig** von der Template-Level-Zahl.

## Aktueller Entwicklungsstatus

Frühe Aufbauphase. Vorhanden: beide Plugins (sanitisiert importiert), diese
Dokumentations- und Registerbasis. **Geplant** (noch nicht vorhanden): `shared/`,
`templates/`, Automatisierungen, Migrationen, gefüllte Kundenregister, Tests.
Übersicht: [`docs/architecture/system-overview.md`](docs/architecture/system-overview.md).

## Consent-Architektur

Status: **contract defined**, Implementierung noch **planned**. Der stack-neutrale
Consent-Vertrag ist in [`docs/architecture/consent.md`](docs/architecture/consent.md)
festgeschrieben und über zwei Schemas validiert:
[`shared/schemas/consent-state.schema.json`](shared/schemas/consent-state.schema.json)
und [`shared/schemas/service-registry.schema.json`](shared/schemas/service-registry.schema.json).

## Sicherheitsprinzipien

- **Keine echten Kundendaten** in diesem Repository — Templates enthalten
  ausschließlich fiktive Demo-Platzhalter (`Musterwerk Bedachungen GmbH`,
  `Musterstadt`, `info@example.de`).
- Keine Secrets, API-Keys, Tokens, privaten Schlüssel oder Zugangsdaten.
- Keine externen Kunden-Medien (z. B. gehostete Logos/Team-Fotos); nur lokale
  Demo-Platzhalter.
- Register speichern höchstens Repository-URLs/-Identifier, keine
  personenbezogenen Daten.

## Änderungen an Kunden-Websites

Erfolgen **nicht** direkt aus diesem Repository, sondern später über
**kontrollierte Migrationen** (versioniertes Template-/Config-Schema → Migration →
Pull Request in das jeweilige Kunden-Repository). Kunden-Websites bleiben dabei
eigenständig und unabhängig deploybar.
