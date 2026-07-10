# Anti-Slop — Absolute Bans für Handwerk-Sites

> Destilliert aus Paul Bakaus' *impeccable* (Apache 2.0), angepasst auf den Handwerk-Kontext.
> Diese Liste ist verbindlich. Wenn ein Build gegen einen Punkt verstößt, ist er nicht fertig.

Das Ziel: Die Site sieht aus wie von einer Agentur gebaut, die das Gewerk versteht — **nicht** wie eine KI-Vorlage. Die meisten „AI-Slop"-Tells sind subtil. Hier sind sie.

---

## Der „AI-Slop-Test"

Bevor eine Seite als fertig gilt, gegen diese Frage prüfen: *„Würde ein Mensch mit Geschmack erkennen, dass das eine KI gebaut hat?"* Wenn ja → überarbeiten. Die häufigsten Verräter stehen unten.

---

## Farbe & Hintergrund

- **KEIN** creme/sand/beige Body-Hintergrund als Default. Das ist der saturierte KI-Reflex für „traditionell/handwerklich" und schreit nach Vorlage. Token-Namen wie `--paper`, `--linen`, `--parchment` sind ein Warnsignal. Handwerk darf erdig sein — aber dann *bewusst* und mit echtem Markenbezug, nicht als Fallback.
- **KEINE** lila/violett-Gradients (der absolute KI-Default). Auch keine blau-zu-lila Hero-Verläufe.
- **KEIN** Gradient-Text („text-fill gradient" auf Headlines). Einmal 2021 cool, heute KI-Marker.
- **KEINE** reinen `#000000`-Schwarz- oder `#ffffff`-Weiß-Flächen für große Bereiche. Neutrale leicht zur Markenfarbe tönen (OKLCH: +0.005–0.015 Chroma Richtung Brand-Hue).
- Maximal **2–3** echte Markenfarben + getönte Neutrals. Kein Regenbogen.

## Layout & Struktur

- **KEINE** identischen 3er-Card-Grids als Standardlösung für jede Sektion. Variiere Rhythmus: mal asymmetrisch, mal Liste, mal großes Bild + Text.
- **KEINE** Sektions-Nummerierung im Stil `01 / 02 / 03` als Deko.
- **KEINE** dünnen Akzent-Seitenstreifen („left border stripe") an Cards als Hauptstilmittel.
- **KEINE** überall gleichen, gleichmäßig gepolsterten Boxen. Echte Hierarchie braucht Kontrast in Größe und Gewicht.
- **KEIN** zentrierter Fließtext über mehr als 2 Zeilen. Lauftext linksbündig.
- Sektionen brauchen **visuellen Rhythmus** (hell/dunkel-Wechsel, unterschiedliche Dichte), nicht 8× dieselbe weiße Sektion mit Überschrift + 3 Cards.

## Typografie

- **KEINE** winzigen, weit gesperrten Uppercase-„Eyebrows" (`letter-spacing: 0.2em; font-size: 11px; text-transform: uppercase`) über jeder Überschrift. Der größte KI-Tell überhaupt.
- Body-Zeilenlänge **65–75 Zeichen** (`max-width: ~65ch`). Nicht volle Breite.
- Letter-Spacing-Boden: nicht enger als `-0.04em` bei großen Headlines.
- Display-Schrift clampt sinnvoll, Maximum ≤ ~6rem — keine absurd großen Hero-Wörter.
- `text-wrap: balance` für Headlines, `text-wrap: pretty` für Fließtext.
- Maximal **2** Schriftfamilien (eine Display/Heading, eine Body). Kontrast-Achse nutzen (z.B. Serif-Display + Grotesk-Body), nicht zwei ähnliche Groteske mischen.

## Motion

- **KEIN** Auto-Play-Karussell/Slider als Hero. Veraltet, schlecht für Conversion & a11y.
- **KEINE** Animation um ihrer selbst willen. Jede Bewegung hat einen Grund (Aufmerksamkeit lenken, Hierarchie zeigen, Feedback geben).
- **Immer** `prefers-reduced-motion` respektieren (Animationen reduzieren/abschalten).
- Scroll-Reveals dezent: kurze Dauer (~0.4–0.8s), kleine Distanz (12–24px), gestaffelt — kein „Alles fliegt von überall rein".
- **KEINE** parallax-überladenen Seiten, die auf Mobile ruckeln.

## Komponenten & Detail

- **KEIN** Glassmorphism (blur + transparente Cards) als Default-Stil.
- **KEINE** generischen Stock-Icons aus dem ersten Treffer (besonders nicht bunte 3D-Blob-Illustrationen).
- **KEINE** Lorem-Ipsum-Reste oder „[Platzhalter]" im finalen Build.
- **KEINE** erfundenen Bewertungen, Auszeichnungen, Mitgliedschaften oder Zahlen. Trust-Signale müssen echt sein (siehe E-E-A-T im GEO-Playbook).
- Buttons brauchen echten States (hover, focus, active) und ausreichende Touch-Targets (≥44×44px).
- Echte Fotos > Illustrationen. Bei Handwerk: echte Projektbilder, echtes Team, echte Baustellen schlagen jedes Stockfoto.

## Handwerk-spezifische Slop-Tells (besonders wichtig)

- **KEINE** generischen „Hände-die-sich-schütteln"- oder „Mann-mit-Helm-und-Tablet"-Stockfotos. Das ist Handwerk-Slop.
- **KEINE** austauschbaren Claims wie „Qualität & Zuverlässigkeit seit Jahren". Konkret werden: „Meisterbetrieb seit 1998, Innung Dachdecker [Stadt]".
- **KEIN** fehlender lokaler Bezug. Eine Handwerk-Site ohne Ort/Region im Above-the-Fold ist falsch.
- **KEINE** versteckten Kontaktdaten. Telefonnummer gehört sichtbar in den Header — Handwerk-Kunden rufen an.

---

## Positiv-Heuristik (statt der Bans)

Eine gute Handwerk-Site fühlt sich an wie: **vertrauenswürdig, lokal verankert, handwerklich solide, schnell erreichbar.** Großzügiger Weißraum, echte Fotos, klare Hierarchie, ein dominanter CTA pro Seite (anrufen / Angebot anfragen), sichtbare Trust-Anker (Meister, Innung, Bewertungen, Referenzen), und genau so viel Bewegung, dass es lebendig wirkt — keine Sekunde mehr.
