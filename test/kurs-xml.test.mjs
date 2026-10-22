import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { ispisiXml, procitajXml } from "../site/js/kurs-xml.js";
import { procitajTekst } from "../site/js/studio.js";

const json = fs.readFileSync(new URL("../site/kurs.json", import.meta.url), "utf8");
const xml = fs.readFileSync(new URL("../docs/kurs.xml", import.meta.url), "utf8");
const kurs = procitajTekst(json).kurs;

function ekran(dokument) {
  return {
    naslov: dokument.naslov,
    ustanova: dokument.ustanova,
    ustanovaRed: dokument.ustanovaRed,
    ustanovaBok: dokument.ustanovaBok,
    oznaka: dokument.oznaka,
    grb: dokument.grb,
    trajanjeNedelja: dokument.trajanjeNedelja,
    preduslovPrve: dokument.preduslovPrve,
    nedelje: dokument.nedelje.map((nedelja) => ({
      naslov: nedelja.naslov,
      podnaslov: nedelja.podnaslov,
      ishod: nedelja.ishod,
      minuta: nedelja.minuta,
      problem: nedelja.problem,
      pretpostavka: nedelja.pretpostavka,
      options: nedelja.options,
      rezerva: nedelja.rezerva,
      izlaz: nedelja.izlaz,
      pojmoviCasa: nedelja.pojmoviCasa,
      steps: nedelja.steps.map((korak) => ({
        naslov: korak.naslov,
        nivo: korak.nivo,
        minuta: korak.minuta,
        tekst: korak.tekst,
        kljucnaIdeja: korak.kljucnaIdeja,
        pitalica: korak.pitalica,
        opcije: korak.opcije,
        putanja: korak.putanja || "",
        isecak: korak.isecak || "",
        delic: korak.delic ?? korak.isecak ?? "",
        figura: korak.figura || null,
      })),
    })),
  };
}

test("semantički XML otvara isti čas koji sajt crta iz kurs.json", () => {
  const procitan = procitajXml(xml);
  assert.equal(procitan.ok, true);
  assert.equal(procitan.napomena, "");
  assert.equal(procitan.kurs.nedelje[0].steps[0].naslov, "LO");
  assert.equal(procitan.kurs.nedelje[0].steps[0].opcije.find((opcija) => opcija.ok).key, "B");
  assert.equal(procitan.kurs.nedelje[0].steps[2].figura.vrsta, "put");
  assert.equal(procitan.kurs.nedelje[0].steps[2].figura.cvorovi[1].natpis, "TCP");
  assert.equal(procitan.kurs.nedelje[0].steps.at(-1).figura.pokret, "redom");
  const glava = procitan.kurs.nedelje[1].steps[2];
  assert.equal(glava.naslov, "Glava");
  assert.notEqual(glava.delic, glava.isecak);
  assert.match(glava.delic, /<head>/);
  assert.equal(procitan.nedostajeUgradjena > 0, true);
  assert.deepEqual(ekran(procitan.kurs), ekran(kurs));
});

test("izvoz kurs.json i povratni uvoz čuvaju ugrađenu verziju", () => {
  const nazad = procitajXml(ispisiXml(kurs));
  assert.equal(nazad.ok, true);
  assert.deepEqual(nazad.kurs, kurs);
  const ugradjena = nazad.kurs.nedelje[1].steps[1];
  assert.equal(typeof ugradjena.original, "string");
  assert.match(ugradjena.original, /<!DOCTYPE html>/);
});

test("razlog ostaje u opciji, a navodnici u problemu ostaju tekst", () => {
  const izXml = procitajXml(xml).kurs.nedelje[2].rezerva.problem;
  assert.equal(izXml, kurs.nedelje[2].rezerva.problem);
  assert.match(izXml, /"24"/);
  assert.match(procitajXml(xml).kurs.nedelje[0].steps[0].opcije[0].why, /slova/);
});

test("podnaslov različit od ishoda ostaje podnaslov spiska", () => {
  const nedelja = { ...kurs.nedelje[0], podnaslov: "Kratko", steps: kurs.nedelje[0].steps.slice(0, 1) };
  const nazad = procitajXml(ispisiXml({ ...kurs, nedelje: [nedelja], preduslovPrve: "Početak" })).kurs.nedelje[0];
  assert.equal(nazad.podnaslov, "Kratko");
  assert.equal(nazad.ishod, kurs.nedelje[0].ishod);
});

test("neispravan XML i nedelja bez koraka ne ulaze", () => {
  assert.equal(procitajXml("<kurs>").ok, false);
  assert.match(procitajXml("<kurs>").greska, /XML/);
  const bez = procitajXml(`<kurs><nedelje><nedelja><lekcije></lekcije></nedelja></nedelje></kurs>`);
  assert.equal(bez.ok, false);
  assert.match(bez.greska, /korake/);
  assert.equal(procitajXml("<drugo/>").ok, false);
});

test("trajanje se usklađuje sa brojem nedelja", () => {
  const telo = ispisiXml({ naslov: "Proba", nedelje: [kurs.nedelje[0]] }).replace("trajanje-nedelja=\"1\"", "trajanje-nedelja=\"4\"");
  const procitan = procitajXml(telo);
  assert.equal(procitan.ok, true);
  assert.match(procitan.napomena, /Trajanje/);
  assert.equal(procitan.kurs.trajanjeNedelja, 1);
});

test("CDATA koji sadrži kraj oznake ostaje isti kod", () => {
  const korak = {
    ...kurs.nedelje[1].steps[1],
    isecak: "a]]>b",
    delic: "a]]>b",
    original: "a]]>b\n",
  };
  const nedelja = { ...kurs.nedelje[1], steps: [korak] };
  const nazad = procitajXml(ispisiXml({ ...kurs, nedelje: [nedelja] })).kurs.nedelje[0].steps[0];
  assert.equal(nazad.isecak, "a]]>b");
  assert.equal(nazad.original, "a]]>b\n");
});
