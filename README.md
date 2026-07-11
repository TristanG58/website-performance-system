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

## Aktueller Entwicklungsstatus

Frühe Aufbauphase. Vorhanden: beide Plugins (sanitisiert importiert), diese
Dokumentations- und Registerbasis. **Geplant** (noch nicht vorhanden): `shared/`,
`templates/`, Automatisierungen, Migrationen, gefüllte Kundenregister, Tests.
Übersicht: [`docs/architecture/system-overview.md`](docs/architecture/system-overview.md).

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
