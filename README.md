# Veb programiranje

Interaktivni kurs predavanja na Elektronskom fakultetu Univerziteta u Nišu. Autor je **Ivan Petković**.

Jedanaest časova po 90 minuta. Svaki čas ima 70 minuta koraka i 20 minuta glavne diskusije. Povezujući primer je kontrolna soba: jedan panel, temperatura i jedan ventilator. Nema stvarnog hardvera. Student prati jednu radnju od browsera, preko Node procesa, do PostgreSQL baze.

Jezik kursa je srpski. Primer je vanilla: HTML, CSS i JavaScript u browseru, Node.js modul `http` na serveru, PostgreSQL u Dockeru. React, Express i Next.js ostaju mapa oblasti, a ne deo primera.

## Cilj

Student koji već zna objektno programiranje, algoritme i SQL treba da:

- objasni tok korisničke radnje od browsera do servera i baze;
- razlikuje prikaz u browseru od merodavnog stanja;
- obrazloži grešku, izostanak odgovora i ponovljeni zahtev;
- prepozna granicu poverenja: šta sme da se veruje ekranu, a šta mora da proveri server.

JavaScript specifičnosti ne dolaze same od sebe. Poznavanje petlje ne podrazumeva leksički opseg, callback ni asinhronost. Te stvari čas uvodi kad primer do njih dođe.

Šire teme (okviri, protokoli, isporuka) ostaju orijentacija: koji problem rešavaju i kada postaju relevantne. Predavanje drži pripremljenu demonstraciju, kucanje u editoru časa i diskusiju. Editor podrazumevano otvara Lekciju, samo za čitanje. Prvi klik na Moj kod kopira snimak koraka u ovaj browser. Vežbe i ocenjivanje nisu uračunati u ovih 11 časova.

## Metodologija

Jedna nastavna sekvenca ide ovim redom:

1. Poznat scenario, pre nove terminologije.
2. Osnove koje taj scenario traži.
3. Mali primer, sa početnim i završnim stanjem.
4. Pitalica: svako prvo bira odgovor.
5. Obrazloženje svih odgovora, i onih koji ne drže.
6. Promena jednog uslova, pa ponovo isti sud.

Pogrešno obrazloženje se ne prekida odmah. Traži se pretpostavka koja ga drži, pa se proveri primerom. Pitanje ne traži sintaksu koja još nije pokazana.

Sajt časa (`site/`) otvara jednu nedelju. Korak koji menja fajl pokazuje redom tekst, ključnu ideju, isečak i kratku pitalicu. Isečak je delić koji se prekuca, ne cela nedelja. Odgovori pitalice ostaju neoznačeni dok se obrazloženje ne otkrije.

Panel raste sa časom. Do četvrte nedelje živi u browseru, u `client/`. Od četvrte sluša Node proces iz `server/server.js`, bez web okvira. Od sedme nedelje režim ventilatora i istorija komandi ostaju u bazi. Kucanje u editoru sajta ne menja fajlove na disku: isti `client/` i `server/` nastavnik prekucava i u svom editoru.

## Časovi

| Nedelja | Naslov | Šta student ume posle časa |
| --- | --- | --- |
| 1 | Zašto Web postoji: zahtevi i protokoli | Razlikuje uslugu Weba od mreže paketa i obrazlaže zašto zakasneli kadar i izgubljeni bajt nisu ista odluka. |
| 2 | Browser: HTML, CSS i prikaz | Razlikuje izvorni fajl, živi DOM i merenje, i sastavlja prikaz koji se čita i na uskom ekranu. |
| 3 | JavaScript: vrednosti, objekti i prototipovi | Razlikuje broj od teksta pod `===` i kaže da `reduce` u primeru vrati zbir, a prosek nastaje deljenjem. |
| 4 | DOM, događaji i prikaz stanja | Pokazuje da klik menja stanje, da poseban kod crta prikaz i da closure čuva leksičko okruženje. |
| 5 | Od mrežnog prenosa do HTTP-a i Node.js-a | Prati jedan HTTP zahtev od browsera do Node procesa i kaže šta zahtev, a šta odgovor nosi. |
| 6 | Asinhronost, event loop i neuspeh | Razlikuje čekanje, HTTP 200, HTTP 500 ovog primera i izostanak odgovora. |
| 7 | API komande, validacija i idempotentnost | Obrazlaže da ponovljena komanda ima isti nameravani efekat, dok pomoćni zapis sme da se ponovi. |
| 8 | PostgreSQL, transakcije i Docker | Objašnjava zašto režim i istorija ulaze u jednu transakciju i šta se povlači kad drugi upit padne. |
| 9 | Svežina podataka, periodično čitanje i push | Razlikuje redosled dolaska odgovora od svežine očitavanja i kaže šta takt ne pomera. |
| 10 | Bezbednost, sesije i prava pristupa | Razlikuje nastavni ključ sesije od nepredvidivog identifikatora i kaže gde se uloga proverava. |
| 11 | Ceo sistem, dijagnostika i LLM | Obrazlaže da ekran „uključeno” nije dokaz upisa i da ćutanje ne potvrđuje ni ne opovrgava ishod. |

Razrada vremena, pitalica i preglednih tema je u `web_programiranje_interaktivni_kurs_predlog.md`. Telo koje sajt čita je `site/kurs.json`. Pojmovi su u `GLOSSARY.md`.

## Instalacija i pokretanje

Potrebni su Node.js 22 i npm. Docker i Docker Compose trebaju od nedelje u kojoj stanje ide u bazu.

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
GLOSSARY.md    pojmovnik
```

`primeri/` drži samostalne primere. Svaki podfolder je jedan primer; `primer.json` daje natpis u selektoru. Kontrolna soba nije folder: to je stablo časa iz `client/` i `server/`, i ono je podrazumevani primer.
