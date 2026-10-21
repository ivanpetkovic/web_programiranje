const POLJA_FAJLA = ["putanja", "isecak", "isecakNaslov", "delic", "original"];

export function procitajTekst(tekst) {
  let kurs;
  try {
    kurs = JSON.parse(tekst);
  } catch {
    return { ok: false, greska: "Neispravan JSON.", kurs: null, napomena: "" };
  }
  if (!kurs || typeof kurs !== "object" || Array.isArray(kurs) || !Array.isArray(kurs.nedelje)) {
    return { ok: false, greska: "Dokument nema spisak nedelja.", kurs: null, napomena: "" };
  }
  if (!nedeljeSuIspravne(kurs.nedelje)) {
    return { ok: false, greska: "Nedelja nema korake.", kurs: null, napomena: "" };
  }
  const napomena = kurs.trajanjeNedelja !== kurs.nedelje.length ? "Trajanje je usklađeno sa brojem nedelja." : "";
  kurs.trajanjeNedelja = kurs.nedelje.length;
  return { ok: true, greska: "", napomena, kurs };
}

export function spremiTekst(kurs) {
  kurs.trajanjeNedelja = Array.isArray(kurs.nedelje) ? kurs.nedelje.length : 0;
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
    trajanjeNedelja: 0,
    preduslovPrve: "",
    nedelje: [],
  };
}

export function praznaNedelja() {
  return {
    naslov: "Nova nedelja",
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

export function dodajNedelju(kurs, indeks) {
  const sledeci = structuredClone(kurs);
  const mesto = indeks == null ? sledeci.nedelje.length : ogranicen(indeks, sledeci.nedelje.length);
  sledeci.nedelje.splice(mesto, 0, praznaNedelja());
  sledeci.trajanjeNedelja = sledeci.nedelje.length;
  return sledeci;
}

export function ukloniNedelju(kurs, indeks) {
  if (!kurs.nedelje[indeks]) return kurs;
  const sledeci = structuredClone(kurs);
  sledeci.nedelje.splice(indeks, 1);
  sledeci.trajanjeNedelja = sledeci.nedelje.length;
  return sledeci;
}

export function premestiNedelju(kurs, indeks, smer) {
  const cilj = indeks + smer;
  if (!Array.isArray(kurs.nedelje) || cilj < 0 || cilj >= kurs.nedelje.length) return kurs;
  const sledeci = structuredClone(kurs);
  const [nedelja] = sledeci.nedelje.splice(indeks, 1);
  sledeci.nedelje.splice(cilj, 0, nedelja);
  sledeci.trajanjeNedelja = sledeci.nedelje.length;
  return sledeci;
}

export function dodajKorak(kurs, nedeljaIndeks, indeks) {
  if (!kurs.nedelje[nedeljaIndeks]) return kurs;
  const sledeci = structuredClone(kurs);
  const koraci = sledeci.nedelje[nedeljaIndeks].steps;
  const mesto = indeks == null ? koraci.length : ogranicen(indeks, koraci.length);
  koraci.splice(mesto, 0, prazanKorak());
  return sledeci;
}

export function ukloniKorak(kurs, nedeljaIndeks, indeks) {
  const nedelja = kurs.nedelje[nedeljaIndeks];
  if (!nedelja || nedelja.steps.length < 2 || !nedelja.steps[indeks]) return kurs;
  const sledeci = structuredClone(kurs);
  sledeci.nedelje[nedeljaIndeks].steps.splice(indeks, 1);
  return sledeci;
}

export function premestiKorak(kurs, nedeljaIndeks, indeks, smer) {
  const nedelja = kurs.nedelje[nedeljaIndeks];
  if (!nedelja) return kurs;
  const cilj = indeks + smer;
  if (cilj < 0 || cilj >= nedelja.steps.length) return kurs;
  const sledeci = structuredClone(kurs);
  const koraci = sledeci.nedelje[nedeljaIndeks].steps;
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

export function dodajPojam(nedelja) {
  if (!Array.isArray(nedelja.pojmoviCasa)) nedelja.pojmoviCasa = [];
  nedelja.pojmoviCasa.push({
    id: `pojam-${nedelja.pojmoviCasa.length + 1}`,
    name: "",
    hint: "",
    body: "",
    code: "",
  });
  return nedelja;
}

export function ukloniPojam(nedelja, indeks) {
  if (!nedelja.pojmoviCasa?.[indeks]) return nedelja;
  nedelja.pojmoviCasa.splice(indeks, 1);
  return nedelja;
}

export function premestiPojam(nedelja, indeks, smer) {
  const pojmovi = nedelja.pojmoviCasa;
  if (!pojmovi) return nedelja;
  const cilj = indeks + smer;
  if (cilj < 0 || cilj >= pojmovi.length) return nedelja;
  const [pojam] = pojmovi.splice(indeks, 1);
  pojmovi.splice(cilj, 0, pojam);
  return nedelja;
}

export function preduslovNedelje(kurs, broj) {
  if (broj <= 1) return kurs.preduslovPrve || "";
  return kurs.nedelje[broj - 2]?.ishod || "";
}

function praznaOpcija(key, ok) {
  return { key, text: "", ok, why: "" };
}

function prebroji(opcije) {
  opcije.forEach((opcija, i) => {
    opcija.key = i < 26 ? String.fromCharCode(65 + i) : String(i + 1);
  });
}

function nedeljeSuIspravne(nedelje) {
  return nedelje.every((nedelja) => {
    if (!nedelja || typeof nedelja !== "object" || Array.isArray(nedelja) || !Array.isArray(nedelja.steps)) return false;
    return nedelja.steps.every((korak) => korak && typeof korak === "object" && !Array.isArray(korak));
  });
}

function ogranicen(indeks, duzina) {
  return Math.max(0, Math.min(indeks, duzina));
}

function nizIli(niz, podrazumevano) {
  return Array.isArray(niz) && niz.length ? niz : podrazumevano;
}
