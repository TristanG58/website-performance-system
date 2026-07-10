import { site } from "@/config/site"
import { Seo, localBusinessLd, faqLd } from "@/components/site/seo"
import { KontaktSection, Faq } from "@/components/site/sections"

export default function KontaktPage() {
  return (
    <>
      <Seo
        {...site.seo.pages.kontakt}
        path="/kontakt"
        jsonLd={[localBusinessLd(), faqLd()]}
      />
      <KontaktSection />
      <Faq />
    </>
  )
}
