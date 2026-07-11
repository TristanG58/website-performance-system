---
name: handwerk-seo-geo
description: >
  Local-SEO- und GEO-Engine (Generative Engine Optimization) für Handwerk-Websites: optimiert für
  Google-Local-Pack UND Zitierbarkeit durch AI-Antwortmaschinen (ChatGPT, Google AI Overviews,
  Perplexity, Gemini). Liefert lokale Keyword-/Intent-Recherche, citable Copy-Patterns,
  Schema.org-Markup (LocalBusiness/Service/Review), robots.txt für AI-Crawler, Google-Business-
  Profile- und NAP-Guidance sowie E-E-A-T-Signale. Nutzen, wenn eine Handwerker-Site für Suche/
  AI sichtbar gemacht, Schema/Meta/Sitemap erstellt, lokale Landingpages geplant, oder ein
  SEO/GEO-Audit gemacht werden soll. Teil des Meisterwerk-Plugins.
license: MIT
---

# Handwerk SEO + GEO

Du machst Handwerk-Sites sichtbar — lokal in Google UND zitierbar in AI-Antworten. Deine **Quelle der Wahrheit** ist `reference/geo-seo-playbook.md` (verifiziert, Stand Juni 2026). Immer zuerst laden.

## When to Use This Skill
SEO/GEO-Discovery vor dem Build, Aufbau des SEO/GEO-Layers (Schema, Meta, Sitemap, robots.txt, lokale Landingpages), Copy-Optimierung auf Zitierbarkeit, und finales SEO/GEO-Audit.

**Related skills:** `handwerk-site-builder` (ruft diese Skill in Phase 3 + 7), `pro-copywriter` (für die eigentliche Textproduktion).

## Im Miller-Template (Multi-Page, 5 statische Seiten) umgesetzt
Das Template ist eine statische Multi-Page-Site aus **plain HTML/CSS/JS** mit **5 echten URLs** (`/`, `/leistungen`, `/ueber-uns`, `/karriere`, `/kontakt`) — jede ist ein eigenes `index.html` (crawlbar ohne JS). Der SEO/GEO-Layer ist **datengetrieben**, du pflegst `config/site.js`; `build.mjs` injiziert Theme/Domain und generiert robots/sitemap:
- **Per-Page Title/Description/Canonical/OG:** `seo.pages.*` (je eindeutig) → als `<title>`, `<meta name="description">`, `<link rel="canonical">` und OG-Tags im `<head>` jeder `index.html`. **`seo.siteUrl` = echte Domain** (canonical/OG/Sitemap hängen daran).
- **JSON-LD (statisch im HTML als `<script type="application/ld+json">`):** `RoofingContractor`/LocalBusiness sitewide, `OfferCatalog`+`Service` auf `/leistungen`, `FAQPage` auf der Seite mit den sichtbaren Q&A, `AggregateRating` aus `business`-Bewertung (nur echt!), `areaServed` aus `geo.areaServed`.
- **`public/sitemap.xml` + `public/robots.txt` (AI-Bots erlaubt):** von `build.mjs` aus `seo.siteUrl` bzw. `nav` erzeugt.
- **NAP** im Footer jeder Seite (geteiltes Layout) + interne Verlinkung Start→Leistungen→Kontakt ist angelegt.

## Grundprinzip (nicht überhören)
Es gibt **keinen AI-Hack**. GEO = starkes SEO + echtes E-E-A-T + einzigartiger, evidenzbasierter Mehrwert. Voraussetzung für AI-Zitate: Seite ist indexiert + snippet-fähig. Alles andere ist Content-Qualität. (Quelle: Google + arXiv 2311.09735.)

## SEO/GEO-Discovery (Phase 3 im Build — vor dem Bauen)
1. **Lokales Intent-Mapping:** Gewerk × Region → Keyword-Set (`Leistung + Ort`, Long-Tail, Notfall-, Förder-Intent). Gewerke-Profil unter `reference/trades/<gewerk>.md` liefert die Basis-Keywords + echte Kundenfragen.
2. **Wettbewerber-Check:** Top-Lokal-Konkurrenten scrapen (Firecrawl). Wie sieht ihr Local Pack aus, welche Bewertungen, welche Inhalte?
3. **AI-Visibility-Baseline:** 20–50 relevante Anfragen in ChatGPT/Perplexity/Gemini/Google-AI-Mode testen — wird der Betrieb (oder die Konkurrenz) genannt? Baseline dokumentieren.
4. **E-E-A-T-Lücken:** Was fehlt dem Kunden an Trust-Signalen (Meister, Innung, Bewertungen, Referenzen)?
→ Ergebnis fließt in den Build-Brief (Phase 5, vor dem Approval-Stop).

## Citable Copy (das wirksamste GEO-Mittel)
Jeder Seitenabschnitt enthält mind. **eine** Statistik, Quelle oder ein Zitat. Muster (Details + Beispiele im Playbook):
- **Direkte Antwort zuerst** (Definition-Style mit konkreter Zahl/Spanne).
- **Statistik** einbauen (z.B. „senkt Verbrauch um bis zu 15 %, laut Verbraucherzentrale").
- **Quelle/Gesetz** verankern (GEG, HWK, DIN).
- **Inhaber-Zitat** mit Name + Titel.
- **Q&A-Blöcke:** echte Kundenfrage als H2/H3 + 2–4 Sätze direkte Antwort. **Das** macht die AI-Arbeit — nicht das FAQ-Schema (Rich Result ist seit 07.05.2026 tot).
- **Entity-Konsistenz:** Name/Adresse/Telefon/Leistung überall identisch; Marke + Ort + Leistung in einem Satz koppeln.
- **Kein Keyword-Stuffing** — im GEO-Paper die schlechteste Methode, teils negativ.

## Structured Data
- **Pflicht:** `LocalBusiness` (passende Unterklasse: `Electrician`, `Plumber`, `RoofingContractor`, `HVACBusiness` etc.) auf jeder Site.
- **Pro Leistung:** `Service`. **Empfohlen:** `BreadcrumbList`, `Organization`.
- **`Review`/`AggregateRating`** nur mit echten, auf der Seite sichtbaren Bewertungen (sonst Policy-Verstoß).
- **FAQPage:** Markup darf bleiben, bringt aber **0 SERP-Effekt** — die sichtbare Q&A-Formatierung trägt die Arbeit.
- Regel: Markup muss mit sichtbarem Text übereinstimmen. Code-Snippets im Playbook.

## Technical
- **robots.txt:** Search-/Antwort-Bots explizit erlauben (`Googlebot`, `Bingbot`, `OAI-SearchBot`, `PerplexityBot`, `ChatGPT-User`, `Perplexity-User`, `ClaudeBot`). Fertige Vorlage im Playbook. Prüfen, dass CDN/Firewall AI-Bots nicht heimlich blockt.
- **Sitemap.xml** sauber, alle 5 Kernseiten (`/`, `/leistungen`, `/ueber-uns`, `/karriere`, `/kontakt`) mit echter Domain.
- **llms.txt:** optional, **kein** echter Hebel — nicht als AI-Boost verkaufen. Priorität: robots.txt ≫ Sitemap ≫ (optional) llms.txt.
- **Core Web Vitals:** LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1. Mobile-first, Telefonnummer als `tel:`-Link.

## Local SEO
GBP ist der größte Hebel (~36 % Gewicht), dann Bewertungen (~17 %), dann On-Page (~16 %). NAP überall identisch. Lokale Landingpages mit **einzigartigem** Content pro Standort (keine Ortsnamen-Dubletten). Deutsche Citation-Reihenfolge + MyHammer im Playbook. Die Site-Arbeit: NAP im Footer jeder Seite, lokale Keywords in Title/H1, GBP-Anbindung empfehlen (liegt außerhalb der Site, aber in die Übergabe schreiben).

## E-E-A-T auf der Site platzieren
Meisterbrief/Qualifikation, Innungs-/HWK-Logo (+ Backlink), echte Inhaber-Bio mit Foto, Referenzen mit Ort+Jahr, echte Kundenstimmen, Garantien/Versicherung, vollständiges Impressum+Datenschutz, konkrete Fakten (Einzugsgebiet, Preisspannen, Reaktionszeit, erreichbare Nummer).

## SEO/GEO-Audit (Phase 7)
Checkliste: ein Title/Meta-Paar pro Seite · genau eine H1 · Q&A als Headings · LocalBusiness+Service-Schema validiert (validator.schema.org) · robots.txt erlaubt AI-Bots · Sitemap vorhanden · NAP konsistent im Footer · CWV grün · interne Verlinkung Start→Leistungen→Standorte · jede Sektion hat ein citable Element.

## Do Not
- Kein Keyword-Stuffing, keine erfundenen Bewertungen/Zahlen/Mitgliedschaften.
- FAQ-/HowTo-Schema nicht als „AI-Booster" verkaufen (Rich Results tot).
- llms.txt nicht als Sichtbarkeits-Hebel verkaufen.
- Kernfakten nicht nur in Bildern/JS verstecken — müssen als Text im HTML stehen.

### Learn More
`reference/geo-seo-playbook.md` (vollständig, mit Quellen & Code) · `reference/trades/<gewerk>.md` (Keywords + Kundenfragen).
