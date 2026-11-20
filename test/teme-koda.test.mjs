import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { PODRAZUMEVANA_TEMA_KODA, TEME_KODA, temaKodaIz } from "../site/js/teme-koda.js";

const css = fs.readFileSync(new URL("../site/vendor/highlight/teme.css", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../site/index.html", import.meta.url), "utf8");
const ZADRZANE = ["1c-light", "ascetic", "equinox", "a11y-dark", "monokai"];

test("ostaju pet tema, a 1c Light je podrazumevana", () => {
  assert.equal(PODRAZUMEVANA_TEMA_KODA, "1c-light");
  assert.deepEqual(TEME_KODA.map((tema) => tema.id), ZADRZANE);
  assert.equal(temaKodaIz("1c-light"), "1c-light");
  assert.equal(temaKodaIz("bela"), "1c-light");
  assert.equal(temaKodaIz("github"), "1c-light");
  assert.equal(temaKodaIz("crna"), "monokai");
  assert.equal(temaKodaIz("github-dark"), "monokai");
  assert.equal(temaKodaIz("monokai"), "monokai");
  assert.equal(temaKodaIz("a11y-dark"), "a11y-dark");
  assert.equal(temaKodaIz("atom-one-light"), "1c-light");
  assert.equal(temaKodaIz("nema-je"), "1c-light");
  assert.equal(TEME_KODA.find((tema) => tema.id === "equinox").tamna, false);
  assert.equal(TEME_KODA.find((tema) => tema.id === "a11y-dark").tamna, true);
  assert.equal(TEME_KODA.find((tema) => tema.id === "monokai").tamna, true);
  assert.equal(new Set(TEME_KODA.map((tema) => tema.natpis)).size, TEME_KODA.length);
});

test("css drži samo zadržane teme, a 1c Light i rezervu", () => {
  const idjevi = new Set([...css.matchAll(/data-tema-koda="([^"]+)"/g)].map((pogodak) => pogodak[1]));
  assert.deepEqual([...idjevi].sort(), [...ZADRZANE].sort());
  for (const id of ZADRZANE) {
    assert.match(css, new RegExp(`html\\[data-tema-koda="${id}"\\] \\.kod-sintaksa\\.hljs`));
  }
  assert.match(css, /html:not\(\[data-tema-koda\]\) \.kod-sintaksa\.hljs/);
  assert.match(css, /color: #ff0000/);
  assert.equal(css.includes("\n.kod-sintaksa "), false);
  assert.equal(css.includes("pre code.hljs"), false);
  assert.equal(css.includes("brown-papersq"), false);
  assert.equal(css.includes("pojoaque"), false);
});

test("inline skripta u glavi poznaje isti spisak", () => {
  assert.match(html, /temaKoda = "1c-light"/);
  for (const id of ZADRZANE) assert.match(html, new RegExp(`["']?${id}["']?:`));
  assert.match(html, /crna: "monokai"/);
  assert.match(html, /"github-dark": "monokai"/);
  assert.equal(html.includes("github-dark"), true);
  assert.equal(html.includes('temaKoda = "github"'), false);
});
