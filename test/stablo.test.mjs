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

test("podela drži prazan index.html, ne poslednji fajl sa diska", () => {
  const stablo = stabloDo(koraci, indeks("Podela"));
  assert.deepEqual(fajloviStrane(stablo, "client"), ["index.html"]);
  assert.equal(fajloviStrane(stablo, "server").length, 0);
  assert.equal(stablo.verzije["client/index.html"], "");
  assert.equal(stablo.verzije["client/index.html"].includes("<script"), false);
  assert.notEqual(stablo.verzije["client/index.html"].trim(), diskHtml.trim());
});

test("selektor je verzija tog koraka, ne stil sa diska", () => {
  const stablo = stabloDo(koraci, indeks("Selektor"));
  assert.deepEqual(fajloviStrane(stablo, "client"), ["index.html", "css/soba.css"]);
  assert.equal(stablo.verzije["client/css/soba.css"], ".digit {\n  letter-spacing: 0.08em;\n}\n");
  assert.equal(stablo.verzije["client/css/soba.css"].includes("Digital-7"), false);
  assert.equal(fajloviStrane(stablo, "client").includes("js/korak.js"), false);
});

test("semantika je ceo dokument nedelje 1, bez skripti", () => {
  const korak = koraci[indeks("Semantika")];
  const html = stabloDo(koraci, indeks("Semantika")).verzije["client/index.html"];
  assert.equal(html, korak.original);
  assert.equal(html.includes("<script"), false);
  assert.match(html, /24/);
});

test("objekat vezuje postojeći korak.js i ne prikazuje krajnji fajl", () => {
  const stablo = stabloDo(koraci, indeks("Objekat"));
  const html = stablo.verzije["client/index.html"];
  const js = stablo.verzije["client/js/korak.js"];
  assert.ok(fajloviStrane(stablo, "client").includes("js/korak.js"));
  assert.equal(fajloviStrane(stablo, "client").includes("js/niz.js"), false);
  assert.match(js, /const soba = \{ temperatura: 24, zeljeno: false \}/);
  assert.equal(js.includes("function korak"), false);
  assert.notEqual(js.trim(), diskKorak.trim());
  assert.match(html, /<script src="js\/korak\.js"><\/script>/);
  assert.match(html, /cifra\.textContent = String\(soba\.temperatura\)/);
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
  assert.match(htmlKasno, /korak\(soba\)/);
  assert.equal(htmlRano.includes("korak(soba)"), false);
});

test("init vezuje klase čim postoje u stablu", () => {
  const pre = stabloDo(koraci, indeks("crtaj"));
  const linija = stabloDo(koraci, indeks("Linija"));
  const prekidac = stabloDo(koraci, indeks("Prekidač"));
  assert.match(pre.verzije["client/js/displej.js"], /class Displej/);
  assert.equal(pre.verzije["client/index.html"].includes("<canvas"), false);
  assert.match(linija.verzije["client/index.html"], /<canvas width="320" height="120"><\/canvas>/);
  assert.match(linija.verzije["client/index.html"], /nacrtajLiniju/);
  const html = prekidac.verzije["client/index.html"];
  assert.match(html, /<script src="js\/displej\.js"><\/script>/);
  assert.match(html, /<script src="js\/prekidac\.js"><\/script>/);
  assert.match(html, /new Displej\(cifra\)/);
  assert.match(html, /new Prekidac\(dugme\)/);
  assert.match(html, /prekidac\.crtaj/);
  assert.match(html, /displej\.crtaj\(soba\.temperatura\)/);
  assert.match(prekidac.verzije["client/js/prekidac.js"], /class Prekidac/);
  assert.ok(html.indexOf("js/korak.js") < html.indexOf("js/niz.js"));
  assert.ok(html.indexOf("js/niz.js") < html.indexOf("js/prekidac.js"));
  assert.ok(html.indexOf("js/prekidac.js") < html.indexOf("js/displej.js"));
});

test("kraj nedelje 3 ima klijentske fajlove kursa, svaki u verziji do tog koraka", () => {
  const stablo = stabloDo(koraci, indeks("Soba mašina"));
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
