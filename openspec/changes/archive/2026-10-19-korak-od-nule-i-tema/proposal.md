# Proposal

## Why

Prva nedelja, „Šta browser prikazuje”, treba da pokaže osnove HTML-a i CSS-a. Danas HTML poraste do sobe prekidača, a stil stane na razmak slova i jednu ivicu, bez selektora i box modela kao posebnih koraka. Osvežavanje i Semantika uz to ponavljaju prethodni original. Editor već prebacuje radnu i ugrađenu verziju, ali nema dugme koje radnu verziju vraća na ugrađenu. Školjka i dalje nosi serif i toplo ćilibar, a slike traže sans, teget naslove i isto zlato u svetloj i tamnoj temi, uz jedno dugme koje temu okrene.

## What Changes

- Prva nedelja i dalje sklapa sobu prekidača sa brojem 24, bez Node-a i bez sobe mašina. Od Stranice do Dugmeta svaki korak dodaje jedan HTML element ili atribut, i ključna ideja ga imenuje. Posle veze ka stilu, Selektor, Okvir, Unutra i Spolja dodaju klasni selektor, pa `border`, `padding` i `margin`. Razmak kao ime koraka nestaje. Osvežavanje i Semantika i dalje dodaju po liniju. Podela ostaje skica `client/` i `server/`.
- Nedelje 2–10 zadržavaju original koji kurs već drži na koraku. Spisak od petnaest nedelja sa slike ostaje proba trajanja, ne novi nastavni plan.
- Editor dobija drugo dugme, pored postojećeg prekidača. Prekidač i dalje menja radnu i ugrađenu verziju i ne briše ukucano. Novo dugme resetuje radnu verziju otvorenog fajla na ugrađeni original tog koraka. Ni jedno ni drugo ne piše na disk.
- Školjka u obe teme prati obe slike: sans, svetla kartica na svetloj podlozi, tamna kartica na tamnoj, teget naslov na svetloj, zlato kao akcenat, ključna ideja, isečak, mreža pitalice u dva stupca na širokom ekranu. Natpis taba ostaje Gradivo.
- Jedno dugme u zaglavlju i dalje zakuca drugu temu odmah, preživi učitavanje i ne pomera čas. Natpis ili ime dugmeta kaže temu koju će klik uključiti. Pravila kontrasta reda koraka, prigušenih beleški, cifara i tamnog bunara ostaju.

## Capabilities

### New Capabilities

### Modified Capabilities

- `casovi`: prva nedelja pokazuje HTML elemente i atribute, pa CSS selektor i box model; originali rastu od skoro praznog fajla.
- `sajt-casa`: reset radne verzije, prekidač radne i ugrađene verzije kao zasebno dugme, školjka po obe slike i jedno dugme koje okrene temu.

## Impact

- `site/kurs.json` menja redosled i tekst koraka prve nedelje: Razmak postaje Selektor, ulaze Unutra i Spolja, ključne ideje HTML koraka imenuju element ili atribut, a originali CSS-a rastu do box modela. Nedelje 2–10 se ne menjaju. Fajlovi na disku u `client/` i `server/` se ne menjaju.
- `site/index.html`, `site/css/site.css` i `site/js/main.js` dobijaju reset i izgled obe teme. `site/js/radna.js` briše sačuvanu radnu verziju otvorenog fajla. `client/css/soba.css` i font Digital-7 Mono ostaju.
- `test/koraci.test.mjs` proverava novi redosled, HTML korake i box model. `test/editor.test.mjs` i `test/tema.test.mjs` prate reset i dugme teme.
- Nema nove zavisnosti. Jezik sajta ostaje srpski.
