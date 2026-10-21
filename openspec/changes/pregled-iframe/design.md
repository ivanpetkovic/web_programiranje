# Design

## Context

Vidi `proposal.md` za razlog. Pregled danas nije iframe. `#soba-prekidaca` i `#soba-masina` stoje u `site/index.html`. `applyLive` u `site/js/main.js` zove `primeniPrikaz` iz `site/js/pregled.js`, koji iz HTML-a vadi samo `h1`, `class="digit"` i prvi `button`, a klijentske skripte evaluira u stranici časa. `fitPanel` po nedelji pokazuje „Sledeći korak”, čitanje, uloge i sobu mašina. Stablo do koraka je `stabloDo`. Tekst fajla je `tekstPrikaza`: Moj kod ili Lekcija. Server i dalje šalje fajlove sa diska na `/client/`.

## Goals / Non-Goals

**Goals:**

- Jedan iframe u okviru Pregled, sklopljen iz celog klijentskog stabla trenutnog koraka.
- Svaki element iz tog dokumenta vidi se jer ga parsira browser, ne spisak tagova.
- Relativna putanja iz stabla dobija bafer editora. Putanja koje nema u stablu ne čita disk.

**Non-Goals:**

- Novi fajl u stablu koje korak nije uveo. Menjanje kursa da u HTML doda sobu mašina, čitanje ili uloge.
- Izvršavanje `server/` u iframe-u ili zamena diska baferom editora za Node.
- Čuvanje stanja unutar iframe-a preko izmene bafera. Nova sklopka zamenjuje dokument.

## Decisions

### Iframe ne ide na `/client/index.html`

Ta adresa je fajl sa diska. `src` iframe-a ostaje prazan. Dokument je `srcdoc` sklopljen iz bafera. Natpis `#pregled-adresa` i dalje samo ispisuje poreklo i putanju otvorenog fajla i ne navigira.

Alternativa: service worker koji presreće `/client/`. Odbijena je jer uvodi trajni worker i i dalje deli poreklo sa diskom ako presretanje promaši.

### Mapa bafera i blob adrese

Za svaku putanju iz `stabloDo` koja počinje sa `client/`, tekst je `tekstPrikaza` za trenutni `rezim`. U HTML-u se `href` i `src` koji gađaju tu relativnu putanju zamene `blob:` adresom tog teksta. Ista zamena važi za `url()` u CSS-u iz stabla. Putanja koja liči na klijentski fajl, a nije u stablu, dobija prazan blob, ne zahtev ka serveru. Apsolutni `/api/...` se ne dira: ako ga dokument pošalje, to je njegov zahtev, ne zahtev školjke.

Klasičan skript sa `blob:` radi bez modula. Snimak i dalje ubacuje klasične `<script src>`, kako `ugradiPovez` već radi.

### Bez sandboxa

`sandbox` bez `allow-same-origin` pravi tuđe poreklo, pa `fetch("/api/soba")` traži CORS koji server ne šalje. Bez sandboxa, `srcdoc` deli poreklo stranice časa i taj zahtev stiže ako ga dokument ima. Relativne putanje su već zamenjene, pa ne čitaju disk. Školjka ne zove skript iz iframe-a i ne evalira ga u svom prozoru.

### Školjka se skida iz pregleda

Iz `.pregled-okvir` izlaze `#soba-prekidaca` i `#soba-masina`. Ostaju naslov Pregled, tačke, katanac, adresa i `#pregled-osvezi`. Osvežavanje i svaka izmena klijentskog bafera ponovo sklope `srcdoc` i povuku prethodne blob adrese. `fitPanel` više ne pali kontrole sobe. Slušaoci `#prekidac`, `#sledeci`, `#procitaj` i dovod ka displeju školjke se gase. `primeniPrikaz` prestaje da crta sobu i da vraća „delić nije primenjen” za klijentski skript.

### Prazan dokument i serverski tab

Nema `client/index.html` u stablu, ili je tekst prazan: `srcdoc` je prazan dokument. Otvoren serverski fajl ne menja iframe i ne izvršava se. Iframe i dalje drži poslednji sklopljeni klijentski dokument.

## Risks / Trade-offs

- [Svaka izmena sklapa dokument iznova, pa se stanje u stranici (uključen prekidač, skrol) gubi] → Prihvaćeno. Osvežavanje i jeste novo učitavanje. Školjka ne čuva staru cifru.
- [Iframe bez sandboxa vidi `window.parent`] → Skript iz kursa ne treba roditelja. Školjka mu ne prosleđuje API za crtanje sobe.
- [Časovi 5–10 više nemaju dugmad školjke] → Prikaz je samo dokument. Kutija i dalje odgovara na `/api/soba` ako dokument ili adresna traka pošalju zahtev. Predlog ne dodaje te kontrole u kurs.
- [Blob skript nema putanju `js/korak.js` u devtools-u] → Prihvaćeno. Ponašanje je tekst iz editora, ne ime sa diska.

## Migration Plan

Nema migracije podataka. Radne verzije u `localStorage` ostaju. Vraćanje je povratak na crtanje školjke; disk i Node se ne menjaju.
