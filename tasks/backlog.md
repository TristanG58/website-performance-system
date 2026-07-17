# Backlog — offene Optimierungen & nächste Schritte

> **Für den nächsten Agent:** Diese Datei beantwortet „Was können wir noch optimieren?" und
> „Was sind die nächsten Schritte?" für das SEO/GEO-System. Sie ist bewusst selbsterklärend —
> du brauchst keinen Chatverlauf dazu. Stand: 2026-07-17.
>
> Kontext, falls unbekannt: `shared/seo-monitor/README.md` (Architektur), `tasks/todo.md`
> (Bau-Historie S1–S8), `shared/knowledge/seo-geo/geo-seo-playbook.md` (Fachwissen, Quelle der Wahrheit).

**Systemstand:** Der Monitor läuft produktiv auf Hetzner (`/opt/kairos`, systemd-Timer, wöchentlich
Mo 06:00). Er prüft ausgelieferte Sites gegen `shared/knowledge/seo-geo/standard.json` und schreibt
Reports nach `shared/seo-monitor/reports/`. Nichts hier unten ist ein Bug — es sind bewusste Lücken.

---

## A. Aus der GEO-Kurs-Analyse (2026-07-17)

Auslöser: `~/Downloads/GEO-Kurs - In ChatGPT und Co. gefunden werden.md`. Der Kurs zerlegt GEO in
7 Schritte. Unser Monitor deckt **Schritt 5 (Technik)** ab und streift Schritt 3 (Entität).
Die Schritte 1, 6, 7 sind offen — siehe unten.

### A1. AI-Visibility-Check automatisieren (Schritt 1 + 7) — größter Hebel

**Was:** Messen, ob der Kunde in AI-Antworten **genannt** wird — nicht nur, ob seine Website sauber ist.
Pro Kunde eine Prompt-Liste („bester Dachdecker in Meschede"), wöchentlich absetzen, Antwort nach
Firmenname **und Konkurrenten** durchsuchen, Ergebnis in den Report, Trend über Zeit.

**Warum das zählt:** Das ist die Frage, für die der Kunde zahlt. Alles, was wir heute messen, ist nur
Vorbedingung dafür. **Wir haben das selbst schon gefordert und nie automatisiert:**
`geo-seo-playbook.md` → „AI-Visibility-Audit (manuell, monatlich)" und
`plugins/meisterwerk/skills/handwerk-seo-geo/SKILL.md` → „AI-Visibility-Baseline". Niemand macht das
für 50 Kunden von Hand. Genau dafür existiert Version 2.

**Passt architektonisch:** Cron steht, Report-Schema (`shared/schemas/seo-report.schema.json`) steht,
Dashboard-Vertrag steht. Es wäre ein Modul neben `evaluate.py`.

**Vorher zu klären — nicht überspringen:**
1. **API ≠ Produkt (das k.o.-Kriterium).** Die OpenAI-API groundet anders als chatgpt.com. Wenn wir die
   API messen und dem Kunden „Sie stehen in ChatGPT" verkaufen, ist die Aussage nicht gedeckt.
   Perplexitys API liegt am nächsten an ihrem Produkt. **Diese Frage entscheidet, ob das Modul ehrlich
   verkaufbar ist** — sie muss vor der ersten Zeile Code beantwortet sein.
2. **Bricht „kein LLM im Cron"** (siehe `shared/seo-monitor/README.md`). Verteidigbar, weil das LLM hier
   *Messobjekt* ist, nicht *Urteiler* — der String-Match bleibt deterministisch. Aber es ist eine echte
   Architekturentscheidung.
3. **Nicht deterministisch:** gleicher Prompt → andere Antwort. Nur Trends interpretieren, keine
   Einzelmessung als Wahrheit verkaufen.
4. **Kosten pro Lauf** und **API-Keys auf dem Server** — es gibt aktuell **kein Secret-Management**
   in `/opt/kairos`. Das wäre neu zu bauen.

### A2. Erwähnungen / Off-Site-Präsenz (Schritt 6) — ruht

**Was:** Prüfen/aufbauen, ob der Betrieb in Verzeichnissen und Vergleichslisten auftaucht.

**Warum es ruht:** Der Kurs behauptet „fast 44 % der ChatGPT-Empfehlungen kommen aus Top-Listen" —
**unbelegt**, wie alle Zahlen dort. Wenn es stimmt, ist das perspektivisch der größte Hebel überhaupt
(siehe Playbook-Section „Ziel festlegen: Mention oder Citation" — Mentions entstehen off-site).
**Erst belegen, dann bewerten.** Wäre ohnehin ein anderes Produkt als der Monitor, weil der Monitor
strukturell nur die Kundenseite abruft.

### A3. Kursinhalte gehören NICHT in standard.json — Entscheidung, kein Todo

Festgehalten, damit es niemand „nachholt": **Es gibt keinen Grund, den Kurs in `standard.json`
einzubauen.** Zwei Gründe:
1. `standard.json` ist ein **maschinen-prüfbarer** Vertrag — jede Regel muss `evaluate.py` an einer
   abgerufenen Seite entscheiden können. „Kämpfe um die Mention" ist Strategie, keine Prüfregel.
2. Der Vertrag hat **genau einen Schreiber**: die News-/Trend-Automation, mit Quellenpflicht und
   SemVer-Regeln (siehe `shared/knowledge/seo-geo/AUTOMATION-HANDOVER.md`). Unbelegte Kursinhalte
   daneben zu schreiben, würde ihn beschädigen.

Der legitime Kurs-Ertrag (Mention/Citation, Grounding, Query Fan-out) ist **bereits im Playbook** —
ohne die unbelegten Zahlen. Erledigt, nichts offen.

---

## B. Bereits offen aus dem Monitor-Bau (S1–S7)

### B1. `notEvaluated`-Regeln implementieren

Drei Regeln in `standard.json` sind deklariert, aber **nicht implementiert** — der Report meldet sie
ehrlich als `notEvaluated` statt sie stillschweigend zu bestehen:
- `robots-allows-ai` — robots.txt abrufen, AI-Bots gegen die Liste im Playbook prüfen
- `sitemap-present` — Sitemap abrufen/validieren
- `nap-consistent` — NAP über die Seiten hinweg vergleichen

Kleinster echter Zugewinn im Backlog, gut abgegrenzt, kein Architekturrisiko.

### B2. Dashboard („Übersicht" aller laufenden Systeme)

Reports liegen als JSON konform zu `shared/schemas/seo-report.schema.json` — der stabile Vertrag ist
da. Anbindung ist reine Anzeige-Arbeit, kein Rework am Runner. War explizit gewünscht („eigene
Übersicht-Website, wo ich alle laufenden Systeme im Überblick habe").

### B3. `liveUrl` auf Produktionsdomain umstellen

`/opt/kairos/registry/clients.json` zeigt für den PV-Pilot noch auf `https://pv-fachbetrieb.vercel.app`.
Sobald `www.pv-fachbetrieb.de` live ist, umstellen. **Achtung:** Domainwechsel = neue Drift-Baseline;
der erste Lauf danach meldet `baseline_established` statt `compared`. Das ist erwartet, kein Fehler.

### B4. Weitere Kunden ins Register

Z. B. Gössel Elektrotechnik → `trade: elektriker`. Registerdatei liegt **nur auf dem Server**
(`/opt/kairos/registry/clients.json`) — im Repo steht bewusst nur `registry/clients.example.json`
mit öffentlicher Test-URL. **Keine Kundendaten ins Repo.**

### B5. ~~Playbook-Dedup~~ — hinfällig, war ein Irrtum (korrigiert 2026-07-17)

**Hier stand, die 3 identischen Playbook-Kopien seien ein ungelöstes Duplikations-Problem. Das war
falsch.** Es gibt bereits `shared/sync/` („Modell C"): zentrale Quelle unter `shared/knowledge/` →
maschinell gespiegelte Kopien in jedem Plugin, mit Manifest, `--check`-Modus und Sicherheits-
invarianten. Die Kopien sind **Absicht**: die Plugins sind über `plugins/.claude-plugin/marketplace.json`
eigenständig installierbar, ein Symlink nach `shared/` würde nach der Installation ins Leere zeigen.

**Nichts zu tun.** Die Regel steht in `shared/sync/README.md` und im Playbook-Header:
immer `shared/knowledge/` ändern → `node shared/sync/sync.mjs --sync` → vor dem Commit `--check`.

*Warum der Irrtum passierte:* Der Sync-Mechanismus war in **keiner** Markdown-Datei dokumentiert —
nur im Kopfkommentar von `sync.mjs`. Das ist behoben (`shared/sync/README.md`, Playbook-Header).
Lehre für den nächsten Agent: bei „das liegt ja mehrfach rum" **erst prüfen, ob es dafür schon ein
Werkzeug gibt** (`shared/sync/`, `shared/schemas/`), bevor ein Refactor vorgeschlagen wird.

### B6. Learnings-Ordner in der globalen CLAUDE.md eintragen

Der LEARNINGS-Abschnitt in `~/.claude/CLAUDE.md` listet nur `Kairos-Websites/learnings/templates/`.
Das Monitor-Learning liegt unter `Kairos-Websites/learnings/website-performance-system/` und wird so
nicht gefunden. Wurde angeboten, nie entschieden.

---

## Reihenfolge-Empfehlung

1. **B1** (`notEvaluated`-Regeln) — kleinster Aufwand, macht bestehende Reports ehrlich vollständig.
2. **B2** (Dashboard) — macht die vorhandene Arbeit erst sichtbar/verkaufbar.
3. **A1** (AI-Visibility) — größter Produktzugewinn, aber erst nach der API-vs-Produkt-Entscheidung.
4. **A2** (Erwähnungen) — erst nach Beleg der 44-%-Behauptung.
