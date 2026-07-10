# Template-Spezifikation (FIX — nicht neu erfinden)

> Dies ist das **eine, finale Design**, das Meisterwerk ausliefert. Struktur, Farben und
> Animationen sind **gesetzt**. Pro Kunde wird **nur personalisiert** (Daten + Marke + Bilder),
> niemals das Layout oder die Animationen umgebaut. Wer hier abweicht, bricht das Produkt.

Quelle: `template/` (React 19 + Vite + Tailwind v4 + shadcn/ui + GSAP). Lauffähig via `npm install && npm run dev`.

---

## Tech-Stack (fix)
- React 19, Vite, **Tailwind v4** (config-less, Tokens in `src/index.css` `@theme` + `:root`).
- shadcn/ui (new-york, neutral) mit unified `radix-ui`.
- **GSAP** (`gsap` + `@gsap/react`), inkl. **SplitText** & **ScrollTrigger** (seit GSAP 100% gratis).
- **Multi-Page (5 Seiten)** als SPA mit **SSG-Prerender** via `vite-react-ssg` + `react-router-dom` v6. Jede Route → eigenes statisches HTML (crawlbar ohne JS).
- Alle Inhalte aus **`src/config/site.ts`** (einzige Daten-Datei, deckt alle 5 Seiten ab).
- **Build:** `npm install --legacy-peer-deps && npm run build` → `tsc -b && vite-react-ssg build`. `--legacy-peer-deps` ist Pflicht (vite-react-ssg-Peer ≤ Vite 7, Template läuft auf Vite 8 — funktioniert real).

## Farb-Tokens (fix, in `src/index.css`)
- **Primär = Navy:** `--primary: oklch(0.31 0.085 264)` (heller im Dark-Mode). Färbt Buttons, Icons, Eyebrows, Road-Linie.
- **Gold (Bewertungssterne):** `--gold: oklch(0.80 0.16 84)`.
- **Google-Blau:** `--google-blue` (für Akzente; Logo nutzt echte Google-Markenfarben inline).
- Neutrals leicht navy-getönt (Chroma ~0.004–0.008), **helle, cleane Basis** (Default-Theme = `light`).
- **Pro Kunde anpassbar:** nur `--primary` (Markenfarbe) + ggf. `--ring` in den markierten Zeilen. Gold/Neutrals bleiben.

## Typografie (fix)
- shadcn-Default-Sans, Headings `font-semibold tracking-tight`. Section-Headings nutzen `.split-heading`.

## Seiten & Routing (fix — genau 5 URLs)
Geteiltes Layout (`src/components/site/site-layout.tsx`): **Header → `<Outlet/>` → Footer**. Routing in `src/routes.tsx`. Sektionen liegen in `src/components/site/sections.tsx`, Seiten in `src/pages/` komponieren sie:

| Route | Datei | Sektionen (Reihenfolge fix) |
| --- | --- | --- |
| `/` | `pages/Home.tsx` | Hero + Stats → Leistungen (Teaser 3) → Warum wir → Referenzen → CTA-Band |
| `/leistungen` | `pages/Leistungen.tsx` | Leistungen (voll) → Ablauf (Road-Timeline) → CTA-Band |
| `/projekte` | `pages/Projekte.tsx` | Projekte (Foto-Bento) → Referenzen (Google-Reviews) → CTA-Band |
| `/ueber-uns` | `pages/UeberUns.tsx` | Über-uns-Intro → Stats → Warum wir → CTA-Band |
| `/kontakt` | `pages/Kontakt.tsx` | Kontaktformular → FAQ |

Nav (Header/Footer/CTAs) sind echte `react-router`-Links. **Keine 6. Seite** — neue Gewerk-Landingpage ersetzt eine bestehende.

---

## Animations-Inventar (fix — Klassen sind „Verträge", nicht umbenennen)
Alles in `src/hooks/use-site-animations.ts`, alles reduced-motion-sicher (`gsap.matchMedia`), Initial-Hidden nur per JS.

| Effekt | Marker-Klasse | Verhalten |
| --- | --- | --- |
| Header-Slide-in | `[data-anim='header']` | Einmal beim Laden |
| Hero-Entrance | `.hero-item` / `.hero-visual` / `.hero-card` | Gestaffelt, Bild scale-in, Karte back.out |
| Hero-Parallax | `.hero-visual img` | Scrub |
| Scroll-Reveal | `.reveal` | ScrollTrigger.batch fade-up, stagger |
| **Überschriften-Wipe-up** | `.split-heading` | SplitText mask-lines, Zeilen wischen hoch |
| **Leistungs-Card-Zoom** | `.group` + `group-hover:scale-105` | CSS-Hover-Zoom auf dem Bild |
| Testimonial-Sterne | `.t-stars` / `.t-star` | Gold-Sterne poppen gestaffelt |
| **Ablauf-Road (Striche wandern)** | `.road-dash` | strokeDashoffset, Scrub → Striche von oben nach unten |
| **Ablauf-Road (Linie fließt)** | `.road-fill` (pathLength=1) | strokeDashoffset 1→0, Scrub → Linie zeichnet sich Karte→Karte ein |
| **Projekte-Bento-Parallax** | `.bento-img` | yPercent -6→6, Scrub, nur Desktop |

Die Road-Verbinder kommen aus `RoadConnector` in `src/components/site/parts.tsx` (geschwungener SVG-Pfad, abwechselnd gespiegelt). Bento-Spans (`lg:col-span-*`) sind **fix** — nicht pro Kunde ändern. Die Animationen werden bei jedem Routenwechsel neu initialisiert (`useSiteAnimations(scope, [pathname])` mit `revertOnUpdate`).

---

## Personalisierungs-Map (Scrape → Template)

Nur diese Stellen werden pro Kunde berührt:

### 1. `template/src/config/site.ts` (Inhalt — deckt alle 5 Seiten ab)
| Feld | Quelle aus Scrape |
| --- | --- |
| `business.name`, `legalName` | Firmenname (Logo-Alt, Impressum) |
| `business.phone`/`phoneHref`, `email`, `address` + `addr{street,postalCode,city}` | NAP aus Footer/Impressum/Kontakt (`addr` strukturiert für JSON-LD) |
| `business.region` | Ort/Stadt |
| `business.rating` | echte Google-Bewertung (Wert + Anzahl) — **nur wenn real**, sonst weglassen/neutral |
| `business.foundedNote`, `footerTagline`, `heroBadge` | aus Über-uns/Claims |
| `hero.h1`, `hero.sub`, `hero.image` | bestehende Headline/USP neu zugespitzt; starkes echtes Foto |
| `services[]` | Leistungen (Titel, Kurztext, Bild, passendes lucide-Icon) |
| `reasons[]`, `steps[]`, `stats[]` | Trust/USP, Ablauf, Kennzahlen (real) |
| `projects[]` | echte Projektfotos + Ort als `tag` (Spans NICHT ändern) |
| `testimonials[]`, `faq[]` | echte Kundenstimmen; echte Kundenfragen (`reference/trades/<gewerk>.md`) |
| `about{title,body[],highlights[],image}` | Über-uns-Seite (Story, Stärken, Teamfoto) |
| `sections.*` | Sektions-Überschriften mit Ort personalisieren |
| `geo.areaServed[]` | bediente Orte/Stadtteile (→ JSON-LD `areaServed`) |
| **`seo.siteUrl`** | **echte Domain** (canonical, OG, Sitemap hängen daran) |
| **`seo.pages.{home,leistungen,projekte,ueberUns,kontakt}`** | je **eindeutiger** Title + Description, lokales Keyword vorn |
| `nav[]` | i. d. R. unverändert (5-Seiten-Nav) |

### 1b. Domain in `template/public/robots.txt` + `template/public/sitemap.xml`
Platzhalter-Domain auf `seo.siteUrl` setzen. Sitemap listet alle **5 URLs**.

### 2. `template/src/index.css`
- `--primary` (+ `--ring`) auf die Markenfarbe des Kunden setzen (aus gescraptem CSS / Logo). OKLCH bevorzugt; bei Hex → in OKLCH umrechnen, Lightness im Bereich ~0.28–0.40 halten, damit Kontrast/Look stimmt.

### 3. `template/public/img/`
- Gescrapte/aufbereitete Bilder unter denselben Dateinamen ablegen (`hero.jpg`, `steildach.jpg`, `flachdach.jpg`, `abdichtung.jpg`, `dachfenster.jpg`, `dachrinnen.jpg`) ODER Pfade in `site.ts` anpassen. Logo separat einsetzen (Header/Footer nutzen aktuell ein HardHat-Icon — durch echtes Logo ersetzen, falls vorhanden).

**Verboten bei der Personalisierung:** Seiten/Routen hinzufügen oder entfernen (5 sind fix), Sektionen umsortieren, Animationsklassen ändern, Bento-Spans/Tokens (außer `--primary`) anfassen, erfundene Bewertungen/Zahlen/Mitgliedschaften einsetzen.
