const fs = require("fs");
const path = require("path");

const PRESKOCI_DIR = new Set(["node_modules", "dist", "prepared", ".git"]);
const PRESKOCI_FAJL = new Set(["primer.json", "package-lock.json"]);
const TEKSTUALNI = new Set([".html", ".css", ".js", ".mjs", ".json", ".md", ".txt", ".svg", ".ts", ".tsx", ".jsx"]);
const GRANICA = 200000;
const UGRADJENI = { id: "kontrolna-soba", naslov: "Kontrolna soba" };

function idJeBezbedan(id) {
  if (typeof id !== "string" || id.length === 0 || id.length > 120) return false;
  if (id === "." || id === "..") return false;
  if (id.includes("/") || id.includes("\\") || id.includes("\0")) return false;
  return true;
}

function procitajNaslov(dir, ime) {
  try {
    const telo = JSON.parse(fs.readFileSync(path.join(dir, "primer.json"), "utf8"));
    if (telo && typeof telo.naslov === "string" && telo.naslov.trim()) return telo.naslov.trim();
  } catch {
    /* folder bez primer.json nosi svoje ime */
  }
  return ime;
}

function spisakPrimera(koren) {
  const primeri = [{ ...UGRADJENI }];
  if (!koren || !fs.existsSync(koren)) return primeri;
  const imena = fs
    .readdirSync(koren)
    .filter((ime) => {
      if (ime.startsWith(".")) return false;
      return fs.statSync(path.join(koren, ime)).isDirectory();
    })
    .sort((a, b) => a.localeCompare(b, "sr"));
  for (const ime of imena) {
    primeri.push({ id: ime, naslov: procitajNaslov(path.join(koren, ime), ime) });
  }
  return primeri;
}

function obidji(koren, dir, fajlovi) {
  for (const ime of fs.readdirSync(dir)) {
    if (ime.startsWith(".") || PRESKOCI_DIR.has(ime)) continue;
    const put = path.join(dir, ime);
    const stat = fs.statSync(put);
    if (stat.isDirectory()) {
      obidji(koren, put, fajlovi);
      continue;
    }
    if (PRESKOCI_FAJL.has(ime)) continue;
    if (!TEKSTUALNI.has(path.extname(ime).toLowerCase()) || stat.size > GRANICA) continue;
    fajlovi.push(path.relative(koren, put).split(path.sep).join("/"));
  }
}

function ucitajPrimer(koren, id) {
  if (id === UGRADJENI.id) return { ugradjen: true, ...UGRADJENI };
  if (!idJeBezbedan(id) || !koren) return null;
  const dir = path.join(koren, id);
  const nazad = path.relative(koren, dir);
  if (nazad.startsWith("..") || path.isAbsolute(nazad) || nazad !== id) return null;
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) return null;
  const fajlovi = [];
  obidji(dir, dir, fajlovi);
  fajlovi.sort((a, b) => a.localeCompare(b, "sr"));
  const verzije = {};
  for (const put of fajlovi) verzije[put] = fs.readFileSync(path.join(dir, put), "utf8");
  return { id, naslov: procitajNaslov(dir, id), fajlovi, verzije };
}

module.exports = { spisakPrimera, ucitajPrimer, UGRADJENI };
