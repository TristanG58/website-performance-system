#!/usr/bin/env node
/**
 * shared/sync/sync.mjs — Modell C: zentrale Wissensquellen → synchronisierte
 * Kopien in jedem Plugin. Nur Node.js-Standardbibliothek, keine Dependencies.
 *
 *   node shared/sync/sync.mjs --check   # read-only Validierung (kein Schreiben)
 *   node shared/sync/sync.mjs --sync    # kopiert Quellen → Ziele (idempotent)
 *
 * Sicherheitsinvarianten (beide Modi): keine absoluten Pfade, kein ".."-Traversal,
 * alle Pfade innerhalb des Repos, keine Symlinks, es wird nie gelöscht, es werden
 * keine Shell-Kommandos ausgeführt, nur Manifest-Ziele werden beschrieben.
 */
import { readFileSync, existsSync, lstatSync, mkdirSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, resolve, isAbsolute, sep } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, "..", "..");
const MANIFEST_PATH = resolve(HERE, "sync-manifest.json");

const wantSync = process.argv.includes("--sync");
const wantCheck = process.argv.includes("--check");
if (wantSync === wantCheck) {
  console.error("Usage: node shared/sync/sync.mjs --check | --sync");
  process.exit(2);
}
const MODE = wantSync ? "sync" : "check";

/* ---------- helpers ---------- */
function pathIssue(relPath) {
  if (typeof relPath !== "string" || relPath.length === 0) return "empty or non-string path";
  if (isAbsolute(relPath)) return "absolute path not allowed";
  if (relPath.split(/[\\/]+/).includes("..")) return "'..' traversal not allowed";
  const abs = resolve(REPO_ROOT, relPath);
  if (abs !== REPO_ROOT && !abs.startsWith(REPO_ROOT + sep)) return "path escapes repository root";
  return null;
}
function isSymlink(relPath) {
  const abs = resolve(REPO_ROOT, relPath);
  try { return lstatSync(abs).isSymbolicLink(); } catch { return false; }
}
function sha256(relPath) {
  return createHash("sha256").update(readFileSync(resolve(REPO_ROOT, relPath))).digest("hex");
}
function exists(relPath) { return existsSync(resolve(REPO_ROOT, relPath)); }

/* ---------- load + validate manifest structure ---------- */
const errors = [];
let manifest;
try {
  manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf8"));
} catch (e) {
  console.error("FATAL: cannot read/parse sync-manifest.json:", e.message);
  process.exit(1);
}
if (typeof manifest !== "object" || manifest === null) errors.push("manifest: not an object");
if (typeof manifest.schemaVersion !== "string") errors.push("manifest.schemaVersion must be a string");
if (!Array.isArray(manifest.entries)) errors.push("manifest.entries must be an array");

const entries = Array.isArray(manifest.entries) ? manifest.entries : [];
const seenIds = new Set();
const seenTargets = new Map(); // target -> entry id

for (const [i, e] of entries.entries()) {
  const where = `entry[${i}]`;
  if (typeof e !== "object" || e === null) { errors.push(`${where}: not an object`); continue; }
  if (typeof e.id !== "string" || e.id.length === 0) errors.push(`${where}: 'id' must be a non-empty string`);
  else if (seenIds.has(e.id)) errors.push(`${where}: duplicate id '${e.id}'`);
  else seenIds.add(e.id);

  if (e.mode !== "copy") errors.push(`${where} (${e.id}): 'mode' must be "copy"`);
  if (typeof e.source !== "string") errors.push(`${where} (${e.id}): 'source' must be a string`);
  else {
    const issue = pathIssue(e.source);
    if (issue) errors.push(`${where} (${e.id}): source ${issue}`);
    if (isSymlink(e.source)) errors.push(`${where} (${e.id}): source is a symlink`);
  }

  if (!Array.isArray(e.targets) || e.targets.length === 0) {
    errors.push(`${where} (${e.id}): 'targets' must be a non-empty array`);
  } else {
    for (const t of e.targets) {
      if (typeof t !== "string") { errors.push(`${where} (${e.id}): target not a string`); continue; }
      const issue = pathIssue(t);
      if (issue) errors.push(`${where} (${e.id}): target '${t}' ${issue}`);
      if (isSymlink(t)) errors.push(`${where} (${e.id}): target '${t}' is a symlink`);
      if (seenTargets.has(t)) errors.push(`${where} (${e.id}): duplicate target '${t}' (also in ${seenTargets.get(t)})`);
      else seenTargets.set(t, e.id);
    }
  }
}

/* ---------- check mode ---------- */
function runCheck() {
  let targetsChecked = 0, sourcesPresent = 0, sourcesMissing = 0, pairsIdentical = 0;

  for (const e of entries) {
    if (!e || typeof e.id !== "string") continue;
    const targets = Array.isArray(e.targets) ? e.targets : [];

    // #8 all plugin targets exist
    const targetHashes = [];
    for (const t of targets) {
      targetsChecked++;
      if (!exists(t)) { errors.push(`${e.id}: target missing: ${t}`); targetHashes.push(null); }
      else targetHashes.push(sha256(t));
    }

    // #9 both plugin targets per entry byte-identical
    if (targetHashes.length >= 2 && targetHashes.every((h) => h !== null)) {
      const allEqual = targetHashes.every((h) => h === targetHashes[0]);
      if (allEqual) pairsIdentical++;
      else errors.push(`${e.id}: plugin targets are NOT byte-identical`);
    }

    // #10 + #11 source presence
    if (exists(e.source)) {
      sourcesPresent++;
      const srcHash = sha256(e.source);
      targets.forEach((t, idx) => {
        if (targetHashes[idx] !== null && targetHashes[idx] !== srcHash)
          errors.push(`${e.id}: source differs from target ${t} (would need --sync)`);
      });
    } else {
      sourcesMissing++;
      console.log(`SOURCE_MISSING ${e.id} -> ${e.source}`);
    }
  }

  console.log("");
  console.log(`Entries: ${entries.length}`);
  console.log(`Targets checked: ${targetsChecked}`);
  console.log(`Sources present: ${sourcesPresent}`);
  console.log(`Sources missing: ${sourcesMissing}`);
  console.log(`Target pairs identical: ${pairsIdentical}`);
  console.log(`Errors: ${errors.length}`);
  if (errors.length) { console.error("\nERRORS:"); for (const m of errors) console.error("  - " + m); }
  process.exit(errors.length ? 1 : 0);
}

/* ---------- sync mode (implemented; write only changed content) ---------- */
function runSync() {
  if (errors.length) {
    console.error("Refusing to sync — manifest errors:");
    for (const m of errors) console.error("  - " + m);
    process.exit(1);
  }
  let written = 0, unchanged = 0;
  for (const e of entries) {
    if (!exists(e.source)) { errors.push(`${e.id}: source missing, cannot sync: ${e.source}`); continue; }
    const srcAbs = resolve(REPO_ROOT, e.source);
    const buf = readFileSync(srcAbs);
    const srcHash = createHash("sha256").update(buf).digest("hex");

    for (const t of e.targets) {
      if (isSymlink(t)) { errors.push(`${e.id}: target is a symlink, skipped: ${t}`); continue; }
      const abs = resolve(REPO_ROOT, t);
      const changed = !existsSync(abs) || createHash("sha256").update(readFileSync(abs)).digest("hex") !== srcHash;
      if (!changed) { unchanged++; continue; }
      mkdirSync(dirname(abs), { recursive: true });   // create target dirs as needed
      writeFileSync(abs, buf);                          // write only when content differs; never delete
      const outHash = createHash("sha256").update(readFileSync(abs)).digest("hex");
      if (outHash !== srcHash) errors.push(`${e.id}: post-write hash mismatch for ${t}`);
      else written++;
    }
  }
  console.log(`Synced: ${written} written, ${unchanged} unchanged, Errors: ${errors.length}`);
  if (errors.length) { console.error("ERRORS:"); for (const m of errors) console.error("  - " + m); }
  process.exit(errors.length ? 1 : 0);
}

if (MODE === "check") runCheck();
else runSync();
