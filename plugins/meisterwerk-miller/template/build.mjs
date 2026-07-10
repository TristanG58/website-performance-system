#!/usr/bin/env node
/**
 * Meisterwerk v2 (Miller-Edition) — Config → Seiten-Injektion (keine Dependencies).
 *
 * Übernimmt die AUTOMATISIERBAREN Personalisierungs-Stellen aus config/site.js:
 *   1) Theme-Farben  → styles.css :root  (--dark/--light/--key1/--key2)
 *   2) Domain        → public/robots.txt
 *   3) sitemap.xml   → aus nav + seo.siteUrl generiert
 *
 * Inhalts-Personalisierung (NAP, Hero, services/team/faq-Listen) macht der
 * handwerk-site-builder-Skill anhand der Personalisierungs-Map in
 * reference/template-spec.md — nichts erfinden, Lücken markieren.
 *
 *   Aufruf:  node build.mjs
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const SITE = require(join(__dirname, "config", "site.js"));

const log = (m) => console.log(`  ✓ ${m}`);

/* 1) Theme-Farben in styles.css :root schreiben ------------------------------ */
function injectTheme() {
  const cssPath = join(__dirname, "styles.css");
  if (!existsSync(cssPath)) return console.warn("  ⚠ styles.css nicht gefunden");
  let css = readFileSync(cssPath, "utf8");
  const t = SITE.theme || {};
  const map = { "--dark": t.dark, "--light": t.light, "--key1": t.key1, "--key2": t.key2 };
  for (const [name, val] of Object.entries(map)) {
    if (!val) continue;
    // ersetzt "  --dark:#1C3F60;" bis zum ersten ; nach dem Token-Namen
    const re = new RegExp(`(${name}\\s*:\\s*)[^;]+;`);
    if (re.test(css)) css = css.replace(re, `$1${val};`);
  }
  writeFileSync(cssPath, css);
  log("Theme-Farben in styles.css :root injiziert");
}

/* 2) robots.txt + 3) sitemap.xml -------------------------------------------- */
function seoFiles() {
  const url = (SITE.seo && SITE.seo.siteUrl || "").replace(/\/$/, "");
  if (!url) return console.warn("  ⚠ seo.siteUrl fehlt — robots/sitemap übersprungen");
  const pub = join(__dirname, "public");
  if (!existsSync(pub)) mkdirSync(pub, { recursive: true });

  writeFileSync(join(pub, "robots.txt"),
    `User-agent: *\nAllow: /\n\nSitemap: ${url}/sitemap.xml\n`);
  log("robots.txt aktualisiert");

  const paths = (SITE.nav || [{ href: "/" }]).map((n) => n.href);
  const urls = paths.map((p) =>
    `  <url><loc>${url}${p === "/" ? "/" : p}</loc><changefreq>monthly</changefreq></url>`).join("\n");
  writeFileSync(join(pub, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
  log(`sitemap.xml generiert (${paths.length} URLs)`);
}

console.log(`\nMeisterwerk v2 · Build für „${SITE.business?.name || "?"}"`);
injectTheme();
seoFiles();
console.log("\nFertig. Content-Personalisierung (NAP/Hero/Listen) via site-builder-Skill + template-spec.\n");
