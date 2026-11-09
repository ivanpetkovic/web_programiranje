import assert from "node:assert/strict";
import test from "node:test";
import { cekajHttp, otvoriStranu, pauza, pokreni, slobodanPort, ugasi } from "./chrome.mjs";

function stanjeVim() {
  const koren = document.scrollingElement;
  const tab = document.querySelector(".cas-tabovi [aria-selected='true']");
  return {
    hash: location.pathname,
    skrol: koren.scrollTop,
    max: koren.scrollHeight - koren.clientHeight,
    visina: innerHeight,
    tab: tab?.id || "",
    tema: (document.querySelector("#izbor-teme-natpis")?.textContent || "").trim(),
    korak: (document.querySelector("#izbor-koraka-natpis")?.textContent || "").trim(),
    gradivo: !document.querySelector("#sekcija-koraci").hidden,
    diskusija: !document.querySelector("#sekcija-diskusija").hidden,
    editor: !document.querySelector("#sekcija-editor").hidden,
    uvod: document.body.classList.contains("uvod-otvoren"),
    fokus: document.activeElement?.id || document.activeElement?.tagName || "",
    pomoc: document.querySelector("#pomoc-dijalog")?.open === true,
  };
}

const SLOVA = { j: 74, k: 75, h: 72, l: 76, u: 85, i: 73, o: 79 };

test("j/k skroluju pola prozora, h/l korak, shift+j/k temu, u/i/o tab", { timeout: 60000 }, async (t) => {
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
  await strana.posalji("Emulation.setDeviceMetricsOverride", { width: 1280, height: 640, deviceScaleFactor: 1, mobile: false });
  await strana.idi(`http://127.0.0.1:${portSajta}/#cas-1`);

  const citaj = () => strana.vrednost(`(${stanjeVim.toString()})()`);
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
  async function taster(slovo, { shift = false } = {}) {
    const key = shift ? slovo.toUpperCase() : slovo;
    const code = `Key${slovo.toUpperCase()}`;
    const zajednicko = { key, code, windowsVirtualKeyCode: SLOVA[slovo], ...(shift ? { modifiers: 8 } : {}) };
    await strana.posalji("Input.dispatchKeyEvent", { type: "keyDown", ...zajednicko });
    await strana.posalji("Input.dispatchKeyEvent", { type: "keyUp", ...zajednicko });
    await pauza(80);
  }
  async function odmakniFokus() {
    await strana.vrednost(`document.activeElement?.blur()`);
  }

  let sada = await sačekaj((s) => s.tema.startsWith("Tema 1") && /^Korak 1 od /.test(s.korak) && s.tab === "tab-diskusija", "čas 1");
  assert.match(sada.hash, /^\/tema\/1\/k\/1\/deo\/diskusija$/);
  assert.equal(sada.diskusija, true);
  assert.equal(sada.gradivo, false);

  await odmakniFokus();
  await taster("l");
  sada = await sačekaj((s) => /^Korak 2 od /.test(s.korak), "sledeći korak");
  assert.equal(sada.tab, "tab-diskusija");
  assert.match(sada.hash, /^\/tema\/1\/k\/2\/deo\/diskusija$/);

  await taster("h");
  sada = await sačekaj((s) => /^Korak 1 od /.test(s.korak), "prethodni korak");
  assert.equal(sada.tab, "tab-diskusija");
  await taster("h");
  sada = await citaj();
  assert.match(sada.korak, /^Korak 1 od /);

  await taster("u");
  sada = await sačekaj((s) => s.tab === "tab-koraci" && s.gradivo && !s.diskusija && !s.editor, "gradivo");
  await strana.vrednost(`document.scrollingElement.scrollTop = 0`);
  const vrh = await citaj();
  assert.ok(vrh.max > vrh.visina / 2, `gradivo mora da bude duže od pola prozora: ${JSON.stringify(vrh)}`);
  await taster("j");
  const dole = await citaj();
  assert.ok(Math.abs(dole.skrol - vrh.visina / 2) <= 1, `j treba pola prozora, dobijeno ${dole.skrol} od ${vrh.visina / 2}`);
  assert.match(dole.korak, /^Korak 1 od /);
  assert.equal(dole.tab, "tab-koraci");
  await taster("k");
  const gore = await citaj();
  assert.ok(gore.skrol <= 1, `k vraća na vrh, dobijeno ${gore.skrol}`);

  await taster("i");
  sada = await sačekaj((s) => s.tab === "tab-diskusija" && s.diskusija && !s.gradivo, "diskusija");
  await taster("o");
  sada = await sačekaj((s) => s.tab === "tab-editor" && s.editor && !s.gradivo && !s.diskusija, "editor");

  await taster("j", { shift: true });
  sada = await sačekaj((s) => s.hash.startsWith("/tema/2/") && s.tema.startsWith("Tema 2"), "sledeća tema");
  assert.equal(sada.tab, "tab-diskusija");
  assert.match(sada.korak, /^Korak /);

  await taster("k", { shift: true });
  sada = await sačekaj((s) => s.hash.startsWith("/tema/1/") && s.tema.startsWith("Tema 1"), "prethodna tema");
  await taster("k", { shift: true });
  sada = await sačekaj((s) => s.hash === "/uvod" && s.uvod && s.tema === "Uvod", "uvod");

  await taster("h");
  await taster("l");
  await taster("u");
  await taster("i");
  await taster("o");
  await taster("k", { shift: true });
  sada = await citaj();
  assert.equal(sada.hash, "/uvod");
  assert.equal(sada.uvod, true);

  await taster("j", { shift: true });
  sada = await sačekaj((s) => s.hash.startsWith("/tema/1/") && !s.uvod, "prva tema sa uvoda");

  await strana.vrednost(`document.querySelector("#q").focus()`);
  await taster("l");
  await taster("j");
  sada = await citaj();
  assert.match(sada.korak, /^Korak 1 od /);
  assert.match(sada.hash, /^\/tema\/1\/k\/1\//);
  assert.ok(sada.skrol <= 1, "j u pretrazi ne skroluje stranicu");

  await odmakniFokus();
  await strana.vrednost(`document.querySelector("#pomoc").click()`);
  sada = await sačekaj((s) => s.pomoc, "pomoć");
  assert.match(
    await strana.vrednost(`document.querySelector("#pomoc-dijalog").textContent`),
    /J i K pomeraju tekst za pola visine prozora/,
  );
  const prePomoci = sada.korak;
  await taster("l");
  sada = await citaj();
  assert.equal(sada.korak, prePomoci);
  assert.equal(sada.pomoc, true);
  await strana.vrednost(`document.querySelector("#pomoc-dijalog").close()`);
});
