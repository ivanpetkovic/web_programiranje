# Tasks

## 1. Širina i boje

- [x] 1.1 U `site/css/site.css` ukloni `.birac-traka`. `#birac-mesto` dobija `justify-self: start` i `max-width: 100%`. `.birac` dobija `width: max-content` i `max-width: 100%`. Sredina `.birac-red` gubi `flex: 1`. Naslov koraka se seče posle `16rem`. Niz `.birac-krugovi` je `display: flex`, `flex-wrap: wrap`, `gap: 0.35rem`, bez procentualne širine. Krug je `0.7rem` puta `0.7rem`, `border-radius: 999px`, bez vidljivog teksta. Dodaj `--korak-buduci`: `#d9d3c7` na `:root`, `ugalj` i `mornar`, a `#8f897f` na `pesak`, `terakota` i svetli `prefers-color-scheme`. Dosegnuti krug koristi `var(--amber)`, budući `var(--korak-buduci)`. U `test/tema.test.mjs` zameni traženje `.birac-traka` ovim pravilima i proveri da `#ffb000` ostaje `--amber` na mornaru i uglju. Pokreni `node --test test/tema.test.mjs`.

## 2. Krug po koraku

- [x] 2.1 U `nacrtajBirac` u `site/js/main.js` ne crtaj `progressbar` ni širinu `(i + 1) / item.steps.length`. Za svaki korak teme dodaj dugme u `.birac-krugovi`. Indeks manji ili jednak otvorenom dobija klasu dosegnutog kruga, kasniji klasu budućeg. Klik zove `korakPoCasu.set(cas, indeks)` i `renderLecture`. Dugme nema tekst, ima pristupačno ime od rednog broja i naslova, a otvoreno ima `aria-current="step"`. Grupa ima `aria-label` Koraci. Prethodni, Svi koraci, Sledeći, Korak n od N i naslov ostaju. U `test/tema.test.mjs` ukloni traženje `Napredak kroz korake` i procente širine, pa proveri jedan krug po koraku, `aria-current="step"` i da sačuvani koraci ne biraju klasu. Pokreni `node --test test/tema.test.mjs`.

## 3. Cela provera

- [x] 3.1 Pokreni `npm test` i potvrdi da testovi časa, uključujući `test/tema.test.mjs` i `test/birac.test.mjs`, prolaze zajedno. `popunaKoraka` ostaje za svoje testove i ne boji krugove.

## Workflow follow-up

- Sync delte u `openspec/specs/` tek kad su zadaci gotovi, uz arhivu.
- Pri arhivi `izgled-editora` ne uvoditi `Traka završenih koraka` preko ove delte.
