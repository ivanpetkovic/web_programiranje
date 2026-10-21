# Design

## Context

Sajt časa je jedna statična stranica bez koraka izgradnje. `site/index.html` nosi natpis „Kontrolna soba”, polje „Nađi pojam” i dugme koje zakuca temu. `paintNav` u `site/js/main.js` ispisuje brojeve 1–10, a `hashchange` prima samo `n <= 10`. Tekst nedelja je niz u `site/js/lectures.js`. Pojmovnik koji nastavnik već drži je `GLOSSARY.md` u korenu, a accordion na času čita drugi spisak, `terms` unutar nedelje. Server iz `server/server.js` statički šalje samo `site/`. Tamna tema je podrazumevana kad ništa nije zakucano i sistem ne traži svetlu. Vidi `proposal.md` za razlog. Ponašanje je u deltama `sajt-casa`, `casovi` i `pitalice`.

## Goals / Non-Goals

**Goals:**

- Školjka crta regione sa oba mocka, a brojeve, naslove i minute čita iz dokumenta kursa.
- Jedan izvor pojmova: `GLOSSARY.md`. Typeahead i isprekidana crta dele isti zapis.
- Trajanje koje nije deset i nije petnaest i dalje daje ispravan klizač, natpis i procenat.

**Non-Goals:**

- Novi nastavni plan od petnaest nedelja. Petnaest je proba školjke, ne zamena deset nedelja koje dokument i dalje nosi.
- Nalog, ocena ili tajmer. Dugme za temu koje sajt već ima ostaje.
- Izmena ugovora kutije, faza duge diskusije, Front/Back stabla i trake editora.
- Uvlačenje pojmova iz `terms` u `GLOSSARY.md`.

## Decisions

### Dokument kursa je JSON, školjka ga samo crta

Telo kursa prelazi u `site/kurs.json`. Školjka i test čitaju taj fajl. `site/js/lectures.js` ostaje tanak adapter: učita JSON, izveze postojeći oblik nedelje i `preduslovCasa`, i ne sadrži naslove ni korake. `main.js` više ne broji do deset.

Polja dokumenta:

- `ustanova`, `ustanovaRed`, `ustanovaBok`, `naslov`, `oznaka`, `grb`
- `trajanjeNedelja` — postavljeno trajanje
- `nedelje[]`: `naslov`, `podnaslov`, `ishod`, `minuta`, postojeća polja diskusije (`problem`, `options`, `rezerva`, `izlaz`, `overview`), `steps[]`
- korak: `putanja`, `naslov`, `nivo`, `minuta`, `tekst`, `kljucnaIdeja`, `isecakNaslov`, `isecak`, `delic`, `pitalica`, `opcije`

Isporučeni dokument ima `trajanjeNedelja: 10`, naslov `Web Programming`, ustanovu sa mocka i postojećih deset nedelja. `podnaslov` kreće od današnjeg ishoda. `minuta` nedelje je 90. `minuta` koraka je zaokružen udeo tog budžeta, upisan u JSON, ne izračunat u školjci pri crtanju. `nivo` kreće od `Osnovno` i menja se u dokumentu. `oznaka` je `MP`, jer taj krug stoji na mocku; nije nalog.

`trajanjeNedelja` mora biti jednako `nedelje.length`. Inače školjka pokazuje grešku i ne dopunjava spisak. Natpis je `Nedelja {n} od {trajanjeNedelja}`. Procenat je `Math.round(n / trajanjeNedelja * 100)`, pa je nedelja 10 od 15 tačno 67. Klizač ima onoliko položaja koliko je trajanje, a broj ispisuje samo tekući položaj.

Alternativa: ostaviti `lectures.js` i samo ukloniti literal `10` iz `main.js`. Odbijena jer bi izmena kursa i dalje bila izmena modula koji školjka uvozi zajedno sa crtanjem, a trajanje ne bi bilo polje koje se postavlja.

Alternativa: trajanje izvoditi samo iz dužine niza, bez polja. Odbijena jer zahtev traži da se trajanje postavlja. Polje koje se ne slaže sa nizom je greška, ne tiho skraćivanje.

### Pojmovnik ostaje GLOSSARY.md

Parser u `site/js/pojmovnik.js` čita markdown. Termin je blok `**Ime**:`, zatim definicija do sledećeg termina ili do `_Avoid_:`. Polja zapisa su ime, definicija i, kad postoji, red „izbegava se”. Typeahead i tooltip pokazuju ta ista polja. Naslovi `##` nisu termini.

Browser ne može sam da otvori fajl iz korena, jer server šalje samo `site/`. `GET /pojmovnik` vraća sirov `GLOSSARY.md`. Test zove isti parser nad fajlom sa diska. Nema drugog spiska.

Pojam se u tekstu traži kao ceo izraz, bez razlike u veličini slova (`sr`), i ne kao deo duže reči. Pogodak ulazi u tekst koraka, ključnu ideju, pitalicu, opcije i isečak. Izbor pojma širi svaku nedelju koja ga ima i otvara prvi korak tim redom. Typeahead uz pojam nudi i pitanje i isečak čiji tekst počinje unetim nizom; izbor otvara taj korak. Placeholder je tačan tekst sa mocka. Command+K i Ctrl+K fokusiraju polje.

Accordion `terms` se više ne crta. Stari pojmovi časa koji nisu glave u pojmovniku ne dobijaju crtu dok se ne upišu tamo.

Alternativa: `site/pojmovnik.json` pored markdowna. Odbijena jer dva spiska razilaze se čim se jedan uredi.

### Školjka prati mock, zakucana tema ostaje

Postojeće zakucavanje teme ostaje: dugme u zaglavlju, `localStorage` ključ `tema`, i pravilo da bez zakucavanja tamna važi kad sistem ćuti ili traži tamnu, a svetla kad sistem traži svetlu. Nova školjka to ne gasi. Mock nema to dugme u kadru; zahtev `Nastavnik zakuca temu` ga i dalje traži, pa ostaje u zaglavlju.

Zlato ostaje akcenat. Red tekućeg koraka i dalje je `#ffb000` na tamnoj temi, a na svetloj ima kontrast bar 4.5:1 i nije `#ffb000`. Bunar grafikona ostaje taman. Tokeni nove školjke podešavaju se prema dvema slikama: krem pozadina, teget tekst i bela kartica na svetloj; tamna pozadina, svetli tekst i tamna kartica na tamnoj. Poziv ključne ideje i blok koda prate aktivnu temu.

Raspored: zaglavlje preko cele širine; ispod njega tri kolone — spisak, čas, kartica. Ispod 860px, gde se editor već slaže u jednu kolonu, iste tri celine idu jedna ispod druge. Centar i dalje drži tačno jedan od tabova Koraci, Diskusija, Editor. Kartica i spisak ostaju.

Grb je kružni znak na putanji iz dokumenta, `site/img/grb.svg`. Zvanični grb fakulteta nije u repou i ne preuzima se. Znak je lokalni krug sa slovima EF, u mestu i veličini sa mocka.

Sačuvan korak ide u `localStorage` pod ključem `web-programiranje:korak`. Nedelja ima oznaku završetka kad su svi njeni koraci sačuvani. Oznaka nije ocena i ne ide na server. Pomoć je kratak dijalog na istoj strani.

Kratka pitalica ostaje neoznačena dok se razlozi ne otvore. Klik na opciju samo je izbor, zlatni okvir kao na mocku, u dve kolone.

Model bez DOM-a, `site/js/model.js`, drži proveru trajanja, natpis, procenat, pogodak pojma i spisak lekcija. `main.js` samo crta. Tako proba od 15 nedelja i proba od 3 nedelje ne zavise od browsera.

Alternativa: ručno prepisati mock u HTML sa upisanim „10 od 15”. Odbijena jer bi trajanje opet bilo ugrađeno.

## Risks / Trade-offs

- [Glava pojma ne poklapa padež u rečenici] → Crta staje samo na tačan izraz. Inflektovani oblik dobija crtu tek kad se u tekstu ili u pojmovniku uskladi zapis.
- [Ključna ideja je vidljiva pre pitalice] → Razlozi opcija i dalje su zatvoreni. Promena prati mock, ne red „objašnjenje posle nagađanja”.
- [GET /pojmovnik dodaje jednu rutu] → Vraća postojeći markdown i ne dira `/api/soba` ni komandu.
- [localStorage je po browseru] → Namerno. Nema naloga. Brisanje skladišta zaboravlja sačuvani korak.
- [Grb nije zvanični znak] → Mesto i krug prate mock. Zamena fajla na `grb` ne dira školjku.

## Migration Plan

1. Prepisati današnji niz iz `lectures.js` u `site/kurs.json` i ostaviti adapter na istom izvozu, da `test/koraci.test.mjs` i dalje vidi deset nedelja.
2. Uvesti model, parser pojmovnika i rutu `GET /pojmovnik`.
3. Zameniti traku brojeva školjkom. Literal `10` u zaglavlju, navigaciji i granici heša se briše.
4. Ako školjka ne valja, vraća se prethodni commit. Nema upisa u bazu.

## Open Questions

Nema. Trajanje nije ugrađeno ni kao deset ni kao petnaest: deset je vrednost isporučenog dokumenta, petnaest je proba školjke.
