# Proposal

## Why

Zaglavlje sajta časa danas drži sve u jednom redu koji se lomi u dva: pretragu, klizač tema, strelice teme, čuvanje, pomoć, paletu i inicijale. Izbor teme, koraka i taba je rasut između zaglavlja, glave časa i birača, a Predavanja | Samostalni rad stoji ispod birača kao da se menja na svakom koraku. Veličina teksta na desktopu u režimu predavanja ne postoji: dugmad su onemogućena i sakrivena. Stanje je razbacano po pet ključeva u `localStorage` (`tema`, `web-programiranje:mod`, `web-programiranje:font`, `web-programiranje:korak`, `stabloSklopljeno`), nema izvoza, nema brisanja, a „Sačuvaj korak” je istovremeno i oznaka završenog koraka i obeleživač. Student nema gde da zapiše šta mu u koraku nije jasno.

Maketa (`maketa.png` u ovoj promeni) traži zaglavlje i red ispod njega, panel Opcije i padajuću listu Sačuvane beleške.

## What Changes

- **BREAKING:** raspored desktopa ima dva reda. Zaglavlje: grb, ustanova, naslov kursa sa ikonicom koda, pretraga, pomoć, Sačuvane beleške, Opcije i inicijali. Red ispod zaglavlja (traka časa): izbor teme, izbor koraka (prethodni, „Korak n od N – naslov”, sledeći) i tabovi Gradivo, Diskusija, Editor. Klizač tema i strelice prethodne/sledeće teme nestaju iz zaglavlja. Tabovi više ne stoje u glavi časa.
- **BREAKING:** paleta, veličina teksta i režim rada prelaze u padajući panel Opcije, nacrtan piksel po piksel prema maketi. Paleta su četiri pločice sa postojećim slikama i imenima (Plava, Ugalj, Pesak, Terakota, iz `site/icons/teme/`), ne boje sa makete. Veličina fonta je A− | A | A+ i radi na desktopu u oba režima. Način korišćenja je Predavanja | Samostalni rad, svaka kartica sa svojom ikonicom.
- Režim rada se bira jednom: pri prvom otvaranju sajta, kad u stanju nema režima, sajt pita Predavanja ili Samostalni rad. Kasnije se menja samo iz Opcija.
- Panel Opcije ima odeljak Lokalno stanje: oznaka „Sačuvano lokalno”, Load (učitaj stanje iz JSON fajla), Save (preuzmi stanje kao JSON fajl) i Obriši progres (uz potvrdu).
- Novi modul lokalnog stanja u zasebnom fajlu, sa funkcijama load, save i clear. Jedan verzionisan zapis u `localStorage` drži: napredak po temi (viđeni koraci i poslednji korak), podešavanja (veličina fonta, režim, sklopljeno stablo), paletu i beleške. Stari ključevi se jednom prenose u novi zapis i brišu.
- **BREAKING:** „Sačuvaj korak” i dugme u zaglavlju više ne označavaju završen korak. Svaki korak može da dobije belešku (obeleživač) sa komentarom, npr. šta studentu nije jasno. Napredak teme raste sam, kad se korak otvori. Oznaka završene teme znači da je svaki korak viđen.
- Padajuća lista Sačuvane beleške u zaglavlju: broj beleški, najnovije beleške sa naslovom koraka i komentarom, i „Prikaži sve beleške” koji otvara spisak svih beleški sa izmenom i brisanjem.
- Nove ikonice su zasebni SVG fajlovi u `site/icons/svg_currentColor/` i simboli u `site/icons/sprite.svg`, sa `currentColor`.
- Dokumentacija: novi `docs/izgled-i-lokalno-stanje.md`, ADR o jednom zapisu stanja, nova polja u `GLOSSARY.md` i odeljak u `README.md`.

## Capabilities

### New Capabilities

- `lokalno-stanje`: jedan zapis stanja sajta u ovom browseru, njegov oblik, učitavanje, čuvanje, brisanje, prenos starih ključeva, izvoz i uvoz fajla.
- `beleske-koraka`: obeleživač koraka sa komentarom, padajuća lista Sačuvane beleške i spisak svih beleški.
- `opcije-sajta`: panel Opcije (paleta, veličina fonta, način korišćenja, lokalno stanje) i izbor režima pri prvom otvaranju.

### Modified Capabilities

- `sajt-casa`: zaglavlje i traka časa umesto klizača tema i tabova u glavi časa; paleta se bira u Opcijama; sačuvan korak postaje beleška, a povratak na mesto i oznaka završene teme dolaze iz napretka.

## Impact

- `site/index.html`: novo zaglavlje i traka časa, panel Opcije, padajuća lista beleški, dijalog svih beleški, dijalog prvog izbora režima. Inline skripta u `<head>` čita novi zapis stanja da paleta, režim i font važe pre prvog crtanja.
- Novi `site/js/lokalno-stanje.js` (čist modul bez DOM-a) i novi `site/js/opcije.js`, `site/js/beleske.js` za crtanje panela. `site/js/main.js` prestaje da piše po `localStorage` i ide kroz modul stanja. `site/js/radna.js` (radne verzije editora) ostaje pod svojim ključem.
- `site/css/site.css`: zaglavlje, traka časa, Opcije i beleške; mobilni sheet Podešavanja koristi iste odeljke.
- `site/icons/`: nove ikonice `settings`, `a-large-small`, `layers`, `database`, `upload`, `download`, `trash`, `external-link`, `book-open-text`, `monitor-code`, `sticky-note`, `bookmark-filled`.
- Testovi: novi `test/lokalno-stanje.test.mjs`, `test/beleske.test.mjs`, `test/opcije.test.mjs`; izmene u `test/rezim.test.mjs`, `test/tema.test.mjs`, `test/ikonice.test.mjs`, `test/mobil.test.mjs`, `test/birac.test.mjs` gde traže stare ključeve, klizač ili raspored zaglavlja.
- Nema nove zavisnosti ni koraka izgradnje. Ništa iz stanja ne ide na server. Jezik sajta ostaje srpski. Studio (`site/studio.html`) se ne menja.
- Promene `izgled-editora`, `birac-kruzici`, `odgovori-i-uvod-weba` i `kontrolna-soba-kurs` su završene, ali nisu arhivirane; treba ih arhivirati pre primene ove, da delta za `sajt-casa` važi nad svežom glavnom specifikacijom.
