import { mermaidFigura } from "./figura.js";
import { dodatakPrikaza, imeFajla } from "./prilog.js";

const JEZICI = new Set(["html", "css", "text", "javascript", "json", "sql", "typescript"]);

const VRSTE_GRADIVA = [
  { vrsta: "tekst", natpis: "Tekst", ikona: "text", polja: {} },
  { vrsta: "highlight", natpis: "Highlight", ikona: "callout", polja: { uloga: "obicna", naslov: "Napomena" } },
  { vrsta: "highlight", natpis: "Ključna ideja", ikona: "lightbulb", polja: { uloga: "kljucna" } },
  { vrsta: "kod", natpis: "Kod", ikona: "code-xml", polja: { jezik: "text" } },
  {
    vrsta: "mermaid",
    natpis: "Dijagram",
    ikona: "workflow",
    polja: { naslov: "Dijagram", tekst: "flowchart LR\n  A[Početak] --> B[Kraj]" },
  },
  { vrsta: "dijagram", natpis: "Tekstualni dijagram", ikona: "file-text", polja: { naslov: "Tekstualni dijagram" } },
];

export const VRSTE_SEKCIJE = VRSTE_GRADIVA;

export const VRSTE_DISKUSIJE = [
  ...VRSTE_GRADIVA,
  { vrsta: "pitanje", natpis: "Pitanje, tekst", ikona: "message-circle", polja: { oblik: "tekst" } },
  {
    vrsta: "pitanje",
    natpis: "Pitanje, izbor",
    ikona: "circle-dot",
    polja: {
      oblik: "izbor",
      opcije: [
        { key: "A", text: "", ok: false, why: "" },
        { key: "B", text: "", ok: true, why: "" },
      ],
    },
  },
];

export function noviIdSekcije() {
  return `s${Math.random().toString(36).slice(2, 10)}`;
}

function oznaka(fabrika, kljuc) {
  return fabrika ? fabrika(kljuc) : noviIdSekcije();
}

function noviBlok(vrsta) {
  const polja = vrsta.polja ? structuredClone(vrsta.polja) : {};
  return { id: noviIdSekcije(), vrsta: vrsta.vrsta, tekst: "", ...polja };
}

function uskladiPolje(korak, polje) {
  if (polje === "diskusija") uskladiDiskusiju(korak);
  else uskladiNasledjenaPolja(korak);
}

export function sastaviBlokove(korak, { id = null, prazne = true, figura = false } = {}) {
  const blokovi = [
    { id: oznaka(id, "tekst"), vrsta: "tekst", tekst: korak?.tekst || "" },
    { id: oznaka(id, "kljucna"), vrsta: "highlight", uloga: "kljucna", tekst: korak?.kljucnaIdeja || "" },
  ];
  const primer = korak?.samostalniPrimer;
  if (!figura && !korak?.putanja && primer && typeof primer === "object" && (prazne || primer.tekst)) {
    blokovi.push({
      id: oznaka(id, "kod"),
      vrsta: "kod",
      jezik: primer.jezik || "text",
      veza: "samostalniPrimer",
      tekst: primer.tekst || "",
    });
  }
  const dijagram = korak?.dijagram;
  if (!figura && dijagram && typeof dijagram === "object" && (prazne || dijagram.tekst)) {
    blokovi.push({
      id: oznaka(id, "dijagram"),
      vrsta: "dijagram",
      naslov: "Dijagram",
      veza: "dijagram",
      tekst: dijagram.tekst || "",
    });
  }
  return blokovi;
}

export function nasledjeniBlokovi(korak) {
  return sastaviBlokove(korak, { prazne: true });
}

function jezikFajla(korak) {
  const zadat = String(korak?.isecakJezik || "").trim();
  if (JEZICI.has(zadat)) return zadat;
  const ime = imeFajla(korak?.putanja);
  const ekstenzija = ime.includes(".") ? ime.split(".").pop().toLowerCase() : "";
  const poEkstenziji = {
    html: "html",
    css: "css",
    js: "javascript",
    mjs: "javascript",
    cjs: "javascript",
    ts: "typescript",
    json: "json",
    sql: "sql",
  };
  return poEkstenziji[ekstenzija] || "text";
}

export function blokFajla(korak) {
  if (!korak?.putanja) return null;
  const tekst = String(dodatakPrikaza(korak) ?? "");
  if (!tekst.trim()) return null;
  const blok = {
    id: "fajl",
    vrsta: "kod",
    jezik: jezikFajla(korak),
    veza: "fajl",
    tekst,
  };
  const naslov = imeFajla(korak.putanja);
  if (naslov) blok.naslov = naslov;
  return blok;
}

function saBlokomFajla(korak, blokovi, opcije) {
  if (opcije.fajl === false || opcije.figura) return blokovi;
  if (blokovi.some((blok) => blok?.veza === "fajl")) return blokovi;
  const fajl = blokFajla(korak);
  if (!fajl) return blokovi;
  if (blokovi.some((blok) => blok?.vrsta === "kod" && String(blok.tekst ?? "") === fajl.tekst)) return blokovi;
  return [...blokovi, fajl];
}

function blokFigure(korak) {
  const figura = korak?.figura;
  if (!figura || typeof figura !== "object") return null;
  const tekst = mermaidFigura(figura);
  if (!tekst.trim()) return null;
  return {
    id: "figura",
    vrsta: "mermaid",
    naslov: "Dijagram",
    veza: "figura",
    tekst,
  };
}

function saBlokomFigure(korak, blokovi) {
  if (blokovi.some((blok) => blok?.veza === "figura")) return blokovi;
  const figura = blokFigure(korak);
  if (!figura) return blokovi;
  return [...blokovi, figura];
}

export function blokoviKoraka(korak, opcije = {}) {
  const saFigurom = korak?.figura ? { ...opcije, figura: true } : opcije;
  const osnovni = Array.isArray(korak?.blokovi)
    ? saBlokomFajla(korak, korak.blokovi, saFigurom)
    : saBlokomFajla(korak, sastaviBlokove(korak, {
      id: (kljuc) => `nasledje:${kljuc}`,
      prazne: false,
      ...saFigurom,
    }), saFigurom);
  return saBlokomFigure(korak, osnovni);
}

function izvorPitalica(korak) {
  if (Array.isArray(korak?.pitalice) && korak.pitalice.length) return korak.pitalice;
  if (korak?.pitalica || (korak?.opcije || []).length) {
    return [{
      pitalica: korak.pitalica || "",
      opcije: korak.opcije || [],
      odgovor: korak.odgovor || "",
      analizaPitalice: korak.analizaPitalice || "",
    }];
  }
  return [];
}

export function sastaviDiskusiju(korak, { id = null } = {}) {
  const blokovi = [];
  if (typeof korak?.prica === "string" && korak.prica.trim()) {
    blokovi.push({
      id: oznaka(id, "prica"),
      vrsta: "tekst",
      veza: "prica",
      tekst: korak.prica,
    });
  }
  izvorPitalica(korak).forEach((pitanje, indeks) => {
    const izbor = Array.isArray(pitanje.opcije) && pitanje.opcije.length > 0;
    const blok = {
      id: oznaka(id, `p${indeks}`),
      vrsta: "pitanje",
      oblik: izbor ? "izbor" : "tekst",
      tekst: pitanje.pitalica || "",
    };
    if (izbor) blok.opcije = structuredClone(pitanje.opcije);
    else if (pitanje.odgovor) blok.odgovor = pitanje.odgovor;
    const analiza = pitanje.analizaPitalice || pitanje.analiza || "";
    if (analiza) blok.analiza = analiza;
    blokovi.push(blok);
  });
  return blokovi;
}

export function diskusijaKoraka(korak) {
  if (Array.isArray(korak?.diskusija)) return korak.diskusija;
  return sastaviDiskusiju(korak, { id: (kljuc) => `nasledje:${kljuc}` });
}

export function materijalizuj(korak, prikazani, polje = "blokovi") {
  if (!korak) return [];
  if (!Array.isArray(korak[polje])) {
    korak[polje] = prikazani || (polje === "diskusija" ? diskusijaKoraka(korak) : blokoviKoraka(korak, { prazne: true }));
  } else if (
    prikazani &&
    prikazani !== korak[polje] &&
    prikazani.some((blok) => blok?.veza === "fajl" || blok?.veza === "figura")
  ) {
    korak[polje] = prikazani;
  }
  return korak[polje];
}

export function uskladiNasledjenaPolja(korak) {
  if (!korak || !Array.isArray(korak.blokovi)) return;
  const tekst = korak.blokovi.find((blok) => blok.vrsta === "tekst");
  korak.tekst = tekst?.tekst || "";
  const kljucna = korak.blokovi.find((blok) => blok.vrsta === "highlight" && blok.uloga === "kljucna");
  korak.kljucnaIdeja = kljucna?.tekst || "";
  for (const blok of korak.blokovi) {
    if (blok.veza === "samostalniPrimer" && korak.samostalniPrimer) korak.samostalniPrimer.tekst = blok.tekst || "";
    if (blok.veza === "dijagram" && korak.dijagram) korak.dijagram.tekst = blok.tekst || "";
    if (blok.veza === "fajl") {
      const tekst = blok.tekst || "";
      if (typeof korak.delic === "string") korak.delic = tekst;
      if (typeof korak.isecak === "string") korak.isecak = tekst;
    }
  }
}

export function uskladiDiskusiju(korak) {
  if (!korak || !Array.isArray(korak.diskusija)) return;
  const prica = korak.diskusija.find((blok) => blok.vrsta === "tekst" && blok.veza === "prica");
  if (prica?.tekst) korak.prica = prica.tekst;
  else delete korak.prica;
  const pitanja = korak.diskusija.filter((blok) => blok.vrsta === "pitanje").map((blok) => {
    const pitanje = { pitalica: blok.tekst || "" };
    if (blok.oblik === "izbor" && Array.isArray(blok.opcije)) pitanje.opcije = blok.opcije;
    else if (blok.odgovor) pitanje.odgovor = blok.odgovor;
    if (blok.analiza) pitanje.analizaPitalice = blok.analiza;
    return pitanje;
  });
  if (pitanja.length) korak.pitalice = pitanja;
  else delete korak.pitalice;
  const prva = pitanja[0];
  if (!prva) {
    delete korak.pitalica;
    delete korak.opcije;
    delete korak.analizaPitalice;
    return;
  }
  korak.pitalica = prva.pitalica || "";
  if (Array.isArray(prva.opcije) && prva.opcije.length) korak.opcije = prva.opcije;
  else delete korak.opcije;
  if (prva.analizaPitalice) korak.analizaPitalice = prva.analizaPitalice;
  else delete korak.analizaPitalice;
}

export function ubaciSekciju(korak, prikazani, sidroId, vrsta, gde, polje = "blokovi") {
  if (!korak || !vrsta?.vrsta) return "";
  const niz = materijalizuj(korak, prikazani, polje);
  const blok = noviBlok(vrsta);
  const indeks = niz.findIndex((stavka) => stavka.id === sidroId);
  let mesto = niz.length;
  if (indeks >= 0 && gde === "pre") mesto = indeks;
  else if (indeks >= 0 && gde === "posle") mesto = indeks + 1;
  niz.splice(mesto, 0, blok);
  uskladiPolje(korak, polje);
  return blok.id;
}

export function dodajSekciju(korak, vrsta, polje = "blokovi") {
  if (!Array.isArray(korak?.[polje])) {
    materijalizuj(
      korak,
      polje === "diskusija" ? diskusijaKoraka(korak) : blokoviKoraka(korak, { prazne: true }),
      polje
    );
  }
  return ubaciSekciju(korak, korak[polje], null, vrsta, "kraj", polje);
}

export function nadjiSekciju(korak, id, polje = "blokovi") {
  if (!Array.isArray(korak?.[polje])) return null;
  return korak[polje].find((blok) => blok.id === id) || null;
}

export function promeniVrstuSekcije(korak, prikazani, id, vrsta, polje = "blokovi") {
  const niz = materijalizuj(korak, prikazani, polje);
  const blok = niz.find((stavka) => stavka.id === id);
  if (!blok || !vrsta?.vrsta) return -1;
  const tekst = blok.tekst || "";
  const veza = blok.veza;
  const naslov = blok.naslov;
  const analiza = blok.analiza || "";
  const odgovor = blok.odgovor || "";
  for (const kljuc of Object.keys(blok)) delete blok[kljuc];
  Object.assign(blok, noviBlok(vrsta), { id, tekst });
  if (naslov && blok.vrsta === "highlight" && blok.uloga !== "kljucna") blok.naslov = naslov;
  if ((veza === "samostalniPrimer" || veza === "fajl") && blok.vrsta === "kod") blok.veza = veza;
  if (veza === "dijagram" && blok.vrsta === "dijagram") blok.veza = veza;
  if (veza === "figura" && blok.vrsta === "mermaid") blok.veza = veza;
  else if (veza === "figura") delete korak.figura;
  if (veza === "prica" && blok.vrsta === "tekst") blok.veza = veza;
  if (blok.vrsta === "pitanje" && analiza) blok.analiza = analiza;
  if (blok.vrsta === "pitanje" && blok.oblik !== "izbor" && odgovor) blok.odgovor = odgovor;
  uskladiPolje(korak, polje);
  return niz.findIndex((stavka) => stavka.id === id);
}

export function spustiSekciju(korak, prikazani, izvorId, ciljId, iznad, polje = "blokovi") {
  const niz = materijalizuj(korak, prikazani, polje);
  const od = niz.findIndex((stavka) => stavka.id === izvorId);
  if (od < 0 || izvorId === ciljId) return -1;
  const [stavka] = niz.splice(od, 1);
  const ka = niz.findIndex((drugi) => drugi.id === ciljId);
  if (ka < 0) {
    niz.splice(od, 0, stavka);
    return -1;
  }
  const mesto = iznad ? ka : ka + 1;
  niz.splice(mesto, 0, stavka);
  uskladiPolje(korak, polje);
  return mesto;
}

export function pomeriSekciju(korak, id, smer, polje = "blokovi") {
  const niz = korak?.[polje];
  if (!Array.isArray(niz)) return -1;
  const indeks = niz.findIndex((blok) => blok.id === id);
  const cilj = indeks + smer;
  if (indeks < 0 || cilj < 0 || cilj >= niz.length) return -1;
  const [stavka] = niz.splice(indeks, 1);
  niz.splice(cilj, 0, stavka);
  uskladiPolje(korak, polje);
  return cilj;
}

export function obrisiSekciju(korak, id, polje = "blokovi") {
  const niz = korak?.[polje];
  if (!Array.isArray(niz)) return -1;
  const indeks = niz.findIndex((blok) => blok.id === id);
  if (indeks < 0) return -1;
  const [obrisan] = niz.splice(indeks, 1);
  if (obrisan?.veza === "fajl") {
    if (typeof korak.delic === "string") korak.delic = "";
    if (typeof korak.isecak === "string") korak.isecak = "";
  }
  if (obrisan?.veza === "figura") delete korak.figura;
  uskladiPolje(korak, polje);
  return Math.min(indeks, Math.max(0, niz.length - 1));
}

export function naslovKoda(blok) {
  const naslov = String(blok?.naslov || "").trim();
  if (!naslov || naslov === "Mali eksperiment") return "";
  return naslov;
}

export function natpisSekcije(blok) {
  if (!blok) return "";
  if (blok.vrsta === "pitanje" && blok.oblik === "izbor") return "Pitanje, izbor";
  if (blok.vrsta === "pitanje") return "Pitanje, tekst";
  if (blok.vrsta === "highlight" && blok.uloga === "kljucna") return "Ključna ideja";
  if (blok.vrsta === "highlight") return blok.naslov || "Highlight";
  if (blok.vrsta === "kod") return naslovKoda(blok) || "Kod";
  if (blok.vrsta === "mermaid") return blok.naslov || "Dijagram";
  if (blok.vrsta === "dijagram") return blok.naslov || "Tekstualni dijagram";
  return "Tekst";
}

export function ikonaSekcije(blok) {
  if (!blok) return "text";
  if (blok.vrsta === "pitanje" && blok.oblik === "izbor") return "circle-dot";
  if (blok.vrsta === "pitanje") return "message-circle";
  if (blok.vrsta === "highlight" && blok.uloga === "kljucna") return "lightbulb";
  if (blok.vrsta === "highlight") return "callout";
  if (blok.vrsta === "kod") return "code-xml";
  if (blok.vrsta === "mermaid") return "workflow";
  if (blok.vrsta === "dijagram") return "file-text";
  return "text";
}

export function tekstSekcija(korak) {
  const nizovi = [korak?.blokovi, korak?.diskusija].filter(Array.isArray);
  return nizovi
    .flat()
    .map((blok) => [blok.naslov, blok.tekst, blok.odgovor].filter(Boolean).join("\n"))
    .filter(Boolean)
    .join("\n");
}
