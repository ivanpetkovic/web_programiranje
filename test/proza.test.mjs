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

test("spisak uz uvodnu rečenicu ne ostaje u pasusu", () => {
  const tekst = [
    "Važno je razlikovati tri situacije:",
    "- Element postoji: vraća se objekat.",
    "- Element ne postoji: vraća se null.",
    "Uvesti: document.querySelector().",
  ].join("\n");
  const blokovi = blokoviProze(tekst);
  assert.equal(blokovi[0].vrsta, "pasus");
  assert.equal(blokovi[0].delovi[0].tekst, "Važno je razlikovati tri situacije:");
  assert.equal(blokovi[1].vrsta, "lista");
  assert.deepEqual(blokovi[1].stavke.map((stavka) => stavka[0].tekst), [
    "Element postoji: vraća se objekat.",
    "Element ne postoji: vraća se null.",
  ]);
  assert.equal(blokovi[2].vrsta, "pasus");
  assert.equal(blokovi[2].delovi[0].tekst, "Uvesti: document.querySelector().");
});

test("podebljano u stavci spiska ostaje naglasak", () => {
  const tekst = [
    "Očekivani zaključak:",
    "-  **pronadjiJedan(selektor)** vraća element ili null.",
  ].join("\n");
  const blokovi = blokoviProze(tekst);
  assert.equal(blokovi[1].vrsta, "lista");
  assert.deepEqual(blokovi[1].stavke[0][0], { tekst: "pronadjiJedan(selektor)", jako: true });
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
