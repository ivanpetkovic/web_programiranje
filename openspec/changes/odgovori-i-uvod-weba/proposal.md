# Proposal

## Why

Na širokom času odgovori kratke pitalice stoje jedan pored drugog, iako `pitalice` već traži jedan red po odgovoru. Ispod pitanja stoji sklopljen „Osvrt” koji samo nabraja teme bez gradiva, pa rečenica izlaza i prazno polje. To polje niko ne čuva i niko ga ne čita. Nedelja 1 sklapa stranicu, a ne kaže šta je Web, po čemu se Web razlikuje od Interneta, niti kako je do stranice došlo.

## What Changes

- Odgovori kratke pitalice stoje jedan ispod drugog na svakoj širini. Širok raspored više nema dva stupca. Odgovori diskusije ostaju jedan ispod drugog, kao sada.
- **BREAKING:** Blok „Osvrt” nestaje sa stranice. Reč se ne objašnjava i ne ostaje natpis. Imena koja čas ne predaje (Kubernetes, XSS, React hooks, redosled microtaskova i ostala iz današnjeg spiska) ne dobijaju teoriju i ne pominju se na času.
- Nedelja 1, pre Podele, dobija tri koraka gradiva: šta je Web, Internet naspram Weba, i kratka istorija. Put od URL-a do prikaza je crtež, ne ime u spisku. Semantički HTML, osnovna pristupačnost i skica ostaju postojeći koraci, ne spisak.
- Crtež, vremenska linija i kratka animacija puta dolaze iz dokumenta kursa. Animacija se odigra jednom. Smanjeno pokretanje ostavlja gotov kadar.
- **BREAKING:** Polje izlaznog pitanja nestaje na svim nedeljama. Rečenica ostaje, bez opcija i bez pečata, i vidi se samo na poslednjem koraku nedelje. Polja pretpostavki i zaključka u diskusiji ostaju: njih nastavnik piše na projektoru.
- Deset nedelja i budžet od 90 minuta ostaju. Tri nova koraka uzimaju minute postojećim koracima nedelje 1. Nedelja 1 ima 20 koraka.
- Rečenica časa 10 o tipu i predlogu asistenta ostaje u koraku, bez drugog glasanja i bez bloka „Osvrt”. Čas i dalje ne gradi login, napad, administraciju baze, kviz redosleda microtaskova, niti pun deploy.

## Capabilities

### New Capabilities

### Modified Capabilities

- `sajt-casa`: kratka pitalica je jedna kolona i na širokom času; nema bloka osvrta; korak sa crtežom nema isečak ni putanju; izlaz je rečenica na poslednjem koraku; beleška više nije „red osvrta”.
- `casovi`: nedelja 1 počinje koracima Web, Internet i Istorija, pa tek Podela i postojeći red; spiskovi osvrta nestaju; granice koje su stajale samo u osvrtu ostaju van časa; rečenica o tipu ostaje u času 10.
- `pitalice`: izlaz nema polje za upis; osvrt više ne imenuje teme; rezerva časa 10 ostaje rečenica u času, ne u osvrtu.

## Impact

- `site/css/site.css`: nestaje pravilo koje na širini preko 860px stavlja `.opcije-mreza` u dva stupca. `test/tema.test.mjs` danas zaključava to pravilo.
- `site/js/main.js`: crta crtež iz dokumenta, ne crta „Osvrt”, ne crta polje izlaza, izlaznu rečenicu stavlja na poslednji korak. Polja diskusije ostaju.
- `site/kurs.json`: tri nova koraka nedelje 1, novi minuti čiji zbir ostaje 90, `overview` se više ne prikazuje, korak časa 10 koji se zove Osvrt menja naslov i rečenicu, korak Izlaz više ne kaže da postoji slobodan upis.
- `test/koraci.test.mjs` više ne traži imena preglednih tema u `overview`.
- `kontrolna-soba` se ne menja. Nema nove zavisnosti ni koraka izgradnje. Jezik sajta ostaje srpski.
