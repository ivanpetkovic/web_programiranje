export function popunaKoraka(sacuvani, nedelja, brojKoraka) {
  const ukupno = Number.isInteger(brojKoraka) && brojKoraka > 0 ? brojKoraka : 0;
  const vidjeni = new Set();
  for (const kljuc of Array.isArray(sacuvani) ? sacuvani : []) {
    if (typeof kljuc !== "string") continue;
    const razmak = kljuc.indexOf(":");
    if (razmak < 1) continue;
    const n = Number(kljuc.slice(0, razmak));
    const indeks = Number(kljuc.slice(razmak + 1));
    if (n !== nedelja || !Number.isInteger(indeks) || indeks < 0 || indeks >= ukupno) continue;
    vidjeni.add(indeks);
  }
  return { sacuvano: vidjeni.size, ukupno };
}

export function izborFajla(korak) {
  if (!korak || typeof korak.putanja !== "string" || !korak.putanja.includes("/")) return null;
  return korak.putanja;
}

export function prikaziIzlaz(indeks, brojKoraka, izlaz) {
  if (!Number.isInteger(indeks) || !Number.isInteger(brojKoraka) || indeks !== brojKoraka - 1) return null;
  if (typeof izlaz !== "string" || !izlaz) return null;
  return { tekst: izlaz, polje: false };
}

export function adresaPregleda(poreklo, putanja) {
  const koren = String(poreklo || "").replace(/\/+$/, "");
  const put = String(putanja || "").replace(/^\/+/, "");
  return `${koren}/${put}`;
}

export function rezimPosleAkcije(akcija, rezim) {
  if (akcija === "ucitaj" || akcija === "lekcija") return "original";
  if (akcija === "moj-kod" || akcija === "reset") return "radna";
  return rezim;
}

export function upisPosleAkcije(akcija, rezim) {
  if (akcija === "reset") return true;
  if (akcija === "sacuvaj") return rezim === "radna";
  return false;
}
