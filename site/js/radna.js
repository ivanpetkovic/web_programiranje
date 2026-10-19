export const RADNA_KLJUC = "radnaVerzija";

export function procitajRadne(skladiste) {
  try {
    const raw = skladiste.getItem(RADNA_KLJUC);
    if (!raw) return {};
    const mapa = JSON.parse(raw);
    if (!mapa || typeof mapa !== "object" || Array.isArray(mapa)) return {};
    const izlaz = {};
    for (const [putanja, tekst] of Object.entries(mapa)) {
      if (typeof tekst === "string") izlaz[putanja] = tekst;
    }
    return izlaz;
  } catch {
    return {};
  }
}

export function upisiRadnu(skladiste, mapa, putanja, tekst) {
  const sledeca = { ...mapa, [putanja]: tekst };
  try {
    skladiste.setItem(RADNA_KLJUC, JSON.stringify(sledeca));
    return { mapa: sledeca, sacuvano: true };
  } catch {
    return { mapa: sledeca, sacuvano: false };
  }
}

export function imaRadnu(mapa, putanja) {
  return Object.prototype.hasOwnProperty.call(mapa || {}, putanja);
}

export function tekstPrikaza({ putanja, original, radne, rezim }) {
  if (rezim === "radna") {
    const tekst = imaRadnu(radne, putanja) ? radne[putanja] : original;
    return { tekst, razlika: false, samoCitaj: false };
  }
  return { tekst: original, razlika: true, samoCitaj: true };
}

export function rezimPosleKoraka(radne, putanja) {
  return imaRadnu(radne, putanja) ? "radna" : "original";
}

export function serverTabVidljiv(nedelja) {
  return nedelja >= 4;
}
