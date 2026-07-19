# Plan: Kontinuierlicher SEO/GEO-Update-Flow ("Version 2")

> Status: **ENTWURF — zeigen bevor gebaut wird** (REGEL #1)
> Erstellt: 2026-07-13 · Kontext: Vergleich unser `handwerk-seo-geo` vs. `AgriciDaniel/claude-seo`

---

## 1. Ziel

Zwei SEO/GEO-Produkte sauber trennen:

- **Version 1 — Einmalige Aufsetzung** (kommt mit der Website): bleibt **unverändert** bei unserem
  Skill `handwerk-seo-geo`. Kennt das Template, ist schlank, kein Install-Overhead. **Kein Bedarf an claude-seo.**
- **Version 2 — Kontinuierliche Aktualisierung** (NEU): Die Website wird regelmäßig gegen den aktuellen
  SEO/GEO-Stand geprüft und angepasst, damit sie nicht "verrottet". **Hier fehlt uns der Motor** — den
  liefert `claude-seo` (`seo-drift`).

## 2. Was der PoC bewiesen hat (2026-07-13)

Engine isoliert gegen echte Dachdecker-Seite (Meisterbetrieb Richert, Dorsten) gelaufen:

- `drift_baseline.py` erfasst Seite + legt SEO-Lücken offen (leere Meta-Description, kein Canonical, **0 Schema-Blöcke**).
- `drift_compare.py` = die Recurring-Engine: **17 severity-gestufte Regeln** (CRITICAL/WARNING/INFO).
  - **CRITICAL:** `noindex_added` (Deploy-GAU), `schema_removed`, `canonical_removed/changed`,
    `h1_removed/changed`, `title_removed`, `status_code_error`
  - **WARNING:** `title_changed`, `meta_description_changed`, `cwv_regressed`, `perf_score_dropped`,
    `og_tags_removed`, `schema_modified`
  - **INFO:** `content_hash_changed`, `schema_added`, `h2_structure_changed`
- **Security-Review:** Code geklont & durchsucht — kein `curl|bash`, keine Exfiltration, sauberes
  Threat-Model (SSRF-Schutz `url_safety.py`, Creds `0o600`), keine Prompt-Injection in Skill/Agent-Dateien. **Vertrauenswürdig.**
- **Technische Randbedingung:** Python **3.10+** nötig (macOS-System-Python 3.9 reicht nicht → venv mit Homebrew-3.12).
  Kern läuft mit **4 Deps** (bs4, requests, lxml, validators); schwerer Stack (Playwright/Google-APIs/WeasyPrint) nur für CWV-Livedaten/PDF optional.

## 3. Architektur-Entscheidung: schichten, nicht ersetzen

```
┌─────────────────────────────────────────────────────────────┐
│  KAIROS Update-Flow (NEU) — orchestriert pro Kunde           │
│                                                              │
│  Branchen-Layer:  reference/trades/<gewerk>.md  ◄── UNSER    │
│  GEO-Wahrheit:    handwerk-seo-geo playbook     ◄── UNSER    │
│                    │                                          │
│                    ▼                                          │
│  Motor:           claude-seo → seo-drift (baseline/compare)  │
│                   + seo-local, seo-schema, seo-technical     │
│                    │                                          │
│                    ▼                                          │
│  Report:          CRITICAL → Alert · WARNING/INFO → Report   │
└─────────────────────────────────────────────────────────────┘
```

- **Nicht** das ganze 25-Skill-Plugin installieren. Nur: `seo-drift`, `seo-local`, `seo-schema`,
  `seo-technical`, `seo-geo`. **Weglassen:** `seo-ecommerce`, `seo-hreflang`, `seo-programmatic`,
  `seo-image-gen` (Banana), alle kostenpflichtigen Extensions (DataForSEO/Ahrefs/Moz) vorerst.
- **Registry-getrieben:** `registry/clients.schema.json` hat bereits `enabledModules`, `lastAudit`,
  `status`. Der Flow iteriert Kunden mit Modul `"seo-continuous"`, setzt nach jedem Lauf `lastAudit`.
- **Branchen-Individualisierung:** Der `trades/<gewerk>.md`-Layer entscheidet, was für einen Dachdecker
  vs. SHK "gutes SEO/GEO" heißt (Keywords, Kundenfragen, Schema-Unterklasse `RoofingContractor` vs. `Plumber`).

## 4. Entscheidungen (Stand 2026-07-13)

- [x] **Baseline-Quelle:** Baseline beim Launch aus **unserem gebauten HTML** (Soll-Zustand), nicht von der Live-Seite. ✅ **bestätigt**
- [x] **Trigger:** **Wöchentlicher Cron-Job.** ✅ Verzahnt mit der separaten News-/Trend-Automation (siehe §4a).
- [x] **Integrationsform:** **vendored** — Subset (5 Scripts) + MIT-Lizenz + präzise Provenance unter `shared/seo-engine/`. ✅ **bestätigt**
      Vendored von `AgriciDaniel/claude-seo` **main@6cf1ea9** (security-reviewed 2026-07-13). Ein minimaler Patch: Import `validate_url`
      aus `url_safety` statt `google_auth` → OAuth-Modul (31KB) entfällt komplett.
- [x] **CWV-Livedaten:** **erst ohne CWV.** ✅ **bestätigt** — 16 der 17 Regeln laufen API-frei. CWV später mit Google-PSI-Key.
- [x] **Report-Ausgabe:** Als **strukturiertes JSON + Markdown mit stabilem Schema** → Dashboard liest es später ohne Rework ein.
      Dashboard-Umbau läuft separat (dauert noch). Kein E-Mail-Alert nötig, Ausgabe geht ins Dashboard.

### 4a. Verzahnung mit der News-/Trend-Automation (NEU — zentral)

Zwei komplementäre Drift-Richtungen, **eine gemeinsame Standard-Quelle**:

| Richtung | Was driftet | Auslöser | Ergebnis |
|---|---|---|---|
| **Regression-Guard** (dieser Flow) | die **Site** fällt unter Soll | Kunde/CMS/Deploy zerschießt was | **Alert** (CRITICAL) |
| **Trend-Propagation** (News-Automation) | der **Standard** steigt | Feld ändert sich, News validiert | **Upgrade-Push** auf Sites |

- Der "Soll" ist **nicht statisch**: die News-Automation schreibt das lebende `handwerk-seo-geo`-Playbook fort.
- `seo-drift` bleibt Diff-Maschine; die Erwartung/Baseline wird **versioniert** und von der News-Automation gepflegt.
- Findings bekommen zwei Typen: **Regression** (Site < Soll) und **Upgrade** (Soll > Site → neue Best-Practice anwenden).
- [x] **Standard-Quelle:** ✅ **entschieden (Claude)** — Monitor liest den Soll aus eurer bestehenden `shared/knowledge/seo-geo/`.
      Dazu neu: versionierter, maschinenlesbarer Vertrag `standard.json` (`standardVersion` + Pflicht-Elemente je Gewerk) neben dem Playbook.
      News-Automation bumpt `standardVersion` → Monitor erkennt "Soll > Site" automatisch. Beide Systeme, eine Quelle, definierte Schnittstelle.

## 5. Umsetzungsschritte (nach Freigabe des Konzepts)

- [x] **S1 — Vendored Motor:** ✅ `shared/seo-engine/` angelegt — 5 Scripts (main@6cf1ea9), Import-Patch (google_auth→url_safety),
      `requirements.txt`, `LICENSE`, `SOURCE.md`, `README.md`. venv 3.12 aufgesetzt, `compileall` OK, E2E baseline+compare
      gegen echte Dachdecker-Seite verifiziert (17 Regeln). `.venv`/`__pycache__` gitignored.
- [x] **S2 — Registry:** ✅ `clients.schema.json` um 3 optionale Felder ergänzt: `trade` (enum der 8 Gewerke, deckt sich mit standard.json),
      `liveUrl` (Produktions-URL), `seoBaseline` (`capturedAt`/`standardVersion`/`source`). `enabledModules` nimmt `"seo-continuous"` (Freitext-Array).
      Verifiziert: Meta-Schema gültig, Beispiel-Client validiert, trade-Negativtest abgelehnt.
- [x] **S3 — Orchestrator (Kern):** ✅ `shared/seo-monitor/evaluate.py` — Live-Site vs `standard.json`, trade-spezifische
      Schema-Unterklassen-Prüfung, Findings (gap/deprecated/upgrade) severity-sortiert. Report-Schema
      `shared/schemas/seo-report.schema.json`. Skill `plugins/meisterwerk/skills/handwerk-seo-monitor/SKILL.md` (Wrapper + Urteils-Ebene).
      `--format json|md`. Verifiziert gegen 2 echte Seiten (Schema-fehlt → CRITICAL; falsche Unterklasse → CRITICAL; Upgrade 0.9→1.0 → INFO), Reports schema-valide.
  - [x] **S3b — drift_compare-Integration:** ✅ `--with-drift` in `evaluate.py`+`run.py` — `collect_drift_regressions()` speist
        Live-vs-Baseline-Regressionen als `regression`-Findings ein. Erster Lauf/URL erfasst Baseline (`baseline_established`),
        ab dann `compared`. Dedup: Regression verdrängt deckungsgleichen Gap. `driftStatus` im Report + Schema. Baseline-DB
        per Env `KAIROS_DRIFT_DB_DIR` (vendored Patch #2), Default `shared/seo-monitor/.drift` (gitignored).
        Verifiziert: 2-Lauf-Verhalten, Dedup-Unit-Test, Schema-Validierung.
  - [x] **S3c — Cron-Runner:** ✅ `shared/seo-monitor/run.py` — iteriert Register (Filter: active + `seo-continuous` + liveUrl + trade),
        evaluiert je Kunde, schreibt JSON+MD nach `reports/` (gitignored), setzt `lastAudit`. `--dry-run`/`--only`/`--format`.
        Fixture `registry/clients.example.json` (öffentliche Test-URL, keine Kundendaten). E2E verifiziert: 1 eligible/1 skipped, Reports geschrieben, lastAudit gesetzt.
        **Deployment:** `shared/seo-monitor/README.md` — Hetzner systemd-Timer (wöchentlich) + cron-Alternative. Läuft deterministisch ohne LLM.
- [x] **S4 — Standard-Vertrag (Interface-first, vor S2/S3 gezogen):** ✅
      `shared/knowledge/seo-geo/standard.json` (v1.0.0) — global `require` (9 Pflicht-Checks, an drift-Regeln gemappt) +
      `deprecated` (FAQ/HowTo/llms.txt, aus Playbook geerdet) + `trades.*` Schema-Unterklassen für alle 8 Gewerke
      (RoofingContractor/Plumber+HVAC/Electrician/HousePainter/AutoRepair, GeneralContractor-Fallback wo kein dedizierter Typ).
      JSON-Schema `shared/schemas/seo-standard.schema.json`. Verifiziert: JSON gültig, schema-valide, alle 8 Gewerke gemappt,
      alle driftRule-Referenzen gültig. **Dies ist die Andock-Schnittstelle für die News-/Trend-Automation.**
- [x] **S5 — Report-Template:** ✅ In `evaluate.py --format md` — Findings severity-sortiert (CRITICAL oben), Kopf mit Summary,
      `notEvaluated`-Hinweis. JSON bleibt der Dashboard-Vertrag (`seo-report.schema.json`).
- [x] **S6 — Pilot:** ✅ Gegen echte KAIROS-Site `pv-fachbetrieb.vercel.app` (Böttger Elektro/PV, Rodenberg) beaufsichtigt gefahren.
      Ergebnis ideal: 0 CRITICAL / 0 WARNING / 1 INFO (FAQPage deprecated). Zwei-Lauf-Lebenszyklus (baseline_established → compared) live bestätigt.
      **Pilot-Erkenntnis umgesetzt:** Gewerk `photovoltaik` zu standard.json ergänzt (accepted: Electrician + HomeAndConstructionBusiness),
      `standardVersion` 1.0.0 → 1.1.0. Re-Pilot bestätigte: Schema-Check grün + Upgrade-Finding (1.0.0→1.1.0) feuert — voller Kreislauf live bewiesen.
- [x] **S7 — Learning:** ✅ `Kairos-Websites/learnings/website-performance-system/2026-07-13_seo-geo-continuous-monitor.md`
      (Python-3.10-Falle, Vendoring-Muster + 2 Patches, Skript-Closure, Schema-Unterklassen-Mapping, Cron-ohne-LLM, Fallen).

## 6. Nicht-Ziele / Do-Not

- Kein unbeaufsichtigter Cron auf Kundenseiten, bevor S6-Pilot sauber lief.
- Keine kostenpflichtigen Extensions ohne separate Freigabe.
- Version 1 (einmalige Aufsetzung) **nicht** anfassen — läuft, bleibt.
- claude-seo nicht als Ganzes installieren (Scope-Kappung, siehe §3).

---

## Review (wird nach Umsetzung gefüllt)

_(Zusammenfassung der Änderungen — noch leer.)_

---

# S8 (2026-07-17): GEO-Kurs-Ertrag einarbeiten + Backlog verankern

**Auslöser:** Analyse von `~/Downloads/GEO-Kurs - In ChatGPT und Co. gefunden werden.md`.
**Befund:** Kurs enthält nur Modul 1–3 von 8 (Modul 4–8 = Content/E-E-A-T/Technik/Messen/Verkauf fehlen)
und belegt **keine einzige** seiner Zahlen. Echter Ertrag: 3 Konzepte fürs Playbook. Sonst nichts.

**Leitregel dieses Schritts (User, 2026-07-17):** nur einbauen, was **ohne weitere Komplikationen**
einfügbar ist. Alles andere wird so vermerkt, dass es in **jedem neuen Chat** gefunden wird.

## Tun (komplikationsfrei, keine Code-Änderung)

- [x] **Playbook ×3 Kopien** (byte-identisch halten: `shared/knowledge/seo-geo/`,
      `plugins/meisterwerk/reference/`, `plugins/meisterwerk-miller/reference/`)
  - [x] Neue Section **„Ziel festlegen: Mention oder Citation"** nach Grundprinzip
        → für Handwerk keine Entscheidung, sondern Konstante: **immer Mention**.
        Erklärt, warum GBP (~36 %) + Bewertungen (~17 %) die On-Page-Arbeit (~16 %) schlagen.
  - [x] Neue Section **„Grounding: die Vorbedingung jeder Citation"**
        → ohne Live-Suche kein Quellen-Link. Ergänzt „indexiert + snippet-fähig" um die *Query-Seite*.
  - [x] Citable-Copy-Pattern **„7. Unterfragen mitbeantworten (Query Fan-out)"**
  - [x] Provenienz-Hinweis: Konzepte aus dem Kurs, **Zahlen des Kurses bewusst NICHT übernommen**
        (unbelegt). Nur Mechanismus/Framing, keine Statistik → Quellendisziplin bleibt intakt.
- [x] **Playbook-Tail säubern:** verirrte `</content>` / `</invoke>` am Dateiende (alle 3 Kopien)
- [x] **`tasks/backlog.md`** anlegen — die vertagten Punkte samt Begründung
- [x] **Memory + `MEMORY.md`-Index** → Auffindbarkeit bei „was sind die nächsten Schritte?"

## Nicht tun (→ `tasks/backlog.md`)

- **`standard.json`: keine neue Regel, kein Versionsbump.** Zwei Gründe: (1) Kursinhalt ist
  Strategie, nicht maschinell prüfbar; (2) unbelegt — der Vertrag hat genau *einen* Schreiber
  (News-Automation, mit Quellenpflicht). Beides würde den Vertrag beschädigen.
- **AI-Visibility-Automation (Kurs-Schritt 1+7).** Größte Chance, aber vorher zu klären:
  API vs. Produkt (OpenAI-API groundet ≠ chatgpt.com), Nicht-Determinismus, Kosten,
  **Secret-Management existiert noch nicht**. → eigenes Vorhaben.
- **Erwähnungen / Top-Listen (Kurs-Schritt 6)** — ruht, bis die 44-%-Behauptung belegt ist.
- ~~**Playbook-Dedup** (3 Kopien → 1 Quelle) — Refactor, nicht Teil dieses Schritts.~~
  **Korrektur (2026-07-17): hinfällig.** `shared/sync/` („Modell C") löst das längst — zentrale Quelle
  → gespiegelte Kopien, Manifest + `--check`. Die Kopien sind Absicht (Plugins sind eigenständig
  auslieferbar). Ich hatte das als Problem geführt, weil der Mechanismus in **keiner** .md
  dokumentiert war. Behoben statt refactored: `shared/sync/README.md` + Playbook-Header.
- **`evaluate.py` / `run.py` / Monitor: unangetastet.**

## Nachtrag: Aufräumen vor dem Commit (2026-07-17)

- [x] `shared/sync/README.md` — der Mechanismus ist jetzt auffindbar (war nur Kopfkommentar in `sync.mjs`)
- [x] Playbook-Header: „Diese Datei ist die Quelle — Plugin-Kopien nie direkt editieren"
- [x] Kopien per `node shared/sync/sync.mjs --sync` gezogen (nicht mehr per Hand-`cp`)
- [x] `tasks/backlog.md` B5 als Irrtum korrigiert statt still gelöscht — inkl. Grund, damit der
      nächste Agent nicht denselben Refactor erneut vorschlägt
- [x] Verifiziert: `sync.mjs --check` → 13 Entries, 26 Targets, 0 Errors, Exit 0

---

# S9 (2026-07-17): Kontaktformular anschließen — die Basics stehen lassen

**Auslöser:** Das Template-Formular ist ein `// kontakt form (demo submit)`. Es validiert,
zeigt „Vielen Dank! Ihre Anfrage ist eingegangen – wir melden uns in Kürze." — und **verwirft
die Anfrage**. Live auf `pv-fachbetrieb.vercel.app`. Zweites Auftreten derselben Fehlerklasse
wie die dokumentierte Resend-Falle (stiller Verlust von Anfragen).

**Vorlage:** n8n-Workflow `Gössel — 01 Lead-Empfang` (aktiv seit 2026-04-29). Wird
**übernommen, nicht neu erfunden** (REGEL 3). Er kann bereits: Form-Key, Honeypot, Time-Trap,
Pflichtfelder, Telefon→E.164, Lead-ID, **Speichern vor Benachrichtigen**, Error-Workflow.

**Ziel (bewusst klein):** Der Inhaber bekommt jeden Lead als formatierte HTML-Mail ins Postfach.
Mehr nicht. Alles Weitere → `tasks/backlog.md` §C.

## Schritt 0 — geklärt (2026-07-17)

**Frage war:** Aus welchem Baum werden Kundensites gebaut? Wenn das offen bleibt, teilt der
Formular-Fix das Schicksal des Consent-Layers: gebaut, nie ausgeliefert.

**Antwort aus der Historie:**
- `plugins/meisterwerk-miller/template/` ist die **Quelle**. Der Skill baut daraus
  (`handwerk-site-builder`: „Plugin-`template/` in den Projektordner (`site/`) kopieren").
- `build-runtime/` ist laut `989ddce` (12.07.) eine „**schlanke Laufzeit-Kopie fuer n8n raw-URL**"
  — für die automatisierte Prototyp-Pipeline, die das Template per Raw-URL von GitHub zieht.
- Der Consent-Layer wurde **einen Tag später** autoritativ (`4bd9148`, 13.07.) — **in `plugins/`**.
  Der Fork hat ihn nie bekommen. Datierter Abzweig, kein Rätsel.
- **Niemand im Repo verweist auf `build-runtime/`** (kein Sync-Eintrag, keine Doku), und der
  einzige bekannte Abnehmer `Prototyp-Build (Option A)` ist **archiviert + inaktiv**.

**Folge für S9:** Wir bauen in `plugins/meisterwerk-miller/template/` — das ist unstrittig die
Quelle. Der fehlende Banner auf der Live-Site erklärt sich damit als **alter Deploy** (vor dem
13.07.) und/oder als n8n-Pfad. Beides heilt derselbe Schritt: **neu bauen und neu deployen**,
was für S9 ohnehin nötig ist.

- [ ] **Entscheiden, was mit `build-runtime/` passiert** (blockiert S9 **nicht** mehr, aber es
      bleibt eine Landmine):
      **(a)** löschen und n8n auf `plugins/meisterwerk-miller/template/` zeigen lassen — Fork weg,
      Wurzel behoben; **(b)** behalten und in `sync-manifest.json` aufnehmen — Fork bleibt, kann
      aber nicht mehr driften; **(c)** so lassen — Drift geht weiter. **Empfehlung: (a)**, sofern
      die archivierte Pipeline nicht reaktiviert wird. Details: `tasks/backlog.md` §D1.

## Tun

- [ ] **n8n: Workflow „Meisterwerk — Lead-Empfang"** — Klon von Gössel 01, generalisiert:
      Felder ans Template (`ktVor`/`ktNach`/`ktMail`/`ktTel`/`ktThema`/`ktMsg`), `address`
      entfällt (nicht im Template), Gmail-Node auf **HTML** statt `emailType: "text"`,
      Empfänger aus dem Payload statt hartkodiert, `errorWorkflow` anhängen.
      Sheets-Node **bleibt** — Durchschlag, nicht CRM (Begründung: §C1).
- [ ] **`config/site.js`:** neuer Block `forms: { endpoint, formKey, notifyEmail }`.
      Config-getrieben wie alles andere.
- [ ] **`kontakt/index.html` + `index.html`:** Honeypot-Feld (`website`, versteckt) + `elapsedMs`.
      Fehlt heute beides — ein offener Webhook ohne Spam-Abwehr wird zugemüllt.
- [ ] **`main.js`:** `// kontakt form (demo submit)` ersetzen durch echten `fetch` auf
      `forms.endpoint`. Erfolgsmeldung erst **nach** HTTP 200. Fehlerfall sichtbar machen.
- [ ] **`build.mjs`: fail-closed Prüfung.** Endpoint gesetzt, kein Platzhalter, kein
      `demo submit`-Literal mehr im Bundle. **Das ist die Wurzel:** `build.mjs` prüft Consent
      streng — deshalb geht Consent nicht still kaputt. Das Formular hatte keine Prüfung —
      deshalb ging es still kaputt.
- [ ] **`allowedOrigins`** im Webhook auf die Kundendomain setzen (nicht `*`).

## Nicht tun (→ `tasks/backlog.md` §C)

- **Chatbot.** Braucht eine Baseline, die es ohne funktionierendes Formular nicht gibt.
- **Analytics / Dashboard / CMS / Terminbuchung / SMS / Foto-Upload / Kunden-CRM /
  Bestätigungsmail an den Anfragenden.** Alles Upsell. Vollständig in §C.
- **Monitor, `standard.json`, `evaluate.py`:** unangetastet.

## Sicherheit — gehört dir, nicht mir

- [ ] **Slack-Bot-Token rotieren.** Steht im Klartext im HTTP-Header von
      `KAIROS - Kontaktformular → Slack` (`LeYAP1lM3DbuOQjo`), damit in Historie, Exports,
      Backups. Danach als n8n-Credential hinterlegen, nativen Slack-Node nutzen.
- [ ] **Zombie deaktivieren:** derselbe Workflow ist aktiv, empfängt aber nichts —
      `kairos-digital.de` läuft über Resend. `allowedOrigins` listet nicht mal die
      Produktionsdomain. Abschalten, nicht reparieren.

## S9 — Stand 2026-07-17 (Hälfte 1 fertig, getestet)

**Template (fertig, verifiziert):**
- [x] `forms`-Block in `config/site.js` (endpoint, clientId, minRenderMs, texts)
- [x] `wps-form-config`-Block in `index.html` + `kontakt/index.html` (Muster: Consent-Block)
- [x] Honeypot (`ktHp`) + Time-Trap (`elapsedMs`) in beide Formulare
- [x] `main.js`: Attrappen-Handler raus, echter `fetch`. Erfolg erst nach HTTP 200,
      Fehler wird sichtbar gemeldet statt still verschluckt
- [x] `build.mjs`: fail-closed Formular-Validierung
- [x] **Getestet:** Demo-clientId → Exit 1 · echter Kunde → Exit 0 ·
      Attrappen-Handler zurückgeschmuggelt → von 4 Prüfungen erschlagen ·
      formKey zurückgeschmuggelt → Exit 1

**Korrektur gegenüber dem ursprünglichen Plan: `formKey` ist raus.**
Bei Gössel funktioniert er, weil dessen Next.js-Seite ihn *serverseitig* aus einer Vercel-ENV
schickt. Unser Template ist **statisch** — der Key stünde im ausgelieferten HTML direkt neben der
Webhook-URL. Reines Theater, und er kostete einen Einrichtungsschritt pro Kunde. Schutz leisten
Honeypot, Time-Trap und `allowedOrigins`. `build.mjs` bricht ab, falls er zurückkommt.

**n8n (angelegt, INAKTIV):** `Meisterwerk — Lead-Empfang` (`XSKhCP4o2kpPgbDH`), 10 Nodes.
Data Table `Meisterwerk Kunden` (`VaEpGM4MIKpQbqRa`): clientId · empfaenger · betrieb · aktiv.
Kunde anlegen = eine Zeile. Empfänger kommt **nie** aus dem Payload (sonst offenes Mail-Relay).

**Kein Google Sheet mehr** (Entscheidung des Nutzers, Aufwand beim Onboarding). Die Sicherheit
hängt nicht am Sheet, sondern daran, dass ein Fehler **laut** ist — dafür ist der Error-Workflow
zuständig. **Achtung: der ist noch nicht zugewiesen (siehe offen).**

## S9 — offen, braucht Hand in n8n (kann Claude nicht)

- [ ] **Gmail-Credential** an „Mail an Inhaber" hängen (`Kairos-n8n`) — wurde beim Anlegen
      *nicht* automatisch übernommen
- [ ] **`allowedOrigins`** im Webhook setzen (steht auf Platzhalter)
- [ ] **Error-Workflow zuweisen** (Settings) — ohne ihn ist der Fehler bei unbekanntem
      Empfänger nur in der Ausführungsliste sichtbar, nicht laut
- [ ] **Zeile in die Data Table** für den ersten echten Kunden
- [ ] `forms.clientId` in dessen `config/site.js` auf dieselbe ID
- [ ] Testanfrage, dann **aktivieren**
- [ ] Alten Zombie `KAIROS - Kontaktformular → Slack` (`LeYAP1lM3DbuOQjo`) löschen

**Notiz zu `hallo@kairos-digital.de` (2026-07-17):** Kein totes Postfach. KAIROS hat mehrere
Weiterleitungs-Domains, die alle im selben Postfach landen — `hallo@` ist eine davon. Das Learning
`2026-07-16_kairos-website-build-next16-vercel.md` beschreibt einen **behobenen** Zustand von damals,
keinen aktuellen Defekt. `Gössel — 03 Error Handler` schickt dorthin und funktioniert.
