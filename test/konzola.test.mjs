import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { chromeBin, snimci } from "./chrome.mjs";

const koren = fileURLToPath(new URL("..", import.meta.url));

const STRANICA = `<!DOCTYPE html>
<html lang="sr">
<head><meta charset="utf-8"><title>Soba</title></head>
<body>
<h1>Soba</h1>
<button type="button" id="javljanje">Javi</button>
<script src="js/korak.js"></script>
<script>
console.warn("paznja");
console.error("kvar");
Promise.reject(new Error("odbijeno"));
</script>
<script>var x = ;</script>
</body>
</html>`;

const KORAK = `console.log("iz fajla", 7);
document.querySelector("#javljanje").addEventListener("click", () => {
  console.log("klik");
  throw new Error("iz koraka");
});
`;

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
  assert.ok(bin, "Chrome nije dostupan za proveru konzole");
  const profil = mkdtempSync(path.join(os.tmpdir(), "konzola-"));
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
  await posalji(
    "Emulation.setDeviceMetricsOverride",
    { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false },
    sessionId,
  );
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
    async snimi(ime) {
      mkdirSync(snimci, { recursive: true });
      const slika = await posalji("Page.captureScreenshot", { format: "png" }, sessionId);
      writeFileSync(path.join(snimci, ime), Buffer.from(slika.data, "base64"));
    },
    zatvori() {
      soket.close();
      ugasi(chrome);
    },
  };
}

function stanjeKonzole() {
  const okvir = document.querySelector("#pregled-strana");
  const doc = okvir && okvir.contentDocument;
  const prazno = document.querySelector("#pregled-konzola-prazno");
  return {
    prazno: Boolean(prazno && !prazno.hidden),
    redovi: [...document.querySelectorAll("#pregled-konzola-zapisi li")].map((li) =>
      li.textContent.replace(/\s+/g, " ").trim(),
    ),
    naslov: doc?.querySelector("h1")?.textContent || "",
    most: Boolean(doc?.documentElement?.innerHTML.includes("pregled-konzola")),
    mod: doc?.compatMode || "",
  };
}

test("konzola ispod pregleda hvata ispis i greške", { timeout: 45000 }, async (t) => {
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
  await strana.idi(`http://127.0.0.1:${portSajta}/#cas-2`);
  await strana.vrednost(`document.querySelector("#tab-editor").click()`);
  await strana.vrednost(`document.querySelector("#pregled-konzola").scrollIntoView({ block: "end" })`);
  const prazna = await strana.vrednost(`(${stanjeKonzole.toString()})()`);
  assert.equal(prazna.prazno, true, JSON.stringify(prazna));
  assert.deepEqual(prazna.redovi, []);
  await strana.snimi("konzola-prazna.png");

  const mapa = JSON.stringify({ "client/index.html": STRANICA, "client/js/korak.js": KORAK });
  await strana.vrednost(`localStorage.setItem("radnaVerzija", ${JSON.stringify(mapa)})`);
  await strana.idi(`http://127.0.0.1:${portSajta}/?konzola=1#cas-3`);
  await strana.vrednost(`document.querySelector("#tab-editor").click()`);
  await strana.vrednost(`(() => {
    const dugme = [...document.querySelectorAll("#birac-meni button")].find((b) => b.textContent.endsWith(" Objekat"));
    if (!dugme) throw new Error("nema koraka");
    dugme.click();
  })()`);

  const kraj = Date.now() + 5000;
  let stanje;
  while (Date.now() < kraj) {
    stanje = await strana.vrednost(`(${stanjeKonzole.toString()})()`);
    const tekst = stanje.redovi.join("\n");
    if (tekst.includes("iz fajla 7") && tekst.includes("SyntaxError") && tekst.includes("odbijeno")) break;
    await pauza(40);
  }
  const tekst = stanje.redovi.join("\n");
  assert.equal(stanje.most, true, JSON.stringify(stanje));
  assert.equal(stanje.naslov, "Soba", JSON.stringify(stanje));
  assert.equal(stanje.mod, "CSS1Compat", JSON.stringify(stanje));
  assert.match(tekst, /log iz fajla 7/);
  assert.match(tekst, /warn paznja/);
  assert.match(tekst, /error kvar/);
  assert.match(tekst, /SyntaxError: Unexpected token ';' \(stranica:13:/);
  assert.match(tekst, /odbijeno/);

  await strana.vrednost(`document.querySelector("#pregled-strana").contentDocument.querySelector("#javljanje").click()`);
  const posleKlika = Date.now() + 3000;
  while (Date.now() < posleKlika) {
    stanje = await strana.vrednost(`(${stanjeKonzole.toString()})()`);
    if (stanje.redovi.some((red) => red.includes("klik") && /korak\.js/.test(stanje.redovi.join(" ")))) break;
    await pauza(40);
  }
  assert.ok(stanje.redovi.some((red) => red.includes("log klik")), JSON.stringify(stanje));
  assert.ok(stanje.redovi.some((red) => /korak\.js:\d+/.test(red) && red.includes("iz koraka")), JSON.stringify(stanje));
  await strana.vrednost(`document.querySelector("#pregled-konzola").scrollIntoView({ block: "end" })`);
  await strana.snimi("konzola-zapisi.png");

  await strana.vrednost(`document.querySelector("#pregled-konzola-obrisi").click()`);
  const obrisano = await strana.vrednost(`(${stanjeKonzole.toString()})()`);
  assert.equal(obrisano.prazno, true);
  assert.deepEqual(obrisano.redovi, []);

  await strana.vrednost(`document.querySelector("#pregled-osvezi").click()`);
  const posleOsvezavanja = Date.now() + 5000;
  while (Date.now() < posleOsvezavanja) {
    stanje = await strana.vrednost(`(${stanjeKonzole.toString()})()`);
    if (stanje.redovi.join("\n").includes("iz fajla 7")) break;
    await pauza(40);
  }
  assert.match(stanje.redovi.join("\n"), /iz fajla 7/);
});
