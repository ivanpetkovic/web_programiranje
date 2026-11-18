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

test("tema 5 formular drži preventDefault u fajlu lekcije, ne u tekstu stranice", { timeout: 40000 }, async (t) => {
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
    await strana.idi(`http://127.0.0.1:${portSajta}/#tema/5/k/9/deo/editor`);
    const { sačekaj, snimi } = await saAlatom(strana);
    await sačekaj((s) => s.spreman);
    await strana.vrednost(klikNaFajl("lekcije/24-formular.js"));
    let pomeraj = 0;
    const formular = await sačekaj((s) => {
      if (s.putanja === "client/lekcije/24-formular.js" && s.tekst.includes("preventDefault")) return true;
      pomeraj += 400;
      void strana.vrednost(`document.scrollingElement.scrollTop = ${pomeraj}`);
      return false;
    });
    assert.match(formular.tekst, /Kontrolna soba/);
    assert.match(formular.tekst, /preventDefault/);
    assert.equal(formular.fajlovi.includes("lekcije/16-dom.js"), true);
    assert.equal(formular.fajlovi.includes("lekcije/34-van-browsera.js"), false);
    assert.equal(formular.fajlovi.includes("index.html"), false);
    await snimi("tema-5-formular");
    await strana.vrednost(`document.scrollingElement.scrollTop = 0`);
    await strana.vrednost(`document.querySelector("#primer").click()`);
    const krajMeni = Date.now() + 5000;
    let imaSobu = false;
    while (Date.now() < krajMeni) {
      imaSobu = await strana.vrednost(`[...document.querySelectorAll("#primer-meni button")].some((b) => b.textContent === "Kontrolna soba")`);
      if (imaSobu) break;
      await pauza(40);
    }
    assert.equal(imaSobu, true);
    await strana.vrednost(`(() => {
      const dugme = [...document.querySelectorAll("#primer-meni button")].find((b) => b.textContent === "Kontrolna soba");
      dugme.click();
    })()`);
    await strana.vrednost(klikNaFajl("index.html"));
    const html = await sačekaj((s) => s.putanja === "client/index.html" && s.tekst.includes("naslov je h1"));
    assert.equal(html.fajlovi.some((put) => put.startsWith("lekcije/")), false);
    assert.equal(html.tekst.includes("preventDefault"), false);
    assert.equal(/preventDefault/.test(html.pasusi.join(" ")), false);
    belezi(`tema 5 formular: ${formular.tekst.slice(0, 180)}`);
    await snimi("tema-5-index");
  } catch (greska) {
    greska.message += `\nserver: ${server.izlaz().slice(-500)}`;
    throw greska;
  }
});

test("meni primera drži teme lekcija i Tipove, bez starih primera", { timeout: 50000 }, async (t) => {
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

    await strana.vrednost(`document.querySelector("#primer").click()`);
    const krajMeni = Date.now() + 5000;
    let natpisi = [];
    while (Date.now() < krajMeni) {
      natpisi = await strana.vrednost(`[...document.querySelectorAll("#primer-meni button")].map((b) => b.textContent)`);
      if (natpisi.includes("JavaScript: vrednosti, objekti i funkcije") && natpisi.includes("Tipovi")) break;
      await pauza(40);
    }
    assert.equal(natpisi[0], "Kontrolna soba");
    for (const naslov of ["HTML, CSS i JS", "Funkcije", "Prototip", "Klase", "Async", "TypeScript"]) {
      assert.equal(natpisi.includes(naslov), false, naslov);
    }
    for (const naslov of [
      "JavaScript: vrednosti, objekti i funkcije",
      "JavaScript: leksičko okruženje, prototip i modul",
      "DOM, događaji i prikaz stanja",
      "Node.js, HTTP server i Web API",
      "Tipovi",
    ]) {
      assert.equal(natpisi.includes(naslov), true, naslov);
    }
    await strana.vrednost(`document.querySelector("#primer").click()`);

    await primer("JavaScript: vrednosti, objekti i funkcije");
    const jezik = await sačekaj((s) => s.fajlovi.includes("lekcije/01-izvrsavanje.js") && s.fajlovi.includes("lekcije/08-sintaksa.js"));
    assert.equal(jezik.fajlovi.includes("lekcije/09-opseg.js"), false);
    assert.equal(jezik.fajlovi.includes("index.html"), false);
    assert.equal(jezik.fajlovi.every((put) => put.startsWith("lekcije/") && put.endsWith(".js")), true);
    belezi(`tema jezika: ${jezik.fajlovi.join(", ")}`);
    await snimi("tema-lekcije");

    await primer("Tipovi");
    const tipovi = await sačekaj((s) => s.fajlovi.includes("index.html") && s.spreman);
    assert.equal(tipovi.fajlovi.includes("dist/bundle.js"), false);
    assert.equal(tipovi.dugmad.length, 0);
    assert.deepEqual(ucitajGreske(tipovi.konzola), []);
    belezi("Tipovi: nema dist/bundle.js, iframe nema dugme");

    await primer("Kontrolna soba");
    const soba = await sačekaj((s) => s.spreman && s.fajlovi.length > 0 && !s.fajlovi.some((put) => put.startsWith("lekcije/")));
    assert.equal(soba.fajlovi.some((put) => put.startsWith("lekcije/")), false);
    belezi(`kontrolna soba: ${soba.fajlovi.join(", ")}`);
  } catch (greska) {
    greska.message += `\nserver: ${server.izlaz().slice(-500)}`;
    throw greska;
  }
});

test("tema 6 drži HTTP server u editoru i ne upisuje server.js", { timeout: 40000 }, async (t) => {
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
    await strana.idi(`http://127.0.0.1:${portSajta}/#cas-6`);
    const { sačekaj, snimi } = await saAlatom(strana);
    await strana.vrednost(`(() => {
      const dugme = [...document.querySelectorAll("#nav .korak-red")].find((b) => b.textContent === "3 Od programa do HTTP servera");
      if (!dugme) throw new Error("nema koraka HTTP servera");
      dugme.click();
    })()`);
    await strana.vrednost(`document.querySelector("#tab-editor").click()`);
    const serverLekcije = await sačekaj(
      (s) => s.putanja === "client/lekcije/36-http-server.js" && s.tekst.includes("http.createServer") && s.tekst.includes("server.listen(3000"),
    );
    assert.match(serverLekcije.tekst, /import http from 'node:http'/);
    assert.match(serverLekcije.tekst, /res\.end\('Zdravo sa servera'\)/);
    await pauza(400);
    assert.equal(readFileSync(fajl, "utf8"), pre);
    belezi(`tema 6 HTTP server: ${serverLekcije.putanja}`);
    await snimi("tema-6-http-server");
  } catch (greska) {
    greska.message += `\nserver: ${server.izlaz().slice(-500)}`;
    throw greska;
  }
});
