# Design

## Context

Vidi `proposal.md` za razlog i plan od 20 koraka. Vidi delte `casovi`, `pitalice` i `sajt-casa` za ponašanje. Telo kursa je `site/kurs.json`. Školjka čita `trajanjeNedelja` i ne broji do deset. Panel i tab Server ne čitaju naslov nedelje: `serverTabVidljiv` u `site/js/radna.js` je `nedelja >= 4`, a `fitPanel` u `site/js/main.js` pali sobu mašina, log, grafikon, takt, bazu, uloge i svežinu istim brojevima. Korak bez `putanja` već ne otvara bafer (`focusFile`). Crtež već zna `put` i `linija`. Natpisi dolaze iz dokumenta.

## Goals / Non-Goals

**Goals:**

- Nova nedelja je samo dokument: tekst, pitalica, tri crteža postojećih vrsta, diskusija, rezerva, izlaz.
- Deset časova izgradnje ostaje isti niz koraka, na položajima 2–11. Sa časa stranice skidaju se Web, Internet i Istorija.
- Kapije panela i taba Server prate nove položaje. Nedelja 1 ne crta 24 i ne šalje zahtev sobi.

**Non-Goals:**

- Nova vrsta crteža, biblioteka animacija, izmena `GLOSSARY.md`.
- Premeštanje sačuvanog položaja u `localStorage`.
- Rekonstrukcija DNS-a ili TLS-a, novčanik, ugovor, tok ili Ajax u kodu.
- Dirati `kontrolna-soba` i fajlove na disku koje čas prekucava.

## Decisions

### Nedelja je niz u dokumentu, ne grana školjke

`nedelje[0]` postaje „Zašto je Web nastao”. `trajanjeNedelja` postaje 11. `preduslovPrve` postaje rečenica da još nema fajla i da priča počinje pre stranice. Ishod te nedelje kaže da je Web usluga na Internetu, da je stranica dokument, i da `server/` još nema fajlove. `preduslovCasa(2)` već čita ishod prethodne nedelje, pa čas stranice dobija taj ishod bez posebne grane.

Koraci nemaju `putanja`, `isecak` ni `delic`. Tekst počinje pitanjem. Kratka pitalica ima neoznačene opcije, kao ostali koraci. `pojmoviCasa` te nedelje drži hipertekst, TCP, UDP, HTML, XML, ECMAScript, Ajax i W3C. Pojmovnik iz `GLOSSARY.md` ostaje nastavni model, ne rečnik ovih imena.

Alternativa: ostaviti Web, Internet i Istorija na času stranice. Odbijena jer su to tanki koraci koje nova nedelja zamenjuje. Predlog to beleži kao pretpostavku.

### Tri crteža, ostalo priča

Samo Hipertekst, TCP i UDP i Dokument imaju `figura`. Hipertekst i TCP i UDP su `vrsta: "put"`, bez obaveznog pokreta. Dokument je `vrsta: "linija"`, `pokret: "redom"`, oznake 1969, 1989, 1995, 2005, 2008 i sledeća nedelja. Natpisi su u JSON-u. Smanjeno pokretanje već zaustavlja liniju. Ajax i ostale anegdote nemaju crtež: školjka već ume korak bez isečka kad nema `figura`.

Alternativa: crtež na svih 20. Odbijena jer `put` i `linija` ne nose anegdotu, a nova vrsta nije potrebna.

### Minuti

Nedelja 1, zbir 90: LO, Paket, Internet, Predlog, HTML, W3C, XML, ECMA, Bez dodatka, Ekonomija i Društvo po 4. TCP i UDP, Hipertekst, Rat browsera, Deset dana, Web 2.0, Striming, Web 3.0 i Dokument po 5. Ajax 6.

Čas stranice danas ima 22 koraka i zbir 90, uključujući Promenljiva i Calc posle Spolja. Posle skidanja tri koraka od po 5 ostaje 75, pa se 15 vraća na kratke korake i zbir je opet 90, na 19 koraka: Podela i Stranica po 6. Glava, Telo, Naslov, Broj, Dugme i Veza po 4. Selektor, Okvir, Unutra, Spolja, Promenljiva i Calc po 4. Osvežavanje, Alati, Dva zahteva, Soba prekidača i Semantika po 6. Promenljiva i Calc ostaju, istim originalom.

### Kapije se dižu za jedno, nedelja 1 ćuti

Svaka provera `cas >= N`, `cas > N`, `cas < N` i `cas === N` u `fitPanel`, `uskladiKutiju` i čitanju sobe, koja danas zna čas izgradnje, diže prag za 1. `serverTabVidljiv` postaje `nedelja >= 5`. Log ostaje samo na nedelji 3, grafikon samo na nedelji 4, „24” samo na nedelji 2. Nedelja 1 ne zove crtanje „24” ni „----”: cifre su prazne, „Sledeći” je sakriven, soba mašina je sakrivena, nema zahteva sobi.

Alternativa: paliti panel po naslovu nedelje. Odbijena jer bi svaki uslov tražio ime, a pomeraj je jedan i isti za sve postojeće pragove.

### Sačuvan položaj se ne seli

Ključ `web-programiranje:korak` i dalje čuva broj nedelje. Posle ubacivanja taj broj otvara novi položaj. Nema čitanja starog broja i sabiranja jedan.

## Risks / Trade-offs

- [Prag u `main.js` ostane na starom broju] → Jedan prolaz po `cas ===` i `cas >=` uz test koji za nedelju 1 tvrdi tihi panel, za nedelju 2 cifru 24, a za nedelju 5 sobu mašina i tab Server.
- [Imena scenarija u delti ostaju „Week 1” i „Lecture 4” iako je čas pomeren] → Arhiva odbija promenu imena scenarija. Tekst WHEN/THEN nosi novi čas. Čitati telo, ne naslov scenarija.
- [Sačuvan čas nastavnika otvori istoriju umesto Podele] → Prihvaćeno. Nema migracije.
- [Nedelja 2 i dalje drži Web, Internet i Istorija ako se predpostavka odbije] → Predlog je eksplicitan. Ako se predpostavka promeni, vraćaju se tri koraka i minuti se opet skidaju sa časa stranice, a zbir ostaje 90.

## Migration Plan

Izmena je dokument i pragovi u školjci. Nema koraka izgradnje ni migracije baze. Povratak je vraćanje izmene: deset nedelja, pragovi na starim brojevima, tri uvodna koraka opet na času stranice.

## Open Questions

Nema. Predpostavka da Web, Internet i Istorija ne ostaju na času stranice zapisana je u predlogu.
