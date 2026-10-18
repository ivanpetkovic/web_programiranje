# Design

## Context

Sajt časa je statična stranica. Boje žive u `site/css/site.css` na `:root`: tamna podloga, svetlo mastilo, `--amber: #ffb000`, `--muted: #b7ab96`, `color-scheme: dark`. Red koraka u `renderLecture` dobija klasu `log`, a `.log` deli `--muted` sa fazom diskusije, osvrtom i statusom panela. Fiksne pozadine `#111` i `#1a1204` ne idu kroz token. Vidi `proposal.md` za razlog. Zahtevi su u delti `sajt-casa`.

## Goals / Non-Goals

**Goals:**

- Tamna tema ostaje sadašnja paleta, a red koraka u njoj postaje `#ffb000`.
- Svetla tema ima svetlu podlogu i taman tekst. Red koraka, beleške i cifre prolaze kontrast iz delte.
- Tema se vidi pre prvog crtanja. Zakucan izbor preživi ponovno učitavanje i ne menja otvoreni čas.

**Non-Goals:**

- Izmena `client/css/soba.css`, `client/js/niz.js` i njihovih kopija u `prepared/`. Linija grafikona ostaje `#ffb000` u izvoru časa.
- Treće stanje „prati sistem” posle prvog klika. Posle zakucavanja važi samo tamna ili svetla.
- Nova zavisnost, alat za izgradnju ili izmena specifikacije `kontrolna-soba`.

## Decisions

### Red koraka izlazi iz `.log`

Pasus koraka dobija klasu `korak` i `color: var(--amber)`. `.log` ostaje na `--muted`. Faza, osvrt i status se ne prebojavaju u žuto.

Alternativa: obojiti ceo `.log` u žuto. Odbijena jer bi faza i status prestali da budu beleške.

### Ista ćilibar osovina, druga nijansa po temi

Tamna tema zadržava `--amber: #ffb000`. Na tamnom papiru `#1c1a16` to je oko 9.5:1. Svetla tema stavlja `--amber: #8a5600`. Na svetloj kartici `#fffdf8` to je oko 6.0:1, a `#ffb000` na istoj kartici je oko 1.8:1 i ne zadovoljava zahtev. Cifre, marka, trenutni čas u navigaciji i fokus koriste isti token, pa svetla tema ne ostavlja žute cifre na belom.

Tekst na ćilibar pozadini (preskok) dobija `--on-amber`: `#1a1204` u tamnoj, `#fffdf8` u svetloj. Fiksno `#1a1204` na tamnom ćilibaru ne bi se čitalo.

Svetle beleške koriste `--muted: #5e564c` (oko 7.1:1 na `#fffdf8`). `--good` postaje `#3f6212`, `--bad` postaje `#9f2d22`. Tamne vrednosti tih tokena se ne menjaju.

Alternativa: ostaviti `#ffb000` i za svetli korak, samo ga podebljati. Odbijena jer kontrast ostaje ispod 4.5:1.

### Atribut `data-tema` i medij upita

`:root` nosi tamne tokene i `color-scheme: dark`. To je tema kad nema zakucavanja i kad sistem ne traži svetlo, uključujući izostanak podešavanja.

`@media (prefers-color-scheme: light)` primenjuje svetle tokene samo na `:root:not([data-tema])`.

`html[data-tema="svetla"]` nosi svetle tokene i `color-scheme: light`. `html[data-tema="tamna"]` ostavlja tamne tokene i time gazi svetli medij upit.

Alternativa: samo medij upit, bez zakucavanja. Odbijena jer projektor često ne prati temu sobe, a delta traži kontrolu.

### Zakucavanje pre prvog crtanja

U `head`, pre stilova, kratka skripta čita `localStorage` ključ `tema`. Ako je vrednost `tamna` ili `svetla`, postavlja `documentElement.dataset.tema`. Inače ne dira atribut, pa odluku donosi medij upit. Ako skladište baci, stranica ostaje na sistemu.

Dugme u zaglavlju, `type="button"`, van forme pretrage. Natpis je „Svetla tema” ili „Tamna tema”, onako kako će glasiti posle klika. Klik upiše drugu vrednost u `dataset.tema` i u `tema`, bez promene hash-a i bez ponovnog crtanja časa. Modul na dnu stranice samo veže klik. Prvo crtanje ne čeka modul.

Alternativa: klasa na `body` iz modula, posle učitavanja. Odbijena jer bi se tamna strana na trenutak videla kad je zakucano svetlo.

### Bunar grafikona ostaje `#111111`

`pre` i ostale površine koda prelaze na token koji prati temu. `#grafikon` dobija poseban token koji je `#111111` u obe teme. Žuta linija iz `client/js/niz.js` na tom bunaru ostaje oko 10:1. Čas 3 i dalje prekucava `BOJA_LINIJE = "#ffb000"`.

Alternativa: osvetliti bunar u svetloj temi. Odbijena jer bi linija iz fajla časa nestala na svetloj podlozi.

### Šta prati temu

Podloga stranice, kartice, mastilo, ivice, polja, dugmad, kod, lopatice i cifre idu kroz tokene. `color-scheme` prati aktivnu temu da skrol i polja ne ostanu tamni u svetloj. Fokus ostaje `outline: 2px solid var(--amber)`.

## Risks / Trade-offs

- [Posle prvog klika nema povratka na „prati sistem”] → Sledeći klik bira drugu zakucanu temu. Brisanje ključa `tema` vraća sistem, ali stranica nema treće dugme.
- [Skladište nije dostupno] → Skripta guta grešku i ostavlja medij upit. Zakucavanje tada traje samo do ponovnog učitavanja.
- [Nastavnik u editoru promeni `#grafikon`] → Bunar je u `site/css/site.css`, ne u fajlu koji čas prekucava. Izmena `client/css/soba.css` i dalje menja samo trajanje lopatica.
- [Svetli ćilibar deluje manje „digitalno” od `#ffb000`] → Tamna tema zadržava žuto. Svetla žrtvuje nijansu da bi red koraka i cifre prošli kontrast.

## Migration Plan

Ista stranica, isti repozitorijum. Nema premeštanja podataka. Vraćanje je prethodni commit. Stari ključ `tema` u skladištu, ako ostane posle vraćanja, stranica bez skripte ignoriše.
