# Proposal

## Why

Tab Editor i hod kroz korak ne prate makete. Editor i dalje drži radnu verziju i original na ikonicama pored putanje, a pregled je gola soba. Traka koraka je žuti „Prethodni korak” i „Sledeći korak časa”, sa nivoom, minutima i „Sačuvaj korak” u istom redu. Maketa editora traži traku fajla i pregled u okviru browsera. Maketa birača traži „Korak n od N”, naslov koraka, traku završenih koraka, „Svi koraci” i „Sledeći”.

## What Changes

- Na Editoru, iznad stabla, stoje Učitaj, Sačuvaj, Resetuj i segment Moj kod | Lekcija. Klijent nosi ikonicu monitora, Server ikonicu servera. Stablo ima natpis Fajlovi. Putanja i dalje ima reset i prekidač verzije: olovka dok je Moj kod na ekranu, stranica dok je Lekcija.
- Učitaj otvara Lekciju i ne briše radnu verziju. Sačuvaj upisuje bafer Moj koda u radnu verziju u ovom browseru. Resetuj i dalje zamenjuje radnu verziju originalom otvorenog koraka i pokazuje Moj kod. Nijedno ne piše na disk i ne beleži korak.
- Desna strana je Pregled: lažni okvir browsera, adresa otvorenog fajla na poreklu stranice, i soba unutra. Osvežavanje u okviru ponovo crta pregled iz teksta u editoru i ne učitava čas iznova. Adresa se ne kuca.
- **BREAKING:** žuti hod nestaje. Birač zamenjuje traku koraka i stoji izvan Gradiva, pa ostaje na Diskusiji i Editoru. Levi krug je samo `chevron-left`. Sredina kaže Korak n od N i naslov tog koraka. Traka ispod puni se brojem sačuvanih koraka ove nedelje, ne indeksom otvorenog koraka. Desno su „Svi koraci” i puno dugme „Sledeći”. Izbor koraka ne menja otvoreni tab. Nivo, minuti i Sačuvaj korak ostaju u telu lekcije, ne u biraču. Sačuvaj u zaglavlju i dalje beleži korak.
- Preduslov je poziv sa `graduation-cap`. Izabrani tab časa (Gradivo, Diskusija ili Editor) ima naglasak teme. Red brojeva, jedno dugme po koraku, ne ostaje. Birač je navigacija.
- Tab Server i dalje ne postoji u nedeljama 1–3, iako ga maketa crta pored klijentskog primera.

## Capabilities

### New Capabilities

### Modified Capabilities

- `sajt-casa`: izgled editora i pregleda, natpisi Moj kod i Lekcija, i birač koraka umesto žutog hoda. Nivo, minuti i čuvanje koraka ostaju, van birača.

## Impact

- `site/index.html`, `site/css/site.css`, `site/js/main.js`: traka editora, okvir pregleda, poziv preduslova, birač na Gradivu.
- `site/icons/sprite.svg` i `site/icons/svg_currentColor/`: `monitor`, `server`, `save`, `refresh-cw`, `pencil`. Postojeće `folder`, `menu`, `graduation-cap`, `file-text`, `chevron-left`, `chevron-right` se koriste. Nema PNG ikonica.
- `test/tema.test.mjs` i `test/ikonice.test.mjs` više ne traže žuti hod ni nivo u traci koraka. `test/editor.test.mjs` i dalje drži radnu verziju i original.
- `openspec/specs/sajt-casa/spec.md` dobija deltu. `casovi`, `pitalice` i `kontrolna-soba` se ne menjaju. Dokument kursa, disk, Node, pitalice i kartica napretka ostaju.
- Nema nove zavisnosti ni koraka izgradnje. Jezik sajta ostaje srpski. Rečenica sa makete „Progress indicates completed steps…” nije natpis na strani.
