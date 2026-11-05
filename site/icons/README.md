# Ikonice za univerzitetsku tutor aplikaciju

U paketu se nalazi **55 zasebnih vektorskih UI ikonica**, sa transparentnom pozadinom.

- `svg_currentColor/`: 55 zasebnih SVG fajlova. Koriste `currentColor`, pa boju u aplikaciji nasleđuju iz CSS-a.
- `png_256_transparent/`: zasebni PNG 256 × 256 fajlovi, u 5 kolor-varijanti. Svaka boja ima `standard/` i `accent/` poddirektorijum.
- `png_256_transparent/<tema>/mockup_faculty_emblem.png`: rasterski izdvojen amblem iz AI dizajn-makete. **Nije proveren kao zvanični logotip fakulteta.** Za produkciju upotrebiti zvanični fakultetski logo.
- `sprite.svg`: isti simboli u jednom fajlu; `site/js/ikonice.js` ga jednom ubaci u stranu i crta ikonicu kroz `<use href="#ime">`. Nova ikonica ide i u `svg_currentColor/` i u `sprite.svg`.
- `pregled_ikonica.png`: vizuelni pregled svih simbola.

Ikonice su čiste vektorske rekonstrukcije stilizovane prema prikazanom UI konceptu. Nisu mutni pikselizovani isečci ekrana, pa mogu da se koriste za web i mobilne aplikacije.

**Napomena:** Različita stanja (npr. popunjeni krug i označeni krug) prikazana su kao zasebne ikonice. Neki detalji su pomoćni, dodatni simboli istog vizuelnog sistema.

## Spisak

`a-large-small`, `arrow-left`, `arrow-right`, `book-marked`, `book-open`, `book-open-text`, `bookmark`, `bookmark-filled`, `calendar-days`, `chart-column`, `check`, `check-circle`, `chevron-down`, `chevron-left`, `chevron-right`, `chevron-up`, `circle`, `circle-dot`, `clock`, `code-xml`, `copy`, `database`, `download`, `ellipsis`, `external-link`, `file-text`, `folder`, `graduation-cap`, `help-circle`, `info`, `layers`, `lightbulb`, `list-plus`, `loader`, `menu`, `message-circle`, `messages-square`, `monitor`, `monitor-code`, `panel-left`, `pencil`, `plus`, `question`, `redo-2`, `refresh-cw`, `save`, `search`, `server`, `settings`, `sticky-note`, `trash`, `undo-2`, `upload`, `user-round`, `x`.

Za Opcije i beleške dodate su `settings`, `a-large-small`, `layers`, `database`, `upload`, `download`, `trash`, `external-link`, `book-open-text`, `monitor-code`, `sticky-note` i `bookmark-filled` (ispuna `currentColor`).
