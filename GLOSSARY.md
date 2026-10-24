# Nastavni model kursa Web programiranje

## Jezik kursa

**Osnova teme**:
Minimalno objašnjenje pojmova i vođeni primer koji student dobija pre zadatka koji zahteva te pojmove.

**Pitalica za proveru razumevanja**:
Pitanje koje proverava primenu prethodno objašnjenih pojmova, uz obrazloženje odgovora.
_Avoid_: Pitalica koja zahteva još neobrađeno gradivo.

**Glavna pitalica**:
Glavna zajednička diskusija o jednom problemu časa, sa predviđenim vremenom za razmišljanje i obrazlaganje.
_Avoid_: Kviz za svaki pojam.

**Rezervna pitalica**:
Dopunsko pitanje koje koristi preostalo vreme glavne diskusije, kada je osnovni problem razjašnjen.
_Avoid_: Druga obavezna diskusija.

**Postepeni nedeljni plan**:
Raspored u kojem zadaci svake nedelje koriste prethodno uvedene osnove i jasno označene nove pojmove.

**Povezujući primer**:
Jedna aplikacija kojoj se predavanja vraćaju da bi demonstrirala nove koncepte i posledice odluka kroz poznat scenario.

**Pregledna tema**:
Oblast koja se na predavanju predstavlja kroz problem koji rešava, osnovnu ideju i kratak primer ili pitalicu, bez detaljne razrade.

**Sajt časa**:
Interaktivni tok predavanja koji zamenjuje slajdove i ugrađuje povezujući primer.
_Avoid_: Prezentacija, slajdovi.

**Editor časa**:
Prostor za kucanje i istraživanje koda tokom predavanja i samostalnog rada, uz ugrađene snimke fajlova.
_Avoid_: Slika koda bez mogućnosti izmene.

**Radna verzija**:
Studentova kopija jednog fajla u ovom browseru.
_Avoid_: Režim

**Ugrađena verzija**:
Pripremljen snimak celog fajla na otvorenom koraku, koji služi kao polazna tačka i poređenje sa radnom verzijom.
_Avoid_: Režim, fajl sa diska

## Kontrolna soba

**Kontrolna soba**:
Povezujući primer kursa. Čine je soba prekidača i, od uvođenja servera, soba mašina.
_Avoid_: Jedna nerazdvojena prostorija u kojoj su prekidač i ventilator isti crtež.

**Soba prekidača**:
Crtež fronta: prekidači i ono što browser prikazuje. Postoji pre servera.
_Avoid_: Soba mašina.

**Soba mašina**:
Crtež udaljenih uređaja. Ventilator se tu prvi put pojavljuje i vidi se kao uključen ili isključen. Crta se tek kad se uvodi server.
_Avoid_: Soba prekidača.

**Kutija**:
Server kao kutija na koju su mašine priključene. Prima zahtev iz sobe prekidača i može da ga odbije.
_Avoid_: Ventilator, prekidač.

**Takt**:
Periodična promena temperature na kutiji. Diže očitavanje dok je režim isključen, a spušta ga dok je uključen.
_Avoid_: Cron, „Sledeći korak” na frontu. Takt gleda režim, ne položaj prekidača.

**Očitavanje**:
Izmerena ili simulirana vrednost zajedno sa trenutkom na koji se odnosi.

**Željeno stanje uređaja**:
Stanje koje korisnik traži komandom; nije samo po sebi potvrda da je promena primenjena.

**Prekidač**:
Kontrola kojom korisnik traži da ventilator bude uključen ili isključen.
_Avoid_: Ventilator, režim.

**Režim**:
Stanje u kome udaljeni ventilator stvarno radi: isključen ili uključen.
_Avoid_: Brzina, skala obrtaja, položaj prekidača, priključen. Trajanje CSS animacije nije režim.

**Priključen**:
Ventilator jeste ili nije na kablu kutije. Dok nije priključen, režim ostaje isključen, a čitanje i komanda „uključi” dobijaju HTTP 500.
_Avoid_: Režim, prekidač.

**Serversko stanje**:
Stanje koje je server prihvatio i koje drži.
_Avoid_: Istina ekrana.

**Prikazano stanje**:
Stanje koje ovaj browser trenutno crta.
_Avoid_: Stanje kutije.

**Alati browsera**:
Ugrađeni alati za pregled dokumenta, mreže i izvršavanja u browseru. Izmena elementa menja živi DOM tog dokumenta, bez automatske izmene izvornog fajla; engleski naziv je DevTools.
_Avoid_: Izmena fajla, čuvanje dokumenta.

**Čitanje**:
Odgovor kutije koji nosi temperaturu i režim. HTTP 200 je uspeh. U pripremljenom primeru HTTP 500 može značiti da ventilator nije priključen, i iz tog odgovora displej sobe prekidača ne dobija broj.
_Avoid_: Komanda.

**Komanda**:
Zahtev da ventilator bude uključen ili isključen. Uspešan odgovor nosi samo režim.
_Avoid_: Čitanje, prekidač.

**Periodično čitanje**:
Čitanje koje se samo ponavlja da bi displej sustigao kutiju.
_Avoid_: Server push. Polling je isto ovo čitanje, ne drugi kanal.

**Displej sobe mašina**:
Sedmosegmentni broj trenutne temperature kutije, na crtežu sobe mašina. Prati kutiju i dok displej sobe prekidača stoji.
_Avoid_: Displej sobe prekidača.

**Displej**:
Displej sobe prekidača. Pre prvog uspelog čitanja pokazuje crte. Uspešno čitanje upisuje očitavanje. Neuspešno čitanje upisuje Err. Takt i komanda ga ne pomeraju.
_Avoid_: Displej sobe mašina, prekidač.

**Sesija**:
Kontekst koji server povezuje sa zahtevima preko ključa sesije. Nastavne sesije služe istraživanju uloga, a ne predstavljaju bezbedan sistem prijave.
_Avoid_: Nalog, prijava, lozinka, neprozirni ključ.

**Transakcija**:
Upis režima i istorije koji ili oba uspeju, ili se oba povuku.
_Avoid_: Celina, celina upisa.

## Termini gradiva

**veza od kraja do kraja**:
Veza između dva krajnja učesnika komunikacije; ne podrazumeva rezervisan fizički put.
_Avoid_: Žica.

**flag day**:
Dogovoren trenutak prelaska određenog sistema na novi protokol; u istoriji ARPANET-a vezuje se za prelazak na TCP/IP 1. januara 1983.
_Avoid_: Dan zastave.

**plugin**:
Dodatno instalirana komponenta browsera; istorijski su takve komponente omogućavale sadržaje poput Flash-a.
_Avoid_: Dodatak.

**streaming**:
Reprodukcija sadržaja koja može početi pre završetka celog preuzimanja; ne određuje sama po sebi transportni protokol.
_Avoid_: Striming.

**Eternal September**:
Trenutak kad zatvoren klub postane javan. Za Usenet je to septembar 1993.
_Avoid_: Večni septembar.

**blockchain**:
Zapis koji više strana drži u lancu. Nije Internet i nije stranica.
_Avoid_: Knjiga na lancu, lanac blokova.

**ledger**:
Zapis koji strana drži. Banka drži svoj. Više strana može da drži isti.
_Avoid_: Knjiga.

**white paper**:
Dokument koji predlaže sistem. Bitcoinov je iz oktobra 2008.
_Avoid_: Beli papir.

**cookie**:
Zapis koji browser čuva i pridružuje odgovarajućim zahtevima. Cookie sesije u primeru nosi ključ, a atribut HttpOnly ograničava pristup iz JavaScripta.
_Avoid_: Kolačić.

**cache**:
Sačuvana kopija resursa čija upotreba zavisi od politike svežine i ponovne provere. Različiti resursi mogu imati različitu politiku.
_Avoid_: Keš.

**Pristupni podaci za bazu**:
Podaci kojima server dobija pristup bazi; na engleskom credentials. Ne predstavljaju korisničku dozvolu za upravljanje uređajem.
_Avoid_: Credential, kredencijal.

**push**:
Poruka kutije ka browseru, bez novog čitanja. Ide u sobu mašina.
_Avoid_: Dovod, guranje.

**opaque token**:
Ključ sesije čiji sadržaj klijent ne treba da tumači. Izraz sam po sebi ne garantuje nasumičnost, tajnost ili bezbednost ključa.
_Avoid_: Neprozirni ključ.

**klijent**:
Deo koji browser učita. Na času je tab Klijent.
_Avoid_: Front.

**framework**:
Okvir koji organizuje česte poslove aplikacije. Kurs objašnjava svrhu okvira, dok povezujući primer koristi osnovne platformske API-je.

**Posmatrač**:
Uloga koja sme da pregleda stanje kontrolne sobe, ali ne i da upravlja ventilatorom.

**Operater**:
Uloga koja sme da pregleda stanje i izdaje dozvoljene komande uređajima.
