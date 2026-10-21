import assert from "node:assert/strict";
import test from "node:test";
import { potez, praznoStanje, prikaz } from "../site/js/diskusija.js";

const pitalica = {
  problem: "Šta drži kutija?",
  options: [
    { key: "A", text: "Prekidač", ok: false, why: "Prekidač je u sobi prekidača." },
    { key: "B", text: "Režim", ok: true, why: "Režim je stanje ventilatora." },
  ],
  rezerva: {
    problem: "Šta ako je kabel izvučen?",
    options: [{ key: "A", text: "HTTP 500", ok: true, why: "Čitanje dobija 500." }],
  },
};

function doFaze(n) {
  let stanje = praznoStanje();
  for (let i = 0; i < n; i += 1) stanje = potez(stanje, { tip: "dalje" });
  return stanje;
}

test("izbor važi samo u prvoj i poslednjoj fazi", () => {
  const prva = potez(praznoStanje(), { tip: "izbor", kljuc: "A" });
  assert.equal(prva.podvuceno, "A");
  const poredjenje = potez(potez(prva, { tip: "dalje" }), { tip: "izbor", kljuc: "B" });
  assert.equal(poredjenje.podvuceno, "A");
  const poslednja = potez(doFaze(4), { tip: "izbor", kljuc: "B" });
  assert.equal(poslednja.podvuceno, "B");
  assert.equal(poslednja.faza, 4);
});

test("faze otkrivaju ćutanje, pretpostavku, razlog i rezervu", () => {
  const izbor = prikaz(praznoStanje(), pitalica, false);
  assert.equal(izbor.faza, "Izbor");
  assert.equal(izbor.tisina, false);
  assert.equal(izbor.pretpostavka.vidljiva, false);
  assert.equal(izbor.opcije[1].whyVidljiv, false);
  assert.equal(izbor.mozeRezerva, false);
  const tisina = prikaz(doFaze(1), pitalica, false);
  assert.equal(tisina.tisina, true);
  assert.equal(tisina.opcije[0].mozeIzbor, false);
  const pretpostavka = prikaz(potez(doFaze(2), { tip: "pretpostavka", tekst: "čuli smo režim" }), pitalica, false);
  assert.equal(pretpostavka.pretpostavka.vidljiva, true);
  assert.equal(pretpostavka.pretpostavka.tekst, "čuli smo režim");
  const analiza = prikaz(potez(doFaze(3), { tip: "izbor", kljuc: "B" }), pitalica, false);
  assert.equal(analiza.opcije[1].znak, "check-circle");
  assert.equal(analiza.opcije[1].holds, true);
  assert.equal(analiza.opcije[0].znak, "circle");
  assert.equal(analiza.dalje, true);
  const kraj = prikaz(doFaze(4), pitalica, false);
  assert.equal(kraj.zakljucak.vidljiv, true);
  assert.equal(kraj.dalje, false);
  assert.equal(kraj.mozeRezerva, true);
});

test("rezerva je druga pitalica, a ponovi briše samo izbor i fazu", () => {
  const saTekstom = potez(potez(doFaze(4), { tip: "pretpostavka", tekst: "ostaje" }), { tip: "zakljucak", tekst: "rečenica" });
  const rezerva = prikaz(praznoStanje(), pitalica, true);
  assert.equal(rezerva.naslov, "Rezerva");
  assert.equal(rezerva.problem, "Šta ako je kabel izvučen?");
  assert.equal(rezerva.mozeRezerva, false);
  const ponovo = potez(saTekstom, { tip: "ponovi" });
  assert.equal(ponovo.faza, 0);
  assert.equal(ponovo.podvuceno, "");
  assert.equal(ponovo.pretpostavka, "ostaje");
  assert.equal(ponovo.zakljucak, "rečenica");
});
