# Spur Ads: Werbung, Creatives, Carousels, Video, Poster

Dieselben vier Phasen und Gates wie bei Websites, andere Werkzeuge. Jede Phase schreibt in
`.ultimate-design/STATE.md` (`spur: ads`). Hausregeln gelten vollständig, besonders A (Text) und
B (visuelle Tells). Werbung, die nach KI aussieht, verkauft nicht.

## Phase 1: Brief

Fragen (eine Nachricht, vorausgefüllt):
1. Ziel und Kanal: Meta, Instagram (Feed, Story, Reel, Carousel), Google, LinkedIn, Print, OOH.
   Formate und Maße je Kanal (1:1, 4:5, 9:16, Zeichenlimits) in die Akte.
2. Angebot und die eine Handlung (Klick, Anruf, Anfrage, Kauf). Der Hook in einem Satz.
3. Zielgruppe und Moment (scrollt abends auf dem Sofa, sucht morgens auf der Baustelle).
4. Brand: Logo, Farben, Schriften, Fotos (echt?), Tonalität. Bei KAIROS: Navy #1C3F60, Albert Sans.
5. Was existiert: Produktfotos, Personen, Referenz-Ads, virale Vorbilder (URL oder Screenshot).
6. Was nicht geht: Claims ohne Beleg, Preise ohne Freigabe, Gesichter ohne Rechte.
Inventar wie bei Websites (8 bis 12 Dinge, die nur dieser Kunde hat). Daraus kommt der Hook.
Gate 1: Brief in fünf Punkten, Formate, Anzahl Varianten (Default 3 je Format).

## Phase 2: Entwurf

- **Copy zuerst:** `anthropic-skills:pro-copywriter` liefert drei Hooks plus Headline, Text, CTA je
  Hook. `slop-check.py --strict` darüber. Hooks aus dem Inventar, nicht aus der Kategorie.
- **Konzepte bestätigen** (je zwei Zeilen) vor jeder Generierung. Generierung kostet Credits.
- **Bild:**
  - Marketing-Ads mit Produkt oder Avatar: `higgsfield-generate` (Marketing Studio, GPT Image 2;
    Produkt per URL importieren, Brand anlegen).
  - Produktfotos: `higgsfield-product-photoshoot`.
  - Logos mit Text, Mockups, Style-Transfer, Multi-Referenz: `gemini-imagegen` (Nano Banana Pro).
  - Gesichts-Konsistenz über eine Serie: `higgsfield-soul-id`.
  - Instagram-Carousel aus viralem Vorbild: `anthropic-skills:carousel-higgsfield`
    (3 Farben, 2 Fonts, 1 Layout).
  - Poster, Flyer, Social-Grafiken mit Text-Layout: `superdesign:superdesign` (GRAPHIC.md).
  - Listing-Karten: `higgsfield-marketplace-cards`.
- **Video:** Memory-Regel „Schlüsselbilder zuerst": Kameraperspektive klären, Start- und Endbild
  als Keyframes generieren und vom User abnicken lassen, dann `higgsfield-generate` mit
  Seedance 2.0. Start- und Endbild schneiden; volles Fresko wird als nsfw abgelehnt.
- Immer drei Varianten je Format, als Dateien in `.ultimate-design/ads/<format>/<A|B|C>.<ext>`.
- Gate 2: Vergleichs-Artifact mit den drei Varianten je Format in echter Größe und als
  Feed-Mockup (Phone-Rahmen), Copy daneben. AskUserQuestion: „Welche?"

## Phase 3: Iteration

- Feedback verstehen, bestätigen, in eine konkrete Änderung übersetzen (Bildausschnitt, Farbe,
  Hook, Text-Länge, Logo-Position), umsetzen, erklären.
- Bild-Iteration mit Referenz auf das gewählte Bild (image-to-image), nicht von Null.
- Reframe für weitere Formate: `higgsfield-generate` (`reframe`), nie zuschneiden ohne Blick.
- Optionale Prüfung: Virality Predictor (`brain_activity`) als Zahl in die Akte, kein Ersatz für
  das Auge des Menschen.
- Jede Runde: Vorher/Nachher-Artifact.
- Gate 3: „Richtung steht, jetzt Finish?"

## Phase 4: Finish

- Alle Formate final rendern, Maße und Dateigrößen prüfen (Kanal-Limits), Safe-Zones für
  Story/Reel (oben 250 px, unten 340 px frei).
- Text im Bild lesbar auf dem Phone (Screenshot in Phone-Größe ansehen).
- `slop-check.py --strict` über alle Texte (Primärtext, Headline, Beschreibung, CTA).
- Claims, Preise, Namen gegen die Quelle prüfen.
- Übergabe-Ordner: `ads/<kampagne>/<format>/<variante>.<ext>` plus `copy.md` je Variante und
  eine `README.md` mit Kanal, Format, Zielgruppe, Hook, Datum.
- Abnahme-Artifact: alle finalen Creatives als Feed-Mockup, durchklickbar. Der Mensch nimmt ab.
