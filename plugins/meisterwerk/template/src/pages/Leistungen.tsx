import { site } from "@/config/site"
import { Seo, servicesLd } from "@/components/site/seo"
import { Services, Ablauf, CtaBand } from "@/components/site/sections"

export default function LeistungenPage() {
  return (
    <>
      <Seo {...site.seo.pages.leistungen} path="/leistungen" jsonLd={[servicesLd()]} />
      <Services />
      <Ablauf />
      <CtaBand />
    </>
  )
}
