# Design

## Context

Birač crta `nacrtajBirac` u `site/js/main.js` i stavlja ga u `#birac-mesto`. `.cas-glava` je grid, pa birač rasteže na kolonu. Sredina reda ima `flex: 1`, a `.birac-traka` je `progressbar` širine `(i + 1) / N` u boji `var(--amber)`. Meni „Svi koraci” već otvara bilo koji korak preko `korakPoCasu` i `renderLecture`, bez promene taba. Vidi `proposal.md` za razlog. Zahtevi su u delti `sajt-casa`.

## Goals / Non-Goals

**Goals:**

- Traka nestaje, a svaki korak teme je krug čija boja zavisi samo od otvorenog indeksa.
- Širina birača je širina sadržaja. Niz krugova je širi kad ima više koraka i ne prelazi kolonu.

**Non-Goals:**

- Drugačija boja trenutnog kruga od prethodnih. Menjanje „Svi koraci”, Prethodni, Sledeći, kartice napretka ili zapisa sačuvanog koraka.
- Vraćanje reda brojeva u telo lekcije. Izmena delte u `izgled-editora`.

## Decisions

### Krugovi zamenjuju traku, ne meni

`.birac-traka` i `role="progressbar"` se ne crtaju. Ispod reda kontrola stoji grupa dugmadi, jedno po koraku, `border-radius: 999px`, prečnik `0.7rem`, razmak `0.35rem`. Klik radi isto što i stavka menija: `korakPoCasu.set(cas, indeks)` pa `renderLecture`. Vidljiv broj u krugu nema. Pristupačno ime je redni broj i naslov. Otvoreni krug ima `aria-current="step"`. Grupa ima ime „Koraci”.

Alternativa: broj u svakom krugu. Odbijena jer zaglavlje već kaže Korak n od N, a pun red brojeva je upravo ono što birač zamenjuje.

Alternativa: trenutni krug ima prsten. Odbijena jer su prethodni i trenutni isti žuti, a granica žutog i sivog jeste trenutni korak.

### Boja je indeks, ne sačuvan korak

Krug čiji je indeks manji ili jednak otvorenom koristi `var(--amber)`. Na mornaru i uglju to je `#ffb000`. Na pesku i terakoti ostaje naglasak te teme, ne posebna žuta. Kasniji krug koristi `--korak-buduci`: `#d9d3c7` na mornaru i uglju, `#8f897f` na pesku i terakoti. Tamnija siva na svetlim temama i dalje je siva, a prema `--paper` drži kontrast kontrole od 3:1. Sačuvani koraci ne ulaze u račun.

Alternativa: ista svetla siva na sve četiri teme. Odbijena jer `#d9d3c7` na belom papiru peska nestaje.

### Širina je sadržaj, pa prelom

`#birac-mesto` dobija `justify-self: start` i `max-width: 100%`. `.birac` dobija `width: max-content` i `max-width: 100%`. Sredina reda gubi `flex: 1`. Naslov koraka se seče posle `16rem`, da dugačak naslov ne vrati punu kolonu. Niz krugova je `flex-wrap: wrap` i nema procentualnu širinu. Kad je niz uži od kontrola, birač je širok koliko kontrole. Kad je niz širi, birač raste do kolone, pa se krugovi prelamaju.

Alternativa: puna kartica, a kratka je samo traka. Odbijena jer birač sam ne treba da pređe preko cele širine.

Alternativa: vodoravni scroll. Odbijena jer prelom ostavlja svaki krug na ekranu.

### Nearhivirana traka završenih koraka

`izgled-editora` i dalje ima zahtev `Traka završenih koraka`. Ovaj change ga ne ostvaruje i ne menja tu izmenu. Kod posle ove izmene nema traku. Pri arhivi `izgled-editora` taj zahtev se ne uvodi u glavnu specifikaciju ako je ova delta već tu.

## Risks / Trade-offs

- [Isti žuti krug za prethodne i trenutni] → granica boje i natpis Korak n od N. `aria-current` ostaje za čitač.
- [19 krugova i dugačak naslov i dalje mogu da zauzmu veći deo kolone] → kartica staje na `max-width: 100%` i prelama krugove, a naslov se seče.
- [Arhiva `izgled-editora` može da vrati traku po sačuvanim koracima] → ne sinhronizovati `Traka završenih koraka` preko ove delte. Ovaj change tu traku ne dodaje.

## Migration Plan

Nema zapisa ni zahteva prema serveru. Povratak je vraćanje `.birac-traka` i širine `(i + 1) / N`.

## Open Questions

Nema. Prečnik, razmak, prelom i siva po temi su zaključani ovde.
