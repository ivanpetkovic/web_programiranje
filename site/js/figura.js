function natpis(vrednost) {
  return String(vrednost ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/#/g, "#35;")
    .replace(/"/g, "#quot;")
    .replace(/:/g, "#58;");
}

export function tekstoviFigure(figura) {
  if (!figura || typeof figura !== "object") return [];
  if (figura.vrsta === "put") return (figura.cvorovi || []).map((cvor) => cvor.natpis);
  if (figura.vrsta === "linija") {
    return (figura.oznake || []).flatMap((oznaka) => [String(oznaka.godina), oznaka.natpis]);
  }
  return [];
}

function putMermaid(figura) {
  const cvorovi = figura.cvorovi || [];
  const kutije = cvorovi.map((cvor, i) => `  c${i}["${natpis(cvor.natpis)}"]`);
  const veze = cvorovi.slice(1).map((_, i) => `  c${i} --> c${i + 1}`);
  return ["flowchart LR", ...kutije, ...veze].join("\n");
}

function linijaMermaid(figura) {
  const oznake = (figura.oznake || []).map((oznaka) => {
    const godina = natpis(oznaka.godina) || "…";
    const tekst = natpis(oznaka.natpis);
    return tekst ? `  ${godina} : ${tekst}` : `  ${godina}`;
  });
  return ["timeline", ...oznake].join("\n");
}

export function mermaidFigura(figura) {
  if (!figura || typeof figura !== "object") return "";
  if (figura.vrsta === "put") return putMermaid(figura);
  if (figura.vrsta === "linija") return linijaMermaid(figura);
  return "";
}

export function prikazKoraka(korak) {
  if (korak && korak.figura) return { mermaid: mermaidFigura(korak.figura), putanja: null };
  return { mermaid: null, putanja: korak ? korak.putanja ?? null : null };
}
