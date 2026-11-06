export const VRSTE_SEKCIJE = [
  { vrsta: "tekst", natpis: "Tekst", ikona: "text", polja: {} },
  { vrsta: "highlight", natpis: "Highlight", ikona: "callout", polja: { uloga: "obicna", naslov: "Napomena" } },
  { vrsta: "highlight", natpis: "Ključna ideja", ikona: "lightbulb", polja: { uloga: "kljucna" } },
  { vrsta: "kod", natpis: "Kod, bela pozadina", ikona: "code-xml", polja: { pozadina: "bela", naslov: "Kod", jezik: "text" } },
  { vrsta: "kod", natpis: "Kod, crna pozadina", ikona: "code-xml", polja: { pozadina: "crna", naslov: "Kod", jezik: "text" } },
  { vrsta: "dijagram", natpis: "Dijagram", ikona: "workflow", polja: { naslov: "Dijagram" } },
];

export function noviIdSekcije() {
  return `s${Math.random().toString(36).slice(2, 10)}`;
}

function oznaka(fabrika, kljuc) {
  return fabrika ? fabrika(kljuc) : noviIdSekcije();
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
      pozadina: "bela",
      naslov: "Mali eksperiment",
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

export function blokoviKoraka(korak, opcije = {}) {
  if (Array.isArray(korak?.blokovi)) return korak.blokovi;
  return sastaviBlokove(korak, {
    id: (kljuc) => `nasledje:${kljuc}`,
    prazne: false,
    ...opcije,
  });
}

export function materijalizuj(korak, prikazani) {
  if (!korak) return [];
  if (!Array.isArray(korak.blokovi)) korak.blokovi = prikazani || blokoviKoraka(korak, { prazne: true });
  return korak.blokovi;
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
  }
}

function noviBlok(vrsta) {
  return { id: noviIdSekcije(), vrsta: vrsta.vrsta, tekst: "", ...vrsta.polja };
}

export function ubaciSekciju(korak, prikazani, sidroId, vrsta, gde) {
  if (!korak || !vrsta?.vrsta) return "";
  const niz = materijalizuj(korak, prikazani);
  const blok = noviBlok(vrsta);
  const indeks = niz.findIndex((stavka) => stavka.id === sidroId);
  let mesto = niz.length;
  if (indeks >= 0 && gde === "pre") mesto = indeks;
  else if (indeks >= 0 && gde === "posle") mesto = indeks + 1;
  niz.splice(mesto, 0, blok);
  uskladiNasledjenaPolja(korak);
  return blok.id;
}

export function dodajSekciju(korak, vrsta) {
  if (!Array.isArray(korak?.blokovi)) materijalizuj(korak, blokoviKoraka(korak, { prazne: true }));
  return ubaciSekciju(korak, korak.blokovi, null, vrsta, "kraj");
}

export function nadjiSekciju(korak, id) {
  if (!Array.isArray(korak?.blokovi)) return null;
  return korak.blokovi.find((blok) => blok.id === id) || null;
}

export function promeniVrstuSekcije(korak, prikazani, id, vrsta) {
  const niz = materijalizuj(korak, prikazani);
  const blok = niz.find((stavka) => stavka.id === id);
  if (!blok || !vrsta?.vrsta) return -1;
  const tekst = blok.tekst || "";
  const veza = blok.veza;
  const naslov = blok.naslov;
  for (const kljuc of Object.keys(blok)) delete blok[kljuc];
  Object.assign(blok, noviBlok(vrsta), { id, tekst });
  if (naslov && blok.vrsta === "highlight" && blok.uloga !== "kljucna") blok.naslov = naslov;
  if (veza === "samostalniPrimer" && blok.vrsta === "kod") blok.veza = veza;
  if (veza === "dijagram" && blok.vrsta === "dijagram") blok.veza = veza;
  uskladiNasledjenaPolja(korak);
  return niz.findIndex((stavka) => stavka.id === id);
}

export function spustiSekciju(korak, prikazani, izvorId, ciljId, iznad) {
  const niz = materijalizuj(korak, prikazani);
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
  uskladiNasledjenaPolja(korak);
  return mesto;
}

export function pomeriSekciju(korak, id, smer) {
  const niz = korak?.blokovi;
  if (!Array.isArray(niz)) return -1;
  const indeks = niz.findIndex((blok) => blok.id === id);
  const cilj = indeks + smer;
  if (indeks < 0 || cilj < 0 || cilj >= niz.length) return -1;
  const [stavka] = niz.splice(indeks, 1);
  niz.splice(cilj, 0, stavka);
  uskladiNasledjenaPolja(korak);
  return cilj;
}

export function obrisiSekciju(korak, id) {
  const niz = korak?.blokovi;
  if (!Array.isArray(niz)) return -1;
  const indeks = niz.findIndex((blok) => blok.id === id);
  if (indeks < 0) return -1;
  niz.splice(indeks, 1);
  uskladiNasledjenaPolja(korak);
  return Math.min(indeks, Math.max(0, niz.length - 1));
}

export function natpisSekcije(blok) {
  if (!blok) return "";
  if (blok.vrsta === "highlight" && blok.uloga === "kljucna") return "Ključna ideja";
  if (blok.vrsta === "highlight") return blok.naslov || "Highlight";
  if (blok.vrsta === "kod") return blok.naslov || "Kod";
  if (blok.vrsta === "dijagram") return blok.naslov || "Dijagram";
  return "Tekst";
}

export function ikonaSekcije(blok) {
  if (!blok) return "text";
  if (blok.vrsta === "highlight" && blok.uloga === "kljucna") return "lightbulb";
  if (blok.vrsta === "highlight") return "callout";
  if (blok.vrsta === "kod") return "code-xml";
  if (blok.vrsta === "dijagram") return "workflow";
  return "text";
}

export function tekstSekcija(korak) {
  if (!Array.isArray(korak?.blokovi)) return "";
  return korak.blokovi.map((blok) => [blok.naslov, blok.tekst].filter(Boolean).join("\n")).filter(Boolean).join("\n");
}
