import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { dokumentJeKurs, greskeKursa } from "../server/kurs.js";
import { procitajTekst } from "../site/js/studio.js";

const kursPut = new URL("../site/kurs.json", import.meta.url);
const schemaPut = new URL("../site/kurs.json.schema", import.meta.url);
const izvor = fs.readFileSync(kursPut, "utf8");
const kurs = JSON.parse(izvor);

test("kurs stoji samo u kurs.json", () => {
  assert.equal(fs.existsSync(new URL("../docs/kurs.xml", import.meta.url)), false);
  assert.equal(fs.existsSync(new URL("../site/kurs.xml", import.meta.url)), false);
  assert.equal(fs.existsSync(new URL("../izvoz/kurs.xml", import.meta.url)), false);
  assert.equal(fs.existsSync(kursPut), true);
  assert.equal(fs.existsSync(schemaPut), true);
});

test("isporučeni kurs.json prolazi shemu i server proveru", () => {
  assert.equal(greskeKursa(kurs).length, 0);
  assert.equal(dokumentJeKurs(kurs), true);
  const procitan = procitajTekst(izvor);
  assert.equal(procitan.ok, true);
  assert.equal(procitan.kurs.teme[0].steps[0].naslov, "LO");
});

test("studio čita isti dokument bez izmene bajtova", () => {
  const procitan = procitajTekst(izvor);
  assert.equal(procitan.napomena, "");
  assert.equal(procitan.kurs.trajanjeTema, kurs.teme.length);
});

test("trajanje mora da prati broj tema", () => {
  assert.equal(dokumentJeKurs({ trajanjeTema: 2, teme: [{ steps: [{ naslov: "A" }] }] }), false);
  assert.match(greskeKursa({ trajanjeTema: 2, teme: [{ steps: [{ naslov: "A" }] }] }).join(" "), /trajanjeTema/);
});

test("tema bez koraka-objekata ne prolazi", () => {
  assert.equal(dokumentJeKurs({ trajanjeTema: 1, teme: [{ steps: [null] }] }), false);
  assert.equal(dokumentJeKurs({ trajanjeTema: 1, teme: [{ steps: "x" }] }), false);
});

test("figura i opcije moraju imati očekivani oblik", () => {
  const losPut = {
    trajanjeTema: 1,
    teme: [{
      steps: [{
        naslov: "Crtež",
        figura: { vrsta: "put", cvorovi: [] },
      }],
    }],
  };
  assert.equal(dokumentJeKurs(losPut), false);
  assert.ok(greskeKursa(losPut).some((greska) => /cvorovi|minItems/i.test(greska)));
});

test("nepoznata polja ostaju dozvoljena", () => {
  const saViskom = {
    trajanjeTema: 1,
    ciljnaGrupa: "3. godina",
    teme: [{
      diskusijaMinuta: 20,
      steps: [{
        naslov: "HTTP",
        probaj: "Promeni putanju.",
        isecak: "GET / HTTP/1.1",
      }],
    }],
  };
  assert.equal(dokumentJeKurs(saViskom), true);
});
