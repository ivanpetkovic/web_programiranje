import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { cekajHttp, otvoriStranu, pauza, pokreni, slobodanPort, snimci, ugasi } from "./chrome.mjs";

const main = fs.readFileSync(new URL("../site/js/main.js", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../site/css/site.css", import.meta.url), "utf8");

test("strelice stoje na dnu gradiva i diskusije, sa labelama", () => {
  assert.match(main, /function nacrtajSkokKoraka\(item, i\)/);
  assert.match(main, /const natpis = nazad \? "Prethodni" : "Sledeći"/);
  assert.match(main, /aria-label", "Susedni koraci"/);
  assert.match(main, /const skok = nacrtajSkokKoraka\(item, i\);\n  if \(skok\) casEl\.append\(skok\)/);
  assert.match(main, /const skok = nacrtajSkokKoraka\(item, i\);\n  if \(skok\) omot\.append\(skok\)/);
  assert.match(css, /\.skok-koraka-dugme:disabled\s*\{\s*opacity:\s*0\.4/);
  assert.equal(main.includes('sekcija-editor").append'), false);
});

function citajSkok(selektor) {
  const domacin = document.querySelector(selektor);
  const nav = domacin?.querySelector(":scope > .skok-koraka") || null;
  const vidljiv = (el) => {
    let cvor = el;
    while (cvor) {
      if (cvor.hidden || getComputedStyle(cvor).display === "none") return false;
      cvor = cvor.parentElement;
    }
    return Boolean(el) && el.getBoundingClientRect().height > 0;
  };
  const dugmad = nav
    ? [...nav.querySelectorAll("button")].map((dugme) => ({
        smer: dugme.querySelector(".skok-koraka-smer")?.textContent || "",
        naslov: dugme.querySelector(".skok-koraka-naslov")?.textContent || "",
        aria: dugme.getAttribute("aria-label") || "",
        onemogucen: dugme.disabled,
        ikona: Boolean(dugme.querySelector(".ikona")),
        nazad: dugme.classList.contains("skok-koraka-nazad"),
      }))
    : [];
  const iznad = nav?.previousElementSibling;
  return {
    ima: Boolean(nav),
    poslednji: Boolean(nav) && domacin.lastElementChild === nav,
    ispod: Boolean(nav && iznad && nav.getBoundingClientRect().top >= iznad.getBoundingClientRect().bottom - 1),
    dugmad,
    tab: document.querySelector('.cas-tabovi [aria-selected="true"]')?.id || "",
    korak: (document.querySelector("#izbor-koraka-natpis")?.textContent || "").trim(),
    naslovi: [...document.querySelectorAll("#izbor-koraka-lista button")].map((dugme) => dugme.textContent.replace(/^\d+\.\s+/, "")),
    vidljiv: vidljiv(nav),
    editor: Boolean(document.querySelector("#sekcija-editor .skok-koraka")),
  };
}

async function snimi(strana, selektor, ime) {
  await strana.vrednost(`document.querySelector(${JSON.stringify(selektor)}).scrollIntoView({ block: "center", inline: "nearest" })`);
  await pauza(150);
  const slika = await strana.posalji("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(snimci, ime), Buffer.from(slika.data, "base64"));
}

test("strelice u browseru vode na susedni korak i ostaju na istom tabu", { timeout: 60000 }, async (t) => {
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
  await strana.posalji("Emulation.setDeviceMetricsOverride", { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
  await strana.idi(`http://127.0.0.1:${portSajta}/#cas-1`);
  await pauza(500);
  const citaj = (selektor) => strana.vrednost(`(${citajSkok.toString()})(${JSON.stringify(selektor)})`);

  let diskusija = await citaj(".diskusija-korak");
  assert.equal(diskusija.tab, "tab-diskusija");
  assert.equal(diskusija.vidljiv, true);
  assert.equal(diskusija.poslednji, true);
  assert.equal(diskusija.ispod, true);
  assert.equal(diskusija.editor, false);
  assert.match(diskusija.korak, /^Korak 1 od /);
  assert.equal(diskusija.dugmad.length, 2);
  assert.deepEqual(
    diskusija.dugmad.map((dugme) => dugme.smer),
    ["Prethodni", "Sledeći"],
  );
  assert.equal(diskusija.dugmad[0].onemogucen, true);
  assert.equal(diskusija.dugmad[0].naslov, "");
  assert.equal(diskusija.dugmad[0].aria, "Prethodni");
  assert.equal(diskusija.dugmad[0].ikona, true);
  assert.equal(diskusija.dugmad[1].onemogucen, false);
  assert.equal(diskusija.dugmad[1].naslov, diskusija.naslovi[1]);
  assert.equal(diskusija.dugmad[1].aria, `Sledeći: ${diskusija.naslovi[1]}`);
  assert.equal(diskusija.dugmad[1].ikona, true);
  assert.equal((await citaj("#cas")).vidljiv, false);

  await strana.vrednost(`document.querySelector(".diskusija-korak .skok-koraka-dalje").click()`);
  await pauza(80);
  diskusija = await citaj(".diskusija-korak");
  assert.equal(diskusija.tab, "tab-diskusija");
  assert.match(diskusija.korak, /^Korak 2 od /);
  assert.equal(diskusija.dugmad[0].onemogucen, false);
  assert.equal(diskusija.dugmad[0].naslov, diskusija.naslovi[0]);
  assert.equal(diskusija.dugmad[0].aria, `Prethodni: ${diskusija.naslovi[0]}`);
  assert.equal(diskusija.dugmad[1].naslov, diskusija.naslovi[2]);
  assert.equal(diskusija.poslednji, true);
  assert.equal(diskusija.ispod, true);
  await snimi(strana, ".diskusija-korak > .skok-koraka", "skok-diskusija.png");

  await strana.vrednost(`document.querySelector("#tab-koraci").click()`);
  await pauza(40);
  let gradivo = await citaj("#cas");
  assert.equal(gradivo.tab, "tab-koraci");
  assert.equal(gradivo.vidljiv, true);
  assert.equal(gradivo.poslednji, true);
  assert.equal(gradivo.ispod, true);
  assert.match(gradivo.korak, /^Korak 2 od /);
  assert.equal(gradivo.dugmad[0].naslov, gradivo.naslovi[0]);
  assert.equal(gradivo.dugmad[1].naslov, gradivo.naslovi[2]);
  assert.equal(gradivo.dugmad[0].smer, "Prethodni");
  assert.equal(gradivo.dugmad[1].smer, "Sledeći");
  await snimi(strana, "#cas > .skok-koraka", "skok-gradivo.png");

  await strana.vrednost(`document.querySelector("#cas .skok-koraka-nazad").click()`);
  await pauza(80);
  gradivo = await citaj("#cas");
  assert.equal(gradivo.tab, "tab-koraci");
  assert.match(gradivo.korak, /^Korak 1 od /);
  assert.equal(gradivo.dugmad[0].onemogucen, true);

  await strana.vrednost(`document.querySelector("#izbor-koraka-lista li:last-child button").click()`);
  await pauza(80);
  gradivo = await citaj("#cas");
  assert.equal(gradivo.tab, "tab-koraci");
  const [broj, ukupno] = gradivo.korak.match(/Korak (\d+) od (\d+)/).slice(1).map(Number);
  assert.equal(broj, ukupno);
  assert.equal(gradivo.dugmad[1].onemogucen, true);
  assert.equal(gradivo.dugmad[1].aria, "Sledeći");
  assert.equal(gradivo.dugmad[0].naslov, gradivo.naslovi.at(-2));
  assert.equal(gradivo.poslednji, true);

  await strana.posalji("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await pauza(80);
  await strana.vrednost(`document.querySelector("#cas > .skok-koraka").scrollIntoView({ block: "center" })`);
  const kolona = await strana.vrednost(`getComputedStyle(document.querySelector("#cas > .skok-koraka")).flexDirection`);
  assert.equal(kolona, "column");
  await snimi(strana, "#cas > .skok-koraka", "skok-gradivo-mobil.png");

  await strana.vrednost(`document.querySelector("#tab-editor").click()`);
  await pauza(40);
  const editor = await citaj("#cas");
  assert.equal(editor.tab, "tab-editor");
  assert.equal(editor.vidljiv, false);
  assert.equal(editor.editor, false);
  assert.equal(await strana.vrednost(`document.querySelector("#sekcija-editor .skok-koraka") === null`), true);

  await strana.vrednost(`location.hash = "uvod"`);
  await pauza(200);
  assert.equal(await strana.vrednost(`document.querySelector(".skok-koraka") === null`), true);
});
