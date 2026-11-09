import assert from "node:assert/strict";
import test from "node:test";
import { cekajHttp, otvoriStranu, pauza, pokreni, slobodanPort, ugasi } from "./chrome.mjs";

function stanjeAdrese() {
  const tab = document.querySelector(".cas-tabovi [aria-selected='true']");
  const blok = document.activeElement?.closest?.(".sekcija-lekcije");
  return {
    hash: location.hash,
    tab: tab?.id || "",
    korak: (document.querySelector("#izbor-koraka-natpis")?.textContent || "").trim(),
    putanja: (document.querySelector("#putanja")?.textContent || "").trim(),
    blok: blok?.dataset.id || "",
    uvod: document.body.classList.contains("uvod-otvoren"),
  };
}

test("adresa prati korak, diskusiju, blok i fajl u editoru", { timeout: 60000 }, async (t) => {
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
  const citaj = () => strana.vrednost(`(${stanjeAdrese.toString()})()`);
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

  await strana.idi(`http://127.0.0.1:${portSajta}/#tema/2`);
  let sada = await sačekaj((s) => s.hash === "#tema/2/k/1/deo/diskusija" && s.tab === "tab-diskusija" && /^Korak 1 od /.test(s.korak), "čas 2");

  await strana.vrednost(`document.querySelector("#traka-sledeci").click()`);
  sada = await sačekaj((s) => s.hash === "#tema/2/k/2/deo/diskusija" && /^Korak 2 od /.test(s.korak), "sledeći korak");

  await strana.vrednost(`history.back()`);
  sada = await sačekaj((s) => s.hash === "#tema/2/k/1/deo/diskusija" && /^Korak 1 od /.test(s.korak), "nazad na prvi korak");

  const blokId = await strana.vrednost(`(() => {
    const blok = document.querySelector("#sekcija-diskusija .sekcija-lekcije");
    if (!blok) return "";
    blok.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    if (!blok.hasAttribute("tabindex")) blok.tabIndex = -1;
    blok.focus();
    return blok.dataset.id;
  })()`);
  assert.ok(blokId, "diskusija ima blok");
  sada = await sačekaj((s) => {
    const blok = s.hash.split("/blok/")[1] || "";
    let dekodiran = blok;
    try { dekodiran = decodeURIComponent(blok); } catch { /* ostaje kako jeste */ }
    return s.hash.startsWith("#tema/2/k/1/deo/diskusija/blok/") && dekodiran === blokId;
  }, "fokus bloka");
  const adresaBloka = sada.hash;

  await strana.vrednost(`location.hash = "uvod"`);
  await sačekaj((s) => s.hash === "#uvod" && s.uvod, "uvod");

  await strana.idi(`http://127.0.0.1:${portSajta}/?ponovo=blok${adresaBloka}`);
  sada = await sačekaj((s) => s.hash === adresaBloka && s.blok === blokId && s.tab === "tab-diskusija", "adresa vraća blok");

  await strana.idi(`http://127.0.0.1:${portSajta}/#tema/2/k/9/deo/editor`);
  sada = await sačekaj((s) => s.hash.startsWith("#tema/2/k/9/deo/editor/fajl/") && s.tab === "tab-editor" && s.putanja.startsWith("client/"), "editor");
  const prviFajl = sada.putanja;
  assert.match(sada.hash, new RegExp(`/fajl/${prviFajl.split("/").map(encodeURIComponent).join("/")}$`));

  const imaDrugi = await strana.vrednost(`(() => {
    const otvoren = document.querySelector("#putanja").textContent.trim();
    const dugme = [...document.querySelectorAll("#tree button")].find((b) => otvoren !== "client/" + b.dataset.put && otvoren !== "server/" + b.dataset.put);
    if (!dugme) return false;
    dugme.click();
    return true;
  })()`);
  assert.equal(imaDrugi, true, "korak 9 ima bar dva fajla");
  sada = await sačekaj((s) => s.tab === "tab-editor" && s.putanja && s.putanja !== prviFajl && s.hash.includes("/deo/editor/fajl/"), "drugi fajl");
  assert.match(sada.hash, new RegExp(`/fajl/${sada.putanja.split("/").map(encodeURIComponent).join("/")}$`));
  const adresaFajla = sada.hash;

  await strana.idi(`http://127.0.0.1:${portSajta}/?ponovo=fajl${adresaFajla}`);
  sada = await sačekaj((s) => s.hash === adresaFajla && s.putanja !== prviFajl && s.tab === "tab-editor" && /^Korak 9 od /.test(s.korak), "adresa vraća fajl");
  assert.equal(sada.putanja.split("/").map(encodeURIComponent).join("/"), sada.hash.split("/fajl/")[1]);

  await strana.idi(`http://127.0.0.1:${portSajta}/#cas-3`);
  await sačekaj((s) => s.hash === "#tema/3/k/1/deo/diskusija" && /^Korak 1 od /.test(s.korak), "stari heš cas-3");
});
