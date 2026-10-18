# Tasks

## 1. Koraci u sadržaju časa

- [x] 1.1 Proširiti zapis časa u `site/js/lectures.js` tako da svaki čas ima naslov i niz od 10 do 20 koraka, a svaki korak primer, kratku pitalicu, objašnjenje, putanju fajla i delić. Proveriti da učitavanje modula vrati deset časova i da nijedan niz nije kraći od 10 ni duži od 20.
- [x] 1.2 U `site/js/main.js` crtati otvoreni korak tim redom, sa putanjom fajla, i prelaz na sledeći korak koji taj delić već vidi kao ukucan. Proveriti u browseru da objašnjenje nije vidljivo pre kratke pitalice.
- [x] 1.3 Sakriti `#fan-local` i ne crtati lopatice u sobi prekidača ni na jednom času. Proveriti na času 1 da je vidljiva samo soba prekidača i da Network nema `GET /api/soba`.

## 2. Časovi pre servera

- [x] 2.1 Napisati korake časa 1 tako da temperatura 24 stoji u `client/index.html`, osvežavanje vraća dokument, i da nema pokretanja Node-a. Proveriti da primer, pitalica i delić postoje i da sajt i dalje otvara `client/index.html` u stablu Front.
- [x] 2.2 Napisati korake časa 2 za objekat, `const`, deltu koja ignoriše prekidač, i `filter`/`map`/`reduce` u konzoli bez crtanja. Proveriti da poziv sledećeg koraka digne broj u konzoli i ostavi cifru na ekranu.
- [x] 2.3 Napisati korake časa 3 za klik, stanje, posebno crtanje, klase displeja i prekidača, i sinhroni closure bez tajmera. Proveriti da izmena objekta bez crtanja ostavlja stari broj na ekranu.

## 3. Server, greška i komanda

- [x] 3.1 Napisati korake časa 4 redom: naivan prenos, TCP, HTTP, pa `http.createServer`, `listen`, `node server/server.js`, adresa, ruta, i tek onda soba mašina. Proveriti da je čitanje otvoreno kao adresa pre bilo kog `fetch` u tim koracima.
- [x] 3.2 Od časa 4 pokazati ventilator samo u `#soba-masina`, sa lopaticama koje se vrte samo dok je udaljeni režim uključen. Proveriti da čas 4 nema granu Err i da neuspeh ostavlja crte.
- [x] 3.3 Napisati korake časa 5 za HTTP 200, HTTP 500 izvučenog ventilatora, Err na završen neuspeh, i razliku od ugašenog procesa. Proveriti u Network panelu status 500 naspram zahteva bez statusa.
- [x] 3.4 Napisati korake časa 6 za `PUT /api/ventilator` sa tačno jednim poljem `ukljucen`, HTTP 400 za telo koje nije taj oblik, i razliku postavljanja od prebacivanja. Proveriti da uspešan odgovor nema temperaturu i da je displej sobe prekidača ne menja.

## 4. Baza, svežina, uloga i ćutanje

- [x] 4.1 Napisati korake časa 7 za parametrizovan upit, jednu celinu režima i istorije, i razliku restarta procesa od brisanja skladišta. Proveriti da posle uspele celine restart samo Node procesa vrati isti režim.
- [x] 4.2 Napisati korake časa 8 za trenutak očitavanja, starost, periodično čitanje koje odmah pošalje jedno čitanje, i odbacivanje starijeg trenutka. Proveriti da sporiji stariji odgovor ne pregazi noviji dok je provera uključena.
- [x] 4.3 Napisati korake časa 9 za HttpOnly cookie, 401, 403, 400 i 500 tim redom, i za komandu mimo sakrivenog dugmeta. Proveriti da posmatrač dobije 403, a operater 200 sa samo režimom.
- [x] 4.4 Napisati korake časa 10 za jedan zahtev kroz browser, Node, bazu i log, i za zaključak da izostanak odgovora ne dokazuje upis. Proveriti da tekst časa ne tvrdi da je upis prošao kad odgovor nije stigao.

## 5. Pitalice

- [x] 5.1 Kratku pitalicu svakog koraka ostaviti neoznačenu dok se objašnjenje ne otvori, bez faza table. Proveriti na jednom koraku da nijedna opcija nije pečatirana pre otvaranja.
- [x] 5.2 Dugu pitalicu časa voditi kroz izbor, poređenje, pretpostavke, analizu, ponovni izbor i rezervu koju otvara samo nastavnik. Proveriti da razlozi ostanu zatvoreni tokom izbora i da analiza ostavi zapis pogrešne pretpostavke.
- [x] 5.3 Vezaati glavnu pitalicu svakog časa za kontraprimer iz specifikacije `pitalice`, uključujući čas 1 (osvežavanje vraća 24) i čas 10 (ćutanje nije dokaz). Proveriti da sajt ne pamti glas i da nema tajmer.

## 6. Prolaz kroz sajt

- [x] 6.1 Proći čas 1 do časa 10 u browseru na istom panelu: čas 1 bez API reda, čas 4 sa HTTP/1.1, čas 5 sa 500, čas 7 sa sačuvanim režimom, čas 9 sa odbijenim posmatračem. Zapisati šta je viđeno za svaki od tih časova.
- [x] 6.2 Proveriti tastaturu na pojmu i opciji pitalice, vidljiv fokus, i smanjeno pokretanje koje ostavlja lopatice u položaju režima bez beskonačne rotacije. Proveriti i uski i širok prozor.
