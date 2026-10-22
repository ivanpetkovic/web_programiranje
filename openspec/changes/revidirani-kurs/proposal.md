# Proposal

## Why

`site/kurs.json` već nosi revidirani kurs iz `docs/kurs.xml` (verzija 2.0, 146 koraka). Glavni OpenSpec i dalje traži stari redosled: Podelu, dvadeset koraka istorije, ceo HTML original i zabranu da se SSE i WebSocket imenuju. Spec i čas se ne slažu.

## What Changes

- **BREAKING:** Naslovi svih jedanaest nedelja su novi. Nedelja 1 ima 12 koraka, nedelja 2 ima 15. Koraci Web 3.0, Deset dana, ECMA, W3C, XML, Streaming, Ekonomija, Društvo, Podela, Telo, Unutra, Spolja, Promenljiva, Calc, Soba prekidača i Linija nisu u isporučenom kursu.
- Doprinos koraka fajlu je delić. Nema sačuvanog celog originala. Editor pokazuje snimak do tog koraka, složen od delića. Dokument druge nedelje zatvara `</html>` pre kasnijih delića, pa povez skripti ne ulazi u taj HTML.
- Izolovan primer nema putanju i ne ulazi u stablo. Gradivo ga zove Mali eksperiment. Dijagram je poseban blok. Analiza stoji u dokumentu i na stranici se vidi tek kad je obrazloženje otvoreno.
- Oznake minuta koraka u svakoj nedelji zbiru 55. Budžet nedelje ostaje 90. Kartica i dalje čita budžet nedelje.
- Nedelja svežine sme da imenuje push, SSE i WebSocket kao primere. Ne gradi ih.
- Korak event loop-a sme da pita redosled ispisa kroz call stack, microtask red i task red.
- Diskusije, rezerve i izlazi ostaju isti po smislu. Vezuju se za nove naslove.

## Capabilities

### New Capabilities

### Modified Capabilities

- `casovi`: novi naslovi i redosledi, delić umesto celog originala, izolovan primer, dijagram, analiza, minuti 55 uz budžet 90, push kao ime, event loop kao pitalica.
- `pitalice`: iste diskusije, rezerve i izlazi, vezani za nove naslove nedelja.
- `sajt-casa`: stablo i snimak od Stranice, Selektor je jedna deklaracija, povez skripti samo kad HTML ima `</body>`, nema koraka Linija.

## Impact

- `openspec/specs/casovi/spec.md`, `openspec/specs/pitalice/spec.md`, `openspec/specs/sajt-casa/spec.md`.
- `site/kurs.json` i `docs/kurs.xml` su već izvor. Školjka čita ta polja. `kontrolna-soba` i `studio` se ne menjaju.
- Sačuvan broj nedelje i dalje otvara tu nedelju. Naslov na tom mestu je nov.
