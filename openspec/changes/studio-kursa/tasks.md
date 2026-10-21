# Tasks

## 1. Model dokumenta

- [ ] 1.1 Zadrži `site/js/studio.js` kao jedini model: čitanje JSON-a, poravnanje `trajanjeNedelja` sa brojem nedelja, dodavanje, pomeranje i brisanje nedelje i koraka, vrsta koraka (priča, fajl, figura) i priprema teksta sa uvlačenjem 2 i novim redom. Ne uvodi drugi format. U `test/studio.test.mjs` zadrži prolaz isporučenog `site/kurs.json` bez izmene bajtova, odbijanje neispravnog JSON-a i nedelje bez koraka, poravnanje trajanja 4 na dve nedelje, novu nedelju sa jednim korakom, zabranu brisanja poslednjeg koraka i skidanje putanje pri potvrđenom prelasku na priču. Pokreni `node --test test/studio.test.mjs`.

## 2. Strana

- [ ] 2.1 Zadrži `site/studio.html`, `site/css/studio.css` i `site/js/studio-strana.js`. Strana je na srpskom, lista nedelje i korake i otvara kurs, nedelju ili korak. Učitaj menja samo otvoreni dokument. Preuzmi skida `kurs.json` i ne zove upis. Sačuvaj šalje `PUT /api/kurs` i briše nacrt tek posle HTTP 200. Kucanje ne zove upis. Nacrt je ključ `studio:kurs`. Prelazak vrste koji bi obrisao putanju, isečak ili figuru prvo traži potvrdu. Dodaj `test/studio-strana.test.mjs` koji čita te fajlove i proverava `lang="sr"`, `id="studio"`, natpise Učitaj, Preuzmi i Sačuvaj, `GET /kurs.json`, `PUT /api/kurs`, ime `kurs.json` i ključ `studio:kurs`. Pokreni `node --test test/studio-strana.test.mjs`.

## 3. Upis

- [ ] 3.1 Zadrži `server/kurs.js` i `PUT /api/kurs` u `server/server.js`. `GET /studio` i `GET /studio/` serviraju `site/studio.html`. Telo preko 2 000 000 bajtova, neispravan JSON i dokument koji nije kurs vraćaju HTTP 400 i ne menjaju fajl. Ispravan dokument se piše preko `.kurs-studio.tmp` i `rename`, lepo odštampan, sa novim redom. `KURS_DATOTEKA` i dalje skreće test sa `site/kurs.json`. U `test/studio-server.test.js` zadrži postojeće slučajeve i dodaj: višak polja nedelje ostaje posle upisa, a telo veće od granice vraća 400 i ostavlja fajl. Pokreni `node --test test/studio-server.test.js`.

## 4. Cela provera

- [ ] 4.1 Pokreni `npm test`. Potvrdi da `test/studio.test.mjs`, `test/studio-strana.test.mjs` i `test/studio-server.test.js` prolaze zajedno sa ostalim testovima, i da `casovi`, `sajt-casa`, `pitalice` i `kontrolna-soba` nisu dirani.

## Workflow follow-up

- Sync delte u `openspec/specs/` tek kad su zadaci gotovi, uz arhivu.
