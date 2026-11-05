---
name: ultimate-design
description: >-
  Ultimate Design: geführter Design-Prozess vom Brief bis zum fertigen Ergebnis (Brief → Entwurf →
  Iteration → Finish) für Websites, Landingpages, Werbung und Ads. Kein One-Shot. Orchestriert die
  installierten Design-Skills (impeccable, tasteskill, superdesign, frontend-design, transitions.dev,
  GSAP, mobbin, Higgsfield, Nano Banana, pro-copywriter, KAIROS-Design-System) in der richtigen Phase,
  führt eine Projektakte (.ultimate-design/STATE.md), erzwingt die KAIROS-Hausregeln gegen AI-Slop
  und legt jede Design-Entscheidung als Vergleichs-Artifact zum Durchklicken vor. IMMER verwenden,
  wenn der User sagt: "ultimate design", "design-prozess", "bau mir eine Website/Landingpage/Ad",
  "das sieht nach KI aus", "haut mich nicht um", "mach das richtig gut", "Entwurf", "Varianten",
  "Finish", "Werbung", "Anzeige", "Ad", "Creative", oder ein Design von Null bis Abnahme will.
user-invocable: true
argument-hint: "[status|brief|entwurf|iteration|finish|ads] [Ziel: Pfad, URL oder Beschreibung]"
---

# Ultimate Design

Ein einzelner Prompt liefert nie das Endergebnis. Dieses Plugin führt den ganzen Weg: vier Phasen,
jede endet mit einer Abnahme durch den Menschen, nichts wird übersprungen. Das Plugin ist ein
**Orchestrator**: es kopiert keinen Skill, es ruft in jeder Phase den passenden Skill mit dem
passenden Auftrag auf (Tabelle in [reference/skill-routing.md](reference/skill-routing.md)).

Kommunikation auf Deutsch. Hausregeln in [reference/hausregeln.md](reference/hausregeln.md) gelten
für alles, was das Plugin ausliefert: keine Gedankenstriche, kein AI-Slop in Text und Bild,
Entscheidungen als Vergleichs-Artifact, visuelle Abnahme macht der Mensch.

## Drei unverrückbare Regeln

1. **Keine Phase ohne Gate.** Jede Phase endet mit einer Abnahme (AskUserQuestion). Erst nach dem
   „Ja" geht es weiter. Auch wenn der User drängt: die Abnahme ist der Prozess.
   Fallback: wird AskUserQuestion abgelehnt oder bricht die Sitzung dabei ab (Desktop-App, Lindstedt
   2026-11-05), die Gate-Frage mit denselben Optionen als Abschlussfrage der Runde stellen
   (`wrap_up` mit Buttons) und auf die Antwort warten. Die Frage steht wörtlich in der Akte, damit
   die nächste Session weiß, welches Gate offen ist. Nie ein Gate still überspringen.
2. **Keine Entscheidung ohne Vergleich.** Wo etwas zu wählen ist (Richtung, Variante, Hero,
   Typografie, Motion), gibt es mindestens zwei Kandidaten als Vergleichs-Artifact zum Durchklicken
   ([reference/vergleichs-artifact.md](reference/vergleichs-artifact.md)). Nie nur beschreiben.
3. **Erst prüfen, dann behaupten.** Screenshot ansehen, `slop-check.py` laufen lassen, Lighthouse
   messen, bevor etwas „fertig" heißt. Ein Befund ohne Artefakt ist eine Vermutung.

## Setup (jede Session, einmal)

1. Projektakte lesen oder anlegen: `.ultimate-design/STATE.md` im Projektordner. Sie hält Brief,
   Modus, Inventar, gewählte Richtung, Entscheidungen, Phase und offene Punkte. Vorlage unten.
   Existiert sie, zuerst lesen und den Stand in zwei Zeilen zusammenfassen. Nie die Fragen von
   Phase 1 wiederholen, wenn der Brief schon in der Akte steht.
2. Werkzeuge prüfen (nur Existenz, nicht laden):
   ```bash
   for s in impeccable design-taste-frontend transitions-dev transitions-polish web-design-guidelines pick-ui-library higgsfield-generate; do [ -d ~/.claude/skills/$s ] && echo "ok  $s" || echo "FEHLT $s"; done
   ls ~/.claude/plugins/cache/claude-plugins-official/ 2>/dev/null | tr '\n' ' '; echo
   ls -d ~/.claude/plugins/cache/kairos-plugins/meisterwerk-miller/*/ 2>/dev/null | tail -1
   ```
   Fehlt ein Werkzeug, laut sagen und ohne es weiterarbeiten (die Phase sagt, was dann ersatzweise gilt).
3. **mobbin** braucht Auth über `/mcp`. Wird mobbin in Phase 1 gebraucht und die Tools fehlen,
   den User einmal bitten, `/mcp` auszuführen, und bis dahin ohne Referenzsuche weiterarbeiten.
4. Spur wählen: **Website** (Landingpage, Site, App-Screen) oder **Ads** (Anzeige, Creative,
   Carousel, Video, Poster). Ads laufen über [reference/track-ads.md](reference/track-ads.md) mit
   denselben vier Phasen, aber anderen Werkzeugen.

## Routing

| Aufruf | Verhalten |
|---|---|
| ohne Argument | Akte lesen, Stand nennen, die nächste Phase vorschlagen. Nichts automatisch starten. |
| `status` | Akte zusammenfassen: Phase, Entscheidungen, offene Punkte, nächste Schritte. |
| `brief [Ziel]` | [reference/phase-1-brief.md](reference/phase-1-brief.md) |
| `entwurf` | [reference/phase-2-entwurf.md](reference/phase-2-entwurf.md). Setzt abgenommenen Brief voraus. |
| `iteration [Feedback]` | [reference/phase-3-iteration.md](reference/phase-3-iteration.md). Setzt gewählte Variante voraus. |
| `finish` | [reference/phase-4-finish.md](reference/phase-4-finish.md). Setzt „Richtung steht" voraus. |
| `ads [Ziel]` | [reference/track-ads.md](reference/track-ads.md), Phasen 1 bis 4 für Werbung. |
| freie Beschreibung | Spur erkennen, dann bei Phase 1 beginnen (oder bei der Phase, die die Akte nennt). |

Wird eine Phase aufgerufen, deren Voraussetzung fehlt, nicht raten: die fehlende Phase benennen
und dort beginnen. Ausnahme: der User sagt ausdrücklich „überspringen", dann die Annahmen in die
Akte schreiben und weiter.

## Die vier Phasen im Überblick

| Phase | Ergebnis | Gate (Mensch bestätigt) | Hauptwerkzeuge |
|---|---|---|---|
| 1 Brief | Brief in 5 Punkten, Modus, Inventar (8 bis 12 Dinge, die nur dieser Kunde hat), Argument (Sektionen als Behauptung + Beleg), Referenzen | „Passt der Brief?" | design-studio-Fragen, tasteskill Schritt 1 und 2, mobbin, website-intelligence |
| 2 Entwurf | 3 gezogene Richtungen, 1 Idee-Satz, 2 bis 3 gebaute Varianten, Vergleichs-Artifact | „Welche Variante?" | tasteskill draw, frontend-design, superdesign, impeccable new-work, handwerk-design-system |
| 3 Iteration | Volle Seite aus der gewählten Variante, Look-and-Fix-Loop, Motion, Vorher/Nachher-Artifacts je Runde | „Richtung steht, jetzt Finish" | impeccable-Verben, tasteskill inspect, transitions.dev, GSAP, chrome-devtools, playwright |
| 4 Finish | Polish, Audit, Copy-Pass, slop-check, Performance, DESIGN.md, Abnahme-Artifact | „Abgenommen" | impeccable polish/audit/harden/adapt, web-design-guidelines, pro-copywriter, slop-reviewer-Agent, impeccable-documenter |

Jede Phase schreibt ihr Ergebnis in die Akte, bevor das Gate gestellt wird. Nach dem Gate: Akte
aktualisieren (`phase:` hochsetzen), kurz sagen, was als Nächstes passiert.

## Agents

- **design-director** (`agents/design-director.md`): führt den Prozess, wenn der User eine ganze
  Website oder Landingpage von Null will und ein Coach-Stil gewünscht ist (erklärt das Warum).
  Abgeleitet vom design-studio-Agent, folgt diesem Skill.
- **slop-reviewer** (`agents/slop-reviewer.md`): nur lesen. Prüft in Phase 4 gegen die Hausregeln
  und liefert eine geordnete Fix-Liste. Repariert nichts selbst.
- Die impeccable-Agents (`impeccable-finish-reviewer`, `impeccable-documenter`,
  `impeccable-asset-producer`) werden in Phase 4 direkt genutzt, siehe dort.

## Vorlage `.ultimate-design/STATE.md`

```markdown
---
projekt: <Name>
spur: website | ads
phase: 1-brief | 2-entwurf | 3-iteration | 4-finish | abgenommen
modus: persuade | operate | read | experience      # nur Website
stack: <HTML/CSS | Next.js | Astro | …>
design-system: <keins | DESIGN.md | KAIROS handwerk-design-system | Kunden-Brand>
aktualisiert: YYYY-MM-DD
---
## Brief (5 Punkte, abgenommen am …)
## Inventar (8 bis 12 Dinge, die nur dieser Kunde hat)
## Argument (eine Zeile je Sektion: Behauptung + Beleg)
## Referenzen (mobbin, Wettbewerber, Inspirationen; was genau davon übernommen wird)
## Richtung (gezogene Richtungen, gewählte, der Idee-Satz, Redraws mit Grund)
## Entscheidungen (Datum, Vergleich, Wahl, Grund)
## Iterationsrunden (Runde, Befund, Fix, Artifact)
## Offen
```

## Budget und Tempo

Phase 2 und 3 sind die teuren Phasen (Varianten, Screenshots). Vor Phase 2 kurz sagen, wie viele
Varianten gebaut werden (Default 3) und warum. Subagents nur für unabhängige Varianten und nur
auf Ansage des Users. Screenshots in Batches: alles ansehen, alles fixen, dann erneut schauen.
