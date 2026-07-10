# Meisterwerk v2 — Miller-Edition

Dachdecker-Website-Werk auf Basis der **Miller-Struktur**. Gleiche Arbeitsweise wie
Meisterwerk v1 (scrape → personalisieren → bauen → prüfen), aber mit dem Miller-Design und den
Miller-Animationen — als **plain HTML/CSS/JS** (kein Framework), config-getrieben und 1:1 replizierbar.

## Was es tut
Nimmt die bestehende Seite eines Dachdeckers, extrahiert Logo/Farben/NAP/Team/Leistungen/Bewertungen
und setzt sie in das fixe, hochwertige Miller-Template ein — Design & Animationen unverändert.

## Design & Features (fix)
- **Tokens:** Navy `#1C3F60` + Steel-Blue `#6A93B0`, Albert Sans, dezenter Radius.
- **Home (10 Sektionen):** Full-Bleed-Hero + Marken-Marquee · Team-Intro · 5-Schritt-Quiz-Funnel ·
  6 Leistungs-Cards · Vorteile+Rating · **3D-Team-Karussell** · Minimal-FAQ · Kontakt+Map · **Sticky-Reveal-Footer**.
- **Unterseiten:** `/leistungen` `/ueber-uns` `/karriere` `/kontakt`.
- **Animationen (GSAP):** Scroll-Reveals (flackerfrei via `anim-on`), Bild-Hover-Zoom, 3D-Wheel-Karussell,
  Stat-Count-up — alle reduced-motion-safe.

## Struktur
```
meisterwerk-miller/2.0.0/
├─ .claude-plugin/plugin.json
├─ agents/dachdecker-site-agent.md
├─ skills/  handwerk-site-builder · handwerk-design-system · handwerk-seo-geo
├─ reference/  template-spec.md · design-tokens-schema.md · geo-seo-playbook.md · anti-slop.md · resources.md · trades/*
└─ template/            ← das fixe Miller-Template (Klon-Basis)
   ├─ index.html + leistungen/ ueber-uns/ karriere/ kontakt/ (je index.html)
   ├─ styles.css · main.js       (geteilt, absolute Pfade)
   ├─ config/site.js             ← EINZIGE Daten-Datei (Personalisierung)
   ├─ build.mjs                  ← node build.mjs → Theme + robots/sitemap
   └─ public/  robots.txt · sitemap.xml
```

## Verwendung
1. Skill `handwerk-site-builder` starten (oder Agent `dachdecker-site-agent`) und Kunden-URL geben.
2. `template/` nach `site/` klonen, `config/site.js` mit den echten Daten füllen (Personalisierungs-Map
   in `reference/template-spec.md`), Markenfarbe in `theme` setzen, Bilder/Logo ersetzen.
3. `node build.mjs` (schreibt Theme in `styles.css`, generiert robots/sitemap).
4. Vorschau: `python3 -m http.server 4322` im `site/`-Ordner. Browser-QC (Pflicht).
5. Deploy (mit Freigabe): Vercel mit `cleanUrls: true`.

## Unterschied zu v1
| | v1 (0.3.0) | v2 (Miller, 2.0.0) |
|---|---|---|
| Stack | React + Vite + shadcn + vite-react-ssg | plain HTML/CSS/JS + GSAP-CDN |
| Daten-Datei | `src/config/site.ts` | `config/site.js` |
| Build | `npm run build` (SSG-Prerender) | `node build.mjs` (statisch, kein npm) |
| Design | Navy + Gold, Road-Timeline, Bento | Miller: Navy+Steel, 3D-Team-Karussell, Sticky-Reveal-Footer, Quiz-Funnel |
| Seiten | `/` `/leistungen` `/projekte` `/ueber-uns` `/kontakt` | `/` `/leistungen` `/ueber-uns` `/karriere` `/kontakt` |
