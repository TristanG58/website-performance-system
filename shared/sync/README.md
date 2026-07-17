# shared/sync — zentrale Wissensquellen → Plugin-Kopien („Modell C")

Geteiltes Wissen (Playbook, Design-Referenzen, Gewerke-Profile) liegt **einmal** unter
`shared/knowledge/` und wird von dort in **jedes Plugin** kopiert.

## Warum kopiert und nicht verlinkt?

Die Plugins (`plugins/meisterwerk`, `plugins/meisterwerk-miller`) sind über
`plugins/.claude-plugin/marketplace.json` **eigenständig installierbar**. Ihre Skills verweisen
plugin-relativ auf `reference/geo-seo-playbook.md`. Ein Symlink nach `shared/` würde beim
Installieren/Ausliefern ins Leere zeigen — die Skill-Anweisung „lade zuerst die Quelle der Wahrheit"
liefe dann **still** ins Nichts. Deshalb: echte Kopien, maschinell synchron gehalten.

**Die Duplikate sind Absicht, kein Versäumnis.** Wer sie „aufräumen" will, bricht die
Auslieferbarkeit der Plugins.

## Benutzung

```bash
node shared/sync/sync.mjs --check   # read-only: sind alle Ziele identisch zur Quelle?
node shared/sync/sync.mjs --sync    # Quellen → Ziele kopieren (idempotent)
```

`--check` gibt Exit-Code ≠ 0 bei Abweichung — geeignet für einen Pre-Commit-Hook oder CI.

## Die Regel

1. **Immer die Datei unter `shared/knowledge/` ändern.** Nie eine Kopie in `plugins/*/reference/`.
2. Danach `node shared/sync/sync.mjs --sync`.
3. Vor dem Commit `--check` — dann kann keine Kopie unbemerkt driften.

Neue geteilte Datei? Eintrag in `sync-manifest.json` ergänzen (`id`, `source`, `targets`, `mode: "copy"`).

## Pre-commit-Hook (empfohlen, einmalig pro Klon)

Schritt 3 automatisch erzwingen — `.githooks/pre-commit` bricht den Commit ab, wenn Kopien abweichen:

```bash
git config core.hooksPath .githooks
```

Der Hook liegt **im Repo** (versioniert), aber `core.hooksPath` ist Klon-lokale Config — **jeder neue
Klon braucht diesen einen Befehl**, sonst ist der Hook inaktiv. Bypass im Notfall: `git commit --no-verify`.

**Was er nicht abdeckt (ehrlich):**
- Er prüft den **Working Tree**, nicht den Index. Wer synchronisiert, aber nur die Quelle staged
  (`git add shared/...` ohne die Kopien), committet trotzdem einen driftenden Stand — der Hook sieht
  einen sauberen Working Tree und lässt durch. Deshalb im Fix-Hinweis `git add -u`.
- Ohne `node` im PATH warnt er und lässt durch, statt jeden Commit zu blockieren.

Beide Lücken schließt erst ein CI-Check, der `node shared/sync/sync.mjs --check` bei jedem Push fährt
(gleicher Einzeiler, Exit ≠ 0 bei Abweichung). Steht noch aus.

## Sicherheitsinvarianten (in `sync.mjs` implementiert)

Keine absoluten Pfade · kein `..`-Traversal · alle Pfade innerhalb des Repos · keine Symlinks ·
es wird **nie gelöscht** · keine Shell-Kommandos · es werden ausschließlich Manifest-Ziele beschrieben.
Keine Dependencies, nur Node-Standardbibliothek.
