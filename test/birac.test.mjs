import assert from "node:assert/strict";
import test from "node:test";
import { adresaPregleda, popunaKoraka, rezimPosleAkcije, upisPosleAkcije } from "../site/js/birac.js";

test("popuna broji sačuvane korake nedelje, ne otvoreni indeks", () => {
  const sacuvani = ["1:0", "1:1", "1:2", "1:1", "1:20", "2:0", "nije"];
  const popuna = popunaKoraka(sacuvani, 1, 17);
  assert.deepEqual(popuna, { sacuvano: 3, ukupno: 17 });
  assert.equal(popuna.sacuvano / popuna.ukupno, 3 / 17);
});

test("prazna nedelja ostavlja traku praznu", () => {
  assert.deepEqual(popunaKoraka([], 1, 17), { sacuvano: 0, ukupno: 17 });
  assert.deepEqual(popunaKoraka(null, 1, 0), { sacuvano: 0, ukupno: 0 });
});

test("adresa koristi poreklo stranice i jednu kosu crtu", () => {
  assert.equal(adresaPregleda("http://localhost:8787", "client/index.html"), "http://localhost:8787/client/index.html");
  assert.equal(adresaPregleda("http://localhost:8787/", "/client/index.html"), "http://localhost:8787/client/index.html");
  assert.equal(adresaPregleda("http://localhost:8787", "client/index.html").includes(":3000"), false);
});

test("učitaj ne piše, sačuvaj na lekciji ne menja mapu", () => {
  assert.equal(upisPosleAkcije("ucitaj", "radna"), false);
  assert.equal(rezimPosleAkcije("ucitaj", "radna"), "original");
  assert.equal(upisPosleAkcije("sacuvaj", "original"), false);
  assert.equal(rezimPosleAkcije("sacuvaj", "original"), "original");
  assert.equal(upisPosleAkcije("sacuvaj", "radna"), true);
  assert.equal(rezimPosleAkcije("reset", "original"), "radna");
  assert.equal(upisPosleAkcije("lekcija", "radna"), false);
  assert.equal(rezimPosleAkcije("moj-kod", "original"), "radna");
});
