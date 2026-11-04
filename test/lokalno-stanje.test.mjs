import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import {
  KLJUC_STANJA,
  izveziStanje,
  napraviStanje,
  normalizujStanje,
  obrisiStanje,
  podrazumevanoStanje,
  postaviBelesku,
  postaviPaletu,
  postaviPodesavanje,
  sacuvajStanje,
  ucitajStanje,
  ukloniBelesku,
  uveziStanje,
  vidjeniKoraci,
  zabeleziKorak,
} from "../site/js/lokalno-stanje.js";

function memorija(pocetno = {}, baci = false) {
  const mapa = new Map(Object.entries(pocetno));
  return {
    mapa,
    getItem: (kljuc) => (mapa.has(kljuc) ? mapa.get(kljuc) : null),
    setItem(kljuc, vrednost) {
      if (baci) throw new Error("pun");
      mapa.set(kljuc, String(vrednost));
    },
    removeItem: (kljuc) => mapa.delete(kljuc),
  };
}

test("prazno skladište daje podrazumevano stanje", () => {
  const stanje = ucitajStanje(memorija());
  assert.deepEqual(stanje, podrazumevanoStanje());
  assert.equal(stanje.paleta, null);
  assert.equal(stanje.podesavanja.mod, null);
  assert.equal(stanje.podesavanja.font, "1");
  assert.deepEqual(stanje.napredak, {});
  assert.deepEqual(stanje.beleske, []);
});

test("neispravan JSON ne baca i daje podrazumevano stanje", () => {
  assert.deepEqual(ucitajStanje(memorija({ [KLJUC_STANJA]: "{nije" })), podrazumevanoStanje());
  assert.deepEqual(ucitajStanje(memorija({ [KLJUC_STANJA]: '{"verzija":7}' })), podrazumevanoStanje());
});

test("jedno loše polje pada na podrazumevano, ispravna ostaju", () => {
  const zapis = {
    verzija: 1,
    paleta: "ljubicasta",
    podesavanja: { mod: "samostalni", font: "3", stabloSklopljeno: "da" },
    beleske: [{ tema: 3, korak: 2, naslov: "Primitivna vrednost", komentar: "Razlika", izmenjeno: "2026-11-04T08:00:00.000Z" }, { tema: 0 }],
  };
  const stanje = ucitajStanje(memorija({ [KLJUC_STANJA]: JSON.stringify(zapis) }));
  assert.equal(stanje.paleta, null);
  assert.equal(stanje.podesavanja.mod, "samostalni");
  assert.equal(stanje.podesavanja.font, "1");
  assert.equal(stanje.podesavanja.stabloSklopljeno, false);
  assert.equal(stanje.beleske.length, 1);
  assert.equal(stanje.beleske[0].komentar, "Razlika");
});

test("komentar se seče na 500 znakova", () => {
  const stanje = postaviBelesku(podrazumevanoStanje(), { tema: 1, korak: 0, naslov: "Web", komentar: "x".repeat(800) });
  assert.equal(stanje.beleske[0].komentar.length, 500);
});

test("upis koji baca vraća ok false bez izuzetka", () => {
  assert.deepEqual(sacuvajStanje(memorija({}, true), podrazumevanoStanje()), { ok: false });
  const skladiste = memorija({}, true);
  const objekat = napraviStanje(skladiste);
  objekat.promeni((s) => postaviPaletu(s, "pesak"));
  assert.equal(objekat.poslednjiUpisOk(), false);
  assert.equal(objekat.stanje().paleta, "pesak");
});

test("brisanje ostavlja radne verzije", () => {
  const skladiste = memorija({ [KLJUC_STANJA]: JSON.stringify({ verzija: 1, paleta: "ugalj" }), radnaVerzija: '{"client/index.html":"x"}' });
  const stanje = obrisiStanje(skladiste);
  assert.deepEqual(stanje, podrazumevanoStanje());
  assert.equal(skladiste.getItem(KLJUC_STANJA), null);
  assert.equal(skladiste.getItem("radnaVerzija"), '{"client/index.html":"x"}');
});

test("izvoz pa uvoz daje isto stanje", () => {
  let stanje = zabeleziKorak(podrazumevanoStanje(), 3, 2);
  stanje = postaviBelesku(stanje, { tema: 3, korak: 2, naslov: "Primitivna vrednost i referenca", komentar: "Memorija" }, "2026-11-04T08:00:00.000Z");
  stanje = postaviPodesavanje(postaviPaletu(stanje, "terakota"), "font", "1.125");
  const uvoz = uveziStanje(izveziStanje(stanje));
  assert.equal(uvoz.ok, true);
  assert.deepEqual(uvoz.stanje, stanje);
  assert.equal(izveziStanje(stanje).includes("radnaVerzija"), false);
});

test("uvoz ne-JSON-a i zapisa bez verzije je greška", () => {
  assert.equal(uveziStanje("nije json").ok, false);
  const bez = uveziStanje('{"paleta":"pesak"}');
  assert.equal(bez.ok, false);
  assert.match(bez.greska, /nije sačuvano stanje/);
});

test("napredak beleži viđene korake i poslednji korak teme", () => {
  let stanje = zabeleziKorak(podrazumevanoStanje(), 3, 4);
  stanje = zabeleziKorak(stanje, 5, 0);
  stanje = zabeleziKorak(stanje, 3, 1);
  assert.deepEqual(vidjeniKoraci(stanje, 3), [1, 4]);
  assert.equal(stanje.napredak["3"].poslednji, 1);
  assert.deepEqual(stanje.mesto, { tema: 3, uvod: false });
});

test("beleška se menja i uklanja po paru tema i korak", () => {
  let stanje = postaviBelesku(podrazumevanoStanje(), { tema: 3, korak: 2, naslov: "A", komentar: "prvo" });
  stanje = postaviBelesku(stanje, { tema: 3, korak: 2, naslov: "A", komentar: "drugo" });
  assert.equal(stanje.beleske.length, 1);
  assert.equal(stanje.beleske[0].komentar, "drugo");
  assert.equal(ukloniBelesku(stanje, 3, 2).beleske.length, 0);
});

test("stari ključevi prelaze u jedan zapis i brišu se", () => {
  const skladiste = memorija({
    tema: "svetla",
    "web-programiranje:mod": "samostalni",
    "web-programiranje:font": "1.25",
    "web-programiranje:korak": JSON.stringify({ tema: 3, korak: 1, sacuvani: ["3:0", "3:1"] }),
    stabloSklopljeno: "1",
  });
  const stanje = ucitajStanje(skladiste);
  assert.equal(stanje.paleta, "pesak");
  assert.equal(stanje.podesavanja.mod, "samostalni");
  assert.equal(stanje.podesavanja.font, "1.125");
  assert.equal(stanje.podesavanja.stabloSklopljeno, true);
  assert.deepEqual(vidjeniKoraci(stanje, 3), [0, 1]);
  assert.equal(stanje.mesto.tema, 3);
  assert.equal(stanje.beleske.length, 0);
  for (const kljuc of ["tema", "web-programiranje:mod", "web-programiranje:font", "web-programiranje:korak", "stabloSklopljeno"]) {
    assert.equal(skladiste.getItem(kljuc), null, kljuc);
  }
  assert.deepEqual(JSON.parse(skladiste.getItem(KLJUC_STANJA)), stanje);
});

test("tamna postaje ugalj", () => {
  assert.equal(ucitajStanje(memorija({ tema: "tamna" })).paleta, "ugalj");
});

test("stari ključevi ostaju kad upis ne uspe", () => {
  const skladiste = memorija({ tema: "pesak" }, true);
  assert.equal(ucitajStanje(skladiste).paleta, "pesak");
  assert.equal(skladiste.getItem("tema"), "pesak");
});

test("postojeći zapis pobeđuje stari ključ", () => {
  const skladiste = memorija({ [KLJUC_STANJA]: JSON.stringify({ verzija: 1, paleta: "mornar" }), tema: "svetla" });
  assert.equal(ucitajStanje(skladiste).paleta, "mornar");
  assert.equal(skladiste.getItem("tema"), "svetla");
});

test("promeni upisuje ceo zapis jednom i javlja slušaocu", () => {
  const skladiste = memorija();
  let upisa = 0;
  const pravi = skladiste.setItem;
  skladiste.setItem = (k, v) => {
    upisa += 1;
    pravi(k, v);
  };
  const objekat = napraviStanje(skladiste);
  const javljeno = [];
  objekat.naPromenu((stanje, ok) => javljeno.push([stanje.paleta, ok]));
  objekat.promeni((s) => postaviPaletu(s, "ugalj"));
  assert.equal(upisa, 1);
  assert.deepEqual(javljeno, [["ugalj", true]]);
  assert.equal(JSON.parse(skladiste.getItem(KLJUC_STANJA)).paleta, "ugalj");
});

test("primer zapisa iz dokumentacije prolazi bez izmene", (t) => {
  const putanja = new URL("../docs/izgled-i-lokalno-stanje.md", import.meta.url);
  if (!fs.existsSync(putanja)) return t.skip("dokument još ne postoji");
  const tekst = fs.readFileSync(putanja, "utf8");
  const blok = tekst.match(/```json\r?\n([\s\S]*?)\r?\n```/);
  assert.ok(blok, "dokument ima JSON primer");
  const primer = JSON.parse(blok[1]);
  assert.deepEqual(normalizujStanje(primer), primer);
});
