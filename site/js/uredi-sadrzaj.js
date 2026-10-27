import { dodajOpciju, oznaciOdgovor, ukloniOpciju } from "./studio.js";
import { ikonica } from "./ikonice.js";

export function imaParametarUredjivanja(pretraga) {
  return new URLSearchParams(pretraga).get("edit") === "true";
}

export function jeRezimUredjivanja() {
  return imaParametarUredjivanja(location.search);
}

export function kljucPolja(cas, korak, deo) {
  return `${cas}:${korak}:${deo}`;
}

export function primeniSnapshot(dokument, json) {
  const novo = JSON.parse(json);
  for (const k of Object.keys(dokument)) {
    if (!(k in novo)) delete dokument[k];
  }
  Object.assign(dokument, novo);
}

export function napraviIstoriju(dokument, { max = 48 } = {}) {
  let sada = JSON.stringify(dokument);
  const unazad = [];
  const napred = [];

  return {
    mozeUnazad: () => unazad.length > 0,
    mozeNapred: () => napred.length > 0,
    zabeleziPre() {
      unazad.push(sada);
      if (unazad.length > max) unazad.shift();
      napred.length = 0;
    },
    osveziReferencu() {
      sada = JSON.stringify(dokument);
    },
    korakUnazad(cilj) {
      if (!unazad.length) return false;
      napred.push(JSON.stringify(cilj));
      const pre = unazad.pop();
      primeniSnapshot(cilj, pre);
      sada = pre;
      return true;
    },
    korakNapred(cilj) {
      if (!napred.length) return false;
      unazad.push(JSON.stringify(cilj));
      const sledece = napred.pop();
      primeniSnapshot(cilj, sledece);
      sada = sledece;
      return true;
    },
  };
}

export function dugmeUredi(natpis, onClick) {
  const dugme = document.createElement("button");
  dugme.type = "button";
  dugme.className = "uredi-ikonica";
  dugme.setAttribute("aria-label", natpis);
  const znak = ikonica("pencil");
  if (znak) dugme.append(znak);
  dugme.addEventListener("click", onClick);
  return dugme;
}

export function poljeTeksta(vrednost, { redovi = 3, kod = false, placeholder = "" }, onInput) {
  const polje = document.createElement("textarea");
  polje.rows = redovi;
  polje.value = vrednost ?? "";
  polje.placeholder = placeholder;
  polje.spellcheck = !kod;
  if (kod) polje.className = "kod";
  polje.addEventListener("input", () => onInput(polje.value));
  return polje;
}

export function poljeKratko(vrednost, onInput) {
  const polje = document.createElement("input");
  polje.type = "text";
  polje.value = vrednost ?? "";
  polje.autocomplete = "off";
  polje.addEventListener("input", () => onInput(polje.value));
  return polje;
}

function dugmeRadnje(natpis, klasa, onClick) {
  const dugme = document.createElement("button");
  dugme.type = "button";
  dugme.className = klasa;
  dugme.textContent = natpis;
  dugme.addEventListener("click", onClick);
  return dugme;
}

export function napraviEditorTeksta(pocetna, poljeOpcije, { opis }) {
  let nacrt = pocetna ?? "";
  const pocetni = pocetna ?? "";
  const telo = poljeTeksta(pocetna, poljeOpcije, (vrednost) => {
    nacrt = vrednost;
  });
  return {
    telo,
    opis,
    promenjeno: () => nacrt !== pocetni,
    primeni(primeniVrednost) {
      primeniVrednost(nacrt);
    },
  };
}

export function napraviEditorKratkog(pocetna, { opis }, primeniVrednost) {
  let nacrt = pocetna ?? "";
  const pocetni = pocetna ?? "";
  const telo = poljeKratko(pocetna, (vrednost) => {
    nacrt = vrednost;
  });
  return {
    telo,
    opis,
    promenjeno: () => nacrt !== pocetni,
    primeni() {
      primeniVrednost(nacrt);
    },
  };
}

export function omotUredjivog(ctx, id, prikaz, napraviEditor) {
  const omot = document.createElement("div");
  omot.className = "uredjivi-blok";
  if (!ctx.aktivan) {
    omot.append(...[].concat(prikaz));
    return omot;
  }
  if (ctx.jeOtvoreno(id)) {
    const editor = document.createElement("div");
    editor.className = "uredjivi-editor";
    const info = napraviEditor();
    editor.append(info.telo ?? info);
    const radnje = document.createElement("div");
    radnje.className = "uredi-radnje";
    radnje.append(
      dugmeRadnje("Otkaži", "uredi-otkazi", () => {
        ctx.zatvori(id);
        ctx.osvezi?.();
      }),
      dugmeRadnje("Potvrdi", "uredi-potvrdi primarno", () => {
        void ctx.potvrdiIzmenu?.(info, id);
      })
    );
    editor.append(radnje);
    omot.append(editor);
    return omot;
  }
  omot.append(...[].concat(prikaz));
  omot.append(
    dugmeUredi(`Uredi: ${id}`, () => {
      ctx.otvori(id);
      ctx.osvezi?.();
    })
  );
  return omot;
}

export function postaviIsecakKoraka(korak, tekst) {
  korak.isecak = tekst;
  if (typeof korak.delic === "string") korak.delic = tekst;
  if (typeof korak.original === "string") {
    korak.original = tekst.endsWith("\n") ? tekst : `${tekst}\n`;
  }
}

export function napraviUredjivacOpcija(opcije, { onStruktura } = {}) {
  const omot = document.createElement("div");
  omot.className = "uredi-opcije";

  const osvezi = () => {
    omot.replaceChildren();
    const lista = document.createElement("div");
    lista.className = "uredi-opcije-lista";
    opcije.forEach((opcija, indeks) => {
      const red = document.createElement("div");
      red.className = "uredi-opcija";
      const oznaka = document.createElement("span");
      oznaka.className = "uredi-opcija-kljuc";
      oznaka.textContent = opcija.key || String.fromCharCode(65 + indeks);
      const tekst = poljeKratko(opcija.text, (sadrzaj) => {
        opcija.text = sadrzaj;
      });
      tekst.className = "uredi-opcija-tekst";
      const razlog = poljeTeksta(
        opcija.why,
        { redovi: 2, placeholder: "Obrazloženje odgovora" },
        (sadrzaj) => {
          opcija.why = sadrzaj;
        }
      );
      razlog.className = "uredi-opcija-why";
      const tacan = document.createElement("label");
      tacan.className = "uredi-opcija-tacan";
      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = `tacan-${omot.dataset.grupa || "kviz"}`;
      radio.checked = Boolean(opcija.ok);
      radio.addEventListener("change", () => {
        if (!radio.checked) return;
        oznaciOdgovor(opcije, indeks);
        osvezi();
      });
      tacan.append(radio, document.createTextNode(" Tačan"));
      const ukloni = document.createElement("button");
      ukloni.type = "button";
      ukloni.className = "uredi-opcija-ukloni";
      ukloni.textContent = "−";
      ukloni.setAttribute("aria-label", "Ukloni odgovor");
      ukloni.disabled = opcije.length <= 2;
      ukloni.addEventListener("click", () => {
        ukloniOpciju(opcije, indeks);
        onStruktura?.();
        osvezi();
      });
      red.append(oznaka, tekst, razlog, tacan, ukloni);
      lista.append(red);
    });
    const dodaj = document.createElement("button");
    dodaj.type = "button";
    dodaj.className = "uredi-opcija-dodaj";
    dodaj.textContent = "+ Dodaj odgovor";
    dodaj.addEventListener("click", () => {
      dodajOpciju(opcije);
      onStruktura?.();
      osvezi();
    });
    omot.append(lista, dodaj);
  };

  osvezi();
  return omot;
}

export function napraviEditorOpcija(pocetne, { opis = "odgovore" } = {}) {
  const nacrt = structuredClone(pocetne);
  const pocetni = JSON.stringify(pocetne);
  const telo = napraviUredjivacOpcija(nacrt, {});
  return {
    telo,
    opis,
    promenjeno: () => JSON.stringify(nacrt) !== pocetni,
    primeni(cilj) {
      cilj.splice(0, cilj.length, ...structuredClone(nacrt));
    },
  };
}

export function napraviStanjeUredjivanja(dokument) {
  const polja = new Set();
  const istorija = napraviIstoriju(dokument);
  return {
    aktivan: jeRezimUredjivanja(),
    prljavo: false,
    poruka: "",
    sacuvava: false,
    polja,
    istorija,
    jeOtvoreno(id) {
      return polja.has(id);
    },
    otvori(id) {
      polja.add(id);
    },
    zatvori(id) {
      polja.delete(id);
    },
    oznaciPrljavo() {
      this.prljavo = true;
      this.poruka = "";
    },
  };
}

export async function sacuvajKursNaServeru(dokument) {
  const odgovor = await fetch("/api/kurs", {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(dokument),
  });
  const telo = await odgovor.json().catch(() => ({}));
  if (!odgovor.ok) {
    throw new Error(telo.greska || "Čuvanje nije uspelo.");
  }
}
