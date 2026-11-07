export const KLJUC_STANJA = "web-programiranje:stanje";
export const VERZIJA_STANJA = 1;
export const PALETE = ["mornar", "ugalj", "pesak", "terakota"];
export const MODOVI = ["predavanja", "samostalni"];
export const SKALE_FONTA = ["0.875", "1", "1.125"];
export const NAJDUZI_KOMENTAR = 500;
const NAJDUZI_NASLOV = 300;

const STARI_KLJUCEVI = ["tema", "web-programiranje:mod", "web-programiranje:font", "web-programiranje:korak", "stabloSklopljeno"];
const STARE_PALETE = { tamna: "ugalj", svetla: "pesak" };
const STARE_SKALE = { "1.25": "1.125" };

export function podrazumevanoStanje() {
  return {
    verzija: VERZIJA_STANJA,
    mesto: { tema: null, uvod: false },
    napredak: {},
    podesavanja: { mod: null, font: "1", stabloSklopljeno: false, pozadinaKoda: "bela" },
    paleta: null,
    beleske: [],
  };
}

function objekat(vrednost) {
  return vrednost && typeof vrednost === "object" && !Array.isArray(vrednost);
}

function ceoBroj(vrednost, najmanje) {
  return Number.isInteger(vrednost) && vrednost >= najmanje;
}

function normalizujMesto(sirovo) {
  if (!objekat(sirovo)) return { tema: null, uvod: false };
  return { tema: ceoBroj(sirovo.tema, 1) ? sirovo.tema : null, uvod: sirovo.uvod === true };
}

function normalizujNapredak(sirovo) {
  const izlaz = {};
  if (!objekat(sirovo)) return izlaz;
  for (const [kljuc, vrednost] of Object.entries(sirovo)) {
    const tema = Number(kljuc);
    if (!ceoBroj(tema, 1) || String(tema) !== kljuc || !objekat(vrednost)) continue;
    const vidjeni = Array.isArray(vrednost.vidjeni)
      ? [...new Set(vrednost.vidjeni.filter((i) => ceoBroj(i, 0)))].sort((a, b) => a - b)
      : [];
    const poslednji = ceoBroj(vrednost.poslednji, 0) ? vrednost.poslednji : 0;
    izlaz[kljuc] = { vidjeni, poslednji };
  }
  return izlaz;
}

function normalizujPodesavanja(sirovo) {
  const izlaz = { mod: null, font: "1", stabloSklopljeno: false, pozadinaKoda: "bela" };
  if (!objekat(sirovo)) return izlaz;
  if (MODOVI.includes(sirovo.mod)) izlaz.mod = sirovo.mod;
  if (SKALE_FONTA.includes(sirovo.font)) izlaz.font = sirovo.font;
  if (typeof sirovo.stabloSklopljeno === "boolean") izlaz.stabloSklopljeno = sirovo.stabloSklopljeno;
  if (sirovo.pozadinaKoda === "crna" || sirovo.pozadinaKoda === "bela") izlaz.pozadinaKoda = sirovo.pozadinaKoda;
  return izlaz;
}

function normalizujBelesku(sirovo) {
  if (!objekat(sirovo) || !ceoBroj(sirovo.tema, 1) || !ceoBroj(sirovo.korak, 0)) return null;
  const izmenjeno = typeof sirovo.izmenjeno === "string" && !Number.isNaN(Date.parse(sirovo.izmenjeno))
    ? sirovo.izmenjeno
    : new Date(0).toISOString();
  return {
    tema: sirovo.tema,
    korak: sirovo.korak,
    naslov: typeof sirovo.naslov === "string" ? sirovo.naslov.slice(0, NAJDUZI_NASLOV) : "",
    komentar: typeof sirovo.komentar === "string" ? sirovo.komentar.slice(0, NAJDUZI_KOMENTAR) : "",
    izmenjeno,
  };
}

function normalizujBeleske(sirovo) {
  if (!Array.isArray(sirovo)) return [];
  const poKljucu = new Map();
  for (const stavka of sirovo) {
    const beleska = normalizujBelesku(stavka);
    if (!beleska) continue;
    const kljuc = `${beleska.tema}:${beleska.korak}`;
    const pre = poKljucu.get(kljuc);
    if (!pre || pre.izmenjeno <= beleska.izmenjeno) poKljucu.set(kljuc, beleska);
  }
  return [...poKljucu.values()];
}

export function normalizujStanje(sirovo) {
  if (!objekat(sirovo)) return podrazumevanoStanje();
  return {
    verzija: VERZIJA_STANJA,
    mesto: normalizujMesto(sirovo.mesto),
    napredak: normalizujNapredak(sirovo.napredak),
    podesavanja: normalizujPodesavanja(sirovo.podesavanja),
    paleta: PALETE.includes(sirovo.paleta) ? sirovo.paleta : null,
    beleske: normalizujBeleske(sirovo.beleske),
  };
}

function procitaj(skladiste, kljuc) {
  try {
    return skladiste.getItem(kljuc);
  } catch {
    return null;
  }
}

export function prenesiStareKljuceve(skladiste) {
  const stari = Object.fromEntries(STARI_KLJUCEVI.map((kljuc) => [kljuc, procitaj(skladiste, kljuc)]));
  const stanje = podrazumevanoStanje();
  if (Object.values(stari).every((vrednost) => vrednost === null)) return stanje;

  const paleta = STARE_PALETE[stari.tema] || stari.tema;
  if (PALETE.includes(paleta)) stanje.paleta = paleta;
  if (MODOVI.includes(stari["web-programiranje:mod"])) stanje.podesavanja.mod = stari["web-programiranje:mod"];
  const font = STARE_SKALE[stari["web-programiranje:font"]] || stari["web-programiranje:font"];
  if (SKALE_FONTA.includes(font)) stanje.podesavanja.font = font;
  stanje.podesavanja.stabloSklopljeno = stari.stabloSklopljeno === "1";

  try {
    const mesto = JSON.parse(stari["web-programiranje:korak"] || "null");
    if (objekat(mesto)) {
      const tema = mesto.tema || mesto.nedelja;
      if (ceoBroj(tema, 1)) {
        stanje.mesto.tema = tema;
        stanje.napredak[String(tema)] = { vidjeni: [], poslednji: ceoBroj(mesto.korak, 0) ? mesto.korak : 0 };
      }
      for (const kljuc of Array.isArray(mesto.sacuvani) ? mesto.sacuvani : []) {
        const [n, i] = String(kljuc).split(":").map(Number);
        if (!ceoBroj(n, 1) || !ceoBroj(i, 0)) continue;
        const red = stanje.napredak[String(n)] || { vidjeni: [], poslednji: 0 };
        red.vidjeni.push(i);
        stanje.napredak[String(n)] = red;
      }
    }
  } catch {}

  const gotovo = normalizujStanje(stanje);
  if (sacuvajStanje(skladiste, gotovo).ok) {
    for (const kljuc of STARI_KLJUCEVI) {
      try {
        skladiste.removeItem(kljuc);
      } catch {}
    }
  }
  return gotovo;
}

export function ucitajStanje(skladiste) {
  const tekst = procitaj(skladiste, KLJUC_STANJA);
  if (tekst === null) return prenesiStareKljuceve(skladiste);
  try {
    const sirovo = JSON.parse(tekst);
    if (!objekat(sirovo) || sirovo.verzija !== VERZIJA_STANJA) return podrazumevanoStanje();
    return normalizujStanje(sirovo);
  } catch {
    return podrazumevanoStanje();
  }
}

export function sacuvajStanje(skladiste, stanje) {
  try {
    skladiste.setItem(KLJUC_STANJA, JSON.stringify(normalizujStanje(stanje)));
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

export function obrisiStanje(skladiste) {
  try {
    skladiste.removeItem(KLJUC_STANJA);
  } catch {}
  return podrazumevanoStanje();
}

export function izveziStanje(stanje) {
  return JSON.stringify(normalizujStanje(stanje), null, 2);
}

export function uveziStanje(tekst) {
  let sirovo;
  try {
    sirovo = JSON.parse(String(tekst));
  } catch {
    return { ok: false, greska: "Fajl nije JSON." };
  }
  if (!objekat(sirovo) || sirovo.verzija !== VERZIJA_STANJA) {
    return { ok: false, greska: "Fajl nije sačuvano stanje." };
  }
  return { ok: true, stanje: normalizujStanje(sirovo) };
}

export function zabeleziKorak(stanje, tema, korak) {
  if (!ceoBroj(tema, 1) || !ceoBroj(korak, 0)) return stanje;
  const kljuc = String(tema);
  const pre = stanje.napredak[kljuc] || { vidjeni: [], poslednji: 0 };
  const vidjeni = pre.vidjeni.includes(korak) ? pre.vidjeni : [...pre.vidjeni, korak].sort((a, b) => a - b);
  return {
    ...stanje,
    mesto: { tema, uvod: false },
    napredak: { ...stanje.napredak, [kljuc]: { vidjeni, poslednji: korak } },
  };
}

export function zabeleziUvod(stanje) {
  return { ...stanje, mesto: { ...stanje.mesto, uvod: true } };
}

export function vidjeniKoraci(stanje, tema) {
  return stanje.napredak[String(tema)]?.vidjeni || [];
}

export function poslednjiKorak(stanje, tema) {
  return stanje.napredak[String(tema)]?.poslednji ?? 0;
}

export function nadjiBelesku(stanje, tema, korak) {
  return stanje.beleske.find((b) => b.tema === tema && b.korak === korak) || null;
}

export function postaviBelesku(stanje, { tema, korak, naslov, komentar }, sada = new Date().toISOString()) {
  const beleska = normalizujBelesku({ tema, korak, naslov, komentar, izmenjeno: sada });
  if (!beleska) return stanje;
  const ostale = stanje.beleske.filter((b) => b.tema !== tema || b.korak !== korak);
  return { ...stanje, beleske: [...ostale, beleska] };
}

export function ukloniBelesku(stanje, tema, korak) {
  return { ...stanje, beleske: stanje.beleske.filter((b) => b.tema !== tema || b.korak !== korak) };
}

export function postaviPodesavanje(stanje, ime, vrednost) {
  const podesavanja = normalizujPodesavanja({ ...stanje.podesavanja, [ime]: vrednost });
  return { ...stanje, podesavanja };
}

export function postaviPaletu(stanje, id) {
  return { ...stanje, paleta: PALETE.includes(id) ? id : null };
}

export function napraviStanje(skladiste) {
  let trenutno = ucitajStanje(skladiste);
  let upisOk = true;
  const slusaoci = new Set();

  function objavi() {
    for (const slusalac of slusaoci) slusalac(trenutno, upisOk);
  }

  function zameni(novo) {
    trenutno = normalizujStanje(novo);
    upisOk = sacuvajStanje(skladiste, trenutno).ok;
    objavi();
    return trenutno;
  }

  return {
    stanje: () => trenutno,
    poslednjiUpisOk: () => upisOk,
    promeni(izmena) {
      return zameni(izmena(trenutno));
    },
    zameni,
    obrisi() {
      trenutno = obrisiStanje(skladiste);
      upisOk = true;
      objavi();
      return trenutno;
    },
    naPromenu(slusalac) {
      slusaoci.add(slusalac);
      return () => slusaoci.delete(slusalac);
    },
  };
}
