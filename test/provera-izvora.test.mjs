import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { lectures } from "../site/js/lectures.js";
import { prikazPriloga, ulaziUFajl } from "../site/js/prilog.js";
import { proveriJs } from "../site/js/provera-izvora.js";

const koraci = lectures.flatMap((cas) => cas.steps);

function ranijeDo(indeksKoraka, putanja) {
  return koraci
    .slice(0, indeksKoraka)
    .filter((korak) => korak.putanja === putanja && ulaziUFajl(korak.delic))
    .map((korak) => korak.delic)
    .join("\n\n");
}

function prikazaniJs(naslov) {
  const i = koraci.findIndex((korak) => korak.naslov === naslov);
  assert.ok(i >= 0, naslov);
  const korak = koraci[i];
  const prikaz = prikazPriloga(korak, ranijeDo(i, korak.putanja));
  return prikaz.fajl.linije.map((linija) => linija.tekst).join("\n");
}

test("rečenica u js fajlu ne prolazi", () => {
  const greska = proveriJs("polovina B stiže pre polovine A\n");
  assert.notEqual(greska, "");
  assert.match(greska, /Unexpected identifier/);
});

test("poziv bez deklaracije ne prolazi", () => {
  const greska = proveriJs("pošalji(celaPoruka);\n");
  assert.match(greska, /celaPoruka nije definisano|Nije definisano:.*celaPoruka/);
  assert.match(greska, /pošalji/);
});

test("uvedeno ime i komentar prolaze", () => {
  const izvor = [
    'const celaPoruka = "cela poruka";',
    "function pošalji(poruka) {",
    "  return poruka;",
    "}",
    "pošalji(celaPoruka);",
    "// poruka nije stigla cela",
  ].join("\n");
  assert.equal(proveriJs(izvor), "");
});

test("pad pretpostavke prolazi, a potvrda javlja grešku", () => {
  assert.equal(proveriJs(prikazaniJs("Pad pretpostavke")), "");
  const potvrda = proveriJs(prikazaniJs("Potvrda"));
  assert.notEqual(potvrda, "");
  assert.match(potvrda, /deo/);
});

function jsFajlovi(dir) {
  const izlaz = [];
  for (const ime of fs.readdirSync(dir)) {
    const put = path.join(dir, ime);
    if (fs.statSync(put).isDirectory()) izlaz.push(...jsFajlovi(put));
    else if (ime.endsWith(".js")) izlaz.push(put);
  }
  return izlaz;
}

test("serverski js fajlovi prolaze istu proveru", () => {
  const greske = jsFajlovi(path.resolve("server"))
    .map((fajl) => {
      const greska = proveriJs(fs.readFileSync(fajl, "utf8"));
      return greska ? `${fajl}: ${greska}` : "";
    })
    .filter(Boolean);
  assert.deepEqual(greske, []);
});
