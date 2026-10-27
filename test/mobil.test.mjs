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

test("mobilna školjka: footer, sheet gradiva, naslov nedelje i desktop", () => {
  assert.match(html, /id="mobil-footer"/);
  assert.match(html, /id="mobil-ft-gradivo"/);
  assert.match(html, /id="mobil-ft-pretraga"/);
  assert.match(html, /id="mobil-nedelja-naslov"/);
  assert.match(html, /id="mobil-nedelja-traka"/);
  assert.equal(html.includes('id="mobil-meni"'), false);
  assert.match(main, /function pomeriNedeljuPrstom/);
  assert.match(main, /mobil-profil-otvoren/);
  assert.match(css, /\.mobil-footer\s*\{[\s\S]*position:\s*fixed/);
  assert.match(css, /@media\s*\(\s*max-width:\s*860px\s*\)[\s\S]*translateY\(105%\)/);
  assert.match(css, /\.mobil-nedelja-ivica/);
  assert.match(css, /\.okvir\s*\{[^}]*grid-template-columns:\s*17rem minmax\(0,\s*1fr\)\s+16rem/);
});

function raspored() {
  const okvir = document.querySelector(".okvir");
  const stil = getComputedStyle(okvir);
  const footer = document.querySelector("#mobil-footer");
  const navOmot = document.querySelector(".nav-omot");
  return {
    kolone: stil.gridTemplateColumns,
    flex: stil.display === "flex",
    footerVidljiv: footer && !footer.hidden && getComputedStyle(footer).display !== "none",
    navTransform: navOmot ? getComputedStyle(navOmot).transform : "",
    mobilNav: document.body.classList.contains("mobil-nav-otvoren"),
    naslovNedelje: document.querySelector("#mobil-nedelja-naslov")?.textContent || "",
    trakaNaslov: document.querySelector("#mobil-traka-naslov")?.textContent || "",
    deo: document.querySelector("#sekcija-koraci")?.hidden ? "ne-koraci" : "koraci",
    meniVidljiv: false,
  };
}

test("desktop 1440: tri kolone i bez mobilnog footera", { timeout: 30000 }, async (t) => {
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
  assert.equal(desktop.footerVidljiv, false, "footer je sakriven na desktopu");
});

test("mobil 390×844: footer, gradivo sheet, swipe nedelje i pretraga", { timeout: 60000 }, async (t) => {
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
    await pauza(250);

    const pocetno = await strana.vrednost(`(${raspored.toString()})()`);
    assert.ok(pocetno.footerVidljiv, "footer je vidljiv");
    assert.ok(pocetno.trakaNaslov.length > 2, "traka ima naslov nedelje");
    assert.equal(pocetno.trakaNaslov, pocetno.naslovNedelje, "isti naslov u traci i panelu");

    await strana.vrednost(`document.querySelector("#mobil-ft-gradivo").click()`);
    await pauza(120);
    const gradivo = await strana.vrednost(`(${raspored.toString()})()`);
    assert.ok(gradivo.mobilNav, "gradivo otvara sheet");
    assert.ok(gradivo.naslovNedelje.length > 2, "sheet prikazuje naslov nedelje");

    await strana.vrednost(`(() => {
      const el = document.querySelector("#mobil-gradivo-zaglavlje");
      const dodir = (x, y) => new Touch({ identifier: 1, target: el, clientX: x, clientY: y });
      el.dispatchEvent(new TouchEvent("touchstart", { bubbles: true, touches: [dodir(280, 200)], changedTouches: [dodir(280, 200)] }));
      el.dispatchEvent(new TouchEvent("touchend", { bubbles: true, touches: [], changedTouches: [dodir(280, 290)] }));
    })()`);
    await pauza(80);
    const povuceno = await strana.vrednost(`document.body.classList.contains("mobil-nav-otvoren")`);
    assert.equal(povuceno, false, "povlačenje nadole zatvara gradivo");

    await strana.vrednost(`document.querySelector("#mobil-ft-gradivo").click()`);
    const preNedelja = await strana.vrednost(`location.hash`);
    await strana.vrednost(`(() => {
      const el = document.querySelector("#mobil-nedelja-traka");
      const dodir = (x, y) => new Touch({ identifier: 1, target: el, clientX: x, clientY: y });
      el.dispatchEvent(new TouchEvent("touchstart", { bubbles: true, touches: [dodir(280, 180)], changedTouches: [dodir(280, 180)] }));
      el.dispatchEvent(new TouchEvent("touchend", { bubbles: true, touches: [], changedTouches: [dodir(80, 180)] }));
    })()`);
    await pauza(200);
    const posleNedelja = await strana.vrednost(`location.hash`);
    assert.notEqual(posleNedelja, preNedelja, "swipe menja nedelju");

    await strana.vrednost(`document.querySelector("#mobil-zavesa").click()`);
    await pauza(60);
    await strana.vrednost(`document.querySelector("#mobil-ft-pretraga").click()`);
    await pauza(100);
    const pretraga = await strana.vrednost(`(() => ({
      otvorena: document.body.classList.contains("mobil-pretraga-otvoren"),
      forma: Boolean(document.querySelector("#mobil-pretraga-mesto #search-form")),
    }))()`);
    assert.ok(pretraga.otvorena, "pretraga sheet je otvoren");
    assert.ok(pretraga.forma, "forma pretrage je u sheetu");

    await strana.vrednost(`document.querySelector("#mobil-zavesa").click()`);
    await strana.vrednost(`document.querySelector("#mobil-ft-profil").click()`);
    await pauza(80);
    const profil = await strana.vrednost(`document.body.classList.contains("mobil-profil-otvoren")`);
    assert.equal(profil, true, "profil sheet");

    for (const tema of TEME) {
      await strana.vrednost(`(() => {
        document.documentElement.dataset.tema = ${JSON.stringify(tema)};
        localStorage.setItem("tema", ${JSON.stringify(tema)});
      })()`);
      await pauza(50);
      const slika = await strana.posalji("Page.captureScreenshot", { format: "png" });
      writeFileSync(path.join(snimci, `mobil-footer-${tema}.png`), Buffer.from(slika.data, "base64"));
    }
    const demo = await strana.posalji("Page.captureScreenshot", { format: "png" });
    writeFileSync(path.join(snimci, "mobil-footer-gradivo.png"), Buffer.from(demo.data, "base64"));
  } catch (greska) {
    greska.message += `\nserver: ${server.izlaz?.().slice(-500) || ""}`;
    throw greska;
  }
});
