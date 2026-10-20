# Design

## Context

Vidi `proposal.md` za razlog. Kratka pitalica je `.opcije-mreza`: u osnovi jedna kolona, a od 861px dve. Test `test/tema.test.mjs` zaključava oba pravila. `pitalice` već traži jedan red po odgovoru; `sajt-casa` traži dva stupca na širokom času. Ovaj change rešava sukob u korist jedne kolone.

„Osvrt” je `<details>` u `renderLecture` i čita `nedelja.overview`. Ispod njega, na svakom koraku, stoje `nedelja.izlaz` i `textarea` bez slušaoca. Polja pretpostavki i zaključka žive u `nacrtajDiskusiju` i pamte tekst u mapi časa.

`izgradi` u `site/js/stablo.js` već preskače korak bez `putanja` i ostavlja prethodni snimak. `focusFile` u tom slučaju pada na `fileForLecture`, a za nedelju 1 to je `client/css/soba.css`, fajl koji još nije uveden. Nedelja 1 ima 17 koraka i tačno 90 minuta. Granica dokumenta je 10 do 20 koraka po nedelji.

## Goals / Non-Goals

**Goals:**

- Jedna kolona kratke pitalice na svakoj širini.
- Tri koraka-crteža na početku nedelje 1, sa natpisima iz `site/kurs.json`.
- Izlaz kao rečenica samo na poslednjem koraku, bez polja.
- Prazan editor dok korak ne imenuje fajl.

**Non-Goals:**

- Nova nedelja, nova zavisnost, biblioteka animacija.
- Teorija za imena koja čas ne predaje.
- Izmena faza diskusije, panela ili `kontrolna-soba`.
- Promena rasta HTML-a od Stranice do Semantike.

## Decisions

### Jedna kolona je brisanje izuzetka

U `site/css/site.css` ostaje `.opcije-mreza { grid-template-columns: 1fr }`. Briše se samo medijsko pravilo na 861px koje to prebija u `1fr 1fr`. `.options` diskusije se ne dira.

Alternativa: ostaviti dva stupca ispod neke veće širine. Odbijena jer nastavnik na projektoru vidi A pored B, a zahtev je jedan ispod drugog.

### Crtež je polje koraka, ne tekst u školjci

Koraci Web, Internet i Istorija nemaju `putanja`, `isecak` ni `delic`. Imaju `figura`. Ime `crtez` ostaje crtežu sobe u pregledu i ne prelazi na korak.

- `vrsta: "put"` i `cvorovi` sa `id` i `natpis`. Web: Browser, URL, Dokument, Prikaz, bez `pokret`. Internet dodaje Mreža između URL-a i Dokumenta i `pokret: "jednom"`.
- `vrsta: "linija"`, `pokret: "redom"`, `oznake` sa `godina` i `natpis`: 1969 mreža paketa, 1983 TCP/IP, 1989 predlog povezanih dokumenata, 1991 javni Web, pa stranica ovog kursa dok je `server/` prazan.

`site/js/figura.js` od podataka pravi SVG. Geometrija (mesta čvorova, putanja markera) sme da bude u tom modulu. Natpisi i godine ne smeju. `renderLecture` umeće SVG posle ključne ideje i preskače isečak, „Fajl:” i „Već u fajlu”.

Alternativa: natpisi u `main.js`. Odbijena jer telo kursa mora da ostane u dokumentu. Alternativa: gotove slike. Odbijena jer se natpis ne menja iz dokumenta i smanjeno pokretanje ne može da zaustavi ugrađen film.

### Pokret je jedan CSS prolaz

Marker na Internet crtežu ide od Browsera do Dokumenta jednom (`animation-iteration-count: 1`, `forwards`), bez petlje. Oznake istorije ulaze redom, jednom. `@media (prefers-reduced-motion: reduce)` gasi oba: marker stoji na dokumentu, sve oznake su odmah vidljive. Postojeće pravilo za elise se ne menja.

Alternativa: SMIL ili biblioteka. Odbijena jer kurs nema korak izgradnje i ne uvodi zavisnost.

### Editor ćuti dok nema fajla

Korak bez `putanja` ne zove `fileForLecture`. Stablo te strane je prazno, editor nema otvoren bafer, a pregled se ne crta iz tuđeg fajla. Podela i dalje prva uvodi `client/index.html` i skicu. `izgradi` već tako pamti snimak; menja se samo izbor otvorenog fajla u `focusFile` / `loadSide`.

Alternativa: crtež-koraci nose `putanja` Podele. Odbijena jer bi stablo prikazalo `client/index.html` pre koraka koji ga uvodi.

### Izlaz je pasus poslednjeg koraka

`textarea` izlaza i njen natpis nestaju. Na poslednjem koraku nedelje jedan pasus sa klasom `log` pokazuje `nedelja.izlaz`. Raniji koraci ga ne pokazuju. `nacrtajDiskusiju` i dalje pravi polja pretpostavki i zaključka.

`overview` se briše iz dokumenta i više se ne čita. Korak časa 10 sa naslovom Osvrt postaje „Jedna soba”: rečenica o tipu i predlogu asistenta ostaje u `tekst` tog koraka, bez reči „osvrt” i bez drugog glasanja. Korak Izlaz više ne kaže da postoji slobodan upis; tačan odgovor i dalje kaže da nema pečata ni opcija, a obrazloženje kaže da nema ni polja.

### Minuti ostaju 90, koraka bude 20

Novi koraci su po 5 minuta. Sa postojećih se skida 15, sa mehaničkih koraka, ne sa Podele, osvežavanja, alata, dva zahteva, sobe i semantike:

| Korak | Min |
| --- | --- |
| Web, Internet, Istorija | 5, 5, 5 |
| Podela, Stranica | 6, 6 |
| Glava, Telo, Naslov, Broj, Dugme, Veza | 4, 4, 4, 4, 4, 4 |
| Selektor, Okvir, Unutra, Spolja | 3, 2, 2, 2 |
| Osvežavanje, Alati, Dva zahteva, Soba prekidača, Semantika | 6, 6, 6, 6, 6 |

Zbir je 90. Tri nova koraka dižu nedelju 1 na 20, što je gornja granica „10 do 20”.

Alternativa: jedanaesta nedelja samo za istoriju. Odbijena jer dokument i naslovi nedelja ostaju deset, a istorija je uvod u postojeću prvu nedelju.

## Risks / Trade-offs

- [Nedelja 1 je na granici od 20 koraka] → Ovaj change ne dodaje četvrti uvodni korak. Sledeći dodatak mora da spoji korak ili da menja granicu posebnim zahtevom.
- [Glava do Veze padaju na 4 minuta] → To su kratki dodaci oznaka. Koraci koji nose razliku dokumenta i prikaza ostaju na 6.
- [`fileForLecture` bi na Webu otvorio CSS] → Prazan editor je deo odluke, ne sporedni efekat. Test ne sme da traži `soba.css` na prva tri koraka.
- [Animacija na projektoru odvrati od rečenice] → Jedan prolaz, pa miran kadar. Smanjeno pokretanje preskače prolaz.
- [Testovi traže `overview` i dva stupca] → `test/koraci.test.mjs` i `test/tema.test.mjs` menjaju očekivanje u istom change-u. Rečenica o tipu traži se u koraku „Jedna soba”, ne u `overview`.

## Migration Plan

Nema migracije podataka ni servera. Posle izmene dokumenta čas se učitava iznova; `localStorage` radne verzije fajlova se ne dira jer crtež-koraci ne pišu fajl. Povratak je vraćanje prethodnog `site/kurs.json`, `site/js/main.js`, `site/css/site.css` i brisanje `site/js/figura.js`.
