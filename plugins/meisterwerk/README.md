# Meisterwerk — Dachdecker-Website-Werk

Meisterwerk baut hochwertige **Dachdecker-Websites** (optional Gebäudetechnik), indem es die
**bestehende Kundenseite scrapt**, daraus Logo, Markenfarben, Teamfotos, Leistungen, NAP und
echte Bewertungen **extrahiert** und in ein **fixes, fertiges Premium-Template** einsetzt —
**ohne** dass Design oder Animationen darunter leiden. Inklusive Qualitäts-Kontrolle im Browser.

Gleichzeitig **Git-Repo** (entwickeln/versionieren) und **Cowork-/Claude-Plugin** (nutzen). Ab v0.2.0.

---

## Prinzip: ein fixes Design, nur personalisiert

Das ausgelieferte Design ist **fertig und gesetzt** — helle, cleane Basis, **Navy**-Akzent,
**Gold**ene Google-Bewertungssterne mit farbigem Google-Logo, und die Signatur-Animationen:
Überschriften-Wipe-up, Leistungs-Card-Zoom, **Ablauf-Road-Timeline** (Linie zeichnet sich von
Karte zu Karte ein + Striche wandern), **Projekte-Foto-Bento** mit Parallax.

Pro Kunde wird **nur** an drei Stellen personalisiert:
1. `template/src/config/site.ts` — alle Inhalte (Betrieb, Kontakt, Leistungen, Projekte, Bewertungen, Texte).
2. `template/src/index.css` — Markenfarbe (`--primary`/`--ring`).
3. `template/public/img/` — echte Bilder + Logo.

So bleibt die Qualität konstant und das Design kann nicht „kaputtgehen".

## Tech-Stack des Templates
React 19 + Vite + Tailwind v4 + shadcn/ui + GSAP (SplitText/ScrollTrigger, seit GSAP gratis).
Lauffähig: `cd template && npm install && npm run dev`.

## Aufbau

```
meisterwerk/
├─ .claude-plugin/        plugin.json (v0.2.0), marketplace.json
├─ template/              DAS fixe Premium-Template (wird pro Kunde geklont & personalisiert)
├─ skills/
│  ├─ handwerk-site-builder/   Orchestrator: Scrape → Extraktion → Klonen → Personalisieren → SEO/GEO → Build → QC
│  ├─ handwerk-design-system/  Hüter des fixen Looks + Personalisierungs-Regeln
│  ├─ handwerk-seo-geo/        Local SEO + GEO, Schema, citable Copy
│  └─ llms.txt                 Router
├─ agents/
│  └─ dachdecker-site-agent.md Claude-Code-Subagent für den End-to-End-Lauf
└─ reference/
   ├─ template-spec.md         fixe Design-/Animations-Spec + Scrape→Config-Map
   ├─ geo-seo-playbook.md      verifizierte SEO+GEO-Wahrheit (Juni 2026)
   ├─ anti-slop.md             Qualitäts-Guardrails
   ├─ resources.md             Bildaufbereitung (WebP), DSGVO-Fonts, Stock
   └─ trades/                  dachdecker (primär), shk, elektriker (Gebäudetechnik), _template
```

## Pipeline (handwerk-site-builder / dachdecker-site-agent)
Discovery (bestehende URL) → Firecrawl-Scrape & Extraktion → Template klonen → `site.ts` +
Markenfarbe + Bilder personalisieren → SEO/GEO-Layer → Build → **Browser-QC** → (optional) Deploy.

## Claude-Code-Subagent
`agents/dachdecker-site-agent.md` ist eine fertige Subagent-Definition. Nach Installation des
Plugins steht sie bereit; im Terminal über `/agents` auswählbar. Sie führt den kompletten Lauf
(scrapen → personalisieren → prüfen) eigenständig aus.

## Credits & Lizenzen
Template-Animationen folgen den GSAP-Patterns (GreenSock, MIT). SEO/GEO aus Google Search Central,
Aggarwal et al. (arXiv 2311.09735), amplifying-ai/awesome-generative-engine-optimization, krillinai/GEO.
Qualitäts-/Geschmacksregeln destilliert aus impeccable (Paul Bakaus, Apache 2.0). © Kairos Digital.
