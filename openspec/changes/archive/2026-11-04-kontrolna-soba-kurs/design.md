# Design

## Context

Sajt u `site/` već otvara jedan čas, jednu pitalicu i panel. Server u `server/server.js` već sluša HTTP/1.1 i izlaže `GET /api/soba` i `PUT /api/ventilator`, uz čuvanje fajla, sesiju, priključak ventilatora, takt i bazu. Četiri zapisa u `.scratch/` i `docs/adr/0015-kurs-ide-korak-po-korak.md` opisuju kurs koji sajt još ne vodi korak po korak. Vidi `proposal.md` za razlog.

## Goals / Non-Goals

**Goals:**

- Sadržaj časa postaje niz od 10 do 20 koraka, a panel na ekranu odgovara onome što je taj čas već uveo.
- Isti `client/` i `server/` ostaju fajlovi koje nastavnik prekucava u VS Code i koje editor sajta otvara.
- Postojeći ugovor kutije se ne menja da bi se dobio drugi oblik API-ja.

**Non-Goals:**

- Novi framework, Express, React, SSE ili WebSocket.
- Brisanje `.scratch/` u ovom koraku. Ti zapisi ostaju dok se predlog ne arhivira u `openspec/specs/`.
- Login, bodovanje i drugi uređaj.

## Decisions

### Četiri sposobnosti ostaju odvojene

Panel, sajt, redosled časova i faze pitalice imaju različite zahteve i već imaju zasebne zapise u `.scratch/`. Spajanje u jednu sposobnost bi pomešalo ugovor kutije sa tekstom časa.

Alternativa: jedan spec „kurs”. Odbijena jer izmena pitalice ne sme da povuče izmene HTTP ugovora.

### Putanje koje kutija već ima

Čitanje ostaje `GET /api/soba`. Komanda ostaje `PUT /api/ventilator` sa telom koje je tačno jedno boolean polje `ukljucen`. Starija rečenica u priči kaže `GET /api/room`; to je isto čitanje, ne druga ruta. Sajt ne uvodi `POST /api/komande`.

Alternativa: preimenovati rute na engleski. Odbijena jer domen kursa ostaje na srpskom i server to već izgovara.

### Err i poslednje cifre

Dok zahtev traje, displej sobe prekidača zadržava crte, cifre ili Err koje već pokazuje. Čas 4 nema granu Err, pa završen neuspeh ostavlja crte. Od časa 5 završen odgovor koji nije uspeh, i izostanak odgovora u toj grani, pišu Err. Telo HTTP 500 nema temperaturu. Komanda i dalje ne upisuje temperaturu. Starija sažeta rečenica da 500 ne briše poslednji ispravan prikaz važi za vreme leta zahteva i za temperaturu, ne za završen prikaz od časa 5.

Alternativa: 500 zauvek ostavlja prethodne cifre. Odbijena jer čas 5 upravo uči granu koja piše Err, i tu granu nastavnik vidi u fajlu.

### Dovod sobe mašina ostaje neimenovan

Postojeće objavljivanje stanja i dalje puni samo displej sobe mašina i lopatice. Čas 8 imenuje SSE i WebSocket kao način koji se ne gradi. Prekidač za periodično čitanje i dalje zove `GET /api/soba`.

### Koraci su podaci sajta

Svaki čas u sadržaju sajta dobija naslov i niz koraka. Korak nosi primer, kratku pitalicu, objašnjenje, putanju fajla i delić koji se taj put dodaje. Duga pitalica ostaje jedna po času, sa fazama iz specifikacije `pitalice`. Panel se ne crta iznova za svaki korak: isti panel dobija stanje časa, od „samo soba prekidača” do pune kutije.

Alternativa: generisati korake iz `.scratch/` u toku stranice. Odbijena jer je scratch radni zapis, a stranica treba da radi kao statičan sajt bez tog foldera.

### Editor i VS Code gledaju iste fajlove

„Sačuvaj” i dalje piše fajl preko postojećeg upisa. Sledeći zahtev učitava `soba.js`, `ventilator.js` i `sesija.js`. `server.js`, `stanje.js` i `baza.js` važe tek posle novog procesa. `prepared/` ostaje van stabla. Nastavnik kuca iste putanje u VS Code; sajt ih pokazuje da grupa vidi redosled.

### Ventilator

Lopatice se crtaju samo u sobi mašina, i samo od časa na kome server već radi. CSS transformacija tog časa je prvi čas na kome se uče. Soba prekidača nema lokalni ventilator.

## Risks / Trade-offs

- [Deset tema po 10 do 20 koraka je puno teksta] → Svaki korak mora da pogodi zahtev te teme, a doslovne rečenice smeju da se dotegnu dok primer, pitalica, objašnjenje i putanja ostanu.
- [Stari sajt ima jednu pitalicu i ventilator u sobi prekidača] → Zamena sadržaja može da pokvari postojeći prolaz kroz čas. Provera ide čas po čas, od časa 1 bez API reda do časa 9 sa ulogama.
- [Dva zapisa se nisu slagala oko Err] → Odluka je zapisana iznad. Ako nastavnik hoće da 500 zauvek čuva cifre, menja se specifikacija `kontrolna-soba` i čas 5 pre implementacije.
- [Čuvanje serverskog fajla menja živi proces] → To je već ponašanje. Čas i dalje kaže koji fajl važi tek posle restarta.

## Migration Plan

Sadržaj sajta se menja u istom repozitorijumu. Nema premeštanja podataka. Vraćanje je povratak na prethodni commit. `.scratch/` se ne briše ovim predlogom.

## Open Questions

- Doslovne rečenice sitnih primera, dok svaki korak i dalje ima primer, neoznačenu pitalicu, objašnjenje i delić imenovanog fajla.
