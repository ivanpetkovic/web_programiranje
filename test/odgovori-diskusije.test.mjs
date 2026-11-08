import assert from "node:assert/strict";
import test from "node:test";
import { cekajHttp, otvoriStranu, pauza, pokreni, slobodanPort, ugasi } from "./chrome.mjs";

function stanjeDiskusije() {
  const diskusija = document.querySelector("#sekcija-diskusija");
  const pitanja = [...diskusija.querySelectorAll(".pitanje-blok")];
  const tema = diskusija.querySelector(":scope > .diskusija, .diskusija");
  return {
    diskusija: !diskusija.hidden,
    korak: (document.querySelector(".birac-naslov")?.textContent || "").trim(),
    naslovi: pitanja.map((blok) => (blok.querySelector("h3")?.textContent || "").trim()),
    odgovori: pitanja.map((blok) => (blok.querySelector(":scope > .odgovor-tekst")?.textContent || "").trim()),
    opcije: pitanja.map((blok) => blok.querySelectorAll(".option").length),
    holds: pitanja.map((blok) => blok.querySelectorAll(".option.holds").length),
    primer: pitanja.some((blok) => blok.querySelector(".pitanje-kod")),
    temaOpcije: tema ? tema.querySelectorAll(".option").length : 0,
    temaHolds: tema ? tema.querySelectorAll(".option.holds").length : 0,
  };
}

test("diskusija koraka krije odgovore dok se pitanje ne otvori", { timeout: 40000 }, async (t) => {
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
  await strana.posalji("Emulation.setDeviceMetricsOverride", { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
  await strana.idi(`http://127.0.0.1:${portSajta}/#cas-3`);

  const citaj = () => strana.vrednost(`(${stanjeDiskusije.toString()})()`);
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

  const zatvoreno = await sačekaj(
    (s) => s.diskusija && s.korak.startsWith("Šta je JavaScript") && s.naslovi.length >= 3,
    "prvi korak teme 3",
  );
  assert.ok(zatvoreno.naslovi[0].includes("Zašto nam je potreban JavaScript"));
  assert.deepEqual(zatvoreno.opcije, [0, 0, 0]);
  assert.deepEqual(zatvoreno.odgovori, ["", "", ""]);
  assert.equal(zatvoreno.primer, true);

  await strana.vrednost(`document.querySelectorAll("#sekcija-diskusija .pitanje-blok .pitanje-okidac")[0].click()`);
  const otvoreno = await citaj();
  assert.equal(otvoreno.opcije[0] > 1, true);
  assert.equal(otvoreno.holds[0], 1);
  assert.equal(otvoreno.opcije[1], 0);
  assert.equal(otvoreno.odgovori[2], "");
  assert.match(otvoreno.odgovori[0], /Odgovor: A/);

  await strana.vrednost(`document.querySelectorAll("#sekcija-diskusija .pitanje-blok .pitanje-okidac")[0].click()`);
  const ponovo = await citaj();
  assert.deepEqual(ponovo.opcije, [0, 0, 0]);
  assert.deepEqual(ponovo.odgovori, ["", "", ""]);

  const indeksTeksta = ponovo.naslovi.findIndex((naslov) => naslov.includes("izračunavanje vrednosti"));
  assert.ok(indeksTeksta >= 0);
  await strana.vrednost(`document.querySelectorAll("#sekcija-diskusija .pitanje-blok .pitanje-okidac")[${indeksTeksta}].click()`);
  const tekst = await citaj();
  assert.match(tekst.odgovori[indeksTeksta], /izraz/);
  assert.equal(tekst.opcije.every((broj) => broj === 0), true);

  await strana.vrednost(`document.querySelector("#ponovi-pitanje").click()`);
  const ponovljeno = await citaj();
  assert.deepEqual(ponovljeno.odgovori, ["", "", ""]);

  await strana.vrednost(`(() => {
    document.querySelector(".birac-svi").click();
    const stavke = [...document.querySelectorAll("#birac-meni button")];
    stavke.at(-1).click();
  })()`);
  const kraj = await sačekaj((s) => s.temaOpcije > 0, "diskusija cele teme");
  assert.equal(kraj.temaHolds, 0);
  assert.equal(kraj.opcije.every((broj) => broj === 0), true);

  await strana.idi(`http://127.0.0.1:${portSajta}/?edit=true#cas-3`);
  const uredjivanje = await sačekaj(
    (s) => s.diskusija && s.opcije.some((broj) => broj > 0) && s.odgovori.some(Boolean),
    "uređivanje pokazuje odgovore",
  );
  assert.ok(uredjivanje.opcije.some((broj) => broj > 1));
});
