import assert from "node:assert/strict";
import test from "node:test";
import { cekajHttp, otvoriStranu, pauza, pokreni, slobodanPort, ugasi } from "./chrome.mjs";

function stanjeTeme(broj) {
  const red = [...document.querySelectorAll("#nav .tema-red")].find((dugme) => dugme.dataset.n === String(broj));
  const koraci = red?.nextElementSibling;
  return {
    hash: location.hash,
    naslov: (document.querySelector("#izbor-teme-natpis")?.textContent || "").trim(),
    otvorena: red?.getAttribute("aria-expanded") === "true",
    koraci: koraci?.classList.contains("tema-koraci") === true,
    aktivna: red?.getAttribute("aria-current") === "page",
  };
}

test("tema otvorena hešom može da se sklopi", { timeout: 30000 }, async (t) => {
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
  await strana.posalji("Emulation.setDeviceMetricsOverride", { width: 1400, height: 800, deviceScaleFactor: 1, mobile: false });
  await strana.idi(`http://127.0.0.1:${portSajta}/#cas-3`);

  const citaj = (broj) => strana.vrednost(`(${stanjeTeme.toString()})(${broj})`);
  async function sačekaj(broj, uslov) {
    const kraj = Date.now() + 8000;
    let poslednje;
    while (Date.now() < kraj) {
      poslednje = await citaj(broj);
      if (uslov(poslednje)) return poslednje;
      await pauza(40);
    }
    throw new Error(`tema ${broj} nije stigla: ${JSON.stringify(poslednje)}`);
  }

  const otvorena = await sačekaj(3, (s) => s.otvorena && s.koraci && s.hash === "#cas-3");
  assert.equal(otvorena.aktivna, true);

  await strana.vrednost(`document.querySelector("#nav .tema-red[data-n='3']").click()`);
  const sklopljena = await sačekaj(3, (s) => !s.otvorena && !s.koraci);
  assert.equal(sklopljena.hash, "#cas-3");
  assert.equal(sklopljena.aktivna, true, "sklopljena tema ostaje otvoren čas");
  assert.match(sklopljena.naslov, /^Tema 3/);

  await strana.vrednost(`document.querySelector("#nav .tema-red[data-n='3']").click()`);
  const ponovo = await sačekaj(3, (s) => s.otvorena && s.koraci);
  assert.equal(ponovo.hash, "#cas-3");
});
