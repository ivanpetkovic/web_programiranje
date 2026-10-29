import assert from "node:assert/strict";
import test from "node:test";
import vm from "node:vm";
import { lectures } from "../site/js/lectures.js";
import { proveriJs } from "../site/js/provera-izvora.js";
import { stabloDo } from "../site/js/stablo.js";

const koraci = lectures.flatMap((cas) => cas.steps);

function krajNedelje(n) {
  return lectures.slice(0, n).reduce((zbir, cas) => zbir + cas.steps.length, 0) - 1;
}

function indeks(nedelja, naslov) {
  const pocetak = krajNedelje(nedelja - 1) + 1;
  const i = lectures[nedelja - 1].steps.findIndex((korak) => korak.naslov === naslov);
  assert.ok(i >= 0, `${nedelja}/${naslov}`);
  return pocetak + i;
}

test("sklopljen server.js učitava http pre createServer i listen", () => {
  const tekst = stabloDo(koraci, indeks(5, "listen")).verzije["server/server.js"];
  assert.match(tekst, /^const http = require\("http"\);\n/);
  assert.match(tekst, /const server = http\.createServer\(obrada\);/);
  assert.match(tekst, /server\.listen\(8787\);/);
  assert.equal(tekst.includes("node server/server.js"), false);
  assert.equal(tekst.includes("GET /api/soba"), false);
  assert.doesNotThrow(() => new vm.Script(tekst, { filename: "server.js" }));
  assert.equal(proveriJs(tekst).includes("http"), false);
});

test("svaki sklopljeni serverski fajl koji zove http ima require", () => {
  for (let i = 0; i < koraci.length; i += 1) {
    const verzije = stabloDo(koraci, i).verzije;
    for (const [putanja, tekst] of Object.entries(verzije)) {
      if (!putanja.startsWith("server/") || !putanja.endsWith(".js")) continue;
      if (!/\bhttp\s*\./.test(tekst)) continue;
      assert.match(tekst, /require\(\s*["'](?:node:)?http["']\s*\)/, `${koraci[i].naslov} ${putanja}`);
      assert.equal(proveriJs(tekst).includes("http"), false, `${koraci[i].naslov} ${putanja}`);
    }
  }
});

test("izvučen kabl u 6. nedelji: ventilator vraća 500", () => {
  const i = indeks(6, "Izvučen kabl");
  assert.equal(koraci[i].putanja, "server/ventilator.js");
  const tekst = stabloDo(koraci, i).verzije["server/ventilator.js"];
  assert.match(tekst, /return \{ status: 500 \}/);
});

test("kurs se završava snimcima iz predavanja, ne pripremljenim modulima", () => {
  const kraj = stabloDo(koraci, koraci.length - 1).verzije;
  assert.match(kraj["server/server.js"], /nema drugog glasanja/);
  assert.match(kraj["server/soba.js"], /type Soba = \{ temperatura: number; ukljucen: boolean \}/);
  assert.match(kraj["server/ventilator.js"], /teloJeRezim\(telo\)/);
  assert.match(kraj["server/sesija.js"], /401 → 403 → 400 → 500 → 200/);
});

test("5. nedelja uvodi server redom: TCP, HTTP, createServer, listen, komanda, adresa", () => {
  const redosled = ["TCP", "HTTP", "createServer", "listen", "Komanda", "Adresa", "Ruta"].map((naslov) => indeks(5, naslov));
  assert.deepEqual([...redosled].sort((a, b) => a - b), redosled);
  const samostalni = ["Putanja i metod čine rutu", "Konkurentni zahtevi"];
  for (const naslov of samostalni) {
    const korak = koraci[indeks(5, naslov)];
    assert.equal(korak.putanja, undefined, naslov);
    assert.ok(korak.samostalniPrimer?.tekst, naslov);
  }
});
