## Why

Birač koraka živi u sekciji Gradivo, pa nestaje čim se otvore Diskusija ili Editor. Nastavnik tada ne vidi koji je korak otvoren i ne može da pređe na sledeći a da se vrati na Gradivo. Linija ispod birača prati broj sačuvanih koraka, pa na početku nedelje izgleda kao prazan razdelnik, a ne kao napredak kroz „Korak n od N”.

## What Changes

- **BREAKING:** birač stoji izvan sekcije Gradivo, iznad tela taba. Ostaje na ekranu dok su otvoreni Gradivo, Diskusija i Editor. Nivo, minuti i Sačuvaj korak ostaju u telu Gradiva, ne u biraču.
- **BREAKING:** linija ispod birača je progress bar otvorenog koraka. Širina je n/N, gde je n redni broj otvorenog koraka, a N broj koraka te nedelje. Broj sačuvanih koraka više ne puni tu liniju. Sačuvaj korak i dalje beleži korak u ovom browseru. Kartica napretka i dalje pokazuje udeo nedelje u kursu.
- Prethodni, Svi koraci i Sledeći rade i dok su Diskusija ili Editor na ekranu. Sledeći i dalje ima podlogu mastila, ne naglasak teme.

## Capabilities

### New Capabilities

### Modified Capabilities

- `sajt-casa`: birač je deo školjke časa, vidljiv na sva tri taba, a linija ispod njega puni se otvorenim korakom.

## Impact

- `site/index.html`, `site/css/site.css`, `site/js/main.js`: mesto birača i širina progress trake.
- `test/tema.test.mjs`: birač se više ne traži unutar članka Gradiva, a traka se više ne vezuje za broj sačuvanih koraka.
- `openspec/specs/sajt-casa/spec.md` dobija deltu za zaglavlje lekcije i birač koraka. `casovi`, `pitalice` i `kontrolna-soba` se ne menjaju.
- Nema nove zavisnosti. Jezik sajta ostaje srpski.
