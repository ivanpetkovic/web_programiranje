import assert from "node:assert/strict";
import fs from "node:fs";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { cekajHttp, otvoriStranu, pauza, pokreni, slobodanPort, snimci, ugasi } from "./chrome.mjs";

const css = fs.readFileSync(new URL("../site/css/site.css", import.meta.url), "utf8");
const main = fs.readFileSync(new URL("../site/js/main.js", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../site/index.html", import.meta.url), "utf8");

const TEME = ["ugalj", "mornar", "pesak", "terakota"];

test("mobil: segment G/D/E iznad sadržaja, footer Profil+Pretraga", () => {
  assert.match(html, /id="mobil-footer"/);
  assert.match(html, /id="mobil-ft-pretraga"/);
  assert.equal(html.includes('id="mobil-ft-gradivo"'), false);
  assert.equal(html.includes('id="mobil-ft-diskusija"'), false);
  const headerKraj = html.indexOf("</header>");
  const traka = html.indexOf('id="mobil-nedelja-traka"');
  const tabovi = html.indexOf('class="cas-tabovi"');
  const birac = html.indexOf('id="birac-mesto"');
  assert.ok(traka > 0 && traka < headerKraj && tabovi > headerKraj && tabovi < birac);
  assert.match(html, /id="mobil-zaglavlje-preklop"/);
  assert.match(css, /@media\s*\(\s*max-width:\s*860px\s*\)[\s\S]*\.cas-tabovi\s*\{[\s\S]*flex:\s*1/);
  assert.match(css, /grid-template-columns:\s*1fr 1fr/);
  assert.match(css, /body\.mobil-zaglavlje-otvoreno[\s\S]*\.mobil-zaglavlje-prosireno/);
});

function raspored() {
  const tabovi = document.querySelector(".cas-tabovi");
  const tabStil = tabovi ? getComputedStyle(tabovi) : null;
  const footer = document.querySelector("#mobil-footer");
  return {
    kolone: getComputedStyle(document.querySelector(".okvir")).gridTemplateColumns,
    footerVidljiv: footer && !footer.hidden && getComputedStyle(footer).display !== "none",
    footerStavke: document.querySelectorAll("#mobil-footer .mobil-ft").length,
    tabDisplay: tabStil?.display || "",
    tabFiksiranDno: tabStil?.position === "fixed",
    mobilNav: document.body.classList.contains("mobil-nav-otvoren"),
    naslovNedelje: document.querySelector("#mobil-nedelja-naslov")?.textContent || "",
    trakaNaslov: document.querySelector("#mobil-traka-naslov")?.textContent || "",
    sazet: document.querySelector("#mobil-sazet-tekst")?.textContent || "",
    zaglavljeOtvoreno: document.body.classList.contains("mobil-zaglavlje-otvoreno"),
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

test("mobil: segment, traka→sheet, swipe, footer alati", { timeout: 60000 }, async (t) => {
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
  await strana.idi(`http://127.0.0.1:${portSajta}/#cas-1`);
  await pauza(250);

  const pocetno = await strana.vrednost(`(${raspored.toString()})()`);
  assert.equal(pocetno.footerStavke, 2);
  assert.equal(pocetno.tabDisplay, "flex");
  assert.equal(pocetno.tabFiksiranDno, false, "tabovi nisu na dnu ekrana");
  assert.ok(pocetno.trakaNaslov.length > 2);
  assert.ok(pocetno.sazet.includes("Nedelja"));
  assert.equal(pocetno.zaglavljeOtvoreno, false);

  await strana.vrednost(`document.querySelector("#mobil-zaglavlje-preklop").click()`);
  await pauza(60);
  assert.ok(await strana.vrednost(`document.body.classList.contains("mobil-zaglavlje-otvoreno")`));

  await strana.vrednost(`document.querySelector("#mobil-nedelja-otvori").click()`);
  await pauza(100);
  assert.ok((await strana.vrednost(`document.body.classList.contains("mobil-nav-otvoren")`)));

  await strana.vrednost(`document.querySelector("#mobil-zavesa").click()`);
  await strana.vrednost(`document.querySelector("#tab-editor").click()`);
  await pauza(80);
  const editor = await strana.vrednost(`document.querySelector("#tab-editor").getAttribute("aria-selected")`);
  assert.equal(editor, "true");

  await strana.vrednost(`document.querySelector("#mobil-zaglavlje-preklop").click()`);
  await pauza(40);
  const pre = await strana.vrednost(`location.hash`);
  await strana.vrednost(`(() => {
    const el = document.querySelector("#mobil-nedelja-traka");
    const dodir = (x, y) => new Touch({ identifier: 1, target: el, clientX: x, clientY: y });
    el.dispatchEvent(new TouchEvent("touchstart", { bubbles: true, touches: [dodir(280, 180)], changedTouches: [dodir(280, 180)] }));
    el.dispatchEvent(new TouchEvent("touchend", { bubbles: true, touches: [], changedTouches: [dodir(80, 180)] }));
  })()`);
  await pauza(180);
  assert.notEqual(await strana.vrednost(`location.hash`), pre);

  await strana.vrednost(`document.querySelector("#mobil-ft-pretraga").click()`);
  await pauza(80);
  assert.ok(await strana.vrednost(`document.body.classList.contains("mobil-pretraga-otvoren")`));

  const slika = await strana.posalji("Page.captureScreenshot", { format: "png" });
  writeFileSync(path.join(snimci, "mobil-segment-footer.png"), Buffer.from(slika.data, "base64"));
  await strana.vrednost(`document.querySelector("#mobil-zaglavlje-preklop").click()`);
  await pauza(60);
  const slikaZag = await strana.posalji("Page.captureScreenshot", { format: "png" });
  writeFileSync(path.join(snimci, "mobil-zaglavlje-prosireno.png"), Buffer.from(slikaZag.data, "base64"));
  for (const tema of TEME) {
    await strana.vrednost(`(() => { document.documentElement.dataset.tema = ${JSON.stringify(tema)}; })()`);
    await pauza(40);
    const t = await strana.posalji("Page.captureScreenshot", { format: "png" });
    writeFileSync(path.join(snimci, `mobil-segment-${tema}.png`), Buffer.from(t.data, "base64"));
  }
});
