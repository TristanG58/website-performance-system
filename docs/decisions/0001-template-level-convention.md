# 0001 — Template-Level-Konvention

- **Status:** Accepted
- **Datum:** 2026-07-10

## Kontext

Das Repository führt drei Website-Template-Level. Historisch wurden die Plugins in
einer bestimmten Reihenfolge gebaut, und die verwendeten Stacks unterscheiden sich
in ihrer technischen Komplexität nicht in derselben Reihenfolge. Ohne eine
festgelegte Konvention besteht die Gefahr, dass die Level-Zahl fälschlich als
Komplexitäts- oder Qualitätsrang gelesen wird (z. B. „Level 2 = einfacher/schlechter
als Level 1"). Das ist nicht der Fall: Level 1 (React/Vite/TS) ist technisch
aufwändiger als Level 2 (statisches HTML/CSS/JS).

## Entscheidung

Die **Level-Zahl beschreibt die interne Produkt- und Bau-Reihenfolge**, nicht
automatisch technische Komplexität oder Qualität. Verbindlich gilt:

| Level | Plugin | Stack | Bedeutung |
|---|---|---|---|
| Level 1 | `meisterwerk` | React, Vite, TypeScript | zuerst entwickeltes Premium-Template |
| Level 2 | `meisterwerk-miller` | HTML, CSS, JavaScript | config-getriebenes statisches Template |
| Level 3 | noch nicht vorhanden | voraussichtlich Next.js | separates zukünftiges Agentur-/Dienstleister-Template |

In technischen Registern wird die reine Level-Zahl daher **nie allein** als
Aussage über Fähigkeit oder Reifegrad verwendet. Stattdessen führen Register
zusätzlich beschreibende Felder:

- `displayName` — sprechender Name
- `stack` — konkrete Technologien
- `capabilityTier` — Fähigkeitsstufe (z. B. `standard`, `premium`, `advanced`)
- `status` — Reifegrad (`active`, `planned`, …)

## Konsequenzen

- `registry/templates.json` nutzt `id` (`level-1`/`level-2`/`level-3`) plus die
  beschreibenden Felder oben; Konsumenten dürfen sich **nicht** darauf verlassen,
  dass eine höhere Level-Zahl mehr Komplexität/Qualität bedeutet.
- `capabilityTier` und `status` sind die maßgeblichen Felder für Auswahl-/
  Automatisierungslogik, nicht die Level-Zahl.
- Level 3 ist reserviert und als `planned` geführt; es wird separat entwickelt
  und später angebunden.
- Der Produktname „Miller" (Level 2) bleibt vorerst erhalten und kann später
  neutraler benannt werden (siehe `registry/templates.json`, `notes`).

## Alternativen

1. **Nummerierung nach technischer Komplexität** (Static = 1, React = 2, Next = 3).
   Verworfen: widerspricht der etablierten Bau-/Produktreihenfolge und würde
   bestehende Bezeichnungen umbenennen.
2. **Nur beschreibende Namen ohne Level-Zahl.** Verworfen: die Level-Sprache ist
   bereits etabliert und für Kommunikation nützlich; das Missverständnisrisiko
   wird stattdessen durch die Zusatzfelder aufgelöst.
3. **`capabilityTier` als primärer Schlüssel statt Level-`id`.** Teilweise
   übernommen: `capabilityTier` ist maßgeblich für Logik, die Level-`id` bleibt
   aber stabiler, menschenlesbarer Identifier.
