# Vergleichs-Artifact zum Durchklicken

Regel: Design-Entscheidungen werden nie beschrieben, sondern gezeigt. Der User klickt durch
Kandidaten und wählt. Das gilt für Richtungen (Phase 2), Varianten (Phase 2), Hero/Typo/Motion-
Alternativen (Phase 3), Vorher/Nachher (Phase 3 und 4) und Ad-Creatives (Spur Ads).

## Was hinein muss

Je Kandidat:
- Ein Buchstabe (A, B, C) und ein Titel aus dem Idee-Satz, nicht „Variante 1".
- Screenshots bei drei Breiten: 1440, 820, 390 (Desktop, Tablet, Phone). Volle Seite oder der
  betroffene Ausschnitt, beides mit derselben Breite über alle Kandidaten.
- Zwei Zeilen: welche Idee, was sich gegenüber den anderen unterscheidet. Keine Werbung für
  den Kandidaten, nur die Differenz.
- Bei Motion: ein kurzes Video oder GIF (chrome-devtools `screencast_start`/`stop`), sonst drei
  Keyframes nebeneinander.

Für das ganze Artifact:
- Tabs oder Pfeiltasten (links/rechts) zum Wechseln, Zahl 1 bis 3 als Shortcut.
- Ein „Nebeneinander"-Schalter, der die Desktop-Screenshots aller Kandidaten in einer Reihe zeigt.
- Eine Zeile oben: was entschieden werden soll (eine Frage), welche Phase, welches Projekt.
- Dark und Light sauber (die Screenshots selbst sind, was sie sind).
- Kein Kandidat vorausgewählt, keine Empfehlung im Artifact. Die Empfehlung kommt im Chat, eine
  Zeile, mit Grund.

## Wie es gebaut wird

1. Screenshots erzeugen (eine der drei Wege, je nachdem, was läuft):
   - tasteskill: `node <skill>/scripts/inspect.mjs --url <url> --out .ultimate-design/shots/<kandidat>/`
     (liefert drei Breiten und die Befundliste in einem Lauf).
   - playwright MCP: `browser_resize` auf 1440/820/390, dann `browser_take_screenshot` (fullPage).
   - chrome-devtools MCP: `resize_page`, `take_screenshot` (fullPage).
   Statische HTML-Dateien über einen lokalen Server öffnen (`python3 -m http.server`), nie als `file://`.
2. Bilder nach `.ultimate-design/shots/<phase>-<runde>/<kandidat>-<breite>.png`.
3. HTML schreiben nach `.ultimate-design/vergleich/<phase>-<runde>.html`. Bilder relativ einbinden.
   Für ein claude.ai-Artifact (Artifact-Tool) die Bilder als `files` mitgeben oder als Assets
   hochladen, Größenlimit 16 MB beachten (Screenshots vorher auf JPEG 80 Prozent verkleinern,
   `sips -s format jpeg -s formatOptions 80`).
4. Dem User den Link oder die Datei geben (SendUserFile mit `display: render` oder Artifact-URL)
   und mit AskUserQuestion auf die Wahl warten. Die Frage nennt die Buchstaben, nicht die Inhalte.
5. Wahl und Grund in `.ultimate-design/STATE.md` unter „Entscheidungen" eintragen.

## Minimal-Gerüst (anpassen, nicht neu erfinden)

```html
<!doctype html><html lang="de"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Vergleich: Hero-Richtung</title>
<style>
:root{--bg:#fff;--ink:#111;--muted:#666;--line:#e5e5e5}
@media(prefers-color-scheme:dark){:root:not([data-theme=light]){--bg:#121212;--ink:#f2f2f2;--muted:#9a9a9a;--line:#2a2a2a}}
body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.5 system-ui,sans-serif;padding:0 16px}
header{padding:20px 0;border-bottom:1px solid var(--line)}
nav button{font:inherit;padding:8px 14px;margin-right:6px;border:1px solid var(--line);background:none;color:inherit;border-radius:6px;cursor:pointer}
nav button[aria-selected=true]{background:var(--ink);color:var(--bg)}
section[hidden]{display:none}
.shots{display:grid;grid-template-columns:3fr 1.7fr 0.8fr;gap:12px;align-items:start}
.shots img{width:100%;border:1px solid var(--line);border-radius:4px}
.note{color:var(--muted);max-width:60ch}
.row .shots{grid-template-columns:repeat(3,1fr)}
@media(max-width:700px){.shots{grid-template-columns:1fr}}
</style></head><body>
<header><strong>Entscheidung:</strong> Welche Hero-Richtung? · Phase 2 · Projekt X
<nav role="tablist" style="margin-top:10px">
<button role="tab" aria-selected="true" data-k="A">A · Die Straße</button>
<button role="tab" data-k="B">B · Das Etikett</button>
<button role="tab" data-k="C">C · Der Ofen um fünf</button>
<button id="row">Nebeneinander</button>
</nav></header>
<section data-k="A"><p class="note">Idee: … Unterschied: …</p>
<div class="shots"><img src="shots/A-1440.jpg" alt="A Desktop"><img src="shots/A-820.jpg" alt="A Tablet"><img src="shots/A-390.jpg" alt="A Phone"></div></section>
<section data-k="B" hidden>…</section>
<section data-k="C" hidden>…</section>
<script>
const tabs=[...document.querySelectorAll('[role=tab]')],secs=[...document.querySelectorAll('section')];
function show(k){tabs.forEach(t=>t.setAttribute('aria-selected',t.dataset.k===k));secs.forEach(s=>s.hidden=s.dataset.k!==k);document.body.classList.remove('row')}
tabs.forEach(t=>t.onclick=()=>show(t.dataset.k));
document.getElementById('row').onclick=()=>{secs.forEach(s=>s.hidden=false);document.body.classList.add('row')};
addEventListener('keydown',e=>{const i=tabs.findIndex(t=>t.getAttribute('aria-selected')==='true');
if(e.key==='ArrowRight')show(tabs[(i+1)%tabs.length].dataset.k);if(e.key==='ArrowLeft')show(tabs[(i-1+tabs.length)%tabs.length].dataset.k);
if(/^[1-9]$/.test(e.key)&&tabs[e.key-1])show(tabs[e.key-1].dataset.k)});
</script></body></html>
```

Der Mittelpunkt in den Tab-Titeln ist hier Navigation, kein Fließtext. In ausgelieferten Seiten
gilt Hausregel A6.
