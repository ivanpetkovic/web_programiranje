# Proposal

## Why

Birač koraka zauzima celu širinu kolone časa, a ispod kontrola stoji traka čija je popuna razlomak otvorenog koraka. Za nedelju od 19 koraka ta traka ne kaže gde je koji korak i ne vodi na njega. Koraci treba da budu kratak niz krugova, širok onoliko koliko ih ima.

## What Changes

- **BREAKING:** traka napretka nestaje. Na njenom mestu je jedan krug po koraku otvorene nedelje. Budući koraci su svetlo sivi. Prethodni i trenutni su žuti: na mornaru i uglju to je `#ffb000`, a na pesku i terakoti naglasak te teme. Sačuvani koraci ne boje krugove.
- Klik na krug, uključujući budući, otvara taj korak i ostavlja otvoreni tab. Krug ne ispisuje broj. Trenutni krug je i dalje žut, kao prethodni, i nosi `aria-current="step"`.
- Birač više nije rastegnut na širinu kolone. Širina prati sadržaj, a niz krugova raste sa brojem koraka i staje na širini kolone. Kad ne stane u jedan red, krugovi prelaze u sledeći.
- „Korak n od N”, naslov koraka, Prethodni korak, Svi koraci i Sledeći ostaju. Nivo, minuti i Sačuvaj korak ostaju van birača. Red brojeva u telu lekcije se ne vraća.

## Capabilities

### New Capabilities

### Modified Capabilities

- `sajt-casa`: birač koraka gubi traku napretka i dobija po jedan krug po koraku, kraći od pune širine kolone. Zaglavlje lekcije više ne zabranjuje krug u biraču.

## Impact

- `site/js/main.js` (`nacrtajBirac`) i `site/css/site.css` (`.birac`, `.birac-traka`): traka i `role="progressbar"` nestaju, krugovi i širina po sadržaju dolaze.
- `test/tema.test.mjs` više ne traži traku ni širinu `(i + 1) / N`.
- `openspec/specs/sajt-casa/spec.md` dobija deltu za `Birač koraka` i `Zaglavlje lekcije`. `casovi`, `pitalice`, `kontrolna-soba` i `studio` se ne menjaju.
- Nearhivirana izmena `izgled-editora` i dalje traži `Traka završenih koraka`, popunu po sačuvanim koracima. Glavna specifikacija i kod pune traku otvorenim korakom. Ova izmena uklanja traku u oba smisla. Ako se `izgled-editora` arhivira posle ove delte, sync ne sme da vrati tu traku.
- Nema nove zavisnosti. Jezik sajta ostaje srpski.
