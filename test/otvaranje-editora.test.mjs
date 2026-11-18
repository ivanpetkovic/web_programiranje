import assert from "node:assert/strict";
import { createRequire } from "node:module";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { lectures } from "../site/js/lectures.js";
import { primeniPrimer } from "../site/js/primer.js";
import { fajloviStrane, stabloDo } from "../site/js/stablo.js";
import { praznaSesija, primeni } from "../site/js/verzija.js";
import { cekajHttp, otvoriStranu, pauza, pokreni, slobodanPort, snimci, ugasi } from "./chrome.mjs";
import { mkdirSync, writeFileSync } from "node:fs";

const require = createRequire(import.meta.url);
const { spisakPrimera, ucitajPrimer } = require("../server/primeri.js");

const koren = fileURLToPath(new URL("..", import.meta.url));
const koraci = lectures.flatMap((tema) => tema.steps);
const primeriKoren = path.join(koren, "primeri");

function indeksTeme(temaI, korakI) {
  return lectures.slice(0, temaI).reduce((zbir, tema) => zbir + tema.steps.length, 0) + korakI;
}

function bezKraja(tekst) {
  return String(tekst ?? "").replace(/\n$/, "");
}

function dokumentEditora({ tekst, linije }) {
  const izLinija = Array.isArray(linije) && linije.length ? linije.map((linija) => linija.tekst).join("\n") : "";
  return izLinija || tekst || "";
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

function trenutniTekst(linije) {
  if (!Array.isArray(linije) || !linije.length) return null;
  return linije.filter((linija) => linija.tip !== "obrisano").map((linija) => linija.tekst).join("\n");
}

function kontekst(indeks, tema) {
  return { koraci, indeks, tema };
}

test("index.html ostaje ceo dokument od stranice do kraja kursa", () => {
  let videoDoctype = false;
  let videoNaslov = false;
  let videoBroj = false;
  let videoDugme = false;
  let videoStil = false;
  for (let i = 0; i < koraci.length; i += 1) {
    const html = stabloDo(koraci, i).verzije["client/index.html"] || "";
    if (!html) continue;
    if (html.includes("<!DOCTYPE html>")) videoDoctype = true;
    if (html.includes("<h1>Soba prekidača</h1>")) videoNaslov = true;
    if (html.includes('class="digit"')) videoBroj = true;
    if (html.includes("<button")) videoDugme = true;
    if (html.includes('href="css/soba.css"')) videoStil = true;
    if (!videoDoctype) continue;
    assert.match(html, /<!DOCTYPE html>/, koraci[i].naslov);
    assert.match(html, /<html\b/, koraci[i].naslov);
    if (videoNaslov) assert.match(html, /<h1>Soba prekidača<\/h1>/, koraci[i].naslov);
    if (videoBroj) assert.match(html, /class="digit"/, koraci[i].naslov);
    if (videoDugme) assert.match(html, /<button/, koraci[i].naslov);
    if (videoStil) assert.match(html, /href="css\/soba\.css"/, koraci[i].naslov);
  }
  const dev = stabloDo(koraci, koraci.findIndex((korak) => korak.naslov === "Dev alati")).verzije["client/index.html"];
  assert.match(dev, /<!DOCTYPE html>/);
  assert.match(dev, /<h1>Soba prekidača<\/h1>/);
  assert.match(dev, /prikaz može da kaže 10/);
  const semantika = stabloDo(koraci, koraci.findIndex((korak) => korak.naslov === "Semantika")).verzije["client/index.html"];
  assert.match(semantika, /nema \/api\/soba/);
  assert.match(semantika, /naslov je h1/);
  assert.equal(semantika.includes("<script"), false);
  const kraj = stabloDo(koraci, koraci.length - 1).verzije["client/index.html"];
  assert.match(kraj, /<!DOCTYPE html>/);
  assert.match(kraj, /gde je pravo/);
  assert.match(kraj, /šta ćutanje ne dokazuje/);
});

test("svaki fajl svake teme i koraka otvara se u editoru u celosti", () => {
  let sesija = praznaSesija();
  let otvoreno = 0;
  for (let temaI = 0; temaI < lectures.length; temaI += 1) {
    const tema = lectures[temaI];
    for (let korakI = 0; korakI < tema.steps.length; korakI += 1) {
      const indeks = indeksTeme(temaI, korakI);
      const korak = tema.steps[korakI];
      const stablo = stabloDo(koraci, indeks);
      const ctx = kontekst(indeks, tema.n);
      const fokus = primeni(sesija, { tip: "fokus", putanja: korak.putanja || "", kljuc: `${tema.n}:${korakI}` }, ctx);
      sesija = fokus.sesija;
      const strane = ["client"];
      if (tema.n >= 5) strane.push("server");
      for (const strana of strane) {
        if (sesija.strana !== strana) {
          sesija = primeni(sesija, { tip: "strana", strana }, ctx).sesija;
        }
        const lista = primeni(sesija, { tip: "strana", strana }, ctx).prikaz.fajlovi;
        assert.equal(lista.some((put) => put.startsWith("lekcije/")), false, `T${tema.n} ${korak.naslov}`);
        for (const put of lista) {
          const otvoren = primeni(sesija, { tip: "otvori", put }, ctx);
          const putanja = `${strana}/${put}`;
          const ocekivano = stablo.verzije[putanja] ?? "";
          const gde = `T${tema.n} ${korak.naslov} ${putanja}`;
          assert.equal(otvoren.prikaz.editor.prazno, false, gde);
          assert.equal(otvoren.prikaz.editor.putanja, putanja, gde);
          assert.equal(otvoren.prikaz.editor.linije, null, gde);
          isti(otvoren.prikaz.editor.tekst, ocekivano, gde);
          isti(dokumentEditora(otvoren.prikaz.editor), ocekivano, gde);
          const lekcija = primeni(otvoren.sesija, { tip: "ugradjena" }, ctx);
          isti(lekcija.prikaz.editor.tekst, ocekivano, `${gde} lekcija`);
          const sadrzaj = trenutniTekst(lekcija.prikaz.editor.linije);
          if (sadrzaj != null) isti(sadrzaj, bezKraja(ocekivano), `${gde} lekcija linije`);
          sesija = primeni(lekcija.sesija, { tip: "radna" }, ctx).sesija;
          otvoreno += 1;
        }
      }
    }
  }
  assert.ok(otvoreno > 100, `otvoreno ${otvoreno}`);
});

test("svaki fajl primera sa diska otvara se u editoru", () => {
  const spisak = spisakPrimera(primeriKoren).filter((primer) => primer.id !== "kontrolna-soba");
  assert.deepEqual(spisak.map((primer) => primer.id), ["7_tipovi"]);
  let otvoreno = 0;
  for (const stavka of spisak) {
    const primer = ucitajPrimer(primeriKoren, stavka.id);
    assert.ok(primer.fajlovi.length > 0, stavka.id);
    let stanje = {
      id: primer.id,
      otvoreno: "",
      verzija: "radna",
      putanje: primer.fajlovi,
      verzije: primer.verzije,
      kljuc: "",
    };
    for (const put of primer.fajlovi) {
      const otvoren = primeniPrimer(stanje, {}, { tip: "otvori", put });
      assert.equal(otvoren.prikaz.editor.putanja, put, `${stavka.id}/${put}`);
      isti(otvoren.prikaz.editor.tekst, primer.verzije[put], `${stavka.id}/${put}`);
      isti(dokumentEditora(otvoren.prikaz.editor), primer.verzije[put], `${stavka.id}/${put}`);
      assert.equal(otvoren.prikaz.editor.linije, null, `${stavka.id}/${put}`);
      stanje = otvoren.stanje;
      otvoreno += 1;
    }
  }
  assert.ok(otvoreno >= 11, `otvoreno ${otvoreno}`);
});

function klikNaKorak(naslov) {
  return `(() => {
    const dugme = [...document.querySelectorAll("#birac-meni button")].find((b) => b.textContent.endsWith(" " + ${JSON.stringify(naslov)}));
    if (!dugme) throw new Error("nema koraka " + ${JSON.stringify(naslov)});
    dugme.click();
  })()`;
}

function klikNaFajl(put) {
  return `(() => {
    const dugme = [...document.querySelectorAll("#tree button")].find((b) => b.dataset.put === ${JSON.stringify(put)});
    if (!dugme) throw new Error("nema fajla " + ${JSON.stringify(put)});
    dugme.click();
  })()`;
}

test("editor na strani prikazuje ceo index.html i ostale fajlove teme", { timeout: 90000 }, async (t) => {
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
  await strana.idi(`http://127.0.0.1:${portSajta}/#cas-2`);
  await strana.vrednost(`document.querySelector("#tab-editor").click()`);

  async function dokument() {
    return strana.vrednost(`(async () => {
      const prazno = { putanja: "", otvoren: "", tekst: "", fajlovi: [] };
      const editor = document.querySelector("#editor");
      if (!editor) return prazno;
      const { EditorView } = await import("/vendor/codemirror/codemirror.js");
      const view = EditorView.findFromDOM(editor);
      if (!view) return prazno;
      const otvoren = document.querySelector("#tree button[aria-current='true']");
      return {
        putanja: document.querySelector("#putanja")?.textContent || "",
        otvoren: otvoren?.dataset.put || "",
        tekst: view.state.doc.toString(),
        fajlovi: [...document.querySelectorAll("#tree button")].map((dugme) => dugme.dataset.put),
      };
    })()`);
  }

  async function pokusaj(izraz) {
    const kraj = Date.now() + 8000;
    let greska;
    while (Date.now() < kraj) {
      try {
        await strana.vrednost(izraz);
        return;
      } catch (e) {
        greska = e;
        await pauza(40);
      }
    }
    throw greska;
  }

  async function sačekaj(uslov) {
    const kraj = Date.now() + 8000;
    let poslednje;
    while (Date.now() < kraj) {
      poslednje = await dokument();
      if (uslov(poslednje)) return poslednje;
      await pauza(40);
    }
    throw new Error(`editor nije stigao: ${JSON.stringify({ putanja: poslednje?.putanja, otvoren: poslednje?.otvoren, duzina: poslednje?.tekst?.length })}`);
  }

  await sačekaj((s) => s.fajlovi.length > 0);

  const tema = lectures[1];
  for (let korakI = 0; korakI < tema.steps.length; korakI += 1) {
    const korak = tema.steps[korakI];
    const indeks = indeksTeme(1, korakI);
    const stablo = stabloDo(koraci, indeks);
    await pokusaj(klikNaKorak(korak.naslov));
    await pokusaj(`document.querySelector("#moj-kod").click()`);
    const fajlovi = fajloviStrane(stablo, "client");
    for (const put of fajlovi) {
      await pokusaj(klikNaFajl(put));
      const ocekivano = stablo.verzije[`client/${put}`];
      const ekran = await sačekaj((s) => s.putanja === `client/${put}` && s.otvoren === put && s.tekst === ocekivano);
      isti(ekran.tekst, ocekivano, `T2 ${korak.naslov} ${put}`);
      if (korak.naslov === "Dev alati" && put === "index.html") {
        assert.match(ekran.tekst, /<!DOCTYPE html>/);
        assert.match(ekran.tekst, /<h1>Soba prekidača<\/h1>/);
        assert.match(ekran.tekst, /class="digit"/);
        assert.match(ekran.tekst, /<button/);
        const slika = await strana.posalji("Page.captureScreenshot", { format: "png" });
        writeFileSync(path.join(snimci, "editor-index-html.png"), Buffer.from(slika.data, "base64"));
      }
    }
  }

  await strana.idi(`http://127.0.0.1:${portSajta}/#cas-12`);
  await pokusaj(`document.querySelector("#tab-editor").click()`);
  await pokusaj(klikNaKorak("Izlaz"));
  await pokusaj(`document.querySelector("#moj-kod").click()`);
  const ocekivaniIzlaz = stabloDo(koraci, koraci.findIndex((korak) => korak.naslov === "Izlaz")).verzije["client/index.html"];
  const izlaz = await sačekaj((s) => s.putanja === "client/index.html" && s.tekst.includes("gde je pravo"));
  isti(izlaz.tekst, ocekivaniIzlaz, "Izlaz index.html");
  assert.match(izlaz.tekst, /<!DOCTYPE html>/);
  assert.match(izlaz.tekst, /<h1>Soba prekidača<\/h1>/);
});
