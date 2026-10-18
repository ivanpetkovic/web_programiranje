# Proposal

## Why

Red „Korak N od M” na otvorenom času nosi klasu beleške i boju `--muted` (`#b7ab96`). Na tamnoj podlozi časa taj red se gubi pored ishoda, koji ostaje u svetloj boji teksta. Sajt u `site/css/site.css` ima samo tamnu paletu (`color-scheme: dark` na `:root`) i nema svetlu temu.

## What Changes

- Red trenutnog koraka prestaje da koristi prigušenu boju beleške. U tamnoj temi taj red je žut, ista ćilibar nijansa koju sajt već koristi za naglasak (`#ffb000`).
- Sajt časa dobija tamnu i svetlu temu. Tamna ostaje sadašnja paleta. Svetla ima svetlu podlogu i taman tekst. U svetloj temi red koraka nije `#ffb000` na svetloj podlozi, jer taj par nema dovoljan kontrast za tekst veličine pasusa. Tu je tamniji ćilibar koji ostaje čitljiv.
- Podrazumevana tema prati `prefers-color-scheme`. Nastavnik može da zakuca tamnu ili svetlu, i taj izbor ostaje posle ponovnog učitavanja.
- Beleške (faza diskusije, osvrt, status panela) ostaju prigušene i odvojene od reda koraka, u obe teme čitljive.
- Nema novog alata za izgradnju ni nove zavisnosti. Jezik sajta ostaje srpski.

## Capabilities

### New Capabilities

### Modified Capabilities

- `sajt-casa`: otvoreni čas pokazuje red koraka bojom koja se čita, žutom u tamnoj temi, a cela stranica ima tamnu i svetlu temu.

## Impact

- `site/css/site.css`: tokeni boja, `color-scheme`, i fiksne pozadine `#111` i `#1a1204` koje danas ne prate temu. Red koraka dobija sopstvenu klasu umesto `.log`.
- `site/index.html` i `site/js/main.js`: prekidač teme u zaglavlju i rani atribut na dokumentu da se tema ne pojavi tek posle crtanja. Red koraka se danas pravi u `renderLecture` sa `className = "log"`.
- `openspec/specs/sajt-casa/spec.md` dobija deltu. Specifikacija `kontrolna-soba` se ne menja: font Digital-7 Mono i cifre očitavanja ostaju.
- `client/css/soba.css` i `client/js/niz.js` se ne prepravljaju. To su fajlovi koje čas prekucava. Linija grafikona ostaje `#ffb000` u tom fajlu, pa bunar grafikona ostaje dovoljno taman da se žuta linija vidi u obe teme.
- Nema izmene HTTP ugovora.
