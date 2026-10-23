const { proveriJs } = require("../site/js/provera-izvora.js");
const http = require("http");
const fs = require("fs");
const path = require("path");
const { state, dovodi, trenutnoStanje, objaviStanje } = require("./stanje");
const { pripremiBazu, dohvatiBazu } = require("./baza");
const { dokumentJeKurs } = require("./kurs");
const { spisakPrimera, ucitajPrimer } = require("./primeri");

const PODRAZUMEVANI_PORT = 8787;
const GRANICA_JSON = 4096;
const GRANICA_KURSA = 2000000;
const GRANICA_IZVORA = 200000;
const NAJDUZA_PUTANJA = 200;
const PORT = Number(process.env.PORT) || PODRAZUMEVANI_PORT;
const SAJT = path.join(__dirname, "..", "site");
const KURS = process.env.KURS_DATOTEKA
  ? path.resolve(process.env.KURS_DATOTEKA)
  : path.join(SAJT, "kurs.json");
const KLIJENT = path.join(__dirname, "..", "client");
const PRIMERI = path.join(__dirname, "..", "primeri");
const FONT = path.join(KLIJENT, "assets", "fonts", "digital-7", "digital-7 (mono).ttf");
const NAPOMENA_BINARNOG = "Binarni fajl. Pregledač ga učitava kao fajl, ne kao tekst.";
const TEKSTUALNI = new Set([".html", ".css", ".js", ".mjs", ".json", ".md", ".txt", ".svg"]);
const KORENI = { client: KLIJENT, server: __dirname };
const MODULI_PO_ZAHTEVU = new Set(["soba.js", "ventilator.js", "sesija.js"]);
const MODULI_PRI_POKRETANJU = new Set(["server.js", "stanje.js", "baza.js"]);
const TIPOVI = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".ttf": "font/ttf",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".json": "application/json",
};

function ucitajModul(ime) {
  const fajl = path.join(__dirname, ime);
  delete require.cache[require.resolve(fajl)];
  return require(fajl);
}

function posaljiJson(odgovor, status, telo, zaglavlja = {}) {
  const sadrzaj = telo === undefined ? "" : JSON.stringify(telo);
  odgovor.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    ...zaglavlja,
  });
  odgovor.end(sadrzaj);
}

function procitajTelo(zahtev, granica) {
  return new Promise((resolve, reject) => {
    const delovi = [];
    let velicina = 0;
    let gotovo = false;
    function zavrsi(fn) {
      if (gotovo) return;
      gotovo = true;
      fn();
    }
    zahtev.on("data", (deo) => {
      if (gotovo) return;
      velicina += deo.length;
      if (velicina > granica) {
        zahtev.resume();
        zavrsi(() => reject(Object.assign(new Error("veliko"), { status: 400, body: { greska: "telo je preveliko" } })));
        return;
      }
      delovi.push(deo);
    });
    zahtev.on("end", () => zavrsi(() => resolve(Buffer.concat(delovi).toString("utf8"))));
    zahtev.on("error", (greska) => zavrsi(() => reject(greska)));
  });
}

async function procitajJson(zahtev, granica = GRANICA_JSON) {
  const tekst = await procitajTelo(zahtev, granica);
  if (!tekst) return {};
  try {
    return JSON.parse(tekst);
  } catch {
    throw Object.assign(new Error("json"), { status: 400, body: { greska: "neispravan json" } });
  }
}

function posaljiFajl(odgovor, fajl) {
  fs.readFile(fajl, (greska, sadrzaj) => {
    if (greska) {
      odgovor.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      odgovor.end("nema");
      return;
    }
    const tip = TIPOVI[path.extname(fajl)] || "application/octet-stream";
    odgovor.writeHead(200, { "content-type": tip, "cache-control": "no-store" });
    odgovor.end(sadrzaj);
  });
}

function sakrijSluzbene(ime) {
  return ime === "prepared" || ime === "node_modules";
}

function spisakFajlova(koren) {
  const fajlovi = [];
  function obidji(direktorijum) {
    for (const ime of fs.readdirSync(direktorijum)) {
      if (sakrijSluzbene(ime)) continue;
      const putanja = path.join(direktorijum, ime);
      if (fs.statSync(putanja).isDirectory()) obidji(putanja);
      else fajlovi.push(path.relative(koren, putanja).split(path.sep).join("/"));
    }
  }
  obidji(koren);
  return fajlovi.sort();
}

function putanjaJeBezbedna(relativna) {
  if (typeof relativna !== "string" || relativna.length === 0 || relativna.length > NAJDUZA_PUTANJA) return false;
  if (relativna.includes("\0") || path.isAbsolute(relativna)) return false;
  const normalna = path.normalize(relativna);
  const delovi = normalna.split(path.sep);
  if (normalna.startsWith("..") || delovi.includes("..")) return false;
  if (delovi.includes("prepared") || delovi.includes("node_modules")) return false;
  return true;
}

function putanjaFajla(strana, relativna) {
  const koren = KORENI[strana];
  if (!koren || !putanjaJeBezbedna(relativna)) return null;
  const fajl = path.join(koren, path.normalize(relativna));
  const nazad = path.relative(koren, fajl);
  if (nazad.startsWith("..") || path.isAbsolute(nazad)) return null;
  return fajl;
}

function fajlJeCitljiv(fajl) {
  return Boolean(fajl) && fs.existsSync(fajl) && fs.statSync(fajl).isFile();
}

function fajlJeBinaran(fajl) {
  return !TEKSTUALNI.has(path.extname(fajl).toLowerCase());
}

function osveziModul(fajl) {
  if (!MODULI_PO_ZAHTEVU.has(path.basename(fajl))) return;
  delete require.cache[require.resolve(fajl)];
  require(fajl);
}

function sintaksaJeIspravna(izvor, ime) {
  if (!ime.endsWith(".js")) return null;
  return proveriJs(izvor) || null;
}

async function citanjeSobe(odgovor, url) {
  const rezultat = await ucitajModul("soba.js").citaj({
    state,
    db: dohvatiBazu(),
    svezina: url.searchParams.get("svezina") === "1",
  });
  if (state.baza && rezultat.body) {
    const baza = dohvatiBazu();
    if (!baza) rezultat.body.istorija = [];
    else {
      const redovi = await baza.query("SELECT komanda FROM istorija ORDER BY id");
      rezultat.body.istorija = redovi.rows.map((red) => red.komanda);
    }
  }
  posaljiJson(odgovor, rezultat.status, rezultat.body);
}

async function komandaVentilatora(zahtev, odgovor) {
  if (state.proveriUlogu) {
    const odbijeno = ucitajModul("sesija.js").odbijenaKomanda(zahtev);
    if (odbijeno) {
      posaljiJson(odgovor, odbijeno.status, odbijeno.body);
      return;
    }
  }
  const telo = await procitajJson(zahtev);
  const rezultat = await ucitajModul("ventilator.js").komanda({ state, db: dohvatiBazu() }, telo);
  if (rezultat.status === 200) objaviStanje();
  posaljiJson(odgovor, rezultat.status, rezultat.body);
}

function primeri(odgovor) {
  posaljiJson(odgovor, 200, { podrazumevani: "kontrolna-soba", primeri: spisakPrimera(PRIMERI) });
}

function fajloviPrimera(odgovor, url) {
  const primer = ucitajPrimer(PRIMERI, url.searchParams.get("id"));
  if (!primer) {
    posaljiJson(odgovor, 404, { greska: "nema primera" });
    return;
  }
  posaljiJson(odgovor, 200, primer);
}

function stablo(odgovor, url) {
  const strana = url.searchParams.get("strana");
  if (!KORENI[strana]) {
    posaljiJson(odgovor, 400, { greska: "nepoznata strana" });
    return;
  }
  posaljiJson(odgovor, 200, { fajlovi: spisakFajlova(KORENI[strana]) });
}

function procitajFajl(odgovor, url) {
  const fajl = putanjaFajla(url.searchParams.get("strana"), url.searchParams.get("put"));
  if (!fajlJeCitljiv(fajl)) {
    posaljiJson(odgovor, 404, { greska: "nema fajla" });
    return;
  }
  if (fajlJeBinaran(fajl)) {
    posaljiJson(odgovor, 200, { binarni: true, napomena: NAPOMENA_BINARNOG });
    return;
  }
  posaljiJson(odgovor, 200, { izvor: fs.readFileSync(fajl, "utf8") });
}

async function sacuvajFajl(zahtev, odgovor) {
  const telo = await procitajJson(zahtev, GRANICA_IZVORA);
  const fajl = putanjaFajla(telo.strana, telo.put);
  if (!fajlJeCitljiv(fajl)) {
    posaljiJson(odgovor, 404, { greska: "nema fajla" });
    return;
  }
  if (fajlJeBinaran(fajl)) {
    posaljiJson(odgovor, 400, { greska: "binarni fajl se ne upisuje kao tekst" });
    return;
  }
  if (typeof telo.izvor !== "string") {
    posaljiJson(odgovor, 400, { greska: "nema izvora" });
    return;
  }
  const greskaSintakse = sintaksaJeIspravna(telo.izvor, fajl);
  if (greskaSintakse) {
    posaljiJson(odgovor, 400, { greska: greskaSintakse });
    return;
  }
  const prethodni = fs.readFileSync(fajl, "utf8");
  fs.writeFileSync(fajl, telo.izvor);
  try {
    osveziModul(fajl);
  } catch (greska) {
    fs.writeFileSync(fajl, prethodni);
    osveziModul(fajl);
    posaljiJson(odgovor, 400, { greska: greska.message });
    return;
  }
  posaljiJson(odgovor, 200, {
    sacuvan: true,
    pokretanje: MODULI_PRI_POKRETANJU.has(path.basename(fajl)),
  });
}

async function povratiFajl(zahtev, odgovor) {
  const telo = await procitajJson(zahtev);
  const fajl = putanjaFajla(telo.strana, telo.put);
  const koren = KORENI[telo.strana];
  if (!fajl || !koren) {
    posaljiJson(odgovor, 404, { greska: "nema fajla" });
    return;
  }
  const pripremljen = path.join(koren, "prepared", path.relative(koren, fajl));
  if (!fs.existsSync(pripremljen)) {
    posaljiJson(odgovor, 404, { greska: "nema pripremljene verzije" });
    return;
  }
  fs.copyFileSync(pripremljen, fajl);
  osveziModul(fajl);
  posaljiJson(odgovor, 200, {
    izvor: fs.readFileSync(fajl, "utf8"),
    pokretanje: MODULI_PRI_POKRETANJU.has(path.basename(fajl)),
  });
}

function kolacicSesije(kljuc) {
  if (!kljuc) return "sesija=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax";
  return `sesija=${kljuc}; HttpOnly; Path=/; SameSite=Lax`;
}

async function postaviSesiju(zahtev, odgovor) {
  const telo = await procitajJson(zahtev);
  if (!telo.koja) {
    posaljiJson(odgovor, 204, undefined, {
      "set-cookie": kolacicSesije(""),
      "content-type": "text/plain; charset=utf-8",
    });
    return;
  }
  const kljuc = ucitajModul("sesija.js").kljucZaUlogu(telo.koja);
  if (!kljuc) {
    posaljiJson(odgovor, 400, { greska: "nepoznata sesija" });
    return;
  }
  posaljiJson(odgovor, 204, undefined, {
    "set-cookie": kolacicSesije(kljuc),
    "content-type": "text/plain; charset=utf-8",
  });
}

async function postaviPrikljucen(zahtev, odgovor) {
  const telo = await procitajJson(zahtev);
  state.prikljucen = Boolean(telo.prikljucen);
  if (!state.prikljucen) state.ukljucen = false;
  objaviStanje();
  posaljiJson(odgovor, 200, { prikljucen: state.prikljucen });
}

async function postaviTakt(zahtev, odgovor) {
  const telo = await procitajJson(zahtev);
  state.takt = Boolean(telo.ukljucen);
  posaljiJson(odgovor, 200, { takt: state.takt });
}

async function postaviUloge(zahtev, odgovor) {
  const telo = await procitajJson(zahtev);
  state.proveriUlogu = Boolean(telo.ukljucen);
  posaljiJson(odgovor, 200, { proveriUlogu: state.proveriUlogu });
}

async function postaviBazu(zahtev, odgovor) {
  const telo = await procitajJson(zahtev);
  state.baza = Boolean(telo.ukljucen);
  posaljiJson(odgovor, 200, { baza: state.baza, dostupna: Boolean(dohvatiBazu()) });
}

function otvoriDovod(zahtev, odgovor) {
  odgovor.writeHead(200, {
    "content-type": "text/event-stream; charset=utf-8",
    "cache-control": "no-store",
    connection: "keep-alive",
  });
  odgovor.write(`data: ${JSON.stringify(trenutnoStanje())}\n\n`);
  dovodi.add(odgovor);
  zahtev.on("close", () => dovodi.delete(odgovor));
}

function stranicaKlijenta(odgovor, url) {
  const relativna = decodeURIComponent(url.pathname.slice("/client/".length));
  const fajl = putanjaFajla("client", relativna);
  if (!fajl) {
    odgovor.writeHead(403);
    odgovor.end();
    return;
  }
  posaljiFajl(odgovor, fajl);
}

function pojmovnik(odgovor) {
  fs.readFile(path.join(__dirname, "..", "GLOSSARY.md"), (greska, sadrzaj) => {
    if (greska) {
      odgovor.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      odgovor.end("nema");
      return;
    }
    odgovor.writeHead(200, { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" });
    odgovor.end(sadrzaj);
  });
}

async function sacuvajKurs(zahtev, odgovor) {
  const tekst = await procitajTelo(zahtev, GRANICA_KURSA);
  let kurs;
  try {
    kurs = JSON.parse(tekst);
  } catch {
    return posaljiJson(odgovor, 400, { greska: "neispravan json" });
  }
  if (!dokumentJeKurs(kurs)) return posaljiJson(odgovor, 400, { greska: "dokument nije kurs" });
  const telo = `${JSON.stringify(kurs, null, 2)}\n`;
  const privremeno = path.join(path.dirname(KURS), ".kurs-studio.tmp");
  fs.writeFileSync(privremeno, telo);
  fs.renameSync(privremeno, KURS);
  return posaljiJson(odgovor, 200, { ok: true });
}

function stranicaSajta(odgovor, url) {
  const relativna = url.pathname === "/" ? "/index.html" : url.pathname;
  const fajl = path.normalize(path.join(SAJT, relativna));
  if (fajl !== SAJT && !fajl.startsWith(SAJT + path.sep)) {
    odgovor.writeHead(403);
    odgovor.end();
    return;
  }
  posaljiFajl(odgovor, fajl);
}

async function razvrstaj(zahtev, odgovor) {
  const url = new URL(zahtev.url, `http://${zahtev.headers.host}`);
  if (zahtev.method === "PUT" && url.pathname === "/api/kurs") return sacuvajKurs(zahtev, odgovor);
  if (zahtev.method === "GET" && (url.pathname === "/studio" || url.pathname === "/studio/")) {
    return posaljiFajl(odgovor, path.join(SAJT, "studio.html"));
  }
  if (zahtev.method === "GET" && url.pathname === "/api/soba") return citanjeSobe(odgovor, url);
  if (zahtev.method === "PUT" && url.pathname === "/api/ventilator") return komandaVentilatora(zahtev, odgovor);
  if (zahtev.method === "GET" && url.pathname === "/api/primeri") return primeri(odgovor);
  if (zahtev.method === "GET" && url.pathname === "/api/primeri/fajlovi") return fajloviPrimera(odgovor, url);
  if (zahtev.method === "GET" && url.pathname === "/api/stablo") return stablo(odgovor, url);
  if (zahtev.method === "GET" && url.pathname === "/api/fajl") return procitajFajl(odgovor, url);
  if (zahtev.method === "POST" && url.pathname === "/api/fajl") return sacuvajFajl(zahtev, odgovor);
  if (zahtev.method === "POST" && url.pathname === "/api/fajl/povrati") return povratiFajl(zahtev, odgovor);
  if (zahtev.method === "POST" && url.pathname === "/api/sesija") return postaviSesiju(zahtev, odgovor);
  if (zahtev.method === "POST" && url.pathname === "/api/prikljucen") return postaviPrikljucen(zahtev, odgovor);
  if (zahtev.method === "POST" && url.pathname === "/api/takt") return postaviTakt(zahtev, odgovor);
  if (zahtev.method === "POST" && url.pathname === "/api/uloge") return postaviUloge(zahtev, odgovor);
  if (zahtev.method === "POST" && url.pathname === "/api/baza") return postaviBazu(zahtev, odgovor);
  if (zahtev.method === "GET" && url.pathname === "/dovod") return otvoriDovod(zahtev, odgovor);
  if (zahtev.method === "GET" && url.pathname === "/pojmovnik") return pojmovnik(odgovor);
  if (zahtev.method === "GET" && url.pathname === "/fonts/digital-7-mono.ttf") return posaljiFajl(odgovor, FONT);
  if (zahtev.method === "GET" && url.pathname.startsWith("/client/")) return stranicaKlijenta(odgovor, url);
  if (zahtev.method === "GET") return stranicaSajta(odgovor, url);
  return posaljiJson(odgovor, 404, { greska: "nema putanje" });
}

const server = http.createServer(async (zahtev, odgovor) => {
  try {
    await razvrstaj(zahtev, odgovor);
  } catch (greska) {
    if (!odgovor.headersSent) posaljiJson(odgovor, greska.status || 500, greska.body || { greska: "kvar" });
  }
});

pripremiBazu()
  .catch((greska) => {
    console.error("baza nije dostupna:", greska.message);
  })
  .finally(() => {
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`Web Programiranje http://127.0.0.1:${PORT}`);
    });
  });
