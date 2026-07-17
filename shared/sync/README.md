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

## Sicherheitsinvarianten (in `sync.mjs` implementiert)

Keine absoluten Pfade · kein `..`-Traversal · alle Pfade innerhalb des Repos · keine Symlinks ·
es wird **nie gelöscht** · keine Shell-Kommandos · es werden ausschließlich Manifest-Ziele beschrieben.
Keine Dependencies, nur Node-Standardbibliothek.
