import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { lectures } from "../site/js/lectures.js";
import { primeniPrimer } from "../site/js/primer.js";
import { fajloviStrane, stabloDo } from "../site/js/stablo.js";
import { stranaLekcije, temeLekcija } from "../site/js/teme-lekcija.js";
import { praznaSesija, primeni } from "../site/js/verzija.js";
import { cekajHttp, otvoriStranu, pauza, pokreni, slobodanPort, snimci, ugasi } from "./chrome.mjs";

const koraci = lectures.flatMap((tema) => tema.steps);

function indeksTeme(temaI, korakI) {
  return lectures.slice(0, temaI).reduce((zbir, tema) => zbir + tema.steps.length, 0) + korakI;
}

function indeks(tema, naslov) {
  const i = lectures[tema - 1].steps.findIndex((korak) => korak.naslov === naslov);
  assert.ok(i >= 0, `${tema}/${naslov}`);
  return indeksTeme(tema - 1, i);
}

function bezKraja(tekst) {
  return String(tekst ?? "").replace(/\n$/, "");
}

function isti(stvarno, ocekivano, gde) {
  if (stvarno === ocekivano) return;
  const a = String(stvarno ?? "");
  const b = String(ocekivano ?? "");
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i += 1;
  assert.fail(
    `${gde}: razlika na znaku ${i} (editor ${a.length}, fajl ${b.length})\neditor: ${JSON.stringify(a.slice(Math.max(0, i - 40), i + 80))}\nfajl: ${JSON.stringify(b.slice(Math.max(0, i - 40), i + 80))}`,
  );
}

function dokumentIzLinija(linije) {
  if (!Array.isArray(linije) || !linije.length) return null;
  return linije.map((linija) => linija.tekst).join("\n");
}

function tekstBezObrisanih(linije) {
  if (!Array.isArray(linije) || !linije.length) return null;
  return linije.filter((linija) => linija.tip !== "obrisano").map((linija) => linija.tekst).join("\n");
}

function otvoriPutanju(tema, korakI, putanja, { usko = false } = {}) {
  const indeksKoraka = indeksTeme(tema - 1, korakI);
  const ctx = { koraci, indeks: indeksKoraka, tema, usko };
  const strana = putanja.startsWith("client/") ? "client" : "server";
  const put = putanja.slice(`${strana}/`.length);
  let sesija = praznaSesija();
  sesija = primeni(sesija, { tip: "fokus", putanja, kljuc: `${tema}:${korakI}` }, ctx).sesija;
  if (sesija.strana !== strana) sesija = primeni(sesija, { tip: "strana", strana }, ctx).sesija;
  return { ctx, otvoren: primeni(sesija, { tip: "otvori", put }, ctx) };
}

function otvori(tema, korakI, put, opcije) {
  return otvoriPutanju(tema, korakI, `server/${put}`, opcije);
}

test("HTTP server otvara ceo primer, ne samo isecak handlera", () => {
  const i = indeks(6, "Od programa do HTTP servera");
  const korak = koraci[i];
  const put = "lekcije/36-http-server.js";
  const tema = temeLekcija(lectures).find((stavka) => stavka.id === "tema-6");
  const ocekivano = tema.verzije[put];
  assert.equal(ocekivano, stabloDo(koraci, i).verzije[`client/${put}`]);
  const otvoren = primeniPrimer(
    { id: tema.id, otvoreno: put, verzija: "radna", putanje: tema.fajlovi, verzije: tema.verzije, kljuc: "" },
    {},
    { tip: "otvori", put },
  );
  isti(otvoren.prikaz.editor.tekst, ocekivano, "http-server");
  assert.equal(otvoren.prikaz.editor.putanja, put);
  assert.equal(otvoren.prikaz.fajlovi.includes("lekcije/35-moduli.js"), true);
  assert.equal(otvoren.prikaz.fajlovi.includes("lekcije/34-van-browsera.js"), true);
  assert.equal(otvoren.prikaz.fajlovi.includes("index.html"), false);
  assert.match(ocekivano, /import http from 'node:http'/);
  assert.match(ocekivano, /http\.createServer/);
  assert.match(ocekivano, /res\.end\('Zdravo sa servera'\)/);
  assert.match(ocekivano, /server\.listen\(3000/);
  assert.ok(ocekivano.length > korak.isecak.length);
  const lekcija = primeniPrimer(otvoren.stanje, {}, { tip: "ugradjena" });
  isti(lekcija.prikaz.editor.tekst, ocekivano, "http-server lekcija");
  assert.equal(lekcija.prikaz.editor.samoCitaj, true);
});

test("svaki serverski js na svakom koraku ostaje ceo u editoru", () => {
  let otvoreno = 0;
  const zakljucano = new Map();
  for (let temaI = 0; temaI < lectures.length; temaI += 1) {
    const tema = lectures[temaI];
    for (let korakI = 0; korakI < tema.steps.length; korakI += 1) {
      const indeksKoraka = indeksTeme(temaI, korakI);
      const stablo = stabloDo(koraci, indeksKoraka);
      const fajlovi = fajloviStrane(stablo, "server").filter((put) => put.endsWith(".js"));
      if (!fajlovi.length || tema.n < 5) continue;
      for (const put of fajlovi) {
        const putanja = `server/${put}`;
        const ocekivano = stablo.verzije[putanja] ?? "";
        const { ctx, otvoren } = otvori(tema.n, korakI, put);
        const gde = `T${tema.n} ${tema.steps[korakI].naslov} ${putanja}`;
        assert.equal(otvoren.prikaz.editor.prazno, false, gde);
        assert.equal(otvoren.prikaz.editor.putanja, putanja, gde);
        assert.equal(otvoren.prikaz.editor.linije, null, gde);
        isti(otvoren.prikaz.editor.tekst, ocekivano, gde);
        const usko = primeni(otvoren.sesija, { tip: "ekran" }, { ...ctx, usko: true });
        isti(usko.prikaz.editor.tekst, ocekivano, `${gde} telefon`);
        assert.equal(usko.prikaz.editor.samoCitaj, true, gde);
        const lekcija = primeni(otvoren.sesija, { tip: "ugradjena" }, ctx);
        isti(lekcija.prikaz.editor.tekst, ocekivano, `${gde} lekcija`);
        const bezObrisanih = tekstBezObrisanih(lekcija.prikaz.editor.linije);
        if (bezObrisanih != null) isti(bezObrisanih, bezKraja(ocekivano), `${gde} lekcija linije`);
        const dokument = dokumentIzLinija(lekcija.prikaz.editor.linije);
        if (dokument != null) {
          assert.ok(dokument.length >= bezKraja(ocekivano).length, `${gde} dokument kraći od fajla`);
          for (const linija of bezKraja(ocekivano).split("\n")) {
            if (linija) assert.ok(dokument.includes(linija), `${gde} fali ${JSON.stringify(linija)}`);
          }
        }
        const ranije = zakljucano.get(putanja);
        if (ranije) assert.match(ocekivano, ranije, `${gde} izgubio ${ranije}`);
        const requireHttp = /require\("http"\)/;
        const povratak = /^return \{ status: 500 \};/m;
        if (requireHttp.test(ocekivano)) zakljucano.set(putanja, requireHttp);
        else if (povratak.test(ocekivano)) zakljucano.set(putanja, povratak);
        otvoreno += 1;
      }
    }
  }
  assert.ok(otvoreno > 40, `otvoreno ${otvoreno}`);
});

test("kraj kursa otvara svaki serverski js od početka do kraja", () => {
  const i = koraci.length - 1;
  const tema = lectures.length;
  const korakI = lectures[tema - 1].steps.length - 1;
  const stablo = stabloDo(koraci, i).verzije;
  const tragovi = {
    "server.js": [/nema drugog glasanja/],
    "soba.js": [/type Soba = \{ temperatura: number; ukljucen: boolean \}/],
    "ventilator.js": [/return \{ status: 500 \}/, /teloJeRezim\(telo\)/],
    "baza.js": [/INSERT INTO istorija/, /nije stiglo/],
    "sesija.js": [/KLJUC_POSMATRACA/, /401 → 403 → 400 → 500 → 200/],
  };
  for (const [ime, trag] of Object.entries(tragovi)) {
    const ocekivano = stablo[`server/${ime}`];
    const { otvoren } = otvori(tema, korakI, ime);
    isti(otvoren.prikaz.editor.tekst, ocekivano, ime);
    assert.equal(otvoren.prikaz.editor.tekst.startsWith(ocekivano.slice(0, 24)), true, ime);
    assert.equal(otvoren.prikaz.editor.tekst.endsWith(ocekivano.slice(-24)), true, ime);
    for (const obrazac of trag) assert.match(otvoren.prikaz.editor.tekst, obrazac, ime);
  }
});

function izrazDokumenta() {
  return `(async () => {
    const editor = document.querySelector("#editor");
    const prazno = { putanja: "", tekst: "", linije: 0, uredljiv: "" };
    if (!editor) return prazno;
    const { EditorView } = await import("/vendor/codemirror/codemirror.js");
    const view = EditorView.findFromDOM(editor);
    if (!view) return prazno;
    return {
      putanja: document.querySelector("#putanja")?.textContent || "",
      tekst: view.state.doc.toString(),
      linije: view.state.doc.lines,
      uredljiv: document.querySelector(".cm-content")?.getAttribute("contenteditable") || "",
    };
  })()`;
}

test("editor na strani prikazuje ceo serverski js", { timeout: 90000 }, async (t) => {
  mkdirSync(snimci, { recursive: true });
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
  await strana.posalji("Emulation.setDeviceMetricsOverride", {
    width: 1400,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  async function dokument() {
    return strana.vrednost(izrazDokumenta());
  }

  async function sačekaj(uslov) {
    const kraj = Date.now() + 8000;
    let poslednje;
    while (Date.now() < kraj) {
      poslednje = await dokument();
      if (uslov(poslednje)) return poslednje;
      await pauza(40);
    }
    throw new Error(
      `editor nije stigao: ${JSON.stringify({ putanja: poslednje?.putanja, duzina: poslednje?.tekst?.length, linije: poslednje?.linije })}`,
    );
  }

  function natpis(putanja) {
    if (!putanja.startsWith("client/lekcije/")) return putanja;
    const tema = temeLekcija(lectures).find((stavka) => stavka.fajlovi.includes(putanja.slice("client/".length)));
    return tema ? `${stranaLekcije(tema.id)}/${putanja.slice("client/".length)}` : putanja;
  }

  async function otvoriFajl(tema, korak, putanja, { uredljiv = "true" } = {}) {
    const ocekivano = stabloDo(koraci, indeksTeme(tema - 1, korak - 1)).verzije[putanja];
    await strana.idi(`http://127.0.0.1:${portSajta}/tema/${tema}/k/${korak}/deo/editor/fajl/${putanja}`);
    const ekran = await sačekaj((s) => s.putanja === natpis(putanja) && s.tekst === ocekivano);
    assert.equal(ekran.linije, ocekivano.split("\n").length, putanja);
    assert.equal(ekran.uredljiv, uredljiv, putanja);
    return ekran;
  }

  const httpServer = await otvoriFajl(6, 3, "client/lekcije/36-http-server.js");
  assert.match(httpServer.tekst, /import http from 'node:http'/);
  assert.match(httpServer.tekst, /http\.createServer/);
  assert.match(httpServer.tekst, /res\.end\('Zdravo sa servera'\)/);
  assert.match(httpServer.tekst, /server\.listen\(3000/);
  const slikaCreate = await strana.posalji("Page.captureScreenshot", { format: "png" });
  writeFileSync(path.join(snimci, "server-js-createServer.png"), Buffer.from(slikaCreate.data, "base64"));

  const poslednji = lectures[lectures.length - 1].steps.length;
  const kraj = stabloDo(koraci, koraci.length - 1).verzije;
  for (const ime of ["server.js", "soba.js", "ventilator.js", "baza.js", "sesija.js"]) {
    const ekran = await otvoriFajl(lectures.length, poslednji, `server/${ime}`);
    isti(ekran.tekst, kraj[`server/${ime}`], `strana ${ime}`);
  }

  await strana.vrednost(`document.querySelector("#lekcija").click()`);
  const lekcija = await sačekaj(
    (s) => s.putanja === "server/sesija.js" && s.tekst.includes("KLJUC_POSMATRACA") && s.tekst.includes("401 → 403 → 400 → 500 → 200"),
  );
  const sesija = kraj["server/sesija.js"];
  assert.ok(lekcija.tekst.length >= bezKraja(sesija).length);
  for (const linija of bezKraja(sesija).split("\n")) {
    if (linija) assert.ok(lekcija.tekst.includes(linija), linija);
  }
  assert.equal(lekcija.uredljiv, "false");

  await strana.vrednost(`document.querySelector(".cm-scroller").scrollTop = document.querySelector(".cm-scroller").scrollHeight`);
  await pauza(100);
  const slikaKraj = await strana.posalji("Page.captureScreenshot", { format: "png" });
  writeFileSync(path.join(snimci, "server-js-kraj.png"), Buffer.from(slikaKraj.data, "base64"));

  await strana.posalji("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });
  const ventilator = kraj["server/ventilator.js"];
  await strana.idi(
    `http://127.0.0.1:${portSajta}/tema/${lectures.length}/k/${poslednji}/deo/editor/fajl/server/ventilator.js`,
  );
  const telefon = await sačekaj((s) => s.putanja === "server/ventilator.js" && s.tekst === ventilator);
  assert.equal(telefon.uredljiv, "false");
  assert.equal(telefon.linije, ventilator.split("\n").length);
  const slikaTelefon = await strana.posalji("Page.captureScreenshot", { format: "png" });
  writeFileSync(path.join(snimci, "server-js-telefon.png"), Buffer.from(slikaTelefon.data, "base64"));
});
