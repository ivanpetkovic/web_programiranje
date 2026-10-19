# Proposal

## Why

Nedelja „Šta browser prikazuje” (prva nedelja isporučenog dokumenta, ona sa obe slike) uči korak po korak, ali originali koraka Osvežavanje i Semantika isti su kao original prethodnog koraka istog fajla, pa gradivo tog koraka nema svoj dodatak u kodu. Editor već prebacuje radnu i ugrađenu verziju, ali nema dugme koje radnu verziju vraća na ugrađenu. Školjka i dalje nosi serif i toplo ćilibar, a slike traže sans, teget naslove i isto zlato u svetloj i tamnoj temi, uz jedno dugme koje temu okrene.

## What Changes

- Svaki korak te nedelje pokriven je kodom. Posle prve verzije fajla svaki sledeći korak istog fajla dodaje bar jednu liniju o onome što korak kaže i zadržava prethodne linije. Podela ostaje skica `client/` i `server/`. Stranica počinje skoro prazan dokument i od nje HTML raste. Razmak počinje skoro prazan stil i Okvir ga proširuje. Osvežavanje i Semantika prestaju da budu kopija prethodnog originala.
- Nedelje 2–10 zadržavaju original koji kurs već drži na koraku. Spisak od petnaest nedelja sa slike ostaje proba trajanja, ne novi nastavni plan.
- Editor dobija drugo dugme, pored postojećeg prekidača. Prekidač i dalje menja radnu i ugrađenu verziju i ne briše ukucano. Novo dugme resetuje radnu verziju otvorenog fajla na ugrađeni original tog koraka. Ni jedno ni drugo ne piše na disk.
- Školjka u obe teme prati obe slike: sans, svetla kartica na svetloj podlozi, tamna kartica na tamnoj, teget naslov na svetloj, zlato kao akcenat, ključna ideja, isečak, mreža pitalice u dva stupca na širokom ekranu. Natpis taba ostaje Gradivo.
- Jedno dugme u zaglavlju i dalje zakuca drugu temu odmah, preživi učitavanje i ne pomera čas. Natpis ili ime dugmeta kaže temu koju će klik uključiti. Pravila kontrasta reda koraka, prigušenih beleški, cifara i tamnog bunara ostaju.

## Capabilities

### New Capabilities

### Modified Capabilities

- `casovi`: originali nedelje „Šta browser prikazuje” rastu od skoro praznog fajla; Osvežavanje i Semantika dodaju po malo.
- `sajt-casa`: reset radne verzije, prekidač radne i ugrađene verzije kao zasebno dugme, školjka po obe slike i jedno dugme koje okrene temu.

## Impact

- `site/kurs.json` menja originale koraka te nedelje koji danas ne dodaju liniju, i originale kasnijih koraka istog fajla da lanac i dalje raste. Tekst koraka, redosled i pitalice ostaju. Fajlovi na disku u `client/` i `server/` se ne menjaju.
- `site/index.html`, `site/css/site.css` i `site/js/main.js` dobijaju reset i izgled obe teme. `site/js/radna.js` briše sačuvanu radnu verziju otvorenog fajla. `client/css/soba.css` i font Digital-7 Mono ostaju.
- `test/koraci.test.mjs` proverava da posle Stranice i posle Razmaka svaki sledeći original istog fajla dodaje liniju. `test/editor.test.mjs` i `test/tema.test.mjs` prate reset i dugme teme.
- Nema nove zavisnosti. Jezik sajta ostaje srpski.
