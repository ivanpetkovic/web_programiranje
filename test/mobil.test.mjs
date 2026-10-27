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

test("mobilna školjka: meni, zavesa, donji tabovi i bez regresije desktop rasporeda", () => {
  assert.match(html, /id="mobil-meni"/);
  assert.match(html, /id="mobil-zavesa"/);
  assert.match(html, /name="viewport" content="width=device-width/);
  assert.match(main, /function zatvoriMobilNav/);
  assert.match(main, /mobil-nav-otvoren/);
  assert.match(main, /mobilZavesa/);
  assert.match(css, /@media\s*\(\s*max-width:\s*860px\s*\)[\s\S]*\.cas-tabovi\s*\{[\s\S]*position:\s*fixed/);
  assert.match(css, /@media\s*\(\s*max-width:\s*860px\s*\)[\s\S]*safe-area-inset-bottom/);
  assert.match(css, /@media\s*\(\s*min-width:\s*861px\s*\)[\s\S]*\.mobil-meni/);
  assert.match(css, /\.okvir\s*\{[^}]*grid-template-columns:\s*17rem minmax\(0,\s*1fr\)\s+16rem/);
  assert.match(css, /body\.nav-skriven #nav\s*\{\s*display:\s*none/);
  assert.match(css, /@media\s*\(\s*max-width:\s*860px\s*\)[\s\S]*body\.mobil #nav\s*\{\s*display:\s*block/);
});

function raspored() {
  const okvir = document.querySelector(".okvir");
  const stil = getComputedStyle(okvir);
  const tabovi = document.querySelector(".cas-tabovi");
  const tabStil = tabovi ? getComputedStyle(tabovi) : null;
  const meni = document.querySelector("#mobil-meni");
  const zavesa = document.querySelector("#mobil-zavesa");
  const navOmot = document.querySelector(".nav-omot");
  return {
    kolone: stil.gridTemplateColumns,
    flex: stil.display === "flex",
    tabFiksiran: tabStil?.position === "fixed",
    meniVidljiv: meni && !meni.hidden && getComputedStyle(meni).display !== "none",
    zavesaSakrivena: zavesa?.hidden,
    navTransform: navOmot ? getComputedStyle(navOmot).transform : "",
    mobilNav: document.body.classList.contains("mobil-nav-otvoren"),
    deo: document.querySelector('.cas-tabovi button[aria-selected="true"]')?.textContent?.trim() || "",
    hash: location.hash,
  };
}

test("desktop 1440: tri kolone i bez mobilnog menija", { timeout: 30000 }, async (t) => {
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
  await strana.posalji("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await strana.idi(`http://127.0.0.1:${portSajta}/#cas-1`);
  await pauza(150);
  const desktop = await strana.vrednost(`(${raspored.toString()})()`);
  const kolone = desktop.kolone.split(/\s+/).filter(Boolean);
  assert.equal(kolone.length, 3, `desktop ima tri kolone: ${desktop.kolone}`);
  assert.equal(desktop.tabFiksiran, false, "tabovi nisu fiksirani na desktopu");
  assert.equal(desktop.meniVidljiv, false, "mobil-meni je sakriven na desktopu");
});

test("mobil 390×844: drawer, tabovi i sve četiri teme", { timeout: 60000 }, async (t) => {
  mkdirSync(snimci, { recursive: true });
  const portSajta = await slobodanPort();
  const portChrome = await slobodanPort();
  const server = pokreni(process.execPath, ["server/server.js"], { PORT: String(portSajta) });
  let strana;
  t.after(() => {
    strana?.zatvori();
    ugasi(server);
  });
  try {
    await cekajHttp(`http://127.0.0.1:${portSajta}/`);
    strana = await otvoriStranu(portChrome);
    await strana.posalji("Emulation.setDeviceMetricsOverride", {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await strana.idi(`http://127.0.0.1:${portSajta}/#cas-1`);
    await pauza(200);

    const pocetno = await strana.vrednost(`(${raspored.toString()})()`);
    assert.ok(pocetno.flex, "okvir je fleks kolona na mobilnom");
    assert.ok(pocetno.tabFiksiran, "tabovi su fiksirani pri dnu");
    assert.ok(pocetno.meniVidljiv, "mobil-meni je vidljiv");
    assert.ok(pocetno.zavesaSakrivena, "zavesa je zatvorena na početku");
    assert.notEqual(pocetno.navTransform, "none", "nav je van ekrana dok je zatvoren");

    await strana.vrednost(`document.querySelector("#mobil-meni").click()`);
    await pauza(120);
    const otvoren = await strana.vrednost(`(${raspored.toString()})()`);
    assert.ok(otvoren.mobilNav, "drawer je otvoren");
    assert.equal(otvoren.zavesaSakrivena, false, "zavesa je vidljiva");

    await strana.vrednost(`document.querySelector("#mobil-zavesa").click()`);
    await pauza(80);
    const zatvoren = await strana.vrednost(`(${raspored.toString()})()`);
    assert.equal(zatvoren.mobilNav, false, "drawer se zatvara preko zavese");

    await strana.vrednost(`document.querySelector("#mobil-meni").click()`);
    await strana.vrednost(`[...document.querySelectorAll("#nav .korak-red")][0].click()`);
    await pauza(150);
    const posleKoraka = await strana.vrednost(`(${raspored.toString()})()`);
    assert.equal(posleKoraka.mobilNav, false, "izbor koraka zatvara drawer");

    await strana.vrednost(`document.querySelector("#tab-editor").click()`);
    await pauza(80);
    const editor = await strana.vrednost(`(${raspored.toString()})()`);
    assert.equal(editor.deo, "Editor", "donji tab menja deo");

    for (const tema of TEME) {
      await strana.vrednost(`(() => {
        document.documentElement.dataset.tema = ${JSON.stringify(tema)};
        localStorage.setItem("tema", ${JSON.stringify(tema)});
        window.dispatchEvent(new Event("storage"));
      })()`);
      await pauza(60);
      const slika = await strana.posalji("Page.captureScreenshot", { format: "png" });
      writeFileSync(path.join(snimci, `mobil-${tema}.png`), Buffer.from(slika.data, "base64"));
      const kontrast = await strana.vrednost(`(() => {
        const stil = getComputedStyle(document.documentElement);
        const bg = stil.getPropertyValue("--bg").trim();
        const ink = stil.getPropertyValue("--ink").trim();
        return { tema: document.documentElement.dataset.tema, bg, ink };
      })()`);
      assert.equal(kontrast.tema, tema);
      assert.match(kontrast.bg, /^#/);
      assert.match(kontrast.ink, /^#/);
    }

  } catch (greska) {
    greska.message += `\nserver: ${server.izlaz?.().slice(-500) || ""}`;
    throw greska;
  }
});
