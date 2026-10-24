# Web programiranje: Kontrolna soba

Važeći obim je 11 časova po 90 minuta: 70 minuta koraka i 20 minuta glavne diskusije. Telo koje sajt čita je `site/kurs.json`. Tabela ispod je raniji plan od 10 časova i 35 minuta diskusije; zadržana je kao istorija rasporeda, ne kao satnica časa.

Usvojeni okvir: postepenost, osnove pre pitanja, Kontrolna soba kao povezujući primer, vanilla tehnologije. Vežbe i ocenjivanje nisu predmet ovog plana.

## Cilj i predznanje

Studenti znaju OOP, algoritme i SQL; strukture podataka uče paralelno. JS specifičnosti uvode se eksplicitno: poznavanje petlje ne podrazumeva poznavanje leksičkog scope-a, callback-a ili asinhronosti.

Student treba da objasni tok korisničke akcije od browsera do servera i baze, razlikuje prikaz od merodavnog stanja, obrazloži obradu grešaka i ponovljenih zahteva i prepozna granice poverenja. Šire teme predstavljaju mapu oblasti: koji problem rešavaju i kada postaju relevantne.

Predavanja koriste pripremljene demonstracije, pitalice, kucanje u editoru časa i obrazloženja odgovora. Broj slajdova proizlazi iz nastavnih sekvenci, a ne određuje obim kursa.

## Nastavni obrazac

Poznat scenario → neophodne osnove → mali objašnjeni primer → pitalica → obrazloženje svih odgovora → promena jednog uslova.

Motivacioni scenario može prethoditi terminologiji, ali pitanje za proveru ne zahteva neobjašnjenu sintaksu ili API. Prvo pokazati opcije i saslušati argumente, pa otkriti rezultat i obrazložiti alternative. Pregledne teme dobijaju problem, osnovnu ideju i granicu primene; ne traže implementaciju.

Za demonstraciju pripremiti početno i završno stanje, kratak isečak koda, očekivan rezultat i rezervni snimak. Instalacije i duže pisanje koda ne troše vreme predavanja.

## Povezujući primer i tehnologije

Kontrolna soba prikazuje simulirani staklenik. Početna verzija ima jedno očitavanje temperature i jedan ventilator. Kasnije dodajemo vreme očitavanja, prag upozorenja, istoriju komandi i uloge posmatrača i operatera, kada ih zahteva tema.

Simulacija najpre napreduje dugmetom „Sledeći korak”. Automatske promene dolaze nakon asinhronosti. Nema stvarnog hardvera. Opciono može postojati cilj održavanja temperature u opsegu, ali bodovanje i fizika nisu preduslovi gradiva.

- Browser: HTML, CSS i vanilla JS, DOM i `fetch`.
- Server: ugrađeni Node.js moduli, uključujući `http`; nekoliko eksplicitnih ruta, bez Express-a ili drugog web framework-a.
- Baza: PostgreSQL u Dockeru, drajver za vezu sa Node-om, parametrizovani SQL upiti.
- Framework-i: React, Next.js i drugi pominju se kroz svrhu i kompromise, bez korišćenja u primeru.

Server u osnovnoj simulaciji neposredno primenjuje željeno stanje ventilatora. Razlika prihvaćene komande i potvrde fizičkog uređaja može se pomenuti kao proširenje. Browser nema direktan pristup bazi.

## Mapa časova i vremena

| Čas | Tema | Osnove | Demonstracija | Studentski odgovori i diskusija | Pregledne teme | Rekapitulacija | Ukupno |
|---|---|---:|---:|---:|---:|---:|---:|
| 1 | Web, dokument i prikaz | 25 | 10 | 35 | 15 | 5 | 90 |
| 2 | JavaScript, stanje i scope | 30 | 10 | 35 | 10 | 5 | 90 |
| 3 | DOM, događaji i closure | 30 | 10 | 35 | 10 | 5 | 90 |
| 4 | HTTP i Node.js | 25 | 10 | 35 | 15 | 5 | 90 |
| 5 | Asinhronost i fetch | 30 | 10 | 35 | 10 | 5 | 90 |
| 6 | Komande, validacija i ponavljanje | 30 | 10 | 35 | 10 | 5 | 90 |
| 7 | PostgreSQL i Docker | 30 | 10 | 35 | 10 | 5 | 90 |
| 8 | Svežina podataka i komunikacija | 25 | 10 | 35 | 15 | 5 | 90 |
| 9 | Identitet, ovlašćenja i browser granice | 25 | 10 | 35 | 15 | 5 | 90 |
| 10 | Ceo sistem, isporuka i šira slika | 15 | 10 | 35 | 25 | 5 | 90 |

Ukupno: 265 minuta osnova, 100 minuta demonstracija, 350 minuta studentskih odgovora i diskusije, 135 minuta preglednih tema i 50 minuta rekapitulacije. Diskusija zauzima 5 sati i 50 minuta i nije skrivena u vremenu profesorovog izlaganja.

### Kako koristiti 35 minuta diskusije

- 3 min: individualno razmišljanje i izbor odgovora, nakon objašnjenih osnova.
- 5 min: poređenje razloga u paru ili maloj grupi.
- 8 min: nekoliko studenata iznosi različita obrazloženja; nastavnik beleži i pogrešne pretpostavke.
- 7 min: zajednička analiza, kontraprimer i objašnjenje zašto odgovori rade ili ne rade.
- 5 min: ponovno glasanje i studentsko preformulisanje zaključka.
- 7 min: druga kratka pitalica ako je osnovna razjašnjena; inače dodatno razjašnjenje iste ideje.

To je budžet za ceo čas, ne za svaku pitalicu. Prva pitalica je glavna, druga rezervna. Demonstracija od 10 minuta može se podeliti na početnu situaciju i proveru studentskih predviđanja. Svi prvo odgovaraju individualno ili u paru; ne mora svaki student govoriti pred celom grupom. Nastavnik ne prekida pogrešno obrazloženje odmah: traži pretpostavku koja ga podržava i proverava je primerom.

Poslednjih 5 minuta služi izlaznom pitanju i proveri šta je ostalo nejasno. Ako grupa nema osnovu za naredni čas, sledeći čas počinje njenim razjašnjenjem uz skraćenje rezervnog primera. Vreme za greške i razmišljanje ne nadoknađuje se ubrzavanjem profesora.

Pregledne teme kratko pomenuti kroz problem i namenu, u povezanim grupama, bez nove diskusije za svaki naziv. Samostalni čas naprednijeg JS-a uklonjen je: scope i sinhroni closure prelaze u časove 2–3, a timer/closure i microtask kvizovi izostaju. Završna integracija spojena je sa isporukom. TS ostaje kratak uvod u svrhu i granice, bez posebnog zadatka.

## Čas 1 — Šta browser prikazuje i odakle to dolazi

**Preduslov:** opšte programersko iskustvo. **Ishod:** razlikovanje dokumenta, prikaza i komunikacije.

**Osnove:** Internet naspram Weba; browser i server; URL; zahtev i odgovor na nivou slike; HTML elementi i atributi, CSS selektori i box model. Temperatura u početnom panelu je statičan sadržaj.

**Demonstracija:** pripremljen panel; u Network panelu pokazati zahteve za HTML i CSS; promeniti tekst i stil u alatima browsera. Detalje metoda i zaglavlja ne proveravati pre četvrtog časa.

**Pitalica 1:** U browseru promenimo „24 °C” u „10 °C”. Menjamo li temperaturu, dokument na serveru ili lokalni prikaz?

**Rezon:** promenjen je prikaz. Osvežavanje može vratiti originalni dokument; UI nije sam po sebi stanje spoljnog sistema.

**Pitalica 2:** HTML se učitao, CSS nije. Da li stranica nužno ostaje prazna?

**Rezon:** sadržaj može ostati vidljiv bez očekivanog izgleda; odvojeni resursi mogu imati različite ishode.

**Pregled (15 min):** 5 min istorije i URL → DNS → veza → HTTP → prikaz; 5 min semantičkog HTML-a i osnovne pristupačnosti; 5 min UI skice i uloge Figma alata. DNS/TLS su ovde orijentacija, ne zadatak rekonstrukcije neobjašnjenih protokola.

## Čas 2 — JavaScript opisuje stanje i pravila

**Preduslov:** struktura stranice i razlika podaci/prikaz. **Ishod:** čitanje malog sinhronog JS programa.

**Osnove:** vrednosti i tipovi, `let`/`const`, operatori i `===`; JS zapis poznatih uslova i petlji; funkcija, parametri i povratna vrednost; objekat i niz. Funkcija je vrednost: dodela i poziv nisu isto. Pokazati običnu i arrow funkciju pre njihove dalje upotrebe.

**Demonstracija:** objekat sa temperaturom i stanjem ventilatora. Funkcija `nextStep(state)` računa naredno stanje po jednostavnom nastavnom pravilu. Pratiti vrednosti u konzoli; DOM povezivanje sledi narednog časa. Lokalni i spoljašnji leksički scope objasniti jednim sinhronim pozivom funkcije pre upotrebe u handler-ima.

**Pitalica 1:** Objekat je dodeljen promenljivoj deklarisanoj sa `const`. Smemo li promeniti njegovo polje?

**Rezon:** `const` sprečava ponovno dodeljivanje promenljive, ali ne zamrzava objekat.

**Pitalica 2:** Dve promenljive referenciraju isti objekat. Menjamo temperaturu kroz jednu — šta vidi druga?

**Rezon:** deli se objekat; naziv promenljive ne stvara kopiju. Povezati sa poznatim OOP iskustvom.

**Pregled (10 min):** 3 min dinamičkih tipova i mesta TS provere; 3 min JS okruženja i njihovih API-ja; 4 min Git-a i saradnje kroz poređenje dve verzije iste funkcije.

## Čas 3 — Događaji povezuju korisnika i stanje

**Preduslov:** funkcije kao vrednosti, objekti i osnovni HTML/CSS. **Ishod:** objašnjen klik → handler → stanje → prikaz.

**Osnove:** DOM, `querySelector`, `textContent`, `addEventListener`; callback; forma i `preventDefault`. Pokazati osnovni raspored panela kroz Flexbox ili Grid.

**Demonstracija:** dugme za sledeći korak i lokalno uključivanje ventilatora; funkcija za prikaz se poziva nakon promene stanja. Pokazati fokus i upravljanje tastaturom. Pre handler-a koji pamti vrednost prikazati mali sinhroni primer funkcije koja vraća funkciju: closure zadržava pristup spoljašnjoj promenljivoj. Tajmere ne uključivati u taj primer.

**Pitalica 1:** Menjanje JS objekta odmah menja tekst na stranici — uvek, nikada ili ako postoji kod koji ažurira prikaz?

**Rezon:** u ovom primeru potreban je eksplicitan kod koji menja DOM. To otvara razlog postojanja biblioteka za prikaz.

**Pitalica 2:** Zašto `addEventListener('click', update)` i `addEventListener('click', update())` nisu isto?

**Rezon:** prvi prosleđuje funkciju; drugi je poziva odmah i prosleđuje povratnu vrednost. Pre pitanja demonstrirati te operacije izvan event API-ja.

**Pregled (10 min):** 4 min responsive prikaza, jedinica, pozicioniranja, animacija, ikonica i pristupačnih formi; 3 min klasa/prototipova i zavisnosti `this` od načina poziva, prema poznatom OOP-u; 3 min komponenti i deklarativnog prikaza uz React. Bez dodatnih pitalica o `this` ili JSX-u.

## Čas 4 — HTTP zahtev i mali Node server

**Preduslov:** funkcija, callback i objekat. **Ishod:** praćenje konkretnog zahteva i odgovora.

**Osnove:** proces servera i port; Node naspram browser API-ja; minimalni `import` pre koda sa modulima; metod, putanja, zaglavlja, telo, status i `Content-Type`. JSON tekst nije isto što i JS objekat.

**Demonstracija:** mali `http.createServer` handler služi stranicu i `GET /api/room`. Prvo otvoriti API direktno u browseru, bez `fetch`. U server logu i Network panelu pratiti isti zahtev. Podaci su još u memoriji.

**Pitalica 1:** Zašto Node handler ne može promeniti dugme pozivom `document.querySelector`?

**Rezon:** DOM pripada browseru; server vraća podatke ili dokument, a browser obrađuje odgovor.

**Pitalica 2:** Server radi, ali putanja ne postoji. Da li je isto kao kada ništa ne sluša na portu?

**Rezon:** prvi slučaj može dati HTTP 404; drugi nema HTTP odgovor tog servera.

**Pregled (15 min):** 5 min IP/TCP/UDP, TLS i pozicije HTTP/1.1, HTTP/2 i HTTP/3/QUIC; 5 min XML/SOAP, RPC/gRPC i GraphQL; 5 min Express-a i middleware-a kao organizacije obrade koju ovde pokazujemo eksplicitno. Cilj je mapa odgovornosti.

## Čas 5 — Čekanje odgovora i obrada neuspeha

**Preduslov:** callback, HTTP i JSON. **Ishod:** razlikovanje sinhronog toka, čekanja i vrsta grešaka.

**Osnove:** sinhroni redosled, callback tajmera; Promise kao budući ishod; `async`/`await`, `try/catch`; `fetch`, `response.ok` i čitanje JSON-a. `await` u funkciji ne zaustavlja ceo browser.

**Demonstracija:** dugme učitava temperaturu. Pokazati uspeh i HTTP 500 kao glavni kontrast; spor odgovor i ugašen server prikazati pripremljenim snimkom samo ako ostane vremena. UI ima čekanje, podatak ili grešku.

**Pitalica 1:** `fetch` je dobio HTTP 500. Da li to nužno vodi u `catch`?

**Rezon:** HTTP neuspeh proveravamo preko statusa/`ok`; dobijen odgovor nije isto što i uspešna operacija. Mrežni neuspeh i greška parsiranja imaju drugačiji tok.

**Pitalica 2:** Dok čekamo temperaturu, može li korisnik kliknuti drugo dugme?

**Rezon:** asinhrono čekanje ostavlja prostor za druge događaje; duga sinhrona obrada može blokirati interakciju.

**Pregled (10 min):** 4 min spoljnog API-ja, timeout-a i `AbortController`-a; 3 min konkurentnih zahteva i `Promise.all`; 3 min call stack-a, event loop-a i postojanja task/microtask redova. Bez kviza redosleda izvršavanja; razlikovati konkurentnost i paralelizam.

## Čas 6 — Komande, validacija i ponavljanje

**Preduslov:** HTTP, JSON, `fetch` i greške. **Ishod:** objašnjenje željenog stanja, validacije i idempotentnosti.

**Osnove:** telo zahteva, serijalizacija i parsiranje; telo može stizati u delovima. Resurs i semantika GET/POST/PUT/PATCH. Statusi 200/204, 400 i 404 kroz konkretne slučajeve.

**Demonstracija:** `PUT /api/devices/fan/state` sa `{ "enabled": true }`. Server proverava unos, menja stanje i vraća rezultat. Pripremljeni pomoćni kod za telo ima objašnjenu namenu, ograničenje veličine i obradu neispravnog JSON-a.

**Pitalica 1:** Koju komandu je lakše bezbedno ponoviti: „promeni stanje” ili „postavi na uključeno”?

**Rezon:** prva može poništiti prethodni efekat; druga ima isti nameravani efekat na stanje. To ne garantuje jednu isporuku ni odsustvo dodatnog zapisa u logu.

**Pitalica 2:** UI nudi samo uključeno/isključeno. Može li server ipak dobiti tekst ili nepoznato polje?

**Rezon:** zahtev može nastati mimo UI-ja; server proverava stvarni ulaz.

**Pregled (10 min):** 4 min REST resursa i stateless obrade; 3 min full-stack stanja i optimističkog prikaza; 3 min prihvaćene komande naspram potvrde fizičkog uređaja. Postojanje baze nije samo po sebi suprotnost stateless zahtevima.

## Čas 7 — Trajno stanje, istorija i Docker

**Preduslov:** poznati SQL i serverski handler. **Ishod:** praćenje zahtev → upit → rezultat → odgovor.

**Osnove:** proces baze, veza, konfiguracija i drajver; parametrizovan SQL; trajnost naspram memorije. Image, container, port i volume kroz pripremljeni PostgreSQL.

**Demonstracija:** čitanje i izmena stanja ventilatora uz zapis komande. Restartovati Node i učitati stanje. Razlikovati restart procesa, uklanjanje kontejnera i uklanjanje trajnog skladišta.

**Pitalica 1:** Izmenjeno je stanje, ali upis istorije nije uspeo. Da li je evidencija pouzdana?

**Rezon:** povezane promene razmatramo zajedno. Kratko ponoviti transakciju i rollback pre pitanja; dva upita nisu automatski jedna atomska operacija.

**Pitalica 2:** Da li browser treba da dobije kredencijale baze?

**Rezon:** server posreduje, proverava unos i prava; javni klijentski kod ne čuva serversku tajnu.

**Pregled (10 min):** 5 min relacionog i dokumentnog modela, uz MongoDB; 5 min VM-a, kontejnera i uloge Docker-a. Bez mini-kursa administracije baze.



## Čas 8 — Koliko je prikaz svež

**Preduslov:** asinhronost, serversko stanje i tajmeri. **Ishod:** razlikovanje poslednjeg poznatog i trenutnog stanja.

**Osnove:** vreme očitavanja, kopije stanja, periodično učitavanje, redosled slanja i završavanja; koncept keša i svežine.

**Demonstracija:** server menja temperaturu, panel prikazuje vreme odgovora. Usporiti jedan zahtev da stariji odgovor prepiše noviji prikaz. Uvesti proveru verzije ili relevantnosti odgovora.

**Pitalica 1:** Piše 24 °C, ali očitavanje je staro deset minuta. Znamo li sadašnju temperaturu?

**Rezon:** znamo poslednje očitavanje; potrebni su starost podatka i prikaz nedostupnosti.

**Pitalica 2:** Koristimo li istu politiku keša za ikonicu i temperaturu?

**Rezon:** različite potrebe za svežinom; keš nije automatski greška niti besplatno ubrzanje bez posledica.

**Pregled (15 min):** 4 min polling/SSE/WebSocket i sockets pristupa; 4 min URL/History API i SPA/MPA; 3 min React hooks/context/router; 4 min mobilnih klijenata, browser storage-a, PWA/service worker-a i offline rada. Bez framework implementacije.

## Čas 9 — Ko sme da upravlja sistemom

**Preduslov:** HTTP zaglavlja, stanje i validacija. **Ishod:** razlikovanje identiteta, ovlašćenja i browser ograničenja.

**Osnove:** autentifikacija/autorizacija; cookie i serverska sesija; origin kao šema, host i port; same-origin policy i CORS. Anonimna sesija nije dokaz identiteta prijavljenog korisnika.

**Demonstracija:** pripremljene sesije posmatrača i operatera; server isti zahtev prihvata ili odbija prema ovlašćenju. Zasebno pokazati drugi origin i ograničenje pristupa odgovoru. Ne razvijati login sistem na predavanju.

**Pitalica 1:** Posmatrač nema dugme „Uključi”. Da li je server zaštićen?

**Rezon:** klijent može poslati zahtev mimo ekrana; server proverava ovlašćenje.

**Pitalica 2:** `curl` dobija odgovor, ali ga browser JS ne može pročitati. Da li server nužno nije dostupan?

**Rezon:** browser ograničava čitanje; CORS nije autentifikacija ni opšta zabrana slanja. Preflight i jednostavni zahtevi nisu ista situacija.

**Pregled (15 min):** 5 min prijave preko treće strane i alternative tokena; 5 min XSS/SQL injection/CSRF kroz tekstualni prikaz, parametrizaciju i sesijsku komandu; 5 min HTTPS, mrežnih i sesijskih napada, phishing/DoS i pomen SSRF-a. Cilj je razlikovanje problema.

## Čas 10 — Ceo sistem, isporuka i šira slika

**Preduslov:** browser, Node, baza, asinhronost i ovlašćenja. **Ishod:** obrazložen put komande, otkaz i granice provera.

**Osnove (15 min):** 7 min rekonstrukcije putanje komande; 5 min konfiguracije, adrese servera i osnovnog loga; 3 min osnovnog TS-a: poznati objekat sa anotacijom i razlika statičke provere i runtime validacije. Nema posebnog TS zadatka.

**Demonstracija (10 min):** pripremljeni browser, Node i PostgreSQL, jedan zahtev i zapisi u Network panelu i logu. Uporediti lokalnu i javnu adresu dijagramom. Pokazati jedan namerni neuspeh; ne izvoditi ceo deployment uživo.

**Glavna pitalica:** Browser kaže „uključeno”, odgovor komande nije stigao. Šta možemo zaključiti, koje dokaze tražimo i smemo li ponoviti komandu?

**Rezon:** izostanak odgovora ne dokazuje da upis nije izvršen. Studenti odvajaju željeno, serversko i prikazano stanje, traže log i ponovno učitavanje. Ponavljanje procenjuju prema semantici komande. Nastavnik daje tragove postepeno, nakon studentskih predloga.

**Rezervna pitalica:** Kod prolazi TS proveru i predložio ga je AI. Znamo li zato da pravilno proverava pravo operatera?

**Rezon:** posle uvoda u TS i AI objasniti da ni tipovi ni poreklo koda ne dokazuju poslovnu i bezbednosnu ispravnost. Ako glavna diskusija potroši svih 35 minuta, ovo ostaje profesorova ilustracija u preglednom bloku, bez dodatnog glasanja.

**Pregled (25 min):**

- 5 min: deployment, forward/reverse proxy, load balancing i CDN kroz put zahteva.
- 5 min: cloud modeli, data centri, Kubernetes i serverless; dva procesa sa lokalnim sesijama kao ilustracija, bez dodatne pitalice.
- 5 min: SSR/CSR/SSG i Next.js, kroz mesto i trenutak generisanja prikaza.
- 5 min: logs/metrics/tracing, debugging, CI/CD/testovi i LLM/AI asistencija, kroz dokaze o ponašanju programa.
- 5 min: blockchain i poverenje nezavisnih učesnika. Evidencija ne dokazuje istinitost senzorskog merenja; za jednog operatora često je dovoljan audit log.

**Rekapitulacija (5 min):** svaki student zapisuje gde se proverava pravo pristupa, gde se čuva stanje i šta ne možemo zaključiti kada odgovor izostane. Uzeti nekoliko odgovora i razjasniti jednu preostalu zabunu.

## Kontrola pokrivenosti

| Tema iz uporednog spiska ili izvornog predloga | Časovi |
|---|---|
| HTML/CSS, box model, layout, responsive, animacije, ikonice | 1, 3 |
| Pristupačnost, UI/Figma | 1, 3 |
| JS i scope, DOM, događaji, sinhroni closure | 2, 3 |
| Klase/prototipovi i this pregledno; moduli | 3, 4 |
| HTTP, JSON, Node, validacija, Promise/fetch, event loop | 4–6 |
| PostgreSQL, Docker, transakcije, MongoDB kao alternativa | 7 |
| Svežina, keš, full-stack stanje, sockets/polling/SSE/WebSocket | 6, 8 |
| URL/History, SPA/MPA, React/hooks/context/router | 3, 8 |
| Express/middleware, spoljni API, XML/SOAP/RPC/GraphQL | 4, 5 |
| Sesije, ovlašćenja, CORS, treća strana, bezbednost | 9 |
| TCP/UDP, TLS, verzije HTTP-a i QUIC | 1, 4, 9 |
| Deployment, skaliranje, proxy/CDN, cloud/data centri/Kubernetes | 10 |
| Next.js/serverless, SSR/CSR/SSG, logs/metrics/tracing, CI/CD | 10 |
| Blockchain | 10 |
| Osnovni TS, Git/saradnja, debugging, LLM/AI | 2, 10 |
| Mobilni klijenti, storage, PWA, service worker i offline | 8 |

Napredni TS, složeni closure/timer zadaci i microtask kvizovi ostaju izvan ovog plana. Sve dogovorene pregledne oblasti su pomenute, ali se ne očekuje njihovo samostalno korišćenje posle kratkog osvrta. Tabela ne tvrdi da sve teme obrađuju svi uporedni kursevi; poreklo je navedeno u beleškama o izvorima.

## Prateći dokumenti

- [Poređenje sa MIT i Stanford izvođenjima](docs/analiza-kursa-izvori.md).
- [Teme van primera i primarni izvori](docs/teme-izvan-igre-izvori.md).
- [Razrada Kontrolne sobe i poređenje sa Reaktorom](docs/reaktor-i-kontrolna-soba.md).
- [Analiza ranijeg rasporeda](docs/analiza-i-predlog-kursa.md).
- [Arhivirani izvorni predlog sa 103 slajda](docs/izvorni-plan-103-slajda.md).

Za pripremu demonstracija koristiti MDN, zvaničnu Node.js i PostgreSQL dokumentaciju, HTTP specifikacije, OWASP i TypeScript Handbook. Ovaj dokument određuje nastavni sled; slajdovi i implementacija demonstracione aplikacije tek se izrađuju.
