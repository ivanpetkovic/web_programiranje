/* Skida službene teme highlight.js 11.12.0 i sužava selektore na blok koda.
   Pokretanje: node site/vendor/highlight/sklopi-teme.mjs
   Izlaz: teme.css i ../../js/teme-koda.js pored ove skripte. */
import fs from "node:fs";
import path from "node:path";

const VERZIJA = "11.12.0";
const KOREN = `https://cdn.jsdelivr.net/npm/highlight.js@${VERZIJA}/styles`;
const OVDE = path.dirname(new URL(import.meta.url).pathname);
const IZLAZ_CSS = path.join(OVDE, "teme.css");
const IZLAZ_JS = path.join(OVDE, "..", "..", "js", "teme-koda.js");
const PRESKOCI_SELEKTOR = new Set(["pre code.hljs", "code.hljs"]);
const ZADRZI = new Set(["1c-light", "ascetic", "monokai", "equinox", "a11y-dark"]);
const PODRAZUMEVANA = "1c-light";

const spisak = await fetch(`https://data.jsdelivr.com/v1/packages/npm/highlight.js@${VERZIJA}`).then((odgovor) => odgovor.json());
const stilovi = spisak.files.find((fajl) => fajl.name === "styles").files
  .map((fajl) => fajl.name)
  .filter((ime) => ZADRZI.has(ime.slice(0, -4)))
  .sort();
const nedostaje = [...ZADRZI].filter((id) => !stilovi.includes(`${id}.css`));
if (nedostaje.length) throw new Error(`nedostaje tema: ${nedostaje.join(", ")}`);

const slike = new Set();

function kanal(vrednost) {
  const c = vrednost / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function rgbOd(vrednost) {
  const tekst = String(vrednost).toLowerCase();
  const hex = tekst.match(/#([0-9a-f]{3,8})\b/);
  if (hex) {
    let h = hex[1];
    if (h.length === 3 || h.length === 4) h = [...h.slice(0, 3)].map((c) => c + c).join("");
    else h = h.slice(0, 6);
    const broj = Number.parseInt(h, 16);
    return [(broj >> 16) & 255, (broj >> 8) & 255, broj & 255];
  }
  const rgb = tekst.match(/rgba?\(\s*([0-9.]+)[,\s]+([0-9.]+)[,\s]+([0-9.]+)/);
  if (rgb) return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])];
  const imena = { white: [255, 255, 255], black: [0, 0, 0] };
  const rec = tekst.match(/\b(white|black)\b/);
  return rec ? imena[rec[1]] : null;
}

function svetlost(boja) {
  const rgb = rgbOd(boja);
  if (!rgb) return null;
  return 0.2126 * kanal(rgb[0]) + 0.7152 * kanal(rgb[1]) + 0.0722 * kanal(rgb[2]);
}

function pravila(css, ime) {
  const izlaz = [];
  let i = 0;
  while (i < css.length) {
    while (i < css.length && /\s/.test(css[i])) i += 1;
    if (i >= css.length) break;
    if (css.startsWith("/*", i)) {
      const kraj = css.indexOf("*/", i + 2);
      i = kraj === -1 ? css.length : kraj + 2;
      continue;
    }
    if (css.startsWith("@charset", i)) {
      const kraj = css.indexOf(";", i);
      i = kraj === -1 ? css.length : kraj + 1;
      continue;
    }
    if (css.startsWith("@media", i)) {
      while (i < css.length && css[i] !== "{") i += 1;
      i += 1;
      let dubinaMedija = 1;
      while (i < css.length && dubinaMedija) {
        if (css[i] === "{") dubinaMedija += 1;
        else if (css[i] === "}") dubinaMedija -= 1;
        if (dubinaMedija) i += 1;
      }
      i += 1;
      continue;
    }
    if (css[i] === "@") throw new Error(`${ime}: nepoznato at-pravilo na ${i}`);
    const pocetak = i;
    while (i < css.length && css[i] !== "{") i += 1;
    const selektor = css.slice(pocetak, i).replace(/\/\*[\s\S]*?\*\//g, "").trim();
    i += 1;
    const teloPocetak = i;
    let dubina = 1;
    while (i < css.length && dubina) {
      if (css.startsWith("/*", i)) {
        const kraj = css.indexOf("*/", i + 2);
        i = kraj === -1 ? css.length : kraj + 2;
        continue;
      }
      const znak = css[i];
      if (znak === '"' || znak === "'") {
        const navodnik = znak;
        i += 1;
        while (i < css.length && css[i] !== navodnik) {
          if (css[i] === "\\") i += 1;
          i += 1;
        }
      } else if (znak === "{") dubina += 1;
      else if (znak === "}") dubina -= 1;
      if (dubina) i += 1;
    }
    const telo = css.slice(teloPocetak, i).replace(/\/\*[\s\S]*?\*\//g, "").trim();
    i += 1;
    if (selektor) izlaz.push({ selektor, telo });
  }
  return izlaz;
}

function promenljiveOd(lista) {
  const mapa = new Map();
  for (const pravilo of lista) {
    const delovi = pravilo.selektor.split(",").map((deo) => deo.trim());
    if (!delovi.includes(":root") && !delovi.includes(":host")) continue;
    for (const pogod of pravilo.telo.matchAll(/(--[\w-]+)\s*:\s*([^;]+)/g)) mapa.set(pogod[1], pogod[2].trim());
  }
  return mapa;
}

function razresi(vrednost, promenljive) {
  return vrednost.replace(/var\(\s*(--[\w-]+)\s*\)/g, (sve, ime) => promenljive.get(ime) || sve);
}

function pozadina(lista) {
  let poslednja = null;
  for (const pravilo of lista) {
    const delovi = pravilo.selektor.split(",").map((deo) => deo.trim());
    if (!delovi.includes(".hljs")) continue;
    const pogodci = [...pravilo.telo.matchAll(/background(?:-color)?\s*:\s*[^;]+/gi)];
    if (pogodci.length) poslednja = pogodci.at(-1)[0].trim();
  }
  return poslednja;
}

function suzi(selektor, id) {
  const delovi = selektor.split(",").map((deo) => deo.replace(/\s+/g, " ").trim()).filter(Boolean);
  const ostali = delovi.filter((deo) => !PRESKOCI_SELEKTOR.has(deo));
  const prefiks = `html[data-tema-koda="${id}"]`;
  const izlaz = [];
  for (const deo of ostali) {
    if (deo === ":root" || deo === ":host") {
      izlaz.push(prefiks);
      continue;
    }
    const saKlasom = deo.replace(/\.hljs(?!-)/g, ".kod-sintaksa.hljs");
    izlaz.push(saKlasom.includes(".kod-sintaksa") ? `${prefiks} ${saKlasom}` : `${prefiks} .kod-sintaksa ${saKlasom}`);
    if (deo === ".hljs") izlaz.push(`${prefiks} pre:has(> .kod-sintaksa.hljs)`);
  }
  return [...new Set(izlaz)];
}

function teloSaSlikama(telo) {
  return telo.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g, (_sve, _navodnik, put) => {
    const cist = put.trim();
    if (/^(data:|https?:)/.test(cist)) return `url("${cist}")`;
    const ime = cist.replace(/^\.\//, "").split("/").pop();
    slike.add(ime);
    return `url("${ime}")`;
  });
}

function rezerva(selektor) {
  return selektor
    .replace(new RegExp(`html\\[data-tema-koda="${PODRAZUMEVANA}"\\]`, "g"), "html:not([data-tema-koda])")
    .replace(/\s+,/g, ",");
}

const teme = [];
const deloviCss = [];
for (const fajl of stilovi) {
  const id = fajl.slice(0, -4);
  const css = await fetch(`${KOREN}/${fajl}`).then((odgovor) => {
    if (!odgovor.ok) throw new Error(`${fajl}: ${odgovor.status}`);
    return odgovor.text();
  });
  const komentar = css.match(/\/\*[\s\S]*?\*\//);
  const izKomentara = (css.match(/Theme:\s*(.+)/) || [, ""])[1].trim();
  const slozen = id.split("-").map((rec) => rec.charAt(0).toUpperCase() + rec.slice(1)).join(" ");
  const istoIme = izKomentara && (izKomentara.toLowerCase() === id || izKomentara.toLowerCase().replaceAll(" ", "-") === id);
  const posebno = { vs: "Visual Studio", "vs-dark": "Visual Studio Dark", vs2015: "Visual Studio 2015" };
  let natpis = posebno[id] || (!izKomentara || (istoIme && izKomentara === izKomentara.toLowerCase()) ? slozen : izKomentara);
  const lista = pravila(css, id);
  const promenljive = promenljiveOd(lista);
  const pozadinaPravilo = pozadina(lista);
  const teloHljs = lista.find((pravilo) => pravilo.selektor.replace(/\s+/g, " ").trim() === ".hljs")?.telo || "";
  const bojaTeksta = teloHljs.split(";").map((deo) => deo.trim()).filter((deo) => /^color\s*:/.test(deo)).at(-1) || "";
  const osvetljenje = pozadinaPravilo ? svetlost(razresi(pozadinaPravilo, promenljive)) : null;
  const osvetljenjeTeksta = bojaTeksta ? svetlost(razresi(bojaTeksta, promenljive)) : null;
  if (pozadinaPravilo && osvetljenje == null) throw new Error(`${id}: nečitljiva pozadina .hljs (${pozadinaPravilo})`);
  const tamna = osvetljenje == null ? false : osvetljenjeTeksta == null ? osvetljenje < 0.4 : osvetljenjeTeksta > osvetljenje;
  teme.push({ id, natpis, tamna, svetlost: osvetljenje });
  const pravilaCss = [];
  for (const pravilo of lista) {
    const selektori = suzi(pravilo.selektor, id);
    if (!selektori.length) continue;
    const telo = teloSaSlikama(pravilo.telo);
    const linija = `${selektori.join(",\n")} {\n  ${telo}\n}`;
    pravilaCss.push(linija);
    if (id === PODRAZUMEVANA) pravilaCss.push(`${selektori.map(rezerva).join(",\n")} {\n  ${telo}\n}`);
    if (pravilo.selektor.replace(/\s+/g, " ").trim() === ".hljs") {
      const pozadine = pravilo.telo.split(";").map((deo) => deo.trim()).filter((deo) => /^background(?:-color|-image)?\s*:/.test(deo));
      if (pozadine.length) pravilaCss.push(`html[data-tema-koda="${id}"] .kviz-dijagram {\n  ${pozadine.join(";\n  ")};\n}`);
    }
  }
  deloviCss.push(`${komentar ? `${komentar[0]}\n` : ""}/* ${natpis} */\n${pravilaCss.join("\n")}`);
  process.stdout.write(` ${id}`);
}

const istaImena = new Map();
for (const tema of teme) istaImena.set(tema.natpis, (istaImena.get(tema.natpis) || 0) + 1);
for (const tema of teme) {
  if (istaImena.get(tema.natpis) > 1) {
    tema.natpis = tema.id.split("-").map((rec) => rec.charAt(0).toUpperCase() + rec.slice(1)).join(" ");
  }
}
teme.sort((a, b) => Number(a.tamna) - Number(b.tamna) || a.natpis.localeCompare(b.natpis, "sr"));

const uvod = `/* Zadržane službene teme highlight.js ${VERZIJA} (BSD-3-Clause).
   Sklopio site/vendor/highlight/sklopi-teme.mjs. Ne uređuj ručno.
   Selektori važe za .kod-sintaksa unutar html[data-tema-koda].
   1c Light važi i kad html nema data-tema-koda, kao rezerva. */
`;
fs.writeFileSync(IZLAZ_CSS, `${uvod}\n${deloviCss.join("\n\n")}\n`);

const js = `/* Zadržane službene teme highlight.js ${VERZIJA}. Sklopio sklopi-teme.mjs. */
export const PODRAZUMEVANA_TEMA_KODA = "${PODRAZUMEVANA}";

export const TEME_KODA = ${JSON.stringify(teme.map(({ id, natpis, tamna }) => ({ id, natpis, tamna })), null, 2)};

const PO_ID = new Map(TEME_KODA.map((tema) => [tema.id, tema]));
const STARE = { bela: "${PODRAZUMEVANA}", github: "${PODRAZUMEVANA}", crna: "monokai", "github-dark": "monokai" };

export function temaKodaIz(vrednost) {
  const sirova = STARE[vrednost] || vrednost;
  return PO_ID.has(sirova) ? sirova : PODRAZUMEVANA_TEMA_KODA;
}
`;
fs.writeFileSync(IZLAZ_JS, js);

await Promise.all([...slike].map(async (ime) => {
  const odgovor = await fetch(`${KOREN}/${ime}`);
  if (!odgovor.ok) throw new Error(`${ime}: ${odgovor.status}`);
  fs.writeFileSync(path.join(OVDE, ime), Buffer.from(await odgovor.arrayBuffer()));
}));

console.log(`\n${teme.length} tema, slike: ${[...slike].join(", ") || "nema"}`);
for (const tema of teme) {
  if (tema.svetlost > 0.18 && tema.svetlost < 0.62) {
    console.log(`${tema.tamna ? "tamna" : "svetla"} ${tema.id} L=${tema.svetlost.toFixed(3)}`);
  }
}
