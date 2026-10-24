import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { copyFileSync, existsSync, mkdtempSync } from "node:fs";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const koren = fileURLToPath(new URL("..", import.meta.url));

// Pregled od 5. nedelje upisuje soba.js, ventilator.js i sesija.js iz lekcije u server/.
function vratiModule() {
  for (const ime of ["soba.js", "ventilator.js", "sesija.js"]) {
    copyFileSync(path.join(koren, "server", "prepared", ime), path.join(koren, "server", ime));
  }
}
process.on("exit", vratiModule);

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

export function slobodanPort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      server.close((greska) => (greska ? reject(greska) : resolve(port)));
    });
  });
}

export function pauza(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function cekajHttp(url, ms = 8000) {
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

export function pokreni(komanda, args, env) {
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

export function ugasi(dete) {
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

export async function otvoriStranu(port) {
  const bin = chromeBin();
  assert.ok(bin, "Chrome nije dostupan za proveru strane");
  const profil = mkdtempSync(path.join(os.tmpdir(), "strana-"));
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
    posalji(method, params) {
      return posalji(method, params, sessionId);
    },
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
