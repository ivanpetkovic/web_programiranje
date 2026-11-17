import { mermaidFigura } from "./figura.js";

export const DIJAGRAM_KUTIJE_244 = [
  "flowchart LR",
  "  b1[\"border 2px\"] --- p1[\"padding 20px\"] --- c[\"sadržaj 200px\"] --- p2[\"padding 20px\"] --- b2[\"border 2px\"]",
].join("\n");

const PREPRAVKE = {
  "postojece-1-1-2": "Poruka ide u paketima i komunikacioni put nije rezervisan. Šta od toga još nije HTTP?",
  "postojece-2-3-2": "CSS model kutije, grana content-box: width 200px, padding 20px i border 2px. Na dijagramu je taj zbir, 244 px. Šta u njemu nije uračunato?",
  "postojece-2-4-0": "Odakle je broj 24 u ovom pasusu?",
  "postojece-2-4-1": "Zašto broj 24 u ovom pasusu ne dokazuje merenje?",
  "postojece-2-5-0": "Klik na ovo dugme, dok još nema handlera. Šta se desi?",
  "postojece-2-7-2": "Šta iz crvene boje, uz ove deklaracije, ne sledi?",
  "postojece-2-12-0": "U dev alatima se izvrši element.textContent = \"10\", a fajl i dalje kaže 24. Šta je time promenjeno?",
};

export function bezBelih(kod) {
  return String(kod ?? "").replace(/\s+/g, "");
}

export function mozeOcena(pitanje) {
  return pitanje?.vrsta === "izbor" || pitanje?.vrsta === "ispravka";
}

function imaTekst(vrednost) {
  return String(vrednost ?? "").trim().length > 0;
}

function uzorakKoraka(korak) {
  const kandidati = [korak?.samostalniPrimer?.tekst, korak?.isecak, korak?.delic];
  const tekst = kandidati.map((vrednost) => String(vrednost || "").trim()).find(Boolean) || "";
  if (!tekst || tekst.length > 500) return "";
  if (tekst.startsWith("<!--") || tekst.startsWith("//")) return "";
  return tekst;
}

function dijagramKoraka(korak) {
  const traka = String(korak?.dijagram?.tekst || "");
  if (korak?.dijagram?.format === "text" && traka.includes("border") && traka.includes("content")) {
    return DIJAGRAM_KUTIJE_244;
  }
  const natpisi = (korak?.figura?.cvorovi || []).map((cvor) => cvor.natpis).join(" ");
  if (korak?.figura?.vrsta === "put" && /veza/i.test(natpisi)) return mermaidFigura(korak.figura);
  return "";
}

export function izPostojeceg(tema, korak, indeks, pitanje, okvir = {}) {
  const opcije = (pitanje?.opcije || []).filter((opcija) => imaTekst(opcija?.text));
  const id = `postojece-${tema}-${korak}-${indeks}`;
  const tekst = PREPRAVKE[id] || String(pitanje?.pitalica || "").trim();
  if (!tekst && opcije.length === 0) return null;
  const osnova = {
    id,
    tema,
    korak,
    vrsta: opcije.length ? "izbor" : "tekst",
    izvor: "postojece",
    zamka: false,
    tekst: tekst || "Izaberi odgovor.",
    analiza: pitanje?.analiza || "",
  };
  if (!osnova.tekst.includes("```") && okvir.kod) osnova.kod = okvir.kod;
  if (okvir.dijagram) osnova.dijagram = okvir.dijagram;
  if (opcije.length) {
    return {
      ...osnova,
      opcije: opcije.map((opcija) => ({
        key: String(opcija.key ?? ""),
        text: opcija.text,
        ok: Boolean(opcija.ok),
        why: opcija.why || "",
      })),
    };
  }
  return { ...osnova, odgovor: pitanje?.odgovor || "" };
}

export function bazen(lekcije, nova) {
  const teme = new Set((nova || []).map((pitanje) => pitanje.tema));
  const postojece = [];
  for (const lekcija of lekcije || []) {
    if (!teme.has(lekcija.n)) continue;
    (lekcija.steps || []).forEach((korak, indeks) => {
      (korak.pitalice || []).forEach((pitanje, i) => {
        const stavka = izPostojeceg(lekcija.n, indeks, i, pitanje, {
          kod: uzorakKoraka(korak),
          dijagram: dijagramKoraka(korak),
        });
        if (stavka) postojece.push(stavka);
      });
    });
  }
  return [...postojece, ...(nova || [])];
}

export function temeSaKvizom(nova) {
  return [...new Set((nova || []).map((pitanje) => pitanje.tema))].sort((a, b) => a - b);
}

export function promesaj(niz, rng = Math.random) {
  const kopija = (niz || []).slice();
  for (let i = kopija.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const trenutno = kopija[i];
    kopija[i] = kopija[j];
    kopija[j] = trenutno;
  }
  return kopija;
}

export function seOcenjuje(izbor = {}) {
  if (izbor.maksimum == null && !Number.isFinite(Number(izbor.poTemi))) return false;
  return Boolean(izbor.ocenjivanje);
}

export function izaberiPitanja(pitanja, izbor = {}) {
  const opseg = izbor.opseg === "sve" ? "sve" : "tema";
  let skup = (pitanja || []).filter((pitanje) => opseg === "sve" || pitanje.tema === izbor.tema);
  if (seOcenjuje(izbor)) skup = skup.filter(mozeOcena);
  const poTemi = Number(izbor.poTemi);
  if (Number.isFinite(poTemi)) {
    if (poTemi < 0) return [];
    const grupe = new Map();
    for (const pitanje of skup) {
      if (!grupe.has(pitanje.tema)) grupe.set(pitanje.tema, []);
      grupe.get(pitanje.tema).push(pitanje);
    }
    const uzeto = [];
    for (const tema of [...grupe.keys()].sort((a, b) => a - b)) {
      uzeto.push(...promesaj(grupe.get(tema), izbor.rng).slice(0, poTemi));
    }
    return promesaj(uzeto, izbor.rng);
  }
  const poredak = promesaj(skup, izbor.rng);
  if (izbor.maksimum == null) return poredak;
  const granica = Number(izbor.maksimum);
  if (!Number.isFinite(granica) || granica < 0) return [];
  return poredak.slice(0, granica);
}

export function oceni(pitanje, odgovor) {
  if (pitanje?.vrsta === "izbor") {
    const tacni = (pitanje.opcije || []).filter((opcija) => opcija.ok).map((opcija) => opcija.key);
    return {
      ocenjivo: true,
      tacno: tacni.includes(odgovor),
      ocekivano: tacni[0] || "",
    };
  }
  if (pitanje?.vrsta === "ispravka") {
    const uneto = bezBelih(odgovor);
    const resenje = bezBelih(pitanje.resenje);
    return {
      ocenjivo: true,
      tacno: uneto.length > 0 && resenje.length > 0 && uneto === resenje,
      ocekivano: pitanje.resenje || "",
    };
  }
  return { ocenjivo: false, tacno: null, ocekivano: pitanje?.odgovor || "" };
}

const OGRADA = /^```([A-Za-z0-9_+-]*)\s*$/;
const KRAJ_OGRADE = /^```\s*$/;

export function deloviKvizTeksta(tekst) {
  const linije = String(tekst ?? "").split("\n");
  const delovi = [];
  let proza = [];
  let kod = null;
  let jezik = "";
  const isprazni = () => {
    const telo = proza.join("\n").trim();
    proza = [];
    if (telo) delovi.push({ vrsta: "proza", tekst: telo });
  };
  for (const linija of linije) {
    if (kod) {
      if (KRAJ_OGRADE.test(linija)) {
        delovi.push({
          vrsta: jezik === "mermaid" ? "mermaid" : "kod",
          tekst: kod.join("\n"),
        });
        kod = null;
        jezik = "";
      } else kod.push(linija);
      continue;
    }
    const otvor = OGRADA.exec(linija);
    if (otvor) {
      isprazni();
      kod = [];
      jezik = otvor[1].toLowerCase();
      continue;
    }
    proza.push(linija);
  }
  if (kod) proza.push("```", ...kod);
  isprazni();
  return delovi;
}

export function sazetakPitanja(tekst) {
  const delovi = deloviKvizTeksta(tekst);
  const proza = delovi
    .filter((deo) => deo.vrsta === "proza")
    .map((deo) => deo.tekst.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  if (proza.length) return proza.join(" ");
  const blok = delovi.find((deo) => deo.vrsta === "kod");
  if (blok) return blok.tekst.replace(/\s+/g, " ").trim();
  return String(tekst ?? "").replace(/\s+/g, " ").trim();
}

export function zbir(pitanja, odgovori) {
  let ocenjivih = 0;
  let tacnih = 0;
  const stavke = (pitanja || []).map((pitanje) => {
    const ocena = oceni(pitanje, odgovori?.[pitanje.id]);
    if (ocena.ocenjivo) {
      ocenjivih += 1;
      if (ocena.tacno) tacnih += 1;
    }
    return { id: pitanje.id, ...ocena };
  });
  return { tacnih, ocenjivih, stavke };
}
