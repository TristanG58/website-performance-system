# Phase 3: Iteration (Look-and-Fix-Loop)

Ziel: aus der gewählten Variante die ganze Seite, in Runden, mit Feedback des Menschen und mit
eigenem Hinsehen. Hier entscheidet sich „haut mich um" oder nicht. Jede Runde endet mit einem
Vorher/Nachher-Artifact, wenn sie eine Entscheidung enthält, sonst mit Screenshots.

Voraussetzung: Gate 2 bestanden, Akte nennt die gewählte Variante und den Idee-Satz.

## A. Ausbauen

1. Direction-Blatt neu lesen (`draw.mjs --show`), Idee-Satz und Argument aus der Akte vor jeder
   Sektion. impeccable `craft-floor.md` direkt vor dem ersten Edit.
2. Jede Sektion des Arguments bauen, mit vollem Inhalt (keine Lorem-Zeilen, keine grauen Kästen).
   Software zeigt ihr eigenes Interface in HTML (tasteskill `app.css`), nie Screenshot-Fakes.
3. Die lebende Sache bauen (nicht als Motion nachrüsten).
4. Scroll-Szenen vom Blatt mit Inhalt aus dem Inventar füllen, sonst streichen (eine Szene mit
   beliebigen Bildern ist ein Bildschirmschoner).

## B. Die Runde (wiederholen, bis nichts Wesentliches mehr kommt)

1. **Schauen.** Screenshots bei 1440, 820, 390, volle Seite: `inspect.mjs` (liefert Befunde mit),
   sonst playwright oder chrome-devtools. Alle drei ansehen, bevor irgendetwas geändert wird.
2. **Bewerten** mit der Juror-Rubrik: Idee erkennbar im ersten Viewport? Ein Anker? Typo trägt?
   Hierarchie bei Überschriften-Scan? Phone ohne Bruch? Slop-Blacklist (B) sauber? Lackmus (C)?
   Befunde als Liste in die Akte („Iterationsrunden").
3. **Fixen** in einem Batch, nicht nach jeder Kleinigkeit neu schießen.
4. **Nochmal schauen.** Erst dann dem User zeigen.

Abbruch-Kriterium: zwei Runden ohne materiellen Befund, oder das Budget, das vor Phase 2 genannt
wurde. Dann Gate 3.

## C. Feedback des Menschen einarbeiten (design-studio, Phase 4)

1. **Verstehen und bestätigen:** „Verstanden: du willst X ändern, weil Y." Bei Unklarheit zwei
   Alternativen zeigen, nicht raten.
2. **Übersetzen in ein Verb** (impeccable), dann den Skill mit genau diesem Verb und Ziel aufrufen:

   | Der User sagt | Verb |
   |---|---|
   | „zu brav", „langweilig", „haut mich nicht um" | `impeccable bolder` (Ambition zuerst, dann `delight`) |
   | „zu laut", „zu viel", „unruhig" | `impeccable quieter`, dann `distill` |
   | „eng", „kein Rhythmus", „die Abstände" | `impeccable layout` |
   | „Schrift wirkt billig", „Hierarchie unklar" | `impeccable typeset` |
   | „grau", „flach", „ohne Farbe" | `impeccable colorize` |
   | „generisch", „wie alle" | zurück zum Idee-Satz, Konkurrenz-Test, dann `delight` oder neue Richtung (`draw.mjs --redraw`) |
   | „die Texte" | `impeccable clarify` (UX-Copy) oder `anthropic-skills:pro-copywriter` (Verkaufs-Copy) |
   | „auf dem Handy kaputt" | `impeccable adapt` |
   | „zeig mir Alternativen für den Hero/den Button" | `impeccable generate 3 <element>` oder `live`, Ergebnis als Vergleichs-Artifact |
   | „so wie auf dieser Seite" (Referenz) | „Was genau davon?" fragen, dann nur das übernehmen und sagen, was und warum |

3. **Erklären:** „Ich habe X geändert durch Y, weil Z." Der User lernt mit.
4. **Zeigen:** Vorher/Nachher als Vergleichs-Artifact (zwei Tabs), wenn es eine Geschmacksfrage
   ist; sonst Screenshot.

Hausregel F5: Verfeinerung bewahrt, Redesign ersetzt. Bittet der User um „ein bisschen anders",
bleibt die Identität. Bittet er um „ganz anders", zurück nach Phase 2 mit Redraw.

## D. Motion (erst wenn das Layout steht)

- Ein orchestrierter Moment für die Seite (Load oder ein Reveal), der die Idee trägt. Nicht jede
  Sektion fadet, nicht jede Karte hovert (frontend-design).
- UI-Zustände (Modal, Dropdown, Tabs, Toast, Text-Swap, Skeleton): `transitions-dev`.
- Scroll-gebunden (Pin, Scrub, Parallax, Count-up, Szenen): `gsap:gsap-scrolltrigger`, Timelines
  `gsap:gsap-timeline`, bei React `gsap:gsap-react`. KAIROS-Signatur-Animationen aus
  `meisterwerk-miller:handwerk-design-system` übernehmen, nicht nachbauen.
- Timing auf die Token-Skala: `transitions-polish` (Dauer, Distanz, Easing, Stagger,
  Open/Close-Asymmetrie).
- `prefers-reduced-motion` über `gsap.matchMedia` oder Media Query, immer.
- Frisch erfundene Effekte dem User als Screencast oder drei Keyframes zeigen, bevor weitergebaut wird.
- Nach Motion: `gsap:gsap-performance` und einmal `impeccable optimize`, wenn der Trace ruckelt.

## E. Gate 3

Aktuellen Stand bei drei Breiten als Artifact, Liste der Runden aus der Akte, offene Punkte.
AskUserQuestion: „Richtung steht. Jetzt Finish (Polish, Audit, Copy, Performance, Abnahme)?"
Optionen: Finish starten, noch eine Runde (mit welchem Fokus), zurück zur Richtung.
Bei Ja: `phase: 4-finish`.
