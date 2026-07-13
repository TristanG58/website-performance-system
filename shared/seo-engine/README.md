# shared/seo-engine

Vendored Drift-Motor für den **kontinuierlichen SEO/GEO-Update-Flow** (Version 2).
Erfasst SEO-kritische Elemente einer Seite als Baseline und erkennt spätere Abweichungen
(Regressionen wie entferntes Schema, `noindex`, kaputtes Canonical, geänderte H1/Title).

Herkunft & Sicherheitsprüfung: siehe [`SOURCE.md`](SOURCE.md).
Rolle im Gesamtsystem: siehe [`../../tasks/todo.md`](../../tasks/todo.md).

## Voraussetzung: Python 3.10+

Der macOS-System-Python (3.9) reicht **nicht** (`dict | None`-Syntax). Homebrew-Python nutzen.

## Setup (einmalig)

```bash
cd shared/seo-engine
/opt/homebrew/bin/python3.12 -m venv .venv
./.venv/bin/pip install -r requirements.txt
```

## Nutzung

```bash
VENV=./.venv/bin/python

# 1) Baseline erfassen (Soll-Zustand festhalten)
$VENV scripts/drift_baseline.py "https://kunde.de" --skip-cwv

# 2) Später: Live-Seite gegen Baseline vergleichen
$VENV scripts/drift_compare.py "https://kunde.de" --skip-cwv
```

Beide geben **JSON** auf stdout aus. `--skip-cwv` lässt die 2 Core-Web-Vitals-Regeln aus
(brauchen einen Google-PageSpeed-API-Key) — die übrigen 16 Regeln laufen API-frei.

Baseline-Speicher (Default): `~/.cache/claude-seo/drift/baselines.db` (SQLite).
_Hinweis: In S3 wird dieser Pfad auf einen KAIROS-eigenen, pro-Kunde-getrennten Ort umgezogen._

## Überwachte Regeln (17)

**CRITICAL** (8): `noindex_added`, `schema_removed`, `canonical_removed`, `canonical_changed`,
`h1_removed`, `h1_changed`, `title_removed`, `status_code_error`
**WARNING** (7): `title_changed`, `meta_description_changed`, `og_tags_removed`, `schema_modified`,
`cwv_regressed`*, `perf_score_dropped`*
**INFO** (3): `content_hash_changed`, `schema_added`, `h2_structure_changed`

\* braucht CWV/PageSpeed-API — ohne `--skip-cwv` und mit Key.
