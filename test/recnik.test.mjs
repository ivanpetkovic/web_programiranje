import assert from "node:assert/strict";
import test from "node:test";
import { lectures } from "../site/js/lectures.js";
import { razbij, recnik } from "../site/js/recnik.js";

function pojmovi(tekst) {
  return razbij(tekst).filter((deo) => deo.tip === "pojam");
}

function prozaCasa(cas) {
  const komadi = [cas.title, cas.outcome, cas.problem, cas.pretpostavka, cas.overview, cas.izlaz];
  for (const opt of cas.options || []) komadi.push(opt.text, opt.why);
  if (cas.rezerva) {
    komadi.push(cas.rezerva.problem);
    for (const opt of cas.rezerva.options) komadi.push(opt.text, opt.why);
  }
  for (const term of cas.terms) komadi.push(term.name, term.hint, term.body);
  for (const korak of cas.steps) {
    komadi.push(korak.naslov, korak.primer, korak.pitalica, korak.objasnjenje);
    for (const opt of korak.opcije) komadi.push(opt.text, opt.why);
  }
  return komadi.filter(Boolean).join("\n");
}

test("alati browsera su DevTools, a alat van browsera nije", () => {
  const uAlatima = pojmovi("U alatima browsera „24 °C” postane „10 °C”.");
  assert.equal(uAlatima.length, 1);
  assert.equal(uAlatima[0].vrednost, "alatima browsera");
  assert.equal(uAlatima[0].en, "DevTools");
  assert.match(uAlatima[0].tekst, /prikaz/);

  const alati = pojmovi("Alati menjaju sliku u ovom browseru.");
  assert.equal(alati.length, 1);
  assert.equal(alati[0].en, "DevTools");

  const van = pojmovi("Alat van browsera pročita telo.");
  assert.equal(van.length, 0);
});

test("svaki pojam rečnika bar jednom stoji u prozi časova", () => {
  const sva = lectures.map(prozaCasa).join("\n");
  for (const pojam of recnik) {
    const pogodci = pojmovi(sva).filter((deo) => deo.id === pojam.id);
    assert.ok(pogodci.length > 0, pojam.id);
    assert.ok(pojam.en);
    assert.ok(pojam.tekst.length > 20);
  }
});
