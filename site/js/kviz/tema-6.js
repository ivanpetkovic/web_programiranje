import { izbor } from "../kviz-oblik.js";

function kod(jezik, telo) {
  const linije = telo.replace(/^\n/, "").replace(/\s+$/, "").split("\n");
  const uvlaka = linije
    .filter((linija) => linija.trim())
    .reduce((najmanje, linija) => Math.min(najmanje, linija.match(/^ */)[0].length), Infinity);
  const teloBez = linije.map((linija) => linija.slice(uvlaka)).join("\n");
  return "```" + jezik + "\n" + teloBez + "\n```";
}

export const pitanja = [
  izbor(6, 0, 1, "Potrebno je napraviti program koji svake noći pročita lokalnu JSON datoteku, izračuna statistiku i upiše izveštaj. Ne treba da prima mrežne zahteve. Koji pristup ima najviše smisla?", [
    ["A", "Pokrenuti JavaScript skriptu u Node.js-u i koristiti API za rad sa datotekama.", true],
    ["B", "Pokrenuti Express server, jer Node.js može da izvršava samo HTTP handlere.", false],
    ["C", "Napisati HTML stranicu, jer se JavaScript izvršava isključivo u browseru.", false],
    ["D", "Otvoriti HTTP port, jer bez porta JavaScript nema pristup lokalnim datotekama.", false],
  ], "Node.js je izvršno okruženje za JavaScript, ne nužno Web server. Program može biti obična skripta koja koristi `node:fs`."),
  izbor(6, 0, 2, "Pokrenuli smo `node obrada.js`. Program izračuna rezultat, ispiše ga i završi se. Zašto to nije Web server?", [
    ["A", "Zato što se Node.js Web programi mogu pokretati samo preko `npm start`.", false],
    ["B", "Zato što nije registrovana obrada pristiglih mrežnih zahteva niti pokrenuto osluškivanje.", true],
    ["C", "Zato što JavaScript nema mogućnost da prima mrežne podatke.", false],
    ["D", "Zato što svaki Web server mora da isporučuje HTML datoteke.", false],
  ], "Pokretanje Node procesa nije isto što i pokretanje Web servera. Aplikacija mora da prihvata i obrađuje zahteve na mrežnom odredištu."),
  izbor(6, 0, 3, "Isti JavaScript kod koristi `document.querySelector(...)`. U browseru radi, a pri pokretanju u običnom Node.js procesu prijavljuje da `document` nije definisan. Koje objašnjenje najbolje odgovara problemu?", [
    ["A", "Potrebno je samo instalirati npm paket `document`, jer svaka Node.js aplikacija dobija DOM preko npm-a.", false],
    ["B", "Problem nastaje jer JavaScript u Node.js-u ne podržava `querySelector`, iako globalni objekat `document` postoji.", false],
    ["C", "DOM API daje browser, a običan Node.js proces ga ne obezbeđuje.", true],
    ["D", "Problem nestaje ako u `package.json` postavimo `\"type\": \"module\"`.", false],
  ], "Jezik je isti, ali izvršna okruženja nude različite dodatne API-je. DOM nije deo samog JavaScript jezika."),
  izbor(6, 1, 4, "Projekat sadrži ES modul `server.js` i želi da koristi ugrađeni Node HTTP modul. Koji je najprikladniji sledeći korak?", [
    ["A", "Prvo instalirati `http` preko npm-a, pa ga uvoziti kao lokalnu datoteku.", false],
    ["B", "Uvoziti `node:http`, jer dolazi uz Node.js i ne zahteva poseban npm paket.", true],
    ["C", "Uvoziti `express`, jer on u potpunosti zamenjuje ugrađeni HTTP modul.", false],
    ["D", "Ugrađeni HTTP modul može da se učita samo pomoću `require`, pa se ne može koristiti u ES modulu.", false],
  ], "`node:http` je ugrađeni modul, dok se Express dodaje kao spoljašnja zavisnost."),
  izbor(6, 1, 5, [
    "U `package.json` postoji:",
    kod("json", `
    {
      "type": "module",
      "scripts": { "start": "node server.js" }
    }
  `),
    "Šta se dešava pri pokretanju `npm start`?",
  ].join("\n\n"), [
    ["A", "Node.js instalira sve zavisnosti pa automatski kreira početnu HTTP rutu.", false],
    ["B", "`npm` menja sadržaj `server.js` u format ES modula.", false],
    ["C", "`npm` izvršava skriptu `node server.js`; ponašanje zavisi od koda u toj datoteci.", true],
    ["D", "Node.js se pokreće kao Web server i bez ikakvog sadržaja datoteke.", false],
  ], "npm skripta je komanda za pokretanje. Da li će program postati server zavisi od njegovog koda."),
  izbor(6, 2, 6, "Na jednom računaru rade dva programa, od kojih jedan sluša TCP port 3000, a drugi 4000. Na adresu tog računara stigne zahtev namenjen portu 3000. Šta se dešava, pod pretpostavkom da je zahtev uspešno primljen?", [
    ["A", "Operativni sistem prosleđuje mrežni saobraćaj procesu čija mrežna utičnica odgovara odredišnoj adresi i portu.", true],
    ["B", "Zahtev se prvo smešta u direktorijum `public`, pa ga jedan od programa naknadno čita.", false],
    ["C", "Oba programa dobijaju zahtev, a zatim čitaju HTTP putanju kako bi se dogovorili ko ga obrađuje.", false],
    ["D", "Operativni sistem bira proces isključivo na osnovu HTTP zaglavlja `Host`, bez obzira na odredišni port.", false],
  ], "IP adresa identifikuje mrežno odredište, a odredišni port pomaže operativnom sistemu da saobraćaj usmeri odgovarajućoj utičnici/procesu. HTTP zahtev se ne snima automatski u folder."),
  izbor(6, 2, 7, "Node.js server je pokrenut sa `server.listen(3000, '127.0.0.1')`. Radi na `http://localhost:3000`, ali drugi računar iz iste lokalne mreže ne uspeva da mu pristupi preko LAN adrese servera. Šta najpre proveravamo?", [
    ["A", "Da li port 3000 označava dozvoljeni broj HTTP ruta.", false],
    ["B", "Da li server prihvata samo veze upućene na loopback adresu i da li je potreban drugi bind i odgovarajuća mrežna dozvola.", true],
    ["C", "Da li klijent šalje `GET`, pošto se drugi HTTP metodi ne koriste preko lokalne mreže.", false],
    ["D", "Da li treba dodati CORS zaglavlje u odgovor, iako TCP veza do servera ne može da se uspostavi.", false],
  ], "`127.0.0.1` je loopback interfejs. Za pristup preko LAN adrese server mora slušati na odgovarajućem interfejsu, a mrežna pravila moraju dozvoliti vezu."),
  izbor(6, 2, 8, "Aplikacija već radi na računaru unutar kućne mreže, ali treba da joj pristupi klijent sa Interneta. Zašto samo `server.listen(3000)` ne garantuje dostupnost?", [
    ["A", "Zato što HTTP može da se koristi isključivo na portu 80.", false],
    ["B", "Zato što Node.js prihvata zahteve samo sa računara koji su pokrenuli isti JavaScript fajl.", false],
    ["C", "Zato što je potrebno obezbediti spolja dostupnu adresu/putanju do servera i dozvoljen mrežni saobraćaj (npr. NAT prosleđivanje ili posrednički server).", true],
    ["D", "Zato što je dovoljno promeniti port u 80, jer taj port automatski zaobilazi mrežne zabrane.", false],
  ], "Lokalno osluškivanje ne rešava samo po sebi javnu dostupnost. Ruting, NAT, firewall i način izlaganja servera su odvojeni problemi."),
  izbor(6, 2, 9, [
    "Posmatraj kod:",
    kod("js", `
    const server = http.createServer((req, res) => {
      res.end('Zdravo');
    });
    server.listen(3000);
  `),
    "Kada se poziva funkcija `(req, res) => { ... }`?",
  ].join("\n\n"), [
    ["A", "Jednom, kada se izvrši `createServer`, pre početka osluškivanja.", false],
    ["B", "Kada stigne HTTP zahtev koji ovaj server obrađuje.", true],
    ["C", "Za svaku uspostavljenu TCP vezu, čak i ako klijent ne pošalje HTTP zahtev.", false],
    ["D", "Periodično, čak i kada nijedan klijent ne šalje zahteve.", false],
  ], "Prosleđena funkcija obrađuje događaje dolaska HTTP zahteva; `listen` pokreće osluškivanje."),
  izbor(6, 3, 10, [
    "Udaljeni server prima sledeći HTTP zahtev:",
    kod("http", `
    GET /uredjaji?aktivan=true HTTP/1.1
    Host: primer.test
  `),
    "Koja informacija ovom zahtevu govori serveru **šta** klijent želi da uradi, a koja **nad čim**?",
  ].join("\n\n"), [
    ["A", "`Host` određuje operaciju, a `true` broj porta.", false],
    ["B", "`HTTP/1.1` je naziv operacije, a `Host` određuje podatke koje treba promeniti.", false],
    ["C", "`/uredjaji` određuje operaciju, a `GET` naziv datoteke sa podacima.", false],
    ["D", "`GET` određuje zahtevanu operaciju, a `/uredjaji` ciljni resurs; `aktivan=true` su parametri upita.", true],
  ], "Metod, putanja i upit imaju različite uloge. HTTP poruka standardizuje kako se izražava zahtev."),
  izbor(6, 3, 11, [
    "U običnom Node HTTP handleru piše:",
    kod("js", `
    if (req.url === '/uredjaji') {
      res.end('OK');
    }
  `),
    "Zahtev za `/uredjaji?aktivan=true` ne ulazi u ovu granu. Šta je najprimerenija ispravka?",
  ].join("\n\n"), [
    ["A", "Izdvojiti putanju pomoću `new URL(req.url, 'http://localhost').pathname` i uporediti nju.", true],
    ["B", "Koristiti `req.method` umesto `req.url`, jer metoda sadrži putanju.", false],
    ["C", "Ukloniti `?` i sve iza njega iz HTTP protokola, jer upiti nisu deo URL-a.", false],
    ["D", "Koristiti `req.path` umesto `req.url`, jer ga osnovni Node HTTP modul već automatski izdvaja.", false],
  ], "`req.url` sadrži i deo sa parametrima upita. Za rutiranje obično poredimo izdvojenu putanju."),
  izbor(6, 3, 12, [
    "Server šalje:",
    kod("js", `
    res.setHeader('Content-Type', 'application/json');
    res.end('{"status":"radi"}');
  `),
    "Šta je u ovom primeru ključno za to da klijent dobije JSON?",
  ].join("\n\n"), [
    ["A", "Zaglavlje automatski pretvara bilo koju JavaScript vrednost u JSON, pa je tekst nebitan.", false],
    ["B", "HTTP automatski dodaje objekat `status` u svako telo sa tim zaglavljem.", false],
    ["C", "Telo već sadrži JSON tekst, a zaglavlje govori klijentu njegov medijski tip.", true],
    ["D", "`res.end()` automatski proverava poslovna pravila sadržaja odgovora.", false],
  ], "Zaglavlje samo opisuje tip sadržaja. Aplikacija mora zaista da pošalje odgovarajuće bajtove, često preko `JSON.stringify`."),
  izbor(6, 3, 13, "Handler izvrši `res.write('podaci')`, ali nikada ne pozove `res.end()`. Šta klijent može da primeti?", [
    ["A", "Klijent može čekati da se odgovor završi, iako je deo sadržaja već stigao.", true],
    ["B", "Node.js automatski pretvara HTTP odgovor u status 404.", false],
    ["C", "Sledeći pristigli zahtev postaje nastavak tela istog odgovora.", false],
    ["D", "`res.write()` uvek završava HTTP odgovor čim pošalje prvi podatak.", false],
  ], "`res.end()` označava završetak odgovora. Samo pisanje dela podataka ne mora značiti da je odgovor kompletan."),
  izbor(6, 4, 14, "Aplikacija podržava `GET /uredjaji` za čitanje i `POST /uredjaji` za dodavanje uređaja. Šta mora da razlikuje handler kada bira obradu?", [
    ["A", "Samo putanju, jer jedna putanja ne sme da ima više funkcionalnosti.", false],
    ["B", "Samo telo zahteva, jer u njemu uvek piše operacija.", false],
    ["C", "Samo port, jer GET i POST moraju da koriste različite portove.", false],
    ["D", "Najmanje HTTP metodu i putanju, jer se ciljni resurs može obrađivati na različite načine.", true],
  ], "Ista putanja može podržavati više operacija kroz različite metode."),
  izbor(6, 5, 15, "Sistem ima 20.000 uređaja. Treba podržati `/uredjaji/7`, `/uredjaji/8` i sve druge identifikatore. Koji pristup najbolje rešava problem?", [
    ["A", "Registrovati po jednu statičku rutu za svaki uređaj pri pokretanju aplikacije.", false],
    ["B", "Prepoznati zajednički obrazac putanje i izdvojiti promenljivi segment kao identifikator.", true],
    ["C", "Otvoriti po jedan port za svaki uređaj, kako bi putanja ostala jednostavna.", false],
    ["D", "Uvek vraćati kompletnu listu uređaja i tražiti da klijent sam izdvoji jedan.", false],
  ], "Parametarska ruta razdvaja strukturu putanje od konkretne vrednosti identifikatora."),
  izbor(6, 5, 16, "Pretpostavimo da ruter koristi obrazac `/uredjaji/:id`, pri čemu `:id` predstavlja **tačno jedan segment**. Koji zahtev **ne odgovara** tom obrascu?", [
    ["A", "`GET /uredjaji/7`", false],
    ["B", "`GET /uredjaji/abc`", false],
    ["C", "`GET /uredjaji/7/status`", true],
    ["D", "`GET /uredjaji/0`", false],
  ], "Obrazac obuhvata jedan segment iza `/uredjaji/`. Provera da li je ID ispravnog oblika dolazi nakon prepoznavanja rute."),
  izbor(6, 6, 17, "U osnovnom Node HTTP serveru čitamo telo POST zahteva pomoću događaja `data` i `end`. Zašto nije bezbedno pretpostaviti da će ceo JSON stići u **jednom** događaju `data`?", [
    ["A", "Zato što HTTP zabranjuje slanje JSON-a u jednom delu.", false],
    ["B", "Zato što je `data` namenjen samo HTTP zaglavljima.", false],
    ["C", "Zato što tok podataka može da pristigne u više delova; potrebno je prikupiti sadržaj do završetka toka.", true],
    ["D", "Zato što server automatski pretvara svaki deo u poseban HTTP zahtev.", false],
  ], "Granice delova toka nisu granice JSON dokumenta. Potrebni su i ograničenje veličine tela i obrada grešaka."),
  izbor(6, 6, 18, [
    "Aplikacija očekuje uređaj sa `naziv` tipa string i `aktivan` tipa boolean. Primi JSON:",
    kod("json", `
    {"naziv":42,"aktivan":"da"}
  `),
    "`JSON.parse` uspeva. Šta server treba da uradi?",
  ].join("\n\n"), [
    ["A", "Prihvati podatke, jer uspešno parsiranje znači da su polja ispravna.", false],
    ["B", "Pošalje status 500, jer je svaka neispravna vrednost znak kvara servera.", false],
    ["C", "Sačuva vrednosti i prepusti HTTP protokolu da ih naknadno ispravi.", false],
    ["D", "Odbije ulaz prema pravilima API-ja, jer JSON sintaksa jeste ispravna, ali tipovi polja nisu.", true],
  ], "Parsiranje proverava sintaksu JSON-a, dok validacija proverava oblik i smisao podataka za aplikaciju. Ovde je prikladan 400."),
  izbor(6, 6, 19, "Klijent pošalje telo `{\"naziv\":` uz `Content-Type: application/json`. Koji postupak je najprimereniji ako server ne može da parsira telo?", [
    ["A", "Prijaviti klijentsku grešku odgovarajućim 4xx statusom, npr. 400, bez pokušaja kreiranja resursa.", true],
    ["B", "Kreirati uređaj sa praznim nazivom, pa očekivati naknadnu ispravku.", false],
    ["C", "Poslati 500, jer je neispravan JSON greška u implementaciji servera.", false],
    ["D", "Ignorisati telo i nastaviti kao da je poslat ispravan prazan objekat.", false],
  ], "Neispravan JSON je problem sadržaja zahteva, ne neočekivani kvar servera."),
  izbor(6, 7, 20, "Handler ima desetine uslova `if (method === ... && pathname === ...)`. Dodavanje nove rute zahteva izmene istog velikog bloka koda. Šta bi bio najbolji prvi korak u reorganizaciji?", [
    ["A", "Premestiti uslove u browser, koji će serveru slati ime JavaScript funkcije koju želi da pozove.", false],
    ["B", "Prebaciti sve metode na GET kako bi u svakom uslovu ostala samo putanja.", false],
    ["C", "Napraviti registar ruta koji povezuje metodu i obrazac putanje sa odgovarajućim handlerom.", true],
    ["D", "Podeliti API na mnogo portova i preskočiti rutiranje unutar aplikacije.", false],
  ], "Ruter izdvaja mehanizam pronalaženja handlera iz konkretnih poslovnih operacija."),
  izbor(6, 7, 21, "Svaka od 25 ruta mora da upiše vreme i metodu zahteva u log, bez obzira na to kojom se operacijom bavi. Koje rešenje najmanje duplira kod i čuva logovanje odvojeno od poslovnih pravila?", [
    ["A", "Kopirati isti kod za logovanje u svaki handler.", false],
    ["B", "Uvesti zajedničku obradu koja se izvršava pre odgovarajućih ruta.", true],
    ["C", "Dodati logovanje samo u prvu rutu, jer će se ono automatski odnositi na sve ostale.", false],
    ["D", "Skladištiti podatke za logovanje u URL-u svakog klijentskog zahteva.", false],
  ], "Zajednički korak obrade motiviše middleware: jedna odgovornost, korišćena na više ruta."),
  izbor(6, 8, 22, "Tim već ima Node HTTP server i ručno napisani ruter. Raste broj ruta, tipova ulaza i zajedničkih obrada. Šta Express **realno** dodaje?", [
    ["A", "Alate za rutiranje i middleware, dok Node.js i dalje izvršava aplikaciju i obrađuje HTTP komunikaciju.", true],
    ["B", "Automatsku implementaciju poslovnih pravila za sve resurse.", false],
    ["C", "Ugrađenu trajnu bazu podataka i automatske SQL migracije.", false],
    ["D", "Zamenu za HTTP kojom klijent komunicira bez mrežnog protokola.", false],
  ], "Express pojednostavljuje infrastrukturu aplikacije; poslovna logika i perzistencija ostaju zadatak aplikacije."),
  izbor(6, 8, 23, [
    "U Express-u postoji ruta:",
    kod("js", `
    app.get('/uredjaji/:id', (req, res) => {
      const uredjaj = [{ id: 7 }].find(x => x.id === req.params.id);
      res.json({ pronadjen: Boolean(uredjaj) });
    });
  `),
    "Šta vraća `GET /uredjaji/7` i zašto?",
  ].join("\n\n"), [
    ["A", "`{\"pronadjen\":true}`, jer Express automatski pretvara ID u broj.", false],
    ["B", "`{\"pronadjen\":false}`, jer je `req.params.id` string, pa strogo poređenje sa brojem 7 ne uspeva.", true],
    ["C", "`{\"pronadjen\":true}`, jer `===` poredi vrednosti nakon automatske konverzije.", false],
    ["D", "Status 400, jer je brojčani segment zabranjen u Express putanji.", false],
  ], "Parametar rute dolazi kao tekst (`'7'`). Pre poređenja treba ga pretvoriti i validirati, npr. u pozitivan ceo broj."),
  izbor(6, 9, 24, "U Express aplikaciji `app.use(express.json())` registrujemo **posle** POST rute koja pristupa `req.body`. Klijent šalje ispravan JSON sa odgovarajućim `Content-Type`. Šta je problem?", [
    ["A", "Express automatski vraća 404 jer sve rute moraju biti registrovane nakon middleware-a.", false],
    ["B", "`express.json()` pretvara POST u GET i time menja izabranu rutu.", false],
    ["C", "Handler se može izvršiti pre parsera, pa `req.body` neće biti popunjen tim middleware-om.", true],
    ["D", "JSON parser se primenjuje samo na odgovore servera, ne na pristigle zahteve.", false],
  ], "Redosled registracije je bitan. Parser mora da se izvrši pre handlera koji koristi parsirano telo."),
  izbor(6, 9, 25, [
    "Middleware izgleda ovako:",
    kod("js", `
    app.use((req, res, next) => {
      console.log(req.method, req.path);
    });
  `),
    "Rute registrovane kasnije ne dobijaju zahtev. Koja ispravka odgovara nameri da se samo loguje i nastavi obrada?",
  ].join("\n\n"), [
    ["A", "Pozvati `next()` nakon logovanja.", true],
    ["B", "Pozvati `res.end()` i zatim očekivati da se izvrši ruta.", false],
    ["C", "Promeniti `app.use` u `app.listen` unutar middleware-a.", false],
    ["D", "Ponovo poslati isti zahtev iz browsera kako bi preskočio middleware.", false],
  ], "Middleware koji nije završio odgovor treba da preda kontrolu sledećem koraku."),
  izbor(6, 9, 26, [
    "Pretpostavimo sledeći redosled:",
    kod("js", `
    app.use((req, res, next) => {
      console.log('A');
      next();
    });
    app.get('/x', (req, res) => res.send('X'));
    app.use((req, res, next) => {
      console.log('B');
      next();
    });
  `),
    "Šta se ispisuje u konzoli za `GET /x`, ako nema drugih middleware-a?",
  ].join("\n\n"), [
    ["A", "`A`, zatim `B`, jer se svaki registrovani middleware uvek izvrši.", false],
    ["B", "Samo `B`, jer Express prvo proverava poslednji registrovani middleware.", false],
    ["C", "Ništa, jer se middleware koristi samo za POST zahteve.", false],
    ["D", "Samo `A`, jer ruta nakon njega završava odgovor i ne predaje obradu dalje.", true],
  ], "Obrada prolazi kroz logger A i zatim rutu koja šalje odgovor. Kasniji middleware B se ne izvršava."),
  izbor(6, 10, 27, "Potrebno je čitanje liste uređaja, kreiranje uređaja i brisanje jednog uređaja. Koji API ima najdosledniji resursni oblik?", [
    ["A", "`GET /uredjaji`, `POST /uredjaji`, `DELETE /uredjaji/:id`", true],
    ["B", "`GET /uredjaji`, `POST /dodaj`, `DELETE /obrisi`", false],
    ["C", "`GET /lista`, `POST /uredjaji/:id`, `GET /obrisi/:id`", false],
    ["D", "`POST /citaj`, `GET /dodaj`, `POST /obrisi`", false],
  ], "Resurs predstavljamo putanjom, a metodom nameru; ovo ne znači da je samo imenovanje ruta dovoljno da API u potpunosti poštuje REST."),
  izbor(6, 10, 28, "Klijent pozove `GET /uredjaji/7` dva puta. Koje ponašanje je najprimerenije za opisani API, pod pretpostavkom da niko drugi nije menjao podatke?", [
    ["A", "Svaki GET treba da poveća broj pregleda unutar samog uređaja jer je čitanje uvek operacija izmene.", false],
    ["B", "Prvi GET treba da vrati podatke, a drugi da kreira novi uređaj kao potvrdu.", false],
    ["C", "Svaki GET treba da obriše prethodni odgovor kako klijent ne bi koristio stare podatke.", false],
    ["D", "Oba GET zahteva treba da pročitaju podatke bez nameravane promene stanja resursa.", true],
  ], "GET je namenjen bezbednom čitanju. Sporedni efekti poput logovanja nisu isto što i zahtevana izmena resursa."),
  izbor(6, 10, 29, "Prvi `DELETE /uredjaji/7` vraća 204, a ponovljeni DELETE vraća 404 zato što uređaj više ne postoji. Da li je prikazana implementacija nužno prekršila idempotentnost DELETE metode?", [
    ["A", "Jeste, jer idempotentnost zahteva identičan statusni kod pri svakom ponavljanju.", false],
    ["B", "Nije, jer je nameravani efekat na stanje resursa posle jednog i više brisanja isti.", true],
    ["C", "Jeste, jer idempotentna metoda ne sme da menja stanje servera.", false],
    ["D", "Nije, ali samo ako klijent prethodno pozove GET.", false],
  ], "Idempotentnost se odnosi na nameravani efekat na stanje, ne na jednakost HTTP odgovora."),
  izbor(6, 10, 30, "Klijent dva puta pošalje isti `POST /uredjaji` sa zahtevom za kreiranje novog uređaja. Server svaki put dodeljuje novi ID. Šta je najverovatniji ishod?", [
    ["A", "Server mora da odbije drugi zahtev jer su POST zahtevi po definiciji idempotentni.", false],
    ["B", "Drugi zahtev će zameniti prvi uređaj jer HTTP automatski prepoznaje duplikate.", false],
    ["C", "Mogu nastati dva uređaja sa različitim ID-jevima, jer POST kreiranje nije samo po sebi idempotentno.", true],
    ["D", "Browser će sprečiti drugi POST pošto je telo potpuno isto.", false],
  ], "Bez posebnog mehanizma za uklanjanje duplikata dva uspešna POST zahteva mogu proizvesti dva resursa."),
  izbor(6, 11, 31, "`POST /uredjaji` uspešno kreira uređaj sa ID-jem 12. Koji odgovor najjasnije saopštava ishod klijentu?", [
    ["A", "`200 OK` sa telom `{\"greska\":\"nije kreirano\"}`.", false],
    ["B", "`204 No Content` sa telom koje sadrži novi uređaj.", false],
    ["C", "`404 Not Found` uz zaglavlje `Location: /uredjaji/12`.", false],
    ["D", "`201 Created` uz podatke o novom uređaju i `Location: /uredjaji/12`.", true],
  ], "Status 201 označava kreiranje, a `Location` pokazuje identifikator/adresu nastalog resursa; telo može prikazati podatke o njemu."),
  izbor(6, 11, 32, "API prihvata samo pozitivne celobrojne ID-jeve. Šta je najprimerenije za sledeće zahteve: `GET /uredjaji/abc` i `GET /uredjaji/999` (pri čemu je 999 ispravan ID, ali ne postoji)?", [
    ["A", "U oba slučaja 500, jer nema pronađenog uređaja.", false],
    ["B", "Za `abc` 400; za `999` 404, prema ugovoru ovog API-ja.", true],
    ["C", "Za `abc` 404; za `999` 400, jer broj koji ne postoji krši sintaksu.", false],
    ["D", "U oba slučaja 200 sa praznim objektom, jer ruta postoji.", false],
  ], "Neispravan oblik identifikatora razlikuje se od ispravno zadatog, ali nepostojećeg resursa. Korišćenje 400 za pogrešan oblik ID-ja je eksplicitni izbor ovog API-ja."),
  izbor(6, 11, 33, [
    "Klijent pozove `GET /uredjaji?aktivan=false`, a kod radi:",
    kod("js", `
    if (req.query.aktivan) {
      // filtriraj aktivne uređaje
    }
  `),
    "Zašto filter može da se uključi iako je klijent zadao `false`, ako je `req.query.aktivan` string `'false'`?",
  ].join("\n\n"), [
    ["A", "Zato što je neprazan string `'false'` u JavaScript-u truthy.", true],
    ["B", "Zato što Express automatski pretvara svaki upitni parametar u boolean `true`.", false],
    ["C", "Zato što `if` u JavaScript-u poredi stringove samo po dužini.", false],
    ["D", "Zato što HTTP standard zabranjuje boolean vrednosti u parametrima upita.", false],
  ], "Ulaz treba eksplicitno parsirati i validirati; string `'false'` nije boolean `false`."),
  izbor(6, 11, 34, "U API-ju je definisano da `PUT /uredjaji/:id` u potpunosti zamenjuje podatke uređaja i zahteva oba polja `naziv` (tekst) i `aktivan` (boolean). Klijent pošalje `{\"naziv\":\"Senzor\"}`. Šta treba uraditi?", [
    ["A", "Sačuvati samo naziv i pretpostaviti da se `aktivan` zadržava, bez obzira na definisani ugovor.", false],
    ["B", "Obrisati uređaj, jer nedostajuće polje automatski znači DELETE.", false],
    ["C", "Odbiti zahtev kao neispravan po ugovoru, npr. sa 400, jer nedostaje obavezno polje.", true],
    ["D", "Vratiti 201, jer se svaka PUT izmena smatra kreiranjem resursa.", false],
  ], "Potpuna zamena prema ovom ugovoru zahteva sve obavezne podatke. Delimične izmene bi trebalo posebno definisati, često preko PATCH."),
  izbor(6, 12, 35, [
    "U Express-u 5 registrovana je ruta:",
    kod("js", `
    app.get('/x', async (req, res) => {
      throw new Error('Kvar');
    });
  `),
    "Šta Express 5 radi sa odbijenim Promise-om iz ove rute?",
  ].join("\n\n"), [
    ["A", "Automatski ponavlja HTTP zahtev sve dok ruta ne uspe.", false],
    ["B", "Prosleđuje grešku mehanizmu za obradu grešaka.", true],
    ["C", "Vraća 200 sa tekstom poruke bez mogućnosti prilagođavanja.", false],
    ["D", "Ignoriše grešku jer `async` funkcije ne mogu da prijave izuzetak.", false],
  ], "Express 5 prosleđuje izuzetke i odbijene Promise-e iz vraćenih asinhronih handlera error middleware-u."),
  izbor(6, 12, 36, [
    "Nakon svih ruta dodat je sledeći middleware:",
    kod("js", `
    app.use((err, req, res, next) => {
      console.error(err);
      res.status(500).json({ greska: 'Interna greška' });
    });
  `),
    "Koja je njegova prvenstvena uloga?",
  ].join("\n\n"), [
    ["A", "Da obradi svaki uspešan GET zahtev pre samih ruta.", false],
    ["B", "Da automatski ispravi neispravne podatke koje je poslao klijent.", false],
    ["C", "Da registruje dodatnu HTTP metodu za pristup serveru.", false],
    ["D", "Da centralizovano obradi prosleđene greške i formira kontrolisan odgovor.", true],
  ], "Express prepoznaje error middleware po četiri argumenta. Takav handler je namenjen toku obrade grešaka, a ne redovnom toku zahteva."),
  izbor(6, 12, 37, "Tokom obrade zahteva neočekivana programska greška izazove izuzetak. Aplikacija radi u produkciji. Koji pristup je najbolji?", [
    ["A", "Odgovoriti sa 400, jer je svaki neuspeh krivica klijenta.", false],
    ["B", "Odgovoriti sa 200 i poljem `uspeh:false`, kako se ne bi remetio HTTP.", false],
    ["C", "Zabeležiti detalje greške na serveru, a klijentu poslati kontrolisan 500 odgovor bez internog stack trace-a.", true],
    ["D", "Vratiti kompletan stack trace sa putanjama datoteka, radi lakšeg otklanjanja greške na klijentu.", false],
  ], "Status 500 razlikuje neočekivani kvar servera od pogrešnog zahteva, a interni detalji ostaju u serverskim logovima."),
  izbor(6, 13, 38, "API čuva listu uređaja u JavaScript nizu. Klijent uspešno napravi novi uređaj pomoću POST-a, a zatim se Node.js proces restartuje. Šta je najverovatnije i koju sledeću komponentu treba uvesti ako podaci moraju da opstanu?", [
    ["A", "Uređaj opstaje, jer HTTP čuva istoriju svih uspešnih POST zahteva; dovoljno je dodati novu rutu.", false],
    ["B", "Uređaj nestaje samo ako klijent prethodno pošalje DELETE; drugačiji mehanizam čuvanja nije potreban.", false],
    ["C", "Uređaj opstaje, jer `express.json()` automatski snima svaki zahtev na disk; potrebna je samo validacija.", false],
    ["D", "Uređaj nestaje iz procesne memorije; potreban je mehanizam trajnog čuvanja, npr. baza podataka.", true],
  ], "Podaci u običnom nizu nisu trajni. Time se prirodno otvara naredna tema o bazama podataka."),
];
