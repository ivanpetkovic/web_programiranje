import assert from "node:assert/strict";
import test from "node:test";
import { dokument } from "../site/js/lectures.js";
import { bezRucneNumeracije, oznakaPitanja } from "../site/js/pitanje-broj.js";

const RUCNA = /^\d+(?:\.\d+)+\.\s/;

test("oznaka je broj koraka i redni broj pitanja", () => {
  assert.equal(oznakaPitanja(1, 1), "(1/1)");
  assert.equal(oznakaPitanja(4, 2), "(4/2)");
  assert.equal(oznakaPitanja(0, 1), "");
  assert.equal(oznakaPitanja(2, 0), "");
  assert.equal(bezRucneNumeracije("9.5. Zašto danas?"), "Zašto danas?");
  assert.equal(bezRucneNumeracije("Zašto danas?"), "Zašto danas?");
  assert.equal(bezRucneNumeracije("HTTP/1.1 ostaje"), "HTTP/1.1 ostaje");
});

test("sadržaj pitanja nema ručnu numeraciju", () => {
  for (const [ti, tema] of dokument.teme.entries()) {
    tema.steps.forEach((korak, ki) => {
      const pitanja = (korak.diskusija || []).filter((blok) => blok?.vrsta === "pitanje");
      pitanja.forEach((blok, i) => {
        const gde = `tema ${ti + 1}, korak ${ki + 1}, pitanje ${i + 1}`;
        assert.equal(RUCNA.test(String(blok.tekst || "")), false, gde);
      });
      (korak.pitalice || []).forEach((pitanje, i) => {
        assert.equal(RUCNA.test(String(pitanje.pitalica || "")), false, `pitalica ${ti + 1}.${ki + 1}.${i + 1}`);
      });
      if (typeof korak.pitalica === "string") {
        assert.equal(RUCNA.test(korak.pitalica), false, `pitalica koraka ${ti + 1}.${ki + 1}`);
      }
    });
  }
});
