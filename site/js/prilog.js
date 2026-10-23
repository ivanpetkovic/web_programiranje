import { spojeniPrikaz } from "./razlika.js";

const SHELL = /^(?:node|npm|npx|docker|podman|curl|wget|git)\b/;
const HTTP_RED = /^(?:GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\s+\S+(?:\s+HTTP\/\d(?:\.\d)?)?$|^HTTP\/\d/i;

function redovi(tekst) {
  return String(tekst ?? "")
    .split("\n")
    .map((red) => red.trim())
    .filter(Boolean);
}

export function imeFajla(putanja) {
  const ime = String(putanja ?? "").split("/").filter(Boolean).pop();
  return ime || "";
}

export function jeShell(tekst) {
  const lista = redovi(tekst);
  return lista.length === 1 && SHELL.test(lista[0]);
}

export function jeHttp(tekst) {
  const lista = redovi(tekst);
  return lista.length > 0 && lista.every((red) => HTTP_RED.test(red));
}

export function imaHttpRed(tekst) {
  return redovi(tekst).some((red) => HTTP_RED.test(red));
}

export function ulaziUFajl(tekst) {
  return !jeShell(tekst) && !imaHttpRed(tekst);
}

export function jeKomentarLinije(tekst) {
  const red = String(tekst ?? "").trim();
  return red.startsWith("//") || red.startsWith("/*") || red.startsWith("*") || red.startsWith("*/");
}

function jeKod(tekst) {
  const telo = String(tekst ?? "").trim();
  if (!telo) return true;
  try {
    new Function(telo);
    return true;
  } catch {
    return false;
  }
}

export function komandaKoraka(korak) {
  if (!korak) return "";
  if (jeShell(korak.isecak)) return String(korak.isecak).trim();
  if (jeShell(korak.delic)) return String(korak.delic).trim();
  return "";
}

export function httpKoraka(korak) {
  if (!korak) return "";
  if (jeHttp(korak.isecak)) return String(korak.isecak).trim();
  return redovi(korak.delic).filter((red) => HTTP_RED.test(red)).join("\n");
}

export function dodatakPrikaza(korak) {
  if (!korak?.putanja) return "";
  const delic = String(korak.delic ?? "");
  const isecak = String(korak.isecak ?? "");
  if (!ulaziUFajl(delic)) return "";
  if (jeKomentarLinije(delic) && !jeKomentarLinije(isecak)) return delic;
  if (String(korak.putanja).endsWith(".js") && !jeKod(isecak)) return delic;
  if (jeShell(isecak) || jeHttp(isecak)) return delic;
  return isecak;
}

export function prikazPriloga(korak, ranije) {
  const komanda = komandaKoraka(korak);
  const http = httpKoraka(korak);
  if (!korak?.putanja) return { fajl: null, komanda, http };
  return {
    fajl: {
      ime: imeFajla(korak.putanja),
      putanja: korak.putanja,
      linije: spojeniPrikaz(ranije, dodatakPrikaza(korak)),
    },
    komanda,
    http,
  };
}
