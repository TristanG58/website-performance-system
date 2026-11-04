# Ultimate Design Plugin

Geführter Design-Prozess für Websites, Werbung und Ads: **Brief → Entwurf → Iteration → Finish**.
Kein One-Shot. Vier Phasen, vier Gates, jede Entscheidung als Vergleichs-Artifact zum
Durchklicken, die visuelle Abnahme macht der Mensch.

Das Plugin ist ein Orchestrator. Es kopiert keinen Design-Skill, sondern ruft die installierten
Skills in der richtigen Phase mit dem richtigen Auftrag auf: impeccable, tasteskill v2,
superdesign, frontend-design, transitions.dev, GSAP, mobbin, Higgsfield, Nano Banana,
pro-copywriter, Vercel Web Design Guidelines, shadcn, KAIROS handwerk-design-system.
Die Routing-Tabelle steht in `skills/ultimate-design/reference/skill-routing.md`.

## Installation

```bash
claude plugin marketplace update kairos-plugins
claude plugin install ultimate-design@kairos-plugins
```

Voraussetzungen, damit alle Phasen voll laufen: die Skills unter `~/.claude/skills/`
(impeccable, design-taste-frontend, transitions-dev, transitions-polish, web-design-guidelines,
pick-ui-library, higgsfield-*), die Plugins frontend-design, superdesign, vercel, gsap,
meisterwerk-miller, die MCPs chrome-devtools und playwright. mobbin braucht Auth über `/mcp`.
Fehlt etwas, sagt das Plugin es und arbeitet mit Ersatz weiter.

## Aufruf

```
/ultimate-design                      Stand aus der Akte, nächste Phase vorschlagen
/ultimate-design brief <Ziel>         Phase 1
/ultimate-design entwurf              Phase 2 (3 Varianten, Vergleichs-Artifact)
/ultimate-design iteration <Feedback> Phase 3 (Look-and-Fix-Loop)
/ultimate-design finish               Phase 4 (Polish, Audit, Copy, Performance, Abnahme)
/ultimate-design ads <Ziel>           Spur Werbung mit denselben vier Phasen
```

Projektakte: `.ultimate-design/STATE.md` im Projekt. Screenshots und Vergleiche liegen in
`.ultimate-design/shots/` und `.ultimate-design/vergleich/`. Den Ordner ins `.gitignore`, wenn
die Screenshots nicht ins Repo sollen; die Akte selbst darf rein.

## Hausregeln

`skills/ultimate-design/reference/hausregeln.md`. Kurz: keine Gedankenstriche, kein
AI-Vokabular, keine Slop-Muster (3-Spalten-Grid mit Icons im Kreis, Lila-Verläufe, alles
zentriert, Blobs, Claude-Creme-Palette), Investment statt Kosten, Vergleich statt Beschreibung,
erst prüfen, dann behaupten.

`scripts/slop-check.py <pfad> [--strict] [--json]` prüft Texte und Markup und scheitert laut
(Exit 1). Läuft in Phase 2 je Variante und in Phase 4 mit `--strict`.

## Agents

- `design-director`: Prozessführung im Coach-Stil (aus dem design-studio-Agent abgeleitet).
- `slop-reviewer`: nur lesen, geordnete Fix-Liste gegen die Hausregeln.
