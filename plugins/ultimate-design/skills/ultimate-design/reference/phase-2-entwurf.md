# Phase 2: Entwurf

Ziel: eine Richtung, die dem Kunden gehört, und zwei bis drei gebaute Varianten, aus denen der
Mensch im Vergleichs-Artifact wählt. Nie eine einzelne Variante vorlegen. Nie die Variante bauen,
die man ohnehin gebaut hätte.

Voraussetzung: Gate 1 bestanden, Akte hat Brief, Inventar, Argument.

## A. Richtungen ziehen (tasteskill)

```bash
node ~/.claude/skills/design-taste-frontend/scripts/draw.mjs --sector <sektor> \
  --brief "<ein Satz zum Subjekt>" --sections <rollen aus dem Argument> \
  [--tone <ton>] [--have photography,product-photo,product-ui] [--keep palette,type] --options 3
```
- `--list sectors` und `--list roles` zeigen die Werte. Der Hero ist implizit.
- `--have` nur für Bilder, die wirklich existieren (Akte, Punkt 7).
- `--keep palette,type` wenn Brand oder KAIROS-System die Farben und Schriften festlegen.
- App-Screens: `--app --kind <kind>` und `references/app-screens.md` des tasteskill lesen.

Die drei Richtungen gegen das Inventar halten: welche Komposition kann etwas tragen, das nur
dieser Kunde hat? Die wählen, nicht die vertraute. Grund in einer Zeile in die Akte. Dann das
volle Blatt ziehen (`--direction <id>`) und **adoptieren**: nicht mit dem Layout mischen, das
man sonst gemacht hätte. Redraw nur mit nennbarem Grund (Brand-Konflikt, fehlendes Asset,
Sektion trägt den Inhalt nicht), jeder Redraw in die Akte.

Gibt es den tasteskill nicht: dasselbe von Hand mit dem Zwei-Pass-Plan aus
`frontend-design:frontend-design` (Token-System, Typo, ASCII-Layout, Prinzipien, dann Review
gegen den generischen Default und sagen, was geändert wurde).

## B. Der Idee-Satz (Pflicht, vor jedem Code)

> Auf dieser Seite wird **[etwas, das dem Subjekt gehört]** zu **[dem Mittel, das die Richtung verlangt]**.

Erste Lücke aus dem Inventar, nie aus der Kategorie. Konkurrenz-Test (Hausregel C8). Dazu die
**eine lebende Sache**: was der Besucher tun kann, aus dem Stoff des Kunden, mit Daumen bedienbar,
mit Fallback ohne Script. Beides in die Akte unter „Richtung".

Für den Hero `frontend-design` befragen: das Charakteristischste der Welt des Subjekts zuerst,
in der passenden Form (Headline, Bild, Animation, Live-Demo). Die „große Zahl mit kleinem Label
plus Verlaufs-Akzent" ist der Default und fällt weg, außer sie ist wirklich das Beste.

## C. Varianten bauen (Default 3)

Jede Variante ist eine **andere Antwort auf denselben Brief**, nicht dieselbe Seite in drei
Farben. Unterschied liegt in Komposition und Idee, bei fixem Brand in Komposition allein.
Vor dem Bau die drei Konzepte je in zwei Zeilen dem User zeigen und bestätigen lassen
(design-shotgun Schritt 3a). Maximal zwei Runden Konzept-Feedback, dann bauen.

Drei Wege, je nach Lage:

1. **Direkt bauen (Default bei HTML/CSS und wenn der tasteskill läuft):** jede Variante als
   eigene Datei `.ultimate-design/varianten/<A|B|C>/index.html` mit dem Hero und den zwei
   stärksten Sektionen des Arguments, nicht die ganze Seite. Vor dem Bau einmal
   `impeccable context` und `reference/craft-floor.md` von impeccable lesen (Qualitätsboden,
   Verbote). Unabhängige Varianten dürfen parallel in Subagents laufen, wenn der User das will.
2. **superdesign-Canvas:** `superdesign:superdesign` mit dem Brief, Varianten über verschiedene
   Modelle side-by-side, Design-System setzen. Gut, wenn ein Codebase existiert (init) oder
   mehrere Modell-Handschriften verglichen werden sollen.
3. **design-shotgun:** nur wenn `~/.Codex/skills/gstack/bin` existiert. Bringt Vergleichsboard
   mit Feedback-Erfassung und Taste-Memory von Haus aus.

Bei React/Next vorher `pick-ui-library` für die Komponenten-Fragen und `vercel:shadcn` für
Theming. Bei KAIROS-/Handwerk-Projekten die Sektions-Bausteine aus
`meisterwerk-miller:handwerk-design-system` als Vokabular, Tokens unverändert.

Bilder: nur echte (Akte) oder aus offenen Sammlungen (`tasteskill assets.mjs`, mit Credit) oder
generiert, wenn ein Bildwerkzeug zugesagt war (Spur Ads, Abschnitt Bild). Nie graue Platzhalter.

## D. Selbstprüfung je Variante (vor dem Artifact)

- Lackmus-Fragen aus `hausregeln.md` C, alle sieben plus Konkurrenz-Test.
- `python3 <plugin>/scripts/slop-check.py .ultimate-design/varianten/<X>/` muss Exit 0 geben.
- `node <tasteskill>/scripts/inspect.mjs --url http://localhost:<port>/<X>/` (oder impeccable
  `detect --json`): Befunde fixen, bevor der User etwas sieht.
- Screenshots bei 1440, 820, 390 ansehen. Was auf dem Phone bricht, ist nicht fertig.

## E. Gate 2: Vergleichs-Artifact

Nach `vergleichs-artifact.md`: ein Artifact, Tabs A/B/C, drei Breiten je Kandidat, je zwei
Zeilen Idee und Unterschied. Im Chat eine Zeile Empfehlung mit Grund. AskUserQuestion: „Welche
Richtung?" mit den Buchstaben und einer Option „Mischen: … von A, … von B" (das ist ein neuer
Kandidat D, kein Kompromiss im Kopf).

Nach der Wahl: Akte unter „Entscheidungen" (Datum, Vergleich, Wahl, Grund) und „Richtung"
aktualisieren, `phase: 3-iteration`. Nicht gewählte Varianten bleiben liegen (Taste-Memory für
spätere Projekte).
