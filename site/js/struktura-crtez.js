const BOJE = {
  plava: { fill: "#d7eaf8", stroke: "#6a9ec4", ink: "#17344c" },
  oker: { fill: "#fde6c8", stroke: "#d09a4a", ink: "#5c3810" },
  zelena: { fill: "#e5f2d6", stroke: "#7b9a62", ink: "#243318" },
};

const PAPIR = "#f7f4ee";
const MASTILO = "#2c2822";
const KOD_PANEL = { fill: "#e7f3df", stroke: "#7d9a68" };
const STAK = { fill: "#fffdf8", stroke: "#d2c6b4" };

let broj = 0;

function esc(tekst) {
  return String(tekst ?? "").replace(/[&<>"]/g, (znak) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
  })[znak]);
}

function linijaOd(stavka) {
  if (typeof stavka === "string") return { t: stavka, boja: "", ka: "" };
  return {
    t: String(stavka?.t ?? ""),
    boja: String(stavka?.boja ?? ""),
    ka: String(stavka?.ka ?? ""),
  };
}

function bojaOd(ime) {
  return BOJE[ime] || { fill: "#efeae2", stroke: "#b3a89a", ink: MASTILO };
}

function sirina(tekst, korak) {
  return [...String(tekst ?? "")].length * korak;
}

function najsire(redovi, korak) {
  let n = 0;
  for (const red of redovi) n = Math.max(n, sirina(red, korak));
  return n;
}

function visinaOkvira(okvir) {
  return 18 + okvir.redovi.length * 18;
}

export function modelStrukture(tekst) {
  let model;
  try {
    model = JSON.parse(String(tekst ?? ""));
  } catch {
    throw new Error("struktura");
  }
  const delovi = Array.isArray(model?.delovi) ? model.delovi : [model];
  if (!delovi.length || delovi.some((deo) => !deo || !Array.isArray(deo.kod) || !Array.isArray(deo.okviri))) {
    throw new Error("struktura");
  }
  return model;
}

function svgJedan(model) {
  const linije = model.kod.map(linijaOd);
  const okviri = new Map(model.okviri.map((okvir) => [String(okvir.id), {
    id: String(okvir.id),
    boja: String(okvir.boja || ""),
    redovi: (okvir.redovi || []).map((red) => String(red)),
  }]));
  const redovi = linije.map((linija) => {
    const okvir = linija.ka ? okviri.get(linija.ka) : null;
    const hOkvira = okvir ? visinaOkvira(okvir) : 0;
    let h = 24;
    if (!linija.t.trim() && !okvir) h = 10;
    else if (okvir) h = Math.max(68, hOkvira + 14);
    return { linija, okvir, h, hOkvira, y: 0 };
  });

  const naslov = String(model.naslov || "");
  const podnaslov = String(model.podnaslov || "");
  const vrh = 12 + (naslov ? 24 : 0) + (podnaslov ? 18 : 0);
  let y = vrh;
  for (const red of redovi) {
    red.y = y;
    y += red.h;
  }
  const visina = y + 18;

  const kodSirina = Math.max(248, najsire(linije.map((linija) => linija.t), 8.6) + 40);
  const okvirSirina = Math.max(188, najsire(model.okviri.flatMap((okvir) => okvir.redovi || []), 7.7) + 40);
  const lifo = model.lifo ? 64 : 0;
  const xKod = 8;
  const xOkvir = xKod + kodSirina + 26;
  const sirinaSvg = xOkvir + okvirSirina + lifo + 10;
  const id = `struktura-${broj += 1}`;

  const delovi = [];
  delovi.push(`<rect width="${sirinaSvg}" height="${visina}" fill="${PAPIR}"/>`);
  const panelVisina = visina - vrh - 14;
  delovi.push(`<rect x="${xKod}" y="${vrh}" width="${kodSirina}" height="${panelVisina}" rx="16" fill="${KOD_PANEL.fill}" stroke="${KOD_PANEL.stroke}" stroke-width="1.6" filter="url(#${id})"/>`);
  delovi.push(`<rect x="${xOkvir}" y="${vrh}" width="${okvirSirina}" height="${panelVisina}" rx="16" fill="${STAK.fill}" stroke="${STAK.stroke}" stroke-width="1.6" filter="url(#${id})"/>`);

  if (naslov) {
    delovi.push(`<text x="${xKod}" y="22" fill="${MASTILO}" font-family="system-ui, sans-serif" font-size="15" font-weight="700">${esc(naslov)}</text>`);
  }
  if (podnaslov) {
    delovi.push(`<text x="${xKod}" y="${naslov ? 40 : 22}" fill="#6d675e" font-family="system-ui, sans-serif" font-size="13">${esc(podnaslov)}</text>`);
  }

  for (const red of redovi) {
    const boja = bojaOd(red.linija.boja || red.okvir?.boja);
    const sredina = red.y + red.h / 2;
    if (red.linija.boja || red.okvir) {
      const hx = xKod + 12;
      const hw = kodSirina - 24;
      const hy = red.y + 7;
      const hh = red.h - 14;
      delovi.push(`<rect x="${hx}" y="${hy}" width="${hw}" height="${hh}" rx="8" fill="${boja.fill}" stroke="${boja.stroke}" stroke-width="1.4"/>`);
    }
    if (red.linija.t) {
      delovi.push(`<text x="${xKod + 22}" y="${(sredina + 5).toFixed(1)}" fill="${MASTILO}" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="14">${esc(red.linija.t)}</text>`);
    }
    if (!red.okvir) continue;
    const fx = xOkvir + 12;
    const fw = okvirSirina - 24;
    const fy = red.y + (red.h - red.hOkvira) / 2;
    delovi.push(`<rect data-okvir="${esc(red.okvir.id)}" x="${fx}" y="${fy.toFixed(1)}" width="${fw}" height="${red.hOkvira}" rx="8" fill="${boja.fill}" stroke="${boja.stroke}" stroke-width="1.4"/>`);
    red.okvir.redovi.forEach((natpis, indeks) => {
      const ty = fy + 20 + indeks * 18;
      const tezina = indeks === 0 ? "650" : "500";
      delovi.push(`<text x="${fx + fw / 2}" y="${ty.toFixed(1)}" text-anchor="middle" fill="${boja.ink}" font-family="system-ui, sans-serif" font-size="14" font-weight="${tezina}">${esc(natpis)}</text>`);
    });
    const x1 = xKod + kodSirina - 12;
    const x2 = fx;
    const ay = sredina.toFixed(1);
    delovi.push(`<line data-strelica="${esc(red.okvir.id)}" x1="${x1}" y1="${ay}" x2="${x2 - 8}" y2="${ay}" stroke="${MASTILO}" stroke-width="1.6"/>`);
    delovi.push(`<polygon points="${x2},${ay} ${x2 - 8},${(sredina - 4.5).toFixed(1)} ${x2 - 8},${(sredina + 4.5).toFixed(1)}" fill="${MASTILO}"/>`);
  }

  if (model.lifo && visina - vrh > 80) {
    const y1 = vrh + 16;
    const y2 = visina - 24;
    const zeleni = xOkvir + okvirSirina + 16;
    const roze = zeleni + 40;
    delovi.push(`<line x1="${zeleni}" y1="${y1 + 8}" x2="${zeleni}" y2="${y2}" stroke="#3e9a55" stroke-width="3" stroke-linecap="round"/>`);
    delovi.push(`<polygon points="${zeleni},${y1} ${zeleni - 6},${y1 + 12} ${zeleni + 6},${y1 + 12}" fill="#3e9a55"/>`);
    delovi.push(`<line x1="${roze}" y1="${y1}" x2="${roze}" y2="${y2 - 8}" stroke="#e07a92" stroke-width="3" stroke-linecap="round"/>`);
    delovi.push(`<polygon points="${roze},${y2} ${roze - 6},${y2 - 12} ${roze + 6},${y2 - 12}" fill="#e07a92"/>`);
    const mx = (zeleni + roze) / 2;
    const my = (y1 + y2) / 2;
    delovi.push(`<text x="0" y="0" transform="translate(${mx.toFixed(1)} ${my.toFixed(1)}) rotate(-90)" text-anchor="middle" fill="${MASTILO}" font-family="system-ui, sans-serif" font-size="13" font-weight="700" letter-spacing="1.4">LIFO</text>`);
  }

  const opis = [naslov, podnaslov, ...model.okviri.flatMap((okvir) => okvir.redovi || []), model.lifo ? "LIFO" : ""]
    .filter(Boolean)
    .join(". ");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${sirinaSvg}" viewBox="0 0 ${sirinaSvg} ${visina}" role="img" aria-label="${esc(opis)}" style="height:auto;max-width:none"><defs><filter id="${id}" x="-8%" y="-8%" width="120%" height="124%"><feDropShadow dx="0" dy="2" stdDeviation="1.6" flood-color="#1c1a16" flood-opacity="0.16"/></filter></defs>${delovi.join("")}</svg>`;
}

export function svgStrukture(model) {
  const delovi = Array.isArray(model?.delovi) ? model.delovi : [model];
  return delovi.map((deo) => svgJedan(deo)).join("");
}
