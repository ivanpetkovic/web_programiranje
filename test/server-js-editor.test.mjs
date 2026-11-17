import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { lectures } from "../site/js/lectures.js";
import { fajloviStrane, stabloDo } from "../site/js/stablo.js";
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

function otvori(tema, korakI, put, { usko = false } = {}) {
  const indeksKoraka = indeksTeme(tema - 1, korakI);
  const ctx = { koraci, indeks: indeksKoraka, tema, usko };
  let sesija = praznaSesija();
  sesija = primeni(sesija, { tip: "fokus", putanja: `server/${put}`, kljuc: `${tema}:${korakI}` }, ctx).sesija;
  if (sesija.strana !== "server") sesija = primeni(sesija, { tip: "strana", strana: "server" }, ctx).sesija;
  return { ctx, otvoren: primeni(sesija, { tip: "otvori", put }, ctx) };
}

test("createServer otvara ceo original, ne samo isecak", () => {
  const i = indeks(6, "createServer");
  const korak = koraci[i];
  const ocekivano = stabloDo(koraci, i).verzije["server/server.js"];
  const { otvoren } = otvori(6, i - indeksTeme(5, 0), "server.js");
  isti(otvoren.prikaz.editor.tekst, ocekivano, "createServer");
  assert.equal(otvoren.prikaz.editor.putanja, "server/server.js");
  assert.equal(otvoren.prikaz.editor.linije, null);
  assert.match(ocekivano, /^const http = require\("http"\);\nconst server = http\.createServer\(obrada\);\n$/);
  assert.notEqual(ocekivano.trim(), korak.delic.trim());
  assert.match(otvoren.prikaz.editor.tekst, /require\("http"\)/);
  assert.match(otvoren.prikaz.editor.tekst, /http\.createServer\(obrada\)/);
});

test("listen zadržava require i dodaje listen", () => {
  const i = indeks(6, "listen");
  const ocekivano = stabloDo(koraci, i).verzije["server/server.js"];
  const { ctx, otvoren } = otvori(6, i - indeksTeme(5, 0), "server.js");
  isti(otvoren.prikaz.editor.tekst, ocekivano, "listen");
  assert.match(ocekivano, /require\("http"\)/);
  assert.match(ocekivano, /http\.createServer\(obrada\)/);
  assert.match(ocekivano, /server\.listen\(8787\);/);
  const lekcija = primeni(otvoren.sesija, { tip: "ugradjena" }, ctx);
  isti(lekcija.prikaz.editor.tekst, ocekivano, "listen lekcija");
  isti(tekstBezObrisanih(lekcija.prikaz.editor.linije), bezKraja(ocekivano), "listen linije");
  const dokument = dokumentIzLinija(lekcija.prikaz.editor.linije);
  assert.ok(dokument.length >= bezKraja(ocekivano).length, "listen dokument");
  assert.match(dokument, /require\("http"\)/);
  assert.match(dokument, /server\.listen\(8787\);/);
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
    "server.js": [/require\("http"\)/, /server\.listen\(8787\);/, /nema drugog glasanja/],
    "soba.js": [/putanja !== "\/api\/soba"/, /type Soba = \{ temperatura: number; ukljucen: boolean \}/],
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

  async function otvoriFajl(tema, korak, ime) {
    const ocekivano = stabloDo(koraci, indeksTeme(tema - 1, korak - 1)).verzije[`server/${ime}`];
    await strana.idi(`http://127.0.0.1:${portSajta}/tema/${tema}/k/${korak}/deo/editor/fajl/server/${ime}`);
    const ekran = await sačekaj((s) => s.putanja === `server/${ime}` && s.tekst === ocekivano);
    assert.equal(ekran.linije, ocekivano.split("\n").length, ime);
    assert.equal(ekran.uredljiv, "true", ime);
    return ekran;
  }

  const create = await otvoriFajl(6, 7, "server.js");
  assert.match(create.tekst, /^const http = require\("http"\);\nconst server = http\.createServer\(obrada\);\n$/);
  const slikaCreate = await strana.posalji("Page.captureScreenshot", { format: "png" });
  writeFileSync(path.join(snimci, "server-js-createServer.png"), Buffer.from(slikaCreate.data, "base64"));

  const listen = await otvoriFajl(6, 8, "server.js");
  assert.match(listen.tekst, /require\("http"\)/);
  assert.match(listen.tekst, /http\.createServer\(obrada\)/);
  assert.match(listen.tekst, /server\.listen\(8787\);/);

  const poslednji = lectures[lectures.length - 1].steps.length;
  const kraj = stabloDo(koraci, koraci.length - 1).verzije;
  for (const ime of ["server.js", "soba.js", "ventilator.js", "baza.js", "sesija.js"]) {
    const ekran = await otvoriFajl(lectures.length, poslednji, ime);
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
