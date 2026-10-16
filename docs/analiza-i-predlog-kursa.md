# Analiza i predlog postepenog kursa Web programiranje

Status: istorijska analiza i radne verzije predloga, 16. oktobar 2026. Izabrana je Kontrolna soba; važeći razrađeni raspored je u [glavnom planu](../web_programiranje_interaktivni_kurs_predlog.md). Kritika ispod odnosi se na [arhivirani izvorni dokument](izvorni-plan-103-slajda.md). Otvorene odluke i primeri sa beleškama u ovom dokumentu predstavljaju ranije faze razgovora, ne aktuelne zahteve.

## Zaključak

Predavanja rano demonstriraju JavaScript u browseru, zatim jednostavan Node.js server i jedan HTTP zahtev koji ih povezuje. Na tom iskustvu graditi API dizajn, bezbednost i arhitektonsko rasuđivanje. Studenti kroz pitalice objašnjavaju ponašanje i posledice odluka; pisanje konkretnih aplikacija pripada vežbama.

Potvrđeno nakon prethodne verzije: sve teme iz [uporednog spiska](teme-izvan-igre-izvori.md) treba kratko pomenuti, bez detaljne obrade. React, Next.js i slični okviri dobijaju konceptualni pregled, ali se ne koriste u demonstracionoj aplikaciji. Browser koristi vanilla JS, server ugrađene Node.js mogućnosti. Za PostgreSQL se koristi drajver kao veza sa bazom; zabrana framework-a ne znači implementiranje protokola baze od nule. Detaljna razrada kandidata je u [Reaktor i Kontrolna soba](reaktor-i-kontrolna-soba.md).

Potvrđeni okvir: 12 predavanja po 90 minuta, ukupno 18 sati. Vežbe nisu predmet ovog prolaza. Studenti znaju OOP i algoritme, a strukture podataka uče u istom semestru: njihovo potpuno poznavanje ne uzima se kao preduslov. JS specifičnosti uvode se eksplicitno. Pitanja ne smeju zahtevati osnove koje prethodno nisu pružene.

Prihvaćen je postepeni razvoj male aplikacije kao povezujućeg primera, ali ona ne mora ilustrovati svaku temu. Browser–server komunikacija ima prednost nad obimom TypeScript-a. Osnovni TS je poželjan ako ostane vreme. Potvrđena baza je PostgreSQL u Dockeru; studenti poznaju SQL. Beleške su odbačene kao suviše čest primer. Razmatra se 2D igra; konkretna aplikacija i konačna raspodela još su predlozi. Primeri sa beleškama u tabeli ispod predstavljaju prethodnu verziju rasporeda i biće zamenjeni kada se izabere aplikacija.

## Problemi postojećeg plana

| Mesto | Problem | Predložena izmena |
|---|---|---|
| Pedagoški koncept; slajdovi 2 i završna sekvenca | Pitanje pre objašnjenja propisano je kao opšte pravilo. Student često mora da pogodi nepoznatu činjenicu. | Svakodnevni motivacioni scenario može prethoditi objašnjenju; tehnički zadatak dolazi posle osnova i vođenog primera. |
| Nedelje 1–2 | DNS, mrežni otkazi, TCP mehanizmi i verzije HTTP-a dolaze pre prve jednostavne aplikacije. | Uvodno prikazati klijent–server i jedan zahtev; transport razraditi kasnije, prema potrebama primera. |
| Nedelja 3 | Browser rendering, XML šeme i PWA dobijaju prostor, ali nema razrađenog početnog rada sa HTML-om, CSS-om, JS sintaksom i događajima. | Dodati stvarne male vežbe: dokument, stil, promenljiva, funkcija, klik, promena sadržaja. |
| Nedelja 4, slajdovi 28–35 | Izbor POST/PUT/PATCH i API za pozajmice traže razumevanje zahteva, tela, resursa i stanja koje još nije praktično izgrađeno. | Prvo pregled i izmena jednog resursa na lokalnom serveru, zatim rasprava o metodama i ponavljanju zahteva. |
| Nedelje 5–6 | Skaliranje, cloud, kontejneri, Kubernetes i distribuirana dijagnostika prethode sopstvenom serveru. | Jedan proces i lokalni logovi pre deployment-a; napredna infrastruktura kao opciona nadogradnja. |
| Nedelja 7, slajd 53 | `for`, `var`, arrow funkcija, callback, timer i closure pojavljuju se u jednom pitanju. | Razdvojiti sekvencu preduslova; closure proveravati prvo sinhronim primerom. |
| Nedelja 8 | Izgubljeni `this`, prototipovi i izbor nasleđivanja/kompozicije prethode dovoljno razrađenim jednostavnim objektima i metodama. | Prvo objekat, pristup svojstvu i poziv metode; zatim način poziva i organizacija koda. |
| Nedelja 9, slajd 68 | Microtask pitalica prethodi uvodu u Promise; završni zadatak uvodi pet servisa. | Jedan uspešan zahtev, zatim jedan neuspešan zahtev i stanja UI-ja; redovi izvršavanja tek posle toga. |
| Nedelje 10–12 | Tri nedelje TS-a, uključujući napredne transformacije, uz nedovoljno praktičnog full-stack osnova. | Za uvodni kurs predložiti osnovni TS i modelovanje stanja; napredne tipove odvojiti kao dodatak. |
| Nedelja 12 | Napredni tipovi, kolaborativno uređivanje, real-time, blockchain i AI nisu postepena integracija prethodnih vežbi. | Završiti istu malu aplikaciju; nove oblasti ostaviti za pregled daljeg učenja. |

Repo već sadrži male JS, funkcijske, OOP, async i TS primere. To su korisni resursi za vežbe, ali njihovo postojanje samo po sebi ne dokazuje da su preduslovi uvedeni u nedeljnom planu.

## Poređenje sa univerzitetskim kursevima

Stanford CS193X, proleće 2023, uvodi HTML i JS u prvoj nedelji, DOM i događaje u drugoj, `fetch`, JSON i asinhronost u petoj, Node servere u šestoj, a baze u sedmoj. To je konkretan primer prelaska od jezika i interakcije ka komunikaciji i serveru. [Raspored](https://web.stanford.edu/class/cs193x/lectures.html)

CS193X ne zahteva prethodno web iskustvo, ali očekuje znanje programiranja na nivou CS106B. Zato njegov tempo nije direktan model za potpune početnike. Njegov završni projekat povezuje frontend događaje i DOM sa `fetch` pozivima ka Node/Express backend-u i JSON telima. [Preduslovi](https://web.stanford.edu/class/cs193x//info), [projekat](https://web.stanford.edu/class/cs193x//project/)

Stanford CS142 pokriva i browser i serverski JavaScript, a zvanični katalog navodi CS107 kao preduslov. Složenost njegovih zadataka treba posmatrati u tom kontekstu. Detaljniji pregled CS142 i MIT web.lab izvora je u [belešci o izvorima](analiza-kursa-izvori.md). [Katalog CS142](https://bulletin.stanford.edu/courses/2085161)

Univerzitetski rasporedi su uporedni primeri, ne dokaz da postoji jedini ispravan redosled. Predloženi raspored ispod je naša didaktička procena za ovaj kurs.

## Predlog rasporeda za 12 nedelja

Tabela ispod je prethodni radni raspored i traži novu raspodelu vremena za sve potvrđene pregledne teme. Svaki red predstavlja jedno predavanje od 90 minuta sa pripremljenim demonstracijama, pitalicama i obrazloženjima. Za već poznate petlje i funkcije objašnjava se JS zapis i razlike u ponašanju. Konačan plan neće biti sled časova posvećenih pisanju aplikacije.

| Nedelja | Osnove pre pitanja | Demonstracija i očekivano razumevanje |
|---|---|---|
| 1 | Internet i Web; browser i server; URL; HTML elementi; osnovni CSS; Console i Network panel | Mala stranica. Student pronalazi zahtev za dokument i pokazuje status, zaglavlja i telo odgovora. Server za sada obezbeđuje nastavnik. |
| 2 | JS vrednosti, tipovi, `let`/`const`, operatori, `===`, uslovi, petlje, funkcije, parametri i povratna vrednost; nizovi i obični objekti | Kratak program obrađuje listu beleški. Student menja funkciju i objašnjava rezultat bez novih browser API-ja. |
| 3 | DOM, izbor elementa, `textContent`, callback funkcija, događaj, forma, `preventDefault` | Dodavanje beleške na stranicu bez mreže. Student objašnjava razliku između definisanja funkcije i njenog pozivanja na klik. |
| 4 | Browser runtime naspram Node runtime-a; pokretanje programa; modul; port; HTTP metod, putanja, status, headers, body | Nastavnik vodi izradu minimalnog Node servera: HTML ruta i JSON ruta. Student menja odgovor i u Network panelu povezuje zahtev sa serverskim logom. |
| 5 | JSON tekst naspram JS objekta; čekanje rezultata, Promise, `async`/`await`, `try/catch`, `response.ok` | Klik poziva `GET /api/notes`; rezultat menja DOM. Student razlikuje mrežni neuspeh od HTTP 404/500. |
| 6 | Forma → objekat → JSON telo; POST; parsiranje tela, validacija; 201/400/404; stanje u memoriji procesa | Promena stanja preko API-ja i ponovno učitavanje. Student objašnjava zašto podaci nestaju restartovanjem servera. Pripremljen mali Node.js handler prikuplja telo i parsira JSON; svaki korišćeni koncept objašnjava se pre pitanja. |
| 7 | Trajno čuvanje; proces baze, port i kredencijali; image, container i volume; jedan SELECT i INSERT | Nastavnik pokreće unapred pripremljenu bazu kroz Docker i povezuje postojeću rutu parametrizovanim upitom. Objasniti da trajnost zavisi od mesta čuvanja podataka, ne od samog postojanja kontejnera. Student razlikuje DOM, memoriju servera i trajne podatke. Bez kursa SQL-a ili administracije Docker-a. |
| 8 | Leksički scope, reference, closure; moduli; zatim tajmeri i osnovni redosled izvršavanja | Sinhroni brojač demonstrira closure; tek zatim `var`/`let` + timer primer. Student objašnjava binding, a ne samo pamti izlaz. Microtask detalji su proširenje. |
| 9 | Origin, same-origin policy i CORS; granica poverenja i validacija; XSS i bezbedan prikaz teksta | Uporediti isti zahtev ka istom i drugom origin-u. Pokazati da browser ograničava pristup odgovoru i da CORS nije sistem dozvola za korisnike. Detaljan CORS preflight ostaje proširenje. |
| 10 | Identitet, dozvola pristupa, cookie i serverska sesija; HTTPS koncept | Na pripremljenoj aplikaciji pokazati sesiju i odbijanje tuđe izmene. Ne graditi ceo login sistem niti sopstvenu kriptografiju. Student razlikuje autentifikaciju, autorizaciju i zaštitu prenosa. |
| 11 | Jedan deployment; konfiguracija i logovi; granice poverenja centralnog sistema i više nezavisnih strana | Oko 60 minuta za deployment i objašnjen otkaz postojeće aplikacije; 20 minuta za izdvojeni pregled blockchain-a i poređenje sa bazom i audit logom; 10 minuta za povezivanje i proveru. Blockchain nije dodatak aplikaciji niti uvod u implementaciju konsenzusa. |
| 12 | Integracija celog toka; opciono osnovni TS | Obaveznih 60 minuta: GET/POST od DOM-a do baze, greške i rekapitulacija. Preostalih 30 minuta: uvod u inference, tip objekta i funkcije, compile-time naspram runtime-a na postojećem primeru. Ako HTTP ostaje nejasan, tih 30 minuta koristiti za njega, a TS izdvojiti u dopunsko čitanje. |

Ovo je raspored za konceptualno razumevanje uz male demonstracije. Osamnaest sati predavanja nije dovoljno za dubok JS, detaljne baze, bezbednost, infrastrukturu i napredni TS. Iz obaveznog obima izostaviti mapped/conditional tipove, `infer`, detalje QUIC-a, Kubernetes, distribuirani tracing i izradu real-time sistema. Prototipove objasniti kratkim poređenjem sa poznatim OOP modelom, bez zasebne velike celine. Blockchain ostaje kratka samostalna tema samo ako je takav pregled željen.

## Kako uvesti closure bez preskakanja

1. Objasniti promenljivu, funkciju i sinhroni redosled poziva.
2. Objasniti lokalni i spoljašnji scope.
3. Pokazati funkciju koja vraća funkciju, pa brojač koji pamti vrednost između poziva.
4. Dati sličan sinhroni zadatak.
5. Posebno objasniti callback i tajmer: registracija sada, izvršavanje kasnije.
6. Ponoviti običnu `for` petlju i razliku `var`/`let` opsega; objasniti vezivanje promenljive po iteraciji.
7. Tek tada postaviti postojeću `for` + `setTimeout` pitalicu i tražiti obrazloženje.

Closure i timer nisu isti koncept. Sinhroni primer omogućava da se prvi razume bez istovremenog učenja drugog.

## Najmanji smisleni HTTP primer

Jedna Node aplikacija služi stranicu i `/api/message` sa istog origin-a. Najpre browser navigacijom otvara JSON rutu; tada `fetch` i asinhrona sintaksa još nisu potrebni. Posle uvoda u callback i Promise, dugme na stranici radi `fetch('/api/message')`, čita JSON i menja `textContent`.

Na tabli i u alatima pratiti isti tok: klik → JS handler → HTTP zahtev → Node handler → HTTP odgovor → JS podatak → DOM. Za svaki korak označiti gde se kod izvršava. Zatim dodati samo jednu promenu: POST sa tekstom beleške. CORS uvoditi tek kada se objasni origin i pokaže drugi origin; početni primer ga ne zahteva.

Demonstracija i pitanja na predavanju treba da omoguće studentu da pokaže metod i URL, status odgovora, `Content-Type`, telo zahteva i telo odgovora, i da svojim rečima objasni zašto izmena objekta u browseru sama ne menja podatke na serveru. Organizacija vežbi ostaje van ovog dokumenta.

## Predloženi obrazac časa

Predložena raspodela 90 minuta: 10 minuta obnavljanja i motivacije → 25 minuta osnova → 25 minuta demonstracije u malim koracima → 15 minuta objašnjene komplikacije → 10 minuta pitanja za proveru → 5 minuta povezivanja sa narednim predavanjem. Raspodela je orijentaciona; nedelje 11 i 12 imaju posebno navedene blokove. Kratko predviđanje rezultata ili objašnjenje dijagrama jeste deo predavanja; plan samostalnih programerskih vežbi nije uključen.

Pre svake pitalice proveriti: da li su uvedeni svi simboli, API-ji i pravila potrebni da student obrazloži odgovor? Ako nisu, dodati osnovu ili pomeriti pitanje. Ne tražiti da student izvede naziv ili ponašanje nepoznatog protokola pogađanjem.

## Otvorene odluke za drugi krug razgovora

1. Koji je zajednički primer? Beleške su odbačene. Novi predlog je mala potezna 2D igra; videti [izbor aplikacije](predlog-2d-igre.md). Real-time multiplayer nije potreban za demonstraciju HTTP komunikacije.
2. Pregledne teme su potvrđene: sve iz uporednog spiska treba kratko pomenuti; blockchain takođe ostaje zasebna pregledna tema. Kratke blokove rasporediti uz povezane osnovne koncepte. Prethodna ideja o 20 minuta samo za blockchain nije konačna raspodela.
3. Baza je potvrđena: PostgreSQL u Dockeru, uz postojeće SQL predznanje. Na predavanju objasniti vezu Node procesa i baze, parametrizovane upite, konfiguraciju i trajnost podataka. Konkretna šema zavisi od izabrane aplikacije.

Posle odgovora potvrditi zajedničko razumevanje i tek onda prepisati izvorni plan slajdova. Ne planirati vežbe niti ocenjivanje u ovom prolazu.
