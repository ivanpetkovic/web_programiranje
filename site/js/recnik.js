import { tekstSekcija } from "./blokovi-lekcije.js";

const GLAVA = /^\*\*(.+?)\*\*:\s*$/;
const IZBEJAVA = /^_Avoid_:\s*(.*)$/;

export function pojmoviIzTeksta(markdown) {
  const pojmovi = [];
  let trenutni = null;
  const zatvori = () => {
    if (!trenutni) return;
    trenutni.definicija = trenutni.definicija.join(" ").replace(/\s+/g, " ").trim();
    pojmovi.push(trenutni);
    trenutni = null;
  };
  for (const red of String(markdown).split(/\r?\n/)) {
    if (/^#{1,6}\s/.test(red)) {
      zatvori();
      continue;
    }
    const glava = red.match(GLAVA);
    if (glava) {
      zatvori();
      trenutni = { ime: glava[1].trim(), definicija: [], izbegava: "" };
      continue;
    }
    if (!trenutni) continue;
    const izbegava = red.match(IZBEJAVA);
    if (izbegava) {
      trenutni.izbegava = izbegava[1].trim();
      continue;
    }
    if (red.trim()) trenutni.definicija.push(red.trim());
  }
  zatvori();
  return pojmovi;
}

export function poljaPojma(pojam) {
  return {
    ime: pojam.ime,
    definicija: pojam.definicija,
    izbegava: pojam.izbegava || "",
  };
}

function celaRec(tekst, glava) {
  const izvor = tekst.toLocaleLowerCase("sr");
  const cilj = glava.toLocaleLowerCase("sr");
  const bezbedno = cilj.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?<![\\p{L}\\p{N}_])${bezbedno}(?![\\p{L}\\p{N}_])`, "iu").test(izvor);
}

function nizPitalica(korak) {
  if (Array.isArray(korak.pitalice) && korak.pitalice.length) return korak.pitalice;
  if (korak.pitalica || (korak.opcije || []).length) {
    return [{ pitalica: korak.pitalica, opcije: korak.opcije }];
  }
  return [];
}

function tekstKoraka(korak) {
  const pitalice = nizPitalica(korak)
    .map((p) => {
      const opcije = (p.opcije || []).map((opcija) => `${opcija.text || ""} ${opcija.why || ""}`).join("\n");
      return [p.pitalica, opcije].filter(Boolean).join("\n");
    })
    .join("\n");
  return [korak.tekst, korak.kljucnaIdeja, pitalice, korak.isecak, korak.delic, tekstSekcija(korak)].filter(Boolean).join("\n");
}

export function lekcijePojma(kurs, glava) {
  const pogoci = [];
  kurs.teme.forEach((tema, ni) => {
    tema.steps.forEach((korak, ki) => {
      if (celaRec(tekstKoraka(korak), glava)) pogoci.push({ tema: ni + 1, korak: ki });
    });
  });
  return {
    teme: [...new Set(pogoci.map((pogodak) => pogodak.tema))],
    prvi: pogoci[0] || null,
    pogoci,
  };
}

function pocinje(tekst, upit) {
  return String(tekst || "").toLocaleLowerCase("sr").startsWith(upit);
}

export function predlozi(kurs, pojmovi, upit) {
  const q = upit.trim().toLocaleLowerCase("sr");
  if (!q) return [];
  const izlaz = [];
  for (const pojam of pojmovi) {
    const polja = poljaPojma(pojam);
    if (polja.ime.toLocaleLowerCase("sr").startsWith(q)) izlaz.push({ vrsta: "pojam", ...polja });
  }
  kurs.teme.forEach((tema, ni) => {
    tema.steps.forEach((korak, ki) => {
      for (const p of nizPitalica(korak)) {
        if (pocinje(p.pitalica, q)) {
          izlaz.push({ vrsta: "pitanje", tekst: p.pitalica, tema: ni + 1, korak: ki });
        }
      }
      if (pocinje(korak.isecak, q)) {
        izlaz.push({
          vrsta: "primer",
          tekst: korak.isecak,
          naslov: korak.isecakNaslov,
          tema: ni + 1,
          korak: ki,
        });
      }
    });
  });
  return izlaz;
}
