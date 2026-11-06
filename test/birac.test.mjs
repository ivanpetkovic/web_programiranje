import assert from "node:assert/strict";
import test from "node:test";
import { adresaPregleda, popunaKoraka, rasporedBiraca } from "../site/js/birac.js";

test("popuna broji viđene korake teme u opsegu", () => {
  const popuna = popunaKoraka([0, 1, 2, 1, 20, -1, 1.5], 17);
  assert.deepEqual(popuna, { vidjeno: 3, ukupno: 17 });
  assert.equal(popuna.vidjeno / popuna.ukupno, 3 / 17);
});

test("prazna tema ostavlja traku praznu", () => {
  assert.deepEqual(popunaKoraka([], 17), { vidjeno: 0, ukupno: 17 });
  assert.deepEqual(popunaKoraka(null, 0), { vidjeno: 0, ukupno: 0 });
});

test("širina birača bira raspored trake", () => {
  assert.equal(rasporedBiraca(1200), "siroko");
  assert.equal(rasporedBiraca(900), "siroko");
  assert.equal(rasporedBiraca(899), "srednje");
  assert.equal(rasporedBiraca(760), "srednje");
  assert.equal(rasporedBiraca(759), "usko");
  assert.equal(rasporedBiraca(540), "usko");
  assert.equal(rasporedBiraca(539), "tesno");
  assert.equal(rasporedBiraca(0), "tesno");
  assert.equal(rasporedBiraca(Number.NaN), "siroko");
});

test("adresa koristi poreklo stranice i jednu kosu crtu", () => {
  assert.equal(adresaPregleda("http://localhost:8787", "client/index.html"), "http://localhost:8787/client/index.html");
  assert.equal(adresaPregleda("http://localhost:8787/", "/client/index.html"), "http://localhost:8787/client/index.html");
  assert.equal(adresaPregleda("http://localhost:8787", "client/index.html").includes(":3000"), false);
});
