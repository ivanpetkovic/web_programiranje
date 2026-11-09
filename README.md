# Web programiranje

Sajt časa za predavanja na Elektronskom fakultetu Univerziteta u Nišu. Autor kursa je **Ivan Petković**.

Tekst tema, koraka i pitalica je `kursevi/web_programiranje/kurs.json`. Cilj kursa, način objašnjavanja i povezujući primer su u [docs/kurs.md](docs/kurs.md). Šta ljuska radi je u [docs/platforma.md](docs/platforma.md).

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

Sajt pamti u browseru, pod jednim ključem u `localStorage`, napredak, podešavanja, paletu i beleške. Ništa od toga ne ide na server. Oblik zapisa i raspored zaglavlja su u [docs/izgled-i-lokalno-stanje.md](docs/izgled-i-lokalno-stanje.md).

### Provera

```bash
npm test
```

## Gde je šta

```text
site/          sajt časa
kursevi/web_programiranje/   kurs.json, rečnik i asseti tog kursa
client/        panel koji browser učitava
server/        Node proces, modul http, bez Express-a
test/          provere ljuske, editora i ugovora API-ja
docs/kurs.md   cilj, način objašnjavanja, povezujući primer
docs/platforma.md   šta sajt radi
GLOSSARY-MAP.md     pokazuje na rečnik kursa
```

`primeri/` drži samostalne primere. Svaki podfolder je jedan primer; `primer.json` daje natpis u selektoru. Kontrolna soba nije folder: to je stablo časa iz `client/` i `server/`, i ono je podrazumevani primer.
