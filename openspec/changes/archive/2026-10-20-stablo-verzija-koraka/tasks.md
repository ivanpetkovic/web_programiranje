# Tasks

## 1. Snimak stabla

- [x] 1.1 U `site/js/stablo.js` izgradi snimak do indeksa koraka: fajl se pojavljuje kad ga korak imenuje, ceo original zamenjuje fajl, kasniji `delic` se dopisuje, klasa iz `isecak` ulazi jednom, a `client/js/korak.js` dobija `let delta = 1;` kad `function korak` pominje `delta` bez deklaracije. Proveri `node --test test/stablo.test.mjs`: Podela je samo skica, Selektor je jedno pravilo, Delta počinje sa `let delta = 1;` i zadržava `const soba`.
- [x] 1.2 U isti snimak, kad `index.html` ima telo i postoji `client/js`, ubaci `<script src>` redosledom uvođenja i klasičan inline init između `<!-- povezi-pocetak -->` i `<!-- povezi-kraj -->`. Init vezuje deklarisane simbole, a canvas 320×120 ulazi kad se pominje `nacrtajLiniju`. Proveri u `test/stablo.test.mjs` da Semantika nema skriptu, Objekat učitava samo `js/korak.js`, a Prekidač i Linija vezuju klase i canvas.

## 2. Editor čita snimak

- [x] 2.1 U `site/js/main.js` stablo, ugrađena verzija i razlika dolaze iz `stabloDo` i `prethodnaVerzija`. Editor ne zove `/api/stablo` ni `/api/fajl` i ne koristi `polazniTekst`. Razlika Broja ide prema snimku prethodnog koraka. Reset i prekidač i dalje rade nad snimkom otvorenog koraka, a radna verzija ostaje jedna po putanji. Proveri `node --test test/editor.test.mjs` i scenario razlike u `test/stablo.test.mjs`.
- [x] 2.2 Primena bafera ide samo kad fajl deklariše očekivani simbol (`function korak`, obe funkcije linije, `class Displej`, `class Prekidac`). Inače editor briše poruku da delić nije primenjen. Bafer koji simbol ima i baci i dalje ostavlja poslednji crtež. Proveri čitanjem `site/js/main.js` da Objekat ne ulazi u `applyKorak` bez `function korak`.

## Workflow follow-up

- Delte su usklađene sa glavnim specifikacijama `sajt-casa` i `casovi`.
- Arhiviraj izmenu kad nastavnik to zatraži.
