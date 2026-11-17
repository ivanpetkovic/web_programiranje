import assert from "node:assert/strict";
import test from "node:test";
import { lectures } from "../site/js/lectures.js";
import { novaPitanja } from "../site/js/kviz-banka.js";
import {
  bazen,
  bezBelih,
  deloviKvizTeksta,
  DIJAGRAM_KUTIJE_244,
  izaberiPitanja,
  izPostojeceg,
  oceni,
  sazetakPitanja,
  seOcenjuje,
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

test("neograničen izbor se ne ocenjuje, a po temi uzima n iz svake", () => {
  const pitanja = [
    { id: "t1a", tema: 1, vrsta: "izbor" },
    { id: "t1b", tema: 1, vrsta: "tekst" },
    { id: "t1c", tema: 1, vrsta: "ispravka" },
    { id: "t1d", tema: 1, vrsta: "izbor" },
    { id: "t2a", tema: 2, vrsta: "izbor" },
    { id: "t2b", tema: 2, vrsta: "tekst" },
    { id: "t3a", tema: 3, vrsta: "izbor" },
  ];
  const redosled = () => 0.999;
  assert.equal(seOcenjuje({ maksimum: null, ocenjivanje: true }), false);
  assert.equal(seOcenjuje({ maksimum: null, poTemi: 1, ocenjivanje: true }), true);
  assert.equal(seOcenjuje({ maksimum: 10, ocenjivanje: false }), false);

  const neograniceno = izaberiPitanja(pitanja, {
    opseg: "sve",
    maksimum: null,
    ocenjivanje: true,
    rng: redosled,
  });
  assert.deepEqual(neograniceno.map((pitanje) => pitanje.id), ["t1a", "t1b", "t1c", "t1d", "t2a", "t2b", "t3a"]);

  const jedno = izaberiPitanja(pitanja, { opseg: "sve", poTemi: 1, ocenjivanje: false, rng: redosled });
  assert.deepEqual(jedno.map((pitanje) => pitanje.id), ["t1a", "t2a", "t3a"]);

  const tri = izaberiPitanja(pitanja, { opseg: "sve", poTemi: 3, ocenjivanje: true, rng: redosled });
  assert.deepEqual(tri.map((pitanje) => pitanje.id), ["t1a", "t1c", "t1d", "t2a", "t3a"]);

  const jednaTema = izaberiPitanja(pitanja, { opseg: "tema", tema: 2, poTemi: 3, ocenjivanje: false, rng: redosled });
  assert.deepEqual(jednaTema.map((pitanje) => pitanje.id), ["t2a", "t2b"]);
});

test("kviz pokriva prvih pet tema i svaki njihov korak ima bar deset pitanja", () => {
  assert.deepEqual(temeSaKvizom(novaPitanja), [1, 2, 3, 4, 5]);
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
  for (const tema of [1, 2, 3, 4, 5]) {
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
  assert.equal(sve.some((pitanje) => pitanje.tema > 5), false);
  const dom = sve.filter((pitanje) => pitanje.tema === 5);
  assert.ok(dom.length >= 18 * 10);
  for (const pitanje of dom) {
    if (pitanje.vrsta === "izbor") {
      assert.equal(pitanje.opcije.filter((opcija) => opcija.ok).length, 1, pitanje.id);
      assert.ok(pitanje.analiza.trim(), pitanje.id);
    } else if (pitanje.vrsta === "ispravka") {
      assert.ok(pitanje.resenje.trim(), pitanje.id);
      assert.ok(pitanje.analiza.trim(), pitanje.id);
    } else {
      assert.ok(String(pitanje.odgovor || "").trim(), pitanje.id);
    }
  }
});

test("ograda u pitanju postaje blok koda, a kratki kod u opciji ostaje bez navodnika", () => {
  const pitanje = lectures.find((lekcija) => lekcija.n === 4).steps[0].pitalice
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

test("ograda mermaid je dijagram, ne blok koda", () => {
  const delovi = deloviKvizTeksta("Pre\n\n```mermaid\nflowchart LR\n  a --> b\n```\n\nPosle");
  assert.deepEqual(delovi.map((deo) => deo.vrsta), ["proza", "mermaid", "proza"]);
  assert.match(delovi[1].tekst, /flowchart LR/);
  assert.equal(sazetakPitanja("Pre\n\n```mermaid\nflowchart LR\n  a --> b\n```\n\nPosle").includes("flowchart"), false);
});

const POKAZNA = /\b(ovaj|ovog|ovom|ovu|ova|ovo|ove|ovih|ovim|ovde|tih|onih)\b/i;
const ZABRANJENO = [/tih 244/, /onih 244/, /na početku/, /na času/, /nas ovo/, /Isti CSS/, /\bovde\b/];

test("pitanje kviza ne poziva na kontekst koji kartica ne pokazuje", () => {
  const sve = bazen(lectures, novaPitanja);
  for (const pitanje of sve) {
    const kartica = [pitanje.tekst, pitanje.kod, pitanje.polazno, pitanje.dijagram].filter(Boolean).join("\n");
    for (const zabranjeno of ZABRANJENO) {
      assert.equal(zabranjeno.test(pitanje.tekst), false, `${pitanje.id}: ${pitanje.tekst}`);
    }
    if (POKAZNA.test(pitanje.tekst)) {
      const imaUzorak = Boolean(pitanje.kod || pitanje.polazno || pitanje.dijagram || pitanje.tekst.includes("```"));
      assert.equal(imaUzorak, true, `${pitanje.id}: ${pitanje.tekst}`);
    }
  }
  const kutija = sve.find((pitanje) => pitanje.id === "postojece-2-3-2");
  assert.match(kutija.tekst, /244 px/);
  assert.match(kutija.tekst, /width 200px/);
  assert.equal(kutija.dijagram, DIJAGRAM_KUTIJE_244);
  assert.match(kutija.kod, /padding: 20px/);
  const veza = sve.find((pitanje) => pitanje.id === "postojece-1-5-0");
  assert.match(veza.dijagram, /flowchart LR/);
  assert.match(veza.dijagram, /Veza/);

  const nadji = (id) => sve.find((pitanje) => pitanje.id === id);
  const naslov = nadji("postojece-2-2-0");
  assert.match(naslov.tekst, /<h1>Soba prekidača<\/h1>/);
  assert.match(naslov.tekst, /Šta osvežavanje uradi/);
  assert.match(naslov.kod, /<h1>Soba prekidača<\/h1>/);
  assert.doesNotMatch(naslov.analiza, /čitač ekrana/);
  assert.match(naslov.opcije.find((opcija) => opcija.ok).why, /Dokument se čita iznova/);

  const digit = nadji("postojece-2-8-0");
  assert.match(digit.tekst, /\.digit \{ letter-spacing: 0\.08em; \}/);
  assert.equal(digit.kod, undefined);

  const klasa = nadji("postojece-2-8-1");
  assert.match(klasa.tekst, /\.digit \{ letter-spacing: 0\.08em; \}/);
  assert.match(nadji("novo-2-8-8").tekst, /\.digit \{ letter-spacing: 0\.08em; \}/);

  const osvezi = nadji("postojece-2-10-0");
  assert.match(osvezi.tekst, /U dev alatima/);
  assert.match(osvezi.tekst, /prekucao 24 u 10/);
  assert.match(osvezi.tekst, /Fajl i dalje kaže 24/);
  assert.match(nadji("postojece-2-10-1").tekst, /dev alatima/);
  assert.match(nadji("novo-2-10-5").tekst, /dev alatima/);
  assert.match(nadji("postojece-2-12-0").tekst, /dev alatima/);

  const niska = nadji("novo-3-2-5");
  assert.match(niska.tekst, /console\.log\(s1\)/);
  assert.equal(niska.opcije.find((opcija) => opcija.ok).text, '"Ana"');
  assert.match(niska.kod, /console\.log\(s1\);/);
  assert.equal((niska.kod.match(/console\.log/g) || []).length, 1);

  const boja = nadji("novo-3-7-2");
  assert.match(boja.kod, /console\.log\(b\.opcije\.boja\);/);
  assert.equal(boja.opcije.find((opcija) => opcija.ok).text, '"bela"');

  const primer = nadji("novo-4-0-3");
  assert.match(primer.kod, /primer\(\);/);
  assert.equal(primer.opcije.find((opcija) => opcija.ok).text, '"Unutra"');

  const lista = nadji("novo-5-1-1");
  assert.match(lista.kod, /console\.log\(stavke\.length\);/);
  assert.match(lista.kod, /console\.log\(document\.querySelectorAll\("li"\)\.length\);/);
  assert.equal(lista.opcije.find((opcija) => opcija.ok).key, "A");
});
