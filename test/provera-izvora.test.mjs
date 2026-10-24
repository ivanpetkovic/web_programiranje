import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { lectures } from "../site/js/lectures.js";
import { prikazPriloga } from "../site/js/prilog.js";
import { proveriJs } from "../site/js/provera-izvora.js";
import { vecUFajlu } from "../site/js/stablo.js";

const koraci = lectures.flatMap((cas) => cas.steps);

function prikazaniJs(i) {
  const korak = koraci[i];
  const cas = lectures.find((c) => c.steps.includes(korak));
  const ranije = vecUFajlu(koraci, koraci.indexOf(cas.steps[0]), i, korak.putanja);
  return prikazPriloga(korak, ranije).fajl.linije.map((linija) => linija.tekst).join("\n");
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

test("prikazani serverski isečci 5. i 7. nedelje prolaze, a prenos nije u fajlu", () => {
  for (const n of [5, 7]) {
    for (const korak of lectures[n - 1].steps) {
      if (!korak.putanja?.startsWith("server/")) continue;
      const tekst = prikazaniJs(koraci.indexOf(korak));
      if (tekst.trim()) assert.equal(proveriJs(tekst), "", `${n}/${korak.naslov}`);
    }
  }
  for (const naslov of ["Cela poruka", "Pad pretpostavke", "Potvrda", "TCP"]) {
    assert.equal(lectures[4].steps.find((korak) => korak.naslov === naslov).putanja, undefined, naslov);
  }
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
