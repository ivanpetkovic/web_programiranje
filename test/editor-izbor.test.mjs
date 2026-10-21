import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync } from "node:fs";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const koren = fileURLToPath(new URL("..", import.meta.url));

function chromeBin() {
  const kandidati = [
    process.env.CHROME_PATH,
    "/usr/local/bin/google-chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ];
  return kandidati.find((put) => put && existsSync(put)) || "";
}

function slobodanPort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      server.close((greska) => (greska ? reject(greska) : resolve(port)));
    });
  });
}

function pauza(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function cekajHttp(url, ms = 8000) {
  const kraj = Date.now() + ms;
  let poslednja = "";
  while (Date.now() < kraj) {
    try {
      const odgovor = await fetch(url);
      if (odgovor.ok || odgovor.status < 500) return;
      poslednja = String(odgovor.status);
    } catch (greska) {
      poslednja = greska.message;
    }
    await pauza(40);
  }
  throw new Error(`nema odgovora ${url}: ${poslednja}`);
}

function pokreni(komanda, args, env) {
  const dete = spawn(komanda, args, {
    cwd: koren,
    env: { ...process.env, ...env },
    stdio: ["ignore", "pipe", "pipe"],
    detached: true,
  });
  let izlaz = "";
  dete.stdout.on("data", (deo) => {
    izlaz += deo;
  });
  dete.stderr.on("data", (deo) => {
    izlaz += deo;
  });
  dete.izlaz = () => izlaz;
  return dete;
}

function ugasi(dete) {
  if (!dete || dete.exitCode !== null) return;
  try {
    process.kill(-dete.pid, "SIGTERM");
  } catch {
    try {
      dete.kill("SIGTERM");
    } catch {
      /* već je stao */
    }
  }
}

async function otvoriStranu(port) {
  const bin = chromeBin();
  assert.ok(bin, "Chrome nije dostupan za proveru editora");
  const profil = mkdtempSync(path.join(os.tmpdir(), "editor-izbor-"));
  const chrome = pokreni(bin, [
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    "--disable-dev-shm-usage",
    `--user-data-dir=${profil}`,
    `--remote-debugging-port=${port}`,
    "about:blank",
  ]);
  try {
    await cekajHttp(`http://127.0.0.1:${port}/json/version`);
  } catch (greska) {
    ugasi(chrome);
    greska.message += `\nchrome: ${chrome.izlaz().slice(-400)}`;
    throw greska;
  }
  const lista = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const meta = lista.find((stavka) => stavka.type === "page");
  const soket = new WebSocket(meta.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    soket.addEventListener("open", resolve, { once: true });
    soket.addEventListener("error", () => reject(new Error("devtools")), { once: true });
  });
  let broj = 0;
  const odgovori = new Map();
  const dogadjaji = new Map();
  soket.addEventListener("message", (dogadjaj) => {
    const poruka = JSON.parse(dogadjaj.data);
    if (poruka.id && odgovori.has(poruka.id)) {
      odgovori.get(poruka.id)(poruka);
      odgovori.delete(poruka.id);
      return;
    }
    const red = dogadjaji.get(poruka.method);
    if (red?.length) red.shift()(poruka.params);
  });
  function posalji(method, params = {}, sessionId) {
    const id = ++broj;
    return new Promise((resolve, reject) => {
      odgovori.set(id, (poruka) => {
        if (poruka.error) reject(new Error(`${method}: ${poruka.error.message}`));
        else resolve(poruka.result || {});
      });
      const telo = { id, method, params };
      if (sessionId) telo.sessionId = sessionId;
      soket.send(JSON.stringify(telo));
    });
  }
  function kad(method) {
    return new Promise((resolve) => {
      if (!dogadjaji.has(method)) dogadjaji.set(method, []);
      dogadjaji.get(method).push(resolve);
    });
  }
  const { sessionId } = await posalji("Target.attachToTarget", { targetId: meta.id, flatten: true });
  await posalji("Page.enable", {}, sessionId);
  await posalji("Runtime.enable", {}, sessionId);
  return {
    chrome,
    async idi(url) {
      const ucitano = kad("Page.loadEventFired");
      await posalji("Page.navigate", { url }, sessionId);
      await ucitano;
    },
    async vrednost(izraz) {
      const rezultat = await posalji(
        "Runtime.evaluate",
        { expression: izraz, awaitPromise: true, returnByValue: true },
        sessionId,
      );
      if (rezultat.exceptionDetails) {
        const opis = rezultat.exceptionDetails.exception?.description || rezultat.exceptionDetails.text;
        throw new Error(opis || "evaluate");
      }
      return rezultat.result.value;
    },
    zatvori() {
      soket.close();
      ugasi(chrome);
    },
  };
}

function stanjeEditora() {
  const sadrzaj = document.querySelector(".cm-content");
  const otvoren = document.querySelector("#tree button[aria-current='true']");
  const soba = document.querySelector("#soba-prekidaca");
  const naslov = soba?.querySelector("h2");
  const cifra = document.querySelector("#displej");
  const dugme = document.querySelector("#prekidac");
  const vidljivo = (el) => (el && !el.hidden ? el.textContent : "");
  return {
    putanja: document.querySelector("#putanja")?.textContent || "",
    otvoren: otvoren?.dataset.put || "",
    tekst: sadrzaj ? sadrzaj.innerText.replace(/\s+$/g, "") : "",
    spreman: Boolean(sadrzaj && document.querySelector("#birac-meni button")),
    pregled: {
      soba: Boolean(soba?.hidden),
      naslov: vidljivo(naslov),
      cifra: vidljivo(cifra),
      dugme: vidljivo(dugme),
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
    const htmlKoraka = prva.find((korak) => korak.naslov === "Stranica").original.trim();
    const cssKoraka = prva.find((korak) => korak.naslov === "Spolja").original.trim();

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
    await strana.vrednost(klikNaKorak("Podela"));
    const podela = await sačekaj(
      (s) => s.spreman && s.putanja === "client/index.html" && s.tekst.trim() === "" && s.pregled.soba,
    );
    assert.equal(podela.tekst.includes("client/"), false);
    assert.equal(podela.tekst.includes("server/"), false);
    assert.equal(podela.pregled.naslov, "");
    assert.equal(podela.pregled.cifra, "");
    assert.equal(podela.pregled.dugme, "");
    await strana.vrednost(klikNaKorak("Stranica"));
    const posleKoraka = await sačekaj((s) => s.tekst.trim() === htmlKoraka && s.pregled.soba);
    assert.notEqual(posleKoraka.tekst.trim(), podela.tekst.trim());
    assert.equal(posleKoraka.putanja, "client/index.html");
    await strana.vrednost(klikNaKorak("Naslov"));
    const naslov = await sačekaj((s) => s.pregled.naslov === "Soba prekidača" && s.pregled.cifra === "");
    assert.equal(naslov.pregled.dugme, "");
    assert.equal(naslov.pregled.soba, false);
    await strana.vrednost(klikNaKorak("Dugme"));
    const dugme = await sačekaj(
      (s) => s.pregled.naslov === "Soba prekidača" && s.pregled.cifra === "24" && s.pregled.dugme === "Uključi",
    );
    assert.equal(dugme.tekst.includes("<button"), true);
    assert.equal(dugme.tekst.includes("client/\nserver"), false);

    await strana.vrednost(klikNaKorak("Spolja"));
    const otvorenCss = await sačekaj(
      (s) => s.putanja === "client/css/soba.css" && s.tekst.trim() === cssKoraka,
    );
    assert.equal(otvorenCss.tekst.includes(htmlKoraka), false);

    await strana.vrednost(klikNaFajl("index.html"));
    const html = await sačekaj(
      (s) => s.putanja === "client/index.html" && s.tekst.includes("<!DOCTYPE html>"),
    );
    assert.equal(html.tekst.includes("margin: 1rem;"), false);

    await strana.vrednost(klikNaFajl("css/soba.css"));
    const posleCss = await sačekaj(
      (s) => s.putanja === "client/css/soba.css" && s.tekst.trim() === cssKoraka,
    );
    assert.equal(posleCss.tekst.includes("<!DOCTYPE html>"), false);
    assert.equal(posleCss.tekst.includes(htmlKoraka), false);

    await strana.vrednost(`location.hash = "cas-3"`);
    await strana.vrednost(`document.querySelector('#tab-editor').click()`);
    await strana.vrednost(klikNaKorak("Prag"));
    await strana.vrednost(klikNaFajl("js/niz.js"));
    const posleNiza = await sačekaj(
      (s) => s.putanja === "client/js/niz.js" && s.tekst.includes("const prag = 24;"),
    );
    assert.equal(posleNiza.tekst.includes("<!DOCTYPE html>"), false);
    assert.equal(posleNiza.tekst.includes("margin: 1rem;"), false);
    assert.equal(posleNiza.tekst.includes(htmlKoraka), false);
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
