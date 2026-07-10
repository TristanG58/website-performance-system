---
name: handwerk-site-builder
description: >
  Orchestrator des Meisterwerk-Plugins. Baut hochwertige Dachdecker-Websites, indem es die
  BESTEHENDE Kundenseite scrapt (Firecrawl), Logo, Markenfarben, Teamfotos, Leistungen, NAP &
  Bewertungen extrahiert und in das FIXE Meisterwerk-Premium-Template einsetzt — ohne Design
  oder Animationen zu verändern — und am Ende die Qualität prüft. ALWAYS use when the user wants
  a Dachdecker-/Handwerker-Website, says „Meisterwerk", „Dachdecker-Seite bauen", „Website für
  [Betrieb]", „bestehende Seite neu bauen/relaunchen", or provides a tradesperson URL. Klont das
  Template, personalisiert config/site.ts + Markenfarbe + Bilder, baut und kontrolliert.
license: MIT
allowed-tools: Read, Write, Edit, Grep, Glob, Bash, WebFetch
---

# Meisterwerk Site Builder — Scrape → Personalisieren → Bauen → Prüfen

Du baust keine Website von Grund auf neu. Du nimmst das **fertige, fixe Meisterwerk-Template** und füllst es mit den echten Daten des Kunden — gewonnen aus dessen bestehender (meist schwacher) Website. Das Design und die Animationen bleiben **unangetastet**. Ergebnis: eine konsistent hochwertige Dachdecker-Site, personalisiert in Minuten.

Fokus: **Dachdecker** (gelegentlich Gebäudetechnik — dann `reference/trades/shk.md` bzw. `elektriker.md` für Leistungen/Keywords/Fragen heranziehen).

## Architektur: Multi-Page (max. 5 Seiten)
Das Template ist eine **Multi-Page-Site** (SPA + SSG-Prerender via `vite-react-ssg`) mit **genau 5 echten, crawlbaren URLs** — kein One-Pager:
`/` (Start) · `/leistungen` · `/projekte` · `/ueber-uns` · `/kontakt`.
Jede Seite wird beim Build zu eigenem statischem HTML mit eigenem Title/Meta/Canonical + JSON-LD gerendert (von Crawlern ohne JS lesbar). Routing/Layout/Animationen sind fix — du füllst nur Daten. **Mehr als 5 Seiten gibt es nicht** (Pflege-/SEO-Disziplin). Brauchst du eine zusätzliche Gewerk-Landingpage, ersetzt sie eine bestehende — nie 6+.

## Schwester-Skills & Referenzen (laden)
- `handwerk-design-system` + **`reference/template-spec.md`** → was fix ist und wie personalisiert wird (Personalisierungs-Map).
- `handwerk-seo-geo` + `reference/geo-seo-playbook.md` → SEO/GEO-Layer & QC.
- `reference/trades/dachdecker.md` → Leistungen, Keywords, Trust-Signale, echte Kundenfragen.
- `reference/resources.md` → Bildaufbereitung (WebP), DSGVO-Fonts, Stock als Notlösung.

## Voraussetzung: Firecrawl
Nutzt `mcp__firecrawl__*` zum Scrapen der bestehenden Kundenseite. Falls nicht verbunden: `WebFetch` als eingeschränkter Fallback (oder Daten vom Nutzer erfragen).

---

## PHASE 0 — Discovery
Per AskUserQuestion klären (falls nicht gegeben): **URL der bestehenden Kundenseite**, Betriebsname, Ort/Region, ob Dachdecker oder Gebäudetechnik, Notdienst ja/nein, vorhandenes Logo/echte Fotos, echte Google-Bewertung (Wert/Anzahl). Ziel ist immer Lead-Gen.

## PHASE 1 — Scrape & Extraktion
Bestehende Seite mit Firecrawl scrapen (`scrape` + **`map` für alle Unterseiten**, da wir 5 Seiten befüllen — Leistungen, Über-uns/Team, Referenzen/Projekte, Kontakt separat). **Extrahieren:**
- **Logo** (Header-`<img>`, Favicon, OG-Image) → herunterladen.
- **Markenfarben** aus CSS (Primär/Akzent; CSS-Variablen, inline styles, Buttons).
- **Schriften** (nur informativ — Template-Schrift bleibt).
- **NAP**: Firmenname, Adresse, Telefon, E-Mail (Footer/Impressum/Kontakt).
- **Leistungen** (Titel + Kurzbeschreibung).
- **Teamfotos / Projektfotos** (echte Bilder, hochauflösend) → herunterladen.
- **Bewertungen** (Google-Rating, Kundenstimmen) — nur echte übernehmen.
- **USP/Claims/Über-uns**, Einzugsgebiet, Öffnungszeiten/Notdienst.
Speichern: `research/01-extrakt.md` (+ Assets nach `assets/`).

## PHASE 2 — Template klonen
Das Plugin-Template (`template/`) in den Projektordner kopieren (ohne `node_modules`). Das ist der unveränderte Premium-Build.

## PHASE 3 — Personalisieren (genau 3 Stellen + Domain, siehe template-spec.md)
1. **`src/config/site.ts`** — die EINZIGE Daten-Datei, deckt alle 5 Seiten ab. Füllen: `business` (NAP + strukturierte `addr`), `hero`, `stats`, `services`, `reasons`, `steps`, `projects`, `testimonials`, `faq`, `about` (Über-uns-Texte), `geo.areaServed` (bediente Orte/Stadtteile), **`seo.siteUrl` (echte Domain!)** und **`seo.pages.*`** (Title + Description pro Seite — je eindeutig, lokales Keyword vorn), `nav`. Fehlende echte Inhalte faktentreu aus `reference/trades/dachdecker.md` ergänzen — **nichts erfinden**, Lücken markieren.
2. **`src/index.css`** — `--primary` (+ `--ring`) auf die Markenfarbe (Hex→OKLCH, Lightness ~0.28–0.40, Navy-Charakter wahren). Sonst nichts.
3. **`public/img/`** — aufbereitete Kundenbilder unter den vorhandenen Dateinamen ablegen (oder Pfade in `site.ts` anpassen); Logo einsetzen. Bilder zu WebP optimieren (siehe resources.md).
4. **Domain in `public/robots.txt` + `public/sitemap.xml`** — die Platzhalter-Domain auf `seo.siteUrl` setzen (Sitemap listet alle 5 URLs).

**Tabu:** Seitenstruktur/Routing/Sektionen/Animationen/Bento-Spans/Tokens (außer `--primary`) anfassen. Keine 6. Seite.

## PHASE 4 — SEO/GEO-Layer
`handwerk-seo-geo` anwenden. Im Multi-Page-Template ist der Mechanismus eingebaut: pro Seite setzt die `<Seo>`-Komponente (`src/components/site/seo.tsx`) Title/Description/Canonical/OG + JSON-LD aus `site.ts` — du pflegst nur die Daten. **Pro Seite eindeutiger Title + Description** (`seo.pages.*`), **LocalBusiness/RoofingContractor**-Schema sitewide, **Service/OfferCatalog** auf `/leistungen`, **FAQPage** auf `/kontakt` (nur echte Inhalte). `sitemap.xml` (5 URLs) + `robots.txt` (AI-Bots erlauben) mit echter Domain. Lokale Keywords (`Dienstleistung + Ort`) in Title/H1. Interne Verlinkung Start→Leistungen→Kontakt ist im Template angelegt.

## PHASE 5 — Bauen
`npm install --legacy-peer-deps && npm run build` (`npm run dev` für Vorschau).
⚠️ **`--legacy-peer-deps` ist Pflicht:** `vite-react-ssg` deklariert als Peer nur Vite ≤7, das Template läuft auf Vite 8 — funktioniert real, aber npm bricht sonst mit `ERESOLVE` ab.
Der Build (`tsc -b && vite-react-ssg build`) muss fehlerfrei sein und **5 HTML-Dateien** prerendern (`dist/index.html`, `leistungen.html`, `projekte.html`, `ueber-uns.html`, `kontakt.html`). Bei FS-Problemen mit `dist` in einen Temp-Ordner bauen.

## PHASE 6 — Qualitäts-Kontrolle (Pflicht, im Browser)
Nicht nur Code lesen — **real prüfen** (Dev-Server / Vercel-Preview / Single-File). Checkliste:
- **Design-Treue** (via `handwerk-design-system`): heller Start, Navy-Akzent, Gold-Sterne + farbiges Google-Logo, Road-Timeline zeichnet sich ein + Striche wandern, Bento-Parallax, Wipe-up-Headings, Card-Zoom.
- **Inhalt**: echter Betrieb/NAP überall, keine Kundendaten-Reste aus dem Original-Template, keine Platzhalter/leeren Bildflächen, keine erfundenen Zahlen.
- **Multi-Page**: alle **5 Seiten** im Browser durchklicken — Header-Nav + Footer-Links + CTAs führen korrekt zwischen den Seiten, bei Seitenwechsel scrollt es nach oben und die Reveal-Animationen feuern erneut. Jede der 5 prerenderten HTML-Dateien hat **genau einen, eindeutigen** `<title>` und eigenes Canonical.
- **Technik**: Build grün, Konsole fehlerfrei, Mobil ok, `prefers-reduced-motion` ok, Bilder als WebP/lazy, Lighthouse 90+ (wenn möglich).
- **SEO/GEO**: pro Seite eindeutiger Title/Meta + Canonical, eine H1, Schema validiert (LocalBusiness sitewide, Service auf /leistungen, FAQPage auf /kontakt), robots/sitemap (5 URLs, echte Domain) vorhanden, NAP konsistent.
- **Recht (DE)**: Impressum + Datenschutz vorhanden, Fonts self-hosted.
Ergebnis: `research/02-qc.md`. Fehler beheben, bevor „fertig".

## PHASE 7 — Deploy (optional, mit Freigabe)
Auf Vercel deployen (Vercel-MCP) nur nach ausdrücklicher Nutzer-Freigabe. Übergabe-Notiz: GBP pflegen, echte Bewertungen sammeln, NAP überall identisch.

---

## Wichtige Regeln
1. **Template-Design ist fix.** Personalisieren ja, umgestalten nein. Bei Abweichung ist das Produkt kaputt.
2. **Immer zuerst die bestehende Seite scrapen** — echte Marke/Bilder/Daten schlagen Erfindung.
3. **Nichts erfinden.** Keine Fake-Bewertungen/Mitgliedschaften/Kennzahlen; Lücken markieren.
4. **Browser-QC ist Pflicht** — Code-Review allein reicht nicht.
5. **Deploy/Downloads nur mit Freigabe.**

## Projektstruktur (Ziel)
```
projekt/
├─ research/   01-extrakt.md · 02-qc.md
├─ assets/     (gescrapte Logos/Fotos, Originale)
└─ site/       (Klon von template/, personalisiert)  → npm install && npm run dev
```
