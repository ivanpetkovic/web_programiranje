import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { lekcijePojma, pojmoviIzTeksta, poljaPojma, predlozi } from "../site/js/recnik.js";
import { dokument } from "../site/js/lectures.js";

const markdown = fs.readFileSync(new URL("../kursevi/web_programiranje/GLOSSARY.md", import.meta.url), "utf8");
const pojmovi = pojmoviIzTeksta(markdown);

test("rečnik je uz kurs", () => {
  assert.equal(fs.existsSync(new URL("../GLOSSARY.md", import.meta.url)), false);
  assert.equal(fs.existsSync(new URL("../kursevi/web_programiranje/GLOSSARY.md", import.meta.url)), true);
});

test("rečnik nosi nastavni model, a ne rekvizit povezujućeg primera", () => {
  const tema = pojmovi.find((pojam) => pojam.ime === "Tema");
  assert.equal(tema.definicija, "Jedna celina kursa: naslov, ishod i koraci jednog predavanja.");
  assert.equal(tema.izbegava, "Nedelja");
  assert.deepEqual(poljaPojma(tema), {
    ime: "Tema",
    definicija: tema.definicija,
    izbegava: tema.izbegava,
  });
  assert.equal(pojmovi.some((pojam) => pojam.ime === "Jezik kursa" || pojam.ime === "Stanje"), false);
  const rekvizit = [
    "Kontrolna soba",
    "Soba prekidača",
    "Soba mašina",
    "Kutija",
    "Takt",
    "Prekidač",
    "Režim",
    "Priključen",
    "Čitanje",
    "Komanda",
    "Periodično čitanje",
    "Displej sobe mašina",
    "Displej",
    "Sesija",
    "Transakcija",
    "Posmatrač",
    "Operater",
  ];
  const zabranjeno = /kutij|ventilator|kontroln|displej|prekidač|temperatur/i;
  for (const ime of rekvizit) {
    assert.equal(pojmovi.some((pojam) => pojam.ime === ime), false, ime);
  }
  for (const pojam of pojmovi) {
    assert.doesNotMatch(`${pojam.ime} ${pojam.definicija} ${pojam.izbegava}`, zabranjeno, pojam.ime);
  }
});

test("Alati browsera dolaze iz GLOSSARY.md, a alat van browsera nije taj pojam", () => {
  const alati = pojmovi.find((pojam) => pojam.ime === "Alati browsera");
  assert.match(alati.definicija, /DevTools/);
  assert.match(alati.definicija, /prikaz/);
  assert.match(alati.izbegava, /Izmena fajla/);
  const kurs = {
    teme: [
      {
        steps: [
          { tekst: "Alati browsera menjaju prikaz.", kljucnaIdeja: "", pitalica: "?", isecak: "", opcije: [] },
          { tekst: "Alat van browsera pročita telo.", kljucnaIdeja: "", pitalica: "?", isecak: "", opcije: [] },
        ],
      },
    ],
  };
  assert.deepEqual(lekcijePojma(kurs, "Alati browsera").pogoci, [{ tema: 1, korak: 0 }]);
});

test("pogodak deli teme i ćuti kad glave nema", () => {
  const kurs = {
    teme: [
      { steps: [{ tekst: "Kontrolna soba stoji.", kljucnaIdeja: "", pitalica: "?", isecak: "", opcije: [] }] },
      { steps: [{ tekst: "nema", kljucnaIdeja: "I ovde je Kontrolna soba.", pitalica: "?", isecak: "", opcije: [] }] },
      { steps: [{ tekst: "Kontrolna sobica nije ista reč.", kljucnaIdeja: "", pitalica: "?", isecak: "", opcije: [] }] },
    ],
  };
  const pogodak = lekcijePojma(kurs, "Kontrolna soba");
  assert.deepEqual(pogodak.teme, [1, 2]);
  assert.deepEqual(pogodak.prvi, { tema: 1, korak: 0 });
  assert.deepEqual(lekcijePojma(kurs, "Operater").teme, []);
  assert.equal(lekcijePojma(kurs, "Operater").prvi, null);
});

test("termini gradiva izbegavaju kalk i javljaju se u kursu", () => {
  const trazi = (ime) => pojmovi.find((pojam) => pojam.ime === ime);
  const blockchain = trazi("blockchain");
  const veza = trazi("veza između krajnjih uređaja");
  const token = trazi("opaque token");
  assert.match(blockchain.izbegava, /Knjiga na lancu/);
  assert.match(blockchain.izbegava, /lanac blokova/);
  assert.match(veza.izbegava, /Žica/);
  assert.match(token.izbegava, /Neprozirni ključ/);
  assert.match(token.definicija, /Server po njemu nađe ulogu/);
  assert.match(trazi("flag day").izbegava, /Dan zastave/);
  assert.match(trazi("cookie").izbegava, /Kolačić/);
  assert.match(trazi("cache").izbegava, /Keš/);
  assert.equal(trazi("push"), undefined);
  assert.equal(
    trazi("komunikacioni put").definicija,
    "Put kojim podaci prolaze od izvornog do odredišnog uređaja kroz računarsku mrežu. Može obuhvatati više rutera i komunikacionih veza. Različiti paketi ne moraju uvek prolaziti istim putem."
  );
  assert.match(dokument.teme[0].problem, /blockchain/);
  assert.equal(trazi("veza od kraja do kraja"), undefined);
  for (const ime of [
    "komutacija kola",
    "komutacija paketa",
    "komunikaciona veza",
    "komunikacioni put",
    "veza između krajnjih uređaja",
    "zajednički mrežni resursi",
  ]) {
    assert.ok(trazi(ime), ime);
    assert.equal(lekcijePojma(dokument, ime).prvi.korak >= 0, true, ime);
  }
  assert.equal(lekcijePojma(dokument, "Žica").teme.length, 0);
});

test("pitanje koje počinje upitom vraća svoj korak", () => {
  const kurs = {
    teme: [
      {
        steps: [
          { pitalica: "Šta browser učitava?", isecak: "client/", tekst: "", kljucnaIdeja: "", opcije: [] },
          { pitalica: "Drugo pitanje?", isecak: "server/", tekst: "", kljucnaIdeja: "", opcije: [] },
        ],
      },
    ],
  };
  const pitanje = predlozi(kurs, [], "Šta browser").find((stavka) => stavka.vrsta === "pitanje");
  assert.equal(pitanje.tema, 1);
  assert.equal(pitanje.korak, 0);
  assert.equal(pitanje.tekst, "Šta browser učitava?");
  const primer = predlozi(kurs, [{ ime: "Kutija", definicija: "Server.", izbegava: "" }], "client").find((stavka) => stavka.vrsta === "primer");
  assert.equal(primer.korak, 0);
  const pojam = predlozi(kurs, [{ ime: "Kutija", definicija: "Server.", izbegava: "Ventilator." }], "Kut").find((stavka) => stavka.vrsta === "pojam");
  assert.equal(pojam.definicija, "Server.");
  assert.equal(pojam.izbegava, "Ventilator.");
  assert.deepEqual(poljaPojma(pojam), { ime: pojam.ime, definicija: pojam.definicija, izbegava: pojam.izbegava });
});
