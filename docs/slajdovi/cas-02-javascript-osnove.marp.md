---
marp: true
theme: default
paginate: true
header: 'Web programiranje · Kontrolna soba'
footer: 'Čas 02 — Osnove'
---

# Čas 02 — Osnove

JavaScript opisuje stanje i pravila

<!--
Ulaz: studenti znaju da HTML/CSS prikazuju sadržaj; razlikuju podatak od prikaza.
Cilj ovog bloka: terminologija bez primera na ekranu; teže ideje kucaš u konzoli po beleškama.
Ne prelaziti na pitalicu dok grupa ne može da parafrazira razliku dodele i poziva funkcije.
-->

---

## Vrednost i tip

- **Vrednost** je ono što program koristi u izrazu (broj, tekst, logička istina, …).
- **Tip** opisuje vrstu vrednosti; JavaScript tip određuje u trenutku izvršavanja.
- Isti naziv promenljive može u različitim trenutima držati različit tip — to je dinamički jezik.

<!--
Bez koda na tabli osim ako neko pita za primer. Dovoljno je reći „42“, „24 °C“, true.
Povezati sa Kontrolnom sobom: temperatura i stanje ventilatora su vrednosti u programu, ne broj na ekranu.
-->

---

## Ime promenljive (`let` / `const`)

- **Ime** je oznaka za vrednost u daljem kodu.
- **`let`**: ime može kasnije dobiti **novu** vrednost (ponovna dodela imena).
- **`const`**: ime **ne sme** ponovo da se dodeli drugoj vrednosti.
- Ni `let` ni `const` ne znače „vrednost se nikad ne menja“ — zavisi od toga da li je vrednost promenljiva (npr. objekat).

<!--
Teže — kucaj u konzoli:

const room = { temperature: 24 };
room.temperature = 10;   // dozvoljeno: menja se polje
// room = {};            // greška: ponovna dodela imena

let step = 0;
step = 1;                // dozvoljeno
-->

---

## Operatori i `===`

- **Operator** kombinuje vrednosti (npr. sabiranje, poređenje).
- **Poređenje** daje logičku vrednost (tačno / netačno).
- **`===`**: ista vrednost **i** isti tip (strogo poređenje).
- **`==`**: dozvoljava pretvaranje tipova — u kursu preferiramo `===` da izbegnemo skrivena iznenađenja.

<!--
Teže — kucaj:

3 === '3'    // false
3 == '3'     // true — pomenuti zašto je opasno u uslovima

Povezati sa pitalicom: const ne „zamrzava“ objekat.
-->

---

## Uslov (`if`)

- **Uslov** bira koji deo programa se izvršava.
- Izraz u zagradi mora dati logičku vrednost.
- **Grane** (`if` / `else`): tačno jedna se izvršava za dati ulaz.
- Sintaksa u JS liči na C/Java; semantika je ista kao na kursevima algoritama.

<!--
Bez primera na slajdu. Ako treba jedna linija uživo:

if (room.temperature > 30) { /* uključi ventilator u modelu */ }

Naglasiti: uslov ne menja sam prikaz u browseru — to dolazi kasnije (čas 03).
-->

---

## Petlja (`for`)

- **Petlja** ponavlja deo programa dok važi uslov ili dok ima elemenata.
- **`for`**: brojač, granica i korak — pogodno kad znamo koliko puta.
- Telo petlje je blok koji se ponavlja; **deklaracija petlje** nije isto što i **jedno izvršavanje tela**.
- Petlja ne „poziva“ funkciju — drugačiji mehanizam od poziva po imenu.

<!--
Teže — kucaj da razdvojiš „dodelu“ od „izvršavanja“:

for (let i = 0; i < 3; i++) {
  console.log(i);
}

Objasni: zagrade definišu petlju; console.log se izvršava tri puta.
Uporedi sa: const f = console.log; f(1); — tu je poziv funkcije.
-->

---

## Funkcija

- **Funkcija** je imenovano pravilo: ulaz (parametri) → izračunavanje → **povratna vrednost**.
- **Deklaracija** uvodi ime funkcije u program.
- **Poziv** pokreće telo funkcije i koristi povratnu vrednost.
- Parametri su lokalna imena za vrednosti koje poziv prosledi.

<!--
Teže — kucaj:

function nextStep(state) {
  return { ...state, temperature: state.temperature + 1 };
}

Naglasiti: nextStep je vrednost (funkcija); nextStep(room) je poziv.
-->

---

## Funkcija je vrednost

- Ime funkcije može stajati **desno od `=`** kao i broj ili objekat.
- **Dodela** funkcije imenu: čuvamo pravilo za kasnije.
- **Poziv** `ime(...)`: sada izvršavamo pravilo.
- **`ime` bez zagrada** ne pokreće telo — samo referenca na funkciju.
- Zagrade **`()`** znače poziv; njihovo izostavljanje je čest izvor greške (posebno kod callback-a u času 03).

<!--
Teže — kucaj redom:

function bump(n) { return n + 1; }
const g = bump;      // dodela: g i bump su ista funkcija
const x = bump(2);   // poziv: x je 3
// bump;             // ništa se ne izvršava u telu

Arrow zapis (isti smisao):

const bump2 = (n) => n + 1;
-->

---

## Obična i arrow funkcija

- **Obična funkcija** (`function …`): klasičan zapis, pogodan za imenovana pravila.
- **Arrow funkcija** (`=>`): kraći zapis za funkciju kao vrednost.
- Za **isto ponašanje** (parametri, povrat) biramo zapis koji je čitljiviji u kontekstu.
- U ovom času ne ulazimo u vezu arrow funkcije sa `this` — to je za kasniji pregled.

<!--
Teže — kucaj oba zapisa za nextStep i pokaži da poziv daje isti rezultat.

function nextStep(state) { return { ...state, step: state.step + 1 }; }
const nextStepArrow = (state) => ({ ...state, step: state.step + 1 });
-->

---

## Objekat

- **Objekat** grupiše imenovana polja (stanje entiteta).
- **Polje** se čita i menja preko imena (`objekat.polje`).
- **Referenca**: promenljiva ne „sadrži“ objekat kopirano — pokazuje na isti objekat u memoriji.
- Dve promenljive mogu **deliti** isti objekat; izmena kroz jednu vidljiva je kroz drugu.

<!--
Teže — kucaj (pitalica 2):

const room = { temperature: 24 };
const panel = room;
panel.temperature = 10;
console.log(room.temperature);  // 10

Objasni: nema kopije pri dodeli objekta.
-->

---

## Niz

- **Niz** je uređena lista vrednosti, indeks od nule.
- Dužina i elementi mogu da se menjaju (u smislu sadržaja niza).
- Isti princip **reference** kao kod objekta: dodela niza ne pravi duboku kopiju.
- Korisno za istoriju očitavanja — kasnije u Kontrolnoj sobi.

<!--
Teže — kucaj:

const readings = [22, 23, 24];
readings.push(25);
const copy = readings;  // ista referenca
copy[0] = 0;
console.log(readings[0]);  // 0
-->

---

## Leksički opseg (scope)

- **Opseg** određuje gde ime promenljive važi.
- **Lokalno**: unutar funkcije ili bloka gde je ime uvedeno.
- **Spoljašnje**: okružujući kod vidi svoja imena; unutrašnji blok može imati ista imena koja **sene** spoljašnja.
- Funkcija „vidi“ spoljašnje promenljive pri **pozivu**, ne zato što su globalne na ekranu.

<!--
Teže — kucaj sinhroni primer (bez tajmera):

const label = 'soba';
function describe(temp) {
  return label + ': ' + temp;
}
describe(24);

Zatim uvedi lokalnu varijablu istog imena unutra i pokaži senčenje.

Ovo je most ka closure-u u času 03; ne uvoditi addEventListener ovde.
-->

---

## Pre pitalice

- `const` + objekat: šta sme da se menja?
- Dve imena, jedan objekat: šta drugo ime vidi?
- Funkcija: kada je dodela, kada poziv?

<!--
Pređi na slajd pitalice iz pregleda kursa (room / panel).
Demonstracija: nextStep na objektu ventilatora + temperatura; sve u konzoli.
-->
