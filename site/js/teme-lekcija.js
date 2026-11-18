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

export function prikazLekcije(put, strana) {
  const ime = String(put || "").split("/").pop().replace(/^\d{2}-/, "");
  if (!ime) return "";
  return strana === "server" ? ime : `js/${ime}`;
}

export function resiLekciju(teme, putanja, idTeme) {
  const rel = fajlLekcije(putanja);
  const lista = teme || [];
  if (!rel) return prikazanaLekcija(lista, putanja, idTeme);
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

function prikazanaLekcija(lista, putanja, idTeme) {
  const strana = putanja.startsWith("server/") && !putanja.slice("server/".length).includes("/")
    ? "server"
    : putanja.startsWith("client/js/")
      ? "client"
      : "";
  if (!strana || !putanja.endsWith(".js")) return null;
  const ime = putanja.split("/").pop();
  const kandidati = lista.filter((tema) => stranaLekcije(tema.id) === strana);
  const nadji = (tema) => tema.fajlovi.find((stavka) => stavka.split("/").pop().replace(/^\d{2}-/, "") === ime) || "";
  if (idTeme) {
    const tema = kandidati.find((stavka) => stavka.id === idTeme);
    const put = tema ? nadji(tema) : "";
    if (put) return { tema, put };
  }
  const prikazani = kandidati.flatMap((tema) => {
    const put = nadji(tema);
    return put ? [{ tema, put }] : [];
  });
  return prikazani.length === 1 ? prikazani[0] : null;
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
