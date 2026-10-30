import assert from "node:assert/strict";
import test from "node:test";
import { cekajHttp, otvoriStranu, pauza, pokreni, slobodanPort, ugasi } from "./chrome.mjs";

function stanjeTooltipa() {
  const tooltip = document.querySelector("#tooltip");
  return { otvoren: !tooltip.hidden, tekst: tooltip.textContent };
}

test("oblačić pojma se sklapa sekundu posle odlaska ili klika sa strane", { timeout: 30000 }, async (t) => {
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
    await strana.posalji("Emulation.setDeviceMetricsOverride", { width: 1400, height: 900, deviceScaleFactor: 1, mobile: false });
    await strana.idi(`http://127.0.0.1:${portSajta}/#cas-1`);
    const stanje = () => strana.vrednost(`(${stanjeTooltipa.toString()})()`);
    async function sačekajElement(selektor) {
      const kraj = Date.now() + 5000;
      while (Date.now() < kraj) {
        const ima = await strana.vrednost(`Boolean(document.querySelector(${JSON.stringify(selektor)}))`);
        if (ima) return;
        await pauza(40);
      }
      throw new Error(`nema ${selektor}`);
    }
    async function sačekaj(uslov, opis) {
      const kraj = Date.now() + 5000;
      let poslednje;
      while (Date.now() < kraj) {
        poslednje = await stanje();
        if (uslov(poslednje)) return poslednje;
        await pauza(40);
      }
      throw new Error(`${opis}: ${JSON.stringify(poslednje)}`);
    }
    async function tacka(selektor, skrol) {
      const mesto = await strana.vrednost(`(() => {
        const el = document.querySelector(${JSON.stringify(selektor)});
        if (!el) return null;
        if (${Boolean(skrol)}) el.scrollIntoView({ block: "center", inline: "nearest" });
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height };
      })()`);
      assert.ok(mesto && mesto.w > 0 && mesto.h > 0, `nema ${selektor}: ${JSON.stringify(mesto)}`);
      return mesto;
    }
    async function na(tacka) {
      await strana.posalji("Input.dispatchMouseEvent", { type: "mouseMoved", x: tacka.x, y: tacka.y, button: "none" });
    }
    async function klik(tacka) {
      await strana.posalji("Input.dispatchMouseEvent", {
        type: "mousePressed",
        x: tacka.x,
        y: tacka.y,
        button: "left",
        clickCount: 1,
      });
      await strana.posalji("Input.dispatchMouseEvent", {
        type: "mouseReleased",
        x: tacka.x,
        y: tacka.y,
        button: "left",
        clickCount: 1,
      });
    }

    await sačekajElement("#nav .tema-koraci .korak-red");
    await strana.vrednost(`document.querySelectorAll("#nav .tema-koraci .korak-red")[1].click()`);
    await sačekajElement(".pojam-crta");
    const pojam = await tacka(".pojam-crta", true);
    const skloniste = await tacka("#nav .kurs-zaglavlje");
    await na(pojam);
    const otvoren = await sačekaj((s) => s.otvoren && s.tekst.includes("Rezervisana veza"), "otvaranje");
    assert.match(otvoren.tekst, /veza od kraja do kraja/);

    await na(skloniste);
    const odmah = await stanje();
    assert.equal(odmah.otvoren, true, "odlazak miša ne gasi oblačić odmah");
    await pauza(500);
    assert.equal((await stanje()).otvoren, true, "oblačić još traje pola sekunde posle odlaska");
    await pauza(800);
    assert.equal((await stanje()).otvoren, false, "oblačić se gasi oko sekunde posle odlaska miša");

    await na(await tacka(".pojam-crta"));
    await sačekaj((s) => s.otvoren, "ponovno otvaranje");
    const oblacic = await tacka("#tooltip");
    await na(oblacic);
    await pauza(1300);
    assert.equal((await stanje()).otvoren, true, "oblačić ostaje dok je miš na njemu");
    await na(skloniste);
    await pauza(500);
    assert.equal((await stanje()).otvoren, true, "odlazak sa oblačića čeka sekundu");
    await pauza(800);
    assert.equal((await stanje()).otvoren, false, "oblačić se gasi sekundu posle odlaska sa panela");

    await strana.vrednost(`document.querySelector(".pojam-crta").focus()`);
    await sačekaj((s) => s.otvoren, "otvaranje sa fokusa");
    await klik(skloniste);
    const posleKlika = await stanje();
    assert.equal(posleKlika.otvoren, true, "klik sa strane ne gasi oblačić odmah");
    await pauza(500);
    assert.equal((await stanje()).otvoren, true, "oblačić još traje pola sekunde posle klika sa strane");
    await pauza(800);
    assert.equal((await stanje()).otvoren, false, "oblačić se gasi oko sekunde posle klika sa strane");

    await na(await tacka(".pojam-crta"));
    await sačekaj((s) => s.otvoren, "otvaranje pred drugi klik");
    await klik(await tacka(".pojam-crta"));
    assert.equal((await stanje()).otvoren, false, "drugi klik na pojam i dalje sklapa oblačić odmah");

    await na(skloniste);
    await na(await tacka(".pojam-crta"));
    await sačekaj((s) => s.otvoren, "otvaranje pred fokus");
    await strana.vrednost(`document.querySelector(".pojam-crta").focus()`);
    await na(skloniste);
    await pauza(500);
    assert.equal((await stanje()).otvoren, true, "fokusiran pojam još drži oblačić pola sekunde");
    await pauza(800);
    const posleFokusa = await stanje();
    const iDaljeFokus = await strana.vrednost(`document.activeElement?.classList.contains("pojam-crta") === true`);
    assert.equal(iDaljeFokus, true, "odlazak miša ne skida fokus sa pojma");
    assert.equal(posleFokusa.otvoren, false, "oblačić se gasi sekundu posle odlaska i kad pojam ostane u fokusu");
  } catch (greska) {
    greska.message += `\nserver: ${server.izlaz().slice(-500)}`;
    throw greska;
  }
});
