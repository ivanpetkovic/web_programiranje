import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { cekajHttp, otvoriStranu, pauza, pokreni, slobodanPort, snimci, ugasi } from "./chrome.mjs";

function stanjeKrugova() {
  const krugovi = [...document.querySelectorAll(".birac-krug-domacin")];
  const otvoren = document.querySelector(".birac-krug-naziv.otvoren");
  const stil = otvoren ? getComputedStyle(otvoren) : null;
  const rect = otvoren ? otvoren.getBoundingClientRect() : null;
  return {
    naslovi: krugovi.map((dugme) => dugme.querySelector(".birac-krug-naziv")?.textContent || ""),
    centri: krugovi.map((dugme) => {
      const okvir = dugme.getBoundingClientRect();
      return { x: okvir.left + okvir.width / 2, y: okvir.top + okvir.height / 2, top: okvir.top, bottom: okvir.bottom };
    }),
    otvoren: otvoren
      ? {
          tekst: otvoren.textContent,
          opacity: stil.opacity,
          visibility: stil.visibility,
          left: rect.left,
          right: rect.right,
          top: rect.top,
          bottom: rect.bottom,
        }
      : null,
    korak: document.querySelector(".birac-identitet .korak")?.textContent || "",
    sirina: window.innerWidth,
    visina: window.innerHeight,
  };
}

test("hover na krug pokazuje naziv koraka i ne menja otvoreni korak", { timeout: 60000 }, async (t) => {
  const portSajta = await slobodanPort();
  const portChrome = await slobodanPort();
  const server = pokreni(process.execPath, ["server/server.js"], { PORT: String(portSajta) });
  let strana;
  t.after(() => {
    strana?.zatvori();
    ugasi(server);
  });
  await cekajHttp(`http://127.0.0.1:${portSajta}/`);
  strana = await otvoriStranu(portChrome, { paleta: "pesak" });
  await strana.posalji("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await strana.idi(`http://127.0.0.1:${portSajta}/#tema/5`);
  await pauza(600);
  const procitaj = () => strana.vrednost(`(${stanjeKrugova.toString()})()`);
  const mis = async (x, y) => {
    await strana.posalji("Input.dispatchMouseEvent", { type: "mouseMoved", x, y });
    await pauza(40);
  };
  const snimi = async (ime) => {
    const slika = await strana.posalji("Page.captureScreenshot", { format: "png" });
    fs.mkdirSync(snimci, { recursive: true });
    fs.writeFileSync(path.join(snimci, ime), Buffer.from(slika.data, "base64"));
  };

  await mis(8, 8);
  const mirno = await procitaj();
  assert.equal(mirno.otvoren, null);
  assert.equal(mirno.naslovi.length, 18);
  assert.equal(mirno.korak, "Korak 1 od 18");
  assert.equal(mirno.naslovi[0], "Šta je DOM i zašto postoji?");
  assert.equal(mirno.naslovi[17], "Dijagnostika: kada stanje i ekran nisu usklađeni");

  for (const indeks of [0, 10, 17]) {
    const pre = await procitaj();
    await mis(pre.centri[indeks].x, pre.centri[indeks].y);
    const posle = await procitaj();
    assert.equal(posle.korak, "Korak 1 od 18", `hover ${indeks} ne sme da otvori korak`);
    assert.ok(posle.otvoren, `nema natpisa na krugu ${indeks}`);
    assert.equal(posle.otvoren.tekst, pre.naslovi[indeks]);
    assert.equal(posle.otvoren.opacity, "1");
    assert.equal(posle.otvoren.visibility, "visible");
    assert.ok(posle.otvoren.left >= 7, `levo ${posle.otvoren.left}`);
    assert.ok(posle.otvoren.right <= posle.sirina - 7, `desno ${posle.otvoren.right}`);
    assert.ok(posle.otvoren.bottom <= pre.centri[indeks].top + 1, "natpis stoji iznad kruga");
    if (indeks === 10) await snimi("krug-naziv-sredina.png");
    if (indeks === 17) await snimi("krug-naziv-poslednji.png");
  }

  await mis(8, 400);
  const sklonjen = await procitaj();
  assert.equal(sklonjen.otvoren, null);
  assert.equal(sklonjen.korak, "Korak 1 od 18");

  const preKlika = await procitaj();
  const cilj = preKlika.centri[5];
  await mis(cilj.x, cilj.y);
  await strana.posalji("Input.dispatchMouseEvent", { type: "mousePressed", x: cilj.x, y: cilj.y, button: "left", clickCount: 1 });
  await strana.posalji("Input.dispatchMouseEvent", { type: "mouseReleased", x: cilj.x, y: cilj.y, button: "left", clickCount: 1 });
  await pauza(200);
  const otvoren = await procitaj();
  assert.equal(otvoren.korak, "Korak 6 od 18");
  assert.equal(otvoren.naslovi[5], "Od korisničke akcije do funkcije");
});
