import { site } from "@/config/site"
import { Seo, localBusinessLd } from "@/components/site/seo"
import { Hero, Services, Warum, Referenzen, CtaBand } from "@/components/site/sections"

export default function HomePage() {
  return (
    <>
      <Seo {...site.seo.pages.home} path="/" jsonLd={[localBusinessLd()]} />
      <Hero />
      <Services teaser />
      <Warum />
      <Referenzen />
      <CtaBand />
    </>
  )
}
