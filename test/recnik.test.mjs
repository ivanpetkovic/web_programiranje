import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { lekcijePojma, pojmoviIzTeksta, poljaPojma, predlozi } from "../site/js/recnik.js";
import { dokument } from "../site/js/lectures.js";

const markdown = fs.readFileSync(new URL("../GLOSSARY.md", import.meta.url), "utf8");
const pojmovi = pojmoviIzTeksta(markdown);

test("Kontrolna soba i Čitanje nose definiciju iz rečnika", () => {
  const soba = pojmovi.find((pojam) => pojam.ime === "Kontrolna soba");
  const citanje = pojmovi.find((pojam) => pojam.ime === "Čitanje");
  assert.equal(soba.definicija, "Povezujući primer kursa. Čine je soba prekidača i, od uvođenja servera, soba mašina.");
  assert.match(soba.izbegava, /nerazdvojena prostorija/);
  assert.equal(
    citanje.definicija,
    "Odgovor kutije koji nosi temperaturu i režim. HTTP 200 je uspeh. HTTP 500 znači da ventilator nije priključen, i iz tog odgovora displej sobe prekidača ne dobija broj."
  );
  assert.equal(citanje.izbegava, "Komanda.");
  assert.deepEqual(poljaPojma(soba), {
    ime: "Kontrolna soba",
    definicija: soba.definicija,
    izbegava: soba.izbegava,
  });
  assert.equal(pojmovi.some((pojam) => pojam.ime === "Jezik kursa" || pojam.ime === "Kontrolna soba"), true);
  assert.equal(pojmovi.some((pojam) => pojam.ime === "Jezik kursa"), false);
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
  const veza = trazi("veza od kraja do kraja");
  const token = trazi("opaque token");
  const transakcija = trazi("Transakcija");
  assert.match(blockchain.izbegava, /Knjiga na lancu/);
  assert.match(blockchain.izbegava, /lanac blokova/);
  assert.match(veza.definicija, /Engleski.*end-to-end/i);
  assert.match(veza.izbegava, /Žica/);
  const komutacija = trazi("komutacije paketa");
  assert.match(komutacija.definicija, /Engleski.*packet switching/i);
  assert.equal(lekcijePojma(dokument, "komutacije paketa").prvi.korak, 1);
  assert.match(token.izbegava, /Neprozirni ključ/);
  assert.match(transakcija.izbegava, /celina upisa/);
  assert.match(trazi("flag day").izbegava, /Dan zastave/);
  assert.match(trazi("cookie").definicija, /Engleski.*HTTP cookie/i);
  assert.match(trazi("cookie").izbegava, /Kolačić/);
  assert.match(trazi("cookie").izbegava, /transparentni kolačić/);
  assert.match(trazi("HttpOnly").definicija, /Engleski.*HttpOnly/i);
  assert.match(trazi("opaque token").izbegava, /transparentni kolačić/);
  assert.equal(lekcijePojma(dokument, "opaque token").prvi !== null, true);
  assert.equal(lekcijePojma(dokument, "HttpOnly").prvi !== null, true);
  assert.match(trazi("cache").izbegava, /Keš/);
  assert.match(trazi("push").izbegava, /Dovod/);
  assert.match(dokument.teme[0].problem, /blockchain/);
  assert.equal(lekcijePojma(dokument, "veza od kraja do kraja").prvi.korak >= 0, true);
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
