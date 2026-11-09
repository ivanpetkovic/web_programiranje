import assert from "node:assert/strict";
import test from "node:test";
import { dokument } from "../site/js/lectures.js";
import { svgStrukture } from "../site/js/struktura-crtez.js";

function yOkvira(svg, id) {
  const poklapanje = new RegExp(`data-okvir="${id}"[^>]*\\sy="([\\d.]+)"`).exec(svg);
  assert.ok(poklapanje, id);
  return Number(poklapanje[1]);
}

test("oznaka u kodu ostaje tekst, ne oznaka", () => {
  const id = 'a" onload="1';
  const svg = svgStrukture({
    kod: [{ t: "<script>alert(1)</script>", boja: "plava", ka: id }],
    okviri: [{ id, boja: "plava", redovi: ["onclick=nema"] }],
  });
  assert.equal(svg.includes("<script>"), false);
  assert.match(svg, /&lt;script&gt;/);
  assert.match(svg, /data-okvir="a&quot; onload=&quot;1"/);
});

test("okviri steka idu odozgo nadole, a LIFO stoji samo uz stek", () => {
  const kontekst = dokument.teme[2].steps[9];
  const stek = kontekst.blokovi.find((blok) => blok.naslov === "Stek poziva i leksička okruženja");
  const svg = svgStrukture(JSON.parse(stek.tekst));
  assert.ok(yOkvira(svg, "kvadrat") < yOkvira(svg, "izracunaj"));
  assert.ok(yOkvira(svg, "izracunaj") < yOkvira(svg, "global"));
  assert.match(svg, />LIFO</);
  const strelica = /data-strelica="kvadrat"[^>]*y1="([\d.]+)"[^>]*y2="([\d.]+)"/.exec(svg);
  assert.equal(strelica[1], strelica[2]);

  const opseg = dokument.teme[2].steps[8];
  const leksicko = svgStrukture(JSON.parse(opseg.blokovi.find((blok) => blok.id === "k09b18").tekst));
  assert.equal(leksicko.includes(">LIFO<"), false);
  assert.ok(yOkvira(leksicko, "prikazi") < yOkvira(leksicko, "pozovi"));
  assert.ok(yOkvira(leksicko, "pozovi") < yOkvira(leksicko, "global"));
});

test("opseg izvršavanja crta samo aktivan lanac", () => {
  const kontekst = dokument.teme[2].steps[9];
  const blok = kontekst.blokovi.find((blok) => blok.id === "k10b18");
  const svg = svgStrukture(JSON.parse(blok.tekst)).split("<svg").slice(1);
  assert.equal(svg.length, 2);
  assert.match(svg[0], /Opseg važenja/);
  assert.match(svg[0], /data-okvir="iz"/);
  assert.match(svg[1], /Opseg izvršavanja/);
  assert.match(svg[1], /dok radi kvadrat\(3\)/);
  assert.equal(svg[1].includes('data-okvir="iz"'), false);
  assert.match(svg[1], /const rezultat = kvadrat\(a\);/);
  assert.ok(yOkvira(svg[1], "kv") < yOkvira(svg[1], "gl"));
});
