import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import {
  dodajKorakNaKraj,
  dodajPitanje,
  imaParametarUredjivanja,
  napraviIstoriju,
  obrisiKorak,
  obrisiPitanje,
  pomeriKorak,
  postaviIsecakKoraka,
  premestiPitanje,
  primeniSnapshot,
  ubaciKorak,
  ubaciPitanje,
  znakStanja,
} from "../site/js/uredi-sadrzaj.js";

test("opozovi i ponovi su ikonice, a Potvrdi ne otvara prozor", () => {
  const main = fs.readFileSync(new URL("../site/js/main.js", import.meta.url), "utf8");
  assert.match(main, /dugmeTrake\("undo-2", "Opozovi"/);
  assert.match(main, /dugmeTrake\("redo-2", "Ponovi"/);
  assert.equal(main.includes('textContent = "Opozovi"'), false);
  assert.equal(main.includes('textContent = "Ponovi"'), false);
  assert.equal(main.includes("window.confirm"), false);
});

test("znak stanja je kvačica, loader ili crveni X", () => {
  assert.deepEqual(znakStanja({ sacuvava: false, greska: "" }), { ikona: "check", natpis: "Sačuvano", vrsta: "sacuvano" });
  assert.equal(znakStanja({ sacuvava: true, greska: "" }).ikona, "loader");
  assert.equal(znakStanja({ sacuvava: false, greska: "dokument nije kurs" }).ikona, "x");
  assert.deepEqual(znakStanja({ sacuvava: false, greska: "", nesacuvano: true }), {
    ikona: "circle-dot",
    natpis: "Nije sačuvano",
    vrsta: "nesacuvano",
  });
  const main = fs.readFileSync(new URL("../site/js/main.js", import.meta.url), "utf8");
  assert.equal(main.includes('textContent = urediSadrzaj.poruka || "kurs.json"'), false);
  assert.match(main, /textContent = "Režim uređivanja"/);
  assert.equal(main.includes("Potvrdi, opozovi i koraci upisuju kurs.json."), false);
  assert.match(main, /oznaka.textContent = natpis/);
  assert.match(main, /dugmeTrake\("chevron-left", "Premesti ulevo"/);
  assert.match(main, /dugmeTrake\("chevron-right", "Premesti udesno"/);
  assert.match(main, /dugme\.title = natpis/);
  assert.match(main, /dugmeTrake\("trash", "Obriši korak"/);
  assert.match(main, /dugmeTrake\("plus", "Dodaj korak"/);
  assert.match(main, /dugmeTrake\("list-plus", "Ubaci korak"/);
  assert.equal(main.includes('dugmeTrake("trash", "Obriši pitanje"'), false);
  assert.match(main, /aria-label", "Opcije pitanja"/);
  assert.match(main, /"Dodaj ispred"/);
  assert.match(main, /"Dodaj posle"/);
  assert.match(main, /"Izmeni"/);
  assert.match(main, /"Pomeri na gore"/);
  assert.match(main, /"Pomeri na dole"/);
  assert.match(main, /"Obriši"/);
  assert.match(main, /znakStanja\(urediSadrzaj\)/);
});

test("pitanje se pomera gore i dole", () => {
  const korak = { pitalice: [{ pitalica: "A", odgovor: "a" }, { pitalica: "B", odgovor: "b" }, { pitalica: "C", odgovor: "c" }] };
  assert.equal(premestiPitanje(korak, 0, -1), -1);
  assert.equal(premestiPitanje(korak, 2, 1), -1);
  assert.equal(premestiPitanje(korak, 2, -1), 1);
  assert.deepEqual(korak.pitalice.map((pitanje) => pitanje.pitalica), ["A", "C", "B"]);
  assert.equal(korak.pitalica, "A");
  assert.equal(premestiPitanje(korak, 0, 1), 1);
  assert.deepEqual(korak.pitalice.map((pitanje) => pitanje.pitalica), ["C", "A", "B"]);
  assert.equal(korak.pitalica, "C");
});

test("korak se pomera ulevo i udesno", () => {
  const tema = { steps: [{ naslov: "A" }, { naslov: "B" }, { naslov: "C" }] };
  assert.equal(pomeriKorak(tema, 0, -1), -1);
  assert.equal(pomeriKorak(tema, 2, 1), -1);
  assert.equal(pomeriKorak(tema, 0, 1), 1);
  assert.deepEqual(tema.steps.map((korak) => korak.naslov), ["B", "A", "C"]);
  assert.equal(pomeriKorak(tema, 1, -1), 0);
  assert.deepEqual(tema.steps.map((korak) => korak.naslov), ["A", "B", "C"]);
});

test("korak se dodaje na kraj, ubacuje ispred tekućeg i ne briše poslednji", () => {
  const tema = { steps: [{ naslov: "A" }, { naslov: "B" }] };
  assert.equal(dodajKorakNaKraj(tema), 2);
  assert.equal(tema.steps[2].naslov, "Novi korak");
  assert.equal(ubaciKorak(tema, 1), 1);
  assert.deepEqual(tema.steps.map((korak) => korak.naslov), ["A", "Novi korak", "B", "Novi korak"]);
  assert.equal(obrisiKorak(tema, 1), 1);
  assert.equal(tema.steps.length, 3);
  const jedan = { steps: [{ naslov: "A" }] };
  assert.equal(obrisiKorak(jedan, 0), -1);
  assert.equal(jedan.steps.length, 1);
});

test("pitanje sa odgovorom se dodaje, ubacuje i briše", () => {
  const korak = { naslov: "A", pitalica: "Staro?", opcije: [{ key: "A", text: "da", ok: true, why: "" }] };
  assert.equal(dodajPitanje(korak), 1);
  assert.equal(korak.pitalice[1].odgovor, "");
  assert.equal(korak.pitalice[0].pitalica, "Staro?");
  assert.equal(ubaciPitanje(korak, 0), 0);
  assert.equal(korak.pitalica, "");
  assert.equal(korak.opcije, undefined);
  assert.equal(korak.pitalice[1].opcije.length, 1);
  assert.equal(obrisiPitanje(korak, 0), 0);
  assert.equal(korak.pitalica, "Staro?");
  assert.equal(obrisiPitanje(korak, 0), 0);
  assert.equal(obrisiPitanje(korak, 0), 0);
  assert.equal(korak.pitalice, undefined);
  assert.equal(korak.pitalica, undefined);
});

test("edit=true uključuje režim uređivanja", () => {
  assert.equal(imaParametarUredjivanja("?edit=true"), true);
  assert.equal(imaParametarUredjivanja("?edit=false"), false);
  assert.equal(imaParametarUredjivanja(""), false);
});

test("istorija opoziva i ponavlja izmenu dokumenta", () => {
  const dokument = { naslov: "A", teme: [{ naslov: "N1", steps: [{ naslov: "k1" }] }] };
  const istorija = napraviIstoriju(dokument);
  istorija.zabeleziPre();
  dokument.naslov = "B";
  assert.equal(dokument.naslov, "B");
  assert.equal(istorija.korakUnazad(dokument), true);
  assert.equal(dokument.naslov, "A");
  assert.equal(istorija.korakNapred(dokument), true);
  assert.equal(dokument.naslov, "B");
});

test("primeniSnapshot zamenjuje ceo kurs", () => {
  const dokument = { naslov: "Staro", teme: [] };
  primeniSnapshot(dokument, JSON.stringify({ naslov: "Novo", teme: [{ steps: [] }] }));
  assert.equal(dokument.naslov, "Novo");
  assert.equal(dokument.teme.length, 1);
});

test("postaviIsecakKoraka usklađuje delic i original", () => {
  const korak = { isecak: "a", delic: "b", original: "c\n" };
  postaviIsecakKoraka(korak, "novo");
  assert.equal(korak.isecak, "novo");
  assert.equal(korak.delic, "novo");
  assert.equal(korak.original, "novo\n");
});
