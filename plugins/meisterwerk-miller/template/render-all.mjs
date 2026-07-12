#!/usr/bin/env node
/**
 * ============================================================================
 *  render-all.mjs — Meisterwerk v2 (Miller-Edition) Site-Renderer (ZERO deps)
 * ============================================================================
 *  Rendert die komplette 5-Seiten-Site aus EINER Datei: config/site.js.
 *  Faltet die früheren build.mjs-Aufgaben (Theme-/Domain-Injektion, robots,
 *  sitemap) mit ein. HTML-Dateien werden NIE von Hand bearbeitet.
 *
 *    node render-all.mjs [outDir]      (Default outDir = ./site)
 *
 *  Ablauf:
 *   1) config/site.js laden, 5 tokenisierte Seiten mit render.mjs füllen.
 *   2) styles.css: Theme-Farben (:root) + Home-Hero-BG (.hero-bg) + Quiz-BG
 *      (.quiz-bg) aus der Config injizieren.
 *   3) public/robots.txt + public/sitemap.xml aus seo.siteUrl + nav generieren.
 *   4) main.js, styles.css (injiziert), hero-v2/, assets/, public/ in outDir kopieren.
 * ============================================================================
 */
import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const HERE = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const { render } = await import(resolve(HERE, "render.mjs"));

const OUT = resolve(process.cwd(), process.argv[2] || "site");
const SITE = require(resolve(HERE, "config", "site.js"));
const log = (m) => console.log("  ✓ " + m);

const PAGES = [
  "index.html",
  "leistungen/index.html",
  "ueber-uns/index.html",
  "karriere/index.html",
  "kontakt/index.html",
];

/* 1) Seiten rendern -------------------------------------------------------- */
function renderPages() {
  for (const rel of PAGES) {
    const tpl = readFileSync(join(HERE, rel), "utf8");
    // frische Root-Kopie je Seite, damit die abgeleiteten heroIs*-Flags neu berechnet werden
    const site = JSON.parse(JSON.stringify(SITE));
    const html = render(tpl, site, site);
    const dest = join(OUT, rel);
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, html);
  }
  log(`${PAGES.length} Seiten gerendert → ${OUT}`);
}

/* 2) styles.css: Theme + Backgrounds injizieren ---------------------------- */
function injectStyles() {
  let css = readFileSync(join(HERE, "styles.css"), "utf8");
  const t = SITE.theme || {};
  for (const [name, val] of Object.entries({ "--dark": t.dark, "--light": t.light, "--key1": t.key1, "--key2": t.key2 })) {
    if (!val) continue;
    css = css.replace(new RegExp(`(${name}\\s*:\\s*)[^;]+;`), `$1${val};`);
  }
  // Home-Hero-BG + Quiz-BG aus der Config (sonst zeigt jeder Kunde dasselbe Bild)
  const heroBg = SITE.hero && SITE.hero.bg;
  const quizBg = SITE.quiz && SITE.quiz.bg;
  if (heroBg) css = css.replace(/(\.hero-bg\{[^}]*url\(')[^']*('\))/, `$1${heroBg}$2`);
  if (quizBg) css = css.replace(/(\.quiz-bg\{[^}]*url\(')[^']*('\))/, `$1${quizBg}$2`);
  mkdirSync(OUT, { recursive: true });
  writeFileSync(join(OUT, "styles.css"), css);
  log("styles.css injiziert (Theme + hero/quiz-BG)");
}

/* 3) robots.txt + sitemap.xml generieren ----------------------------------- */
const AI_BOTS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "Perplexity-User", "ClaudeBot", "Claude-Web", "Google-Extended", "Googlebot", "Bingbot"];
function genSeoFiles() {
  const siteUrl = (SITE.seo && SITE.seo.siteUrl ? SITE.seo.siteUrl : "").replace(/\/$/, "");
  const pub = join(OUT, "public");
  mkdirSync(pub, { recursive: true });

  let robots = "# robots.txt — klassische Suchmaschinen + KI-Antwortmaschinen (GEO)\nUser-agent: *\nAllow: /\n\n";
  for (const bot of AI_BOTS) robots += `User-agent: ${bot}\nAllow: /\n\n`;
  robots += `Sitemap: ${siteUrl}/sitemap.xml\n`;
  writeFileSync(join(pub, "robots.txt"), robots);

  const nav = Array.isArray(SITE.nav) ? SITE.nav : [];
  const urls = nav.map((n) => {
    const href = n.href === "/" ? "/" : String(n.href || "").replace(/\/$/, "");
    return `  <url><loc>${siteUrl}${href}</loc><changefreq>monthly</changefreq></url>`;
  }).join("\n");
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  writeFileSync(join(pub, "sitemap.xml"), sitemap);
  log("public/robots.txt + public/sitemap.xml generiert");
}

/* 4) statische Assets kopieren --------------------------------------------- */
function copyAssets() {
  const copy = (rel) => {
    const src = join(HERE, rel);
    if (existsSync(src)) cpSync(src, join(OUT, rel), { recursive: true });
  };
  copy("main.js");
  copy("hero-v2");
  copy("assets");   // lokale Demo-Platzhalter; reale Kunden nutzen externe Bild-URLs
  copy("consent");  // WPS Level-2 Consent (consent.js/consent.css) → /consent/ ausliefern
  log("main.js, hero-v2/, assets/, consent/ kopiert");
}

renderPages();
injectStyles();
genSeoFiles();
copyAssets();
console.log("\n  Fertig. Ausgabe:", OUT);
