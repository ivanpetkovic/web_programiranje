import { tekstPrikaza } from "./radna.js";

export const PODRAZUMEVANI_PRIMER = "kontrolna-soba";

export function kljucRadne(id, put) {
  return `primer/${id}/${put}`;
}

export function pocetniFajl(putanje) {
  const lista = Array.isArray(putanje) ? putanje : [];
  if (lista.includes("index.html")) return "index.html";
  return lista.find((put) => put.endsWith(".html")) || lista[0] || "";
}

export function htmlZaPregled(putanje, otvoreno) {
  const lista = Array.isArray(putanje) ? putanje : [];
  if (otvoreno && String(otvoreno).endsWith(".html") && lista.includes(otvoreno)) return otvoreno;
  if (lista.includes("index.html")) return "index.html";
  return lista.find((put) => put.endsWith(".html")) || "";
}

export function primeniPrimer(stanje, radne, dogadaj) {
  const sledece = {
    id: stanje.id,
    otvoreno: stanje.otvoreno,
    verzija: stanje.verzija,
    putanje: stanje.putanje.slice(),
    verzije: stanje.verzije,
    kljuc: stanje.kljuc || "",
  };
  const mapa = { ...radne };
  let upis = null;
  let forsiraj = false;

  if (dogadaj.tip === "otvori" && sledece.putanje.includes(dogadaj.put)) {
    sledece.otvoreno = dogadaj.put;
    sledece.verzija = "radna";
    forsiraj = true;
  } else if (dogadaj.tip === "unos" && sledece.otvoreno) {
    const putanja = kljucRadne(sledece.id, sledece.otvoreno);
    upis = { putanja, tekst: dogadaj.tekst };
    mapa[putanja] = dogadaj.tekst;
    sledece.verzija = "radna";
  } else if (dogadaj.tip === "ugradjena" || dogadaj.tip === "ucitaj") {
    sledece.verzija = "ugradjena";
    forsiraj = true;
  } else if (dogadaj.tip === "radna") {
    sledece.verzija = "radna";
    forsiraj = true;
  } else if (dogadaj.tip === "reset" && sledece.otvoreno) {
    const putanja = kljucRadne(sledece.id, sledece.otvoreno);
    const tekst = sledece.verzije[sledece.otvoreno] || "";
    upis = { putanja, tekst };
    mapa[putanja] = tekst;
    sledece.verzija = "radna";
    forsiraj = true;
  } else if (dogadaj.tip === "sacuvaj" && sledece.verzija === "radna" && sledece.otvoreno) {
    const putanja = kljucRadne(sledece.id, sledece.otvoreno);
    upis = { putanja, tekst: dogadaj.tekst };
    mapa[putanja] = dogadaj.tekst;
  }

  if (!sledece.putanje.includes(sledece.otvoreno)) sledece.otvoreno = pocetniFajl(sledece.putanje);

  const putanja = sledece.otvoreno;
  const prazno = !putanja;
  let editor;
  if (prazno) editor = { putanja: "", tekst: "", samoCitaj: true, linije: [], prazno: true };
  else if (dogadaj.tip === "unos") editor = { putanja, tekst: dogadaj.tekst, samoCitaj: false, linije: null, prazno: false };
  else {
    const izbor = tekstPrikaza({
      putanja: kljucRadne(sledece.id, putanja),
      original: sledece.verzije[putanja] || "",
      radne: mapa,
      verzija: sledece.verzija,
      binarni: false,
    });
    editor = { putanja, tekst: izbor.tekst, samoCitaj: izbor.samoCitaj, linije: null, prazno: false };
  }

  const klijent = {};
  for (const put of sledece.putanje) {
    klijent[put] = tekstPrikaza({
      putanja: kljucRadne(sledece.id, put),
      original: sledece.verzije[put] || "",
      radne: mapa,
      verzija: sledece.verzija,
      binarni: false,
    }).tekst;
  }

  const kljuc = prazno ? "" : `${sledece.id}:${putanja}:${sledece.verzija}`;
  const osvezi = prazno || forsiraj || kljuc !== (stanje.kljuc || "");
  return {
    stanje: { ...sledece, kljuc: prazno || osvezi ? kljuc : stanje.kljuc },
    radne: mapa,
    upis,
    osvezi: dogadaj.tip === "unos" || dogadaj.tip === "sacuvaj" ? false : osvezi,
    zivo: dogadaj.tip !== "sacuvaj" && !prazno,
    prikaz: { editor, fajlovi: sledece.putanje, klijent, server: {} },
  };
}
