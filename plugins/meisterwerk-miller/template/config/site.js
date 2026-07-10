/**
 * ============================================================================
 *  MEISTERWERK v2 (Miller-Edition) — ZENTRALE DATEN-DATEI
 * ============================================================================
 *  Die EINZIGE Datei, die du pro Kunde personalisierst. Sie deckt alle Seiten
 *  ab (Home + Leistungen/Über-uns/Karriere/Kontakt).
 *
 *  HINWEIS: Alle Werte hier sind eindeutig fiktive DEMO-Platzhalter
 *  (Musterwerk Bedachungen GmbH). Beim Personalisieren pro Kunde ersetzen.
 *  Keine echten Kundendaten in dieser Vorlage.
 *
 *  Läuft als Browser-Global (window.SITE) UND als Node-Import (module.exports).
 * ============================================================================
 */
const SITE = {
  /* ---- Theme: einzige Farb-/Font-Stellschraube (Miller-Tokens sind Default) ---- */
  theme: {
    dark: "#1C3F60",        // Navy — Primär (CTAs, Header-Logo-Text, Footer)
    light: "#F5F8FB",       // heller Section-Hintergrund
    key1: "#6A93B0",        // Steel-Blue — Akzent (Hover, Fokus-Ring, Rollen)
    key2: "#8A1F1F",        // Dunkelrot — sparsamer Sekundärakzent
    offwhite: "#F0EDE8",    // warmes Off-White (Text auf Navy)
    radius: "8px",
    headerFont: "Albert Sans",
    bodyFont: "Albert Sans",
  },

  /* ---- Stammdaten / NAP (Footer, Impressum, Kontakt, JSON-LD) — DEMO ---- */
  business: {
    name: "Musterwerk Bedachungen",
    legalName: "Musterwerk Bedachungen GmbH",
    logo: "/assets/placeholders/company-logo.svg",
    tagline: "Ihr Meisterbetrieb für Dach und Fassade in Musterstadt und Umgebung.",
    phone: "+49 123 4567890",
    phoneHref: "tel:+491234567890",
    email: "info@example.de",
    addr: { street: "Musterstraße 12", zip: "12345", city: "Musterstadt", region: "Musterstadt und Umgebung" },
    social: {}, // Demo: keine Profile
  },

  /* ---- Navigation ---- */
  nav: [
    { label: "Startseite", href: "/" },
    { label: "Über uns", href: "/ueber-uns" },
    { label: "Leistungen", href: "/leistungen" },
    { label: "Karriere", href: "/karriere" },
    { label: "Kontakt", href: "/kontakt" },
  ],
  cta: { label: "Kostenlose Beratung", href: "/kontakt" },

  /* ---- HERO (Full-Bleed-Foto + zentrierter weißer Text + Marken-Marquee) ---- */
  hero: {
    bg: "/assets/placeholders/hero-roofing.svg",
    eyebrow: "Persönlich. Zuverlässig. Termintreu.",
    h1: "Dach mit Zukunft.<br>Qualität vom Meisterbetrieb.",
    sub: "Mit langjähriger Erfahrung für Sie im Einsatz mit hochwertigen Dacharbeiten, Wartungen und Sanierungen in Musterstadt und Umgebung.",
    button: { label: "Jetzt beraten lassen", href: "/kontakt" },
  },

  /* ---- HERO-VARIANTE: "v1" (Standard, Full-Bleed-Foto) | "v2" (Scroll-Scrub, Kairos-Prinzip).
     v2 NUR auf ausdrücklichen Wunsch des Nutzers ("v2 hero"). Integration: template/hero-v2/README.md ---- */
  heroVariant: "v1",
  heroV2: {
    image: "/assets/placeholders/hero-roofing.svg", // 16:9-Motiv; füllt Hintergrund UND Wortmarke
    wordmark: "MUSTERWERK",        // Betriebsname, kurz (ideal <= 8 Zeichen)
    focusY: "42%",                 // vertikaler Bildfokus
    accent: "",                    // leer = --key2 aus dem Theme
  },

  /* ---- Marken-Marquee (Partner-/Hersteller-Logos; Trust-Signal) — DEMO-Platzhalter ---- */
  brands: [
    { name: "Partnermarke", src: "/assets/placeholders/brand-logo.svg" },
    { name: "Partnermarke", src: "/assets/placeholders/brand-logo.svg" },
    { name: "Partnermarke", src: "/assets/placeholders/brand-logo.svg" },
    { name: "Partnermarke", src: "/assets/placeholders/brand-logo.svg" },
  ],

  /* ---- Team-Intro (Text + 2×2-Bildraster) ---- */
  aboutIntro: {
    h2: "Ein starkes Team, das anpackt und hält, was es verspricht.",
    body: [
      "Als jung geführter Meisterbetrieb stehen wir seit vielen Jahren für zuverlässige, saubere und termingerechte Dacharbeiten in Musterstadt und Umgebung.",
      "Ob Steildach, Flachdach, Fassaden oder Wartung, wir gehen individuell auf Ihr Anliegen ein.",
    ],
    button: { label: "Mehr über uns erfahren", href: "/ueber-uns" },
    images: [
      "/assets/placeholders/photo-roofing.svg",
      "/assets/placeholders/photo-roofing.svg",
      "/assets/placeholders/photo-roofing.svg",
      "/assets/placeholders/photo-roofing.svg",
    ],
  },

  /* ---- QUIZ-FUNNEL (mehrstufig; Lead-Gen-Kernstück, shadcn-Optik) ---- */
  quiz: {
    h3: "In 5 Schritten zur schnellen Dachberatung",
    sub: "Beantworten Sie uns ein paar kurze Fragen und wir melden uns schnellstmöglich mit einem individuellen Vorschlag.",
    bg: "/assets/placeholders/photo-roofing.svg",
    steps: [
      { type: "multi", label: "Welche Leistung brauchen Sie?", options: ["Neues Dach", "Dachsanierung", "Reparatur / Wartung", "Fassadenarbeiten", "Dachbegrünung / Solar"] },
      { type: "single", label: "Um welches Objekt geht es?", options: ["Einfamilienhaus", "Mehrfamilienhaus", "Gewerbeobjekt", "Sonstiges"] },
      { type: "text", label: "Wo befindet sich das Objekt?", fields: [{ id: "ort", placeholder: "PLZ / Ort" }] },
      { type: "select", label: "Wann soll es losgehen?", options: ["zeitnah", "in 1–3 Monaten", "später"] },
      { type: "contact", label: "Ihre Kontaktdaten", fields: ["Vorname", "Nachname", "Telefon", "E-Mail"] },
    ],
  },

  /* ---- Leistungen (6 Cards Home + Detail-Zeilen /leistungen) ---- */
  services: [
    { title: "Steildach & Ziegeldach", img: "/assets/placeholders/photo-roofing.svg", teaser: "Fachgerechte Eindeckung von Steildächern mit hochwertigen Materialien.", bullets: ["Neueindeckung & Umdeckung", "Ziegel-, Beton- & Naturschiefer", "Unterspannbahnen & Dämmung"] },
    { title: "Flachdach & Abdichtung", img: "/assets/placeholders/photo-roofing.svg", teaser: "Planung und Abdichtung von Flachdächern, langlebig, dicht und sicher.", bullets: ["Bitumen- & Kunststoffbahnen", "Flüssigkunststoff-Abdichtung", "Entwässerung & Detailanschlüsse"] },
    { title: "Dachsanierung", img: "/assets/placeholders/photo-roofing.svg", teaser: "Energieeffizient und werterhaltend nach aktuellen Standards.", bullets: ["Energetische Dachdämmung", "Komplettsanierung aus einer Hand", "Beratung zu Fördermöglichkeiten"] },
    { title: "Wartung und Reparatur", img: "/assets/placeholders/photo-roofing.svg", teaser: "Regelmäßige Wartung verlängert die Lebensdauer Ihres Daches.", bullets: ["Dachinspektion & Wartungsvertrag", "Sturm- & Sofortreparaturen", "Rinnenreinigung & Abdichtung"] },
    { title: "Dachbegrünung", img: "/assets/placeholders/photo-roofing.svg", teaser: "Mehr Natur, bessere Luft und ein gesünderes Klima auf dem Dach.", bullets: ["Extensive & intensive Begrünung", "Kombination mit Solar möglich", "Nachhaltig & wärmedämmend"] },
    { title: "Spenglerarbeiten & Fassadenverkleidungen", img: "/assets/placeholders/photo-roofing.svg", teaser: "Funktion und Ästhetik: Dachrinnen, Kaminverkleidungen, Blechdächer.", bullets: ["Dachrinnen & Fallrohre", "Metall- & Blechfassaden", "Kamin- & Gaubenverkleidung"] },
  ],

  /* ---- Vorteile + Rating (Demo-Bewertung, kein echter Nachweis) ---- */
  vorteile: {
    rating: { value: "Sehr gut", label: "Demo-Bewertung", avatars: ["/assets/placeholders/avatar.svg"] },
    h2: "Darum entscheiden sich Kunden für uns",
    lead: "Als Meisterbetrieb in Musterstadt stehen wir für sauberes Handwerk, klare Absprachen und Lösungen, die wirklich passen.",
    button: { label: "Jetzt beraten lassen", href: "/kontakt" },
    reasons: [
      { title: "Qualifizierter Meisterbetrieb", body: "Hochwertige Materialien, fachgerechte Ausführung & ein Rundum-Service." },
      { title: "Persönlich und zuverlässig", body: "Feste Ansprechpartner, die Wort halten und Sie zuverlässig begleiten." },
      { title: "Maßgeschneiderte Lösungen", body: "Lösungen, die wirklich zu Ihrem Haus und Ihren Anforderungen passen." },
    ],
    gallery: [
      "/assets/placeholders/photo-roofing.svg",
      "/assets/placeholders/photo-roofing.svg",
      "/assets/placeholders/photo-roofing.svg",
    ],
  },

  /* ---- Team (3D-Karussell; je Person Foto + Rolle + Bio) — 4 fiktive Demo-Personen ---- */
  team: {
    eyebrow: "Bei uns packen echte Profis an",
    h2: "Unser Team stellt sich vor",
    lead: "Ob auf dem Dach, im Büro oder in der Planung, wir ziehen gemeinsam an einem Strang.",
    members: [
      { name: "Max Mustermann", role: "Geschäftsführung", img: "/assets/placeholders/team-member-1.svg", bio: "Steht für ein junges, innovatives Dachhandwerk. Leitgedanke: Dach mit Zukunft." },
      { name: "Erika Musterfrau", role: "Kundenberatung", img: "/assets/placeholders/team-member-2.svg", bio: "Erste Ansprechpartnerin für Anfragen, Angebote und Terminplanung." },
      { name: "Alex Beispiel", role: "Dachdeckermeister", img: "/assets/placeholders/team-member-3.svg", bio: "Sorgt mit Sorgfalt und Erfahrung für beste Arbeit auf der Baustelle." },
      { name: "Sam Muster", role: "Projektleitung", img: "/assets/placeholders/team-member-4.svg", bio: "Behält Termine, Material und Qualität im Blick – von der Planung bis zur Übergabe." },
    ],
  },

  /* ---- FAQ (Minimal-Divider-Stil, single-open) ---- */
  faq: {
    h2: "Häufig gestellte Fragen",
    items: [
      { q: "Bieten Sie eine kostenlose Vor-Ort-Beratung an?", a: "Ja, wir kommen nach Rücksprache gerne unverbindlich vorbei, um Ihr Dach oder Ihre Fassade anzuschauen." },
      { q: "Wie lange dauert eine Dachsanierung?", a: "Das hängt von Größe, Zustand und Witterung ab. Bei der Planung sprechen wir alle Schritte durch." },
      { q: "Arbeiten Sie auch mit Architekten und Hausverwaltungen zusammen?", a: "Ja, wir arbeiten regelmäßig mit Architekten, Hausverwaltungen und Gemeinden zusammen." },
      { q: "Können Sie kurzfristig bei Schäden oder Undichtigkeiten helfen?", a: "In vielen Fällen ja, besonders bei Sturmschäden. Rufen Sie uns einfach direkt an." },
    ],
  },

  /* ---- Über-uns-Seite ---- */
  about: {
    heroBg: "/assets/placeholders/photo-roofing.svg",
    h1: "Ein Meisterbetrieb mit Geschichte und Zukunft",
    story: {
      h2: "Generationen von Erfahrung, frisch weitergedacht",
      body: [
        "Was vor vielen Jahren begann, führen wir heute mit neuem Namen und neuer Energie fort.",
        "Unser eingespieltes Team bleibt dasselbe: erfahrene Dachdecker und Spengler mit Sorgfalt bei der Sache.",
      ],
      img: "/assets/placeholders/photo-roofing.svg",
    },
    values: [
      { title: "Meisterqualität", body: "Hochwertige Materialien und namhafte Hersteller – für Ergebnisse, die halten." },
      { title: "Persönlich & regional", body: "Feste Ansprechpartner, kurze Wege, echte Nähe zur Region." },
      { title: "Nachhaltigkeit", body: "Auf Wunsch nachhaltige, gesundheits- und allergiefreundliche Lösungen." },
    ],
    stats: [
      { value: "viele", label: "Jahre Erfahrung" },
      { value: "starkes", label: "Team" },
      { value: "Sehr gut", label: "Demo-Bewertung" },
      { value: "100%", label: "termintreu" },
    ],
  },

  /* ---- Karriere-Seite ---- */
  karriere: {
    heroBg: "/assets/placeholders/photo-roofing.svg",
    h1: "Karriere bei Musterwerk Bedachungen",
    perks: [
      { title: "Ein Team, das zusammenhält", body: "Kollegen mit Humor, klarer Kommunikation und echtem Zusammenhalt." },
      { title: "Faire, sichere Anstellung", body: "Leistungsgerechte Bezahlung, pünktlich und verlässlich." },
      { title: "Moderne Ausrüstung", body: "Gutes Werkzeug, gepflegte Fahrzeuge, aktuelle Sicherheitsausstattung." },
    ],
    jobs: [
      { title: "Dachdecker / Spengler (m/w/d)", meta: ["Vollzeit", "Musterstadt und Umgebung", "ab sofort"] },
      { title: "Auszubildende:r zum Spengler (m/w/d)", meta: ["Ausbildung", "Musterstadt", "Start flexibel"] },
      { title: "Quereinsteiger:in fürs Dachhandwerk (m/w/d)", meta: ["Vollzeit", "Musterstadt und Umgebung", "mit Einarbeitung"] },
    ],
  },

  /* ---- Geo (bediente Orte → JSON-LD areaServed + lokale Keywords) — DEMO ---- */
  geo: { areaServed: ["Musterstadt und Umgebung"] },

  /* ---- SEO (Demo-Domain + je Seite eindeutiger Title/Description) ---- */
  seo: {
    siteUrl: "https://www.example.de",
    pages: {
      home: { title: "Musterwerk Bedachungen: Ihr Dachdecker in Musterstadt", description: "Dachdecker-Meisterbetrieb in Musterstadt und Umgebung: Steildach, Flachdach, Sanierung, Wartung. Kostenlose Beratung anfordern." },
      leistungen: { title: "Leistungen – Dachdecker & Spengler | Musterwerk Bedachungen", description: "Steildach, Flachdach, Dachsanierung, Wartung, Dachbegrünung und Spenglerarbeiten in Musterstadt und Umgebung." },
      ueberUns: { title: "Über uns – Meisterbetrieb in Musterstadt | Musterwerk Bedachungen", description: "Jung geführter Dachdecker-Meisterbetrieb mit langjähriger Erfahrung in Musterstadt und Umgebung." },
      karriere: { title: "Karriere – Jobs im Dachhandwerk (m/w/d) | Musterwerk Bedachungen", description: "Dachdecker, Spengler und Auszubildende (m/w/d) gesucht. Sicheres Team, faire Bezahlung." },
      kontakt: { title: "Kontakt – Dachdecker in Musterstadt | Musterwerk Bedachungen", description: "Musterstraße 12, 12345 Musterstadt · +49 123 4567890. Fordern Sie Ihre kostenlose Fachberatung an." },
    },
  },
};

if (typeof module !== "undefined" && module.exports) module.exports = SITE;
if (typeof window !== "undefined") window.SITE = SITE;
