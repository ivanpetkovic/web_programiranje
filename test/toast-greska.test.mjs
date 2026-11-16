import assert from "node:assert/strict";
import { copyFileSync, mkdtempSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { cekajHttp, koren, otvoriStranu, pauza, pokreni, slobodanPort, snimci, ugasi } from "./chrome.mjs";

const marker = "DODATNO-POSLE-CUVANJA-1717";

async function stranica(t) {
  const dir = mkdtempSync(path.join(os.tmpdir(), "kurs-toast-"));
  const datoteka = path.join(dir, "kurs.json");
  copyFileSync(path.join(koren, "kursevi/web_programiranje/kurs.json"), datoteka);
  const portSajta = await slobodanPort();
  const portChrome = await slobodanPort();
  const server = pokreni(process.execPath, ["server/server.js"], {
    PORT: String(portSajta),
    KURS_DATOTEKA: datoteka,
    DATABASE_URL: "",
  });
  let strana;
  t.after(() => {
    strana?.zatvori();
    ugasi(server);
  });
  await cekajHttp(`http://127.0.0.1:${portSajta}/`);
  strana = await otvoriStranu(portChrome);
  await strana.posalji("Emulation.setDeviceMetricsOverride", {
    width: 1280,
    height: 800,
    deviceScaleFactor: 1,
    mobile: false,
  });
  return { strana, portSajta, datoteka };
}

async function otvoriDodatno(strana, portSajta) {
  await strana.idi(`http://127.0.0.1:${portSajta}/tema/4/k/1/deo/diskusija/blok/k09q2?edit=true`);
  let spremno = false;
  for (let i = 0; i < 40 && !spremno; i += 1) {
    await pauza(100);
    spremno = await strana.vrednost(`Boolean(document.querySelector(".stanje-ikona"))`);
  }
  assert.equal(spremno, true);
  const otvoren = await strana.vrednost(`(async () => {
    const blok = document.querySelector('.sekcija-lekcije[data-id="k09q2"]');
    blok.querySelector('[aria-label="Opcije sekcije"]').click();
    await new Promise((resolve) => setTimeout(resolve, 40));
    [...blok.querySelectorAll('[role="menuitem"]')].find((dugme) => dugme.textContent.trim() === "Uredi").click();
    await new Promise((resolve) => setTimeout(resolve, 40));
    return Boolean(document.querySelector(".uredjivi-editor-pitalica textarea"));
  })()`);
  assert.equal(otvoren, true);
}

test("izmena dodatnog pitanja 9.2 ostaje sačuvana", { timeout: 40000 }, async (t) => {
  const { strana, portSajta } = await stranica(t);
  await otvoriDodatno(strana, portSajta);
  await strana.vrednost(`(() => {
    const polje = [...document.querySelectorAll(".uredjivi-editor-pitalica textarea")]
      .find((polje) => polje.placeholder.startsWith("Dodatno pitanje"));
    polje.value = ${JSON.stringify(marker)};
    polje.dispatchEvent(new Event("input", { bubbles: true }));
    polje.scrollIntoView({ block: "center" });
  })()`);
  let ikona = "";
  for (let i = 0; i < 40; i += 1) {
    await pauza(100);
    ikona = await strana.vrednost(`document.querySelector(".stanje-ikona")?.getAttribute("aria-label") || ""`);
    if (ikona === "Sačuvano" || (ikona && ikona !== "Nije sačuvano" && ikona !== "Čuvam")) break;
  }
  assert.equal(ikona, "Sačuvano");
  assert.equal(await strana.vrednost(`document.querySelector("#toast-greska")`), null);
  const snimak = await strana.posalji("Page.captureScreenshot", { format: "png" });
  writeFileSync(path.join(snimci, "dodatno-92-sacuvano.png"), Buffer.from(snimak.data, "base64"));
  const dodatno = await strana.vrednost(`fetch("/kurs.json?sveze=" + Date.now(), { cache: "no-store" }).then((odgovor) => odgovor.json()).then((kurs) => kurs.teme[3].steps[0].diskusija.find((blok) => blok.id === "k09q2").dodatno)`);
  assert.equal(dodatno, marker);
});

test("toast greške stoji dole desno, krije detalje i nestaje na klik ili posle 3s", { timeout: 40000 }, async (t) => {
  const { strana, portSajta } = await stranica(t);
  await otvoriDodatno(strana, portSajta);
  await strana.vrednost(`(() => {
    window.__kopirano = [];
    const original = window.fetch.bind(window);
    window.fetch = (url, init = {}) => {
      if (String(url).includes("/api/kurs") && init.method === "PUT") {
        return Promise.resolve(new Response(JSON.stringify({
          greska: "dokument nije kurs",
          detalji: ["kurs/teme/3/steps/0/diskusija/2/oblik: vrednost nije dozvoljena."],
        }), {
          status: 400,
          statusText: "Bad Request",
          headers: { "content-type": "application/json; charset=utf-8" },
        }));
      }
      return original(url, init);
    };
    const clipboard = navigator.clipboard || {};
    clipboard.writeText = (tekst) => {
      window.__kopirano.push(tekst);
      return Promise.resolve();
    };
    navigator.clipboard = clipboard;
  })()`);
  await strana.vrednost(`(() => {
    const polje = [...document.querySelectorAll(".uredjivi-editor-pitalica textarea")]
      .find((polje) => polje.placeholder.startsWith("Dodatno pitanje"));
    polje.value = "toast";
    polje.dispatchEvent(new Event("input", { bubbles: true }));
  })()`);

  let toast = null;
  for (let i = 0; i < 30 && !toast; i += 1) {
    await pauza(100);
    toast = await strana.vrednost(`(() => {
      const el = document.querySelector("#toast-greska");
      if (!el) return null;
      const kutija = el.getBoundingClientRect();
      return {
        tekst: el.querySelector("p")?.textContent || "",
        html: el.innerText,
        oznaka: el.querySelector(".toast-kopiraj")?.getAttribute("aria-label") || "",
        ikona: el.querySelector(".toast-kopiraj use")?.getAttribute("href") || "",
        desno: Math.round(document.documentElement.clientWidth - kutija.right),
        dole: Math.round(document.documentElement.clientHeight - kutija.bottom),
        levoOdSredine: kutija.left > innerWidth / 2,
      };
    })()`);
  }
  assert.ok(toast, "toast nije prikazan");
  assert.match(toast.tekst, /^Tema 4, korak 1, pitanje 9\.2: „izbor” nije dozvoljena vrednost za oblik\./);
  assert.equal(toast.tekst.includes("gradivo"), false);
  assert.equal(toast.tekst.includes("JavaScript"), false);
  assert.equal(toast.tekst.includes("dokument nije kurs"), false);
  assert.equal(toast.html.includes("PUT"), false);
  assert.equal(toast.html.includes("\"detalji\""), false);
  assert.equal(toast.oznaka, "Kopiraj detalje greške");
  assert.equal(toast.ikona, "#copy");
  assert.ok(toast.levoOdSredine);
  assert.ok(toast.desno <= 28 && toast.desno >= 16, `desno ${toast.desno}`);
  assert.ok(toast.dole <= 28 && toast.dole >= 16, `dole ${toast.dole}`);
  const slika = await strana.posalji("Page.captureScreenshot", { format: "png" });
  writeFileSync(path.join(snimci, "toast-greska.png"), Buffer.from(slika.data, "base64"));

  const kopirano = await strana.vrednost(`(async () => {
    document.querySelector(".toast-kopiraj").click();
    await new Promise((resolve) => setTimeout(resolve, 30));
    return {
      tekst: window.__kopirano[0] || "",
      oznaka: document.querySelector(".toast-kopiraj")?.getAttribute("aria-label") || "",
      toast: Boolean(document.querySelector("#toast-greska")),
    };
  })()`);
  assert.match(kopirano.tekst, /PUT \/api\/kurs/);
  assert.match(kopirano.tekst, /HTTP 400 Bad Request/);
  assert.match(kopirano.tekst, /oblik: vrednost nije dozvoljena/);
  assert.match(kopirano.tekst, /"toast"/);
  assert.equal(kopirano.oznaka, "Detalji su kopirani");
  assert.equal(kopirano.toast, true);

  await strana.vrednost(`document.querySelector("#toast-greska p").click()`);
  await pauza(40);
  assert.equal(await strana.vrednost(`Boolean(document.querySelector("#toast-greska"))`), false);

  await strana.vrednost(`(() => {
    const polje = [...document.querySelectorAll(".uredjivi-editor-pitalica textarea")]
      .find((polje) => polje.placeholder.startsWith("Dodatno pitanje"));
    polje.value = "toast-2";
    polje.dispatchEvent(new Event("input", { bubbles: true }));
  })()`);
  let vidljiv = false;
  for (let i = 0; i < 30 && !vidljiv; i += 1) {
    await pauza(50);
    vidljiv = await strana.vrednost(`Boolean(document.querySelector("#toast-greska"))`);
  }
  assert.equal(vidljiv, true);
  await pauza(400);
  assert.equal(await strana.vrednost(`Boolean(document.querySelector("#toast-greska"))`), true);
  await pauza(2800);
  assert.equal(await strana.vrednost(`Boolean(document.querySelector("#toast-greska"))`), false);
});
