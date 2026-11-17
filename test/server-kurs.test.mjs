import assert from "node:assert/strict";
import test from "node:test";
import { lectures } from "../site/js/lectures.js";
import { proveriJs } from "../site/js/provera-izvora.js";
import { stabloDo } from "../site/js/stablo.js";

const koraci = lectures.flatMap((cas) => cas.steps);

function krajTeme(n) {
  return lectures.slice(0, n).reduce((zbir, cas) => zbir + cas.steps.length, 0) - 1;
}

function indeks(tema, naslov) {
  const pocetak = krajTeme(tema - 1) + 1;
  const i = lectures[tema - 1].steps.findIndex((korak) => korak.naslov === naslov);
  assert.ok(i >= 0, `${tema}/${naslov}`);
  return pocetak + i;
}

test("čas 6 sklapa HTTP server u fajlu lekcije", () => {
  const korak = lectures[5].steps.find((stavka) => stavka.naslov === "Od programa do HTTP servera");
  const tekst = stabloDo(koraci, indeks(6, "Od programa do HTTP servera")).verzije[korak.putanja];
  assert.match(tekst, /import http from 'node:http'/);
  assert.match(tekst, /http\.createServer/);
  assert.match(tekst, /server\.listen\(3000/);
  assert.match(tekst, /res\.end\('Zdravo sa servera'\)/);
  assert.equal(tekst.includes("npm start"), false);
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

test("izvučen kabl u 7. temi: ventilator vraća 500", () => {
  const i = indeks(7, "Izvučen kabl");
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

test("čas 6 uvodi server redom od okruženja do provere API-ja", () => {
  const redosled = [
    "JavaScript izvan browsera",
    "Projekat, moduli i npm",
    "Od programa do HTTP servera",
    "Anatomija HTTP zahteva i odgovora",
    "Prva ruta bez frameworka",
    "Više ruta, parametri i složenost",
    "JSON ulazni podaci i POST zahtev",
    "Projektovanje jednostavnijeg servera",
    "Uvođenje Express.js-a",
    "Middleware",
    "Resursi, REST i CRUD",
    "Parametri, validacija i statusni kodovi",
    "Organizacija koda i obrada grešaka",
    "Provera celog API-ja",
  ].map((naslov) => indeks(6, naslov));
  assert.deepEqual([...redosled].sort((a, b) => a - b), redosled);
});
