import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const html = fs.readFileSync(new URL("../site/studio.html", import.meta.url), "utf8");
const strana = fs.readFileSync(new URL("../site/js/studio-strana.js", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../site/css/studio.css", import.meta.url), "utf8");

test("studio strana je na srpskom i nudi učitaj, preuzmi i sačuvaj", () => {
  assert.match(html, /<html lang="sr">/);
  assert.match(html, /id="studio"/);
  assert.match(html, /aria-label="Teme i koraci"/);
  assert.match(html, />Učitaj</);
  assert.match(html, /id="preuzmi">Preuzmi</);
  assert.equal(html.includes("preuzmi-xml"), false);
  assert.equal(html.includes(".xml"), false);
  assert.match(html, /id="sacuvaj"[^>]*>Sačuvaj</);
  assert.match(html, /href="\/css\/studio.css"/);
  assert.match(css, /\.studio\b/);
});

test("strana čita kurs.json, šalje PUT i drži nacrt studio:kurs", () => {
  assert.match(strana, /const KLJUC = "studio:kurs"/);
  assert.match(strana, /fetch\("\/kurs\.json"/);
  assert.equal(strana.split('fetch("/api/kurs"').length - 1, 1);
  assert.match(strana, /Potvrdi/);

  const preuzmi = strana.slice(strana.indexOf("function preuzmiDatoteku"), strana.indexOf("async function sacuvaj"));
  assert.match(preuzmi, /download = ime/);
  assert.match(preuzmi, /"kurs\.json"/);
  assert.equal(strana.includes("izvoz-xml"), false);
  assert.equal(strana.includes("uvoz-xml"), false);
  assert.equal(strana.includes("kurs.xml"), false);
  assert.match(strana, /fetch\("\/kurs\.json\.schema"/);
  assert.match(strana, /postaviSemuKursa/);
  assert.equal(preuzmi.includes("/api/kurs"), false);

  const ucitaj = strana.slice(strana.indexOf("async function ucitajFajl"), strana.indexOf("function procitajNacrt"));
  assert.equal(ucitaj.includes("/api/kurs"), false);

  const sacuvaj = strana.slice(strana.indexOf("async function sacuvaj"), strana.indexOf("async function ucitajFajl"));
  assert.match(sacuvaj, /method: "PUT"/);
  const odbij = sacuvaj.indexOf("if (!odgovor.ok)");
  const brisi = sacuvaj.indexOf("localStorage.removeItem(KLJUC)");
  assert.ok(odbij !== -1 && brisi > odbij);
});
