import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { procitajTekst, spremiTekst } from "../site/js/studio.js";

const sema = JSON.parse(fs.readFileSync(new URL("../site/kurs.json.schema", import.meta.url), "utf8"));
const json = fs.readFileSync(new URL("../kursevi/web_programiranje/kurs.json", import.meta.url), "utf8");
const kurs = JSON.parse(json);

const SRPSKI = [
  "naslov",
  "teme",
  "trajanjeTema",
  "ustanova",
  "uvod",
  "naziv",
  "recenica",
  "pitalica",
  "opcije",
  "vrsta",
  "tekst",
  "kod",
  "pojmoviCasa",
  "dodatniPrimeri",
  "blokovi",
  "diskusija",
  "kljucnaIdeja",
  "samostalniPrimer",
  "ocekivani-izuzetak",
  "odgovor_odlozen",
  "uticaj_na_aplikaciju",
  "provera-popravke",
];

function kljucevi(vrednost, skup) {
  if (!vrednost || typeof vrednost !== "object") return;
  if (Array.isArray(vrednost)) {
    for (const stavka of vrednost) kljucevi(stavka, skup);
    return;
  }
  for (const [kljuc, val] of Object.entries(vrednost)) {
    skup.add(kljuc);
    kljucevi(val, skup);
  }
}

function kljuceviSeme(node, skup) {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node)) {
    for (const stavka of node) kljuceviSeme(stavka, skup);
    return;
  }
  if (node.properties) {
    for (const [kljuc, pod] of Object.entries(node.properties)) {
      skup.add(kljuc);
      kljuceviSeme(pod, skup);
    }
  }
  if (Array.isArray(node.required)) {
    for (const kljuc of node.required) skup.add(kljuc);
  }
  for (const [kljuc, val] of Object.entries(node)) {
    if (kljuc === "properties" || kljuc === "required" || kljuc === "enum") continue;
    kljuceviSeme(val, skup);
  }
}

test("kurs.json i šema koriste engleske nazive svojstava", () => {
  const uFajlu = new Set();
  kljucevi(kurs, uFajlu);
  const uSemi = new Set();
  kljuceviSeme(sema, uSemi);
  const ostali = SRPSKI.filter((kljuc) => uFajlu.has(kljuc) || uSemi.has(kljuc));
  assert.deepEqual(ostali, []);
  assert.equal(kurs.title, "Web programiranje");
  assert.equal(kurs.themeCount, kurs.topics.length);
  assert.equal(sema.required.includes("title"), true);
  assert.equal(sema.required.includes("themeCount"), true);
  assert.equal(sema.required.includes("topics"), true);
  assert.equal(kurs.topics[0].steps[0].title, "Počeci");
  assert.equal(kurs.glossaryAdditions[0].name, "event loop");
  assert.equal(kurs.introduction.foundations[0].name, "Stanford CS193X");
});

test("učitavanje i snimanje vraća isti engleski dokument", () => {
  const procitan = procitajTekst(json);
  assert.equal(procitan.ok, true, procitan.greska);
  assert.equal(procitan.napomena, "");
  assert.equal(procitan.kurs.naslov, "Web programiranje");
  assert.equal(procitan.kurs.teme.length, 12);
  assert.equal(procitan.kurs.teme[0].steps[0].naslov, "Počeci");
  assert.equal(procitan.kurs.teme[0].dodatniPrimeri[0].kod.length > 0, true);
  assert.equal(procitan.kurs.teme[0].dodatniPrimeri[0].code, undefined);
  assert.equal(procitan.kurs.dopunaGlosara[0].name, "event loop");
  assert.equal(procitan.kurs.uvod.osnov[0].naziv, "Stanford CS193X");
  assert.equal(spremiTekst(procitan.kurs), json);

  const engleski = {
    title: "Proba",
    institution: "Fakultet",
    themeCount: 4,
    topics: [
      {
        title: "Jedna",
        outcome: "Ishod",
        steps: [
          {
            title: "Korak",
            text: "Zdravo",
            keyIdea: "Ideja",
            prompts: [{
              prompt: "Pitanje?",
              options: [
                { key: "A", text: "Da", ok: true, why: "Zato" },
                { key: "B", text: "Ne", ok: false, why: "Nije" },
              ],
              promptAnalysis: "Razlog",
            }],
            blocks: [{ id: "b1", kind: "tekst", text: "Pasus" }],
          },
        ],
      },
    ],
  };
  const ucitan = procitajTekst(JSON.stringify(engleski));
  assert.equal(ucitan.ok, true, ucitan.greska);
  assert.match(ucitan.napomena, /Trajanje/);
  assert.equal(ucitan.kurs.naslov, "Proba");
  assert.equal(ucitan.kurs.ustanova, "Fakultet");
  assert.equal(ucitan.kurs.trajanjeTema, 1);
  assert.equal(ucitan.kurs.teme[0].ishod, "Ishod");
  assert.equal(ucitan.kurs.teme[0].steps[0].tekst, "Zdravo");
  assert.equal(ucitan.kurs.teme[0].steps[0].kljucnaIdeja, "Ideja");
  assert.equal(ucitan.kurs.teme[0].steps[0].pitalice[0].pitalica, "Pitanje?");
  assert.equal(ucitan.kurs.teme[0].steps[0].pitalice[0].opcije[0].text, "Da");
  assert.equal(ucitan.kurs.teme[0].steps[0].blokovi[0].vrsta, "tekst");
  assert.equal(ucitan.kurs.teme[0].steps[0].blokovi[0].tekst, "Pasus");

  const snimljen = JSON.parse(spremiTekst(ucitan.kurs));
  assert.equal(snimljen.title, "Proba");
  assert.equal(snimljen.naslov, undefined);
  assert.equal(snimljen.institution, "Fakultet");
  assert.equal(snimljen.themeCount, 1);
  assert.equal(snimljen.topics[0].title, "Jedna");
  assert.equal(snimljen.topics[0].outcome, "Ishod");
  assert.equal(snimljen.topics[0].steps[0].text, "Zdravo");
  assert.equal(snimljen.topics[0].steps[0].keyIdea, "Ideja");
  assert.equal(snimljen.topics[0].steps[0].prompts[0].prompt, "Pitanje?");
  assert.equal(snimljen.topics[0].steps[0].prompts[0].options[0].why, "Zato");
  assert.equal(snimljen.topics[0].steps[0].blocks[0].kind, "tekst");
  assert.equal(snimljen.topics[0].steps[0].blocks[0].text, "Pasus");
  assert.equal(snimljen.teme, undefined);
  assert.equal(snimljen.topics[0].steps[0].pitalice, undefined);
});
