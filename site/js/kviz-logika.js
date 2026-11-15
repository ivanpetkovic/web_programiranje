export function bezBelih(kod) {
  return String(kod ?? "").replace(/\s+/g, "");
}

export function mozeOcena(pitanje) {
  return pitanje?.vrsta === "izbor" || pitanje?.vrsta === "ispravka";
}

function imaTekst(vrednost) {
  return String(vrednost ?? "").trim().length > 0;
}

export function izPostojeceg(tema, korak, indeks, pitanje) {
  const opcije = (pitanje?.opcije || []).filter((opcija) => imaTekst(opcija?.text));
  const tekst = String(pitanje?.pitalica || "").trim();
  if (!tekst && opcije.length === 0) return null;
  const osnova = {
    id: `postojece-${tema}-${korak}-${indeks}`,
    tema,
    korak,
    vrsta: opcije.length ? "izbor" : "tekst",
    izvor: "postojece",
    zamka: false,
    tekst: tekst || "Izaberi odgovor.",
    analiza: pitanje?.analiza || "",
  };
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
        const stavka = izPostojeceg(lekcija.n, indeks, i, pitanje);
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

export function izaberiPitanja(pitanja, izbor = {}) {
  const opseg = izbor.opseg === "sve" ? "sve" : "tema";
  let skup = (pitanja || []).filter((pitanje) => opseg === "sve" || pitanje.tema === izbor.tema);
  if (izbor.ocenjivanje) skup = skup.filter(mozeOcena);
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
