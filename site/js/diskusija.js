export const FAZE = ["Izbor", "Poređenje", "Pretpostavke", "Analiza", "Ponovni izbor"];

export function praznoStanje() {
  return { faza: 0, podvuceno: "", pretpostavka: "", zakljucak: "" };
}

export function potez(stanje, dogadaj) {
  const sada = stanje || praznoStanje();
  if (dogadaj.tip === "dalje") {
    return { ...sada, faza: Math.min(sada.faza + 1, FAZE.length - 1) };
  }
  if (dogadaj.tip === "izbor") {
    if (sada.faza !== 0 && sada.faza !== 4) return sada;
    return { ...sada, podvuceno: dogadaj.kljuc };
  }
  if (dogadaj.tip === "pretpostavka") return { ...sada, pretpostavka: dogadaj.tekst };
  if (dogadaj.tip === "zakljucak") return { ...sada, zakljucak: dogadaj.tekst };
  if (dogadaj.tip === "ponovi") return { ...sada, faza: 0, podvuceno: "" };
  return sada;
}

function znak(otkriveno, izabran, opcija) {
  if (otkriveno && opcija.ok) return "check-circle";
  if (!otkriveno && opcija.key === izabran) return "circle-dot";
  return "circle";
}

export function prikaz(stanje, pitalica, rezervaOtvorena) {
  const sada = stanje || praznoStanje();
  const rezerva = rezervaOtvorena === true && Boolean(pitalica.rezerva);
  const izvor = rezerva ? pitalica.rezerva : { problem: pitalica.problem, options: pitalica.options };
  const faza = sada.faza;
  return {
    naslov: rezerva ? "Rezerva" : "Diskusija",
    faza: FAZE[faza],
    problem: izvor.problem,
    opcije: izvor.options.map((opcija) => ({
      key: opcija.key,
      text: opcija.text,
      why: opcija.why,
      podvuceno: opcija.key === sada.podvuceno,
      mozeIzbor: faza === 0 || faza === 4,
      znak: znak(faza >= 3, sada.podvuceno, opcija),
      holds: faza >= 3 && Boolean(opcija.ok),
      whyVidljiv: faza >= 3,
    })),
    tisina: faza === 1,
    pretpostavka: { vidljiva: faza >= 2, tekst: sada.pretpostavka },
    zakljucak: { vidljiv: faza >= 4, tekst: sada.zakljucak },
    dalje: faza < FAZE.length - 1,
    mozeRezerva: !rezerva && Boolean(pitalica.rezerva) && faza === 4,
  };
}
