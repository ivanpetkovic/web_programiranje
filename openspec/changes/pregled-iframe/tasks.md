# Tasks

## 1. Sklop dokumenta

- [ ] 1.1 U `site/js/pregled.js` izvezi sklapanje klijentskog stabla: ulaz je mapa relativnih putanja na tekst, izlaz je HTML za `srcdoc` u kome `href` i `src` koji gađaju fajl iz mape postaju adrese tog teksta, a `url()` u CSS-u iz mape isto. Putanja koja liči na klijentski fajl, a nije u mapi, ne ostaje kao zahtev ka serveru. `/api/` se ne prepisuje. Prazan ili nedostajući `index.html` daje prazan dokument. U `test/editor.test.mjs` proveri da dodat `<p>` ostaje u dokumentu, da `css/soba.css` iz mape zamenjuje vezu, da ista veza bez fajla u mapi ne sadrži putanju sa diska, i da `/api/soba` ostaje. Pokreni `node --test test/editor.test.mjs`.

## 2. Iframe umesto sobe

- [ ] 2.1 U `site/index.html` zameni `#soba-prekidaca` i `#soba-masina` jednim iframe-om u `.pregled-okvir`. Naslov Pregled, tačke, katanac, `#pregled-adresa` i `#pregled-osvezi` ostaju. Adresa i dalje nije polje. U `site/css/site.css` iframe puni okvir. U `test/editor.test.mjs` proveri da pregled ima iframe i da više nema `#soba-prekidaca` ni `#sledeci`. Pokreni `node --test test/editor.test.mjs`.
- [ ] 2.2 U `site/js/main.js` na izmenu klijentskog bafera, promenu koraka, Moj kod / Lekcija i klik `#pregled-osvezi` sklopi iframe iz `stabloDo` i `tekstPrikaza` za trenutni `rezim`, bez `location.reload` i bez čitanja diska. Serverski fajl ne ulazi u iframe i ne izvršava se. Ukloni evaluaciju `korak.js`, `niz.js`, `displej.js` i `prekidac.js` u stranici časa i crtanje cifre po nedelji. U `test/editor.test.mjs` proveri da `main.js` više ne zove `new Function` nad tim fajlovima i da i dalje ne šalje `/api/fajl`. Pokreni `node --test test/editor.test.mjs test/ikonice.test.mjs`.

## 3. Pregled u browseru

- [ ] 3.1 U `test/editor-izbor.test.mjs` na nedelji 2 proveri: Podela ostavlja prazan iframe bez naslova i broja; Naslov pokazuje samo `h1` iz dokumenta; posle dopisa pasusa kojeg snimak nema, iframe pokazuje taj pasus; stil u iframe-u nije gotov `client/css/soba.css` sa diska dok taj fajl nije u stablu. Pokreni `node --test test/editor-izbor.test.mjs`.

## 4. Cela provera

- [ ] 4.1 Pokreni `node --test test/editor.test.mjs test/editor-izbor.test.mjs test/stablo.test.mjs test/koraci.test.mjs test/ikonice.test.mjs` i potvrdi da prolaze zajedno.

## Workflow follow-up

- Arhiviraj izmenu kad pregled bude prihvaćen.
