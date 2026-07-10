import { site } from "@/config/site"
import { Seo, localBusinessLd } from "@/components/site/seo"
import { Projekte, Referenzen, CtaBand } from "@/components/site/sections"

export default function ProjektePage() {
  return (
    <>
      <Seo {...site.seo.pages.projekte} path="/projekte" jsonLd={[localBusinessLd()]} />
      <Projekte />
      <Referenzen />
      <CtaBand />
    </>
  )
}
