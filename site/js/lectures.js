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
    figura: korak.figura,
    tipPrimer: korak.tipPrimer,
    samostalniPrimer: korak.samostalniPrimer,
    dijagram: korak.dijagram,
    analiza: korak.analiza,
  };
}

function napraviLekcije(doc) {
  return doc.teme.map((tema, i) => ({
    n: i + 1,
    title: tema.naslov,
    outcome: tema.ishod,
    podnaslov: tema.podnaslov,
    minuta: tema.minuta,
    problem: tema.problem,
    pretpostavka: tema.pretpostavka,
    options: tema.options,
    rezerva: tema.rezerva,
    izlaz: tema.izlaz,
    overview: tema.overview,
    terms: tema.pojmoviCasa,
    steps: tema.steps.map(mapirajKorak),
  }));
}

export let lectures = napraviLekcije(dokument);

export function osveziLekcije() {
  lectures = napraviLekcije(dokument);
}

export function sirovaTema(brojTeme) {
  return dokument.teme[brojTeme - 1] || null;
}

export function siroviKorak(brojTeme, indeksKoraka) {
  const tema = sirovaTema(brojTeme);
  return tema?.steps[indeksKoraka] || null;
}

export function preduslovCasa(n) {
  if (n === 1) return dokument.preduslovPrve;
  return dokument.teme[n - 2]?.ishod || "";
}
