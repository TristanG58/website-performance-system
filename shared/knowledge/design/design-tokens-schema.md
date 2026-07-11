# Design-Tokens-Schema (DESIGN.md pro Kunde)

> Format destilliert aus VoltAgent's *awesome-design-md* (MIT) + OKLCH-Empfehlungen aus *impeccable*.
> Meisterwerk erzeugt pro Kunde **eine `DESIGN.md`** im Projekt-Root. Sie ist die Quelle der Wahrheit
> für alle Tokens und wird als CSS-Custom-Properties in den Build übersetzt.

---

## Vorlage: `DESIGN.md`

```yaml
---
version: 1.0
name: "<Betrieb> — Design-Analyse"
trade: "<gewerk>"           # z.B. dachdecker
region: "<Stadt/Region>"
description: >
  Ein bis zwei Sätze zur Design-Sprache. Welches Gefühl? Welches Register?
  (Handwerk = Brand-Register: vertrauenswürdig, solide, lokal, handwerklich.)

colors:
  # Markenfarben (max. 2–3 echte) + getönte Neutrals
  primary:   "#1b3a5b"      # dominante Markenfarbe
  secondary: "#c0532b"      # Akzent / CTA
  ink:       "#15202b"      # Text (nicht reines Schwarz)
  canvas:    "#fbfaf8"      # Body-BG (leicht zur Brand getönt, NICHT creme-default)
  surface:   "#ffffff"      # Cards/erhöhte Flächen
  muted:     "#5b6b78"      # sekundärer Text
  border:    "#e4e2dd"      # Trennlinien
  success:   "#2f7a4d"
  warning:   "#b8791f"
  danger:    "#b3402f"

typography:
  display:
    fontFamily: "<Heading-Schrift>"      # Serif oder markante Grotesk
    fallback: "Georgia, serif"
    weights: [400, 600, 700]
  body:
    fontFamily: "<Body-Schrift>"         # gut lesbare Grotesk
    fallback: "system-ui, sans-serif"
    weights: [400, 500, 600]
  scale:
    # fluid clamp(min, vw, max)
    display-xl: "clamp(2.75rem, 5vw, 4.5rem)"
    display-l:  "clamp(2.25rem, 4vw, 3.25rem)"
    h2:         "clamp(1.75rem, 2.5vw, 2.25rem)"
    h3:         "1.5rem"
    body:       "1.0625rem"     # ~17px
    small:      "0.9375rem"
  measure: "65ch"               # max. Lauftext-Zeilenlänge
  tracking-display: "-0.02em"   # nie enger als -0.04em

spacing:
  base: "8px"                   # 8px-Raster
  section-y: "clamp(4rem, 8vw, 7rem)"
  container: "1200px"
  gutter: "clamp(1rem, 4vw, 2rem)"

radius:
  sm: "6px"
  md: "10px"
  lg: "16px"
  pill: "999px"

elevation:
  card: "0 1px 2px rgba(21,32,43,.06), 0 4px 16px rgba(21,32,43,.06)"
  hover: "0 4px 8px rgba(21,32,43,.08), 0 12px 28px rgba(21,32,43,.10)"

motion:
  ease: "cubic-bezier(0.22, 1, 0.36, 1)"
  reveal-duration: "0.6s"
  reveal-distance: "20px"
  stagger: "0.08s"
---

## Begründung der Farbwahl
(Warum diese Palette zum Gewerk + Betrieb passt. Bezug zu Markenfarben des Kunden,
falls vorhanden — aus Firecrawl-Scrape der bestehenden Site.)

## Schrift-Substitute
(Falls eine proprietäre Wunschschrift nicht frei verfügbar ist: Open-Source-Fallback
über Google Fonts / Fontsource benennen. z.B. "Wunsch: Founders Grotesk → frei: Inter / Hanken Grotesk".)
```

---

## OKLCH-Tönung der Neutrals (gegen den toten Grau-/Creme-Look)

Neutrals nie als reines Grau. Stattdessen leicht zur Primärfarbe tönen:

```
--canvas:  oklch(98.5% 0.008 <brand-hue>);   /* fast weiß, minimal getönt */
--surface: oklch(100% 0 0);                   /* reines Weiß für Kontrast */
--ink:     oklch(22%  0.02  <brand-hue>);     /* dunkel, nicht #000 */
--muted:   oklch(52%  0.02  <brand-hue>);
--border:  oklch(92%  0.01  <brand-hue>);
```

Chroma der Neutrals: **0.005–0.015**. Mehr wirkt schmutzig, weniger wirkt steril.

---

## Farbstrategie-Achse (bewusst wählen, dokumentieren in DESIGN.md)

1. **Restrained** — 1 Markenfarbe + Neutrals. Seriös, ruhig. (Default für die meisten Handwerker.)
2. **Committed** — 1 dominante Marke + 1 kräftiger Akzent (CTA). Empfohlen für Lead-Gen.
3. **Full palette** — Marke + Akzent + Sekundär. Nur bei vielen Leistungsbereichen.
4. **Drenched** — flächiges Color-Drenching einer Sektion. Sparsam als Stilmittel.

---

## Übersetzung in CSS

Die DESIGN.md-Tokens werden 1:1 zu `:root`-Custom-Properties im finalen Build:

```css
:root {
  --color-primary: #1b3a5b;
  --color-secondary: #c0532b;
  --color-ink: #15202b;
  --color-canvas: #fbfaf8;
  /* ... */
  --space-section: clamp(4rem, 8vw, 7rem);
  --container: 1200px;
  --radius-md: 10px;
  --ease: cubic-bezier(0.22, 1, 0.36, 1);
}
```

Bei Tailwind: dieselben Werte in `tailwind.config` unter `theme.extend` spiegeln,
damit Utility-Klassen und Custom-Properties konsistent sind.
