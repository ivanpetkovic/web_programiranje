import assert from "node:assert/strict";
import test from "node:test";
import { dopunaMesta, procitajMesto, sastaviMesto } from "../site/js/adresa.js";

test("heš časa nosi korak, deo, blok i fajl", () => {
  const mesto = {
    cas: 3,
    korak: 1,
    deo: "diskusija",
    blok: "nasledje:p0",
    fajl: null,
  };
  const hash = sastaviMesto(mesto);
  assert.equal(hash, "#tema/3/k/2/deo/diskusija/blok/nasledje%3Ap0");
  assert.deepEqual(procitajMesto(hash), {
    vrsta: "cas",
    cas: 3,
    korak: 1,
    deo: "diskusija",
    blok: "nasledje:p0",
    fajl: null,
  });
});

test("editor u hešu nosi poslednji fajl, gradivo se zove gradivo", () => {
  const editor = sastaviMesto({
    cas: 2,
    korak: 0,
    deo: "editor",
    blok: "nasledje:tekst",
    fajl: "client/js/korak.js",
  });
  assert.equal(editor, "#tema/2/k/1/deo/editor/fajl/client/js/korak.js");
  assert.equal(procitajMesto(editor).fajl, "client/js/korak.js");
  assert.equal(procitajMesto(editor).blok, null);

  const gradivo = sastaviMesto({ cas: 4, korak: 3, deo: "koraci", blok: "fajl" });
  assert.equal(gradivo, "#tema/4/k/4/deo/gradivo/blok/fajl");
  assert.equal(procitajMesto(gradivo).deo, "koraci");
  assert.equal(procitajMesto("#tema/4/k/4/deo/koraci").deo, "koraci");
  assert.equal(procitajMesto("#cas-4/k/4/deo/koraci").deo, "koraci");
});

test("stari heš časa i uvod i dalje se čitaju", () => {
  const tema = {
    vrsta: "cas",
    cas: 10,
    korak: null,
    deo: null,
    blok: null,
    fajl: null,
  };
  assert.deepEqual(procitajMesto("#tema/10"), tema);
  assert.deepEqual(procitajMesto("#cas-10"), tema);
  assert.equal(procitajMesto("#uvod").vrsta, "uvod");
  assert.equal(sastaviMesto({ uvod: true }), "#uvod");
  assert.equal(procitajMesto("").vrsta, "prazno");
  assert.equal(procitajMesto("#nesto").vrsta, "nepoznato");
  assert.equal(procitajMesto("#tema-2").vrsta, "nepoznato");
  assert.equal(procitajMesto("#tema/2/k/0/deo/diskusija").korak, null);
  assert.equal(procitajMesto("#cas-2/k/0/deo/diskusija").korak, null);
});

test("dopuna dopisuje ono što u hešu fali, a drugi korak nije dopuna", () => {
  const puno = { cas: 2, korak: 1, deo: "editor", fajl: "client/index.html", blok: null };
  assert.equal(dopunaMesta("#tema/2", puno), true);
  assert.equal(dopunaMesta("#cas-2", puno), true);
  assert.equal(dopunaMesta("#tema/2/k/2", puno), true);
  assert.equal(dopunaMesta("#tema/2/k/2/deo/editor", puno), true);
  assert.equal(dopunaMesta("#tema/2/k/1/deo/editor/fajl/client/index.html", puno), false);
  assert.equal(dopunaMesta("#cas-3/k/2/deo/editor", puno), false);
  assert.equal(dopunaMesta("#uvod", { uvod: true }), true);
  assert.equal(dopunaMesta("", { uvod: true }), true);
  assert.equal(dopunaMesta("#tema/1/k/1/deo/diskusija", { uvod: true }), false);
});
