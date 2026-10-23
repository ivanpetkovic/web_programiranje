import assert from "node:assert/strict";
import test from "node:test";
import { cekajHttp, otvoriStranu, pauza, pokreni, slobodanPort, ugasi } from "./chrome.mjs";

function stanjeNava() {
  const nav = document.querySelector("#nav");
  const nedelja = [...nav.querySelectorAll(".nedelja-red")].find((b) => b.textContent.startsWith("Nedelja 10 "));
  const korak = nav.querySelector(".nedelja-red[aria-current='page'] + .nedelja-koraci .korak-red[aria-current='page']");
  const okvir = nav.getBoundingClientRect();
  const red = (korak || nedelja)?.getBoundingClientRect();
  return {
    hash: location.hash,
    skrol: nav.scrollTop,
    odmak: nedelja ? nedelja.getBoundingClientRect().top - okvir.top : null,
    visina: nav.clientHeight,
    sadrzaj: nav.scrollHeight,
    vrh: okvir.top,
    dno: okvir.bottom,
    prozor: innerHeight,
    korak: korak?.textContent || "",
    redVidljiv: Boolean(red && red.top >= okvir.top && red.bottom <= okvir.bottom),
  };
}

test("levi panel drži svoj skrol dok se otvara nedelja 10", { timeout: 30000 }, async (t) => {
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
    await strana.posalji("Emulation.setDeviceMetricsOverride", { width: 1400, height: 700, deviceScaleFactor: 1, mobile: false });
    await strana.posalji("Network.enable");
    await strana.posalji("Network.setBlockedURLs", { urls: ["*/api/fajl"] });
    await strana.idi(`http://127.0.0.1:${portSajta}/#cas-1`);
    const stanje = () => strana.vrednost(`(${stanjeNava.toString()})()`);
    async function sačekaj(uslov) {
      const kraj = Date.now() + 5000;
      let poslednje;
      while (Date.now() < kraj) {
        poslednje = await stanje();
        if (uslov(poslednje)) return poslednje;
        await pauza(40);
      }
      throw new Error(`nav nije stigao: ${JSON.stringify(poslednje)}`);
    }

    await sačekaj((s) => s.sadrzaj > 0);
    await strana.vrednost(`[...document.querySelectorAll("#nav .nedelja-red")].find((b) => b.textContent.startsWith("Nedelja 10 ")).click()`);
    const pre = await strana.vrednost(`(() => {
      const nav = document.querySelector("#nav");
      const nedelja = [...nav.querySelectorAll(".nedelja-red")].find((b) => b.textContent.startsWith("Nedelja 10 "));
      nav.scrollTop += nedelja.getBoundingClientRect().top - nav.getBoundingClientRect().top;
      const odmak = nedelja.getBoundingClientRect().top - nav.getBoundingClientRect().top;
      return { skrol: nav.scrollTop, odmak, prozor: scrollY, visina: nav.clientHeight, sadrzaj: nav.scrollHeight };
    })()`);
    assert.ok(pre.sadrzaj > pre.visina, `nav treba da ima svoj skrol: ${JSON.stringify(pre)}`);
    assert.ok(pre.skrol > 0, `nav se nije pomerio: ${JSON.stringify(pre)}`);
    assert.equal(pre.prozor, 0, "prozor ne treba da se pomera kad se skroluje nav");

    await strana.vrednost(`[...document.querySelectorAll("#nav .nedelja-red")].find((b) => b.textContent.startsWith("Nedelja 10 ")).nextElementSibling.querySelectorAll(".korak-red")[2].click()`);
    const posle = await sačekaj((s) => s.hash === "#cas-10" && s.korak.startsWith("3 "));
    assert.ok(Math.abs(posle.odmak - pre.odmak) <= 1, `nedelja 10 je skočila sa ${pre.odmak} na ${posle.odmak}px od vrha nava`);
    assert.ok(posle.redVidljiv, "izabrani korak nedelje 10 ostaje u vidu");

    await strana.vrednost(`window.scrollTo(0, document.documentElement.scrollHeight)`);
    await pauza(80);
    const dole = await stanje();
    assert.ok(dole.vrh >= -2 && dole.dno <= dole.prozor + 2, `nav ne prati stranu: ${JSON.stringify(dole)}`);
    assert.ok(Math.abs(dole.skrol - posle.skrol) <= 1, "skrol strane ne menja skrol nava");
  } catch (greska) {
    greska.message += `\nserver: ${server.izlaz().slice(-500)}`;
    throw greska;
  }
});
