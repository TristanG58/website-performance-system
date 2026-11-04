# Phase 1: Brief

Ziel: ein Brief, den der Mensch in fünf Punkten bestätigt, plus das Material, aus dem in Phase 2
eine Idee entsteht (Inventar, Argument, Referenzen). Ohne diese Phase ist jede Richtung Zufall.
Zwei Fragerunden maximal (design-shotgun-Regel), dann mit Annahmen weiter und sie in die Akte.

## 1. Was schon da ist (auto, vor jeder Frage)

```bash
cat DESIGN.md PRODUCT.md 2>/dev/null | head -60
ls .ultimate-design .superdesign .taste-skill 2>/dev/null
ls src app pages components 2>/dev/null | head -20
```
Existiert `DESIGN.md` oder ein Kunden-Brand: sagen „Ich folge dem Design-System, außer du sagst,
wir gehen bewusst raus." Bei KAIROS- und Handwerk-Projekten das KAIROS-System als Default nennen
(`meisterwerk-miller:handwerk-design-system`). Bestehende Seite vorhanden (URL): Screenshot ziehen,
bevor gefragt wird, und sie als Anti-Referenz oder Bewahrungs-Referenz einordnen (Hausregel F5).

## 2. Fragen (eine Nachricht, vorausgefüllt mit dem, was bekannt ist)

Aus design-studio und design-shotgun, zusammengelegt:

1. **Worum geht es?** Produkt oder Leistung in einem Satz, in den Worten des Kunden.
2. **Für wen?** Persona, Erfahrungsgrad, Situation (am Handy auf der Baustelle, am Desktop im Büro).
3. **Die eine Handlung.** Was soll der Besucher tun? (Anruf, Formular, Kauf, Bewerbung, Warteliste)
4. **Modus** (impeccable): Persuade (entscheiden und handeln), Operate (Aufgabe erledigen), Read
   (verstehen), Experience (im Werk sein). Vom angefragten Surface ableiten, nicht vom Produkt.
5. **Vision:** Inspirationen (URLs), Stil-Richtung, Brand (Farben, Schriften, Logo, Fotos).
   Bei jeder Inspiration nachfragen: **„Was genau davon?** Layout, Farbe, Typo, Animation, Ton?"
6. **Must-haves und No-Gos.** Elemente, die rein müssen; was vermieden werden soll.
7. **Was existiert an Bildern wirklich?** Eigene Fotos, Produktbilder, echte UI, ein Bildwerkzeug,
   nichts. Nie um Bilder planen, die es nicht gibt (tasteskill Schritt 1).
8. **Flow und Randfälle:** Woher kommt der Besucher, wohin geht er? Lange Namen, null Ergebnisse,
   Fehler, Erstbesuch vs. Stammkunde.
9. **Stack und Ziel-Ort:** HTML/CSS, Next, Astro, Onepage, Webflow? Wohin wird deployt?

## 3. Inventar (tasteskill Schritt 1, Pflicht)

Acht bis zwölf Dinge, die zu diesem Kunden gehören und zu keinem Wettbewerber: Name und was er
bedeutet, Adresse, Straße, Viertel und wie es dort aussieht (Material, Licht, Schilder), die
Zahlen im Brief (Sitze, Jahre, Minuten, Preis), die Einschränkung, mit der er lebt (nur eine Charge
im Monat, nur nach Termin), Materialien und Farben, Rituale und Zeiten, die gedruckten Dinge
seiner Welt (Ticket, Etikett, Fahrplan, Schild). Aus dieser Liste kommt in Phase 2 die Idee und
die Bildsuche. Steht wenig im Brief: Website des Kunden, Google-Profil, Impressum, Straße in
Street View lesen, nicht erfinden. Was unbekannt bleibt, als Frage an den User.

## 4. Argument (tasteskill Schritt 2, Pflicht)

Die Seite als Behauptungen mit Beleg, eine Zeile je Sektion, in der Reihenfolge, in der sie
überzeugen. Beispiel: „Wir sind seit 1962 hier (Beleg: Foto der Werkstatt 1962, Meisterbrief)".
Sektionen ohne Beleg werden gestrichen. So entsteht keine Stock-Sequenz (Hero, Logos, 3 Features,
Testimonial, Pricing, CTA). Für App-Screens stattdessen: was sieht der Nutzer zuerst, zweitens,
drittens, und die Zustandstabelle (Loading, Leer, Fehler, Erfolg, Teilweise).

## 5. Referenzen (optional, aber empfohlen)

- **mobbin:** `mobbin:search` nach Flows und Screens der Kategorie, zwei bis vier Referenzen
  sichern, je Referenz notieren, was genau übernommen werden soll. Fehlen die mobbin-Tools:
  einmal um `/mcp` bitten, nicht blockieren.
- **Wettbewerb:** Bei Relaunch oder Markt-Argument `anthropic-skills:website-intelligence`
  (Kundenseite + 5 Wettbewerber, Report). Teuer, nur auf Ansage.
- **Vorhandene Seite:** Screenshot bei drei Breiten in `.ultimate-design/shots/ist/` als Baseline
  für Vorher/Nachher in Phase 4.

## 6. Plan-Review (bei größeren Vorhaben)

Hat das Vorhaben mehrere Screens oder einen Plan mit UI-Anteil, vor Phase 2 die sieben Pässe
aus `source-command-plan-design-review-skill` fahren (IA, Zustände, Journey, Slop-Risiko,
Design-System, Responsive, offene Entscheidungen), jede Frage einzeln mit Empfehlung. Für eine
einzelne Landingpage reichen Inventar und Argument.

## 7. Gate 1

Brief in fünf Punkten zurückspiegeln (Subjekt, Zielgruppe, die eine Handlung, Modus + Stil,
Must-haves/No-Gos), dazu Inventar und Argument als Liste. AskUserQuestion: „Passt der Brief so?
Fehlt etwas?" Erst nach Bestätigung in die Akte schreiben (`phase: 2-entwurf`) und Phase 2 ankündigen,
inklusive: wie viele Varianten (Default 3) und mit welchem Werkzeug.
