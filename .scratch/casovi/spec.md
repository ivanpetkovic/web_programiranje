Status: ready-for-agent

## Problem Statement

Zajednički ugovor opisuje jednu Kontrolnu sobu, ali ne i šta se na kom času sme da vidi, šta nastavnik menja u editoru i koji zaključak pitalica proverava. Bez toga sajt časa može da uvede server pre DOM-a, ili da ostavi čas kao pasivan tekst.

## Solution

Deset časova ide istim panelom. Svaki čas ima preduslov, ishod, osećaj panela na ulazu i izlazu, jedan editor sa jednom izmenom, dve pitalice sa razlogom za svaku opciju, pojmove koji se otvaraju u objašnjenje i primer, jednu promenu uslova i kratak osvrt. Pregledna tema se imenuje i ne ugrađuje.

Časovi 1–3 ostaju u browseru. Od četvrtog, panel šalje pravi HTTP zahtev lokalnom Node procesu. Baza, svežina i uloge dolaze kao novi podatak na isti ventilator, ne kao novi uređaj.

## User Stories

1. Kao nastavnik, hoću da svaki čas navede preduslov i ishod, da vidim da li grupa sme da uđe u pitanje.
2. Kao student, hoću da pitalica koristi samo već pokazani pojam, da odgovor ne zavisi od sledećeg časa.
3. Kao nastavnik, hoću prvo neoznačene opcije, pa razlog za svaku, da diskusija ide pre pečata „tačno”.
4. Kao nastavnik, hoću jednu promenu uslova posle razloga, da isti panel proveri zaključak drugi put.
5. Kao nastavnik, hoću pojmove časa kao otvarajuće stavke sa primerom, da definicija i kod stoje uz pitanje.
6. Kao nastavnik, hoću pregledne teme kao kratak osvrt bez nove pitalice za svaki naziv, da čas ne nabubri.
7. Kao student, hoću na prvom času statičan broj 24 °C i lopatice iz HTML-a i CSS-a, da razlikujem dokument, prikaz i merenje.
8. Kao nastavnik, hoću na prvom času da izmena trajanja animacije ubrza ili uspori lopatice, da transformacija bude vidljiva pre JavaScripta.
9. Kao student, hoću da promena „24 °C” u „10 °C” u alatima browsera ne menja ni dokument ni merenje, da osvežavanje vrati 24.
10. Kao student, hoću da stranica ostane čitljiva kad CSS ne stigne, da sadržaj ne zavisi od izgleda.
11. Kao nastavnik, hoću na prvom času u Network panelu redove za dokument i stil, bez reda API-ja sobe.
12. Kao nastavnik, hoću na prvom času osvrt na Internet i Web, put od URL-a do prikaza, semantički HTML, pristupačnost i ulogu skice, da to ostane mapa.
13. Kao student, hoću na drugom času objekat sa temperaturom i režimom, da čitam sinhron program pre DOM-a.
14. Kao nastavnik, hoću da izmena delte u funkciji sledećeg koraka promeni narednu temperaturu u konzoli, a da ekran još ne prati objekat.
15. Kao student, hoću da `const` dozvoli izmenu polja i zabrani novu dodelu imena, da ime ne mešam sa objektom.
16. Kao student, hoću da dve promenljive nad istim objektom vide istu izmenu temperature, da dodela nije kopija.
17. Kao nastavnik, hoću na drugom času osvrt na dinamičke tipove, mesto TypeScript provere, JS okruženja i poređenje dve verzije iste funkcije, da Git ostane ilustracija.
18. Kao student, hoću na trećem času put klik, handler, stanje, pa crtanje, da objekat sam ne menja tekst.
19. Kao nastavnik, hoću da prosleđena funkcija sačeka klik, a poziv sa zagradama odradi se odmah, da te dve linije uporedim na panelu.
20. Kao nastavnik, hoću sinhroni closure koji pamti prag, bez tajmera, da unutrašnja funkcija vidi spoljašnje ime pre događaja.
21. Kao student, hoću da lopatice na trećem času prate lokalni režim tek kad kod nacrta prikaz, da transformacija zavisi od tog crtanja.
22. Kao nastavnik, hoću raspored panela kroz Flexbox ili Grid, fokus i tastaturu, i formu čiji submit ne osvežava stranicu.
23. Kao nastavnik, hoću na trećem času osvrt na responsive prikaz, jedinice, animacije, ikonice, pristupačne forme, klase i `this`, pa komponente uz React, bez pitalice o JSX-u.
24. Kao student, hoću na četvrtom času da prvo otvorim čitanje sobe direktno u browseru, pre `fetch`-a, da vidim telo odgovora.
25. Kao nastavnik, hoću da handler u Node-u vrati temperaturu i režim iz memorije, a da poziv DOM-a na serveru ne uspe.
26. Kao student, hoću da nepostojeća putanja dobije 404, a ugašen port nijedan HTTP status, da te dve tišine razlikujem u Network panelu.
27. Kao nastavnik, hoću da kolona Protocol na tom zahtevu pokaže HTTP/1.1, da ugrađeni HTTP bude vidljiv.
28. Kao nastavnik, hoću na četvrtom času osvrt na IP, TCP, UDP, TLS, verzije HTTP-a, XML, SOAP, RPC, gRPC, GraphQL, Express i middleware, kao mapu odgovornosti.
29. Kao student, hoću na petom času dugme koje učitava temperaturu i ekran u jednom od stanja: čekanje, podatak ili greška.
30. Kao student, hoću da HTTP 500 ostane odgovor koji proveravam preko statusa, a da mrežni pad i loš JSON idu drugim tokom.
31. Kao student, hoću da tokom čekanja mogu da kliknem drugo dugme, da `await` ne zaustavlja ceo browser.
32. Kao nastavnik, hoću na petom času osvrt na spoljni API, timeout, prekid zahteva, `Promise.all`, call stack i postojanje redova, bez kviza redosleda microtaskova.
33. Kao nastavnik, hoću na šestom času komandu koja postavlja ventilator na uključeno, da drugi put ostavi isti željeni efekat.
34. Kao student, hoću da komanda koja samo prebacuje režim drugi put poništi prvi efekat, da ponavljanje zavisi od smisla.
35. Kao student, hoću da server odbije tekst ili nepoznato polje iako forma nudi samo dve vrednosti, da granica poverenja bude telo zahteva.
36. Kao nastavnik, hoću pripremljeno čitanje tela sa granicom veličine i odbijanjem neispravnog JSON-a, da parsiranje ne bude skriveno.
37. Kao nastavnik, hoću na šestom času osvrt na REST, stateless obradu, optimistički prikaz i razliku prihvaćene komande od potvrde fizičkog uređaja.
38. Kao student, hoću na sedmom času da posle restarta Node-a režim ventilatora ostane ako je upis u bazu prošao.
39. Kao student, hoću da neuspeo upis istorije poništi i izmenu režima kad su u jednoj celini, da dva upita nisu sami po sebi atomski.
40. Kao student, hoću da browser ne dobije kredencijale baze, da tajna ostane na serveru.
41. Kao nastavnik, hoću da razlikujem restart procesa, uklanjanje kontejnera i brisanje trajnog skladišta na pripremljenom PostgreSQL-u.
42. Kao nastavnik, hoću na sedmom času osvrt na dokumentni model i na VM naspram kontejnera, bez administracije baze.
43. Kao student, hoću na osmom času vreme uz broj 24 °C, da znam da gledam poslednje očitavanje.
44. Kao nastavnik, hoću da sporiji, ranije meren odgovor ne pregazi noviji prikaz kad je provera uključena, i da ga pregazi kad je isključim.
45. Kao student, hoću različitu svežinu za ikonicu ventilatora i za temperaturu, da keš zavisi od posledice.
46. Kao nastavnik, hoću na osmom času periodično čitanje displeja, polling, i osvrt na SSE, WebSocket, History API, SPA, React hooks, storage, PWA i offline, bez izrade tih ostalih.
47. Kao nastavnik, hoću na devetom času dve pripremljene sesije, posmatrač i operater, da ista komanda jednom padne a jednom prođe.
48. Kao student, hoću da sakriveno dugme posmatrača ne zaustavi zahtev poslat mimo ekrana, da ovlašćenje proveri server.
49. Kao student, hoću da alat van browsera pročita odgovor koji JS sa drugog origin-a ne sme, da CORS ne mešam sa identitetom.
50. Kao nastavnik, hoću na devetom času osvrt na prijavu preko treće strane, tokene, XSS, SQL injection, CSRF, HTTPS i mrežne napade, kroz razlikovanje problema na ovom panelu.
51. Kao student, hoću na desetom času da ekran može da kaže „uključeno” dok odgovor komande nije stigao, a da iz toga ne znam da li je upis prošao.
52. Kao nastavnik, hoću tragove redom: log, ponovno čitanje sobe, pa odluka o ponavljanju prema smislu komande.
53. Kao student, hoću da tip i poreklo koda, uključujući predlog asistenta, ne dokazuju proveru uloge operatera.
54. Kao nastavnik, hoću na desetom času osvrt na proxy, CDN, cloud, Kubernetes, serverless, mesto nastanka HTML-a, logove, CI i blockchain, uz jedan zahtev koji već postoji.
55. Kao student, hoću na kraju da zapišem gde se proverava pravo, gde stoji stanje i šta ćutanje odgovora ne dokazuje.

## Implementation Decisions

Zajednički ritam svakog časa na sajtu: osećaj panela, kratke osnove kroz pojmove, editor sa jednom izmenom, glavna pitalica, razlozi svih opcija, jedna promena uslova, rezervna pitalica ako je prva razjašnjena, pa osvrt. Trajanje iz plana časa ostaje nastavni budžet, ne tajmer u sajtu.

Panel na početku kursa ima jednu prostoriju, jedno očitavanje i jedan ventilator. Novi čas ne dodaje uređaj.

### Čas 1 — Šta browser prikazuje

Ishod je razlikovanje dokumenta, prikaza i komunikacije. Na ekranu je samo soba prekidača. Temperatura je statičan sadržaj dokumenta. Soba mašina se ne crta.

Editor menja stil sobe prekidača, na primer okvir ili razmak. Osvežavanje vraća dokument.

Pitalica: u alatima browsera „24 °C” postane „10 °C”. Tačno je da je promenjen lokalni prikaz. Nisu promenjeni ni merenje, ni dokument, ni oba samo zato što ekran tako piše. Jedna promena: osvežavanje vraća dokument sa 24 °C.

Rezervna pitalica: HTML je stigao, CSS nije. Tačno je da sadržaj može ostati vidljiv bez očekivanog izgleda.

Network na ovom času pokazuje zahtev za dokument i zahtev za stil. Nema zahteva za API sobe. Metod i zaglavlja se ne proveravaju kao gradivo.

Pojmovi koji se otvaraju: prikaz, dokument, HTML, CSS sobe prekidača.

Osvrt: Internet naspram Weba, put od URL-a do prikaza, semantički HTML, osnovna pristupačnost, skica interfejsa. DNS i TLS ostaju orijentacija.

### Čas 2 — JavaScript opisuje stanje

Ishod je čitanje malog sinhronog programa. Objekat drži temperaturu i željeno stanje prekidača. Funkcija sledećeg koraka uvek uveća temperaturu za deltu. Režim ventilatora ne ulazi u tu računicu. Vrednosti se prate u konzoli. DOM se ne vezuje.

Editor menja deltu. Sledeći poziv u konzoli daje višu temperaturu i kad je prekidač na uključeno. Ekranski broj ostaje dok ga čas 3 ne nacrta.

Pitalica: objekat je u `const`, a druga promenljiva pokazuje na njega. Tačno je da polje sme da se menja i da druga promenljiva vidi istu izmenu. `const` ne zamrzava objekat, `let` nije uslov za izmenu polja, a drugo ime ne pravi kopiju.

Rezervna provera, ako prva prođe brzo, jeste strogo poređenje broja i teksta temperature. Jedna promena: kopija polja u novi objekat više ne prati izmenu.

Pojmovi: `const`, referenca, strogo poređenje, funkcija kao vrednost. Obična i arrow funkcija su obe pokazane pre kasnije upotrebe. Leksički scope jednim sinhronim pozivom.

Osvrt: dinamički tipovi i gde bi TS stao, razlika JS okruženja, dve verzije iste funkcije kao slika saradnje.

### Čas 3 — Događaji povezuju korisnika

Ishod je put klik, handler, stanje, prikaz. „Sledeći korak” menja temperaturu u objektu, a poseban kod crta broj. Prekidač menja željeno stanje u objektu, a crtanje pomera sam prekidač. Soba mašina još nije na ekranu. Forma na panelu ne sme da osveži dokument; submit se zaustavlja. Raspored je Flexbox ili Grid. Fokus stiže i sa tastature.

Closure je sinhrona funkcija koja vrati funkciju i pamti prag. Tajmer nije deo tog primera.

Editor menja da li listener dobija funkciju ili rezultat njenog trenutnog poziva. Jedna promena: izostanak crtanja ostavlja novi broj u stanju i star na ekranu.

Pitalica: menjanje objekta menja tekst na stranici samo ako postoji kod koji ažurira prikaz. Nikad nije „uvek”, a `const` ne crta sam.

Rezervna pitalica: listener sa funkcijom čeka klik; listener sa pozivom dobija povratnu vrednost i klik nema šta da zove.

Pojmovi: DOM, handler, closure.

Osvrt: responsive prikaz, jedinice, pozicija, animacija, ikonica, pristupačna forma, klase i zavisnost `this` od poziva, komponenta kao razlog biblioteke za prikaz. Bez pitalice o `this` ili JSX-u.

### Čas 4 — Od naivnog prenosa do HTTP-a, pa Node

Ishod je praćenje jednog zahteva i odgovora. Pre crteža servera i sobe mašina grupa prolazi komunikaciju redom.

Naivan prenos: soba prekidača šalje jednu celu poruku i pretpostavlja da stiže cela i redom. Onda ta pretpostavka padne: poruka se izgubi, ili dve polovine zamene redosled. Popravka bez imena: delovi, redni brojevi, potvrda prijema. Tek tada se imenuje TCP, pouzdan tok bajtova. Segmentacija TCP-a nije IP fragmentacija. Tok bajtova i dalje ne znači „uključi ventilator”. Tada se imenuje HTTP: metod, putanja, zaglavlja, telo, status.

Posle toga se crtaju kutija i soba mašina i pokazuje Node. Ventilator je priključen na kutiju. Zahtev se vidi kako ide od prekidača do kutije, pa kablom do ventilatora samo ako je priključen. Lopatice se vrte CSS transformacijom samo dok je udaljeni režim uključen. Časovi 1–3 nemaju taj crtež. Čitanje sobe se prvo otvara direktno u browseru, bez `fetch`-a. Isti zahtev se vidi u logu procesa i u Network panelu, sa protokolom HTTP/1.1. Podaci su u memoriji procesa. JSON u telu je tekst, ne JS objekat. Od ovog časa server drži temperaturu. Dugme „Sledeći korak” više nije izvor te vrednosti. Displej pokazuje crte dok prvo čitanje ne uspe, pa cifre tog očitavanja. Isečak časa 4 još nema granu koja piše Err, pa neuspeh ostavlja crte. Dugme „Pročitaj” šalje jedno čitanje.

Editor menja granu handlera: poznata putanja vraća temperaturu i režim, ostale putanje vraćaju 404. Jedna promena: proces se ugasi i novi zahtev nema HTTP status.

Pitalica: handler ne može da ugasi dugme preko DOM-a. Tačno je da server vrati podatak ili dokument, a browser menja prikaz kad obradi odgovor. Poreklo zahteva ne premešta DOM na server.

Rezervna pitalica: putanja koje nema i ugašen port nisu ista greška.

Pojmovi: HTTP zahtev, status, JSON, port.

Osvrt, posle već izgrađenog TCP-a i HTTP-a: IP, UDP, TLS, HTTP/2, HTTP/3, XML, SOAP, RPC, gRPC, GraphQL, Express i middleware. TCP i smisao HTTP zahteva nisu više uvod u ovom osvrtu.

### Čas 5 — Čekanje i neuspeh

Ishod je razlika sinhronog toka, čekanja i vrste greške. Dugme učitava temperaturu. Ekran je u čekanju, ima podatak, ili ima grešku. Glavni kontrast je HTTP 200 naspram HTTP 500. Pripremljeni 500 jeste ventilator koji nije priključen: odgovor stiže, status je 500, displej sobe prekidača piše Err. Uspeh je HTTP 200 sa temperaturom i režimom, i displej upisuje cifre. Spor odgovor ostaje rezerva ako ostane vremena.

Editor menja proveru statusa. Jedna promena: umesto HTTP 500 jer ventilator nije priključen, proces se ugasi i tok više nema odgovor. Čas otvara front isečak u kome linija već piše Err i za status koji nije uspeh i za izostanak odgovora. Nastavnik tu liniju vidi i može da je izmeni. Network i dalje razlikuje status 500 od zahteva bez statusa.

Pitalica: 500 ne vodi samo po sebi u `catch`. Odgovor postoji; uspeh se čita iz statusa. Ugašen server nije taj odgovor. `await` zaustavlja tu funkciju, ne ceo browser, pa drugi klik i dalje važi.

Kad `await` već postoji, u isti Node proces ulazi takt: `setInterval` u fajlu koji se kuca na času. Do tada kutija drži temperaturu mirnu. Takt diže temperaturu dok je režim isključen, a spušta je dok je uključen. Nepriključen ventilator ostavlja režim isključen, pa temperatura i dalje raste iako prekidač stoji na „uključi”. Soba mašina pokazuje temperaturu koju takt menja. Čitanje tada vraća HTTP 500 i displej sobe prekidača piše Err. Posle HTTP 200 displej čuva poslednje cifre dok browser ponovo ne pročita kutiju.

Pojmovi: `fetch`, `response.ok`, `await`, takt.

Osvrt: spoljni API, timeout, prekid jednog zahteva, više zahteva odjednom, call stack i postojanje task i microtask redova. Nema kviza redosleda izvršavanja. Konkurentnost i paralelizam se razlikuju u jednoj rečenici.

### Čas 6 — Komande i ponavljanje

Ishod je željeno stanje, validacija i smisao ponavljanja. Komanda postavlja ventilator na uključeno i šalje telo sa boolean vrednošću. Server proverava unos, menja režim u memoriji i vraća rezultat. Pomoćni kod za telo ima granicu veličine i odbija neispravan JSON.

Editor menja smisao komande između postavljanja na uključeno i prebacivanja režima. Dva slanja pokazuju različit ishod. Jedna promena: telo mimo forme, sa tekstom umesto boolean vrednosti, dobija HTTP 400. Telo tog odgovora nije režim. Uspešan odgovor komande nosi samo režim i pomera kabl. Temperatura nije u tom telu. Komanda koja traži uključenje dok ventilator nije priključen dobija HTTP 500: prekidač može da ostane upaljen, kabla nema, lopatice se ne vrte. Displej temperature menja samo čitanje.

Pitalica: bezbednije je ponoviti postavljanje na uključeno. Prebacivanje drugi put poništava efekat. Status 200 ne znači da ponavljanje ima isti efekat. Forma ne sprečava drugačije telo.

Pojmovi: željeno stanje, idempotentnost, validacija.

Osvrt: REST resurs, stateless obrada, optimistički prikaz, prihvaćena komanda naspram potvrde fizičkog uređaja. Baza još nije uvedena; njeno kasnije postojanje ne kvari stateless zahtev.

### Čas 7 — Trajno stanje i Docker

Ishod je put zahtev, upit, rezultat, odgovor. Čitanje i izmena režima idu uz zapis komande. Upit je parametrizovan. Povezani upis režima i istorije je jedna celina: ili oba uspeju, ili se oba povuku.

Editor menja da li drugi upit u toj celini uspe. Jedna promena: restart samo Node procesa. Režim posle uspele celine ostaje. Restart ne spaja dva odvojena upita.

Pitalica: evidencija nije pouzdana dok režim i istorija nisu jedna celina. Istorija nije sporedna. Kontejner sam ne čini upise atomskim ni trajnim. Browser ne dobija kredencijale baze.

Demonstracija razlikuje restart procesa, uklanjanje kontejnera i uklanjanje trajnog skladišta na pripremljenom PostgreSQL-u.

Pojmovi: transakcija, parametrizovan upit, volume.

Osvrt: relaciono naspram dokumentnog modela, VM naspram kontejnera. Bez mini-kursa administracije.

### Čas 8 — Koliko je prikaz svež

Ishod je razlika poslednjeg poznatog i trenutnog stanja. Displej stoji jer ga ne pomera ni takt ni odgovor komande. To je potreba za novim čitanjem. Očitavanje nosi vrednost i trenutak. Displej pokazuje starost. Na času poseban prekidač uključi periodično čitanje, polling, i time odmah pošalje jedno čitanje, pa ga ponavlja. Neuspeo krug u tom nizu piše Err istom granom kao „Pročitaj”. Dugme „Pročitaj” ostaje i i dalje šalje jedno čitanje. SSE i WebSocket imenuju se kao drugi način da displej sobe prekidača sazna za broj. Stranica već ima push koji puni samo displej sobe mašina; čas ga ne imenuje i ne okreće ga ka displeju sobe prekidača.

Editor uključuje ili isključuje odbacivanje starijeg trenutka merenja. Jedna promena: sporiji zahtev, meren ranije, stiže posle bržeg. Sa proverom, noviji broj ostaje. Bez provere, stariji pregazi ekran.

Pitalica: broj 24 °C star deset minuta znači poslednje očitavanje, ne sadašnju temperaturu. Keš ikonice i keš temperature ne moraju isti rok. Stariji odgovor ne sme da pregazi noviji samo zato što je sa servera.

Pojmovi: očitavanje, zastareli odgovor, keš.

Osvrt: SSE i WebSocket kao push koji ovaj čas ne pravi, History API, SPA i MPA, React hooks, mobilni klijent, storage, PWA i offline.

### Čas 9 — Ko sme da upravlja

Ishod je razlika identiteta, ovlašćenja i browser ograničenja. Dve sesije su pripremljene u kodu kutije: neproziran ključ za posmatrača i neproziran ključ za operatera. Izbor na panelu traži od kutije da pošalje `Set-Cookie` sa tim ključem. Cookie je HttpOnly. Kutija u mapi drži ulogu i ne veruje imenu uloge iz browsera. Anonimna sesija nije prijavljen korisnik. Čitanje ne traži sesiju. Komanda bez cookie-ja dobija 401. Komanda posmatrača dobija 403. Tek posle toga kutija gleda telo: loš unos je 400, izvučen ventilator je 500, uspeh je 200 i samo režim. Dugme može da se sakrije, a zahtev mimo ekrana i dalje stiže.

Editor menja ulogu upisanu uz ključ sesije koja šalje komandu. Cookie ostaje isti. Jedna promena: drugi origin. Alat van browsera čita telo; JS te druge stranice ne mora da sme. CORS time nije autentifikacija.

Pitalica: server nije zaštićen time što posmatrač ne vidi dugme. Tačno je da server proveri ulogu na zahtevu. Čitanje koje browser zabrani ne dokazuje da server ćuti. CORS ne dokazuje ko je korisnik.

Pojmovi: autorizacija, sesija, CORS.

Osvrt: prijava preko treće strane i token kao alternative, XSS kroz tekst koji se ubacuje kao HTML, SQL injection kroz lepljenje teksta u upit naspram parametra, CSRF kroz sesijsku komandu, HTTPS i ostali napadi kao imena problema. Bez izrade napada i bez login forme.

### Čas 10 — Ceo sistem

Ishod je obrazložen put komande, šta sme da se zaključi kad odgovor izostane, i granica provere. Osnove rekonstruišu put: browser, Node, baza, log. Konfiguracija je adresa servera i osnovni log. TypeScript je anotacija poznatog objekta sobe i rečenica da statička provera nije runtime validacija. Nema posebnog TS zadatka.

Demonstracija je jedan zahtev kroz već pripremljeni browser, Node i PostgreSQL, vidljiv u Network panelu i u logu. Lokalna i javna adresa stoje na dijagramu. Jedan namerni neuspeh je dovoljan. Ceo deployment se ne izvodi uživo.

Glavna pitalica: ekran kaže „uključeno”, odgovor nije stigao. Tačno je da ne znamo ishod upisa. Treba log i ponovno čitanje, pa odluka o ponavljanju. Upis nije ni dokazan ni opovrgnut samim ekranom. Slepo ponavljanje komande koja prebacuje režim može da poništi upis koji jeste prošao. Tip i predlog asistenta ne dokazuju proveru uloge; ta rezervna pitalica ostaje ilustracija u osvrtu ako glavna diskusija potroši vreme.

Pojmovi: tri stanja, ponovljena komanda, TypeScript granica.

Osvrt, bez nove pitalice po nazivu: proxy i CDN kroz put zahteva, cloud i više procesa sa lokalnim sesijama, mesto i trenutak nastanka HTML-a, logovi i CI kao dokaz ponašanja, blockchain kao evidencija koja ne dokazuje tačnost senzora. Jednom operateru ostaje istorija komandi.

Rekapitulacija: student zapiše gde se proverava pravo, gde stoji stanje, i šta izostanak odgovora ne dokazuje.

## Testing Decisions

Dobar test je prolazak sajta časa u browseru, čas po čas, na istom panelu. Node se uključuje od četvrtog časa, baza od sedmog. Posle svakog časa panel i dalje ima jednu prostoriju, jedno očitavanje i jedan ventilator.

Za svaki čas vredi proveriti ishod, jednu izmenu u editoru, tačan zaključak glavne pitalice i razlog za ostale opcije, pa jednu promenu uslova. Posebno: čas 1 nema API red; čas 4 ima HTTP/1.1; čas 5 razlikuje 500 od ugašenog porta; čas 6 razlikuje dva smisla komande; čas 7 posle restarta procesa čuva režim upisan u bazu; čas 8 odbacuje stariji trenutak; čas 9 odbija posmatrača i prima operatera; čas 10 ne tretira ćutanje kao dokaz upisa.

Ne vredi assertovati raspored minuta ni tekst osvrta slovo po slovo. U repozitorijumu nema testa koji već hoda kroz časove.

## Out of Scope

- Studentske vežbe, bodovanje i izrada sistema za prijavu.
- Drugi uređaj, druga prostorija, igra i fizika.
- Tajmer unutar closure primera na trećem času i kviz redosleda microtaskova.
- Poseban TypeScript zadatak i napredni tipovi.
- Izrada Express-a, Reacta, GraphQL-a, WebSocket servera, PWA, Kubernetesa ili blockchain evidencije.
- Rekonstrukcija DNS-a, TLS-a ili QUIC-a kao zadatak.
- Mini-kurs administracije PostgreSQL-a i uživo izveden deployment na desetom času.

## Further Notes

Ovaj tok pretpostavlja zajednički ugovor Kontrolne sobe. Ponašanje editora stoji u specifikaciji interaktivnog sajta. Faze razgovora i cilj svake pitalice stoje u specifikaciji pitalica.
