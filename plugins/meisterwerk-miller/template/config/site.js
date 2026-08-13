/**
 * ============================================================================
 *  MEISTERWERK v2 (Miller-Edition) — ZENTRALE DATEN-DATEI  (window.SITE)
 * ============================================================================
 *  Die EINZIGE Datei, die pro Kunde personalisiert wird. Sie deckt alle 5
 *  Seiten ab (Home + Leistungen/Über-uns/Karriere/Kontakt). Die tokenisierten
 *  HTML-Vorlagen (template/*.html) werden per render.mjs mit diesem Objekt
 *  gefüllt; `node render-all.mjs` schreibt die fertigen Seiten + Assets.
 *
 *  HINWEIS: Alle Werte hier sind eindeutig fiktive DEMO-Platzhalter
 *  (Musterwerk Bedachungen GmbH, Musterstadt). Keine echten Kundendaten.
 *  HTML-DATEIEN WERDEN NIE VON HAND BEARBEITET — einzige Datenquelle ist diese Datei.
 *  Felder gemäß reference/tokens.md. Werte werden ROH eingesetzt (HTML-sicher liefern).
 *
 *  Läuft als Browser-Global (window.SITE) UND als Node-Import (module.exports).
 * ============================================================================
 */
const SITE = {
  /* ---- HERO-VARIANTE: "v1" (Standard, Full-Bleed-Foto) | "v2" (Scroll-Scrub, Kairos-Prinzip).
     v2 NUR wenn der Lead ausdrücklich "v2 hero"/"Kairos-Hero"/"Scroll-Hero" verlangt. ---- */
  heroVariant: "v1",
  heroV2: {
    image: "/assets/placeholders/hero-roofing.svg", // 16:9-Motiv; füllt Hintergrund UND Wortmarke
    wordmark: "MUSTERWERK",        // Betriebsname, kurz (ideal <= 8 Zeichen)
    focusY: "42%",
    accent: "",                    // leer = --key2 aus dem Theme
  },

  /* ---- Theme: einzige Farb-/Font-Stellschraube ---- */
  theme: {
    dark: "#1C3F60",
    light: "#F5F8FB",
    key1: "#6A93B0",
    key2: "#8A1F1F",
    offwhite: "#F0EDE8",
    radius: "8px",
    headerFont: "Albert Sans",
    bodyFont: "Albert Sans",
  },

  /* ---- Stammdaten / NAP (DEMO) ---- */
  business: {
    name: "Musterwerk Bedachungen",
    legalName: "Musterwerk Bedachungen GmbH",
    shortName: "Musterwerk",
    logo: "/assets/placeholders/company-logo.svg",
    tagline: "Ihr Meisterbetrieb für Dach und Fassade in Musterstadt und Umgebung.",
    footerBlurb: "Ihr Meisterbetrieb für Dach und Fassade in Musterstadt und Umgebung. Persönlich, zuverlässig und termintreu, von der ersten Beratung bis zur Übergabe.",
    phone: "+49 123 4567890",
    phoneHref: "tel:+491234567890",
    email: "info@example.de",
    addr: { street: "Musterstraße 12", zip: "12345", city: "Musterstadt", region: "Musterstadt und Umgebung" },
    addrShort: "Musterstraße 12, 12345 Musterstadt",
    copyright: "© 2026 Musterwerk Bedachungen GmbH · Meisterbetrieb in Musterstadt",
    mapTitle: "Standort Musterwerk Bedachungen, Musterstraße 12, 12345 Musterstadt",
    mapEmbed: "https://www.google.com/maps?q=Musterstra%C3%9Fe%2012,%2012345%20Musterstadt&output=embed",
    social: {
      instagram: "#",
      linkedin: "#",
    },
  },

  /* ---- Navigation (Footer-Spalte „Navigation" via REPEAT) ---- */
  nav: [
    { label: "Startseite", href: "/" },
    { label: "Über uns", href: "/ueber-uns" },
    { label: "Leistungen", href: "/leistungen" },
    { label: "Karriere", href: "/karriere" },
    { label: "Kontakt", href: "/kontakt" },
  ],
  cta: { label: "Kostenlose Beratung", href: "/kontakt" },

  /* ---- HERO (v1). hero.bg + quiz.bg werden von render-all.mjs in styles.css injiziert. ---- */
  hero: {
    bg: "/assets/placeholders/hero-roofing.svg",
    eyebrow: "Persönlich. Zuverlässig. Termintreu.",
    h1: "Dach mit Zukunft.<br>Qualität vom Meisterbetrieb.",
    titleAria: "Dach mit Zukunft. Qualität vom Meisterbetrieb.",
    titleLines: ["Dach mit Zukunft.", "Qualität vom Meisterbetrieb."],
    sub: "Mit langjähriger Erfahrung für Sie im Einsatz mit hochwertigen Dacharbeiten, Wartungen und Sanierungen in Musterstadt und Umgebung.",
    /* CTA fuehrt zum Quiz auf derselben Seite (niedrigste Huerde), nicht auf
       /kontakt — der Besucher bleibt im Fluss statt eine Seite zu wechseln. */
    button: { label: "Jetzt beraten lassen", href: "#beratung" },
    /* Trust-Zeile direkt unter dem CTA (Sterne + Wert + Anzahl). REGEL: nur
       echte Werte aus dem Google-Profil des Betriebs. Gibt es keine, den Block
       auf null setzen — die Zeile entfaellt dann komplett. Der Zweifel des
       Besuchers ist am Button am groessten; genau dort gehoert der Beweis hin. */
    trust: { value: "4,9", count: "Demo-Bewertungen bei Google" },
  },

  /* ---- Quiz-Hintergrund (von render-all.mjs in styles.css .quiz-bg injiziert) ---- */
  quiz: { bg: "/assets/placeholders/photo-roofing.svg" },

  /* ---- Marken-Marquee (Partner-/Herstellerlogos) — DEMO-Platzhalter ---- */
  brands: [
    { name: "Partnermarke", src: "/assets/placeholders/brand-logo.svg" },
    { name: "Partnermarke", src: "/assets/placeholders/brand-logo.svg" },
    { name: "Partnermarke", src: "/assets/placeholders/brand-logo.svg" },
    { name: "Partnermarke", src: "/assets/placeholders/brand-logo.svg" },
  ],

  /* ---- Team-Intro (Home: Text + 2×2-Bildraster) ---- */
  aboutIntro: {
    h2: "Ein starkes Team, das anpackt und hält, was es verspricht.",
    body: [
      "Als jung geführter Meisterbetrieb stehen wir seit vielen Jahren für zuverlässige, saubere und termingerechte Dacharbeiten in Musterstadt und Umgebung.",
      "Ob Steildach, Flachdach, Fassaden oder Wartung, wir gehen individuell auf Ihr Anliegen ein.",
    ],
    button: { label: "Mehr über uns erfahren", href: "/ueber-uns" },
    images: [
      { src: "/assets/placeholders/photo-roofing.svg", alt: "Drei Bauarbeiter stehen auf einem Dach mit Sicherheitsnetz, Dachziegeln und Gerüst." },
      { src: "/assets/placeholders/photo-roofing.svg", alt: "Zwei lächelnde Männer vor einer Stadtkulisse." },
      { src: "/assets/placeholders/photo-roofing.svg", alt: "Zwei junge Männer lächeln auf einem Dach, im Hintergrund ein Baugerüst mit grünem Netz." },
      { src: "/assets/placeholders/photo-roofing.svg", alt: "Zwei Männer installieren ein Dachfenster auf einem grauen Metalldach unter blauem Himmel." },
    ],
  },

  /* ---- Leistungen (6× Home-Cards + 6× Detail-Zeilen /leistungen) ---- */
  services: [
    {
      title: "Steildach &amp; Ziegeldach", titleDetail: "Steildach &amp; Ziegeldach",
      img: "/assets/placeholders/photo-roofing.svg", imgAlt: "Modernes weißes Haus mit schwarzem Dach und Anbau unter blauem Himmel.",
      teaser: "Fachgerechte Eindeckung von Steildächern mit hochwertigen Materialien.",
      detail: "Fachgerechte Eindeckung von Steildächern mit hochwertigen Materialien – langlebig, sturmsicher und optisch stimmig zu Ihrem Haus.",
      bullets: ["Neueindeckung &amp; Umdeckung", "Ziegel-, Beton- &amp; Naturschiefer", "Unterspannbahnen &amp; Dämmung"],
    },
    {
      title: "Flachdach &amp; Abdichtung", titleDetail: "Flachdach &amp; Abdichtung",
      img: "/assets/placeholders/photo-roofing.svg", imgAlt: "Moderne Gebäudeecke mit dunkler Ziegelsteinfassade und hellgrauer Verkleidung.",
      teaser: "Planung und Abdichtung von Flachdächern, langlebig, dicht und sicher, auch bei anspruchsvollen Gegebenheiten.",
      detail: "Planung und Abdichtung von Flachdächern – langlebig, dicht und sicher, auch bei anspruchsvollen Gegebenheiten.",
      bullets: ["Bitumen- &amp; Kunststoffbahnen", "Flüssigkunststoff-Abdichtung", "Entwässerung &amp; Detailanschlüsse"],
    },
    {
      title: "Dachsanierung", titleDetail: "Dachsanierung",
      img: "/assets/placeholders/photo-roofing.svg", imgAlt: "Zwei Arbeiter installieren Solarpaneele auf einem modernen Hausdach.",
      teaser: "Energieeffizient und werterhaltend: Wir modernisieren Ihr Dach nach aktuellen Standards und verbessern dabei Dämmung, Abdichtung und Optik für nachhaltigen Schutz und ein sicheres Zuhause.",
      detail: "Energieeffizient und werterhaltend: Wir modernisieren Ihr Dach nach aktuellen Standards und verbessern dabei Dämmung, Abdichtung und Optik.",
      bullets: ["Energetische Dachdämmung", "Komplettsanierung aus einer Hand", "Beratung zu Fördermöglichkeiten"],
    },
    {
      title: "Wartung und Reparatur", titleDetail: "Wartung &amp; Reparatur",
      img: "/assets/placeholders/photo-roofing.svg", imgAlt: "Modernes Haus mit grauen Dachschindeln und großen Fenstern.",
      teaser: "Regelmäßige Wartung verlängert die Lebensdauer Ihres Daches und verhindert teure Folgeschäden. Wir kümmern uns zuverlässig um Reparaturen, Abdichtungen und die Prüfung kritischer Stellen.",
      detail: "Regelmäßige Wartung verlängert die Lebensdauer Ihres Daches und verhindert teure Folgeschäden. Wir kümmern uns zuverlässig um kritische Stellen.",
      bullets: ["Dachinspektion &amp; Wartungsvertrag", "Sturm- &amp; Sofortreparaturen", "Rinnenreinigung &amp; Abdichtung"],
    },
    {
      title: "Dachbegrünung", titleDetail: "Dachbegrünung",
      img: "/assets/placeholders/photo-roofing.svg", imgAlt: "Begrüntes Dach mit Pflanzen.",
      teaser: "Hundertwasser sagte: Was der Erde unten genommen wird, gehört oben aufs Dach zurück. Genau diesem Gedanken folgen wir: Mit Dachbegrünungen schaffen wir mehr Natur, bessere Luft und ein gesünderes Klima – mitten in der Stadt.",
      detail: "Hundertwasser sagte: Was der Erde unten genommen wird, gehört oben aufs Dach zurück. Mit Dachbegrünungen schaffen wir mehr Natur, bessere Luft und ein gesünderes Klima.",
      bullets: ["Extensive &amp; intensive Begrünung", "Kombination mit Solar möglich", "Nachhaltig &amp; wärmedämmend"],
    },
    {
      title: "Spenglerarbeiten &amp; Fassadenverkleidungen", titleDetail: "Spenglerarbeiten &amp; Fassadenverkleidungen",
      img: "/assets/placeholders/photo-roofing.svg", imgAlt: "Spenglerarbeiten an einer Fassade.",
      teaser: "Unsere Spenglerarbeiten verbinden Funktion und Ästhetik, ob bei Dachrinnen, Kaminverkleidungen oder Blechdächern. Wir verarbeiten langlebige Metalle mit handwerklicher Sorgfalt und Maßarbeit.",
      detail: "Unsere Spenglerarbeiten verbinden Funktion und Ästhetik – ob Dachrinnen, Kaminverkleidungen oder Blechdächer. Langlebige Metalle, handwerkliche Maßarbeit.",
      bullets: ["Dachrinnen &amp; Fallrohre", "Metall- &amp; Blechfassaden", "Kamin- &amp; Gaubenverkleidung"],
    },
  ],

  /* ---- Vorteile (Home) ---- */
  vorteile: {
    rating: {
      value: "Sehr gut",
      label: "Demo-Bewertung",
      avatars: ["/assets/placeholders/avatar.svg"],
    },
    h2: "Darum entscheiden sich Kunden für uns",
    lead: "Als Meisterbetrieb in Musterstadt stehen wir für sauberes Handwerk, klare Absprachen und Lösungen, die wirklich passen. Ob Reparatur oder Komplettsanierung, wir begleiten Sie persönlich von der ersten Beratung bis zur Übergabe. Auch danach bleiben wir für Sie erreichbar, denn echte Zufriedenheit entsteht unserer Meinung nach durch Vertrauen.",
    button: { label: "Jetzt beraten lassen", href: "/kontakt" },
    reasons: [
      { title: "Qualifizierter Meisterbetrieb", body: "Wir zählen zu den erfahrenen Dachdeckern in Ihrer Region – mit hochwertigen Materialien, fachgerechter Ausführung &amp; einem Rundum-Service, auf den Sie sich verlassen können." },
      { title: "Persönlich und zuverlässig", body: "Bei uns haben Sie feste Ansprechpartner. Wir halten Wort, kommunizieren auf Augenhöhe und begleiten Sie zuverlässig vom ersten Gespräch bis zum fertigen Dach." },
      { title: "Maßgeschneiderte Lösungen", body: "Jedes Gebäude, jedes Projekt ist anders. Wir hören genau hin, denken gerne und offen mit und finden Lösungen, die wirklich zu Ihrem Haus und Ihren Anforderungen passen." },
    ],
    gallery: [
      "/assets/placeholders/photo-roofing.svg",
      "/assets/placeholders/photo-roofing.svg",
      "/assets/placeholders/photo-roofing.svg",
      "/assets/placeholders/photo-roofing.svg",
      "/assets/placeholders/photo-roofing.svg",
      "/assets/placeholders/photo-roofing.svg",
      "/assets/placeholders/photo-roofing.svg",
      "/assets/placeholders/photo-roofing.svg",
      "/assets/placeholders/photo-roofing.svg",
    ],
  },

  /* ---- Kundenstimmen (Home) — der Trust-Kern der Seite ----------------------
     REGEL: ausschliesslich ECHTE Bewertungen aus dem Google-Profil des
     Betriebs, woertlich uebernommen (kuerzen erlaubt, umschreiben nicht).
     google.value/count = echter Schnitt + echte Anzahl. Gibt es keine oder zu
     wenige echte Stimmen: den ganzen Block auf null setzen — Sektion und
     Hero-Trust-Zeile entfallen dann. Erfundene Referenzen sind verboten
     (Anti-Trust, rechtlich riskant). ------------------------------------------ */
  testimonials: {
    eyebrow: "Das sagen unsere Kunden",
    h2: "Kunden aus Musterstadt über unsere Arbeit",
    google: { value: "4,9", count: "Demo-Bewertungen" },
    items: [
      { text: "Demo-Referenz: Nach dem Sturm war eine Ziegelreihe weg. Schnell abgesichert, eine Woche später sauber repariert. So muss das sein.", name: "Max Mustermann", place: "Musterstadt" },
      { text: "Demo-Referenz: Komplette Flachdachsanierung auf unserem Mehrfamilienhaus. Der Preis hat exakt gehalten, die Baustelle war jeden Abend aufgeräumt.", name: "Erika Musterfrau", place: "Musterstadt" },
      { text: "Demo-Referenz: Zuverlässiger Partner für unsere Objekte. Termine werden gehalten, die Abrechnung ist nachvollziehbar.", name: "Musterverwaltung GmbH", place: "Musterstadt" },
    ],
  },

  /* ---- Zusagen-Block (unter dem Absende-Button beider Kontaktformulare) ----
     Spezifische Zusagen statt "Zufriedenheitsgarantie"-Badge. REGEL (Service-
     Garantie nach Hormozi): nur zusagen, was der Betrieb SELBST kontrolliert
     (Prozess/Leistung: Festpreis, Reaktionszeit, Baustelle), nie Ergebnisse
     Dritter. Konkret und falsifizierbar formulieren — sonst Punkt streichen.
     Kein passender Inhalt => Block auf null, er entfaellt komplett. ---- */
  garantie: {
    items: [
      "Verbindliches Festpreis-Angebot — was wir vereinbaren, gilt",
      "Rückmeldung innerhalb von 24 Stunden",
      "Baustelle jeden Abend aufgeräumt",
    ],
  },

  /* ---- Team (3D-Karussell) — 4 fiktive Demo-Personen ---- */
  team: {
    eyebrow: "Bei uns packen echte Profis an",
    h2: "Unser Team stellt sich vor",
    lead: "Ob auf dem Dach, im Büro oder in der Planung, wir ziehen gemeinsam an einem Strang. Lernen Sie die Menschen kennen, die in Musterstadt jeden Tag dafür sorgen, dass alles rund läuft.",
    members: [
      { idx: 0, name: "Max Mustermann", role: "Geschäftsführung", img: "/assets/placeholders/team-member-1.svg", alt: "Demo-Platzhalter: Teammitglied 1", bio: "Steht für ein junges, innovatives Dachhandwerk – offen für neue Konzepte &amp; Lösungen. Leitgedanke: Dach mit Zukunft." },
      { idx: 1, name: "Erika Musterfrau", role: "Kundenberatung", img: "/assets/placeholders/team-member-2.svg", alt: "Demo-Platzhalter: Teammitglied 2", bio: "Erste Ansprechpartnerin für Anfragen, Angebote und Terminplanung – freundlich und verlässlich." },
      { idx: 2, name: "Alex Beispiel", role: "Dachdeckermeister", img: "/assets/placeholders/team-member-3.svg", alt: "Demo-Platzhalter: Teammitglied 3", bio: "Sorgt mit Sorgfalt, Erfahrung und Humor für beste Arbeit auf der Baustelle." },
      { idx: 3, name: "Sam Muster", role: "Projektleitung", img: "/assets/placeholders/team-member-4.svg", alt: "Demo-Platzhalter: Teammitglied 4", bio: "Behält Termine, Material und Qualität im Blick – von der Planung bis zur Übergabe." },
    ],
  },

  /* ---- FAQ ---- */
  faq: {
    h2: "Häufig gestellte Fragen",
    items: [
      { q: "Bieten Sie eine kostenlose Vor-Ort-Beratung an?", a: "Ja, wir kommen nach Rücksprache gerne unverbindlich vorbei, um Ihr Dach oder Ihre Fassade anzuschauen. So können wir Sie gezielt beraten und ein faires Angebot erstellen." },
      { q: "Wie lange dauert eine Dachsanierung?", a: "Das hängt von Größe, Zustand und Witterung ab. Bei der Planung sprechen wir alle Schritte mit Ihnen durch." },
      { q: "Arbeiten Sie auch mit Architekten und Hausverwaltungen zusammen?", a: "Ja, wir arbeiten regelmäßig mit Architekten, Hausverwaltungen und Gemeinden zusammen und setzen auch komplexere Projekte um." },
      { q: "Können Sie kurzfristig bei Schäden oder Undichtigkeiten helfen?", a: "In vielen Fällen ja, besonders bei Sturmschäden oder dringenden Reparaturen. Rufen Sie uns einfach direkt an, wir versuchen schnellstmöglich zu helfen." },
    ],
  },

  /* ---- Über-uns-Seite ---- */
  about: {
    heroBg: "/assets/placeholders/photo-roofing.svg",
    h1: "Ein Meisterbetrieb mit Geschichte und Zukunft",
    story: {
      h2: "Generationen von Erfahrung, frisch weitergedacht",
      body: [
        "Was vor vielen Jahren begann, führen wir heute mit neuem Namen und neuer Energie fort. Die Geschäftsführung steht für ein junges, innovatives Dachhandwerk – offen für neue Konzepte und Lösungen, ohne die bewährte Qualität aus dem Blick zu verlieren.",
        "Unser eingespieltes Team bleibt dasselbe: erfahrene Dachdecker und Spengler, die ihr Handwerk verstehen und mit Sorgfalt bei der Sache sind. So verbinden wir gewachsene Erfahrung mit dem Anspruch, Dächer für die Zukunft zu bauen.",
      ],
      img: "/assets/placeholders/photo-roofing.svg",
      imgAlt: "Zwei lächelnde Männer von Musterwerk Bedachungen vor einer Stadtkulisse.",
    },
    teamImg: "/assets/placeholders/photo-roofing.svg",
    teamImgAlt: "Zwei junge Männer von Musterwerk Bedachungen lächeln auf einem Dach.",
    values: [
      { title: "Meisterqualität", body: "Als qualifizierter Meisterbetrieb arbeiten wir mit hochwertigen Materialien und namhaften Herstellern – für Ergebnisse, die halten.", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 2 2.4 7.4H22l-6 4.5 2.3 7.1L12 16.6 5.7 21l2.3-7.1-6-4.5h7.6z"/></svg>' },
      { title: "Persönlich &amp; regional", body: "Feste Ansprechpartner, kurze Wege und echte Nähe zur Region: Wir sind für Sie da – in Musterstadt und Umgebung.", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' },
      { title: "Nachhaltigkeit", body: "Auf Wunsch setzen wir auf nachhaltige, gesundheits- und allergiefreundliche Lösungen – vom Gründach bis zur Dämmung.", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c4.97 0 9-4.03 9-9-4.97 0-9 4.03-9 9z"/><path d="M12 22C7.03 22 3 17.97 3 13c4.97 0 9 4.03 9 9z"/><path d="M12 13V2"/></svg>' },
    ],
    stats: [
      { value: "40+", label: "Jahre Erfahrung" },
      { value: "12", label: "im Team" },
      { value: "Sehr gut", label: "Demo-Bewertung" },
      { value: "100%", label: "termintreu" },
    ],
  },

  /* ---- Karriere-Seite ---- */
  karriere: {
    heroBg: "/assets/placeholders/photo-roofing.svg",
    h1: "Karriere bei Musterwerk Bedachungen",
    perks: [
      { title: "Ein Team, das zusammenhält", body: "Kollegen mit Humor, klarer Kommunikation und echtem Zusammenhalt – vom Azubi bis zur Geschäftsführung.", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' },
      { title: "Faire, sichere Anstellung", body: "Leistungsgerechte Bezahlung, pünktlich und verlässlich – in einem Betrieb mit langjähriger Beständigkeit.", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>' },
      { title: "Moderne Ausrüstung", body: "Gutes Werkzeug, gepflegte Fahrzeuge und aktuelle Sicherheitsausstattung – damit du gut und sicher arbeiten kannst.", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>' },
    ],
    jobs: [
      { title: "Dachdecker / Spengler (m/w/d)", meta: ["Vollzeit", "Musterstadt &amp; Umgebung", "ab sofort"] },
      { title: "Auszubildende:r zum Spengler (m/w/d)", meta: ["Ausbildung", "Musterstadt", "Start flexibel"] },
      { title: "Quereinsteiger:in fürs Dachhandwerk (m/w/d)", meta: ["Vollzeit", "Musterstadt und Umgebung", "mit Einarbeitung"] },
    ],
  },

  /* ---- Geo (bediente Orte → JSON-LD areaServed; aktuell kein Render-Ort im Markup) ---- */
  geo: { areaServed: ["Musterstadt und Umgebung"] },

  /* ---- SEO (Demo-Domain + je Seite eindeutiger Title/Description) ---- */
  seo: {
    siteUrl: "https://www.example.de",
    pages: {
      home: { title: "Musterwerk Bedachungen: Ihr Dachdecker-Experte in der Region", description: "Ihr zuverlässiger Dachdecker in der Region: Musterwerk Bedachungen bietet professionelle Lösungen für Ihr Dach. Kontaktieren Sie uns!" },
      leistungen: { title: "Leistungen – Musterwerk Bedachungen | Dachdecker & Spengler in Musterstadt", description: "Steildach, Flachdach, Dachsanierung, Wartung, Dachbegrünung und Spenglerarbeiten – alle Leistungen von Musterwerk Bedachungen, Ihrem Meisterbetrieb in Musterstadt und Umgebung." },
      ueberUns: { title: "Über uns – Musterwerk Bedachungen | Meisterbetrieb in Musterstadt", description: "Musterwerk Bedachungen: ein jung geführter Meisterbetrieb mit langjähriger Erfahrung in Musterstadt und Umgebung. Lernen Sie unsere Geschichte, unsere Werte und unser Team kennen." },
      karriere: { title: "Karriere – Musterwerk Bedachungen | Jobs im Dachhandwerk (m/w/d)", description: "Werde Teil von Musterwerk Bedachungen: Dachdecker, Spengler und Auszubildende (m/w/d) gesucht. Sicheres Team, faire Bezahlung und moderne Ausrüstung in Musterstadt und Umgebung." },
      kontakt: { title: "Kontakt – Musterwerk Bedachungen | Dachdecker in Musterstadt", description: "Kontaktieren Sie Musterwerk Bedachungen: Musterstraße 12, 12345 Musterstadt · +49 123 4567890 · info@example.de. Fordern Sie Ihre kostenlose Fachberatung an." },
    },
  },

  /* ---- Consent (WPS Level-2-Consent-Vertrag; siehe docs/architecture/consent.md).
     Struktur schema-kompatibel; `services` bleibt leer (kein Dienst laedt in dieser Phase).
     `necessary` ist immer aktiv. Texte sind neutrale DEMO-Texte — KEINE Rechtstexte. ---- */
  consent: {
    enabled: true,
    version: "2026-07-1",
    validityDays: 182,
    storageKey: "wps_consent",
    eventName: "wps:consentchange",
    categories: {
      necessary:     { enabled: true,  required: true  },
      analytics:     { enabled: true,  required: false },
      marketing:     { enabled: true,  required: false },
      externalMedia: { enabled: true,  required: false },
    },
    services: [
      {
        id: "google-maps",
        name: "Google Maps",
        category: "externalMedia",
        provider: "Google Ireland Limited",
        privacyUrl: "https://policies.google.com/privacy",
        storageWritten: [],
        origins: ["https://www.google.com", "https://maps.google.com"],
        enabled: true,
        requiresReloadOnRevoke: false,
        notes: ["Die Karte wird erst nach Zustimmung zu externen Medien geladen."],
      },
    ],
    texts: {
      bannerTitle: "Datenschutz-Einstellungen",
      bannerBody: "Diese Demo-Website nutzt nur technisch notwendige Speicherungen. Optionale Kategorien für Analyse, Marketing und externe Medien bleiben deaktiviert, bis Sie zustimmen.",
      acceptAll: "Alle akzeptieren",
      acceptNecessary: "Nur notwendige",
      settings: "Einstellungen",
      save: "Auswahl speichern",
      settingsTitle: "Datenschutz-Einstellungen",
      settingsIntro: "Wählen Sie aus, welche optionalen Kategorien Sie zulassen möchten. Ihre Auswahl können Sie jederzeit über den Link im Seitenfuß ändern.",
      close: "Schließen",
      triggerLabel: "Cookie-Einstellungen",
      categories: {
        necessary:     { title: "Notwendig",      body: "Für den Betrieb der Website erforderlich. Immer aktiv." },
        analytics:     { title: "Analyse",        body: "Hilft, die Nutzung der Website anonymisiert zu verstehen." },
        marketing:     { title: "Marketing",      body: "Ermöglicht Werbe- und Remarketing-Funktionen." },
        externalMedia: { title: "Externe Medien", body: "Erlaubt eingebettete Inhalte wie Karten oder Videos." },
      },
    },
  },

  /* ---- Maps (consent-gated, externalMedia). embedUrl = reine Daten, KEIN Code;
     wird erst nach Zustimmung als iframe-src gesetzt. Musteradresse (kein PII). ---- */
  maps: {
    enabled: true,
    serviceId: "google-maps",
    embedUrl: "https://www.google.com/maps?q=Musterstra%C3%9Fe%2012,%2012345%20Musterstadt&output=embed",
    title: "Kartenansicht – Musterstadt",
    placeholderTitle: "Google Maps ist deaktiviert",
    placeholderText: "Aktivieren Sie externe Medien, um die interaktive Karte zu laden.",
    settingsLabel: "Cookie-Einstellungen öffnen",
  },

  /* ---- Formular (S9) -------------------------------------------------------
     `endpoint` = n8n-Webhook "Meisterwerk — Lead-Empfang". Er schickt dem Inhaber
     eine HTML-Mail. Vorlage war der Workflow "Gössel — 01 Lead-Empfang".

     `clientId` adressiert den Kunden. Die Empfaenger-Adresse steht bewusst NICHT
     hier und NICHT im Payload — n8n schlaegt sie in der Data Table "Meisterwerk
     Kunden" nach. Sonst waere der Webhook ein offenes Mail-Relay: jeder koennte
     per POST beliebige Mails ueber unser Konto verschicken.

     KEIN formKey/Token hier. Auf einer statischen Seite steht jedes "Secret" im
     ausgelieferten HTML direkt neben der Webhook-URL — wer das eine abschreibt,
     hat das andere. Das waere Theater. Echte Abwehr: Honeypot + Time-Trap (hier)
     und allowedOrigins (im Webhook).

     `clientId` auf dem Demo-Wert stehen lassen => `build.mjs` bricht ab
     (fail-closed). Absicht: nie wieder eine Site mit totem Formular live.

     PRO KUNDE: (1) clientId hier setzen, (2) gleiche ID als Zeile in der n8n-Data-
     Table "Meisterwerk Kunden" (clientId, empfaenger, betrieb, aktiv=true),
     (3) Kundendomain in allowedOrigins des Webhooks ergaenzen.
     ------------------------------------------------------------------------- */
  forms: {
    enabled: true,
    endpoint: "https://n8n.flow-booking.org/webhook/meisterwerk-lead",
    clientId: "demo-musterwerk",
    minRenderMs: 2000,
    texts: {
      validation: "Bitte E-Mail angeben und der Datenschutzerklärung zustimmen.",
      sending: "Wird gesendet…",
      success: "Vielen Dank! Ihre Anfrage ist eingegangen – wir melden uns in Kürze.",
      bewerbungSuccess: "Vielen Dank! Deine Bewerbung ist eingegangen – wir melden uns persönlich bei dir.",
      sent: "Anfrage gesendet ✓",
      error: "Ihre Anfrage konnte nicht gesendet werden. Bitte rufen Sie uns kurz an — wir helfen Ihnen sofort weiter.",
    },
  },

  /* ---- Chat-Assistent (S10) ------------------------------------------------
     `endpoint` = n8n-Webhook "Meisterwerk — Chat". Die KI bekommt den Inhalt
     dieser Website als Kontext und antwortet frei auf Fragen zum Betrieb.

     `clientId` MUSS mit forms.clientId uebereinstimmen — n8n schlaegt darueber
     dieselbe Zeile nach. Der Website-Inhalt fuer den Bot steht in der Spalte
     `kontext` derselben Zeile, NICHT hier und NICHT im Payload: kaeme er aus
     dem Browser, koennte jeder Besucher dem Bot beliebige "Fakten" ueber den
     Betrieb unterschieben — Preise, Zusagen, Leistungen, die es nicht gibt.

     Kontext erzeugen:  node chat-context.mjs
     Ausgabe in die Data-Table-Zeile kopieren. NACH JEDER AENDERUNG AN DIESER
     DATEI neu erzeugen, sonst erzaehlt der Bot den Stand von vorgestern.

     Der Bot sagt nie einen Termin und nie einen Festpreis zu (Regeln stecken im
     Systemprompt des Workflows). Bei allem Konkreten verweist er aufs Formular.
     Faellt irgendetwas aus, sagt er das ehrlich — er erfindet nichts.

     `privacyHref` ist Pflicht: Chatverlaeufe sind personenbezogene Daten, der
     Besucher muss vor dem Tippen sehen, woran er ist.
     ------------------------------------------------------------------------- */
  chat: {
    enabled: true,
    endpoint: "https://n8n.flow-booking.org/webhook/meisterwerk-chat",
    clientId: "demo-musterwerk",
    privacyHref: "/datenschutz",
    texts: {
      launcher: "Fragen? Jetzt fragen",
      title: "Ihre Frage an uns",
      intro: "Stellen Sie Ihre Frage — ich antworte mit dem, was auf dieser Website steht. Fuer Termine und Angebote leite ich Sie ans Kontaktformular weiter.",
      privacy: "Ihre Fragen werden zur Beantwortung verarbeitet und nach 30 Tagen geloescht. Mehr dazu in der Datenschutzerklärung.",
      placeholder: "Ihre Frage…",
      send: "Senden",
      sending: "Einen Moment…",
      error: "Die Antwort kam nicht durch. Bitte nutzen Sie das Kontaktformular oder rufen Sie an.",
      close: "Schließen",
    },
  },
};

if (typeof module !== "undefined" && module.exports) module.exports = SITE;
if (typeof window !== "undefined") window.SITE = SITE;
