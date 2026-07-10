import {
  ArrowRight,
  CheckCircle2,
  Hammer,
  HardHat,
  Star,
  ThumbsUp,
} from "lucide-react"
import { Fragment } from "react"
import { Link } from "react-router-dom"

import { site } from "@/config/site"
import { GoogleG, RoadConnector, SectionHeading, CONTACT_ITEMS } from "@/components/site/parts"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

/* ───────────────────────────── HERO ───────────────────────────── */
export function Hero() {
  return (
    <section className="relative overflow-hidden border-b">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04] [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
        <div className="flex flex-col items-start gap-6">
          <Badge variant="outline" className="hero-item gap-1.5">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            {site.business.heroBadge}
          </Badge>
          <h1 className="hero-item text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            {site.hero.h1}
          </h1>
          <p className="hero-item max-w-xl text-lg text-muted-foreground text-pretty">
            {site.hero.sub}
          </p>
          <div className="hero-item flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link to="/kontakt">
                {site.hero.ctaPrimary} <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/leistungen">{site.hero.ctaSecondary}</Link>
            </Button>
          </div>
          <div className="hero-item flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-sm text-muted-foreground">
            {site.hero.pills.map((pill) => (
              <span key={pill} className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-primary" /> {pill}
              </span>
            ))}
          </div>
        </div>

        <div className="relative lg:ml-auto lg:max-w-md">
          <div className="hero-visual overflow-hidden rounded-3xl border shadow-sm">
            <img
              src={site.hero.image}
              alt={site.hero.imageAlt}
              className="aspect-[3/4] w-full object-cover"
              loading="eager"
            />
          </div>
          <Card className="hero-card absolute bottom-4 left-4 w-56 shadow-lg backdrop-blur-sm">
            <CardContent className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <HardHat className="size-4" />
                </span>
                <div className="text-sm leading-tight">
                  <div className="font-semibold">{site.business.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {site.business.foundedNote}
                  </div>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-1 text-sm">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-3.5 fill-gold text-gold" />
                ))}
                <span className="ml-1.5 text-xs text-muted-foreground">
                  {site.business.rating.value} / 5 · {site.business.rating.heroCount}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <StatsBand />
    </section>
  )
}

/* ─────────────────────────── STATS-BAND ─────────────────────────── */
export function StatsBand() {
  return (
    <div className="border-t">
      <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-y px-4 sm:px-6 md:grid-cols-4 md:divide-y-0">
        {site.stats.map((s) => (
          <div key={s.label} className="reveal px-4 py-8 text-center">
            <div className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {s.value}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────── LEISTUNGEN ─────────────────────────── */
export function Services({ teaser = false }: { teaser?: boolean }) {
  const services = teaser ? site.services.slice(0, 3) : site.services
  return (
    <section id="leistungen" className="scroll-mt-16 py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading {...site.sections.leistungen} />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card
              key={service.title}
              className="reveal group gap-0 overflow-hidden pt-0 transition-shadow hover:shadow-md"
            >
              <div className="relative overflow-hidden">
                <img
                  src={service.img}
                  alt={service.title}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <span className="absolute bottom-3 left-3 flex size-10 items-center justify-center rounded-xl border bg-background/90 shadow-sm backdrop-blur">
                  <service.icon className="size-5" />
                </span>
              </div>
              <CardHeader className="pt-5">
                <CardTitle>{service.title}</CardTitle>
                <CardDescription>{service.desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
        {teaser && (
          <div className="reveal mt-10 text-center">
            <Button asChild size="lg" variant="outline">
              <Link to="/leistungen">
                Alle Leistungen ansehen <ArrowRight />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}

/* ─────────────────────────── WARUM WIR ─────────────────────────── */
export function Warum() {
  return (
    <section id="warum" className="scroll-mt-16 border-y bg-muted/30 py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading {...site.sections.warum} />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {site.reasons.map((reason) => (
            <div key={reason.title} className="reveal rounded-xl border bg-background p-6">
              <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <reason.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-semibold">{reason.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{reason.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────────── ABLAUF ───────────────────────────── */
export function Ablauf() {
  return (
    <section id="ablauf" className="scroll-mt-16 py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading {...site.sections.ablauf} />
        <div className="mx-auto mt-10 flex max-w-xl flex-col">
          {site.steps.map((step, i) => (
            <Fragment key={step.no}>
              <Card className="reveal relative overflow-hidden">
                <span className="pointer-events-none absolute -top-4 right-3 text-7xl font-bold text-primary/10 select-none">
                  {step.no}
                </span>
                <CardHeader>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                  <CardDescription className="text-base">{step.desc}</CardDescription>
                </CardHeader>
              </Card>
              {i < site.steps.length - 1 && <RoadConnector flip={i % 2 === 1} />}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ───────────────────── PROJEKTE — Foto-Bento ───────────────────── */
export function Projekte() {
  return (
    <section id="projekte" className="scroll-mt-16 py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading {...site.sections.projekte} />
        <div className="mt-10 grid auto-rows-[200px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12">
          {site.projects.map((p) => (
            <figure
              key={p.title}
              className={`reveal group relative overflow-hidden rounded-xl border ${p.span}`}
            >
              <div className="bento-img absolute inset-0 scale-[1.12]">
                <img src={p.img} alt={p.title} className="h-full w-full object-cover" loading="lazy" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/15 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-4">
                <span className="text-xs font-semibold tracking-wider text-white/80 uppercase">
                  {p.tag}
                </span>
                <h3 className="mt-0.5 text-lg font-semibold text-white">{p.title}</h3>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────── REFERENZEN ─────────────────────────── */
export function Referenzen() {
  return (
    <section id="referenzen" className="scroll-mt-16 border-y bg-muted/30 py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading {...site.sections.referenzen} />
        <div className="reveal mx-auto mt-6 flex w-fit items-center gap-3 rounded-full border bg-background px-5 py-2.5 shadow-sm">
          <GoogleG className="size-6" />
          <span className="text-lg font-semibold">{site.business.rating.value}</span>
          <span className="t-stars flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="t-star size-4 fill-gold text-gold" />
            ))}
          </span>
          <span className="text-sm text-muted-foreground">
            {site.business.rating.count} Google-Bewertungen
          </span>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {site.testimonials.map((t) => (
            <Card key={t.name} className="reveal bg-background">
              <CardContent className="flex h-full flex-col gap-5">
                <div className="flex items-center justify-between">
                  <div className="t-stars flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="t-star size-4 fill-gold text-gold" />
                    ))}
                  </div>
                  <GoogleG className="size-5" />
                </div>
                <p className="text-sm leading-relaxed text-pretty">„{t.text}"</p>
                <div className="mt-auto flex items-center gap-3 pt-2">
                  <Avatar>
                    <AvatarFallback>
                      {t.name
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <div className="font-medium">{t.name}</div>
                    <div className="text-muted-foreground">{t.place}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────────── FAQ ───────────────────────────── */
export function Faq() {
  return (
    <section id="faq" className="scroll-mt-16 py-14 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeading {...site.sections.faq} />
        <Accordion type="single" collapsible defaultValue="item-0" className="reveal mt-10 w-full">
          {site.faq.map((item, i) => (
            <AccordionItem key={item.q} value={`item-${i}`}>
              <AccordionTrigger className="text-left text-base">{item.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

/* ───────────────────────────── KONTAKT ───────────────────────────── */
export function KontaktSection() {
  return (
    <section id="kontakt" className="scroll-mt-16 py-14 sm:py-20">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2">
        <div className="reveal flex flex-col gap-6">
          <div>
            <Badge variant="secondary" className="mb-4">
              Kontakt
            </Badge>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {site.sections.kontakt.title}
            </h2>
            <p className="mt-4 text-muted-foreground text-pretty">
              {site.sections.kontakt.description}
            </p>
          </div>
          <div className="grid gap-4">
            {CONTACT_ITEMS.map((c) => (
              <div key={c.label} className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-lg border bg-background">
                  <c.icon className="size-4" />
                </span>
                <div className="text-sm">
                  <div className="text-muted-foreground">{c.label}</div>
                  <div className="font-medium">{c.value}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 pt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <ThumbsUp className="size-4 text-primary" /> Antwort in 24 h
            </span>
            <span className="flex items-center gap-1.5">
              <Hammer className="size-4 text-primary" /> Eigenes Meister-Team
            </span>
          </div>
        </div>

        <Card className="reveal">
          <CardHeader>
            <CardTitle>Anfrage senden</CardTitle>
            <CardDescription>Alle Felder mit * sind Pflichtangaben.</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="grid gap-4"
              onSubmit={(e) => {
                e.preventDefault()
                alert("Vielen Dank! Dies ist eine Demo — das Formular ist nicht angebunden.")
              }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input id="name" name="name" placeholder="Ihr Name" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input id="phone" name="phone" type="tel" placeholder="0221 ..." />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">E-Mail *</Label>
                <Input id="email" name="email" type="email" placeholder="name@beispiel.de" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="message">Ihr Anliegen *</Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="z. B. undichtes Flachdach, Sturmschaden, Neueindeckung ..."
                  required
                />
              </div>
              <Button type="submit" size="lg" className="w-full">
                Anfrage absenden <ArrowRight />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

/* ─────────────────── CTA-BAND (seitenübergreifend) ─────────────────── */
export function CtaBand() {
  return (
    <section className="border-t bg-muted/30">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6">
        <h2 className="reveal split-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {site.sections.kontakt.title}
        </h2>
        <p className="reveal max-w-xl text-muted-foreground text-pretty">
          {site.sections.kontakt.description}
        </p>
        <div className="reveal flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link to="/kontakt">
              {site.hero.ctaPrimary} <ArrowRight />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href={site.business.phoneHref}>{site.business.phone}</a>
          </Button>
        </div>
      </div>
    </section>
  )
}
