import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { cekajHttp, otvoriStranu, pauza, pokreni, slobodanPort, ugasi } from "./chrome.mjs";
import { natpisKorakaTrake, natpisTemeTrake } from "../site/js/traka-casa.js";

const html = fs.readFileSync(new URL("../site/index.html", import.meta.url), "utf8");
const main = fs.readFileSync(new URL("../site/js/main.js", import.meta.url), "utf8");

test("traka časa stoji odmah ispod zaglavlja: tema, korak, tabovi", () => {
  const kraj = html.indexOf("</header>");
  const traka = html.indexOf('<nav id="traka-casa"');
  assert.ok(kraj > 0 && traka > kraj);
  assert.equal(html.slice(kraj + "</header>".length, traka).trim(), "");
  const telo = html.slice(traka, html.indexOf("</nav>", traka));
  const mesta = ['id="izbor-teme"', 'data-ikona="layers"', 'data-ikona="chevron-down"', 'id="traka-prethodni"', 'id="izbor-koraka-dugme"', 'id="traka-sledeci"', 'class="cas-tabovi"'].map((deo) => telo.indexOf(deo));
  assert.ok(mesta.every((m, i) => m > 0 && (i === 0 || m > mesta[i - 1])), JSON.stringify(mesta));
  assert.match(telo, /id="traka-prethodni"[^>]*data-ikona="chevron-left"/);
  assert.match(telo, /id="traka-sledeci"[^>]*data-ikona="chevron-right"/);
  assert.equal(html.slice(html.indexOf('class="cas-glava"')).includes('class="cas-tabovi"'), false);
  assert.match(main, /trakaCasa\.osvezi\(\{ uvod: false, teme: lectures, cas, i, koraci: item\.steps \}\)/);
  assert.match(main, /trakaCasa\.osvezi\(\{ uvod: true, teme: lectures, cas, i: 0, koraci: \[\] \}\)/);
  assert.equal(natpisTemeTrake({ n: 3, title: "JavaScript" }), "Tema 3 – JavaScript");
  assert.equal(natpisTemeTrake(null), "Uvod");
  assert.equal(natpisKorakaTrake(2, 12, "Primitivna vrednost"), "Korak 3 od 12 – Primitivna vrednost");
});

function stanjeTrake() {
  const tekst = (sel) => document.querySelector(sel)?.textContent.trim() || "";
  const vidljiv = (sel) => {
    const el = document.querySelector(sel);
    return Boolean(el) && getComputedStyle(el).display !== "none" && el.getBoundingClientRect().width > 0;
  };
  const tab = document.querySelector('.cas-tabovi [aria-selected="true"]');
  return {
    hash: location.pathname,
    tema: tekst("#izbor-teme-natpis"),
    korak: tekst("#izbor-koraka-natpis"),
    tab: tab?.id || "",
    prethodniOnemogucen: document.querySelector("#traka-prethodni").disabled,
    sledeciOnemogucen: document.querySelector("#traka-sledeci").disabled,
    izborKoraka: vidljiv("#izbor-koraka"),
    tabovi: vidljiv(".cas-tabovi"),
    tabUTraci: document.querySelector(".cas-tabovi").parentElement.id,
  };
}

test("traka časa u browseru: izbor teme, Sledeći, krajevi i uvod", { timeout: 60000 }, async (t) => {
  const portSajta = await slobodanPort();
  const portChrome = await slobodanPort();
  const server = pokreni(process.execPath, ["server/server.js"], { PORT: String(portSajta) });
  let strana;
  t.after(() => {
    strana?.zatvori();
    ugasi(server);
  });
  await cekajHttp(`http://127.0.0.1:${portSajta}/`);
  strana = await otvoriStranu(portChrome);
  await strana.posalji("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  const citaj = () => strana.vrednost(`(${stanjeTrake.toString()})()`);

  await strana.idi(`http://127.0.0.1:${portSajta}/#cas-5`);
  await pauza(400);
  await strana.vrednost(`document.querySelector("#traka-sledeci").click()`);
  await strana.vrednost(`document.querySelector("#traka-sledeci").click()`);
  await pauza(80);
  await strana.vrednost(`location.hash = "cas-3"`);
  await pauza(200);
  let sada = await citaj();
  assert.match(sada.hash, /^\/tema\/3\//);
  assert.match(sada.tema, /^Tema 3 – /);
  assert.equal(sada.tabUTraci, "traka-casa");

  await strana.vrednost(`document.querySelector("#izbor-teme").click()`);
  await pauza(60);
  const lista = await strana.vrednost(`[...document.querySelectorAll("#izbor-teme-lista button")].map((b) => ({ tekst: b.textContent, tekuca: b.getAttribute("aria-current") }))`);
  assert.equal(lista[0].tekst, "Uvod");
  assert.equal(lista.find((stavka) => stavka.tekuca === "page").tekst.startsWith("Tema 3 – "), true);
  await strana.vrednost(`[...document.querySelectorAll("#izbor-teme-lista button")].find((b) => b.textContent.startsWith("Tema 5 – ")).click()`);
  await pauza(200);
  sada = await citaj();
  assert.match(sada.hash, /^\/tema\/5\//);
  assert.match(sada.tema, /^Tema 5 – /);
  assert.match(sada.korak, /^Korak 3 od \d+ – /);
  assert.equal(await strana.vrednost(`document.querySelector("#izbor-teme-lista").hidden`), true);

  await strana.vrednost(`document.querySelector("#tab-diskusija").click()`);
  const pre = await citaj();
  await strana.vrednost(`document.querySelector("#traka-sledeci").click()`);
  await pauza(80);
  sada = await citaj();
  assert.equal(sada.tab, "tab-diskusija");
  assert.match(sada.korak, new RegExp(`^Korak 4 od ${pre.korak.match(/od (\d+)/)[1]} – `));

  await strana.vrednost(`document.querySelector("#izbor-koraka-dugme").click()`);
  await pauza(40);
  await strana.vrednost(`document.querySelector("#izbor-koraka-lista button").click()`);
  await pauza(80);
  sada = await citaj();
  assert.match(sada.korak, /^Korak 1 od /);
  assert.equal(sada.tab, "tab-diskusija");
  assert.equal(sada.prethodniOnemogucen, true);
  assert.equal(sada.sledeciOnemogucen, false);

  await strana.vrednost(`document.querySelector("#izbor-teme").click()`);
  await pauza(40);
  await strana.vrednost(`document.querySelector("#izbor-teme-lista button").click()`);
  await pauza(200);
  sada = await citaj();
  assert.equal(sada.hash, "/uvod");
  assert.equal(sada.tema, "Uvod");
  assert.equal(sada.izborKoraka, false);
  assert.equal(sada.tabovi, false);

  await strana.vrednost(`document.querySelector("#izbor-teme").focus()`);
  await strana.posalji("Input.dispatchKeyEvent", { type: "keyDown", key: "ArrowDown", code: "ArrowDown", windowsVirtualKeyCode: 40 });
  await pauza(40);
  const fokus = await strana.vrednost(`document.activeElement.textContent`);
  assert.equal(fokus, "Uvod");
  await strana.posalji("Input.dispatchKeyEvent", { type: "keyDown", key: "ArrowDown", code: "ArrowDown", windowsVirtualKeyCode: 40 });
  await strana.posalji("Input.dispatchKeyEvent", { type: "keyDown", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13, text: "\r" });
  await strana.posalji("Input.dispatchKeyEvent", { type: "keyUp", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13 });
  await pauza(200);
  assert.match(await strana.vrednost(`location.pathname`), /^\/tema\/1\//);
});
