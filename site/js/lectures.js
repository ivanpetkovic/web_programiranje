import kurs from "../kurs.json" with { type: "json" };

export const dokument = kurs;

export function mapirajKorak(korak) {
  return {
    putanja: korak.putanja,
    naslov: korak.naslov,
    nivo: korak.nivo,
    minuta: korak.minuta,
    primer: korak.tekst,
    tekst: korak.tekst,
    objasnjenje: korak.kljucnaIdeja,
    kljucnaIdeja: korak.kljucnaIdeja,
    kod: korak.isecak,
    isecak: korak.isecak,
    isecakNaslov: korak.isecakNaslov,
    delic: korak.delic,
    original: korak.original ?? korak.delic,
    ugradjen: typeof korak.original === "string",
    pitalica: korak.pitalica,
    opcije: korak.opcije,
  };
}

export const lectures = kurs.nedelje.map((nedelja, i) => ({
  n: i + 1,
  title: nedelja.naslov,
  outcome: nedelja.ishod,
  podnaslov: nedelja.podnaslov,
  minuta: nedelja.minuta,
  problem: nedelja.problem,
  pretpostavka: nedelja.pretpostavka,
  options: nedelja.options,
  rezerva: nedelja.rezerva,
  izlaz: nedelja.izlaz,
  overview: nedelja.overview,
  terms: nedelja.pojmoviCasa,
  steps: nedelja.steps.map(mapirajKorak),
}));

export function preduslovCasa(n) {
  if (n === 1) return kurs.preduslovPrve;
  return lectures[n - 2].outcome;
}
