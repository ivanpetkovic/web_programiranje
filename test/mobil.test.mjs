import assert from "node:assert/strict";
import fs from "node:fs";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { cekajHttp, otvoriStranu, pauza, pokreni, slobodanPort, snimci, ugasi } from "./chrome.mjs";

const css = fs.readFileSync(new URL("../site/css/site.css", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../site/index.html", import.meta.url), "utf8");

const TEME = ["ugalj", "mornar", "pesak", "terakota"];

test("mobil: pad nedelje/koraka pre tabova, footer Pretraga+Podešavanja", () => {
  assert.match(html, /id="mobil-footer"/);
  assert.match(html, /id="mobil-ft-pretraga"/);
  assert.match(html, /id="mobil-ft-podesavanja"/);
  assert.equal(html.includes('id="mobil-ft-profil"'), false);
  const navTraka = html.indexOf('id="mobil-nav-traka"');
  const tabovi = html.indexOf('class="cas-tabovi"');
  const birac = html.indexOf('id="birac-mesto"');
  assert.ok(navTraka > 0 && navTraka < tabovi && tabovi < birac);
  assert.match(html, /id="mobil-ned-pad"/);
  assert.match(html, /id="mobil-ned-napred"/);
  assert.match(css, /mobil-pad-meni-siroko/);
  assert.match(css, /@media\s*\(\s*max-width:\s*860px\s*\)[\s\S]*\.mobil-nav-traka\s*\{[\s\S]*grid-template-columns:/);
  assert.match(css, /#birac-mesto \.birac \{ display: none;/);
});

function raspored() {
  const tabovi = document.querySelector(".cas-tabovi");
  const tabStil = tabovi ? getComputedStyle(tabovi) : null;
  const footer = document.querySelector("#mobil-footer");
  const navTraka = document.querySelector("#mobil-nav-traka");
  return {
    kolone: getComputedStyle(document.querySelector(".okvir")).gridTemplateColumns,
    footerVidljiv: footer && !footer.hidden && getComputedStyle(footer).display !== "none",
    footerStavke: document.querySelectorAll("#mobil-footer .mobil-ft").length,
    tabDisplay: tabStil?.display || "",
    navTrakaVidljiva: navTraka && !navTraka.hidden && getComputedStyle(navTraka).display !== "none",
    nedBroj: document.querySelector("#mobil-ned-broj")?.textContent || "",
    korGlava: document.querySelector("#mobil-kor-glava")?.textContent || "",
    stavkeNedelje: document.querySelectorAll("#mobil-ned-meni .mobil-pad-stavka-naslov").length,
  };
}

test("desktop 1440: tri kolone, bez footera", { timeout: 30000 }, async (t) => {
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
  await strana.idi(`http://127.0.0.1:${portSajta}/#cas-1`);
  await pauza(150);
  const desktop = await strana.vrednost(`(${raspored.toString()})()`);
  assert.equal(desktop.kolone.split(/\s+/).filter(Boolean).length, 3);
  assert.equal(desktop.footerVidljiv, false);
});

test("mobil: meni nedelja sa naslovima, koraci, swipe", { timeout: 60000 }, async (t) => {
  mkdirSync(snimci, { recursive: true });
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
  await strana.posalji("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await strana.idi(`http://127.0.0.1:${portSajta}/#cas-2`);
  await pauza(400);
  const pocetno = await strana.vrednost(`(${raspored.toString()})()`);
  assert.equal(pocetno.footerStavke, 2);
  assert.equal(pocetno.tabDisplay, "flex");
  assert.ok(pocetno.navTrakaVidljiva);
  assert.equal(pocetno.nedBroj, "02");
  assert.match(pocetno.korGlava, /^\d+ \/ \d+$/);

  const traka = await strana.posalji("Page.captureScreenshot", { format: "png" });
  writeFileSync(path.join(snimci, "mobil-izbor-traka.png"), Buffer.from(traka.data, "base64"));

  await strana.vrednost(`document.querySelector("#mobil-ned-pad").click()`);
  await pauza(80);
  const meni = await strana.vrednost(`(() => {
    const otvoren = !document.querySelector("#mobil-ned-meni").hidden;
    const naslovi = [...document.querySelectorAll("#mobil-ned-meni .mobil-pad-stavka-naslov")].map((el) => el.textContent.trim()).filter(Boolean);
    const brojevi = [...document.querySelectorAll("#mobil-ned-meni .mobil-pad-stavka-broj")].map((el) => el.textContent.trim());
    return { otvoren, naslovi, brojevi };
  })()`);
  assert.ok(meni.otvoren);
  assert.ok(meni.naslovi.length >= 5);
  assert.ok(meni.brojevi.includes("2"));
  assert.ok(meni.naslovi.some((t) => t.includes("HTML")));
  assert.equal(meni.naslovi.some((t) => t.startsWith("Nedelja")), false);

  const meniSlika = await strana.posalji("Page.captureScreenshot", { format: "png" });
  writeFileSync(path.join(snimci, "mobil-nedelja-meni.png"), Buffer.from(meniSlika.data, "base64"));

  await strana.vrednost(`document.querySelector("#mobil-kor-napred").click()`);
  await pauza(100);
  assert.match(await strana.vrednost(`document.querySelector("#mobil-kor-glava").textContent`), /2 \/ /);

  await strana.vrednost(`document.querySelector("#mobil-ft-pretraga").click()`);
  await pauza(60);

  const pre = await strana.vrednost(`location.hash`);
  await strana.vrednost(`(() => {
    const el = document.querySelector("#mobil-nav-traka");
    const dodir = (x, y) => new Touch({ identifier: 1, target: el, clientX: x, clientY: y });
    el.dispatchEvent(new TouchEvent("touchstart", { bubbles: true, touches: [dodir(280, 120)], changedTouches: [dodir(280, 120)] }));
    el.dispatchEvent(new TouchEvent("touchend", { bubbles: true, touches: [], changedTouches: [dodir(80, 120)] }));
  })()`);
  await pauza(180);
  assert.notEqual(await strana.vrednost(`location.hash`), pre);

  await strana.vrednost(`document.querySelector("#mobil-ft-podesavanja").click()`);
  await pauza(80);
  assert.ok(await strana.vrednost(`document.body.classList.contains("mobil-profil-otvoren")`));
  assert.ok(await strana.vrednost(`!!document.querySelector("#mobil-tema-mesto .tema-spisak-u-listi")`));

  for (const tema of TEME) {
    await strana.vrednost(`(() => { document.documentElement.dataset.tema = ${JSON.stringify(tema)}; })()`);
    await pauza(40);
    const t = await strana.posalji("Page.captureScreenshot", { format: "png" });
    writeFileSync(path.join(snimci, `mobil-izbor-${tema}.png`), Buffer.from(t.data, "base64"));
  }
});
