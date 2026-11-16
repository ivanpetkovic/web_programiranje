import assert from "node:assert/strict";
import test from "node:test";
import { lectures } from "../site/js/lectures.js";
import { novaPitanja } from "../site/js/kviz-banka.js";
import {
  bazen,
  bezBelih,
  deloviKvizTeksta,
  izaberiPitanja,
  izPostojeceg,
  oceni,
  sazetakPitanja,
  temeSaKvizom,
  zbir,
} from "../site/js/kviz-logika.js";
import { deloviReda } from "../site/js/proza.js";

test("belina se odbacuje, ostali znakovi ostaju", () => {
  assert.equal(bezBelih("a b\n\tc"), "abc");
  assert.equal(bezBelih("  "), "");
});

test("ABC i ispravka ulaze u ocenu, otvoreno pitanje ne", () => {
  const izbor = {
    vrsta: "izbor",
    opcije: [
      { key: "A", ok: false },
      { key: "B", ok: true },
    ],
  };
  assert.equal(oceni(izbor, "B").tacno, true);
  assert.equal(oceni(izbor, "A").tacno, false);
  assert.equal(oceni(izbor, "").ocenjivo, true);

  const kod = { vrsta: "ispravka", resenje: "const a = 1;" };
  assert.equal(oceni(kod, "const   a=1;").tacno, true);
  assert.equal(oceni(kod, "const a = 2;").tacno, false);
  assert.equal(oceni(kod, "   ").tacno, false);

  const tekst = { vrsta: "tekst", odgovor: "Zato što." };
  assert.equal(oceni(tekst, "bilo šta").ocenjivo, false);
  assert.equal(oceni(tekst, "bilo šta").tacno, null);
});

test("zbir broji samo ocenjiva pitanja", () => {
  const pitanja = [
    { id: "a", vrsta: "izbor", opcije: [{ key: "A", ok: true }] },
    { id: "b", vrsta: "ispravka", resenje: "x" },
    { id: "c", vrsta: "tekst", odgovor: "da" },
  ];
  const zbirno = zbir(pitanja, { a: "A", b: "y", c: "da" });
  assert.deepEqual({ tacnih: zbirno.tacnih, ocenjivih: zbirno.ocenjivih }, { tacnih: 1, ocenjivih: 2 });
});

test("prazna postojeća pitalica ne ulazi u kviz", () => {
  assert.equal(izPostojeceg(1, 0, 0, { pitalica: "  ", opcije: [{ key: "A", text: "" }] }), null);
  const abc = izPostojeceg(1, 0, 1, {
    pitalica: "Šta?",
    opcije: [{ key: "A", text: "Ovo", ok: true, why: "Zato." }],
  });
  assert.equal(abc.vrsta, "izbor");
  assert.equal(abc.izvor, "postojece");
  const otvoreno = izPostojeceg(1, 0, 2, { pitalica: "Zašto?", odgovor: "Zato." });
  assert.equal(otvoreno.vrsta, "tekst");
});

test("izbor po temi, celom gradivu, dužini i oceni", () => {
  const pitanja = [
    { id: "t1a", tema: 1, vrsta: "izbor" },
    { id: "t1b", tema: 1, vrsta: "tekst" },
    { id: "t1c", tema: 1, vrsta: "ispravka" },
    { id: "t2", tema: 2, vrsta: "izbor" },
  ];
  const redosled = () => 0.999;
  const tema = izaberiPitanja(pitanja, { opseg: "tema", tema: 1, maksimum: null, ocenjivanje: false, rng: redosled });
  assert.deepEqual(tema.map((p) => p.id), ["t1a", "t1b", "t1c"]);
  const ocenjeno = izaberiPitanja(pitanja, { opseg: "tema", tema: 1, maksimum: 10, ocenjivanje: true, rng: redosled });
  assert.deepEqual(ocenjeno.map((p) => p.id), ["t1a", "t1c"]);
  const kratko = izaberiPitanja(pitanja, { opseg: "sve", maksimum: 1, ocenjivanje: false, rng: redosled });
  assert.equal(kratko.length, 1);
  assert.equal(kratko[0].id, "t1a");
});

test("kviz pokriva samo prve tri teme i svaki njihov korak ima bar deset pitanja", () => {
  assert.deepEqual(temeSaKvizom(novaPitanja), [1, 2, 3]);
  const sve = bazen(lectures, novaPitanja);
  const idjevi = new Set();
  for (const pitanje of sve) {
    assert.equal(idjevi.has(pitanje.id), false, pitanje.id);
    idjevi.add(pitanje.id);
    assert.ok(pitanje.tekst.trim(), pitanje.id);
    if (pitanje.vrsta === "izbor") {
      const tacni = pitanje.opcije.filter((opcija) => opcija.ok);
      assert.equal(tacni.length, 1, pitanje.id);
      assert.ok(pitanje.opcije.every((opcija) => opcija.text.trim()), pitanje.id);
    }
    if (pitanje.vrsta === "ispravka") {
      assert.notEqual(bezBelih(pitanje.polazno), bezBelih(pitanje.resenje), pitanje.id);
      assert.ok(bezBelih(pitanje.resenje), pitanje.id);
    }
  }
  for (const tema of [1, 2, 3]) {
    const lekcija = lectures.find((stavka) => stavka.n === tema);
    lekcija.steps.forEach((korak, indeks) => {
      const zaKorak = sve.filter((pitanje) => pitanje.tema === tema && pitanje.korak === indeks);
      assert.ok(zaKorak.length >= 10, `${tema}.${indeks + 1} ${korak.naslov}: ${zaKorak.length}`);
      const nova = zaKorak.filter((pitanje) => pitanje.izvor === "novo");
      assert.ok(nova.length >= 4, `${tema}.${indeks + 1} novo ${nova.length}`);
      const ocenjiva = zaKorak.filter((pitanje) => pitanje.vrsta === "izbor" || pitanje.vrsta === "ispravka");
      assert.ok(ocenjiva.some((pitanje) => pitanje.vrsta === "ispravka"), `${tema}.${indeks + 1} nema ispravku`);
    });
  }
  assert.equal(sve.some((pitanje) => pitanje.tema > 3), false);
});

test("ograda u pitanju postaje blok koda, a kratki kod u opciji ostaje bez navodnika", () => {
  const pitanje = lectures.find((lekcija) => lekcija.n === 3).steps[8].pitalice
    .find((stavka) => stavka.pitalica.includes("tamo gde je pozvana"));
  const delovi = deloviKvizTeksta(pitanje.pitalica);
  assert.deepEqual(delovi.map((deo) => deo.vrsta), ["proza", "kod", "proza"]);
  assert.match(delovi[1].tekst, /function prikazi\(\)/);
  assert.equal(delovi.every((deo) => !deo.tekst.includes("```")), true);
  assert.equal(delovi[2].tekst, "Šta se ispisuje?");
  assert.equal(
    sazetakPitanja(pitanje.pitalica).includes("function prikazi"),
    false,
  );
  assert.match(sazetakPitanja(pitanje.pitalica), /Šta se ispisuje\?/);
  assert.deepEqual(pitanje.opcije.map((opcija) => deloviReda(opcija.text)), [
    [{ tekst: "10", kod: true }],
    [{ tekst: "20", kod: true }],
    [{ tekst: "undefined", kod: true }],
  ]);
  const otvorena = deloviKvizTeksta("pre\n```javascript\nconst x = 1;");
  assert.equal(otvorena.every((deo) => deo.vrsta === "proza"), true);
  assert.match(otvorena.map((deo) => deo.tekst).join("\n"), /const x = 1;/);
});
