# Hausregeln (gelten für alles, was das Plugin ausliefert)
<!-- slop-check: ignore (diese Datei zitiert die verbotenen Muster) -->

Quellen: KAIROS-Regeln des Inhabers (2026), gstack plan-design-review „Design Hard Rules",
frontend-design-Kalibrierung (Anthropic), tasteskill-Haus-Stil, impeccable craft-floor.
Reihenfolge: Brief schlägt Regel. Pinnt der Brief eine Ästhetik fest, gilt der Brief.

## A. Text (Chat und Auslieferung)

1. **Keine Gedankenstriche.** Kein „—", kein „ – " als Gedankenstrich, kein „ -- ". Komma, Punkt,
   Doppelpunkt. `scripts/slop-check.py` scheitert laut, wenn einer durchrutscht.
2. **Kein AI-Vokabular.** Deutsch: nahtlos, ganzheitlich, innovativ, maßgeschneidert, hochwertig,
   professionell, zukunftssicher, effizient, revolutionär, entfesseln, „in der heutigen Welt",
   „Tauchen Sie ein", „Entdecken Sie", „egal ob". Englisch: delve, seamless, robust, comprehensive,
   leverage, empower, elevate, unlock, game-changer, tapestry. Jedes leere Adjektiv wird durch einen
   Beweis ersetzt: Zahl, Name, Ort, Beispiel, Jahr.
3. **Kein generischer Hero-Text.** Nicht „Willkommen bei", nicht „Ihr Partner für", nicht „Die
   All-in-one-Lösung". Der Hero sagt, was der Kunde bekommt, in dessen Worten.
4. **Kundenseitig „Investment", nie „Kosten".** Preise locker sprechen, Stille hinter die Abschlussfrage.
5. **Kurz.** „Wenn 30 Prozent weniger Text die Seite besser macht, weiter streichen."
   Kundendocs als Stichpunkte, der Inhaber erzählt den Rest.
6. **Keine Emojis** im ausgelieferten Text, keine Pfeile als Link-Deko, keine Mittelpunkt-Trenner.
7. **Zahlen vor Kundenkontakt verifizieren.** „Geprüft" im Vault heißt nicht belegt.

## B. Slop-Blacklist (visuell, Instant-Fail)

Sichtet das Plugin eines davon in einem Entwurf, ist die Runde nicht fertig:

1. Lila/Violett/Indigo-Verläufe, Blau-zu-Lila-Schemata.
2. **Das 3-Spalten-Feature-Grid**: Icon im farbigen Kreis, fetter Titel, zwei Zeilen Text, dreimal
   symmetrisch. Das erkennbarste AI-Layout überhaupt.
3. Icons in farbigen Kreisen oder getönten Quadraten als Dekoration.
4. Alles zentriert (`text-align: center` auf jeder Überschrift, jeder Karte).
5. Derselbe große Radius auf allem, derselbe graue Schatten unter allem (SaaS-Karten-Kit).
6. Blobs, schwebende Kreise, Wellen-Divider. Eine leere Sektion braucht besseren Inhalt, keine Deko.
7. Emojis als Design-Element.
8. Farbiger linker Kartenrand (`border-left: 3px solid`).
9. Cookie-Cutter-Rhythmus: Hero, 3 Features, Testimonials, Pricing, CTA, jede Sektion gleich hoch.
10. Template-Chrome: Versalien-Eyebrow über jeder Überschrift, „WORT — Fragment"-Labels,
    Mono-Schrift für kleine Datenlabels, „→" hinter jedem Link, ein Wort im Headline farbig.
11. Die Claude-Palette: Creme (#F4F1EA) mit Serif-Display und Terracotta (#D97757). Auf fremdem
    Brief ist das ein Tell, keine Wahl.
12. Schwarz-mit-einem-Neon-Akzent, Broadsheet-Hairlines mit Null-Radius: legitim für manche Briefs,
    aber nie als Default.
13. Default-Schriften (Inter, Roboto, Arial, system-ui), getöntes Fast-Schwarz (#111) statt Schwarz.
14. Schöne Bildwelt mit schwacher Marke; starke Headline ohne Handlung; Bild hinter Text; Karussell
    ohne Erzählzweck; App-UI aus gestapelten Karten statt Layout.

## C. Lackmus-Fragen (jede Variante, jede Runde, Ja/Nein)

1. Ist die Marke im ersten Viewport unverwechselbar?
2. Gibt es genau einen starken visuellen Anker?
3. Versteht man die Seite, wenn man nur die Überschriften liest?
4. Hat jede Sektion genau einen Job?
5. Sind die Karten wirklich nötig?
6. Verbessert die Bewegung Hierarchie oder Atmosphäre?
7. Wirkt das Design noch premium, wenn man alle dekorativen Schatten entfernt?
8. **Konkurrenz-Test (tasteskill):** Setze den nächsten echten Wettbewerber in den Idee-Satz. Passt
   er noch, gehört die Idee der Kategorie, nicht dem Kunden. Neu suchen.

## D. Landingpage-Regeln (Modus Persuade/Experience)

- Erster Viewport ist eine Komposition, kein Dashboard: Marke > Headline > Satz > CTA > ein Bild.
- Hero randlos, keine Karten im Hero. Hero-Budget: Marke, eine Headline, ein Satz, eine CTA-Gruppe, ein Bild.
- Typografie trägt die Persönlichkeit: eine oder zwei Familien, deutlich verschieden, bewusst gewählt.
- Keine flachen Einfarb-Hintergründe als Default: Felder, Bilder, Material.
- Motion: ein orchestrierter Moment (Load oder ein Reveal) plus Bewegung, die auf Handlung
  antwortet. Nicht jede Sektion fadet hoch, nicht jede Karte hovert.
- Eine lebende Sache (tasteskill): etwas, das der Besucher tun kann, aus dem Stoff des Kunden
  gebaut, mit Daumen bedienbar, mit Fallback ohne Script.
- Substanz statt Leere: Ornamente weg ist die halbe Arbeit. Größere Schrift, ganze Farbfelder,
  echte Bilder aus der Welt des Kunden, jede Sektion mit vollem Inhalt.

## E. App-UI-Regeln (Modus Operate/Read)

- Ruhige Flächenhierarchie, starke Typografie, wenige Farben, dichte aber lesbare Information.
- Karten nur, wenn die Karte die Interaktion ist. Keine Dashboard-Mosaike, keine dekorativen Verläufe.
- Überschriften sagen, was der Bereich ist oder was man dort tun kann.
- Copy ist Nutzsprache: Orientierung, Status, Handlung.

## F. Prozessregeln

1. **Vergleichs-Artifact statt Beschreibung.** Jede Entscheidung mit mindestens zwei Kandidaten,
   durchklickbar, mit Screenshots bei drei Breiten. Vorlage in `vergleichs-artifact.md`.
2. **Visuelle Abnahme macht der Mensch.** Das Plugin schaut selbst (Screenshot, Rubrik), aber das
   letzte Wort über „haut mich um" hat der User. Ausnahme: frisch erfundene Effekte zeigt das
   Plugin dem User als Screenshot, bevor es weiterbaut.
3. **Erst das Artefakt prüfen, dann behaupten.** Live-URL abrufen, gebautes HTML lesen, Screenshot
   öffnen, bevor „fertig", „existiert nicht" oder „funktioniert".
4. **Stille Fehler sind die teuren.** Jede Prüfung scheitert laut: slop-check mit Exit 1, Lighthouse
   mit Zahl, inspect.mjs mit Befundliste.
5. **Der Brief gewinnt.** Verfeinerung bewahrt (Identität, Verhalten, Copy, alles außerhalb des
   Auftrags). Redesign ersetzt (alte Optik ist Anti-Referenz). Nie halb-halb.
6. **Keine Gedankenstriche auch im Chat.** Die Regel gilt für die Antworten des Plugins, nicht nur
   für die Auslieferung.
