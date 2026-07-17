# GEO + Local SEO Playbook (Handwerk)

> **Diese Datei ist die Quelle — die Kopien unter `plugins/*/reference/` nie direkt editieren.**
> Sie werden per `shared/sync/sync-manifest.json` von hier gespiegelt (die Plugins müssen
> eigenständig ausliefern können). Nach jeder Änderung: `node shared/sync/sync.mjs --sync`.
> Prüfen ohne zu schreiben: `--check`. Details: `shared/sync/README.md`.

> Praxis-Referenz für den Bau von Websites für deutsche Handwerksbetriebe, die **lokale Leads gewinnen** UND **von AI-Antwortmaschinen zitiert werden** (ChatGPT, Google AI Overviews/AI Mode, Perplexity, Gemini).
> Stand: Juni 2026. Jede umstrittene Behauptung ist mit **Verifiziert:** oder **Umstritten:** markiert.

---

## Grundprinzip: GEO = starkes SEO + E-E-A-T + einzigartiger Mehrwert

**Verifiziert (Google Search Central, "AI features and your website", zuletzt aktualisiert 2025-12-10):**
Google sagt offiziell und wörtlich, dass es **keine** zusätzlichen technischen Anforderungen oder Spezial-Optimierungen für AI Overviews / AI Mode gibt. Zitat sinngemäß aus der Doku:

> "You can apply the same foundational SEO best practices for AI features as you do for Google Search overall. […] While specific optimization isn't required for AI Overviews and AI Mode, all existing SEO fundamentals continue to be worthwhile."

Die einzige technische Voraussetzung, um in AI-Antworten als Quelle aufzutauchen: Die Seite muss **indexiert** und **snippet-fähig** sein (Search-Technical-Requirements erfüllen). Mehr nicht.

Googles Liste der relevanten Fundamentals (1:1 aus der Doku):
- Crawling in robots.txt erlauben (auch CDN/Hosting darf nicht blocken)
- Inhalte über **interne Verlinkung** auffindbar machen
- Gute **Page Experience** (Core Web Vitals)
- Wichtige Inhalte als **Text** verfügbar machen (nicht nur in Bildern/JS)
- Text mit hochwertigen Bildern/Videos stützen
- **Strukturierte Daten müssen mit dem sichtbaren Text übereinstimmen**
- **Google Business Profile** und Merchant Center aktuell halten

**Konsequenz für den Bau:** Es gibt keinen "AI-Hack". Wer sauberes On-Page-SEO, echte E-E-A-T-Signale und einzigartigen Mehrwert (lokale Expertise, Referenzen, konkrete Preise/Fakten) liefert, ist automatisch GEO-optimiert. Alles, was als "Geheimtrick für ChatGPT-Ranking" verkauft wird, ist Marketing.

**Quelle:** https://developers.google.com/search/docs/appearance/ai-features

---

## Ziel festlegen: Mention oder Citation

Jede GEO-Maßnahme zielt auf genau eines von zwei Ergebnissen:

- **Mention (Erwähnung):** Die Marke wird in der AI-Antwort **genannt** — z. B. als eine von drei Empfehlungen. Bei ChatGPT oft **ohne Link**: kein Klick, aber die Vorentscheidung. In Googles AI Mode werden Nennungen verlinkt.
- **Citation (Zitierung):** Die eigene Seite wird als **Quelle mit klickbarem Link** angegeben. Passiert, wenn die AI eine konkrete Information von der Seite übernimmt. Bringt Traffic.

**Für Handwerk ist das keine Entscheidung, sondern eine Konstante: fast immer Mention.** Niemand fragt eine AI nach einem Ratgeber über Dachziegel und beauftragt daraufhin einen Dachdecker. Gefragt wird „bester Dachdecker in [Ort]" — und entweder der Betrieb steht unter den drei genannten Namen, oder er existiert für diesen Menschen nicht.

**Die unbequeme Konsequenz:** Mentions entstehen überwiegend **außerhalb der eigenen Website** — über Erwähnungen, Verzeichnisse, Bewertungen und Vergleichslisten. Das erklärt die Gewichtung im Local-SEO-Kapitel unten (GBP ~36 %, Bewertungen ~17 %, On-Page ~16 %): **Die perfekte Website ist Vorbedingung, nicht Ursache.** Ohne sie wird man nicht genannt — mit ihr allein aber auch nicht.

Citation bleibt relevant für **Ratgeber-Inhalte auf der Seite** (Kosten, Förderung, Ablauf). Dort ist Traffic das Ziel, und dort kann die Seite die zitierte Quelle sein.

**Einordnung:** Taxonomie (Definition, nicht empirisch). Die Handwerk-Konsequenz ist eine eigene Ableitung aus den Local-SEO-Gewichten weiter unten — keine Fremdbehauptung.

---

## Grounding: die Vorbedingung jeder Citation

Ein LLM antwortet zunächst aus seinem **eingefrorenen Trainingswissen** — es sucht nicht von selbst. **Grounding** heißt: Das Modell erkennt, dass dieses Wissen nicht reicht, sucht live im Netz und baut die Antwort aus den gefundenen Seiten. Die Technik dahinter heißt **RAG** (Retrieval Augmented Generation).

**Die Konsequenz, die alles steuert: ohne Grounding keine Citation.** Antwortet die AI aus dem Gedächtnis, nennt sie **keine Quelle** — dann ist die Seite chancenlos, egal wie gut sie ist. Erst die Live-Suche erzeugt überhaupt einen Quellen-Link.

Das ergänzt das Grundprinzip oben um die **Frage-Seite**: „indexiert + snippet-fähig" ist die Bedingung auf *Seiten*-Ebene, Grounding die Bedingung auf *Query*-Ebene. Beide müssen erfüllt sein.

**Welche Fragen lösen Grounding aus?**
> ❌ **Kein Grounding:** „Was ist eine Photovoltaik-Anlage?" — weiß das Modell auswendig. Keine Quelle, keine Chance.
> ✅ **Grounding:** „Was kostet eine PV-Anlage mit Speicher in Meschede 2026?" — zu frisch, zu lokal, zu konkret fürs Training. Das Modell *muss* suchen.

**Regel für die Copy:** aktuell, konkret, lokal, mit Jahreszahl, mit Zahlen und Spannen. Also exakt das, was die Citable-Copy-Patterns unten ohnehin verlangen — Grounding erklärt, **warum** sie wirken.

**Kein Freifahrtschein:** Das ist *kein* Auftrag, Jahreszahlen und Ortsnamen in den Text zu streuen. Das wäre Keyword-Stuffing — im GEO-Paper die schlechteste Methode, teils mit negativem Effekt (siehe unten). Die Frage muss echt sein und die Antwort belastbar.

**Einordnung:** Mechanismus-Beschreibung, unstrittig (so arbeiten ChatGPT Search, Perplexity und AI Overviews). Bewusst ohne Zahlen.

---

## Was AI-Engines zitieren (evidenzbasiert)

**Verifiziert (Aggarwal et al., "GEO: Generative Engine Optimization", arXiv:2311.09735, KDD 2024):**
Die Headline-Zahl stimmt: GEO-Taktiken können die Sichtbarkeit in generativen Engines um **bis zu ~40 % (relativ)** steigern. Wörtlich aus dem Paper: *"our top-performing methods, Cite Sources, Quotation Addition, and Statistics Addition, achieved a relative improvement of 30–40%."*

### Was am besten funktioniert (Ranking aus dem Paper)
1. **Quotation Addition** – Experten-Zitate einbauen (oft bester Einzeleffekt)
2. **Statistics Addition** – vage Aussagen durch konkrete Zahlen ersetzen
3. **Cite Sources** – glaubwürdige Quellen referenzieren ("laut Studie X von 2024…")
4. **Fluency Optimization** – sauberer, flüssiger, gut lesbarer Text
5. **Technical Terms** – Fachbegriffe (hilft bei fachlichen Anfragen)

### Was NICHT funktioniert — wichtige Korrektur
**Verifiziert:** **Keyword-Stuffing** war die **schwächste** Methode, teilweise mit **negativem** Effekt. Klassische SEO-Tricks (Keyword-Dichte, Keyword-Variationen reinpressen) bringen für generative Engines **nichts**. Das deckt sich exakt mit Googles Stance oben.

### Nuancen / Caveats (ehrlich)
- **Domänenabhängig:** Welche Taktik gewinnt, hängt vom Thema ab. Für **Fakten/rechtliche Themen** → Cite Sources + Statistics. Für **erklärende/soziale Themen** → Quotation. Für Handwerk (technisch-faktisch, lokal) sind **Statistiken, Quellen und klare Definitionen** am wirksamsten.
- **Passage-Level, nicht Page-Level:** LLMs extrahieren kleine Textbausteine. Jeder Absatz muss für sich allein zitierbar sein (atomar, 2–4 Sätze, eine Idee).
- **Position zählt:** Frühe Erwähnung in der AI-Antwort = mehr Sichtbarkeit als späte (Position-Adjusted Word Count).
- **GEO hilft schwächeren Seiten am meisten:** Auch eine auf Platz 5 rankende Seite kann in AI-Antworten stark sichtbar werden, wenn ihr Inhalt evidenzbasierter ist als der der Konkurrenz.
- **Methodenkritik:** Das Paper testete in einem nachgebauten LLM-Setup, nicht live in ChatGPT/Google. Die 40 % sind ein Laborwert. Richtung und Prinzip sind aber durch die Praxis 2025/26 breit bestätigt.

**Quellen:** https://arxiv.org/abs/2311.09735 · https://arxiv.org/pdf/2311.09735

---

## On-Page-SEO-Fundament

Das Pflichtprogramm — für klassisches Ranking UND als Basis für AI-Zitierfähigkeit.

**Titles & Meta**
- Title-Tag: `Dienstleistung + Ort`, max. ~60 Zeichen. Bsp: `Elektriker Musterstadt-Mitte | Meisterbetrieb Muster`
- Meta-Description: ~150–160 Zeichen, mit Nutzen + Ort + Call-to-Action. (Wird von AI-Engines selten direkt genutzt, aber gut für CTR.)
- Pro Seite ein **eindeutiges** Title/Meta-Paar.

**Headings**
- Genau **eine H1** pro Seite, mit Hauptkeyword + Ort.
- H2/H3 als **Fragen** formulieren, die Kunden tatsächlich stellen ("Was kostet eine Elektroinstallation in Musterstadt?"). Frage-als-Heading + direkte Antwort darunter ist das wirksamste GEO-Muster nach FAQ-Deprecation (siehe Structured Data).

**Interne Verlinkung**
- Von der Startseite zu allen Leistungs- und Standortseiten verlinken.
- Beschreibende Ankertexte ("Heizungsnotdienst Musterstadt"), keine "hier klicken".
- Google nennt interne Verlinkung explizit als AI-Feature-Faktor.

**Core Web Vitals (Zielwerte 2026)**
- **LCP** ≤ 2,5 s
- **INP** ≤ 200 ms (hat FID abgelöst)
- **CLS** ≤ 0,1
- Mobile First: >70 % lokaler Suchen sind mobil. Touch-Targets ≥ 48 px, Schrift ≥ 16 px, klickbare Telefonnummer als `tel:`-Link.

**Text vor Bild:** Kernaussagen (Leistungen, Preise, Einzugsgebiet, Öffnungszeiten) müssen als echter Text im HTML stehen — nicht nur in Bildern oder als reines JS-Rendering. Sonst sehen weder Googlebot noch AI-Crawler sie.

---

## Citable Copy Patterns (mit Handwerk-Beispielen)

Schreibregeln, die direkt aus dem GEO-Paper folgen. Jeder Abschnitt einer Handwerker-Seite sollte mindestens **eine** Statistik, Quelle oder ein Zitat enthalten.

**1. Direkte Antwort zuerst (Definition-Style)**
> ❌ "Wir kümmern uns um alles rund um Ihre Heizung."
> ✅ "Eine Heizungswartung kostet in Deutschland durchschnittlich 120–180 €. Unser Meisterbetrieb in Musterstadt wartet Gas-, Öl- und Wärmepumpenheizungen innerhalb von 48 Stunden."

**2. Statistik einbauen**
> ✅ "Laut Verbraucherzentrale senkt eine jährliche Heizungswartung den Energieverbrauch um bis zu 15 %."
> ✅ "Rund 46 % aller Google-Suchen haben lokalen Bezug — deshalb finden Sie uns direkt für Ihren Stadtteil."

**3. Quelle/Autorität verankern**
> ✅ "Gemäß GEG (Gebäudeenergiegesetz 2024) müssen Öl- und Gasheizungen ab … — wir beraten Sie herstellerunabhängig."
> ✅ "Nach Vorgabe der Handwerkskammer …"

**4. Experten-/Inhaber-Zitat**
> ✅ "'Eine fachgerecht installierte Wärmepumpe spart über 10 Jahre mehrere Tausend Euro Heizkosten', sagt Heizungsbaumeister Thomas Müller."

**5. Q&A-Blöcke (echte Kundenfragen)**
> H2: "Was kostet ein Notdienst-Einsatz beim Klempner in Hamburg?"
> Antwort: 2–4 Sätze, konkret, mit Zahl/Spanne.

**6. Entity-Konsistenz**
- Firmenname, Adresse, Telefonnummer, Leistungen **überall identisch** schreiben (Website, GBP, Verzeichnisse). LLMs bauen daraus eine konsistente "Entität" — Widersprüche kosten Vertrauen und Zitierfähigkeit.
- Eigenen Markennamen + Ort + Leistung in einem Satz koppeln: "Elektro Muster, Ihr Elektromeister in Musterstadt-Mitte".

**7. Unterfragen mitbeantworten (Query Fan-out)**
Moderne AI-Systeme zerlegen eine Frage in mehrere Unterfragen und suchen zu jeder einzeln — Google nennt das für den AI Mode **Query Fan-out**. Aus „PV-Anlage mit Speicher fürs Einfamilienhaus in Meschede" werden im Hintergrund u. a.: *Kosten pro kWp 2026 · Speichergröße für 4 Personen · Förderung NRW · Amortisationsdauer · Ablauf Netzanschluss*.
> Wer diese Unterfragen auf **einer** Seite beantwortet, wird deutlich wahrscheinlicher zur Quelle.

**Im Build so einsetzen:** vor dem Texten die Unterfragen einsammeln (eine AI direkt fragen: *„Mach ein Query Fan-out zu [Thema] und zeig mir alle Unterfragen"*). Das Ergebnis ist die **Gliederung** der Seite und speist unmittelbar die Q&A-Blöcke aus Pattern 5.

**Grundhaltung:** Inhalte sollen aussehen wie **belastbare Evidenz**, die ein LLM 1:1 als Antwortbaustein übernehmen kann — faktisch, strukturiert, verifizierbar. Keine Marketing-Floskeln.

---

## Structured Data (Schema.org)

**Grundregel von Google (verifiziert):** Strukturierte Daten müssen mit dem **sichtbaren Text** der Seite übereinstimmen. Ungenutztes/falsches Markup schadet zwar i.d.R. nicht direkt, kann aber als Qualitätsproblem gewertet werden.

### Status der Schema-Typen (Stand Juni 2026) — wichtige Korrekturen

| Typ | Status | Was tun |
| --- | --- | --- |
| **LocalBusiness** (+ Unterklasse, z. B. `Electrician`, `Plumber`, `RoofingContractor`, `HVACBusiness`) | **Voll unterstützt, zentral** | Pflicht auf jeder Handwerker-Site |
| **Service** | Unterstützt | Pro Leistung sinnvoll |
| **Review / AggregateRating** | **Unterstützt, erzeugt weiterhin Rich Results** | Nur mit echten, verifizierbaren Bewertungen |
| **BreadcrumbList** | **Unterstützt, erzeugt Rich Results** | Empfohlen |
| **Organization** | Unterstützt | Für Marke/Logo/Sitelinks |
| **FAQPage** | **Rich Result GESTRICHEN (siehe unten)** — Schema-Typ aber weiter gültig | Markup darf bleiben, aber **kein** SERP-Effekt mehr |
| **HowTo** | **Rich Result deprecated (Desktop seit Sep 2023)** | Markup ohne Rich-Result-Nutzen |

### Korrektur: FAQ- und HowTo-Schema — VERALTETE BERATUNG ENTLARVT

**Umstritten / häufig falsch beraten:** Viele ältere (auch GROK-/2024-) Guides empfehlen FAQPage- und HowTo-Schema als "AI-Booster". Das ist **überholt**:

- **HowTo:** Rich Results auf Desktop **seit September 2023 abgeschafft** (deprecated).
- **FAQPage:** Google hat FAQ-Rich-Results bereits 2023 auf wenige autoritative Behörden-/Gesundheitsseiten beschränkt und am **7. Mai 2026 endgültig komplett abgeschaltet.** FAQ-Rich-Results erscheinen **nicht mehr** in Google. Zeitplan: SC-Reporting + Rich-Results-Test fallen **Juni 2026**, SC-API-Daten **August 2026**.
- **Aber:** Der **Schema-Typ FAQPage bleibt gültig.** Markup muss nicht entfernt werden (außer es beschreibt nicht-vorhandene Inhalte). Andere Crawler (Bingbot, PerplexityBot, RAG-Crawler) parsen es weiter.

**Verifiziert, was AI-Zitate angeht (ehrlich, gemischt):**
- Microsoft (Fabrice Canel, März 2025) bestätigt: Schema hilft den LLMs für Copilot beim Verstehen.
- Eine Search/Atlas-Studie (Dez. 2024) fand **keine Korrelation** zwischen Schema-Abdeckung und Zitationsrate über AI-Plattformen.
- OpenAI/Anthropic/Perplexity haben **keine** offizielle JSON-LD-Guidance veröffentlicht.

**Verdict:** Die **sichtbare Q&A-Formatierung** auf der Seite (Frage als H2/H3 + direkte Antwort) macht die eigentliche Arbeit für AI-Zitate — **nicht** das JSON-LD allein. FAQ-Schema ist "billige Versicherung mit unklarem Upside": dranlassen, aber nicht als Hauptstrategie verkaufen. **Setze auf echte Q&A im Body, nicht auf den FAQ-Rich-Result.**

### Code-Snippets

**LocalBusiness (Pflicht, Beispiel Elektriker):**
```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Electrician",
  "name": "Elektro Muster GmbH",
  "image": "https://elektro-mueller.de/logo.jpg",
  "@id": "https://elektro-mueller.de",
  "url": "https://elektro-mueller.de",
  "telephone": "+49-89-1234567",
  "priceRange": "€€",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Leopoldstraße 12",
    "addressLocality": "Musterstadt",
    "postalCode": "80802",
    "addressCountry": "DE"
  },
  "geo": { "@type": "GeoCoordinates", "latitude": 48.1610, "longitude": 11.5860 },
  "areaServed": { "@type": "City", "name": "Musterstadt" },
  "openingHoursSpecification": [{
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
    "opens": "08:00", "closes": "17:00"
  }],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8", "reviewCount": "127"
  }
}
</script>
```
> `aggregateRating` nur einbauen, wenn echte, auf der Seite sichtbare Bewertungen existieren — sonst Policy-Verstoß.

**Service (pro Leistung):**
```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Wärmepumpen-Installation",
  "provider": { "@type": "Electrician", "name": "Elektro Muster GmbH" },
  "areaServed": { "@type": "City", "name": "Musterstadt" },
  "description": "Installation und Wartung von Wärmepumpen durch Meisterbetrieb in Musterstadt."
}
</script>
```

**BreadcrumbList:** Standard-Markup auf Unterseiten — verbessert Verständnis der Seitenstruktur für Crawler und AI.

---

## Technical: robots.txt für AI-Crawler + die llms.txt-Frage

### robots.txt — AI-Crawler steuern

Für einen Handwerker, der **maximale AI-Sichtbarkeit** will, lautet die Standardempfehlung: **Search-/Antwort-Bots erlauben.** (Training-Bots zu blocken ist optional und Geschmackssache — es ändert nichts an der Sichtbarkeit in AI-Suche, nur am Mitlernen.)

**Wichtige Unterscheidung (verifiziert, Momentic-Crawler-Liste Nov 2025):**
- **Search-/Antwort-Bots** (für Sichtbarkeit in AI-Antworten **erlauben**): `OAI-SearchBot` (ChatGPT-Suche), `PerplexityBot`, `Bingbot` (Copilot), `Googlebot`.
- **User-getriggerte Bots** (erlauben): `ChatGPT-User`, `Perplexity-User`, `ClaudeBot` (Citation-Fetch in Claude-Chats).
- **Training-Crawler** (blocken = nur Opt-out aus Modelltraining, **kein** Effekt auf Sichtbarkeit): `GPTBot`, `anthropic-ai`, `Google-Extended` (reines robots.txt-Token, nutzt Googlebot-UA), `CCBot`.

**Empfohlene robots.txt für maximale AI-Sichtbarkeit (Handwerk):**
```
# Suche & klassisches Indexing — ERLAUBEN
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

# User-getriggerte AI-Besuche — ERLAUBEN
User-agent: ChatGPT-User
Allow: /

User-agent: Perplexity-User
Allow: /

User-agent: ClaudeBot
Allow: /

# Optional: Modell-Training opt-out (ändert NICHTS an AI-Such-Sichtbarkeit)
# User-agent: GPTBot
# Disallow: /
# User-agent: Google-Extended
# Disallow: /
# User-agent: anthropic-ai
# Disallow: /

# Alle übrigen
User-agent: *
Allow: /

Sitemap: https://elektro-mueller.de/sitemap.xml
```

**Best Practices (verifiziert):**
- Nach jedem `User-agent:` mindestens eine `Allow:`/`Disallow:`-Zeile — ein nackter Name tut nichts.
- Leerzeilen zwischen Blöcken.
- `User-agent: *` allein reicht **nicht** — manche AI-Bots ignorieren den Wildcard, daher wichtige Bots explizit listen.
- **Wichtig für Handwerker-Hosting:** Prüfen, dass CDN/Firewall (z. B. Cloudflare-Default) AI-Bots nicht heimlich blockt. Google nennt das explizit als Fehlerquelle. Test-Tools: Knowatoa AI Search Console, Merkle robots.txt Tester.
- robots.txt ist **nicht** bindend — seriöse Bots halten sich dran, andere nicht. Für echtes Blocken: Firewall/IP-Regeln.

### Die llms.txt-Frage — VERDICT (Korrektur veralteter Beratung)

**Umstritten — und die ehrliche Wahrheit für Juni 2026:**

`llms.txt` ist ein vorgeschlagener Standard (Markdown-Datei im Root, die die wichtigsten Seiten für LLMs auflistet). **Es bringt derzeit nachweislich wenig bis nichts für die AI-Such-Sichtbarkeit.**

**Verifiziert (Google / John Mueller, mehrfach 2025–Jan 2026):**
- Google **nutzt llms.txt nicht** und **endorsed es nicht.** Mueller (Jan 2026, Bluesky), gefragt ob Googles eigene llms.txt-Dateien ein Endorsement seien: *"to be direct, no."*
- Mueller verglich llms.txt mit dem längst toten **Meta-Keywords-Tag.**
- Google-Aussagen in Serie: "niemand nutzt es", "Google wird es nicht nutzen", "kann nutzlos sein", "am besten noindex setzen, falls man es hat".
- Auch **OpenAI** hat bestätigt, llms.txt nicht zum Crawlen zu nutzen.

**Was GROK-/ältere Beratung oft falsch sagt:** "Füg eine llms.txt hinzu, dann zitiert dich ChatGPT." Das ist **nicht belegt.** Kein großer AI-Anbieter wertet die Datei aktuell für Such-/Zitationszwecke aus.

**Pragmatisches Verdict für den Builder:**
- **Kein Pflicht-Feature.** Nicht als "AI-Boost" verkaufen.
- Schadet i.d.R. nicht, eine zu haben — aber sie ersetzt **nichts**. Die Arbeit liegt in echtem, evidenzbasiertem, sauber indexiertem Content (siehe oben).
- Falls eingebaut: schlank halten, auf die echten Kernseiten zeigen, ggf. `noindex` für die Datei selbst.
- **Priorität:** robots.txt korrekt (Search-Bots erlauben) ≫ saubere XML-Sitemap ≫ (optional, niedrig) llms.txt.

**Quellen:** https://www.seroundtable.com/google-does-not-endorse-llms-txt-40789.html · https://www.searchenginejournal.com/google-says-llms-txt-comparable-to-keywords-meta-tag/544804/ · https://momenticmarketing.com/blog/ai-search-crawlers-bots

---

## Local SEO für Handwerker

**Verifiziert (Whitespark Local Search Ranking Factors / dt. Aufbereitung 2026), Gewichtung im Local Pack:**

| # | Faktor | Gewicht | Hebel |
| --- | --- | --- | --- |
| 1 | **Google Business Profile (GBP)** | ~36 % | Kategorie, Vollständigkeit, Fotos, Beiträge |
| 2 | **Bewertungen** | ~17 % | Anzahl, Schnitt, Aktualität, Antwortrate |
| 3 | **On-Page (Website)** | ~16 % | Lokale Keywords, Schema, NAP im Footer |
| 4 | **Lokale Backlinks** | ~13 % | IHK/HWK, Partner, Regionalmedien |
| 5 | **Nutzerverhalten** | ~9 % | CTR, Klicks auf Anrufen/Route |
| 6 | **NAP-Konsistenz** | ~7 % | Einheitliche Daten überall |
| 7 | **Citations** | ~2 % | Verzeichniseinträge |

Googles drei offizielle Kernkriterien: **Relevanz · Entfernung (Proximity) · Bekanntheit (Prominence).**

### Google Business Profile (wichtigster Hebel)
1. **Präzise Primärkategorie** wählen — z. B. "Elektriker", nicht "Handwerker". Bis zu 9 Sekundärkategorien für Nebenleistungen.
2. **Alle Felder** ausfüllen: NAP, Website, Öffnungszeiten (inkl. Sonderzeiten), Kurzbeschreibung, Leistungen, Attribute.
3. **Fotos:** min. 10, monatlich 1–2 neue (Außen, Innen, Team, Projekte, Logo). Titelbild 1080×608 px.
4. **GBP-Beiträge:** 1–2/Monat (Angebote, Projekte, News) — signalisiert aktives Profil.
5. **Q&A pflegen:** häufige Fragen selbst anlegen + beantworten.
6. **Insights** monatlich auswerten (Aufrufe, Anrufe, Routenklicks, Suchbegriffe).

### NAP-Konsistenz
**N**ame, **A**dresse, **P**hone **identisch** überall. Typische Fehler: "Str." vs. "Straße", alte Telefonnummer, www vs. non-www, abweichende Namensschreibweisen. Audit über: Website (Impressum, Kontakt, Footer), GBP, Bing Places, Apple Maps, Gelbe Seiten, Das Örtliche, Yelp, Facebook, Instagram.

### Lokale Landingpages
- **Eine optimierte Seite pro Standort/Stadtteil** mit **einzigartigem** Content (keine Dubletten mit nur ausgetauschtem Ortsnamen).
- Keyword-Muster: `Dienstleistung + Ort` (Title/H1), Stadtteil-Seiten für Großstädte, "in meiner Nähe" wird über GBP+Proximity abgedeckt.
- NAP im Footer jeder Seite, identisch mit GBP.

### Deutsche Citation-Quellen (Prioritätsreihenfolge)
1. **Google Unternehmensprofil** (Pflicht)
2. **Bing Places**
3. **Apple Maps** (Apple Business Connect)
4. **Gelbe Seiten**
5. **Das Örtliche**
6. **Yelp**
7. **Facebook / Instagram**
8. **Branchenspezifisch für Handwerk: MyHammer**, ggf. Wer-liefert-was, regionale Branchenportale, Handwerkersuche der HWK.

> **Hinweis:** Für viele kleine lokale Betriebe reicht ein top gepflegtes GBP + Handvoll seriöser Verzeichnisse. Masse an Billig-Citations bringt wenig (Citations nur ~2 % Gewicht). Qualität/Konsistenz > Quantität.

### Bewertungen (zweitwichtigster Faktor)
- **Vier Dimensionen:** Anzahl, Durchschnitt, Aktualität, Antwortrate (Ziel >80 %).
- Direkten Bewertungslink nach **jedem** Auftrag teilen. Kontinuierlich sammeln, nicht in Schüben.
- **Alle** Bewertungen binnen 48 h beantworten (auch negative, sachlich).
- Bewertungen auf Drittplattformen (MyHammer, Yelp, Facebook) zahlen auf Prominence ein.

---

## E-E-A-T-Signale für eine Handwerk-Site

E-E-A-T (Experience, Expertise, Authoritativeness, Trust) ist das, was Google und LLMs als Vertrauenssignal lesen. Konkret auf der Site platzieren:

- **Meisterbrief / Qualifikation:** "Eingetragener Meisterbetrieb", Meistertitel des Inhabers, ggf. Bild der Urkunde.
- **Innungs-/HWK-Mitgliedschaft:** Logo + Verlinkung (zählt auch als wertvoller lokaler Backlink, wenn die HWK/Innung zurückverlinkt).
- **Autor-/Inhaber-Bio:** Echte Person mit Namen, Foto, Jahren Erfahrung, Spezialgebiet. ("Thomas Müller, Elektromeister, seit 2005, Schwerpunkt Wärmepumpen.")
- **Referenzen/Projekte:** Echte Vorher-Nachher-Bilder, Projektbeschreibungen mit Ort und Jahr.
- **Echte Kundenstimmen** (mit Zustimmung), idealerweise verifizierbar über GBP/MyHammer.
- **Garantien & Sicherheit:** Gewährleistung, Festpreisgarantie, Versicherungsnachweis, Zertifizierungen (z. B. VDE, Fachbetrieb nach §… ).
- **Vollständiges Impressum + Datenschutz** (in DE rechtlich Pflicht; zugleich starkes Trust-/Entity-Signal).
- **Konkrete Fakten:** Einzugsgebiet, Preisspannen, Reaktionszeiten, erreichbare Telefonnummer — genau die Inhalte, die AI-Engines zitieren.

---

## Messung / KPIs

**Klassisch + AI gemischt:**
- **Google Search Console:** AI Overviews & AI Mode laufen in den normalen "Web"-Suchtyp ein (kein separater Report). Performance-Report beobachten; Google sagt: Klicks aus AI-Overview-Seiten sind tendenziell **höherwertig** (längere Verweildauer).
- **GBP-Insights:** Profilaufrufe, Anrufe, Routenklicks, Suchbegriffe — direkter lokaler Lead-Indikator.
- **Core Web Vitals** (PageSpeed Insights / CrUX): LCP, INP, CLS im grünen Bereich halten.
- **Lokale Rankings:** Position im Local Pack für `Leistung + Ort` (z. B. mit Local-Rank-Tracker).
- **AI-Visibility-Audit (manuell, monatlich):** Für 20–50 relevante Anfragen ("Elektriker Musterstadt Wärmepumpe", "Was kostet …") in **ChatGPT, Perplexity, Gemini, Google AI Mode** prüfen: Wird der Betrieb genannt? Wer wird stattdessen zitiert? → Baseline + Vorher/Nachher.
- **Bewertungs-KPIs:** Anzahl, Schnitt, Antwortrate (>80 %), Wachstumsrate.
- **NAP-Audit:** quartalsweise auf Konsistenz prüfen.

**Tools:** Search Console, Google Analytics, GBP-Insights, PageSpeed Insights, Knowatoa AI Search Console (robots.txt vs. AI-Bots), Merkle robots.txt Tester, Schema Markup Validator (validator.schema.org).

---

## Quellen

- Google Search Central — AI features and your website: https://developers.google.com/search/docs/appearance/ai-features
- Google — Changes to HowTo and FAQ rich results (2023): https://developers.google.com/search/blog/2023/08/howto-faq-changes
- Aggarwal et al. — GEO: Generative Engine Optimization (arXiv:2311.09735, KDD 2024): https://arxiv.org/abs/2311.09735 · PDF: https://arxiv.org/pdf/2311.09735
- FAQ Rich Results Deprecation (7. Mai 2026), Analyse: https://www.getpassionfruit.com/blog/what-changed-with-google-drops-faq-rich-results-and-what-to-do-now
- Google does not endorse llms.txt (Mueller, Jan 2026): https://www.seroundtable.com/google-does-not-endorse-llms-txt-40789.html
- Google says llms.txt comparable to meta keywords (Search Engine Journal): https://www.searchenginejournal.com/google-says-llms-txt-comparable-to-keywords-meta-tag/544804/
- AI Search Crawlers + User Agents (Momentic, Nov 2025): https://momenticmarketing.com/blog/ai-search-crawlers-bots
- Local SEO Rankingfaktoren 2026 (dt., Whitespark-basiert): https://www.local-seo-agentur.de/local-seo-rankingfaktoren
- awesome-generative-engine-optimization (kuratierte Tool-/Guide-Liste): https://github.com/amplifying-ai/awesome-generative-engine-optimization
- krillinai/GEO (praktisches Playbook): https://github.com/krillinai/GEO

---

## Herkunft der Konzepte „Mention/Citation", „Grounding", „Query Fan-out" (ergänzt 2026-07-17)

Diese drei Konzepte kamen über einen externen GEO-Kurs herein (*„In ChatGPT und Co. gefunden werden"*, Module 1–3). **Der Kurs belegt keine einzige seiner Zahlen** — u. a. „44 % der ChatGPT-Empfehlungen stammen aus Top-Listen", „bis zu −60 % Klicks bei AI-Antworten", „−2,5 % organischer Traffic gesamt", ChatGPT-Marktanteil „Richtung 50 %".

Übernommen wurden deshalb **ausschließlich Mechanismus und Terminologie — keine dieser Zahlen.** Wer eine davon verwenden will, muss sie vorher selbst belegen. Offene Punkte dazu: `tasks/backlog.md`.
