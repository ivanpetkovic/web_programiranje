import assert from "node:assert/strict";
import { mkdtempSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { cekajHttp, otvoriStranu, pauza, pokreni, slobodanPort, snimci, ugasi } from "./chrome.mjs";

const KLJUC = "web-programiranje:stanje";

// Mere iz maketa.png (1672 × 941), relativno prema gornjem levom uglu panela.
const MAKETA = {
  panel: [1334, 76, 330, 539],
  glave: [[19, 19, 292, 35], [19, 135, 292, 35], [19, 248, 292, 35], [19, 400, 292, 24]],
  plocice: [[21, 66, 67, 40], [94, 66, 67, 40], [166, 66, 67, 40], [239, 66, 67, 40]],
  segment: [19, 184, 292, 40],
  kartice: [[18, 299, 144, 74], [171, 299, 141, 74]],
  bedz: [188, 400, 123, 24],
  dugmad: [[19, 479, 76, 42], [102, 479, 76, 42], [185, 479, 128, 42]],
};

function blizu(stvarno, ocekivano, ime) {
  stvarno.forEach((v, i) => assert.ok(Math.abs(v - ocekivano[i]) <= 4, `${ime}: ${JSON.stringify(stvarno)} prema ${JSON.stringify(ocekivano)}`));
}

function kutijeOpcija() {
  const panel = document.querySelector("#opcije-panel").getBoundingClientRect();
  const kutija = (el) => {
    const b = el.getBoundingClientRect();
    return [Math.round(b.x - panel.x), Math.round(b.y - panel.y), Math.round(b.width), Math.round(b.height)];
  };
  const sve = (sel) => [...document.querySelectorAll(`#opcije-panel ${sel}`)].map(kutija);
  return {
    panel: [panel.x, panel.y, panel.width, panel.height].map(Math.round),
    naslovi: [...document.querySelectorAll("#opcije-panel .opcije-naslov")].map((h) => h.textContent),
    glave: sve(".opcije-glava"),
    plocice: sve(".paleta-plocica"),
    segment: sve(".segment-fonta")[0],
    kartice: sve(".kartica-moda"),
    bedz: sve(".bedz-stanja")[0],
    dugmad: sve(".dugme-stanja"),
  };
}

async function sajt(t, opcije) {
  const portSajta = await slobodanPort();
  const server = pokreni(process.execPath, ["server/server.js"], { PORT: String(portSajta) });
  const strana = await otvoriStranu(await slobodanPort(), opcije);
  t.after(() => {
    strana.zatvori();
    ugasi(server);
  });
  await cekajHttp(`http://127.0.0.1:${portSajta}/`);
  return { strana, adresa: `http://127.0.0.1:${portSajta}` };
}

test("Opcije: paleta, font, režim, Save, Load, Obriši i bedž", { timeout: 90000 }, async (t) => {
  const { strana, adresa } = await sajt(t);
  await strana.posalji("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await strana.idi(`${adresa}/#cas-3`);
  await pauza(400);
  const v = (izraz) => strana.vrednost(izraz);

  await v(`document.querySelector("#opcije-dugme").click()`);
  await pauza(40);
  assert.equal(await v(`document.querySelector("#opcije-panel").hidden`), false);
  assert.equal(await v(`document.querySelector("#opcije-dugme").getAttribute("aria-expanded")`), "true");
  assert.equal(await v(`document.querySelector(".opcije-strelica").dataset.ikona`), "chevron-up");
  assert.deepEqual(await v(`[...document.querySelectorAll("#opcije-panel .opcije-naslov")].map((h) => h.textContent)`), ["Paleta", "Veličina fonta", "Način korišćenja", "Lokalno stanje"]);
  assert.deepEqual(await v(`[...document.querySelectorAll("#opcije-panel .paleta-plocica")].map((p) => [p.getAttribute("aria-label"), p.title, p.querySelector("img").getAttribute("src")])`), [
    ["Plava", "Plava", "/icons/teme/mornar.png"],
    ["Ugalj", "Ugalj", "/icons/teme/ugalj.png"],
    ["Pesak", "Pesak", "/icons/teme/pesak.png"],
    ["Terakota", "Terakota", "/icons/teme/terakota.png"],
  ]);
  assert.equal(await v(`document.querySelector("#opcije-panel .bedz-stanja").textContent`), "Sačuvano lokalno");

  await v(`document.querySelector('#opcije-panel [data-paleta="terakota"]').click()`);
  await pauza(60);
  assert.equal(await v(`document.documentElement.dataset.tema`), "terakota");
  assert.equal(await v(`document.querySelector("#opcije-panel").hidden`), false);
  assert.deepEqual(await v(`[...document.querySelectorAll("#opcije-panel .paleta-plocica")].map((p) => p.getAttribute("aria-pressed"))`), ["false", "false", "false", "true"]);
  assert.equal(await v(`JSON.parse(localStorage.getItem("${KLJUC}")).paleta`), "terakota");

  const pre = await v(`parseFloat(getComputedStyle(document.documentElement).fontSize)`);
  await v(`document.querySelector('#opcije-panel [data-skala="1.125"]').click()`);
  await pauza(40);
  const posle = await v(`parseFloat(getComputedStyle(document.documentElement).fontSize)`);
  assert.equal(await v(`document.documentElement.dataset.mod`), "predavanja");
  assert.ok(Math.abs(posle - pre * 1.125) < 0.05, `${pre} -> ${posle}`);
  assert.equal(await v(`document.querySelector('#opcije-panel [data-skala="1.125"]').getAttribute("aria-pressed")`), "true");

  const korak = await v(`document.querySelector("#izbor-koraka-natpis").textContent`);
  await v(`document.querySelector("#opcije-samostalni").click()`);
  await pauza(80);
  assert.equal(await v(`document.documentElement.dataset.mod`), "samostalni");
  assert.match(await v(`location.pathname`), /^\/tema\/3\//);
  assert.equal(await v(`document.querySelector("#izbor-koraka-natpis").textContent`), korak);
  assert.equal(await v(`document.querySelector("#opcije-samostalni").getAttribute("aria-pressed")`), "true");
  assert.equal(await v(`document.querySelector("#mod-kontrole")`), null);

  const fascikla = mkdtempSync(path.join(os.tmpdir(), "preuzimanje-"));
  await strana.posalji("Page.setDownloadBehavior", { behavior: "allow", downloadPath: fascikla });
  await v(`document.querySelector("#opcije-panel .dugme-stanja").nextElementSibling.click()`);
  let fajlovi = [];
  for (let i = 0; i < 40 && !fajlovi.includes("web-programiranje-stanje.json"); i++) {
    await pauza(50);
    fajlovi = readdirSync(fascikla);
  }
  assert.ok(fajlovi.includes("web-programiranje-stanje.json"), fajlovi.join(","));
  const preuzeto = JSON.parse(readFileSync(path.join(fascikla, "web-programiranje-stanje.json"), "utf8"));
  assert.deepEqual(preuzeto, JSON.parse(await v(`localStorage.getItem("${KLJUC}")`)));

  const zapisPre = await v(`localStorage.getItem("${KLJUC}")`);
  await v(`(() => {
    const ulaz = document.querySelector('#opcije-panel input[type="file"]');
    const prenos = new DataTransfer();
    prenos.items.add(new File(["nije json"], "pogresan.json", { type: "application/json" }));
    ulaz.files = prenos.files;
    ulaz.dispatchEvent(new Event("change"));
  })()`);
  await pauza(80);
  assert.equal(await v(`localStorage.getItem("${KLJUC}")`), zapisPre);
  assert.equal(await v(`document.querySelector("#opcije-panel .poruka-stanja").textContent`), "Fajl nije JSON.");

  const uvoz = { ...preuzeto, paleta: "mornar", beleske: [{ tema: 2, korak: 1, naslov: "Uvezeno", komentar: "iz fajla", izmenjeno: "2026-11-04T08:00:00.000Z" }] };
  await v(`(() => {
    const ulaz = document.querySelector('#opcije-panel input[type="file"]');
    const prenos = new DataTransfer();
    prenos.items.add(new File([${JSON.stringify(JSON.stringify(uvoz))}], "stanje.json", { type: "application/json" }));
    ulaz.files = prenos.files;
    ulaz.dispatchEvent(new Event("change"));
  })()`);
  await pauza(120);
  assert.equal(await v(`document.documentElement.dataset.tema`), "mornar");
  assert.equal(await v(`JSON.parse(localStorage.getItem("${KLJUC}")).beleske[0].komentar`), "iz fajla");

  await v(`localStorage.setItem("radnaVerzija", JSON.stringify({ proba: 1 }))`);
  await v(`window.confirm = () => true`);
  await v(`[...document.querySelectorAll("#opcije-panel .dugme-stanja")][2].click()`);
  await pauza(120);
  const ocisceno = await v(`({ zapis: localStorage.getItem("${KLJUC}"), radna: localStorage.getItem("radnaVerzija"), tema: document.documentElement.dataset.tema || null, mod: document.documentElement.dataset.mod })`);
  assert.equal(ocisceno.radna, JSON.stringify({ proba: 1 }));
  assert.equal(ocisceno.tema, null);
  assert.equal(ocisceno.mod, "predavanja");
  if (ocisceno.zapis !== null) {
    const zapis = JSON.parse(ocisceno.zapis);
    assert.deepEqual(zapis.beleske, []);
    assert.deepEqual(Object.keys(zapis.napredak).filter((n) => n !== "3"), []);
  }
  assert.equal(await v(`document.querySelector("#prvi-izbor").open`), true);
  await v(`document.querySelector("#prvi-izbor-predavanja").click()`);
  await pauza(60);

  await v(`(() => { Storage.prototype.setItem = () => { throw new Error("pun"); }; })()`);
  if (await v(`document.querySelector("#opcije-panel").hidden`)) await v(`document.querySelector("#opcije-dugme").click()`);
  await v(`document.querySelector('#opcije-panel [data-paleta="pesak"]').click()`);
  await pauza(60);
  assert.equal(await v(`document.querySelector("#opcije-panel .bedz-stanja").textContent`), "Nije sačuvano");
  assert.equal(await v(`document.querySelector("#opcije-panel .bedz-stanja").classList.contains("bedz-upozorenje")`), true);

  await v(`document.querySelector('#opcije-panel [data-paleta="ugalj"]').focus()`);
  await strana.posalji("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 });
  await pauza(40);
  assert.equal(await v(`document.querySelector("#opcije-panel").hidden`), true);
  assert.equal(await v(`document.activeElement.id`), "opcije-dugme");
  assert.equal(await v(`document.querySelector(".opcije-strelica").dataset.ikona`), "chevron-down");
  await v(`document.querySelector("#opcije-dugme").click()`);
  await v(`document.querySelector("#naslov-casa").click()`);
  await pauza(40);
  assert.equal(await v(`document.querySelector("#opcije-panel").hidden`), true);
});

test("Opcije prate maketu na 1672 × 941 i ne rastu sa A+", { timeout: 60000 }, async (t) => {
  const { strana, adresa } = await sajt(t, { paleta: "pesak" });
  await strana.posalji("Emulation.setDeviceMetricsOverride", { width: 1672, height: 941, deviceScaleFactor: 1, mobile: false });
  await strana.idi(`${adresa}/#cas-3`);
  await pauza(400);
  await strana.vrednost(`(() => {
    const stil = document.createElement("style");
    stil.textContent = "html { scrollbar-width: none; }";
    document.head.append(stil);
    document.querySelector("#opcije-dugme").click();
  })()`);
  await pauza(120);
  const kutije = await strana.vrednost(`(${kutijeOpcija.toString()})()`);
  blizu(kutije.panel, MAKETA.panel, "panel");
  MAKETA.glave.forEach((ocekivano, i) => blizu(kutije.glave[i], ocekivano, `naslov ${kutije.naslovi[i]}`));
  MAKETA.plocice.forEach((ocekivano, i) => blizu(kutije.plocice[i], ocekivano, `pločica ${i}`));
  blizu(kutije.segment, MAKETA.segment, "segment");
  MAKETA.kartice.forEach((ocekivano, i) => blizu(kutije.kartice[i], ocekivano, `kartica ${i}`));
  blizu(kutije.bedz, MAKETA.bedz, "bedž");
  MAKETA.dugmad.forEach((ocekivano, i) => blizu(kutije.dugmad[i], ocekivano, `dugme ${i}`));
  const slika = await strana.posalji("Page.captureScreenshot", { format: "png" });
  writeFileSync(path.join(snimci, "opcije-1672-pesak.png"), Buffer.from(slika.data, "base64"));

  await strana.vrednost(`document.querySelector('#opcije-panel [data-skala="1.125"]').click()`);
  await pauza(80);
  const posle = await strana.vrednost(`(${kutijeOpcija.toString()})()`);
  assert.deepEqual(posle, kutije);
});

test("prvi izbor režima: prazan browser, izbor, reload, Escape", { timeout: 60000 }, async (t) => {
  const { strana, adresa } = await sajt(t, { prviIzbor: true });
  await strana.posalji("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await strana.idi(`${adresa}/?r=1#cas-2`);
  await pauza(400);
  const v = (izraz) => strana.vrednost(izraz);
  assert.equal(await v(`document.querySelector("#prvi-izbor").open`), true);
  assert.equal(await v(`document.querySelector("#prvi-izbor h2").textContent`), "Kako koristite aplikaciju?");
  assert.deepEqual(await v(`[...document.querySelectorAll("#prvi-izbor .kartica-moda-natpis")].map((n) => n.textContent)`), ["Predavanja", "Samostalni rad"]);
  await v(`document.querySelector("#prvi-izbor-samostalni").click()`);
  await pauza(80);
  assert.equal(await v(`document.querySelector("#prvi-izbor").open`), false);
  await strana.idi(`${adresa}/?r=2#cas-2`);
  await pauza(400);
  assert.equal(await v(`document.querySelector("#prvi-izbor").open`), false);
  assert.equal(await v(`document.documentElement.dataset.mod`), "samostalni");

  await v(`localStorage.clear()`);
  await strana.idi(`${adresa}/?r=3#cas-2`);
  await pauza(400);
  assert.equal(await v(`document.querySelector("#prvi-izbor").open`), true);
  await strana.posalji("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 });
  await pauza(80);
  assert.equal(await v(`document.querySelector("#prvi-izbor").open`), false);
  assert.equal(await v(`JSON.parse(localStorage.getItem("${KLJUC}")).podesavanja.mod`), "predavanja");
  await strana.idi(`${adresa}/?r=4#cas-2`);
  await pauza(400);
  assert.equal(await v(`document.querySelector("#prvi-izbor").open`), false);
});
