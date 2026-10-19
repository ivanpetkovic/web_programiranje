# Design

## Context

See proposal.md for why. The shell is a static page: `site/index.html`, `site/css/site.css`, `site/js/main.js`, `site/js/cm-editor.js`. A script in the head sets `document.documentElement.dataset.tema` from `localStorage` before CSS, and today accepts only `tamna` and `svetla`. `:root` is the charcoal palette. `html[data-tema="svetla"]` and a `prefers-color-scheme: light` block share one light palette. The theme control is one button that flips those two values.

Shell marks are characters in the markup and in `paintNav`, `renderLecture`, and `nacrtajIsecak`. Step arrows are inline paths in `strelica`. The version control draws its own pencil and page in `ikonaVerzije`. Icons already on disk are `site/icons/svg_currentColor/*.svg` (`stroke="currentColor"`) plus five PNG palettes. The PNG folder `03_cream_emerald` has no mock.

## Goals / Non-Goals

**Goals:**

- Four token blocks keyed by `mornar`, `ugalj`, `pesak`, and `terakota`, with the same custom properties the shell already uses.
- One sprite and one helper that inserts those SVGs as decorative icons.
- A theme list that pins one of the four ids, and a head script that still understands `tamna` and `svetla`.

**Non-Goals:**

- Recoloring `client/css/soba.css` or any file the lecture retypes.
- Replacing the faculty mark, the initials, the version pencil and page, or the panel controls.
- Shipping PNG icons or a fifth emerald theme.
- A build step.

## Decisions

### Four ids on `data-tema`

The attribute values are `mornar`, `ugalj`, `pesak`, and `terakota`. Unpinned means the attribute is absent. `:root` keeps today's charcoal tokens, so an unpinned dark preference is ugalj without a new rule. `html[data-tema="ugalj"]` repeats those tokens so a pin matches the unpinned dark page. `html[data-tema="mornar"]`, `html[data-tema="pesak"]`, and `html[data-tema="terakota"]` replace the set. The light media query, when the attribute is absent, applies the pesak tokens.

The head script maps `tamna` to `ugalj` and `svetla` to `pesak` before it sets the attribute, and writes the new id back when the teacher pins a theme. It still ignores any other stored string and still swallows a storage failure.

`cm-editor.js` treats `mornar` and `ugalj` as the dark highlight (`oneDarkHighlightStyle`) and `pesak` and `terakota` as the light highlight. An absent attribute still follows `prefers-color-scheme`. The editor view is created once in `main.js`. Pinning a theme while that view exists calls `postaviPogled` with the text already on screen, so the highlight follows the pin and the working copy stays.

Token targets, checked by contrast in `test/tema.test.mjs` rather than by sampling every mock pixel:

| id | surface | text accent | notes |
| --- | --- | --- | --- |
| ugalj | current `:root` (`--bg` `#12110e`, `--amber` `#ffb000`) | `#ffb000` on `--paper` | unchanged charcoal |
| mornar | `--bg` `#011835`, `--paper` `#051c38`, `--code` `#081b33` | `#ffb000` | navy from `mocks/navy_theme.png` |
| pesak | `--bg` `#fbfbfb`, `--paper` `#fefefe` | `#a86300` | mock title `#c47400` is 3.6:1 on white; `#a86300` is 4.7:1 |
| terakota | `--bg` `#fcf4eb`, `--paper` `#fef8f1` | `#b81400` | title sample from `mocks/light_red_theme.png`, 6.1:1 on that paper |

`--chart` stays `#111111` in every block. `--on-amber` is the text on the step-walk control and must clear 4.5:1 against `--amber`. Muted, ink, good, bad, and diff tokens are chosen per block to clear the ratios already required for notes, digits, and diff lines. `color-scheme` is `dark` for mornar and ugalj, `light` for pesak and terakota.

`.hod-koraka` uses `background: var(--amber)` and `color: var(--on-amber)` so the walk controls follow the pin. The fixed `#ffb000` / `#1a1204` pair remains the ugalj and mornar values of those tokens.

The control `#tema` becomes a button that opens a list of Mornar, Ugalj, Pesak, and Terakota. Choosing a row sets the attribute and storage. The open lecture and step are left alone.

### One same-document sprite

`site/icons/sprite.svg` is generated once from the 31 files in `svg_currentColor` and committed. There is still no build step. Each file becomes one `<symbol id="...">`, id equal to the filename without `.svg`, with that SVG's `viewBox` and children. The page fetches that sprite once, drops a hidden copy into the document, and `ikonica(ime)` returns an `<svg aria-hidden="true"><use href="#ime"></use></svg>`. Same-document `<use>` inherits `currentColor`. An external `<use href="/icons/sprite.svg#ime">` is the alternative that fails to inherit color in some browsers, so the sprite is inlined after the fetch.

`strelica` is removed. Previous and next step, and previous and next week, use `chevron-left` and `chevron-right`. Week completion replaces `●` and `○`. Quiz options get `circle`, `circle-dot`, or `check-circle` beside the existing letter and sentence. Accessible names stay on the controls. Icons inside a button do not replace its text when the spec still requires the words.

Directories and files in `renderNode` get `folder` and `file-text`. `ikonaVerzije` stays the pencil and the page.

### What stays out of the sprite

`png_256_transparent/` and `mockup_faculty_emblem.png` are reference art. The mark remains `dokument.grb` (`/img/grb.svg`). `user-round`, `menu`, `panel-left`, `arrow-left`, `arrow-right`, `book-marked`, `info`, `message-circle`, and `graduation-cap` have no shell slot in this change.

## Risks / Trade-offs

- [Pesak accent is darker than the mock title] → The step line stays readable. The brighter mock orange can still be a bar (`--amber-dim`) where it is not the step text.
- [Sprite fetch fails] → Controls keep their words. The helper leaves the slot empty rather than drawing a PNG.
- [Editor rebuild on pin resets the cursor] → Acceptable. The text passed in is the text on screen, including the working copy.
- [Old pins] → The head script maps `tamna` and `svetla` before first paint, so the page does not flash the wrong palette.

## Migration Plan

Ship the CSS blocks, the head script, the sprite, and the icon slots together. Rollback is reverting those files. Stored `tamna` and `svetla` keep working. No server data moves.

## Open Questions

None. Exact muted hexes inside a block are free as long as the contrast scenarios hold.
