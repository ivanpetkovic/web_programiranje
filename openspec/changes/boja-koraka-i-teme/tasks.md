# Tasks

## 1. Tokeni teme

- [ ] 1.1 U `site/css/site.css` ostavi tamne tokene na `:root` (`--amber: #ffb000`, postojeće mastilo i podlogu, `color-scheme: dark`). Dodaj svetle tokene na `html[data-tema="svetla"]` i, samo za `:root:not([data-tema])`, unutar `@media (prefers-color-scheme: light)`. Svetli `--amber` je `#8a5600`, svetli `--muted` je `#5e564c`, svetli `--on-amber` je `#fffdf8`, svetli `--good` je `#3f6212`, svetli `--bad` je `#9f2d22`, uz svetlu podlogu i tamno mastilo iz `design.md`. `color-scheme` prati aktivnu temu. Zameni pozadinu `pre` tokenom koji svetli, a pozadinu `#grafikon` ostavi `#111111` u obe teme. Preskok koristi `var(--on-amber)` umesto fiksnog `#1a1204`. Proveri novim `test/tema.test.mjs` kroz `node --test test/tema.test.mjs` da tamni `--amber` ostane `#ffb000`, da svetli `--amber` bude `#8a5600`, da svetli korak i beleške prolaze 4.5:1, da svetle cifre prolaze 3:1, i da bunar grafikona ostane `#111111`.

## 2. Red koraka

- [ ] 2.1 U `site/js/main.js` pasusu koji piše „Korak N od M” stavi klasu `korak` umesto `log`. U `site/css/site.css` dodaj `.korak { color: var(--amber); }` i ostavi `.log` na `--muted`. Proširi `test/tema.test.mjs` da to tvrdi, pa ponovo pokreni `node --test test/tema.test.mjs`.

## 3. Zakucavanje

- [ ] 3.1 U `site/index.html`, u `head` i pre linka na `site.css`, ubaci skriptu koja čita `localStorage` ključ `tema` i, samo za `tamna` ili `svetla`, postavlja `document.documentElement.dataset.tema`. Grešku skladišta guta. Proširi `test/tema.test.mjs` da skripta stoji ispred stilova i da pominje ključ `tema`, pa ponovo pokreni taj test.
- [ ] 3.2 U zaglavlje dodaj dugme `type="button"` van forme pretrage. Natpis je „Svetla tema” ili „Tamna tema”, prema temi koja će važiti posle klika. Klik u `site/js/main.js` upisuje drugu vrednost u `dataset.tema` i u ključ `tema`, ne menja `location.hash` i ne zove ponovno crtanje časa. Proveri u browseru: otvori čas na koraku koji nije prvi, klikni dugme, isti čas i isti naslov koraka ostaju, `data-tema` se okrene, a posle učitavanja ostaje zakucana tema. Tastaturu proveri tako što fokus na dugme ima vidljiv obrub.

## 4. Obe teme na stranici

- [ ] 4.1 U browseru, bez ključa `tema`, proveri da sistemska tamna i izostanak podešavanja daju tamnu stranu, a sistemska svetla svetlu. Sa zakucanom tamnom temom i sistemom na svetlo, strana ostaje tamna. Na tamnoj je red koraka `#ffb000`, a faza i osvrt ostaju prigušeni. Na svetloj red koraka nije `#ffb000`, podloga je svetla, mastilo tamno, cifre se čitaju, a na času 3 bunar grafikona ostaje taman i žuta linija se vidi. `client/css/soba.css` i `client/js/niz.js` nemaju izmenu.
