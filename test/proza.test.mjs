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
    "Na vebu:",
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
    { vrsta: "pasus", delovi: [{ tekst: "Na vebu:" }] },
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
