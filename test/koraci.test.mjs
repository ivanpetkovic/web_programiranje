import assert from "node:assert/strict";
import test from "node:test";
import { lectures } from "../site/js/lectures.js";

function tekst(korak) {
  return [korak.naslov, korak.primer, korak.kod, korak.pitalica, korak.objasnjenje, korak.delic, korak.putanja].join("\n");
}

test("deset časova ima naslov i 10 do 20 koraka", () => {
  assert.equal(lectures.length, 10);
  const naslovi = [
    "Šta browser prikazuje",
    "JavaScript opisuje stanje",
    "Događaji povezuju korisnika",
    "Od naivnog prenosa do HTTP-a, pa Node",
    "Čekanje i neuspeh",
    "Komande i ponavljanje",
    "Trajno stanje i Docker",
    "Koliko je prikaz svež",
    "Ko sme da upravlja",
    "Ceo sistem",
  ];
  lectures.forEach((cas, i) => {
    assert.equal(cas.n, i + 1);
    assert.equal(cas.title, naslovi[i]);
    assert.ok(cas.steps.length >= 10 && cas.steps.length <= 20, `čas ${cas.n}: ${cas.steps.length}`);
    for (const korak of cas.steps) {
      assert.ok(korak.primer);
      assert.ok(korak.pitalica);
      assert.ok(korak.opcije.length >= 2);
      assert.equal(korak.opcije.filter((opcija) => opcija.ok).length, 1);
      assert.ok(korak.objasnjenje);
      assert.ok(korak.putanja.includes("/"));
      assert.ok(korak.delic);
    }
  });
});

test("čas 1 nema Node i ima client/index.html", () => {
  const cas = lectures[0];
  assert.equal(cas.steps.some((korak) => tekst(korak).includes("node server/server.js")), false);
  assert.equal(cas.steps.some((korak) => korak.putanja === "client/index.html"), true);
  assert.match(cas.options.find((opcija) => opcija.ok).why, /Osvežavanje vraća dokument/);
});

test("čas 4 otvara adresu pre fetch-a i nema Err", () => {
  const cas = lectures[3];
  const saNode = cas.steps.findIndex((korak) => tekst(korak).includes("node server/server.js"));
  const saAdresom = cas.steps.findIndex((korak) => tekst(korak).includes("127.0.0.1"));
  const saFetch = cas.steps.findIndex((korak) => /\bfetch\b/.test(tekst(korak)));
  assert.ok(saNode > 0);
  assert.ok(saAdresom > saNode);
  assert.equal(saFetch, -1);
  assert.equal(cas.steps.some((korak) => /\bErr\b/.test(korak.delic)), false);
});

test("čas 10 ne tvrdi da je upis prošao", () => {
  const cas = lectures[9];
  const tacno = cas.options.find((opcija) => opcija.ok);
  assert.match(tacno.text, /Ne znamo ishod/);
  assert.doesNotMatch(cas.outcome, /upis jeste prošao/);
  assert.equal(cas.steps.some((korak) => korak.objasnjenje.includes("upis jeste prošao")), false);
});
