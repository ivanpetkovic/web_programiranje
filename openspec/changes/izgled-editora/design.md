# Design

## Context

Sajt časa je jedna statična stranica. Vidi `proposal.md` za razlog. Editor je `#sekcija-editor`: tabovi Klijent i Server, stablo, putanja sa `#reset-radne` i `#verzija`, CodeMirror, traka `#traka`, pa soba u `.panel`. `rezim` je `radna` ili `original`. Reset zove `upisiRadnu` sa originalom koraka i vraća `rezim` na `radna`. Dugme verzije danas stavlja `code-xml` ili `book-open`, a reset `arrow-left`. Zahtev već traži olovku i stranicu.

Hod stoji u `renderLecture` kao `.korak-traka`: žuta dugmad, `Korak n od N`, nivo, minuti i Sačuvaj korak. Brojevi koraka `#koraci-kontrole` nestaju, jer birač već otvara svaki korak. Sačuvan korak je `localStorage` ključ `web-programiranje:korak`, niz `sacuvani` sa stavkama `nedelja:indeks`. Server sluša podrazumevano na 8787. Pregled crta `primeniPrikaz`, ne iframe.

## Goals / Non-Goals

**Goals:**

- Isti `rezim`, ista radna verzija i isti zapis sačuvanog koraka dobijaju natpise i raspored sa maketa.
- Popuna birača i adresa pregleda su čiste funkcije, proverene bez stranice.

**Non-Goals:**

- Novi zapis u `localStorage`, iframe, ili upis fajla na disk.
- Prikaz taba Server u nedeljama 1–3. Menjanje kartice napretka, levog spiska ili dokumenta kursa.

## Decisions

### Birač zamenjuje samo traku u Gradivu

Birač stoji u `#birac-mesto`, u zaglavlju časa, izvan `#sekcija-koraci`. Krug je `chevron-left`, red `Korak n od N`, ispod njega `korak.naslov`, puna širina trake, pa `Svi koraci` i `Sledeći`. Nivo, minuti i Sačuvaj korak ostaju u telu Gradiva. Red brojeva `#koraci-kontrole` se ne crta. Editor i Diskusija kriju `#sekcija-koraci`, a birač ostaje, i izbor koraka ne menja otvoreni tab.

Drugi red je naslov koraka. Za Alati u nedelji 1 to je „Alati”, ne „Šta browser prikazuje”. Naslov nedelje već stoji u `h1`.

Alternativa: drugi red je naslov nedelje, kao slova na maketi. Odbijena jer ponavlja `h1` i ne kaže koji je korak 14.

### Popuna je broj sačuvanih koraka ove nedelje

`site/js/birac.js` izvozi `popunaKoraka(sacuvani, nedelja, brojKoraka)`. Broji stavke `nedelja:indeks` čiji je indeks u opsegu, jednom. Rezultat je `{ sacuvano, ukupno }`. Širina trake je `sacuvano / ukupno`, ili nula kad je `ukupno` nula. Otvoreni indeks ne ulazi u račun. Nesačuvani korak 14 od 17, uz tri sačuvana, daje 3/17.

Alternativa: puniti do tekućeg indeksa. Odbijena jer natpis na maketi kaže da traka prati završene korake, ne položaj.

### Sledeći je mastilo, ne naglasak

`.sledeci-korak` ima pozadinu `var(--ink)` i tekst koji na njoj ima kontrast najmanje 4.5:1. Na pesku je to tamno dugme sa makete. Na mornaru i uglju mastilo je svetlo, pa je dugme svetlo na tamnoj kartici, i dalje puno, ne žuto. Prethodni je samo `chevron-left`, pristupačno ime „Prethodni korak”. `#sledeci` na sobi ne dobija tu klasu.

Alternativa: zadržati `.hod-koraka` i samo promeniti natpis. Odbijena jer zahtev žutog hoda traži pozadinu naglaska, a maketa traži puno tamno dugme.

### Moj kod i Lekcija su isti `rezim`

Segment i `#verzija` zovu istu promenu: Moj kod je `radna`, Lekcija je `original`. Izabrani segment ima pozadinu `var(--amber)` i tekst `var(--on-amber)`. `#verzija` pokazuje `pencil` na radnoj i `file-text` na originalu. Pristupačno ime i dalje kaže radna ili ugrađena verzija.

Učitaj postavlja `original` i ne zove `upisiRadnu`. Sačuvaj, dok je `radna`, zove `upisiRadnu` sa tekstom iz editora. Dok je `original`, Sačuvaj ne menja mapu. Resetuj i `refresh-cw` pored putanje zovu postojeći handler reseta, koji već bira `radna`.

Alternativa: Učitaj čita fajl sa diska. Odbijena jer editor sme da pokaže samo original koraka ili radnu verziju.

### Pregled je okvir oko postojeće sobe

`.panel` dobija naslov Pregled i traku: tri tačke, katanac, adresa, osvežavanje. Nema `iframe` i nema polja za kucanje. `adresaPregleda(poreklo, putanja)` u `birac.js` spaja poreklo stranice i putanju jednom kosom crtom. Za `client/index.html` na portu 8787 adresa je `http://localhost:8787/client/index.html`, ne port 3000. Osvežavanje zove postojeće primenjivanje teksta iz editora i ne radi `location.reload`.

Alternativa: upisati `http://localhost:3000/...` kao na slici. Odbijena jer proces ne sluša na 3000.

### Ikonice ulaze u postojeći sprite

`monitor`, `server`, `save`, `refresh-cw` i `pencil` dobijaju isti potez kao ostali `currentColor` simboli, u `site/icons/svg_currentColor/` i u `sprite.svg`. Učitaj koristi postojeći `folder`, Svi koraci postojeći `menu`. Glava časa ne prikazuje preduslov. Izabrani tab časa dobija ivicu `var(--amber)` i pozadinu `var(--amber-dim)`.

Klijent i Server dobijaju ikonice u `loadSide` / stalnim ikonicama. `osveziServerTab` i dalje krije Server u nedeljama 1–3.

## Risks / Trade-offs

- [Tamno dugme na maketi postaje svetlo na mornaru i uglju] → Mastilo teme drži kontrast. Naglasak ostaje za segment i tekući korak.
- [Dva natpisa Sačuvaj] → U editoru je „Sačuvaj” i dira samo radnu verziju. „Sačuvaj korak” i bukmark u zaglavlju i dalje pišu `sacuvani`.
- [Testovi traže `.hod-koraka` i redosled `trakaKoraka.append`] → `test/tema.test.mjs` i `test/ikonice.test.mjs` prate deltu. `#sledeci` sobe i dalje nema klasu hoda.
- [Maketa crta tab Server na klijentskom primeru] → `serverTabVidljiv` ostaje. Nedelja 1 nema Server.

## Migration Plan

Nema prenosa podataka. `sacuvani` i `radnaVerzija` ostaju u istim ključevima. Vraćanje je povratak HTML-a, CSS-a, `main.js` i sprite-a. Stari ključevi tema se ne diraju.

## Open Questions

Nema. Naslov u biraču, izvor popune i port adrese su odluke iznad, ne otvorena pitanja.
