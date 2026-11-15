import { ispravka, izbor } from "../kviz-oblik.js";

const z = { zamka: true };

export const pitanja = [
  izbor(
    1, 0, 1,
    "Prijava LO iz 1969. već jeste web, jer je informacija stigla na drugi računar.",
    [
      ["A", "Da. Čim poruka stigne na drugi računar, to je web.", false],
      ["B", "Ne. Web traži dokument na lokaciji. Prijava šalje komandu programu i tu staje.", true],
      ["C", "Da, jer je udaljena mašina sama dopisala IN.", false],
    ],
    "Ideja prijave jeste da informacija ode na udaljeni računar. Web traži još i dokument na lokaciji, i vezu ka drugom dokumentu.",
    z,
  ),
  izbor(
    1, 0, 2,
    "Šta se desilo u prvom pokušaju prijave 29. oktobra 1969?",
    [
      ["A", "Stignu L i O. Na G mašina padne.", true],
      ["B", "Stignu L, O i G, a mašina odmah dopiše IN.", false],
      ["C", "Poruka uopšte ne krene sa UCLA.", false],
    ],
    "Prvi pokušaj padne na G. Oko sat kasnije ista prijava prođe.",
  ),
  izbor(
    1, 0, 3,
    "Šta je komunikacioni put?",
    [
      ["A", "Put kojim podaci prolaze od izvora do odredišta. Različiti paketi ne moraju ići istim putem.", true],
      ["B", "Rezervisana linija samo za ta dva računara, od početka do kraja razgovora.", false],
      ["C", "URL dokumenta u browseru.", false],
    ],
    "Put može obuhvatiti više rutera i veza. To još nije web.",
  ),
  izbor(
    1, 0, 4,
    "Prijava iz 1969. otvara udaljeni računar.",
    [
      ["A", "Da. Zato je i poslata.", false],
      ["B", "Ne. Šalje komandu programu. Ne otvara računar i ne stavlja dokument na lokaciju.", true],
    ],
    "Udaljeni računar se ne otvara. Dokument mora da ima lokaciju. Veza je ta lokacija.",
    z,
  ),
  izbor(
    1, 0, 5,
    "Šta web traži, a ova prijava još nema?",
    [
      ["A", "Dokument na lokaciji i vezu kojom jedan dokument vodi na drugi.", true],
      ["B", "Bržu žicu između UCLA i SRI.", false],
      ["C", "Sopstveni operativni sistem na oba kraja.", false],
    ],
    "Web čine dokumenti na drugom računaru i veza među njima.",
  ),
  izbor(
    1, 0, 6,
    "Šta je veza, kad dokument već ima lokaciju?",
    [
      ["A", "Ukras koji browser sme da ignoriše.", false],
      ["B", "Lokacija drugog dokumenta.", true],
      ["C", "Broj sledeće stranice, kao u knjizi.", false],
    ],
    "Veza je adresa drugog teksta. Čitalac prati ideju, ne broj stranice.",
  ),
  ispravka(
    1, 0, 7,
    "Ispravi komentar. Prijava LO nije web.",
    "// Prijava LO je web: udaljeni računar je otvoren.",
    "// Prijava LO nije web: nema dokumenta na lokaciji.",
    "Prijava šalje komandu. Dokument na lokaciji još ne postoji.",
    { jezik: "js" },
  ),
  izbor(
    1, 0, 8,
    "Web i Internet su ista stvar, samo noviji naziv.",
    [
      ["A", "Da. Stranica, mreža i aplikacija su jedno.", false],
      ["B", "Ne. Internet je mreža kojom poruka stiže. Web je usluga dokumenata na toj mreži.", true],
      ["C", "Web je mreža, a Internet je stranica iz 1991.", false],
    ],
    "Ista reč „web” lako pokrije mrežu, stranicu, Gmail i blockchain. To nisu iste stvari.",
    z,
  ),

  izbor(
    1, 1, 1,
    "Po čemu se komutacija paketa razlikuje od komutacije kola?",
    [
      ["A", "Kola rezervišu put dok razgovor traje. Paketi dele vezu, bez posebnog puta za svaki razgovor.", true],
      ["B", "Paketi rezervišu put, a kola dele istu vezu sa svima.", false],
      ["C", "Oba uvek drže isti put do kraja, razlika je samo u imenu.", false],
    ],
    "Telefonska mreža rezerviše put. ARPANET deli podatke na pakete kroz zajedničku mrežu.",
  ),
  izbor(
    1, 1, 2,
    "Rezervisan komunikacioni put je bolji, jer računari šalju podatke bez pauze.",
    [
      ["A", "Tačno. Pauze u slanju ne postoje.", false],
      ["B", "Netačno. Posle zahteva često nema šta da se šalje, a rezervisani put ostaje zauzet.", true],
    ],
    "Računari pošalju zahtev, sačekaju odgovor, pa ćute. Paketi popunjavaju tu tišinu tuđim porukama.",
    z,
  ),
  izbor(
    1, 1, 3,
    "Šta prekid jedne komunikacione veze uradi podacima koji su već stigli?",
    [
      ["A", "Poništi ih. Poruka kreće ispočetka ili nikako.", false],
      ["B", "Ne poništava ih. Poruka ipak može ostati nepotpuna ako se neki paket izgubi.", true],
      ["C", "Sama podela na pakete ponovo pošalje sve što fali, redom.", false],
    ],
    "Mogućnost drugog puta nije pouzdana isporuka. Za red, dolazak i ponovno slanje treba protokol.",
  ),
  izbor(
    1, 1, 4,
    "Ako mreža nađe drugi put, isporuka je time i pouzdana.",
    [
      ["A", "Da. Drugi put garantuje sve bajtove, redom.", false],
      ["B", "Ne. Sama podela na pakete ne obezbeđuje dolazak, red ni ponovno slanje.", true],
    ],
    "Promena puta i pouzdana isporuka nisu isto. To dolazi sa dodatnim pravilima, protokolima.",
    z,
  ),
  izbor(
    1, 1, 5,
    "Paketni prenos je rana verzija HTTP-a.",
    [
      ["A", "Da. HTTP je samo ime za pakete.", false],
      ["B", "Ne. Paketni prenos je temelj interneta. HTTP nastaje kasnije, na tom temelju.", true],
    ],
    "Ostaju pitanja kako paket stiže, šta ako se izgubi i kako primalac razume sadržaj.",
    z,
  ),
  ispravka(
    1, 1, 6,
    "Ispravi komentar tako da kaže kako paketi dele vezu.",
    "// Svaki razgovor dobija sopstveni put koji niko drugi ne sme da koristi.",
    "// Paketi različitih poruka mogu da se smenjuju na istoj vezi.",
    "Zajednička veza između susednih uređaja nosi pakete više poruka.",
    { jezik: "js" },
  ),
  izbor(
    1, 1, 7,
    "Šta paket nosi pored sadržaja?",
    [
      ["A", "Ništa. Mreža pamti kome ide svaki razgovor.", false],
      ["B", "Informacije potrebne da ga mreža prosledi do odredišta.", true],
      ["C", "Rezervaciju puta do kraja razgovora.", false],
    ],
    "Paket je manja celina: sadržaj i ono što treba da bi se prosledio.",
  ),

  izbor(
    1, 2, 1,
    "Koju ulogu imaju IP, TCP i HTTP?",
    [
      ["A", "IP adresira i prosleđuje paket. TCP predaje uređen tok bajtova. HTTP kaže šta zahtev i odgovor znače.", true],
      ["B", "HTTP prosleđuje pakete, IP crta stranicu, TCP je jezik stranice.", false],
      ["C", "Sva tri rade isto. Razlikuje se samo sloj u imenu.", false],
    ],
    "Različiti protokoli rešavaju različite probleme. Niko od njih ne zamenjuje ostala dva.",
  ),
  izbor(
    1, 2, 2,
    "Ako je TCP pouzdan, HTTP je suvišan.",
    [
      ["A", "Tačno. Bajti već znaju da li klijent hoće temperaturu ili HTML.", false],
      ["B", "Netačno. TCP prenosi bajtove i ne određuje njihovo značenje.", true],
    ],
    "Server može primiti sve bajtove, a da i dalje ne zna da li je to čitanje sobe, komanda ili dokument.",
    z,
  ),
  izbor(
    1, 2, 3,
    "IP može da izgubi paket. Kako ipak stiže potpun dokument?",
    [
      ["A", "IP čuva kopiju dok primalac ne potvrdi svaki paket.", false],
      ["B", "TCP iznad IP-a traži ponovni prenos i predaje uređen tok.", true],
      ["C", "Browser dopuni bajt koji fali.", false],
    ],
    "Pouzdana isporuka nije posao samog IP-a. TCP je taj dogovor o toku bajtova.",
  ),
  ispravka(
    1, 2, 4,
    "Dopuni zahtev. Tačno treba da piše GET /api/soba HTTP/1.1, a u sledećem redu Host: localhost.",
    "GET /api/soba",
    "GET /api/soba HTTP/1.1\nHost: localhost",
    "Samo putanja ne kaže ni verziju HTTP-a ni domaćina. TCP te dve linije ne izmisli.",
    { jezik: "text" },
  ),
  izbor(
    1, 2, 5,
    "TCP je pouzdano preneo komandu. Znači da je ventilator uključen.",
    [
      ["A", "Da. Pouzdan prenos i izvršena komanda su isto.", false],
      ["B", "Ne. TCP predaje bajtove ili javi neuspeh veze. Komandu izvršava program, ne TCP.", true],
    ],
    "TCP ne garantuje da će aplikaciona komanda uspeti.",
    z,
  ),

  izbor(
    1, 3, 1,
    "Kadar filma zakasni. Šta sa njim, a šta sa bajtom dokumenta?",
    [
      ["A", "Čekamo i kadar i bajt. Oba su deo istog dokumenta.", false],
      ["B", "Kadar sme da se odbaci. Dokument ne sme da izgubi bajt.", true],
      ["C", "Odbacujemo oba, jer je mreža ista.", false],
    ],
    "UDP ne garantuje isporuku. TCP čuva uređeni tok dok veza radi.",
  ),
  izbor(
    1, 3, 2,
    "Šta TCP pruža, a šta ne garantuje?",
    [
      ["A", "Pouzdan uređen tok bajtova dok veza radi. Ne garantuje da je komanda uspela.", true],
      ["B", "Šalje kadar i nastavlja i ako kadar izostane.", false],
      ["C", "Bira boju dugmeta na stranici.", false],
    ],
    "TCP je tok bajtova, ne značenje zahteva i ne uspeh aplikacije.",
  ),
  izbor(
    1, 3, 3,
    "Šta UDP ostavlja aplikaciji?",
    [
      ["A", "Garanciju reda i ponovnog prenosa.", false],
      ["B", "Datagram bez garancije isporuke. Aplikacija odlučuje da li je zakasneli podatak još koristan.", true],
      ["C", "Isti dogovor kao TCP, samo kraće ime.", false],
    ],
    "Kadar koji zakasni više nije ovaj trenutak slike. Dokument i dalje čeka svoj bajt.",
  ),
  izbor(
    1, 3, 4,
    "Ista mreža nosi i film i dokument, pa je pravilo čekanja isto.",
    [
      ["A", "Da. Mreža odlučuje umesto aplikacije.", false],
      ["B", "Ne. Ista mreža nosi oba. Pravilo čekanja nije isto.", true],
    ],
    "TCP čuva bajt dokumenta. UDP ne garantuje svaki kadar.",
    z,
  ),
  ispravka(
    1, 3, 5,
    "Ispravi komentar. Zakasneli kadar i bajt dokumenta nemaju isto pravilo.",
    "// Zakasneli kadar slike čekamo, kao bajt HTML dokumenta.",
    "// Zakasneli kadar sme da se odbaci. Bajtu dokumenta to ne važi.",
    "Dokument čeka bajt. Kadar koji zakasni više nije ovaj trenutak.",
    { jezik: "js" },
  ),
  izbor(
    1, 3, 6,
    "Šta od ovoga TCP ne obećava?",
    [
      ["A", "Da će aplikaciona komanda uspeti.", true],
      ["B", "Uređen tok bajtova dok veza funkcioniše.", false],
      ["C", "Da će prijaviti neuspeh veze.", false],
    ],
    "Tok ili neuspeh veze jesu dogovor TCP-a. Uspeh komande nije.",
  ),
  izbor(
    1, 3, 7,
    "Zašto dokument ne sme da izgubi bajt, a kadar sme da se odbaci?",
    [
      ["A", "Zato što je dokument kraći.", false],
      ["B", "Dokument čeka svaki bajt. Kadar koji zakasni više nije ovaj trenutak slike.", true],
      ["C", "Zato što film ide preko HTTP-a, a dokument preko UDP-a.", false],
    ],
    "Pravilo je u protokolu i u tome šta aplikaciji još znači podatak, ne u dužini poruke.",
  ),
  izbor(
    1, 3, 8,
    "UDP je pokvaren TCP, pa je uvek lošiji izbor.",
    [
      ["A", "Da. Bez potvrde nema razloga da se UDP koristi.", false],
      ["B", "Ne. UDP je drugi dogovor: aplikacija sme da odbaci zakasneli datagram.", true],
    ],
    "Za kadar slike čekanje znači da slika više nije sada. Za dokument gubitak bajta kvari tekst.",
    z,
  ),

  izbor(
    1, 4, 1,
    "Zašto HTTP, kad TCP već pouzdano prenese bajtove?",
    [
      ["A", "Da klijent i server znaju metod, resurs i ishod. TCP ne daje značenje bajtovima.", true],
      ["B", "Da TCP postane brži.", false],
      ["C", "Da zameni IP adresu.", false],
    ],
    "HTTP definiše strukturu zahteva i odgovora: metod, zaglavlja, status.",
  ),
  izbor(
    1, 4, 2,
    "Šta klijent traži ovim zahtevom?",
    [
      ["A", "Podatke o sobi.", true],
      ["B", "Da se ventilator odmah uključi.", false],
      ["C", "Da se umesto HTTP-a otvori samo TCP, bez odgovora.", false],
    ],
    "GET traži reprezentaciju resursa. Ne kaže sam od sebe da je komanda izvršena.",
    { kod: "GET /api/soba HTTP/1.1\nHost: localhost:8787", jezik: "text" },
  ),
  izbor(
    1, 4, 3,
    "Šta znači ovaj odgovor?",
    [
      ["A", "TCP javlja da je veza pukla.", false],
      ["B", "HTTP odgovor je stigao. Telo je JSON tekst sa temperaturom.", true],
      ["C", "Browser je sam izmislio broj 24, bez odgovora.", false],
    ],
    "200 je HTTP status. Content-Type kaže kako je telo predstavljeno.",
    { kod: "HTTP/1.1 200 OK\nContent-Type: application/json\n\n{\"temperatura\":24}", jezik: "text" },
  ),
  izbor(
    1, 4, 4,
    "Status 200 je potvrda TCP-a da je bajt stigao.",
    [
      ["A", "Da. 200 pripada TCP-u.", false],
      ["B", "Ne. 200 je HTTP status. TCP ne govori ovim kodom.", true],
    ],
    "TCP predaje tok ili javi neuspeh veze. Statusna linija je HTTP.",
    z,
  ),
  izbor(
    1, 4, 5,
    "Kako stoje URL, HTTP i reprezentacija?",
    [
      ["A", "URL kaže kom resursu pristupamo. HTTP razmenjuje zahtev i odgovor. Telo je reprezentacija, na primer HTML ili JSON.", true],
      ["B", "HTTP je ime fajla, URL je statusni kod, reprezentacija je uvek slika.", false],
      ["C", "URL zamenjuje i HTTP i sadržaj.", false],
    ],
    "Tri pitanja ostaju odvojena: koji resurs, kako tražimo, kako je sadržaj predstavljen.",
  ),
  ispravka(
    1, 4, 6,
    "Ispravi prvu liniju. Ovo je HTTP zahtev, ne TCP zaglavlje.",
    "GET /api/soba TCP/1.1\nHost: localhost:8787",
    "GET /api/soba HTTP/1.1\nHost: localhost:8787",
    "TCP prenosi bajtove. Ime protokola u startnoj liniji je HTTP.",
    { jezik: "text" },
  ),
  izbor(
    1, 4, 7,
    "Čemu služi zaglavlje Host u zahtevu?",
    [
      ["A", "Kaže kom domaćinu je zahtev upućen, uz putanju iz prve linije.", true],
      ["B", "Bira boju stranice.", false],
      ["C", "To je lozinka ventilatora.", false],
    ],
    "Putanja bira resurs na tom domaćinu. Host nije stil i nije komanda.",
  ),
  izbor(
    1, 4, 8,
    "JSON u telu odgovora je živi objekat iz memorije servera, isti onaj koji browser odmah deli.",
    [
      ["A", "Da. Objekat pređe žicom kao objekat.", false],
      ["B", "Ne. Žicom ide tekst. {\"temperatura\":24} je reprezentacija, ne objekat u memoriji.", true],
    ],
    "HTTP prenosi reprezentaciju. JavaScript objekat nastaje tek ako neko taj tekst protumači.",
    z,
  ),
  ispravka(
    1, 4, 9,
    "Klijent samo čita sobu. Ispravi metod u prvoj liniji.",
    "POST /api/soba HTTP/1.1\nHost: localhost:8787",
    "GET /api/soba HTTP/1.1\nHost: localhost:8787",
    "Čitanje reprezentacije je GET. POST bi bio drugi dogovor, ne „samo pročitaj”.",
    { jezik: "text" },
  ),
  izbor(
    1, 4, 10,
    "HTTP sam, bez ičeg drugog, već jeste ceo web.",
    [
      ["A", "Ne. HTTP razmenjuje zahtev i odgovor. Resurs i dalje treba identifikovati, a sadržaj predstaviti.", true],
      ["B", "Da. HTTP zamenjuje i URL i HTML.", false],
      ["C", "Da, jer bez HTTP-a nema ni TCP-a.", false],
    ],
    "Web traži još koji je resurs i kako je sadržaj predstavljen. TCP postoji i ispod HTTP-a, ne zbog njega.",
  ),

  izbor(
    1, 5, 1,
    "Šta ova oznaka radi?",
    [
      ["A", "Vodi na adresu drugog dokumenta.", true],
      ["B", "Šalje komandu ventilatoru čim se stranica učita.", false],
      ["C", "To je CSS klasa za boju.", false],
    ],
    "href je lokacija drugog teksta. Nije komanda i nije stil.",
    { kod: "<a href=\"/ventilator\">Ventilator</a>", jezik: "html" },
  ),
  izbor(
    1, 5, 2,
    "Veza u hipertekstu uvek otvara sledeću stranicu, kao u knjizi.",
    [
      ["A", "Da. Browser broji stranice i href sme da bude samo broj+1.", false],
      ["B", "Ne. Adresa drugog teksta ne mora biti sledeći broj. Čitalac prati ideju.", true],
    ],
    "Veza je adresa. Redosled čitanja nije redni broj stranice.",
    z,
  ),
  ispravka(
    1, 5, 3,
    "Veza treba da vodi na dokument /soba, a natpis da bude Soba. Ispravi oznaku.",
    "<a href=\"2\">sledeća stranica</a>",
    "<a href=\"/soba\">Soba</a>",
    "href je adresa dokumenta, ne broj sledeće stranice.",
    { jezik: "html" },
  ),
  izbor(
    1, 5, 4,
    "Šta rani HTML imenuje, a šta ne?",
    [
      ["A", "Imenuje naslov, vezu i spisak. Ne imenuje boju.", true],
      ["B", "Imenuje boju i font. Strukturu ostavlja stilu.", false],
      ["C", "To je program koji Node pokreće.", false],
    ],
    "Oznaka kaže šta je deo teksta. Boja nije njeno ime.",
  ),
  izbor(
    1, 5, 5,
    "Klik na vezu znači da TCP izvršava komandu iz href-a.",
    [
      ["A", "Da. href je komanda ventilatoru.", false],
      ["B", "Ne. href je lokacija dokumenta. TCP samo prenese bajtove ako se taj dokument traži.", true],
    ],
    "Veza bira dokument. Izvršenje komande nije ni posao veze ni posao TCP-a.",
    z,
  ),
  ispravka(
    1, 5, 6,
    "Ovo treba da bude veza u tekstu, ne veza ka stilu. Zameni oznaku. Adresa i natpis ostaju.",
    "<link href=\"/soba\">dalje</link>",
    "<a href=\"/soba\">dalje</a>",
    "link u glavi učitava resurs kao stil. a je veza u hipertekstu.",
    { jezik: "html" },
  ),
  izbor(
    1, 5, 7,
    "Kako čitalac ide kroz hipertekst?",
    [
      ["A", "Prati ideju preko adrese, ne broj stranice.", true],
      ["B", "Mora redom 1, 2, 3, i browser to proverava.", false],
      ["C", "Browser bira sledeći dokument umesto čitaoca.", false],
    ],
    "Veza je adresa drugog teksta. Put kroz tekst nije paginacija knjige.",
  ),
  izbor(
    1, 5, 8,
    "Koliko veza jedan dokument sme da ima?",
    [
      ["A", "Više, ka različitim adresama.", true],
      ["B", "Tačno jednu, kao jednu sledeću stranicu.", false],
      ["C", "Nijednu. Veza stoji samo u URL traci.", false],
    ],
    "Hipertekst nije lanac „sledeća stranica”. Jedan tekst može da pokazuje na više drugih.",
  ),

  izbor(
    1, 6, 1,
    "Kojim redom rade DNS, veza, HTTPS, HTTP i HTML pri otvaranju stranice?",
    [
      ["A", "DNS razreši ime u adresu, uspostavi se veza, HTTPS štiti razmenu, HTTP traži dokument, HTML je sadržaj koji browser prikaže.", true],
      ["B", "HTML razrešava ime, DNS crta stranicu, HTTP bira IP.", false],
      ["C", "HTTP krene pre nego što ime uopšte postoji.", false],
    ],
    "Svaki sloj ima svoju ulogu. Mešanje imena i ne daje dijagnozu.",
  ),
  izbor(
    1, 6, 2,
    "DNS vraća sadržaj HTML-a.",
    [
      ["A", "Da. Zato se i zove sistem imena.", false],
      ["B", "Ne. DNS pomaže da se ime domena razreši u adresu. Sadržaj stranice ne vraća.", true],
    ],
    "Ime nije dokument. Dokument stiže tek HTTP odgovorom.",
    z,
  ),
  izbor(
    1, 6, 3,
    "DNS nije našao ime. To je HTTP 404.",
    [
      ["A", "Da. Oba znače „stranica ne radi”, dijagnoza je ista.", false],
      ["B", "Ne. 404 znači da je HTTP odgovor stigao. Ime koje nije razrešeno stane pre zahteva.", true],
    ],
    "Bez adrese zahtev za dokument još nije ni poslat. 404 je odgovor servera.",
    z,
  ),
  izbor(
    1, 6, 4,
    "U adresi https://soba.elfak.rs/panel#temp, šta server vidi od #temp?",
    [
      ["A", "Dobije #temp i vrati samo taj deo stranice.", false],
      ["B", "Ništa. Fragment ostaje u browseru. Zahtev ide na putanju bez njega.", true],
      ["C", "#temp je lozinka za Host zaglavlje.", false],
    ],
    "Fragment je za prikaz u browseru. Nije deo zahteva koji server mora da vidi.",
  ),
  ispravka(
    1, 6, 5,
    "Fragment ne ide u zahtev. Ispravi putanju tako da ostane samo /panel.",
    "GET /panel#temp HTTP/1.1",
    "GET /panel HTTP/1.1",
    "Server vidi putanju. #temp ostaje u browseru.",
    { jezik: "text" },
  ),
  izbor(
    1, 6, 6,
    "HTTPS je samo HTTP sa drugim slovom. Poruka je i dalje otvorena na isti način.",
    [
      ["A", "Da. Menja se samo ime u adresi.", false],
      ["B", "Ne. HTTPS štiti razmenu. HTTP i dalje ostaje dogovor o zahtevu i odgovoru.", true],
    ],
    "Zaštita i značenje poruke nisu isti sloj. Kurs ih drži odvojene.",
    z,
  ),
  izbor(
    1, 6, 7,
    "Jedan URL stranice znači tačno jedan zahtev i ništa više.",
    [
      ["A", "Ne. Posle HTML-a browser može zasebno tražiti stil, sliku ili drugi resurs.", true],
      ["B", "Da. Jedan URL je uvek jedan paket i jedan fajl.", false],
      ["C", "Da, jer DNS u istom odgovoru vrati i CSS.", false],
    ],
    "Dokument može da pokaže na druge resurse. Svaki od njih je poseban zahtev.",
  ),
  ispravka(
    1, 6, 8,
    "Ispravi dijagnozu u komentaru. DNS neuspeh nije HTTP status.",
    "// DNS nije našao ime, zato je status 404.",
    "// DNS nije našao ime. HTTP 404 nije stigao.",
    "404 je odgovor koji jeste stigao. Ako ime nije razrešeno, do tog odgovora se nije ni došlo.",
    { jezik: "js" },
  ),
];
