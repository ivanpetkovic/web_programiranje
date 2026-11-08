import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
import test from "node:test";
import { cekajHttp, otvoriStranu, pauza, pokreni, slobodanPort, snimci, ugasi } from "./chrome.mjs";

function stanjeDodatnog() {
  const pitanje = "Da li JavaScript može da postoji bez HTML-a?";
  const odgovorTekst = "JavaScript je samostalan programski jezik";
  const diskusija = document.querySelector("#sekcija-diskusija");
  const naslovi = [...diskusija.querySelectorAll("h3")].map((naslov) => naslov.textContent.trim());
  const dugme = document.getElementById("pitanje-dodatno-3-0-k01q1");
  return {
    tab: document.querySelector(".cas-tabovi [aria-selected='true']")?.id || "",
    naslovi,
    imaNatpis: naslovi.includes("Dodatno pitanje"),
    imaPitanje: naslovi.includes(pitanje),
    odgovor: diskusija.innerText.includes(odgovorTekst),
    otvoreno: dugme?.getAttribute("aria-expanded") || "",
    natpis: dugme?.getAttribute("aria-label") || "",
  };
}

test("dodatno pitanje je obično pitanje sa sakrivenim odgovorom", { timeout: 30000 }, async (t) => {
  const portSajta = await slobodanPort();
  const portChrome = await slobodanPort();
  const server = pokreni(process.execPath, ["server/server.js"], { PORT: String(portSajta) });
  let strana;
  t.after(() => {
    strana?.zatvori();
    ugasi(server);
  });
  await cekajHttp(`http://127.0.0.1:${portSajta}/`);
  strana = await otvoriStranu(portChrome, { paleta: "ugalj" });
  await strana.posalji("Emulation.setDeviceMetricsOverride", {
    width: 1280,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await strana.idi(`http://127.0.0.1:${portSajta}/#cas-3`);

  const citaj = () => strana.vrednost(`(${stanjeDodatnog.toString()})()`);
  async function sačekaj(uslov, opis) {
    const kraj = Date.now() + 8000;
    let poslednje;
    while (Date.now() < kraj) {
      poslednje = await citaj();
      if (uslov(poslednje)) return poslednje;
      await pauza(40);
    }
    throw new Error(`${opis}: ${JSON.stringify(poslednje)}`);
  }
  async function snimi(ime) {
    await strana.vrednost(`document.getElementById("pitanje-dodatno-3-0-k01q1")?.closest(".pitanje-blok")?.scrollIntoView({ block: "center" })`);
    await pauza(120);
    const slika = await strana.posalji("Page.captureScreenshot", { format: "png" });
    writeFileSync(`${snimci}/${ime}.png`, Buffer.from(slika.data, "base64"));
  }

  await sačekaj((s) => s.tab === "tab-diskusija", "diskusija");
  let pre = await citaj();
  assert.equal(pre.imaPitanje, false);
  assert.equal(pre.odgovor, false);

  await strana.vrednost(`document.getElementById("pitanje-okidac-3-0-k01q1").click()`);
  const zatvoren = await sačekaj((s) => s.imaPitanje && s.otvoreno === "false", "pitanje bez odgovora");
  assert.equal(zatvoren.imaNatpis, false);
  assert.equal(zatvoren.odgovor, false);
  assert.equal(zatvoren.natpis, "Prikaži odgovor");
  await snimi("dodatno-pitanje-sakriveno");

  await strana.vrednost(`document.getElementById("pitanje-dodatno-3-0-k01q1").click()`);
  const otvoren = await sačekaj((s) => s.otvoreno === "true" && s.odgovor, "otvoren odgovor");
  assert.equal(otvoren.imaNatpis, false);
  assert.equal(otvoren.imaPitanje, true);
  assert.equal(otvoren.natpis, "Sakrij odgovor");
  await snimi("dodatno-pitanje-otvoreno");
});
