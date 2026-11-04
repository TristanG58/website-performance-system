#!/usr/bin/env python3
"""slop-check: laute Prüfung gegen AI-Slop in ausgelieferten Texten und Seiten.

Aufruf:  python3 slop-check.py <datei-oder-ordner> [...]   (auch: echo "text" | slop-check.py -)
Optionen: --strict   zählt auch Warnungen als Fehler
          --json     Befunde als JSON

Exit 0 = sauber. Exit 1 = Befunde (Fehler). Warnungen allein geben Exit 0, außer --strict.
Datei mit „slop-check: ignore“ in den ersten 5 Zeilen wird übersprungen (Regelwerke, Zitate).
Prüft .md .txt .html .htm .jsx .tsx .vue .svelte .astro .css. Andere Dateien werden übersprungen.
"""
import json
import os
import re
import sys

TEXT_EXT = {".md", ".txt", ".html", ".htm", ".jsx", ".tsx", ".vue", ".svelte", ".astro", ".css", ".mdx"}
SKIP_DIRS = {"node_modules", ".git", "dist", "build", ".next", ".taste-skill", ".superdesign", ".ultimate-design", "vendor"}

# Fehler: dürfen in ausgeliefertem Text nie vorkommen.
ERRORS = [
    (re.compile("—"), "Gedankenstrich (U+2014). Ersetzen durch Komma, Punkt oder Doppelpunkt."),
    (re.compile(r"\s–\s"), "Halbgeviertstrich als Gedankenstrich. Ersetzen durch Komma, Punkt oder Doppelpunkt."),
    (re.compile(r"\s--\s"), "Doppelter Bindestrich als Gedankenstrich."),
    (re.compile(r"(?i)\bwillkommen (bei|auf) "), "Generischer Hero-Einstieg („Willkommen bei …“)."),
    (re.compile(r"(?i)\b(in der heutigen (schnelllebigen |digitalen )?(welt|zeit))\b"), "AI-Floskel („in der heutigen Welt“)."),
    (re.compile(r"(?i)\b(tauchen sie ein|entdecken sie die welt|entfesseln|revolutionier|game.?changer|next level|all-in-one-lösung)"), "AI-Floskel im Verkaufston."),
    (re.compile(r"(?i)\b(unlock the power|welcome to|your all-in-one|seamless(ly)?|elevate your|delve|tapestry|game-changer)\b"), "Englische AI-Floskel."),
]
# Warnungen: fast immer Slop, aber im Einzelfall vertretbar. Hinweis genügt.
WARNINGS = [
    (re.compile(r"(?i)\b(nahtlos|ganzheitlich|innovativ|maßgeschneidert|hochwertig|professionell|zukunftssicher|effizient)\w*"), "Leeres Adjektiv. Durch einen Beweis ersetzen (Zahl, Name, Ort, Beispiel)."),
    (re.compile(r"(?i)\b(robust|comprehensive|cutting[- ]edge|state[- ]of[- ]the[- ]art|leverage|empower|streamline)\b"), "Englisches AI-Vokabular."),
    (re.compile(r"→|&rarr;"), "Pfeil im Text (häufig als Link-Deko). Nur wenn er etwas bedeutet."),
    (re.compile(r"\s·\s"), "Mittelpunkt als Trenner (A · B · C). Typisches Template-Chrome."),
    (re.compile(r"(?i)\bkosten\b"), "Kundenseitig „Investment“ statt „Kosten“ (Verkaufssprache KAIROS)."),
    (re.compile(r"[\U0001F300-\U0001FAFF☀-➿]"), "Emoji im ausgelieferten Text."),
]
# Nur in Markup/Styles: visuelle Slop-Muster.
MARKUP = [
    (re.compile(r"border-left:\s*\d+px\s+solid"), "Farbiger linker Kartenrand (border-left). Slop-Muster Nr. 8."),
    (re.compile(r"(?i)linear-gradient\([^)]*(#?(7c3aed|8b5cf6|a855f7|6366f1|4f46e5)|purple|violet|indigo)"), "Lila/Indigo-Verlauf. Slop-Muster Nr. 1."),
    (re.compile(r"(?i)font-family:\s*[\"']?(inter|roboto|arial|system-ui)\b"), "Default-Schriftstapel (Inter/Roboto/Arial/system-ui). Bewusst wählen."),
    (re.compile(r"(?i)#(0b0b0b|111111|111)\b"), "Getöntes Fast-Schwarz statt Schwarz (Tell aus frontend-design)."),
    (re.compile(r"(?i)#(d97757|f4f1ea)\b"), "Claude-Creme/Terracotta-Palette. Ist ein Tell, nicht eine Wahl."),
    (re.compile(r"(?i)text-transform:\s*uppercase"), "Versalien-Label (Eyebrow). Nur wenn es Information trägt."),
]


def scan_text(text, path, is_markup):
    out = []
    if "slop-check: ignore" in "\n".join(text.splitlines()[:5]):
        return out
    for i, line in enumerate(text.splitlines(), 1):
        for rx, msg in ERRORS:
            if rx.search(line):
                out.append({"file": path, "line": i, "level": "error", "msg": msg, "text": line.strip()[:120]})
        for rx, msg in WARNINGS:
            if rx.search(line):
                out.append({"file": path, "line": i, "level": "warn", "msg": msg, "text": line.strip()[:120]})
        if is_markup:
            for rx, msg in MARKUP:
                if rx.search(line):
                    out.append({"file": path, "line": i, "level": "warn", "msg": msg, "text": line.strip()[:120]})
    if is_markup:
        centered = len(re.findall(r"text-align:\s*center", text))
        if centered >= 6:
            out.append({"file": path, "line": 0, "level": "warn", "msg": f"{centered}x text-align:center. Alles zentriert ist Slop-Muster Nr. 4.", "text": ""})
    return out


def iter_files(args):
    for a in args:
        if a == "-":
            yield "-", sys.stdin.read()
            continue
        if os.path.isdir(a):
            for root, dirs, files in os.walk(a):
                dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
                for f in files:
                    if os.path.splitext(f)[1].lower() in TEXT_EXT:
                        p = os.path.join(root, f)
                        try:
                            yield p, open(p, encoding="utf-8", errors="replace").read()
                        except OSError:
                            pass
        elif os.path.isfile(a):
            yield a, open(a, encoding="utf-8", errors="replace").read()
        else:
            print(f"slop-check: nicht gefunden: {a}", file=sys.stderr)


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    strict = "--strict" in sys.argv
    as_json = "--json" in sys.argv
    if not args:
        print(__doc__)
        sys.exit(2)
    findings = []
    for path, text in iter_files(args):
        ext = os.path.splitext(path)[1].lower()
        findings += scan_text(text, path, ext in {".html", ".htm", ".jsx", ".tsx", ".vue", ".svelte", ".astro", ".css"})
    errors = [f for f in findings if f["level"] == "error"]
    warns = [f for f in findings if f["level"] == "warn"]
    if as_json:
        print(json.dumps(findings, ensure_ascii=False, indent=1))
    else:
        for f in findings:
            loc = f"{f['file']}:{f['line']}" if f["line"] else f["file"]
            print(f"[{f['level'].upper():5}] {loc}  {f['msg']}" + (f"\n         > {f['text']}" if f["text"] else ""))
        print(f"\nslop-check: {len(errors)} Fehler, {len(warns)} Warnungen.")
    sys.exit(1 if errors or (strict and warns) else 0)


if __name__ == "__main__":
    main()
