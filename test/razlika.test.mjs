import assert from "node:assert/strict";
import test from "node:test";
import { prethodniUKursu, razlikaLinija, razlikaOriginala } from "../site/js/razlika.js";

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
