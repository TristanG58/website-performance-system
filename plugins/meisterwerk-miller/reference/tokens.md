# TOKENS.md — Meisterwerk v2 (Miller-Edition) Template-Tokens

Vollständige Referenz aller Tokens, die `render.mjs` in `template/*.html` einsetzt.
Datenquelle ist ein `SITE`-Objekt (siehe `template/config/site.js`). Für neue Kunden
liefert die Claude-Extraktion genau diese Felder.

**Konventionen**
- `{{pfad.ins.objekt}}` — Skalar, Punkt-Pfad ins `SITE`-Objekt. **Roh eingesetzt (kein HTML-Escaping).**
- `{{.feld}}` — Feld des aktuellen `REPEAT`-Items.
- `{{.}}` — das Item selbst (String-Arrays wie `bullets`, `gallery`, `nav`-Meta).
- `<!-- REPEAT pfad --> … <!-- /REPEAT pfad -->` — Array-Schleife (verschachtelbar).
- `<!-- IF pfad --> … <!-- /IF pfad -->` — Sektion nur rendern, wenn Feld existiert & (Array) nicht leer.

> **Encoding-Hinweis:** Wo im Markup HTML-Entities stehen (z. B. `&amp;` in „Steildach &amp; Ziegeldach"),
> enthält der Wert die Entity ebenfalls, weil roh eingesetzt wird. Werte mit `<`, `>`, `&`, `"` müssen
> also HTML-sicher geliefert werden.

Bilanz (Stand v2.3.0): **76 unterschiedliche Skalar-Tokens · 25 REPEAT-Blöcke (11 Arrays, teils mehrfach genutzt) · 3 IF-Blöcke.**
Dazu seit dem Conversion-Umbau 2026-08-13 die Tokens aus dem **Nachtrag ganz unten** (Trust, Kundenstimmen, Zusagen, Bewerbung).

---

## 1) Skalar-Tokens

### business (NAP / Stammdaten — Header, Footer, Kontakt, überall)
| Token | Beschreibung | Beispielwert (Demo) |
|---|---|---|
| `{{business.name}}` | Firmenname (Logo-alt, aria-label, Bild-alts) | `Musterwerk Bedachungen` |
| `{{business.shortName}}` | Kurzer Markenname für „Warum …"-Eyebrows (Leistungen/Karriere) | `Musterwerk` (real: `Miller`) |
| `{{business.logo}}` | Logo-Bild-URL (Header + Footer) | `/assets/placeholders/photo-roofing.svg` |
| `{{business.footerBlurb}}` | Footer-Beschreibungsabsatz | `Ihr Meisterbetrieb für Dach und Fassade im Musterstadt und Umgebung. …` |
| `{{business.phone}}` | Telefon (Anzeige) | `+49 123 4567890` |
| `{{business.phoneHref}}` | Telefon (tel:-Link) | `tel:+491234567890` |
| `{{business.email}}` | E-Mail (Anzeige & in `mailto:{{business.email}}`) | `info@example.de` |
| `{{business.addr.street}}` | Straße (Kontakt-Kachel) | `Musterstraße 12` |
| `{{business.addr.zip}}` | PLZ | `12345` |
| `{{business.addr.city}}` | Ort | `Musterstadt` |
| `{{business.addr.region}}` | Region | `Musterstadt und Umgebung` |
| `{{business.addrShort}}` | Kurzadresse (Footer-Zeile) | `Musterstraße 12, 12345 Musterstadt` |
| `{{business.copyright}}` | Footer-Copyright-Zeile | `© 2026 Musterwerk Bedachungen GmbH · Meisterbetrieb aus Musterstadt` |
| `{{business.mapTitle}}` | Google-Maps-iframe `title` | `Standort Musterwerk Bedachungen, Musterstraße 12, 12345 Musterstadt` |
| `{{business.mapEmbed}}` | Google-Maps-iframe `src` (Embed-URL) | `https://www.google.com/maps?q=Musterstra%C3%9Fe%2012,%2012345%20Musterstadt&output=embed` |
| `{{business.social.instagram}}` | Instagram-URL | `#` |
| `{{business.social.linkedin}}` | LinkedIn-URL | `#` |

### cta (Header-Button)
| Token | Beschreibung | Beispielwert |
|---|---|---|
| `{{cta.label}}` | Header-CTA-Text | `Kostenlose Beratung` |
| `{{cta.href}}` | Header-CTA-Ziel | `/kontakt` |

### hero (Home-Startbild)
| Token | Beschreibung | Beispielwert |
|---|---|---|
| `{{hero.bg}}` | Hintergrundbild-URL (nur Subpage-`page-hero` inline; Home-Hero-BG steckt in `styles.css`) | `/assets/placeholders/photo-roofing.svg` |
| `{{hero.eyebrow}}` | Kicker über der H1 | `Persönlich. Zuverlässig. Termintreu.` |
| `{{hero.titleAria}}` | H1 als Fließtext für `aria-label` | `Dach mit Zukunft. Qualität vom Meisterbetrieb.` |
| `{{hero.sub}}` | Subline unter der H1 | `Seit langjähriger für Sie im Einsatz …` |
| `{{hero.button.label}}` | Hero-CTA-Text | `Jetzt beraten lassen` |
| `{{hero.button.href}}` | Hero-CTA-Ziel | `/kontakt` |
| *(H1-Zeilen)* | siehe REPEAT `hero.titleLines` | — |

### aboutIntro (Home Team-Intro)
| Token | Beschreibung | Beispielwert |
|---|---|---|
| `{{aboutIntro.h2}}` | Überschrift | `Ein starkes Team, das anpackt …` |
| `{{aboutIntro.button.label}}` | Button-Text | `Mehr über uns erfahren` |
| `{{aboutIntro.button.href}}` | Button-Ziel | `/ueber-uns` |

### vorteile (Home „Darum …")
| Token | Beschreibung | Beispielwert |
|---|---|---|
| `{{vorteile.rating.value}}` | Bewertungswert | `4,9 / 5` |
| `{{vorteile.rating.label}}` | Bewertungslabel | `Sternebewertung` |
| `{{vorteile.h2}}` | Abschnitts-H2 | `Darum entscheiden sich Kunden für uns` |
| `{{vorteile.lead}}` | Einleitungstext | `Als Meisterbetrieb aus Musterstadt …` |
| `{{vorteile.button.label}}` / `{{vorteile.button.href}}` | CTA | `Jetzt beraten lassen` / `/kontakt` |

### team (Home 3D-Karussell — Kopf)
| Token | Beschreibung | Beispielwert |
|---|---|---|
| `{{team.eyebrow}}` | Kicker | `Bei uns packen echte Profis an` |
| `{{team.h2}}` | H2 | `Unser Team stellt sich vor` |
| `{{team.lead}}` | Lead | `Ob auf dem Dach, im Büro …` |

### faq
| Token | Beschreibung | Beispielwert |
|---|---|---|
| `{{faq.h2}}` | FAQ-Überschrift | `Häufig gestellte Fragen` |

### about (Über-uns-Seite)
| Token | Beschreibung | Beispielwert |
|---|---|---|
| `{{about.heroBg}}` | Page-Hero-BG-URL | `/assets/placeholders/photo-roofing.svg` |
| `{{about.h1}}` | Page-Hero-H1 | `Ein Meisterbetrieb mit Geschichte und Zukunft` |
| `{{about.story.h2}}` | Story-H2 | `Generationen von Erfahrung, frisch weitergedacht` |
| `{{about.story.img}}` | Story-Bild-URL | `/assets/placeholders/photo-roofing.svg` |
| `{{about.story.imgAlt}}` | Story-Bild-alt | `Zwei lächelnde Männer von Musterwerk Bedachungen …` |
| `{{about.teamImg}}` | Team-Teaser-Bild-URL | `/assets/placeholders/photo-roofing.svg` |
| `{{about.teamImgAlt}}` | Team-Teaser-Bild-alt | `Zwei junge Männer von Musterwerk Bedachungen …` |

### karriere (Karriere-Seite)
| Token | Beschreibung | Beispielwert |
|---|---|---|
| `{{karriere.heroBg}}` | Page-Hero-BG-URL | `/assets/placeholders/photo-roofing.svg` |
| `{{karriere.h1}}` | Page-Hero-H1 | `Karriere bei Musterwerk Bedachungen` |

### seo (je Seite eigener Title/Description)
| Token | Beschreibung | Beispielwert |
|---|---|---|
| `{{seo.pages.home.title}}` / `.description` | `<title>` / Meta-Description Home | `Musterwerk Bedachungen: Ihr Dachdecker-Experte in der Region` |
| `{{seo.pages.leistungen.title}}` / `.description` | Leistungen | `Leistungen – Musterwerk Bedachungen \| Dachdecker & Spengler im Musterstadt und Umgebung` |
| `{{seo.pages.ueberUns.title}}` / `.description` | Über uns | `Über uns – Musterwerk Bedachungen \| Meisterbetrieb aus Musterstadt` |
| `{{seo.pages.karriere.title}}` / `.description` | Karriere | `Karriere – Musterwerk Bedachungen \| Jobs im Dachhandwerk (m/w/d)` |
| `{{seo.pages.kontakt.title}}` / `.description` | Kontakt | `Kontakt – Musterwerk Bedachungen \| Dachdecker in Musterstadt &amp; Musterstadt` |

---

## 2) REPEAT-Blöcke (Arrays)

| Block | Seite(n) | Item-Felder (Tokens) | Beschreibung |
|---|---|---|---|
| `<!-- REPEAT hero.titleLines -->` | Home | `{{.}}` | H1-Zeilen (je eigene `.title-line`, für die Roofline-Animation) |
| `<!-- REPEAT brands -->` (2×: sichtbar + `aria-hidden`-Dup) | Home | `{{.src}}`, `{{.name}}` | Hersteller-Logos im Marquee |
| `<!-- REPEAT aboutIntro.body -->` | Home | `{{.}}` | Einleitungs-Absätze (String-Array) |
| `<!-- REPEAT aboutIntro.images -->` | Home | `{{.src}}`, `{{.alt}}` | 2×2-Bildraster |
| `<!-- REPEAT services -->` | Home + Leistungen | Home: `{{.img}}`,`{{.imgAlt}}`,`{{.title}}`,`{{.teaser}}` · Leistungen: `{{.img}}`,`{{.titleDetail}}`,`{{.detail}}` + nested `bullets` | 6 Leistungen (Cards auf Home, Detail-Zeilen auf /leistungen) |
| `<!-- REPEAT .bullets -->` (nested in services) | Leistungen | `{{.}}` | Checklisten-Punkte je Leistung |
| `<!-- REPEAT vorteile.rating.avatars -->` | Home | `{{.}}` | Avatar-Bild-URLs der Bewertungszeile |
| `<!-- REPEAT vorteile.reasons -->` | Home | `{{.title}}`, `{{.body}}` | 3 Gründe („Darum …") |
| `<!-- REPEAT vorteile.gallery -->` (2×: sichtbar + Dup) | Home | `{{.}}` | Projekt-Galerie-URLs (Marquee) |
| `<!-- REPEAT team.members -->` | Home | `{{.idx}}`,`{{.img}}`,`{{.alt}}`,`{{.name}}`,`{{.role}}`,`{{.bio}}` | Team-Karten (3D-Karussell); `idx` = `--i`-Winkel |
| `<!-- REPEAT faq.items -->` | Home | `{{.q}}`, `{{.a}}` | FAQ-Einträge |
| `<!-- REPEAT about.values -->` | Über uns | `{{.icon}}` (roh-SVG), `{{.title}}`, `{{.body}}` | Werte-Karten |
| `<!-- REPEAT about.stats -->` | Über uns | `{{.value}}`, `{{.label}}` | Stat-Band (Count-up) |
| `<!-- REPEAT about.story.body -->` | Über uns | `{{.}}` | Story-Absätze |
| `<!-- REPEAT karriere.perks -->` | Karriere | `{{.icon}}` (roh-SVG), `{{.title}}`, `{{.body}}` | Benefits-Karten |
| `<!-- REPEAT karriere.jobs -->` | Karriere | `{{.title}}` + nested `meta` | Offene Stellen |
| `<!-- REPEAT .meta -->` (nested in jobs) | Karriere | `{{.}}` | Job-Metadaten (Badges) |
| `<!-- REPEAT nav -->` | alle 5 (Footer-Navi-Spalte) | `{{.href}}`, `{{.label}}` | Footer-Navigation |

*Hinweis:* `geo.areaServed` ist im Datenmodell vorhanden, hat aber im aktuellen Markup keinen
Render-Ort (vorgesehen für künftiges JSON-LD `areaServed`, das die fixe Struktur nicht verändert).

## 3) IF-Blöcke (bedingte Sektionen — Home)

| Block | Bedingung | Effekt |
|---|---|---|
| `<!-- IF brands -->` | `brands` nicht leer | Marken-Marquee nur zeigen, wenn Logos vorhanden |
| `<!-- IF vorteile.rating -->` | `vorteile.rating` gesetzt | Bewertungszeile (Rating) nur bei vorhandenen Bewertungen |
| `<!-- IF team.members -->` | `team.members` nicht leer | Ganze Team-Sektion nur bei vorhandenem Team |

---

## 4) Bewusst NICHT tokenisiert (fixe Struktur / Signatur-Mechaniken)
- Quiz-Funnel, Kontaktformular-Felder/Labels/Optionen, Section-Kicker/Überschriften ohne
  Datenmodell-Feld (z. B. „Warum Miller", „Unsere Werte"), CTA-Bänder, Header-Navigation
  (aktiver Zustand ist seitenabhängig), Footer-Spalten „Leistungen" & „Rechtliches".
- `styles.css`, `main.js`, GSAP-Init, alle SVG-Icons, Layout/Klassen/Reihenfolge — unverändert.

---

## Hero-Varianten (v1 / v2)

Die Startseite unterstützt zwei Hero-Sektionen. Gesteuert über ein Feld im SITE-Objekt:

| Token | Werte | Beschreibung |
|---|---|---|
| `heroVariant` | `"v1"` (Default) \| `"v2"` | v1 = Standard Full-Bleed-Foto-Hero. v2 = Scroll-Scrub-Hero (Kairos-Prinzip). |
| `heroV2.image` | URL/Pfad | 16:9-Motiv; füllt Hintergrund UND die bild-gefüllte Wortmarke. |
| `heroV2.wordmark` | Text, kurz | Betriebsname als große Wortmarke. **≤ ~8 Zeichen** ideal — bei langen Namen nur Kernname (z.B. „MUSTERWERK" statt „Musterwerk Bedachungen"). |
| `heroV2.focusY` | z.B. `"42%"` | Vertikaler Bildfokus. |
| `heroV2.accent` | Hex oder leer | Leer = `--key2` aus dem Theme. |

**Abgeleitete Flags (von render.mjs automatisch gesetzt, nicht extrahieren):** `heroIsV1`, `heroIsV2`.
Die Engine berechnet sie aus `heroVariant`. Im Template steuern `<!-- IF heroIsV1 -->` / `<!-- IF heroIsV2 -->` die Hero-Auswahl, die v2-CSS/JS-Includes und die Verschiebung des Marken-Marquees in die `hv2-marq-band`.

**Trigger-Regel (für n8n / Extraktion):** Enthält die Slack-Lead-Nachricht „v2 hero", „Kairos-Hero" oder „Scroll-Hero" → `heroVariant: "v2"`. Sonst (bzw. bei „v1") → `heroVariant: "v1"`.

**Zusatzdateien:** `template/hero-v2/hero-v2.css` und `hero-v2.js` (verbatim aus dem Plugin, unverändert). Werden nur bei v2 eingebunden. Müssen mit deployt werden.

---

## Nachtrag 2026-08-13 — Conversion-Umbau (M1–M3)

Neue Tokens/Blöcke des Conversion-Umbaus (Commit `8eb95e2` ff.). Alle Blöcke sind
**IF-gated**: Feld auf `null` ⇒ Sektion/Zeile entfällt komplett. **Inhaltsregeln
im site-builder-Skill, Phase 3 Schritt 6** (nur echte Google-Werte, Zusagen nur
über Kontrollierbares, keine erfundenen Bewertungen).

### hero.trust (Trust-Zeile unter dem Hero-CTA, beide Hero-Varianten)
| Token | Beschreibung | Beispielwert (Demo) |
|---|---|---|
| `{{hero.trust.value}}` | Echter Google-Schnitt | `4,9` |
| `{{hero.trust.count}}` | Echte Anzahl + Quelle | `36 Bewertungen bei Google` |

IF-Block: `<!-- IF hero.trust -->` (index.html, v1 **und** v2-Hero).
Hinweis: `hero.button.href` zeigt seit dem Umbau auf `#beratung` (Quiz-Anker auf
der Home) statt auf `/kontakt`.

### testimonials (Kundenstimmen-Sektion, Home, zwischen Vorteilen und Team)
| Token | Beschreibung |
|---|---|
| `{{testimonials.eyebrow}}` / `{{testimonials.h2}}` | Sektionskopf |
| `{{testimonials.google.value}}` / `{{testimonials.google.count}}` | Google-Badge (echter Schnitt + Anzahl) |
| REPEAT `testimonials.items` → `{{.text}}`, `{{.name}}`, `{{.place}}` | Einzelne Bewertungen, wörtlich |

IF-Blöcke: `<!-- IF testimonials -->` (ganze Sektion), `<!-- IF testimonials.google -->` (Badge).
Direkt danach: `<!-- IF about.stats -->`-Statband auf der Home (REPEAT `about.stats`, Count-up).

### garantie (Zusagen am Absende-Button beider Kontaktformulare)
| Token | Beschreibung |
|---|---|
| REPEAT `garantie.items` → `{{.}}` | Konkrete, falsifizierbare Zusagen (nur Kontrollierbares) |

IF-Block: `<!-- IF garantie -->` (index.html + kontakt/index.html, nach `#ktNote`).

### Bewerbung (/karriere, Sektion `#bewerben`)
- `karriere/index.html` trägt jetzt einen eigenen `wps-form-config`-Head-Block
  (gleiche `forms`-Werte) und das Formular `#bwForm` (Felder `bwVor`, `bwNach`,
  `bwTel`, `bwMail`, `bwStelle`, `bwMsg`, `bwHp`, `bwConsent`, `bwNote`).
- REPEAT `karriere.jobs` füllt zusätzlich die `<option>`-Liste der Wunsch-Stelle;
  Stellen-Links tragen `data-job="{{.title}}"` und zeigen auf `#bewerben`
  (nie auf `/kontakt` — `build.mjs` prüft das fail-closed).
- Neuer Formular-Text: `{{forms.texts.bewerbungSuccess}}` (Du-Form für Bewerber).
- Payload an denselben n8n-Webhook, `thema: "Bewerbung: <Stelle>"`.
