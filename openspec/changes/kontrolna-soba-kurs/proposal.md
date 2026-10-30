# Proposal

## Why

Četiri specifikacije u `.scratch/` opisuju isti kurs, a sajt časa i panel ne prate poslednji dogovor: nastavnik prekucava kod u VS Code, tema ide korak po korak, HTML je fajl, a ventilator stoji uz server. OpenSpec treba da postane mesto gde se ti dogovori čuvaju, da sledeća izmena sajta ima jedan izvor.

## What Changes

- Uvesti sposobnost panela kontrolne sobe: jedan panel, ugovor HTTP-a, dve sobe, ventilator samo u sobi mašina, otkucaj, sesija, Postgres i Docker.
- Uvesti sposobnost sajta časa: statičan sajt, stablo Front/Back, čuvanje i vraćanje rada, živi front i panel koji prati temu.
- Uvesti sposobnost časova: deset tema sa naslovom i 10 do 20 koraka. Korak ima sitni primer, kratku pitalicu, objašnjenje i delić glavne aplikacije. Prvi koraci pokazuju `client/` i `server/`, `client/index.html` i pokretanje `node server/server.js` pre `fetch`-a.
- Uvesti sposobnost pitalica: kratka provera po koraku i jedna duga diskusija po temi, sa neoznačenim odgovorima dok se ne izabere.
- Uskladiti postojeći sajt i panel sa tim dogovorom. Danas sajt ima jednu pitalicu po času, lokalni ventilator u sobi prekidača i nema korake ni HTML fajl koji se prekucava.

## Capabilities

### New Capabilities

- `kontrolna-soba`: ponašanje jednog panela, prikaza, komandi, otkucaja i trajnog stanja.
- `sajt-casa`: sajt na kome se čas vodi, sa editorom, stablom fajlova i panelom.
- `casovi`: redosled deset tema i koraka koji grade konačni kod.
- `pitalice`: kratke provere koraka i jedna projektorska diskusija po temi.

### Modified Capabilities

## Impact

- `.scratch/kontrolna-soba-sajt/spec.md`, `.scratch/sajt-casa-editor/spec.md`, `.scratch/casovi/spec.md`, `.scratch/pitalice/spec.md` ostaju izvor dok se ovaj predlog ne usvoji. Posle toga OpenSpec nosi iste zahteve.
- Sajt u `site/`: `index.html`, `js/lectures.js`, `js/editor.js`, `js/main.js`, `css/room.css`. Treba dodati korake, primer, kratku pitalicu i putanju fajla, i ukloniti ventilator iz sobe prekidača.
- Aplikacija koju grupa prekucava: `client/index.html` i `server/server.js`, sa postojećim `server/ventilator.js`, `server/soba.js`, `server/baza.js` i `docker-compose.yml` kao konačnim oblikom.
- Nema nove zavisnosti. Domen ostaje na srpskom.
