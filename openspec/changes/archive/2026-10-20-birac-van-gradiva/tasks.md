## 1. Mesto birača

- [x] 1.1 U `site/index.html` dodaj `#birac-mesto` između `.cas-glava` i `#sekcija-koraci`. U `renderLecture` u `site/js/main.js` ubaci birač u `#birac-mesto`, a nivo, minute i Sačuvaj korak ostavi u `#cas`. `prikaziDeo` i dalje krije tačno jednu od tri sekcije i ne dira birač. U `test/tema.test.mjs` zameni traženje `casEl.append(birac` traženjem ubacivanja u `#birac-mesto`. Pokreni `node --test test/tema.test.mjs`.

## 2. Progress traka

- [x] 2.1 U `nacrtajBirac` postavi širinu `.birac-traka > span` na `(i + 1) / item.steps.length`. Traka ima `role="progressbar"`, `aria-valuemin` 1, `aria-valuenow` jednak n, `aria-valuemax` jednak N i `aria-label` Napredak kroz korake. Ne zovi `popunaKoraka` za tu širinu. `popunaKoraka` ostaje u `site/js/birac.js`, a `test/birac.test.mjs` i dalje proverava 3/17. U `site/css/site.css` traka je donja ivica `.birac`, pune širine, podloga `var(--line)`, popuna `var(--amber)`. Meni `#birac-meni` nije odsečen karticom. U `test/tema.test.mjs` proveri formulu širine i ćilibar popune, i ukloni zahtev da `main.js` zove `popunaKoraka`. Pokreni `node --test test/tema.test.mjs test/birac.test.mjs`.

## 3. Hod bez promene taba

- [x] 3.1 Prethodni, Sledeći i stavka iz Svi koraci i dalje menjaju samo indeks koraka i zovu `renderLecture`. Ne postavljaju `deo`. Sledeći ostaje onemogućen na poslednjem koraku, Prethodni na prvom, a podloga Sledeći ostaje `var(--ink)`. Sačuvaj korak, oznaka završene nedelje i kartica napretka se ne menjaju. Pokreni `node --test test/tema.test.mjs test/ikonice.test.mjs test/editor-izbor.test.mjs`.

## 4. Cela provera

- [x] 4.1 Pokreni `npm test`. U browseru otvori nedelju na prvom koraku: birač stoji iznad Gradiva, na Diskusiji i na Editoru, traka je popunjena sa 1/N, a Sledeći na Editoru otvara sledeći korak i ostavlja Editor otvoren.
