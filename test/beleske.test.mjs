import assert from "node:assert/strict";
import test from "node:test";
import { brojBeleski, najnovije, natpisBeleske, poTemama } from "../site/js/beleske.js";
import { cekajHttp, otvoriStranu, pauza, pokreni, slobodanPort, ugasi } from "./chrome.mjs";

const KLJUC = "web-programiranje:stanje";

// Mere iz maketa.png (1672 × 941) za spisak sa dve beleške.
const MAKETA_LISTE = [981, 76, 342, 248];

function beleska(tema, korak, izmenjeno, komentar = "", naslov = `Naslov ${tema}.${korak}`) {
  return { tema, korak, naslov, komentar, izmenjeno };
}

test("brojBeleski prati srpsku množinu", () => {
  assert.equal(brojBeleski(1), "1 beleška");
  assert.equal(brojBeleski(3), "3 beleške");
  assert.equal(brojBeleski(5), "5 beležaka");
  assert.equal(brojBeleski(11), "11 beležaka");
  assert.equal(brojBeleski(12), "12 beležaka");
  assert.equal(brojBeleski(21), "21 beleška");
  assert.equal(brojBeleski(22), "22 beleške");
  assert.equal(brojBeleski(114), "114 beležaka");
});

test("najnovije vraća pet poslednjih izmena, najnovija prva, bez menjanja ulaza", () => {
  const ulaz = [1, 7, 3, 6, 2, 5, 4].map((dan) => beleska(dan, 0, `2026-11-0${dan}T08:00:00.000Z`));
  const pre = JSON.stringify(ulaz);
  assert.deepEqual(najnovije(ulaz, 5).map((b) => b.tema), [7, 6, 5, 4, 3]);
  assert.deepEqual(najnovije(ulaz.slice(0, 2)).map((b) => b.tema), [7, 1]);
  assert.equal(JSON.stringify(ulaz), pre);
});

test("poTemama grupiše po temi pa po koraku", () => {
  const grupe = poTemama([beleska(3, 5, "a"), beleska(1, 2, "b"), beleska(3, 0, "c"), beleska(1, 0, "d")]);
  assert.deepEqual(
    grupe.map(({ tema, beleske }) => [tema, beleske.map((b) => b.korak)]),
    [
      [1, [0, 2]],
      [3, [0, 5]],
    ],
  );
  assert.equal(natpisBeleske(beleska(3, 2, "x", "", "Primitivna vrednost")), "Korak 3 – Primitivna vrednost");
});

async function sajt(t) {
  const portSajta = await slobodanPort();
  const server = pokreni(process.execPath, ["server/server.js"], { PORT: String(portSajta) });
  const strana = await otvoriStranu(await slobodanPort(), { paleta: "pesak" });
  t.after(() => {
    strana.zatvori();
    ugasi(server);
  });
  await cekajHttp(`http://127.0.0.1:${portSajta}/`);
  let redni = 0;
  const adresa = `http://127.0.0.1:${portSajta}`;
  return {
    strana,
    adresa,
    v: (izraz) => strana.vrednost(izraz),
    idi: async (hes) => {
      await strana.idi(`${adresa}/?r=${++redni}#${hes}`);
      await pauza(400);
    },
    taster: async (key, code, windowsVirtualKeyCode, text) => {
      await strana.posalji("Input.dispatchKeyEvent", { type: "keyDown", key, code, windowsVirtualKeyCode, ...(text ? { text } : {}) });
      await strana.posalji("Input.dispatchKeyEvent", { type: "keyUp", key, code, windowsVirtualKeyCode });
      await pauza(60);
    },
  };
}

async function upisiBeleske(v, beleske) {
  await v(`(() => {
    const stanje = JSON.parse(localStorage.getItem("${KLJUC}"));
    stanje.beleske = ${JSON.stringify(beleske)};
    localStorage.setItem("${KLJUC}", JSON.stringify(stanje));
  })()`);
}

const beleskeIzStanja = (v) => v(`JSON.parse(localStorage.getItem("${KLJUC}")).beleske`);

test("Sačuvaj korak: komentar, Escape, Ukloni", { timeout: 60000 }, async (t) => {
  const { v, idi, taster, strana } = await sajt(t);
  await strana.posalji("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await idi("cas-3");
  await v(`document.querySelector("#tab-koraci").click()`);
  await pauza(80);
  assert.equal(await v(`document.querySelector("#sacuvaj-korak").getAttribute("aria-pressed")`), "false");
  assert.equal(await v(`document.querySelector("#sacuvaj-korak use").getAttribute("href")`), "#bookmark");

  await v(`document.querySelector("#sacuvaj-korak").click()`);
  await pauza(60);
  assert.equal(await v(`document.querySelector("#beleska-uredjivac").hidden`), false);
  assert.equal(await v(`document.activeElement.id`), "beleska-komentar");
  assert.equal(await v(`document.querySelector("label[for=beleska-komentar]").textContent`), "Šta nije jasno u ovom koraku?");
  assert.equal(await v(`document.querySelector("#beleska-komentar").maxLength`), 500);
  assert.equal(await v(`document.querySelector(".beleska-ukloni").hidden`), true);
  await strana.posalji("Input.insertText", { text: "Razlika u čuvanju u memoriji" });
  await v(`document.querySelector(".beleska-sacuvaj").click()`);
  await pauza(60);
  const posle = await beleskeIzStanja(v);
  assert.equal(posle.length, 1);
  assert.deepEqual([posle[0].tema, posle[0].korak, posle[0].komentar], [3, 0, "Razlika u čuvanju u memoriji"]);
  assert.ok(posle[0].naslov.length > 0);
  assert.equal(await v(`document.querySelector("#beleska-uredjivac").hidden`), true);
  assert.equal(await v(`document.activeElement.id`), "sacuvaj-korak");
  assert.equal(await v(`document.querySelector("#sacuvaj-korak").getAttribute("aria-pressed")`), "true");
  assert.equal(await v(`document.querySelector("#sacuvaj-korak use").getAttribute("href")`), "#bookmark-filled");

  await v(`document.querySelector("#sacuvaj-korak").click()`);
  await pauza(60);
  assert.equal(await v(`document.querySelector("#beleska-komentar").value`), "Razlika u čuvanju u memoriji");
  assert.equal(await v(`document.querySelector(".beleska-ukloni").hidden`), false);
  await strana.posalji("Input.insertText", { text: " i još nešto" });
  await taster("Escape", "Escape", 27);
  assert.equal(await v(`document.querySelector("#beleska-uredjivac").hidden`), true);
  assert.equal(await v(`document.activeElement.id`), "sacuvaj-korak");
  assert.equal((await beleskeIzStanja(v))[0].komentar, "Razlika u čuvanju u memoriji");

  await v(`document.querySelector("#sacuvaj-korak").click()`);
  await pauza(60);
  await v(`document.querySelector(".beleska-ukloni").click()`);
  await pauza(60);
  assert.deepEqual(await beleskeIzStanja(v), []);
  assert.equal(await v(`document.querySelector("#sacuvaj-korak").getAttribute("aria-pressed")`), "false");
  assert.equal(await v(`document.querySelector("#sacuvaj-korak use").getAttribute("href")`), "#bookmark");

  await v(`document.querySelector("#sacuvaj-korak").click()`);
  await pauza(60);
  await v(`document.querySelector(".beleska-sacuvaj").click()`);
  await pauza(60);
  assert.equal((await beleskeIzStanja(v))[0].komentar, "");
});

test("beleške u zaglavlju: broj, redosled, skok sa Editora, tastatura, prazno", { timeout: 60000 }, async (t) => {
  const { v, idi, taster, strana } = await sajt(t);
  await strana.posalji("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await idi("cas-1");
  await upisiBeleske(v, [
    beleska(3, 2, "2026-11-04T08:00:00.000Z", "<b>Razlika</b> u čuvanju", "Primitivna vrednost i referenca"),
    beleska(3, 5, "2026-11-03T08:00:00.000Z", "", "Objekat i prototip"),
  ]);
  await idi("cas-1");
  await v(`document.querySelector("#tab-editor").click()`);
  await pauza(80);
  await v(`document.querySelector("#beleske-dugme").click()`);
  await pauza(60);
  const lista = await v(`(() => {
    const l = document.querySelector("#beleske-lista");
    return {
      otvorena: !l.hidden,
      naslov: l.querySelector(".beleske-naslov").textContent,
      broj: l.querySelector(".beleske-broj").textContent,
      redovi: [...l.querySelectorAll(".beleska-red-naslov")].map((n) => n.textContent),
      komentari: [...l.querySelectorAll(".beleska-red-komentar")].map((n) => n.textContent),
      bold: l.querySelectorAll("b").length,
      ikonice: [...l.querySelectorAll(".beleska-red .ikona-slot")].map((n) => n.dataset.ikona),
      sve: l.querySelector(".beleske-sve").textContent,
    };
  })()`);
  assert.deepEqual(lista, {
    otvorena: true,
    naslov: "Sačuvane beleške",
    broj: "2 beleške",
    redovi: ["Korak 3 – Primitivna vrednost i referenca", "Korak 6 – Objekat i prototip"],
    komentari: ["<b>Razlika</b> u čuvanju"],
    bold: 0,
    ikonice: ["sticky-note", "message-circle", "sticky-note"],
    sve: "Prikaži sve beleške→",
  });

  await v(`document.querySelector('#beleske-lista .beleska-red[data-korak="2"]').click()`);
  await pauza(300);
  assert.match(await v(`location.hash`), /^#cas-3\//);
  assert.match(await v(`document.querySelector("#izbor-koraka-natpis").textContent`), /^Korak 3 od /);
  assert.equal(await v(`document.querySelector("#tab-editor").getAttribute("aria-selected")`), "true");
  assert.equal(await v(`document.querySelector("#beleske-lista").hidden`), true);

  await v(`document.querySelector("#opcije-dugme").click()`);
  await pauza(40);
  await v(`document.querySelector("#beleske-dugme").click()`);
  await pauza(40);
  assert.equal(await v(`document.querySelector("#opcije-panel").hidden`), true);
  await v(`document.querySelector("#opcije-dugme").click()`);
  await pauza(40);
  assert.equal(await v(`document.querySelector("#beleske-lista").hidden`), true);
  await taster("Escape", "Escape", 27);

  await v(`document.querySelector("#beleske-dugme").focus()`);
  await taster("Enter", "Enter", 13, "\r");
  assert.equal(await v(`document.querySelector("#beleske-lista").hidden`), false);
  await taster("ArrowDown", "ArrowDown", 40);
  await taster("ArrowDown", "ArrowDown", 40);
  assert.equal(await v(`document.activeElement.dataset.korak`), "5");
  await taster("Enter", "Enter", 13, "\r");
  await pauza(300);
  assert.match(await v(`document.querySelector("#izbor-koraka-natpis").textContent`), /^Korak 6 od /);
  assert.equal(await v(`document.querySelector("#beleske-lista").hidden`), true);
  assert.equal(await v(`document.querySelector("#beleske-lista").contains(document.activeElement)`), false);

  await v(`document.querySelector("#beleske-dugme").focus()`);
  await taster("Enter", "Enter", 13, "\r");
  await taster("Escape", "Escape", 27);
  assert.equal(await v(`document.querySelector("#beleske-lista").hidden`), true);
  assert.equal(await v(`document.activeElement.id`), "beleske-dugme");

  await upisiBeleske(v, []);
  await idi("cas-1");
  await v(`document.querySelector("#beleske-dugme").click()`);
  await pauza(60);
  assert.equal(await v(`document.querySelector("#beleske-lista .beleske-prazno").textContent`), "Nema sačuvanih beleški");
  assert.equal(await v(`document.querySelector("#beleske-lista .beleske-sve") !== null`), true);
});

test("sve beleške: grupe, izmena, brisanje, korak koji ne postoji, mera liste", { timeout: 60000 }, async (t) => {
  const { v, idi, taster, strana } = await sajt(t);
  await strana.posalji("Emulation.setDeviceMetricsOverride", { width: 1672, height: 941, deviceScaleFactor: 1, mobile: false });
  await idi("cas-1");
  await upisiBeleske(v, [
    beleska(3, 2, "2026-11-04T08:00:00.000Z", "Razlika u čuvanju u memoriji", "Primitivna vrednost i referenca"),
    beleska(3, 0, "2026-11-03T08:00:00.000Z", "Važan pregled za ispit", "Objekat"),
  ]);
  await idi("cas-1");
  await v(`(() => {
    const stil = document.createElement("style");
    stil.textContent = "html { scrollbar-width: none; }";
    document.head.append(stil);
    document.querySelector("#beleske-dugme").click();
  })()`);
  await pauza(100);
  const kutija = await v(`(() => { const b = document.querySelector("#beleske-lista").getBoundingClientRect(); return [b.x, b.y, b.width, b.height].map(Math.round); })()`);
  kutija.forEach((x, i) => assert.ok(Math.abs(x - MAKETA_LISTE[i]) <= 4, `lista ${JSON.stringify(kutija)} prema ${JSON.stringify(MAKETA_LISTE)}`));

  await upisiBeleske(v, [
    beleska(3, 2, "2026-11-04T08:00:00.000Z", "Razlika u čuvanju u memoriji", "Primitivna vrednost i referenca"),
    beleska(2, 40, "2026-11-02T08:00:00.000Z", "", "Korak koji je nestao"),
    beleska(3, 0, "2026-11-03T08:00:00.000Z", "Važan pregled za ispit", "Objekat"),
  ]);
  await idi("cas-1");
  await v(`document.querySelector("#beleske-dugme").click()`);
  await pauza(60);
  await v(`document.querySelector("#beleske-lista .beleske-sve").click()`);
  await pauza(100);
  assert.equal(await v(`document.querySelector("#sve-beleske").open`), true);
  const grupe = await v(`[...document.querySelectorAll("#sve-beleske .sve-beleske-grupa")].map((g) => [
    g.querySelector("h3").textContent,
    [...g.querySelectorAll(".sve-beleske-korak")].map((k) => k.textContent),
  ])`);
  assert.equal(grupe.length, 2);
  assert.match(grupe[0][0], /^Tema 2 – /);
  assert.deepEqual(grupe[0][1], ["Korak 41 – Korak koji je nestao"]);
  assert.match(grupe[1][0], /^Tema 3 – /);
  assert.deepEqual(grupe[1][1], ["Korak 1 – Objekat", "Korak 3 – Primitivna vrednost i referenca"]);
  assert.equal(await v(`document.querySelector("#sve-beleske .oznaka-nema").textContent`), "Korak više ne postoji");
  assert.equal(await v(`document.querySelector("#sve-beleske .sve-beleske-nema").tagName`), "SPAN");
  await v(`document.querySelector("#sve-beleske .sve-beleske-nema").click()`);
  await pauza(60);
  assert.match(await v(`location.hash`), /^#cas-1\//);
  assert.equal(await v(`document.querySelector("#sve-beleske").open`), true);

  await v(`(() => {
    const polje = document.querySelector("#sve-beleske-komentar-3-0");
    polje.value = "Novi komentar";
    polje.dispatchEvent(new Event("change"));
  })()`);
  await pauza(40);
  const izmenjena = (await beleskeIzStanja(v)).find((b) => b.tema === 3 && b.korak === 0);
  assert.equal(izmenjena.komentar, "Novi komentar");

  await v(`document.querySelector('[aria-label="Ukloni belešku: Korak 41 – Korak koji je nestao"]').click()`);
  await pauza(40);
  assert.equal((await beleskeIzStanja(v)).some((b) => b.tema === 2), false);
  assert.equal(await v(`document.querySelectorAll("#sve-beleske .sve-beleske-grupa").length`), 1);
  assert.equal(await v(`document.querySelectorAll("#sve-beleske .sve-beleske-stavka").length`), 2);

  await taster("Escape", "Escape", 27);
  assert.equal(await v(`document.querySelector("#sve-beleske").open`), false);
  assert.equal(await v(`document.activeElement.id`), "beleske-dugme");
  await v(`document.querySelector("#beleske-dugme").click()`);
  await pauza(60);
  assert.equal(await v(`document.querySelector("#beleske-lista .beleske-broj").textContent`), "2 beleške");
  assert.ok((await v(`document.querySelector("#beleske-lista").textContent`)).includes("Novi komentar"));

  await v(`document.querySelector("#beleske-lista .beleske-sve").click()`);
  await pauza(80);
  await v(`document.querySelector('#sve-beleske .sve-beleske-korak[class~="sve-beleske-korak"]:not(span)').click()`);
  await pauza(300);
  assert.equal(await v(`document.querySelector("#sve-beleske").open`), false);
  assert.match(await v(`location.hash`), /^#cas-3\//);
  assert.match(await v(`document.querySelector("#izbor-koraka-natpis").textContent`), /^Korak 1 od /);
});
