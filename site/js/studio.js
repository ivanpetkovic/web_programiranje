import { proveriSemu } from "./sema.js";

const POLJA_FAJLA = ["putanja", "isecak", "isecakNaslov", "delic", "original"];
let semaKursa = null;

if (typeof process !== "undefined" && process.release?.name === "node") {
  const { readFileSync } = await import("node:fs");
  semaKursa = JSON.parse(readFileSync(new URL("../kurs.json.schema", import.meta.url), "utf8"));
}

export function postaviSemuKursa(sema) {
  semaKursa = sema;
}

export function procitajTekst(tekst) {
  let kurs;
  try {
    kurs = JSON.parse(tekst);
  } catch {
    return { ok: false, greska: "Neispravan JSON.", kurs: null, napomena: "" };
  }
  uskladiStareKljuceve(kurs);
  if (!kurs || typeof kurs !== "object" || Array.isArray(kurs) || !Array.isArray(kurs.teme)) {
    return { ok: false, greska: "Dokument nema spisak tema.", kurs: null, napomena: "" };
  }
  const napomena = kurs.trajanjeTema !== kurs.teme.length ? "Trajanje je usklađeno sa brojem tema." : "";
  kurs.trajanjeTema = kurs.teme.length;
  if (!semaKursa) return { ok: false, greska: "Šema kursa nije učitana.", kurs: null, napomena: "" };
  const provera = proveriSemu(semaKursa, kurs);
  if (!provera.ok) return { ok: false, greska: provera.greske[0], kurs: null, napomena: "" };
  return { ok: true, greska: "", napomena, kurs };
}

export function spremiTekst(kurs) {
  kurs.trajanjeTema = Array.isArray(kurs.teme) ? kurs.teme.length : 0;
  return `${JSON.stringify(kurs, null, 2)}\n`;
}

export function prazanKurs() {
  return {
    ustanova: "",
    ustanovaRed: "",
    ustanovaBok: "",
    naslov: "Novi kurs",
    oznaka: "",
    grb: "",
    trajanjeTema: 0,
    preduslovPrve: "",
    teme: [],
  };
}

export function praznaTema() {
  return {
    naslov: "Nova tema",
    podnaslov: "",
    ishod: "",
    minuta: 90,
    problem: "",
    pretpostavka: "",
    options: [praznaOpcija("A", false), praznaOpcija("B", true)],
    rezerva: {
      problem: "",
      options: [praznaOpcija("A", true), praznaOpcija("B", false)],
    },
    izlaz: "",
    pojmoviCasa: [],
    steps: [prazanKorak()],
  };
}

export function prazanKorak() {
  return {
    naslov: "Novi korak",
    nivo: "Osnovno",
    minuta: 4,
    tekst: "",
    kljucnaIdeja: "",
    pitalica: "",
    opcije: [praznaOpcija("A", false), praznaOpcija("B", true)],
  };
}

export function dodajTemu(kurs, indeks) {
  const sledeci = structuredClone(kurs);
  const mesto = indeks == null ? sledeci.teme.length : ogranicen(indeks, sledeci.teme.length);
  sledeci.teme.splice(mesto, 0, praznaTema());
  sledeci.trajanjeTema = sledeci.teme.length;
  return sledeci;
}

export function ukloniTemu(kurs, indeks) {
  if (!kurs.teme[indeks]) return kurs;
  const sledeci = structuredClone(kurs);
  sledeci.teme.splice(indeks, 1);
  sledeci.trajanjeTema = sledeci.teme.length;
  return sledeci;
}

export function premestiTemu(kurs, indeks, smer) {
  const cilj = indeks + smer;
  if (!Array.isArray(kurs.teme) || cilj < 0 || cilj >= kurs.teme.length) return kurs;
  const sledeci = structuredClone(kurs);
  const [tema] = sledeci.teme.splice(indeks, 1);
  sledeci.teme.splice(cilj, 0, tema);
  sledeci.trajanjeTema = sledeci.teme.length;
  return sledeci;
}

export function dodajKorak(kurs, temaIndeks, indeks) {
  if (!kurs.teme[temaIndeks]) return kurs;
  const sledeci = structuredClone(kurs);
  const koraci = sledeci.teme[temaIndeks].steps;
  const mesto = indeks == null ? koraci.length : ogranicen(indeks, koraci.length);
  koraci.splice(mesto, 0, prazanKorak());
  return sledeci;
}

export function ukloniKorak(kurs, temaIndeks, indeks) {
  const tema = kurs.teme[temaIndeks];
  if (!tema || tema.steps.length < 2 || !tema.steps[indeks]) return kurs;
  const sledeci = structuredClone(kurs);
  sledeci.teme[temaIndeks].steps.splice(indeks, 1);
  return sledeci;
}

export function premestiKorak(kurs, temaIndeks, indeks, smer) {
  const tema = kurs.teme[temaIndeks];
  if (!tema) return kurs;
  const cilj = indeks + smer;
  if (cilj < 0 || cilj >= tema.steps.length) return kurs;
  const sledeci = structuredClone(kurs);
  const koraci = sledeci.teme[temaIndeks].steps;
  const [korak] = koraci.splice(indeks, 1);
  koraci.splice(cilj, 0, korak);
  return sledeci;
}

export function indeksPoslePremestanja(indeks, od, smer) {
  const ka = od + smer;
  if (indeks === od) return ka;
  if (od < indeks && indeks <= ka) return indeks - 1;
  if (ka <= indeks && indeks < od) return indeks + 1;
  return indeks;
}

export function vrstaKoraka(korak) {
  if (korak && korak.figura) return "figura";
  if (korak && (typeof korak.putanja === "string" || typeof korak.isecak === "string")) return "fajl";
  return "prica";
}

export function postaviVrstuKoraka(korak, vrsta) {
  if (vrsta === "prica") {
    for (const polje of [...POLJA_FAJLA, "figura"]) delete korak[polje];
    return korak;
  }
  if (vrsta === "fajl") {
    delete korak.figura;
    if (typeof korak.putanja !== "string") korak.putanja = "client/index.html";
    if (typeof korak.isecak !== "string") korak.isecak = "";
    if (typeof korak.isecakNaslov !== "string") korak.isecakNaslov = korak.naslov || "";
    if (typeof korak.delic !== "string") korak.delic = korak.isecak;
    if (typeof korak.original !== "string") {
      korak.original = korak.isecak.endsWith("\n") ? korak.isecak : `${korak.isecak}\n`;
    }
    return korak;
  }
  if (vrsta === "figura") {
    for (const polje of POLJA_FAJLA) delete korak[polje];
    if (!korak.figura || (korak.figura.vrsta !== "put" && korak.figura.vrsta !== "linija")) {
      korak.figura = {
        vrsta: "put",
        cvorovi: [
          { id: "a", natpis: "" },
          { id: "b", natpis: "" },
        ],
      };
    }
  }
  return korak;
}

export function postaviVrstuFigure(korak, vrsta) {
  if (vrsta === "linija") {
    const oznake = nizIli(korak.figura?.oznake, [{ godina: "", natpis: "" }]);
    const figura = { vrsta: "linija", oznake };
    if (korak.figura?.pokret === "redom") figura.pokret = "redom";
    korak.figura = figura;
    return korak;
  }
  const cvorovi = nizIli(korak.figura?.cvorovi, [
    { id: "a", natpis: "" },
    { id: "b", natpis: "" },
  ]);
  const figura = { vrsta: "put", cvorovi };
  if (korak.figura?.pokret === "jednom") figura.pokret = "jednom";
  korak.figura = figura;
  return korak;
}

export function postaviPokret(korak, ukljucen) {
  if (!korak.figura) return korak;
  if (ukljucen) korak.figura.pokret = korak.figura.vrsta === "linija" ? "redom" : "jednom";
  else delete korak.figura.pokret;
  return korak;
}

export function dodajCvor(korak) {
  korak.figura.cvorovi.push({ id: `cvor-${korak.figura.cvorovi.length + 1}`, natpis: "" });
  return korak;
}

export function ukloniCvor(korak, indeks) {
  if (korak.figura.cvorovi.length < 2) return korak;
  korak.figura.cvorovi.splice(indeks, 1);
  return korak;
}

export function dodajOznaku(korak) {
  korak.figura.oznake.push({ godina: "", natpis: "" });
  return korak;
}

export function ukloniOznaku(korak, indeks) {
  if (korak.figura.oznake.length < 2) return korak;
  korak.figura.oznake.splice(indeks, 1);
  return korak;
}

export function dodajOpciju(opcije) {
  opcije.push({ key: "", text: "", ok: false, why: "" });
  prebroji(opcije);
  return opcije;
}

export function ukloniOpciju(opcije, indeks) {
  if (!opcije[indeks]) return opcije;
  opcije.splice(indeks, 1);
  prebroji(opcije);
  return opcije;
}

export function premestiOpciju(opcije, indeks, smer) {
  const cilj = indeks + smer;
  if (cilj < 0 || cilj >= opcije.length) return opcije;
  const [opcija] = opcije.splice(indeks, 1);
  opcije.splice(cilj, 0, opcija);
  prebroji(opcije);
  return opcije;
}

export function oznaciOdgovor(opcije, indeks) {
  opcije.forEach((opcija, i) => {
    opcija.ok = i === indeks;
  });
  return opcije;
}

export function dodajPojam(tema) {
  if (!Array.isArray(tema.pojmoviCasa)) tema.pojmoviCasa = [];
  tema.pojmoviCasa.push({
    id: `pojam-${tema.pojmoviCasa.length + 1}`,
    name: "",
    hint: "",
    body: "",
    code: "",
  });
  return tema;
}

export function ukloniPojam(tema, indeks) {
  if (!tema.pojmoviCasa?.[indeks]) return tema;
  tema.pojmoviCasa.splice(indeks, 1);
  return tema;
}

export function premestiPojam(tema, indeks, smer) {
  const pojmovi = tema.pojmoviCasa;
  if (!pojmovi) return tema;
  const cilj = indeks + smer;
  if (cilj < 0 || cilj >= pojmovi.length) return tema;
  const [pojam] = pojmovi.splice(indeks, 1);
  pojmovi.splice(cilj, 0, pojam);
  return tema;
}

export function preduslovTeme(kurs, broj) {
  if (broj <= 1) return kurs.preduslovPrve || "";
  return kurs.teme[broj - 2]?.ishod || "";
}

function praznaOpcija(key, ok) {
  return { key, text: "", ok, why: "" };
}

function prebroji(opcije) {
  opcije.forEach((opcija, i) => {
    opcija.key = i < 26 ? String.fromCharCode(65 + i) : String(i + 1);
  });
}

function uskladiStareKljuceve(kurs) {
  if (!kurs || typeof kurs !== "object" || Array.isArray(kurs)) return;
  if (!Array.isArray(kurs.teme) && Array.isArray(kurs.nedelje)) {
    kurs.teme = kurs.nedelje;
    delete kurs.nedelje;
  }
  if (kurs.trajanjeTema == null && kurs.trajanjeNedelja != null) {
    kurs.trajanjeTema = kurs.trajanjeNedelja;
    delete kurs.trajanjeNedelja;
  }
}

function ogranicen(indeks, duzina) {
  return Math.max(0, Math.min(indeks, duzina));
}

function nizIli(niz, podrazumevano) {
  return Array.isArray(niz) && niz.length ? niz : podrazumevano;
}
