import { svgFigura } from "./figura.js";
import {
  dodajKorak,
  dodajNedelju,
  dodajOpciju,
  dodajOznaku,
  dodajCvor,
  dodajPojam,
  indeksPoslePremestanja,
  oznaciOdgovor,
  postaviPokret,
  postaviVrstuFigure,
  postaviVrstuKoraka,
  prazanKurs,
  preduslovNedelje,
  premestiKorak,
  premestiNedelju,
  premestiOpciju,
  premestiPojam,
  procitajTekst,
  spremiTekst,
  ukloniCvor,
  ukloniKorak,
  ukloniNedelju,
  ukloniOpciju,
  ukloniOznaku,
  ukloniPojam,
  vrstaKoraka,
} from "./studio.js";
import { ispisiXml, procitajXml } from "./kurs-xml.js";

const KLJUC = "studio:kurs";
const spisak = document.querySelector("#spisak");
const rad = document.querySelector("#rad");

let kurs = prazanKurs();
let izbor = { vrsta: "kurs" };
let prljavo = false;
let potvrda = null;
let fokus = null;
let nacrtRok = 0;

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [kljuc, vrednost] of Object.entries(attrs)) {
    if (kljuc === "pressed") {
      node.setAttribute("aria-pressed", vrednost ? "true" : "false");
      continue;
    }
    if (vrednost == null || vrednost === false) continue;
    if (kljuc === "class") node.className = vrednost;
    else if (kljuc === "text") node.textContent = vrednost;
    else node.setAttribute(kljuc, vrednost === true ? "" : String(vrednost));
  }
  for (const dete of [].concat(children)) {
    if (dete == null || dete === false) continue;
    node.append(dete.nodeType ? dete : document.createTextNode(String(dete)));
  }
  return node;
}

function dugme(natpis, onClick, attrs = {}) {
  const node = el("button", { type: "button", text: natpis, ...attrs });
  node.addEventListener("click", onClick);
  return node;
}

function polje(natpis, vrednost, onInput, opcije = {}) {
  const input = document.createElement(opcije.visered ? "textarea" : "input");
  if (opcije.visered) input.rows = opcije.redovi || 4;
  else input.type = opcije.tip || "text";
  input.value = vrednost ?? "";
  input.autocomplete = "off";
  input.spellcheck = !opcije.kod;
  if (opcije.kod) input.className = "kod";
  if (opcije.id) input.id = opcije.id;
  input.addEventListener("input", () => {
    onInput(opcije.tip === "number" ? broj(input.value) : input.value);
    oznaciPrljavo();
  });
  return el("label", { class: "polje" }, [el("span", { text: natpis }), input]);
}

function sekcija(naslov, deca) {
  return el("section", { class: "sekcija" }, [el("h2", { text: naslov }), ...deca]);
}

function broj(tekst) {
  const n = Number(tekst);
  return Number.isFinite(n) ? n : 0;
}

function brojNedelja(n) {
  const ostatak = n % 10;
  const deset = n % 100;
  if (ostatak === 1 && deset !== 11) return `${n} nedelja`;
  if (ostatak >= 2 && ostatak <= 4 && (deset < 12 || deset > 14)) return `${n} nedelje`;
  return `${n} nedelja`;
}

function oznaciPrljavo() {
  prljavo = true;
  osveziZaglavlje();
  clearTimeout(nacrtRok);
  nacrtRok = setTimeout(() => {
    try {
      localStorage.setItem(KLJUC, spremiTekst(kurs));
    } catch {
      /* nacrt ne mora da stane u browser */
    }
  }, 300);
}

function osveziZaglavlje() {
  document.querySelector("#ime-kursa").textContent = kurs.naslov || "Studio";
  document.title = `Studio · ${kurs.naslov || "kurs"}`;
  const stanje = document.querySelector("#stanje");
  stanje.textContent = `${brojNedelja(kurs.nedelje.length)} · ${prljavo ? "nesačuvano" : "kurs.json"}`;
  stanje.className = prljavo ? "stanje prljavo" : "stanje";
}

function postaviPoruku(tekst, vrsta) {
  const node = document.querySelector("#poruka");
  node.textContent = tekst;
  node.className = `poruka ${vrsta || ""}`;
}

function nacrtaj() {
  osveziZaglavlje();
  nacrtajSpisak();
  nacrtajRad();
}

function nacrtajSpisak() {
  const skrol = spisak.scrollTop;
  const deca = [
    redListe(
      stavka("Kurs", izbor.vrsta === "kurs", () => izaberi({ vrsta: "kurs" }), kurs.naslov || "Bez naslova"),
      null
    ),
  ];
  kurs.nedelje.forEach((nedelja, indeks) => {
    const otvorena = izbor.vrsta !== "kurs" && izbor.nedelja === indeks;
    const dugmeNedelje = el("button", {
      type: "button",
      class: "stavka",
      "data-uloga": "nedelja",
      "data-indeks": String(indeks),
    });
    if (izbor.vrsta === "nedelja" && izbor.nedelja === indeks) dugmeNedelje.setAttribute("aria-current", "true");
    dugmeNedelje.append(
      el("span", { class: "broj", text: String(indeks + 1) }),
      el("span", { class: "ime" }, [
        el("span", { class: "ime-tekst", text: nedelja.naslov || "Bez naslova" }),
        el("small", { text: `${nedelja.steps.length} koraka` }),
      ])
    );
    dugmeNedelje.addEventListener("click", () => izaberi({ vrsta: "nedelja", nedelja: indeks }));
    const akcije = el("div", { class: "akcije" }, [
      dugme("↑", () => premesti("nedelja", indeks, -1), {
        "aria-label": "Pomeri nedelju gore",
        disabled: indeks === 0 ? "" : null,
      }),
      dugme("↓", () => premesti("nedelja", indeks, 1), {
        "aria-label": "Pomeri nedelju dole",
        disabled: indeks === kurs.nedelje.length - 1 ? "" : null,
      }),
      dugmeBrisanja(`nedelja:${indeks}`, "Obriši nedelju", () => {
        primeni(ukloniNedelju(kurs, indeks), izborPosleBrisanjaNedelje(indeks));
      }),
    ]);
    deca.push(redListe(dugmeNedelje, akcije));
    if (!otvorena) return;
    const koraci = el("div", { class: "koraci" });
    nedelja.steps.forEach((korak, korakIndeks) => {
      const dugmeKoraka = el("button", {
        type: "button",
        class: "stavka",
        "data-uloga": "korak",
        "data-indeks": String(korakIndeks),
      });
      if (izbor.vrsta === "korak" && izbor.korak === korakIndeks) dugmeKoraka.setAttribute("aria-current", "true");
      dugmeKoraka.append(
        el("span", { class: "broj", text: String(korakIndeks + 1) }),
        el("span", { class: "ime-tekst", text: korak.naslov || "Bez naslova" })
      );
      dugmeKoraka.addEventListener("click", () => izaberi({ vrsta: "korak", nedelja: indeks, korak: korakIndeks }));
      const akcijeKoraka = el("div", { class: "akcije" }, [
        dugme("↑", () => premesti("korak", korakIndeks, -1), {
          "aria-label": "Pomeri korak gore",
          disabled: korakIndeks === 0 ? "" : null,
        }),
        dugme("↓", () => premesti("korak", korakIndeks, 1), {
          "aria-label": "Pomeri korak dole",
          disabled: korakIndeks === nedelja.steps.length - 1 ? "" : null,
        }),
        nedelja.steps.length > 1
          ? dugmeBrisanja(`korak:${indeks}:${korakIndeks}`, "Obriši korak", () => {
              primeni(ukloniKorak(kurs, indeks, korakIndeks), izborPosleBrisanjaKoraka(indeks, korakIndeks));
            })
          : null,
      ]);
      koraci.append(redListe(dugmeKoraka, akcijeKoraka));
    });
    koraci.append(dugme("Dodaj korak", () => dodajKorakNa(indeks), { class: "dodaj" }));
    deca.push(koraci);
  });
  deca.push(dugme("Dodaj nedelju", () => dodajNedeljuNaKraj(), { class: "dodaj" }));
  spisak.replaceChildren(...deca);
  spisak.scrollTop = skrol;
  const tekuci = spisak.querySelector("[aria-current='true']");
  if (tekuci) tekuci.scrollIntoView({ block: "nearest" });
}

function redListe(glavno, akcije) {
  return el("div", { class: "red" }, [glavno, akcije]);
}

function stavka(natpis, trenutna, onClick, podnatpis) {
  const node = el("button", { type: "button", class: "stavka" });
  if (trenutna) node.setAttribute("aria-current", "true");
  node.append(el("span", { class: "ime" }, [el("span", { class: "ime-tekst", text: natpis }), podnatpis ? el("small", { text: podnatpis }) : null]));
  node.addEventListener("click", onClick);
  return node;
}

function dugmeBrisanja(kljuc, natpis, radnja) {
  const ceka = potvrda === kljuc;
  return dugme(ceka ? "Potvrdi" : "Obriši", () => {
    if (potvrda !== kljuc) {
      potvrda = kljuc;
      nacrtaj();
      return;
    }
    radnja();
  }, { class: ceka ? "opasno ceka" : "opasno", "aria-label": natpis });
}

function nacrtajRad() {
  const isti = rad.dataset.izbor === kljucIzbora();
  const skrol = rad.scrollTop;
  rad.dataset.izbor = kljucIzbora();
  if (izbor.vrsta === "kurs") rad.replaceChildren(panelKursa());
  else if (izbor.vrsta === "nedelja") rad.replaceChildren(panelNedelje(izbor.nedelja));
  else rad.replaceChildren(panelKoraka(izbor.nedelja, izbor.korak));
  if (fokus) {
    const cilj = rad.querySelector(fokus);
    fokus = null;
    if (cilj) cilj.focus();
    return;
  }
  rad.scrollTop = isti ? skrol : 0;
}

function kljucIzbora() {
  return `${izbor.vrsta}:${izbor.nedelja ?? ""}:${izbor.korak ?? ""}`;
}

function panelKursa() {
  return el("div", { class: "panel" }, [
    el("h1", { text: "Kurs" }),
    el("p", {
      class: "uvod",
      text: "Sačuvaj upisuje kurs.json, fajl koji čas otvara. Učitaj prima JSON ili semantički XML. Preuzmi skida JSON. Preuzmi XML skida kurs.xml.",
    }),
    el("p", {
      class: "uvod",
      text: "Naslov i ustanova su zaglavlje časa. Ishod nedelje je podnaslov u spisku. Na Gradivu korak ide redom: tekst, ključna ideja, isečak ili crtež, pa kratka pitalica. Razlog i oznaka drži ostaju zatvoreni do Obrazloženja. Delić iz u-fajl ulazi u fajl, a prethodni delići stoje kao Već u fajlu. Ugrađena verzija je Lekcija u editoru. Diskusija nedelje je tab Diskusija, izlaz je rečenica na poslednjem koraku, a pojmovi se uređuju ovde.",
    }),
    el("div", { class: "mreza" }, [
      polje("Naslov", kurs.naslov, (vrednost) => {
        kurs.naslov = vrednost;
        osveziZaglavlje();
        const ime = spisak.querySelector(".stavka .ime-tekst");
        if (ime) ime.textContent = vrednost || "Bez naslova";
      }, { id: "naslov-polje" }),
      polje("Oznaka", kurs.oznaka, (vrednost) => { kurs.oznaka = vrednost; }),
      polje("Ustanova", kurs.ustanova, (vrednost) => { kurs.ustanova = vrednost; }),
      polje("Red ustanove", kurs.ustanovaRed, (vrednost) => { kurs.ustanovaRed = vrednost; }),
      polje("Bok ustanove", kurs.ustanovaBok, (vrednost) => { kurs.ustanovaBok = vrednost; }),
      polje("Grb", kurs.grb, (vrednost) => { kurs.grb = vrednost; }),
    ]),
    polje("Preduslov prve nedelje", kurs.preduslovPrve, (vrednost) => { kurs.preduslovPrve = vrednost; }, { visered: true, redovi: 3 }),
  ]);
}

function panelNedelje(indeks) {
  const nedelja = kurs.nedelje[indeks];
  const zbir = nedelja.steps.reduce((zbirMinuta, korak) => zbirMinuta + (Number(korak.minuta) || 0), 0);
  return el("div", { class: "panel" }, [
    el("header", { class: "rad-h" }, [
      el("p", { class: "meta", text: `Nedelja ${indeks + 1} od ${kurs.nedelje.length}` }),
      el("h1", { id: "naslov-prikaz", text: nedelja.naslov || "Bez naslova" }),
      el("p", { class: "meta", text: `${nedelja.steps.length} koraka · koraci ${zbir} min · čas ${nedelja.minuta || 0} min` }),
      el("div", { class: "red-akcija" }, [
        dugme("Dodaj korak", () => dodajKorakNa(indeks)),
        dugmeBrisanja(`nedelja:${indeks}`, "Obriši nedelju", () => {
          primeni(ukloniNedelju(kurs, indeks), izborPosleBrisanjaNedelje(indeks));
        }),
      ]),
    ]),
    sekcija("Nedelja", [
      polje("Naslov", nedelja.naslov, (vrednost) => {
        nedelja.naslov = vrednost;
        osveziNatpisNedelje(indeks, vrednost);
      }, { id: "naslov-polje" }),
      polje("Podnaslov", nedelja.podnaslov, (vrednost) => { nedelja.podnaslov = vrednost; }, { visered: true, redovi: 2 }),
      polje("Ishod", nedelja.ishod, (vrednost) => { nedelja.ishod = vrednost; }, { visered: true, redovi: 2 }),
      polje("Minuta", nedelja.minuta, (vrednost) => { nedelja.minuta = vrednost; }, { tip: "number" }),
      el("p", { class: "meta", text: `Preduslov: ${preduslovNedelje(kurs, indeks + 1) || "—"}` }),
    ]),
    sekcija("Diskusija", [
      polje("Problem", nedelja.problem, (vrednost) => { nedelja.problem = vrednost; }, { visered: true, redovi: 3 }),
      polje("Pretpostavka", nedelja.pretpostavka, (vrednost) => { nedelja.pretpostavka = vrednost; }, { visered: true, redovi: 2 }),
      blokOpcija(nedelja, "options"),
      polje("Izlaz", nedelja.izlaz, (vrednost) => { nedelja.izlaz = vrednost; }, { visered: true, redovi: 2 }),
    ]),
    sekcija("Rezerva", rezervaPolja(nedelja)),
    sekcija("Pojmovi", [blokPojmova(nedelja)]),
  ]);
}

function panelKoraka(nedeljaIndeks, indeks) {
  const nedelja = kurs.nedelje[nedeljaIndeks];
  const korak = nedelja.steps[indeks];
  return el("div", { class: "panel" }, [
    el("header", { class: "rad-h" }, [
      el("p", { class: "meta", text: `${nedelja.naslov || "Nedelja"} · korak ${indeks + 1} od ${nedelja.steps.length}` }),
      el("h1", { id: "naslov-prikaz", text: korak.naslov || "Bez naslova" }),
      el("div", { class: "hod" }, [
        dugme("Prethodni", () => izaberi({ vrsta: "korak", nedelja: nedeljaIndeks, korak: indeks - 1 }), {
          disabled: indeks === 0 ? "" : null,
        }),
        dugme("Sledeći", () => izaberi({ vrsta: "korak", nedelja: nedeljaIndeks, korak: indeks + 1 }), {
          disabled: indeks === nedelja.steps.length - 1 ? "" : null,
        }),
        dugme("Dodaj ispod", () => dodajKorakNa(nedeljaIndeks, indeks + 1)),
        nedelja.steps.length > 1
          ? dugmeBrisanja(`korak:${nedeljaIndeks}:${indeks}`, "Obriši korak", () => {
              primeni(ukloniKorak(kurs, nedeljaIndeks, indeks), izborPosleBrisanjaKoraka(nedeljaIndeks, indeks));
            })
          : null,
      ]),
    ]),
    sekcija("Korak", [
      el("div", { class: "mreza" }, [
        polje("Naslov", korak.naslov, (vrednost) => {
          korak.naslov = vrednost;
          osveziNatpisKoraka(indeks, vrednost);
        }, { id: "naslov-polje" }),
        polje("Nivo", korak.nivo, (vrednost) => { korak.nivo = vrednost; }),
        polje("Minuta", korak.minuta, (vrednost) => { korak.minuta = vrednost; }, { tip: "number" }),
      ]),
      polje("Tekst", korak.tekst, (vrednost) => { korak.tekst = vrednost; }, { visered: true, redovi: 6 }),
      polje("Ključna ideja", korak.kljucnaIdeja, (vrednost) => { korak.kljucnaIdeja = vrednost; }, { visered: true, redovi: 3 }),
    ]),
    sekcija("Sadržaj", [sadrzajKoraka(korak)]),
    sekcija("Pitalica", [
      polje("Pitanje", korak.pitalica, (vrednost) => { korak.pitalica = vrednost; }, { visered: true, redovi: 2 }),
      blokOpcija(korak, "opcije"),
    ]),
  ]);
}

function rezervaPolja(nedelja) {
  if (!nedelja.rezerva || typeof nedelja.rezerva !== "object") {
    return [dugme("Dodaj rezervu", () => {
      nedelja.rezerva = {
        problem: "",
        options: [
          { key: "A", text: "", ok: true, why: "" },
          { key: "B", text: "", ok: false, why: "" },
        ],
      };
      oznaciPrljavo();
      nacrtajRad();
    })];
  }
  return [
    polje("Problem rezerve", nedelja.rezerva.problem, (vrednost) => { nedelja.rezerva.problem = vrednost; }, { visered: true, redovi: 3 }),
    blokOpcija(nedelja.rezerva, "options"),
  ];
}

function blokOpcija(vlasnik, poljeIme) {
  const kutija = el("div", { class: "opcije" });
  napuniOpcije(kutija, vlasnik, poljeIme);
  return kutija;
}

function napuniOpcije(kutija, vlasnik, poljeIme) {
  const opcije = Array.isArray(vlasnik[poljeIme]) ? vlasnik[poljeIme] : [];
  kutija.replaceChildren();
  opcije.forEach((opcija, indeks) => kutija.append(redOpcije(vlasnik, poljeIme, indeks)));
  kutija.append(dugme("Dodaj odgovor", () => {
    dodajOpciju(niz(vlasnik, poljeIme));
    oznaciPrljavo();
    napuniOpcije(kutija, vlasnik, poljeIme);
    const polja = kutija.querySelectorAll("textarea");
    if (polja.length) polja[polja.length - 2].focus();
  }));
}

function redOpcije(vlasnik, poljeIme, indeks) {
  const opcije = vlasnik[poljeIme];
  const opcija = opcije[indeks];
  const tacan = dugme(opcija.key || "?", () => {
    oznaciOdgovor(opcije, indeks);
    oznaciPrljavo();
    napuniOpcije(tacan.closest(".opcije"), vlasnik, poljeIme);
  }, {
    class: "tacan",
    pressed: opcija.ok === true,
    title: "Označi kao tačan odgovor",
    "aria-label": `Odgovor ${opcija.key} je tačan`,
  });
  const tekst = document.createElement("textarea");
  tekst.rows = 2;
  tekst.value = opcija.text || "";
  tekst.placeholder = "Odgovor";
  tekst.addEventListener("input", () => { opcija.text = tekst.value; oznaciPrljavo(); });
  const zasto = document.createElement("textarea");
  zasto.rows = 2;
  zasto.value = opcija.why || "";
  zasto.placeholder = "Zašto";
  zasto.addEventListener("input", () => { opcija.why = zasto.value; oznaciPrljavo(); });
  return el("div", { class: "opcija" }, [
    tacan,
    el("div", { class: "opcija-tekst" }, [tekst, zasto]),
    el("div", { class: "akcije" }, [
      dugme("↑", () => { premestiOpciju(opcije, indeks, -1); oznaciPrljavo(); napuniOpcije(tacan.closest(".opcije"), vlasnik, poljeIme); }, {
        "aria-label": "Pomeri odgovor gore",
        disabled: indeks === 0 ? "" : null,
      }),
      dugme("↓", () => { premestiOpciju(opcije, indeks, 1); oznaciPrljavo(); napuniOpcije(tacan.closest(".opcije"), vlasnik, poljeIme); }, {
        "aria-label": "Pomeri odgovor dole",
        disabled: indeks === opcije.length - 1 ? "" : null,
      }),
      dugme("Obriši", () => { ukloniOpciju(opcije, indeks); oznaciPrljavo(); napuniOpcije(tacan.closest(".opcije"), vlasnik, poljeIme); }, {
        class: "opasno",
        "aria-label": "Obriši odgovor",
      }),
    ]),
  ]);
}

function blokPojmova(nedelja) {
  const kutija = el("div", { class: "pojmovi" });
  napuniPojmove(kutija, nedelja);
  return kutija;
}

function napuniPojmove(kutija, nedelja) {
  const pojmovi = Array.isArray(nedelja.pojmoviCasa) ? nedelja.pojmoviCasa : [];
  kutija.replaceChildren();
  pojmovi.forEach((pojam, indeks) => kutija.append(redPojma(nedelja, indeks)));
  kutija.append(dugme("Dodaj pojam", () => {
    dodajPojam(nedelja);
    oznaciPrljavo();
    napuniPojmove(kutija, nedelja);
    const poslednji = kutija.querySelector(".pojam:last-child input");
    if (poslednji) poslednji.focus();
  }));
}

function redPojma(nedelja, indeks) {
  const pojam = nedelja.pojmoviCasa[indeks];
  const omot = el("div", { class: "pojam" });
  const osvezi = () => napuniPojmove(omot.closest(".pojmovi"), nedelja);
  omot.append(
    el("div", { class: "mreza" }, [
      polje("Ime", pojam.name, (vrednost) => { pojam.name = vrednost; }),
      polje("Id", pojam.id, (vrednost) => { pojam.id = vrednost; }, { kod: true }),
      polje("Natuknica", pojam.hint, (vrednost) => { pojam.hint = vrednost; }),
    ]),
    polje("Tekst", pojam.body, (vrednost) => { pojam.body = vrednost; }, { visered: true, redovi: 3 }),
    polje("Kod", pojam.code, (vrednost) => { pojam.code = vrednost; }, { visered: true, redovi: 3, kod: true }),
    el("div", { class: "akcije" }, [
      dugme("↑", () => { premestiPojam(nedelja, indeks, -1); oznaciPrljavo(); osvezi(); }, {
        "aria-label": "Pomeri pojam gore",
        disabled: indeks === 0 ? "" : null,
      }),
      dugme("↓", () => { premestiPojam(nedelja, indeks, 1); oznaciPrljavo(); osvezi(); }, {
        "aria-label": "Pomeri pojam dole",
        disabled: indeks === nedelja.pojmoviCasa.length - 1 ? "" : null,
      }),
      dugme("Obriši", () => { ukloniPojam(nedelja, indeks); oznaciPrljavo(); osvezi(); }, {
        class: "opasno",
        "aria-label": "Obriši pojam",
      }),
    ])
  );
  return omot;
}

function sadrzajKoraka(korak) {
  const omot = el("div", { id: "sadrzaj-koraka" });
  napuniSadrzaj(omot, korak);
  return omot;
}

function napuniSadrzaj(omot, korak) {
  const vrsta = vrstaKoraka(korak);
  const birac = el("div", { class: "segment", role: "group", "aria-label": "Vrsta koraka" }, [
    dugmeVrste(omot, korak, "prica", "Priča", vrsta),
    dugmeVrste(omot, korak, "fajl", "Fajl", vrsta),
    dugmeVrste(omot, korak, "figura", "Figura", vrsta),
  ]);
  const telo = vrsta === "fajl" ? poljaFajla(korak) : vrsta === "figura" ? poljaFigure(korak) : el("p", { class: "meta", text: "Priča nema fajl ni figuru." });
  omot.replaceChildren(birac, telo);
}

function dugmeVrste(omot, korak, vrsta, natpis, trenutna) {
  const kljuc = `vrsta:${vrsta}`;
  const gubitak = vrsta !== trenutna && imaGubitak(korak);
  const ceka = potvrda === kljuc;
  return dugme(ceka ? "Potvrdi" : natpis, () => {
    if (vrsta === vrstaKoraka(korak)) return;
    if (gubitak && potvrda !== kljuc) {
      potvrda = kljuc;
      napuniSadrzaj(omot, korak);
      return;
    }
    potvrda = null;
    postaviVrstuKoraka(korak, vrsta);
    oznaciPrljavo();
    napuniSadrzaj(omot, korak);
  }, { pressed: trenutna === vrsta && !ceka });
}

function imaGubitak(korak) {
  const vrsta = vrstaKoraka(korak);
  if (vrsta === "prica") return false;
  if (vrsta === "fajl") return Boolean(korak.putanja || korak.isecak || korak.isecakNaslov || korak.delic || korak.original);
  return Boolean(korak.figura);
}

function poljaFajla(korak) {
  return el("div", { class: "polja-fajla" }, [
    polje("Putanja", korak.putanja, (vrednost) => { korak.putanja = vrednost; }, { kod: true }),
    polje("Naslov isečka", korak.isecakNaslov, (vrednost) => { korak.isecakNaslov = vrednost; }),
    polje("Isečak", korak.isecak, (vrednost) => { korak.isecak = vrednost; }, { visered: true, redovi: 8, kod: true }),
    polje("Delić", korak.delic, (vrednost) => { korak.delic = vrednost; }, { visered: true, redovi: 6, kod: true }),
    polje("Original", korak.original, (vrednost) => { korak.original = vrednost; }, { visered: true, redovi: 8, kod: true }),
  ]);
}

function poljaFigure(korak) {
  const figura = korak.figura;
  const vrsta = figura.vrsta === "linija" ? "linija" : "put";
  const birac = el("div", { class: "segment", role: "group", "aria-label": "Vrsta figure" }, [
    dugme("Put", () => promeniFiguru(korak, "put"), { pressed: vrsta === "put" }),
    dugme("Linija", () => promeniFiguru(korak, "linija"), { pressed: vrsta === "linija" }),
  ]);
  const input = document.createElement("input");
  input.type = "checkbox";
  input.checked = Boolean(figura.pokret);
  input.addEventListener("change", () => {
    postaviPokret(korak, input.checked);
    oznaciPrljavo();
    osveziPregled(korak);
  });
  const lista = el("div", { class: "cvorovi" });
  napuniCvorove(lista, korak);
  const pregled = el("div", { class: "figura", id: "pregled-figure" });
  pregled.innerHTML = svgFigura(korak.figura);
  return el("div", { class: "figura-editor" }, [
    birac,
    el("label", { class: "kvacica" }, [input, "Pokret"]),
    lista,
    pregled,
  ]);
}

function promeniFiguru(korak, vrsta) {
  if (korak.figura?.vrsta === vrsta) return;
  postaviVrstuFigure(korak, vrsta);
  oznaciPrljavo();
  const omot = document.querySelector("#sadrzaj-koraka");
  if (omot) napuniSadrzaj(omot, korak);
}

function napuniCvorove(lista, korak) {
  lista.replaceChildren();
  if (korak.figura.vrsta === "linija") {
    korak.figura.oznake.forEach((oznaka, indeks) => lista.append(redOznake(lista, korak, indeks)));
    lista.append(dugme("Dodaj oznaku", () => {
      dodajOznaku(korak);
      oznaciPrljavo();
      napuniCvorove(lista, korak);
      osveziPregled(korak);
    }));
    return;
  }
  korak.figura.cvorovi.forEach((cvor, indeks) => lista.append(redCvora(lista, korak, indeks)));
  lista.append(dugme("Dodaj čvor", () => {
    dodajCvor(korak);
    oznaciPrljavo();
    napuniCvorove(lista, korak);
    osveziPregled(korak);
  }));
}

function redCvora(lista, korak, indeks) {
  const cvor = korak.figura.cvorovi[indeks];
  return el("div", { class: "cvor" }, [
    unos("Id", cvor.id, (vrednost) => { cvor.id = vrednost; osveziPregled(korak); }, true),
    unos("Natpis", cvor.natpis, (vrednost) => { cvor.natpis = vrednost; osveziPregled(korak); }),
    el("div", { class: "akcije" }, [
      dugme("↑", () => pomeriStavku(korak.figura.cvorovi, indeks, -1, lista, korak), {
        "aria-label": "Pomeri čvor gore",
        disabled: indeks === 0 ? "" : null,
      }),
      dugme("↓", () => pomeriStavku(korak.figura.cvorovi, indeks, 1, lista, korak), {
        "aria-label": "Pomeri čvor dole",
        disabled: indeks === korak.figura.cvorovi.length - 1 ? "" : null,
      }),
      dugme("Obriši", () => {
        ukloniCvor(korak, indeks);
        oznaciPrljavo();
        napuniCvorove(lista, korak);
        osveziPregled(korak);
      }, {
        class: "opasno",
        "aria-label": "Obriši čvor",
        disabled: korak.figura.cvorovi.length < 2 ? "" : null,
      }),
    ]),
  ]);
}

function redOznake(lista, korak, indeks) {
  const oznaka = korak.figura.oznake[indeks];
  return el("div", { class: "cvor" }, [
    unos("Godina", String(oznaka.godina ?? ""), (vrednost) => { oznaka.godina = vrednost; osveziPregled(korak); }),
    unos("Natpis", oznaka.natpis, (vrednost) => { oznaka.natpis = vrednost; osveziPregled(korak); }),
    el("div", { class: "akcije" }, [
      dugme("↑", () => pomeriStavku(korak.figura.oznake, indeks, -1, lista, korak), {
        "aria-label": "Pomeri oznaku gore",
        disabled: indeks === 0 ? "" : null,
      }),
      dugme("↓", () => pomeriStavku(korak.figura.oznake, indeks, 1, lista, korak), {
        "aria-label": "Pomeri oznaku dole",
        disabled: indeks === korak.figura.oznake.length - 1 ? "" : null,
      }),
      dugme("Obriši", () => {
        ukloniOznaku(korak, indeks);
        oznaciPrljavo();
        napuniCvorove(lista, korak);
        osveziPregled(korak);
      }, {
        class: "opasno",
        "aria-label": "Obriši oznaku",
        disabled: korak.figura.oznake.length < 2 ? "" : null,
      }),
    ]),
  ]);
}

function unos(natpis, vrednost, onInput, kod) {
  const input = document.createElement("input");
  input.type = "text";
  input.value = vrednost ?? "";
  input.placeholder = natpis;
  input.setAttribute("aria-label", natpis);
  input.autocomplete = "off";
  if (kod) input.className = "kod";
  input.addEventListener("input", () => {
    onInput(input.value);
    oznaciPrljavo();
  });
  return input;
}

function pomeriStavku(niz, indeks, smer, lista, korak) {
  const cilj = indeks + smer;
  if (cilj < 0 || cilj >= niz.length) return;
  const [stavkaNiza] = niz.splice(indeks, 1);
  niz.splice(cilj, 0, stavkaNiza);
  oznaciPrljavo();
  napuniCvorove(lista, korak);
  osveziPregled(korak);
}

function osveziPregled(korak) {
  const pregled = document.querySelector("#pregled-figure");
  if (pregled) pregled.innerHTML = svgFigura(korak.figura);
}

function osveziNatpisNedelje(indeks, naslov) {
  const ime = spisak.querySelector(`[data-uloga="nedelja"][data-indeks="${indeks}"] .ime-tekst`);
  if (ime) ime.textContent = naslov || "Bez naslova";
  const prikaz = document.querySelector("#naslov-prikaz");
  if (prikaz) prikaz.textContent = naslov || "Bez naslova";
}

function osveziNatpisKoraka(indeks, naslov) {
  const ime = spisak.querySelector(`[data-uloga="korak"][data-indeks="${indeks}"] .ime-tekst`);
  if (ime) ime.textContent = naslov || "Bez naslova";
  const prikaz = document.querySelector("#naslov-prikaz");
  if (prikaz) prikaz.textContent = naslov || "Bez naslova";
}

function niz(vlasnik, poljeIme) {
  if (!Array.isArray(vlasnik[poljeIme])) vlasnik[poljeIme] = [];
  return vlasnik[poljeIme];
}

function izaberi(sledeci) {
  potvrda = null;
  izbor = sledeci;
  nacrtaj();
}

function primeni(sledeci, sledeciIzbor) {
  if (sledeci === kurs) return;
  kurs = sledeci;
  if (sledeciIzbor) izbor = sledeciIzbor;
  potvrda = null;
  oznaciPrljavo();
  nacrtaj();
}

function dodajNedeljuNaKraj() {
  const sledeci = dodajNedelju(kurs);
  fokus = "#naslov-polje";
  primeni(sledeci, { vrsta: "nedelja", nedelja: sledeci.nedelje.length - 1 });
}

function dodajKorakNa(nedeljaIndeks, indeks) {
  const sledeci = dodajKorak(kurs, nedeljaIndeks, indeks);
  const korak = indeks == null ? sledeci.nedelje[nedeljaIndeks].steps.length - 1 : indeks;
  fokus = "#naslov-polje";
  primeni(sledeci, { vrsta: "korak", nedelja: nedeljaIndeks, korak });
}

function premesti(vrsta, indeks, smer) {
  if (vrsta === "nedelja") {
    const sledeci = premestiNedelju(kurs, indeks, smer);
    if (sledeci === kurs) return;
    const nedelja = izbor.vrsta === "kurs" ? 0 : indeksPoslePremestanja(izbor.nedelja, indeks, smer);
    primeni(sledeci, izbor.vrsta === "kurs" ? izbor : { ...izbor, nedelja });
    return;
  }
  const sledeci = premestiKorak(kurs, izbor.nedelja, indeks, smer);
  if (sledeci === kurs) return;
  const korak = izbor.vrsta === "korak" ? indeksPoslePremestanja(izbor.korak, indeks, smer) : izbor.korak;
  primeni(sledeci, { ...izbor, korak });
}

function izborPosleBrisanjaNedelje(indeks) {
  if (izbor.vrsta === "kurs") return izbor;
  if (izbor.nedelja === indeks) return kurs.nedelje.length > 1 ? { vrsta: "nedelja", nedelja: Math.max(0, indeks - 1) } : { vrsta: "kurs" };
  if (izbor.nedelja > indeks) return { ...izbor, nedelja: izbor.nedelja - 1 };
  return izbor;
}

function izborPosleBrisanjaKoraka(nedeljaIndeks, indeks) {
  if (izbor.vrsta !== "korak" || izbor.nedelja !== nedeljaIndeks) return izbor;
  if (izbor.korak === indeks) return { vrsta: "korak", nedelja: nedeljaIndeks, korak: Math.max(0, indeks - 1) };
  if (izbor.korak > indeks) return { ...izbor, korak: izbor.korak - 1 };
  return izbor;
}

function preuzmiDatoteku(tekst, ime, tip) {
  const url = URL.createObjectURL(new Blob([tekst], { type: tip }));
  const veza = document.createElement("a");
  veza.href = url;
  veza.download = ime;
  document.body.append(veza);
  veza.click();
  veza.remove();
  URL.revokeObjectURL(url);
}

function preuzmiTekst(tekst) {
  preuzmiDatoteku(tekst, "kurs.json", "application/json");
}

async function sacuvaj() {
  const tekst = spremiTekst(kurs);
  const dugmeSacuvaj = document.querySelector("#sacuvaj");
  dugmeSacuvaj.disabled = true;
  try {
    const odgovor = await fetch("/api/kurs", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: tekst,
    });
    if (!odgovor.ok) {
      const telo = await odgovor.json().catch(() => ({}));
      preuzmiTekst(tekst);
      postaviPoruku(
        telo.greska ? `Server nije primio dokument (${telo.greska}). Preuzet je kurs.json.` : "Server nije primio dokument. Preuzet je kurs.json.",
        "greska"
      );
      return;
    }
    prljavo = false;
    localStorage.removeItem(KLJUC);
    document.querySelector("#nacrt").hidden = true;
    osveziZaglavlje();
    postaviPoruku("Sačuvano u kurs.json.", "dobro");
  } catch {
    preuzmiTekst(tekst);
    postaviPoruku("Server nije dostupan. Preuzet je kurs.json.", "greska");
  } finally {
    dugmeSacuvaj.disabled = false;
  }
}

async function ucitajFajl(fajl) {
  const tekst = await fajl.text();
  const xml = fajl.name.toLowerCase().endsWith(".xml") || tekst.trimStart().startsWith("<");
  const rezultat = xml ? procitajXml(tekst) : procitajTekst(tekst);
  if (!rezultat.ok) {
    postaviPoruku(rezultat.greska, "greska");
    return;
  }
  kurs = rezultat.kurs;
  izbor = kurs.nedelje.length ? { vrsta: "nedelja", nedelja: 0 } : { vrsta: "kurs" };
  document.querySelector("#nacrt").hidden = true;
  oznaciPrljavo();
  nacrtaj();
  const uvod = rezultat.napomena || `Učitan je ${fajl.name}. Sačuvaj da upišeš kurs.json.`;
  const rupa = rezultat.nedostajeUgradjena
    ? ` ${rezultat.nedostajeUgradjena} koraka nema ugrađenu verziju, pa editor sklapa fajl iz delića.`
    : "";
  postaviPoruku(`${uvod}${rupa}`, "dobro");
}

function procitajNacrt() {
  try {
    const tekst = localStorage.getItem(KLJUC);
    if (!tekst) return null;
    const rezultat = procitajTekst(tekst);
    return rezultat.ok ? rezultat.kurs : null;
  } catch {
    return null;
  }
}

function ponudiNacrt(tekstServera) {
  let sacuvan = null;
  try {
    sacuvan = localStorage.getItem(KLJUC);
  } catch {
    return;
  }
  if (!sacuvan || sacuvan === tekstServera || !procitajTekst(sacuvan).ok) {
    if (sacuvan && !procitajTekst(sacuvan).ok) localStorage.removeItem(KLJUC);
    return;
  }
  document.querySelector("#nacrt").hidden = false;
}

async function pokreni() {
  document.querySelector("#fajl").addEventListener("change", (dogadjaj) => {
    const fajl = dogadjaj.target.files && dogadjaj.target.files[0];
    dogadjaj.target.value = "";
    if (fajl) ucitajFajl(fajl);
  });
  document.querySelector("#sacuvaj").addEventListener("click", sacuvaj);
  document.querySelector("#preuzmi").addEventListener("click", () => {
    preuzmiTekst(spremiTekst(kurs));
    postaviPoruku("Preuzet je kurs.json.", "dobro");
  });
  document.querySelector("#preuzmi-xml").addEventListener("click", () => {
    preuzmiDatoteku(ispisiXml(kurs), "kurs.xml", "application/xml");
    postaviPoruku("Preuzet je kurs.xml.", "dobro");
  });
  document.querySelector("#vrati-nacrt").addEventListener("click", () => {
    const nacrt = procitajNacrt();
    if (!nacrt) return;
    kurs = nacrt;
    izbor = { vrsta: "kurs" };
    prljavo = true;
    document.querySelector("#nacrt").hidden = true;
    nacrtaj();
    postaviPoruku("Vraćen je nacrt iz browsera. Sačuvaj da upišeš kurs.json.", "dobro");
  });
  document.querySelector("#odbaci-nacrt").addEventListener("click", () => {
    localStorage.removeItem(KLJUC);
    document.querySelector("#nacrt").hidden = true;
  });
  window.addEventListener("beforeunload", (dogadjaj) => {
    if (!prljavo) return;
    dogadjaj.preventDefault();
    dogadjaj.returnValue = "";
  });
  try {
    const odgovor = await fetch("/kurs.json", { cache: "no-store" });
    if (!odgovor.ok) throw new Error("nema");
    const tekst = await odgovor.text();
    const rezultat = procitajTekst(tekst);
    if (!rezultat.ok) throw new Error(rezultat.greska);
    kurs = rezultat.kurs;
    izbor = kurs.nedelje.length ? { vrsta: "nedelja", nedelja: 0 } : { vrsta: "kurs" };
    nacrtaj();
    postaviPoruku(rezultat.napomena || "Učitan je kurs.json.", "dobro");
    ponudiNacrt(tekst);
  } catch {
    const nacrt = procitajNacrt();
    if (nacrt) {
      kurs = nacrt;
      prljavo = true;
      postaviPoruku("Server nije dostupan. Vraćen je nacrt iz browsera.", "greska");
    } else {
      kurs = prazanKurs();
      postaviPoruku("kurs.json nije učitan. Učitaj fajl.", "greska");
    }
    nacrtaj();
  }
}

pokreni();
