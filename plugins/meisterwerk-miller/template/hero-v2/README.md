# Hero v2 — Scroll-Scrub-Hero (Kairos-Prinzip)

Opt-in-Alternative zum Standard-Hero (v1, Full-Bleed-Foto). **Nur verwenden, wenn der
Nutzer ausdrücklich „v2“, „v2 hero“, „Kairos-Hero“ oder „Scroll-Hero“ verlangt.**
Sagt er nichts oder „v1“ → Standard-Hero, dieser Ordner bleibt unangetastet.

## Effekt
360vh-Scrollstrecke, 100vh gepinnt: Motiv zoomt heran (scale 1→2.5) und dreht leicht (4°),
versinkt im Nebel am unteren Rand; Copy blendet früh aus; danach steht die **bild-gefüllte
Wortmarke** (background-clip: text) lange allein und blendet erst ganz am Ende aus.
Danach übernimmt die normale Seite.

## Integration (nur Startseite `index.html`)

1. **Motiv wählen**: bestes hochauflösendes Kundenfoto aus dem Scrape (16:9, markantes
   Einzelmotiv — Gebäude/Dach/Turm wirken am besten) → als WebP nach `public/hero-v2.webp`.
   Im `<head>`: `<link rel="preload" as="image" href="/public/hero-v2.webp" fetchpriority="high">`.
2. **CSS/JS einbinden** (nur `index.html`):
   `<link rel="stylesheet" href="/hero-v2/hero-v2.css">` im `<head>` nach `styles.css`,
   `<script src="/hero-v2/hero-v2.js" defer></script>` vor `</body>`.
   (Ordner `hero-v2/` liegt nach dem Template-Klon bereits in `site/`.)
3. **Markup**: kompletten `<section class="hero">…</section>`-Block durch das Snippet aus
   `hero-v2.html` ersetzen; Platzhalter `{{…}}` mit den Werten aus `config/site.js` füllen
   (`hero.*` wie bei v1, plus `heroV2.*`). Das `.hero-marq`-Markup (Marken-Marquee) aus v1
   **unverändert** in die `.hv2-marq-band` unter dem Hero verschieben.
4. **Config**: in `config/site.js` `heroVariant: "v2"` setzen und `heroV2` füllen
   (`image`, `wordmark` = Betriebsname kurz, optional `focusY`, `accent`).
5. **Wichtig**:
   - `--hv2-haze` muss dem Seitenhintergrund entsprechen (Template: `#fff`) — sonst
     sichtbarer Schnitt am Hero-Ende.
   - Wortmarke kurz halten (≤ ~8 Zeichen ideal; bei längeren Namen `font-size`-clamp senken
     oder nur den Kernnamen verwenden, z.B. „MUSTERWERK“ statt „Musterwerk Bedachungen“).
   - Timings/Choreografie **nicht ändern** (fix, austariert).

## QC-Zusatz (zur Standard-Checkliste)
- Scrub im Browser: Copy weicht zuerst, Motiv versinkt im Nebel (0.55–0.74), Wortmarke
  steht allein, blendet am Ende aus, Übergang in die Marquee-Band nahtlos (keine Farbkante).
- Deep-Link mitten auf der Seite: kein „Hochanimieren“ beim Laden.
- `prefers-reduced-motion`: Hero statisch bei 100vh, Copy sichtbar, keine Wortmarke.
- Mobil: Wortmarke bricht nicht um, CTAs erreichbar.
