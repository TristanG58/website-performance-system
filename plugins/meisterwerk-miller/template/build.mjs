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
      "data-consent-settings": count(html, "data-consent-settings"),
    };
    for (const [k, n] of Object.entries(checks)) {
      if (n !== 1) problems.push(`${rel}: '${k}' erwartet 1×, gefunden ${n}×`);
    }
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
