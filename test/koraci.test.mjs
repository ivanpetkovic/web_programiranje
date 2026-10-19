import assert from "node:assert/strict";
import test from "node:test";
import { dokument, lectures, mapirajKorak, preduslovCasa } from "../site/js/lectures.js";

test("original je polje koraka, inače delić", () => {
  const bez = mapirajKorak({ delic: "samo delić", tekst: "", kljucnaIdeja: "", isecak: "" });
  assert.equal(bez.original, "samo delić");
  const sa = mapirajKorak({ delic: "delić", original: "ceo fajl", tekst: "", kljucnaIdeja: "", isecak: "" });
  assert.equal(sa.original, "ceo fajl");
});

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

test("preduslov časa 1 je prazan server, a časa 2 je ishod prvog", () => {
  assert.equal(preduslovCasa(1), "Browser učitava client/. server/ još nema fajlove.");
  assert.equal(preduslovCasa(2), lectures[0].outcome);
});

test("nedelja 1 sklapa stranicu, a kasnije nedelje nemaju original", () => {
  const redosled = [
    "Podela", "Stranica", "Glava", "Telo", "Naslov", "Broj", "Dugme", "Veza",
    "Razmak", "Okvir", "Osvežavanje", "Alati", "Dva zahteva", "Soba prekidača", "Semantika",
  ];
  const sirovi = dokument.nedelje[0].steps;
  assert.deepEqual(sirovi.map((korak) => korak.naslov), redosled);
  assert.equal(sirovi[0].original, "client/\nserver/\n");
  const broj = sirovi.find((korak) => korak.naslov === "Broj");
  assert.match(broj.original, /<!DOCTYPE html>/);
  assert.match(broj.original, /<p class="digit">24<\/p>/);
  assert.equal(sirovi.reduce((zbir, korak) => zbir + korak.minuta, 0), 90);
  for (const nedelja of dokument.nedelje.slice(1)) {
    for (const korak of nedelja.steps) {
      assert.equal("original" in korak, false);
      assert.equal(mapirajKorak(korak).original, korak.delic);
    }
  }
});

test("rezerve 1–9 imaju pitanje, čas 10 nema glasanje", () => {
  const trag = [
    /CSS/,
    /Strogo poređenje/,
    /Funkcija čeka klik/,
    /404/,
    /Drugi klik/,
    /HTTP 400/,
    /Browser ih ne dobija/,
    /Keš ikonice/,
    /server ćuti/,
  ];
  lectures.slice(0, 9).forEach((cas, i) => {
    assert.ok(cas.rezerva);
    assert.ok(cas.rezerva.options.length >= 2);
    assert.equal(cas.rezerva.options.filter((opcija) => opcija.ok).length, 1);
    const tekstRezerve = [cas.rezerva.problem, ...cas.rezerva.options.map((opcija) => opcija.text)].join("\n");
    assert.match(tekstRezerve, trag[i]);
  });
  const poslednji = lectures[9];
  assert.equal(poslednji.rezerva, null);
  assert.match(poslednji.izlaz, /gde se proverava pravo/i);
  assert.match(poslednji.izlaz, /gde stoji stanje/);
  assert.match(poslednji.izlaz, /ne dokazuje/);
  assert.match(poslednji.overview, /Tip i predlog asistenta/);
});

test("osvrt imenuje teme i nema alat", () => {
  const trag = [
    ["Internet naspram Weba", "semantički HTML", "skica"],
    ["Dinamički tipovi", "mesto TypeScript provere", "dve verzije iste funkcije"],
    ["Responsive prikaz", "pristupačna forma", "komponenta kao razlog biblioteke"],
    ["HTTP/2", "HTTP/3", "GraphQL", "middleware"],
    ["Spoljni API", "prekid jednog zahteva", "microtask"],
    ["REST", "optimistički prikaz", "fizičkog uređaja"],
    ["Relacioni", "dokumentni", "virtuelna mašina", "kontejner"],
    ["SSE", "WebSocket", "React hooks", "offline"],
    ["Prijava preko treće strane", "XSS", "Bez login forme"],
    ["Kubernetes", "serverless", "mesto nastanka HTML-a", "Blockchain"],
  ];
  lectures.forEach((cas, i) => {
    for (const deo of trag[i]) assert.ok(cas.overview.includes(deo), `${cas.n}: ${deo}`);
    assert.equal(cas.overview.includes("<button"), false);
  });
});

test("čas 10 ne tvrdi da je upis prošao", () => {
  const cas = lectures[9];
  const tacno = cas.options.find((opcija) => opcija.ok);
  assert.match(tacno.text, /Ne znamo ishod/);
  assert.doesNotMatch(cas.outcome, /upis jeste prošao/);
  assert.equal(cas.steps.some((korak) => korak.objasnjenje.includes("upis jeste prošao")), false);
});
