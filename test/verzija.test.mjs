import assert from "node:assert/strict";
import test from "node:test";
import { praznaSesija, primeni } from "../site/js/verzija.js";
import { procitajRadne, upisiRadne } from "../site/js/radna.js";

const koraci = [
  { putanja: "client/index.html", original: "a\n", ugradjen: true, delic: "a\n" },
  { putanja: "server/soba.js", original: "takt\n", ugradjen: true, delic: "takt\n" },
  { putanja: "client/index.html", original: "a\nb\n", ugradjen: true, delic: "b\n" },
  { putanja: "client/css/soba.css", original: ".digit { color: red; }\n", ugradjen: true, delic: "color: red;" },
];
const kontekst = (indeks, nedelja = 5) => ({ koraci, indeks, nedelja });
const otvori = (sesija, indeks, putanja = koraci[indeks].putanja) =>
  primeni(sesija, { tip: "fokus", putanja, kljuc: `korak:${indeks}` }, kontekst(indeks));

test("editor počinje u Lekciji; navigacija ne stvara Moj kod", () => {
  let rezultat = otvori(praznaSesija(), 0);
  assert.equal(rezultat.sesija.verzija, "ugradjena");
  assert.equal(rezultat.prikaz.editor.samoCitaj, true);
  assert.equal(rezultat.prikaz.editor.tekst, "a\n");
  assert.equal(rezultat.upisRadnih, null);
  rezultat = otvori(rezultat.sesija, 2);
  rezultat = primeni(rezultat.sesija, { tip: "strana", strana: "server" }, kontekst(2));
  assert.equal(rezultat.sesija.verzija, "ugradjena");
  assert.equal(rezultat.prikaz.editor.tekst, "takt\n");
  assert.deepEqual(rezultat.sesija.radne, {});
});

test("prvi Moj kod kopira celo stanje izabranog koraka i traži čuvanje", () => {
  const lekcija = otvori(praznaSesija(), 2);
  const moj = primeni(lekcija.sesija, { tip: "radna" }, kontekst(2));
  assert.equal(moj.prikaz.editor.samoCitaj, false);
  assert.deepEqual(moj.upisRadnih, { "client/index.html": "a\nb\n", "server/soba.js": "takt\n" });
  assert.equal(moj.prikaz.editor.tekst, "a\nb\n");
  assert.equal(moj.prikaz.klijent["client/index.html"], "a\nb\n");
  assert.equal(moj.prikaz.server["server/soba.js"], "takt\n");
  assert.equal(lekcija.sesija.verzija, "ugradjena");
  assert.deepEqual(lekcija.sesija.radne, {});
});

test("kasniji korak menja Lekciju, a Moj kod zadržava početni snimak", () => {
  const lekcija = otvori(praznaSesija(), 0);
  const moj = primeni(lekcija.sesija, { tip: "radna" }, kontekst(0));
  const kasnije = otvori(moj.sesija, 2);
  assert.equal(kasnije.sesija.verzija, "radna");
  assert.equal(kasnije.prikaz.editor.tekst, "a\n");
  assert.equal(kasnije.sesija.radne["server/soba.js"], "");
  const prikazLekcije = primeni(kasnije.sesija, { tip: "ugradjena" }, kontekst(2));
  assert.equal(prikazLekcije.prikaz.editor.tekst, "a\nb\n");
  const ponovo = primeni(prikazLekcije.sesija, { tip: "radna" }, kontekst(2));
  assert.equal(ponovo.prikaz.editor.tekst, "a\n");
});

test("novi fajl se dodaje prazan čak i tokom pregleda Lekcije", () => {
  const moj = primeni(otvori(praznaSesija(), 2).sesija, { tip: "radna" }, kontekst(2));
  const lekcija = primeni(moj.sesija, { tip: "ugradjena" }, kontekst(2));
  const novi = otvori(lekcija.sesija, 3);
  assert.equal(novi.sesija.verzija, "ugradjena");
  assert.equal(novi.prikaz.editor.tekst, koraci[3].original);
  assert.equal(novi.upisRadnih["client/css/soba.css"], "");
  const nazad = primeni(novi.sesija, { tip: "radna" }, kontekst(3));
  assert.equal(nazad.prikaz.editor.tekst, "");
  assert.equal(nazad.prikaz.klijent["client/css/soba.css"], "");
  assert.equal(nazad.prikaz.klijent["client/index.html"], "a\nb\n");
});

test("izmenjen i namerno obrisan fajl opstaju pri promeni fajla i ponovnom učitavanju", () => {
  let stanje = primeni(otvori(praznaSesija(), 2).sesija, { tip: "radna" }, kontekst(2));
  stanje = primeni(stanje.sesija, { tip: "unos", tekst: "moj HTML" }, kontekst(2));
  stanje = primeni(stanje.sesija, { tip: "otvori", put: "index.html" }, kontekst(2));
  assert.equal(stanje.prikaz.editor.tekst, "moj HTML");
  stanje = primeni(stanje.sesija, { tip: "unos", tekst: "" }, kontekst(2));
  assert.equal(stanje.prikaz.klijent["client/index.html"], "");
  const skladiste = { tekst: "", getItem() { return this.tekst; }, setItem(_kljuc, tekst) { this.tekst = tekst; } };
  assert.equal(upisiRadne(skladiste, stanje.upisRadnih).sacuvano, true);
  const ponovo = otvori(praznaSesija(procitajRadne(skladiste)), 2);
  assert.equal(ponovo.sesija.verzija, "ugradjena");
  assert.equal(ponovo.prikaz.editor.tekst, "a\nb\n");
  const moj = primeni(ponovo.sesija, { tip: "radna" }, kontekst(2));
  assert.equal(moj.prikaz.editor.tekst, "");
  assert.equal(moj.prikaz.server["server/soba.js"], "takt\n");
});

test("promena strane i fajla zadržava izabranu verziju", () => {
  let rezultat = otvori(praznaSesija(), 2);
  for (const verzija of ["ugradjena", "radna"]) {
    rezultat = primeni(rezultat.sesija, { tip: verzija }, kontekst(2));
    rezultat = primeni(rezultat.sesija, { tip: "strana", strana: "server" }, kontekst(2));
    assert.equal(rezultat.sesija.verzija, verzija);
    rezultat = primeni(rezultat.sesija, { tip: "strana", strana: "client" }, kontekst(2));
    rezultat = primeni(rezultat.sesija, { tip: "otvori", put: "index.html" }, kontekst(2));
    assert.equal(rezultat.sesija.verzija, verzija);
  }
});

test("Lekcija odbija unos; reset menja samo odabrani radni fajl", () => {
  const lekcija = otvori(praznaSesija(), 2);
  const unos = primeni(lekcija.sesija, { tip: "unos", tekst: "ne sme" }, kontekst(2));
  assert.equal(unos.upisRadnih, null);
  assert.equal(unos.prikaz.editor.samoCitaj, true);
  const sesija = praznaSesija({ "client/index.html": "moj HTML", "server/soba.js": "moj server" });
  const reset = primeni(otvori(sesija, 2).sesija, { tip: "reset" }, kontekst(2));
  assert.equal(reset.prikaz.editor.tekst, "a\nb\n");
  assert.equal(reset.sesija.radne["server/soba.js"], "moj server");
  assert.equal(reset.sesija.verzija, "radna");
});

test("server ostaje nedostupan pre pete nedelje", () => {
  const rezultat = primeni(praznaSesija(), { tip: "fokus", putanja: "server/soba.js", kljuc: "pre" }, kontekst(1, 1));
  assert.equal(rezultat.sesija.strana, "client");
  assert.equal(rezultat.sesija.verzija, "ugradjena");
});

test("sačuvan drugi primer ne sprečava prvi snimak Kontrolne sobe", () => {
  const lekcija = otvori(praznaSesija({ "primer/2_fje/index.html": "moj primer" }), 2);
  const moj = primeni(lekcija.sesija, { tip: "radna" }, kontekst(2));
  assert.equal(moj.sesija.radne["client/index.html"], "a\nb\n");
  assert.equal(moj.sesija.radne["primer/2_fje/index.html"], "moj primer");
});
