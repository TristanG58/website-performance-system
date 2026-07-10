---
name: handwerk-design-system
description: >
  Design-System & Animations-Referenz für das Meisterwerk-v2-Template (Miller-Edition). Definiert
  die fixen Tokens (Navy #1C3F60 + Steel-Blue, Albert Sans), die Sektions-Bausteine und die
  Signatur-Animationen (GSAP-Scroll-Reveals, 3D-Team-Karussell, Sticky-Reveal-Footer, Count-up).
  Nutze dieses Skill für Design-Treue-QC und um zu wissen, was fix ist und was personalisiert wird.
license: MIT
allowed-tools: Read, Grep, Glob
---

# Meisterwerk v2 — Design-System (Miller)

Das Design ist **fix**. Du personalisierst nur Markenfarbe, Bilder, Logo und Texte (via
`config/site.js`). Struktur, Layout, Radius, Fonts und Animationen bleiben unangetastet.

## Design-Tokens (fix — nur die Markenfarbe wird getauscht)
```
--dark    #1C3F60   Navy — Primär (CTAs, Header-Logo-Text, Footer-Fläche, Headings)
--light   #F5F8FB   heller Section-Hintergrund
--key1    #6A93B0   Steel-Blue — Akzent (Hover, Fokus-Ring, Rollen/Eyebrows)
--key2    #8A1F1F   Dunkelrot — sparsamer Sekundärakzent
offwhite  #F0EDE8   warmes Off-White (Text auf Navy)
Radius    4–14px    dezent
Header/Body-Font: Albert Sans  (Header 700/-0.4px/lh1.2 · Text 400/-0.1px/lh1.4)
```
Beim Personalisieren: nur `--dark`/`--key1` (+ ggf. `--key2`) auf die Kundenfarbe. **Navy-Charakter
wahren** (dunkle, gedeckte Primärfarbe). Helle, cleane Basis bleibt. Sterne-Gold `#F7BF04` für Rating.

## Sektions-Bausteine (CSS-Klassen in styles.css)
- **Home:** `.hero` + `.hero-marq` (Marquee) · `.about`/`.about-grid` · `.quiz` (Funnel) ·
  `.services`/`.svc-card` · `.vorteile`/`.reasons` · `.team`/`.cg` (3D-Gallery) · `.faq` (Minimal-Divider) ·
  `.kontakt` (Info + Map + `.kt-form`) · `.site-footer` (Sticky-Reveal).
- **Unterseiten:** `.page-hero` · `.sec`/`.sec.alt` · `.lst`/`.lst-row` (Leistungen) · `.cardgrid`/`.vcard` ·
  `.split` · `.statband` (Count-up) · `.jobs`/`.job` · `.cta-band`.
- **Formulare (shadcn-Stil):** `.qinp` (Input/Select/Textarea), `.qselwrap`, `.qrow2`, `.qconsent` —
  Labels ÜBER dem Feld, 3px Fokus-Ring in `--key1`. Quiz + Kontaktformular teilen diese Klassen.

## Signatur-Animationen (fix — NICHT ändern)
1. **Scroll-Reveals** (fade + slide-up, gestaffelt): `html.anim-on` wird per Inline-`<head>`-Script
   gesetzt (respektiert `prefers-reduced-motion`), CSS versteckt vorab (kein Flash), `ScrollTrigger.batch`
   blendet ein. Fallback: fehlt GSAP → `anim-on` entfernt → alles sichtbar.
2. **Bild-Hover-Zoom** auf `.svc-card`-/`.lst-`/`.split`-Bildern (entspricht Millers `zoomIn`).
3. **3D-Team-Karussell** (`.cg`): Karten auf Kreis (`rotateY(i*36deg) translateZ(radius)`); Wheel-über-
   Section dreht Karten & blockt Seiten-Scroll, gibt **richtungsabhängig nach 1 Runde** frei; Bio erscheint
   bei Hover. **Kein Drag** (markiert sonst Text/Bilder).
4. **Sticky-Reveal-Footer:** `clip-path`-Polygon + `fixed`+`sticky`, Blur-In der Spalten (auf Mobile deaktiviert).
5. **Marken-Marquee** im Hero (weiß gefilterte Hersteller-Logos, 80px hoch).
6. **Stat-Count-up** im Stat-Band (parst „80+"/„4,9 / 5"/„100%", deutsches Komma-safe).

## Design-Treue-QC (im Browser)
- [ ] Navy-Hero mit sichtbarem Marken-Marquee (große Logos)
- [ ] Quiz-Funnel funktioniert (Schritte, Fortschritt, Erfolgsmeldung)
- [ ] 3D-Team-Karussell dreht per Wheel, Bio bei Hover lesbar, Seite scrollt erst nach 1 Runde weiter
- [ ] Minimal-FAQ single-open (+/−), Sticky-Reveal-Footer legt sich frei
- [ ] Scroll-Reveals feuern; Stat-Count-up zählt hoch; `prefers-reduced-motion` = alles ruhig sichtbar
- [ ] Nur Markenfarbe getauscht, sonst Tokens unverändert; Albert Sans überall

## Anti-Slop
Keine generischen KI-Muster: keine Emoji-Icon-Wände, keine „Notch"-Badges, keine bunten Farbverläufe
auf jeder Fläche. Ruhige, handwerklich-seriöse Anmutung. Siehe `reference/anti-slop.md`.
