# Tasks

## 1. Dokument kursa

- [ ] 1.1 U `site/kurs.json` ubaci nedelju „Zašto je Web nastao” na položaj 0, podigni `trajanjeNedelja` na 11 i pomeri postojećih deset nedelja za jedno mesto bez menjanja njihovih koraka izgradnje. Sa nedelje „Šta browser prikazuje” skini Web, Internet i Istorija, tako da počinje Podelom. Promenljiva i Calc ostaju odmah posle Spolja. `preduslovPrve` kaže da još nema fajla i da priča počinje pre stranice. Ishod nove nedelje kaže da je Web usluga na Internetu, da je stranica dokument, i da `server/` još nema fajlove. Proveri da `node --test test/model.test.mjs` vidi jedanaest nedelja i da je prvi naslov „Zašto je Web nastao”.
- [ ] 1.2 Na novoj nedelji upiši 20 koraka iz `proposal.md`, redom, bez `putanja`, `isecak` i `delic`. Svaki `tekst` počinje pitanjem. Svaka kratka pitalica ima tačno jednu tačnu opciju. Minuti su oni iz `design.md` i zbir je 90. Hipertekst i TCP i UDP imaju `figura.vrsta` `put`. Dokument ima `linija` sa `pokret: "redom"` i oznakama 1969, 1989, 1995, 2005, 2008 i sledeća nedelja. Ostali koraci nemaju `figura`. Proveri `node --test test/koraci.test.mjs test/figura.test.mjs`: redosled naslova, LO nije Web, TCP nije UDP, predlog nije Java, Ajax ostavlja dokument, Web 3.0 nije novi Internet, a čas stranice i dalje sklapa HTML od Stranice do Semantike.
- [ ] 1.3 Na novoj nedelji upiši diskusiju, rezervu i izlaz iz delte `pitalice`, i `pojmoviCasa` za hipertekst, TCP, UDP, HTML, XML, ECMAScript, Ajax i W3C. Na času stranice vrati minute iz `design.md` tako da zbir ostane 90. Rezerve časova 2–10 ostaju postojeće rezerve, čas 11 i dalje nema rezervno glasanje. Tekst nove nedelje ne sadrži SSE ni WebSocket. Proveri `node --test test/koraci.test.mjs`: zbir minuta obe nedelje je 90, rezerva istorije razlikuje kadar od dokumenta, a izlaz poslednjeg časa i dalje pita za pravo, stanje i ćutanje.

## 2. Panel i tab Server

- [ ] 2.1 U `site/js/radna.js` i `site/js/main.js` podigni pragove časa izgradnje za jedno, kako `design.md` nabraja. `serverTabVidljiv` je tačno od nedelje 5. Nedelja 1 ne crta „24” ni „----”, krije „Sledeći”, log, grafikon i sobu mašina, i ne šalje zahtev sobi. Nedelja 2 i dalje crta 24 bez sobe mašina. Proveri `node --test test/editor.test.mjs`: `serverTabVidljiv(4)` je false, `serverTabVidljiv(5)` je true, a izvor ne veže cifru 24 za nedelju 1.
- [ ] 2.2 Testove koji čas stranice uzimaju kao `nedelje[0]` prebaci na nedelju stranice: `test/figura.test.mjs`, `test/editor-izbor.test.mjs` i indekse u `test/koraci.test.mjs` (`lectures[3]` za Node postaje položaj 5, poslednji čas položaj 11). Korak istorije bez crteža sme da nema `putanja`. Proveri `node --test test/figura.test.mjs test/editor-izbor.test.mjs test/koraci.test.mjs`.

## 3. Cela proba

- [ ] 3.1 Pokreni `node --test test/*.test.js test/*.test.mjs` i dovedi ceo skup do prolaza. Ako padne test koji i dalje broji deset nedelja ili traži Web na času stranice, uskladi ga sa položajima iz delte `casovi`, pa ponovi istu naredbu.

## Workflow follow-up

- Sync delte u `openspec/specs/` tek kad su zadaci gotovi, uz arhivu.
