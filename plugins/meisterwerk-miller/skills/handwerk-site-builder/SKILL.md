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
HTML/CSS/JS, tokenisiert) und füllst es mit den echten Daten des Kunden — gewonnen aus dessen
bestehender Website. Design und Animationen bleiben **unangetastet**. Ergebnis: eine konsistent
hochwertige Dachdecker-Site im Miller-Stil, personalisiert in Minuten.

> **KERNREGEL: HTML-Dateien werden NIE von Hand bearbeitet.** Die einzige pro Kunde bearbeitete Datei
> ist **`config/site.js`**. Ein Renderer (`node render-all.mjs`, zero-dependency) füllt daraus die
> tokenisierten Seiten. Feld-Referenz: **`reference/tokens.md`**. „Nichts erfinden, Lücken markieren" bleibt.

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
  NUR verwenden, wenn der Nutzer ausdrücklich „v2", „v2 hero", „Kairos-Hero" oder „Scroll-Hero" sagt.
  **Kein manuelles Hero-Ersetzen — die Weiche steckt im Template.** Setze `config/site.js →
  heroVariant:"v2"` und fülle `heroV2.*` (`image`, `wordmark` ≤ ~8 Zeichen, `focusY`, optional
  `accent`). `render-all.mjs` schaltet dann automatisch den v2-Hero, die `hero-v2.css`/`.js`-Includes,
  den Bild-Preload und das Marquee-Band um. Timings/Choreografie sind fix; alle anderen Seiten
  und Sektionen bleiben unverändert. Hintergrund: `template/hero-v2/README.md`.

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
Plugin-`template/` in den Projektordner (`site/`) kopieren — inkl. `render.mjs`, `render-all.mjs`,
den **tokenisierten** Seiten, `styles.css`, `main.js`, `hero-v2/`, `assets/`, `public/`.
Unverändert übernehmen. **HTML nie anfassen.**

## PHASE 3 — Personalisieren = NUR `config/site.js` füllen
**Es gibt genau EINE zu bearbeitende Datei: `config/site.js`.** Danach rendert `node render-all.mjs`
die fertigen Seiten. Feld-Referenz: **`reference/tokens.md`** (76 Skalare · 25 REPEAT-Blöcke · 3 IF-Blöcke).

1. **`config/site.js` mit den gescrapten Daten füllen** — alle Felder gemäß `reference/tokens.md`:
   `business` (NAP: name/logo/phone/phoneHref/email/addr/addrShort/copyright/mapTitle/mapEmbed/social),
   `hero` (+ `titleLines`/`titleAria`), `brands[]`, `aboutIntro` (+ `images[]`), `quiz.bg`,
   `services[]` (title/titleDetail/teaser/detail/imgAlt/`bullets`), `vorteile` (rating/reasons/gallery),
   `team.members[]` (idx/img/alt/name/role/bio), `faq.items[]`, `about` (story/values/stats),
   `karriere` (perks/jobs), `geo.areaServed`, **`seo.siteUrl`** + **`seo.pages.*`** (je eindeutiger Title/Description).
   Fehlende Inhalte faktentreu aus `reference/trades/dachdecker.md` — **nichts erfinden, Lücken markieren**.
2. **Markenfarbe** → `config/site.js → theme` (`dark`/`key1` auf die Kunden-Marke, Navy-Charakter
   wahren). `render-all.mjs` injiziert Theme **plus** Home-Hero-BG (`hero.bg`) + Quiz-BG (`quiz.bg`) in `styles.css`.
3. **Bilder / Logo** — als **URLs** in die passenden Config-Felder (`business.logo`, `hero.bg`,
   `services[].img`, `team.members[].img`, `about.*`, `brands[].src`, `aboutIntro.images[].src` …).
   Aufbereitung (WebP/DSGVO): `reference/resources.md`.
4. **Domain** → `seo.siteUrl` setzen; `render-all.mjs` generiert `robots.txt` + `sitemap.xml` (5 URLs) daraus.
5. **Formular + Chat verdrahten** — beide zeigen auf dieselbe Zeile in n8n:
   - `forms.clientId` **und** `chat.clientId` auf dieselbe neue Kennung setzen (z. B. `dachdecker-mueller`).
     Stimmen sie nicht überein, bricht `build.mjs` ab — eine der beiden liefe sonst ins Leere.
   - In der n8n-Data-Table **„Meisterwerk Kunden"** eine Zeile anlegen: `clientId`, `empfaenger`
     (Mail des Inhabers), `betrieb`, `aktiv = true`.
   - **Bot-Wissen erzeugen:** `node chat-context.mjs` → Ausgabe in die Spalte `kontext` derselben
     Zeile kopieren. Das Skript verweigert die Ausgabe, solange noch Demo-Platzhalter drinstehen.
     **Nach jeder späteren Änderung an `config/site.js` neu erzeugen und ersetzen** — sonst erzählt
     der Bot den Stand von vorgestern, und niemand merkt es.
   - Kundendomain in `allowedOrigins` **beider** Webhooks ergänzen (Lead-Empfang und Chat).

**Danach: `node build.mjs`** → rendert die Seiten nach `site/` und prüft sie (siehe Phase 5).
**Tabu:** Struktur/Layout/CSS-Klassen/Animationen/Signatur-Komponenten (3D-Team-Karussell,
Sticky-Footer, Quiz-Funnel, Marquee)/Sektionsreihenfolge — alles fix. Personalisiert wird
**ausschließlich `config/site.js`** (+ Theme-Farben, Bild-URLs). HTML-Partials werden **nie** von Hand editiert.

## PHASE 4 — SEO/GEO-Layer
`handwerk-seo-geo` anwenden. Pro Seite eindeutiger `<title>` + Description (aus `seo.pages.*`),
`<link rel=canonical>` je Seite, **LocalBusiness/RoofingContractor**-JSON-LD sitewide,
**Service/OfferCatalog** auf `/leistungen`, **FAQPage** (nur echte Fragen), `sitemap.xml` (5 URLs) +
`robots.txt` mit echter Domain, lokale Keywords (Dienstleistung + Ort) in Title/H1.

## PHASE 5 — Rendern
**`node build.mjs`** — rendert die Seiten **und prüft sie danach**. Immer diesen Befehl nehmen.

`build.mjs` füllt die tokenisierten Seiten aus `config/site.js`, injiziert Theme + Hero-/Quiz-BG in
`styles.css`, generiert `robots.txt` + `sitemap.xml` (5 URLs) — und läuft dann durch die Prüfungen
für Consent, Self-Host, Maps-Gating, Registry, **Formular und Chat**. Schlägt eine fehl, bricht der
Build mit Exit-Code 1 ab und sagt in Klartext, was fehlt. Schreibt alles nach `site/`.

> **`node render-all.mjs` rendert NUR und prüft NICHTS.** Es ist kein Alias — es ist der halbe Weg.
> Wer damit ausliefert, bekommt eine Seite, die genauso aussieht, aber deren Formular Anfragen
> verwerfen und deren Chatbot die Demo-Firma „Musterwerk Bedachungen" nennen kann, ohne dass es
> irgendwo auffällt. Genau diese Fehler sind hier schon passiert; die Prüfungen sind die Antwort
> darauf. `render-all.mjs` nur zum schnellen Zwischenschauen.

Vorschau: `python3 -m http.server 4322` im `site/`-Ordner. Kein npm-Build nötig — die Seiten sind
statisch. Für Deploy siehe Phase 7.

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
1. **HTML-Dateien werden NIE von Hand bearbeitet.** Einzige Datenquelle = `config/site.js`; `render-all.mjs` rendert.
2. **Template-Design ist fix.** Personalisieren ja, umgestalten nein.
3. **Immer zuerst die bestehende Seite scrapen** — echte Marke/Bilder/Daten schlagen Erfindung.
4. **Nichts erfinden.** Keine Fake-Bewertungen/Kennzahlen; Lücken markieren.
5. **Browser-QC ist Pflicht.**
6. **Deploy/Downloads nur mit Freigabe.**

## Projektstruktur (Ziel)
```
projekt/
├─ research/   01-extrakt.md · 02-qc.md
├─ assets/     (gescrapte Logos/Fotos)
└─ site/       (Klon von template/)  → nur config/site.js füllen → node build.mjs → python3 -m http.server 4322
```
