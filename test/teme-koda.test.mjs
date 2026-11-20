import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { PODRAZUMEVANA_TEMA_KODA, TEME_KODA, temaKodaIz } from "../site/js/teme-koda.js";

const css = fs.readFileSync(new URL("../site/vendor/highlight/teme.css", import.meta.url), "utf8");

test("spisak drži službene teme i GitHub kao podrazumevanu", () => {
  assert.equal(PODRAZUMEVANA_TEMA_KODA, "github");
  assert.equal(temaKodaIz("github"), "github");
  assert.equal(temaKodaIz("bela"), "github");
  assert.equal(temaKodaIz("crna"), "github-dark");
  assert.equal(temaKodaIz("monokai"), "monokai");
  assert.equal(temaKodaIz("nema-je"), "github");
  assert.ok(TEME_KODA.length >= 80);
  assert.equal(new Set(TEME_KODA.map((tema) => tema.id)).size, TEME_KODA.length);
  assert.equal(new Set(TEME_KODA.map((tema) => tema.natpis)).size, TEME_KODA.length);
  const github = TEME_KODA.find((tema) => tema.id === "github");
  const tamna = TEME_KODA.find((tema) => tema.id === "github-dark");
  const skola = TEME_KODA.find((tema) => tema.id === "school-book");
  assert.equal(github.tamna, false);
  assert.equal(tamna.tamna, true);
  assert.equal(skola.tamna, false);
});

test("svaka tema ima sužene selektore, a GitHub i rezervu", () => {
  for (const tema of TEME_KODA) {
    assert.match(css, new RegExp(`html\\[data-tema-koda="${tema.id}"\\] \\.kod-sintaksa\\.hljs`));
  }
  assert.match(css, /\.kod-sintaksa \.hljs-keyword/);
  assert.match(css, /color: #d73a49/);
  assert.equal(css.includes("pre code.hljs"), false);
});
