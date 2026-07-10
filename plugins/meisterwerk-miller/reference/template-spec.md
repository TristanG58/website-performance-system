# Meisterwerk v2 (Miller-Edition) — Template-Spezifikation

Das Template ist eine **fixe, hochwertige plain-HTML/CSS/JS-Multi-Page-Site** auf Basis der
Miller-Struktur. Design & Animationen sind fertig und **unantastbar** — du füllst nur
Daten (aus `config/site.js`) und tauschst Bilder/Logo/Farbe. Kein React, kein Vite, kein Build-Zwang:
die Seiten sind statisch (SEO-freundlich, sofort crawlbar).

## Stack (bewusst simpel — wie eine schlanke OnePage-Seite)
- **plain HTML** (5 statische Seiten) + **ein** geteiltes `styles.css` + **ein** geteiltes `main.js`.
- **GSAP 3.12.5 + ScrollTrigger** via CDN (Scroll-Reveals, Count-up, 3D-Team-Karussell).
- Kein Framework, keine Dependencies. Hosting: jeder Static-Host (Vercel, Netlify, python http.server).

## Seitenstruktur (genau 5 URLs — Verzeichnis-basiert, saubere URLs)
`/` (Home) · `/leistungen` · `/ueber-uns` · `/karriere` · `/kontakt`
- Jede Unterseite ist `<slug>/index.html` → `/<slug>` funktioniert auf localhost (301→trailing slash) UND Vercel.
- Asset-Pfade absolut: `/styles.css`, `/main.js` (auf allen Seiten identisch).
- Header + Footer sind pro Seite dupliziert (aktive Nav-Klasse gesetzt) — bewusst, kein Include-Flash.

## Sektionen der Home (Reihenfolge fix)
1. **Header** (floating white bar, sticky)
2. **Hero** (Full-Bleed-Foto, zentrierter weißer Text, Marken-Marquee unten)
3. **Team-Intro** (Text + 2×2-Bildraster)
4. **Quiz-Funnel** (5 Schritte, shadcn-Optik, über dunklem Haus-BG) — Lead-Gen-Kernstück
5. **Leistungen** (6 Cards)
6. **Vorteile** ("Darum …", Rating + 3 Gründe + horizontale Galerie)
7. **Team** (3D-Karussell, Bio erscheint bei Hover; Wheel dreht Karten)
8. **FAQ** (Minimal-Divider, single-open)
9. **Kontakt** (Info-Kacheln + Google-Map + shadcn-Formular)
10. **Footer** (Sticky-Reveal via clipPath + Blur-In-Grid)

Unterseiten nutzen dieselben Bausteine: `page-hero` (kurzer Banner) + Sektionen aus `styles.css`
(`.lst`/`.lst-row`, `.cardgrid`/`.vcard`, `.split`, `.statband`, `.jobs`, `.cta-band`).

## Personalisierungs-Map (NUR diese Stellen)
| # | Datei | Was |
|---|---|---|
| 1 | **`config/site.js`** | Die EINZIGE Daten-Datei. Deckt alle 5 Seiten ab: `business` (NAP), `theme` (Farben/Fonts), `hero`, `brands`, `aboutIntro`, `quiz`, `services`, `vorteile`, `team`, `faq`, `about`, `karriere`, `geo.areaServed`, `seo.siteUrl` + `seo.pages.*`. **Fehlende echte Inhalte nicht erfinden** — aus `reference/trades/dachdecker.md` faktentreu ergänzen, Lücken markieren. |
| 2 | **`styles.css` `:root`** | Farb-Tokens `--dark`/`--key1`/`--key2`/`--light` auf die Markenfarbe. Navy-Charakter wahren (Dark ~ #1C3F60-Helligkeit). Sonst nichts. |
| 3 | **Bilder / Logo** | Platzhalter-URLs bzw. `public/img/*` durch aufbereitete Kundenbilder ersetzen (Logo, Hero, Team, Projekte). WebP bevorzugen (siehe `reference/resources.md`). |
| 4 | **Domain** | `public/robots.txt` + `public/sitemap.xml` (5 URLs) auf `seo.siteUrl` setzen. |

**Tabu:** Sektions-Reihenfolge, Layout, Animationen, die Signatur-Komponenten (3D-Gallery,
Sticky-Footer, Quiz-Mechanik, Marquee) oder Tokens außer den Markenfarben anfassen. Keine 6. Seite.

## Build / Personalisierung (config → Seiten)
`build.mjs` (Node, ohne Dependencies) injiziert `config/site.js` in die Templates:
- **Theme** → schreibt `theme.dark/light/key1/key2` in `styles.css :root`.
- **Domain** → aktualisiert `robots.txt` und generiert `sitemap.xml` aus `nav` + `seo.siteUrl`.
- **Content** (NAP, Hero, Listen wie services/team/faq) wird gemäß dieser Map aus `config/site.js`
  in die HTML-Partials übernommen (der Builder-Skill führt Schritt für Schritt).

Aufruf: `node build.mjs` → danach `python3 -m http.server 4322` (oder Vercel-Deploy).

## Signatur-Mechaniken (NICHT ändern — Details in `handwerk-design-system`)
- **Sticky-Reveal-Footer:** `clip-path`-Polygon + `fixed`+`sticky` (auf Mobile deaktiviert).
- **3D-Team-Karussell:** `perspective` + `rotateY(i*ang) translateZ(radius)`; Wheel-über-Section
  dreht Karten & blockt Seiten-Scroll, gibt richtungsabhängig nach 1 Runde frei (kein Drag!).
- **Scroll-Reveals:** `html.anim-on` (Inline-Head-Script, respektiert reduced-motion) + `ScrollTrigger.batch`.
- **Stat-Count-up:** parst „80+"/„4,9 / 5"/„100%" (deutsches Komma-safe).
