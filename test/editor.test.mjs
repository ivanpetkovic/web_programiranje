import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import vm from "node:vm";
import { PORUKA, mostKonzole, porukaKonzole, primeniPrikaz, sakrivenoUSobi, sklopiDokument, tekstoviServera, ubaciMostKonzole } from "../site/js/pregled.js";
import {
  imaRadnu,
  polazniTekst,
  procitajRadne,
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
  assert.equal(imaRadnu(ponovo, "client/index.html"), true);
  assert.equal(imaRadnu(ponovo, "client/css/soba.css"), false);
  const ekran = tekstPrikaza({
    putanja: "client/index.html",
    original: "original",
    radne: ponovo,
    verzija: "radna",
  });
  assert.equal(ekran.tekst, "ukucano");
  assert.equal(ekran.razlika, false);
  const drugiKorak = tekstPrikaza({
    putanja: "client/index.html",
    original: "drugi original",
    radne: ponovo,
    verzija: "radna",
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
    verzija: "radna",
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
    verzija: "ugradjena",
  });
  assert.equal(original.tekst, "ceo fajl");
  assert.equal(original.samoCitaj, true);
  assert.equal(original.razlika, true);
  assert.equal(radne["client/index.html"], "ukucano");
  const radna = tekstPrikaza({
    putanja: "client/index.html",
    original: "ceo fajl",
    radne,
    verzija: "radna",
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
    verzija: "radna",
    binarni: true,
  });
  assert.equal(font.samoCitaj, true);
  assert.equal(font.tekst.includes("izmena"), false);
  assert.match(font.tekst, /Binarni fajl/);
  const prazna = tekstPrikaza({
    putanja: "client/css/soba.css",
    original: cssDisk,
    radne: { "client/css/soba.css": "" },
    verzija: "radna",
  });
  assert.equal(prazna.tekst, cssDisk);
  assert.equal(main.includes("rezim"), false);
  assert.match(fs.readFileSync(new URL("../site/js/verzija.js", import.meta.url), "utf8"), /stabloDo\(/);
  assert.equal(main.includes("/api/stablo"), false);
  assert.equal(main.includes("polazniTekst"), false);
  assert.match(main, /editor-pun/);
  assert.match(css, /body\.editor-pun \.okvir\s*\{[^}]*grid-template-columns:\s*17rem minmax\(0,\s*1fr\)/);
  assert.match(css, /body\.editor-pun #kartica\s*\{[^}]*display:\s*none/);
  assert.equal(/body\.editor-pun #nav/.test(css), false);
});

test("dok fajl nije dirnut oba prikaza nose original", () => {
  const radne = {};
  for (const verzija of ["ugradjena", "radna"]) {
    const ekran = tekstPrikaza({
      putanja: "client/index.html",
      original: "ceo fajl",
      radne,
      verzija,
    });
    assert.equal(ekran.tekst, "ceo fajl");
  }
});

test("tab Server čeka petu nedelju", () => {
  assert.equal(serverTabVidljiv(1), false);
  assert.equal(serverTabVidljiv(4), false);
  assert.equal(serverTabVidljiv(5), true);
  assert.match(main, /serverTabVidljiv\(cas\)/);
  assert.equal(main.includes("displejSobe.crtaj"), false);
  assert.equal(main.includes('if (cas < 3) displejSobe.crtaj("24")'), false);
  assert.match(html, />Klijent</);
  assert.match(html, />Server</);
});

test("nema dugmadi za upis fajla na disk", () => {
  assert.equal(html.includes('id="sacuvaj"'), false);
  assert.equal(html.includes('id="povrati"'), false);
  assert.match(html, /id="sacuvaj-radnu"/);
  assert.equal(html.includes(">Povrati<"), false);
  const ucitaj = main.slice(main.indexOf("function ucitajLekciju"), main.indexOf("function sacuvajRadnu"));
  assert.equal(ucitaj.includes("upisiRadnu"), false);
  assert.match(ucitaj, /tip: "ucitaj"/);
  assert.equal(html.includes("<textarea"), false);
  assert.equal(html.includes('id="verzija"'), false);
  assert.equal(html.includes('id="reset-radne"'), false);
  assert.match(main, /querySelector\("#resetuj"\)\.addEventListener\("click", resetujRadnu\)/);
  assert.match(main, /querySelector\("#moj-kod"\)\.addEventListener\("click"/);
  assert.match(main, /querySelector\("#lekcija"\)\.addEventListener\("click"/);
  assert.match(main, /upisiRadnu\(localStorage/);
  assert.equal(main.includes("/api/fajl/povrati"), false);
  assert.match(main, /fetch\("\/api\/fajl"/);
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
  assert.equal(htmlPrikaz.crtez.dugme, undefined);
  const prazan = primeniPrikaz(stanje, { strana: "client", put: "index.html", tekst: "" });
  assert.equal(prazan.crtao, true);
  assert.equal(prazan.crtez.cifra, undefined);
  assert.equal(prazan.crtez.naslov, undefined);
  assert.equal(prazan.crtez.dugme, undefined);
  assert.deepEqual(sakrivenoUSobi(prazan.crtez), { naslov: true, cifra: true, dugme: true });
  const skica = primeniPrikaz(stanje, { strana: "client", put: "index.html", tekst: "client/\nserver/\n" });
  assert.equal(skica.crtez.naslov, undefined);
  assert.equal(skica.crtez.cifra, undefined);
  const saDugmetom = tekstPrikaza({
    putanja: "client/index.html",
    original: "<p class=\"digit\">24</p>",
    radne: { "client/index.html": "client/\nserver/\n" },
    verzija: "radna",
  });
  assert.equal(saDugmetom.tekst, "<p class=\"digit\">24</p>");
  const prazanFajl = tekstPrikaza({
    putanja: "client/index.html",
    original: "",
    radne: {},
    verzija: "radna",
  });
  assert.equal(prazanFajl.tekst, "");
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

test("lekcija i moj kod biraju serverski tekst", () => {
  const verzije = {
    "server/soba.js": "snimak sobe",
    "server/ventilator.js": "snimak ventilatora",
    "server/server.js": "skica servera",
    "server/baza.js": "skica baze",
    "client/index.html": "<p>klijent</p>",
  };
  const lekcija = tekstoviServera(verzije, { "server/soba.js": "moj kod sobe" }, "ugradjena");
  assert.equal(lekcija["server/soba.js"], "snimak sobe");
  assert.equal(lekcija["server/ventilator.js"], "snimak ventilatora");
  assert.equal(lekcija["server/server.js"], undefined);
  assert.equal(lekcija["server/baza.js"], undefined);
  assert.equal(lekcija["client/index.html"], undefined);
  const moj = tekstoviServera(verzije, { "server/soba.js": "moj kod sobe" }, "radna");
  assert.equal(moj["server/soba.js"], "moj kod sobe");
  assert.equal(moj["server/ventilator.js"], "snimak ventilatora");
  assert.equal(main.includes("new Function"), false);
  assert.match(fs.readFileSync(new URL("../site/js/verzija.js", import.meta.url), "utf8"), /tekstoviServera\(/);
  const server = fs.readFileSync(new URL("../server/server.js", import.meta.url), "utf8");
  const sacuvaj = server.slice(server.indexOf("async function sacuvajFajl"), server.indexOf("async function povratiFajl"));
  const provera = sacuvaj.indexOf("sintaksaJeIspravna");
  const upis = sacuvaj.indexOf("writeFileSync");
  assert.ok(provera >= 0 && upis > provera);
});

test("pregled je iframe pored sobe mašina", () => {
  assert.match(html, /<p id="editor-napomena" hidden><\/p>/);
  assert.match(html, /<iframe id="pregled-strana"/);
  assert.match(html, /id="soba-masina"/);
  assert.equal(html.includes('id="soba-prekidaca"'), false);
  assert.match(css, /#pregled-strana\s*\{[^}]*width:\s*100%/);
  assert.match(css, /#pregled-strana\s*\{[^}]*height:\s*100%/);
  assert.match(html, /<p id="pregled-adresa"><\/p>/);
  assert.equal(html.includes('id="pregled-adresa"') && html.includes("<input id=\"pregled-adresa\""), false);
});

test("sklop dokumenta nosi dodatni element i stil iz mape", () => {
  const adrese = new Map();
  let n = 0;
  function napravi(tekst) {
    const id = `blob:test/${n++}`;
    adrese.set(id, tekst);
    return id;
  }
  const html = sklopiDokument(
    {
      "client/index.html": '<link rel="stylesheet" href="css/soba.css"><p>dodat</p><script src="js/korak.js"></script><script src="js/niz.js"></script><script>fetch("/api/soba")</script>',
      "client/js/korak.js": "let korak = 1;",
      "client/js/niz.js": "let niz = [];",
      "client/css/soba.css": '.digit{color:red} .fan{background:url("/client/assets/fonts/a.ttf")}',
    },
    napravi,
  );
  assert.match(html, /<p>dodat<\/p>/);
  assert.equal(html.includes("css/soba.css"), false);
  assert.match(html, /\/api\/soba/);
  const href = html.match(/href="([^"]+)"/)[1];
  const skriptovi = [...html.matchAll(/src="([^"]+)"/g)].map((pogodak) => pogodak[1]);
  assert.equal(skriptovi.length, 2);
  assert.equal(adrese.get(skriptovi[0]), "let korak = 1;");
  assert.equal(adrese.get(skriptovi[1]), "let niz = [];");
  assert.match(adrese.get(href), /color:red/);
  assert.match(adrese.get(href), /\/client\/assets\/fonts\/a\.ttf/);
  const bez = sklopiDokument({ "client/index.html": '<link href="css/soba.css">' }, napravi);
  assert.equal(bez.includes("css/soba.css"), false);
  assert.equal(bez.includes("/client/css/soba.css"), false);
  assert.equal(sklopiDokument({}), "");
  assert.equal(sklopiDokument({ "client/index.html": "  " }), "");
});

test("modul u pregledu uvozi susedni fajl preko blob adrese", () => {
  const adrese = new Map();
  let n = 0;
  function napravi(tekst) {
    const id = `blob:test/${n++}`;
    adrese.set(id, tekst);
    return id;
  }
  const html = sklopiDokument(
    {
      "index.html": '<script type="module" src="./src/props/main.js"></script>',
      "src/props/main.js": 'import { Proizvod } from "./props.js";\n',
      "src/props/props.js": "export class Proizvod {}\n",
      "src/firma.js": 'import { Radnik } from "./firma/radnik.js";\n',
      "src/firma/radnik.js": "export class Radnik {}\n",
    },
    napravi,
  );
  assert.match(html, /type="module"/);
  assert.equal(html.includes("./src/props/main.js"), false);
  assert.equal(html.includes("./props.js"), false);
  const src = html.match(/src="([^"]+)"/)[1];
  assert.equal(adrese.get(src), 'import { Proizvod } from "blob:test/0";\n');
  assert.equal(adrese.get("blob:test/0"), "export class Proizvod {}\n");
  const klasican = sklopiDokument(
    {
      "index.html": '<script src="js/korak.js"></script>',
      "js/korak.js": 'import { x } from "./nema.js";\nconst a = 1;\n',
    },
    napravi,
  );
  assert.equal(klasican.includes("importmap"), false);
  assert.match(klasican, /src="blob:test\/2"/);
  assert.match(adrese.get("blob:test/2"), /import \{ x \} from "\.\/nema\.js"/);
});

test("most konzole javlja ispis, grešku i odbijanje", () => {
  const most = mostKonzole(4);
  assert.equal(most.toLowerCase().includes("</script"), false);
  const ugradjen = ubaciMostKonzole("<!DOCTYPE html>\n<html><body><p>dodat</p></body></html>", 4);
  const telo = ugradjen.match(/<script>([\s\S]*?)<\/script>/)[1];
  assert.equal(telo.includes("\n"), false);
  const poruke = [];
  const slusaci = {};
  const window = {
    addEventListener(tip, fn) {
      slusaci[tip] = fn;
    },
  };
  const konzola = {
    log() {},
    info() {},
    warn() {},
    error() {},
    debug() {},
    clear() {},
  };
  const parent = {
    postMessage(data) {
      poruke.push(data);
    },
  };
  const context = vm.createContext({
    window,
    parent,
    console: konzola,
    location: { origin: "http://cas.test" },
    JSON,
    Error,
    String,
    Node: undefined,
  });
  vm.runInContext(telo, context);
  context.console.log("zdravo", 7, { n: 1 });
  context.console.clear();
  slusaci.error({ message: "Uncaught SyntaxError: puklo", filename: "blob:http://cas.test/abc", lineno: 2, colno: 4 });
  slusaci.unhandledrejection({ reason: new Error("odbijeno") });
  assert.equal(poruke[0].generacija, 4);
  assert.equal(poruke[0].nivo, "log");
  assert.equal(poruke[0].tekst, 'zdravo 7 {"n":1}');
  assert.equal(poruke[1].nivo, "clear");
  assert.match(poruke[2].tekst, /SyntaxError: puklo \(skript:2:4\)/);
  assert.match(poruke[3].tekst, /Neobrađeno odbijanje:[\s\S]*odbijeno/);
  const prva = ugradjen.split("\n")[0];
  assert.match(prva, /^<!DOCTYPE html><script>.*<\/script>$/);
  assert.equal(ugradjen.split("\n")[1], "<html><body><p>dodat</p></body></html>");
  assert.equal(ubaciMostKonzole("<html></html>", 2).startsWith("<script>"), true);
  assert.equal(ubaciMostKonzole("", 1), "");
  assert.equal(porukaKonzole(poruke[0]).tekst, poruke[0].tekst);
  assert.equal(porukaKonzole({ tip: "drugo", nivo: "log", tekst: "x", generacija: 1 }), null);
  assert.equal(porukaKonzole({ ...poruke[0], tekst: "a".repeat(4001) }).tekst.length, 4000);
  assert.match(html, /id="pregled-konzola"/);
  assert.match(html, /id="pregled-konzola-zapisi"/);
  assert.match(html, /Nema zapisa\./);
  assert.match(main, /ubaciMostKonzole\(dokument, generacija\)/);
  assert.match(css, /\.pregled-konzola\s*\{[^}]*background:\s*var\(--code\)/);
});

test("editor ne krije navigaciju, a panel ima preklop", () => {
  assert.match(html, /id="nav-preklop"/);
  assert.match(html, /data-ikona="panel-left"/);
  assert.match(html, /aria-controls="nav"/);
  assert.match(main, /navOtvoren = !navOtvoren/);
  assert.match(main, /classList\.toggle\("nav-skriven", !navOtvoren\)/);
  assert.match(main, /Sakrij navigaciju/);
  assert.match(main, /Prikaži navigaciju/);
  const prikaz = main.match(/function prikaziDeo\(\) \{[\s\S]*?\n\}/)?.[0] || "";
  assert.match(prikaz, /editor-pun/);
  assert.equal(prikaz.includes("navOtvoren"), false);
  assert.equal(prikaz.includes("nav-skriven"), false);
  assert.match(css, /body\.nav-skriven #nav\s*\{[^}]*display:\s*none/);
});

test("neuspeo upis ostaje u mapi za ovu stranicu", () => {
  const skladiste = memorija(true);
  const upis = upisiRadnu(skladiste, { "client/css/soba.css": "staro" }, "client/index.html", "novo");
  assert.equal(upis.sacuvano, false);
  assert.equal(upis.mapa["client/index.html"], "novo");
  assert.equal(upis.mapa["client/css/soba.css"], "staro");
  assert.match(main, /Pregledač nije sačuvao radnu verziju/);
});
