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

## C. Upsell rund um das Kontaktformular (2026-07-17)

Auslöser: S9 in `tasks/todo.md`. Entscheidung dort war bewusst **klein**: der Inhaber bekommt
jeden Lead als HTML-Mail, mehr nicht. Alles hier drunter wurde besprochen und **absichtlich
zurückgestellt** — nicht vergessen, sondern vertagt.

Der n8n-Workflow `Gössel — 01 Lead-Empfang` (aktiv) ist die Vorlage. Vieles hier existiert dort
schon oder ist dort vorbereitet — das senkt den Aufwand erheblich.

### C1. Kunden-CRM statt Durchschlag
Das Google Sheet aus S9 ist bewusst **unsichtbar** (Beleg gegen Mailverlust). Der Upsell ist die
sichtbare Variante: der Betrieb pflegt selbst `Status`, `Notiz_intern`, `Termin_Datum`.
**Die Spalten existieren im Gössel-Sheet bereits** — es fehlt nur der Zugang für den Kunden.
*Vorsicht:* Damit verarbeitet KAIROS Kundendaten des Betriebs → **AVV pro Betrieb**.

### C2. Bestätigungsmail an den Anfragenden
Der Hausbesitzer bekommt „Ihre Anfrage ist angekommen". **`Gössel — 02 Bestätigung` macht das
bereits** (aktiv). Übernehmen statt bauen.

### C3. SMS-Benachrichtigung bei Notfällen
Gössels Sheet hat die Spalte `SMS_gesendet`, der Code kennt `isNotfall` und setzt
`🚨 NOTFALL` in den Betreff. Der Pfad ist angelegt, der Versand fehlt. Kosten pro SMS klären.

### C4. Terminbuchung
**Zwei Workflows existieren bereits, beide inaktiv:** `Gössel Elektrotechnik - Terminbuchungen v2
(Cal.com)` und `Termin-Reminder v2 (24h vorher)`. Das Gössel-Sheet hat `Termin_Datum`,
`Termin_Uhrzeit`, `Calendar_Event_ID`.
**Warnung:** Eigenes Produkt, kein Feature — Verfügbarkeit, Doppelbuchungen, Absagen, und ein
Handwerker auf dem Dach, der nicht sieht, dass ihm jemand 16 Uhr zugesagt hat.

### C5. Foto-Upload im Formular
„Foto vom Dach hochladen" ist bei einem Dachdecker naheliegend. **Einziger Punkt im ganzen
Backlog, der die Platte wirklich füllen kann:** Text kostet ~24 MB/Jahr bei 50 Kunden
(59 GB frei = ~2.400 Jahre). 12.000 Fotos à 4 MB = 50 GB = ein Jahr. Braucht dann Retention
und Object-Storage, nicht das Dateisystem.

### C6. Cookieloses Analytics (Plausible CE, self-hosted)
**Server ist geprüft und reicht: 7,6 Gi RAM (6,3 Gi frei), 4 Kerne, 59 GB frei — kein Upgrade
nötig, 0 € zusätzlich.** Braucht Reverse-Proxy + TLS + Subdomain auf dem Hetzner und ein
`max_memory_usage`-Limit für ClickHouse, damit es kein schlechter Nachbar für den Monitor wird.

**Warum cookielos, nicht GA4:** Ein Cookie-Banner kostet genau die Daten, die man will — wer
ablehnt, wird nicht gemessen. Cookielos misst praktisch jeden Besucher und braucht **für diesen
Zweck keinen Banner**. „Wir tracken Sie nicht" ist gegenüber einem Handwerksbetrieb außerdem ein
Verkaufsargument.

**Der unterschätzte Ertrag:** Referrer. Besucher von `chatgpt.com` / `perplexity.ai` tauchen
namentlich auf — **gemessene AI-Sichtbarkeit, deterministisch, ohne LLM im Cron, ohne API-Keys,
ohne das „API ≠ Produkt"-Problem aus §A1.** Beantwortet A1 nicht ganz (wer genannt wird, aber
nicht klickt, erzeugt keinen Referrer), ist aber echte Evidenz statt Laborwert.
**Vorbedingung für §B2** — das Dashboard soll laut Wunsch auch Traffic zeigen.

### C7. Chatbot
Zurückgestellt mit Begründung, nicht aus Zeitmangel:
- **Er bringt für GEO nichts.** Clientseitig, nicht indexiert, taucht in keiner AI-Antwort auf.
  Darf nicht als Sichtbarkeits-Feature verkauft werden — dieselbe Ehrlichkeitsgrenze wie bei §A1.
- **Ohne Baseline unverkäuflich.** „Der Bot bringt Anfragen" braucht eine Zahl, gegen die man
  vergleicht. Die entsteht erst aus S9 (Formular) + §C6 (Conversion messen). Vorher ist jede
  Bot-Begründung Bauchgefühl.
- Offen: Zweck (FAQ vs. Leads vs. Termine), Ort (Vercel-Function vs. Hetzner), Kostendeckel,
  **AVV + Drittlandtransfer für Chat-Inhalte**, Haftung bei falscher Preisauskunft,
  Fallback bei API-Ausfall. Der Content für einen FAQ-Bot liegt bereits strukturiert in
  `config/site.js` — **kein RAG nötig, der System-Prompt ist die Config.**
- Empfehlung, falls er kommt: **FAQ, nicht Leads, nicht Termine.** Der einzige Modus, in dem
  eine Halluzination peinlich statt teuer ist.

### C8. CMS
Vom Nutzer selbst zurückgestellt („die Handwerker machen damit mehr kaputt"). Falls es je kommt:
**kein klassisches CMS.** Beide Templates sind config-getriebene SSGs — `config/site.js` bzw.
`src/config/site.ts` **ist** bereits das Content-Modell. Nötig wären nur ein Editor für dieses
Objekt und ein Rebuild-Trigger. Deutlich weniger, als „CMS" normalerweise bedeutet.

---

## D. Technische Schulden (gefunden 2026-07-17) — kein Upsell, sondern Hygiene

### D1. `build-runtime/` driftet unkontrolliert — blockiert S9
`build-runtime/template/` ist eine zweite Kopie des Miller-Templates **ohne Consent-Layer**
(0 Treffer für „consent", kein `consent/`-Verzeichnis, `index.html` weicht ab).
**`sync.mjs` deckt sie nicht ab** (0 Treffer im Manifest). Die Live-Site hat keinen Banner.
**Solange ungeklärt ist, aus welchem Baum Kundensites gebaut werden, teilt jeder Fix das
Schicksal des Consent-Layers: gebaut, nie ausgeliefert.** Siehe S9 Schritt 0.

### D2. `docs/architecture/consent.md` ist gedriftet
Sagt „Implementierung: **planned**", obwohl `consent.js` (583 Z.) seit `4bd9148` ausgeliefert wird.

### D3. Level 1 (React-Template) hat keinen Consent
`grep` über `plugins/meisterwerk/template/src/` findet null Treffer für „consent"/„cookie".
Der Vertrag in `docs/architecture/consent.md` ist ausdrücklich stack-neutral für Level 1–3
gedacht. Sobald eine Level-1-Site Maps oder Analytics einbindet, ist das ein Rechtsproblem.

### D4. Consent-Texte sind Demo-Texte
`config/site.js` markiert sie selbst als „neutrale DEMO-Texte — **KEINE Rechtstexte**".
Für echte Kundensites geprüfte Texte nötig. **Das ist Rechtsberatung — nicht durch Claude
lösbar**, nur die Struktur.

### D5. Namen driften systematisch von der Wirklichkeit weg
Belege aus einer einzigen Sitzung:
- `KAIROS - Kontaktformular → Slack` — **aktiv, empfängt nichts**; die Site läuft über Resend.
- `Gmail: Notification an Gössel` — **schickt an eine private Adresse** (laut Nutzer Absicht,
  Testgrund; bleibt vorerst).
- `consent.md` sagt „planned", ist ausgeliefert.

**Wirkung:** In dieser Sitzung habe ich dreimal behauptet, etwas existiere nicht, das längst
läuft (`shared/sync/`, der Consent-Layer, die Lead-Pipeline). Zweimal hat der Nutzer es gefunden,
nicht ich. **Regel für den nächsten Agent: Namen und Doku sind Hinweise, keine Belege. Prüfe das
Artefakt — das gebaute HTML, die Live-URL, den aktiven Workflow.**

### D6. Slack-Bot-Token im Klartext
Im HTTP-Header von `LeYAP1lM3DbuOQjo`, damit in Historie/Exports/Backups.
→ rotieren, als n8n-Credential hinterlegen, Zombie abschalten. Siehe S9.

---

## Reihenfolge-Empfehlung

**Zuerst die Basics — sie stehen noch nicht:**

1. **S9 — Kontaktformular** (`tasks/todo.md`). Live wird heute jede Anfrage verworfen, während
   der Besucher „Ihre Anfrage ist eingegangen" liest. Blockiert durch **D1**.
2. **D1** (`build-runtime`-Drift) — sonst wird S9 gebaut und nie ausgeliefert.
3. **B1** (`notEvaluated`-Regeln) — kleinster Aufwand, macht Reports ehrlich vollständig.

**Dann das, was die Arbeit sichtbar und messbar macht:**

4. **C6** (Analytics) — liefert die Baseline für alles Weitere **und** ein Stück §A1 gratis.
5. **B2** (Dashboard) — braucht C6 für Traffic-Daten.

**Danach erst Produkt-Erweiterung:**

6. **A1** (AI-Visibility) — erst nach der API-vs-Produkt-Entscheidung, und C6 nimmt ihr Arbeit ab.
7. **C7** (Chatbot) — erst wenn S9 + C6 eine Baseline liefern.
8. **A2** (Erwähnungen) — erst nach Beleg der 44-%-Behauptung.
