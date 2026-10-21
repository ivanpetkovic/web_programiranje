# Proposal

## Why

Nedelje i koraci žive u jednom JSON dokumentu, `site/kurs.json`, a nastavnik ih danas menja ručno. Treba strana na kojoj se nedelja i korak dodaju i sadržaj kuca, pa se isti dokument učita i sačuva. Strana `/studio` već stoji u radnom stablu, bez specifikacije. Ovaj change beleži taj ugovor da se studio ne pravi drugi put i da format ne ode od kursa koji čas čita.

## What Changes

- Nova sposobnost `studio`: jedna strana za kurs, nedelje i korake. Dodavanje, redosled, brisanje i izmena sadržaja ostaju na toj strani.
- Učitavanje i čuvanje su isti JSON. Otvaranje studija čita `kurs.json`. Sačuvaj upisuje taj fajl. Učitaj otvara drugi JSON u studio. Preuzmi skida kopiju. Nesačuvan rad ostaje nacrt u browseru dok se ne sačuva.
- Čas i dalje čita isti dokument. Trajanje prati broj nedelja. Dokument koji čas ne bi učitao se ne upisuje.
- Nema drugog formata, druge strane ni nove zavisnosti.

## Capabilities

### New Capabilities

- `studio`: uređivanje kursa, nedelja i koraka, sa učitavanjem i čuvanjem JSON dokumenta koji čas već čita.

### Modified Capabilities

## Impact

- `site/studio.html`, `site/css/studio.css`, `site/js/studio.js`, `site/js/studio-strana.js`: strana, model i polja. Jezik ostaje srpski.
- `server/server.js`: `GET /studio` i `PUT /api/kurs`. `GET /kurs.json` ostaje čitanje istog fajla. Upis ide preko privremenog fajla i preimenovanja.
- `server/kurs.js`: provera da telo jeste kurs pre upisa.
- `test/studio.test.mjs` i `test/studio-server.test.js` drže model i upis.
- `site/kurs.json` ostaje dokument kursa. `casovi`, `sajt-casa`, `pitalice` i `kontrolna-soba` se ne menjaju: redosled časova, prikaz lekcije, pitalice i panel ostaju.
