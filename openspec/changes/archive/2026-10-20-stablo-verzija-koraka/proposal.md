# Proposal

## Why

Editor i dalje otvara poslednji fajl sa diska, pa svaki korak izgleda kao gotova soba. Nastavnik hoće stablo i verziju fajla kakvi stoje na otvorenom koraku, i u `index.html` inicijal koji vezuje JavaScript koji do tog koraka postoji.

## What Changes

- Stablo na tabu Klijent ili Server je skup fajlova te strane koje je neki korak do otvorenog koraka uveo. Podela drži samo `index.html` sa skicom `client/` i `server/`. Do kraja nedelje 3 Klijent ima `index.html`, `css/soba.css`, `js/korak.js`, `js/niz.js`, `js/displej.js` i `js/prekidac.js`. Tab Server i dalje izostaje u nedeljama 1–3.
- Ugrađena verzija fajla na ekranu je snimak tog fajla posle koraka do otvorenog, ne gotov fajl sa diska. Nedelja 1 i dalje zamenjuje fajl celim originalom. Kasniji korak dopisuje svoj `delic`. Kad `isecak` počinje klasom koja još nije u fajlu, ulazi cela klasa. U `client/js/korak.js`, čim postoji `function korak` koja pominje `delta` a `delta` nije deklarisana, verzija počinje sa `let delta = 1;`.
- Kad `index.html` ima `</body>` i u stablu postoji bar jedan `client/js/*.js`, dokument dobija `<script src>` redosledom uvođenja i jedan klasičan inline skript koji vezuje deklarisane simbole: klik ažurira cifru ili zove `korak(soba)`, `new Displej` i `new Prekidac` kad klase postoje, a `<canvas>` i poziv `nacrtajLiniju` kad se to ime pominje. Blok je označen `<!-- povezi-pocetak -->` i `<!-- povezi-kraj -->`.
- Razlika ugrađene verzije ide prema snimku iste putanje na neposredno prethodnom koraku kursa. Ako fajl tada nije postojao, sve linije su zelene. Radna verzija i dalje je jedna po putanji i deli se kroz korake. Reset upisuje snimak otvorenog koraka.
- **BREAKING**: Nedelje 2–10 više ne pokazuju sam `delic` kao ceo fajl u editoru. `delic` ostaje doprinos koraka u `site/kurs.json`. Fajlovi na disku se ne menjaju.

## Capabilities

### New Capabilities

### Modified Capabilities

- `sajt-casa`: stablo do otvorenog koraka, snimak fajla umesto diska, inline init u `index.html`, razlika prema snimku prethodnog koraka.
- `casovi`: nedelja 1 zadržava cele originale; od nedelje 2 editor pokazuje nagomilani snimak, a sačuvani `delic` ostaje doprinos koraka.

## Impact

- `site/js/stablo.js`, `site/js/main.js`, `site/js/lectures.js`. Editor više ne vuče stablo ni tekst iz `/api/stablo` i `/api/fajl`.
- `site/kurs.json` i fajlovi u `client/` i `server/` ostaju kakvi jesu. Pregled i dalje ne izvršava `server/`.
- Testovi `test/stablo.test.mjs` i `test/editor.test.mjs`.
