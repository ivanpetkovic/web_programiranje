import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { lectures } from "../site/js/lectures.js";
import { cekajHttp, otvoriStranu, pauza, pokreni, slobodanPort, snimci, ugasi } from "./chrome.mjs";

function korakSaSobom() {
  for (const tema of lectures) {
    const i = tema.steps.findIndex((korak) => korak.putanja === "server/soba.js");
    if (i >= 0) return { cas: tema.n, korak: i + 1 };
  }
  throw new Error("nema koraka sa server/soba.js");
}

function stanje() {
  const sadrzaj = document.querySelector(".cm-content");
  const editor = document.querySelector("#editor-wrap");
  const kutija = editor ? editor.getBoundingClientRect() : null;
  return {
    putanja: document.querySelector("#putanja")?.textContent || "",
    uredljiv: sadrzaj?.getAttribute("contenteditable") || "",
    napomena: document.querySelector("#editor-napomena")?.textContent || "",
    napomenaSkrivena: document.querySelector("#editor-napomena")?.hidden ?? true,
    reset: document.querySelector("#resetuj")?.disabled ?? null,
    sacuvaj: document.querySelector("#sacuvaj-radnu")?.disabled ?? null,
    vrhEditora: kutija ? kutija.top : null,
    visina: window.innerHeight,
    upisa: window.__upisFajla || 0,
  };
}

test("telefon otvara server fajl samo za čitanje i ne šalje ga procesu", { timeout: 40000 }, async (t) => {
  mkdirSync(snimci, { recursive: true });
  const mesto = korakSaSobom();
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
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });
  await strana.idi(
    `http://127.0.0.1:${portSajta}/#/tema/${mesto.cas}/k/${mesto.korak}/deo/editor/fajl/server/soba.js`,
  );
  const kraj = Date.now() + 8000;
  let serverStanje;
  while (Date.now() < kraj) {
    serverStanje = await strana.vrednost(`(${stanje.toString()})()`);
    if (serverStanje.putanja === "server/soba.js" && serverStanje.uredljiv) break;
    await pauza(40);
  }
  assert.equal(serverStanje.putanja, "server/soba.js");
  assert.equal(serverStanje.uredljiv, "false");
  assert.match(serverStanje.napomena, /Na telefonu se ovaj fajl samo čita/);
  assert.equal(serverStanje.napomenaSkrivena, false);
  assert.equal(serverStanje.reset, true);
  assert.equal(serverStanje.sacuvaj, true);
  assert.ok(serverStanje.vrhEditora < serverStanje.visina, `editor je van ekrana: ${serverStanje.vrhEditora}`);
  await strana.vrednost(`(() => {
    window.__upisFajla = 0;
    const pravi = window.fetch.bind(window);
    window.fetch = (ulaz, opcije) => {
      const url = typeof ulaz === "string" ? ulaz : ulaz.url;
      if (String(url).includes("/api/fajl")) window.__upisFajla += 1;
      return pravi(ulaz, opcije);
    };
  })()`);
  await strana.vrednost(`document.querySelector("#lekcija").click()`);
  await pauza(200);
  await strana.vrednost(`document.querySelector("#moj-kod").click()`);
  await pauza(200);
  const poslePrekidaca = await strana.vrednost(`(${stanje.toString()})()`);
  assert.equal(poslePrekidaca.upisa, 0);
  assert.equal(poslePrekidaca.uredljiv, "false");
  await strana.vrednost(`document.querySelector("#tab-front").click()`);
  const klijentKraj = Date.now() + 8000;
  let klijent;
  while (Date.now() < klijentKraj) {
    klijent = await strana.vrednost(`(${stanje.toString()})()`);
    if (klijent.putanja.startsWith("client/") && klijent.uredljiv === "true") break;
    await pauza(40);
  }
  assert.match(klijent.putanja, /^client\//);
  assert.equal(klijent.uredljiv, "true");
  assert.equal(klijent.reset, false);
  assert.equal(klijent.napomenaSkrivena, true);
  await strana.vrednost(`document.querySelector("#tab-back").click()`);
  await pauza(300);
  const slika = await strana.posalji("Page.captureScreenshot", { format: "png" });
  writeFileSync(path.join(snimci, "server-telefon.png"), Buffer.from(slika.data, "base64"));
});
