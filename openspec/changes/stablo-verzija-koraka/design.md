# Design

## Context

Sajt je statičan. Editor već ima CodeMirror, radnu verziju po putanji u `localStorage` i razliku linija. Do ove izmene `site/js/main.js` za prikaz vuče stablo i tekst sa diska preko `/api/stablo` i `/api/fajl`, a `polazniTekst` za CSS i za HTML bez `<` uzima gotov fajl. Nedelja 1 u `site/kurs.json` drži ceo `original`. Nedelje 2–10 drže `delic`, koji `site/js/lectures.js` prosleđuje kao original. Vidi `proposal.md` za razlog. Zahtevi su u delti `sajt-casa` i `casovi`.

## Goals / Non-Goals

**Goals:**

- Stablo i ugrađena verzija računaju se iz koraka kursa do otvorenog indeksa, u browseru.
- `index.html` dobija init tek kad u snimku postoji klijentski skript.
- Razlika i reset koriste taj snimak. Radna verzija ostaje jedna po putanji.

**Non-Goals:**

- Upis celih fajlova nedelja 2–10 u `site/kurs.json`.
- Izmena fajlova na disku u `client/` i `server/`.
- Izvršavanje `server/` u browseru.
- Posebna radna verzija za svaki korak.

## Decisions

### Snimak se gradi hodom kroz korake

`site/js/stablo.js` ide koracima od početka do otvorenog indeksa. Fajl se pojavljuje kad ga korak prvi put imenuje. Ako korak ima ugrađen ceo original, taj tekst zamenjuje fajl. Inače se `delic` dopisuje. Ako `isecak` počinje sa `class Ime`, sadrži prvu liniju delića, a klasa još nije u fajlu, ulazi ceo `isecak`. Za `client/js/korak.js`, kad postoje `function korak` i pominjanje `delta` bez deklaracije, ispred teksta ide `let delta = 1;`. Keš je `WeakMap` nad nizom koraka. `site/js/lectures.js` postavlja `ugradjen` kad korak u dokumentu ima polje `original`.

Alternativa: i dalje čitati disk, a delić lepiti u prikaz. Odbijena jer CSS i HTML bez oznake i dalje pokazuju poslednji fajl. Alternativa: upisati cele fajlove u kurs za nedelje 2–10. Odbijena jer dokument već drži doprinos koraka, a spajanje je prikaz editora.

### Init stoji u snimku stranice

Posle svakog koraka, ako `client/index.html` ima `</body>` i snimak ima bar jedan `client/js/*.js`, postojeći blok između `<!-- povezi-pocetak -->` i `<!-- povezi-kraj -->` se skida i upisuje novi. Redosled `src` je redosled uvođenja, putanje su relativne na `client/`. Inline skript je klasičan, ne modul. Vezuje samo deklarisane simbole: `delta` ako nedostaje, `cifra` i `dugme`, `new Displej` i `new Prekidac`, `granica(24)`, `iznadPraga`, `temperature`, slušalac `preventDefault` ako se reč pojavljuje u HTML-u, i klik koji zove `prekidac.crtaj`, `korak(soba)`, `displej.crtaj` ili `cifra.textContent`. Kad se pominje `nacrtajLiniju`, ulazi canvas 320×120 i čuvan poziv. Delić koji ne počinje sa `<` ulazi u HTML kao komentar, da `e.preventDefault()` ne postane oznaka.

Alternativa: držati init samo na disku. Odbijena jer rani koraci tada vezuju kod koji još nije u stablu.

### Editor čita snimak, ne disk

`site/js/main.js` za stablo i tekst zove `stabloDo`, `fajloviStrane` i `prethodnaVerzija`. Više ne zove `/api/stablo` ni `/api/fajl` da napuni editor. `prime()` i dalje sme da učita klijentske skripte za živi panel. Otvaranje koraka ostavlja režim radne verzije. Dok nastavnik nije kucao, ekran pokazuje snimak. Razlika poredi snimak otvorenog koraka sa snimkom iste putanje na indeksu minus jedan. Ako putanja tada ne postoji, baza je prazna i sve linije su zelene.

Primena bafera ide samo kad fajl deklariše očekivani simbol: `function korak`, obe funkcije linije, `class Displej` ili `class Prekidac`. Inače se briše poruka da delić nije primenjen. Bafer koji simbol ima i baci i dalje ostavlja poslednji crtež i tu poruku.

Alternativa: razlika i dalje traži poslednji raniji korak koji ima original tog fajla. Odbijena jer preskače korake između i poredi sa starim delićem umesto sa snimkom prethodnog koraka.

## Risks / Trade-offs

- [Spajanje delića ponavlja tekst ako kurs dva puta doda istu liniju na drugi način] → Isti već ubačen blok se ne dodaje drugi put. Celi original i dalje zamenjuje fajl.
- [Rani `prekidac.js` zove `dugme` pre nego što postoji, pa bafer baci iako klasa postoji] → To ostaje pravilo bafera koji baci: poslednji crtež i poruka da delić nije primenjen.
- [Init je izveden iz imena u kursu, ne iz ručno pisane stranice] → Marker se skida pre sledećeg koraka, pa stari init ne ostaje u dokumentu.

## Migration Plan

Ista stranica. Ključ `radnaVerzija` se ne menja. Fajlovi na disku se ne prepisuju. Vraćanje je prethodni commit editora.

## Open Questions

Nema.
