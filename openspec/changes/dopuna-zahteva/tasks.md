# Tasks

## 1. Ugovor koji server već izgovara

- [ ] 1.1 Dodaj test da `GET /api/soba` vraća HTTP/1.1 JSON sa `temperatura` i `ukljucen`, i da `PUT /api/ventilator` sa `{ "ukljucen": true }` vraća samo `{ "ukljucen": true }`. Proveri da `node --test` za taj fajl prođe.
- [ ] 1.2 Dodaj test da telo preko postojeće JSON granice i telo koje nije JSON dobiju HTTP 400, a režim ostane isti. Proveri da test prođe i da loše telo ne uđe u smisao komande.
- [ ] 1.3 Dodaj test da sintaksna greška u serverskom fajlu vrati grešku, ne zameni sačuvani izvor i da sledeći zahtev i dalje koristi prethodni izvor. Proveri da test prođe.
- [ ] 1.4 Dodaj test da oba displeja dobijaju Digital-7 Mono. Proveri da stranica i dalje servira postojeći font.

## 2. Panel koji stiže na kasnijem času

- [ ] 2.1 Od časa 8 prikaži prag upozorenja kao broj pored temperature, bez novog uređaja. Proveri u browseru da časovi 1–7 taj broj ne crtaju, a čas 8 crta.
- [ ] 2.2 Od časa 7 prikaži listu sačuvanih komandi na istom panelu, a povučenu celinu ne ubrajaj. Proveri da uspešan upis doda red, a neuspešna celina ne doda.
- [ ] 2.3 Dodaj isključivanje provere svežine. Uključena provera zadržava noviji trenutak. Isključena dozvoljava da stariji trenutak pregazi noviji. Proveri oba slučaja testom ili u browseru.
- [ ] 2.4 Osvežavanje ikonice ventilatora ne sme da obriše starost temperature. Proveri da dovod sobe mašina pomeri lopatice, a starost očitavanja ostane.
- [ ] 2.5 Od časa 5 čitanje ima čekanje, podatak ili grešku. Čekanje zadržava postojeće crte, cifre ili Err, a drugi klik i dalje radi. Proveri HTTP 200 kao cifre, neuspeh kao Err, i drugi klik dok prvi zahtev traje.
- [ ] 2.6 Izmena uloge uz postojeći ključ u `server/sesija.js` menja status sledeće komande, a vrednost cookie-ja ostaje. Proveri da isti cookie posle čuvanja dobije novi status.

## 3. Sajt časa

- [ ] 3.1 Proveri da Front stablo sadrži `client/index.html`, `client/css/soba.css`, `client/js/korak.js`, `client/js/niz.js`, `client/js/displej.js` i `client/js/prekidac.js`, i da `prepared/` nije u stablu. Dodaj test ako stavka fali.
- [ ] 3.2 Klik na pojam otvara objašnjenje i primer, drugi klik sklapa, a dva pojma ostaju otvorena i posle ponovnog crtanja. Proveri ta tri koraka u browseru.
- [ ] 3.3 Pretraga sužava vidljive pojmove i otvara prvi preostali pogodak. Ako pogodak nije u otvorenom času, otvori taj čas i tamo suzi listu. Proveri oba slučaja.
- [ ] 3.4 Dodaj „Ponovi pitanje” koje sklanja pečat i razloge i vraća neoznačene odgovore. Proveri na kratkoj pitalici i na dugoj diskusiji.
- [ ] 3.5 Pre pitanja prikaži preduslov i ishod. Preduslov časa 1 je rez `client/` i prazan `server/`. Preduslov sledećeg časa je ishod prethodnog. Proveri čas 1 i čas 2.

## 4. Rezerve, izlaz i osvrt

- [ ] 4.1 Usaglasi rezerve časova 1–9 sa pitanjima iz delte `casovi`: CSS, strogo poređenje, funkcija naspram poziva, 404 naspram ugašenog porta, drugi klik, telo van forme, kredencijali, rok ikonice, CORS. Proveri da svaka rezerva ostane skrivena dok se ne otvori i da krene od neoznačenih opcija.
- [ ] 4.2 Čas 10 nema rezervno glasanje. Rečenica o tipu i asistentu ostaje u osvrtu. Izlaz pita gde je pravo, gde je stanje i šta ćutanje ne dokazuje, bez opcija. Proveri da nema drugog skupa opcija.
- [ ] 4.3 Upisi u osvrt imena tema iz delte `casovi` za svih deset časova. Proveri da osvrt nema opcije ni pečat i da nijedno ime ne pokreće alat.

## 5. Prolaz kroz sajt

- [ ] 5.1 Prođi čas 1, čas 5, čas 7, čas 8, čas 9 i čas 10 u browseru: preduslov, rezerva, osvrt, prag, istorija, svežina i uloga ponašaju se kako delta kaže. Zabeleži šta je viđeno.

## Workflow follow-up

- Sync delte u `openspec/specs/` tek kad su zadaci gotovi.
- Arhiviraj `dopuna-zahteva` posle pregleda. Change `kontrolna-soba-kurs` ne diraj ovim zadacima.
