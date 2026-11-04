# Design

## Context

Vidi `proposal.md` (Why). Ovde samo stanje koda koje oblikuje pristup.

- `site/index.html` drži zaglavlje `.top` sa pretragom, `#klizac`, `#prethodna-tema`, `#sledeca-tema`, `#sacuvaj-zaglavlje`, `#pomoc`, `.tema-meni` (lista paleta sa slikama iz `site/icons/teme/`), `#font-kontrole` i `#oznaka`. Na 1440 px zaglavlje se lomi u dva reda. Tabovi `.cas-tabovi` su u `.cas-glava`, a `#mod-kontrole` (Predavanja | Samostalni rad) se seli između `#mod-mesto` (ispod birača) i mobilne trake.
- Inline skripta u `<head>` čita `tema`, `web-programiranje:mod` i `web-programiranje:font` pre prvog crtanja i postavlja `data-tema`, `data-mod` i `--skala-fonta`.
- `site/js/main.js` (3306 redova) piše po `localStorage` na pet mesta: `MESTO_KLJUC` (`{ tema, korak, sacuvani: ["n:i"] }`), `MOD_KLJUC`, `FONT_KLJUC`, `"tema"` i `STABLO_KLJUC`. `sacuvani` istovremeno puni oznaku završene teme (`temaZavrsena`) i služi kao obeleživač.
- U CSS-u `html[data-mod="predavanja"]` postavlja `font-size: calc(16px * var(--skala-predavanja))` i sakriva `#font-kontrole` u zaglavlju; zato veličina teksta na desktopu u predavanjima ne postoji.
- `site/js/radna.js` je dobar uzor: čist modul sa ubačenim skladištem (`procitajRadne(skladiste)`, `upisiRadnu(skladiste, ...)`), testiran bez browsera.
- Ikonice: svaka je zaseban fajl u `site/icons/svg_currentColor/` i simbol u ručno održavanom `site/icons/sprite.svg`; `ikonica(ime)` crta `<use href="#ime">`. `test/ikonice.test.mjs` traži `stroke="currentColor"` i nijedan PNG.
- Promene `izgled-editora`, `birac-kruzici`, `odgovori-i-uvod-weba` i `kontrolna-soba-kurs` su gotove, ali njihove delte nisu u `openspec/specs/sajt-casa/spec.md`. Ova delta zato ne dira `Birač koraka`, `Zaglavlje lekcije` ni `Ikonice trake koraka`.
- Maketa: `maketa.png` (1672 × 941) u ovoj promeni. Mere ispod su u pikselima makete; maketa se poredi na viewportu 1672 × 941, DPR 1, pa piksel makete = CSS piksel.

## Goals / Non-Goals

**Goals:**

- Jedan izvor istine za lokalno stanje, čist i testiran bez DOM-a.
- Zaglavlje u jednom redu i traka časa ispod njega na desktopu.
- Opcije i Sačuvane beleške piksel po piksel prema maketi, u px jedinicama, nezavisno od veličine teksta.
- Veličina teksta radi na desktopu u oba režima.
- Dokumentacija koja opisuje izgled, oblik zapisa stanja i rad sa njim.

**Non-Goals:**

- Oznake (čipovi) Tema 3 / JavaScript / Vrednosti / Reference sa makete, obeleživač na pasusu i obeleživač cele teme: maketa ih crta, ali korisnik traži belešku po koraku.
- Kartica koraka i niz krugova u telu lekcije ostaju kako su (promena `birac-kruzici`).
- Levi spisak tema i kartica napretka ne dobijaju izgled sa makete.
- Mobilni raspored (traka, footer, sheetovi) ostaje; samo sheet Podešavanja dobija iste odeljke kao Opcije.
- Radne verzije editora ne ulaze u zapis stanja, izvoz ni brisanje.
- Sinhronizacija između browsera ili sa serverom.

## Decisions

### 1. Modul `site/js/lokalno-stanje.js`, čist i sa ubačenim skladištem

Funkcije (srpski, kao ostatak koda):

- `podrazumevanoStanje()`
- `normalizujStanje(sirovo)` — svako polje posebno; pogrešan tip vraća podrazumevanu vrednost tog polja.
- `ucitajStanje(skladiste)` — **load**: čita `web-programiranje:stanje`; kad zapisa nema, poziva `prenesiStareKljuceve(skladiste)`.
- `sacuvajStanje(skladiste, stanje)` — **save**: upisuje ceo zapis, vraća `{ ok }` i ne baca.
- `obrisiStanje(skladiste)` — **clear**: briše zapis i vraća `podrazumevanoStanje()`; ne dira `radnaVerzija`.
- `izveziStanje(stanje)` → JSON tekst; `uveziStanje(tekst)` → `{ ok, stanje }` ili `{ ok: false, greska }`.
- Čiste izmene koje vraćaju novo stanje: `zabeleziKorak(stanje, tema, korak)`, `postaviBelesku(stanje, beleska)`, `ukloniBelesku(stanje, tema, korak)`, `postaviPodesavanje(stanje, ime, vrednost)`, `postaviPaletu(stanje, id)`.

Iznad toga `napraviStanje(skladiste)` vraća mali objekat `{ stanje(), promeni(fn), naPromenu(slusalac), poslednjiUpisOk() }`. `promeni` primeni čistu izmenu, sačuva ceo zapis i javi slušaocima (bedž, beleške, spisak tema). `main.js` više ne zove `localStorage` za ove ključeve.

Alternativa: klasa sa stanjem i DOM-om u istom fajlu. Odbačeno jer se ne testira bez browsera i meša crtanje sa podacima. Ime nije `stanje.js` da se ne meša sa `server/stanje.js`.

Oblik zapisa (verzija 1):

```json
{
  "verzija": 1,
  "mesto": { "tema": 3, "uvod": false },
  "napredak": { "3": { "vidjeni": [0, 1, 2], "poslednji": 2 } },
  "podesavanja": { "mod": "predavanja", "font": "1", "stabloSklopljeno": false },
  "paleta": "pesak",
  "beleske": [
    { "tema": 3, "korak": 2, "naslov": "Primitivna vrednost i referenca", "komentar": "Razlika u čuvanju u memoriji", "izmenjeno": "2026-11-04T08:00:00.000Z" }
  ]
}
```

- `paleta: null` znači „prati sistem”; `mod: null` znači „još nije izabrano” i pali prvi izbor režima.
- `font` je jedan od `"0.875"`, `"1"`, `"1.125"`.
- Ključ beleške je par `(tema, korak)`, isti kao dosadašnji `n:i`. Kurs nema stabilan id koraka; `naslov` se čuva da spisak ima šta da pokaže kad korak nestane.
- Nepoznata `verzija` pri uvozu je greška; nepoznata pri učitavanju vraća podrazumevano stanje (zapis se ne briše dok ga student ne prepiše).

### 2. Prenos starih ključeva jednom

`prenesiStareKljuceve` čita `tema` (`tamna`→`ugalj`, `svetla`→`pesak`), `web-programiranje:mod`, `web-programiranje:font` (`1.25`→`1.125`), `web-programiranje:korak` (`tema`, `korak`, `sacuvani` → `napredak[n].vidjeni`) i `stabloSklopljeno`, upiše novi zapis i obriše stare ključeve tek kad upis uspe. Postojeći `sacuvani` postaju viđeni koraci, ne beleške: dosad su značili „završeno”.

### 3. Inline skripta u `<head>` čita novi zapis

Skripta u `<head>` ostaje (bez nje se vidi pogrešna paleta pre modula). Čita `web-programiranje:stanje`, a ako ga nema, stare ključeve, i postavlja `data-tema`, `data-mod` i `--skala-fonta`. Prenos i brisanje radi tek modul. Skripta ne sme da baci; ceo blok ostaje u `try`.

### 4. Napredak se beleži sam; Sačuvaj korak je beleška

Otvaranje koraka zove `zabeleziKorak`. `temaZavrsena` i `check-circle` u spisku tema čitaju `napredak[n].vidjeni`. „Sačuvaj korak” (u lekciji) i padajuća lista u zaglavlju rade samo sa beleškama. Alternativa — zadržati ručno označavanje završenog koraka pored beleške — odbačena: dve radnje sa istom ikonicom `bookmark` znače dve različite stvari, a korisnik traži progres po temi kao deo stanja.

### 5. Veličina teksta u oba režima

```css
html { font-size: calc(16px * var(--skala-fonta)); }
html[data-mod="predavanja"] { font-size: calc(16px * var(--skala-predavanja) * var(--skala-fonta)); }
```

Pravilo koje sakriva `#font-kontrole` u predavanjima i `disabled` na dugmadima nestaju, kao i `#font-napomena`. Ostaju tri skale; `1.25` se prenosi u `1.125`.

### 6. Raspored: zaglavlje i traka časa

- `header.top`: jedan red, visina 86 px, donja ivica 1 px `var(--line)`. Levo grb 48 px, ustanova u dva reda, vertikalni razdelnik, `monitor-code` u zaobljenom kvadratu 36 px sa naglaskom i naslov kursa 26 px/700 u boji naglaska. Pretraga i pomoć ostaju (spec ih traži; maketa ih ne crta) kao kompaktno polje i ikonica levo od beleški. Desno: dugme beleški (85 × 55, ivica i tint naglaska, `bookmark` + `chevron-down`), dugme Opcije (176 × 55, `settings`, Opcije, `chevron`), inicijali u krugu 56 px.
- `nav.traka-casa` ispod zaglavlja, visina oko 50 px, donja ivica 1 px: izbor teme (`layers` + Tema n – naslov + `chevron-down`, padajuća lista), izbor koraka (`chevron-left`, srednje dugme Korak n od N – naslov sa listom koraka, `chevron-right`), pa tabovi. `.cas-tabovi` se premešta iz `.cas-glava` u traku; ARIA uloge tabova ostaju iste.
- Izbor teme i koraka u traci dele logiku sa postojećim `otvoriTemu` / biračem; nova je samo forma.
- `#mod-kontrole` napušta `#mod-mesto`; na desktopu režim je samo u Opcijama. Mobilna traka zadržava svoje kontrole teme i koraka; `#mod-kontrole` u mobilnoj traci se zamenjuje odeljkom u sheetu Podešavanja.
- Na jednoj koloni traka časa se ne crta; mobilna traka (`#mobil-nav-traka`) je njen ekvivalent.

### 7. Opcije: mere iz makete

Panel: `position: absolute`, desna ivica poravnata sa dugmetom Opcije, vrh na y 76, kutija 330 × 539, radijus 16, senka kao na maketi, pozadina `var(--paper)`. Unutrašnji okvir: levo 19, desno 18, širina sadržaja oko 293. Sve mere u `px`, ne `rem`, da A+ i predavanja ne pomeraju panel.

| Deo (y od vrha panela) | Kutija |
| --- | --- |
| Paleta: naslov i opis | y 19–54; ikonica 24 px na x 20; naslov 17 px/700 na x 54; opis 12 px |
| Pločice palete | y 66–105 (visina 40); četiri pločice ≈ 66–68 × 40, razmak 6, x 21–306; radijus 8; slika `object-fit: cover`; aktivna: ivica 2 px naglaska + bedž 20 px u gornjem desnom uglu |
| Razdelnik | 1 px, ≈ y 120 |
| Veličina fonta: naslov i opis | y 135–173 |
| Segment A− / A / A+ | y 184–223 (visina 40); x 19–311; tri ćelije ≈ 97; izabrana: ivica i tint naglaska |
| Razdelnik | y 235 |
| Način korišćenja: naslov i opis | y 248–286 |
| Kartice režima | y 299–372 (visina 74); x 18–162 i 171–312; ikonica 24 iznad natpisa; izabrana: ivica, tint i bedž |
| Razdelnik | ≈ y 386 |
| Lokalno stanje: naslov i bedž | y 400–423; bedž x 188–311, visina 24, pilula, `check` + Sačuvano lokalno |
| Opis | dva reda, y 433–466, 12 px |
| Load / Save / Obriši progres | y 479–520 (visina 42); x 19–95, 102–178, 185–313; Obriši: ivica, ikonica i tekst u boji opasnosti, svetla pozadina opasnosti |

Sačuvane beleške: kutija ≈ 342 × 248, levo x 981, vrh y 76, 12 px levo od Opcija. Zaglavlje liste y 14–36 (`bookmark`, Sačuvane beleške, broj desno), redovi ≈ 47 visine sa tintom na hoveru/fokusu, razdelnici 1 px, „Prikaži sve beleške →” sa `external-link` u boji naglaska na y 210–228.

Boje dolaze iz tokena palete (`--amber`, `--amber-dim`, `--paper`, `--line`, `--ink`, `--muted`); nove su samo `--uspeh`, `--upozorenje` i `--opasnost` po paleti, sa kontrastom 4.5:1 prema `--paper`.

Provera mera: test u headless Chrome-u (`test/chrome.mjs`) otvara sajt na 1672 × 941 sa `pesak`, otvara Opcije, čita `getBoundingClientRect()` svakog dela i poredi sa tabelom (±4 px). Snimak ekrana i snimak makete idu u artefakte radi vizuelnog poređenja.

### 8. Ikonice

Novi zasebni SVG fajlovi u `site/icons/svg_currentColor/` i simboli u `sprite.svg`, isti potez (`stroke="currentColor"`, `stroke-width` kao postojeći, `viewBox="0 0 24 24"`): `settings`, `a-large-small`, `layers`, `database`, `upload`, `download`, `trash`, `external-link`, `book-open-text`, `monitor-code`, `sticky-note`, `bookmark-filled`. `palette`, `monitor`, `check`, `bookmark`, `message-circle`, `chevron-*` već postoje. `bookmark-filled` je zaseban simbol (ispuna `currentColor`), jer ispuna kroz `<use>` ne može pouzdano da se menja CSS-om kad simbol nosi `fill="none"`. Bedž sa kvačicom je CSS krug sa `check`.

### 9. Crtanje u zasebnim modulima

`site/js/opcije.js` crta panel Opcije i prvi izbor režima, `site/js/beleske.js` padajuću listu, uređivač beleške i dijalog svih beleški. Oba primaju objekat stanja iz odluke 1 i povratne pozive (`otvoriKorak`, `postaviMod`, `zakucajTemu`). Pomoćne funkcije bez DOM-a (`brojBeleski(n)`, sortiranje, grupisanje po temi) su izvezene i testirane posebno. `main.js` se time smanjuje, a ne raste.

### 10. Prvi izbor režima je `<dialog>`

Isti obrazac kao `#pomoc-dijalog`. Otvara se kad je `podesavanja.mod === null`, posle učitavanja kursa. `cancel` (Escape) upisuje `predavanja`. Iza dijaloga važi Predavanja, kao i danas.

### 11. Dokumentacija

- `docs/izgled-i-lokalno-stanje.md`: raspored (zaglavlje, traka časa), Opcije i Sačuvane beleške sa snimkom, oblik zapisa stanja sa primerom, load / save / clear, izvoz i uvoz, prenos starih ključeva, šta ne ulazi u stanje.
- `docs/adr/0016-stanje-je-jedan-lokalni-zapis.md`: zašto jedan verzionisan zapis, zašto napredak nije ocena i zašto beleška nije „završeno”.
- `GLOSSARY.md`: Lokalno stanje, Beleška, Napredak teme, Opcije, Traka časa, Način korišćenja.
- `README.md`: kratak odeljak o lokalnom stanju i link na dokument.
- Tekst dijaloga Pomoć prati nov raspored (Opcije umesto Podešavanja).
- `maketa.png` se kopira u `mocks/opcije-i-beleske.png` da dokument ima stabilnu putanju posle arhive.

## Risks / Trade-offs

- [Postojeći testovi čitaju izvor (`test/rezim.test.mjs` traži `#font-kontrole` posle `.tema-meni`, `MOD_KLJUC` i sakrivanje fonta u predavanjima)] → Svaka grupa zadataka menja te provere zajedno sa kodom koji ih ruši.
- [Gubitak stanja pri prenosu] → Stari ključevi se brišu tek posle uspešnog upisa; prenos ima testove za svaki ključ.
- [Pixel-perfect na drugom viewportu] → Mera važi na 1672 × 941; panel je u px pa izgleda isto i na 1440, ali poravnanje uz desnu ivicu zaglavlja se pomera sa širinom. Na jednoj koloni mera ne važi.
- [Maketa je raster; tekst u fontu sajta nije isti piksel po piksel] → Tolerancija ±4 px na kutije, ne na glifove.
- [Automatski napredak menja značenje oznake završene teme] → Zapisano kao BREAKING u predlogu i u ADR-u; stari `sacuvani` postaju viđeni, pa niko ne gubi oznake.
- [`localStorage` pun ili zabranjen] → `sacuvajStanje` ne baca; bedž pokazuje Nije sačuvano; sajt radi iz memorije.
- [Uvoz tuđeg fajla] → Samo `JSON.parse` i `normalizujStanje`; ništa iz fajla se ne izvršava niti ubacuje kao HTML (komentari idu kroz `textContent`).
- [Nesinhronizovane delte drugih promena] → Prvi zadatak arhivira četiri gotove promene pre izmene `sajt-casa`.

## Migration Plan

1. Arhivirati gotove promene da `sajt-casa` bude svež.
2. Uvesti modul stanja i prenos; stari ključevi se čitaju i brišu pri prvom otvaranju posle izmene.
3. Povratak: prethodna verzija sajta i dalje čita stare ključeve; posle prenosa ih nema, pa bi stara verzija otvorila podrazumevano stanje. Novi zapis ostaje netaknut i važi čim se nova verzija vrati. Pre isporuke, Save u Opcijama daje fajl koji se može ručno učitati.

## Open Questions

- Da li natpis Load / Save ostaje engleski kao na maketi ili ide Učitaj / Sačuvaj? Plan prati maketu (Load / Save); promena je samo tekst.
- Da li ime palete treba i kao vidljiv natpis ispod pločice? Plan: ime je u `aria-label` i `title` (maketa nema natpis); dodavanje natpisa ne menja specifikaciju osim mere visine.
