import assert from "node:assert/strict";
import { copyFileSync, unlinkSync } from "node:fs";
import test from "node:test";
import { cekajHttp, koren, otvoriStranu, pauza, pokreni, slobodanPort, ugasi } from "./chrome.mjs";
import path from "node:path";

const kurs = path.join(koren, "kursevi/web_programiranje/kurs.json");
const marker = "PITANJE-POSLE-RELOADA-2743";

test("izmena pitanja ostaje posle reload-a kad kvačica kaže sačuvano", { timeout: 40000 }, async (t) => {
  copyFileSync(kurs, `${kurs}.bak-2743`);
  const portSajta = await slobodanPort();
  const portChrome = await slobodanPort();
  const server = pokreni(process.execPath, ["server/server.js"], { PORT: String(portSajta) });
  let strana;
  t.after(() => {
    strana?.zatvori();
    ugasi(server);
    copyFileSync(`${kurs}.bak-2743`, kurs);
    unlinkSync(`${kurs}.bak-2743`);
  });
  await cekajHttp(`http://127.0.0.1:${portSajta}/`);
  strana = await otvoriStranu(portChrome);
  const adresa = `http://127.0.0.1:${portSajta}/?edit=true#cas-1`;
  await strana.idi(adresa);
  await pauza(400);
  const odmah = await strana.vrednost(`(async () => {
    const blok = [...document.querySelectorAll(".sekcija-lekcije")].filter((el) => el.dataset.vrsta === "pitanje")[1];
    blok.querySelector('[aria-label="Opcije sekcije"]').click();
    [...blok.querySelectorAll('[role="menuitem"]')].find((dugme) => dugme.textContent === "Uredi").click();
    await new Promise((resolve) => setTimeout(resolve, 40));
    const polja = [...document.querySelectorAll(".uredjivi-editor-pitalica textarea")];
    polja[0].value = ${JSON.stringify(marker)};
    polja[0].dispatchEvent(new Event("input", { bubbles: true }));
    polja[1].value = "ODGOVOR-POSLE-RELOADA-2743";
    polja[1].dispatchEvent(new Event("input", { bubbles: true }));
    return document.querySelector(".stanje-ikona")?.getAttribute("aria-label");
  })()`);
  assert.equal(odmah, "Nije sačuvano");

  let ikona = "";
  for (let i = 0; i < 30; i += 1) {
    await pauza(100);
    ikona = await strana.vrednost(`document.querySelector(".stanje-ikona")?.getAttribute("aria-label")`);
    if (ikona === "Sačuvano") break;
  }
  assert.equal(ikona, "Sačuvano");
  const upisano = await strana.vrednost(`fetch("/kurs.json?sveze=" + Date.now(), { cache: "no-store" }).then((odgovor) => odgovor.json()).then((kurs) => kurs.teme[0].steps[0].pitalice[1])`);
  assert.equal(upisano.pitalica, marker);
  assert.match(upisano.odgovor, /ODGOVOR-POSLE-RELOADA-2743/);

  await strana.idi("about:blank");
  await strana.idi(adresa);
  let tekstovi = [];
  let odgovori = [];
  for (let i = 0; i < 20; i += 1) {
    await pauza(100);
    const stanje = await strana.vrednost(`({
      tekstovi: [...document.querySelectorAll(".pitanje-blok h3")].map((naslov) => naslov.textContent),
      odgovori: [...document.querySelectorAll(".odgovor-tekst")].map((odgovor) => odgovor.textContent)
    })`);
    tekstovi = stanje.tekstovi;
    odgovori = stanje.odgovori;
    if (tekstovi.includes(marker)) break;
  }
  assert.ok(tekstovi.includes(marker), tekstovi.join(" | "));
  assert.ok(odgovori.some((odgovor) => odgovor.includes("ODGOVOR-POSLE-RELOADA-2743")));
});
