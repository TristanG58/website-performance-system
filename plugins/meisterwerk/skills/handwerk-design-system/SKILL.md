---
name: handwerk-design-system
description: >
  Hüter des fixen Meisterwerk-Designs für Dachdecker-Websites. Kennt die gesetzten Farb-Tokens
  (Navy + Gold), Typografie, Sektions-Struktur und das komplette GSAP-Animations-Inventar
  (Überschriften-Wipe-up, Card-Zoom, Road-Timeline mit fließender Linie + wandernden Strichen,
  Foto-Bento-Parallax, Google-Review-Optik). Nutzen, um das Template korrekt zu personalisieren
  ohne das Design zu brechen, eine Markenfarbe einzusetzen, oder einen Build auf Design-Treue
  zu prüfen. Teil des Meisterwerk-Plugins. Quelle der Wahrheit: reference/template-spec.md.
license: MIT
---

# Handwerk Design System — Hüter des fixen Looks

Das Meisterwerk-Design ist **fertig und fix**. Deine Aufgabe ist nicht, neu zu gestalten, sondern dafür zu sorgen, dass jede personalisierte Site **exakt dieses** Design + diese Animationen behält. Quelle der Wahrheit: **`reference/template-spec.md`** (immer zuerst laden).

## When to Use This Skill
Beim Personalisieren des Templates (Markenfarbe setzen, Bilder/Logo einsetzen) und beim Design-Treue-Check vor der Übergabe. Wird vom `handwerk-site-builder` in der Personalisierungs- und QC-Phase genutzt.

**Related:** `handwerk-site-builder` (Orchestrator), `handwerk-seo-geo`.

## Das fixe Design (Kurzfassung — Details in template-spec.md)
- **Helle, cleane Basis** (Default-Theme `light`), Navy als Markenfarbe, Gold für Bewertungssterne, echtes farbiges Google-Logo in der Referenzen-Sektion.
- **Multi-Page (5 Seiten), feste Sektions-Verteilung** — geteiltes Layout (Header + `<Outlet/>` + Footer), Sektionen liegen in `src/components/site/sections.tsx`, Seiten in `src/pages/` komponieren sie:
  - **`/` Start:** Hero+Stats → Leistungen (Teaser, 3 + „Alle Leistungen") → Warum wir → Referenzen → CTA-Band
  - **`/leistungen`:** Leistungen (voll) → Ablauf (Road-Timeline) → CTA-Band
  - **`/projekte`:** Projekte (Foto-Bento) → Referenzen (Google-Reviews) → CTA-Band
  - **`/ueber-uns`:** Über-uns-Intro → Stats → Warum wir → CTA-Band
  - **`/kontakt`:** Kontaktformular → FAQ
- **Nav = echte Seiten-Links** (react-router `NavLink`/`Link`), nicht Anchor-Scroll. Header-Nav + Footer + CTAs verlinken zwischen den 5 Seiten.
- **Signatur-Animationen (nicht antasten):** Überschriften-Wipe-up (`.split-heading`), Leistungs-Card-Zoom (`group-hover:scale-105`), Ablauf-Road — Linie *fließt* von Karte zu Karte (`.road-fill`) + Striche *wandern* (`.road-dash`), Projekte-Bento-Parallax (`.bento-img`), Testimonial-Gold-Sterne (`.t-star`). Laufen pro Seite neu (re-init bei Routenwechsel, `useSiteAnimations` mit `revertOnUpdate`).

## Personalisieren (genau 3 Stellen)
1. **`template/src/config/site.ts`** — alle Inhalte (siehe Personalisierungs-Map in template-spec.md).
2. **`template/src/index.css`** — nur `--primary` (+ `--ring`) auf die Markenfarbe; Hex → OKLCH umrechnen, Lightness ~0.28–0.40.
3. **`template/public/img/`** — echte Bilder unter den vorhandenen Dateinamen; Logo einsetzen.

## Markenfarbe einsetzen
Gescrapte Primärfarbe des Kunden nehmen. Wenn sie zu hell/grell ist, auf eine seriöse, dunklere Variante normalisieren (Navy-Charakter behalten: tief, vertrauenswürdig). Gold + Neutrals bleiben unverändert — sie tragen die Google-Optik und die Lesbarkeit.

## Design-Treue-Check (vor „fertig")
- Theme startet **hell**; Navy-Akzent auf Buttons/Icons/Eyebrows sichtbar.
- Bewertungssterne **gold**, Google-Logo **farbig**, „Referenzen"-Label vorhanden.
- Ablauf zeigt die **geschwungene Road** zwischen den Karten; beim Scrollen zeichnet sich die Linie ein und die Striche wandern.
- Projekte als **Foto-Bento** mit verschiedenen Kachelgrößen, Parallax auf Desktop.
- Überschriften wischen beim Scrollen hoch; Leistungs-Cards zoomen beim Hover.
- Keine leeren Bildflächen, keine Platzhalter, keine erfundenen Zahlen.

## Do Not
- Seiten/Routen hinzufügen oder entfernen (5 Seiten sind fix), Sektionen umsortieren, Animations-Marker-Klassen umbenennen/entfernen.
- Andere Tokens als `--primary`/`--ring` ändern; Bento-Spans anfassen.
- Inhalt per CSS verstecken, der auf JS wartet (Fail-safe-Muster bleibt: Initial-Hidden nur per JS).
- Erfundene Bewertungen/Mitgliedschaften/Kennzahlen.

### Learn More
`reference/template-spec.md` (vollständige Spec + Personalisierungs-Map) · `reference/anti-slop.md` · `reference/resources.md`.
