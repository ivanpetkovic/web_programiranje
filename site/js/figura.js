function esc(vrednost) {
  return String(vrednost ?? "").replace(/[&<>"]/g, (znak) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
  })[znak]);
}

export function tekstoviFigure(figura) {
  if (!figura || typeof figura !== "object") return [];
  if (figura.vrsta === "put") return (figura.cvorovi || []).map((cvor) => cvor.natpis);
  if (figura.vrsta === "linija") {
    return (figura.oznake || []).flatMap((oznaka) => [String(oznaka.godina), oznaka.natpis]);
  }
  return [];
}

function putSvg(figura) {
  const cvorovi = figura.cvorovi || [];
  const sirinaCvora = 108;
  const razmak = 28;
  const pad = 12;
  const y = 36;
  const ukupno = pad * 2 + cvorovi.length * sirinaCvora + Math.max(0, cvorovi.length - 1) * razmak;
  const centri = cvorovi.map((_, i) => pad + sirinaCvora / 2 + i * (sirinaCvora + razmak));
  const linije = centri.slice(1).map((x, i) => {
    const levo = centri[i] + sirinaCvora / 2;
    const desno = x - sirinaCvora / 2;
    return `<line x1="${levo}" y1="${y}" x2="${desno}" y2="${y}" />`;
  }).join("");
  const kutije = cvorovi.map((cvor, i) => {
    const x = pad + i * (sirinaCvora + razmak);
    return `<g class="figura-cvor"><rect x="${x}" y="${y - 18}" width="${sirinaCvora}" height="36" rx="8" /><text x="${centri[i]}" y="${y + 5}" text-anchor="middle">${esc(cvor.natpis)}</text></g>`;
  }).join("");
  const od = cvorovi.findIndex((cvor) => cvor.id === "browser");
  const dok = cvorovi.findIndex((cvor) => cvor.id === "dokument");
  const pokret = figura.pokret === "jednom" && od >= 0 && dok >= od;
  const put = pokret ? centri.slice(od, dok + 1).map((x, i) => `${i === 0 ? "M" : "L"} ${x} ${y}`).join(" ") : "";
  const marker = pokret
    ? `<circle class="figura-marker" r="5" cx="${centri[od]}" cy="${y}" style="offset-path: path('${put}')" />`
    : "";
  const oznaka = pokret ? ` data-pokret="jednom"` : "";
  return `<svg class="figura-put" viewBox="0 0 ${ukupno} 72" role="img"${oznaka}>${linije}${kutije}${marker}</svg>`;
}

function linijaSvg(figura) {
  const oznake = figura.oznake || [];
  const sirina = 760;
  const visina = 108;
  const y = 28;
  const x0 = 48;
  const x1 = sirina - 48;
  const tacke = oznake.map((oznaka, i) => {
    const x = oznake.length === 1 ? (x0 + x1) / 2 : x0 + ((x1 - x0) * i) / (oznake.length - 1);
    const kasnjenje = figura.pokret === "redom" ? (i * 0.4).toFixed(2) : "0";
    return `<g class="figura-oznaka" style="animation-delay: ${kasnjenje}s" transform="translate(${x} ${y})"><circle r="6" /><text class="figura-godina" y="24" text-anchor="middle">${esc(oznaka.godina)}</text><text class="figura-natpis" y="42" text-anchor="middle">${esc(oznaka.natpis)}</text></g>`;
  }).join("");
  const pokret = figura.pokret === "redom" ? ` data-pokret="redom"` : "";
  return `<svg class="figura-linija" viewBox="0 0 ${sirina} ${visina}" role="img"${pokret}><line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" />${tacke}</svg>`;
}

export function svgFigura(figura) {
  if (!figura || typeof figura !== "object") return "";
  if (figura.vrsta === "put") return putSvg(figura);
  if (figura.vrsta === "linija") return linijaSvg(figura);
  return "";
}

export function prikazKoraka(korak) {
  if (korak && korak.figura) return { svg: svgFigura(korak.figura), putanja: null };
  return { svg: null, putanja: korak ? korak.putanja ?? null : null };
}
