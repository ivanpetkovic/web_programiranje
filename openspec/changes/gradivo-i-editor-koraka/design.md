# Design

## Context

Sajt je statična stranica bez koraka izgradnje. Editor je `textarea` koja učitava fajl sa diska i dugmadima Sačuvaj i Povrati upisuje taj fajl. Tabovi su Koraci, Diskusija i Editor, a unutar editora Front i Back. Korak u `site/kurs.json` drži `delic` i `isecak`, ne ceo fajl. Vidi `proposal.md` za razlog. Zahtevi su u delti `sajt-casa`, `casovi` i `pitalice`.

## Goals / Non-Goals

**Goals:**

- Original koraka i radna verzija dele jednu površinu editora, sa brojevima linija i bojenjem sintakse.
- Razlika originala je po linijama, prema originalu poslednjeg ranijeg koraka istog fajla u kursu.
- Radna verzija je jedna mapa putanja → tekst u `localStorage`.
- Nedelja 1 dobija original koji je ceo fajl posle svakog koraka. Nedelje 2–10 čitaju postojeći `delic` kao original.

**Non-Goals:**

- Prepisivanje originala nedelja 2–10 u cele fajlove.
- Izvršavanje `server/` u browseru ili upis editora u proces Node-a.
- Alat za izgradnju sajta. Biblioteka editora ulazi kao već složeni fajlovi.
- Drugo dugme koje briše radnu verziju. Prekidač samo menja prikaz.

## Decisions

### Original je polje koraka

U `site/kurs.json` korak sme da ima `original`. `site/js/lectures.js` prosleđuje to polje. Ako polja nema, original je `delic`. Nedelja 1 dobija `original` na svakom koraku: Podela je `client/\nserver/`, a od Stranice nadalje ceo fajl posle tog koraka. `isecak` ostaje kratak prikaz u Gradivu.

Alternativa: sklapati ceo fajl spajanjem `delic` vrednosti. Odbijena jer spajanje ponavlja linije i ne zna šta je obrisano.

### Jedan CodeMirror, bez bundlera u sajtu

Prikaz radi CodeMirror 6, vendored u `site/vendor/codemirror/`, učitan import mapom iz `site/index.html`. Nema nove npm skripte i nema koraka izgradnje pri pokretanju sajta. Jezik bira ekstenzija: HTML, CSS ili JavaScript. Radna verzija je izmenljiv dokument. Original je samo za čitanje.

Alternativa: Monaco. Odbijena jer traži svoj loader i veliki paket. Alternativa: ostaviti `textarea` i obojiti je posle. Odbijena jer nema brojeve linija ni izmenu kao editor.

### Razlika je spisak linija koji sajt sam računa

Druga biblioteka se ne dodaje. Sajt računa najduži zajednički podniz linija između originala ovog koraka i originala prethodnog koraka istog fajla. Prikaz originala je spojeni dokument: zajedničke linije obične, dodate zelene, obrisane crvene. Obrisana linija ostaje vidljiva iako je nema u novom fajlu. Prvi original fajla nema crvenih linija, a sve njegove linije su zelene. Radna verzija ne ulazi u poređenje i nema te boje.

Boje linija prolaze kontrast 4.5:1 u obe teme. Žuti hod koraka je pozadina `#ffb000` i mastilo `#1a1204` u obe teme, da svetla tema ne zameni žutu podlogu tamnim ćilibarom tokena `--amber`. Red „Korak N od M” i dalje koristi `--amber`.

Alternativa: razlika po znakovima. Odbijena jer dogovor boji cele linije.

### Radna verzija je mapa u localStorage

Ključ je `radnaVerzija`. Vrednost je objekat čiji su ključevi putanje fajlova. Upis ide na svaku izmenu radne verzije. Promena koraka otvara `putanja` tog koraka. Ako mapa ima taj fajl, na ekranu je radna verzija. Ako nema, oba prikaza pokazuju original. Prekidač pored putanje ne briše mapu: olovka znači da je radna verzija na ekranu i klik kaže „Prikaži original”; list papira znači original i klik kaže „Prikaži radnu verziju”. Stanje prekidača se ne pamti. Sledeći korak opet otvara radnu verziju ako postoji.

Ako `localStorage` baci, tekst ostaje u memoriji do kraja otvorene stranice, a editor kaže da upis u browser nije uspeo.

Alternativa: po jedna radna verzija za svaki korak. Odbijena jer nastavnik nosi isti kod iz koraka u korak.

### Pregled crta bafer, disk se ne dira

Editor više ne zove čuvanje fajla. Dugmad Sačuvaj i Povrati izlaze iz editora. Kucanje ne menja fajlove na disku, pa čas van sajta i dalje pokreće isporučene fajlove.

Za `client/index.html` pregled ubacuje prikazani HTML u sobu prekidača. Za `client/css/soba.css` ubacuje prikazani stil. Poznati klijentski skriptovi i dalje hrane postojeće primene, ali iz prikazanog teksta, ne sa diska. Ako taj tekst baci, ostaje poslednji ispravan crtež i rečenica da delić nije primenjen. `server/` se ne pokreće u browseru i ne menja izvor procesa.

Alternativa: iframe celog klijenta umesto ugrađene sobe. Odbijena jer kasnije nedelje već crtaju sobu, kutiju i mrežu u postojećem panelu.

### Hod i odgovori

Prethodni i sledeći korak stoje u traci koraka, sa strelicama u samom dugmetu. Donji par istih dugmadi se uklanja. `.opcije-mreza` postaje jedna kolona na svakoj širini. Tab Server (`#tab-back`) je sakriven dok je otvorena nedelja manja od 4.

## Risks / Trade-offs

- [CodeMirror bez bundlera vuče više modula kroz import mapu] → Vendor je fiksni skup fajlova u `site/vendor/codemirror/`. Sajt ih ne sklapa pri startu.
- [localStorage je pun ili nedostupan] → Izmena ostaje u memoriji, a status u editoru kaže da browser nije sačuvao radnu verziju.
- [Original nedelje 2 je i dalje delić, pa razlika ume da obriše veliki deo prethodnog originala] → Tako stoji dok profesor ne napiše ceo fajl za taj korak. Nedelja 1 to već ima.
- [HTML iz editora može da zameni broj na ugrađenoj sobi] → Primena ide samo u region sobe prekidača, ne u školjku sajta.

## Migration Plan

Ista stranica. Stari ključ se ne čita, jer radne verzije do sada nije bilo. Vraćanje je prethodni commit. Fajlovi na disku se ovom izmenom ne prepisuju iz editora.

## Open Questions

Nema. Ime koraka je Podela, biblioteka je CodeMirror 6, a nedelje 2–10 zadržavaju `delic` kao original.
