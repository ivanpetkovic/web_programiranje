# Design

## Context

Vidi `proposal.md` za razlog. `site/kurs.json` je već verzija 2.0, 11 nedelja, 146 koraka, iz `docs/kurs.xml`. Školjka čita taj dokument. Ovaj change ne menja kod: beleži odluke koje su već u sajtu, da glavni spec prestane da traži Podelu, ceo original i zabranu imena push.

`mapirajKorak` u `site/js/lectures.js` stavlja `original` iz `korak.original`, a ako ga nema iz `delic`. Isporuka nema polje `original`. `izgradi` u `site/js/stablo.js` lepi delić. `ubaciUHtml` i `ugradiPovez` dodaju skriptu samo ako snimak sadrži `</body>`. Dokument od Stranice zatvara `</html>` pre kasnijih delića, pa se skripta ne ubacuje.

## Goals / Non-Goals

**Goals:**

- Glavni spec `casovi`, `pitalice` i `sajt-casa` opisuje isporučeni dokument i ono što stranica već pokazuje.
- Isti scenario ostaje pod starim imenom kad zahtev ostaje, a WHEN i THEN prate novi naslov ili novi snimak.

**Non-Goals:**

- Novi kod, novi test, novi XML.
- Izmena `## Purpose` u postojećim specifikacijama.
- Arhiva promene, `kontrolna-soba`, `studio`.
- Ponovni izvoz `docs/lekcije-i-diskusija.md`.

## Decisions

### Delić je snimak, original se ne izmišlja

Editor i razlika i dalje zovu „original” snimak do otvorenog koraka. Izvor tog teksta je zbir delića. Ceo HTML se ne zapisuje u JSON.

Alternativa: generisati `original` pri uvozu. Odbijena jer XML nema ceo dokument, a izmišljen HTML bi se razišao sa delićima.

### Povez skripti čeka `</body>`

`ugradiPovez` ne dira HTML koji nema `</body>`. Isporučeni `client/index.html` zatvara `</html>` na Stranici, pa Objekat i Prekidač ne dobijaju `<script>`. Klase ostaju u svojim fajlovima. Nema koraka Linija i nema canvas-a.

Alternativa: umetati `</body>` pri uvozu da stari zahtev o povezu i dalje važi. Odbijena jer menja dokument koji nastavnik prepisuje.

### Izolovan primer nije fajl

Korak sa `samostalniPrimer` i bez putanje crta „Mali eksperiment”. Dijagram crta „Dijagram”. Oba nose ikonu `file-text` i nemaju Kopiraj ni putanju. Analiza je u dokumentu, a pasus se vidi tek kad je obrazloženje otvoreno. Širina kutije je takav korak: nema fajla, označen odgovor je 244 px.

### Push i event loop smeju da se imenuju

Nedelja svežine ima korake Push i Nema push. `dopunaGlosara` za `push` sme da kaže SSE i WebSocket. Čas ih ne gradi. Izolovana pitalica event loop-a sme da traži redosled A D C B i da imenuje call stack, microtask red i task red.

### Scenario zadržava ime

`openspec validate` odbija MODIFIED zahtev koji izostavi ime scenarija. Zato „Podela lists only the sketch”, „Podela is an empty document”, „Selektor is one rule”, „Objekat binds the existing script”, „Canvas appears with the line” i „No microtask quiz” ostaju naslovi. WHEN i THEN opisuju Stranicu, jednu CSS deklaraciju, HTML bez skripte i pitalicu event loop-a. Novi scenariji nose tačna imena pored njih.

Alternativa: obrisati ceo zahtev i dodati ga pod novim imenom. Odbijena tamo gde je telo zahteva i dalje isti ugovor, samo sa novim naslovom nedelje.

### Purpose se ne dira

`casovi` i dalje u Purpose kaže „Deset nedelja” i prazan `client/index.html`. Sync ostavlja postojeći Purpose. Ispravka Purpose je poseban, ručni edit glavnog speca.

## Risks / Trade-offs

- [Staro ime scenarija] → WHEN i THEN su tačni; ime ostaje jer bi brisanje palo na validaciji. Čitalac gleda telo scenarija.
- [Purpose „Deset nedelja”] → ostaje netačan dok ga neko ne izmeni u glavnom specu. Zahtevi ispod njega opisuju jedanaest nedelja.
- [HTML posle `</html>`] → pregled i dalje pokaže naslov, cifru i dugme jer browser premešta oznake. Povez skripti i crtanje iz tih fajlova ne ulaze u snimak. To je prihvaćeno.
- [Sačuvan broj nedelje] → i dalje otvara nedelju na istom mestu. Naslov na tom mestu je nov.

## Migration Plan

Kod i `site/kurs.json` su već na grani. Jedini preostali korak je spajanje delti u `openspec/specs/casovi/spec.md`, `pitalice/spec.md` i `sajt-casa/spec.md`, pa `openspec validate --specs`. Promena ostaje aktivna. Arhiva nije deo ovog koraka.

Povratak speca je `git checkout` ta tri fajla. Povratak kursa je poseban i nije potreban za ovaj sync.
