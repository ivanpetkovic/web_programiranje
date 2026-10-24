export function procitajXml(tekst) {
  try { return procitajKursXml(tekst); }
  catch { return { ok: false, greska: "Neispravan XML ili dopunska polja.", kurs: null, napomena: "", nedostajeUgradjena: 0 }; }
}

function procitajKursXml(tekst) {
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
  Object.assign(kurs, dopunskaPolja(stablo));
  return { ok: true, greska: "", napomena, kurs, nedostajeUgradjena: brojBezUgradjene(kurs) };
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
  Object.assign(nedelja, dopunskaPolja(el));
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
  const primer = dete(el, "primer");
  if (primer) {
    polja.isecakNaslov = primer.attrs.naslov || "";
    polja.isecak = sirovo(primer);
  }
  const kratka = pitalicaVrste(el, "kratka") || dete(el, "pitalica");
  polja.pitalica = tekstElementa(dete(kratka, "pitanje"));
  polja.opcije = procitajOpcije(dete(kratka, "opcije"));
  return { ...sloziKorak(polja), ...dopunskaPolja(el) };
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

function dopunskaPolja(el) {
  const zapis = dete(el, "dopunska-polja");
  if (!zapis) return {};
  const polja = JSON.parse(sirovo(zapis));
  if (!polja || typeof polja !== "object" || Array.isArray(polja)) throw new Error("dopunska polja");
  if (["__proto__", "prototype", "constructor"].some((ime) => Object.hasOwn(polja, ime))) throw new Error("dopunska polja");
  return polja;
}
