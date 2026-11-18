import { stabloDo } from "./stablo.js";

export function jeTemaLekcije(id) {
  return typeof id === "string" && /^tema-\d+$/.test(id);
}

export function stranaLekcije(id) {
  return id === "tema-6" ? "server" : "client";
}

function fajlLekcije(putanja) {
  if (typeof putanja !== "string" || !putanja.endsWith(".js")) return "";
  if (putanja.startsWith("client/lekcije/") || putanja.startsWith("server/lekcije/")) return putanja.slice(putanja.indexOf("/") + 1);
  return "";
}

export function imeLekcije(put) {
  return String(put || "").replace(/(^|\/)\d{2}-/g, "$1");
}

export function resiLekciju(teme, putanja, idTeme) {
  const rel = fajlLekcije(putanja);
  if (!rel) return null;
  const lista = teme || [];
  const tacan = lista.find((tema) => tema.fajlovi.includes(rel));
  if (tacan) return { tema: tacan, put: rel };
  const kratak = imeLekcije(rel);
  if (kratak === rel) {
    const uTemiKratko = (tema) => tema.fajlovi.find((put) => imeLekcije(put) === kratak) || "";
    if (idTeme) {
      const tema = lista.find((stavka) => stavka.id === idTeme);
      const put = tema ? uTemiKratko(tema) : "";
      if (put) return { tema, put };
    }
    const pogodci = lista.flatMap((tema) => {
      const put = uTemiKratko(tema);
      return put ? [{ tema, put }] : [];
    });
    if (pogodci.length === 1) return pogodci[0];
  }
  return null;
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
  return resiLekciju(teme, putanja)?.tema || null;
}
