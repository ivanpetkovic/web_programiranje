import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import {
  dodajKorak,
  dodajNedelju,
  dodajOpciju,
  indeksPoslePremestanja,
  oznaciOdgovor,
  postaviVrstuFigure,
  postaviVrstuKoraka,
  premestiKorak,
  premestiNedelju,
  premestiOpciju,
  procitajTekst,
  spremiTekst,
  ukloniKorak,
  ukloniNedelju,
  ukloniOpciju,
  vrstaKoraka,
} from "../site/js/studio.js";

const izvor = fs.readFileSync(new URL("../site/kurs.json", import.meta.url), "utf8");

function kursOdJedne() {
  return procitajTekst(JSON.stringify({
    naslov: "Proba",
    oznaka: "X",
    trajanjeNedelja: 1,
    nedelje: [{ naslov: "Prva", visak: 1, steps: [{ naslov: "A", tekst: "ostaje" }] }],
  })).kurs;
}

test("isporučeni kurs.json prolazi kroz studio bez izmene bajtova", () => {
  const procitan = procitajTekst(izvor);
  assert.equal(procitan.ok, true);
  assert.equal(procitan.napomena, "");
  assert.equal(procitan.kurs.trajanjeNedelja, 11);
  assert.equal(procitan.kurs.nedelje[0].steps[0].naslov, "LO");
  assert.equal(spremiTekst(procitan.kurs), izvor);
});

test("neispravan JSON i nedelja bez koraka ne ulaze u studio", () => {
  assert.equal(procitajTekst("{").ok, false);
  assert.match(procitajTekst("{").greska, /JSON/);
  const bezKoraka = procitajTekst(JSON.stringify({ trajanjeNedelja: 1, nedelje: [{ naslov: "A" }] }));
  assert.equal(bezKoraka.ok, false);
  assert.equal(bezKoraka.kurs, null);
});

test("trajanje se usklađuje sa brojem nedelja", () => {
  const procitan = procitajTekst(JSON.stringify({
    trajanjeNedelja: 4,
    nedelje: [{ naslov: "A", steps: [{}] }, { naslov: "B", steps: [{}] }],
  }));
  assert.equal(procitan.ok, true);
  assert.match(procitan.napomena, /Trajanje/);
  assert.equal(procitan.kurs.trajanjeNedelja, 2);
});

test("nova nedelja produžava trajanje i čuva ostala polja", () => {
  const kurs = kursOdJedne();
  const sledeci = dodajNedelju(kurs, 0);
  assert.equal(kurs.nedelje.length, 1);
  assert.equal(sledeci.trajanjeNedelja, 2);
  assert.equal(sledeci.oznaka, "X");
  assert.equal(sledeci.nedelje[0].naslov, "Nova nedelja");
  assert.equal(sledeci.nedelje[0].steps[0].naslov, "Novi korak");
  assert.equal(sledeci.nedelje[1].visak, 1);
  assert.equal(sledeci.nedelje[1].steps[0].tekst, "ostaje");
});

test("brisanje i pomeranje nedelje ostavljaju redosled", () => {
  let kurs = kursOdJedne();
  kurs = dodajNedelju(kurs);
  kurs.nedelje[1].naslov = "Druga";
  const pomerena = premestiNedelju(kurs, 1, -1);
  assert.deepEqual(pomerena.nedelje.map((nedelja) => nedelja.naslov), ["Druga", "Prva"]);
  assert.equal(premestiNedelju(pomerena, 0, -1), pomerena);
  const bez = ukloniNedelju(pomerena, 0);
  assert.equal(bez.trajanjeNedelja, 1);
  assert.equal(bez.nedelje[0].naslov, "Prva");
});

test("korak se dodaje, pomera i ne briše poslednji", () => {
  let kurs = kursOdJedne();
  kurs = dodajKorak(kurs, 0);
  assert.deepEqual(kurs.nedelje[0].steps.map((korak) => korak.naslov), ["A", "Novi korak"]);
  const pomerena = premestiKorak(kurs, 0, 1, -1);
  assert.equal(pomerena.nedelje[0].steps[0].naslov, "Novi korak");
  const jedan = ukloniKorak(pomerena, 0, 1);
  assert.equal(jedan.nedelje[0].steps.length, 1);
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
