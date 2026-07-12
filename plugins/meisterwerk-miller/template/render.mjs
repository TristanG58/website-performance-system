#!/usr/bin/env node
/**
 * ============================================================================
 *  render.mjs — Meisterwerk v2 Token-Renderer (Node, ZERO dependencies)
 * ============================================================================
 *  Nimmt ein SITE-Datenobjekt + eine tokenisierte HTML-Vorlage und erzeugt
 *  fertiges HTML. Verarbeitungs-Reihenfolge (wie spezifiziert):
 *
 *    1) REPEAT-Blöcke expandieren (verschachtelt korrekt: bullets in services,
 *       members in team, …). Jedes Array-Item wird mit dem Item als Kontext
 *       gerendert (relative Pfade `.feld` / `{{.}}`).
 *    2) IF-Blöcke auswerten (Sektion nur rendern, wenn Feld existiert und —
 *       bei Arrays — nicht leer ist).
 *    3) Skalar-Tokens `{{pfad}}` ersetzen (roh, ohne HTML-Escaping).
 *       Fehlende Tokens → leerer String (kein Crash).
 *
 *  Token-Konvention
 *  ----------------
 *    {{business.name}}   absoluter Punkt-Pfad ins SITE-Objekt
 *    {{.title}}          Feld des aktuellen REPEAT-Items (relativer Pfad)
 *    {{.}}               das Item selbst (String-Arrays: bullets, gallery, …)
 *
 *    <!-- REPEAT services --> … {{.title}} … <!-- /REPEAT services -->
 *    <!-- REPEAT .bullets --><li>{{.}}</li><!-- /REPEAT .bullets -->   (nested)
 *    <!-- IF team.members --> … <!-- /IF team.members -->
 *
 *  Verwendung:
 *    import { render } from "./render.mjs";
 *    const html = render(templateString, SITE);
 * ============================================================================
 */

/* ---- Pfad-Auflösung -------------------------------------------------------
 *  '.'          → aktuelles Item (ctx)
 *  '.a.b'       → relativ zum Item
 *  'a.b.c'      → absolut ab root (SITE)
 */
export function resolvePath(path, ctx, root) {
  path = String(path).trim();
  if (path === ".") return ctx;
  let base, keys;
  if (path.startsWith(".")) {
    base = ctx;
    keys = path.slice(1).split(".");
  } else {
    base = root;
    keys = path.split(".");
  }
  let v = base;
  for (const k of keys) {
    if (v == null) return undefined;
    v = v[k];
  }
  return v;
}

/* ---- 1) REPEAT-Expansion (rekursiv, nesting-fest) ------------------------- */
function expandRepeats(tpl, ctx, root) {
  const openRe = /<!--\s*REPEAT\s+([^\s]+)\s*-->/;
  let out = tpl;
  while (true) {
    const m = openRe.exec(out);
    if (!m) break;
    const path = m[1];
    const startIdx = m.index;
    const afterOpen = m.index + m[0].length;

    // passendes /REPEAT finden — Verschachtelung mitzählen (egal welcher Pfad)
    const tokenRe = /<!--\s*(\/?)REPEAT(?:\s+[^\s]+)?\s*-->/g;
    tokenRe.lastIndex = afterOpen;
    let depth = 1, innerEnd = -1, closeEnd = -1, tk;
    while ((tk = tokenRe.exec(out))) {
      if (tk[1] === "/") {
        depth--;
        if (depth === 0) { innerEnd = tk.index; closeEnd = tk.index + tk[0].length; break; }
      } else {
        depth++;
      }
    }
    if (closeEnd === -1) throw new Error("Unmatched <!-- REPEAT " + path + " -->");

    const inner = out.slice(afterOpen, innerEnd);
    const arr = resolvePath(path, ctx, root);
    let expanded = "";
    if (Array.isArray(arr)) {
      for (const item of arr) expanded += render(inner, item, root);
    }
    out = out.slice(0, startIdx) + expanded + out.slice(closeEnd);
  }
  return out;
}

/* ---- 2) IF-Auswertung (nesting-fest) ------------------------------------- */
function truthy(v) {
  if (v == null || v === false || v === "") return false;
  if (Array.isArray(v)) return v.length > 0;
  return true;
}
function evalIfs(tpl, ctx, root) {
  const openRe = /<!--\s*IF\s+([^\s]+)\s*-->/;
  let out = tpl;
  while (true) {
    const m = openRe.exec(out);
    if (!m) break;
    const path = m[1];
    const startIdx = m.index;
    const afterOpen = m.index + m[0].length;

    const tokenRe = /<!--\s*(\/?)IF(?:\s+[^\s]+)?\s*-->/g;
    tokenRe.lastIndex = afterOpen;
    let depth = 1, innerEnd = -1, closeEnd = -1, tk;
    while ((tk = tokenRe.exec(out))) {
      if (tk[1] === "/") {
        depth--;
        if (depth === 0) { innerEnd = tk.index; closeEnd = tk.index + tk[0].length; break; }
      } else {
        depth++;
      }
    }
    if (closeEnd === -1) throw new Error("Unmatched <!-- IF " + path + " -->");

    const inner = out.slice(afterOpen, innerEnd);
    const keep = truthy(resolvePath(path, ctx, root));
    out = out.slice(0, startIdx) + (keep ? inner : "") + out.slice(closeEnd);
  }
  return out;
}

/* ---- 3) Skalar-Tokens ---------------------------------------------------- */
function fillScalars(tpl, ctx, root) {
  return tpl.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (_, path) => {
    const v = resolvePath(path, ctx, root);
    return v == null ? "" : String(v);
  });
}

/* ---- Haupt-Render -------------------------------------------------------- */
export function render(tpl, data, root) {
  const r = root === undefined ? data : root;
  // Hero-Weiche: aus heroVariant abgeleitete Booleans (v1 = Default).
  // Einmalig auf dem Root-Objekt setzen (idempotent), sobald es wie das SITE-Root aussieht.
  if (r && typeof r === "object" && r.heroIsV2 === undefined &&
      ("heroVariant" in r || "business" in r)) {
    r.heroIsV2 = r.heroVariant === "v2";
    r.heroIsV1 = !r.heroIsV2;
  }
  let out = expandRepeats(tpl, data, r);
  out = evalIfs(out, data, r);
  out = fillScalars(out, data, r);
  return out;
}

/* ---- CLI: node render.mjs <config.js> <template.html> -------------------- */
if (import.meta.url === `file://${process.argv[1]}`) {
  const { readFileSync } = await import("node:fs");
  const { createRequire } = await import("node:module");
  const { resolve } = await import("node:path");
  const req = createRequire(import.meta.url);
  const cfg = resolve(process.argv[2]);
  const tplPath = resolve(process.argv[3]);
  const SITE = req(cfg);
  const tpl = readFileSync(tplPath, "utf8");
  process.stdout.write(render(tpl, SITE, SITE));
}

export default render;
