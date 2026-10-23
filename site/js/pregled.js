import { tekstPrikaza } from "./radna.js";

export const PORUKA = "Delić nije primenjen.";

const SKRIPTOVI = new Set([
  "client/js/korak.js",
  "client/js/niz.js",
  "client/js/displej.js",
  "client/js/prekidac.js",
]);

export function punaPutanja(strana, put) {
  if (put.startsWith("client/") || put.startsWith("server/")) return put;
  return `${strana}/${put}`;
}

export function citajHtmlSobu(tekst) {
  if (typeof tekst !== "string" || (tekst.includes("<") && !tekst.includes(">"))) {
    throw new Error(PORUKA);
  }
  const cifra = tekst.match(/class="digit"[^>]*>([^<]*)</);
  const naslov = tekst.match(/<h1[^>]*>([^<]*)</);
  const dugme = tekst.match(/<button[^>]*>([^<]*)</);
  return {
    cifra: cifra ? cifra[1] : undefined,
    naslov: naslov ? naslov[1] : undefined,
    dugme: dugme ? dugme[1] : undefined,
  };
}

export function sakrivenoUSobi(crtez) {
  const naslov = !crtez || crtez.naslov === undefined;
  const cifra = !crtez || crtez.cifra === undefined;
  const dugme = !crtez || crtez.dugme === undefined;
  return { naslov, cifra, dugme };
}

export function trajanjeLopatica(css) {
  const pogodak = String(css).match(/animation-duration:\s*([0-9.]+)s/);
  return pogodak ? `${pogodak[1]}s` : null;
}

export function primeniPrikaz(stanje, ulaz) {
  const put = punaPutanja(ulaz.strana, ulaz.put);
  const sacuvanFajl = false;
  if (ulaz.strana === "server" || put.startsWith("server/")) {
    return { ...stanje, poruka: "", sacuvanFajl, crtao: false };
  }
  try {
    if (put === "client/index.html") {
      const deo = citajHtmlSobu(ulaz.tekst);
      const crtez = { cifra: deo.cifra, naslov: deo.naslov, dugme: deo.dugme };
      return { ...stanje, crtez, poruka: "", sacuvanFajl, crtao: true };
    }
    if (put === "client/css/soba.css") {
      const trajanje = trajanjeLopatica(ulaz.tekst);
      return {
        ...stanje,
        stil: ulaz.tekst,
        trajanje: trajanje || stanje.trajanje,
        poruka: "",
        sacuvanFajl,
        crtao: true,
      };
    }
    if (SKRIPTOVI.has(put)) {
      const prolaz = new Function(`${ulaz.tekst}\nreturn true;`)();
      if (prolaz !== true) throw new Error(PORUKA);
      return { ...stanje, skript: put, izvor: ulaz.tekst, poruka: "", sacuvanFajl, crtao: true };
    }
    return { ...stanje, poruka: "", sacuvanFajl, crtao: false };
  } catch {
    return { ...stanje, poruka: PORUKA, sacuvanFajl, crtao: false };
  }
}

function normalizuj(put) {
  let p = String(put).replace(/\\/g, "/").replace(/^\.\//, "");
  if (p.startsWith("client/")) p = p.slice("client/".length);
  return p.split("?")[0].split("#")[0];
}

function mime(kljuc) {
  if (kljuc.endsWith(".css")) return "text/css";
  if (kljuc.endsWith(".js")) return "text/javascript";
  if (kljuc.endsWith(".svg")) return "image/svg+xml";
  if (kljuc.endsWith(".html")) return "text/html";
  return "text/plain";
}

function dataAdresa(tekst, tip) {
  return `data:${tip};charset=utf-8,${encodeURIComponent(tekst)}`;
}

function dekodiraj(vrednost) {
  try {
    return decodeURIComponent(vrednost);
  } catch {
    return vrednost;
  }
}

function spoji(od, ref) {
  const baza = od.includes("/") ? od.split("/").slice(0, -1) : [];
  for (const deo of ref.split("/")) {
    if (!deo || deo === ".") continue;
    if (deo === "..") baza.pop();
    else baza.push(dekodiraj(deo));
  }
  return baza.join("/");
}

// Jedan red: `import … from "./a.js"`, `export … from "./a.js"`, `import "./a.js"` ili `import("./a.js")`.
const UVOZ = /^([ \t]*(?:import|export)\b[^\n]*?\bfrom[ \t]*|[ \t]*import\s*\(\s*|[ \t]*import[ \t]*)(['"])(\.{1,2}\/[^'"]+)\2/gm;

function preveziModule(sirov, od, fajlovi, moduli, adresaZa) {
  return sirov.replace(UVOZ, (sve, prefiks, navod, spec) => {
    const cilj = spoji(od, spec.split("?")[0].split("#")[0]);
    if (!fajlovi.has(cilj)) return sve;
    moduli.add(cilj);
    return `${prefiks}${navod}${adresaZa(cilj)}${navod}`;
  });
}

export function sklopiDokument(mapa, napraviAdresu = dataAdresa, ulaz = "index.html") {
  const fajlovi = new Map();
  for (const [put, tekst] of Object.entries(mapa || {})) {
    if (typeof tekst !== "string" || put.startsWith("server/")) continue;
    const kljuc = normalizuj(put);
    if (kljuc) fajlovi.set(kljuc, tekst);
  }
  const koren = normalizuj(ulaz) || "index.html";
  const html = fajlovi.get(koren);
  if (html == null || !String(html).trim()) return "";

  const obradjeno = new Map();
  const adrese = new Map();
  const moduli = new Set();

  function prazna() {
    return napraviAdresu("", "text/plain");
  }

  function razresi(od, vrednost) {
    const cist = String(vrednost).trim();
    if (!cist || cist.startsWith("#") || cist.startsWith("//")) return cist;
    if (/^(?:data:|blob:|mailto:|javascript:)/i.test(cist) || /^https?:\/\//i.test(cist)) return cist;
    if (cist.startsWith("/api/") || cist === "/api") return cist;
    if (cist.startsWith("/client/assets/") || cist.startsWith("/fonts/")) return cist;
    const kljuc = cist.startsWith("/client/")
      ? normalizuj(dekodiraj(cist.slice("/client/".length)))
      : cist.startsWith("/")
        ? ""
        : spoji(od, cist.split("?")[0].split("#")[0]);
    if (kljuc && fajlovi.has(kljuc)) return adresaZa(kljuc);
    return prazna();
  }

  function zameniUrl(css, od) {
    return css.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/gi, (_sve, navod, vrednost) => {
      const nova = razresi(od, vrednost.trim());
      return `url(${navod}${nova}${navod})`;
    });
  }

  function tekstFajla(kljuc) {
    if (obradjeno.has(kljuc)) return obradjeno.get(kljuc);
    const sirov = fajlovi.get(kljuc) ?? "";
    obradjeno.set(kljuc, sirov);
    let izlaz = sirov;
    if (kljuc.endsWith(".css")) izlaz = zameniUrl(sirov, kljuc);
    else if (kljuc.endsWith(".js") && moduli.has(kljuc)) {
      izlaz = preveziModule(sirov, kljuc, fajlovi, moduli, adresaZa);
    } else if (kljuc.endsWith(".html")) {
      izlaz = izlaz.replace(/(<style\b[^>]*>)([\s\S]*?)(<\/style>)/gi, (_sve, a, telo, b) => `${a}${zameniUrl(telo, kljuc)}${b}`);
      izlaz = izlaz
        .split(/(<script\b[^>]*>[\s\S]*?<\/script>)/gi)
        .map((deo) => {
          if (/^<script\b/i.test(deo)) {
            const modul = /\btype\s*=\s*(['"])module\1/i.test(deo);
            return deo.replace(/\bsrc\s*=\s*(["'])(.*?)\1/gi, (_sve, navod, vrednost) => {
              if (modul) {
                const cist = String(vrednost).trim();
                const cilj = cist.startsWith("/") || /^(?:data:|blob:|https?:|mailto:|javascript:)/i.test(cist)
                  ? ""
                  : spoji(kljuc, cist.split("?")[0].split("#")[0]);
                if (cilj && fajlovi.has(cilj)) moduli.add(cilj);
              }
              return `src=${navod}${razresi(kljuc, vrednost)}${navod}`;
            });
          }
          return deo.replace(/\b(href|src)\s*=\s*(["'])(.*?)\2/gi, (_sve, ime, navod, vrednost) => `${ime}=${navod}${razresi(kljuc, vrednost)}${navod}`);
        })
        .join("");
    }
    obradjeno.set(kljuc, izlaz);
    return izlaz;
  }

  function adresaZa(kljuc) {
    if (adrese.has(kljuc)) return adrese.get(kljuc);
    const url = napraviAdresu(tekstFajla(kljuc), mime(kljuc), kljuc);
    adrese.set(kljuc, url);
    return url;
  }

  return tekstFajla(koren);
}

export const TIP_KONZOLE = "pregled-konzola";

const NIVOI_KONZOLE = new Set(["log", "info", "warn", "error", "debug", "clear"]);
const GRANICA_ZAPISA = 4000;

export function mostKonzole(generacija) {
  const broj = Number.isInteger(generacija) ? generacija : 0;
  return `(function () {
  var TIP = ${JSON.stringify(TIP_KONZOLE)};
  var GENERACIJA = ${broj};
  function tekst(v) {
    if (typeof v === "string") return v;
    if (typeof v === "undefined") return "undefined";
    if (typeof v === "symbol") return String(v);
    if (typeof v === "bigint") return String(v) + "n";
    if (typeof v === "number" || typeof v === "boolean") return String(v);
    if (v === null) return "null";
    if (typeof Error !== "undefined" && v instanceof Error) return v.stack || (v.name + ": " + v.message);
    if (typeof Node !== "undefined" && v instanceof Node) {
      if (v.nodeType === 1 && v.outerHTML) return v.outerHTML;
      return String(v);
    }
    try { return JSON.stringify(v); }
    catch (e) {
      try { return String(v); }
      catch (e2) { return "[vrednost]"; }
    }
  }
  function imeFajla(fajl) {
    if (!fajl || fajl === "about:srcdoc") return "stranica";
    if (String(fajl).indexOf("blob:") === 0) return "skript";
    var cist = String(fajl).split("?")[0].split("#")[0];
    var delovi = cist.split("/");
    return delovi[delovi.length - 1] || "stranica";
  }
  function posalji(nivo, delovi) {
    try {
      var cilj = location.origin && location.origin !== "null" ? location.origin : "*";
      parent.postMessage({ tip: TIP, nivo: nivo, tekst: delovi.join(" "), generacija: GENERACIJA }, cilj);
    } catch (e) {}
  }
  ["log", "info", "warn", "error", "debug"].forEach(function (nivo) {
    var original = console[nivo] && console[nivo].bind(console);
    console[nivo] = function () {
      var delovi = [];
      for (var i = 0; i < arguments.length; i++) delovi.push(tekst(arguments[i]));
      posalji(nivo, delovi);
      if (original) original.apply(console, arguments);
    };
  });
  if (console.clear) {
    var originalClear = console.clear.bind(console);
    console.clear = function () {
      posalji("clear", []);
      originalClear();
    };
  }
  window.addEventListener("error", function (e) {
    if (!e || !e.message) return;
    var mesto = e.lineno ? " (" + imeFajla(e.filename) + ":" + e.lineno + ":" + (e.colno || 0) + ")" : "";
    posalji("error", [e.message + mesto]);
  });
  window.addEventListener("unhandledrejection", function (e) {
    posalji("error", ["Neobrađeno odbijanje: " + tekst(e && e.reason)]);
  });
})();`;
}

export function ubaciMostKonzole(html, generacija) {
  if (!html) return html;
  const skript = `<script>${mostKonzole(generacija).replace(/\s*\n\s*/g, " ")}</script>`;
  if (/^<!doctype html>/i.test(html)) return html.replace(/^(<!doctype html>)/i, `$1${skript}`);
  return skript + html;
}

export function porukaKonzole(data) {
  if (!data || data.tip !== TIP_KONZOLE || !NIVOI_KONZOLE.has(data.nivo)) return null;
  if (typeof data.tekst !== "string" || !Number.isInteger(data.generacija)) return null;
  const tekst = data.tekst.length > GRANICA_ZAPISA ? data.tekst.slice(0, GRANICA_ZAPISA) : data.tekst;
  return { nivo: data.nivo, tekst, generacija: data.generacija };
}

export function tekstoviServera(verzije, radne, verzija) {
  const izlaz = {};
  for (const [putanja, original] of Object.entries(verzije || {})) {
    if (!putanja.startsWith("server/")) continue;
    izlaz[putanja] = tekstPrikaza({
      putanja,
      original: typeof original === "string" ? original : "",
      radne,
      verzija,
      binarni: false,
    }).tekst;
  }
  return izlaz;
}
