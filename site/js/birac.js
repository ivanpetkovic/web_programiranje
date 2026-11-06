export function popunaKoraka(vidjeni, brojKoraka) {
  const ukupno = Number.isInteger(brojKoraka) && brojKoraka > 0 ? brojKoraka : 0;
  const uOpsegu = new Set();
  for (const indeks of Array.isArray(vidjeni) ? vidjeni : []) {
    if (Number.isInteger(indeks) && indeks >= 0 && indeks < ukupno) uOpsegu.add(indeks);
  }
  return { vidjeno: uOpsegu.size, ukupno };
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

export function rasporedBiraca(sirina) {
  const px = Number(sirina);
  if (!Number.isFinite(px) || px >= 900) return "siroko";
  if (px >= 760) return "srednje";
  if (px >= 540) return "usko";
  return "tesno";
}

export function adresaPregleda(poreklo, putanja) {
  const koren = String(poreklo || "").replace(/\/+$/, "");
  const put = String(putanja || "").replace(/^\/+/, "");
  return `${koren}/${put}`;
}

