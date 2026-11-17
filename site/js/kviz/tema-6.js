import { izbor } from "../kviz-oblik.js";

export const pitanja = [
  izbor(6, 0, 1, "Koja tvrdnja najpreciznije opisuje Node.js?", [
    ["A", "Framework koji automatski pravi REST rute.", false],
    ["B", "Izvršno okruženje koje omogućava pokretanje JavaScript-a van browsera.", true],
    ["C", "Programski jezik za pisanje servera.", false],
    ["D", "Baza podataka dostupna JavaScript aplikacijama.", false]
  ], "Node.js izvršava JavaScript i obezbeđuje API-je okruženja, ali nije poseban jezik, baza niti Express."),
  izbor(6, 0, 2, "U običnom Node.js procesu izvršava se console.log(typeof document). Šta će najčešće biti ispisano?", [
    ["A", "object", false],
    ["B", "undefined", true],
    ["C", "null", false],
    ["D", "function", false]
  ], "DOM i document standardno pripadaju browseru, ne Node.js izvršnom okruženju."),
  izbor(6, 1, 3, "Projekat ima \"type\": \"module\" u package.json. Kako se u ES modulu uvozi ugrađeni HTTP modul?", [
    ["A", "import http from 'window.http';", false],
    ["B", "import http from 'npm:http';", false],
    ["C", "import http from 'node:http';", true],
    ["D", "import http from './node:http.js';", false]
  ], "node:http označava ugrađeni Node.js modul. Ne zahteva instalaciju ni relativnu putanju."),
  izbor(6, 1, 4, "Šta radi npm install express?", [
    ["A", "Pokreće server.js svaki put kada se zahteva API.", false],
    ["B", "Odmah otvara HTTP port 3000.", false],
    ["C", "Instalira Express kao zavisnost projekta.", true],
    ["D", "Automatski pravi sve REST rute.", false]
  ], "Instaliranje paketa i pokretanje aplikacije su odvojene operacije."),
  izbor(6, 2, 5, "Kada Node.js poziva funkciju prosleđenu u http.createServer((req, res) => { ... })?", [
    ["A", "Jednom prilikom npm install.", false],
    ["B", "Pri obradi pristiglog HTTP zahteva.", true],
    ["C", "Tačno jednom, pri čitanju datoteke.", false],
    ["D", "Samo kada se server ručno restartuje.", false]
  ], "Handler je pozivna funkcija za dolazne HTTP zahteve."),
  izbor(6, 2, 6, "Zašto server poziva res.end()?", [
    ["A", "Da obriše HTTP zaglavlja.", false],
    ["B", "Da zatvori Node.js proces.", false],
    ["C", "Da označi kraj HTTP odgovora.", true],
    ["D", "Da automatski postavi status 404.", false]
  ], "Bez završetka odgovora klijent može čekati nastavak podataka."),
  izbor(6, 2, 7, "Server sluša na portu 3000. Šta je tačno za http://localhost:3000?", [
    ["A", "localhost označava isti računar, a 3000 port.", true],
    ["B", "Broj 3000 označava HTTP status odgovora.", false],
    ["C", "localhost je obavezno ime produkcionog servera.", false],
    ["D", "Port 3000 određuje HTTP metodu.", false]
  ], "Adresa i port određuju mrežno odredište, ne metodu ili status."),
  izbor(6, 3, 8, "Za HTTP zahtev GET /uredjaji?tip=senzor, šta je putanja?", [
    ["A", "/uredjaji", true],
    ["B", "tip=senzor", false],
    ["C", "/uredjaji?tip=senzor", false],
    ["D", "GET", false]
  ], "Parametar tip=senzor pripada upitu, ne putanji."),
  izbor(6, 3, 9, "API primi ispravan zahtev GET /uredjaji/99, ali uređaj 99 ne postoji. Koji odgovor je najprikladniji?", [
    ["A", "200 OK sa tekstom „Nije pronađen“.", false],
    ["B", "500 Internal Server Error.", false],
    ["C", "201 Created.", false],
    ["D", "404 Not Found.", true]
  ], "Zahtev je razumljiv, ali traženi resurs ne postoji."),
  izbor(6, 3, 10, "Šta najpreciznije radi HTTP zaglavlje Content-Type: application/json u odgovoru?", [
    ["A", "Označava medijski tip tela HTTP odgovora.", true],
    ["B", "Garantuje da je svaki objekat u kodu automatski pretvoren u JSON.", false],
    ["C", "Pretvara GET zahtev u POST zahtev.", false],
    ["D", "Određuje port na kome radi server.", false]
  ], "Zaglavlje opisuje sadržaj; samo po sebi ne serijalizuje objekat."),
  izbor(6, 4, 11, "Zašto GET /uredjaji i POST /uredjaji često obrađuju različite funkcije?", [
    ["A", "Zato što moraju koristiti različite portove.", false],
    ["B", "Zato što metoda predstavlja deo nameravane operacije.", true],
    ["C", "Zato što POST ne može da koristi istu putanju kao GET.", false],
    ["D", "Zato što GET ne može da vraća JSON.", false]
  ], "Ruta u praktičnoj HTTP aplikaciji zavisi i od metode i od putanje."),
  izbor(6, 4, 12, "Šta može da se desi kada handler pošalje odgovor sa res.end() pa nastavi da šalje još jedan odgovor?", [
    ["A", "Kod pokušava pisanje posle završetka odgovora i može izazvati grešku.", true],
    ["B", "Node automatski spaja odgovore u JSON niz.", false],
    ["C", "Drugi odgovor se pretvara u novu HTTP rutu.", false],
    ["D", "HTTP metoda se menja u PUT.", false]
  ], "Nakon uspešnog završetka handler treba prekinuti ili ispravno organizovati grane."),
  izbor(6, 5, 13, "Koja putanja se poklapa sa obrascem /uredjaji/:id ako očekujemo jedan segment identifikatora?", [
    ["A", "/uredjaji", false],
    ["B", "/uredjaji/17", true],
    ["C", "/uredjaji?id=17", false],
    ["D", "/uredjaji/17/status/1", false]
  ], "Obrazac ima jedan promenljivi segment posle /uredjaji/."),
  izbor(6, 5, 14, "Zašto je ručno pisanje jednog if za svaki uređaj loše rešenje?", [
    ["A", "Zato što putanje mogu biti parametrizovane umesto da se nabrajaju pojedinačne vrednosti.", true],
    ["B", "Zato što se brojevi ne smeju nalaziti u URL-u.", false],
    ["C", "Zato što je svaki uređaj zaseban server.", false],
    ["D", "Zato što HTTP ne dozvoljava uslove.", false]
  ], "Prepoznaje se obrazac i vrednost promenljivog segmenta."),
  izbor(6, 5, 15, "Zamislimo desetine ruta i ponovljenu proveru metode, putanje i parametara. Koje unapređenje najviše odgovara problemu?", [
    ["A", "Za svaku rutu otvoriti novi port.", false],
    ["B", "Centralizovati prepoznavanje ruta i proslediti zahtev odgovarajućem handleru.", true],
    ["C", "Smestiti sve podatke u HTTP zaglavlja.", false],
    ["D", "Zameniti JSON sa HTML-om.", false]
  ], "Ruter izdvaja tehničko pronalaženje handlera od poslovne obrade."),
  izbor(6, 6, 16, "Gde se tipično nalaze podaci novog uređaja u zahtevu POST /uredjaji?", [
    ["A", "U portu servera.", false],
    ["B", "U telu HTTP zahteva.", true],
    ["C", "U statusnom kodu odgovora.", false],
    ["D", "U nazivu JS datoteke.", false]
  ], "Telo prenosi reprezentaciju podataka koje server treba da obradi."),
  izbor(6, 6, 17, "Zašto JSON.parse('{\"naziv\": 42}') nije dovoljna provera ispravnosti podataka za uređaj čiji naziv mora biti tekst?", [
    ["A", "Zato što JSON ne podržava brojeve.", false],
    ["B", "Zato što JSON.parse radi samo u browseru.", false],
    ["C", "Zato što parsiranje proverava sintaksu, ali ne i poslovna pravila.", true],
    ["D", "Zato što se ne mogu parsirati JSON objekti.", false]
  ], "Dobijeni objekat je validan JSON, ali naziv ima pogrešan tip."),
  izbor(6, 6, 18, "Šta osnovni Node HTTP server pruža za telo dolaznog zahteva?", [
    ["A", "Unapred validiran poslovni objekat.", false],
    ["B", "Već upisan red u bazi podataka.", false],
    ["C", "Automatski obrazac HTML forme.", false],
    ["D", "Tok pristiglih podataka koji aplikacija treba da obradi.", true]
  ], "Telo se čita kao tok; potrebno je parsiranje i kontrola ulaza."),
  izbor(6, 7, 19, "Koji predlog najbolje razdvaja prepoznavanje zahteva od poslovne logike?", [
    ["A", "console.log('Uređaji')", false],
    ["B", "setTimeout(pronadjiUredjaj, 1000)", false],
    ["C", "JSON.stringify(uredjaji)", false],
    ["D", "get('/uredjaji/:id', pronadjiUredjaj)", true]
  ], "Registracija povezuje metodu i obrazac sa namenskom funkcijom."),
  izbor(6, 7, 20, "Trideset ruta treba identično logovanje. Koje je najbolje projektno rešenje?", [
    ["A", "Ukloniti logovanje jer otežava održavanje.", false],
    ["B", "Izdvojiti zajedničku funkciju koja učestvuje u obradi zahteva pre rutera.", true],
    ["C", "Kopirati logovanje u svaku rutu.", false],
    ["D", "Slati HTTP zahtev dva puta da bi drugi služio kao log.", false]
  ], "Centralizovana zajednička obrada smanjuje dupliranje; to motiviše middleware."),
  izbor(6, 8, 21, "Koja tvrdnja o Express-u je tačna?", [
    ["A", "Express je browser ugrađen u Node.js.", false],
    ["B", "Express je sistem za upravljanje relacionom bazom.", false],
    ["C", "Express je zamena za HTTP protokol.", false],
    ["D", "Express je Web framework koji koristi mogućnosti Node.js-a.", true]
  ], "Express organizuje HTTP rute i middleware; Node.js ostaje izvršno okruženje."),
  izbor(6, 8, 22, "U Express ruti /uredjaji/:id, za zahtev /uredjaji/7, vrednost req.params.id je tipa:", [
    ["A", "string", true],
    ["B", "bigint", false],
    ["C", "number", false],
    ["D", "boolean", false]
  ], "Parametri putanje dolaze kao tekst i treba ih eksplicitno konvertovati i validirati."),
  izbor(6, 9, 23, "Middleware u Express-u ne pozove next() i ne pošalje odgovor. Koja posledica je moguća?", [
    ["A", "Sledeća ruta se uvek izvršava bez obzira na middleware.", false],
    ["B", "Express automatski generiše status 201.", false],
    ["C", "HTTP server automatski ponavlja isti POST zahtev.", false],
    ["D", "Zahtev se zaustavlja u tom koraku i klijent ostaje da čeka.", true]
  ], "Middleware treba da završi odgovor ili prepusti obradu dalje."),
  izbor(6, 9, 24, "Zašto app.use(express.json()) postavljamo pre POST handlera koji čita req.body?", [
    ["A", "Zato što se middleware izvršava redom i treba prvo da parsira telo.", true],
    ["B", "Zato što se time dozvoljava pristup DOM-u.", false],
    ["C", "Zato što se tako menjaju svi zahtevi u GET.", false],
    ["D", "Zato što middleware automatski kreira bazu.", false]
  ], "req.body se popunjava nakon odgovarajućeg parsera."),
  izbor(6, 9, 25, "Koju ulogu ima next() u običnom Express middleware-u?", [
    ["A", "Ponovo pokreće ceo Node.js proces.", false],
    ["B", "Pravi novi TCP port za narednu rutu.", false],
    ["C", "Predaje kontrolu sledećem koraku koji odgovara lancu obrade.", true],
    ["D", "Šalje JSON odgovor sa statusom 200.", false]
  ], "next() ne predstavlja automatski slanje odgovora, već nastavak obrade zahteva."),
  izbor(6, 10, 26, "Koji skup ruta najdoslednije predstavlja resurs „uređaji“?", [
    ["A", "GET /uredjaji, POST /insert, DELETE /remove", false],
    ["B", "GET /uredjaji, POST /uredjaji, DELETE /uredjaji/:id", true],
    ["C", "GET /api, POST /api, DELETE /api, bez obzira na resurs", false],
    ["D", "GET /vratiUredjaje, POST /dodajUredjaj, DELETE /izbrisiUredjaj", false]
  ], "Resursno orijentisane putanje koriste imenice, a metoda izražava nameravanu operaciju."),
  izbor(6, 10, 27, "Šta znači da je HTTP metoda DELETE idempotentna po definisanoj semantici?", [
    ["A", "Ponavljanje istog zahteva ima isti nameravani efekat na stanje resursa kao jedan zahtev.", true],
    ["B", "DELETE ne može da promeni stanje servera.", false],
    ["C", "Svaki ponovljeni DELETE obavezno vraća isti statusni kod.", false],
    ["D", "DELETE mora da vrati telo sa obrisanim resursom.", false]
  ], "Idempotentnost nije obećanje identičnog odgovora pri svakom ponavljanju."),
  izbor(6, 10, 28, "Koja tvrdnja razlikuje REST od CRUD-a?", [
    ["A", "CRUD opisuje tipične operacije nad podacima; REST je širi arhitektonski stil.", true],
    ["B", "REST je sinonim za četiri SQL naredbe.", false],
    ["C", "CRUD je mrežni protokol, a REST programski jezik.", false],
    ["D", "CRUD zahteva HTTP, a REST ne može da koristi HTTP.", false]
  ], "REST obuhvata principe i ograničenja interfejsa, ne samo četiri operacije."),
  izbor(6, 10, 29, "Ako DELETE /uredjaji/7 uspe i server ne vraća telo, koji status je prikladan?", [
    ["A", "301 Moved Permanently", false],
    ["B", "204 No Content", true],
    ["C", "201 Created", false],
    ["D", "500 Internal Server Error", false]
  ], "204 označava uspešnu obradu bez tela odgovora."),
  izbor(6, 11, 30, "API dopušta samo pozitivne celobrojne ID-jeve. Za GET /uredjaji/abc najprimereniji odgovor po tom ugovoru je:", [
    ["A", "204 No Content", false],
    ["B", "500 Internal Server Error", false],
    ["C", "201 Created", false],
    ["D", "400 Bad Request", true]
  ], "Zahtev krši deklarisani oblik parametra. U ovom kursu taj slučaj tretiramo kao 400."),
  izbor(6, 11, 31, "U Express-u, šta se događa ako proverimo if (req.query.aktivan) za URL ?aktivan=false, kada je req.query.aktivan string 'false'?", [
    ["A", "JavaScript prijavljuje sintaksnu grešku.", false],
    ["B", "Uslov nije ispunjen jer se string automatski konvertuje u boolean false.", false],
    ["C", "Express pretvara false u numeričku nulu.", false],
    ["D", "Uslov je ispunjen jer je neprazan string truthy.", true]
  ], "Potrebno je eksplicitno proveriti dozvoljene vrednosti, na primer 'true' i 'false'."),
  izbor(6, 11, 32, "Koji status najpreciznije govori da je POST zahtev uspešno kreirao novi resurs?", [
    ["A", "200 OK", false],
    ["B", "201 Created", true],
    ["C", "202 Accepted", false],
    ["D", "204 No Content", false]
  ], "201 konkretno označava kreiranje resursa; 200 može značiti opšti uspeh, ali je manje precizan."),
  izbor(6, 12, 33, "Koje je najkorisnije razdvajanje odgovornosti u većem Express API-ju?", [
    ["A", "Sva pravila u HTML datoteci na serveru.", false],
    ["B", "Poseban Node.js proces za svaku HTTP metodu.", false],
    ["C", "Jedna funkcija koja obavlja rutiranje, validaciju, upis u bazu i formatiranje odgovora.", false],
    ["D", "Ruter za izbor obrade, kontroler za HTTP, servis za poslovna pravila.", true]
  ], "Razdvajanje olakšava promene, testiranje i proširenje aplikacije."),
  izbor(6, 12, 34, "Express 5 ruta je definisana kao app.get('/x', async (req, res) => { throw new Error('kvar'); }). Šta Express 5 radi sa tom greškom?", [
    ["A", "Automatski ponavlja zahtev dok ne uspe.", false],
    ["B", "Ignoriše je jer funkcija ima async.", false],
    ["C", "Pretvara je u status 201.", false],
    ["D", "Prosleđuje je mehanizmu za obradu grešaka.", true]
  ], "Express 5 prosleđuje odbacivanje Promise-a iz vraćenog asinhronog handlera odgovarajućem error middleware-u."),
  izbor(6, 12, 35, "Po čemu Express prepoznaje middleware za obradu grešaka?", [
    ["A", "Po imenu funkcije koje mora biti error.", false],
    ["B", "Po tome što je definisan u posebnom procesu.", false],
    ["C", "Po potpisu sa četiri argumenta (err, req, res, next).", true],
    ["D", "Po tome što koristi samo HTTP GET.", false]
  ], "Error-handling middleware ima četiri parametra i obično se registruje posle ruta."),
  izbor(6, 12, 36, "Neočekivani izuzetak nastao je zbog programske greške. Koje ponašanje je najprimerenije?", [
    ["A", "Vratiti 400 jer svaki problem znači grešku korisnika.", false],
    ["B", "Poslati klijentu kompletan stack trace u produkciji.", false],
    ["C", "Vratiti 200 kako bi klijent nastavio normalno.", false],
    ["D", "Zabeležiti grešku na serveru i vratiti kontrolisan odgovor sa statusom 500.", true]
  ], "Interni detalji nisu namenjeni klijentu; status mora da razlikuje kvar servera od lošeg zahteva."),
  izbor(6, 13, 37, "API pamti uređaje samo u JS nizu. Šta se uobičajeno dešava sa podacima dodatim tokom rada kada restartujemo proces?", [
    ["A", "Podaci dodati u memoriji se gube.", true],
    ["B", "HTTP pamti prethodne POST zahteve i rekonstruše stanje.", false],
    ["C", "Node.js ih automatski prenosi u PostgreSQL.", false],
    ["D", "Express ih automatski vraća iz kolačića.", false]
  ], "Obična procesna memorija nije trajno skladište; to je motivacija za bazu podataka."),
  izbor(6, 13, 38, "Koji redosled najbolje opisuje obradu POST /uredjaji u Express aplikaciji sa JSON parserom?", [
    ["A", "Handler se izvršava pre dolaska zahteva, pa Node.js automatski upisuje podatke.", false],
    ["B", "Node HTTP primi zahtev, Express middleware parsira telo, handler validira podatke, server šalje odgovor.", true],
    ["C", "Express kreira bazu, HTTP menja JSON u SQL, browser šalje status.", false],
    ["D", "Browser renderuje DOM, ruter otvara port, HTTP određuje poslovna pravila.", false]
  ], "Node.js prima zahtev, Express vodi kroz middleware i rutu, a aplikacija odlučuje o validaciji i odgovoru."),
];
