# Nastavni model kursa Web programiranje

## Jezik kursa

**Osnova teme**:
Minimalno objašnjenje pojmova i vođeni primer koji student dobija pre zadatka koji zahteva te pojmove.

**Pitalica za proveru razumevanja**:
Pitanje koje proverava primenu prethodno objašnjenih pojmova, uz obrazloženje odgovora.
_Avoid_: Pitalica koja zahteva još neobrađeno gradivo.

**Glavna pitalica**:
Jedina diskusija časa. Budžet razgovora pripada njoj.
_Avoid_: Kviz za svaki pojam.

**Rezervna pitalica**:
Drugo pitanje istog časa, otvoreno tek kad je glavna pitalica razjašnjena.
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
Mesto na sajtu časa gde se menja jedan isečak povezujućeg primera koji već radi.
_Avoid_: Prazan projekat, vežba.

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
Pripremljeni par ključa i uloge. Browser drži ključ, kutija drži ulogu.
_Avoid_: Nalog, prijava, lozinka.

**Posmatrač**:
Uloga koja sme da pregleda stanje kontrolne sobe, ali ne i da upravlja ventilatorom.

**Operater**:
Uloga koja sme da pregleda stanje i izdaje dozvoljene komande uređajima.
