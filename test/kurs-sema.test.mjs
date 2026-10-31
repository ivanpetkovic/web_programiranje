import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { proveriSemu } from "../site/js/sema.js";
import { prazanKurs, praznaTema, procitajTekst, spremiTekst } from "../site/js/studio.js";

const sema = JSON.parse(fs.readFileSync(new URL("../site/kurs.json.schema", import.meta.url), "utf8"));
const json = fs.readFileSync(new URL("../site/kurs.json", import.meta.url), "utf8");
const kurs = JSON.parse(json);

test("kurs stoji u kurs.json i kurs.json.schema, bez XML izvoza", () => {
  assert.equal(fs.existsSync(new URL("../site/kurs.json", import.meta.url)), true);
  assert.equal(fs.existsSync(new URL("../site/kurs.json.schema", import.meta.url)), true);
  assert.equal(sema.$id, "kurs.json.schema");
  assert.equal(fs.existsSync(new URL("../izvoz/kurs.xml", import.meta.url)), false);
  assert.equal(fs.existsSync(new URL("../docs/kurs.xml", import.meta.url)), false);
  assert.equal(fs.existsSync(new URL("../site/kurs.xml", import.meta.url)), false);
  assert.equal(fs.existsSync(new URL("../site/js/izvoz-xml.js", import.meta.url)), false);
  assert.equal(fs.existsSync(new URL("../site/js/uvoz-xml.js", import.meta.url)), false);
});

test("isporučeni kurs.json prolazi šemu", () => {
  const provera = proveriSemu(sema, kurs);
  assert.deepEqual(provera.greske, []);
  const procitan = procitajTekst(json);
  assert.equal(procitan.ok, true);
  assert.equal(procitan.napomena, "");
  assert.equal(spremiTekst(procitan.kurs), json);
});

test("prazan kurs i nova tema prolaze istu šemu", () => {
  const prazan = procitajTekst(spremiTekst(prazanKurs()));
  assert.equal(prazan.ok, true);
  const tema = praznaTema();
  const saTemom = procitajTekst(spremiTekst({ ...prazanKurs(), teme: [tema], trajanjeTema: 1 }));
  assert.equal(saTemom.ok, true);
  assert.equal(saTemom.kurs.teme[0].steps[0].naslov, "Novi korak");
});

test("šema odbija pogrešan tip, nepoznato polje i korak bez naslova", () => {
  const bezNaslova = procitajTekst(JSON.stringify({
    naslov: "Proba",
    trajanjeTema: 1,
    teme: [{ naslov: "A", steps: [{}] }],
  }));
  assert.equal(bezNaslova.ok, false);
  assert.match(bezNaslova.greska, /naslov/);

  const minuta = prazanKurs();
  const tema = praznaTema();
  tema.steps[0].minuta = "četiri";
  minuta.teme = [tema];
  const losaMinuta = procitajTekst(JSON.stringify(minuta));
  assert.equal(losaMinuta.ok, false);
  assert.match(losaMinuta.greska, /minuta/);

  const visak = procitajTekst(JSON.stringify({ ...prazanKurs(), nepoznato: true }));
  assert.equal(visak.ok, false);
  assert.match(visak.greska, /nepoznato/);

  const figura = structuredClone(kurs);
  figura.teme[0].steps[0].figura = { vrsta: "kocka" };
  const losaFigura = proveriSemu(sema, figura);
  assert.equal(losaFigura.ok, false);
  assert.match(losaFigura.greske[0], /vrsta/);
});

test("uvoz i dalje poravnava trajanje i odbija dokument bez tema", () => {
  const procitan = procitajTekst(JSON.stringify({
    naslov: "Proba",
    trajanjeTema: 4,
    teme: [{ naslov: "A", steps: [{ naslov: "A" }] }],
  }));
  assert.equal(procitan.ok, true);
  assert.match(procitan.napomena, /Trajanje/);
  assert.equal(procitan.kurs.trajanjeTema, 1);
  assert.equal(procitajTekst("{").ok, false);
  assert.equal(procitajTekst(JSON.stringify({ naslov: "Proba" })).ok, false);
});
