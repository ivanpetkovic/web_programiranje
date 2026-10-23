import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { cekajHttp, koren, otvoriStranu, pauza, pokreni, slobodanPort, ugasi } from "./chrome.mjs";

function stanjeEditora() {
  const sadrzaj = document.querySelector(".cm-content");
  const otvoren = document.querySelector("#tree button[aria-current='true']");
  const okvir = document.querySelector("#pregled-strana");
  const doc = okvir && okvir.contentDocument;
  const telo = doc && doc.body ? doc.body.innerText.replace(/\s+/g, " ").trim() : "";
  let stil = "";
  if (doc) {
    for (const sheet of doc.styleSheets) {
      try {
        for (const pravilo of sheet.cssRules) stil += pravilo.cssText;
      } catch {
        /* prazan ili tuđi stil */
      }
    }
  }
  return {
    putanja: document.querySelector("#putanja")?.textContent || "",
    otvoren: otvoren?.dataset.put || "",
    tekst: sadrzaj ? sadrzaj.innerText.replace(/\s+$/g, "") : "",
    spreman: Boolean(sadrzaj && document.querySelector("#birac-meni button")),
    pregled: {
      prazan: telo === "" && !doc?.querySelector("h1"),
      naslov: doc?.querySelector("h1")?.textContent || "",
      cifra: doc?.querySelector(".digit")?.textContent || "",
      dugme: doc?.querySelector("button")?.textContent || "",
      pasus: [...(doc?.querySelectorAll("p") || [])].map((p) => p.textContent).join(" "),
      stil,
      veza: doc?.querySelector('link[rel="stylesheet"]')?.getAttribute("href") || "",
    },
  };
}

function klikNaKorak(naslov) {
  return `(() => {
    const dugme = [...document.querySelectorAll("#birac-meni button")].find((b) => b.textContent.endsWith(" " + ${JSON.stringify(naslov)}));
    if (!dugme) throw new Error("nema koraka");
    dugme.click();
  })()`;
}

function klikNaFajl(put) {
  return `{
    const dugme = [...document.querySelectorAll("#tree button")].find((b) => b.dataset.put === ${JSON.stringify(put)});
    if (!dugme) throw new Error("nema fajla");
    dugme.click();
  }`;
}

test("drugi fajl posle koraka pokazuje svoj sadržaj", { timeout: 30000 }, async (t) => {
  const portSajta = await slobodanPort();
  const portChrome = await slobodanPort();
  const server = pokreni(process.execPath, ["server/server.js"], { PORT: String(portSajta) });
  let strana;
  t.after(() => {
    strana?.zatvori();
    ugasi(server);
  });
  try {
    await cekajHttp(`http://127.0.0.1:${portSajta}/`);
    strana = await otvoriStranu(portChrome);
    await strana.idi(`http://127.0.0.1:${portSajta}/#cas-2`);
    await strana.vrednost(
      `localStorage.setItem("radnaVerzija", ${JSON.stringify(JSON.stringify({ "client/index.html": "client/\nserver/\n" }))})`,
    );
    await strana.idi(`http://127.0.0.1:${portSajta}/?skica=1#cas-2`);
    const kurs = JSON.parse(readFileSync(path.join(koren, "site/kurs.json"), "utf8"));
    const prva = kurs.nedelje[1].steps;
    const htmlKoraka = prva.find((korak) => korak.naslov === "Stranica").delic.trim();
    const cssKoraka = prva.find((korak) => korak.naslov === "Selektor").delic.trim();

    async function ekran() {
      return strana.vrednost(`(${stanjeEditora.toString()})()`);
    }
    async function sačekaj(uslov) {
      const kraj = Date.now() + 5000;
      let poslednje;
      while (Date.now() < kraj) {
        poslednje = await ekran();
        if (uslov(poslednje)) return poslednje;
        await pauza(40);
      }
      throw new Error(`editor nije stigao: ${JSON.stringify(poslednje)}`);
    }

    await strana.vrednost(`document.querySelector('#tab-editor').click()`);
    await strana.vrednost(klikNaKorak("Stranica"));
    const stranica = await sačekaj(
      (s) => s.spreman && s.putanja === "client/index.html" && s.tekst.trim() === htmlKoraka && s.pregled.prazan,
    );
    assert.equal(stranica.tekst.includes("client/\nserver"), false);
    assert.equal(stranica.pregled.naslov, "");
    assert.equal(stranica.pregled.cifra, "");
    assert.equal(stranica.pregled.dugme, "");
    await strana.vrednost(klikNaKorak("Naslov"));
    const naslov = await sačekaj((s) => s.pregled.naslov === "Soba prekidača" && s.pregled.cifra === "" && s.pregled.dugme === "");
    assert.equal(naslov.pregled.pasus.includes("24"), false);
    assert.notEqual(naslov.tekst.trim(), stranica.tekst.trim());
    await strana.vrednost(klikNaKorak("Broj"));
    const broj = await sačekaj((s) => s.pregled.naslov === "Soba prekidača" && s.pregled.cifra === "24" && s.pregled.dugme === "");
    assert.equal(broj.tekst.includes('class="digit"'), true);
    await strana.vrednost(klikNaKorak("Dugme"));
    const dugme = await sačekaj(
      (s) => s.pregled.naslov === "Soba prekidača" && s.pregled.cifra === "24" && s.pregled.dugme === "Uključi",
    );
    assert.equal(dugme.tekst.includes("<button"), true);
    assert.equal(dugme.tekst.includes("client/\nserver"), false);
    await strana.vrednost(klikNaKorak("Veza"));
    const veza = await sačekaj((s) => s.tekst.includes('href="css/soba.css"') && s.pregled.naslov === "Soba prekidača");
    assert.equal(veza.pregled.veza.includes("css/soba.css"), false);
    assert.equal(veza.pregled.veza.includes("/client/css/soba.css"), false);
    assert.equal(veza.pregled.stil.includes("Digital-7"), false);

    await strana.vrednost(klikNaKorak("Selektor"));
    const otvorenCss = await sačekaj(
      (s) => s.putanja === "client/css/soba.css" && s.tekst.trim() === cssKoraka,
    );
    assert.equal(otvorenCss.tekst.includes(htmlKoraka), false);

    await strana.vrednost(klikNaFajl("index.html"));
    const html = await sačekaj(
      (s) => s.putanja === "client/index.html" && s.tekst.includes("<!DOCTYPE html>"),
    );
    assert.equal(html.tekst.includes("letter-spacing"), false);

    await strana.vrednost(klikNaFajl("css/soba.css"));
    const posleCss = await sačekaj(
      (s) => s.putanja === "client/css/soba.css" && s.tekst.trim() === cssKoraka,
    );
    assert.equal(posleCss.tekst.includes("<!DOCTYPE html>"), false);
    assert.equal(posleCss.tekst.includes(htmlKoraka), false);

    await strana.vrednost(`location.hash = "cas-3"`);
    await strana.vrednost(`document.querySelector('#tab-editor').click()`);
    await strana.vrednost(klikNaKorak("filter"));
    await strana.vrednost(klikNaFajl("js/niz.js"));
    const posleNiza = await sačekaj(
      (s) => s.putanja === "client/js/niz.js" && s.tekst.includes("function iznadPraga"),
    );
    assert.equal(posleNiza.tekst.includes("<!DOCTYPE html>"), false);
    assert.equal(posleNiza.tekst.includes("letter-spacing"), false);
    assert.equal(posleNiza.tekst.includes(htmlKoraka), false);

    await strana.vrednost(`location.hash = "cas-2"`);
    await strana.vrednost(`document.querySelector('#tab-editor').click()`);
    await strana.vrednost(klikNaKorak("Naslov"));
    await sačekaj((s) => s.pregled.naslov === "Soba prekidača" && s.putanja === "client/index.html");
    await strana.vrednost(`(() => {
      document.querySelector("#moj-kod").click();
      const cm = document.querySelector(".cm-content");
      cm.focus();
      const sel = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(cm);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
      return document.execCommand("insertText", false, "\\n<p>dodat pasus</p>\\n");
    })()`);
    const saPasusom = await sačekaj((s) => s.pregled.pasus.includes("dodat pasus"));
    assert.equal(saPasusom.pregled.naslov, "Soba prekidača");
  } catch (greska) {
    greska.message += `\nserver: ${server.izlaz().slice(-500)}`;
    throw greska;
  }
});

test("fajl, korak, drugi fajl, pa novi korak", { timeout: 30000 }, async (t) => {
  const portSajta = await slobodanPort();
  const portChrome = await slobodanPort();
  const server = pokreni(process.execPath, ["server/server.js"], { PORT: String(portSajta) });
  let strana;
  t.after(() => {
    strana?.zatvori();
    ugasi(server);
  });
  try {
    await cekajHttp(`http://127.0.0.1:${portSajta}/`);
    strana = await otvoriStranu(portChrome);
    await strana.idi(`http://127.0.0.1:${portSajta}/#cas-3`);
    const kurs = JSON.parse(readFileSync(path.join(koren, "site/kurs.json"), "utf8"));
    const filter = kurs.nedelje[2].steps.find((korak) => korak.naslov === "filter").delic.trim();

    async function ekran() {
      return strana.vrednost(`(${stanjeEditora.toString()})()`);
    }
    async function sačekaj(uslov) {
      const kraj = Date.now() + 5000;
      let poslednje;
      while (Date.now() < kraj) {
        poslednje = await ekran();
        if (uslov(poslednje)) return poslednje;
        await pauza(40);
      }
      throw new Error(`editor nije stigao: ${JSON.stringify(poslednje)}`);
    }
    async function korak(naslov) {
      await strana.vrednost(klikNaKorak(naslov));
    }

    await strana.vrednost(`document.querySelector('#tab-editor').click()`);
    await strana.vrednost(klikNaFajl("js/korak.js"));
    const otvorenKorak = await sačekaj(
      (s) => s.spreman && s.putanja === "client/js/korak.js" && s.tekst.startsWith("const soba = {"),
    );
    assert.equal(otvorenKorak.otvoren, "js/korak.js");

    await korak("filter");
    const poslePrvogKoraka = await sačekaj(
      (s) => s.putanja === "client/js/niz.js" && s.tekst.includes(filter),
    );
    assert.equal(poslePrvogKoraka.otvoren, "js/niz.js");
    assert.equal(poslePrvogKoraka.tekst.includes("const soba = {"), false);

    await strana.vrednost(klikNaFajl("index.html"));
    const drugiFajl = await sačekaj(
      (s) => s.putanja === "client/index.html" && s.tekst.includes("<title>Soba</title>"),
    );
    assert.equal(drugiFajl.otvoren, "index.html");
    assert.equal(drugiFajl.tekst.includes(filter), false);

    await korak("Tip");
    const posleDrugogKoraka = await sačekaj(
      (s) => s.putanja === "client/js/korak.js" && s.tekst.includes('24 === "24"'),
    );
    assert.equal(posleDrugogKoraka.otvoren, "js/korak.js");
    assert.equal(posleDrugogKoraka.tekst.startsWith("let delta = 1;"), true);
    assert.equal(posleDrugogKoraka.tekst.includes("<title>Soba</title>"), false);
    assert.equal(posleDrugogKoraka.tekst.includes(filter), false);
  } catch (greska) {
    greska.message += `\nserver: ${server.izlaz().slice(-500)}`;
    throw greska;
  }
});
