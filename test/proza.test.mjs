import assert from "node:assert/strict";
import test from "node:test";
import { blokoviProze, deloviReda } from "../site/js/proza.js";

test("obična rečenica ostaje jedan pasus", () => {
  const tekst = "Veza je adresa drugog teksta.";
  assert.deepEqual(blokoviProze(tekst), [{ vrsta: "pasus", delovi: [{ tekst }] }]);
});

test("naslov, podebljano, kod i spisak ostaju posebni blokovi", () => {
  const tekst = [
    "### Hipertekst: od linearnog čitanja",
    "",
    "Buš opisuje **Memex**, a Nelson **hipertekst**.",
    "",
    "Na webu:",
    "",
    "- **URL** određuje adresu.",
    "- **HTML** pomoću elementa `<a>` definiše vezu.",
  ].join("\n");
  assert.deepEqual(blokoviProze(tekst), [
    { vrsta: "naslov", nivo: 3, delovi: [{ tekst: "Hipertekst: od linearnog čitanja" }] },
    {
      vrsta: "pasus",
      delovi: [
        { tekst: "Buš opisuje " },
        { tekst: "Memex", jako: true },
        { tekst: ", a Nelson " },
        { tekst: "hipertekst", jako: true },
        { tekst: "." },
      ],
    },
    { vrsta: "pasus", delovi: [{ tekst: "Na webu:" }] },
    {
      vrsta: "lista",
      stavke: [
        [{ tekst: "URL", jako: true }, { tekst: " određuje adresu." }],
        [
          { tekst: "HTML", jako: true },
          { tekst: " pomoću elementa " },
          { tekst: "<a>", kod: true },
          { tekst: " definiše vezu." },
        ],
      ],
    },
  ]);
});

test("nezatvoren naglasak ostaje tekst", () => {
  assert.deepEqual(deloviReda("**samo"), [{ tekst: "**samo" }]);
});

test("naslov u istom bloku sa rečenicom nije običan tekst", () => {
  const tekst = [
    "### Hipertekst",
    "Buš opisuje **Memex**.",
    "",
    "Uvod.",
    "## Sredina",
    "Kraj.",
    "",
    "- jedna",
    "#### Posle spiska",
    "",
    "#v { color: red; }",
  ].join("\n");
  const blokovi = blokoviProze(tekst);
  assert.equal(blokovi[0].vrsta, "naslov");
  assert.equal(blokovi[0].nivo, 3);
  assert.equal(blokovi[0].delovi[0].tekst, "Hipertekst");
  assert.equal(blokovi[1].vrsta, "pasus");
  assert.equal(blokovi[1].delovi[1].tekst, "Memex");
  assert.equal(blokovi[1].delovi[1].jako, true);
  assert.equal(blokovi[2].vrsta, "pasus");
  assert.equal(blokovi[2].delovi[0].tekst, "Uvod.");
  assert.equal(blokovi[3].vrsta, "naslov");
  assert.equal(blokovi[3].nivo, 2);
  assert.equal(blokovi[4].vrsta, "pasus");
  assert.equal(blokovi[4].delovi[0].tekst, "Kraj.");
  assert.equal(blokovi[5].vrsta, "lista");
  assert.equal(blokovi[6].vrsta, "naslov");
  assert.equal(blokovi[6].nivo, 4);
  assert.equal(blokovi[7].vrsta, "pasus");
  assert.equal(blokovi[7].delovi[0].tekst, "#v { color: red; }");
});

test("numerisani spisak i tabela ostaju posebni blokovi", () => {
  const tekst = [
    "1. URL određuje resurs.",
    "2. Pregledač šalje zahtev.",
    "",
    "Protokol | Glavni zadatak | Šta ne određuje",
    "IP | Adresiranje | Pouzdan dolazak",
    "TCP | Tok bajtova | Značenje bajtova",
  ].join("\n");
  const blokovi = blokoviProze(tekst);
  assert.equal(blokovi[0].vrsta, "brojna");
  assert.equal(blokovi[0].stavke.length, 2);
  assert.equal(blokovi[1].vrsta, "tabela");
  assert.deepEqual(blokovi[1].zaglavlje.map((celija) => celija[0].tekst), ["Protokol", "Glavni zadatak", "Šta ne određuje"]);
  assert.equal(blokovi[1].redovi.length, 2);
  assert.equal(blokovi[1].redovi[0][0][0].tekst, "IP");
});
