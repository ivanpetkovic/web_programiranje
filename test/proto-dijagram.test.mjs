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
  ["proto", "Korisnik.prototype", "Osoba.prototype"],
  ["prototype", "Osoba", "Osoba.prototype"],
  ["constructor", "Osoba.prototype", "Osoba"],
  ["proto", "Osoba.prototype", "Object.prototype"],
  ["prototype", "Object", "Object.prototype"],
  ["constructor", "Object.prototype", "Object"],
  ["proto", "Object.prototype", "null"],
];

const VEZE_FUNKCIJE = [
  ...VEZE,
  ["proto", "Korisnik", "Function.prototype"],
  ["proto", "Osoba", "Function.prototype"],
  ["proto", "Object", "Function.prototype"],
];

function veze(svg) {
  return [...svg.matchAll(/data-veza="([^"]+)" data-od="([^"]+)" data-ka="([^"]+)"/g)]
    .map((poklapanje) => [poklapanje[1], poklapanje[2], poklapanje[3]]);
}

function tihe(svg) {
  return [...svg.matchAll(/data-veza="([^"]+)" data-od="([^"]+)" data-ka="([^"]+)" data-tiho="([^"]+)"/g)]
    .filter((poklapanje) => poklapanje[4] === "da")
    .map((poklapanje) => [poklapanje[1], poklapanje[2], poklapanje[3]]);
}

test("crtež ima veze prototipskog lanca, bez tuđeg koda", () => {
  const svg = svgRasporeda();
  assert.equal(svg.includes("<script"), false);
  assert.match(svg, /aria-label="Prototipski lanac/);
  assert.equal(svg.includes(">Function.prototype<"), false);
  assert.equal(svg.includes(">Function()<"), false);
  assert.deepEqual(veze(svg).map((veza) => veza.join(" ")).sort(), VEZE.map((veza) => veza.join(" ")).sort());
  assert.deepEqual(tihe(svg), []);
  for (const rec of ["marko", "ana", "o2", "o1", "null", "__proto__", "prototype", "constructor", "Korisnik.prototype", "Osoba.prototype", "Object.prototype"]) {
    assert.ok(svg.includes(`>${rec}<`) || svg.includes(`>${rec}()`), rec);
  }
  assert.equal(veze(svg).some(([, od]) => od === "marko" || od === "o2"), false);
});

test("sledeći crtež stavlja Function.prototype levo, tišom strelicom", () => {
  const svg = svgRasporeda("Function.prototype");
  assert.match(svg, /aria-label="Isti prototipski lanac/);
  assert.deepEqual(veze(svg).map((veza) => veza.join(" ")).sort(), VEZE_FUNKCIJE.map((veza) => veza.join(" ")).sort());
  assert.deepEqual(tihe(svg).map((veza) => veza.join(" ")).sort(), [
    "proto Korisnik Function.prototype",
    "proto Object Function.prototype",
    "proto Osoba Function.prototype",
  ].sort());
  assert.ok(svg.includes(">Function.prototype<"));
  assert.match(svg, /stroke="#a39e94"/);
});

test("veze na crtežu važe u jeziku", () => {
  function Osoba() {}
  function Korisnik() {}
  Object.setPrototypeOf(Korisnik.prototype, Osoba.prototype);
  const ana = new Korisnik();
  const o1 = new Object();
  const prototip = Object.getPrototypeOf;
  assert.equal(prototip(ana), Korisnik.prototype);
  assert.equal(Korisnik.prototype.constructor, Korisnik);
  assert.equal(prototip(Korisnik.prototype), Osoba.prototype);
  assert.equal(Osoba.prototype.constructor, Osoba);
  assert.equal(prototip(Osoba.prototype), Object.prototype);
  assert.equal(prototip(Korisnik), Function.prototype);
  assert.equal(prototip(Osoba), Function.prototype);
  assert.equal(prototip(o1), Object.prototype);
  assert.equal(Object.prototype.constructor, Object);
  assert.equal(prototip(Object.prototype), null);
  assert.equal(prototip(Object), Function.prototype);
  assert.equal(Function.prototype.constructor, Function);
  assert.equal(prototip(Function.prototype), Object.prototype);
  assert.equal(prototip(Function), Function.prototype);
  assert.equal(Korisnik.prototype, Object.getOwnPropertyDescriptor(Korisnik, "prototype").value);
  assert.equal(Osoba.prototype, Object.getOwnPropertyDescriptor(Osoba, "prototype").value);
  assert.equal(prototip(new Korisnik()), prototip(ana));
});

test("lekcija o prototipu pokazuje raspored posle konstruktora", () => {
  const korak = dokument.teme.flatMap((tema) => tema.steps).find((stavka) => stavka.naslov === "Prototipi, prototipski lanac i klase");
  const blokovi = korak.blokovi;
  const rasporedi = blokovi.filter((blok) => blok.vrsta === "raspored");
  const indeks = blokovi.indexOf(rasporedi[0]);
  const drugi = blokovi.indexOf(rasporedi[1]);
  assert.equal(rasporedi.length, 2);
  assert.equal(blokovi[indeks - 1].id, "k13b13");
  assert.equal(blokovi[drugi + 1].id, "k13b14");
  assert.equal(rasporedi[0].naslov, "Prototipski lanac");
  assert.equal(rasporedi[0].tekst, LEGENDA_RASPOREDA);
  assert.equal(rasporedi[1].naslov, "Function.prototype");
  assert.match(rasporedi[1].tekst, /levo od konstruktorskih funkcija/);
  assert.match(blokovi.find((blok) => blok.id === "k13b13").tekst, /Crtež ispod pokazuje/);
  assert.match(blokovi.find((blok) => blok.id === "k13b16").tekst, /ana` i `marko/);
});

test("raspored se uvozi iz ograde", () => {
  const blok = new Raspored({ vrsta: "raspored", naslov: "Prototipski lanac", tekst: LEGENDA_RASPOREDA });
  const uvoz = Raspored.uvoz(blok.izvoz());
  assert.equal(uvoz.izvoz(), blok.izvoz());
  assert.equal(blokIzMd(blok.izvoz()).constructor.vrsta, "raspored");
});
