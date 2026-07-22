/**
 * ============================================================================
 *  CHAT-KONTEXT — erzeugt das Bot-Futter aus config/site.js
 * ============================================================================
 *  Aufruf:  node chat-context.mjs            → Text nach stdout
 *           node chat-context.mjs --check    → nur pruefen, nichts ausgeben
 *
 *  Der ausgegebene Text gehoert in die Spalte `kontext` der n8n-Data-Table
 *  "Meisterwerk Kunden", in die Zeile mit derselben clientId wie forms.clientId.
 *
 *  WARUM NICHT ZUR LAUFZEIT AUS DEM BROWSER: kaeme der Kontext im Payload mit,
 *  koennte jeder dem Bot beliebige "Fakten" ueber den Betrieb unterschieben —
 *  Preise, Zusagen, Leistungen, die es nicht gibt. Deshalb einmal erzeugen,
 *  einmal einsetzen, danach steht er ausserhalb der Reichweite des Besuchers.
 *
 *  NACH JEDER AENDERUNG AN config/site.js NEU ERZEUGEN UND EINSETZEN —
 *  sonst erzaehlt der Bot den Stand von vorgestern.
 * ============================================================================
 */
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const SITE = require("./config/site.js");

/* Die Config liefert HTML (Entities, <br>). Der Bot braucht Klartext. */
function text(v) {
  return String(v == null ? "" : v)
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

const b = SITE.business || {};
const addr = b.addr || {};
const out = [];

out.push("BETRIEB: " + text(b.legalName || b.name));
if (b.tagline) out.push("KURZBESCHREIBUNG: " + text(b.tagline));

out.push("");
out.push("KONTAKT:");
out.push("- Telefon: " + text(b.phone));
out.push("- E-Mail: " + text(b.email));
out.push("- Adresse: " + text(b.addrShort || [addr.street, addr.zip, addr.city].filter(Boolean).join(", ")));
if (SITE.geo && Array.isArray(SITE.geo.areaServed) && SITE.geo.areaServed.length) {
  out.push("- Einsatzgebiet: " + SITE.geo.areaServed.map(text).join(", "));
}

if (Array.isArray(SITE.services) && SITE.services.length) {
  out.push("");
  out.push("LEISTUNGEN:");
  for (const s of SITE.services) {
    out.push("- " + text(s.titleDetail || s.title) + ": " + text(s.detail || s.teaser));
    if (Array.isArray(s.bullets) && s.bullets.length) {
      out.push("  Umfasst: " + s.bullets.map(text).join("; "));
    }
  }
}

const reasons = (SITE.vorteile && SITE.vorteile.reasons) || [];
if (reasons.length) {
  out.push("");
  out.push("WAS DEN BETRIEB AUSMACHT:");
  for (const r of reasons) out.push("- " + text(r.title) + ": " + text(r.body));
}

const story = (SITE.about && SITE.about.story) || {};
if (Array.isArray(story.body) && story.body.length) {
  out.push("");
  out.push("UEBER DEN BETRIEB:");
  for (const p of story.body) out.push(text(p));
}

const jobs = (SITE.karriere && SITE.karriere.jobs) || [];
if (jobs.length) {
  out.push("");
  out.push("OFFENE STELLEN:");
  for (const j of jobs) {
    const meta = Array.isArray(j.meta) && j.meta.length ? " (" + j.meta.map(text).join(", ") + ")" : "";
    out.push("- " + text(j.title) + meta);
  }
}

const faq = (SITE.faq && SITE.faq.items) || [];
if (faq.length) {
  out.push("");
  out.push("HAEUFIGE FRAGEN (so hat der Betrieb sie selbst beantwortet):");
  for (const f of faq) {
    out.push("F: " + text(f.q));
    out.push("A: " + text(f.a));
  }
}

const kontext = out.join("\n");

/* ---- Fail-closed: lieber gar kein Bot als ein Bot, der Platzhalter erzaehlt ---- */
const fehler = [];
const clientId = (SITE.forms && SITE.forms.clientId) || "";

if (!clientId) {
  fehler.push("forms.clientId fehlt — ohne sie findet n8n weder Empfaenger noch Kontext.");
}
if (clientId === "demo-musterwerk") {
  fehler.push(
    'forms.clientId steht noch auf "demo-musterwerk". Erst pro Kunde setzen, ' +
      "sonst landen die Chats unter der Demo-Kennung."
  );
}
if (/Muster|Beispiel|example\.de/i.test(kontext)) {
  fehler.push(
    "Der Kontext enthaelt noch Demo-Platzhalter (Muster…/Beispiel/example.de). " +
      "Der Bot wuerde Besuchern erfundene Namen und Adressen nennen."
  );
}
if (kontext.length < 400) {
  fehler.push("Der Kontext ist mit " + kontext.length + " Zeichen zu duenn — der Bot haette nichts zu sagen.");
}

if (fehler.length) {
  console.error("\nchat-context.mjs: Kontext NICHT verwendbar\n");
  for (const f of fehler) console.error("  - " + f);
  console.error("");
  process.exit(1);
}

if (process.argv.includes("--check")) {
  console.error("chat-context.mjs: OK — " + kontext.length + " Zeichen, clientId " + clientId);
} else {
  process.stdout.write(kontext + "\n");
}
