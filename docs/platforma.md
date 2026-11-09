# Platforma sajta časa

Sajt časa je ljuska za jedan dokument kursa. Tekst tema je `kursevi/web_programiranje/kurs.json`. Ovaj fajl opisuje šta ljuska radi. Nastavni cilj i povezujući primer su u [kurs.md](kurs.md). Raspored zaglavlja, Opcija i oblik lokalnog zapisa su u [izgled-i-lokalno-stanje.md](izgled-i-lokalno-stanje.md).

Ako se ovaj opis i sajt raziđu, važi sajt i testovi. OpenSpec u `openspec/specs/` je ugovor ljuske samo tamo gde se sa njima slaže. Ne drži sadržaj kursa.

## Pokretanje

`npm start` diže Node proces iz `server/server.js`. On servira sajt, čita dokument kursa i, kad postoji `DATABASE_URL`, drži kutiju. Bez te promenljive proces i dalje krene: baza se ne otvara. Pokretanje, port i Docker su u [README](../README.md). Javni pregled bez baze je u [DEPLOY.md](../DEPLOY.md).

## Stranica časa

Stranica se otvara na uvodu. Uvod nije tema: nema korak, pitalicu ni broj teme. Izbor teme otvara njen poslednji otvoren korak.

Na širini većoj od 860 px vide se zaglavlje, traka časa i dve kolone. Levo je spisak tema. Desno je otvorena tema. Desne kartice napretka nema.

Traka časa drži izbor teme, izbor koraka i tabove Gradivo, Diskusija i Editor. Na uvodu se vidi samo izbor teme. Promena koraka ostavlja otvoren tab. Na 860 px i uže traka se ne crta. Tema i korak idu kroz mobilne sheetove.

U glavi časa, izvan Gradiva, stoji birač pune širine kolone: Korak n od N, naslov, krug po koraku, Svi koraci i strelice. Strelica nema reč Sledeći na sebi.

### Gradivo

Gradivo pokazuje tekst koraka, ključnu ideju bez tog natpisa, pa isečak ili crtež ako korak to ima. Kratka pitalica nije na Gradivu. Isečak može da se kopira. Pozadina bloka koda je bela ili crna i važi za sve blokove.

### Diskusija

Diskusija drži kratku pitalicu otvorenog koraka. Pitanje i primer su na ekranu. Odgovori su sakriveni dok se red pitanja ne otvori. Na poslednjem koraku teme, ispod pitalice koraka, stoji diskusija cele teme.

Faze te diskusije idu redom: Izbor, Poređenje, Pretpostavke, Analiza, Ponovni izbor. Do Analize sajt ne otkriva koji odgovor drži. Rezerva je zatvorena dok je nastavnik ne otvori. Glas se ne skuplja sa laptopova i ne pamti se posle učitavanja. Izlazna rečenica poslednjeg koraka nema polje za upis.

### Editor

Editor ima tab Klijent za `client/` i, od teme koja uvodi server, tab Server za `server/`. Stablo raste do otvorenog koraka. Pripremljene kopije nisu u stablu.

Za otvoreni fajl postoje Lekcija i Moj kod. Lekcija je snimak tog fajla na otvorenom koraku i samo se čita. Moj kod je radna verzija u ovom browseru, pod svojim ključem, zajednička za sve korake istog fajla. Reset vraća radnu verziju na snimak otvorenog koraka. Radna verzija nije u zapisu lokalnog stanja i Obriši progres je ne briše.

Pregled je iframe klijentskog stabla. Izmena klijentskog fajla menja iframe i ne piše taj fajl na disk. Dok je Editor otvoren, pregled za fajlove koje proces čita po zahtevu šalje tekst aktivnog prekidača na `POST /api/fajl`. `server/server.js`, `server/stanje.js` i `server/baza.js` se ne pišu iz editora. Proces ih čita kad krene.

## Dokument kursa

Ljuska čita jedan JSON. Naslov teme, koraci, proza, pitalice i ishod dolaze iz njega. Ljuska ne drži drugi primerak tog teksta. `trajanjeTema` mora da bude jednako broju tema. Ako nije, sajt prijavi grešku i ne dodaje niti izbacuje temu.

`?edit=true` uključuje uređivanje na stranici časa. Izmena se upisuje u dokument, a kvačica znači da je `PUT /api/kurs` sačuvao `kursevi/web_programiranje/kurs.json`. Opozovi i ponovi drže lokalnu istoriju te sesije.

`/studio` je posebna strana za isti dokument: lista tema i koraka, dodavanje, redosled, učitavanje drugog JSON-a i čuvanje. Studio poravna trajanje sa brojem tema pre upisa.

## Zaglavlje

Zaglavlje drži ustanovu, sliku i naslov kursa iz dokumenta, pretragu, pomoć, beleške, Opcije i oznaku iz dokumenta.

Pretraga je sklopljena lupa dok nema fokusa ni upita. Placeholder je Nađi pojam, pitanje ili primer koda. Command+K i Ctrl+K je fokusiraju. Izbor pitanja ili isečka otvara korak koji ga sadrži. Izbor pojma pokazuje odrednicu iz `kursevi/web_programiranje/GLOSSARY.md`.

Pomoć je kratko uputstvo i ne otvara editor.

Beleška je obeleživač jednog koraka sa komentarom. Najviše jedna po koraku. Spisak je u zaglavlju. Sačuvaj korak u lekciji je upis beleške, ne ocena.

Opcije drže paletu, veličinu teksta, način korišćenja i lokalno stanje. Način korišćenja je Predavanja ili Samostalni rad. Bira se pri prvom dolasku, a menja u Opcijama.

## Lokalno stanje

Jedan zapis u `localStorage`, ključ `web-programiranje:stanje`. Drži mesto, napredak po temi, podešavanja, paletu i beleške. Napredak raste kad se korak otvori. Load, Save i Obriši progres rade nad tim zapisom. Save preuzima `web-programiranje-stanje.json`. Ništa od toga ne ide na server. Oblik zapisa je u [izgled-i-lokalno-stanje.md](izgled-i-lokalno-stanje.md).

## Rečnik i primeri

`kursevi/web_programiranje/GLOSSARY.md` je rečnik kursa. Sajt ga servira na `/recnik`. Pojam u tekstu časa dobija isprekidanu liniju i oblačić sa istim poljima kao pretraga.

`primeri/` su samostalni primeri u editoru. Svaki podfolder ima `primer.json` sa natpisom. Kontrolna soba nije taj folder. Ona je podrazumevano stablo `client/` i `server/`.

## Kutija

Kutija je Node proces koji panel zove. Čitanje je `GET /api/soba`. Komanda je `PUT /api/ventilator`. Sesija, priključenost, takt, uloge i baza su posebni `POST` putevi. Dovod sobe mašina je `GET /dovod`. Ugovor kutije, statusi i šta displej sme da pokaže opisani su ponašanjem servera i testovima, ne tekstom tema.

Panel sam, van toka časa, otvara se na `/client/index.html`.
