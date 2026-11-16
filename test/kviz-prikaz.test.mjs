import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
import test from "node:test";
import { cekajHttp, otvoriStranu, pauza, pokreni, slobodanPort, snimci, ugasi } from "./chrome.mjs";

function stanjeKvizPodesavanja() {
  const dijalog = document.querySelector("#kviz");
  const grupe = [...dijalog.querySelectorAll(".kviz-grupa")].map((grupa) => ({
    legend: grupa.querySelector("legend")?.textContent || "",
    dugmad: [...grupa.querySelectorAll("button")].map((dugme) => ({
      t: dugme.textContent,
      p: dugme.getAttribute("aria-pressed"),
    })),
  }));
  const kvacica = dijalog.querySelector(".kviz-ocena input");
  return {
    otvoren: Boolean(dijalog?.open),
    grupe,
    ocena: { checked: Boolean(kvacica?.checked), disabled: Boolean(kvacica?.disabled) },
    napomena: dijalog.querySelector("[data-kviz-ocena]")?.textContent || "",
    naslov: dijalog.querySelector("#kviz-naslov")?.textContent || "",
  };
}

function pritisniBroj(natpis) {
  const dugme = [...document.querySelectorAll("#kviz .kviz-segment button")].find((stavka) => stavka.textContent === natpis);
  dugme?.click();
  return Boolean(dugme);
}

function podesiOcenu(zeljeno) {
  const kvacica = document.querySelector("#kviz .kviz-ocena input");
  if (!kvacica || kvacica.disabled || kvacica.checked === zeljeno) return;
  kvacica.click();
}

function kreni() {
  document.querySelector("#kviz .kviz-kreni")?.click();
}

function idiDoIzbora() {
  for (let i = 0; i < 20; i += 1) {
    if (document.querySelector("#kviz .option")) return true;
    const dalje = [...document.querySelectorAll("#kviz button")].find((dugme) => dugme.textContent === "Dalje");
    if (!dalje) return false;
    dalje.click();
  }
  return false;
}

function stanjePosleIzbora() {
  const opcije = [...document.querySelectorAll("#kviz .option")];
  opcije[0]?.click();
  const pogresno = [...document.querySelectorAll("#kviz .option")].find((dugme) => !dugme.classList.contains("holds"));
  pogresno?.click();
  const odgovor = document.querySelector("#kviz .kviz-odgovor");
  return {
    naslov: document.querySelector("#kviz-naslov")?.textContent || "",
    odgovor: odgovor?.innerText || "",
    holds: document.querySelectorAll("#kviz .option.holds").length,
    izabrano: document.querySelectorAll("#kviz .option.izabrano").length,
    prikazi: [...document.querySelectorAll("#kviz button")].some((dugme) => dugme.textContent === "Prikaži odgovor"),
  };
}

function zavrsiKviz() {
  for (let i = 0; i < 15; i += 1) {
    if (document.querySelector("#kviz-naslov")?.textContent === "Rezultat") return true;
    const polje = document.querySelector("#kviz .kviz-polje");
    const dalje = [...document.querySelectorAll("#kviz button")].find((dugme) =>
      dugme.textContent === "Dalje" || dugme.textContent === "Predaj" || dugme.textContent === "Završi");
    if (polje && !polje.readOnly) {
      polje.value = "netacno";
      polje.dispatchEvent(new Event("input", { bubbles: true }));
    }
    if (!dalje) return false;
    dalje.click();
  }
  return document.querySelector("#kviz-naslov")?.textContent === "Rezultat";
}

function stanjeRezultata() {
  return {
    naslov: document.querySelector("#kviz-naslov")?.textContent || "",
    stavke: [...document.querySelectorAll("#kviz .kviz-stavka")].map((stavka) => ({
      pitanje: stavka.querySelector(".kviz-stavka-dugme")?.textContent || "",
      status: stavka.querySelector(":scope > .meta")?.textContent || "",
      resenje: stavka.querySelector(".kviz-resenje")?.innerText || "",
    })),
  };
}

test("kviz bez ocene odmah pokazuje tačan odgovor, neograničeno gasi ocenu", { timeout: 60000 }, async (t) => {
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
  await strana.idi(`http://127.0.0.1:${portSajta}/`);

  const citaj = () => strana.vrednost(`(${stanjeKvizPodesavanja.toString()})()`);
  async function sačekaj(uslov, opis) {
    const kraj = Date.now() + 15000;
    let poslednje;
    while (Date.now() < kraj) {
      poslednje = await citaj();
      if (uslov(poslednje)) return poslednje;
      await strana.vrednost(`document.querySelector("#kviz-dugme")?.click()`);
      await pauza(40);
    }
    throw new Error(`${opis}: ${JSON.stringify(poslednje)}`);
  }
  async function snimi(ime) {
    await strana.vrednost(`document.querySelector("#kviz .kviz-odgovor, #kviz .kviz-kreni")?.scrollIntoView({ block: "center" })`);
    await pauza(80);
    const slika = await strana.posalji("Page.captureScreenshot", { format: "png" });
    writeFileSync(`${snimci}/${ime}.png`, Buffer.from(slika.data, "base64"));
  }

  const otvoren = await sačekaj((s) => s.otvoren && s.grupe.length === 2, "podešavanja");
  assert.deepEqual(otvoren.grupe[1].dugmad.map((dugme) => dugme.t), ["3", "10", "1 po temi", "3 po temi", "Neograničeno"]);
  assert.equal(otvoren.ocena.checked, true);
  assert.equal(otvoren.ocena.disabled, false);

  await strana.vrednost(`(${pritisniBroj.toString()})("Neograničeno")`);
  const neograniceno = await citaj();
  assert.equal(neograniceno.grupe[1].dugmad.find((dugme) => dugme.t === "Neograničeno").p, "true");
  assert.equal(neograniceno.ocena.checked, false);
  assert.equal(neograniceno.ocena.disabled, true);
  assert.match(neograniceno.napomena, /Neograničen broj pitanja nema ocenu/);
  await snimi("kviz-neograniceno");

  await strana.vrednost(`(${pritisniBroj.toString()})("1 po temi")`);
  const poTemi = await citaj();
  assert.equal(poTemi.grupe[1].dugmad.find((dugme) => dugme.t === "1 po temi").p, "true");
  assert.equal(poTemi.ocena.checked, true);
  assert.equal(poTemi.ocena.disabled, false);

  await strana.vrednost(`(${podesiOcenu.toString()})(false)`);
  const bezOcene = await citaj();
  assert.equal(bezOcene.ocena.checked, false);
  assert.match(bezOcene.napomena, /čim izabereš opciju/);

  await strana.vrednost(`(${kreni.toString()})()`);
  const imaIzbor = await strana.vrednost(`(${idiDoIzbora.toString()})()`);
  assert.equal(imaIzbor, true);
  const otkriveno = await strana.vrednost(`(${stanjePosleIzbora.toString()})()`);
  assert.equal(otkriveno.naslov, "Kviz bez ocene");
  assert.match(otkriveno.odgovor, /Nije tačno/);
  assert.match(otkriveno.odgovor, /Tačan odgovor:/);
  assert.match(otkriveno.odgovor, /Obrazloženje/);
  assert.equal(otkriveno.holds, 1);
  assert.equal(otkriveno.izabrano, 1);
  assert.equal(otkriveno.prikazi, false);
  await snimi("kviz-odgovor-odmah");

  await strana.vrednost(`document.querySelector("#kviz .kviz-zatvori").click()`);
  await sačekaj((s) => !s.otvoren, "zatvoren");
  await strana.vrednost(`document.querySelector("#kviz-dugme").click()`);
  await sačekaj((s) => s.otvoren, "ponovo");
  await strana.vrednost(`(${pritisniBroj.toString()})("3")`);
  await strana.vrednost(`(${podesiOcenu.toString()})(true)`);
  const ocenjen = await citaj();
  assert.equal(ocenjen.ocena.checked, true);
  assert.match(ocenjen.napomena, /Ocena važi/);
  await strana.vrednost(`(${kreni.toString()})()`);
  assert.equal(await strana.vrednost(`(${idiDoIzbora.toString()})()`), true);
  const sakriveno = await strana.vrednost(`(${stanjePosleIzbora.toString()})()`);
  assert.equal(sakriveno.naslov, "Kviz");
  assert.equal(sakriveno.odgovor, "");
  assert.equal(sakriveno.holds, 0);
  assert.equal(sakriveno.izabrano, 1);
  assert.equal(sakriveno.prikazi, false);

  assert.equal(await strana.vrednost(`(${zavrsiKviz.toString()})()`), true);
  const rezultat = await strana.vrednost(`(${stanjeRezultata.toString()})()`);
  assert.equal(rezultat.naslov, "Rezultat");
  assert.equal(rezultat.stavke.length, 3);
  for (const stavka of rezultat.stavke) {
    assert.match(stavka.status, /^(Tačno|Nije tačno)$/, stavka.pitanje);
    assert.match(stavka.resenje, /Tačan odgovor:|Rešenje/, stavka.pitanje);
  }
  const promasaji = rezultat.stavke.filter((stavka) => stavka.status === "Nije tačno");
  assert.ok(promasaji.length > 0, JSON.stringify(rezultat.stavke.map((stavka) => stavka.status)));
  for (const stavka of promasaji) {
    assert.match(stavka.resenje, /Tvoj odgovor:|Tvoj kod|Nisi /, stavka.pitanje);
  }
  await snimi("kviz-rezultat-resenja");
});
