# Bloodwork panel

A personal biomarker dashboard. Two files, and the separation between them is the point.

| file | role |
|---|---|
| `bloodwork.js` | **The data. The single source of truth.** 66 markers, 6 draws, the supplement map, and the `STACK` / `ROUTINE` / `DIET` / `CARE` / `TRAINING` / `NEXTDRAW` lifestyle blocks. Also what gets handed to an AI for biomarker work. |
| `index.html` | **The viewer. Contains ZERO data.** Loads `bloodwork.js` via `<script src>`. |

**Never put data in `index.html`. Never put UI in `bloodwork.js`.** If you find yourself
about to, stop and ask.

---

## Before you tell me anything is done

```
python3 tools/check-css.py     # dangling/mangled selectors, undefined vars
node     tools/check-js.js     # BOOTS the page and asserts it renders 66 rows
```

**Both must pass. Every time. No exceptions.**

`node --check` only proves the file parses. It does not prove the page works. Every bug in the
list below **passed a syntax check and shipped a broken page**:

- a regex deleted a block and silently took `norm()` and the entire state object with it —
  the page loaded and rendered nothing
- a dangling selector `[data-theme=dark] [data-theme=dark]` **swallowed the rule after it**
- a bare `[data-theme=dark]` block **tied** the light block's `:root` on specificity and, sitting
  earlier in the file, lost the tie — dark mode silently never applied, on every device, from the
  first deploy until 2026-07. It is `:root[data-theme=dark]` now. A palette has no error to throw:
  LOOK at both themes.
- a media query placed *before* a base rule **stopped applying** (media queries add no specificity)
- `.ccard b` (the card TITLE) matched **every `<b>` in the card** — 84 set numbers and 34
  kg/reps legends silently rendered at 16px title style, uppercase included. Scope
  container rules to the child: `.ccard>b`.
- `new ResizeObserver(setTop).observe(TB)` with **no reference held** silently died on
  iOS — `--toph` went stale on tab switch and a 40px phantom gap opened under the bar.
  Hold the observer in a variable AND re-measure explicitly at the mutation site
  (setPage). Related: the Preview pane throttles rendering — rAF/ResizeObserver
  callbacks may never run there; only synchronous reads are trustworthy in it.
- `position:static` killed sticky on **both** axes when only the horizontal was wanted
- `--thh` was **circular**: the header was sized from it and it was measured back from the header
- `offsetLeft` on a table cell resolves against a **different origin** depending on the cell's
  own `position`, so sticky and static cells measured from different places

CSS fails **silently**. There is no error. The page just quietly does the wrong thing.

---

## Rules that are load-bearing

1. **Media queries go LAST in the stylesheet.** They add no specificity; a later base rule wins.
2. **`--thh` and `--nm` are DECLARED, never measured.** The header is sized by `--thh` and the
   section bar is offset by `--thh`. If a measured value and a declared value drift by 1px, a
   row's frozen cells shine through the seam.
3. **Never `offsetLeft` on table cells.** Use `getBoundingClientRect`.
4. **The chart borrows the table's geometry.** `fitChart()` must run whenever a column moves —
   the marker column shrinks on horizontal scroll, and the plot has to follow.
5. **`text-transform:uppercase` maps `µ` to Greek Mu**, which is visually identical to `M`.
   `300µg` renders as `300MG` — a 1000x dose error. Never let uppercase touch a unit. Use `mcg`.
6. **Light is the default palette; dark is opt-in.** `:root` must never hold the dark colours —
   before JS runs there is no `data-theme` attribute, and a JS failure would show a black screen.
   Dark is applied by JS: a sync head script follows the OS scheme before first paint, and a
   manual toggle (persisted) overrides the OS for good. All of it try/catch'd: JS dies → light.
7. **Anything that must appear "with" an expansion must live ON the animated element.**
   Two independent easings will not agree.

## Data rules

- `v: {"r": <exactly what the lab printed>, "u": "<the unit label they used>"}`.
  **Never pre-convert.** `toUS()` does that.
- `u` is a **unit label string** ("mg/L"), not an index. Indices are fat-fingerable; strings are not.
- `clin[]` is lab data. `opt[]` and `oc` are **inferences** with an evidence tag
  (strong / moderate / weak). Do not present a weak target as a finding.
- `audit()` in `index.html` validates the data on load and **refuses to render** rather than
  show a wrong number. Keep it that way.
- `STACK`, `ROUTINE`, `DIET`, `TRAINING`, `NEXTDRAW`, `CARE` feed the tab pages (Stack /
  Routine / Diet / Training / Next Draw / Grooming); `CARE` is the Grooming tab — Dental as a
  cadence card, Skincare (id 'face') as a day-indexed weekly grid (`.schedule`: days[]/sections[]/rows{n,on[]},
  a dot-matrix; every `on` day name must exist in `days[]` or `audit()` refuses to render).
  Statuses are a closed enum (taking / candidate / stopped / dropped / planned); `when` is the
  meal a supplement rides with — **null means not yet assigned, never guess it**. The Diet
  page derives its supplement lists from `STACK.when` at render time: timing is written in ONE
  place or nowhere. (The Routine page deliberately shows NO supplements — meals are named only;
  supplements belong to Diet.) `audit()` gates these blocks too.

---

## Dev loop

The page loads its data from disk — `<script src>` works over `file://` even though `fetch` does not.
So the simplest loop needs no server at all:

```
open index.html          # or just double-click it
# edit
# Cmd+R
```

**In Claude Code Desktop, use the Preview pane** so you can SEE the rendered page and iterate on it:

```
npx --yes live-server . --port=5173 --no-browser
```

Then point Preview at `http://localhost:5173`. It reloads on save. Being able to look at the
result matters here — most of the bugs in this project were **visual and silent**: a 1px seam,
a column that stopped sticking, a chart drifting 80px off its own axis. None of them threw.

Push to GitHub only when it's right. Development and deployment are separate on purpose.

---

## First-time deploy (run once)

The site is static — GitHub Pages serves it as-is, no build. `index.html` at the root means the
URL is the repo folder itself, not `/index.html`.

```bash
gh auth status || gh auth login          # once, ever

git init
git add .
git commit -m "Bloodwork panel"
git branch -M main
gh repo create bloodwork --public --source=. --push

# turn on Pages, serving main / root
gh api --method POST /repos/{owner}/bloodwork/pages \
  -f "source[branch]=main" -f "source[path]=/"
```

Live in ~60s at `https://<user>.github.io/bloodwork/`.
On the iPhone: open it in Safari → **Share → Add to Home Screen**. It runs standalone —
no address bar, no toolbar. That is what all the chrome-trimming was for.

## Every deploy after that

```bash
python3 tools/check-css.py && node tools/check-js.js   # BOTH must pass
git add -A && git commit -m "..." && git push
```

**Never push if a validator fails.** The whole point of the harness is that it gates the commit.
Each blood draw becomes a commit, so a bad edit is one `git revert` away — which matters, because
the one corruption `audit()` cannot catch is a *plausible but wrong* unit (`µmol/L` where the lab
said `mg/L`): structurally valid, clinically nonsense, and it renders as a confident green number.
