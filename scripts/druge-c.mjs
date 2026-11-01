export const drugeC = {
"4:Put klika": [
{pitalica:"Zašto prvi korak posle klika nije novi broj na ekranu?",opcije:[
{key:"A",text:"Zato što browser sam upiše cifre čim vidi klik.",why:"Browser javi događaj. Ne zna koji broj soba treba da pokaže.",ok:false},
{key:"B",text:"Zato što klik prvo stigne u handler, a crtanje je kasniji korak istog puta.",why:"Ishod časa je put, ne jedan poziv koji radi sve.",ok:true}],
analizaPitalice:"Ako se put sabije u „klik znači broj”, ne vidi se gde je stao. Handler postoji da između klika i ekrana ima mesto za stanje."},
{pitalica:"Šta iz jednog handlera koji samo poveća objekat ne sledi?",opcije:[
{key:"A",text:"Da je displej već nov.",why:"Izmena objekta nije upis u DOM. Crtanje je poseban korak.",ok:true},
{key:"B",text:"Da je klik uopšte stigao do koda.",why:"To sledi ako se handler izvršio. Ne sledi da je ekran pratila tu izmenu.",ok:false}],
analizaPitalice:"Ova granica se vraća na koraku Bez crtanja. Ovde se samo imenuje, da put ne počne od piksela."}],
"4:Funkcija": [
{pitalica:"Zašto se naKlik ne zove dok se listener registruje?",opcije:[
{key:"A",text:"Zato što se predaje funkcija, a poziv čeka događaj.",why:"Listener postoji da sačuva šta treba pozvati. Registracija nije klik.",ok:true},
{key:"B",text:"Zato što addEventListener odmah izvrši svaki argument.",why:"Da jeste, broj bi se promenio pre klika. Čeka se događaj.",ok:false}],
analizaPitalice:"Funkcija kao vrednost nastaje da se poziv odloži. Ko je pozove pri registraciji, pomeša pripremu i događaj."}],
"4:Poziv odmah": [
{pitalica:"Zašto klik nema šta da zove ako je u listener stigao rezultat?",opcije:[
{key:"A",text:"Zato što je poziv sa zagradama već potrošen, a undefined nije funkcija.",why:"Listener čuva ono što dobije. Dobio je povratnu vrednost, ne funkciju.",ok:true},
{key:"B",text:"Zato što zagrade samo dokumentuju ime, a funkcija i dalje čeka.",why:"Zagrade jesu poziv. Ne ostavljaju funkciju za kasnije.",ok:false}],
analizaPitalice:"Ovo je ista potreba kao prethodni korak, viđena kroz grešku. Iz „registrovao sam nešto” ne sledi da klik ima funkciju."}],
"4:Event bubbling": [
{pitalica:"Zašto bubble listener na spoljnom čvoru vidi klik na unutrašnjem?",opcije:[
{key:"A",text:"Zato što događaj posle mete ide naviše, pa red postane inner pa outer.",why:"Faze postoje da se jedan klik čuje i na pretku, bez posebnog slušaoca na svakom detetu.",ok:true},
{key:"B",text:"Zato što bubble uvek ide od korena ka meti.",why:"To je capture. Bubble ide obrnuto, zato log nije outer pa inner.",ok:false}],
analizaPitalice:"Bez faza bi svaki prethodnik morao da bude meta. Ko zameni red, ne zna da li je listener na roditelju uopšte trebalo da se oglasi."}],
"4:Stanje": [
{pitalica:"Zašto novi broj u objektu još nije novi ekran?",opcije:[
{key:"A",text:"Zato što je objekat već prikazan, pa se DOM sam uskladi.",why:"Objekat nije ekran. Niko još nije upisao tekst čvora.",ok:false},
{key:"B",text:"Zato što stanje i prikaz stoje odvojeno dok crtaj ne pročita objekat.",why:"Korak menja temperaturu u objektu. Prikaz čeka poseban upis.",ok:true}],
analizaPitalice:"Stanje postoji da program ima istinu pre piksela. Iz polja ne sledi da ga je korisnik već video."}],
"4:Bez crtanja": [
{pitalica:"Šta izostanak crtaj pokazuje, a šta ne?",opcije:[
{key:"A",text:"Pokazuje da je izmena objekta uzaludna i da broj u stanju ostaje star.",why:"Stanje jeste novo. Uzaludan je samo prikaz, koji niko nije osvežio.",ok:false},
{key:"B",text:"Pokazuje star broj na ekranu iako je stanje već novo.",why:"Razlika je dokaz da crtanje nije sporedni efekat dodele.",ok:true}],
analizaPitalice:"Korak postoji kao kontrapunkt. Ko vidi stari displej i zaključi da klik nije radio, traži grešku na pogrešnom mestu."}],
"4:crtaj": [
{pitalica:"Zašto cifre upisuje Displej.crtaj, a ne sam objekat sobe?",opcije:[
{key:"A",text:"Zato što objekat drži broj, a klasa displeja zna koji čvor da promeni.",why:"Crtanje je odluka prikaza. Soba ne zna za DOM.",ok:true},
{key:"B",text:"Zato što objekat sobe jeste čvor, pa dodela polja sama menja tekst.",why:"Polje nije textContent. Bez crtaj ekran ostaje star.",ok:false}],
analizaPitalice:"crtaj postoji da prikaz ima jedno mesto. Ako objekat sam crta, stanje i DOM se opet slepe."}],
"4:Class je sintaksa iznad prototipa": [
{pitalica:"Zašto je metoda na prototipu, a ne sopstveno polje svakog primerka?",opcije:[
{key:"A",text:"Zato što class samo prepisuje metodu u svaki new.",why:"Ispis true kaže da je metoda na prototipu. Primerci je dele.",ok:false},
{key:"B",text:"Zato što je class kraći zapis lanca, a zajednička metoda ne mora da se kopira.",why:"Sintaksa ne uvodi drugi model objekta. Ostaje prototip.",ok:true}],
analizaPitalice:"Ako student iz class zaključi da je prototip nestao, ne ume da objasni true. Sintaksa postoji da se lanac piše kraće, ne da se ukine."}],
"4:Prekidač": [
{pitalica:"Zašto crtaj prekidača ne menja broj temperature?",opcije:[
{key:"A",text:"Zato što svaka klasa crta svoj deo, a natpis željenog stanja nije cifra.",why:"Dva prikaza postoje da se režim i merenje ne pišu u isti čvor.",ok:true},
{key:"B",text:"Zato što prekidač sme da crta samo temperaturu.",why:"Suprotno: ovaj crtaj pomera natpis, ne broj.",ok:false}],
analizaPitalice:"Posebna klasa nastaje da klik na režim ne izgleda kao novo merenje. Iz pomeranja natpisa ne sledi nova temperatura."}],
"4:Forma": [
{pitalica:"Zašto submit bez preventDefault učita dokument iznova?",opcije:[
{key:"A",text:"Zato što je podrazumevana radnja forme navigacija, ne izmena broja u mestu.",why:"Forma postoji za slanje. Bez zaustavljanja, browser napusti tekuću stranu.",ok:true},
{key:"B",text:"Zato što preventDefault sam upisuje temperaturu u fajl.",why:"preventDefault samo sprečava podrazumevano. Ne meri i ne piše broj.",ok:false}],
analizaPitalice:"Ako student vidi reload i zaključi da je stanje sačuvano, pomešao je navigaciju i komandu. Broj na novoj strani je opet onaj iz fajla."},
{pitalica:"Šta preventDefault ovde ne radi?",opcije:[
{key:"A",text:"Ne pretvara formu u komandu ka ventilatoru.",why:"Zaustavljanje navigacije ostavlja stranu. I dalje nema rute ni servera u ovom koraku.",ok:true},
{key:"B",text:"Ne dozvoljava da se ostatak handlera izvrši.",why:"Upravo dozvoljava da kod nastavi na istoj strani. To mu je svrha.",ok:false}],
analizaPitalice:"Granica časa: forma više ne briše prikaz, ali još ne šalje režim."}],
"4:Closure": [
{pitalica:"Zašto unutrašnja funkcija i dalje vidi prag posle povratka granice?",opcije:[
{key:"A",text:"Zato što closure pamti vezu ka pragu, a ne samo kasnije argumente.",why:"Spoljna funkcija je gotova, a unutrašnja i dalje čita ono što je zatvorila.",ok:true},
{key:"B",text:"Zato što se prag kopira u svaki kasniji argument poziva.",why:"Argument kasnijeg poziva je druga vrednost. Prag nije taj argument.",ok:false}],
analizaPitalice:"Closure postoji da pravilo ostane uz funkciju koja ga koristi. Ko traži prag samo među argumentima, ne vidi zašto provera i dalje zna granicu."}],

"5:Cela poruka": [
{pitalica:"Zašto je pretpostavka cele poruke, redom, krhka?",opcije:[
{key:"A",text:"Zato što mreža paketa ne obećava ni celinu ni red, a ovaj prenos to ipak traži.",why:"Naivan model nastaje iz želje da aplikacija vidi jednu poruku. Mreža tu želju ne ispunjava sama.",ok:true},
{key:"B",text:"Zato što delovi smeju da zamene red, pa pretpostavka to već uračunava.",why:"Pretpostavka upravo brani zamenu reda. Zato padne kad red nije zajamčen.",ok:false}],
analizaPitalice:"Korak imenuje pretpostavku pre protokola. Ko je usvoji kao činjenicu mreže, ne vidi zašto TCP uopšte nastaje."}],
"5:Pad pretpostavke": [
{pitalica:"Šta je palo, a šta još nije ni imenovano?",opcije:[
{key:"A",text:"Pao je HTTP status 404.",why:"Status još ne postoji u ovom koraku. Palo je očekivanje o poruci.",ok:false},
{key:"B",text:"Pala je pretpostavka da cela poruka stigne redom. Protokol još nije imenovan.",why:"Pad je razlog da se traži potvrda i red, ne razlog da se krivi status.",ok:true}],
analizaPitalice:"Ako se pad odmah nazove HTTP greškom, preskočen je sloj. Potvrda prijema nastaje iz ove rupe, ne iz statusnog koda."}],
"5:Potvrda": [
{pitalica:"Zašto potvrda ne kaže koji je ventilator uključen?",opcije:[
{key:"A",text:"Zato što potvrda govori koji deo poruke je primljen, ne šta bajt znači u sobi.",why:"Redni broj i potvrda popravljaju prenos. Značenje komande je iznad.",ok:true},
{key:"B",text:"Zato što potvrda stiže tek kad uređaj fizički promeni stanje.",why:"Potvrda prijema nije efekat lopatice. Šalje je primalac bajtova.",ok:false}],
analizaPitalice:"Potvrda postoji da pošiljalac zna šta da ponovi. Iz nje ne sledi uključen ventilator."}],
"5:TCP": [
{pitalica:"Šta pouzdan tok bajtova ne garantuje?",opcije:[
{key:"A",text:"Da će ventilator biti uključen.",why:"TCP ne čita komandu. Garantuje isporuku bajtova redom, ne efekat.",ok:true},
{key:"B",text:"Da bajtovi stignu redom dok veza radi.",why:"To TCP upravo garantuje. Ne garantuje smisao tih bajtova.",ok:false}],
analizaPitalice:"TCP nastaje da pad pretpostavke ne ostane na aplikaciji. Ko iz pouzdanog toka zaključi da je komanda izvršena, vratio se na pogrešan sloj."}],
"5:Putanja i metod čine rutu": [
{pitalica:"Zašto GET ne mora automatski da izmeni temperaturu?",opcije:[
{key:"A",text:"Zato što metod menja značenje, a ugovor i implementacija odlučuju šta je dozvoljeno.",why:"Ista putanja sa drugim metodom nije ista ruta. GET nije prečica za upis.",ok:true},
{key:"B",text:"Zato što PUT uvek menja temperaturu, a GET uvek menja režim.",why:"Nijedan metod sam ne nameće efekat. Server bira koje kombinacije podržava.",ok:false}],
analizaPitalice:"Ruta postoji da metod i putanja zajedno imaju smisao. Iz imena GET ne sledi ni čitanje ni izmena, dok ugovor to ne kaže."},
{pitalica:"Šta bi sledilo iz pravila „svaki PUT menja temperaturu”?",opcije:[
{key:"A",text:"Da ugovor više nije potreban, jer metod sam zna efekat.",why:"To pravilo je lažno. PUT /api/ventilator u ovom kursu ne nosi temperaturu.",ok:true},
{key:"B",text:"Samo da jedna konkretna ruta sme da ima taj efekat ako je tako dogovoreno.",why:"To bi bilo tačno za ugovor, ali ne sledi iz golosti metoda.",ok:false}],
analizaPitalice:"Lažno pravilo briše razliku između metode i rute. Zato nijedan zahtev ne menja temperaturu samim tim što je PUT ili GET."}],
"5:HTTP": [
{pitalica:"Zašto TCP-u treba HTTP da bi GET / imao smisao?",opcije:[
{key:"A",text:"Zato što TCP već nosi redni broj paketa, pa je smisao u tom broju.",why:"Redni broj nije metod ni status. HTTP dodaje šta se traži i kako se odgovor tumači.",ok:false},
{key:"B",text:"Zato što tok bajtova ne kaže gde je zahtev, koji je metod ni koji je status.",why:"HTTP nastaje kao dogovor iznad pouzdanog toka.",ok:true}],
analizaPitalice:"Bez statusa uspešan TCP i dalje ne zna da li je resurs nađen. 404 je smisao, ne redni broj."}],
"5:createServer": [
{pitalica:"Šta ova linija ne otvori?",opcije:[
{key:"A",text:"Ne otvori browser niti port.",why:"Napravi funkciju servera koja će za svaki zahtev zvati obradu. Slušanje je sledeći korak.",ok:true},
{key:"B",text:"Ne napravi objekat koji ume da primi zahtev.",why:"Upravo ga napravi. Ne sledi da je adresa već živa.",ok:false}],
analizaPitalice:"createServer postoji pre listen da se obrada odvoji od otvaranja porta. Ko očekuje stranicu iz te linije, preskače slušanje."}],
"5:listen": [
{pitalica:"Zašto otvoren port nije stranica u browseru?",opcije:[
{key:"A",text:"Zato što listen i otvori karticu.",why:"listen veže port. Niko još nije poslao zahtev.",ok:false},
{key:"B",text:"Zato što port čeka zahtev, a zahtev šalje neko drugi.",why:"Slušanje nije navigacija. Adresa u browseru je poseban korak.",ok:true}],
analizaPitalice:"Ako student posle listen gleda prazan ekran i kaže da server nije radio, traži prikaz tamo gde još nema klijenta."}],
"5:Komanda": [
{pitalica:"Zašto node server/server.js nije CSS sobe?",opcije:[
{key:"A",text:"Zato što komanda pokrene proces koji sluša port, a stil ostaje fajl browsera.",why:"Proces i dokument su različiti programi. Jedna komanda ne crta sobu.",ok:true},
{key:"B",text:"Zato što Node otvori browser i učita stil umesto servera.",why:"Komanda ne otvara browser. Browser je i dalje poseban korak.",ok:false}],
analizaPitalice:"Komanda postoji da proces uopšte živi. Iz nje ne sledi da je čitanje sobe već prikazano."}],
"5:Konkurentni zahtevi": [
{pitalica:"Zašto dugo računanje u handleru može da zaustavi sledeći zahtev?",opcije:[
{key:"A",text:"Zato što event loop izvršava JavaScript na jednom toku, pa CPU rad bez predaha drži red.",why:"Node ne pokreće novi JS thread po zahtevu. Blokada je u tom toku.",ok:true},
{key:"B",text:"Zato što TCP sam prekine spor handler i time reši čekanje.",why:"TCP ne ubrzava JavaScript. Dok handler računa, drugi događaji čekaju.",ok:false}],
analizaPitalice:"Konkurentnost ovde nije „jedan thread po zahtevu”. Nastaje iz reda događaja. Ko doda tešku petlju, vidi zastoj iako je mreža živa."}],
"5:Adresa": [
{pitalica:"Zašto čas prvo otvara adresu, a ne fetch iz koda stranice?",opcije:[
{key:"A",text:"Zato što adresa u browseru ne važi kao HTTP zahtev.",why:"Važi. Isti odgovor će kasnije doći i iz koda. Red je da se telo vidi pre klijentskog poziva.",ok:false},
{key:"B",text:"Zato što treba videti JSON tekst pre nego što ga stranica sakrije u prikaz.",why:"Direktno čitanje pokazuje šta ruta vraća, bez DOM-a kao posrednika.",ok:true}],
analizaPitalice:"Adresa postoji kao najtanji klijent. Ko krene od fetch-a, ne vidi da je odgovor već bio tu."}],
"5:Ruta": [
{pitalica:"Zašto nepoznata putanja ne vrati isti JSON da panel ne pukne?",opcije:[
{key:"A",text:"Zato što 404 kaže da ruta nije podržana, a lažan JSON bi sakrio grešku.",why:"Poznata putanja nosi temperaturu i režim. Ostale moraju da se razlikuju.",ok:true},
{key:"B",text:"Zato što svaki status osim 200 ruši proces.",why:"404 je odgovor, ne pad procesa. Panel sme da vidi razliku.",ok:false}],
analizaPitalice:"404 postoji da se pogrešna putanja ne pretvori u izmišljenu sobu. Mekši JSON bi učinio dijagnozu nemogućom."}],
"5:JSON tekst, ne objekat": [
{pitalica:"Zašto je pre parse-a tip string?",opcije:[
{key:"A",text:"Zato što je JSON na žici tekst, a objekat nastaje tek kad se tekst protumači.",why:"typeof pre i posle to pokazuje: string, pa object.",ok:true},
{key:"B",text:"Zato što JSON.parse pretvara tekst u broj temperature i ništa više.",why:"Posle parse-a tip je object, ne number. Broj je polje, ako ugovor tako kaže.",ok:false}],
analizaPitalice:"Parse postoji jer mreža ne prenosi referencu. Ko pošalje objekat u glavi, ne vidi zašto je prvi typeof string."},
{pitalica:"Šta iz uspešnog parse-a ne sledi?",opcije:[
{key:"A",text:"Da telo jeste tražena soba, sa ispravnim poljima.",why:"Parse kaže da je tekst bio JSON. Ne kaže da ugovor važi.",ok:true},
{key:"B",text:"Da tekst više nije sirov niz znakova u toj promenljivoj.",why:"To sledi: vrednost posle parse-a nije onaj string.",ok:false}],
analizaPitalice:"Validacija dolazi kasnije baš zato što parse nije ugovor. Objekat pogrešnog oblika i dalje jeste objekat."}],
"5:Odgovor kao JSON tekst": [
{pitalica:"Zašto handler ne pošalje objekat iz memorije?",opcije:[
{key:"A",text:"Zato što preko mreže ide tekst i zaglavlje medijskog tipa, ne referenca.",why:"application/json opisuje telo. Browser i dalje mora da ga protumači.",ok:true},
{key:"B",text:"Zato što zaglavlje zamenjuje telo, pa se JSON ne šalje.",why:"Zaglavlje opisuje telo. Ne stoji umesto njega.",ok:false}],
analizaPitalice:"Ako student veruje da browser „dobije objekat”, preskočiće i parse i pogrešan medijski tip."}],
"5:Bez Err": [
{pitalica:"Zašto neuspeh na ovom času ostavlja crte, a ne reč Err?",opcije:[
{key:"A",text:"Zato što crte znače da čitanje nema broj za upis, a Err je kasnija grana prikaza.",why:"Displej još ne razlikuje vrste neuspeha slovima. Sledeći korak na klijentu više nije izvor temperature.",ok:true},
{key:"B",text:"Zato što crte znače da je server vratio temperaturu 0.",why:"Crte nisu cifra. Nisu ni nula ni Err.",ok:false}],
analizaPitalice:"Crte postoje da prazan prikaz ne izgleda kao uspeh. Ko upiše Err ovde, uvodi stanje koje čas još nije odvojio."}],

"6:Tri stanja": [
{pitalica:"Zašto displej nema samo cifre?",opcije:[
{key:"A",text:"Zato što čekanje i neuspeh nisu uspešno merenje, pa moraju da se vide drugačije.",why:"Tri stanja nastaju da ekran ne laže da broj važi i dok ga nema.",ok:true},
{key:"B",text:"Zato što server šalje tri temperature odjednom.",why:"Server šalje odgovor. Tri stanja su prikaz klijenta, ne tri merenja.",ok:false}],
analizaPitalice:"Jedno stanje „uvek cifre” briše razliku između starog broja, čekanja i greške. Zato ih ima tri."}],
"6:200": [
{pitalica:"Zašto 200 sa temperaturom ne upisuje Err?",opcije:[
{key:"A",text:"Zato što je svaki broj sa servera greška dok ga čovek ne potvrdi.",why:"200 sa telom je uspeh čitanja. Err je za drugi ishod.",ok:false},
{key:"B",text:"Zato što uspeh nosi cifre u telu, a Err pripada statusu koji nije uspeh.",why:"Prikaz prati ishod. Status uspeha nije razlog za Err.",ok:true}],
analizaPitalice:"Ako se svaki odgovor piše kao Err, 200 više ne znači ništa. Cifre postoje da uspeh ima svoj znak."}],
"6:Izvučen kabl": [
{pitalica:"Zašto je 500 stigao odgovor, a ne tišina?",opcije:[
{key:"A",text:"Zato što je server uspeo da odgovori statusom, iako ventilator nije mogao da se pročita.",why:"Izvučen kabl je neuspeh posla. Veza i HTTP i dalje rade.",ok:true},
{key:"B",text:"Zato što 500 znači da paket nije napustio mašinu.",why:"To bi bila tišina ili mrežni pad. 500 ima statusnu liniju.",ok:false}],
analizaPitalice:"Razlika postoji da se kabl ventilatora ne meša sa kablom mreže. Ko 500 čita kao tišinu, tražiće catch umesto statusa."},
{pitalica:"Šta iz statusa 500 ne sledi?",opcije:[
{key:"A",text:"Da Promise od fetch-a sam ode u catch.",why:"Odgovor postoji. 500 nije odbacivanje zbog mreže.",ok:true},
{key:"B",text:"Da je HTTP razmena završena odgovorom.",why:"To sledi. Ne sledi da je čitanje uspelo niti da je izuzetak.",ok:false}],
analizaPitalice:"Ova pitalica najavljuje korak koji to pokazuje u kodu. Ovde je dovoljno da 500 nije tišina."}],
"6:Event loop: redosled izvršavanja": [
{pitalica:"Zašto C stigne pre B?",opcije:[
{key:"A",text:"Zato što se redovi izvršavaju abecedno.",why:"Slova su oznake u primeru, ne raspored. Raspored daju sync, microtask i timer.",ok:false},
{key:"B",text:"Zato što reakcija na Promise ide pre timera koji je već zakazan.",why:"Sinhrono A i D, zatim microtask C, pa timer B. Zato A D C B.",ok:true}],
analizaPitalice:"Red postoji da await i then ne izgledaju kao haos. Ko očekuje A B C D, čita zakazivanje kao izvršavanje."},
{pitalica:"Šta zakazani setTimeout ne uradi odmah?",opcije:[
{key:"A",text:"Ne pretekne ni sinhroni kod ni već spremnu Promise reakciju.",why:"Timer je task. Čeka da se trenutni tok i microtask red isprazne.",ok:true},
{key:"B",text:"Ne uđe uopšte u red, pa se B nikad ne ispiše.",why:"Ispisuje se, ali poslednji. Zakazan jeste.",ok:false}],
analizaPitalice:"Kašnjenje nula nije „odmah pre svega”. Zato B nije drugi."}],
"6:Err": [
{pitalica:"Zašto 500 na sobi prekidača ne ostavi poslednje cifre?",opcije:[
{key:"A",text:"Zato što završen status koji nije uspeh nije novo merenje.",why:"Err kaže da broj ne važi. Stare cifre bi izgledale kao uspeh.",ok:true},
{key:"B",text:"Zato što 500 uvek briše i fajl sa stranicom.",why:"Menja prikaz stanja. Ne briše dokument.",ok:false}],
analizaPitalice:"Err postoji da neuspeh ne liči na poslednje dobro čitanje. Ko ostavi cifre, laže da je soba pročitana."}],
"6:Nema statusa": [
{pitalica:"Zašto tišina nije isti dokaz kao 500, čak i kad oba pišu Err?",opcije:[
{key:"A",text:"Zato što su oba catch, pa je dijagnoza ista.",why:"Isečak sme da piše isto slovo. Network i dalje razlikuje status od izostanka.",ok:false},
{key:"B",text:"Zato što 500 ima statusnu liniju, a izostanak odgovora nema status.",why:"Isti prikaz može da pokrije dva uzroka. Dijagnoza gleda Network, ne samo slovo.",ok:true}],
analizaPitalice:"Zajednički Err je izbor prikaza, ne identitet greške. Nastavnik sme da izmeni tu liniju; razlika slojeva ostaje."}],
"6:async/await ne blokira stranicu": [
{pitalica:"Zašto se 3 ispiše pre 2?",opcije:[
{key:"A",text:"Zato što await pusti event loop da odradi ostatak toka, pa se nastavak funkcije vrati kasnije.",why:"1 krene, 3 je sinhron posle poziva, 2 čeka nastavak. Stranica nije zamrznuta.",ok:true},
{key:"B",text:"Zato što await zaustavi browser dok 2 ne završi, pa 3 mora pre toga slučajno.",why:"Da browser staje, 3 ne bi mogao da se ispiše dok await traje. Ispis je 1, 3, 2.",ok:false}],
analizaPitalice:"await izgleda kao čekanje u nizu. Red 1, 3, 2 pokazuje da čeka samo nastavak te funkcije."}],
"6:fetch": [
{pitalica:"Zašto fetch nije prvi dokaz da ruta postoji?",opcije:[
{key:"A",text:"Zato što je ista adresa već pokazala isti HTTP odgovor pre koda stranice.",why:"fetch menja ko šalje zahtev. Ne menja protokol ni to da je odgovor već viđen.",ok:true},
{key:"B",text:"Zato što fetch koristi drugi protokol, pa adresa u browseru ne važi.",why:"I dalje je HTTP. Klijent je nov, ugovor nije.",ok:false}],
analizaPitalice:"Kod postoji da stranica sama traži sobu. Ko misli da fetch izmišlja odgovor, neće uporediti telo sa onim iz adresne trake."}],
"6:Nije catch": [
{pitalica:"Gde se 500 gubi ako ga student traži samo u catch?",opcije:[
{key:"A",text:"Ne gubi se: catch je jedino mesto gde status sme da se pročita.",why:"Status se čita sa odgovora. catch je za odbijanje Promise-a, ne za svaki loš status.",ok:false},
{key:"B",text:"Gubi se u grani koja nikad ne vidi status, jer odgovor jeste stigao.",why:"500 stoji na response.status. Ko čeka samo catch, pročitaće ga kao uspeh toka.",ok:true}],
analizaPitalice:"Grana statusa postoji jer je HTTP odgovor i kad nije 200. Catch nije zamena za r.ok."}],
"6:await": [
{pitalica:"Šta await ne zaustavi?",opcije:[
{key:"A",text:"Ne zaustavi ceo browser, nego nastavak te async funkcije.",why:"Drugi klik i drugi kod i dalje mogu da rade. Suspendovan je jedan nastavak.",ok:true},
{key:"B",text:"Ne zaustavi ni tu funkciju, pa se kod ispod await izvrši odmah.",why:"Kod ispod await čeka nastavak. Zaustavljanje jeste, ali usko.",ok:false}],
analizaPitalice:"Usko čekanje je razlog što stranica ostaje živa. Široko čitanje await-a kao zamrzavanja kvari i sledeći klik."}],
"6:HTTP 500 nije mrežni izuzetak": [
{pitalica:"Zašto fetch ne odbaci Promise samo zato što je status 500?",opcije:[
{key:"A",text:"Zato što je odgovor stigao, pa je mrežni deo uspeo, a smisao stoji u statusu.",why:"catch je za prekid razmene. 500 je završen odgovor, zato ispis nije ulazak u catch.",ok:true},
{key:"B",text:"Zato što je 500 uvek ok, pa r.ok mora biti true.",why:"r.ok je false za 500. Promise je ipak ispunjen.",ok:false}],
analizaPitalice:"Ovo razdvaja „stiglo” i „uspelo”. Ko spoji ta dva, neće proveriti status."}],
"6:Posle uspeha": [
{pitalica:"Zašto cifre ostanu i kad je čitanje gotovo?",opcije:[
{key:"A",text:"Zato što displej čuva poslednji uspeh dok novo čitanje ne stigne.",why:"Kraj zahteva nije brisanje. Crte bi značile da više nema poznatog broja.",ok:true},
{key:"B",text:"Zato što 200 traje kao veza i sam osvežava broj.",why:"200 je jedan odgovor. Ne drži vezu otvorenu i ne meri ponovo.",ok:false}],
analizaPitalice:"Čuvanje cifara postoji da kraj zahteva ne izgleda kao gubitak podatka. Svežina je drugi problem, kasnije."}],
"6:Drugi klik": [
{pitalica:"Zašto drugi klik važi dok prvi fetch još čeka?",opcije:[
{key:"A",text:"Zato što await ne blokira event loop, pa novi događaj ima ko da ga primi.",why:"Čekanje jednog zahteva nije brava na stranici.",ok:true},
{key:"B",text:"Zato što browser odbaci prvi zahtev čim stigne drugi klik.",why:"Prvi i dalje može da se završi. Drugi nije dokaz da je prvi poništen.",ok:false}],
analizaPitalice:"Drugi klik postoji da se vidi živa stranica. Iz njega ne sledi da su odgovori stigili redom koji ekran sme da veruje."}],
};
