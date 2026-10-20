# Tasks

## 1. Jedna kolona

- [ ] 1.1 U `site/css/site.css` ostavi `.opcije-mreza` na `grid-template-columns: 1fr` i obriši medijsko pravilo na 861px koje stavlja `1fr 1fr`. U `test/tema.test.mjs` zameni očekivanje tog pravila proverom da široki upit ne menja `.opcije-mreza` u dva stupca. Pokreni `node --test test/tema.test.mjs` i proveri da prolazi.

## 2. Figura

- [ ] 2.1 Dodaj `site/js/figura.js` koji od `figura` pravi SVG: `vrsta: "put"` ređa `cvorovi` po `natpis`, `vrsta: "linija"` ređa `oznake` po `godina` i `natpis`. Natpis koji nije u podatku ne sme da se pojavi. Test neka uveze modul, nacrta Web sa četiri natpisa i istoriju sa pet oznaka, i proveri redosled tekstova.
- [ ] 2.2 U `site/css/site.css` marker puta i ulazak oznaka traju jednom i ne ponavljaju se. U `@media (prefers-reduced-motion: reduce)` marker stoji na kraju puta, a sve oznake su vidljive bez animacije. Postojeće gašenje elise ostaje. Test neka pročita CSS i proveri `iteration-count` ili `animation` sa `1`, i oba gašenja u istom upitu za smanjeno pokretanje.

## 3. Dokument nedelje 1 i čas 10

- [ ] 3.1 U `site/kurs.json` ubaci korake Web, Internet i Istorija ispred Podele. Web ima četiri čvora (Browser, URL, Dokument, Prikaz) bez pokreta i pitalicu čiji tačan odgovor kaže da prikaz nije dokument. Internet dodaje Mreža između URL-a i Dokumenta, `pokret: "jednom"`, i tačan odgovor da Internet i Web nisu isto. Istorija ima oznake 1969, 1983, 1989, 1991 i stranicu kursa dok je `server/` prazan, sa `pokret: "redom"`, i tačan odgovor da mreža paketa iz 1969. nije Web. Nijedan od tri nema `putanja`, `isecak` ni `delic`. Proveri testom da su prva četiri naslova Web, Internet, Istorija, Podela i da tačni odgovori odgovaraju tim rečenicama.
- [ ] 3.2 Podesi minute po tabeli u `design.md` tako da zbir koraka nedelje 1 ostane 90, a broj koraka 20. Proveri da `node --test test/koraci.test.mjs` i dalje vidi zbir 90, i dopuni ga tvrdnjom da nedelja 1 ima 20 koraka.
- [ ] 3.3 Obriši `overview` sa svih nedelja. Korak časa 10 koji se zove Osvrt preimenuj u „Jedna soba” i u `tekst`, ključnoj ideji i opcijama ostavi rečenicu o tipu i predlogu asistenta bez reči „osvrt” i bez drugog glasanja. Korak Izlaz više ne kaže da postoji slobodan upis; tačan odgovor i dalje nema pečat ni opcije, a obrazloženje kaže da nema ni polja. U `test/koraci.test.mjs` zameni test „osvrt imenuje teme” proverom da nijedna nedelja nema `overview` i da nijedan korak nema naslov Osvrt. Rečenicu o tipu traži u koraku „Jedna soba”. Pokreni `node --test test/koraci.test.mjs`.

## 4. Stranica časa

- [ ] 4.1 U `renderLecture` za korak sa `figura` umetni SVG iz `figura.js` posle ključne ideje i nemoj da crtaš isečak, „Fajl:” ni „Već u fajlu”. Korak sa `putanja` ostaje kao dosad. Test neka na učitanom dokumentu kursa pozove crtač za Web i za Podelu i proveri da Web ima SVG sa natpisom Browser i nema `putanja-koraka`, a Podela ima putanju `client/index.html`.
- [ ] 4.2 Ukloni `<details>` Osvrt i `textarea` izlaznog pitanja. `nedelja.izlaz` prikaži kao pasus sa klasom `log` samo kad je otvoren poslednji korak nedelje. `nacrtajDiskusiju` i dalje pravi polja pretpostavki i zaključka. Test neka proveri da poslednji korak nedelje 1 pokazuje rečenicu o dokumentu, prikazu i osvežavanju i da u tom bloku nema `textarea`, a da prvi korak tu rečenicu ne pokazuje. Posebno proveri da faza pretpostavki i dalje ima polje.
- [ ] 4.3 Korak bez `putanja` ne sme da pozove `fileForLecture` niti da otvori `client/css/soba.css`. Prazno stablo i prazan editor traju dok Podela ne uvede `client/index.html`. Izvuci izbor fajla u čistu funkciju i testiraj: Web vraća prazan izbor, Podela vraća `client/index.html`.

## 5. Celina

- [ ] 5.1 Pokreni `npm test`. Ako neki stari test traži dva stupca, `overview` ili naslov Osvrt, uskladi ga sa deltom umesto da vratiš staro ponašanje. Proveri da cela naredba prođe.

## Workflow follow-up

- Sync delte u `openspec/specs/` tek kad su zadaci gotovi, uz arhivu.
