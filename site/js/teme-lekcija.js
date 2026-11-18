import { stabloDo } from "./stablo.js";

export function jeTemaLekcije(id) {
  return typeof id === "string" && /^tema-\d+$/.test(id);
}

function fajlLekcije(putanja) {
  if (typeof putanja !== "string" || !putanja.startsWith("client/lekcije/") || !putanja.endsWith(".js")) return "";
  return putanja.slice("client/".length);
}

export function temeLekcija(lekcije) {
  const izlaz = [];
  for (const tema of lekcije || []) {
    const fajlovi = [];
    const vidjeno = new Set();
    for (const korak of tema.steps || []) {
      const rel = fajlLekcije(korak.putanja);
      if (!rel || vidjeno.has(rel)) continue;
      vidjeno.add(rel);
      fajlovi.push(rel);
    }
    if (!fajlovi.length) continue;
    const stablo = stabloDo(tema.steps, tema.steps.length - 1);
    const verzije = {};
    for (const put of fajlovi) verzije[put] = stablo.verzije[`client/${put}`] || "";
    izlaz.push({
      id: `tema-${tema.n}`,
      naslov: tema.title,
      fajlovi,
      verzije,
    });
  }
  return izlaz;
}

export function temaZaFajl(teme, putanja) {
  const rel = fajlLekcije(putanja);
  if (!rel) return null;
  return (teme || []).find((tema) => tema.fajlovi.includes(rel)) || null;
}
