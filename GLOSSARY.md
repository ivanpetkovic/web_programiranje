# Nastavni model kursa Web programiranje

## Jezik kursa

**Tema**:
Jedna celina kursa: naslov, ishod i koraci jednog predavanja.
_Avoid_: Nedelja

**Osnova teme**:
Unutar teme, minimalno objašnjenje pojmova i vođeni primer pre zadatka koji te pojmove traži.

**Pitalica za proveru razumevanja**:
Pitanje koje proverava primenu prethodno objašnjenih pojmova, uz obrazloženje odgovora.
_Avoid_: Pitalica koja zahteva još neobrađeno gradivo.

**Glavna pitalica**:
Jedina diskusija časa. Budžet razgovora pripada njoj.
_Avoid_: Kviz za svaki pojam.

**Rezervna pitalica**:
Drugo pitanje istog časa, otvoreno tek kad je glavna pitalica razjašnjena.
_Avoid_: Druga obavezna diskusija.

**Postepeni plan tema**:
Raspored u kojem zadaci svake teme koriste prethodno uvedene osnove i jasno označene nove pojmove.
_Avoid_: Nedeljni plan

**Povezujući primer**:
Jedna aplikacija kojoj se predavanja vraćaju da bi demonstrirala nove koncepte i posledice odluka kroz poznat scenario.

**Pregledna tema**:
Oblast koja se na predavanju predstavlja kroz problem koji rešava, osnovnu ideju i kratak primer ili pitalicu, bez detaljne razrade. Nije celina kursa.
_Avoid_: Tema, Paleta

**Sajt časa**:
Interaktivni tok predavanja koji zamenjuje slajdove i ugrađuje povezujući primer.
_Avoid_: Prezentacija, slajdovi

**Paleta**:
Jedan izgled sajta časa. Četiri su Plava, Ugalj, Pesak i Terakota.
_Avoid_: Tema, Pregledna tema.

**Editor časa**:
Mesto na sajtu časa gde se menja jedan isečak povezujućeg primera koji već radi.
_Avoid_: Prazan projekat, vežba.

**Radna verzija**:
Studentova kopija jednog fajla u ovom browseru.
_Avoid_: Režim

**Ugrađena verzija**:
Snimak jednog fajla na otvorenom koraku.
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
Ugrađeni alati u kojima se gleda i menja prikaz ove stranice. Dokument ostaje isti. Engleski naziv je DevTools.
_Avoid_: Izmena fajla, čuvanje dokumenta.

**Čitanje**:
Odgovor kutije koji nosi temperaturu i režim. HTTP 200 je uspeh. HTTP 500 znači da ventilator nije priključen, i iz tog odgovora displej sobe prekidača ne dobija broj.
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
Pripremljeni par ključa i uloge. Ključ je opaque token: browser ga drži, kutija drži ulogu.
_Avoid_: Nalog, prijava, lozinka, neprozirni ključ.

**Transakcija**:
Upis režima i istorije koji ili oba uspeju, ili se oba povuku.
_Avoid_: Celina, celina upisa.

## Termini gradiva

Definicija svakog termina u ovom odeljku navodi i engleski izraz (`Engleski: …`). Ako je naslov već uobičajeni engleski naziv u struci, isti se ponavlja u definiciji.

**veza od kraja do kraja**:
Rezervisana veza kojom cela poruka ide jednim putem. Paketna mreža ne traži takav kanal. Engleski: end-to-end connection; kod rezervisanja celog puta i circuit-switched connection.
_Avoid_: Žica.

**komutacije paketa**:
Način rada mreže u kome se podaci seku u pakete koji putuju nezavisno, bez trajno rezervisanog kanala od pošiljaoca do primaoca. Engleski: packet switching.

**flag day**:
Dan kad sve mreže prelaze na isti protokol. Za Internet je to 1. januar 1983.
_Avoid_: Dan zastave.

**plugin**:
Program koji se instalira pored stranice da bi jezik uopšte radio.
_Avoid_: Dodatak.

**streaming**:
Prenos u kome slika krene pre poslednjeg bajta.
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
HttpOnly zapis koji browser nosi kutiji. Ne nosi ime uloge.
_Avoid_: Kolačić.

**cache**:
Sačuvan odgovor sa svojim rokom. Ikonica i temperatura ne dele rok.
_Avoid_: Keš.

**credential**:
Podatak kojim se kutija javlja bazi. Browser ga ne dobija.
_Avoid_: Kredencijal.

**push**:
Poruka kutije ka browseru, bez novog čitanja. Ide u sobu mašina.
_Avoid_: Dovod, guranje.

**opaque token**:
Ključ sesije koji browser nosi, a ne čita. Kutija po njemu nađe ulogu.
_Avoid_: Neprozirni ključ.

**klijent**:
Deo koji browser učita. Na času je tab Klijent.
_Avoid_: Front.

**framework**:
Tuđi skelet servera. Kurs ga ne uvodi.

**Posmatrač**:
Uloga koja sme da pregleda stanje kontrolne sobe, ali ne i da upravlja ventilatorom.

**Operater**:
Uloga koja sme da pregleda stanje i izdaje dozvoljene komande uređajima.
