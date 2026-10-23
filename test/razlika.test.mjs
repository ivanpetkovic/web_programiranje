import assert from "node:assert/strict";
import test from "node:test";
import { prethodniUKursu, razlikaLinija, razlikaOriginala, spojeniPrikaz } from "../site/js/razlika.js";

test("zeleno je dodato, crveno obrisano", () => {
  assert.deepEqual(razlikaLinija("a\nb\n", "a\nc\n"), [
    { tip: "isto", tekst: "a" },
    { tip: "obrisano", tekst: "b" },
    { tip: "dodato", tekst: "c" },
  ]);
});

test("prvi original fajla je sav zelen", () => {
  const linije = razlikaOriginala(null, "client/\nserver/\n");
  assert.deepEqual(
    linije.map((linija) => linija.tekst),
    ["client/", "server/"],
  );
  assert.equal(linije.every((linija) => linija.tip === "dodato"), true);
  assert.equal(linije.some((linija) => linija.tip === "obrisano"), false);
});

test("radna verzija se ne poredi", () => {
  const koraci = [
    { putanja: "client/index.html", original: "a\n" },
    { putanja: "client/css/soba.css", original: ".x {}\n" },
    { putanja: "client/index.html", original: "a\nb\n" },
  ];
  const prethodni = prethodniUKursu(koraci, 2);
  const saRadnom = razlikaOriginala(prethodni, koraci[2].original, "potpuno drugačije");
  const bezRadne = razlikaOriginala(prethodni, koraci[2].original);
  assert.equal(prethodni, "a\n");
  assert.deepEqual(saRadnom, bezRadne);
  assert.deepEqual(saRadnom, [
    { tip: "isto", tekst: "a" },
    { tip: "dodato", tekst: "b" },
  ]);
});

test("dodatak stoji u istom kodu i nosi oznaku dodato", () => {
  const linije = spojeniPrikaz(
    "const soba = { temperatura: 24, zeljeno: false };\n\nsoba.temperatura = 25;\n\nconst drugo = soba;",
    "let delta = 1;\nfunction korak(soba) {\n  soba.temperatura += delta;\n}",
  );
  assert.deepEqual(
    linije.filter((linija) => linija.tip === "isto").map((linija) => linija.tekst),
    [
      "const soba = { temperatura: 24, zeljeno: false };",
      "",
      "soba.temperatura = 25;",
      "",
      "const drugo = soba;",
      "",
    ],
  );
  assert.deepEqual(
    linije.filter((linija) => linija.tip === "dodato").map((linija) => linija.tekst),
    ["let delta = 1;", "function korak(soba) {", "  soba.temperatura += delta;", "}"],
  );
  assert.equal(linije.findIndex((linija) => linija.tip === "dodato") > linije.findIndex((linija) => linija.tip === "isto"), true);
});

test("prazan dodatak ostavlja raniji fajl bez nove linije", () => {
  assert.deepEqual(spojeniPrikaz("const server = http.createServer(obrada);", ""), [
    { tekst: "const server = http.createServer(obrada);", tip: "isto" },
  ]);
});

test("prvi isečak nema raniji tekst pa ostaje neoznačen", () => {
  assert.deepEqual(spojeniPrikaz("", "const soba = { temperatura: 24, zeljeno: false };"), [
    { tekst: "const soba = { temperatura: 24, zeljeno: false };", tip: "isto" },
  ]);
  assert.deepEqual(spojeniPrikaz(null, "a\nb"), [
    { tekst: "a", tip: "isto" },
    { tekst: "b", tip: "isto" },
  ]);
});
