import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import test from "node:test";
import path from "node:path";
import { cekajHttp, otvoriStranu, pauza, pokreni, slobodanPort, snimci, ugasi } from "./chrome.mjs";

const DNEVNIK = path.join(snimci, "pregled-browser.log");
mkdirSync(snimci, { recursive: true });
const zapisi = [];

function belezi(red) {
  zapisi.push(red);
}

function stanje() {
  const okvir = document.querySelector("#pregled-strana");
  const doc = okvir && okvir.contentDocument;
  const konzola = [...document.querySelectorAll("#pregled-konzola-zapisi li")].map((li) => li.textContent.replace(/\s+/g, " ").trim());
  const otvoren = document.querySelector("#tree button[aria-current='true']");
  return {
    putanja: document.querySelector("#putanja")?.textContent || "",
    otvoren: otvoren?.dataset.put || "",
    tekst: document.querySelector(".cm-content")?.innerText.replace(/\s+$/g, "") || "",
    spreman: Boolean(document.querySelector(".cm-content") && document.querySelector("#tree button")),
    fajlovi: [...document.querySelectorAll("#tree button")].map((dugme) => dugme.dataset.put),
    naslov: doc?.querySelector("h1")?.textContent || "",
    cifra: doc?.querySelector(".digit")?.textContent || "",
    dugmad: [...(doc?.querySelectorAll("button") || [])].map((dugme) => dugme.textContent),
    pasusi: [...(doc?.querySelectorAll("p") || [])].map((p) => p.textContent),
    html: doc?.documentElement?.innerHTML || "",
    konzola,
    napomena: document.querySelector("#editor-napomena")?.textContent || "",
    proza: document.querySelector("#cas")?.innerText || "",
  };
}

function klikNaFajl(put) {
  return `{
    const dugme = [...document.querySelectorAll("#tree button")].find((b) => b.dataset.put === ${JSON.stringify(put)});
    if (!dugme) throw new Error("nema fajla " + ${JSON.stringify(put)});
    dugme.click();
  }`;
}

function ucitajGreske(konzola) {
  return konzola.filter((red) => /SyntaxError|Unexpected token|Failed to resolve module|Cannot use import statement|Failed to fetch|net::ERR/i.test(red));
}

async function saAlatom(strana) {
  async function ekran() {
    return strana.vrednost(`(${stanje.toString()})()`);
  }
  async function sačekaj(uslov, ms = 6000) {
    const kraj = Date.now() + ms;
    let poslednje;
    while (Date.now() < kraj) {
      poslednje = await ekran();
      if (uslov(poslednje)) return poslednje;
      await pauza(40);
    }
    throw new Error(`pregled nije stigao: ${JSON.stringify(poslednje)}`);
  }
  async function snimi(ime) {
    const slika = await strana.posalji("Page.captureScreenshot", { format: "png" });
    writeFileSync(path.join(snimci, `${ime}.png`), Buffer.from(slika.data, "base64"));
  }
  return { ekran, sačekaj, snimi };
}

test("tema 6 korak 1 drži preventDefault u skripti, ne u tekstu stranice", { timeout: 40000 }, async (t) => {
  const portSajta = await slobodanPort();
  const portChrome = await slobodanPort();
  const server = pokreni(process.execPath, ["server/server.js"], { PORT: String(portSajta) });
  let strana;
  t.after(() => {
    writeFileSync(DNEVNIK, `${zapisi.join("\n")}\n`);
    strana?.zatvori();
    ugasi(server);
  });
  try {
    await cekajHttp(`http://127.0.0.1:${portSajta}/`);
    strana = await otvoriStranu(portChrome);
    await strana.posalji("Emulation.setDeviceMetricsOverride", {
      width: 1400,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await strana.idi(`http://127.0.0.1:${portSajta}/#cas-6`);
    const { sačekaj, snimi } = await saAlatom(strana);
    await strana.vrednost(`document.querySelector("#tab-editor").click()`);
    await sačekaj((s) => s.spreman);
    await strana.vrednost(klikNaFajl("js/displej.js"));
    const displej = await sačekaj(
      (s) => s.putanja === "client/js/displej.js" && s.tekst.includes('displej.textContent = "----"'),
    );
    assert.equal(displej.tekst.includes("e.preventDefault"), false);
    await strana.vrednost(klikNaFajl("index.html"));
    const html = await sačekaj((s) => s.putanja === "client/index.html" && s.tekst.includes("e.preventDefault()"));
    assert.equal(html.tekst.includes("<h1"), false);
    assert.equal(html.tekst.includes('displej.textContent = "----"'), false);
    assert.equal(/e\.preventDefault/.test(html.pasusi.join(" ")), false);
    belezi(`tema 6 korak 1: ${html.tekst}`);
    await snimi("tema-6-korak-1");
  } catch (greska) {
    greska.message += `\nserver: ${server.izlaz().slice(-500)}`;
    throw greska;
  }
});

test("pregled pokreće primere, uključujući ES modul", { timeout: 50000 }, async (t) => {
  const portSajta = await slobodanPort();
  const portChrome = await slobodanPort();
  const server = pokreni(process.execPath, ["server/server.js"], { PORT: String(portSajta) });
  let strana;
  t.after(() => {
    writeFileSync(DNEVNIK, `${zapisi.join("\n")}\n`);
    strana?.zatvori();
    ugasi(server);
  });
  try {
    await cekajHttp(`http://127.0.0.1:${portSajta}/`);
    strana = await otvoriStranu(portChrome);
    await strana.posalji("Emulation.setDeviceMetricsOverride", {
      width: 1400,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await strana.idi(`http://127.0.0.1:${portSajta}/?skica=1#cas-2`);
    const { sačekaj, snimi } = await saAlatom(strana);
    await strana.vrednost(`document.querySelector("#tab-editor").click()`);

    async function primer(naslov) {
      await strana.vrednost(`document.querySelector("#primer").click()`);
      const kraj = Date.now() + 5000;
      let ima = false;
      while (Date.now() < kraj) {
        ima = await strana.vrednost(`[...document.querySelectorAll("#primer-meni button")].some((b) => b.textContent === ${JSON.stringify(naslov)})`);
        if (ima) break;
        await pauza(40);
      }
      assert.equal(ima, true, naslov);
      await strana.vrednost(`(() => {
        const dugme = [...document.querySelectorAll("#primer-meni button")].find((b) => b.textContent === ${JSON.stringify(naslov)});
        dugme.click();
      })()`);
    }

    await primer("HTML, CSS i JS");
    const html = await sačekaj((s) => s.pasusi.includes("Ja sam novi element"));
    assert.deepEqual(ucitajGreske(html.konzola), []);
    belezi(`HTML, CSS i JS: ${JSON.stringify(html.konzola)}`);

    await primer("Funkcije");
    const funkcije = await sačekaj((s) => s.dugmad.filter((natpis) => natpis.startsWith("Click ")).length === 3);
    assert.deepEqual(ucitajGreske(funkcije.konzola), []);
    assert.ok(funkcije.konzola.some((red) => red.includes("i=0")));
    belezi(`Funkcije: ${JSON.stringify(funkcije.konzola)}`);

    await primer("Prototip");
    const prototip = await sačekaj((s) => s.konzola.some((red) => red.includes("Ime: marko")));
    assert.deepEqual(ucitajGreske(prototip.konzola), []);
    belezi(`Prototip: ${JSON.stringify(prototip.konzola)}`);

    await primer("Klase");
    const klase = await sačekaj((s) => s.dugmad.includes("Dodaj"));
    assert.deepEqual(ucitajGreske(klase.konzola), []);
    assert.equal(klase.fajlovi.includes("src/props/main.js"), true);
    belezi(`Klase: ${JSON.stringify(klase.konzola)}`);
    await snimi("primer-klase");

    await primer("Async");
    const asinhrono = await sačekaj(
      (s) => s.konzola.some((red) => /Win!|⚠|Number /.test(red)),
      4000,
    );
    assert.deepEqual(ucitajGreske(asinhrono.konzola), []);
    belezi(`Async: ${JSON.stringify(asinhrono.konzola)}`);

    for (const naslov of ["TypeScript", "Tipovi"]) {
      await primer(naslov);
      const prazan = await sačekaj((s) => s.fajlovi.includes("index.html") && s.spreman);
      assert.equal(prazan.fajlovi.includes("dist/bundle.js"), false);
      assert.equal(prazan.dugmad.length, 0);
      assert.deepEqual(ucitajGreske(prazan.konzola), []);
      belezi(`${naslov}: nema dist/bundle.js, iframe nema dugme`);
    }
  } catch (greska) {
    greska.message += `\nserver: ${server.izlaz().slice(-500)}`;
    throw greska;
  }
});

test("tema 5 drži require u editoru i ne upisuje server.js", { timeout: 40000 }, async (t) => {
  const portSajta = await slobodanPort();
  const portChrome = await slobodanPort();
  const server = pokreni(process.execPath, ["server/server.js"], { PORT: String(portSajta) });
  const fajl = new URL("../server/server.js", import.meta.url);
  const pre = readFileSync(fajl, "utf8");
  let strana;
  t.after(() => {
    writeFileSync(DNEVNIK, `${zapisi.join("\n")}\n`);
    strana?.zatvori();
    ugasi(server);
  });
  try {
    await cekajHttp(`http://127.0.0.1:${portSajta}/`);
    strana = await otvoriStranu(portChrome);
    await strana.posalji("Emulation.setDeviceMetricsOverride", {
      width: 1400,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await strana.idi(`http://127.0.0.1:${portSajta}/#cas-5`);
    const { sačekaj, snimi } = await saAlatom(strana);
    await strana.vrednost(`(() => {
      const dugme = [...document.querySelectorAll("#nav .korak-red")].find((b) => b.textContent === "7 createServer");
      if (!dugme) throw new Error("nema koraka createServer");
      dugme.click();
    })()`);
    await strana.vrednost(`document.querySelector("#tab-editor").click()`);
    const create = await sačekaj(
      (s) => s.putanja === "server/server.js" && s.tekst.includes('require("http")') && s.tekst.includes("http.createServer"),
    );
    assert.match(create.tekst, /^const http = require\("http"\);/);
    await strana.vrednost(`(() => {
      const dugme = [...document.querySelectorAll("#nav .korak-red")].find((b) => b.textContent === "8 listen");
      if (!dugme) throw new Error("nema koraka listen");
      dugme.click();
    })()`);
    const listen = await sačekaj(
      (s) => s.putanja === "server/server.js" && s.tekst.includes("server.listen(8787);") && s.tekst.includes('require("http")'),
    );
    assert.match(listen.tekst, /^const http = require\("http"\);/);
    assert.match(listen.tekst, /const server = http\.createServer\(obrada\);/);
    assert.match(listen.napomena, /samo kad krene/);
    await pauza(400);
    assert.equal(readFileSync(fajl, "utf8"), pre);
    belezi(`tema 5 listen: ${listen.napomena}`);
    await snimi("tema-5-listen");
  } catch (greska) {
    greska.message += `\nserver: ${server.izlaz().slice(-500)}`;
    throw greska;
  }
});
