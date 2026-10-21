# Proposal

## Why

Pregled pored editora crta ugrađenu sobu i iz teksta prepisuje samo naslov, cifru i jedno dugme. Element koji nastavnik doda ne postoji na ekranu, a prazan dokument i dalje može da pokaže školjku. Pregled treba da bude stranica koju browser učita iz celog stabla u editoru.

## What Changes

- Pregled je jedan iframe. U njega ulazi celo klijentsko stablo otvorenog koraka: `client/index.html` i svaki drugi klijentski fajl koji stablo do tog koraka drži, tekstom koji editor za taj fajl već bira (Moj kod ili Lekcija).
- Iframe ne čita gotov fajl sa diska. Putanja koje nema u stablu ne dobija sadržaj sa diska.
- **BREAKING:** školjka više ne simulira sobu. Nema ugrađenog naslova, cifre, dugmeta „Uključi”, „Sledeći korak”, sobe mašina, ventilatora, čitanja, uloga, istorije ni grafikona koje dokument u editoru nema. `primeniPrikaz` više ne crta panel i ne izvršava klijentski skript u stranici časa.
- Browser u iframe-u parsira ceo dokument. Element, atribut ili stil koji nastavnik doda u editoru vidi se u pregledu, bez spiska dozvoljenih tagova.
- Prazan `client/index.html` ostavlja prazan iframe. Osvežavanje u okviru ponovo sklapa iframe iz trenutnih bafera i ne učitava čas iznova. Klijentski fajl se i dalje ne upisuje na disk.
- Serverski fajl se ne izvršava u browseru i ne ulazi u iframe. Ceo tekst svakog serverskog fajla iz stabla ide na `POST /api/fajl`. Node ga upiše i iz tog fajla učita `soba.js`, `ventilator.js` i `sesija.js`. `server.js`, `stanje.js` i `baza.js` važe tek posle ponovnog pokretanja procesa.
- Isti prekidač Moj kod / Lekcija bira i taj serverski tekst. Lekcija šalje snimak koraka za svaki serverski fajl u stablu. Moj kod šalje radnu verziju tog fajla, ili snimak ako radne verzije nema. Prekidač važi i kad je na ekranu klijentski fajl.
- Pored iframe-a ostaje soba mašina školjke, sa cifrom i ventilatorom. Nije fajl iz editora. Od časa sa Node-om prati kutiju preko postojećeg dovoda.
- Adresa u okviru ostaje natpis, ne polje i ne navigacija.

## Capabilities

### New Capabilities

### Modified Capabilities

- `sajt-casa`: pregled je iframe klijentskog stabla; prekidač Moj kod / Lekcija bira i serverski tekst koji `POST /api/fajl` upisuje; soba mašina ostaje školjka.
- `casovi`: iframe pokazuje dokument iz editora. Soba mašina školjke, sa ventilatorom, stoji pored njega od časa sa serverom.
- `kontrolna-soba`: kutija i HTTP ostaju. Ventilator u pregledu je soba mašina školjke i prati proces, ne fajl iz editora.

## Impact

- `site/index.html`, `site/css/site.css`, `site/js/main.js`, `site/js/pregled.js`: iframe umesto `#soba-prekidaca`. `#soba-masina` ostaje. Roditelj više ne evaluira `korak.js`, `niz.js`, `displej.js` ni `prekidac.js`. Na promenu režima, koraka ili serverskog bafera šalje cele serverske fajlove na `POST /api/fajl`.
- `test/editor.test.mjs` i `test/editor-izbor.test.mjs` danas očekuju parsiranje tri polja i zabranu `fetch("/api/fajl")`. Menjaju se na iframe, na element koji nije unapred poznat, i na upis serverskog teksta iz aktivnog režima.
- `openspec/specs/sajt-casa/spec.md`, `casovi/spec.md` i `kontrolna-soba/spec.md` dobijaju delte. Kurs se ne menja. Disk serverskih fajlova u toku časa postaje tekst iz aktivnog režima. Klijentski disk se ne dira.
- Nema nove zavisnosti. Jezik sajta ostaje srpski.
