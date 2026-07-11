# Asset-Quellen (kuratiert für Handwerk)

> Destilliert aus Brad Traversy's *design-resources-for-developers* (MIT) + Handwerk-Ergänzungen.
> Nur Quellen, die für deutsche Handwerk-Lead-Sites tatsächlich relevant sind.

---

## Fonts (frei, kommerziell nutzbar)

| Quelle | Nutzen |
|--------|--------|
| Google Fonts (fonts.google.com) | Standard. Self-hosting via fontsource.org für Performance + DSGVO. |
| Fontsource (fontsource.org) | Google-Fonts self-hosted als npm/CDN — DSGVO-konform (kein Google-CDN-Call). |
| **DSGVO-Hinweis** | Google Fonts NIEMALS per `<link>` von fonts.googleapis.com laden (Abmahnrisiko in DE). Immer self-hosten. |

**Gute Handwerk-Pairings (Display / Body):**
- Solide & modern: *Hanken Grotesk* / *Inter*
- Handwerklich-warm: *Fraunces* (Serif) / *Hanken Grotesk*
- Technisch-präzise: *Space Grotesk* / *Inter*
- Bodenständig: *Bricolage Grotesque* / *Source Sans 3*

## Stockfotos (royaltyfrei) — Notlösung, echte Bilder schlagen alles

| Quelle | Hinweis |
|--------|---------|
| Unsplash (unsplash.com) | Größte Auswahl. Vorsicht: viele „Handwerk"-Treffer sind generisch. |
| Pexels (pexels.com) | Solide, inkl. Videos. |
| **Wichtig** | Echte Projektfotos des Kunden IMMER bevorzugen. Stockfotos nur als Platzhalter mit klarer Markierung `<!-- ECHTES KUNDENFOTO ERSETZEN -->`. Keine Klischee-Motive (Handschlag, Helm+Tablet). |

## Icons

| Quelle | Nutzen |
|--------|--------|
| Lucide (lucide.dev) | Sauber, konsistent, MIT. Default-Empfehlung. |
| Tabler Icons (tabler.io/icons) | 4000+, MIT. |
| Phosphor (phosphoricons.com) | Mehrere Gewichte. |

Keine bunten 3D-Blob-Icons. Strichicons in einer Strichstärke, in Markenfarbe oder Ink.

## Bild-Optimierung & Performance

| Tool | Nutzen |
|------|--------|
| Squoosh (squoosh.app) | Einzelbilder zu WebP/AVIF. |
| TinyPNG (tinypng.com) | Batch-Komprimierung. |
| `sharp` (npm) | Programmatisch im Build (WebP/AVIF, responsive srcset). |

Regel: alle Hero-/Above-the-fold-Bilder als WebP/AVIF, `loading="lazy"` unterhalb des Folds,
explizite `width`/`height` gegen Layout-Shift.

## Design-Inspiration (für Research, nicht zum Kopieren)

| Quelle | Nutzen |
|--------|--------|
| Awwwards (awwwards.com) | Award-Sites, hohe Messlatte. |
| Siteinspire (siteinspire.com) | Clean, editorial. |
| Land-book (land-book.com) | Landingpages. |
| Mobbin (mobbin.com) | Reale UI-Patterns (Mobile + Web). |
| One Page Love (onepagelove.com) | Einseiter — gut für kleine Handwerker. |
| Godly (godly.website) | Kuratiert, modern. |

## Karten & lokale Einbettung

| Tool | Hinweis |
|------|---------|
| OpenStreetMap + Leaflet | DSGVO-freundlicher als Google Maps Embed (kein Consent-Banner nötig). |
| Google Maps Embed | Nur mit Consent-Management (Cookie-Banner) einbinden. |

## Rechtliches (Pflicht für DE-Handwerk-Sites)

- **Impressum** (§5 DDG) — Pflicht. Inhaber, Anschrift, Kontakt, USt-IdNr/Handwerksrolle.
- **Datenschutzerklärung** (DSGVO) — Pflicht, inkl. Hosting, Fonts, Formulare, Maps.
- **Cookie-Consent** — nur falls nicht-essenzielle Cookies/Embeds (Maps, Analytics, Fonts-CDN).
- Kontaktformular: nur notwendige Felder, Double-Opt-in nicht nötig bei reiner Anfrage, aber Datenschutz-Checkbox + Hinweis.
