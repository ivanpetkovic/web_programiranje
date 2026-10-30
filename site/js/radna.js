export const RADNA_KLJUC = "radnaVerzija";

const SKICA_FOLDERA = /^\s*client\/\s*\nserver\/\s*$/;

export function bezSkiceFoldera(putanja, tekst) {
  const sadrzaj = tekst ?? "";
  if (putanja === "client/index.html" && SKICA_FOLDERA.test(sadrzaj)) return "";
  return sadrzaj;
}

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

export function polazniTekst(putanja, original, disk) {
  void putanja;
  const izvor = original ?? "";
  const saDiska = typeof disk === "string" ? disk : "";
  if (izvor.trim()) return izvor;
  return saDiska;
}

export function tekstPrikaza({ putanja, original, radne, verzija, binarni }) {
  if (binarni) return { tekst: original, razlika: false, samoCitaj: true };
  const ugradjen = bezSkiceFoldera(putanja, original);
  if (verzija === "radna") {
    const sacuvano = imaRadnu(radne, putanja) ? radne[putanja] : "";
    const radni = bezSkiceFoldera(putanja, sacuvano);
    const tekst = radni.trim() ? radni : ugradjen;
    return { tekst, razlika: false, samoCitaj: false };
  }
  return { tekst: ugradjen, razlika: true, samoCitaj: true };
}

export function serverTabVidljiv(tema) {
  return tema >= 5;
}
