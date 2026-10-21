# Proposal

## Why

Pregled pored editora crta ugrađenu sobu i iz teksta prepisuje samo naslov, cifru i jedno dugme. Element koji nastavnik doda ne postoji na ekranu, a prazan dokument i dalje može da pokaže školjku. Pregled treba da bude stranica koju browser učita iz celog stabla u editoru.

## What Changes

- Pregled je jedan iframe. U njega ulazi celo klijentsko stablo otvorenog koraka: `client/index.html` i svaki drugi klijentski fajl koji stablo do tog koraka drži, tekstom koji editor za taj fajl već bira (Moj kod ili Lekcija).
- Iframe ne čita gotov fajl sa diska. Putanja koje nema u stablu ne dobija sadržaj sa diska.
- **BREAKING:** školjka više ne simulira sobu. Nema ugrađenog naslova, cifre, dugmeta „Uključi”, „Sledeći korak”, sobe mašina, ventilatora, čitanja, uloga, istorije ni grafikona koje dokument u editoru nema. `primeniPrikaz` više ne crta panel i ne izvršava klijentski skript u stranici časa.
- Browser u iframe-u parsira ceo dokument. Element, atribut ili stil koji nastavnik doda u editoru vidi se u pregledu, bez spiska dozvoljenih tagova.
- Prazan `client/index.html` ostavlja prazan iframe. Osvežavanje u okviru ponovo sklapa iframe iz trenutnih bafera i ne učitava čas iznova. Upis i dalje ne dira disk.
- Serverski fajl se i dalje ne izvršava u browseru i ne ulazi u iframe. Dok je otvoren serverski fajl, iframe i dalje prikazuje klijentski dokument iz klijentskog stabla.
- Adresa u okviru ostaje natpis, ne polje i ne navigacija.

## Capabilities

### New Capabilities

### Modified Capabilities

- `sajt-casa`: pregled je iframe celog klijentskog stabla; školjka više ne crta niti izvršava simuliranu sobu.
- `casovi`: ono što se vidi u pregledu je dokument iz editora. Školjka ne dodaje sobu mašina, ventilator ni kontrole koje fajlovi nemaju.
- `kontrolna-soba`: prikaz u času više nije drugi, nacrtan panel. Kutija i njeni HTTP odgovori ostaju. Soba, ventilator i kontrole na ekranu postoje samo ako ih učitani dokument ima.

## Impact

- `site/index.html`, `site/css/site.css`, `site/js/main.js`, `site/js/pregled.js`: iframe umesto `#soba-prekidaca` i `#soba-masina` u pregledu. Roditelj više ne evaluira `korak.js`, `niz.js`, `displej.js` ni `prekidac.js`.
- `test/editor.test.mjs` i `test/editor-izbor.test.mjs` danas očekuju parsiranje tri polja i skrivanje školjke. Menjaju se na iframe i na element koji nije unapred poznat.
- `openspec/specs/sajt-casa/spec.md`, `casovi/spec.md` i `kontrolna-soba/spec.md` dobijaju delte. Kurs, disk i Node proces se ne menjaju.
- Nema nove zavisnosti. Jezik sajta ostaje srpski.
