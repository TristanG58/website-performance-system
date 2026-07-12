# Consent-Architektur

Status: **contract defined** · Implementierung: **planned** · Stand: 2026-07-12

Dieser Vertrag legt fest, wie Consent in **allen** Template-Stufen (Level 1, 2, 3)
identisch modelliert wird. Er ist **stack-neutral**: kein Framework-Code, keine
Loader, keine UI. Die konkrete Umsetzung erfolgt später pro Level getrennt.

Maßgebliche Schemas:

- [`shared/schemas/consent-state.schema.json`](../../shared/schemas/consent-state.schema.json)
- [`shared/schemas/service-registry.schema.json`](../../shared/schemas/service-registry.schema.json)

## Zweck

- Ein gemeinsamer Consent-Vertrag für Level 1, Level 2 und Level 3.
- **Selbst gehostete, config-getriebene** Umsetzung — keine externe CMP-Bibliothek,
  kein Consent-Script von einem fremden CDN.
- **Kein automatisches Laden** optionaler Dienste. Optionale Dienste bleiben bis zur
  passenden Einwilligung vollständig blockiert (Default Deny).

## Kategorien

| Kategorie | Standard | Bedeutung |
|---|---|---|
| `necessary` | **immer aktiv, nicht abwählbar** | funktional erforderliche first-party Speicherungen, z. B. Theme-Präferenz |
| `analytics` | deaktiviert | Reichweitenmessung |
| `marketing` | deaktiviert | Werbe-, Remarketing- und Profiling-Dienste |
| `externalMedia` | deaktiviert | Karten, Videos, Social Embeds und vergleichbare Drittinhalte |

`necessary` darf im Consent-State ausschließlich `true` sein; alle anderen
Kategorien sind Boolean und standardmäßig `false`.

## Consent-Lebenszyklus

1. Gespeicherten Consent lesen (Storage-Key siehe unten).
2. Version prüfen — weicht sie von der aktuellen Konfig ab, gilt die Entscheidung als veraltet.
3. Ablaufdatum (`expiresAt`) prüfen.
4. Bei fehlendem, veraltetem oder ungültigem Consent das Banner anzeigen.
5. Optionale Dienste bis zur Zustimmung blockieren (Default Deny).
6. Entscheidung speichern (serialisierter Consent-State gemäß Schema).
7. `consentchange`-Event auslösen (Event-Name verbindlich `wps:consentchange`, siehe unten).
8. Zugestimmte Services laden — nur solche, deren Kategorie aktiv ist.
9. Widerruf ermöglichen (erneutes Öffnen der Einstellungen).
10. Bei Bedarf Reload verlangen (`requiresReloadOnRevoke`), um bereits geladene Ressourcen zu entfernen.

## Storage

```text
Storage-Key:        wps_consent
Standard-Gültigkeit: 182 Tage
```

Die konkrete Gültigkeit ist später pro Template bzw. Kunde konfigurierbar. Der
gespeicherte Wert entspricht dem `consent-state`-Schema.

## Versionsänderung

Ändert sich die Consent-Version:

- Die bisher gespeicherte Entscheidung gilt als veraltet.
- Das Banner wird erneut angezeigt.
- Die neue Entscheidung wird mit Methode `reconsent` gespeichert.

## Service Registry

- Die Metadaten aller consent-relevanten Dienste werden gemeinsam über
  [`service-registry.schema.json`](../../shared/schemas/service-registry.schema.json) beschrieben.
- Die Registry enthält **ausschließlich serialisierbare Metadaten** — keine
  Funktionen wie `load()`/`unload()`. **Loader bleiben stack-spezifisch** und sind
  strikt von der Registry getrennt.
- Unbekannte oder `enabled:false`-Dienste dürfen **nicht** geladen werden.
- Ein Dienst darf nur geladen werden, wenn seine `category` aktiv zugestimmt ist.
- `necessary`-Dienste benötigen keine vorherige Zustimmung.
- `origins` beschreiben Herkünfte (z. B. `https://www.youtube.com`), **keine**
  vollständigen Script-URLs, und dienen später als Grundlage für CSP und Audits.
- **Eindeutige Service-IDs** werden als Laufzeit- und CI-Regel geprüft, da JSON
  Schema Draft 2020-12 die Eindeutigkeit eines Objektfeldes innerhalb eines Arrays
  nicht zuverlässig erzwingt.

## Zielarchitektur Level 1 (React + Vite + TypeScript)

Nur Zielpfade — noch nicht implementiert:

```text
plugins/meisterwerk/template/src/consent/
├── types.ts
├── consent-config.ts
├── consent-storage.ts
├── consent-context.tsx
├── use-consent.ts
├── service-registry.ts
├── script-loader.ts
├── components/
│   ├── ConsentBanner.tsx
│   ├── ConsentSettingsModal.tsx
│   └── ConsentGate.tsx
└── index.ts
```

## Zielarchitektur Level 2 (HTML/CSS/JS, config-getrieben)

Nur Zielpfade — noch nicht implementiert:

```text
plugins/meisterwerk-miller/template/consent/
├── consent.js
└── consent.css
```

Zusätzlich:

- Consent-Konfiguration in `config/site.js`.
- Integration aller Seiten über `build.mjs`.
- Optionale Ressourcen über DOM-Injektion oder `data-src`.
- Keine optionalen Drittanbieter-Requests vor Zustimmung.

## Zielarchitektur Level 3 (nur konzeptionell)

- Client Consent Provider.
- Konditionale Script-Komponenten.
- Optionales serverlesbares Consent-Cookie.
- CSP-Integration.
- Headless-CMS-Embeds ausschließlich über ein Consent Gate.
- Google Consent Mode nur bei tatsächlich verwendeten Google-Diensten.

## Events

```text
Event-Name: wps:consentchange
```

Das Event-Detail entspricht dem Consent-State. Dieser namespaced Name wird
**verbindlich** statt des allgemeineren `consentchange` verwendet, um Kollisionen
mit fremden Scripts zu vermeiden.

## Sicherheitsprinzipien

- **Default Deny** für optionale Dienste.
- Keine dynamische Codeausführung aus Registry-Daten.
- Keine Script-URLs ungeprüft aus CMS-Content ausführen.
- Nur bekannte Service-IDs und Loader.
- Registry und Loader strikt trennen.
- Keine Secrets in Consent-Konfigurationen.
- Externe Inhalte gelten als nicht vertrauenswürdig.
- Kein Consent-Script von einem externen CDN laden.

## Rechtliche Grenze

- Diese technische Architektur ist **keine Rechtsberatung**.
- Finale Kategorien und Texte benötigen **juristische Prüfung**.
- Das System garantiert **keine** Rechtskonformität.
- Dienste dürfen technisch erst nach passender Einwilligung laden.
- Datenschutzerklärung, Impressum und Anbieterinformationen sind **separate**
  Verantwortungsbereiche.
```
