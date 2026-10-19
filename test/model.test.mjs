import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { natpisNedelje, pomeriNedelju, polozajiKlizaca, procenat, ucitajKurs } from "../site/js/model.js";
import { dokument, lectures } from "../site/js/lectures.js";

test("neusaglašeno trajanje ne vraća spisak", () => {
  const rezultat = ucitajKurs({ trajanjeNedelja: 4, nedelje: [{ naslov: "A" }, { naslov: "B" }] });
  assert.equal(rezultat.ok, false);
  assert.equal(rezultat.nedelje, null);
  assert.match(rezultat.greska, /Trajanje/);
});

test("nedelja 10 od 15 ima natpis, 67 i jedan broj na klizaču", () => {
  const nedelje = Array.from({ length: 15 }, (_, i) => ({ naslov: `N${i + 1}`, steps: [{}] }));
  const kurs = { trajanjeNedelja: 15, nedelje };
  const ucitan = ucitajKurs(kurs);
  assert.equal(ucitan.ok, true);
  assert.equal(ucitan.nedelje.length, 15);
  assert.equal(natpisNedelje(kurs, 10), "Nedelja 10 od 15");
  assert.equal(procenat(10, 15), 67);
  const polozaji = polozajiKlizaca(kurs, 10);
  assert.equal(polozaji.length, 15);
  assert.deepEqual(polozaji.filter((polozaj) => polozaj.broj).map((polozaj) => polozaj.broj), ["10"]);
  assert.equal(pomeriNedelju(10, 1, 15), 11);
});

test("kurs od tri nedelje ima tri položaja", () => {
  const kurs = { trajanjeNedelja: 3, nedelje: [{}, {}, {}] };
  assert.equal(ucitajKurs(kurs).ok, true);
  assert.equal(polozajiKlizaca(kurs, 2).length, 3);
  assert.deepEqual(polozajiKlizaca(kurs, 2).filter((polozaj) => polozaj.broj).map((polozaj) => polozaj.n), [2]);
  assert.equal(natpisNedelje(kurs, 2), "Nedelja 2 od 3");
  assert.equal(procenat(1, 10), 10);
});

test("adapter čita dokument i ne drži naslove", () => {
  const izvor = fs.readFileSync(new URL("../site/js/lectures.js", import.meta.url), "utf8");
  assert.equal(izvor.includes("Šta browser prikazuje"), false);
  assert.equal(izvor.includes("JavaScript opisuje stanje"), false);
  assert.equal(dokument.naslov, "Web Programming");
  assert.equal(dokument.trajanjeNedelja, 10);
  assert.equal(lectures.length, 10);
  assert.equal(lectures[0].title, "Šta browser prikazuje");
  assert.equal(lectures[0].steps[0].nivo, "Osnovno");
  assert.equal(lectures[0].minuta, 90);
  assert.ok(lectures[0].steps[0].minuta > 0);
});
