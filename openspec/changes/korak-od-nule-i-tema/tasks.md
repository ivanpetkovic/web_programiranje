# Tasks

## 1. Originali nedelje 1

- [ ] 1.1 U `site/kurs.json`, na koraku Osvežavanje, dodaj na kraj `body` liniju `<!-- osvežavanje vraća dokument -->` i postavi `isecak` i `delic` na tu liniju. Istu liniju zadrži u originalima Alati, Dva zahteva, Soba prekidača i Semantika. Na Semantiku dodaj i `<!-- naslov je h1, ne pasus -->`, a njen `isecak` i `delic` postavi na tu drugu liniju. Ne diraj Podelu, Stranicu, Razmak, Okvir, nedelje 2–10 ni fajlove na disku. Proveri `node --test test/koraci.test.mjs`: posle Stranice svaki sledeći original `client/index.html` sadrži sve linije prethodnog i bar jednu novu; Osvežavanje pominje osvežavanje, Semantika pominje naslov i i dalje sadrži `24` i ne sadrži `/api/soba` ni sobu mašina; Razmak je jedno pravilo, Okvir ga sadrži i dodaje okvir.

## 2. Reset i prekidač

- [ ] 2.1 U `site/index.html` dodaj dugme `#reset-radne` pored `#verzija`, sa pristupačnim imenom „Resetuj radnu verziju”. U `site/js/main.js` klik upisuje ugrađeni original otvorenog koraka u radnu verziju samo te putanje, prikazuje taj tekst i ne menja disk. `#verzija` i dalje samo menja režim; pristupačno ime je „Prikaži radnu verziju” ili „Prikaži ugrađenu verziju”. Proširi `test/editor.test.mjs` da reset zameni sačuvani tekst originalom koraka, ostavi drugu putanju, i da prekidač ne briše mapu. Pokreni `node --test test/editor.test.mjs`.

## 3. Školjka obe teme

- [ ] 3.1 U `site/css/site.css` razdvoj `--zlato: #e8a317` i `--na-zlatu: #1a1204` od `--korak`. Tamni `--korak` je `#ffb000`, svetli `#8a5600`, i isti par stoji u `html[data-tema="svetla"]` i u `:root:not([data-tema])` unutar svetlog `prefers-color-scheme`. Svetla podloga je `#fafafb`, kartica `#ffffff`, naslov `#0a0a36`, mastilo `#1c2430`. Tamna podloga je `#100f0c`, kartica `#1c1a16`, naslov `#f7f4ee`. `.korak` čita `--korak`. Naslov kursa, trenutni broj koraka, popuna kartice i ivica izabrane opcije čitaju `--zlato`. Hod koraka ostaje `#ffb000` na `#1a1204`. Bunar ostaje `#111111`. Lice zaglavlja, spiska, naslova lekcije i kartice je `system-ui, "Segoe UI", sans-serif`. Cifre ostaju Digital-7 Mono. Osnovna `.opcije-mreza` ostaje jedan stupac; iznad 860px ima dva. Ažuriraj `test/tema.test.mjs` da ovo tvrdi, uključujući kontrast reda koraka i beleški od bar 4.5:1 i cifara od bar 3:1, pa pokreni `node --test test/tema.test.mjs`.
- [ ] 3.2 U `site/index.html` ostavi jedno dugme `#tema` u zaglavlju. U `site/js/main.js` klik i dalje zakuca drugu temu u `dataset.tema` i u ključ `tema`, bez promene haša i bez ponovnog crtanja časa. Vidljiv sadržaj dugmeta je ikonica; `aria-label` je „Svetla tema” ili „Tamna tema”, prema temi koju će klik uključiti. Proširi `test/tema.test.mjs` da postoji tačno jedno `#tema` i da `main.js` postavlja to ime, pa ponovo pokreni `node --test test/tema.test.mjs`.

## 4. Zajednička provera

- [ ] 4.1 Pokreni `node --test test/*.test.js test/*.test.mjs`. U browseru otvori nedelju 1 na Gradivu: svetla i tamna tema prate kartice i zlato sa slika, dugme teme okrene temu a ostane isti korak, Osvežavanje i Semantika u editoru pokazuju novu liniju prema prethodnom originalu, reset vrati ukucani tekst na ugrađeni original, a prekidač i dalje čuva ukucano dok se ne resetuje.
