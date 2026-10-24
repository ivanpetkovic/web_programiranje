import { napraviPogled, postaviPogled } from "./cm-editor.js";
import { dokument, lectures } from "./lectures.js";
import { natpisNedelje, pomeriNedelju, polozajiKlizaca, procenat, ucitajKurs } from "./model.js";
import { lekcijePojma, pojmoviIzTeksta, poljaPojma, predlozi } from "./pojmovnik.js";
import { PORUKA, modulPoZahtevu, porukaKonzole, sklopiDokument, trajanjeLopatica, ubaciMostKonzole } from "./pregled.js";
import { procitajRadne, serverTabVidljiv, upisiRadnu } from "./radna.js";
import { adresaPregleda, izborFajla, prikaziIzlaz } from "./birac.js";
import { nacrtajFiguru } from "./crtez.js";
import { prikazKoraka } from "./figura.js";
import { blokoviTeksta, imaMermaid, nacrtajMermaid, osveziMermaid } from "./mermaid.js";
import { potez, praznoStanje, prikaz as prikazDiskusije } from "./diskusija.js";
import { PODRAZUMEVANI_PRIMER, pocetniFajl, primeniPrimer } from "./primer.js";
import { praznaSesija, primeni } from "./verzija.js";
import { prihvatiOcitavanje } from "./svezina.js";
import { ikonica, ucitajIkonice } from "./ikonice.js";
import { jeKomentarLinije, prikazPriloga } from "./prilog.js";
import { proveriJs } from "./provera-izvora.js";
import { vecUFajlu } from "./stablo.js";

const nav = document.querySelector("#nav");
const navPreklop = document.querySelector("#nav-preklop");
const casEl = document.querySelector("#cas");
const biracMesto = document.querySelector("#birac-mesto");
const naslovCasa = document.querySelector("#naslov-casa");
const diskusijaMesto = document.querySelector("#sekcija-diskusija");
const podela = document.querySelector("#podela");
const traka = document.querySelector("#traka");
const q = document.querySelector("#q");
const tooltip = document.querySelector("#tooltip");
const typeahead = document.querySelector("#typeahead");
const displejMasina = document.querySelector("#displej-masina");
const sobaMasina = document.querySelector("#soba-masina");
const procitaj = document.querySelector("#procitaj");
const polling = document.querySelector("#polling");
const svezina = document.querySelector("#svezina");
const prag = document.querySelector("#prag");
const stanjeCitanja = document.querySelector("#stanje-citanja");
const istorija = document.querySelector("#istorija");
const blades = document.querySelector("#blades");
const kabl = document.querySelector("#kabl");
const sesije = document.querySelector("#sesije");
const kutijaMsg = document.querySelector("#kutija-msg");
const editorDom = document.querySelector("#editor");
const editorErr = document.querySelector("#editor-err");
const editorNapomena = document.querySelector("#editor-napomena");
const putanja = document.querySelector("#putanja");
const tree = document.querySelector("#tree");
const tabFront = document.querySelector("#tab-front");
const tabBack = document.querySelector("#tab-back");
const starost = document.querySelector("#starost");
const pregledStrana = document.querySelector("#pregled-strana");
const konzolaZapisi = document.querySelector("#pregled-konzola-zapisi");
const konzolaPrazno = document.querySelector("#pregled-konzola-prazno");
const konzolaTelo = document.querySelector(".pregled-konzola-telo");
const temaDugme = document.querySelector("#tema");
const otvoreniPojmovi = new Set();
const otvoreneNedelje = new Set();
const izborKoraka = new Map();
const MESTO_KLJUC = "web-programiranje:korak";
let pojmovi = [];
let aktivnaDefinicija = null;
let typeaheadIndeks = -1;
let sidroNava = 0;

let cas = 1;
let deo = "koraci";
let navOtvoren = true;
let udeoEditora = 72;
const korakPoCasu = new Map();
const rezervaPoCasu = new Map();
const diskusije = new Map();
const objasnjenjePoKoraku = new Map();
let pollId = 0;
let poslednjiTrenutak = null;
let upisRedni = 0;
let bloboviPregleda = [];
let konzolaGeneracija = 0;
const KONZOLA_REDOVA = 200;
const poslato = { takt: false, uloge: false, baza: false };
let dovod = null;
let sesija = praznaSesija(procitajRadne(localStorage));
let primerId = PODRAZUMEVANI_PRIMER;
let stanjePrimera = null;
let spisakPrimera = [{ id: PODRAZUMEVANI_PRIMER, naslov: "Kontrolna soba" }];
let primerZahtev = 0;
let meniPrimera = 0;
const sacuvaniPrimeri = new Map();
let prikazaniTekst = "";
let pogled = null;
let displejMasine = {
  crtaj(vrednost) {
    displejMasina.textContent = String(vrednost);
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
  natpisTeme();
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

function redNedelje(n) {
  return nav.querySelector(`.nedelja-red[data-n="${n}"]`);
}

function prvaVidljivaNedelja() {
  const vrh = nav.getBoundingClientRect().top;
  const red = [...nav.querySelectorAll(".nedelja-red")].find((dugme) => dugme.getBoundingClientRect().bottom > vrh);
  return red ? Number(red.dataset.n) : 0;
}

function odmakOdVrha(n) {
  const red = redNedelje(n);
  return red ? red.getBoundingClientRect().top - nav.getBoundingClientRect().top : null;
}

function paintNav() {
  const sidro = sidroNava || prvaVidljivaNedelja();
  sidroNava = 0;
  const odmak = odmakOdVrha(sidro);
  const skrol = nav.scrollTop;
  crtajNav();
  nav.scrollTop = skrol;
  const posle = odmakOdVrha(sidro);
  if (odmak !== null && posle !== null) nav.scrollTop += posle - odmak;
}

function crtajNav() {
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
    dugme.dataset.n = String(item.n);
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
      sidroNava = item.n;
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
      korakDugme.addEventListener("click", () => {
        sidroNava = item.n;
        otvoriNedelju(item.n, ki);
      });
      stavka.append(korakDugme);
      lista.append(stavka);
    });
    nav.append(lista);
  }
}

function vecUkucano(item, doIndeksa, putanja) {
  let pocetak = 0;
  for (const cas of lectures) {
    if (cas === item) break;
    pocetak += cas.steps.length;
  }
  return vecUFajlu(kursKoraci(), pocetak, pocetak + doIndeksa, putanja);
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

function prikaziNav() {
  document.body.classList.toggle("nav-skriven", !navOtvoren);
  navPreklop.setAttribute("aria-expanded", String(navOtvoren));
  navPreklop.setAttribute("aria-label", navOtvoren ? "Sakrij navigaciju" : "Prikaži navigaciju");
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
    dugme.addEventListener("mouseleave", zakaziZatvaranjeTooltipa);
    dugme.addEventListener("blur", zakaziZatvaranjeTooltipa);
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

function cvoroviProze(tekst, dijagrami) {
  if (!imaMermaid(tekst)) {
    const p = document.createElement("p");
    p.append(fragmentTeksta(tekst));
    return [p];
  }
  const cvorovi = [];
  for (const blok of blokoviTeksta(tekst)) {
    if (blok.vrsta === "tekst") {
      const p = document.createElement("p");
      p.append(fragmentTeksta(blok.tekst));
      cvorovi.push(p);
      continue;
    }
    const dijagram = document.createElement("div");
    dijagram.className = "figura figura-mermaid";
    dijagrami.push([dijagram, blok.izvor]);
    cvorovi.push(dijagram);
  }
  return cvorovi;
}

const KASNIJENJE_TOOLTIPA = 1000;
let zatvaranjeTooltipa = 0;

function prekiniZatvaranjeTooltipa() {
  clearTimeout(zatvaranjeTooltipa);
  zatvaranjeTooltipa = 0;
}

function drziTooltip() {
  if (tooltip.matches(":hover")) return true;
  return [...document.querySelectorAll(".pojam-crta")].some((dugme) => dugme.matches(":hover"));
}

function zakaziZatvaranjeTooltipa() {
  prekiniZatvaranjeTooltipa();
  zatvaranjeTooltipa = setTimeout(() => {
    zatvaranjeTooltipa = 0;
    if (drziTooltip()) return;
    sakrijTooltip();
  }, KASNIJENJE_TOOLTIPA);
}

function ciljDrziTooltip(cilj) {
  if (!(cilj instanceof Node)) return false;
  if (tooltip.contains(cilj)) return true;
  const el = cilj instanceof Element ? cilj : cilj.parentElement;
  return Boolean(el && el.closest(".pojam-crta"));
}

function prikaziTooltip(sidro, pojam) {
  prekiniZatvaranjeTooltipa();
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
  prekiniZatvaranjeTooltipa();
  tooltip.hidden = true;
  tooltip.dataset.ime = "";
}

tooltip.addEventListener("mouseenter", prekiniZatvaranjeTooltipa);
tooltip.addEventListener("mouseleave", zakaziZatvaranjeTooltipa);
document.addEventListener("pointerdown", (dogadjaj) => {
  if (tooltip.hidden || ciljDrziTooltip(dogadjaj.target)) return;
  zakaziZatvaranjeTooltipa();
});

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

function nacrtajTekstBloka(tekst, naslovTekst) {
  const blok = document.createElement("section");
  blok.className = "isecak";
  const glava = document.createElement("header");
  const naslov = document.createElement("span");
  saIkonom(naslov, "file-text", naslovTekst);
  glava.append(naslov);
  const pre = document.createElement("pre");
  pre.textContent = tekst;
  blok.append(glava, pre);
  return blok;
}

function nacrtajFajl(fajl) {
  const blok = document.createElement("section");
  blok.className = "isecak";
  const glava = document.createElement("header");
  const naslov = document.createElement("span");
  saIkonom(naslov, "folder", fajl.ime);
  const kopiraj = document.createElement("button");
  kopiraj.type = "button";
  const natpisKopiranja = (tekst) => saIkonom(kopiraj, "copy", tekst);
  natpisKopiranja("Kopiraj");
  kopiraj.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(fajl.linije.map((linija) => linija.tekst).join("\n"));
      natpisKopiranja("Kopirano");
    } catch {
      natpisKopiranja("Kopiraj");
    }
  });
  glava.append(naslov, kopiraj);
  const pre = document.createElement("pre");
  for (const [indeks, linija] of fajl.linije.entries()) {
    const komentarLinija = jeKomentarLinije(linija.tekst);
    const red = document.createElement("span");
    red.className = linija.tip === "dodato" && !komentarLinija ? "red novo" : "red";
    const brojReda = document.createElement("span");
    brojReda.className = "br";
    brojReda.textContent = String(indeks + 1);
    const telo = document.createElement("span");
    const taraba = linija.tekst.indexOf("#");
    if (komentarLinija || taraba >= 0) {
      const od = komentarLinija ? 0 : taraba;
      if (od > 0) telo.append(document.createTextNode(linija.tekst.slice(0, od)));
      const komentar = document.createElement("span");
      komentar.className = "komentar";
      komentar.textContent = linija.tekst.slice(od);
      telo.append(komentar);
    } else telo.textContent = linija.tekst;
    red.append(brojReda, telo, document.createTextNode("\n"));
    pre.append(red);
  }
  blok.append(glava, pre);
  const tekst = fajl.linije.map((linija) => linija.tekst).join("\n");
  const greska = String(fajl.putanja || "").endsWith(".js") ? proveriJs(tekst) : "";
  if (greska) {
    const poruka = document.createElement("p");
    poruka.className = "err";
    poruka.textContent = greska;
    blok.append(poruka);
  }
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
  const krugovi = document.createElement("div");
  krugovi.className = "birac-krugovi";
  krugovi.setAttribute("role", "group");
  krugovi.setAttribute("aria-label", "Koraci");
  item.steps.forEach((korakNed, ki) => {
    const domacin = document.createElement("button");
    domacin.type = "button";
    domacin.className = "birac-krug-domacin";
    domacin.setAttribute("aria-label", `${ki + 1} ${korakNed.naslov}`);
    if (ki === i) domacin.setAttribute("aria-current", "step");
    domacin.addEventListener("click", () => {
      korakPoCasu.set(cas, ki);
      renderLecture();
    });
    const krug = document.createElement("span");
    krug.className = ki <= i ? "birac-krug birac-krug-dosegnut" : "birac-krug birac-krug-buduci";
    domacin.append(krug);
    krugovi.append(domacin);
  });
  birac.append(red, krugovi);
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
  naslovCasa.textContent = `Nedelja ${item.n} — ${item.title}`;
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
  const dijagrami = [];
  const proza = cvoroviProze(korak.tekst, dijagrami);
  const kljucna = document.createElement("aside");
  kljucna.className = "kljucna";
  const kljucnaNaslov = document.createElement("strong");
  saIkonom(kljucnaNaslov, "lightbulb", "Ključna ideja");
  kljucna.append(kljucnaNaslov, ...cvoroviProze(korak.kljucnaIdeja, dijagrami));
  const prikaz = prikazKoraka(korak);
  const figura = prikaz.mermaid ? document.createElement("div") : null;
  if (figura) {
    figura.className = "figura";
    nacrtajFiguru(figura, korak.figura);
  }
  const imaFajl = !figura && Boolean(korak.putanja);
  const ranije = imaFajl ? vecUkucano(item, i, prikaz.putanja) : "";
  const prilog = imaFajl ? prikazPriloga(korak, ranije) : { fajl: null, komanda: "", http: "" };
  const imaRedove = prilog.fajl && prilog.fajl.linije.some((linija) => linija.tekst !== "");
  const isecak = imaRedove ? nacrtajFajl(prilog.fajl) : null;
  const httpBlok = prilog.http ? nacrtajTekstBloka(prilog.http, "HTTP") : null;
  const komandaBlok = prilog.komanda ? nacrtajTekstBloka(prilog.komanda, "Komanda") : null;
  const put = imaFajl ? document.createElement("p") : null;
  const vec = imaFajl ? document.createElement("pre") : null;
  if (put) {
    put.className = "meta";
    const putanjaKoraka = document.createElement("span");
    putanjaKoraka.id = "putanja-koraka";
    putanjaKoraka.textContent = prikaz.putanja;
    const fajl = ikonica("file-text");
    if (fajl) put.append(fajl);
    put.append(document.createTextNode("Fajl: "), putanjaKoraka);
    vec.className = "vec";
    vec.hidden = !ranije || Boolean(isecak);
    vec.textContent = ranije && !isecak ? `Već u fajlu:\n${ranije}` : "";
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
    const kljuc = kljucDiskusije();
    diskusije.set(kljuc, potez(diskusije.get(kljuc), { tip: "ponovi" }));
    renderLecture();
  });
  radnjePitanja.append(otvori, ponovi);
  biracMesto.replaceChildren(birac);
  const izolovan = !figura && !imaFajl && korak.samostalniPrimer?.tekst
    ? nacrtajTekstBloka(korak.samostalniPrimer.tekst, "Mali eksperiment")
    : null;
  const dijagram = !figura && korak.dijagram?.tekst
    ? nacrtajTekstBloka(korak.dijagram.tekst, "Dijagram")
    : null;
  const analiza = otvoreno && korak.analiza ? document.createElement("p") : null;
  if (analiza) {
    analiza.className = "why analiza";
    analiza.textContent = korak.analiza;
  }
  casEl.append(metaKoraka, naslovKoraka, ...proza, kljucna);
  for (const [omot, izvor] of dijagrami) void nacrtajMermaid(omot, izvor);
  if (figura) casEl.append(figura);
  else if (imaFajl) {
    if (isecak) casEl.append(isecak);
    if (httpBlok) casEl.append(httpBlok);
    if (komandaBlok) casEl.append(komandaBlok);
    casEl.append(put, vec);
  }
  if (izolovan) casEl.append(izolovan);
  if (dijagram) casEl.append(dijagram);
  casEl.append(pitanjeBlok, radnjePitanja);
  if (analiza) casEl.append(analiza);
  if (izlaz) casEl.append(izlaz);
  diskusijaMesto.replaceChildren(nacrtajDiskusiju(item));
  prikaziDeo();
  paintNav();
  fitPanel();
  document.querySelector("#prethodna-nedelja").disabled = cas <= 1;
  document.querySelector("#sledeca-nedelja").disabled = cas >= dokument.trajanjeNedelja;
}


function zapamtiDiskusiju(dogadaj) {
  const kljuc = kljucDiskusije();
  diskusije.set(kljuc, potez(diskusije.get(kljuc), dogadaj));
  renderLecture();
}

function nacrtajDiskusiju(item) {
  const model = prikazDiskusije(diskusije.get(kljucDiskusije()), item, rezervaPoCasu.get(cas) === true);
  const blok = document.createElement("section");
  blok.className = "diskusija";
  blok.setAttribute("aria-label", "Duga pitalica");
  const naslov = document.createElement("h2");
  naslov.textContent = model.naslov;
  const fazaEl = document.createElement("p");
  fazaEl.className = "log";
  fazaEl.textContent = `Faza: ${model.faza}`;
  const problem = document.createElement("p");
  problem.textContent = model.problem;
  const options = document.createElement("div");
  options.className = "options";
  options.dataset.kviz = "diskusija";
  for (const opt of model.opcije) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option";
    button.dataset.key = opt.key;
    const znakOdgovora = ikonica(opt.znak);
    if (znakOdgovora) button.append(znakOdgovora);
    button.append(document.createTextNode(`${opt.key}. ${opt.text}`));
    if (opt.podvuceno) button.classList.add("podvuceno");
    if (opt.whyVidljiv) {
      button.classList.toggle("holds", opt.holds);
      const why = document.createElement("p");
      why.className = "why";
      why.textContent = opt.why;
      button.append(why);
    }
    button.addEventListener("click", () => {
      if (opt.mozeIzbor) zapamtiDiskusiju({ tip: "izbor", kljuc: opt.key });
    });
    options.append(button);
  }
  const tisina = document.createElement("p");
  tisina.className = "log";
  tisina.hidden = !model.tisina;
  tisina.textContent = "Sajt ćuti o tome šta drži. Parovi porede razloge uživo.";
  const tabla = document.createElement("textarea");
  tabla.className = "pretpostavke";
  tabla.rows = 3;
  tabla.hidden = !model.pretpostavka.vidljiva;
  tabla.placeholder = "Pretpostavke koje su se čule";
  tabla.value = model.pretpostavka.tekst;
  tabla.setAttribute("aria-label", "Pretpostavke");
  tabla.addEventListener("input", () => {
    const kljuc = kljucDiskusije();
    diskusije.set(kljuc, potez(diskusije.get(kljuc), { tip: "pretpostavka", tekst: tabla.value }));
  });
  const zakljucak = document.createElement("textarea");
  zakljucak.rows = 2;
  zakljucak.hidden = !model.zakljucak.vidljiv;
  zakljucak.placeholder = "Jedna zajednička rečenica";
  zakljucak.value = model.zakljucak.tekst;
  zakljucak.setAttribute("aria-label", "Zaključak");
  zakljucak.addEventListener("input", () => {
    const kljuc = kljucDiskusije();
    diskusije.set(kljuc, potez(diskusije.get(kljuc), { tip: "zakljucak", tekst: zakljucak.value }));
  });
  const radnje = document.createElement("div");
  radnje.className = "row";
  const dalje = document.createElement("button");
  dalje.type = "button";
  dalje.textContent = "Dalje";
  dalje.disabled = !model.dalje;
  dalje.addEventListener("click", () => zapamtiDiskusiju({ tip: "dalje" }));
  radnje.append(dalje);
  if (model.mozeRezerva) {
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
  procitaj.hidden = cas < 5;
  polling.hidden = cas < 9;
  svezina.hidden = cas < 9;
  prag.hidden = cas < 9;
  stanjeCitanja.hidden = cas < 6;
  istorija.hidden = cas < 8;
  kabl.hidden = cas < 6;
  sesije.hidden = cas < 10;
  starost.hidden = cas < 9;
  osveziDugmePrimera();
  primeniDogadaj({ tip: "fokus", putanja: izborFajla(trenutniKorak()), kljuc: `${cas}:${indeksKoraka()}` });
  if (cas < 9) zaustaviPeriodicno();
  applyLive();
  if (cas >= 5 && !dovod) connectDovod();
  uskladiKutiju();
}

function zaustaviPeriodicno() {
  clearInterval(pollId);
  pollId = 0;
  polling.setAttribute("aria-pressed", "false");
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

function primerAktivan() {
  return primerId !== PODRAZUMEVANI_PRIMER && Boolean(stanjePrimera);
}

function aktivnaVerzija() {
  return primerAktivan() ? stanjePrimera.verzija : sesija.verzija;
}

function otvorenUStablu() {
  return primerAktivan() ? stanjePrimera.otvoreno : sesija.otvoreno[sesija.strana];
}

function paintTree(paths, otvoren) {
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
  tree.replaceChildren(renderNode(root, otvoren));
}

function renderNode(node, otvoren) {
  const ul = document.createElement("ul");
  for (const [name, child] of node.dirs) {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.className = "dir";
    const fascikla = ikonica("folder");
    if (fascikla) span.append(fascikla);
    span.append(document.createTextNode(`${name}/`));
    li.append(span, renderNode(child, otvoren));
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
    button.setAttribute("aria-current", file.put === otvoren ? "true" : "false");
    button.addEventListener("click", () => {
      primeniDogadaj({ tip: "otvori", put: file.put });
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

function osveziStrane() {
  const strane = document.querySelector("#strane");
  const ugradjen = !primerAktivan();
  if (strane) strane.hidden = !ugradjen;
  tabFront.hidden = !ugradjen;
  tabBack.hidden = !ugradjen || !serverTabVidljiv(cas);
}

function osveziSegment() {
  const radnaNaEkranu = aktivnaVerzija() === "radna";
  document.querySelector("#moj-kod").setAttribute("aria-pressed", String(radnaNaEkranu));
  document.querySelector("#lekcija").setAttribute("aria-pressed", String(!radnaNaEkranu));
}

function osveziAdresu() {
  const el = document.querySelector("#pregled-adresa");
  if (!el) return;
  if (primerAktivan()) {
    const put = stanjePrimera.otvoreno;
    el.textContent = put ? adresaPregleda(location.origin, `primeri/${stanjePrimera.id}/${put}`) : "";
    return;
  }
  const put = sesija.otvoreno[sesija.strana];
  if (!put) return;
  el.textContent = adresaPregleda(location.origin, `${sesija.strana}/${put}`);
}

function ocistiKonzolu() {
  if (!konzolaZapisi) return;
  konzolaZapisi.replaceChildren();
  if (konzolaPrazno) konzolaPrazno.hidden = false;
}

function dodajZapisKonzole(zapis) {
  if (!konzolaZapisi) return;
  if (konzolaPrazno) konzolaPrazno.hidden = true;
  const li = document.createElement("li");
  li.className = `nivo-${zapis.nivo}`;
  const nivo = document.createElement("span");
  nivo.className = "nivo";
  nivo.textContent = `${zapis.nivo} `;
  const tekst = document.createElement("span");
  tekst.className = "tekst";
  tekst.textContent = zapis.tekst;
  li.append(nivo, tekst);
  konzolaZapisi.append(li);
  while (konzolaZapisi.children.length > KONZOLA_REDOVA) konzolaZapisi.firstElementChild.remove();
  if (konzolaTelo) konzolaTelo.scrollTop = konzolaTelo.scrollHeight;
}

function mapaPregleda(klijent) {
  if (!primerAktivan() || klijent["index.html"]) return klijent;
  const html = stanjePrimera.putanje.find((put) => put.endsWith(".html") && !put.includes("/"));
  if (!html || !klijent[html]) return klijent;
  return { ...klijent, "index.html": klijent[html] };
}

function sklopiIframe(klijent) {
  if (!pregledStrana) return;
  const generacija = ++konzolaGeneracija;
  ocistiKonzolu();
  for (const url of bloboviPregleda) URL.revokeObjectURL(url);
  bloboviPregleda = [];
  const dokument = sklopiDokument(klijent, (tekst, tip, kljuc) => {
    const telo = tip === "text/javascript" && kljuc ? `${tekst}\n//# sourceURL=${kljuc}\n` : tekst;
    const url = URL.createObjectURL(new Blob([telo], { type: `${tip};charset=utf-8` }));
    bloboviPregleda.push(url);
    return url;
  });
  pregledStrana.srcdoc = dokument ? ubaciMostKonzole(dokument, generacija) : "";
  const trajanje = trajanjeLopatica(klijent["client/css/soba.css"] || "");
  if (trajanje && blades) blades.style.animationDuration = trajanje;
}

async function upisiServere(tela) {
  const token = ++upisRedni;
  for (const [putanja, izvor] of Object.entries(tela)) {
    let odgovor;
    try {
      odgovor = await fetch("/api/fajl", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ strana: "server", put: putanja.slice("server/".length), izvor }),
      });
    } catch {
      return;
    }
    if (token !== upisRedni) return;
    if (!odgovor.ok && `${sesija.strana}/${sesija.otvoreno[sesija.strana]}` === putanja) {
      const telo = await odgovor.json().catch(() => ({}));
      editorErr.textContent = telo.greska || PORUKA;
    }
  }
}

function osveziNapomenu(putanja) {
  if (!editorNapomena) return;
  const prikaz = Boolean(putanja) && putanja.startsWith("server/") && !modulPoZahtevu(putanja);
  editorNapomena.hidden = !prikaz;
  editorNapomena.textContent = prikaz ? "Izmene ostaju u editoru. Proces ovaj fajl čita samo kad krene." : "";
}

function postaviEditor(editor) {
  prikazaniTekst = editor.tekst;
  if (!pogled) pogled = napraviPogled(editorDom);
  postaviPogled(pogled, {
    tekst: editor.tekst,
    samoCitaj: editor.samoCitaj,
    linije: editor.linije,
    put: editor.putanja,
    onPromena,
  });
}

function nacrtajPrikaz(rezultat, sacuvano, dogadaj) {
  osveziStrane();
  if (!primerAktivan()) {
    tabFront.setAttribute("aria-selected", String(sesija.strana === "client"));
    tabBack.setAttribute("aria-selected", String(sesija.strana === "server"));
  }
  const editor = rezultat.prikaz.editor;
  if (editor.prazno) {
    paintTree([], "");
    putanja.textContent = "";
    osveziNapomenu("");
    if (pogled) postaviPogled(pogled, { tekst: "", samoCitaj: true, linije: [], put: "", onPromena() {} });
    const adresa = document.querySelector("#pregled-adresa");
    if (adresa) adresa.textContent = "";
    return;
  }
  paintTree(rezultat.prikaz.fajlovi, otvorenUStablu());
  putanja.textContent = editor.putanja;
  osveziNapomenu(editor.putanja);
  markOpen(otvorenUStablu());
  osveziAdresu();
  osveziSegment();
  if (dogadaj.tip === "unos") prikazaniTekst = dogadaj.tekst;
  else if (rezultat.osvezi || !pogled) postaviEditor(editor);
  if (!rezultat.zivo) {
    if (!sacuvano) editorErr.textContent = "Pregledač nije sačuvao radnu verziju.";
    return;
  }
  sklopiIframe(mapaPregleda(rezultat.prikaz.klijent));
  if (!primerAktivan()) upisiServere(rezultat.prikaz.server);
  editorErr.textContent = "";
  if (!sacuvano) editorErr.textContent = "Pregledač nije sačuvao radnu verziju.";
}

function uskladiSobu() {
  if (sobaMasina) sobaMasina.hidden = primerAktivan() || cas < 5;
}

function primeniDogadaj(dogadaj) {
  uskladiSobu();
  if (primerAktivan() && dogadaj.tip !== "fokus") {
    const pre = sesija;
    const rezultat = primeniPrimer(stanjePrimera, pre.radne, dogadaj);
    stanjePrimera = rezultat.stanje;
    sacuvaniPrimeri.set(stanjePrimera.id, stanjePrimera);
    let sacuvano = true;
    if (rezultat.upis) {
      const upis = upisiRadnu(localStorage, pre.radne, rezultat.upis.putanja, rezultat.upis.tekst);
      sesija = { ...sesija, radne: upis.mapa };
      sacuvano = upis.sacuvano;
    }
    nacrtajPrikaz(rezultat, sacuvano, dogadaj);
    return;
  }
  const pre = sesija;
  const rezultat = primeni(sesija, dogadaj, { koraci: kursKoraci(), indeks: indeksUKursu(), nedelja: cas });
  sesija = rezultat.sesija;
  let sacuvano = true;
  if (rezultat.upis) {
    const upis = upisiRadnu(localStorage, pre.radne, rezultat.upis.putanja, rezultat.upis.tekst);
    sesija = { ...sesija, radne: upis.mapa };
    sacuvano = upis.sacuvano;
  }
  if (primerAktivan()) {
    if (rezultat.zivo) upisiServere(rezultat.prikaz.server);
    return;
  }
  nacrtajPrikaz(rezultat, sacuvano, dogadaj);
}

function naslovPrimera(id) {
  return spisakPrimera.find((primer) => primer.id === id)?.naslov || "Kontrolna soba";
}

function osveziDugmePrimera() {
  const dugme = document.querySelector("#primer");
  if (!dugme) return;
  dugme.replaceChildren();
  const znak = ikonica("menu");
  if (znak) dugme.append(znak);
  const tekst = document.createElement("span");
  tekst.textContent = naslovPrimera(primerId);
  dugme.append(tekst);
  const dole = ikonica("chevron-down");
  if (dole) dugme.append(dole);
  dugme.setAttribute("aria-label", `Primer: ${naslovPrimera(primerId)}`);
}

function nacrtajMeniPrimera() {
  const meni = document.querySelector("#primer-meni");
  meni.replaceChildren();
  for (const primer of spisakPrimera) {
    const li = document.createElement("li");
    const dugme = document.createElement("button");
    dugme.type = "button";
    dugme.setAttribute("role", "option");
    dugme.textContent = primer.naslov;
    if (primer.id === primerId) dugme.setAttribute("aria-selected", "true");
    dugme.addEventListener("click", () => {
      izaberiPrimer(primer.id);
    });
    li.append(dugme);
    meni.append(li);
  }
}

async function ucitajSpisakPrimera() {
  try {
    const odgovor = await fetch("/api/primeri");
    if (!odgovor.ok) return;
    const telo = await odgovor.json();
    if (Array.isArray(telo.primeri) && telo.primeri.length) spisakPrimera = telo.primeri;
  } catch {
    /* meni ostaje na poslednjem spisku, podrazumevano samo kontrolna soba */
  }
}

async function izaberiPrimer(id) {
  const meni = document.querySelector("#primer-meni");
  const dugme = document.querySelector("#primer");
  meni.hidden = true;
  dugme.setAttribute("aria-expanded", "false");
  if (id === PODRAZUMEVANI_PRIMER) {
    if (stanjePrimera) sacuvaniPrimeri.set(stanjePrimera.id, stanjePrimera);
    primerId = PODRAZUMEVANI_PRIMER;
    stanjePrimera = null;
    osveziDugmePrimera();
    primeniDogadaj({ tip: sesija.verzija === "ugradjena" ? "ugradjena" : "radna" });
    return;
  }
  const token = ++primerZahtev;
  let telo;
  try {
    const odgovor = await fetch(`/api/primeri/fajlovi?id=${encodeURIComponent(id)}`);
    telo = await odgovor.json().catch(() => null);
    if (!odgovor.ok || !telo || !Array.isArray(telo.fajlovi)) throw new Error("nema");
  } catch {
    if (token === primerZahtev) editorErr.textContent = "Primer nije učitan.";
    return;
  }
  if (token !== primerZahtev) return;
  if (stanjePrimera) sacuvaniPrimeri.set(stanjePrimera.id, stanjePrimera);
  const pre = sacuvaniPrimeri.get(id);
  primerId = id;
  stanjePrimera = {
    id,
    otvoreno: pre?.otvoreno && telo.fajlovi.includes(pre.otvoreno) ? pre.otvoreno : pocetniFajl(telo.fajlovi),
    verzija: pre?.verzija || "radna",
    putanje: telo.fajlovi,
    verzije: telo.verzije || {},
    kljuc: "",
  };
  osveziDugmePrimera();
  editorErr.textContent = "";
  const rezultat = primeniPrimer(stanjePrimera, sesija.radne, { tip: stanjePrimera.verzija });
  stanjePrimera = rezultat.stanje;
  sacuvaniPrimeri.set(id, stanjePrimera);
  nacrtajPrikaz(rezultat, true, { tip: stanjePrimera.verzija });
}

async function preklopiMeniPrimera() {
  const meni = document.querySelector("#primer-meni");
  const dugme = document.querySelector("#primer");
  if (!meni.hidden) {
    meni.hidden = true;
    dugme.setAttribute("aria-expanded", "false");
    meniPrimera += 1;
    return;
  }
  const token = ++meniPrimera;
  await ucitajSpisakPrimera();
  if (token !== meniPrimera) return;
  nacrtajMeniPrimera();
  meni.hidden = false;
  dugme.setAttribute("aria-expanded", "true");
  const izabran = meni.querySelector("[aria-selected='true']") || meni.querySelector("button");
  izabran?.focus();
}

function poveziPrimer() {
  const dugme = document.querySelector("#primer");
  const meni = document.querySelector("#primer-meni");
  dugme.addEventListener("click", () => {
    preklopiMeniPrimera();
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
      dugme.setAttribute("aria-expanded", "false");
      dugme.focus();
    }
  });
  document.addEventListener("click", (dogadjaj) => {
    if (dugme.parentElement.contains(dogadjaj.target)) return;
    meni.hidden = true;
    dugme.setAttribute("aria-expanded", "false");
  });
}

function onPromena(tekst) {
  primeniDogadaj({ tip: "unos", tekst });
}

function ucitajLekciju() {
  primeniDogadaj({ tip: "ucitaj" });
}

function sacuvajRadnu() {
  primeniDogadaj({ tip: "sacuvaj", tekst: prikazaniTekst });
}

function resetujRadnu() {
  primeniDogadaj({ tip: "reset" });
}

function osveziPregled() {
  primeniDogadaj({ tip: "zivo" });
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
      if (cas >= 6) stanjeCitanja.textContent = "greška";
      kutijaMsg.textContent = `HTTP ${response.status}`;
      return;
    }
    if (data.trenutak) {
      poslednjiTrenutak = data.trenutak;
      starost.textContent = data.trenutak;
    }
    if (cas >= 6) stanjeCitanja.textContent = "podatak";
    if (cas >= 8) nacrtajIstoriju(data.istorija);
    kutijaMsg.textContent = "HTTP 200";
  } catch {
    if (cas >= 6) stanjeCitanja.textContent = "greška";
    kutijaMsg.textContent = "nema statusa";
  }
}

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
  if (sesija.strana === "client") return;
  primeniDogadaj({ tip: "strana", strana: "client" });
});
tabBack.addEventListener("click", () => {
  if (sesija.strana === "server") return;
  primeniDogadaj({ tip: "strana", strana: "server" });
});

const STABLO_KLJUC = "stabloSklopljeno";
const dugmeStabla = document.querySelector("#sklopi-stablo");

function postaviStablo(sklopljeno) {
  document.querySelector("#file-layout").classList.toggle("sklopljeno", sklopljeno);
  const natpis = sklopljeno ? "Rasklopi stablo fajlova" : "Sklopi stablo fajlova";
  dugmeStabla.setAttribute("aria-expanded", String(!sklopljeno));
  dugmeStabla.setAttribute("aria-label", natpis);
  dugmeStabla.title = natpis;
}

try {
  postaviStablo(localStorage.getItem(STABLO_KLJUC) === "1");
} catch {}

dugmeStabla.addEventListener("click", () => {
  const sklopljeno = dugmeStabla.getAttribute("aria-expanded") === "true";
  postaviStablo(sklopljeno);
  try {
    localStorage.setItem(STABLO_KLJUC, sklopljeno ? "1" : "0");
  } catch {}
});

document.querySelector("#resetuj").addEventListener("click", resetujRadnu);
document.querySelector("#ucitaj").addEventListener("click", ucitajLekciju);
document.querySelector("#sacuvaj-radnu").addEventListener("click", sacuvajRadnu);
document.querySelector("#moj-kod").addEventListener("click", () => primeniDogadaj({ tip: "radna" }));
document.querySelector("#lekcija").addEventListener("click", () => primeniDogadaj({ tip: "ugradjena" }));
poveziPrimer();
document.querySelector("#pregled-osvezi").addEventListener("click", osveziPregled);
document.querySelector("#pregled-konzola-obrisi").addEventListener("click", ocistiKonzolu);
window.addEventListener("message", (event) => {
  if (!pregledStrana || event.source !== pregledStrana.contentWindow) return;
  if (event.origin !== location.origin && event.origin !== "null") return;
  const zapis = porukaKonzole(event.data);
  if (!zapis || zapis.generacija !== konzolaGeneracija) return;
  if (zapis.nivo === "clear") {
    ocistiKonzolu();
    return;
  }
  dodajZapisKonzole(zapis);
});

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
  ["mornar", "Mornar", "Plava, sveža i smirena"],
  ["ugalj", "Ugalj", "Tamna i fokusirana"],
  ["pesak", "Pesak", "Svetla i neutralna"],
  ["terakota", "Terakota", "Topla i prirodna"],
];
const temaSpisak = document.querySelector("#tema-spisak");
const temaNatpis = document.querySelector("#tema .tema-natpis");

function temaSada() {
  const zakucana = document.documentElement.dataset.tema;
  if (TEME.some(([id]) => id === zakucana)) return zakucana;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "pesak" : "ugalj";
}

function natpisTeme() {
  const sad = temaSada();
  const natpis = TEME.find(([id]) => id === sad)[1];
  temaNatpis.textContent = natpis;
  temaDugme.setAttribute("aria-label", `Tema: ${natpis}`);
  for (const dugme of temaSpisak.querySelectorAll("button")) {
    const trenutna = dugme.dataset.tema === sad;
    dugme.setAttribute("aria-current", trenutna ? "true" : "false");
    const kvacica = dugme.querySelector(".tema-kvacica");
    if (!kvacica) continue;
    kvacica.replaceChildren();
    if (!trenutna) continue;
    const znak = ikonica("check");
    if (znak) kvacica.append(znak);
  }
}

function zakucajTemu(id) {
  document.documentElement.dataset.tema = id;
  try {
    localStorage.setItem("tema", id);
  } catch (e) {}
  natpisTeme();
  osveziMermaid();
  temaSpisak.hidden = true;
  temaDugme.setAttribute("aria-expanded", "false");
  if (pogled) osveziEditor();
}

for (const [id, natpis, opis] of TEME) {
  const stavka = document.createElement("li");
  const dugme = document.createElement("button");
  dugme.type = "button";
  dugme.dataset.tema = id;
  dugme.setAttribute("role", "option");
  const slika = document.createElement("img");
  slika.src = `/icons/teme/${id}.png`;
  slika.alt = "";
  slika.width = 72;
  slika.height = 44;
  const tekst = document.createElement("span");
  tekst.className = "tema-tekst";
  const ime = document.createElement("strong");
  ime.textContent = natpis;
  const sitno = document.createElement("small");
  sitno.className = "tema-opis";
  sitno.textContent = opis;
  tekst.append(ime, sitno);
  const kvacica = document.createElement("span");
  kvacica.className = "tema-kvacica";
  kvacica.setAttribute("aria-hidden", "true");
  dugme.append(slika, tekst, kvacica);
  dugme.addEventListener("click", () => zakucajTemu(id));
  stavka.append(dugme);
  temaSpisak.append(stavka);
}

temaDugme.addEventListener("click", () => {
  const otvoren = temaSpisak.hidden;
  temaSpisak.hidden = !otvoren;
  temaDugme.setAttribute("aria-expanded", String(otvoren));
});
document.addEventListener("click", (event) => {
  if (temaSpisak.hidden || event.target.closest(".tema-meni")) return;
  temaSpisak.hidden = true;
  temaDugme.setAttribute("aria-expanded", "false");
});
window.addEventListener("keydown", (event) => {
  if (event.key !== "Escape" || temaSpisak.hidden) return;
  temaSpisak.hidden = true;
  temaDugme.setAttribute("aria-expanded", "false");
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

navPreklop.addEventListener("click", () => {
  navOtvoren = !navOtvoren;
  prikaziNav();
});
prikaziNav();

const navOmot = document.querySelector(".nav-omot");
let vrhNavaZakazan = false;
function postaviVrhNava() {
  vrhNavaZakazan = false;
  navOmot.style.setProperty("--nav-vrh", `${Math.max(0, navOmot.getBoundingClientRect().top)}px`);
}
function zakaziVrhNava() {
  if (vrhNavaZakazan) return;
  vrhNavaZakazan = true;
  requestAnimationFrame(postaviVrhNava);
}
window.addEventListener("scroll", zakaziVrhNava, { passive: true });
window.addEventListener("resize", zakaziVrhNava);
new ResizeObserver(zakaziVrhNava).observe(document.querySelector(".top"));

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
