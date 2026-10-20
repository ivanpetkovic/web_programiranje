import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { PORUKA, primeniPrikaz } from "../site/js/pregled.js";
import { rezimPosleAkcije, upisPosleAkcije } from "../site/js/birac.js";
import {
  polazniTekst,
  procitajRadne,
  rezimPosleKoraka,
  serverTabVidljiv,
  tekstPrikaza,
  upisiRadnu,
} from "../site/js/radna.js";

const html = fs.readFileSync(new URL("../site/index.html", import.meta.url), "utf8");
const main = fs.readFileSync(new URL("../site/js/main.js", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../site/css/site.css", import.meta.url), "utf8");
const pkg = fs.readFileSync(new URL("../package.json", import.meta.url), "utf8");
const sitePkg = fs.readFileSync(new URL("../site/package.json", import.meta.url), "utf8");

function memorija(baci) {
  const mapa = new Map();
  return {
    getItem(kljuc) {
      return mapa.has(kljuc) ? mapa.get(kljuc) : null;
    },
    setItem(kljuc, vrednost) {
      if (baci) throw new Error("pun");
      mapa.set(kljuc, vrednost);
    },
  };
}

test("codemirror je vendored bez izgradnje sajta", () => {
  const vendor = new URL("../site/vendor/codemirror/codemirror.js", import.meta.url);
  assert.equal(fs.existsSync(vendor), true);
  assert.match(fs.readFileSync(vendor, "utf8"), /EditorView/);
  assert.match(html, /type="importmap"/);
  assert.match(html, /"@codemirror\/view": "\/vendor\/codemirror\/codemirror.js"/);
  assert.equal(pkg.includes('"build"'), false);
  assert.equal(sitePkg.includes('"build"'), false);
});

test("radna verzija je jedna po putanji i preživljava čitanje", () => {
  const skladiste = memorija(false);
  const upis = upisiRadnu(skladiste, {}, "client/index.html", "ukucano");
  assert.equal(upis.sacuvano, true);
  const ponovo = procitajRadne(skladiste);
  assert.equal(ponovo["client/index.html"], "ukucano");
  assert.equal(rezimPosleKoraka(ponovo, "client/index.html"), "radna");
  assert.equal(rezimPosleKoraka(ponovo, "client/css/soba.css"), "original");
  const ekran = tekstPrikaza({
    putanja: "client/index.html",
    original: "original",
    radne: ponovo,
    rezim: "radna",
  });
  assert.equal(ekran.tekst, "ukucano");
  assert.equal(ekran.razlika, false);
  const drugiKorak = tekstPrikaza({
    putanja: "client/index.html",
    original: "drugi original",
    radne: ponovo,
    rezim: rezimPosleKoraka(ponovo, "client/index.html"),
  });
  assert.equal(drugiKorak.tekst, "ukucano");
});

test("reset zameni radnu verziju originalom koraka", () => {
  const skladiste = memorija(false);
  const prvo = upisiRadnu(skladiste, {}, "client/index.html", "ukucano");
  const drugo = upisiRadnu(skladiste, prvo.mapa, "client/css/soba.css", "stil");
  const reset = upisiRadnu(skladiste, drugo.mapa, "client/index.html", "ceo fajl");
  assert.equal(reset.mapa["client/index.html"], "ceo fajl");
  assert.equal(reset.mapa["client/css/soba.css"], "stil");
  const ekran = tekstPrikaza({
    putanja: "client/index.html",
    original: "ceo fajl",
    radne: reset.mapa,
    rezim: "radna",
  });
  assert.equal(ekran.tekst, "ceo fajl");
  assert.equal(fs.readFileSync(new URL("../client/index.html", import.meta.url), "utf8").includes("ukucano"), false);
});

test("prekidač menja prikaz i ne briše mapu", () => {
  const radne = { "client/index.html": "ukucano" };
  const original = tekstPrikaza({
    putanja: "client/index.html",
    original: "ceo fajl",
    radne,
    rezim: "original",
  });
  assert.equal(original.tekst, "ceo fajl");
  assert.equal(original.samoCitaj, true);
  assert.equal(original.razlika, true);
  assert.equal(radne["client/index.html"], "ukucano");
  const radna = tekstPrikaza({
    putanja: "client/index.html",
    original: "ceo fajl",
    radne,
    rezim: "radna",
  });
  assert.equal(radna.tekst, "ukucano");
  assert.equal(radna.razlika, false);
  assert.equal(radne["client/index.html"], "ukucano");
});

test("verzija koraka pobeđuje poslednji fajl sa diska", () => {
  const disk = "<!DOCTYPE html>\n<html lang=\"sr\">\n</html>\n";
  assert.equal(polazniTekst("client/index.html", "client/\nserver/\n", disk), "client/\nserver/\n");
  assert.equal(polazniTekst("client/index.html", "<p>24</p>", disk), "<p>24</p>");
  const cssDisk = '@font-face { font-family: "Digital-7 Mono"; font-style: normal; }\n.digit { font-family: "Digital-7 Mono", monospace; font-style: normal; }\n';
  assert.equal(polazniTekst("client/css/soba.css", ".digit { letter-spacing: 0.08em; }", cssDisk), ".digit { letter-spacing: 0.08em; }");
  assert.equal(polazniTekst("client/css/soba.css", "", cssDisk), cssDisk);
  const sobaCss = fs.readFileSync(new URL("../client/css/soba.css", import.meta.url), "utf8");
  assert.match(sobaCss, /font-family:\s*"Digital-7 Mono"/);
  assert.match(sobaCss, /font-style:\s*normal/);
  assert.match(sobaCss, /url\("\/client\/assets\/fonts\/digital-7\/digital-7%20\(mono\)\.ttf"\)/);
  const font = tekstPrikaza({
    putanja: "client/assets/fonts/digital-7/digital-7 (mono).ttf",
    original: "Binarni fajl. Pregledač ga učitava kao fajl, ne kao tekst.",
    radne: { "client/assets/fonts/digital-7/digital-7 (mono).ttf": "izmena" },
    rezim: "radna",
    binarni: true,
  });
  assert.equal(font.samoCitaj, true);
  assert.equal(font.tekst.includes("izmena"), false);
  assert.match(font.tekst, /Binarni fajl/);
  const prazna = tekstPrikaza({
    putanja: "client/css/soba.css",
    original: cssDisk,
    radne: { "client/css/soba.css": "" },
    rezim: "radna",
  });
  assert.equal(prazna.tekst, cssDisk);
  assert.match(main, /rezim = "radna"/);
  assert.match(main, /stabloDo\(/);
  assert.equal(main.includes("/api/stablo"), false);
  assert.equal(main.includes("polazniTekst"), false);
  assert.match(main, /editor-pun/);
  assert.match(css, /body\.editor-pun \.okvir\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/);
  assert.match(css, /body\.editor-pun #nav,\s*body\.editor-pun #kartica\s*\{[^}]*display:\s*none/);
});

test("dok fajl nije dirnut oba prikaza nose original", () => {
  const radne = {};
  for (const rezim of ["original", "radna"]) {
    const ekran = tekstPrikaza({
      putanja: "client/index.html",
      original: "ceo fajl",
      radne,
      rezim,
    });
    assert.equal(ekran.tekst, "ceo fajl");
  }
});

test("tab Server čeka četvrtu nedelju", () => {
  assert.equal(serverTabVidljiv(1), false);
  assert.equal(serverTabVidljiv(3), false);
  assert.equal(serverTabVidljiv(4), true);
  assert.match(main, /serverTabVidljiv\(cas\)/);
  assert.match(html, />Klijent</);
  assert.match(html, />Server</);
});

test("nema dugmadi za upis fajla na disk", () => {
  assert.equal(html.includes('id="sacuvaj"'), false);
  assert.equal(html.includes('id="povrati"'), false);
  assert.match(html, /id="sacuvaj-radnu"/);
  assert.equal(html.includes(">Povrati<"), false);
  assert.equal(upisPosleAkcije("ucitaj", "radna"), false);
  assert.equal(rezimPosleAkcije("ucitaj", "radna"), "original");
  assert.equal(upisPosleAkcije("sacuvaj", "original"), false);
  assert.equal(rezimPosleAkcije("sacuvaj", "original"), "original");
  const ucitaj = main.slice(main.indexOf("function ucitajLekciju"), main.indexOf("function sacuvajRadnu"));
  assert.equal(ucitaj.includes("upisiRadnu"), false);
  assert.match(main, /if \(!upisPosleAkcije\("sacuvaj", rezim\)\) return/);
  assert.equal(html.includes("<textarea"), false);
  assert.match(html, /id="verzija"/);
  assert.match(html, /id="reset-radne"/);
  assert.match(html, /Resetuj radnu verziju/);
  assert.match(main, /Prikaži ugrađenu verziju/);
  assert.match(main, /Prikaži radnu verziju/);
  assert.match(main, /dugmeReseta\.addEventListener\("click"/);
  assert.match(main, /upisiRadnu\(localStorage/);
  assert.equal(main.includes("/api/fajl/povrati"), false);
  assert.equal(main.includes('fetch("/api/fajl"'), false);
  assert.match(css, /\.editor\s*\{[^}]*min-width:\s*0/);
  assert.match(css, /\.cm-editor\s*\{[^}]*width:\s*100%/);
});

test("klijentski bafer ne čuva fajl, serverski ne crta sobu", () => {
  const stanje = { crtez: { cifra: "24", naslov: "Soba", dugme: "Uključi" }, stil: "", trajanje: "1.2s" };
  const htmlPrikaz = primeniPrikaz(stanje, {
    strana: "client",
    put: "index.html",
    tekst: '<p class="digit">10</p><h1>Soba prekidača</h1>',
  });
  assert.equal(htmlPrikaz.sacuvanFajl, false);
  assert.equal(htmlPrikaz.crtez.cifra, "10");
  assert.equal(htmlPrikaz.crtez.naslov, "Soba prekidača");
  const stil = primeniPrikaz(stanje, {
    strana: "client",
    put: "css/soba.css",
    tekst: ".digit { letter-spacing: 0.2em; }\n.blades.spin { animation-duration: 3s; }",
  });
  assert.equal(stil.sacuvanFajl, false);
  assert.match(stil.stil, /letter-spacing: 0\.2em/);
  assert.equal(stil.trajanje, "3s");
  assert.equal(stil.crtez.cifra, "24");
  const bacen = primeniPrikaz(stanje, {
    strana: "client",
    put: "js/niz.js",
    tekst: "throw new Error('ne valja');",
  });
  assert.equal(bacen.poruka, PORUKA);
  assert.equal(bacen.crtao, false);
  assert.equal(bacen.crtez.cifra, "24");
  assert.equal(bacen.sacuvanFajl, false);
  const server = primeniPrikaz(stanje, {
    strana: "server",
    put: "soba.js",
    tekst: "crtez.cifra = '1';\nfunction rukovalac() { return 1; }",
  });
  assert.equal(server.crtao, false);
  assert.equal(server.crtez.cifra, "24");
  assert.equal(server.sacuvanFajl, false);
  assert.equal(server.poruka, "");
});

test("neuspeo upis ostaje u mapi za ovu stranicu", () => {
  const skladiste = memorija(true);
  const upis = upisiRadnu(skladiste, { "client/css/soba.css": "staro" }, "client/index.html", "novo");
  assert.equal(upis.sacuvano, false);
  assert.equal(upis.mapa["client/index.html"], "novo");
  assert.equal(upis.mapa["client/css/soba.css"], "staro");
  assert.match(main, /Browser nije sačuvao radnu verziju/);
});
