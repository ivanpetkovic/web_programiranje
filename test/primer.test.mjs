import assert from "node:assert/strict";
import test from "node:test";
import { pocetniFajl, primeniPrimer } from "../site/js/primer.js";

const verzije = {
  "index.html": "<p>funkcije</p>\n",
  "src/main.js": "export const a = 1;\n",
  "src/drugo.js": "export const b = 2;\n",
};

function stanje() {
  return {
    id: "2_fje",
    otvoreno: "",
    verzija: "radna",
    putanje: Object.keys(verzije),
    verzije,
    kljuc: "",
  };
}

test("prazan izbor otvara index.html i sve fajlove u stablu", () => {
  assert.equal(pocetniFajl(["src/a.js", "prvi.html"]), "prvi.html");
  const rezultat = primeniPrimer(stanje(), {}, { tip: "radna" });
  assert.equal(rezultat.prikaz.editor.putanja, "index.html");
  assert.equal(rezultat.prikaz.editor.tekst, "<p>funkcije</p>\n");
  assert.deepEqual(rezultat.prikaz.fajlovi, ["index.html", "src/main.js", "src/drugo.js"]);
  assert.equal(rezultat.prikaz.server && Object.keys(rezultat.prikaz.server).length, 0);
});

test("otvaranje drugog fajla menja editor, lekcija je samo za čitanje", () => {
  const otvoren = primeniPrimer(stanje(), {}, { tip: "otvori", put: "src/drugo.js" });
  assert.equal(otvoren.prikaz.editor.putanja, "src/drugo.js");
  assert.equal(otvoren.prikaz.editor.tekst, "export const b = 2;\n");
  assert.equal(otvoren.stanje.verzija, "radna");
  const lekcija = primeniPrimer(otvoren.stanje, {}, { tip: "ugradjena" });
  assert.equal(lekcija.prikaz.editor.samoCitaj, true);
  assert.equal(lekcija.prikaz.editor.tekst, "export const b = 2;\n");
  assert.equal(lekcija.upis, null);
});

test("unos ostaje u radnoj verziji primera i ne dira original", () => {
  const otvoren = primeniPrimer(stanje(), {}, { tip: "otvori", put: "src/main.js" });
  const unos = primeniPrimer(otvoren.stanje, {}, { tip: "unos", tekst: "export const a = 9;\n" });
  assert.deepEqual(unos.upis, { putanja: "primer/2_fje/src/main.js", tekst: "export const a = 9;\n" });
  assert.equal(unos.osvezi, false);
  assert.equal(verzije["src/main.js"], "export const a = 1;\n");
  const ponovo = primeniPrimer(unos.stanje, unos.radne, { tip: "radna" });
  assert.equal(ponovo.prikaz.editor.tekst, "export const a = 9;\n");
  assert.equal(ponovo.prikaz.klijent["src/main.js"], "export const a = 9;\n");
  assert.equal(ponovo.prikaz.klijent["index.html"], "<p>funkcije</p>\n");
  const lekcija = primeniPrimer(ponovo.stanje, ponovo.radne, { tip: "ugradjena" });
  assert.equal(lekcija.prikaz.editor.tekst, "export const a = 1;\n");
  const reset = primeniPrimer(lekcija.stanje, lekcija.radne, { tip: "reset" });
  assert.equal(reset.upis.tekst, "export const a = 1;\n");
  assert.equal(reset.stanje.verzija, "radna");
  assert.equal(reset.prikaz.editor.tekst, "export const a = 1;\n");
});
