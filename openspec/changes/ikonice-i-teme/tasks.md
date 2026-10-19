# Tasks

## 1. Četiri palete

- [ ] 1.1 U `site/css/site.css` zadrži ugalj na `:root` i ponovi ga u `html[data-tema="ugalj"]`. Dodaj `mornar`, `pesak` i `terakota` sa tokenima iz design.md, `--chart` `#111111` u svakom bloku, i `color-scheme` po porodici. Svetli `prefers-color-scheme` bez atributa nosi pesak. `.hod-koraka` koristi `var(--amber)` i `var(--on-amber)`. Proširi `test/tema.test.mjs` da za svaku paletu proveri kontrast koraka, beleški, cifara i razlike, zlatni naglasak samo na mornaru i uglju, i tamni bunar. Pokreni `node --test test/tema.test.mjs`.
- [ ] 1.2 U ranoj skripti u `site/index.html` mapiraj `tamna` na `ugalj` i `svetla` na `pesak`, prihvati četiri nova id-a, i ne diraj dokument kad skladište baci. Ažuriraj test koji traži `tema === "tamna" || tema === "svetla"` tako da pokriva mapiranje i četiri id-a. Pokreni `node --test test/tema.test.mjs`.

## 2. Spisak tema i editor

- [ ] 2.1 Zameni preklop dugmeta `#tema` spiskom Mornar, Ugalj, Pesak, Terakota. Izbor odmah postavlja `data-tema` i `localStorage`, bez promene otvorenog časa i koraka. `temaSada` u `site/js/main.js` čita četiri id-a i, bez atributa, i dalje prati sistem. Dopuni `test/tema.test.mjs` tvrdnjama o četiri natpisa i o tome da klik ne zove promenu časa. Pokreni `node --test test/tema.test.mjs`.
- [ ] 2.2 U `site/js/cm-editor.js` tretiraj `mornar` i `ugalj` kao tamni highlight, a `pesak` i `terakota` kao svetli. Kad je pogled već napravljen, promena teme zove `postaviPogled` sa tekstom koji je na ekranu. Proveri u `test/tema.test.mjs` da `tamnaTema` više ne zavisi samo od `tamna` / `svetla`. Pokreni `node --test test/tema.test.mjs`.

## 3. Sprajt i pomoćnik

- [ ] 3.1 Napravi `site/icons/sprite.svg` iz `site/icons/svg_currentColor/`: 31 simbola, id jednak imenu fajla, `viewBox` i deca iz izvornog SVG-a. Proveri da sprajt sadrži `search`, `chevron-left`, `bookmark`, `check-circle`, `lightbulb` i `code-xml`, i da nijedan simbol ne vuče PNG.
- [ ] 3.2 Dodaj pomoćnik koji jednom učita sprajt u dokument i vrati `<svg aria-hidden="true"><use href="#ime"></use></svg>`. Ako učitavanje padne, slot ostaje prazan. Pokrij ponašanje testom koji čita pomoćnik i traži `currentColor` preko `<use>`, bez putanje ka `png_256_transparent`. Pokreni taj test.

## 4. Mesta ikonica

- [ ] 4.1 U zaglavlju ubaci `search`, `chevron-left`, `chevron-right`, `bookmark` i `help-circle`. Inicijali i `#grb` ostaju. U spisku nedelja ubaci `book-open`, `check-circle`, `circle`, `chevron-up` i `chevron-down` umesto `●` i `○`. Na kartici ubaci `calendar-days`, `book-open` i `clock` pored postojećih natpisa. Proveri u novom `test/ikonice.test.mjs` da ti id-evi stoje u `site/js/main.js` ili `site/index.html` i da `●` / `○` više nisu kvačica nedelje. Pokreni `node --test test/ikonice.test.mjs`.
- [ ] 4.2 Na tabovima ubaci `file-text` uz Gradivo, `messages-square` uz Diskusija i `code-xml` uz Editor, bez preimenovanja u Koraci. Na traci koraka ubaci `chart-column`, `clock` i `bookmark` uz reči Sačuvaj korak. Zameni `strelica` sa `chevron-left` i `chevron-right`. Ključna ideja dobija `lightbulb`, naslov isečka `folder`, Kopiraj `copy`, putanja `file-text`. Proveri u `test/ikonice.test.mjs` da natpisi Gradivo, Diskusija, Editor, Kopiraj i Ključna ideja ostaju. Pokreni `node --test test/ikonice.test.mjs test/tema.test.mjs`.
- [ ] 4.3 Na opciji pitanja, pre obrazloženja, izabrana opcija ima `circle-dot`, ostale `circle`, i nijedna `check-circle`. Posle otvorenog obrazloženja tačna opcija ima `check-circle`. U `renderNode` direktorijum ima `folder`, fajl `file-text`. `ikonaVerzije` ostaje olovka i list. Kontrole panela ostaju bez ikonica školjke. Proveri te uslove u `test/ikonice.test.mjs`. Pokreni `node --test test/ikonice.test.mjs`.

## 5. Cela provera

- [ ] 5.1 Pokreni `npm test` i potvrdi da postojeći testovi časa, pojmovnika i ugovora prolaze zajedno sa `test/tema.test.mjs` i `test/ikonice.test.mjs`.
