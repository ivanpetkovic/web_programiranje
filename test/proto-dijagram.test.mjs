import assert from "node:assert/strict";
import test from "node:test";
import { Raspored, LEGENDA_RASPOREDA } from "../site/js/blokovi/raspored.js";
import { blokIzMd } from "../site/js/blokovi/index.js";
import { dokument } from "../site/js/lectures.js";
import { svgRasporeda } from "../site/js/proto-dijagram.js";

const VEZE = [
  ["proto", "ana", "Korisnik.prototype"],
  ["proto", "o1", "Object.prototype"],
  ["prototype", "Korisnik", "Korisnik.prototype"],
  ["constructor", "Korisnik.prototype", "Korisnik"],
  ["proto", "Korisnik.prototype", "Object.prototype"],
  ["proto", "Korisnik", "Function.prototype"],
  ["prototype", "Object", "Object.prototype"],
  ["constructor", "Object.prototype", "Object"],
  ["proto", "Object.prototype", "null"],
  ["proto", "Object", "Function.prototype"],
  ["prototype", "Function", "Function.prototype"],
  ["constructor", "Function.prototype", "Function"],
  ["proto", "Function.prototype", "Object.prototype"],
  ["proto", "Function", "Function.prototype"],
];

function veze(svg) {
  return [...svg.matchAll(/data-veza="([^"]+)" data-od="([^"]+)" data-ka="([^"]+)"/g)]
    .map((poklapanje) => [poklapanje[1], poklapanje[2], poklapanje[3]]);
}

test("crtež ima veze prototipskog lanca, bez tuđeg koda", () => {
  const svg = svgRasporeda();
  assert.equal(svg.includes("<script"), false);
  assert.match(svg, /aria-label="Prototipski lanac/);
  assert.deepEqual(veze(svg).map((veza) => veza.join(" ")).sort(), VEZE.map((veza) => veza.join(" ")).sort());
  for (const rec of ["marko", "ana", "o2", "o1", "null", "__proto__", "prototype", "constructor", "Korisnik.prototype", "Object.prototype", "Function.prototype"]) {
    assert.ok(svg.includes(`>${rec}<`) || svg.includes(`>${rec}()`), rec);
  }
  assert.equal(veze(svg).some(([, od]) => od === "marko" || od === "o2"), false);
});

test("veze na crtežu važe u jeziku", () => {
  function Korisnik() {}
  const ana = new Korisnik();
  const o1 = new Object();
  const prototip = Object.getPrototypeOf;
  assert.equal(prototip(ana), Korisnik.prototype);
  assert.equal(Korisnik.prototype.constructor, Korisnik);
  assert.equal(prototip(Korisnik.prototype), Object.prototype);
  assert.equal(prototip(Korisnik), Function.prototype);
  assert.equal(prototip(o1), Object.prototype);
  assert.equal(Object.prototype.constructor, Object);
  assert.equal(prototip(Object.prototype), null);
  assert.equal(prototip(Object), Function.prototype);
  assert.equal(Function.prototype.constructor, Function);
  assert.equal(prototip(Function.prototype), Object.prototype);
  assert.equal(prototip(Function), Function.prototype);
  assert.equal(Korisnik.prototype, Object.getOwnPropertyDescriptor(Korisnik, "prototype").value);
  assert.equal(prototip(new Korisnik()), prototip(ana));
});

test("lekcija o prototipu pokazuje raspored posle konstruktora", () => {
  const korak = dokument.teme.flatMap((tema) => tema.steps).find((stavka) => stavka.naslov === "Prototipi, prototipski lanac i klase");
  const blokovi = korak.blokovi;
  const indeks = blokovi.findIndex((blok) => blok.vrsta === "raspored");
  assert.equal(blokovi[indeks - 1].id, "k13b13");
  assert.equal(blokovi[indeks + 1].id, "k13b14");
  assert.equal(blokovi[indeks].naslov, "Prototipski lanac");
  assert.equal(blokovi[indeks].tekst, LEGENDA_RASPOREDA);
  assert.match(blokovi.find((blok) => blok.id === "k13b13").tekst, /Crtež ispod pokazuje/);
  assert.match(blokovi.find((blok) => blok.id === "k13b16").tekst, /ana` i `marko/);
});

test("raspored se uvozi iz ograde", () => {
  const blok = new Raspored({ vrsta: "raspored", naslov: "Prototipski lanac", tekst: LEGENDA_RASPOREDA });
  const uvoz = Raspored.uvoz(blok.izvoz());
  assert.equal(uvoz.izvoz(), blok.izvoz());
  assert.equal(blokIzMd(blok.izvoz()).constructor.vrsta, "raspored");
});
