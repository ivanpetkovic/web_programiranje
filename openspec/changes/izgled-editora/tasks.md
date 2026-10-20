# Tasks

## 1. Popuna i adresa

- [x] 1.1 Dodaj `site/js/birac.js` sa `popunaKoraka(sacuvani, nedelja, brojKoraka)` i `adresaPregleda(poreklo, putanja)`. Popuna broji jedinstvene ključeve `nedelja:indeks` u opsegu i ignoriše otvoreni indeks. Adresa spaja poreklo i putanju jednom kosom crtom i ne upisuje port 3000. U `test/birac.test.mjs` proveri 3/17 dok 14. korak nije sačuvan, praznu traku kad nema sačuvanih, i adresu `http://localhost:8787/client/index.html`. Pokreni `node --test test/birac.test.mjs`.

## 2. Ikonice

- [x] 2.1 U `site/icons/svg_currentColor/` i `site/icons/sprite.svg` dodaj `monitor`, `server`, `save`, `refresh-cw` i `pencil` istim potezom `currentColor` kao postojeći simboli. Proveri da sprajt sadrži tih pet id-eva i da nijedan novi simbol ne vuče PNG. Pokreni `node --test test/ikonice.test.mjs`.

## 3. Traka editora i pregled

- [x] 3.1 Iznad stabla u `site/index.html` i `site/js/main.js` dodaj Učitaj (`folder`), Sačuvaj (`save`), Resetuj (`refresh-cw`) i segment Moj kod | Lekcija. Moj kod je `rezim` `radna`, Lekcija je `original`, i segment deli stanje sa `#verzija`. `#verzija` pokazuje `pencil` na radnoj i `file-text` na originalu. Učitaj samo bira Lekciju. Sačuvaj zove `upisiRadnu` samo dok je Moj kod na ekranu. Resetuj i ikonica `refresh-cw` pored putanje zovu isti reset i posle njega biraju Moj kod. U `test/editor.test.mjs` i `test/ikonice.test.mjs` zameni očekivani `code-xml` / `book-open` / `arrow-left` na tim dugmadima i proveri da Učitaj ne piše radnu verziju, a Sačuvaj na Lekciji ne menja mapu. Pokreni `node --test test/editor.test.mjs test/ikonice.test.mjs`.
- [x] 3.2 Uokviri `.panel` naslovom Pregled, ukrasnim tačkama, katancem i adresom iz `adresaPregleda(location.origin, putanja)`. Adresa nije polje. Osvežavanje u okviru ponovo primenjuje tekst iz editora i ne radi `location.reload`. Klijent dobija `monitor`, Server `server`, stablo natpis Fajlovi, a otvoreni red ostaje `aria-current`. `osveziServerTab` i dalje krije Server u nedeljama 1–3. Proveri te uslove čitanjem `site/index.html` i `site/js/main.js` u `test/ikonice.test.mjs`. Pokreni `node --test test/ikonice.test.mjs test/editor.test.mjs`.
- [x] 3.3 U `site/css/site.css` oboj izabrani segment sa `var(--amber)` i `var(--on-amber)`, tekući red stabla sa `var(--amber-dim)`, a izabrani tab časa ivicom `var(--amber)` i pozadinom `var(--amber-dim)`. Proveri ta pravila u `test/tema.test.mjs`. Pokreni `node --test test/tema.test.mjs`.

## 4. Birač koraka

- [x] 4.1 U `renderLecture` zameni `.korak-traka` biračem: `chevron-left` bez reči Prethodni korak, red klase `korak` sa tekstom Korak n od N, naslov otvorenog koraka, traka čija je širina `popunaKoraka`, `Svi koraci` sa `menu`, i dugme Sledeći sa `chevron-right`. Nivo (`chart-column`), minuti (`clock`) i Sačuvaj korak (`bookmark`) ostanu u lekciji, van birača. Svi koraci nudi svaki korak nedelje i otvara izabrani. Prethodni je onemogućen na prvom, Sledeći na poslednjem. Birač se ne crta u Editoru. U `test/tema.test.mjs` i `test/ikonice.test.mjs` ukloni traženje `.hod-koraka` i `trakaKoraka.append(prethodni, broj, daljeKorak`, zadrži da `#sledeci` sobe nema klasu hoda, i proveri natpis Korak n od N, naslov koraka i poziv `popunaKoraka`. Pokreni `node --test test/tema.test.mjs test/ikonice.test.mjs`.
- [x] 4.2 U `site/css/site.css` daj Sledeći pozadinu `var(--ink)` i tekst koji na njoj ima kontrast najmanje 4.5:1 u sve četiri teme. Ne koristi `var(--amber)` za to dugme. Preduslov dobija `graduation-cap` i i dalje počinje sa Preduslov:. Proveri pozadinu, kontrast i `graduation-cap` u `test/tema.test.mjs` i `test/ikonice.test.mjs`. Pokreni `node --test test/tema.test.mjs test/ikonice.test.mjs`.

## 5. Cela provera

- [x] 5.1 Pokreni `npm test` i potvrdi da testovi časa, editora, ikonica, tema i `test/birac.test.mjs` prolaze zajedno.

## Workflow follow-up

- Sync delte u `openspec/specs/` tek kad su zadaci gotovi, uz arhivu.
