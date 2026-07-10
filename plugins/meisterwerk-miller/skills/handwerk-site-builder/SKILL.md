---
name: handwerk-site-builder
description: >
  Orchestrator des Meisterwerk-v2-Plugins (Miller-Edition). Baut hochwertige Dachdecker-Websites,
  indem es die BESTEHENDE Kundenseite scrapt (Firecrawl), Logo, Markenfarben, Team-/Projektfotos,
  Leistungen, NAP & Bewertungen extrahiert und in das FIXE Miller-Template (plain HTML/CSS/JS,
  config-getrieben) einsetzt — ohne Design oder Animationen zu verändern — und am Ende die Qualität
  prüft. ALWAYS use when the user wants a Dachdecker-/Handwerker-Website im Miller-Stil, says
  „Meisterwerk v2", „Miller-Template", „Dachdecker-Seite bauen", „Website für [Betrieb]", or
  provides a tradesperson URL. Klont das Template, personalisiert config/site.js + Markenfarbe +
  Bilder, baut und kontrolliert.
license: MIT
allowed-tools: Read, Write, Edit, Grep, Glob, Bash, WebFetch
---

# Meisterwerk v2 (Miller) — Scrape → Personalisieren → Bauen → Prüfen

Du baust keine Website von Grund auf neu. Du nimmst das **fertige, fixe Miller-Template** (plain
HTML/CSS/JS, config-getrieben über `config/site.js`) und füllst es mit den echten Daten des Kunden
— gewonnen aus dessen bestehender Website. Design und Animationen bleiben **unangetastet**. Ergebnis:
eine konsistent hochwertige Dachdecker-Site im Miller-Stil, personalisiert in Minuten.

Fokus: **Dachdecker** (optional Gebäudetechnik → `reference/trades/shk.md` bzw. `elektriker.md`).

## Architektur: Multi-Page, plain HTML (5 URLs)
Verzeichnis-basierte statische Seiten — **kein React/Vite/Build-Zwang**, sofort crawlbar:
`/` (Home) · `/leistungen` · `/ueber-uns` · `/karriere` · `/kontakt`.
Ein geteiltes `styles.css` + `main.js` (mit Guards → jede Seite lädt dasselbe JS, no-op wo nichts da ist).
GSAP + ScrollTrigger via CDN. **Mehr als 5 Seiten gibt es nicht.** Details: `reference/template-spec.md`.

## Hero-Varianten (v1/v2)
- **v1 (Standard):** Full-Bleed-Foto-Hero des Templates. Gilt IMMER, wenn der Nutzer nichts
  sagt oder „v1" sagt.
- **v2 (nur auf Zuruf):** Scroll-Scrub-Hero nach dem Kairos-Prinzip — gepinnter 360vh-Scrub:
  Motiv zoomt heran + dreht leicht, versinkt im Nebel, bild-gefüllte Wortmarke steht allein.
  NUR verwenden, wenn der Nutzer ausdrücklich „v2", „v2 hero", „Kairos-Hero" oder „Scroll-Hero"
  sagt. Integration exakt nach **`template/hero-v2/README.md`** (Snippet ersetzt den
  `<section class="hero">`-Block der Startseite, `hero-v2.css`/`.js` einbinden,
  `config/site.js → heroVariant:"v2"` + `heroV2.*` füllen, Motiv als `public/hero-v2.webp`).
  Timings/Choreografie sind fix. Alle anderen Seiten und Sektionen bleiben unverändert.

## Schwester-Skills & Referenzen (laden)
- `handwerk-design-system` + **`reference/template-spec.md`** → was fix ist + Personalisierungs-Map.
- `handwerk-seo-geo` + `reference/geo-seo-playbook.md` → SEO/GEO-Layer & QC.
- `reference/trades/dachdecker.md` → Leistungen, Keywords, Trust-Signale, echte Kundenfragen.
- `reference/resources.md` → Bildaufbereitung (WebP), DSGVO-Fonts.

## Voraussetzung: Firecrawl
`mcp__firecrawl__*` zum Scrapen. Fallback: `WebFetch` oder Daten vom Nutzer erfragen.

---

## PHASE 0 — Discovery
Per AskUserQuestion klären (falls nicht gegeben): **URL der bestehenden Kundenseite**, Betriebsname,
Ort/Region, Dachdecker oder Gebäudetechnik, Notdienst ja/nein, vorhandenes Logo/echte Fotos, echte
Google-Bewertung (Wert/Anzahl). Ziel ist immer Lead-Gen.

## PHASE 1 — Scrape & Extraktion
Bestehende Seite mit Firecrawl scrapen (`scrape` + `map` für alle Unterseiten). **Extrahieren:**
Logo, Markenfarben (CSS-Variablen/Buttons), NAP, Leistungen, Team-/Projektfotos (hochauflösend
herunterladen), echte Bewertungen, USP/Claims/Über-uns, Einzugsgebiet, Notdienst.
Speichern: `research/01-extrakt.md` (+ Assets nach `assets/`). **Nichts erfinden** — Lücken markieren.

## PHASE 2 — Template klonen
Plugin-`template/` in den Projektordner (`site/`) kopieren. Unveränderter Premium-Build.

## PHASE 3 — Personalisieren (genau die 4 Stellen aus template-spec.md)
1. **`config/site.js`** — die EINZIGE Daten-Datei. Füllen: `business` (NAP), `hero`, `brands`,
   `aboutIntro`, `quiz`, `services`, `vorteile`, `team` (Foto+Rolle+Bio je Person), `faq`, `about`,
   `karriere`, `geo.areaServed`, **`seo.siteUrl`** + **`seo.pages.*`** (je eindeutiger Title/Description).
   Fehlende Inhalte faktentreu aus `reference/trades/dachdecker.md` — **nichts erfinden**.
2. **`config/site.js` → `theme`** (bzw. `styles.css :root`) — `dark`/`key1` auf die Markenfarbe
   (Hex, Navy-Charakter wahren). `node build.mjs` schreibt sie in `styles.css`.
3. **Bilder / Logo** — Kundenbilder unter den Pfaden aus `config/site.js` ablegen (WebP), Logo einsetzen.
4. **Domain** — `seo.siteUrl` setzen; `node build.mjs` aktualisiert `robots.txt` + `sitemap.xml` (5 URLs).

Danach die Content-Werte aus `config/site.js` in die HTML-Partials übernehmen (Personalisierungs-Map
in `template-spec.md` Schritt für Schritt; NAP/Hero/Listen). **Tabu:** Struktur/Layout/Animationen/
Signatur-Komponenten/Tokens außer Markenfarben.

## PHASE 4 — SEO/GEO-Layer
`handwerk-seo-geo` anwenden. Pro Seite eindeutiger `<title>` + Description (aus `seo.pages.*`),
`<link rel=canonical>` je Seite, **LocalBusiness/RoofingContractor**-JSON-LD sitewide,
**Service/OfferCatalog** auf `/leistungen`, **FAQPage** (nur echte Fragen), `sitemap.xml` (5 URLs) +
`robots.txt` mit echter Domain, lokale Keywords (Dienstleistung + Ort) in Title/H1.

## PHASE 5 — Bauen
`node build.mjs` (Theme + robots/sitemap). Vorschau: `python3 -m http.server 4322` im `site/`-Ordner.
Kein npm-Build nötig — die Seiten sind statisch. Für Deploy siehe Phase 7.

## PHASE 6 — Qualitäts-Kontrolle (Pflicht, im Browser)
**Real prüfen** (Dev-Server / Vercel-Preview). Checkliste:
- **Design-Treue** (via `handwerk-design-system`): Navy-Hero mit Marken-Marquee, Quiz-Funnel, 3D-Team-
  Karussell (Bio bei Hover, Wheel dreht Karten), Minimal-FAQ, Sticky-Reveal-Footer, Scroll-Reveals,
  Stat-Count-up.
- **Bei Hero v2 zusätzlich** (Checkliste in `template/hero-v2/README.md`): Scrub-Choreografie im
  Browser, nahtloser Nebel-Übergang (keine Farbkante), Wortmarke bild-gefüllt + bricht mobil nicht
  um, reduced-motion statisch, kein Hochanimieren bei Deep-Links.
- **Inhalt**: echter Betrieb/NAP überall, keine Kundendaten-Reste aus dem Original-Template,
  keine Platzhalter/leeren Bildflächen, keine erfundenen Zahlen.
- **Multi-Page**: alle **5 Seiten** durchklicken — Nav + Footer-Links + CTAs korrekt, bei Seitenwechsel
  scrollt es nach oben, Reveals feuern erneut. Jede Seite hat **genau einen, eindeutigen** `<title>` + Canonical.
- **Technik**: Konsole fehlerfrei, Mobil ok, `prefers-reduced-motion` ok (anim-on greift nicht),
  Bilder WebP/lazy. **Nach JS/CSS-Änderung IMMER Hard-Reload** (Cache!).
- **SEO/GEO**: pro Seite eindeutiger Title/Meta + Canonical, eine H1, Schema validiert, robots/sitemap
  (echte Domain), NAP konsistent.
- **Recht (DE)**: Impressum + Datenschutz vorhanden, Fonts self-hosted (oder DSGVO-konform).
Ergebnis: `research/02-qc.md`. Fehler beheben, bevor „fertig".

## PHASE 7 — Deploy (optional, mit Freigabe)
Auf Vercel deployen nur nach ausdrücklicher Freigabe. Commit-E-Mail GitHub-zuordenbar setzen VOR dem
ersten Push (sonst Vercel-Block — siehe `learnings/`). `cleanUrls: true` in `vercel.json` (sonst 404
auf Unterseiten). Übergabe-Notiz: GBP pflegen, echte Bewertungen sammeln, NAP überall identisch.

---

## Wichtige Regeln
1. **Template-Design ist fix.** Personalisieren ja, umgestalten nein.
2. **Immer zuerst die bestehende Seite scrapen** — echte Marke/Bilder/Daten schlagen Erfindung.
3. **Nichts erfinden.** Keine Fake-Bewertungen/Kennzahlen; Lücken markieren.
4. **Browser-QC ist Pflicht.**
5. **Deploy/Downloads nur mit Freigabe.**

## Projektstruktur (Ziel)
```
projekt/
├─ research/   01-extrakt.md · 02-qc.md
├─ assets/     (gescrapte Logos/Fotos)
└─ site/       (Klon von template/, personalisiert)  → node build.mjs && python3 -m http.server 4322
```
