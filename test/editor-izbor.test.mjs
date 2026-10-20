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
  return {
    putanja: document.querySelector("#putanja")?.textContent || "",
    otvoren: otvoren?.dataset.put || "",
    tekst: sadrzaj ? sadrzaj.innerText.replace(/\s+$/g, "") : "",
    spreman: Boolean(sadrzaj && document.querySelector("#koraci-kontrole button")),
  };
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
    await strana.idi(`http://127.0.0.1:${portSajta}/`);
    const kurs = JSON.parse(readFileSync(path.join(koren, "site/kurs.json"), "utf8"));
    const stranica = kurs.nedelje[0].steps.find((korak) => korak.naslov === "Stranica");
    const htmlKoraka = stranica.original.trim();
    const css = readFileSync(path.join(koren, "client/css/soba.css"), "utf8").trim();

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

    const prvi = await sačekaj((s) => s.spreman && s.tekst.includes("<!DOCTYPE html>"));
    assert.equal(prvi.putanja, "client/index.html");
    await strana.vrednost(`document.querySelector('#tab-editor').click()`);
    await strana.vrednost(`document.querySelector('#koraci-kontrole button[aria-label="Stranica"]').click()`);
    const posleKoraka = await sačekaj((s) => s.tekst.trim() === htmlKoraka);
    assert.notEqual(posleKoraka.tekst.trim(), prvi.tekst.trim());
    assert.equal(posleKoraka.putanja, "client/index.html");

    await strana.vrednost(`{
      const dugme = [...document.querySelectorAll("#tree button")].find((b) => b.dataset.put === "css/soba.css");
      if (!dugme) throw new Error("nema soba.css");
      dugme.click();
    }`);
    const posleCss = await sačekaj(
      (s) => s.putanja === "client/css/soba.css" && s.tekst.includes('font-family: "Digital-7 Mono"'),
    );
    assert.equal(posleCss.tekst.trim().startsWith("@font-face"), true);
    assert.equal(posleCss.tekst.includes(htmlKoraka), false);
    assert.equal(posleCss.tekst.includes(css.slice(0, 80)), true);

    await strana.vrednost(`{
      const dugme = [...document.querySelectorAll("#tree button")].find((b) => b.dataset.put === "js/niz.js");
      if (!dugme) throw new Error("nema niz.js");
      dugme.click();
    }`);
    const posleNiza = await sačekaj((s) => s.putanja === "client/js/niz.js" && s.tekst.startsWith("const prag = 24;"));
    assert.equal(posleNiza.tekst.includes("<!DOCTYPE html>"), false);
    assert.equal(posleNiza.tekst.includes("Digital-7 Mono"), false);
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
    await strana.idi(`http://127.0.0.1:${portSajta}/`);
    const kurs = JSON.parse(readFileSync(path.join(koren, "site/kurs.json"), "utf8"));
    const koraci = kurs.nedelje[0].steps;
    const stranica = koraci.find((korak) => korak.naslov === "Stranica").original.trim();
    const glava = koraci.find((korak) => korak.naslov === "Glava").original.trim();

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
      await strana.vrednost(
        `document.querySelector('#koraci-kontrole button[aria-label=${JSON.stringify(naslov)}]').click()`,
      );
    }

    await sačekaj((s) => s.spreman);
    await strana.vrednost(`document.querySelector('#tab-editor').click()`);
    await strana.vrednost(klikNaFajl("js/korak.js"));
    const otvorenKorak = await sačekaj((s) => s.putanja === "client/js/korak.js" && s.tekst.startsWith("let delta = 1;"));
    assert.equal(otvorenKorak.otvoren, "js/korak.js");

    await korak("Stranica");
    const poslePrvogKoraka = await sačekaj((s) => s.putanja === "client/index.html" && s.tekst.trim() === stranica);
    assert.equal(poslePrvogKoraka.otvoren, "index.html");
    assert.equal(poslePrvogKoraka.tekst.includes("let delta = 1;"), false);

    await strana.vrednost(klikNaFajl("js/niz.js"));
    const drugiFajl = await sačekaj((s) => s.putanja === "client/js/niz.js" && s.tekst.startsWith("const prag = 24;"));
    assert.equal(drugiFajl.otvoren, "js/niz.js");
    assert.equal(drugiFajl.tekst.includes(stranica), false);

    await korak("Glava");
    const posleDrugogKoraka = await sačekaj((s) => s.putanja === "client/index.html" && s.tekst.trim() === glava);
    assert.equal(posleDrugogKoraka.otvoren, "index.html");
    assert.equal(posleDrugogKoraka.tekst.includes("<title>Soba</title>"), true);
    assert.equal(posleDrugogKoraka.tekst.includes("const prag = 24;"), false);
    assert.equal(posleDrugogKoraka.tekst.trim() === stranica, false);
  } catch (greska) {
    greska.message += `\nserver: ${server.izlaz().slice(-500)}`;
    throw greska;
  }
});
