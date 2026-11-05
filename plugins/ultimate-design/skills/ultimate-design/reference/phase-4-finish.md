# Phase 4: Finish

Ziel: produktionsreif, geprüft, dokumentiert, abgenommen. Hier wird nichts mehr neu entworfen.
Reihenfolge einhalten, jede Prüfung liefert ein Artefakt (Zahl, Liste, Screenshot), bevor „fertig".

Voraussetzung: Gate 3 bestanden.

## 1. Review-Backlog einsammeln (nur lesen)

- Agent **slop-reviewer** (Plugin) über die Seite: geordnete Fix-Liste gegen `hausregeln.md`
  (Text A, Blacklist B, Lackmus C, Landing/App D/E).
- Agent **impeccable-finish-reviewer**: Review gegen Direction-Contract, Comp und Welt-Qualitätsbar.
- `impeccable critique <ziel>` mit Score, wenn noch keiner in der Akte steht.
Beide Agenten parallel starten (ein Aufruf, zwei Agent-Tools), beide Listen zu **einem Batch**
zusammenführen, nach Wirkung ordnen, in die Akte. Den Batch in einem Durchgang umsetzen und erst
danach messen (Schritt 4), nicht nach jedem Punkt. P0/P1 müssen in dieser Phase weg. Was bewusst
nicht umgesetzt wird (gehört in die Kundenversion, braucht eine Freigabe, widerspricht der Richtung),
steht mit Grund in der Akte unter „Bewusst nicht umgesetzt", sonst taucht es im nächsten Review wieder auf.

## 2. Polish und Härtung

- `impeccable polish <ziel>` (liest den Critique-Snapshot als Backlog).
- `impeccable harden <ziel>`: Fehler, Leer-Zustände, lange Namen, i18n, Randfälle.
- `impeccable adapt <ziel>`: jede Breite bewusst, nicht „auf Mobile gestapelt".
- `web-design-guidelines <dateien>`: Fokus, Formulare, Kontrast, Touch-Ziele (44 px), Motion-Regeln.
- `transitions-polish`: alle Transitions auf Token.

## 3. Copy-Pass

- Verkaufs-Copy: `anthropic-skills:pro-copywriter` mit dem Argument aus der Akte als Vorgabe.
  Kurz. Beweise statt Adjektive. Kundenseitig „Investment", nie „Kosten".
- UX-Copy (Labels, Fehler, Leer-Zustände): `impeccable clarify`.
- **Pflicht, laut:** `python3 <plugin>/scripts/slop-check.py <projekt> --strict` muss Exit 0 geben.
  Jeden Treffer fixen, nicht wegdiskutieren. Ausnahmen (Zitate, Eigennamen) in der Akte begründen.
- Zahlen, Preise, Namen, Adressen gegen die Quelle prüfen (Memory: „geprüft" heißt nicht belegt).

## 4. Performance und Technik

- `mcp__chrome-devtools__lighthouse_audit` auf Mobile und Desktop. Zahlen in die Akte. Ziel:
  Performance und Accessibility je 90+, sonst `impeccable optimize` und `gsap:gsap-performance`.
- Konsole leer (`list_console_messages`), keine 404 (`list_network_requests`).
- Bilder: Format, Größe, `loading=lazy` außer Hero, Alt-Texte aus dem Inventar.
- Fonts: nur die geladenen Schnitte, `font-display`.
- Meta, OG-Bild, Favicon, Schema (bei Handwerk `meisterwerk-miller:handwerk-seo-geo`).

## 5. Dokumentieren

- Agent **impeccable-documenter** oder `impeccable document`: DESIGN.md aus dem gebauten
  Artefakt, nicht aus Absichten. Bei KAIROS-Projekten nur die Abweichungen vom KAIROS-System
  festhalten, das System selbst bleibt die Referenz.
- Assets, die wiederverwendet werden (Logo-Varianten, Hero-Bild-Freisteller): Agent
  **impeccable-asset-producer**.

## 6. Abnahme-Artifact und Gate 4

- Vergleichs-Artifact „Vorher / Nachher": Baseline aus Phase 1 (`shots/ist/`) oder die gewählte
  Variante aus Phase 2 gegen den Finish-Stand, drei Breiten. Dazu die Lighthouse-Zahlen und das
  slop-check-Ergebnis als Zeile.
- Die visuelle Abnahme macht der Mensch. AskUserQuestion: „Abgenommen?" Optionen: Abgenommen,
  Punkte offen (welche), zurück in die Iteration.
- Bei Abnahme: Akte `phase: abgenommen`, Datum, Link zum Artifact, offene Wünsche als Liste.
  Dann kurz: wo liegt was (Dateien, DESIGN.md, Artifacts), was wäre der nächste Schritt (Deploy
  über das Projekt, nicht über dieses Plugin).

Was in dieser Phase **nicht** passiert: neue Richtungen, neue Sektionen, neue Effekte. Kommt so
ein Wunsch, zurück nach Phase 3 (oder 2) und das in der Akte vermerken.
