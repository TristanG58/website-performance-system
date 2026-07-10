import {
  Award,
  Clock,
  Droplets,
  Layers,
  MapPin,
  PanelTop,
  ShieldCheck,
  Wrench,
  type LucideIcon,
} from "lucide-react"

/**
 * =====================================================================
 *  MEISTERWERK GOLDEN TEMPLATE — ZENTRALE KONFIGURATION
 * =====================================================================
 *  Dies ist die EINZIGE Datei, die pro Kunde angepasst wird.
 *  Layout, Animationen und Struktur liegen im Code und bleiben fix.
 *  Der Agent füllt hier die aus der bestehenden Kundenseite gescrapten
 *  Daten ein (Betrieb, Kontakt, Leistungen, Bewertungen, Bilder ...).
 *
 *  HINWEIS: Alle Werte hier sind eindeutig fiktive DEMO-Platzhalter
 *  (Musterwerk Bedachungen GmbH). Keine echten Kundendaten in dieser Vorlage.
 *
 *  Markenfarbe (Navy) + Gold liegen in src/index.css (--primary, --gold) —
 *  dort die zwei markierten Zeilen anpassen. Logo/Bilder in public/img tauschen.
 * =====================================================================
 */

export type Service = {
  icon: LucideIcon
  title: string
  img: string
  desc: string
}

export type Project = {
  img: string
  title: string
  tag: string
  span: string // Bento-Größe, NICHT pro Kunde ändern
}

export const site = {
  business: {
    name: "Musterwerk Bedachungen",
    legalName: "Musterwerk Bedachungen GmbH",
    foundedNote: "Meisterbetrieb seit vielen Jahren",
    region: "Musterstadt",
    phone: "+49 123 4567890",
    phoneHref: "tel:+491234567890",
    email: "info@example.de",
    address: "Musterstraße 12, 12345 Musterstadt",
    // Strukturierte Adresse für JSON-LD / LocalBusiness (Local-SEO).
    addr: { street: "Musterstraße 12", postalCode: "12345", city: "Musterstadt" },
    notdienst: "Rund um die Uhr erreichbar",
    heroBadge: "24/7-Notdienst für Musterstadt",
    footerTagline:
      "Meisterbetrieb für Dachdeckerei, Abdichtung und Reparatur in Musterstadt und Umgebung.",
    rating: { value: "4,9", count: "Demo", heroCount: "Demo-Wert" },
    legalLinks: { impressum: "#", datenschutz: "#" },
  },

  hero: {
    h1: "Ihr Dach in den Händen eines regionalen Meisterbetriebs.",
    sub: "Steildach, Flachdach, Abdichtung und Reparatur — sauber ausgeführt, zum Festpreis und mit fünf Jahren Gewährleistung. Seit vielen Jahren auf den Dächern in Musterstadt und Umgebung zu Hause.",
    image: "/img/hero.jpg",
    imageAlt:
      "Dachdecker von Musterwerk Bedachungen bei der Arbeit auf einem Ziegeldach",
    pills: ["Meisterbetrieb", "Festpreis", "Eigenes Team"],
    ctaPrimary: "Kostenloses Angebot",
    ctaSecondary: "Leistungen ansehen",
  },

  stats: [
    { value: "viele", label: "Jahre Erfahrung" },
    { value: "viele", label: "Dächer in der Region" },
    { value: "24/7", label: "Notdienst" },
    { value: "5 Jahre", label: "Gewährleistung" },
  ],

  sections: {
    leistungen: {
      eyebrow: "Leistungen",
      title: "Alles rund ums Dach — aus einer Hand",
      description:
        "Von der einzelnen Reparatur bis zur kompletten Sanierung. Was Ihr Dach braucht, machen wir.",
    },
    warum: {
      eyebrow: "Warum wir",
      title: "Gründe, warum Kunden uns ihr Dach anvertrauen",
    },
    ablauf: { eyebrow: "Ablauf", title: "In drei Schritten zum dichten Dach" },
    projekte: {
      eyebrow: "Projekte",
      title: "Dächer aus der Region, die für sich sprechen",
      description: "Ein Auszug unserer Arbeit in Musterstadt und Umgebung.",
    },
    referenzen: { eyebrow: "Referenzen", title: "Was unsere Kunden sagen" },
    faq: {
      eyebrow: "FAQ",
      title: "Häufige Fragen",
      description:
        "Sie haben eine andere Frage? Rufen Sie uns an — wir beraten Sie gern.",
    },
    kontakt: {
      title: "Kostenloses Angebot anfordern",
      description:
        "Schildern Sie uns kurz Ihr Anliegen. Wir melden uns innerhalb von 24 Stunden und vereinbaren einen unverbindlichen Vor-Ort-Termin.",
    },
  },

  services: [
    { icon: Layers, title: "Steildach", img: "/img/steildach.jpg", desc: "Neueindeckung und Sanierung mit Ziegel, Schiefer oder Faserzement — sauber gedämmt und winddicht." },
    { icon: PanelTop, title: "Flachdach", img: "/img/flachdach.jpg", desc: "Abdichtung mit Bitumen oder Kunststoffbahnen, Gefälledämmung und fachgerechte Entwässerung." },
    { icon: Droplets, title: "Abdichtung", img: "/img/abdichtung.jpg", desc: "Balkone, Terrassen und Kellerdurchdringungen dauerhaft dicht — geprüft und dokumentiert." },
    { icon: PanelTop, title: "Dachfenster", img: "/img/dachfenster.jpg", desc: "Einbau und Austausch von Velux & Roto inkl. Innenausbau und wärmebrückenfreiem Anschluss." },
    { icon: Droplets, title: "Dachrinnen", img: "/img/dachrinnen.jpg", desc: "Montage, Reinigung und Reparatur von Rinnen und Fallrohren in Zink, Kupfer oder Titanzink." },
    { icon: Wrench, title: "Reparatur & Notdienst", img: "/img/hero.jpg", desc: "Sturmschaden oder undichte Stelle? Wir sichern kurzfristig ab — rund um die Uhr in Musterstadt." },
  ] as Service[],

  reasons: [
    { icon: Award, title: "Eingetragener Meisterbetrieb", desc: "Jede Ausführung nach den Fachregeln des Dachdeckerhandwerks — mit Gewährleistung." },
    { icon: MapPin, title: "Verwurzelt in der Region", desc: "Kurze Wege im gesamten Stadtgebiet und Umland. Ihr Ansprechpartner bleibt derselbe." },
    { icon: ShieldCheck, title: "Festpreis-Garantie", desc: "Transparentes Angebot vor Baubeginn. Was wir vereinbaren, gilt — ohne Nachträge." },
    { icon: Clock, title: "24/7-Notdienst", desc: "Bei akuten Schäden sind wir schnell vor Ort und verhindern Folgeschäden." },
  ] as Service[],

  steps: [
    { no: "01", title: "Anfrage", desc: "Sie schildern uns Ihr Anliegen telefonisch oder über das Formular. Innerhalb von 24 Stunden melden wir uns." },
    { no: "02", title: "Vor-Ort-Termin", desc: "Wir begutachten Ihr Dach kostenlos, beraten ehrlich und erstellen ein verbindliches Festpreis-Angebot." },
    { no: "03", title: "Ausführung", desc: "Saubere, termingerechte Arbeit durch unser eigenes Team. Zum Abschluss übergeben wir die Dokumentation." },
  ],

  projects: [
    { img: "/img/steildach.jpg", title: "Steildach-Neueindeckung", tag: "Musterstadt", span: "lg:col-span-6 lg:row-span-2" },
    { img: "/img/flachdach.jpg", title: "Flachdach mit Gründach", tag: "Musterstadt", span: "lg:col-span-6" },
    { img: "/img/dachrinnen.jpg", title: "Spenglerei in Titanzink", tag: "Musterstadt", span: "lg:col-span-3" },
    { img: "/img/dachfenster.jpg", title: "Dachfenster-Einbau", tag: "Musterstadt", span: "lg:col-span-3" },
    { img: "/img/abdichtung.jpg", title: "Terrassenabdichtung", tag: "Musterstadt", span: "lg:col-span-8" },
    { img: "/img/hero.jpg", title: "Komplettsanierung Altbau", tag: "Musterstadt", span: "lg:col-span-4" },
  ] as Project[],

  testimonials: [
    { name: "Max Mustermann", place: "Musterstadt", text: "Demo-Referenz: Nach dem Sturm war eine Ziegelreihe weg. Schnell abgesichert, eine Woche später sauber repariert. So muss das sein." },
    { name: "Erika Musterfrau", place: "Musterstadt", text: "Demo-Referenz: Komplette Flachdachsanierung auf unserem Mehrfamilienhaus. Der Festpreis hat exakt gehalten, die Baustelle war jeden Abend aufgeräumt." },
    { name: "Musterverwaltung GmbH", place: "Musterstadt", text: "Demo-Referenz: Zuverlässiger Partner für unsere Objekte. Termine werden gehalten, die Abrechnung ist nachvollziehbar." },
  ],

  faq: [
    { q: "Was kostet eine Dachsanierung?", a: "Das hängt von Fläche, Dachform und Material ab. Nach einem kostenlosen Vor-Ort-Termin erhalten Sie ein verbindliches Festpreis-Angebot — ohne versteckte Kosten." },
    { q: "Wie schnell sind Sie im Notfall vor Ort?", a: "Bei akuten Schäden im Stadtgebiet sind wir in der Regel innerhalb weniger Stunden da und sichern das Dach provisorisch ab." },
    { q: "Übernehmen Sie auch die Kommunikation mit der Versicherung?", a: "Ja. Wir dokumentieren den Schaden fotografisch und stellen alle Unterlagen bereit, die Ihre Gebäudeversicherung benötigt." },
    { q: "Arbeiten Sie mit Subunternehmern?", a: "Nein. Auf Ihrem Dach steht ausschließlich unser eigenes, festangestelltes Team — dafür stehen wir mit unserem Namen." },
    { q: "Welche Gewährleistung gibt es?", a: "Auf unsere Arbeit geben wir fünf Jahre Gewährleistung nach den anerkannten Regeln des Dachdeckerhandwerks." },
    { q: "In welchem Umkreis arbeiten Sie?", a: "In Musterstadt und Umgebung — im Umkreis von rund 30 Kilometern." },
  ],

  // MULTI-PAGE-NAV (max. 5 Seiten). Reihenfolge = Reihenfolge im Header.
  nav: [
    { label: "Leistungen", to: "/leistungen" },
    { label: "Projekte", to: "/projekte" },
    { label: "Über uns", to: "/ueber-uns" },
    { label: "Kontakt", to: "/kontakt" },
  ],

  footerLinks: {
    leistungen: ["Steildach", "Flachdach", "Abdichtung", "Notdienst"],
  },

  // ─────────────────────────── ÜBER UNS ───────────────────────────
  about: {
    eyebrow: "Über uns",
    title: "Ein regionaler Meisterbetrieb, der für sein Dach geradesteht",
    body: [
      "Seit vielen Jahren decken, dichten und reparieren wir Dächer in Musterstadt und Umgebung. Was als Familienbetrieb begann, ist heute ein eingespieltes Team aus festangestellten Gesellen und Meistern — ohne Subunternehmer.",
      "Wir arbeiten nach den anerkannten Regeln des Dachdeckerhandwerks, halten Termine und Festpreise ein und hinterlassen die Baustelle jeden Abend aufgeräumt. Dafür stehen wir mit unserem Namen.",
    ],
    highlights: [
      "Eingetragener Meisterbetrieb",
      "Eigenes festangestelltes Team",
      "Festpreis-Garantie ohne Nachträge",
      "5 Jahre Gewährleistung",
    ],
    image: "/img/hero.jpg",
    imageAlt: "Das Team von Musterwerk Bedachungen auf einer Baustelle im Stadtgebiet",
  },

  // ───────────────── GEO / Local-SEO (areaServed) ─────────────────
  geo: {
    // Stadtteile / Orte, die der Betrieb bedient — fließt in JSON-LD areaServed.
    areaServed: ["Musterstadt und Umgebung"],
  },

  // ───────────────── SEO: Domain + per-Page Meta ─────────────────
  seo: {
    siteUrl: "https://www.example.de", // <-- PRO KUNDE: echte Domain (für canonical, OG, Sitemap)
    defaultOgImage: "/img/hero.jpg",
    pages: {
      home: {
        title: "Musterwerk Bedachungen — Meisterbetrieb für Dach & Abdichtung",
        description:
          "Dachdecker-Meisterbetrieb in Musterstadt: Steildach, Flachdach, Abdichtung & Reparatur — zum Festpreis, mit 24/7-Notdienst und 5 Jahren Gewährleistung.",
      },
      leistungen: {
        title: "Leistungen — Steildach, Flachdach & Abdichtung | Musterwerk Bedachungen",
        description:
          "Alle Dachleistungen aus einer Hand: Steildach, Flachdach, Abdichtung, Dachfenster, Dachrinnen und Notdienst in Musterstadt und Umgebung. In drei Schritten zum dichten Dach.",
      },
      projekte: {
        title: "Projekte & Referenzen aus der Region | Musterwerk Bedachungen",
        description:
          "Ein Auszug ausgeführter Dachprojekte in Musterstadt und Umgebung — und was unsere Kunden über uns sagen (Demo).",
      },
      ueberUns: {
        title: "Über uns — Dachdecker-Meisterbetrieb | Musterwerk Bedachungen",
        description:
          "Seit vielen Jahren auf regionalen Dächern: eingetragener Meisterbetrieb, eigenes Team ohne Subunternehmer, Festpreis-Garantie und 5 Jahre Gewährleistung.",
      },
      kontakt: {
        title: "Kontakt & kostenloses Angebot | Musterwerk Bedachungen",
        description:
          "Kostenloses Festpreis-Angebot für Ihr Dach in Musterstadt. Schildern Sie uns Ihr Anliegen — Antwort innerhalb von 24 Stunden, 24/7-Notdienst.",
      },
    },
  },
}
