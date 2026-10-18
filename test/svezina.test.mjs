import assert from "node:assert/strict";
import test from "node:test";
import { ocitavanjeJeNovije, prihvatiOcitavanje } from "../site/js/svezina.js";

test("stariji trenutak ne pobedi noviji", () => {
  const noviji = "2026-10-18T08:00:02.000Z";
  const stariji = "2026-10-18T08:00:01.000Z";
  assert.equal(ocitavanjeJeNovije(noviji, stariji), false);
  assert.equal(ocitavanjeJeNovije(stariji, noviji), true);
});

test("ugašena provera pušta stariji trenutak", () => {
  const noviji = "2026-10-18T08:00:02.000Z";
  const stariji = "2026-10-18T08:00:01.000Z";
  assert.equal(prihvatiOcitavanje(true, noviji, stariji), false);
  assert.equal(prihvatiOcitavanje(false, noviji, stariji), true);
});

test("isti trenutak i čitanje bez trenutka prolaze", () => {
  const trenutak = "2026-10-18T08:00:01.000Z";
  assert.equal(ocitavanjeJeNovije(trenutak, trenutak), true);
  assert.equal(ocitavanjeJeNovije(trenutak, undefined), true);
  assert.equal(ocitavanjeJeNovije(null, trenutak), true);
});
