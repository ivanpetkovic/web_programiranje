import { jeHttp, jeShell } from "./prilog.js";

const SABLON_SREDINA = /^Zašto:\s*.+?\s*U ovom koraku:\s*(.+?)\s*Proveriti posledicu/s;
const SABLON_ZASTO = /Ta pretpostavka|To je u skladu|zanemaruje ključnu/;

export function editMod(pretraga) {
  return new URLSearchParams(String(pretraga || "")).get("edit") === "true";
}

function pominje(tekst, rec) {
  const cilj = String(rec || "").trim();
  if (cilj.length < 3) return false;
  const bezbedno = cilj.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+");
  return new RegExp(`(?<![\\p{L}\\p{N}_/])${bezbedno}(?![\\p{L}\\p{N}_])`, "iu").test(tekst);
}

export function tokeniPojma(pojam) {
  const ime = String(pojam?.name || pojam?.ime || "").trim();
  const id = String(pojam?.id || "").trim().replace(/-/g, " ");
  const tokeni = new Set();
  if (ime.length >= 3) tokeni.add(ime);
  if (id.length >= 3) tokeni.add(id);
  for (const rec of ime.split(/\s+/)) {
    if (rec.length >= 3 && rec === rec.toUpperCase()) tokeni.add(rec);
  }
  return [...tokeni];
}

function tekstKoraka(korak) {
  const opcije = (korak?.opcije || []).map((opcija) => opcija.text || "");
  return [
    korak?.naslov,
    korak?.tekst,
    korak?.kljucnaIdeja,
    korak?.pitalica,
    korak?.isecak,
    korak?.delic,
    korak?.samostalniPrimer?.tekst,
    korak?.dijagram?.tekst,
    ...opcije,
  ].filter(Boolean).join("\n");
}

function pojmoviKursa(kurs, nedeljaIndeks) {
  const nedelje = Array.isArray(kurs?.nedelje) ? kurs.nedelje : [];
  const redosled = [nedelje[nedeljaIndeks], ...nedelje.filter((_, i) => i !== nedeljaIndeks)];
  const pojmovi = [];
  for (const nedelja of redosled) {
    for (const pojam of nedelja?.pojmoviCasa || []) pojmovi.push(pojam);
  }
  for (const pojam of kurs?.dopunaGlosara || []) pojmovi.push(pojam);
  return pojmovi;
}

export function objasnjenjaKoraka(kurs, nedeljaIndeks, korak) {
  const tekst = tekstKoraka(korak);
  const vidjeni = new Set();
  const izlaz = [];
  for (const pojam of pojmoviKursa(kurs, nedeljaIndeks)) {
    const telo = String(pojam?.body || "").trim();
    const id = pojam?.id || pojam?.name;
    if (!telo || !id || vidjeni.has(id)) continue;
    if (!tokeniPojma(pojam).some((token) => pominje(tekst, token))) continue;
    vidjeni.add(id);
    izlaz.push({
      id,
      ime: pojam.name || id,
      hint: pojam.hint || "",
      telo,
      kod: pojam.code || "",
    });
  }
  return izlaz;
}

function prvaRecenica(tekst) {
  const cist = String(tekst || "").replace(/\s+/g, " ").trim();
  if (!cist) return "";
  const kraj = cist.search(/[.!?](\s|$)/);
  return kraj === -1 ? cist : cist.slice(0, kraj + 1);
}

function dopunaIzAnalize(korak, recenica) {
  const analiza = String(korak?.analiza || "").trim();
  if (!analiza) return "";
  const sredina = analiza.match(SABLON_SREDINA);
  if (sredina) {
    const uKoraku = sredina[1].replace(/\s+/g, " ").trim();
    const tekst = String(korak?.tekst || "").replace(/\s+/g, " ").trim();
    if (!uKoraku || uKoraku === recenica || uKoraku === tekst || tekst.startsWith(uKoraku)) return "";
    return uKoraku.length > 400 ? "" : uKoraku;
  }
  if (analiza.startsWith("Zašto:")) return "";
  return analiza.length > 400 ? "" : analiza;
}

function dopunaIzOdgovora(korak, recenica) {
  const tacan = (korak?.opcije || []).find((opcija) => opcija.ok);
  const cista = String(tacan?.why || "").split(SABLON_ZASTO)[0].replace(/\s+/g, " ").trim();
  if (!cista || cista === recenica || recenica.includes(cista) || cista.length > 400) return "";
  return cista;
}

export function smisaoKljucne(korak) {
  const recenica = String(korak?.kljucnaIdeja || "").trim();
  const dopuna = dopunaIzAnalize(korak, recenica) || dopunaIzOdgovora(korak, recenica);
  if (recenica) return { recenica, dopuna };
  return { recenica: prvaRecenica(korak?.tekst), dopuna: "" };
}

export function izvorUgradjenog(korak, vrsta) {
  if (vrsta === "eksperiment") return { polje: "samostalniPrimer", tekst: korak?.samostalniPrimer?.tekst || "" };
  if (vrsta === "dijagram") return { polje: "dijagram", tekst: korak?.dijagram?.tekst || "" };
  if (vrsta === "http") {
    if (jeHttp(korak?.isecak)) return { polje: "isecak", tekst: String(korak.isecak || "").trim() };
    return { polje: "delic", tekst: String(korak?.delic || "") };
  }
  if (vrsta === "komanda") {
    if (jeShell(korak?.isecak)) return { polje: "isecak", tekst: String(korak.isecak || "").trim() };
    return { polje: "delic", tekst: String(korak?.delic || "") };
  }
  if (korak?.ugradjen && typeof korak.original === "string") return { polje: "original", tekst: korak.original };
  if (String(korak?.isecak || "").trim()) return { polje: "isecak", tekst: korak.isecak };
  return { polje: "delic", tekst: korak?.delic || "" };
}
