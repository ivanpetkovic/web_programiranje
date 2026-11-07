# Web programiranje

Interaktivni kurs predavanja na Elektronskom fakultetu Univerziteta u Nišu. Autor je **Ivan Petković**.

Jedanaest tema po 90 minuta. Povezujući primer je kontrolna soba: jedan panel, temperatura i jedan ventilator. Nema stvarnog hardvera. Student prati jednu radnju od browsera, preko Node procesa, do PostgreSQL baze.

Jezik kursa je srpski. Primer je vanilla: HTML, CSS i JavaScript u browseru, Node.js modul `http` na serveru, PostgreSQL u Dockeru. React, Express i Next.js ostaju mapa oblasti, a ne deo primera.

## Cilj

Student koji već zna objektno programiranje, algoritme i SQL treba da:

- objasni tok korisničke radnje od browsera do servera i baze;
- razlikuje prikaz u browseru od merodavnog stanja;
- obrazloži grešku, izostanak odgovora i ponovljeni zahtev;
- prepozna granicu poverenja: šta sme da se veruje ekranu, a šta mora da proveri server.

JavaScript specifičnosti ne dolaze same od sebe. Poznavanje petlje ne podrazumeva leksički opseg, callback ni asinhronost. Te stvari čas uvodi kad primer do njih dođe.

Šire teme (okviri, protokoli, isporuka) ostaju orijentacija: koji problem rešavaju i kada postaju relevantne. Konkretno programiranje je na vežbama. Predavanje drži pripremljenu demonstraciju i diskusiju.

## Metodologija

Jedna nastavna sekvenca ide ovim redom:

1. Poznat scenario, pre nove terminologije.
2. Osnove koje taj scenario traži.
3. Mali primer, sa početnim i završnim stanjem.
4. Pitalica: svako prvo bira odgovor.
5. Obrazloženje svih odgovora, i onih koji ne drže.
6. Promena jednog uslova, pa ponovo isti sud.

Pogrešno obrazloženje se ne prekida odmah. Traži se pretpostavka koja ga drži, pa se proveri primerom. Pitanje ne traži sintaksu koja još nije pokazana.

Sajt časa (`site/`) otvara jednu temu. Na Gradivu korak pokazuje tekst, ključnu ideju bez tog natpisa, pa isečak ili crtež. Isečak je delić koji se prekuca, ne cela tema. Kratka pitalica je na Diskusiji. Odgovori ostaju neoznačeni dok se obrazloženje ne otkrije.

Panel raste sa časom. Do pete teme živi u browseru, u `client/`. Od pete sluša Node proces iz `server/server.js`, bez web okvira. Od osme teme režim ventilatora i istorija komandi ostaju u bazi. Kucanje u editoru sajta ne menja fajlove na disku: isti `client/` i `server/` nastavnik prekucava i u svom editoru.

## Časovi

| Tema | Naslov | Šta ostaje posle časa |
| --- | --- | --- |
| 1 | Zašto Web postoji: zahtevi i protokoli | Web je usluga na Internetu. Stranica je dokument. `server/` još nema fajlove. |
| 2 | Browser: HTML, CSS i prikaz | Dokument, prikaz i merenje nisu ista stvar. |
| 3 | JavaScript: vrednosti, objekti i prototipovi | Objekat drži temperaturu. Ekran je još ne crta. |
| 4 | DOM, događaji i prikaz stanja | Klik menja stanje. Poseban kod crta prikaz. |
| 5 | Od mrežnog prenosa do HTTP-a i Node.js-a | Jedan zahtev i jedan odgovor. Kutija drži temperaturu. |
| 6 | Asinhronost, event loop i neuspeh | Čekanje, podatak i greška. 200 nije 500, a 500 nije ugašen port. |
| 7 | API komande, validacija i idempotentnost | Željeno stanje, provera tela i smisao ponavljanja. |
| 8 | PostgreSQL, transakcije i Docker | Režim i istorija su jedna transakcija. |
| 9 | Svežina podataka, periodično čitanje i push | Displej čuva poslednje čitanje. Takt ga ne pomera. |
| 10 | Bezbednost, sesije i prava pristupa | Cookie nosi ključ. Kutija drži ulogu. |
| 11 | Ceo sistem, dijagnostika i LLM | Ekran „uključeno” nije dokaz upisa. Ćutanje nije ni dokaz ni opovrgavanje. |

Telo koje sajt čita je `site/kurs.json` (`trajanjeTema` je 11). Pojmovi su u `GLOSSARY.md`. `web_programiranje_interaktivni_kurs_predlog.md` je raniji plan od deset časova i nije merodavan raspored. Odluke su u `docs/adr/`. Raspored sajta i lokalno stanje opisuje [docs/izgled-i-lokalno-stanje.md](docs/izgled-i-lokalno-stanje.md).

## Instalacija i pokretanje

Potrebni su Node.js 22 i npm. Docker i Docker Compose trebaju od teme u kojoj stanje ide u bazu.

Iz korena repozitorijuma:

```bash
npm ci
npm start
```

Sajt časa je na [http://127.0.0.1:8787](http://127.0.0.1:8787). U terminalu treba da se pojavi `Web Programiranje http://127.0.0.1:8787`.

Port menja promenljiva `PORT`. Bez `DATABASE_URL` proces i dalje krene: baza se ne otvara, a časovi pre trajnog stanja rade. Panel sam, van toka časa, otvara se na [http://127.0.0.1:8787/client/index.html](http://127.0.0.1:8787/client/index.html).

### Baza

Cela kutija, sajt i PostgreSQL 16:

```bash
docker compose up --build
```

Isti sajt ostaje na portu 8787. Baza `kontrolna` sluša na portu 5432, nalog je `kutija`, lozinka `kutija`. Volumen `pgdata` čuva režim. `docker compose down` sklanja kontejnere i ostavlja volumen. `docker compose down -v` briše i to skladište.

Ako Node treba da radi na mašini, a baza u Dockeru:

```bash
docker compose up -d db
DATABASE_URL=postgres://kutija:kutija@127.0.0.1:5432/kontrolna npm start
```

Pri prvom startu sa `DATABASE_URL` proces napravi tabele `ventilator` i `istorija` i ubaci početni isključen režim.

### Lokalno stanje i beleške

Sajt časa pamti u browseru, pod jednim ključem u `localStorage`, napredak po temi, veličinu teksta, način korišćenja (Predavanja ili Samostalni rad), paletu, belu ili crnu pozadinu blokova koda i beleške koraka sa komentarom. Ništa od toga ne ide na server. Opcije u zaglavlju imaju Load, Save i Obriši progres. Pozadina koda bira se na bloku i važi za sve blokove. Oblik zapisa, panel Opcije i beleške opisuje [docs/izgled-i-lokalno-stanje.md](docs/izgled-i-lokalno-stanje.md).

### Provera

```bash
npm test
```

## Gde je šta

```text
site/          sajt časa; kurs je site/kurs.json
client/        panel koji browser učitava
server/        Node proces, modul http, bez Express-a
test/          provere kursa, editora i ugovora API-ja
GLOSSARY.md    rečnik
```

`primeri/` drži samostalne primere. Svaki podfolder je jedan primer; `primer.json` daje natpis u selektoru. Kontrolna soba nije folder: to je stablo časa iz `client/` i `server/`, i ono je podrazumevani primer.
