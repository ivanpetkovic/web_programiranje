import { tekstoviServera } from "./pregled.js";
import { serverTabVidljiv, tekstPrikaza } from "./radna.js";
import { razlikaOriginala } from "./razlika.js";
import { fajloviStrane, prethodnaVerzija, stabloDo } from "./stablo.js";

const BINARNI = /\.(ttf|png|jpe?g|woff2?)$/i;

export function praznaSesija(radne = {}) {
  return {
    strana: "client",
    otvoreno: { client: "", server: "" },
    verzija: "ugradjena",
    radne: { ...radne },
    kljucFokusa: "",
    otvoreniKljuc: "",
  };
}

function kopija(sesija) {
  return {
    ...sesija,
    otvoreno: { ...sesija.otvoreno },
    radne: { ...sesija.radne },
  };
}

function puna(sesija) {
  const put = sesija.otvoreno[sesija.strana];
  return put ? `${sesija.strana}/${put}` : "";
}

function fokus(sesija, dogadaj, tema) {
  const sledeca = kopija(sesija);
  if (!dogadaj.putanja) {
    const kljuc = `${dogadaj.kljuc}:prazno`;
    if (sledeca.kljucFokusa === kljuc) return sesija;
    sledeca.kljucFokusa = kljuc;
    sledeca.otvoreno = { client: "", server: "" };
    return sledeca;
  }
  const side = dogadaj.putanja.slice(0, dogadaj.putanja.indexOf("/"));
  const put = dogadaj.putanja.slice(dogadaj.putanja.indexOf("/") + 1);
  if (!serverTabVidljiv(tema) && side === "server") return sesija;
  const kljuc = `${dogadaj.kljuc}:${side}:${put}`;
  if (sledeca.kljucFokusa === kljuc) return sesija;
  sledeca.kljucFokusa = kljuc;
  sledeca.strana = side;
  sledeca.otvoreno[side] = put;
  sledeca.verzija = "radna";
  sledeca.otvoreniKljuc = "";
  return sledeca;
}

function uskladi(sesija, kontekst) {
  const sledeca = kopija(sesija);
  if (!serverTabVidljiv(kontekst.tema) && sledeca.strana === "server") {
    sledeca.strana = "client";
    sledeca.kljucFokusa = "";
  }
  const stablo = stabloDo(kontekst.koraci, kontekst.indeks);
  const fajlovi = fajloviStrane(stablo, sledeca.strana);
  if (!fajlovi.length) return { sesija: sledeca, fajlovi, stablo };
  if (!fajlovi.includes(sledeca.otvoreno[sledeca.strana])) {
    const korak = kontekst.koraci[kontekst.indeks];
    const putanja = korak && typeof korak.putanja === "string" ? korak.putanja : "";
    const prefiks = `${sledeca.strana}/`;
    const relativna = putanja.startsWith(prefiks) ? putanja.slice(prefiks.length) : "";
    sledeca.otvoreno[sledeca.strana] = fajlovi.includes(relativna) ? relativna : fajlovi[0];
  }
  return { sesija: sledeca, fajlovi, stablo };
}

function prikazEditora(sesija, kontekst, stablo, dogadaj) {
  const putanja = puna(sesija);
  if (!putanja) {
    return { putanja: "", tekst: "", samoCitaj: true, linije: [], prazno: true };
  }
  if (dogadaj.tip === "unos") {
    return { putanja, tekst: dogadaj.tekst, samoCitaj: false, linije: null, prazno: false };
  }
  const original = stablo.verzije[putanja] || "";
  const izbor = tekstPrikaza({
    putanja,
    original,
    radne: sesija.radne,
    verzija: sesija.verzija,
    binarni: false,
  });
  const linije = izbor.razlika
    ? razlikaOriginala(prethodnaVerzija(kontekst.koraci, kontekst.indeks, putanja), original, sesija.radne[putanja])
    : null;
  return { putanja, tekst: izbor.tekst, samoCitaj: izbor.samoCitaj, linije, prazno: false };
}

function mapaKlijenta(stablo, sesija) {
  const mapa = {};
  for (const [putanja, original] of Object.entries(stablo.verzije)) {
    if (!putanja.startsWith("client/")) continue;
    mapa[putanja] = tekstPrikaza({
      putanja,
      original: original || "",
      radne: sesija.radne,
      verzija: sesija.verzija,
      binarni: BINARNI.test(putanja),
    }).tekst;
  }
  return mapa;
}

export function primeni(sesija, dogadaj, kontekst) {
  let sledeca = kopija(sesija);
  let upis = null;
  let forsiraj = false;

  if (dogadaj.tip === "fokus") {
    sledeca = fokus(sesija, dogadaj, kontekst.tema);
  } else if (dogadaj.tip === "strana" && dogadaj.strana !== sesija.strana) {
    sledeca.strana = dogadaj.strana;
    sledeca.verzija = "radna";
    sledeca.otvoreniKljuc = "";
    forsiraj = true;
  } else if (dogadaj.tip === "otvori") {
    sledeca.verzija = "radna";
    sledeca.otvoreniKljuc = "";
    sledeca.otvoreno[sledeca.strana] = dogadaj.put;
    forsiraj = true;
  } else if (dogadaj.tip === "unos") {
    const putanja = puna(sesija);
    if (putanja) {
      upis = { putanja, tekst: dogadaj.tekst };
      sledeca.verzija = "radna";
      sledeca.radne[putanja] = dogadaj.tekst;
    }
  } else if (dogadaj.tip === "ugradjena" || dogadaj.tip === "ucitaj") {
    sledeca.verzija = "ugradjena";
    sledeca.otvoreniKljuc = "";
    forsiraj = true;
  } else if (dogadaj.tip === "radna") {
    sledeca.verzija = "radna";
    sledeca.otvoreniKljuc = "";
    forsiraj = true;
  } else if (dogadaj.tip === "reset") {
    const stablo = stabloDo(kontekst.koraci, kontekst.indeks);
    const putanja = puna(sesija);
    if (putanja) {
      const tekst = stablo.verzije[putanja] || "";
      upis = { putanja, tekst };
      sledeca.radne[putanja] = tekst;
      sledeca.verzija = "radna";
      sledeca.otvoreniKljuc = "";
      forsiraj = true;
    }
  } else if (dogadaj.tip === "sacuvaj" && sesija.verzija === "radna") {
    const putanja = puna(sesija);
    if (putanja) {
      upis = { putanja, tekst: dogadaj.tekst };
      sledeca.radne[putanja] = dogadaj.tekst;
    }
  }

  const uskladjen = uskladi(sledeca, kontekst);
  const editor = prikazEditora(uskladjen.sesija, kontekst, uskladjen.stablo, dogadaj);
  const kljuc = editor.prazno
    ? ""
    : `${uskladjen.sesija.strana}:${uskladjen.sesija.otvoreno[uskladjen.sesija.strana]}:${uskladjen.sesija.verzija}:${kontekst.indeks}`;
  const osvezi = editor.prazno || forsiraj || kljuc !== uskladjen.sesija.otvoreniKljuc;
  const izlaz = kopija(uskladjen.sesija);
  izlaz.otvoreniKljuc = editor.prazno || osvezi ? kljuc : uskladjen.sesija.otvoreniKljuc;
  return {
    sesija: izlaz,
    upis,
    osvezi: dogadaj.tip === "unos" || dogadaj.tip === "sacuvaj" ? false : osvezi,
    zivo: dogadaj.tip !== "sacuvaj" && !editor.prazno,
    prikaz: {
      editor,
      fajlovi: uskladjen.fajlovi,
      klijent: mapaKlijenta(uskladjen.stablo, izlaz),
      server: tekstoviServera(uskladjen.stablo.verzije, izlaz.radne, izlaz.verzija),
    },
  };
}
