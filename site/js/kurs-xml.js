const OBRAZAC = [
  "  <povezujuci-primer>",
  "    <naziv>Kontrolna soba</naziv>",
  "    <opis>Jedan panel, temperatura i jedan ventilator. Nema stvarnog hardvera. Student prati jednu radnju od browsera, preko Node procesa, do PostgreSQL baze.</opis>",
  "  </povezujuci-primer>",
  "  <nastavni-obrazac>",
  "    <korak-redosled>",
  "      <deo>tekst</deo>",
  "      <deo>kljucna-ideja</deo>",
  "      <deo>isecak ili crtez</deo>",
  "      <deo>kratka pitalica</deo>",
  "      <napomena>Minuta uz korak je nastavna oznaka, ne tajmer. Kratka pitalica nema pretpostavke, poređenje ni drugu diskusiju. Isečak je ono što korak pokazuje. u-fajl je red koji ulazi u imenovani fajl kada se razlikuje od isečka. ugradjena je snimak fajla koji Editor pokazuje kao Lekciju.</napomena>",
  "    </korak-redosled>",
  "    <diskusija-faze budzet-minuta=\"35\">",
  "      <faza naziv=\"Izbor\" minuta=\"3\">Opcije su vidljive i neoznačene. Podvlačenje većine ne otkriva koja opcija drži.</faza>",
  "      <faza naziv=\"Poređenje\" minuta=\"5\">Razlozi u paru ili maloj grupi. Odgovor ostaje zatvoren.</faza>",
  "      <faza naziv=\"Pretpostavke\" minuta=\"8\">Nastavnik upisuje čute rečenice, i one koje ne drže.</faza>",
  "      <faza naziv=\"Analiza\" minuta=\"7\">Svaka opcija dobije razlog i jedna bude označena. Upisana pogrešna pretpostavka ostaje.</faza>",
  "      <faza naziv=\"Ponovni izbor\" minuta=\"5\">Podvlačenje sme da se pomeri. Upisuje se jedna zajednička rečenica.</faza>",
  "      <posle minuta=\"7\">Rezerva, zatvorena do ovog trenutka, ili još ista ideja. Rezerva kreće opet od izbora.</posle>",
  "      <napomena>Jedna diskusija pripada celoj nedelji. Sajt ne pamti glas. Nastavnik jedini pomera fazu. Ako grupa ostane bez zaključka, sledeća nedelja sme da krene istom pitalicom.</napomena>",
  "    </diskusija-faze>",
  "    <izlaz-oblik>Rečenica na poslednjem koraku. Nema opcija, pečata ni polja za upis.</izlaz-oblik>",
  "  </nastavni-obrazac>",
];

export function procitajXml(tekst) {
  let stablo;
  try {
    stablo = koren(tekst);
  } catch {
    return { ok: false, greska: "Neispravan XML.", kurs: null, napomena: "", nedostajeUgradjena: 0 };
  }
  if (!stablo || stablo.ime !== "kurs" || !dete(stablo, "nedelje")) {
    return { ok: false, greska: "Dokument nema spisak nedelja.", kurs: null, napomena: "", nedostajeUgradjena: 0 };
  }
  const nedelje = deca(dete(stablo, "nedelje"), "nedelja").map(procitajNedelju);
  if (nedelje.some((nedelja) => !nedelja.steps.length)) {
    return { ok: false, greska: "Nedelja nema korake.", kurs: null, napomena: "", nedostajeUgradjena: 0 };
  }
  const ustanova = dete(stablo, "ustanova");
  const zadato = stablo.attrs["trajanje-nedelja"];
  const napomena = zadato != null && Number(zadato) !== nedelje.length ? "Trajanje je usklađeno sa brojem nedelja." : "";
  const kurs = {
    ustanova: tekstElementa(dete(ustanova, "naziv")),
    ustanovaRed: tekstElementa(dete(ustanova, "univerzitet")),
    ustanovaBok: tekstElementa(dete(ustanova, "natpis")),
    naslov: tekstElementa(dete(stablo, "naslov")),
    oznaka: tekstElementa(dete(ustanova, "oznaka")),
    grb: tekstElementa(dete(ustanova, "grb")),
    trajanjeNedelja: nedelje.length,
    preduslovPrve: tekstElementa(dete(deca(dete(stablo, "nedelje"), "nedelja")[0], "preduslov")),
    nedelje,
  };
  return { ok: true, greska: "", napomena, kurs, nedostajeUgradjena: brojBezUgradjene(kurs) };
}

export function ispisiXml(kurs) {
  const nedelje = Array.isArray(kurs?.nedelje) ? kurs.nedelje : [];
  const linije = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    "<!--",
    `  Semantički zapis kursa ${kurs?.naslov || "kurs"}.`,
    "  Imena elemenata su pojmovi kursa. Tekst je sadržaj koji čas i studio prikazuju.",
    "  drzi=\"da\" je opcija koja drži. Na projektoru razlog ostaje zatvoren do Obrazloženja.",
    "-->",
    `<kurs xml:lang="sr" izvor="site/kurs.json" trajanje-nedelja="${nedelje.length}">`,
    "  <ustanova>",
    linija("naziv", kurs?.ustanova || "", 2),
    linija("univerzitet", kurs?.ustanovaRed || "", 2),
    linija("natpis", kurs?.ustanovaBok || "", 2),
    linija("oznaka", kurs?.oznaka || "", 2),
    linija("grb", kurs?.grb || "", 2),
    "  </ustanova>",
    linija("naslov", kurs?.naslov || "", 1),
    ...OBRAZAC,
    "  <nedelje>",
  ];
  nedelje.forEach((nedelja, indeks) => linije.push(...linijeNedelje(nedelja, indeks, kurs, nedelje)));
  linije.push("  </nedelje>", "</kurs>", "");
  return linije.join("\n");
}

function procitajNedelju(el) {
  const ishod = tekstElementa(dete(el, "ishod"));
  const podnaslov = dete(el, "podnaslov");
  const diskusija = dete(el, "diskusija");
  const glavna = pitalicaVrste(diskusija, "glavna");
  const rezerva = procitajRezervu(diskusija);
  const nedelja = {
    naslov: tekstElementa(dete(el, "naslov")),
    podnaslov: podnaslov ? tekstElementa(podnaslov) : ishod,
    ishod,
    minuta: brojAko(el.attrs.minuta, 90),
    problem: tekstElementa(dete(diskusija, "problem")) || tekstElementa(dete(glavna, "pitanje")),
    pretpostavka: tekstElementa(dete(diskusija, "pretpostavka")),
    options: procitajOpcije(dete(glavna, "opcije")),
  };
  if (rezerva !== undefined) nedelja.rezerva = rezerva;
  nedelja.izlaz = tekstIzlaza(diskusija);
  nedelja.pojmoviCasa = procitajPojmove(dete(el, "pojmovi"));
  nedelja.steps = deca(dete(el, "lekcije"), "korak").map(procitajKorak);
  return nedelja;
}

function procitajKorak(el) {
  const polja = {
    naslov: tekstElementa(dete(el, "naslov")),
    tekst: tekstElementa(dete(el, "tekst")),
    kljucnaIdeja: tekstElementa(dete(el, "kljucna-ideja")),
  };
  if ("nivo" in el.attrs) polja.nivo = el.attrs.nivo;
  if ("minuta" in el.attrs) polja.minuta = brojAko(el.attrs.minuta, 0);
  const crtez = dete(el, "crtez");
  const fajl = dete(el, "fajl");
  if (crtez) polja.figura = procitajCrtez(crtez);
  else if (fajl) procitajFajl(fajl, polja);
  const kratka = pitalicaVrste(el, "kratka") || dete(el, "pitalica");
  polja.pitalica = tekstElementa(dete(kratka, "pitanje"));
  polja.opcije = procitajOpcije(dete(kratka, "opcije"));
  return sloziKorak(polja);
}

function procitajFajl(fajl, polja) {
  polja.putanja = fajl.attrs.putanja || "";
  const isecak = dete(fajl, "isecak");
  if (isecak) {
    polja.isecakNaslov = isecak.attrs.naslov || "";
    polja.isecak = sirovo(isecak);
  }
  const uFajl = dete(fajl, "u-fajl");
  if (uFajl) polja.delic = sirovo(uFajl);
  else if (typeof polja.isecak === "string") polja.delic = polja.isecak;
  const ugradjena = dete(fajl, "ugradjena");
  if (ugradjena) polja.original = sirovo(ugradjena);
}

function procitajCrtez(el) {
  if (el.attrs.vrsta === "linija") {
    const figura = {
      vrsta: "linija",
      oznake: deca(el, "oznaka").map((oznaka) => ({
        godina: oznaka.attrs.godina || "",
        natpis: tekstElementa(oznaka),
      })),
    };
    if (el.attrs.pokret === "redom") figura.pokret = "redom";
    return figura;
  }
  const figura = {
    vrsta: "put",
    cvorovi: deca(el, "cvor").map((cvor) => ({
      id: cvor.attrs.id || "",
      natpis: tekstElementa(cvor),
    })),
  };
  if (el.attrs.pokret === "jednom") figura.pokret = "jednom";
  return figura;
}

function procitajOpcije(el) {
  return deca(el, "opcija").map((opcija) => ({
    key: opcija.attrs.oznaka || "",
    text: tekstElementa(dete(opcija, "tekst")),
    ok: opcija.attrs.drzi === "da",
    why: tekstElementa(dete(opcija, "razlog")),
  }));
}

function procitajPojmove(el) {
  return deca(el, "pojam").map((pojam) => ({
    id: pojam.attrs.id || "",
    name: tekstElementa(dete(pojam, "naziv")),
    hint: tekstElementa(dete(pojam, "nagovestaj")),
    body: tekstElementa(dete(pojam, "opis")),
    code: sirovo(dete(pojam, "zapis")),
  }));
}

function procitajRezervu(diskusija) {
  const el = dete(diskusija, "rezerva");
  if (!el) return undefined;
  if (el.attrs.prisutna === "ne") return null;
  const pitalica = pitalicaVrste(el, "rezerva") || dete(el, "pitalica");
  return {
    problem: tekstElementa(dete(el, "problem")) || tekstElementa(dete(pitalica, "pitanje")),
    options: procitajOpcije(dete(pitalica, "opcije")),
  };
}

function tekstIzlaza(diskusija) {
  const izlaz = dete(diskusija, "izlaz");
  return tekstElementa(dete(izlaz, "recenica")) || tekstElementa(izlaz);
}

function sloziKorak(polja) {
  const korak = {};
  if (typeof polja.putanja === "string") korak.putanja = polja.putanja;
  korak.naslov = polja.naslov;
  if ("nivo" in polja) korak.nivo = polja.nivo;
  if ("minuta" in polja) korak.minuta = polja.minuta;
  korak.tekst = polja.tekst;
  korak.kljucnaIdeja = polja.kljucnaIdeja;
  if (typeof polja.isecakNaslov === "string") korak.isecakNaslov = polja.isecakNaslov;
  if (typeof polja.isecak === "string") korak.isecak = polja.isecak;
  if (typeof polja.delic === "string") korak.delic = polja.delic;
  if (typeof polja.original === "string") korak.original = polja.original;
  korak.pitalica = polja.pitalica;
  korak.opcije = polja.opcije;
  if (polja.figura) korak.figura = polja.figura;
  return korak;
}

function brojBezUgradjene(kurs) {
  return kurs.nedelje.reduce((zbir, nedelja) => zbir + nedelja.steps.filter((korak) => {
    if (korak.figura || typeof korak.putanja !== "string") return false;
    return typeof korak.original !== "string";
  }).length, 0);
}

function linijeNedelje(nedelja, indeks, kurs, nedelje) {
  const minuta = nedelja.minuta ?? 90;
  const linije = [
    `    <nedelja broj="${indeks + 1}" minuta="${escapeAttr(minuta)}">`,
    linija("naslov", nedelja.naslov || "", 3),
    linija("ishod", nedelja.ishod || "", 3),
  ];
  if ((nedelja.podnaslov || "") !== (nedelja.ishod || "")) linije.push(linija("podnaslov", nedelja.podnaslov || "", 3));
  const preduslov = indeks === 0 ? kurs?.preduslovPrve || "" : nedelje[indeks - 1]?.ishod || "";
  linije.push(linija("preduslov", preduslov, 3), "      <lekcije>");
  (nedelja.steps || []).forEach((korak, ki) => linije.push(...linijeKoraka(korak, ki)));
  linije.push("      </lekcije>", "      <pojmovi>");
  (nedelja.pojmoviCasa || []).forEach((pojam) => linije.push(...linijePojma(pojam)));
  linije.push("      </pojmovi>", ...linijeDiskusije(nedelja), "    </nedelja>");
  return linije;
}

function linijeKoraka(korak, indeks) {
  const attrs = [`broj="${indeks + 1}"`];
  if ("nivo" in korak) attrs.push(`nivo="${escapeAttr(korak.nivo)}"`);
  if ("minuta" in korak) attrs.push(`minuta="${escapeAttr(korak.minuta)}"`);
  const linije = [`        <korak ${attrs.join(" ")}>`];
  linije.push(linija("naslov", korak.naslov || "", 5));
  linije.push(linija("tekst", korak.tekst || "", 5));
  linije.push(linija("kljucna-ideja", korak.kljucnaIdeja || "", 5));
  if (korak.figura) linije.push(...linijeCrteza(korak.figura));
  else if (typeof korak.putanja === "string" || typeof korak.isecak === "string") linije.push(...linijeFajla(korak));
  linije.push(...linijePitalice("kratka", korak.pitalica || "", korak.opcije || [], 5));
  linije.push("        </korak>");
  return linije;
}

function linijeFajla(korak) {
  const linije = [`          <fajl putanja="${escapeAttr(korak.putanja || "")}">`];
  if (typeof korak.isecak === "string") {
    linije.push(kod("isecak", { naslov: korak.isecakNaslov || "", jezik: jezikPutanje(korak.putanja) }, korak.isecak, 6));
  }
  if (typeof korak.delic === "string" && korak.delic !== korak.isecak) {
    linije.push(kod("u-fajl", { jezik: jezikPutanje(korak.putanja) }, korak.delic, 6));
  }
  if (typeof korak.original === "string") {
    linije.push(kod("ugradjena", { jezik: jezikPutanje(korak.putanja) }, korak.original, 6));
  }
  linije.push("          </fajl>");
  return linije;
}

function linijeCrteza(figura) {
  const pokret = figura.pokret ? ` pokret="${escapeAttr(figura.pokret)}"` : "";
  const linije = [`          <crtez vrsta="${escapeAttr(figura.vrsta || "put")}"${pokret}>`];
  if (figura.vrsta === "linija") {
    for (const oznaka of figura.oznake || []) {
      linije.push(`            <oznaka godina="${escapeAttr(oznaka.godina)}">${escapeText(oznaka.natpis || "")}</oznaka>`);
    }
  } else {
    for (const cvor of figura.cvorovi || []) {
      linije.push(`            <cvor id="${escapeAttr(cvor.id)}">${escapeText(cvor.natpis || "")}</cvor>`);
    }
  }
  linije.push("          </crtez>");
  return linije;
}

function linijePitalice(vrsta, pitanje, opcije, uvlaka) {
  const pad = "  ".repeat(uvlaka);
  const linije = [`${pad}<pitalica vrsta="${vrsta}">`, linija("pitanje", pitanje, uvlaka + 1), `${"  ".repeat(uvlaka + 1)}<opcije>`];
  for (const opcija of opcije) {
    linije.push(
      `${"  ".repeat(uvlaka + 2)}<opcija oznaka="${escapeAttr(opcija.key || "")}" drzi="${opcija.ok ? "da" : "ne"}">`,
      linija("tekst", opcija.text || "", uvlaka + 3),
      linija("razlog", opcija.why || "", uvlaka + 3),
      `${"  ".repeat(uvlaka + 2)}</opcija>`,
    );
  }
  linije.push(`${"  ".repeat(uvlaka + 1)}</opcije>`, `${pad}</pitalica>`);
  return linije;
}

function linijePojma(pojam) {
  return [
    `        <pojam id="${escapeAttr(pojam.id || "")}">`,
    linija("naziv", pojam.name || "", 5),
    linija("nagovestaj", pojam.hint || "", 5),
    linija("opis", pojam.body || "", 5),
    kod("zapis", { jezik: String(pojam.code || "").includes("<") ? "html" : "text" }, pojam.code || "", 5),
    "        </pojam>",
  ];
}

function linijeDiskusije(nedelja) {
  const linije = [
    "      <diskusija>",
    linija("problem", nedelja.problem || "", 4),
    linija("pretpostavka", nedelja.pretpostavka || "", 4),
    ...linijePitalice("glavna", nedelja.problem || "", nedelja.options || [], 4),
  ];
  if (nedelja.rezerva === null) {
    linije.push("        <rezerva prisutna=\"ne\"></rezerva>");
  } else if (nedelja.rezerva && typeof nedelja.rezerva === "object") {
    linije.push(
      `        <rezerva prisutna="da">`,
      linija("problem", nedelja.rezerva.problem || "", 5),
      ...linijePitalice("rezerva", nedelja.rezerva.problem || "", nedelja.rezerva.options || [], 5),
      "        </rezerva>",
    );
  }
  linije.push("        <izlaz>", linija("recenica", nedelja.izlaz || "", 5), "        </izlaz>", "      </diskusija>");
  return linije;
}

function pitalicaVrste(el, vrsta) {
  return deca(el, "pitalica").find((pitalica) => pitalica.attrs.vrsta === vrsta) || null;
}

function dete(el, ime) {
  if (!el) return null;
  return el.children.find((cvor) => cvor && cvor.ime === ime) || null;
}

function deca(el, ime) {
  if (!el) return [];
  return el.children.filter((cvor) => cvor && cvor.ime === ime);
}

function tekstElementa(el) {
  if (!el) return "";
  return el.children.filter((cvor) => typeof cvor === "string").join("").trim();
}

function sirovo(el) {
  if (!el) return "";
  return el.children.filter((cvor) => typeof cvor === "string").join("");
}

function brojAko(tekst, podrazumevano) {
  if (tekst == null || tekst === "") return podrazumevano;
  const broj = Number(tekst);
  return Number.isFinite(broj) ? broj : tekst;
}

function jezikPutanje(putanja) {
  const put = String(putanja || "");
  if (put.endsWith(".css")) return "css";
  if (put.endsWith(".html")) return "html";
  if (put.endsWith(".ts")) return "typescript";
  if (put.endsWith(".sql")) return "sql";
  if (put.endsWith(".js")) return "javascript";
  return "text";
}

function linija(ime, sadrzaj, uvlaka) {
  return `${"  ".repeat(uvlaka)}<${ime}>${escapeText(sadrzaj)}</${ime}>`;
}

function kod(ime, attrs, sadrzaj, uvlaka) {
  const atributi = Object.entries(attrs).map(([kljuc, vrednost]) => ` ${kljuc}="${escapeAttr(vrednost)}"`).join("");
  const telo = String(sadrzaj).replace(/]]>/g, "]]]]><![CDATA[>");
  return `${"  ".repeat(uvlaka)}<${ime}${atributi}><![CDATA[${telo}]]></${ime}>`;
}

function escapeText(sadrzaj) {
  return String(sadrzaj).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeAttr(sadrzaj) {
  return escapeText(sadrzaj).replace(/"/g, "&quot;");
}

function koren(ulaz) {
  const tekst = String(ulaz ?? "").replace(/^\uFEFF/, "");
  const cvorovi = [];
  let i = 0;
  while (i < tekst.length) {
    if (/\s/.test(tekst[i])) {
      i += 1;
      continue;
    }
    if (tekst.startsWith("<!--", i)) {
      i = zatvori(tekst, i + 4, "-->");
      continue;
    }
    if (tekst.startsWith("<?", i)) {
      i = zatvori(tekst, i + 2, "?>");
      continue;
    }
    if (tekst[i] !== "<") throw new Error("tekst");
    cvorovi.push(element(tekst, i).cvor);
    i = element.kraj;
  }
  if (cvorovi.length !== 1) throw new Error("koren");
  return cvorovi[0];

  function element(izvor, pocetak) {
    let k = pocetak + 1;
    if (izvor.startsWith("!--", k) || izvor.startsWith("![", k) || izvor[k] === "?") throw new Error("oznaka");
    const imePocetak = k;
    while (k < izvor.length && !/[\s>/]/.test(izvor[k])) k += 1;
    const ime = izvor.slice(imePocetak, k);
    if (!ime) throw new Error("ime");
    const attrs = {};
    while (k < izvor.length) {
      while (k < izvor.length && /\s/.test(izvor[k])) k += 1;
      if (izvor.startsWith("/>", k)) {
        element.kraj = k + 2;
        return { cvor: { ime, attrs, children: [] } };
      }
      if (izvor[k] === ">") {
        k += 1;
        break;
      }
      const imeAtributa = k;
      while (k < izvor.length && !/[\s=>/]/.test(izvor[k])) k += 1;
      const kljuc = izvor.slice(imeAtributa, k);
      while (k < izvor.length && /\s/.test(izvor[k])) k += 1;
      if (!kljuc || izvor[k] !== "=") throw new Error("atribut");
      k += 1;
      while (k < izvor.length && /\s/.test(izvor[k])) k += 1;
      const navodnik = izvor[k];
      if (navodnik !== "\"" && navodnik !== "'") throw new Error("navodnik");
      k += 1;
      const vrednostPocetak = k;
      while (k < izvor.length && izvor[k] !== navodnik) k += 1;
      if (k >= izvor.length) throw new Error("navodnik");
      attrs[kljuc] = dekodiraj(izvor.slice(vrednostPocetak, k));
      k += 1;
    }
    const children = [];
    while (k < izvor.length) {
      if (izvor.startsWith(`</${ime}`, k)) {
        const kraj = izvor.indexOf(">", k);
        if (kraj < 0 || izvor.slice(k + 2, kraj).trim() !== ime) throw new Error("kraj");
        element.kraj = kraj + 1;
        return { cvor: { ime, attrs, children: ocisti(children) } };
      }
      if (izvor.startsWith("</", k)) throw new Error("kraj");
      if (izvor.startsWith("<!--", k)) {
        k = zatvori(izvor, k + 4, "-->");
        continue;
      }
      if (izvor.startsWith("<![CDATA[", k)) {
        const kraj = izvor.indexOf("]]>", k + 9);
        if (kraj < 0) throw new Error("cdata");
        children.push(izvor.slice(k + 9, kraj));
        k = kraj + 3;
        continue;
      }
      if (izvor.startsWith("<?", k)) {
        k = zatvori(izvor, k + 2, "?>");
        continue;
      }
      if (izvor[k] === "<") {
        const ugnjezen = element(izvor, k);
        children.push(ugnjezen.cvor);
        k = element.kraj;
        continue;
      }
      const sledeci = izvor.indexOf("<", k);
      const doKraja = sledeci < 0 ? izvor.length : sledeci;
      children.push(dekodiraj(izvor.slice(k, doKraja)));
      k = doKraja;
    }
    throw new Error("eof");
  }
}

function zatvori(tekst, od, oznaka) {
  const kraj = tekst.indexOf(oznaka, od);
  if (kraj < 0) throw new Error(oznaka);
  return kraj + oznaka.length;
}

function ocisti(children) {
  if (!children.some((cvor) => cvor && typeof cvor === "object")) return children;
  return children.filter((cvor) => typeof cvor === "object" || String(cvor).trim() !== "");
}

function dekodiraj(tekst) {
  return tekst.replace(/&(quot|apos|lt|gt|amp|#x[0-9a-fA-F]+|#\d+);/g, (celo, entitet) => {
    if (entitet === "quot") return "\"";
    if (entitet === "apos") return "'";
    if (entitet === "lt") return "<";
    if (entitet === "gt") return ">";
    if (entitet === "amp") return "&";
    const kodna = entitet[1] === "x" ? parseInt(entitet.slice(2), 16) : parseInt(entitet.slice(1), 10);
    return Number.isFinite(kodna) ? String.fromCodePoint(kodna) : celo;
  });
}
