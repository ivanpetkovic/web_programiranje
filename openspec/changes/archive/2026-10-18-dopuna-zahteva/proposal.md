# Proposal

## Why

Glavne specifikacije drže kičmu kursa, a deo dogovora iz `.scratch/` i ADR-ova i dalje nije zahtev: imena ruta, granica tela, prag i istorija na panelu, font displeja, svežina koja se gasi, pojmovi, rezerve i osvrt po času. Sledeća izrada nema gde da proveri te stavke.

## What Changes

- Dopuniti `kontrolna-soba` imenima `GET /api/soba` i `PUT /api/ventilator`, poljem `ukljucen`, granicom veličine tela, odbijanjem neispravnog JSON-a pre smisla komande, pragom upozorenja, listom istorije, fontom Digital-7 Mono na oba displeja, isključivom proverom svežine, različitim rokom ikonice i temperature, drugim klikom dok `await` traje, i tri stanja čitanja.
- Dopuniti isti ugovor: isti cookie, a uloga upisana uz ključ menja se u editoru.
- Skinuti iz zahteva rečenicu da vlažnost nije obavezna. Ta rečenica nije deo izvornog dogovora.
- Dopuniti `sajt-casa` imenovanim front fajlovima, otvaranjem i sklapanjem pojmova, pretragom, „Ponovi pitanje”, preduslovom i ishodom, i pravilom da sintaksna greška serverskog fajla ne zamenjuje sačuvani izvor.
- Dopuniti `casovi` i `pitalice` rezervom svakog časa, izlaznim pitanjem i imenima preglednih tema. Čas 10 rezervu o tipu i asistentu ostavlja kao rečenicu u osvrtu.

## Capabilities

### New Capabilities

### Modified Capabilities

- `kontrolna-soba`: imena ugovora, telo komande, elementi panela koji stižu kasnije, font, svežina, čekanje i uloga uz isti ključ. Postojeći zahtev o jednom panelu gubi rečenicu o vlažnosti.
- `sajt-casa`: stablo fronta, pojmovi, ponavljanje pitalice, uvod časa i čuvanje izvora.
- `casovi`: rezerva, izlaz i osvrt po nedelji, bez izrade preglednih alata.
- `pitalice`: tekst rezerve po času, izlazna rečenica i osvrt bez faza izbora.

## Impact

- `openspec/specs/kontrolna-soba/spec.md`, `openspec/specs/sajt-casa/spec.md`, `openspec/specs/casovi/spec.md`, `openspec/specs/pitalice/spec.md` dobijaju delte. Glavni specifikacije se ne prepisuju u ovom predlogu.
- `server/server.js` već ima `GET /api/soba`, `PUT /api/ventilator`, granicu JSON tela i proveru sintakse pre zamene fajla. `site/css/site.css` već učitava Digital-7 Mono. `site/js/lectures.js` već nosi ishod, rezervu, izlaz i osvrt kao podatak.
- Još nisu zahtev ni ponašanje: prag upozorenja i lista istorije na panelu, prekidač koji gasi proveru svežine, različit rok ikonice i temperature, vidljivo stanje čekanja, „Ponovi pitanje”, preduslov, sužavanje pojmova pretragom, i promena uloge u mapi bez novog cookie-ja.
- Nema nove zavisnosti. Domen ostaje na srpskom. `prepared/` ostaje van stabla.
