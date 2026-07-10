import { CheckCircle2 } from "lucide-react"

import { site } from "@/config/site"
import { Seo, localBusinessLd } from "@/components/site/seo"
import { Warum, StatsBand, CtaBand } from "@/components/site/sections"
import { Badge } from "@/components/ui/badge"

export default function UeberUnsPage() {
  return (
    <>
      <Seo {...site.seo.pages.ueberUns} path="/ueber-uns" jsonLd={[localBusinessLd()]} />

      <section className="py-14 sm:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
          <div className="reveal flex flex-col gap-6">
            <Badge variant="secondary" className="w-fit">
              {site.about.eyebrow}
            </Badge>
            <h1 className="split-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
              {site.about.title}
            </h1>
            {site.about.body.map((p) => (
              <p key={p.slice(0, 24)} className="text-muted-foreground text-pretty">
                {p}
              </p>
            ))}
            <ul className="grid gap-2 pt-2 sm:grid-cols-2">
              {site.about.highlights.map((h) => (
                <li key={h} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="size-4 shrink-0 text-primary" /> {h}
                </li>
              ))}
            </ul>
          </div>
          <div className="reveal overflow-hidden rounded-3xl border shadow-sm">
            <img
              src={site.about.image}
              alt={site.about.imageAlt}
              className="aspect-[4/5] w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <div className="border-y bg-muted/30">
        <StatsBand />
      </div>
      <Warum />
      <CtaBand />
    </>
  )
}
