import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import {
  dodajKorak,
  dodajTemu,
  dodajOpciju,
  indeksPoslePremestanja,
  oznaciOdgovor,
  postaviVrstuFigure,
  postaviVrstuKoraka,
  premestiKorak,
  premestiTemu,
  premestiOpciju,
  procitajTekst,
  spremiTekst,
  ukloniKorak,
  ukloniTemu,
  ukloniOpciju,
  vrstaKoraka,
} from "../site/js/studio.js";

const izvor = fs.readFileSync(new URL("../site/kurs.json", import.meta.url), "utf8");

function kursOdJedne() {
  return procitajTekst(JSON.stringify({
    naslov: "Proba",
    oznaka: "X",
    trajanjeTema: 1,
    teme: [{ naslov: "Prva", visak: 1, steps: [{ naslov: "A", tekst: "ostaje" }] }],
  })).kurs;
}

test("isporučeni kurs.json prolazi kroz studio bez izmene bajtova", () => {
  const procitan = procitajTekst(izvor);
  assert.equal(procitan.ok, true);
  assert.equal(procitan.napomena, "");
  assert.equal(procitan.kurs.trajanjeTema, 11);
  assert.equal(procitan.kurs.teme[0].steps[0].naslov, "LO");
  assert.equal(spremiTekst(procitan.kurs), izvor);
});

test("neispravan JSON i tema bez koraka ne ulaze u studio", () => {
  assert.equal(procitajTekst("{").ok, false);
  assert.match(procitajTekst("{").greska, /JSON/);
  const bezKoraka = procitajTekst(JSON.stringify({ trajanjeTema: 1, teme: [{ naslov: "A" }] }));
  assert.equal(bezKoraka.ok, false);
  assert.equal(bezKoraka.kurs, null);
});

test("stari ključevi nedelje postaju teme", () => {
  const procitan = procitajTekst(JSON.stringify({
    naslov: "Stari",
    trajanjeNedelja: 1,
    nedelje: [{ naslov: "Stara", steps: [{ naslov: "A" }] }],
  }));
  assert.equal(procitan.ok, true);
  assert.equal(procitan.kurs.teme[0].naslov, "Stara");
  assert.equal(procitan.kurs.trajanjeTema, 1);
  assert.equal("nedelje" in procitan.kurs, false);
  assert.equal("trajanjeNedelja" in procitan.kurs, false);
});

test("trajanje se usklađuje sa brojem tema", () => {
  const procitan = procitajTekst(JSON.stringify({
    naslov: "Proba",
    trajanjeTema: 4,
    teme: [{ naslov: "A", steps: [{ naslov: "A" }] }, { naslov: "B", steps: [{ naslov: "B" }] }],
  }));
  assert.equal(procitan.ok, true);
  assert.match(procitan.napomena, /Trajanje/);
  assert.equal(procitan.kurs.trajanjeTema, 2);
});

test("nova tema produžava trajanje i čuva ostala polja", () => {
  const kurs = kursOdJedne();
  const sledeci = dodajTemu(kurs, 0);
  assert.equal(kurs.teme.length, 1);
  assert.equal(sledeci.trajanjeTema, 2);
  assert.equal(sledeci.oznaka, "X");
  assert.equal(sledeci.teme[0].naslov, "Nova tema");
  assert.equal(sledeci.teme[0].steps[0].naslov, "Novi korak");
  assert.equal(sledeci.teme[1].visak, 1);
  assert.equal(sledeci.teme[1].steps[0].tekst, "ostaje");
});

test("brisanje i pomeranje teme ostavljaju redosled", () => {
  let kurs = kursOdJedne();
  kurs = dodajTemu(kurs);
  kurs.teme[1].naslov = "Druga";
  const pomerena = premestiTemu(kurs, 1, -1);
  assert.deepEqual(pomerena.teme.map((tema) => tema.naslov), ["Druga", "Prva"]);
  assert.equal(premestiTemu(pomerena, 0, -1), pomerena);
  const bez = ukloniTemu(pomerena, 0);
  assert.equal(bez.trajanjeTema, 1);
  assert.equal(bez.teme[0].naslov, "Prva");
});

test("korak se dodaje, pomera i ne briše poslednji", () => {
  let kurs = kursOdJedne();
  kurs = dodajKorak(kurs, 0);
  assert.deepEqual(kurs.teme[0].steps.map((korak) => korak.naslov), ["A", "Novi korak"]);
  const pomerena = premestiKorak(kurs, 0, 1, -1);
  assert.equal(pomerena.teme[0].steps[0].naslov, "Novi korak");
  const jedan = ukloniKorak(pomerena, 0, 1);
  assert.equal(jedan.teme[0].steps.length, 1);
  assert.equal(ukloniKorak(jedan, 0, 0), jedan);
});

test("indeks izbora prati premestanje", () => {
  assert.equal(indeksPoslePremestanja(0, 0, 1), 1);
  assert.equal(indeksPoslePremestanja(1, 0, 1), 0);
  assert.equal(indeksPoslePremestanja(3, 0, 1), 3);
  assert.equal(indeksPoslePremestanja(2, 2, -1), 1);
  assert.equal(indeksPoslePremestanja(1, 2, -1), 2);
});

test("vrsta koraka skida fajl ili figuru, a priča ostavlja naslov", () => {
  const korak = { naslov: "A", putanja: "client/index.html", isecak: "x", figura: { vrsta: "put", cvorovi: [] } };
  assert.equal(vrstaKoraka(korak), "figura");
  postaviVrstuKoraka(korak, "prica");
  assert.equal(korak.putanja, undefined);
  assert.equal(korak.isecak, undefined);
  assert.equal(korak.figura, undefined);
  assert.equal(korak.naslov, "A");
  assert.equal(vrstaKoraka(korak), "prica");
  postaviVrstuKoraka(korak, "fajl");
  assert.equal(korak.putanja, "client/index.html");
  assert.equal(korak.figura, undefined);
  korak.isecak = "ostaje";
  postaviVrstuKoraka(korak, "fajl");
  assert.equal(korak.isecak, "ostaje");
});

test("figura menja put u liniju i čuva pokret svoje vrste", () => {
  const korak = { figura: { vrsta: "put", pokret: "jednom", cvorovi: [{ id: "a", natpis: "A" }] } };
  postaviVrstuFigure(korak, "linija");
  assert.equal(korak.figura.vrsta, "linija");
  assert.equal(korak.figura.pokret, undefined);
  assert.ok(korak.figura.oznake.length >= 1);
  korak.figura.pokret = "redom";
  postaviVrstuFigure(korak, "linija");
  assert.equal(korak.figura.pokret, "redom");
});

test("odgovori dobijaju slova i jedan tačan", () => {
  const opcije = [{ key: "A", text: "prvi", ok: true, why: "" }];
  dodajOpciju(opcije);
  assert.equal(opcije[1].key, "B");
  premestiOpciju(opcije, 1, -1);
  assert.equal(opcije[0].text, "");
  assert.equal(opcije[0].key, "A");
  assert.equal(opcije[1].text, "prvi");
  oznaciOdgovor(opcije, 0);
  assert.deepEqual(opcije.map((opcija) => opcija.ok), [true, false]);
  ukloniOpciju(opcije, 0);
  assert.equal(opcije.length, 1);
  assert.equal(opcije[0].key, "A");
});
