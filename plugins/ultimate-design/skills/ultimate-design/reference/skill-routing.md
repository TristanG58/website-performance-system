# Skill-Routing: welcher Skill wofür, in welcher Phase

Aufruf immer per Skill-Tool mit dem Namen in der Spalte „Aufruf". Das Plugin gibt dem Skill
einen präzisen Auftrag (Ziel, Phase, Brief-Auszug aus der Akte), nicht den ganzen Prozess.
Pfade sind Fundorte zum Nachlesen, nicht zum Kopieren.

## Prozess und Taste (Kern)

| Quelle | Aufruf | Phase | Wofür | Fundort |
|---|---|---|---|---|
| design-studio (Agent) | `Agent design-studio` oder eigener `design-director` | Rahmen | 4-Phasen-Gates, Coach-Stil, Inspiration präzise übernehmen („Was genau davon?") | `~/.claude/agents/design-studio.md` |
| design-shotgun (gstack) | `source-command-design-shotgun-skill` | 2 | Varianten mit Konzept-Bestätigung VOR der Generierung, Vergleichsboard, Taste-Memory. Nur wenn `~/.Codex/skills/gstack/bin` existiert, sonst Muster übernehmen, nicht aufrufen | `~/.agents/skills/source-command-design-shotgun-skill` |
| plan-design-review (gstack) | `source-command-plan-design-review-skill` | 1→2 | 7 Pässe über den Plan (IA, Zustände, Journey, Slop-Risiko, Design-System, Responsive, offene Entscheidungen). Die Hard Rules stehen in `hausregeln.md` | `~/.agents/skills/source-command-plan-design-review-skill` |
| design-taste-frontend (tasteskill v2) | `design-taste-frontend` | 1, 2, 3 | Inventar + Argument (Schritt 1, 2), `draw.mjs --options 3` zieht Richtungen, `inspect.mjs` misst den Haus-Stil im Browser, `assets.mjs` findet echte Bilder, `scenes.mjs` Scroll-Szenen. App-Screens über `--app` | `~/.claude/skills/design-taste-frontend` |
| impeccable | `impeccable <verb> [ziel]` | 2, 3, 4 | `shape` (Planen), new-work + craft-floor (Bauen), `critique`/`audit` (Bewerten), `bolder quieter layout typeset colorize delight distill harden adapt optimize polish clarify animate` (Verfeinern), `live`/`generate` (Element-Varianten im Browser), `document` (DESIGN.md). Setup: `scripts/impeccable context` einmal je Session | `~/.claude/skills/impeccable` |
| frontend-design | `frontend-design:frontend-design` | 2 | Zwei-Pass-Plan: Token-System (4 bis 6 Farben, Schriften, ASCII-Layout, Prinzipien), dann Review gegen den generischen Default. Kalibrierungsliste der AI-Tells | `~/.claude/plugins/cache/claude-plugins-official/frontend-design/*/skills/frontend-design` |
| web-design-guidelines (Vercel) | `web-design-guidelines <datei>` | 4 | Review gegen Web Interface Guidelines (a11y, Fokus, Formulare, Motion) | `~/.claude/skills/web-design-guidelines` |
| pick-ui-library | `pick-ui-library` | 2 | Bibliothek je Aufgabe (Zahlen, OTP, Charts, Command-Menü, Toasts, DnD). Nur explizit aufrufen | `~/.claude/skills/pick-ui-library` |
| vercel:shadcn | `vercel:shadcn` | 2, 3 | shadcn/ui, Theming, Komposition, wenn der Stack React/Next ist | Plugin vercel |
| mobbin | `mobbin:search`, `mobbin:redesign-screen` | 1, 3 | Echte Referenz-Screens und Flows, Redesign eines Screens. Auth über `/mcp` nötig | Plugin mobbin |
| superdesign | `superdesign:superdesign` | 2, Ads | Varianten side-by-side über mehrere Modelle auf dem Canvas, Design-System extrahieren/setzen, Poster und Marketing-Grafiken (GRAPHIC.md), Bild/Video-Assets | `~/.claude/plugins/cache/claude-plugins-official/superdesign` |

## Motion

| Quelle | Aufruf | Phase | Wofür |
|---|---|---|---|
| transitions-dev | `transitions-dev` | 3 | Fertige CSS-Transitions für UI (Modal, Dropdown, Tabs, Toast, Text-Swap, Skeleton) |
| transitions-polish | `transitions-polish` | 3, 4 | Vorhandene Motion auf die Token-Skala bringen (Dauer, Distanz, Easing, Stagger, Open/Close-Asymmetrie) |
| gsap-core / timeline / scrolltrigger / plugins / utils / performance / react / frameworks | `gsap:gsap-<name>` | 3 | Scroll-Szenen, Pinning, Scrub, Timelines, Count-up. ScrollTrigger für alles Scroll-gebundene; `gsap-performance` vor dem Finish; `gsap-react` bei React |
| impeccable animate | `impeccable animate <ziel>` | 3 | Purposeful Motion-Pass mit dem Modus im Blick |

Regel aus frontend-design: ein orchestrierter Moment schlägt verstreute Effekte. Motion, die auf
Handlung antwortet, ist willkommen. `prefers-reduced-motion` immer (gsap.matchMedia).

## Werbung und Ads

| Quelle | Aufruf | Wofür |
|---|---|---|
| higgsfield-generate | `higgsfield-generate` | Marketing Studio Ads, GPT Image 2 (Bild/Design/Text), Seedance 2.0 (Video), Nano Banana (Charakter/Referenz), Virality Predictor (`brain_activity`), Reframe |
| higgsfield-product-photoshoot | `higgsfield-product-photoshoot` | Produktfotos aus Referenzbild |
| higgsfield-marketplace-cards | `higgsfield-marketplace-cards` | Listing-Karten für Marktplätze |
| higgsfield-soul-id | `higgsfield-soul-id` | Gesichts-/Identitäts-Konsistenz über Creatives |
| gemini-imagegen (Nano Banana Pro) | `gemini-imagegen` (compound-engineering) | Logos mit Text, Mockups, Style-Transfer, Multi-Referenz-Komposition. `GEMINI_API_KEY` nötig |
| carousel-higgsfield | `anthropic-skills:carousel-higgsfield` | Instagram-Carousel aus viralem Vorbild + Kundenfotos, 3-Farben-2-Fonts-1-Layout |
| pro-copywriter | `anthropic-skills:pro-copywriter` | Deutsche Website- und Ad-Copy |
| brand-guidelines | `anthropic-skills:brand-guidelines` | Nur für Anthropic-Look. Für Kunden: deren Brand aus der Akte |
| stitch-expert, stitch-prompt-generator | `anthropic-skills:stitch-expert`, `…:stitch-prompt-generator` | Google Stitch als Alternativ-Generator für UI-Screens, Prompts dafür |
| relume-expert | `anthropic-skills:relume-expert` | Sitemap/Wireframes in Relume, Webflow-Export |
| onepage-pro | `anthropic-skills:onepage-pro` | Wenn die Seite in Onepage.io gebaut wird |
| website-intelligence | `anthropic-skills:website-intelligence` | Phase 1: Kundenseite + 5 Wettbewerber scrapen, Report. Braucht Firecrawl |

Video-Briefing (Memory): Kameraperspektive klären, Keyframes abnicken lassen, dann Seedance.
Start- und Endbild schneiden; volles Fresko wird als nsfw abgelehnt.

## Eigenes Design-System (Referenz, nicht verändern)

| Quelle | Aufruf | Wofür |
|---|---|---|
| meisterwerk-miller:handwerk-design-system | `meisterwerk-miller:handwerk-design-system` | KAIROS-Tokens (Navy #1C3F60 + Steel-Blue, Albert Sans), Sektions-Bausteine, Signatur-Animationen (GSAP-Reveals, 3D-Team-Karussell, Sticky-Reveal-Footer, Count-up). Bei KAIROS- und Handwerk-Projekten in Phase 2 `--keep palette,type` und die Bausteine als Vokabular |
| meisterwerk-miller:handwerk-site-builder | nur wenn es eine Dachdecker-Seite im Miller-Stil werden soll | Dann übernimmt dieses Plugin, Ultimate Design begleitet nur Brief und Finish |

## Prüf-Werkzeuge (Look-and-Fix-Loop)

| Werkzeug | Aufruf | Wofür |
|---|---|---|
| chrome-devtools MCP | `mcp__chrome-devtools__take_screenshot`, `resize_page`, `lighthouse_audit`, `performance_start_trace`, `get_css_styles`, `list_console_messages` | Screenshots, Lighthouse-Zahlen, Trace, Konsole |
| playwright MCP | `mcp__playwright__browser_resize`, `browser_take_screenshot`, `browser_snapshot` | Screenshots bei drei Breiten, Accessibility-Snapshot |
| tasteskill inspect | `node <skill>/scripts/inspect.mjs` | Haus-Stil-Befunde im echten Browser plus Screenshots |
| impeccable detect | `scripts/impeccable detect --json <dateien>` | Slop-Familien in HTML/CSS lokal, ohne Netz |
| slop-check | `python3 <plugin>/scripts/slop-check.py <pfad>` | Gedankenstriche, Floskeln, visuelle Slop-Muster. Exit 1 bei Fehler |
| Builtin-Browser | `preview_start`, `read_page` | Dev-Server öffnen und prüfen, ohne Bash |

## Agents

| Agent | Phase | Wofür |
|---|---|---|
| design-director (Plugin) | Rahmen | Prozessführung im Coach-Stil |
| slop-reviewer (Plugin) | 4 | Geordnete Fix-Liste gegen die Hausregeln, nur lesen |
| impeccable-finish-reviewer | 4 | Review gegen Direction-Contract, Comp und Welt-Qualitätsbar |
| impeccable-documenter | 4 | DESIGN.md aus dem gebauten Artefakt |
| impeccable-asset-producer | 3, 4 | Saubere Raster-Assets aus abgenommenen Mock-Referenzen |
| impeccable-manual-edit-applier | 3 | Live-Copy-Edits aus dem Browser auf den Quellcode |
