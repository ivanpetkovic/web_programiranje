# Izgled sajta časa i lokalno stanje

Ovaj dokument opisuje raspored sajta časa, panel Opcije, beleške koraka i lokalno stanje koje sajt čuva u browseru. Specifikacije su `openspec/specs/sajt-casa`, `opcije-sajta`, `beleske-koraka` i `lokalno-stanje`. Odluka o jednom zapisu je u `docs/adr/0016-stanje-je-jedan-lokalni-zapis.md`.

## Lokalno stanje

Sve što sajt pamti o studentu stoji u jednom zapisu u `localStorage`, pod ključem `web-programiranje:stanje`. Kod je u `site/js/lokalno-stanje.js`. Modul ne dira DOM: skladište mu se predaje kao argument, pa se testira u Node-u (`test/lokalno-stanje.test.mjs`).

### Oblik zapisa

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

| Polje | Značenje |
| --- | --- |
| `verzija` | Oblik zapisa. Sada `1`. Zapis druge verzije se ne učitava. |
| `mesto` | Poslednja otvorena tema, ili `uvod: true` kad je poslednji bio uvod. `tema: null` otvara uvod. |
| `napredak` | Po temi: indeksi viđenih koraka i poslednji otvoren korak. Korak je viđen čim se otvori. Napredak nije ocena. |
| `podesavanja.mod` | `predavanja`, `samostalni` ili `null`. `null` znači da način korišćenja još nije izabran. |
| `podesavanja.font` | Veličina teksta: `"0.875"` (A−), `"1"` (A) ili `"1.125"` (A+). |
| `podesavanja.stabloSklopljeno` | Da li je stablo fajlova u editoru sklopljeno. |
| `paleta` | `mornar`, `ugalj`, `pesak`, `terakota` ili `null` (prati sistem). |
| `beleske` | Jedna beleška po paru tema i korak: naslov koraka u trenutku čuvanja, komentar do 500 znakova i vreme izmene. |

Radne verzije fajlova iz editora nisu u ovom zapisu. One ostaju pod ključem `radnaVerzija` (`site/js/radna.js`), ne izvoze se i Obriši progres ih ne briše.

### Load, save i clear

| Funkcija | Šta radi |
| --- | --- |
| `ucitajStanje(skladiste)` | Load. Čita zapis i vraća celo stanje. Nema zapisa: prenosi stare ključeve. Neispravan JSON ili druga verzija: podrazumevano stanje. Polje pogrešnog tipa pada na svoju podrazumevanu vrednost, a ispravna polja ostaju. Nikad ne baca. |
| `sacuvajStanje(skladiste, stanje)` | Save. Upisuje ceo zapis odjednom i vraća `{ ok }`. Kad `localStorage` odbije upis, vraća `{ ok: false }`, a sajt nastavlja iz memorije i bedž u Opcijama kaže Nije sačuvano. |
| `obrisiStanje(skladiste)` | Clear. Briše zapis i vraća podrazumevano stanje. |
| `napraviStanje(skladiste)` | Objekat koji drži trenutno stanje: `stanje()`, `promeni(izmena)`, `zameni(novo)`, `obrisi()`, `naPromenu(slusalac)` i `poslednjiUpisOk()`. Svaka promena upiše ceo zapis i javi slušaocima. |

Izmene su čiste funkcije koje vraćaju novo stanje: `zabeleziKorak`, `zabeleziUvod`, `postaviBelesku`, `ukloniBelesku`, `postaviPodesavanje` i `postaviPaletu`.

### Izvoz i uvoz

`izveziStanje(stanje)` vraća isti zapis kao JSON tekst. Save u Opcijama preuzima ga kao `veb-programiranje-stanje.json`. `uveziStanje(tekst)` proverava fajl kao zapis iz skladišta. Ako fajl nije JSON ili nema `verzija: 1`, stanje se ne menja i Opcije kažu da fajl nije sačuvano stanje. Ništa iz fajla se ne izvršava. Komentari idu na stranu kao tekst, ne kao HTML.

Ništa iz stanja ne ide na server.

### Stanje pre prvog crtanja

Inline skripta u `<head>` čita isti zapis pre učitavanja modula i odmah postavlja `data-tema`, `data-mod` i `--skala-fonta`. Zato se pri učitavanju ne vidi pogrešna paleta. Kad zapisa nema, skripta čita stare ključeve. Prenos i brisanje radi samo modul.

### Prenos starih ključeva

Pre ovog zapisa sajt je pisao pet ključeva. Kad zapisa nema, `ucitajStanje` ih pročita jednom, upiše novi zapis i obriše ih tek kad upis uspe.

| Stari ključ | Novo polje |
| --- | --- |
| `tema` | `paleta`; `tamna` postaje `ugalj`, `svetla` postaje `pesak` |
| `web-programiranje:mod` | `podesavanja.mod` |
| `web-programiranje:font` | `podesavanja.font`; `1.25` postaje `1.125` |
| `web-programiranje:korak` | `mesto.tema`, poslednji korak te teme, a svaki ranije sačuvan korak postaje viđen |
| `stabloSklopljeno` | `podesavanja.stabloSklopljeno` |

Kad zapis već postoji, stari ključevi se ne čitaju.
