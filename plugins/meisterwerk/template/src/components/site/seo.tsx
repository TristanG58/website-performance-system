import { Head } from "vite-react-ssg"

import { site } from "@/config/site"

const BASE = site.seo.siteUrl.replace(/\/$/, "")

export function canonical(path: string) {
  return BASE + (path === "/" ? "" : path) || BASE + "/"
}

/**
 * Per-Page <head>: Titel, Description, Canonical, Open Graph + beliebige
 * JSON-LD-Blöcke. Wird auf jeder Seite genau einmal gerendert. vite-react-ssg
 * schreibt das statisch ins HTML — von Crawlern OHNE JS lesbar (GEO-tauglich).
 */
export function Seo({
  title,
  description,
  path,
  jsonLd = [],
}: {
  title: string
  description: string
  path: string
  jsonLd?: Array<Record<string, unknown>>
}) {
  const url = canonical(path)
  const ogImage = BASE + site.seo.defaultOgImage

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={site.business.name} />
      <meta name="twitter:card" content="summary_large_image" />
      {jsonLd.map((obj, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(obj)}
        </script>
      ))}
    </Head>
  )
}

/**
 * LocalBusiness / RoofingContractor — die sitewide Basis-Entität für Local-SEO
 * und KI-Antwortmaschinen. Adresse, Telefon, areaServed, Bewertung.
 */
export function localBusinessLd(): Record<string, unknown> {
  const b = site.business
  return {
    "@context": "https://schema.org",
    "@type": "RoofingContractor",
    name: b.legalName || b.name,
    image: BASE + site.seo.defaultOgImage,
    url: BASE + "/",
    telephone: b.phone,
    email: b.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: b.addr.street,
      postalCode: b.addr.postalCode,
      addressLocality: b.addr.city,
      addressCountry: "DE",
    },
    areaServed: site.geo.areaServed.map((name) => ({ "@type": "Place", name })),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: b.rating.value.replace(",", "."),
      reviewCount: b.rating.count,
    },
  }
}

/** FAQPage-Schema aus den FAQ-Einträgen (für Rich Results + KI-Zitierbarkeit). */
export function faqLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: site.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  }
}

/** Leistungs-Katalog als Service-Liste (eine Entität pro Gewerk). */
export function servicesLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: `Leistungen — ${site.business.name}`,
    itemListElement: site.services.map((s) => ({
      "@type": "Service",
      name: s.title,
      description: s.desc,
      areaServed: site.business.region,
      provider: { "@type": "RoofingContractor", name: site.business.name },
    })),
  }
}
