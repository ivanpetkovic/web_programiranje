const RUCNA_NUMERACIJA = /^\d+(?:\.\d+)+\.\s*/;

export function bezRucneNumeracije(tekst) {
  return String(tekst ?? "").replace(RUCNA_NUMERACIJA, "");
}

export function oznakaPitanja(korak, redni) {
  const brojKoraka = Number(korak);
  const brojPitanja = Number(redni);
  if (!Number.isInteger(brojKoraka) || brojKoraka < 1) return "";
  if (!Number.isInteger(brojPitanja) || brojPitanja < 1) return "";
  return `(${brojKoraka}/${brojPitanja})`;
}
