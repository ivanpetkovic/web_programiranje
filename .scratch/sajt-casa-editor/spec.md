Status: ready-for-agent

## Problem Statement

Nastavnik hoće da umesto slajdova vodi čas na sajtu, da klik na pojam otvori objašnjenje i kod, i da u editoru kuca i front i server. Front treba odmah da promeni Kontrolnu sobu. Server treba da bude pravi proces, vidljiv u DevTools panelu Network. Dva odvojena programa, sajt i „prava” soba, razišla bi se posle prve izmene.

## Solution

Sajt časa je jedan tok od deset časova sa ugrađenom Kontrolnom sobom. Korak časa pokazuje problem, neoznačene odgovore, razloge, pojmove i editor. Editor časa otvara isečak koji već radi. Izmena fronta, HTML, CSS ili JS u browseru, odmah menja panel. Izmena servera ostaje tekst dok se lokalni Node ponovo ne učita; sledeći zahtev panela koristi novi handler.

Panel je isti kroz kurs: jedna prostorija, jedno očitavanje, jedan ventilator. Lopatice se vrte CSS transformacijom. Do četvrtog časa nema API zahteva. Od četvrtog, čitanje sobe i kasnije komanda željenog stanja jesu HTTP/1.1 prema tom Node procesu.

## User Stories

1. Kao nastavnik, hoću uvod sa živim panelom, da lopatice i temperatura budu vidljive pre prvog pitanja.
2. Kao nastavnik, hoću listu deset časova koja ostaje na dohvat, da pređem na čas bez traženja slajda.
3. Kao student, hoću da čas stane na preduslov i ishod pre pitanja, da znam šta je već uvedeno.
4. Kao student, hoću opcije pitalice bez označene tačne, da biram pre razloga.
5. Kao nastavnik, hoću da posle izbora vidim razlog svake opcije, da i pogrešan izbor dobije obrazloženje.
6. Kao nastavnik, hoću da pitalicu vratim na neoznačeno, da je ista grupa prođe još jednom.
7. Kao student, hoću da klik na pojam otvori objašnjenje i primer koda, i da drugi klik sklopi stavku.
8. Kao student, hoću da otvorim više pojmova odjednom, da uporedim primer sa panelom.
9. Kao nastavnik, hoću pretragu pojmova, da sa „CORS” ili „const” dođem na stavku i otvorim je.
10. Kao nastavnik, hoću editor označen slojem, front ili server, da bude jasno šta se izvršava gde.
11. Kao nastavnik, hoću isečak koji na otvaranju već radi, da čas ne počinje od praznog fajla.
12. Kao nastavnik, hoću da vratim isečak na pripremljenu verziju, da pokvarena izmena ne pojede ostatak časa.
13. Kao nastavnik, hoću da izmena CSS transformacije odmah promeni kako se lopatice vrte, da animacija prati kod.
14. Kao nastavnik, hoću da izmena funkcije sledećeg koraka promeni naredno lokalno stanje, da pravilo vidim na panelu ili u konzoli tog časa.
15. Kao nastavnik, hoću da izmena crtanja promeni tekst temperature i režim lopatica, da objekat i ekran ostanu razdvojeni dok crtanje ne pozovem.
16. Kao nastavnik, hoću da greška u front isečku stane pored editora, a da panel zadrži poslednje ispravno stanje.
17. Kao nastavnik, hoću da serverski isečak vidim na sajtu, a da ga izvršava lokalni Node, da DevTools vidi zahtev.
18. Kao nastavnik, hoću da „učitaj handler” ponovo pokrene taj proces, da sledeći zahtev panela koristi novi kod.
19. Kao nastavnik, hoću da sintaksna greška handlera ostane vidljiva i da panel javi da odgovora nema, umesto da sajt ćuti.
20. Kao nastavnik, hoću na časovima 1–3 nula redova API-ja sobe u Network panelu, da lokalna izmena nije lažni protokol.
21. Kao nastavnik, hoću od četvrtog časa red sa metodom, putanjom, statusom, zaglavljima, JSON telom, vremenom i protokolom HTTP/1.1.
22. Kao nastavnik, hoću da čitanje sobe prvo otvorim kao adresu u browseru, pre nego što panel krene da ga zove iz koda.
23. Kao student, hoću da lopatice stanu ili se vrte prema režimu koji prikaz trenutno crta, da pokret nije nepovezana dekoracija.
24. Kao student, hoću smanjenje pokreta ako sistem to traži, da čas ostane čitljiv bez stalne animacije.
25. Kao student, hoću da kroz panel prođem tastaturom, da fokus na „Sledeći korak” i na pojmove bude vidljiv.
26. Kao nastavnik, hoću da forma na panelu ne osveži dokument, da prikazano stanje preživi submit.
27. Kao nastavnik, hoću da uloga posmatrača i operatera bude izbor pripremljene sesije, da komanda padne ili prođe bez login forme.
28. Kao nastavnik, hoću da isti fajlovi posle časa ostanu pokretni van sajta časa, prvo samo front, zatim front i Node.
29. Kao nastavnik, hoću da osvrt stoji sklopljen ispod časa, da pregledna tema ne prekine pitalicu.

## Implementation Decisions

- Sajt časa je statičan tok koraka. Kontrolna soba nije drugi program ugrađen slikom; panel je deo stranice i deli stanje sa editorom fronta.
- Čas u navigaciji vodi na svoj korak. Korak prikazuje preduslov, ishod, panel, pitalicu, pojmove, editor i osvrt, tim redom.
- Pitalica prikazuje sve opcije bez pečata. Izbor studenta ili radnja „pokaži razloge” otvara razlog svake opcije i označava koja drži. „Ponovi pitanje” sklanja pečate i razloge.
- Pojam je stavka sa imenom i jednom rečenicom. Otvorena stavka pokazuje objašnjenje i primer. Više stavki sme da bude otvoreno. Pretraga sužava stavke i otvara prvi pogodak.
- Editor časa ima sloj „front” ili „server”, pripremljeni isečak, radnju za povratak na taj isečak i mesto za grešku.
- Front sloj pokriva dokument panela, stil lopatica i browser JS stanja i crtanja. Posle izmene, panel se ponovo crta iz tog isečka. Poslednje ispravno stanje ostaje ako isečak baci grešku.
- Transformacija i animacija lopatica dolaze iz stila. Promena trajanja, smera ili ugla vidljiva je bez učitavanja stranice. Režim koji prikaz crta određuje da li se vrte i koliko brzo, čim čas 3 uvede crtanje. Pre toga, stil sam vrti lopatice.
- „Sledeći korak” postoji dok simulacija temperature živi u browseru. Uvek uveća temperaturu za deltu i ne gleda prekidač. Broj na ekranu menja se tek kad postoji crtanje.
- Serverski sloj ne izvršava handler u browseru. Isečak je izvor lokalnog Node procesa koji sluša poznat port i govori HTTP/1.1, bez web framework-a. Radnja „učitaj handler” ponovo pokreće taj proces. Sledeći zahtev panela ide na novi proces.
- Ako se proces ne podigne, panel to kaže uz editor, a Network nema uspešan status tog zahteva.
- Do četvrtog časa panel ne šalje čitanje sobe ni komandu. Network i dalje sme da pokaže dokument i stil sajta.
- Od četvrtog časa čitanje sobe vraća temperaturu i režim i piše samo displej sobe prekidača. Displej sobe mašina dobija trenutnu temperaturu i režim jednosmernim pushom sa kutije. Čas taj dovod ne imenuje. Isečak časa 4 upisuje cifre na uspeh i nema granu Err. Čas 5 otvara front isečak u kome ta grana već upisuje Err, i za status koji nije uspeh i za izostanak odgovora. Nastavnik liniju vidi i može da je izmeni. Dok zahtev traje, displej sobe prekidača zadržava prethodne crte, cifre ili Err. Dugme „Pročitaj” šalje jedno čitanje i ostaje i kad osmi čas doda prekidač za periodično čitanje. Taj prekidač na uključivanje odmah pošalje jedno čitanje, pa ga ponavlja. Od šestog, komanda šalje željeno stanje, a uspešan odgovor vraća samo režim. Od osmog, čitanje nosi i trenutak očitavanja. Od devetog, ista komanda zavisi od pripremljene sesije u cookie-ju. Od sedmog, režim i istorija žive u PostgreSQL-u, a povezani upisi su jedna celina.
- Odgovor čitanja i komande je JSON tekst. Panel pravi vrednost tek čitanjem tog teksta.
- Sesija je izbor „posmatrač” ili „operater” na panelu devetog časa. Nema polja za nalog. Sakriveno dugme ne uklanja mogućnost da se komanda pošalje.
- Greške fronta i servera ne dele istu rečenicu. Front kaže da isečak nije primenjen. Server kaže da odgovora nema ili da je status neuspeh.
- Smanjeno pokretanje ostavlja lopatice u položaju koji i dalje pokazuje režim, bez beskonačne rotacije. Fokus je vidljiv. Pojam i opcija pitalice rade sa tastature.
- Isečci koje editor otvara jesu izvor koji se može pokrenuti i van toka časa: front sam, a od četvrtog časa front zajedno sa Node procesom.
- Osvrt je sklopljen spisak preglednih tema tog časa. Ne otvara editor i ne šalje zahtev.

## Testing Decisions

Jedan šav: sajt časa otvoren u browseru, sa lokalnim Node procesom tek kad je čas uveo server. Test gleda šta nastavnik vidi i šta Network zabeleži.

Vredi proveriti, redom: lopatice se vrte dok je režim uključen i stoje dok je isključen; izbor opcije ne otvara razloge; drugi klik na pojam sklapa primer; CSS izmena menja okretanje; loš front isečak ostavlja prethodni broj i pokazuje grešku; čas 2 ne pravi API red; čas 4 posle učitavanja handlera pokazuje HTTP/1.1 za čitanje sobe; ugašen proces ostavlja zahtev bez statusa tog servera; povratak isečka vraća poznato ponašanje; posmatrač ne menja režim, operater menja; smanjeno pokretanje ne vrti lopatice beskonačno.

Ne vredi vezati test za ime klase editora ni za tačan matrix transformacije. Dovoljno je da se ugao ili brzina vidljivo promene i da režim na ekranu odgovara poslednjem ispravnom crtanju. Nema postojećeg testa ovog sajta u repozitorijumu.

## Out of Scope

- Izvršavanje Node handlera unutar stranice.
- Prazan projekat, stablo svih fajlova i slobodno pisanie aplikacije od nule na času.
- Čuvanje studentskog rešenja, nalog nastavnika i bodovanje pitalice.
- Login forma, lozinka i prijava preko treće strane.
- Drugi panel, druga prostorija i drugi ventilator.
- Automatsko ocenjivanje preglednih tema.
- Hot reload koji primenjuje serverski isečak pre izričite radnje „učitaj handler”.

## Further Notes

Sadržaj svakog časa stoji u specifikaciji časova. Zajednički ugovor panela stoji u specifikaciji Kontrolne sobe. Faze diskusije na pitalici stoje u specifikaciji pitalica. Ovaj dokument je kako sajt i editor sprovode panel i kod.
