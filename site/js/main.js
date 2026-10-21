import { napraviPogled, postaviPogled } from "./cm-editor.js";
import { dokument, lectures, preduslovCasa } from "./lectures.js";
import { natpisNedelje, pomeriNedelju, polozajiKlizaca, procenat, ucitajKurs } from "./model.js";
import { lekcijePojma, pojmoviIzTeksta, poljaPojma, predlozi } from "./pojmovnik.js";
import { PORUKA, primeniPrikaz } from "./pregled.js";
import { procitajRadne, serverTabVidljiv, tekstPrikaza, upisiRadnu } from "./radna.js";
import { razlikaOriginala } from "./razlika.js";
import { adresaPregleda, izborFajla, prikaziIzlaz, rezimPosleAkcije, upisPosleAkcije } from "./birac.js";
import { prikazKoraka } from "./figura.js";
import { fajloviStrane, prethodnaVerzija, stabloDo } from "./stablo.js";
import { prihvatiOcitavanje } from "./svezina.js";
import { ikonica, ucitajIkonice } from "./ikonice.js";

const nav = document.querySelector("#nav");
const casEl = document.querySelector("#cas");
const biracMesto = document.querySelector("#birac-mesto");
const naslovCasa = document.querySelector("#naslov-casa");
const diskusijaMesto = document.querySelector("#sekcija-diskusija");
const podela = document.querySelector("#podela");
const traka = document.querySelector("#traka");
const q = document.querySelector("#q");
const tooltip = document.querySelector("#tooltip");
const typeahead = document.querySelector("#typeahead");
const displej = document.querySelector("#displej");
const displejMasina = document.querySelector("#displej-masina");
const sobaMasina = document.querySelector("#soba-masina");
const prekidac = document.querySelector("#prekidac");
const sledeci = document.querySelector("#sledeci");
const procitaj = document.querySelector("#procitaj");
const polling = document.querySelector("#polling");
const svezina = document.querySelector("#svezina");
const prag = document.querySelector("#prag");
const stanjeCitanja = document.querySelector("#stanje-citanja");
const istorija = document.querySelector("#istorija");
const fanLocal = document.querySelector("#fan-local");
const bladesLocal = document.querySelector("#blades-local");
const blades = document.querySelector("#blades");
const kabl = document.querySelector("#kabl");
const sesije = document.querySelector("#sesije");
const log = document.querySelector("#log");
const grafikon = document.querySelector("#grafikon");
const kutijaMsg = document.querySelector("#kutija-msg");
const editorDom = document.querySelector("#editor");
const editorErr = document.querySelector("#editor-err");
const putanja = document.querySelector("#putanja");
const dugmeVerzije = document.querySelector("#verzija");
const dugmeReseta = document.querySelector("#reset-radne");
const tree = document.querySelector("#tree");
const tabFront = document.querySelector("#tab-front");
const tabBack = document.querySelector("#tab-back");
const stilPregleda = document.querySelector("#stil-pregleda");
const starost = document.querySelector("#starost");
const temaDugme = document.querySelector("#tema");
const otvoreniPojmovi = new Set();
const otvoreneNedelje = new Set();
const izborKoraka = new Map();
const MESTO_KLJUC = "web-programiranje:korak";
let pojmovi = [];
let aktivnaDefinicija = null;
let typeaheadIndeks = -1;

const soba = { temperatura: 24, zeljeno: false };
const tacke = [
  { temperatura: 22 },
  { temperatura: 24 },
  { temperatura: 26 },
  { temperatura: 23 },
];
let cas = 1;
let deo = "koraci";
let udeoEditora = 72;
const korakPoCasu = new Map();
const fazaPoCasu = new Map();
const rezervaPoCasu = new Map();
const pretpostavkaPoCasu = new Map();
const podvucenoPoCasu = new Map();
const zakljucakPoCasu = new Map();
const objasnjenjePoKoraku = new Map();
const FAZE = ["Izbor", "Poređenje", "Pretpostavke", "Analiza", "Ponovni izbor"];
let pollId = 0;
let cifreSobe = null;
let poslednjiTrenutak = null;
const poslato = { takt: false, uloge: false, baza: false };
let dovod = null;
let lastSpin = "1.2s";
let strana = "client";
let openedForCas = 0;
const openPath = { client: "", server: "" };
let radne = procitajRadne(localStorage);
let rezim = "original";
let prikazaniTekst = "";
let otvoreniKljuc = "";
let pogled = null;
let displejSobe = {
  crtaj(vrednost) {
    displej.textContent = String(vrednost);
  },
  prikaziOcitavanje(odgovor, telo) {
    if (!odgovor.ok) {
      this.crtaj("Err");
      return;
    }
    this.crtaj(telo.temperatura);
  },
};
let displejMasine = {
  crtaj(vrednost) {
    displejMasina.textContent = String(vrednost);
  },
};
function podrazumevanoObradi(niz) {
  const izabrane = niz.filter((tacka) => tacka.temperatura >= 24);
  const visine = izabrane.map((tacka) => tacka.temperatura);
  const zbir = visine.reduce((s, v) => s + v, 0);
  return { visine, prosek: visine.length ? zbir / visine.length : 0 };
}
let obradiNiz = podrazumevanoObradi;
let nacrtajNiz = () => {};
let prekidacSobe = {
  ukljucen: false,
  crtaj(ukljucen) {
    this.ukljucen = ukljucen;
    prekidac.setAttribute("aria-pressed", String(ukljucen));
    prekidac.textContent = ukljucen ? "Isključi" : "Uključi";
  },
};

function saIkonom(el, ime, tekst) {
  el.replaceChildren();
  const znak = ikonica(ime);
  if (znak) el.append(znak);
  if (tekst) el.append(document.createTextNode(tekst));
}

function ikonaOdgovora(otkriveno, izabran, opt) {
  if (otkriveno && opt.ok) return ikonica("check-circle");
  if (!otkriveno && opt.key === izabran) return ikonica("circle-dot");
  return ikonica("circle");
}

function popuniStalneIkonice() {
  for (const slot of document.querySelectorAll("[data-ikona]")) {
    if (slot.querySelector(".ikona")) continue;
    const znak = ikonica(slot.dataset.ikona);
    if (!znak) continue;
    if (slot.classList.contains("ikona-slot")) slot.replaceChildren(znak);
    else slot.prepend(znak);
  }
  saIkonom(document.querySelector("#tab-koraci"), "file-text", "Gradivo");
  saIkonom(document.querySelector("#tab-diskusija"), "messages-square", "Diskusija");
  saIkonom(document.querySelector("#tab-editor"), "code-xml", "Editor");
}

function lecture() {
  return lectures.find((item) => item.n === cas);
}

function indeksKoraka() {
  return korakPoCasu.get(cas) || 0;
}

function trenutniKorak() {
  const item = lecture();
  if (!item || !item.steps.length) return null;
  return item.steps[Math.min(indeksKoraka(), item.steps.length - 1)];
}

function kljucDiskusije() {
  return `${cas}:${rezervaPoCasu.get(cas) ? "rezerva" : "glavna"}`;
}

function procitajMesto() {
  try {
    const raw = JSON.parse(localStorage.getItem(MESTO_KLJUC) || "null");
    if (!raw || !Array.isArray(raw.sacuvani)) return { nedelja: 1, korak: 0, sacuvani: [] };
    return { nedelja: raw.nedelja || 1, korak: raw.korak || 0, sacuvani: raw.sacuvani };
  } catch {
    return { nedelja: 1, korak: 0, sacuvani: [] };
  }
}

function upisiMesto(mesto) {
  localStorage.setItem(MESTO_KLJUC, JSON.stringify(mesto));
}

function sacuvajTrenutniKorak() {
  const mesto = procitajMesto();
  const kljuc = `${cas}:${indeksKoraka()}`;
  if (!mesto.sacuvani.includes(kljuc)) mesto.sacuvani.push(kljuc);
  mesto.nedelja = cas;
  mesto.korak = indeksKoraka();
  upisiMesto(mesto);
  if (location.hash !== `#cas-${cas}`) location.hash = `cas-${cas}`;
  else renderLecture();
}

function nedeljaZavrsena(item, mesto) {
  return item.steps.every((_, i) => mesto.sacuvani.includes(`${item.n}:${i}`));
}

function otvoriNedelju(n, korak) {
  if (n < 1 || n > dokument.trajanjeNedelja) return;
  if (korak !== undefined) korakPoCasu.set(n, korak);
  if (n !== cas) deo = "koraci";
  cas = n;
  if (location.hash !== `#cas-${n}`) location.hash = `cas-${n}`;
  else renderLecture();
}

function paintNav() {
  const mesto = procitajMesto();
  const provera = ucitajKurs(dokument);
  nav.replaceChildren();
  if (!provera.ok) return;
  const glava = document.createElement("div");
  glava.className = "kurs-zaglavlje";
  const kursNaslov = document.createElement("strong");
  kursNaslov.textContent = dokument.naslov;
  const bok = document.createElement("span");
  bok.className = "meta";
  bok.textContent = dokument.ustanovaBok;
  const knjiga = ikonica("book-open");
  const tekstKursa = document.createElement("span");
  tekstKursa.append(kursNaslov, bok);
  if (knjiga) glava.append(knjiga);
  glava.append(tekstKursa);
  nav.append(glava);
  for (const item of lectures) {
    const otvoren = item.n === cas || otvoreneNedelje.has(item.n);
    const dugme = document.createElement("button");
    dugme.type = "button";
    dugme.className = "nedelja-red";
    if (item.n === cas) dugme.setAttribute("aria-current", "page");
    dugme.setAttribute("aria-expanded", String(otvoren));
    const kvaka = ikonica(nedeljaZavrsena(item, mesto) ? "check-circle" : "circle");
    const ime = document.createElement("span");
    ime.textContent = `Nedelja ${item.n} — ${item.title}`;
    const pod = document.createElement("small");
    pod.textContent = item.podnaslov;
    const tekst = document.createElement("span");
    tekst.append(ime, pod);
    const strela = ikonica(otvoren ? "chevron-up" : "chevron-down");
    if (kvaka) dugme.append(kvaka);
    dugme.append(tekst);
    if (strela) dugme.append(strela);
    dugme.addEventListener("click", () => {
      if (item.n === cas) return;
      if (otvoreneNedelje.has(item.n)) otvoreneNedelje.delete(item.n);
      else otvoreneNedelje.add(item.n);
      paintNav();
    });
    nav.append(dugme);
    if (!otvoren) continue;
    const lista = document.createElement("ol");
    lista.className = "nedelja-koraci";
    item.steps.forEach((korak, ki) => {
      const stavka = document.createElement("li");
      const korakDugme = document.createElement("button");
      korakDugme.type = "button";
      korakDugme.className = "korak-red";
      korakDugme.textContent = `${ki + 1} ${korak.naslov}`;
      if (item.n === cas && ki === indeksKoraka()) korakDugme.setAttribute("aria-current", "page");
      korakDugme.addEventListener("click", () => otvoriNedelju(item.n, ki));
      stavka.append(korakDugme);
      lista.append(stavka);
    });
    nav.append(lista);
  }
}

function vecUkucano(item, doIndeksa, putanja) {
  return item.steps
    .slice(0, doIndeksa)
    .filter((korak) => korak.putanja === putanja)
    .map((korak) => korak.delic)
    .join("\n\n");
}

function prikaziDeo() {
  for (const ime of ["koraci", "diskusija", "editor"]) {
    const otvoren = ime === deo;
    document.querySelector(`#sekcija-${ime}`).hidden = !otvoren;
    const tab = document.querySelector(`#tab-${ime}`);
    tab.setAttribute("aria-selected", String(otvoren));
    tab.tabIndex = otvoren ? 0 : -1;
  }
  document.body.classList.toggle("editor-pun", deo === "editor");
}

function usko() {
  return window.matchMedia("(max-width: 860px)").matches;
}

function primeniUdeo() {
  udeoEditora = Math.min(80, Math.max(20, udeoEditora));
  podela.style.setProperty("--editor-udeo", `${udeoEditora}fr`);
  podela.style.setProperty("--pregled-udeo", `${100 - udeoEditora}fr`);
  traka.setAttribute("aria-valuenow", String(udeoEditora));
}

function pomeriUdeo(clientX) {
  const okvir = podela.getBoundingClientRect();
  if (!okvir.width) return;
  udeoEditora = Math.round(((clientX - okvir.left) / okvir.width) * 100);
  primeniUdeo();
}

function fragmentTeksta(tekst) {
  const frag = document.createDocumentFragment();
  const izvor = tekst || "";
  if (!pojmovi.length) {
    frag.append(document.createTextNode(izvor));
    return frag;
  }
  const donji = izvor.toLocaleLowerCase("sr");
  const zauzeto = Array(izvor.length).fill(false);
  const pogodci = [];
  const sortirani = [...pojmovi].sort((a, b) => b.ime.length - a.ime.length);
  for (const pojam of sortirani) {
    const cilj = pojam.ime.toLocaleLowerCase("sr");
    let od = 0;
    while (od <= donji.length - cilj.length) {
      const at = donji.indexOf(cilj, od);
      if (at < 0) break;
      const pre = at === 0 || !/[\p{L}\p{N}_]/u.test(donji[at - 1]);
      const kraj = at + cilj.length;
      const posle = kraj === donji.length || !/[\p{L}\p{N}_]/u.test(donji[kraj]);
      const slobodno = zauzeto.slice(at, kraj).every((z) => !z);
      if (pre && posle && slobodno) {
        for (let s = at; s < kraj; s += 1) zauzeto[s] = true;
        pogodci.push({ at, kraj, pojam });
      }
      od = at + Math.max(cilj.length, 1);
    }
  }
  pogodci.sort((a, b) => a.at - b.at);
  let kursor = 0;
  for (const pogodak of pogodci) {
    if (pogodak.at > kursor) frag.append(document.createTextNode(izvor.slice(kursor, pogodak.at)));
    const dugme = document.createElement("button");
    dugme.type = "button";
    dugme.className = "pojam-crta";
    dugme.textContent = izvor.slice(pogodak.at, pogodak.kraj);
    const otvori = () => prikaziTooltip(dugme, pogodak.pojam);
    dugme.addEventListener("mouseenter", otvori);
    dugme.addEventListener("focus", otvori);
    dugme.addEventListener("click", () => {
      if (tooltip.dataset.ime === pogodak.pojam.ime && !tooltip.hidden) sakrijTooltip();
      else otvori();
    });
    frag.append(dugme);
    kursor = pogodak.kraj;
  }
  if (kursor < izvor.length) frag.append(document.createTextNode(izvor.slice(kursor)));
  return frag;
}

function prikaziTooltip(sidro, pojam) {
  const polja = poljaPojma(pojam);
  tooltip.hidden = false;
  tooltip.dataset.ime = polja.ime;
  tooltip.replaceChildren();
  const ime = document.createElement("strong");
  ime.textContent = polja.ime;
  const def = document.createElement("p");
  def.textContent = polja.definicija;
  tooltip.append(ime, def);
  if (polja.izbegava) {
    const izb = document.createElement("p");
    izb.className = "meta";
    izb.textContent = polja.izbegava;
    tooltip.append(izb);
  }
  const rect = sidro.getBoundingClientRect();
  tooltip.style.left = `${Math.max(8, Math.min(rect.left, window.innerWidth - 360))}px`;
  tooltip.style.top = `${rect.bottom + 6}px`;
}

function sakrijTooltip() {
  tooltip.hidden = true;
  tooltip.dataset.ime = "";
}

function postaviDefiniciju(polja) {
  aktivnaDefinicija = polja;
  const kutija = document.querySelector("#definicija");
  kutija.hidden = !polja;
  kutija.replaceChildren();
  if (!polja) return;
  const ime = document.createElement("strong");
  ime.textContent = polja.ime;
  const def = document.createElement("p");
  def.textContent = polja.definicija;
  kutija.append(ime, def);
  if (polja.izbegava) {
    const izb = document.createElement("p");
    izb.className = "meta";
    izb.textContent = polja.izbegava;
    kutija.append(izb);
  }
}

function odaberiPredlog(stavka) {
  document.querySelector("#typeahead").hidden = true;
  q.setAttribute("aria-expanded", "false");
  deo = "koraci";
  if (stavka.vrsta === "pojam") {
    postaviDefiniciju(poljaPojma(stavka));
    const lekcije = lekcijePojma(dokument, stavka.ime);
    otvoreneNedelje.clear();
    for (const n of lekcije.nedelje) otvoreneNedelje.add(n);
    if (lekcije.prvi) otvoriNedelju(lekcije.prvi.nedelja, lekcije.prvi.korak);
    else renderLecture();
    return;
  }
  otvoriNedelju(stavka.nedelja, stavka.korak);
}

function nacrtajIsecak(korak) {
  const blok = document.createElement("section");
  blok.className = "isecak";
  const glava = document.createElement("header");
  const naslov = document.createElement("span");
  saIkonom(naslov, "folder", korak.isecakNaslov);
  const kopiraj = document.createElement("button");
  kopiraj.type = "button";
  const natpisKopiranja = (tekst) => saIkonom(kopiraj, "copy", tekst);
  natpisKopiranja("Kopiraj");
  kopiraj.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(korak.isecak);
      natpisKopiranja("Kopirano");
    } catch {
      natpisKopiranja("Kopiraj");
    }
  });
  glava.append(naslov, kopiraj);
  const pre = document.createElement("pre");
  for (const [indeks, linija] of korak.isecak.split("\n").entries()) {
    const red = document.createElement("span");
    red.className = "red";
    const brojReda = document.createElement("span");
    brojReda.className = "br";
    brojReda.textContent = String(indeks + 1);
    const telo = document.createElement("span");
    const taraba = linija.indexOf("#");
    if (taraba >= 0) {
      telo.append(document.createTextNode(linija.slice(0, taraba)));
      const komentar = document.createElement("span");
      komentar.className = "komentar";
      komentar.textContent = linija.slice(taraba);
      telo.append(komentar);
    } else telo.textContent = linija;
    red.append(brojReda, telo, document.createTextNode("\n"));
    pre.append(red);
  }
  blok.append(glava, pre);
  return blok;
}

function nacrtajBirac(item, i) {
  const korak = item.steps[i];
  const birac = document.createElement("div");
  birac.className = "birac";
  const red = document.createElement("div");
  red.className = "birac-red";
  const prethodni = document.createElement("button");
  prethodni.type = "button";
  prethodni.className = "birac-nazad";
  prethodni.setAttribute("aria-label", "Prethodni korak");
  const levo = ikonica("chevron-left");
  if (levo) prethodni.append(levo);
  prethodni.disabled = i === 0;
  prethodni.addEventListener("click", () => {
    korakPoCasu.set(cas, i - 1);
    renderLecture();
  });
  const sredina = document.createElement("div");
  const broj = document.createElement("p");
  broj.className = "korak";
  broj.textContent = `Korak ${i + 1} od ${item.steps.length}`;
  const naslovBiraca = document.createElement("p");
  naslovBiraca.className = "birac-naslov";
  naslovBiraca.textContent = korak.naslov;
  sredina.append(broj, naslovBiraca);
  const akcije = document.createElement("div");
  akcije.className = "birac-akcije";
  const sviKoraci = document.createElement("button");
  sviKoraci.type = "button";
  sviKoraci.className = "birac-svi";
  sviKoraci.setAttribute("aria-haspopup", "listbox");
  sviKoraci.setAttribute("aria-expanded", "false");
  sviKoraci.setAttribute("aria-controls", "birac-meni");
  saIkonom(sviKoraci, "menu", "Svi koraci");
  const dole = ikonica("chevron-down");
  if (dole) sviKoraci.append(dole);
  const meni = document.createElement("ul");
  meni.id = "birac-meni";
  meni.className = "birac-meni";
  meni.hidden = true;
  meni.setAttribute("role", "listbox");
  item.steps.forEach((korakNed, ki) => {
    const li = document.createElement("li");
    const dugme = document.createElement("button");
    dugme.type = "button";
    dugme.setAttribute("role", "option");
    dugme.textContent = `${ki + 1} ${korakNed.naslov}`;
    if (ki === i) dugme.setAttribute("aria-selected", "true");
    dugme.addEventListener("click", () => {
      korakPoCasu.set(cas, ki);
      renderLecture();
    });
    li.append(dugme);
    meni.append(li);
  });
  sviKoraci.addEventListener("click", () => {
    meni.hidden = !meni.hidden;
    sviKoraci.setAttribute("aria-expanded", String(!meni.hidden));
    if (!meni.hidden) meni.querySelector("button")?.focus();
  });
  meni.addEventListener("keydown", (dogadjaj) => {
    const stavke = [...meni.querySelectorAll("button")];
    const trenutni = stavke.indexOf(document.activeElement);
    if (dogadjaj.key === "ArrowDown") {
      dogadjaj.preventDefault();
      stavke[Math.min(stavke.length - 1, Math.max(0, trenutni) + 1)]?.focus();
    } else if (dogadjaj.key === "ArrowUp") {
      dogadjaj.preventDefault();
      stavke[Math.max(0, trenutni - 1)]?.focus();
    } else if (dogadjaj.key === "Escape") {
      meni.hidden = true;
      sviKoraci.setAttribute("aria-expanded", "false");
      sviKoraci.focus();
    }
  });
  const daljeKorak = document.createElement("button");
  daljeKorak.type = "button";
  daljeKorak.className = "sledeci-korak";
  daljeKorak.append(document.createTextNode("Sledeći"));
  const desno = ikonica("chevron-right");
  if (desno) daljeKorak.append(desno);
  daljeKorak.disabled = i === item.steps.length - 1;
  daljeKorak.addEventListener("click", () => {
    korakPoCasu.set(cas, i + 1);
    renderLecture();
  });
  akcije.append(sviKoraci, meni, daljeKorak);
  red.append(prethodni, sredina, akcije);
  const trakaPopune = document.createElement("div");
  trakaPopune.className = "birac-traka";
  trakaPopune.setAttribute("role", "progressbar");
  trakaPopune.setAttribute("aria-valuemin", "1");
  trakaPopune.setAttribute("aria-valuemax", String(item.steps.length));
  trakaPopune.setAttribute("aria-valuenow", String(i + 1));
  trakaPopune.setAttribute("aria-label", "Napredak kroz korake");
  const punjenje = document.createElement("span");
  punjenje.style.width = item.steps.length ? `${((i + 1) / item.steps.length) * 100}%` : "0%";
  trakaPopune.append(punjenje);
  birac.append(red, trakaPopune);
  return birac;
}

function renderLecture() {
  const provera = ucitajKurs(dokument);
  const greska = document.querySelector("#greska-kursa");
  if (!provera.ok) {
    greska.hidden = false;
    greska.textContent = provera.greska;
    nav.replaceChildren();
    biracMesto.replaceChildren();
    return;
  }
  greska.hidden = true;
  const item = lecture();
  const i = Math.min(indeksKoraka(), item.steps.length - 1);
  const korak = item.steps[i];
  const otvoreno = objasnjenjePoKoraku.get(`${cas}:${i}`) === true;
  document.title = dokument.naslov;
  document.querySelector("#naslov-kursa").textContent = dokument.naslov;
  document.querySelector("#ustanova").textContent = dokument.ustanova;
  document.querySelector("#ustanova-red").textContent = dokument.ustanovaRed;
  document.querySelector("#grb").src = dokument.grb;
  document.querySelector("#oznaka").textContent = dokument.oznaka;
  document.querySelector("#natpis-nedelje").textContent = natpisNedelje(dokument, cas);
  const klizac = document.querySelector("#klizac");
  klizac.replaceChildren();
  for (const polozaj of polozajiKlizaca(dokument, cas)) {
    const dugme = document.createElement("button");
    dugme.type = "button";
    if (polozaj.tekuci) dugme.className = "tekuci";
    dugme.textContent = polozaj.broj;
    dugme.setAttribute("aria-label", `Nedelja ${polozaj.n}`);
    if (polozaj.tekuci) dugme.setAttribute("aria-current", "true");
    dugme.addEventListener("click", () => otvoriNedelju(polozaj.n));
    klizac.append(dugme);
  }
  popuniStalneIkonice();
  saIkonom(document.querySelector("#kartica-natpis"), "calendar-days", natpisNedelje(dokument, cas));
  const udeo = procenat(cas, dokument.trajanjeNedelja);
  document.querySelector("#kartica-procenat").textContent = `${udeo}%`;
  document.querySelector("#kartica-popuna").style.width = `${udeo}%`;
  saIkonom(document.querySelector("#kartica-koraci"), "book-open", `${item.steps.length} koraka u ovoj nedelji`);
  saIkonom(document.querySelector("#kartica-minuta"), "clock", `Proc. vreme: ~${item.minuta} min`);
  document.querySelector("#mrvice").textContent = `${dokument.naslov} › Nedelja ${item.n} › Korak ${i + 1}`;
  naslovCasa.textContent = `Nedelja ${item.n} — ${item.title}`;
  document.querySelector("#podnaslov-casa").textContent = item.outcome;
  saIkonom(document.querySelector("#preduslov"), "graduation-cap", `Preduslov: ${preduslovCasa(item.n)}`);
  postaviDefiniciju(aktivnaDefinicija);
  casEl.replaceChildren();
  const birac = nacrtajBirac(item, i);
  const metaKoraka = document.createElement("div");
  metaKoraka.className = "meta-koraka";
  const nivo = document.createElement("span");
  nivo.className = "meta";
  if (korak.nivo) {
    const stub = ikonica("chart-column");
    if (stub) nivo.append(stub);
    nivo.append(document.createTextNode(korak.nivo));
  }
  const minuta = document.createElement("span");
  minuta.className = "meta";
  const sat = ikonica("clock");
  if (sat) minuta.append(sat);
  minuta.append(document.createTextNode(`~ ${korak.minuta} min`));
  const sacuvajKorak = document.createElement("button");
  sacuvajKorak.type = "button";
  saIkonom(sacuvajKorak, "bookmark", "Sačuvaj korak");
  sacuvajKorak.addEventListener("click", sacuvajTrenutniKorak);
  metaKoraka.append(nivo, minuta, sacuvajKorak);
  const naslovKoraka = document.createElement("h2");
  naslovKoraka.append(fragmentTeksta(korak.naslov));
  const primer = document.createElement("p");
  primer.append(fragmentTeksta(korak.tekst));
  const kljucna = document.createElement("aside");
  kljucna.className = "kljucna";
  const kljucnaNaslov = document.createElement("strong");
  saIkonom(kljucnaNaslov, "lightbulb", "Ključna ideja");
  const kljucnaTekst = document.createElement("p");
  kljucnaTekst.append(fragmentTeksta(korak.kljucnaIdeja));
  kljucna.append(kljucnaNaslov, kljucnaTekst);
  const prikaz = prikazKoraka(korak);
  const figura = prikaz.svg ? document.createElement("div") : null;
  if (figura) {
    figura.className = "figura";
    figura.innerHTML = prikaz.svg;
  }
  const imaIsecak = !figura && korak.isecak != null;
  const isecak = imaIsecak ? nacrtajIsecak(korak) : null;
  const put = imaIsecak ? document.createElement("p") : null;
  const vec = imaIsecak ? document.createElement("pre") : null;
  if (put) {
    put.className = "meta";
    const putanjaKoraka = document.createElement("span");
    putanjaKoraka.id = "putanja-koraka";
    putanjaKoraka.textContent = prikaz.putanja;
    const fajl = ikonica("file-text");
    if (fajl) put.append(fajl);
    put.append(document.createTextNode("Fajl: "), putanjaKoraka);
    vec.className = "vec";
    const ranije = vecUkucano(item, i, prikaz.putanja);
    vec.hidden = !ranije;
    vec.textContent = ranije ? `Već u fajlu:\n${ranije}` : "";
  }
  const pitanjeBlok = document.createElement("section");
  pitanjeBlok.className = "pitanje-blok";
  const pitanjeNad = document.createElement("p");
  pitanjeNad.className = "meta";
  saIkonom(pitanjeNad, "question", "Pitanje");
  const pitanje = document.createElement("h3");
  pitanje.append(fragmentTeksta(korak.pitalica));
  const uputa = document.createElement("p");
  uputa.className = "meta";
  uputa.textContent = "Izaberi tačan odgovor.";
  const kratke = document.createElement("div");
  kratke.className = "opcije-mreza";
  kratke.dataset.kviz = "korak";
  const izabran = izborKoraka.get(`${cas}:${i}`) || "";
  for (const opt of korak.opcije) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option";
    button.dataset.key = opt.key;
    const znakOdgovora = ikonaOdgovora(otvoreno, izabran, opt);
    if (znakOdgovora) button.append(znakOdgovora);
    button.append(document.createTextNode(`${opt.key}. ${opt.text}`));
    if (opt.key === izabran) button.classList.add("izabrano");
    if (otvoreno && opt.ok) button.classList.add("holds");
    if (otvoreno) {
      const why = document.createElement("p");
      why.className = "why";
      why.textContent = opt.why;
      button.append(why);
    }
    button.addEventListener("click", () => {
      izborKoraka.set(`${cas}:${i}`, opt.key);
      renderLecture();
    });
    kratke.append(button);
  }
  pitanjeBlok.append(pitanjeNad, pitanje, uputa, kratke);
  const radnjePitanja = document.createElement("div");
  radnjePitanja.className = "radnje-pitanja";
  const otvori = document.createElement("button");
  otvori.type = "button";
  otvori.className = otvoreno ? "obrazlozenje otvoreno" : "obrazlozenje";
  saIkonom(otvori, otvoreno ? "check-circle" : "info", otvoreno ? "Obrazloženje je otvoreno" : "Obrazloženje");
  otvori.addEventListener("click", () => {
    objasnjenjePoKoraku.set(`${cas}:${i}`, true);
    renderLecture();
  });
  const izlazPodaci = prikaziIzlaz(i, item.steps.length, item.izlaz);
  const izlaz = izlazPodaci ? document.createElement("p") : null;
  if (izlaz) {
    izlaz.className = "log izlaz";
    izlaz.textContent = izlazPodaci.tekst;
  }
  const ponovi = document.createElement("button");
  ponovi.type = "button";
  ponovi.id = "ponovi-pitanje";
  ponovi.className = "ponovi-pitanje";
  saIkonom(ponovi, "refresh-cw", "Ponovi pitanje");
  ponovi.addEventListener("click", () => {
    objasnjenjePoKoraku.delete(`${cas}:${i}`);
    izborKoraka.delete(`${cas}:${i}`);
    fazaPoCasu.set(kljucDiskusije(), 0);
    podvucenoPoCasu.delete(kljucDiskusije());
    renderLecture();
  });
  radnjePitanja.append(otvori, ponovi);
  biracMesto.replaceChildren(birac);
  casEl.append(metaKoraka, naslovKoraka, primer, kljucna);
  if (figura) casEl.append(figura);
  else if (isecak) casEl.append(isecak, put, vec);
  casEl.append(pitanjeBlok, radnjePitanja);
  if (izlaz) casEl.append(izlaz);
  diskusijaMesto.replaceChildren(nacrtajDiskusiju(item));
  prikaziDeo();
  paintNav();
  fitPanel();
  document.querySelector("#prethodna-nedelja").disabled = cas <= 1;
  document.querySelector("#sledeca-nedelja").disabled = cas >= dokument.trajanjeNedelja;
}


function nacrtajDiskusiju(item) {
  const rezerva = rezervaPoCasu.get(cas) === true && item.rezerva;
  const izvor = rezerva ? item.rezerva : { problem: item.problem, options: item.options };
  const faza = fazaPoCasu.get(kljucDiskusije()) || 0;
  const blok = document.createElement("section");
  blok.className = "diskusija";
  blok.setAttribute("aria-label", "Duga pitalica");
  const naslov = document.createElement("h2");
  naslov.textContent = rezerva ? "Rezerva" : "Diskusija";
  const fazaEl = document.createElement("p");
  fazaEl.className = "log";
  fazaEl.textContent = `Faza: ${FAZE[faza]}`;
  const problem = document.createElement("p");
  problem.textContent = izvor.problem;
  const options = document.createElement("div");
  options.className = "options";
  options.dataset.kviz = "diskusija";
  const podvuceno = podvucenoPoCasu.get(kljucDiskusije()) || "";
  for (const opt of izvor.options) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option";
    button.dataset.key = opt.key;
    const znakOdgovora = ikonaOdgovora(faza >= 3, podvuceno, opt);
    if (znakOdgovora) button.append(znakOdgovora);
    button.append(document.createTextNode(`${opt.key}. ${opt.text}`));
    if (opt.key === podvuceno) button.classList.add("podvuceno");
    if (faza >= 3) {
      button.classList.toggle("holds", opt.ok);
      const why = document.createElement("p");
      why.className = "why";
      why.textContent = opt.why;
      button.append(why);
    }
    button.addEventListener("click", () => {
      if (faza === 0 || faza === 4) {
        podvucenoPoCasu.set(kljucDiskusije(), opt.key);
        renderLecture();
      }
    });
    options.append(button);
  }
  const tisina = document.createElement("p");
  tisina.className = "log";
  tisina.hidden = faza !== 1;
  tisina.textContent = "Sajt ćuti o tome šta drži. Parovi porede razloge uživo.";
  const tabla = document.createElement("textarea");
  tabla.className = "pretpostavke";
  tabla.rows = 3;
  tabla.hidden = faza < 2;
  tabla.placeholder = "Pretpostavke koje su se čule";
  tabla.value = pretpostavkaPoCasu.get(kljucDiskusije()) || "";
  tabla.setAttribute("aria-label", "Pretpostavke");
  tabla.addEventListener("input", () => {
    pretpostavkaPoCasu.set(kljucDiskusije(), tabla.value);
  });
  const zakljucak = document.createElement("textarea");
  zakljucak.rows = 2;
  zakljucak.hidden = faza < 4;
  zakljucak.placeholder = "Jedna zajednička rečenica";
  zakljucak.value = zakljucakPoCasu.get(kljucDiskusije()) || "";
  zakljucak.setAttribute("aria-label", "Zaključak");
  zakljucak.addEventListener("input", () => {
    zakljucakPoCasu.set(kljucDiskusije(), zakljucak.value);
  });
  const radnje = document.createElement("div");
  radnje.className = "row";
  const dalje = document.createElement("button");
  dalje.type = "button";
  dalje.textContent = "Dalje";
  dalje.disabled = faza >= FAZE.length - 1;
  dalje.addEventListener("click", () => {
    fazaPoCasu.set(kljucDiskusije(), Math.min(faza + 1, FAZE.length - 1));
    renderLecture();
  });
  radnje.append(dalje);
  if (!rezerva && item.rezerva && faza === 4) {
    const otvoriRezervu = document.createElement("button");
    otvoriRezervu.type = "button";
    otvoriRezervu.id = "otvori-rezervu";
    otvoriRezervu.textContent = "Otvori rezervu";
    otvoriRezervu.addEventListener("click", () => {
      rezervaPoCasu.set(cas, true);
      renderLecture();
    });
    radnje.append(otvoriRezervu);
  }
  blok.append(naslov, fazaEl, problem, options, tisina, tabla, zakljucak, radnje);
  return blok;
}

function fitPanel() {
  const local = cas < 5;
  sobaMasina.hidden = local;
  sledeci.hidden = cas < 2 || cas > 4;
  procitaj.hidden = cas < 5;
  polling.hidden = cas < 9;
  svezina.hidden = cas < 9;
  prag.hidden = cas < 9;
  stanjeCitanja.hidden = cas < 6;
  istorija.hidden = cas < 8;
  kabl.hidden = cas < 6;
  sesije.hidden = cas < 10;
  fanLocal.hidden = true;
  bladesLocal.classList.remove("spin");
  starost.hidden = cas < 9;
  focusFile();
  loadSide();
  log.hidden = cas !== 3;
  grafikon.hidden = cas !== 4;
  if (cas < 9) zaustaviPeriodicno();
  if (cas === 3 || cas === 4) osveziNiz();
  if (cas === 1) displejSobe.crtaj("");
  else if (cas < 4) displejSobe.crtaj("24");
  else if (cas >= 5) displejSobe.crtaj(cifreSobe === null ? "----" : cifreSobe);
  if (pogled) applyLive();
  if (cas >= 5 && !dovod) connectDovod();
  uskladiKutiju();
}

function zaustaviPeriodicno() {
  clearInterval(pollId);
  pollId = 0;
  polling.setAttribute("aria-pressed", "false");
}

function zapamtiCifreSobe() {
  if (cas >= 5) cifreSobe = displej.textContent;
}

function uskladiZastavicu(ime, put, ukljucen) {
  if (poslato[ime] === ukljucen) return Promise.resolve();
  poslato[ime] = ukljucen;
  return fetch(put, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ukljucen }),
  });
}

function uskladiKutiju() {
  return Promise.all([
    uskladiZastavicu("takt", "/api/takt", cas >= 6),
    uskladiZastavicu("uloge", "/api/uloge", cas >= 10),
    uskladiZastavicu("baza", "/api/baza", cas >= 8),
  ]).then(() => {
    if (cas >= 8) return osveziIstoriju();
    return undefined;
  });
}

function nacrtajIstoriju(komande) {
  istorija.replaceChildren();
  for (const komanda of komande || []) {
    const stavka = document.createElement("li");
    stavka.textContent = komanda;
    istorija.append(stavka);
  }
}

async function osveziIstoriju() {
  if (cas < 8) return;
  const response = await fetch("/api/soba");
  const data = await response.json().catch(() => null);
  if (!data || !data.istorija) return;
  nacrtajIstoriju(data.istorija);
}

function kursKoraci() {
  return lectures.flatMap((item) => item.steps);
}

function indeksUKursu() {
  let n = 0;
  for (const item of lectures) {
    if (item.n === cas) return n + indeksKoraka();
    n += item.steps.length;
  }
  return n;
}

function focusFile() {
  const korak = trenutniKorak();
  const putanjaKoraka = izborFajla(korak);
  if (!putanjaKoraka) {
    const kljuc = `${cas}:${indeksKoraka()}:prazno`;
    if (openedForCas === kljuc) return;
    openedForCas = kljuc;
    openPath.client = "";
    openPath.server = "";
    return;
  }
  const side = putanjaKoraka.slice(0, putanjaKoraka.indexOf("/"));
  const put = putanjaKoraka.slice(putanjaKoraka.indexOf("/") + 1);
  if (!serverTabVidljiv(cas) && side === "server") return;
  const kljuc = `${cas}:${indeksKoraka()}:${side}:${put}`;
  if (openedForCas === kljuc) return;
  openedForCas = kljuc;
  strana = side;
  openPath[side] = put;
  rezim = "radna";
  otvoreniKljuc = "";
}

function paintTree(paths) {
  const root = { dirs: new Map(), files: [] };
  for (const put of paths) {
    const parts = put.split("/");
    let node = root;
    for (let i = 0; i < parts.length - 1; i += 1) {
      if (!node.dirs.has(parts[i])) node.dirs.set(parts[i], { dirs: new Map(), files: [] });
      node = node.dirs.get(parts[i]);
    }
    node.files.push({ name: parts[parts.length - 1], put });
  }
  tree.replaceChildren(renderNode(root));
}

function renderNode(node) {
  const ul = document.createElement("ul");
  for (const [name, child] of node.dirs) {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.className = "dir";
    const fascikla = ikonica("folder");
    if (fascikla) span.append(fascikla);
    span.append(document.createTextNode(`${name}/`));
    li.append(span, renderNode(child));
    ul.append(li);
  }
  for (const file of node.files) {
    const li = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    const list = ikonica("file-text");
    if (list) button.append(list);
    button.append(document.createTextNode(file.name));
    button.dataset.put = file.put;
    button.setAttribute("aria-current", file.put === openPath[strana] ? "true" : "false");
    button.addEventListener("click", () => {
      rezim = "radna";
      otvoreniKljuc = "";
      openFile(file.put);
    });
    li.append(button);
    ul.append(li);
  }
  return ul;
}

function markOpen(put) {
  for (const button of tree.querySelectorAll("button")) {
    button.setAttribute("aria-current", button.dataset.put === put ? "true" : "false");
  }
}

function osveziServerTab() {
  const vidi = serverTabVidljiv(cas);
  tabBack.hidden = !vidi;
  if (!vidi && strana === "server") {
    strana = "client";
    openedForCas = 0;
  }
}

function izvorZaPutanju(puna) {
  const koraci = kursKoraci();
  const indeks = indeksUKursu();
  const stablo = stabloDo(koraci, indeks);
  return {
    original: stablo.verzije[puna] || "",
    prethodni: prethodnaVerzija(koraci, indeks, puna),
  };
}

function ikonaVerzije(vrsta) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "ikona");
  svg.setAttribute("viewBox", "0 0 16 16");
  svg.setAttribute("aria-hidden", "true");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("fill", "currentColor");
  path.setAttribute(
    "d",
    vrsta === "olovka" ? "M11.2 1.4l3.4 3.4L6 13.4H2.6V10L11.2 1.4z" : "M3 1h7l4 4v10H3V1zm7 1.2V5h2.8L10 2.2z",
  );
  svg.append(path);
  return svg;
}

function osveziDugmeVerzije(binarni) {
  const radnaNaEkranu = rezim === "radna";
  const natpis = binarni
    ? "Binarni fajl se ne uređuje kao tekst."
    : radnaNaEkranu
      ? "Prikaži ugrađenu verziju"
      : "Prikaži radnu verziju";
  dugmeVerzije.replaceChildren(ikonaVerzije(radnaNaEkranu ? "olovka" : "list"));
  document.querySelector("#moj-kod").setAttribute("aria-pressed", String(radnaNaEkranu));
  document.querySelector("#lekcija").setAttribute("aria-pressed", String(!radnaNaEkranu));
  dugmeVerzije.disabled = Boolean(binarni);
  dugmeVerzije.setAttribute("aria-label", natpis);
  dugmeVerzije.title = natpis;
  dugmeReseta.disabled = Boolean(binarni);
}

function onPromena(tekst) {
  const puna = `${strana}/${openPath[strana]}`;
  const rezultat = upisiRadnu(localStorage, radne, puna, tekst);
  radne = rezultat.mapa;
  rezim = "radna";
  prikazaniTekst = tekst;
  osveziDugmeVerzije();
  if (!rezultat.sacuvano) editorErr.textContent = "Pregledač nije sačuvao radnu verziju.";
  applyLive();
  if (!rezultat.sacuvano) editorErr.textContent = "Pregledač nije sačuvao radnu verziju.";
}

function osveziEditor() {
  const puna = `${strana}/${openPath[strana]}`;
  const { original, prethodni } = izvorZaPutanju(puna);
  const izbor = tekstPrikaza({
    putanja: puna,
    original,
    radne,
    rezim,
    binarni: false,
  });
  const linije = izbor.razlika ? razlikaOriginala(prethodni, original, radne[puna]) : null;
  prikazaniTekst = izbor.tekst;
  if (!pogled) pogled = napraviPogled(editorDom);
  postaviPogled(pogled, {
    tekst: izbor.tekst,
    samoCitaj: izbor.samoCitaj,
    linije,
    put: puna,
    onPromena,
  });
  osveziDugmeVerzije(false);
  osveziAdresu();
  applyLive();
}

function osveziAdresu() {
  const el = document.querySelector("#pregled-adresa");
  const put = openPath[strana];
  if (!el || !put) return;
  el.textContent = adresaPregleda(location.origin, `${strana}/${put}`);
}

function postaviRezim(sledeci) {
  rezim = sledeci;
  otvoreniKljuc = "";
  osveziEditor();
}

function ucitajLekciju() {
  postaviRezim(rezimPosleAkcije("ucitaj", rezim));
}

function sacuvajRadnu() {
  if (!upisPosleAkcije("sacuvaj", rezim)) return;
  const puna = `${strana}/${openPath[strana]}`;
  const rezultat = upisiRadnu(localStorage, radne, puna, prikazaniTekst);
  radne = rezultat.mapa;
  if (!rezultat.sacuvano) editorErr.textContent = "Pregledač nije sačuvao radnu verziju.";
}

function resetujRadnu() {
  const puna = `${strana}/${openPath[strana]}`;
  const { original } = izvorZaPutanju(puna);
  const rezultat = upisiRadnu(localStorage, radne, puna, original);
  radne = rezultat.mapa;
  rezim = rezimPosleAkcije("reset", rezim);
  otvoreniKljuc = "";
  osveziEditor();
}

function osveziPregled() {
  applyLive();
}

function loadSide() {
  osveziServerTab();
  const side = strana;
  tabFront.setAttribute("aria-selected", String(side === "client"));
  tabBack.setAttribute("aria-selected", String(side === "server"));
  const stablo = stabloDo(kursKoraci(), indeksUKursu());
  const fajlovi = fajloviStrane(stablo, side);
  if (!fajlovi.length) {
    paintTree([]);
    putanja.textContent = "";
    otvoreniKljuc = "";
    if (pogled) postaviPogled(pogled, { tekst: "", samoCitaj: true, linije: [], put: "", onPromena() {} });
    const adresa = document.querySelector("#pregled-adresa");
    if (adresa) adresa.textContent = "";
    return;
  }
  if (!fajlovi.includes(openPath[side])) {
    const korak = trenutniKorak();
    const puna = korak ? korak.putanja : "";
    const relativna = puna.startsWith(`${side}/`) ? puna.slice(side.length + 1) : "";
    openPath[side] = fajlovi.includes(relativna) ? relativna : fajlovi[0];
  }
  paintTree(fajlovi);
  const kljuc = `${side}:${openPath[side]}:${rezim}:${indeksUKursu()}`;
  if (otvoreniKljuc === kljuc && pogled) {
    markOpen(openPath[side]);
    osveziAdresu();
    osveziDugmeVerzije(false);
    applyLive();
    return;
  }
  openFile(openPath[side]);
}

function openFile(put) {
  const side = strana;
  openPath[side] = put;
  putanja.textContent = `${side}/${put}`;
  markOpen(put);
  otvoreniKljuc = `${side}:${put}:${rezim}:${indeksUKursu()}`;
  osveziEditor();
}

function applyCss(source) {
  stilPregleda.textContent = source;
  const match = source.match(/animation-duration:\s*([0-9.]+)s/);
  if (match) {
    lastSpin = `${match[1]}s`;
    bladesLocal.style.animationDuration = lastSpin;
    blades.style.animationDuration = lastSpin;
  }
  editorErr.textContent = "";
  return true;
}

function applyKorak(source, quiet) {
  try {
    const fn = new Function(`${source}\nreturn { korak, delta };`);
    const api = fn();
    if (typeof api.korak !== "function" || typeof api.delta !== "number") {
      throw new Error("Fajl treba funkciju korak i broj delta.");
    }
    window.__korak = api.korak;
    if (!quiet) editorErr.textContent = "";
    return true;
  } catch (err) {
    if (!quiet) editorErr.textContent = PORUKA;
    return false;
  }
}

function applyDisplej(source, quiet) {
  try {
    const Displej = new Function(`${source}\nreturn Displej;`)();
    const sobaInstanca = new Displej(displej);
    const masinaInstanca = new Displej(displejMasina);
    if (typeof sobaInstanca.crtaj !== "function" || typeof sobaInstanca.prikaziOcitavanje !== "function") {
      throw new Error("Klasa Displej treba crtaj i prikaziOcitavanje.");
    }
    displejSobe = sobaInstanca;
    displejMasine = masinaInstanca;
    if (!quiet) editorErr.textContent = "";
    return true;
  } catch (err) {
    if (!quiet) editorErr.textContent = PORUKA;
    return false;
  }
}

function applyPrekidac(source, quiet) {
  try {
    const Prekidac = new Function(`${source}\nreturn Prekidac;`)();
    const instanca = new Prekidac(prekidac);
    if (typeof instanca.crtaj !== "function") throw new Error("Klasa Prekidac treba crtaj.");
    prekidacSobe = instanca;
    if (!quiet) editorErr.textContent = "";
    return true;
  } catch (err) {
    if (!quiet) editorErr.textContent = PORUKA;
    return false;
  }
}

function applyNiz(source, quiet) {
  try {
    const api = new Function(`${source}\nreturn { pripremiLiniju, nacrtajLiniju };`)();
    if (typeof api.pripremiLiniju !== "function" || typeof api.nacrtajLiniju !== "function") {
      throw new Error("Fajl treba funkcije pripremiLiniju i nacrtajLiniju.");
    }
    const probe = api.pripremiLiniju([{ temperatura: 24 }, { temperatura: 22 }]);
    if (!probe || !Array.isArray(probe.visine) || typeof probe.prosek !== "number") {
      throw new Error("pripremiLiniju vraća visine i prosek.");
    }
    obradiNiz = api.pripremiLiniju;
    nacrtajNiz = api.nacrtajLiniju;
    if (!quiet) editorErr.textContent = "";
    osveziNiz();
    return true;
  } catch (err) {
    if (!quiet) editorErr.textContent = PORUKA;
    return false;
  }
}

function osveziNiz() {
  let slika;
  try {
    slika = obradiNiz(tacke);
    if (!slika || !Array.isArray(slika.visine) || typeof slika.prosek !== "number") {
      throw new Error("pripremiLiniju vraća visine i prosek.");
    }
  } catch (err) {
    if (strana === "client" && openPath.client === "js/niz.js") editorErr.textContent = PORUKA;
    return;
  }
  if (cas === 3) {
    log.hidden = false;
    const prosek = Math.round(slika.prosek * 10) / 10;
    log.textContent = `konzola: temperatura ${soba.temperatura} | visine ${slika.visine.join(", ")} | prosek ${prosek}`;
  }
  if (cas === 4) {
    try {
      nacrtajNiz(grafikon, slika.visine);
    } catch (err) {
      if (strana === "client" && openPath.client === "js/niz.js") editorErr.textContent = PORUKA;
    }
  }
}

function crtezSobe() {
  return {
    cifra: displej.textContent,
    naslov: document.querySelector("#soba-prekidaca h2").textContent,
    dugme: prekidac.textContent,
  };
}

function naslikajSobu(crtez) {
  if (crtez.cifra !== undefined) displej.textContent = crtez.cifra;
  if (crtez.naslov !== undefined) document.querySelector("#soba-prekidaca h2").textContent = crtez.naslov;
  if (crtez.dugme !== undefined) prekidac.textContent = crtez.dugme;
}

function applyLive() {
  const put = openPath[strana];
  const tekst = prikazaniTekst;
  const stanje = { crtez: crtezSobe(), stil: stilPregleda.textContent, trajanje: lastSpin };
  const izlaz = primeniPrikaz(stanje, { strana, put, tekst });
  if (!izlaz.crtao) {
    editorErr.textContent = izlaz.poruka;
    return !izlaz.poruka;
  }
  if (`${strana}/${put}` === "client/index.html" || put === "client/index.html") {
    naslikajSobu(izlaz.crtez);
    editorErr.textContent = "";
    return true;
  }
  if (strana === "client" && put === "css/soba.css") return applyCss(tekst);
  if (strana === "client" && put === "js/korak.js") {
    if (!/\bfunction\s+korak\b/.test(tekst)) {
      editorErr.textContent = "";
      return true;
    }
    return applyKorak(tekst);
  }
  if (strana === "client" && put === "js/niz.js") {
    if (!/\bfunction\s+pripremiLiniju\b/.test(tekst) || !/\bfunction\s+nacrtajLiniju\b/.test(tekst)) {
      editorErr.textContent = "";
      return true;
    }
    return applyNiz(tekst);
  }
  if (strana === "client" && put === "js/displej.js") {
    if (!/\bclass\s+Displej\b/.test(tekst)) {
      editorErr.textContent = "";
      return true;
    }
    return applyDisplej(tekst);
  }
  if (strana === "client" && put === "js/prekidac.js") {
    if (!/\bclass\s+Prekidac\b/.test(tekst)) {
      editorErr.textContent = "";
      return true;
    }
    return applyPrekidac(tekst);
  }
  editorErr.textContent = "";
  return true;
}

async function prime(put, apply) {
  const response = await fetch(`/api/fajl?strana=client&put=${encodeURIComponent(put)}`);
  const data = await response.json();
  if (data.izvor) apply(data.izvor);
}

function connectDovod() {
  dovod = new EventSource("/dovod");
  dovod.onmessage = (event) => {
    const data = JSON.parse(event.data);
    displejMasine.crtaj(data.temperatura);
    blades.classList.toggle("spin", data.ukljucen && data.prikljucen);
    kabl.textContent = data.prikljucen ? "Kabl je u kutiji" : "Kabl je izvučen";
  };
}

async function readRoom() {
  const path = cas >= 9 ? "/api/soba?svezina=1" : "/api/soba";
  const provera = svezina.getAttribute("aria-pressed") === "true";
  if (cas >= 6) stanjeCitanja.textContent = "čekanje";
  try {
    const response = await fetch(path);
    const data = response.ok ? await response.json() : null;
    if (response.ok && !prihvatiOcitavanje(provera, poslednjiTrenutak, data && data.trenutak)) {
      if (cas >= 6) stanjeCitanja.textContent = "podatak";
      return;
    }
    if (!response.ok) {
      if (cas === 5) displejSobe.crtaj("----");
      if (cas >= 6) {
        displejSobe.prikaziOcitavanje(response, data);
        stanjeCitanja.textContent = "greška";
      }
      starost.textContent = "";
      kutijaMsg.textContent = `HTTP ${response.status}`;
      zapamtiCifreSobe();
      return;
    }
    if (data.trenutak) poslednjiTrenutak = data.trenutak;
    displejSobe.prikaziOcitavanje(response, data);
    prekidacSobe.crtaj(data.ukljucen);
    if (data.trenutak) starost.textContent = data.trenutak;
    if (cas >= 6) stanjeCitanja.textContent = "podatak";
    if (cas >= 8) nacrtajIstoriju(data.istorija);
    kutijaMsg.textContent = "HTTP 200";
    zapamtiCifreSobe();
  } catch {
    if (cas === 5) displejSobe.crtaj("----");
    if (cas >= 6) {
      displejSobe.prikaziOcitavanje({ ok: false }, null);
      stanjeCitanja.textContent = "greška";
    }
    kutijaMsg.textContent = "nema statusa";
    zapamtiCifreSobe();
  }
}

async function sendCommand(ukljucen) {
  const prethodno = prekidacSobe.ukljucen;
  prekidacSobe.crtaj(ukljucen);
  try {
    const response = await fetch("/api/ventilator", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ukljucen }),
    });
    kutijaMsg.textContent = `HTTP ${response.status}`;
    if (response.ok) {
      const data = await response.json();
      prekidacSobe.crtaj(data.ukljucen);
      if (cas >= 8) await osveziIstoriju();
      return;
    }
    if (response.status !== 500) prekidacSobe.crtaj(prethodno);
  } catch {
    kutijaMsg.textContent = "nema statusa";
  }
}

prekidac.addEventListener("click", () => {
  if (cas < 3) return;
  if (cas < 5) {
    soba.zeljeno = !soba.zeljeno;
    prekidacSobe.crtaj(soba.zeljeno);
    return;
  }
  sendCommand(!prekidacSobe.ukljucen);
});

sledeci.addEventListener("click", () => {
  if (typeof window.__korak === "function") window.__korak(soba);
  else soba.temperatura += 1;
  if (cas === 3 || cas === 4) {
    tacke.push({ temperatura: soba.temperatura });
    if (tacke.length > 40) tacke.shift();
  }
  if (cas === 3) {
    osveziNiz();
    return;
  }
  if (cas === 4) {
    osveziNiz();
    if (trenutniKorak() && trenutniKorak().crta === false) return;
    displejSobe.crtaj(soba.temperatura);
  }
});

procitaj.addEventListener("click", readRoom);
svezina.addEventListener("click", () => {
  const on = svezina.getAttribute("aria-pressed") !== "true";
  svezina.setAttribute("aria-pressed", String(on));
});

polling.addEventListener("click", () => {
  const on = polling.getAttribute("aria-pressed") !== "true";
  polling.setAttribute("aria-pressed", String(on));
  clearInterval(pollId);
  if (on) {
    readRoom();
    pollId = setInterval(readRoom, 4000);
  }
});

kabl.addEventListener("click", async () => {
  const prikljucen = kabl.textContent.includes("izvučen");
  await fetch("/api/prikljucen", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ prikljucen }),
  });
});

async function chooseSession(koja) {
  const response = await fetch("/api/sesija", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ koja }),
  });
  kutijaMsg.textContent = response.ok || response.status === 204 ? `sesija: ${koja}` : `HTTP ${response.status}`;
}

document.querySelector("#ses-pos").addEventListener("click", () => chooseSession("posmatrac"));
document.querySelector("#ses-ope").addEventListener("click", () => chooseSession("operater"));
document.querySelector("#ses-ne").addEventListener("click", () => chooseSession(""));

tabFront.addEventListener("click", () => {
  if (strana === "client") return;
  strana = "client";
  rezim = "radna";
  otvoreniKljuc = "";
  loadSide();
});
tabBack.addEventListener("click", () => {
  if (strana === "server") return;
  strana = "server";
  rezim = "radna";
  otvoreniKljuc = "";
  loadSide();
});

dugmeVerzije.addEventListener("click", () => {
  postaviRezim(rezim === "radna" ? rezimPosleAkcije("lekcija", rezim) : rezimPosleAkcije("moj-kod", rezim));
});

dugmeReseta.addEventListener("click", resetujRadnu);
document.querySelector("#resetuj").addEventListener("click", resetujRadnu);
document.querySelector("#ucitaj").addEventListener("click", ucitajLekciju);
document.querySelector("#sacuvaj-radnu").addEventListener("click", sacuvajRadnu);
document.querySelector("#moj-kod").addEventListener("click", () => postaviRezim(rezimPosleAkcije("moj-kod", rezim)));
document.querySelector("#lekcija").addEventListener("click", () => postaviRezim(rezimPosleAkcije("lekcija", rezim)));
document.querySelector("#pregled-osvezi").addEventListener("click", osveziPregled);

function osveziTypeahead() {
  const stavke = predlozi(dokument, pojmovi, q.value);
  typeahead.replaceChildren();
  typeahead.hidden = stavke.length === 0;
  q.setAttribute("aria-expanded", String(stavke.length > 0));
  typeaheadIndeks = stavke.length ? 0 : -1;
  stavke.forEach((stavka, indeks) => {
    const li = document.createElement("li");
    const dugme = document.createElement("button");
    dugme.type = "button";
    dugme.setAttribute("role", "option");
    dugme.setAttribute("aria-selected", String(indeks === typeaheadIndeks));
    if (stavka.vrsta === "pojam") {
      const ime = document.createElement("strong");
      ime.textContent = stavka.ime;
      const def = document.createElement("small");
      def.textContent = stavka.definicija;
      dugme.append(ime, def);
      if (stavka.izbegava) {
        const izb = document.createElement("small");
        izb.textContent = stavka.izbegava;
        dugme.append(izb);
      }
    } else {
      dugme.textContent = stavka.vrsta === "pitanje" ? stavka.tekst : stavka.naslov || stavka.tekst;
    }
    dugme.addEventListener("click", () => odaberiPredlog(stavka));
    li.append(dugme);
    typeahead.append(li);
  });
}

document.querySelector("#search-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const stavke = predlozi(dokument, pojmovi, q.value);
  if (stavke.length) odaberiPredlog(stavke[Math.max(typeaheadIndeks, 0)]);
});

q.addEventListener("input", osveziTypeahead);
q.addEventListener("keydown", (event) => {
  const stavke = [...typeahead.querySelectorAll("button")];
  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();
    if (!stavke.length) return;
    typeaheadIndeks += event.key === "ArrowDown" ? 1 : -1;
    if (typeaheadIndeks < 0) typeaheadIndeks = stavke.length - 1;
    if (typeaheadIndeks >= stavke.length) typeaheadIndeks = 0;
    stavke.forEach((dugme, indeks) => dugme.setAttribute("aria-selected", String(indeks === typeaheadIndeks)));
    stavke[typeaheadIndeks].scrollIntoView({ block: "nearest" });
  } else if (event.key === "Escape") {
    typeahead.hidden = true;
    q.setAttribute("aria-expanded", "false");
  }
});

window.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    q.focus();
  }
});

document.querySelector("#prethodna-nedelja").addEventListener("click", () => {
  otvoriNedelju(pomeriNedelju(cas, -1, dokument.trajanjeNedelja));
});
document.querySelector("#sledeca-nedelja").addEventListener("click", () => {
  otvoriNedelju(pomeriNedelju(cas, 1, dokument.trajanjeNedelja));
});
document.querySelector("#sacuvaj-zaglavlje").addEventListener("click", sacuvajTrenutniKorak);
document.querySelector("#pomoc").addEventListener("click", () => {
  document.querySelector("#pomoc-dijalog").showModal();
});

const TEME = [
  ["mornar", "Mornar"],
  ["ugalj", "Ugalj"],
  ["pesak", "Pesak"],
  ["terakota", "Terakota"],
];
const temaSpisak = document.querySelector("#tema-spisak");

function temaSada() {
  const zakucana = document.documentElement.dataset.tema;
  if (TEME.some(([id]) => id === zakucana)) return zakucana;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "pesak" : "ugalj";
}

function natpisTeme() {
  const sad = temaSada();
  temaDugme.textContent = TEME.find(([id]) => id === sad)[1];
  for (const dugme of temaSpisak.querySelectorAll("button")) {
    dugme.setAttribute("aria-current", dugme.dataset.tema === sad ? "true" : "false");
  }
}

function zakucajTemu(id) {
  document.documentElement.dataset.tema = id;
  try {
    localStorage.setItem("tema", id);
  } catch (e) {}
  natpisTeme();
  temaSpisak.hidden = true;
  temaDugme.setAttribute("aria-expanded", "false");
  if (pogled) osveziEditor();
}

for (const [id, natpis] of TEME) {
  const stavka = document.createElement("li");
  const dugme = document.createElement("button");
  dugme.type = "button";
  dugme.dataset.tema = id;
  dugme.textContent = natpis;
  dugme.addEventListener("click", () => zakucajTemu(id));
  stavka.append(dugme);
  temaSpisak.append(stavka);
}

temaDugme.addEventListener("click", () => {
  const otvoren = temaSpisak.hidden;
  temaSpisak.hidden = !otvoren;
  temaDugme.setAttribute("aria-expanded", String(otvoren));
});
natpisTeme();

window.addEventListener("hashchange", () => {
  const n = Number((location.hash.match(/cas-(\d+)/) || [])[1]);
  if (n >= 1 && n <= dokument.trajanjeNedelja) {
    if (n !== cas) deo = "koraci";
    cas = n;
    renderLecture();
  }
});

for (const ime of ["koraci", "diskusija", "editor"]) {
  document.querySelector(`#tab-${ime}`).addEventListener("click", () => {
    deo = ime;
    prikaziDeo();
  });
}

traka.addEventListener("pointerdown", (event) => {
  if (usko()) return;
  event.preventDefault();
  const pomeri = (e) => pomeriUdeo(e.clientX);
  const kraj = () => {
    window.removeEventListener("pointermove", pomeri);
    window.removeEventListener("pointerup", kraj);
  };
  window.addEventListener("pointermove", pomeri);
  window.addEventListener("pointerup", kraj);
  pomeri(event);
});

traka.addEventListener("keydown", (event) => {
  if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
  event.preventDefault();
  udeoEditora += event.key === "ArrowLeft" ? 5 : -5;
  primeniUdeo();
});

primeniUdeo();

prime("js/korak.js", (source) => applyKorak(source, true));
prime("js/niz.js", (source) => applyNiz(source, true));
prime("js/displej.js", (source) => applyDisplej(source, true));
prime("js/prekidac.js", (source) => applyPrekidac(source, true));
const pocetno = procitajMesto();
const izHesha = Number((location.hash.match(/cas-(\d+)/) || [])[1]);
if (izHesha >= 1 && izHesha <= dokument.trajanjeNedelja) {
  cas = izHesha;
  if (pocetno.nedelja === cas) korakPoCasu.set(cas, pocetno.korak || 0);
} else if (pocetno.nedelja >= 1 && pocetno.nedelja <= dokument.trajanjeNedelja) {
  cas = pocetno.nedelja;
  korakPoCasu.set(cas, pocetno.korak || 0);
}
Promise.all([
  fetch("/pojmovnik")
    .then((odgovor) => odgovor.text())
    .catch(() => ""),
  ucitajIkonice(),
]).then(([tekst]) => {
  if (tekst) pojmovi = pojmoviIzTeksta(tekst);
  renderLecture();
});
if (!location.hash) location.hash = `cas-${cas}`;
else window.dispatchEvent(new Event("hashchange"));
