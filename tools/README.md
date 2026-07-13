# Run these before believing any change to index.html

    python3 tools/check-css.py     # braces, EMPTY/MANGLED/DANGLING selectors, undefined vars
    node     tools/check-js.js     # BOOTS the page and asserts it renders 66 rows

`node --check` only proves the file parses. It does not prove the page works.
Every one of the bugs below passed a syntax check and shipped a broken page:

- a regex deleted a block and silently took `norm()` and the whole state object with it
- a dangling selector `[data-theme=dark] [data-theme=dark]` swallowed the rule after it
- a media query placed BEFORE a base rule stopped applying (media queries add no specificity)
- `position:static` killed sticky on BOTH axes, not just the horizontal one
- `--thh` was circular: the header sized from it, and it was measured back from the header
- `offsetLeft` on a table cell resolves against a different origin depending on `position`

## Rules that are load-bearing

1. **Media queries go LAST in the stylesheet.** They add no specificity; a later base rule wins.
2. **`--thh` and `--nm` are declared, never measured.** Sticky offsets derive from them. If a
   measured value and a declared value disagree by 1px, a row's frozen cells shine through the seam.
3. **Never use `offsetLeft` on table cells.** Use `getBoundingClientRect`.
4. **The chart borrows the table's geometry**, so `fitChart()` must run whenever a column moves.
5. **`text-transform:uppercase` maps `µ` to Greek Mu**, which looks like M. `300µg` renders as
   `300MG`. Never let uppercase touch a unit. Use `mcg`.
