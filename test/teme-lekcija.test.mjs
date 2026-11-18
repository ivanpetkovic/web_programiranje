import assert from "node:assert/strict";
import test from "node:test";
import { lectures } from "../site/js/lectures.js";
import { stabloDo } from "../site/js/stablo.js";
import { imeLekcije, resiLekciju, stranaLekcije, temaZaFajl, temeLekcija } from "../site/js/teme-lekcija.js";
import { praznaSesija, primeni } from "../site/js/verzija.js";

const koraci = lectures.flatMap((tema) => tema.steps);

test("teme lekcija drže samo svoje js fajlove", () => {
  const teme = temeLekcija(lectures);
  assert.deepEqual(
    teme.map((tema) => tema.naslov),
    [
      "JavaScript: vrednosti, objekti i funkcije",
      "JavaScript: leksičko okruženje, prototip i modul",
      "DOM, događaji i prikaz stanja",
      "Node.js, HTTP server i Web API",
    ],
  );
  const svi = teme.flatMap((tema) => tema.fajlovi);
  assert.equal(new Set(svi).size, svi.length);
  assert.equal(svi.every((put) => put.startsWith("lekcije/") && put.endsWith(".js")), true);
  const prva = teme[0];
  assert.deepEqual(prva.fajlovi[0], "lekcije/01-izvrsavanje.js");
  assert.equal(prva.fajlovi.includes("lekcije/09-opseg.js"), false);
  assert.match(prva.verzije["lekcije/08-sintaksa.js"], /korisnickoIme|godine|brojevi/);
  assert.equal(prva.verzije["lekcije/01-izvrsavanje.js"].includes("export function saberi"), false);
  const cetvrta = teme[3];
  assert.match(cetvrta.verzije["lekcije/36-http-server.js"], /http\.createServer/);
  assert.equal(cetvrta.fajlovi.includes("index.html"), false);
  const pogodak = temaZaFajl(teme, "client/lekcije/24-formular.js");
  assert.equal(pogodak.id, "tema-5");
  assert.equal(temaZaFajl(teme, "client/index.html"), null);
  assert.equal(stranaLekcije("tema-3"), "client");
  assert.equal(stranaLekcije("tema-4"), "client");
  assert.equal(stranaLekcije("tema-5"), "client");
  assert.equal(stranaLekcije(teme[3].id), "server");
  assert.equal(teme[3].fajlovi.every((put) => Number(put.slice("lekcije/".length, "lekcije/".length + 2)) >= 34), true);
  assert.equal(imeLekcije("lekcije/37-zahtev.js"), "lekcije/zahtev.js");
  assert.equal(imeLekcije("37-zahtev.js"), "zahtev.js");
  assert.equal(temaZaFajl(teme, "client/lekcije/15-moduli.js").id, "tema-4");
  assert.equal(temaZaFajl(teme, "client/lekcije/35-moduli.js").id, "tema-6");
  const tok = resiLekciju(teme, "client/lekcije/tok.js");
  assert.equal(tok, null);
  assert.equal(resiLekciju(teme, "client/lekcije/tok.js", "tema-5").put, "lekcije/27-tok.js");
  assert.equal(resiLekciju(teme, "server/lekcije/zahtev.js", "tema-6").put, "lekcije/37-zahtev.js");
});

test("kontrolna soba ne nosi fajlove lekcija", () => {
  const indeks = koraci.findIndex((korak) => korak.naslov === "Destrukturiranje i savremena sintaksa");
  const stablo = stabloDo(koraci, indeks);
  assert.equal(Object.keys(stablo.verzije).some((put) => put.startsWith("client/lekcije/")), true);
  const prikaz = primeni(praznaSesija(), { tip: "fokus", putanja: "client/css/soba.css", kljuc: "3:7" }, {
    koraci,
    indeks,
    tema: 3,
  });
  assert.equal(prikaz.prikaz.fajlovi.includes("css/soba.css"), true);
  assert.equal(prikaz.prikaz.fajlovi.some((put) => put.startsWith("lekcije/")), false);
  assert.equal(prikaz.prikaz.klijent["client/lekcije/08-sintaksa.js"], undefined);
});
