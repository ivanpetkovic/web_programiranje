import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { lectures } from "../site/js/lectures.js";
import { fajloviStrane, prethodnaVerzija, stabloDo } from "../site/js/stablo.js";

const koraci = lectures.flatMap((cas) => cas.steps);
const diskHtml = fs.readFileSync(new URL("../client/index.html", import.meta.url), "utf8");
const diskKorak = fs.readFileSync(new URL("../client/js/korak.js", import.meta.url), "utf8");

function indeks(naslov) {
  const nadjen = koraci.findIndex((korak) => korak.naslov === naslov);
  assert.ok(nadjen >= 0, naslov);
  return nadjen;
}

test("stranica drži početni index.html, ne poslednji fajl sa diska", () => {
  const stablo = stabloDo(koraci, indeks("Stranica"));
  assert.deepEqual(fajloviStrane(stablo, "client"), ["index.html"]);
  assert.equal(fajloviStrane(stablo, "server").length, 0);
  assert.match(stablo.verzije["client/index.html"], /<!DOCTYPE html>/);
  assert.equal(stablo.verzije["client/index.html"].includes("<h1"), false);
  assert.equal(stablo.verzije["client/index.html"].includes("<script"), false);
  assert.notEqual(stablo.verzije["client/index.html"].trim(), diskHtml.trim());
});

test("selektor je verzija tog koraka, ne stil sa diska", () => {
  const stablo = stabloDo(koraci, indeks("Selektor"));
  assert.deepEqual(fajloviStrane(stablo, "client"), ["index.html", "css/soba.css"]);
  assert.equal(stablo.verzije["client/css/soba.css"], "letter-spacing: 0.08em;\n");
  assert.equal(stablo.verzije["client/css/soba.css"].includes("Digital-7"), false);
  assert.equal(fajloviStrane(stablo, "client").includes("js/korak.js"), false);
});

test("semantika je skup delića dokumenta, bez skripti", () => {
  const html = stabloDo(koraci, indeks("Semantika")).verzije["client/index.html"];
  assert.match(html, /naslov je h1/);
  assert.match(html, /class="digit"/);
  assert.equal(html.includes("<script"), false);
  assert.match(html, /24/);
});

test("objekat dodaje korak.js i ne ubacuje skriptu u dokument bez tela", () => {
  const stablo = stabloDo(koraci, indeks("Objekat"));
  const html = stablo.verzije["client/index.html"];
  const js = stablo.verzije["client/js/korak.js"];
  assert.ok(fajloviStrane(stablo, "client").includes("js/korak.js"));
  assert.equal(fajloviStrane(stablo, "client").includes("js/niz.js"), false);
  assert.match(js, /const soba = \{ temperatura: 24, zeljeno: false \}/);
  assert.equal(js.includes("function korak"), false);
  assert.notEqual(js.trim(), diskKorak.trim());
  assert.equal(html.includes("<script"), false);
  assert.equal(html.includes("cifra.textContent"), false);
  assert.equal(html.includes("js/niz.js"), false);
  assert.equal(html.includes("new Displej"), false);
  assert.notEqual(html.trim(), diskHtml.trim());
});

test("svaki sledeći korak istog fajla ima svoju verziju", () => {
  const rano = stabloDo(koraci, indeks("Objekat")).verzije["client/js/korak.js"];
  const kasno = stabloDo(koraci, indeks("Delta")).verzije["client/js/korak.js"];
  const kraj = stabloDo(koraci, koraci.length - 1).verzije["client/js/korak.js"];
  assert.match(kasno, /function korak/);
  assert.match(kasno, /^let delta = 1;\n/);
  assert.match(kasno, /const soba = \{ temperatura: 24, zeljeno: false \}/);
  assert.notEqual(rano, kasno);
  assert.notEqual(kasno, kraj);
  const htmlRano = stabloDo(koraci, indeks("Objekat")).verzije["client/index.html"];
  const htmlKasno = stabloDo(koraci, indeks("Delta")).verzije["client/index.html"];
  assert.equal(htmlRano, htmlKasno);
  assert.equal(htmlKasno.includes("<script"), false);
  assert.equal(htmlKasno.includes("korak(soba)"), false);
});

test("prekidač drži klase u svojim fajlovima", () => {
  const pre = stabloDo(koraci, indeks("crtaj"));
  const prekidac = stabloDo(koraci, indeks("Prekidač"));
  assert.match(pre.verzije["client/js/displej.js"], /class Displej/);
  assert.equal(pre.verzije["client/index.html"].includes("<canvas"), false);
  assert.equal(pre.verzije["client/index.html"].includes("<script"), false);
  const html = prekidac.verzije["client/index.html"];
  assert.match(prekidac.verzije["client/js/prekidac.js"], /class Prekidac/);
  assert.equal(html.includes("<script"), false);
  assert.equal(html.includes("new Displej"), false);
  assert.equal(html.includes("new Prekidac"), false);
});

test("kraj nedelje događaja ima klijentske fajlove kursa, svaki u verziji do tog koraka", () => {
  const stablo = stabloDo(koraci, indeks("Closure"));
  const fajlovi = fajloviStrane(stablo, "client");
  for (const put of ["index.html", "css/soba.css", "js/korak.js", "js/niz.js", "js/displej.js", "js/prekidac.js"]) {
    assert.ok(fajlovi.includes(put), put);
    assert.notEqual((stablo.verzije[`client/${put}`] || "").trim(), "");
  }
  assert.equal(fajloviStrane(stablo, "server").length, 0);
  assert.match(stablo.verzije["client/index.html"], /preventDefault/);
  assert.notEqual(stablo.verzije["client/js/displej.js"].trim(), fs.readFileSync(new URL("../client/js/displej.js", import.meta.url), "utf8").trim());
});

test("server stablo kreće od prvog serverskog koraka", () => {
  assert.equal(fajloviStrane(stabloDo(koraci, indeks("Semantika")), "server").length, 0);
  const prvi = koraci.findIndex((korak) => korak.putanja && korak.putanja.startsWith("server/"));
  const stablo = stabloDo(koraci, prvi);
  assert.deepEqual(fajloviStrane(stablo, "server"), ["server.js"]);
  const kraj = stabloDo(koraci, koraci.length - 1);
  assert.ok(fajloviStrane(kraj, "server").includes("soba.js"));
  assert.notEqual(stablo.verzije["server/server.js"], kraj.verzije["server/server.js"]);
  assert.ok(kraj.verzije["server/server.js"].length > stablo.verzije["server/server.js"].length);
});

test("razlika ide na prethodnu verziju fajla, ne na kraj kursa", () => {
  const i = indeks("Broj");
  const pre = prethodnaVerzija(koraci, i, "client/index.html");
  const sad = stabloDo(koraci, i).verzije["client/index.html"];
  const kraj = stabloDo(koraci, koraci.length - 1).verzije["client/index.html"];
  assert.match(pre, /<h1>Soba prekidača<\/h1>/);
  assert.equal(pre.includes('class="digit"'), false);
  assert.match(sad, /class="digit"/);
  assert.notEqual(sad, kraj);
  assert.equal(prethodnaVerzija(koraci, 0, "client/index.html"), null);
});
