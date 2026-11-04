import assert from "node:assert/strict";
import test from "node:test";
import { adresaPregleda, popunaKoraka } from "../site/js/birac.js";

test("popuna broji viđene korake teme u opsegu", () => {
  const popuna = popunaKoraka([0, 1, 2, 1, 20, -1, 1.5], 17);
  assert.deepEqual(popuna, { vidjeno: 3, ukupno: 17 });
  assert.equal(popuna.vidjeno / popuna.ukupno, 3 / 17);
});

test("prazna tema ostavlja traku praznu", () => {
  assert.deepEqual(popunaKoraka([], 17), { vidjeno: 0, ukupno: 17 });
  assert.deepEqual(popunaKoraka(null, 0), { vidjeno: 0, ukupno: 0 });
});

test("adresa koristi poreklo stranice i jednu kosu crtu", () => {
  assert.equal(adresaPregleda("http://localhost:8787", "client/index.html"), "http://localhost:8787/client/index.html");
  assert.equal(adresaPregleda("http://localhost:8787/", "/client/index.html"), "http://localhost:8787/client/index.html");
  assert.equal(adresaPregleda("http://localhost:8787", "client/index.html").includes(":3000"), false);
});
