# Design

## Context

Vidi `proposal.md` za razlog. Pregled danas nije iframe. `#soba-prekidaca` i `#soba-masina` stoje u `site/index.html`. `applyLive` u `site/js/main.js` zove `primeniPrikaz` iz `site/js/pregled.js`, koji iz HTML-a vadi samo `h1`, `class="digit"` i prvi `button`, a klijentske skripte evaluira u stranici časa. `fitPanel` po nedelji pokazuje „Sledeći korak”, čitanje, uloge i sobu mašina. Stablo do koraka je `stabloDo`. Tekst fajla je `tekstPrikaza`: Moj kod ili Lekcija. Server i dalje šalje fajlove sa diska na `/client/`.

## Goals / Non-Goals

**Goals:**

- Jedan iframe u okviru Pregled, sklopljen iz celog klijentskog stabla trenutnog koraka.
- Svaki element iz tog dokumenta vidi se jer ga parsira browser, ne spisak tagova.
- Relativna putanja iz stabla dobija bafer editora. Putanja koje nema u stablu ne čita disk.
- Serverski fajlovi iz istog stabla upisuju se celim tekstom na disk preko `POST /api/fajl`, tekstom koji bira prekidač Moj kod / Lekcija.
- Soba mašina, sa cifrom i ventilatorom, ostaje školjka pored iframe-a i prati kutiju.

**Non-Goals:**

- Novi fajl u stablu koje korak nije uveo. Menjanje kursa da u HTML doda sobu mašina.
- Izvršavanje `server/` u browseru ili u iframe-u.
- Čuvanje stanja unutar iframe-a preko izmene bafera. Nova sklopka zamenjuje dokument.
- Vruća zamena `server.js`, `stanje.js` i `baza.js` bez ponovnog pokretanja procesa.

## Decisions

### Iframe ne ide na `/client/index.html`

Ta adresa je fajl sa diska. `src` iframe-a ostaje prazan. Dokument je `srcdoc` sklopljen iz bafera. Natpis `#pregled-adresa` i dalje samo ispisuje poreklo i putanju otvorenog fajla i ne navigira.

Alternativa: service worker koji presreće `/client/`. Odbijena je jer uvodi trajni worker i i dalje deli poreklo sa diskom ako presretanje promaši.

### Mapa bafera i blob adrese

Za svaku putanju iz `stabloDo` koja počinje sa `client/`, tekst je `tekstPrikaza` za trenutni `rezim`. U HTML-u se `href` i `src` koji gađaju tu relativnu putanju zamene `blob:` adresom tog teksta. Ista zamena važi za `url()` u CSS-u iz stabla. Putanja koja liči na klijentski fajl, a nije u stablu, dobija prazan blob, ne zahtev ka serveru. Apsolutni `/api/...`, `/client/assets/...` i `/fonts/...` se ne diraju: font je binaran i editor ga ne drži, a Node ga već služi. Ako dokument pošalje `/api/soba`, to je njegov zahtev, ne zahtev školjke.

Klasičan skript sa `blob:` radi bez modula. Snimak i dalje ubacuje klasične `<script src>`, kako `ugradiPovez` već radi.

### Bez sandboxa

`sandbox` bez `allow-same-origin` pravi tuđe poreklo, pa `fetch("/api/soba")` traži CORS koji server ne šalje. Bez sandboxa, `srcdoc` deli poreklo stranice časa i taj zahtev stiže ako ga dokument ima. Relativne putanje su već zamenjene, pa ne čitaju disk. Školjka ne zove skript iz iframe-a i ne evalira ga u svom prozoru.

### Školjka skida sobu prekidača

Iz `.pregled-okvir` izlazi `#soba-prekidaca`. `#soba-masina` ostaje pored iframe-a: cifra `#displej-masina` i ventilator `#fan`. Od časa sa Node-om i dalje je sluša `EventSource("/dovod")` i vrti lopatice dok su `ukljucen` i `prikljucen` istiniti. Ta soba nije sadržaj editora. Ostaju naslov Pregled, tačke, katanac, adresa i `#pregled-osvezi`. Osvežavanje i svaka izmena klijentskog bafera ponovo sklope `srcdoc` i povuku prethodne blob adrese. `primeniPrikaz` prestaje da crta sobu prekidača i da evaluira klijentski skript u stranici časa.

### Server se upisuje pa učitava

`rezim` je jedan za celo stablo: `original` je Lekcija, `radna` je Moj kod. Na promenu režima, koraka, serverskog bafera ili klik `#pregled-osvezi`, stranica za svaki `server/` fajl iz `stabloDo` uzme `tekstPrikaza` za taj `rezim` i pošalje ceo tekst na postojeći `POST /api/fajl` (`strana`, `put`, `izvor`). Node upiše fajl. `osveziModul` ponovo učita `soba.js`, `ventilator.js` i `sesija.js`. Sledeći `/api/soba`, `/api/ventilator` i `/dovod` rade iz tih fajlova, pa i ventilator u sobi mašina.

Lekcija šalje snimak koraka i za fajl koji nije otvoren. Moj kod šalje radnu verziju ako postoji i nije prazna, inače snimak. Prekidač dok je otvoren `client/index.html` i dalje prepisuje serverske fajlove. Klijentski fajl se ne šalje na `POST /api/fajl`.

Sintaksna greška i dalje ne upisuje fajl: `POST /api/fajl` vrati 400, disk ostaje prethodni ispravan tekst, radna verzija ostaje u editoru. `server.js`, `stanje.js` i `baza.js` se upišu, a proces ih i dalje drži od starta (`pokretanje: true`).

### Prazan dokument i serverski tab

Nema `client/index.html` u stablu, ili je tekst prazan: `srcdoc` je prazan dokument. Otvoren serverski fajl ne menja iframe. Iframe i dalje drži klijentski dokument, a upisani serverski moduli i soba mašina prate aktivni režim.

## Risks / Trade-offs

- [Svaka izmena sklapa dokument iznova, pa se stanje u stranici (uključen prekidač, skrol) gubi] → Prihvaćeno. Osvežavanje i jeste novo učitavanje. Školjka ne čuva staru cifru.
- [Iframe bez sandboxa vidi `window.parent`] → Skript iz kursa ne treba roditelja. Školjka mu ne prosleđuje API za crtanje sobe.
- [Časovi 5–10 više nemaju simuliranu sobu prekidača] → Iframe pokazuje dokument. Soba mašina školjke i dalje crta ventilator. Kontrole koje žive samo u uklonjenoj sobi prekidača vide se kad ih dokument ima.
- [Blob skript nema putanju `js/korak.js` u devtools-u] → Prihvaćeno. Ponašanje je tekst iz editora, ne ime sa diska.
- [Pregled prepisuje `server/*.js` na disku] → Prihvaćeno za pokaz. `server/prepared/` i `POST /api/fajl/povrati` i dalje vraćaju pripremljenu verziju. Posle restarta procesa važi poslednji upis.

## Migration Plan

Nema migracije podataka. Radne verzije u `localStorage` ostaju. Dok je čas otvoren, disk serverskih fajlova prati aktivni režim. Vraćanje crtanja školjke ne briše taj upis.
