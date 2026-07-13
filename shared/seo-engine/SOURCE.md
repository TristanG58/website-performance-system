# Provenance — vendored SEO-Drift-Motor

Dieser Ordner enthält eine **eingefrorene, geprüfte Teilkopie** eines Drittanbieter-Tools.
Er wird bewusst vendored (nicht zur Laufzeit geklont), damit der unbeaufsichtigte wöchentliche
Cron reproduzierbar läuft und nicht von der Verfügbarkeit/Unveränderlichkeit eines Fremd-Repos abhängt.

## Quelle

| Feld | Wert |
|---|---|
| Projekt | `claude-seo` |
| Repository | https://github.com/AgriciDaniel/claude-seo |
| Vendored von Commit | `6cf1ea9fe4c2088b2ad3089797f846850fd66164` (branch `main`, 2026-07-06) |
| Lizenz | MIT (siehe `LICENSE`) |
| Security-Review | 2026-07-13 — Code geklont & durchsucht: kein `curl\|bash`, keine Exfiltration, sauberes Threat-Model (SSRF-Schutz via `url_safety.py`), keine Prompt-Injection. Die 5 vendorierten Dateien gezielt gegengeprüft (kein `eval`/`exec`/`os.system`/`pickle`). |

## Vendored Dateien (Subset — nicht das ganze 25-Skill-Plugin)

| Datei | Zweck |
|---|---|
| `scripts/drift_baseline.py` | Baseline-Snapshot der SEO-kritischen Elemente einer Seite |
| `scripts/drift_compare.py` | Vergleich Live-Seite ↔ Baseline; 17 severity-gestufte Regeln |
| `scripts/fetch_page.py` | HTML-Fetch (via `url_safety` SSRF-abgesichert) |
| `scripts/parse_html.py` | Extraktion Title/Meta/Canonical/H1/Schema/OG etc. |
| `scripts/url_safety.py` | SSRF-Pre-Flight + DNS-gepinnter Fetch (kanonische Sicherheitsschicht) |

**Bewusst NICHT vendored:** `google_auth.py` (OAuth, 31KB), `pagespeed_check.py` (CWV/Google-API),
sowie alle übrigen Skills/Agents/Extensions (E-Commerce, hreflang, DataForSEO, Banana …).

## Angewandte Patches (minimal — REGEL #2)

1. **`drift_baseline.py` & `drift_compare.py`** — Import geändert:
   `from google_auth import validate_url` → `from url_safety import validate_url`.
   Begründung: `google_auth.validate_url` war nur ein Back-Compat-Wrapper, der faul an
   `url_safety.validate_url` delegiert. Der direkte Import macht `google_auth.py` überflüssig
   → das gesamte OAuth-Modul entfällt, ohne Verhaltensänderung. Markiert mit `[KAIROS vendored patch]`.

2. **`drift_baseline.py`** — `DB_DIR` per Env `KAIROS_DRIFT_DB_DIR` überschreibbar gemacht
   (Default unverändert `~/.cache/claude-seo/drift`). Begründung: der Server-Deploy muss den
   Baseline-Speicher kontrollieren können; Tests dürfen `~/.cache` nicht verschmutzen. `drift_compare.py`
   importiert `DB_PATH` von hier, ist also mit abgedeckt. Markiert mit `[KAIROS vendored patch]`.

Keine weiteren Änderungen. Original-Verhalten sonst 1:1.

## Update-Prozess (wenn upstream gebumpt werden soll)

1. Ziel-Commit/Tag im Upstream wählen und **erneut security-reviewen** (Diff gegen `6cf1ea9`).
2. Die 5 Dateien neu kopieren, Patch (1) erneut anwenden.
3. `SOURCE.md` (Commit + Review-Datum) aktualisieren, `python -m compileall` + Smoke-Test laufen.
