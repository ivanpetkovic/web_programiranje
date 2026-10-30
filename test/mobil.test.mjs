import assert from "node:assert/strict";
import fs from "node:fs";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { cekajHttp, otvoriStranu, pauza, pokreni, slobodanPort, snimci, ugasi } from "./chrome.mjs";

const css = fs.readFileSync(new URL("../site/css/site.css", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../site/index.html", import.meta.url), "utf8");
const main = fs.readFileSync(new URL("../site/js/main.js", import.meta.url), "utf8");

const TEME = ["ugalj", "mornar", "pesak", "terakota"];

test("mobil: pad teme/koraka pre tabova, footer Tema+Pretraga+Podešavanja", () => {
  assert.match(html, /id="mobil-footer"/);
  assert.match(html, /id="mobil-ft-tema"/);
  assert.match(html, /id="mobil-ft-pretraga"/);
  assert.match(html, /id="mobil-ft-podesavanja"/);
  assert.equal(html.includes('id="mobil-ft-profil"'), false);
  const navRed = html.indexOf('id="mobil-nav-red"');
  const navTraka = html.indexOf('id="mobil-nav-traka"');
  const tabovi = html.indexOf('class="cas-tabovi"');
  const birac = html.indexOf('id="birac-mesto"');
  assert.ok(navRed > 0 && navTraka > navRed && navTraka < tabovi && tabovi < birac);
  assert.match(html, /id="mobil-ned-pad"/);
  assert.match(html, /id="mobil-ned-naslov"/);
  assert.match(html, /data-ikona="calendar-days"/);
  assert.match(html, /id="mobil-nav-prekidac"/);
  assert.match(html, /id="mobil-ned-sheet"/);
  assert.match(html, /id="mobil-kor-sredina"/);
  assert.match(html, /class="mobil-korak-lizac"/);
  assert.match(css, /mobil-izbor-lista/);
  assert.match(css, /mobil-glava-skupljena/);
  assert.match(css, /#birac-mesto :where\(\.birac\) \{ display: none;/);
});

test("mobil: ikona liste selektovana samo dok je red teme/koraka vidljiv", () => {
  assert.match(css, /\.mobil-nav-prekidac\[aria-pressed="true"\][\s\S]*background:\s*var\(--amber-dim\)/);
  assert.equal(css.includes("mobil-glava-skupljena:not(.mobil-nav-prisilno) .mobil-nav-prekidac"), false);
  assert.match(main, /setAttribute\("aria-pressed", String\(redVidljiv\)\)/);
});

function stilPrekidacaGradiva() {
  const dugme = document.querySelector("#mobil-nav-prekidac");
  const pomoc = document.querySelector("#pomoc");
  const stil = dugme ? getComputedStyle(dugme) : null;
  const pomocStil = pomoc ? getComputedStyle(pomoc) : null;
  const red = document.querySelector("#mobil-nav-red");
  const redStil = red ? getComputedStyle(red) : null;
  return {
    pritisnuto: dugme?.getAttribute("aria-pressed") === "true",
    pozadina: stil?.backgroundColor || "",
    pomocPozadina: pomocStil?.backgroundColor || "",
    redOpacity: Number(redStil?.opacity || 1),
    skupljeno: document.body.classList.contains("mobil-glava-skupljena"),
  };
}

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
    nedNaslov: document.querySelector("#mobil-ned-naslov")?.textContent || "",
    nedBroj: document.querySelector("#mobil-ned-broj")?.textContent || "",
    korGlava: document.querySelector("#mobil-kor-glava")?.textContent || "",
    stavkeTeme: document.querySelectorAll("#mobil-ned-lista .mobil-izbor-naslov").length,
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

test("mobil: meni tema sa naslovima, koraci, swipe", { timeout: 60000 }, async (t) => {
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
  assert.equal(pocetno.footerStavke, 3);
  assert.equal(pocetno.tabDisplay, "flex");
  assert.ok(pocetno.navTrakaVidljiva);
  assert.equal(pocetno.nedBroj, "2.");
  assert.ok(pocetno.nedNaslov.length > 3);
  assert.match(pocetno.korGlava, /^\d+ \/ \d+$/);

  const traka = await strana.posalji("Page.captureScreenshot", { format: "png" });
  writeFileSync(path.join(snimci, "mobil-izbor-traka.png"), Buffer.from(traka.data, "base64"));

  await strana.vrednost(`document.querySelector("#mobil-ned-pad").click()`);
  await pauza(120);
  const meni = await strana.vrednost(`(() => {
    const otvoren = document.body.classList.contains("mobil-ned-sheet-otvoren");
    const naslovi = [...document.querySelectorAll("#mobil-ned-lista .mobil-izbor-naslov")].map((el) => el.textContent.trim()).filter(Boolean);
    const brojevi = [...document.querySelectorAll("#mobil-ned-lista .mobil-izbor-krug")].map((el) => el.textContent.trim());
    return { otvoren, naslovi, brojevi };
  })()`);
  assert.ok(meni.otvoren);
  assert.ok(meni.naslovi.length >= 5);
  assert.ok(meni.brojevi.includes("2"));
  assert.ok(meni.naslovi.some((t) => t.includes("HTML")));
  assert.equal(meni.naslovi.some((t) => t.startsWith("Tema")), false);

  const meniSlika = await strana.posalji("Page.captureScreenshot", { format: "png" });
  writeFileSync(path.join(snimci, "mobil-tema-meni.png"), Buffer.from(meniSlika.data, "base64"));

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

test("mobil: ikona gradiva selektovana kad je red vidljiv", { timeout: 60000 }, async (t) => {
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
  await strana.vrednost(`window.scrollTo(0, 0)`);
  await pauza(120);

  const vrh = await strana.vrednost(`(${stilPrekidacaGradiva.toString()})()`);
  assert.equal(vrh.pritisnuto, true);
  assert.ok(vrh.redOpacity > 0.5);
  assert.notEqual(vrh.pozadina, vrh.pomocPozadina);

  await strana.vrednost(`window.scrollTo(0, 320)`);
  await pauza(160);
  const skrol = await strana.vrednost(`(${stilPrekidacaGradiva.toString()})()`);
  assert.equal(skrol.skupljeno, true);
  assert.equal(skrol.pritisnuto, false);
  assert.ok(skrol.redOpacity < 0.5);
  assert.equal(skrol.pozadina, skrol.pomocPozadina);

  await strana.vrednost(`document.querySelector("#mobil-nav-prekidac").click()`);
  await pauza(160);
  const otvoren = await strana.vrednost(`(${stilPrekidacaGradiva.toString()})()`);
  assert.equal(otvoren.pritisnuto, true);
  assert.ok(otvoren.redOpacity > 0.5);
  assert.notEqual(otvoren.pozadina, otvoren.pomocPozadina);
});

function povuciNadole(selektor, dy) {
  const el = document.querySelector(selektor);
  if (!el) return { greska: `nema ${selektor}` };
  const okvir = el.getBoundingClientRect();
  const x = Math.round(okvir.left + Math.min(Math.max(okvir.width / 2, 8), 140));
  const y0 = Math.round(okvir.top + Math.min(Math.max(okvir.height / 2, 8), 28));
  const dodir = (y) => new Touch({ identifier: 7, target: el, clientX: x, clientY: y });
  const salji = (tip, y) => {
    const kraj = tip === "touchend";
    el.dispatchEvent(new TouchEvent(tip, {
      bubbles: true,
      cancelable: true,
      touches: kraj ? [] : [dodir(y)],
      changedTouches: [dodir(y)],
    }));
  };
  salji("touchstart", y0);
  salji("touchmove", y0 + dy / 2);
  salji("touchmove", y0 + dy);
  salji("touchend", y0 + dy);
  const lista = document.querySelector("#mobil-kor-lista");
  return {
    ned: document.body.classList.contains("mobil-ned-sheet-otvoren"),
    kor: document.body.classList.contains("mobil-kor-sheet-otvoren"),
    naslovTeme: document.querySelector("#mobil-ned-naslov")?.textContent || "",
    korGlava: document.querySelector("#mobil-kor-glava")?.textContent || "",
    listaScroll: lista ? Math.round(lista.scrollTop) : -1,
    listaPrekoracenje: lista ? Math.round(lista.scrollHeight - lista.clientHeight) : -1,
  };
}

test("mobil: povlačenje nadole zatvara izbor teme i koraka", { timeout: 60000 }, async (t) => {
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
  await strana.idi(`http://127.0.0.1:${portSajta}/#cas-7`);
  await pauza(400);

  const povuci = (selektor, dy) => strana.vrednost(`(${povuciNadole.toString()})(${JSON.stringify(selektor)}, ${dy})`);

  await strana.vrednost(`document.querySelector("#mobil-ned-pad").click()`);
  await pauza(80);
  assert.equal(await strana.vrednost(`document.body.classList.contains("mobil-ned-sheet-otvoren")`), true);
  const temaSlika = await strana.posalji("Page.captureScreenshot", { format: "png" });
  writeFileSync(path.join(snimci, "mobil-tema-pre-povlacenja.png"), Buffer.from(temaSlika.data, "base64"));

  const zatvorenaTema = await povuci("#mobil-ned-sheet-naslov", 140);
  assert.equal(zatvorenaTema.ned, false, JSON.stringify(zatvorenaTema));
  assert.equal(zatvorenaTema.kor, false);

  await strana.vrednost(`document.querySelector("#mobil-ft-tema").click()`);
  await pauza(80);
  const temaNaListi = await povuci("#mobil-ned-lista .mobil-izbor-stavka", 150);
  assert.equal(temaNaListi.ned, false, JSON.stringify(temaNaListi));
  assert.equal(temaNaListi.naslovTeme, zatvorenaTema.naslovTeme);

  await strana.vrednost(`document.querySelector("#mobil-kor-sredina").click()`);
  await pauza(80);
  assert.equal(await strana.vrednost(`document.body.classList.contains("mobil-kor-sheet-otvoren")`), true);
  const korakSlika = await strana.posalji("Page.captureScreenshot", { format: "png" });
  writeFileSync(path.join(snimci, "mobil-korak-pre-povlacenja.png"), Buffer.from(korakSlika.data, "base64"));

  const kratko = await povuci("#mobil-kor-sheet-naslov", 28);
  assert.equal(kratko.kor, true, JSON.stringify(kratko));
  assert.equal(kratko.korGlava, "1 / 13");

  const odskrolovano = await strana.vrednost(`(() => {
    const lista = document.querySelector("#mobil-kor-lista");
    lista.scrollTop = lista.scrollHeight;
    return { scroll: Math.round(lista.scrollTop), prekoracenje: Math.round(lista.scrollHeight - lista.clientHeight) };
  })()`);
  assert.ok(odskrolovano.prekoracenje > 40, JSON.stringify(odskrolovano));
  assert.ok(odskrolovano.scroll > 40, JSON.stringify(odskrolovano));

  const naListi = await povuci("#mobil-kor-lista .mobil-izbor-stavka", 160);
  assert.equal(naListi.kor, true, JSON.stringify(naListi));
  assert.equal(naListi.korGlava, "1 / 13");

  const saZaglavlja = await povuci("#mobil-kor-sheet-naslov", 140);
  assert.equal(saZaglavlja.kor, false, JSON.stringify(saZaglavlja));
  assert.equal(saZaglavlja.korGlava, "1 / 13");

  await strana.vrednost(`document.querySelector("#mobil-kor-sredina").click()`);
  await pauza(80);
  await strana.vrednost(`document.querySelector("#mobil-kor-lista").scrollTop = 0`);
  const saVrha = await povuci("#mobil-kor-lista .mobil-izbor-stavka", 150);
  assert.equal(saVrha.kor, false, JSON.stringify(saVrha));
  assert.equal(saVrha.korGlava, "1 / 13");

  const zatvoreno = await strana.posalji("Page.captureScreenshot", { format: "png" });
  writeFileSync(path.join(snimci, "mobil-korak-posle-povlacenja.png"), Buffer.from(zatvoreno.data, "base64"));

  await strana.vrednost(`document.querySelector("#mobil-kor-sredina").click()`);
  await pauza(60);
  await strana.vrednost(`document.querySelector("#mobil-kor-zatvori").click()`);
  await pauza(40);
  assert.equal(await strana.vrednost(`document.body.classList.contains("mobil-kor-sheet-otvoren")`), false);

  await strana.vrednost(`document.querySelector("#mobil-kor-sredina").click()`);
  await pauza(60);
  await strana.vrednost(`document.querySelectorAll("#mobil-kor-lista .mobil-izbor-stavka")[2].click()`);
  await pauza(80);
  assert.equal(await strana.vrednost(`document.querySelector("#mobil-kor-glava").textContent`), "3 / 13");
  assert.equal(await strana.vrednost(`document.body.classList.contains("mobil-kor-sheet-otvoren")`), false);
});
