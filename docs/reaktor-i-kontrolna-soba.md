# Reaktor i Kontrolna soba kao primeri za predavanja

Status: izabrana je Kontrolna soba. Poređenje sa Reaktorom je sačuvano kao obrazloženje izbora; važeći raspored je u [glavnom planu](../web_programiranje_interaktivni_kurs_predlog.md). Ovo nije plan vežbi. Predavanja traju 10 × 90 minuta. Studenti znaju OOP, algoritme i SQL; strukture podataka uče paralelno. Koriste se vanilla HTML/CSS/JS i Node.js bez Express-a, React-a ili Next.js-a. PostgreSQL radi u Dockeru; za vezu Node-a i baze potreban je drajver.

## Zajednički nastavni princip

Osnove → kratka demonstracija → pitanje sa nekoliko razumnih odgovora → obrazloženje svake mogućnosti → jedna promena uslova. Na primer, prvo se objasne zahtev, obrada i odgovor; tek onda se pita šta znači kada odgovor ne stigne. Pripremljen ekran, Network panel, dijagram i kratki isečci koda dovoljni su za većinu demonstracija.

Za oba primera ista osovina je: korisnička akcija → DOM događaj → HTTP zahtev → Node handler → provera i promena stanja → PostgreSQL → odgovor → ažuriranje prikaza. Baza se uvodi tek nakon verzije sa stanjem u memoriji. Browser i server su odvojena izvršna okruženja iako koriste isti jezik.

## 1. Reaktor: potezna logička igra

### Šta igrač vidi i radi

Tabla od 3 × 3 ćelije predstavlja devet energetskih modula. Svaka ćelija je aktivna ili ugašena. Klik menja stanje izabrane ćelije i njenih neposrednih suseda gore, dole, levo i desno; dijagonale se ne menjaju. Cilj je ugasiti sve ćelije sa što manje poteza. Stanje se označava bojom, simbolom i tekstom, tako da razumevanje ne zavisi samo od boje.

U prvoj demonstraciji dovoljno je uključiti centralnu ćeliju i njena četiri suseda: jedan klik u centar rešava nivo i jasno pokazuje pravilo. Kasnije se koristi jedan pripremljen teži nivo. Rešiv početni raspored može se dobiti primenom poznate sekvence klikova na ugašenu tablu; nastavnik ne mora uvoditi algoritam rešavanja ili traženja optimalne putanje. Obrnuta sekvenca vraća ugašeno stanje jer isti klik dva puta poništava promenu.

Ekran sadrži tablu, broj poteza, status partije i dugmad „Nova partija” i „Nastavi”. Osnovni primer nema tajmer koji ograničava igru, kontinuiranu animaciju ili više igrača. Ćelije mogu biti obična HTML dugmad u CSS Grid-u.

### Šta rade browser, server i baza

- Browser prikazuje tablu i šalje identifikator izabrane ćelije.
- Server poseduje merodavno stanje partije, proverava unos i pravo pristupa, primenjuje pravilo i određuje završetak.
- Baza čuva partiju: identifikator, stanje table, broj poteza, status i vezu sa sesijom. Razrada naloga i rang-liste je odvojena nadogradnja.

Minimalni ugovor: `POST /api/games` počinje partiju; `GET /api/games/:id` vraća stanje; `POST /api/games/:id/moves` sa `{ "cell": 4 }` primenjuje potez. Browser ne šalje proizvoljno „novo stanje” koje server slepo prihvata. U jednostavnoj demonstraciji UI čeka potvrdu pre sledećeg poteza.

### Pitalice i rezon

| Prethodno objašnjene osnove | Pitalica | Obrazloženje |
|---|---|---|
| DOM, stanje objekta i renderovanje | U DevTools-u smo sve ćelije obojili kao ugašene. Da li je partija završena? | Prikaz može odstupiti od podataka. Server proverava završetak prema svom stanju. |
| HTTP zahtev i odgovor | Klik je obrađen, ali odgovor nije stigao. Smemo li automatski ponoviti zahtev? | Ponovljeni potez ponovo menja ćelije. Nepostojanje odgovora ne dokazuje da promena nije izvršena. Identifikator komande i prepoznavanje duplikata uvode se kao rešenje tek nakon problema. |
| Asinhronost i Promise | Da li odmah prikazati promenu ili čekati server? | Čekanje je jednostavnije i pokazuje latenciju; optimistički prikaz je brži, ali zahteva usklađivanje kada server odbije potez. |
| Identifikator resursa, sesija i dozvola | Ako pogodimo ID tuđe partije, smemo li poslati potez? | ID određuje resurs; server zasebno proverava pravo pristupa. |
| Memorija procesa i baza | Koje stanje ostaje posle restartovanja Node procesa? | Samo ono koje je trajno sačuvano i ponovo učitano. Docker kontejner sam po sebi ne definiše trajnost. |
| Razdvojeno stanje u dva browser taba | Dva taba prikazuju različite table. Kojoj verujemo? | Prikaz može zastareti. Uvod u verziju stanja i ponovno učitavanje; zaštita od konkurentnih izmena nije automatski rešena. |

Za prvi čas sa ponavljanjem zahteva nije potrebno implementirati kompletnu deduplikaciju. Dovoljno je pokazati pogrešan rezultat, objasniti uzrok i nacrtati ugovor koji bi rešio problem.

### Prednosti i granice

Pravilo staje u nekoliko rečenica, promena je vizuelno očigledna, a ponovljen zahtev ima neočekivanu ali razumljivu posledicu. Primer dobro pokriva osnovni JS, DOM, događaje, asinhronost, HTTP, validaciju, stanje, trajnost i ovlašćenja.

Polling, tok događaja sa servera, složenije forme, spoljašnji API-ji i različite uloge nisu naročito potrebni jednoj partiji. Mogu se objasniti odvojeno. Postoji opasnost da diskusija ode ka rešavanju zagonetke; na predavanju se koristi mali poznati nivo, bez takmičenja u pronalaženju rešenja.

## 2. Kontrolna soba: simulacija upravljanja staklenikom

### Šta korisnik vidi i radi

Ovo je prvenstveno simulacija i komandni panel. Može dobiti pravila igre: održati temperaturu i vlažnost u zadatim opsezima uz ograničen broj uključenja uređaja. Dovoljna je jedna prostorija prikazana kao jednostavan 2D tlocrt, dve vrednosti senzora, ventilator i pumpa. Ne uvoditi više prostorija dok osnovni tok nije objašnjen.

Korisnik vidi očitavanja sa vremenom poslednjeg ažuriranja, stanje uređaja, dugmad za promenu stanja i kratku istoriju komandi. Parametri su izmišljeni za nastavu; simulacija ne tvrdi da fizički verno modeluje biljke, ventilaciju ili stvarne uređaje.

Početna verzija napreduje pritiskom na „Sledeći korak”. Time promena ne zavisi od tajmera koji još nije objašnjen. Nakon asinhronosti, nastavnik može pustiti pripremljenu sekvencu senzorskih očitavanja da se menja na serveru. Tajmeri i automatsko osvežavanje uvode se tek tada.

### Šta rade browser, server i baza

- Browser prikazuje poslednja poznata očitavanja i šalje željeno stanje uređaja.
- Server drži stanje simulacije, proverava komande i prava korisnika. Stanje može promeniti drugi korisnik ili simulirani senzor dok je browser neaktivan.
- Baza čuva postavke uređaja i istoriju komandi; mala unapred pripremljena istorija očitavanja dovoljna je za prikaz podataka.

Minimalni ugovor: `GET /api/room` vraća trenutno stanje; `PUT /api/devices/fan/state` sa `{ "enabled": true }` postavlja stanje ventilatora; `GET /api/commands` vraća istoriju. Ruta se ne mora odmah uvoditi kao REST teorija: prvo pokazati konkretan zahtev, pa imenovati resurs i semantiku metode.

U osnovnoj simulaciji server neposredno primenjuje stanje uređaja. Razlika „komanda prihvaćena” i „fizički uređaj potvrdio” može biti kasniji misaoni scenario, jasno označen kao proširenje. Nije potrebno uvoditi hardver, MQTT ili drugi protokol.

### Pitalice i rezon

| Prethodno objašnjene osnove | Pitalica | Obrazloženje |
|---|---|---|
| Browser prikazuje podatke iz odgovora | Ekran kaže 24 °C, a poslednji odgovor stigao je pre deset minuta. Šta stvarno znamo? | Znamo poslednje očitavanje, ne nužno trenutno stanje. Vreme ažuriranja i oznaka zastarelosti imaju značenje. |
| Zahtev, odgovor i ponavljanje | Šta je sigurnije ponoviti: „promeni stanje ventilatora” ili „postavi ventilator na uključeno”? | „Promeni” može poništiti prvi efekat. Ponovljeno postavljanje istog željenog stanja ima isti nameravani efekat. To ne znači da mreža garantuje jednu obradu. |
| Sesija i autorizacija | Posmatrač nema dugme za pumpu. Da li to sprečava da je uključi? | UI nije granica prava pristupa; zahtev može poslati drugačije, pa server proverava ulogu. |
| GET i asinhronost | Kako browser sazna za novu temperaturu bez klika? | Prvo periodično učitavanje; potom poređenje polling-a, SSE-a i WebSocket-a po smeru komunikacije, kašnjenju i složenosti. Ne traži se poznavanje naziva pre uvoda. |
| Dva nezavisna zahteva i redosled završavanja | Stariji zahtev stigne kasnije i prepiše novije očitavanje. Šta se vidi? | Redosled slanja nije dovoljan. Prikaz može nazadovati; proveriti verziju ili relevantnost odgovora. |
| Validacija i parametrizovani SQL | Browser ograničava prag na 35. Može li server ipak dobiti 1000? | Klijentska provera pomaže korisniku; serverska proverava prihvatljivost stvarnog ulaza. |
| Pojam keša i promenljivi podaci | Da li isto keširamo ikonicu ventilatora i trenutno očitavanje? | Različite potrebe za svežinom opravdavaju različite politike keširanja. |

### Prednosti i granice

Uloge „posmatrač” i „operater”, čitanje naspram izmene, zastareli podaci, promene na serveru, istorija i konkurentne komande deluju prirodno. Zato ovaj primer pruža širi kontekst za web komunikaciju i kasnije pregledne teme.

Cena je više pojmova: očitavanje, željeno stanje, komanda i vreme ažuriranja. Ne uvoditi ih sve odjednom. Početak ima samo jedno očitavanje i jedan ventilator; pumpa i istorija dolaze kada su potrebne temi. Cilj igre i bodovanje su opciona motivacija, a ne nova obavezna logika.

## Poređenje prema cilju kursa

| Kriterijum | Reaktor | Kontrolna soba |
|---|---|---|
| Koliko brzo se razume scenario | Vrlo brzo: klik menja ćelije | Brzo uz jedno očitavanje i jedan uređaj |
| Osnovni browser–server tok | Odličan: jedan potez i jedan odgovor | Odličan: čitanje i postavljanje stanja |
| Ponavljanje i idempotentnost | Jasno pokazuje problem ponovljenog poteza | Prirodno poredi komandu i željeno stanje |
| Promene nastale van browsera | Potreban dodatni scenario | Prirodne: senzori i drugi operater |
| Uloge i prava pristupa | Vlasnik partije; ostale uloge su nadogradnja | Posmatrač i operater imaju jasnu razliku |
| Forme, validacija i istorija | Manje zastupljeni | Prirodno prisutni |
| Polling, SSE, WebSocket i keš | Odvojeni pregledni primeri | Nadovezuju se na očitavanja |
| Složenost logike primera | Najmanja | Veća, ali se kontroliše postupnim uvođenjem |
| Osećaj igre | Jasan od početka | Dobija se opcionim ciljem i ograničenjem resursa |

Oba pokrivaju većinu osnovnih mehanizama web aplikacije. Za najkraći put do njihovog razumevanja prednost ima Reaktor. Za širi razgovor o komunikaciji, stanju i posledicama odluka prednost ima Kontrolna soba. Prema potvrđenom cilju predavanja, preporuka je Kontrolna soba sa jednom prostorijom, jednim uređajem i jednim očitavanjem u početnoj verziji.

## Vanilla pristup i obim tehničkih detalja

HTML/CSS/DOM i standardni browser API-ji dovoljni su za oba primera. Node `http` obrađuje zahteve, `URL` pomaže u čitanju putanje i parametara, a mala eksplicitna grananja biraju handler. JSON telo se prikuplja i parsira kroz kratak pripremljen pomoćni kod; potrebno je objasniti da telo može stići u delovima pre prikazivanja tog koda. Ne uvoditi celu biblioteku za rutiranje ili sopstveni framework.

Drajver za PostgreSQL predstavlja tehničku vezu sa bazom. Na predavanju je važan put zahtev → parametrizovani upit → rezultat → odgovor. Ne treba predavati protokol baze ili detalje implementacije drajvera. Sesije, parsiranje i obrada grešaka koriste male pripremljene primere sa jasno objašnjenim ograničenjima; to nisu kompletni produkcioni sistemi.

## Pregledne teme: pomenuti sve, povezati gde ima smisla

Ovaj spisak raspoređuje već utvrđene teme iz [poređenja sa Stanfordom i MIT-om](teme-izvan-igre-izvori.md); ne predstavlja novo istraživanje njihovih programa. Nijednu temu nije potrebno ugraditi u aplikaciju samo da bi bila pomenuta.

| Grupa kratkih osvrta | Veza sa osnovnim gradivom |
|---|---|
| Širi CSS, responsive prikaz, animacije, ikonice, pristupačnost, UI/Figma | Prikaz, tastatura, oznake i čitljivost; kako planiramo ekran pre pisanja |
| URL, History API, SPA, React, hooks/context/router | Prikaz stanja i navigacija; koje ponavljajuće poslove preuzimaju framework-i |
| Spoljni API, MongoDB, Express/middleware | Sopstveni API i PostgreSQL kao poznata osnova; kratko objasniti alternativne odgovornosti i modele |
| Git, saradnja i debugging | Promena poznatog primera, poreklo greške i pregled razlika |
| Autentifikacija preko treće strane, browser izolacija, mrežni i sesijski napadi, injection, phishing, DoS | Identitet, dozvole i granice poverenja; jedan kratak scenario po podgrupi |
| Full-stack stanje, sockets, polling, SSE i WebSocket | Kada se stanje menja i ko saznaje; SSE/polling su naša poredbena dopuna, bez tvrdnje da ih svaki uporedni raspored izričito navodi |
| Deployment, skaliranje, data centri, Next.js/serverless | Gde radi isti program i šta postaje složenije sa više korisnika |
| TS i LLM/AI | Statičke provere i provera predloženog koda; čemu služe i šta ne dokazuju |
| Blockchain | Odvojeno pitanje poverenja više nezavisnih učesnika; bez prisilnog dodavanja u igru |

U glavnom planu pregledni blokovi sada imaju 135 minuta ukupno, raspoređenih kroz semestar i uključenih u postojećih 900 minuta. Osnovne teme poput pristupačnosti i bezbednosti dobijaju i povezane demonstracije u redovnom gradivu. Svaka pitalica zahteva prethodno objašnjenje svojih preduslova.
