#!/usr/bin/env node
/**
 * build.mjs — Alias auf render-all.mjs.
 * Der Renderer faltet die früheren build.mjs-Aufgaben ein
 * (Theme-/Domain-Injektion, robots, sitemap) und rendert zusätzlich die
 * 5 tokenisierten Seiten aus config/site.js. Aufruf identisch: `node build.mjs`.
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

// 1) Vollstaendiger Render + Asset-Copy (inkl. consent/) laeuft via Side-Effect-Import.
import "./render-all.mjs";

/* ==========================================================================
 *  Consent-Build-Integration (Level 2)
 *  --------------------------------------------------------------------------
 *  ENTSCHEIDUNG: build.mjs INJIZIERT nichts, sondern VALIDIERT nur.
 *  Begruendung: Die Consent-Integrationspunkte (Head-Block + Footer-Trigger)
 *  liegen bereits in den tokenisierten SOURCE-Templates (template/*.html) und
 *  werden von render.mjs 1:1 in den Output uebernommen; die Config wird ueber
 *  Skalar-Tokens gefuellt, consent.js/consent.css kopiert render-all.mjs. Eine
 *  zweite Injektions-Engine hier waere Duplikat und Bruch-Risiko. Der Build
 *  prueft daher nur Vollstaendigkeit + Idempotenz (read-only → idempotent).
 * ========================================================================== */
const HERE = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const SITE = require(resolve(HERE, "config", "site.js"));
const OUT = resolve(process.cwd(), process.argv[2] || "site");

const PAGES = ["index.html", "leistungen/index.html", "ueber-uns/index.html", "karriere/index.html", "kontakt/index.html"];
const count = (s, sub) => s.split(sub).length - 1;
const problems = [];

// 1) Consent-Config vorhanden?
const consent = SITE.consent;
if (!consent || typeof consent !== "object") {
  console.error("\n  ✗ Consent: config/site.js enthaelt keinen consent-Block.");
  process.exit(1);
}

if (consent.enabled === false) {
  console.log("\n  • Consent ist deaktiviert (consent.enabled=false) — Seiten-Checks uebersprungen.");
} else {
  // 2) Jede SOURCE-Seite: genau ein Head-Block, eine Config, ein JS, ein Trigger.
  for (const rel of PAGES) {
    const html = readFileSync(join(HERE, rel), "utf8");
    const checks = {
      "WPS_CONSENT_HEAD": count(html, "<!-- WPS_CONSENT_HEAD -->"),
      'id="wps-consent-config"': count(html, 'id="wps-consent-config"'),
      "/consent/consent.css": count(html, '/consent/consent.css'),
      "/consent/consent.js": count(html, '/consent/consent.js'),
    };
    for (const [k, n] of Object.entries(checks)) {
      if (n !== 1) problems.push(`${rel}: '${k}' erwartet 1×, gefunden ${n}×`);
    }
    // Footer-Trigger + optionale Medien-Platzhalter-Buttons nutzen data-consent-settings → mind. 1×
    if (count(html, "data-consent-settings") < 1) problems.push(`${rel}: 'data-consent-settings' fehlt (>=1 erwartet)`);
  }
  // 3) Output-Artefakte vorhanden (render-all hat consent/ kopiert)?
  for (const f of ["consent/consent.js", "consent/consent.css"]) {
    if (!existsSync(join(OUT, f))) problems.push(`Output fehlt: ${f} (render-all copy?)`);
  }

  if (problems.length) {
    console.error("\n  ✗ Consent-Integration unvollstaendig:");
    for (const p of problems) console.error("     - " + p);
    process.exit(1);
  }
  console.log(`\n  ✓ Consent-Integration vollstaendig (5 Seiten, Head+Trigger+Output, enabled=${consent.enabled}).`);
}

/* ==========================================================================
 *  Self-Host-Validierung (Level 2): Fonts + GSAP lokal, keine externen Hosts.
 * ========================================================================== */
const FORBIDDEN_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com", "cdnjs.cloudflare.com"];
const LOCAL_ASSETS = [
  "assets/fonts/albert-sans-variable.woff2",
  "assets/vendor/gsap/gsap.min.js",
  "assets/vendor/gsap/ScrollTrigger.min.js",
];
const sh = [];

// 1) Lokale Quell- + Output-Assets vorhanden
for (const a of LOCAL_ASSETS) {
  if (!existsSync(join(HERE, a))) sh.push(`Quelle fehlt: ${a}`);
  if (!existsSync(join(OUT, a))) sh.push(`Output fehlt: ${a} (render-all assets-copy?)`);
}

// 2) styles.css (Output): lokales @font-face + font-display:swap + lokaler Pfad, kein externer Host
const outCss = existsSync(join(OUT, "styles.css")) ? readFileSync(join(OUT, "styles.css"), "utf8") : "";
if (!/@font-face/.test(outCss)) sh.push("styles.css: kein @font-face");
if (!/font-display:\s*swap/.test(outCss)) sh.push("styles.css: kein font-display:swap");
if (!outCss.includes("/assets/fonts/albert-sans-variable.woff2")) sh.push("styles.css: lokaler Font-Pfad fehlt");
for (const host of FORBIDDEN_HOSTS) if (outCss.includes(host)) sh.push(`styles.css: externer Host ${host}`);

// 3) Jede gerenderte Seite: keine verbotenen Hosts, lokale GSAP-Pfade, ScrollTrigger NACH gsap, lokaler Font
for (const rel of PAGES) {
  const html = readFileSync(join(OUT, rel), "utf8");
  for (const host of FORBIDDEN_HOSTS) if (html.includes(host)) sh.push(`${rel}: externer Host ${host}`);
  const gi = html.indexOf("/assets/vendor/gsap/gsap.min.js");
  const si = html.indexOf("/assets/vendor/gsap/ScrollTrigger.min.js");
  if (gi < 0) sh.push(`${rel}: gsap.min.js (lokal) fehlt`);
  if (si < 0) sh.push(`${rel}: ScrollTrigger.min.js (lokal) fehlt`);
  if (gi >= 0 && si >= 0 && si < gi) sh.push(`${rel}: ScrollTrigger vor gsap geladen`);
  if (!html.includes("/assets/fonts/albert-sans-variable.woff2")) sh.push(`${rel}: lokaler Font-Preload fehlt`);
}

if (sh.length) {
  console.error("\n  ✗ Self-Host-Validierung fehlgeschlagen:");
  for (const p of sh) console.error("     - " + p);
  process.exit(1);
}
console.log("  ✓ Self-Host vollstaendig (Fonts + GSAP lokal, keine externen Hosts, 5 Seiten + styles.css).");

/* ==========================================================================
 *  Maps-Consent-Gating-Validierung (Level 2): kein Auto-iframe, Platzhalter,
 *  Service in Registry (externalMedia), erlaubte Embed-Hosts.
 * ========================================================================== */
const MAPS_PAGES = ["index.html", "kontakt/index.html"];
const ALLOWED_MAP_HOSTS = ["www.google.com", "maps.google.com"];
const LIVE_MAPS_SRC = /(?<!data-consent-)src="https:\/\/(?:www|maps)\.google\.com\/[^"]*maps/i;
const mv = [];

// 1) Service-Registry-Eintrag google-maps (externalMedia)
const svc = (consent && Array.isArray(consent.services) ? consent.services : []).find((s) => s && s.id === "google-maps");
if (!svc) mv.push("config: Service 'google-maps' fehlt in consent.services");
else if (svc.category !== "externalMedia") mv.push(`config: google-maps category='${svc.category}' (erwartet externalMedia)`);

// 2) maps.embedUrl vorhanden + nur erlaubte Hosts + https
const maps = SITE.maps;
if (!maps || !maps.embedUrl) mv.push("config: SITE.maps.embedUrl fehlt");
else {
  try {
    const u = new URL(maps.embedUrl);
    if (u.protocol !== "https:" || !ALLOWED_MAP_HOSTS.includes(u.host)) mv.push(`config: maps.embedUrl Host/Protokoll unzulaessig (${u.protocol}//${u.host})`);
  } catch (e) { mv.push("config: maps.embedUrl ist keine gueltige URL"); }
}

// 3) Maps-Seiten (Source + Output): kein <iframe, kein Live-Google-src, genau 1 Platzhalter
for (const rel of MAPS_PAGES) {
  for (const [label, base] of [["src", HERE], ["out", OUT]]) {
    const p = join(base, rel);
    if (!existsSync(p)) { mv.push(`fehlt: ${rel} (${label})`); continue; }
    const html = readFileSync(p, "utf8");
    if (html.includes("<iframe")) mv.push(`${rel} (${label}): initialer <iframe vorhanden`);
    if (LIVE_MAPS_SRC.test(html)) mv.push(`${rel} (${label}): live Google-Maps-src (nicht data-consent-src)`);
    if (count(html, "data-consent-service=") !== 1) mv.push(`${rel} (${label}): Platzhalter data-consent-service != 1`);
  }
}

// 4) Nicht-Maps-Seiten (Output): kein Platzhalter, kein iframe
for (const rel of PAGES.filter((p) => !MAPS_PAGES.includes(p))) {
  const html = readFileSync(join(OUT, rel), "utf8");
  if (html.includes("data-consent-service")) mv.push(`${rel}: unerwarteter Maps-Platzhalter`);
  if (html.includes("<iframe")) mv.push(`${rel}: unerwarteter <iframe`);
}

if (mv.length) {
  console.error("\n  ✗ Maps-Consent-Gating fehlgeschlagen:");
  for (const m of mv) console.error("     - " + m);
  process.exit(1);
}
console.log("  ✓ Maps-Consent-Gating (kein Auto-iframe, Platzhalter auf 2 Seiten, google-maps/externalMedia, erlaubte Hosts).");

/* ==========================================================================
 *  Registry-Autoritaet (Level 2): config.consent.services ist die EINZIGE
 *  Wahrheit; der Browser (#wps-consent-config) muss exakt dieselbe Registry
 *  erhalten. Struktur-Fail-closed-Check ohne neue Schema-Dependency.
 * ========================================================================== */
const rg = [];
const KNOWN_CATS = ["necessary", "analytics", "marketing", "externalMedia"];
const registrySrc = Array.isArray(consent.services) ? consent.services : [];
const canonicalRegistry = JSON.stringify(registrySrc);

// A) Fail-closed Strukturpruefung der Config-Registry
function hasFunctionDeep(v) {
  if (typeof v === "function") return true;
  if (Array.isArray(v)) return v.some(hasFunctionDeep);
  if (v && typeof v === "object") return Object.values(v).some(hasFunctionDeep);
  return false;
}
const seenIds = new Set();
for (const s of registrySrc) {
  if (!s || typeof s !== "object") { rg.push("registry: Eintrag ist kein Objekt"); continue; }
  if (typeof s.id !== "string" || !s.id) rg.push(`registry: ungueltige/leere id (${JSON.stringify(s.id)})`);
  else { if (seenIds.has(s.id)) rg.push(`registry: doppelte id '${s.id}'`); seenIds.add(s.id); }
  if (!KNOWN_CATS.includes(s.category)) rg.push(`registry: '${s.id}': unbekannte category '${s.category}'`);
  if (typeof s.enabled !== "boolean") rg.push(`registry: '${s.id}': enabled nicht boolean`);
  for (const f of ["storageWritten", "origins", "notes"]) if (!Array.isArray(s[f])) rg.push(`registry: '${s.id}': ${f} ist kein Array`);
  if (hasFunctionDeep(s)) rg.push(`registry: '${s.id}': enthaelt eine Funktion`);
}

// B) google-maps genau 1×, externalMedia, enabled
const gm = registrySrc.filter((s) => s && s.id === "google-maps");
if (gm.length !== 1) rg.push(`registry: google-maps ${gm.length}× (erwartet 1)`);
else {
  if (gm[0].category !== "externalMedia") rg.push(`registry: google-maps category='${gm[0].category}'`);
  if (gm[0].enabled !== true) rg.push(`registry: google-maps enabled=${gm[0].enabled}`);
}

// C) Jede gerenderte Seite: genau 1 Config-Block, gueltiges JSON, services == Registry, keine offenen Tokens
const CFG_RE = /<script type="application\/json" id="wps-consent-config">\s*([\s\S]*?)\s*<\/script>/g;
for (const rel of PAGES) {
  const html = readFileSync(join(OUT, rel), "utf8");
  const blocks = [...html.matchAll(CFG_RE)];
  if (blocks.length !== 1) { rg.push(`${rel}: #wps-consent-config ${blocks.length}× (erwartet 1)`); continue; }
  let parsed;
  try { parsed = JSON.parse(blocks[0][1]); } catch (e) { rg.push(`${rel}: Config-JSON ungueltig (${e.message})`); continue; }
  if (!Array.isArray(parsed.services)) rg.push(`${rel}: services ist kein Array`);
  else if (JSON.stringify(parsed.services) !== canonicalRegistry) rg.push(`${rel}: Browser-Registry != SITE.consent.services`);
  if (registrySrc.length > 0 && /"services"\s*:\s*\[\]/.test(html)) rg.push(`${rel}: Literal "services":[] trotz nicht-leerer Registry`);
  if (/\{\{/.test(html)) rg.push(`${rel}: offene Template-Tokens ({{…}}) im Output`);
}

if (rg.length) {
  console.error("\n  ✗ Registry-Autoritaet fehlgeschlagen:");
  for (const m of rg) console.error("     - " + m);
  process.exit(1);
}
console.log("  ✓ Registry autoritativ (config.consent.services == Browser-JSON auf 5 Seiten, google-maps/externalMedia/enabled, keine offenen Tokens).");

/* ==========================================================================
 *  Formular-Validierung (S9)
 *  --------------------------------------------------------------------------
 *  WARUM ES DIESEN BLOCK GIBT: Das Formular war ein "demo submit" — es zeigte
 *  "Ihre Anfrage ist eingegangen" und verwarf die Anfrage. Es ging live, weil
 *  es NICHTS geprueft hat. Consent geht nicht still kaputt, weil es geprueft
 *  wird. Hier dieselbe Medizin: fail-closed, sonst wiederholt es sich.
 *
 *  Geprueft wird der SOURCE (Integrationspunkte) und der OUTPUT (Ergebnis).
 *  Injiziert wird nichts — gleiche Entscheidung wie beim Consent-Block oben.
 * ========================================================================== */
const FORM_PAGES = ["index.html", "kontakt/index.html"];
// Die Karriere-Seite traegt seit 2026-08-13 ein eigenes Bewerbungsformular
// (gleiche wps-form-config, eigener Handler submitBewerbung) — sie gehoert
// deshalb zu den Config-Seiten, hat aber kein ktForm.
const BW_PAGE = "karriere/index.html";
const CFG_FORM_PAGES = [...FORM_PAGES, BW_PAGE];
const DEMO_CLIENT_IDS = ["demo-musterwerk", "CHANGEME", "TODO", ""];
const fv = [];

const forms = SITE.forms;
if (!forms || typeof forms !== "object") {
  console.error("\n  ✗ Formular: config/site.js enthaelt keinen forms-Block.");
  process.exit(1);
}

if (forms.enabled === false) {
  console.log("  • Formular ist deaktiviert (forms.enabled=false) — Checks uebersprungen.");
} else {
  // A) Config: Endpoint muss echt sein. Kein Platzhalter, kein http, keine Luecke.
  if (typeof forms.endpoint !== "string" || !forms.endpoint) fv.push("config: forms.endpoint fehlt");
  else {
    try {
      const u = new URL(forms.endpoint);
      if (u.protocol !== "https:") fv.push(`config: forms.endpoint ist nicht https (${u.protocol})`);
    } catch { fv.push("config: forms.endpoint ist keine gueltige URL"); }
  }
  // clientId adressiert den Empfaenger: n8n schlaegt die Mail-Adresse darueber in
  // der Data Table "Meisterwerk Kunden" nach, damit der Webhook kein offenes
  // Mail-Relay wird. Der Demo-Wert muss pro Kunde ersetzt werden — sonst gingen
  // die Anfragen an den falschen Betrieb oder nirgendwohin.
  if (typeof forms.clientId !== "string" || !forms.clientId.trim()) {
    fv.push("config: forms.clientId fehlt — ohne sie kann n8n den Empfaenger nicht aufloesen");
  } else if (DEMO_CLIENT_IDS.includes(forms.clientId.trim())) {
    fv.push(`config: forms.clientId ist noch der Demo-Wert ('${forms.clientId}') — pro Kunde ersetzen und dieselbe ID als Zeile in der n8n-Data-Table "Meisterwerk Kunden" anlegen`);
  }
  // Kein Token/formKey: auf einer statischen Seite stuende er im HTML neben der
  // Webhook-URL. Taucht er wieder auf, ist jemand dieser Illusion aufgesessen.
  if (forms.formKey !== undefined) {
    fv.push("config: forms.formKey ist zurueck — auf einer statischen Seite ist das kein Secret, sondern steht im ausgelieferten HTML. Entfernen; Schutz leisten Honeypot, Time-Trap und allowedOrigins.");
  }
  if (!Number.isFinite(forms.minRenderMs) || forms.minRenderMs < 1000) {
    fv.push(`config: forms.minRenderMs=${forms.minRenderMs} (>=1000 erwartet, Time-Trap)`);
  }
  for (const t of ["validation", "sending", "success", "sent", "error"]) {
    if (!forms.texts || typeof forms.texts[t] !== "string" || !forms.texts[t]) fv.push(`config: forms.texts.${t} fehlt`);
  }

  // B) Formular-Seiten (Source): Head-Block, Config, Honeypot — je genau 1×
  for (const rel of FORM_PAGES) {
    const html = readFileSync(join(HERE, rel), "utf8");
    const checks = {
      "WPS_FORM_HEAD": count(html, "<!-- WPS_FORM_HEAD -->"),
      'id="wps-form-config"': count(html, 'id="wps-form-config"'),
      'id="ktHp"': count(html, 'id="ktHp"'),      // Honeypot
      'id="ktForm"': count(html, 'id="ktForm"'),
    };
    for (const [k, n] of Object.entries(checks)) {
      if (n !== 1) fv.push(`${rel}: '${k}' erwartet 1×, gefunden ${n}×`);
    }
  }

  // C) Formular-Seiten (Output): genau 1 Config-Block, gueltiges JSON, Werte == SITE.forms
  const FORM_CFG_RE = /<script type="application\/json" id="wps-form-config">\s*([\s\S]*?)\s*<\/script>/g;
  for (const rel of CFG_FORM_PAGES) {
    const html = readFileSync(join(OUT, rel), "utf8");
    const blocks = [...html.matchAll(FORM_CFG_RE)];
    if (blocks.length !== 1) { fv.push(`${rel}: #wps-form-config ${blocks.length}× (erwartet 1)`); continue; }
    let parsed;
    try { parsed = JSON.parse(blocks[0][1]); } catch (e) { fv.push(`${rel}: Form-Config-JSON ungueltig (${e.message})`); continue; }
    if (parsed.endpoint !== forms.endpoint) fv.push(`${rel}: Browser-endpoint != SITE.forms.endpoint`);
    if (parsed.clientId !== forms.clientId) fv.push(`${rel}: Browser-clientId != SITE.forms.clientId`);
  }

  // D) Nicht-Formular-Seiten (Output): kein verwaister Config-Block
  for (const rel of PAGES.filter((p) => !CFG_FORM_PAGES.includes(p))) {
    const html = readFileSync(join(OUT, rel), "utf8");
    if (html.includes('id="wps-form-config"')) fv.push(`${rel}: unerwarteter #wps-form-config (keine Form auf der Seite)`);
  }

  // E) Output-main.js: der Demo-Handler darf NICHT zurueckkommen, der fetch muss da sein.
  const outMain = existsSync(join(OUT, "main.js")) ? readFileSync(join(OUT, "main.js"), "utf8") : "";
  if (!outMain) fv.push("Output fehlt: main.js (render-all copy?)");
  else {
    if (/demo submit/i.test(outMain)) fv.push("main.js: 'demo submit' ist zurueck — das Formular verwirft Anfragen");
    if (!outMain.includes("wps-form-config")) fv.push("main.js: liest #wps-form-config nicht");
    if (!/fetch\(\s*CFG\.endpoint/.test(outMain)) fv.push("main.js: kein fetch auf CFG.endpoint");
    if (!/r\.ok/.test(outMain)) fv.push("main.js: Antwort wird nicht geprueft (Erfolg koennte vor HTTP 200 gemeldet werden)");
  }

  if (fv.length) {
    console.error("\n  ✗ Formular-Validierung fehlgeschlagen:");
    for (const m of fv) console.error("     - " + m);
    process.exit(1);
  }
  console.log(`  ✓ Formular verdrahtet (Endpoint https, Honeypot + Time-Trap auf 2 Seiten, Erfolg erst nach HTTP 200).`);
}

/* ==========================================================================
 *  Chat-Validierung (S10)
 *  --------------------------------------------------------------------------
 *  WARUM ES DIESEN BLOCK GIBT: Ein Chatbot kann auf drei Arten still kaputt
 *  gehen, und alle drei sieht man der Seite nicht an.
 *
 *  1. Falsche clientId → n8n findet keinen Kontext, jeder Besucher bekommt nur
 *     "bitte Kontaktformular". Der Bot ist da, aber er weiss nichts.
 *  2. clientId != forms.clientId → Chat und Formular zeigen auf zwei
 *     verschiedene Zeilen. Eine davon existiert nicht.
 *  3. innerHTML statt textContent → der Bot gibt Text aus, den ein Sprachmodell
 *     nach dem Lesen von Besuchereingaben erzeugt hat. Als HTML eingesetzt ist
 *     das eine Ausfuehrungsluecke auf der Seite des Kunden.
 *
 *  Wie beim Formular: fail-closed, Source UND Output, nichts injizieren.
 * ========================================================================== */
const cv = [];
const chat = SITE.chat;

if (!chat || typeof chat !== "object") {
  console.log("  • Kein chat-Block in config/site.js — Chat-Checks uebersprungen.");
} else if (chat.enabled === false) {
  console.log("  • Chat ist deaktiviert (chat.enabled=false) — Checks uebersprungen.");
} else {
  // A) Config
  if (typeof chat.endpoint !== "string" || !chat.endpoint) cv.push("config: chat.endpoint fehlt");
  else {
    try {
      const u = new URL(chat.endpoint);
      if (u.protocol !== "https:") cv.push(`config: chat.endpoint ist nicht https (${u.protocol})`);
    } catch { cv.push("config: chat.endpoint ist keine gueltige URL"); }
  }
  if (typeof chat.clientId !== "string" || !chat.clientId.trim()) {
    cv.push("config: chat.clientId fehlt — ohne sie findet n8n den Website-Kontext nicht");
  } else if (DEMO_CLIENT_IDS.includes(chat.clientId.trim())) {
    cv.push(`config: chat.clientId ist noch der Demo-Wert ('${chat.clientId}') — pro Kunde ersetzen`);
  }
  // Chat und Formular muessen dieselbe Zeile der Data Table treffen.
  if (SITE.forms && chat.clientId !== SITE.forms.clientId) {
    cv.push(`config: chat.clientId ('${chat.clientId}') != forms.clientId ('${SITE.forms.clientId}') — beide schlagen dieselbe Zeile in "Meisterwerk Kunden" nach, eine davon geht ins Leere`);
  }
  // Der Kontext gehoert NICHT in die Config: er wuerde im ausgelieferten HTML
  // stehen und liesse sich im Payload durch beliebige "Fakten" ersetzen.
  if (chat.kontext !== undefined || chat.context !== undefined) {
    cv.push("config: chat.kontext gehoert nicht hierher — er stuende im ausgelieferten HTML und waere im Payload manipulierbar. Er gehoert in die Spalte kontext der n8n-Data-Table (node chat-context.mjs).");
  }
  // Chatverlaeufe sind personenbezogene Daten. Ohne Hinweis darf niemand tippen.
  if (typeof chat.privacyHref !== "string" || !chat.privacyHref.trim()) {
    cv.push("config: chat.privacyHref fehlt — Chatverlaeufe sind personenbezogene Daten, der Hinweis ist Pflicht");
  }
  if (!chat.texts || typeof chat.texts.privacy !== "string" || !chat.texts.privacy.trim()) {
    cv.push("config: chat.texts.privacy fehlt — siehe chat.privacyHref");
  }
  for (const t of ["launcher", "title", "intro", "placeholder", "send", "sending", "error", "close"]) {
    if (!chat.texts || typeof chat.texts[t] !== "string" || !chat.texts[t]) cv.push(`config: chat.texts.${t} fehlt`);
  }

  // B) Source: Head-Block auf allen 5 Seiten, je genau 1×
  for (const rel of PAGES) {
    const html = readFileSync(join(HERE, rel), "utf8");
    for (const k of ["<!-- WPS_CHAT_HEAD -->", 'id="wps-chat-config"']) {
      const n = count(html, k);
      if (n !== 1) cv.push(`${rel}: '${k}' erwartet 1×, gefunden ${n}×`);
    }
  }

  // C) Output: gueltiges JSON, Werte == SITE.chat
  const CHAT_CFG_RE = /<script type="application\/json" id="wps-chat-config">\s*([\s\S]*?)\s*<\/script>/g;
  for (const rel of PAGES) {
    const html = readFileSync(join(OUT, rel), "utf8");
    const blocks = [...html.matchAll(CHAT_CFG_RE)];
    if (blocks.length !== 1) { cv.push(`${rel}: #wps-chat-config ${blocks.length}× (erwartet 1)`); continue; }
    let parsed;
    try { parsed = JSON.parse(blocks[0][1]); } catch (e) { cv.push(`${rel}: Chat-Config-JSON ungueltig (${e.message})`); continue; }
    if (parsed.endpoint !== chat.endpoint) cv.push(`${rel}: Browser-endpoint != SITE.chat.endpoint`);
    if (parsed.clientId !== chat.clientId) cv.push(`${rel}: Browser-clientId != SITE.chat.clientId`);
    if (!parsed.privacyHref) cv.push(`${rel}: Chat-Config ohne privacyHref`);
  }

  // D) Output-main.js: Bot-Antworten nur als Text, Fehler ehrlich melden.
  const outMain2 = existsSync(join(OUT, "main.js")) ? readFileSync(join(OUT, "main.js"), "utf8") : "";
  if (!outMain2) cv.push("Output fehlt: main.js (render-all copy?)");
  else {
    const chatTeil = outMain2.slice(outMain2.indexOf("wps-chat-config"));
    if (!outMain2.includes("wps-chat-config")) cv.push("main.js: liest #wps-chat-config nicht");
    if (!/fetch\(\s*CFG\.endpoint/.test(chatTeil)) cv.push("main.js: kein fetch auf CFG.endpoint im Chat-Teil");
    if (/\.innerHTML\s*=/.test(chatTeil)) {
      cv.push("main.js: innerHTML im Chat-Teil — Bot-Text ist modellgenerierter Inhalt und darf nie als HTML eingesetzt werden. textContent verwenden.");
    }
    if (!/\.ok\b/.test(chatTeil)) cv.push("main.js: HTTP-Status wird im Chat-Teil nicht geprueft");
  }

  if (cv.length) {
    console.error("\n  ✗ Chat-Validierung fehlgeschlagen:");
    for (const m of cv) console.error("     - " + m);
    process.exit(1);
  }
  console.log(`  ✓ Chat verdrahtet (Endpoint https, clientId == forms.clientId, Antworten als Text, Datenschutzhinweis vorhanden).`);
}

/* ==========================================================================
 *  Quiz-Funnel (2026-07-28, Rueckport aus bedachungen-schwiertz 2026-08-13)
 *  --------------------------------------------------------------------------
 *  Das Quiz auf der Startseite war eine Attrappe: es zeigte "Vielen Dank, wir
 *  melden uns innerhalb von 24 Stunden" und verwarf die Anfrage — kein fetch,
 *  kein action. Exakt derselbe stille Fehler wie beim Kontaktformular
 *  (learnings/templates/2026-07-19_miller-kontaktformular-n8n-lead.md, Error 1),
 *  nur nie fuers Quiz behoben. Der Handler allein verhindert die Wiederholung
 *  nicht — erst diese Pruefung tut das. Jedes Feature braucht seinen eigenen
 *  fail-closed Check.
 * ========================================================================== */
{
  const qv = [];
  const home = readFileSync(join(OUT, "index.html"), "utf8");
  const outMainQ = existsSync(join(OUT, "main.js")) ? readFileSync(join(OUT, "main.js"), "utf8") : "";

  if (!home.includes('id="quizCard"')) {
    qv.push("index.html: #quizCard fehlt — Lead-Funnel weg?");
  } else {
    // Markup: auslesbare Felder, Honeypot, Consent, Statuszeile.
    for (const id of ["qVor", "qNach", "qTel", "qMail", "qOrt", "qZeit", "qMsg", "qHp", "qConsent", "qNote"]) {
      if (!home.includes(`id="${id}"`)) qv.push(`index.html: Quiz-Feld #${id} fehlt — ohne id landet die Angabe in keinem Payload`);
    }
    if (!home.includes('id="wps-form-config"')) qv.push("index.html: #wps-form-config fehlt — Quiz kennt den Endpoint nicht");
  }

  if (!outMainQ) qv.push("Output fehlt: main.js");
  else {
    const start = outMainQ.indexOf("function submitQuiz");
    if (start === -1) {
      qv.push("main.js: submitQuiz() fehlt — das Quiz meldet Erfolg, ohne etwas zu senden (Attrappe)");
    } else {
      const teil = outMainQ.slice(start, start + 3000);
      if (!/fetch\(\s*QCFG\.endpoint/.test(teil)) qv.push("main.js: submitQuiz sendet kein fetch auf QCFG.endpoint");
      if (!/\.ok\b/.test(teil))                   qv.push("main.js: submitQuiz prueft den HTTP-Status nicht");
      if (!/website:\s*qval\('qHp'\)/.test(teil)) qv.push("main.js: submitQuiz sendet kein Honeypot-Feld");
      if (!/elapsedMs/.test(teil))                qv.push("main.js: submitQuiz sendet keine Time-Trap");
      // Kernregel: der Erfolgsschritt darf NUR im .then nach dem ok-Check auftauchen.
      const vorFetch = teil.slice(0, teil.indexOf("fetch("));
      if (/done\.classList\.add\('show'\)/.test(vorFetch)) {
        qv.push("main.js: Erfolgsschritt wird vor der Server-Antwort gezeigt — Erfolg nie vor HTTP 200 melden");
      }
    }
    // Der alte Attrappen-Pfad darf nicht daneben ueberleben.
    const nextHandler = outMainQ.slice(outMainQ.indexOf("next.addEventListener"));
    if (/else\s*\{\s*steps\.forEach[\s\S]{0,200}done\.classList\.add\('show'\)/.test(nextHandler)) {
      qv.push("main.js: der alte Attrappen-Zweig im next-Handler lebt noch");
    }
  }

  if (qv.length) {
    console.error("\n  ✗ Quiz-Validierung fehlgeschlagen:");
    for (const m of qv) console.error("     - " + m);
    process.exit(1);
  }
  console.log("  ✓ Quiz verdrahtet (Endpoint, Honeypot + Time-Trap, Erfolgsschritt erst nach HTTP 200).");
}

/* ==========================================================================
 *  Bewerbungsformular (2026-08-13)
 *  --------------------------------------------------------------------------
 *  WARUM ES DIESEN BLOCK GIBT: "Jetzt bewerben" fuehrte ins Kunden-
 *  Kontaktformular ("Worum geht es? Neues Dach / Dachsanierung ...") — der
 *  Bewerber landete im falschen Kontext und sprang auf dem letzten Meter ab.
 *  Die Karriere-Seite hat jetzt ein eigenes Formular. Und wie Kontaktformular
 *  und Quiz vorher bewiesen haben: ohne eigenen fail-closed Check geht so
 *  etwas still kaputt.
 * ========================================================================== */
if (forms && forms.enabled !== false) {
  const bv = [];
  const bwSrc = readFileSync(join(HERE, BW_PAGE), "utf8");
  const bwOut = readFileSync(join(OUT, BW_PAGE), "utf8");
  const outMainB = existsSync(join(OUT, "main.js")) ? readFileSync(join(OUT, "main.js"), "utf8") : "";

  // A) Markup (Source + Output): Formular, Felder, Honeypot, Consent, Statuszeile.
  for (const [label, html] of [["src", bwSrc], ["out", bwOut]]) {
    if (count(html, 'id="bwForm"') !== 1) { bv.push(`${BW_PAGE} (${label}): #bwForm erwartet 1×`); continue; }
    for (const id of ["bwVor", "bwNach", "bwTel", "bwMail", "bwStelle", "bwMsg", "bwHp", "bwConsent", "bwNote"]) {
      if (!html.includes(`id="${id}"`)) bv.push(`${BW_PAGE} (${label}): Feld #${id} fehlt`);
    }
    if (count(html, "<!-- WPS_FORM_HEAD -->") !== 1) bv.push(`${BW_PAGE} (${label}): WPS_FORM_HEAD fehlt — Formular kennt den Endpoint nicht`);
  }

  // B) Kein Bewerbungs-Link darf mehr ins Kunden-Formular fuehren.
  if (/class="job"[^>]*href="\/kontakt"/.test(bwOut)) bv.push(`${BW_PAGE}: Stellen-Link zeigt noch auf /kontakt statt #bewerben`);
  if (!/href="#bewerben"/.test(bwOut)) bv.push(`${BW_PAGE}: kein Link auf #bewerben`);

  // C) main.js (Output): submitBewerbung mit fetch, ok-Check, Honeypot, Time-Trap;
  //    Erfolg nie vor der Server-Antwort.
  if (!outMainB) bv.push("Output fehlt: main.js");
  else {
    const start = outMainB.indexOf("function submitBewerbung");
    if (start === -1) {
      bv.push("main.js: submitBewerbung() fehlt — das Bewerbungsformular meldet Erfolg, ohne etwas zu senden (Attrappe)");
    } else {
      const teil = outMainB.slice(start, start + 3000);
      if (!/fetch\(\s*BCFG\.endpoint/.test(teil)) bv.push("main.js: submitBewerbung sendet kein fetch auf BCFG.endpoint");
      if (!/\.ok\b/.test(teil))                   bv.push("main.js: submitBewerbung prueft den HTTP-Status nicht");
      if (!/website:\s*val\('bwHp'\)/.test(teil)) bv.push("main.js: submitBewerbung sendet kein Honeypot-Feld");
      if (!/elapsedMs/.test(teil))                bv.push("main.js: submitBewerbung sendet keine Time-Trap");
      const vorFetch = teil.slice(0, teil.indexOf("fetch("));
      if (/bewerbungSuccess|BT\.success/.test(vorFetch)) {
        bv.push("main.js: Erfolgsmeldung vor der Server-Antwort — Erfolg nie vor HTTP 200 melden");
      }
    }
  }

  if (bv.length) {
    console.error("\n  ✗ Bewerbungs-Validierung fehlgeschlagen:");
    for (const m of bv) console.error("     - " + m);
    process.exit(1);
  }
  console.log("  ✓ Bewerbung verdrahtet (eigenes Formular auf /karriere, Links auf #bewerben, Honeypot + Time-Trap, Erfolg erst nach HTTP 200).");
}
