# Proposal

## Why

Školjka časa u `site/` i dalje crta radnje zaglavlja, spiska nedelja, kartice napretka, tabova i pitanja slovima i znacima (`‹`, `›`, `⚑`, `?`, `●`, `○`), a paleta je zaključana na dve teme: ugalj i jedna svetla. U `site/icons/svg_currentColor/` stoji 31 SVG ikonica sa `currentColor`, a `mocks/` pokazuje istu školjku u četiri palete. Nastavnik ne može da uključi te palete, niti da vidi ikonice na mestima koja maketa već imenuje.

## What Changes

- Školjka dobija četiri teme iz maketa: mornar (`mocks/navy_theme.png`), ugalj (`mocks/black_theme.png`), pesak (`mocks/light_orange.png`) i terakota (`mocks/light_red_theme.png`). Podloga, mastilo, ivice, kod, poziv i naglasak prate aktivnu temu.
- **BREAKING:** zahtev da zlato ostane naglasak u obe teme prestaje da važi. Mornar i ugalj zadržavaju zlatni naglasak `#ffb000`. Pesak i terakota imaju svoj naglasak, čitljiv na svetloj podlozi, i red koraka u njima nije `#ffb000`.
- **BREAKING:** hod prethodnog i sledećeg koraka prati naglasak aktivne teme. Na mornaru i uglju pozadina ostaje `#ffb000` sa tamnim tekstom. Na pesku i terakoti pozadina je naglasak te teme, a tekst na njoj ima kontrast najmanje 4.5:1.
- Podrazumevana tema i dalje prati sistem: tamna ili neizjašnjena šema otvara ugalj, svetla otvara pesak. Zakucana tema i dalje važi odmah, pobija šemu i ostaje posle učitavanja. Sačuvane vrednosti `tamna` i `svetla` i dalje otvaraju ugalj i pesak.
- Prekidač dve teme postaje spisak od četiri teme. Izbor ne učitava dokument iznova i ne menja otvoreni čas ni korak.
- Ikonice školjke dolaze iz `site/icons/svg_currentColor/` i nasleđuju boju iz CSS-a. PNG varijante i `mockup_faculty_emblem.png` se ne ugrađuju. Grb ostaje `dokument.grb`.
- Mapa mesta je u dizajnu: pretraga, nedelje, sačuvaj, pomoć, spisak nedelja, kartica, tabovi Gradivo / Diskusija / Editor, nivo, minuti, ključna ideja, isečak, kopiranje, putanja, pitanje i stablo editora. Natpisi i pristupačna imena ostaju. Panel sobe, olovka verzije i inicijali ostaju kakvi jesu.

## Capabilities

### New Capabilities

### Modified Capabilities

- `sajt-casa`: četiri teme umesto dve, naglasak po temi, hod koraka u boji teme, i ikonice školjke na mestima iz makete.

## Impact

- `site/css/site.css`: tokeni četiri teme, `color-scheme`, hod koraka preko tokena umesto fiksne pozadine `#ffb000`.
- `site/index.html` i `site/js/main.js`: rano čitanje zakucane teme za četiri identifikatora plus stare `tamna` / `svetla`, spisak tema, umetanje SVG ikonica.
- `site/js/cm-editor.js`: tema editora prati aktivnu paletu (tamna porodica ili svetla).
- `test/tema.test.mjs`: tvrdnje o dve palete i žutom hodu u obe teme prate novi ugovor.
- `openspec/specs/sajt-casa/spec.md` dobija deltu. `kontrolna-soba`, `casovi` i `pitalice` se ne menjaju. Font Digital-7, cifre, bunar grafikona i fajlovi koje čas prekucava ostaju.
- Nema novog alata za izgradnju, nove zavisnosti ni izmene HTTP ugovora. Jezik sajta ostaje srpski.
