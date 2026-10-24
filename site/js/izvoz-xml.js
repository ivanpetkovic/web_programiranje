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
    ...dopunskaPolja(kurs, ["ustanova", "ustanovaRed", "ustanovaBok", "naslov", "oznaka", "grb", "trajanjeNedelja", "preduslovPrve", "nedelje"], 1),
    "  <nedelje>",
  ];
  nedelje.forEach((nedelja, indeks) => linije.push(...linijeNedelje(nedelja, indeks, kurs, nedelje)));
  linije.push("  </nedelje>", "</kurs>", "");
  return linije.join("\n");
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
  linije.push(...dopunskaPolja(nedelja, ["naslov", "podnaslov", "ishod", "minuta", "problem", "pretpostavka", "options", "rezerva", "izlaz", "pojmoviCasa", "steps"], 3));
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
  else if (typeof korak.putanja === "string") linije.push(...linijeFajla(korak));
  else if (typeof korak.isecak === "string") linije.push(kod("primer", { naslov: korak.isecakNaslov || "" }, korak.isecak, 5));
  linije.push(...dopunskaPolja(korak, ["naslov", "tekst", "kljucnaIdeja", "nivo", "minuta", "figura", "putanja", "isecak", "isecakNaslov", "delic", "original", "pitalica", "opcije"], 5));
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

function dopunskaPolja(vlasnik, poznata, uvlaka) {
  const polja = Object.fromEntries(Object.entries(vlasnik || {}).filter(([ime]) => !poznata.includes(ime)));
  return Object.keys(polja).length ? [kod("dopunska-polja", { format: "json" }, JSON.stringify(polja), uvlaka)] : [];
}
