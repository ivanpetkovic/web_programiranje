import { napraviPogled, postaviPogled } from "./cm-editor.js";
import { dokument, lectures, osveziLekcije, sirovaTema, siroviKorak } from "./lectures.js";
import {
  jeRezimUredjivanja,
  kljucPolja,
  napraviEditorKratkog,
  napraviEditorOpcija,
  napraviEditorTeksta,
  veziTekst,
  napraviStanjeUredjivanja,
  obrisiKorak,
  pomeriKorak,
  omotUredjivog,
  dugmeUredi,
  poljeKratko,
  poljeTeksta,
  sacuvajKursNaServeru,
  ubaciKorak,
  dodajKorakNaKraj,
  znakStanja,
} from "./uredi-sadrzaj.js";
import { napraviPadajucu } from "./padajuca.js";
import {
  VRSTE_DISKUSIJE,
  VRSTE_SEKCIJE,
  blokoviKoraka,
  diskusijaKoraka,
  ikonaSekcije,
  materijalizuj,
  naslovKoda,
  natpisSekcije,
  obrisiSekciju,
  promeniVrstuSekcije,
  spustiSekciju,
  ubaciSekciju,
  uskladiDiskusiju,
  uskladiNasledjenaPolja,
} from "./blokovi-lekcije.js";
import { pomeriTemu, ucitajKurs } from "./model.js";
import { lekcijePojma, pojmoviIzTeksta, poljaPojma, predlozi } from "./recnik.js";
import { PORUKA, modulPoZahtevu, porukaKonzole, sklopiDokument, trajanjeLopatica, ubaciMostKonzole } from "./pregled.js";
import { procitajRadne, serverTabVidljiv, upisiRadnu } from "./radna.js";
import { adresaPregleda, izborFajla, popunaKoraka, prikaziIzlaz, rasporedBiraca } from "./birac.js";
import { nacrtajFiguru } from "./crtez.js";
import { mermaidFigura } from "./figura.js";
import { blokoviTeksta, imaMermaid, nacrtajMermaid, osveziMermaid } from "./mermaid.js";
import {
  htmlKoraka,
  htmlTeme,
  imeIzvoza,
  izvorMermaida,
  markdownKoraka,
  markdownTeme,
  preuzmiTekst,
  stampajHtml,
} from "./izvoz.js";
import { blokoviProze } from "./proza.js";
import { potez, praznoStanje, prikaz as prikazDiskusije } from "./diskusija.js";
import { PODRAZUMEVANI_PRIMER, pocetniFajl, primeniPrimer } from "./primer.js";
import { praznaSesija, primeni } from "./verzija.js";
import { prihvatiOcitavanje } from "./svezina.js";
import { ikonica, ucitajIkonice } from "./ikonice.js";
import { napraviBeleske } from "./beleske.js";
import {
  napraviStanje,
  SKALE_FONTA,
  postaviPaletu,
  postaviPodesavanje,
  poslednjiKorak,
  vidjeniKoraci,
  zabeleziKorak,
  zabeleziUvod,
} from "./lokalno-stanje.js";
import { napraviTrakuCasa } from "./traka-casa.js";
import { PALETE_SAJTA, nacrtajOdeljke, napraviOpcije, napraviPrviIzbor } from "./opcije.js";

const nav = document.querySelector("#nav");
const navPreklop = document.querySelector("#nav-preklop");
const mobilZavesa = document.querySelector("#mobil-zavesa");
const mobilFooter = document.querySelector("#mobil-footer");
const mobilFtPodesavanja = document.querySelector("#mobil-ft-podesavanja");
const mobilFtPretraga = document.querySelector("#mobil-ft-pretraga");
const mobilFtTema = document.querySelector("#mobil-ft-tema");
const mobilNavTraka = document.querySelector("#mobil-nav-traka");
const mobilNavRed = document.querySelector("#mobil-nav-red");
const mobilNavPrekidac = document.querySelector("#mobil-nav-prekidac");
const mobilNedPad = document.querySelector("#mobil-ned-pad");
const mobilNedSheet = document.querySelector("#mobil-ned-sheet");
const mobilNedLista = document.querySelector("#mobil-ned-lista");
const mobilKorSheet = document.querySelector("#mobil-kor-sheet");
const mobilKorLista = document.querySelector("#mobil-kor-lista");
const mobilKorSredina = document.querySelector("#mobil-kor-sredina");
const mobilPodesavanja = document.querySelector("#mobil-podesavanja");
const mobilOpcijeMesto = document.querySelector("#mobil-opcije-mesto");
const mobilPretraga = document.querySelector("#mobil-pretraga");
const mobilPretragaMesto = document.querySelector("#mobil-pretraga-mesto");
const mobilGradivoZaglavlje = document.querySelector("#mobil-gradivo-zaglavlje");
const searchForm = document.querySelector("#search-form");
const searchFormRoditelj = searchForm?.parentElement;
const koraciPanel = document.querySelector("#sekcija-koraci");
const casEl = document.querySelector("#cas");
const biracMesto = document.querySelector("#birac-mesto");
const naslovCasa = document.querySelector("#naslov-casa");
let posmatracBiraca = null;
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
const otvoreniPojmovi = new Set();
const otvoreneTeme = new Set();
const izborKoraka = new Map();
const lokalno = napraviStanje(localStorage);
const urediSadrzaj = napraviStanjeUredjivanja(dokument);
let pojmovi = [];
let aktivnaDefinicija = null;
let typeaheadIndeks = -1;
let sidroNava = 0;


function modPredavanja() {
  return document.documentElement.dataset.mod !== "samostalni";
}

function podrazumevaniDeo() {
  return modPredavanja() ? "diskusija" : "koraci";
}

function skalaFonta() {
  const vrednost = document.documentElement.style.getPropertyValue("--skala-fonta").trim();
  return SKALE_FONTA.includes(vrednost) ? vrednost : "1";
}

function sakrijPanelSelekcije() {
  if (!modPredavanja()) return;
  zatvoriMobilNav();
  zatvoriMobilIzborSheetove();
}

let cas = 1;
let uvod = false;
let deo = podrazumevaniDeo();
let navOtvoren = true;
let profilOtvoren = false;
let pretragaOtvorena = false;
let nedSheetOtvoren = false;
let korSheetOtvoren = false;
let mobilNavPrisilno = false;
const MOBIL_SKROL_PRAG = 28;
let skrolSidroTajmer = 0;
let dodirKoraka = null;
let dodirTeme = null;
let dodirSheet = null;
let animKoraka = 0;
let animTeme = 0;
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
  if (mobilFtTema) saIkonom(mobilFtTema, "calendar-days", "Tema");
  if (mobilFtPretraga) saIkonom(mobilFtPretraga, "search", "Pretraga");
  if (mobilFtPodesavanja) saIkonom(mobilFtPodesavanja, "menu", "Podešavanja");
  osveziOpcije();
}

function lecture() {
  return lectures.find((item) => item.n === cas);
}

function indeksKoraka() {
  if (korakPoCasu.has(cas)) return korakPoCasu.get(cas);
  const item = lecture();
  const poslednji = poslednjiKorak(lokalno.stanje(), cas);
  return item && poslednji < item.steps.length ? poslednji : 0;
}

function trenutniKorak() {
  const item = lecture();
  if (!item || !item.steps.length) return null;
  return item.steps[Math.min(indeksKoraka(), item.steps.length - 1)];
}

function kljucDiskusije() {
  return `${cas}:${rezervaPoCasu.get(cas) ? "rezerva" : "glavna"}`;
}

function zabeleziOtvoreno(i) {
  const stanje = lokalno.stanje();
  if (uvod) {
    if (!stanje.mesto.uvod) lokalno.promeni(zabeleziUvod);
    return;
  }
  const red = stanje.napredak[String(cas)];
  if (red && red.poslednji === i && red.vidjeni.includes(i) && stanje.mesto.tema === cas && !stanje.mesto.uvod) return;
  lokalno.promeni((sada) => zabeleziKorak(sada, cas, i));
}

function temaZavrsena(item) {
  const vidjeni = vidjeniKoraci(lokalno.stanje(), item.n);
  return item.steps.every((_, i) => vidjeni.includes(i));
}

function otvoriUvod() {
  uvod = true;
  if (location.hash !== "#uvod") location.hash = "uvod";
  else renderLecture();
}

function otvoriTemu(n, korak) {
  if (n < 1 || n > dokument.trajanjeTema) return;
  if (korak !== undefined) korakPoCasu.set(n, korak);
  if (uvod || n !== cas) deo = podrazumevaniDeo();
  uvod = false;
  cas = n;
  sakrijPanelSelekcije();
  if (location.hash !== `#cas-${n}`) location.hash = `cas-${n}`;
  else renderLecture();
}

function redTeme(n) {
  return nav.querySelector(`.tema-red[data-n="${n}"]`);
}

function prvaVidljivaTema() {
  const vrh = nav.getBoundingClientRect().top;
  const red = [...nav.querySelectorAll(".tema-red")].find((dugme) => dugme.getBoundingClientRect().bottom > vrh);
  return red ? Number(red.dataset.n) : 0;
}

function odmakOdVrha(n) {
  const red = redTeme(n);
  return red ? red.getBoundingClientRect().top - nav.getBoundingClientRect().top : null;
}

function paintNav() {
  const sidro = sidroNava || prvaVidljivaTema();
  sidroNava = 0;
  const odmak = odmakOdVrha(sidro);
  const skrol = nav.scrollTop;
  crtajNav();
  nav.scrollTop = skrol;
  const posle = odmakOdVrha(sidro);
  if (odmak !== null && posle !== null) nav.scrollTop += posle - odmak;
}

function crtajNav() {
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
  const uvodDugme = document.createElement("button");
  uvodDugme.type = "button";
  uvodDugme.className = "uvod-red";
  uvodDugme.textContent = "Uvod";
  if (uvod) uvodDugme.setAttribute("aria-current", "page");
  uvodDugme.addEventListener("click", () => otvoriUvod());
  nav.append(uvodDugme);
  for (const item of lectures) {
    const otvoren = !uvod && (item.n === cas || otvoreneTeme.has(item.n));
    const dugme = document.createElement("button");
    dugme.type = "button";
    dugme.className = "tema-red";
    dugme.dataset.n = String(item.n);
    if (!uvod && item.n === cas) dugme.setAttribute("aria-current", "page");
    dugme.setAttribute("aria-expanded", String(otvoren));
    const kvaka = ikonica(temaZavrsena(item) ? "check-circle" : "circle");
    const ime = document.createElement("span");
    ime.textContent = `Tema ${item.n} — ${item.title}`;
    const pod = document.createElement("small");
    pod.textContent = item.podnaslov;
    const tekst = document.createElement("span");
    tekst.append(ime, pod);
    const strela = ikonica(otvoren ? "chevron-up" : "chevron-down");
    if (kvaka) dugme.append(kvaka);
    dugme.append(tekst);
    if (strela) dugme.append(strela);
    dugme.addEventListener("click", () => {
      if (uvod) {
        otvoriTemu(item.n);
        return;
      }
      if (item.n === cas) return;
      if (otvoreneTeme.has(item.n)) otvoreneTeme.delete(item.n);
      else otvoreneTeme.add(item.n);
      sidroNava = item.n;
      paintNav();
    });
    nav.append(dugme);
    if (!otvoren) continue;
    const lista = document.createElement("ol");
    lista.className = "tema-koraci";
    item.steps.forEach((korak, ki) => {
      const stavka = document.createElement("li");
      const korakDugme = document.createElement("button");
      korakDugme.type = "button";
      korakDugme.className = "korak-red";
      korakDugme.textContent = `${ki + 1} ${korak.naslov}`;
      if (item.n === cas && ki === indeksKoraka()) korakDugme.setAttribute("aria-current", "page");
      korakDugme.addEventListener("click", () => {
        sidroNava = item.n;
        otvoriTemu(item.n, ki);
      });
      stavka.append(korakDugme);
      lista.append(stavka);
    });
    nav.append(lista);
  }
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
  prikaziMobilFooter();
}

function otvoriDeo(ime) {
  deo = ime;
  if (usko()) zatvoriMobilSheetove();
  prikaziDeo();
}

function usko() {
  return window.matchMedia("(max-width: 860px)").matches;
}

function zatvoriMobilNav() {
  if (!navOtvoren) return;
  navOtvoren = false;
  prikaziNav();
}

function zatvoriMobilProfil() {
  if (!profilOtvoren) return;
  profilOtvoren = false;
  prikaziMobilProfil();
}

function zatvoriMobilPretragu() {
  if (!pretragaOtvorena) return;
  pretragaOtvorena = false;
  prikaziMobilPretragu();
}

function zatvoriMobilSheetove() {
  zatvoriMobilNav();
  zatvoriMobilProfil();
  zatvoriMobilPretragu();
  zatvoriMobilIzborSheetove();
}

function prikaziMobilProfil() {
  const mobil = usko();
  if (!mobil) profilOtvoren = false;
  document.body.classList.toggle("mobil-profil-otvoren", mobil && profilOtvoren);
  if (mobilPodesavanja) mobilPodesavanja.hidden = !(mobil && profilOtvoren);
  if (mobilFtPodesavanja) mobilFtPodesavanja.setAttribute("aria-expanded", String(profilOtvoren));
  osveziMobilZavesu();
}

function prikaziMobilPretragu() {
  const mobil = usko();
  if (!mobil) pretragaOtvorena = false;
  document.body.classList.toggle("mobil-pretraga-otvoren", mobil && pretragaOtvorena);
  if (mobilPretraga) mobilPretraga.hidden = !(mobil && pretragaOtvorena);
  if (mobilFtPretraga) mobilFtPretraga.setAttribute("aria-expanded", String(pretragaOtvorena));
  if (searchForm && searchFormRoditelj && mobilPretragaMesto) {
    if (mobil && pretragaOtvorena) {
      mobilPretragaMesto.append(searchForm);
      window.setTimeout(() => q?.focus(), 60);
    } else if (searchForm.parentElement === mobilPretragaMesto) {
      searchFormRoditelj.append(searchForm);
    }
  }
  osveziMobilZavesu();
}

function osveziMobilZavesu() {
  const mobil = usko();
  const otvoren = mobil && (navOtvoren || profilOtvoren || pretragaOtvorena || nedSheetOtvoren || korSheetOtvoren);
  if (mobilZavesa) {
    mobilZavesa.hidden = !otvoren;
    mobilZavesa.setAttribute("aria-hidden", String(!otvoren));
    mobilZavesa.tabIndex = otvoren ? 0 : -1;
  }
}

function zatvoriMobilIzborSheetove() {
  if (!nedSheetOtvoren && !korSheetOtvoren) return;
  nedSheetOtvoren = false;
  korSheetOtvoren = false;
  if (mobilFtTema) mobilFtTema.setAttribute("aria-expanded", "false");
  prikaziMobilIzborSheetove();
}

function prikaziMobilIzborSheetove() {
  const mobil = usko();
  if (!mobil) {
    nedSheetOtvoren = false;
    korSheetOtvoren = false;
  }
  document.body.classList.toggle("mobil-ned-sheet-otvoren", mobil && nedSheetOtvoren);
  document.body.classList.toggle("mobil-kor-sheet-otvoren", mobil && korSheetOtvoren);
  if (mobilNedSheet) mobilNedSheet.hidden = !(mobil && nedSheetOtvoren);
  if (mobilKorSheet) mobilKorSheet.hidden = !(mobil && korSheetOtvoren);
  if (mobilNedPad) mobilNedPad.setAttribute("aria-expanded", String(nedSheetOtvoren));
  if (mobilKorSredina) mobilKorSredina.setAttribute("aria-expanded", String(korSheetOtvoren));
  osveziMobilZavesu();
}

function otvoriMobilNedSheet() {
  zatvoriMobilProfil();
  zatvoriMobilPretragu();
  zatvoriMobilNav();
  korSheetOtvoren = false;
  nedSheetOtvoren = true;
  if (mobilFtTema) mobilFtTema.setAttribute("aria-expanded", "true");
  prikaziMobilIzborSheetove();
}

function otvoriMobilKorSheet() {
  zatvoriMobilProfil();
  zatvoriMobilPretragu();
  zatvoriMobilNav();
  nedSheetOtvoren = false;
  korSheetOtvoren = true;
  prikaziMobilIzborSheetove();
}

function prebaciMobilNedSheet() {
  if (nedSheetOtvoren) zatvoriMobilIzborSheetove();
  else otvoriMobilNedSheet();
}

function prebaciMobilKorSheet() {
  if (korSheetOtvoren) zatvoriMobilIzborSheetove();
  else otvoriMobilKorSheet();
}

function zatvoriMobilPadMenije() {
  zatvoriMobilIzborSheetove();
}

function prikaziMobilFooter() {
  const mobil = usko();
  if (mobilFooter) mobilFooter.hidden = !mobil;
  if (mobilNavTraka) mobilNavTraka.hidden = !mobil;
  if (mobilNavRed) mobilNavRed.hidden = !mobil;
  if (mobilNavPrekidac) mobilNavPrekidac.hidden = !mobil;
  if (!mobil) {
    mobilNavPrisilno = false;
    zatvoriMobilPadMenije();
    document.body.classList.remove("mobil-glava-skupljena", "mobil-nav-prisilno");
    clearTimeout(skrolSidroTajmer);
    document.documentElement.style.overflowAnchor = "";
  } else osveziMobilGlavaSkrol();
  document.body.classList.toggle("mobil-segment-vidljiv", mobil);
}

function ugasiSkrolSidro() {
  document.documentElement.style.overflowAnchor = "none";
  clearTimeout(skrolSidroTajmer);
  skrolSidroTajmer = setTimeout(() => {
    document.documentElement.style.overflowAnchor = "";
  }, 450);
}

function osveziMobilGlavaSkrol() {
  if (!usko()) return;
  const skrol = window.scrollY || document.documentElement.scrollTop || 0;
  if (skrol <= MOBIL_SKROL_PRAG) mobilNavPrisilno = false;
  const skupljeno = skrol > MOBIL_SKROL_PRAG && !mobilNavPrisilno;
  if (skupljeno !== document.body.classList.contains("mobil-glava-skupljena")) ugasiSkrolSidro();
  document.body.classList.toggle("mobil-glava-skupljena", skupljeno);
  document.body.classList.toggle("mobil-nav-prisilno", mobilNavPrisilno);
  if (mobilNavPrekidac) {
    const redVidljiv = !skupljeno || mobilNavPrisilno;
    mobilNavPrekidac.setAttribute("aria-expanded", String(redVidljiv));
    mobilNavPrekidac.setAttribute("aria-pressed", String(redVidljiv));
  }
}

function osveziMobilTemu(item) {
  const broj = `Tema ${item.n} od ${dokument.trajanjeTema}`;
  const naslov = item.title;
  const pod = item.podnaslov || "";
  for (const [idBroj, idNaslov, idPod] of [["#mobil-tema-broj", "#mobil-tema-naslov", "#mobil-tema-podnaslov"]]) {
    const elBroj = document.querySelector(idBroj);
    const elNaslov = document.querySelector(idNaslov);
    const elPod = document.querySelector(idPod);
    if (elBroj) elBroj.textContent = broj;
    if (elNaslov) elNaslov.textContent = naslov;
    if (elPod) elPod.textContent = pod;
  }
  document.body.classList.toggle("mobil-tema-prva", cas <= 1);
  document.body.classList.toggle("mobil-tema-poslednja", cas >= dokument.trajanjeTema);
}

function dvocifren(broj) {
  return String(broj).padStart(2, "0");
}

function osveziMobilNavTraka(item, i) {
  if (!mobilNavTraka || !usko()) return;
  const brojNed = document.querySelector("#mobil-ned-broj");
  const naslovNed = document.querySelector("#mobil-ned-naslov");
  const glavaKor = document.querySelector("#mobil-kor-glava");
  const metaNedSheet = document.querySelector("#mobil-ned-sheet-meta");
  const metaKorSheet = document.querySelector("#mobil-kor-sheet-meta");
  const naslovKorSheet = document.querySelector("#mobil-kor-sheet-naslov");
  if (brojNed) brojNed.textContent = `${item.n}.`;
  if (naslovNed) naslovNed.textContent = item.title;
  if (glavaKor) glavaKor.textContent = `${i + 1} / ${item.steps.length}`;
  if (metaNedSheet) metaNedSheet.textContent = `${dokument.trajanjeTema} tema`;
  if (metaKorSheet) metaKorSheet.textContent = `${item.steps.length} koraka`;
  if (naslovKorSheet) naslovKorSheet.textContent = `Koraci — Tema ${item.n}`;
  const korNazad = document.querySelector("#mobil-kor-nazad");
  const korNapred = document.querySelector("#mobil-kor-napred");
  if (korNazad) korNazad.disabled = i === 0;
  if (korNapred) korNapred.disabled = i >= item.steps.length - 1;
  document.body.classList.toggle("mobil-tema-prva", cas <= 1);
  document.body.classList.toggle("mobil-tema-poslednja", cas >= dokument.trajanjeTema);
  if (mobilNedLista) {
    mobilNedLista.replaceChildren();
    for (const lekcija of lectures) {
      const li = document.createElement("li");
      const dugme = document.createElement("button");
      dugme.type = "button";
      dugme.className = "mobil-izbor-stavka";
      dugme.setAttribute("role", "option");
      if (!uvod && lekcija.n === cas) {
        dugme.setAttribute("aria-selected", "true");
        dugme.classList.add("mobil-izbor-stavka-aktivna");
      }
      const krug = document.createElement("span");
      krug.className = "mobil-izbor-krug";
      krug.textContent = String(lekcija.n);
      const sredina = document.createElement("span");
      sredina.className = "mobil-izbor-sredina";
      const naslov = document.createElement("span");
      naslov.className = "mobil-izbor-naslov";
      naslov.textContent = lekcija.title;
      const { vidjeno, ukupno } = popunaKoraka(vidjeniKoraci(lokalno.stanje(), lekcija.n), lekcija.steps.length);
      const traka = document.createElement("span");
      traka.className = "mobil-izbor-napredak";
      traka.setAttribute("aria-hidden", "true");
      const punjenje = document.createElement("span");
      punjenje.style.width = ukupno ? `${(100 * vidjeno) / ukupno}%` : "0%";
      traka.append(punjenje);
      sredina.append(naslov, traka);
      const desno = document.createElement("span");
      desno.className = "mobil-izbor-desno";
      const metaBroj = document.createElement("span");
      metaBroj.className = "mobil-izbor-meta-broj";
      metaBroj.textContent = `${vidjeno} / ${ukupno}`;
      desno.append(metaBroj, ikonica("chevron-right"));
      dugme.append(krug, sredina, desno);
      dugme.addEventListener("click", () => {
        if (lekcija.n !== cas || uvod) otvoriTemu(lekcija.n);
        else sakrijPanelSelekcije();
      });
      li.append(dugme);
      mobilNedLista.append(li);
    }
  }
  if (mobilKorLista) {
    mobilKorLista.replaceChildren();
    const vidjeniOve = vidjeniKoraci(lokalno.stanje(), cas);
    item.steps.forEach((korakNed, ki) => {
      const vidjen = vidjeniOve.includes(ki);
      const li = document.createElement("li");
      const dugme = document.createElement("button");
      dugme.type = "button";
      dugme.className = "mobil-izbor-stavka";
      dugme.setAttribute("role", "option");
      if (ki === i) {
        dugme.setAttribute("aria-selected", "true");
        dugme.classList.add("mobil-izbor-stavka-aktivna");
      }
      const krug = document.createElement("span");
      krug.className = "mobil-izbor-krug";
      krug.textContent = String(ki + 1);
      const sredina = document.createElement("span");
      sredina.className = "mobil-izbor-sredina";
      const naslov = document.createElement("span");
      naslov.className = "mobil-izbor-naslov";
      naslov.textContent = korakNed.naslov;
      sredina.append(naslov);
      const desno = document.createElement("span");
      desno.className = "mobil-izbor-desno";
      if (vidjen && ki !== i) desno.append(ikonica("check"));
      else if (ki === i) desno.append(ikonica("circle-dot"));
      else desno.append(ikonica("chevron-right"));
      dugme.append(krug, sredina, desno);
      dugme.addEventListener("click", () => {
        if (ki !== i) {
          korakPoCasu.set(cas, ki);
          renderLecture();
        }
        sakrijPanelSelekcije();
      });
      li.append(dugme);
      mobilKorLista.append(li);
    });
  }
  if (modPredavanja()) zatvoriMobilIzborSheetove();
}

function pomeriTemuPrstom(dx) {
  if (!usko()) return false;
  const sledeca = pomeriTemu(cas, dx < 0 ? 1 : -1, dokument.trajanjeTema);
  if (sledeca === cas) return false;
  animTeme = dx < 0 ? 1 : -1;
  otvoriTemu(sledeca);
  return true;
}

function pomeriKorakPrstom(dx) {
  const item = lectures.find((lekcija) => lekcija.n === cas);
  if (!item || deo !== "koraci" || !usko()) return false;
  const i = indeksKoraka();
  if (dx < 0 && i < item.steps.length - 1) {
    korakPoCasu.set(cas, i + 1);
    animKoraka = 1;
    sakrijPanelSelekcije();
    renderLecture();
    return true;
  }
  if (dx > 0 && i > 0) {
    korakPoCasu.set(cas, i - 1);
    animKoraka = -1;
    sakrijPanelSelekcije();
    renderLecture();
    return true;
  }
  return false;
}

function prikaziNav() {
  const mobil = usko();
  document.body.classList.toggle("mobil", mobil);
  if (mobil) {
    document.body.classList.remove("nav-skriven");
    document.body.classList.toggle("mobil-nav-otvoren", navOtvoren);
    osveziMobilZavesu();
  } else {
    document.body.classList.remove("mobil-nav-otvoren");
    document.body.classList.toggle("nav-skriven", !navOtvoren);
    zatvoriMobilProfil();
    zatvoriMobilPretragu();
    if (mobilZavesa) {
      mobilZavesa.hidden = true;
      mobilZavesa.setAttribute("aria-hidden", "true");
      mobilZavesa.tabIndex = -1;
    }
  }
  navPreklop.setAttribute("aria-expanded", String(navOtvoren));
  navPreklop.setAttribute("aria-label", navOtvoren ? "Sakrij navigaciju" : "Prikaži navigaciju");
  prikaziMobilFooter();
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

function cvorDelova(delovi) {
  const frag = document.createDocumentFragment();
  for (const deo of delovi) {
    const unutra = fragmentTeksta(deo.tekst);
    if (deo.jako) {
      const jako = document.createElement("strong");
      jako.append(unutra);
      frag.append(jako);
    } else if (deo.kod) {
      const kod = document.createElement("code");
      kod.append(unutra);
      frag.append(kod);
    } else {
      frag.append(unutra);
    }
  }
  return frag;
}

function cvoroviPasusa(tekst) {
  const izvor = tekst || "";
  const blokovi = blokoviProze(izvor);
  const obican = blokovi.length === 1
    && blokovi[0].vrsta === "pasus"
    && blokovi[0].delovi.length === 1
    && !blokovi[0].delovi[0].jako
    && !blokovi[0].delovi[0].kod
    && blokovi[0].delovi[0].tekst === izvor;
  if (obican) {
    const p = document.createElement("p");
    p.append(fragmentTeksta(izvor));
    return [p];
  }
  return blokovi.map((blok) => {
    if (blok.vrsta === "naslov") {
      const nivo = Math.min(4, Math.max(2, blok.nivo));
      const naslov = document.createElement(`h${nivo}`);
      naslov.append(cvorDelova(blok.delovi));
      return naslov;
    }
    if (blok.vrsta === "lista" || blok.vrsta === "brojna") {
      const lista = document.createElement(blok.vrsta === "brojna" ? "ol" : "ul");
      for (const stavka of blok.stavke) {
        const li = document.createElement("li");
        li.append(cvorDelova(stavka));
        lista.append(li);
      }
      return lista;
    }
    if (blok.vrsta === "tabela") {
      const tabela = document.createElement("table");
      tabela.className = "proza-tabela";
      const glava = document.createElement("thead");
      const glavaRed = document.createElement("tr");
      for (const celija of blok.zaglavlje) {
        const th = document.createElement("th");
        th.append(cvorDelova(celija));
        glavaRed.append(th);
      }
      glava.append(glavaRed);
      const telo = document.createElement("tbody");
      for (const red of blok.redovi) {
        const tr = document.createElement("tr");
        for (const celija of red) {
          const td = document.createElement("td");
          td.append(cvorDelova(celija));
          tr.append(td);
        }
        telo.append(tr);
      }
      tabela.append(glava, telo);
      return tabela;
    }
    const p = document.createElement("p");
    p.append(cvorDelova(blok.delovi));
    return p;
  });
}

function cvoroviProze(tekst, dijagrami) {
  if (!imaMermaid(tekst)) return cvoroviPasusa(tekst);
  const cvorovi = [];
  for (const blok of blokoviTeksta(tekst)) {
    if (blok.vrsta === "tekst") {
      cvorovi.push(...cvoroviPasusa(blok.tekst));
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
    otvoreneTeme.clear();
    for (const n of lekcije.teme) otvoreneTeme.add(n);
    if (lekcije.prvi) otvoriTemu(lekcije.prvi.tema, lekcije.prvi.korak);
    else renderLecture();
    return;
  }
  otvoriTemu(stavka.tema, stavka.korak);
}

function prikazMermaida(blok, dijagrami, crtez) {
  const kartica = document.createElement("figure");
  kartica.className = "isecak isecak-mermaid";
  const glava = document.createElement("header");
  const naslov = document.createElement("span");
  saIkonom(naslov, ikonaSekcije(blok), natpisSekcije(blok));
  glava.append(naslov);
  const figura = document.createElement("div");
  figura.className = "figura figura-mermaid";
  const izvor = izvorMermaida(blok.tekst);
  const crtezOdgovara = crtez && blok.veza === "figura" && izvor.trim() === mermaidFigura(crtez).trim();
  if (crtezOdgovara) void nacrtajFiguru(figura, crtez);
  else if (izvor.trim()) dijagrami.push([figura, izvor]);
  else {
    const prazno = document.createElement("p");
    prazno.className = "meta";
    prazno.textContent = placeholderSekcije(blok);
    figura.append(prazno);
  }
  kartica.append(glava, figura);
  return kartica;
}

function nacrtajTekstBloka(tekst, naslovTekst, ikona = "file-text") {
  const blok = document.createElement("section");
  blok.className = ikona === "book-open" ? "isecak isecak-knjiga" : "isecak";
  const glava = document.createElement("header");
  const naslov = document.createElement("span");
  saIkonom(naslov, ikona, naslovTekst);
  glava.append(naslov);
  const pre = document.createElement("pre");
  pre.textContent = tekst;
  blok.append(glava, pre);
  return blok;
}

function placeholderSekcije(blok) {
  if (blok.vrsta === "pitanje") return "Tekst pitanja.";
  if (blok.vrsta === "tekst") return "Markdown: pasusi, **podebljano**, `kod`, spiskovi, ```mermaid.";
  if (blok.vrsta === "highlight" && blok.uloga === "kljucna") return "Jedna kratka ključna ideja.";
  if (blok.vrsta === "highlight") return "Tekst highlighta.";
  if (blok.vrsta === "dijagram") return "Tekstualni dijagram.";
  if (blok.vrsta === "mermaid") return "Mermaid izvor, na primer flowchart LR.";
  return "Kod ove sekcije.";
}

function prazneOpcije() {
  return [
    { key: "A", text: "", ok: false, why: "" },
    { key: "B", text: "", ok: true, why: "" },
  ];
}

function uredjivacPitanja(blok, vezi) {
  const izbor = blok.oblik === "izbor";
  const pitanje = izbor
    ? napraviEditorKratkog(blok.tekst || "", { opis: "tekst pitanja" }, (vrednost) => {
        blok.tekst = vrednost;
      })
    : napraviEditorTeksta(blok.tekst || "", { redovi: 3, placeholder: "Pitanje" }, { opis: "tekst pitanja" });
  const odgovor = izbor
    ? null
    : napraviEditorTeksta(
        blok.odgovor || "",
        { redovi: 4, placeholder: "Odgovor koji otvara sijalica." },
        { opis: "odgovor" }
      );
  const opcije = izbor
    ? napraviEditorOpcija(Array.isArray(blok.opcije) && blok.opcije.length >= 2 ? blok.opcije : prazneOpcije(), {
        opis: "odgovore pitanja",
      })
    : null;
  const analiza = napraviEditorTeksta(
    blok.analiza || "",
    { redovi: 4, placeholder: "Obrazloženje pitalice za nastavnika." },
    { opis: "obrazloženje" }
  );
  const wrap = document.createElement("div");
  wrap.className = "uredjivi-editor-pitalica";
  wrap.append(natpisPolja("Pitanje", pitanje.telo));
  if (odgovor) wrap.append(natpisPolja("Odgovor", odgovor.telo));
  if (opcije) wrap.append(opcije.telo);
  wrap.append(natpisPolja("Obrazloženje", analiza.telo));
  const upisiPitanje = (vrednost) => {
    blok.tekst = vrednost;
  };
  const upisiOdgovor = (vrednost) => {
    if (vrednost) blok.odgovor = vrednost;
    else delete blok.odgovor;
  };
  const upisiAnalizu = (vrednost) => {
    if (vrednost) blok.analiza = vrednost;
    else delete blok.analiza;
  };
  return {
    telo: wrap,
    opis: natpisSekcije(blok),
    promenjeno: () =>
      pitanje.promenjeno() ||
      (odgovor ? odgovor.promenjeno() : false) ||
      (opcije ? opcije.promenjeno() : false) ||
      analiza.promenjeno(),
    primeni() {
      if (izbor) pitanje.primeni();
      else pitanje.primeni(upisiPitanje);
      if (odgovor) odgovor.primeni(upisiOdgovor);
      if (opcije) {
        if (!Array.isArray(blok.opcije)) blok.opcije = [];
        opcije.primeni(blok.opcije);
      }
      analiza.primeni(upisiAnalizu);
      vezi();
    },
    ponisti() {
      if (izbor) pitanje.ponisti();
      else pitanje.ponisti(upisiPitanje);
      if (odgovor) odgovor.ponisti(upisiOdgovor);
      if (opcije) {
        if (!Array.isArray(blok.opcije)) blok.opcije = [];
        opcije.ponisti(blok.opcije);
      }
      analiza.ponisti(upisiAnalizu);
      vezi();
    },
  };
}

function editorNaslovaITeksta(blok, placeholder) {
  let naslov = blok.naslov || "";
  let tekst = blok.tekst || "";
  const pocetniNaslov = naslov;
  const pocetniTekst = tekst;
  const omot = document.createElement("div");
  omot.className = "sekcija-polja";
  omot.append(
    poljeKratko(naslov, (vrednost) => {
      naslov = vrednost;
    }),
    poljeTeksta(tekst, { redovi: 4, placeholder }, (vrednost) => {
      tekst = vrednost;
    })
  );
  return {
    telo: omot,
    opis: natpisSekcije(blok),
    promenjeno: () => naslov !== pocetniNaslov || tekst !== pocetniTekst,
    primeni() {
      blok.naslov = naslov;
      blok.tekst = tekst;
    },
    ponisti() {
      blok.naslov = pocetniNaslov;
      blok.tekst = pocetniTekst;
      naslov = pocetniNaslov;
      tekst = pocetniTekst;
    },
  };
}

function uredjivacKoda(blok, vezi) {
  const sacuvan = String(blok.naslov || "");
  let naslov = naslovKoda(blok);
  let tekst = blok.tekst || "";
  const pocetniNaslov = naslov;
  const pocetniTekst = tekst;
  const naslovPolje = poljeKratko(naslov, (vrednost) => {
    naslov = vrednost;
  });
  naslovPolje.placeholder = "Naslov, nije obavezan";
  naslovPolje.setAttribute("aria-label", "Naslov koda");
  const kodPolje = poljeTeksta(tekst, { redovi: 6, kod: true, placeholder: placeholderSekcije(blok) }, (vrednost) => {
    tekst = vrednost;
  });
  const omot = document.createElement("div");
  omot.className = "sekcija-polja";
  omot.append(natpisPolja("Naslov", naslovPolje), kodPolje);
  return {
    telo: omot,
    opis: "Kod",
    promenjeno: () => naslov !== pocetniNaslov || tekst !== pocetniTekst,
    primeni() {
      const cist = naslov.trim();
      if (cist && cist !== "Mali eksperiment") blok.naslov = cist;
      else delete blok.naslov;
      blok.tekst = tekst;
      vezi();
    },
    ponisti() {
      naslov = pocetniNaslov;
      tekst = pocetniTekst;
      naslovPolje.value = pocetniNaslov;
      kodPolje.value = pocetniTekst;
      if (sacuvan.trim()) blok.naslov = sacuvan;
      else delete blok.naslov;
      blok.tekst = pocetniTekst;
      vezi();
    },
  };
}

function uredjivacSekcije(sirovi, blok, vezi) {
  if (blok.vrsta === "pitanje") return uredjivacPitanja(blok, vezi);
  if (blok.vrsta === "highlight" && blok.uloga !== "kljucna") {
    const editor = editorNaslovaITeksta(blok, placeholderSekcije(blok));
    const primeni = editor.primeni.bind(editor);
    const ponisti = editor.ponisti.bind(editor);
    editor.primeni = () => {
      primeni();
      vezi();
    };
    editor.ponisti = () => {
      ponisti();
      vezi();
    };
    return editor;
  }
  if (blok.vrsta === "kod") return uredjivacKoda(blok, vezi);
  const kod = blok.vrsta === "dijagram" || blok.vrsta === "mermaid";
  const editor = napraviEditorTeksta(
    blok.tekst || "",
    { redovi: blok.vrsta === "tekst" ? 8 : 6, kod, placeholder: placeholderSekcije(blok) },
    { opis: natpisSekcije(blok) }
  );
  return veziTekst(editor, (vrednost) => {
    blok.tekst = vrednost;
    vezi();
  });
}

function prikazTekstSekcije(blok, dijagrami, prviTekst) {
  const prikaz = document.createElement("div");
  prikaz.className = blok.veza === "prica" ? "lekcija-tekst prica-koraka" : "lekcija-tekst";
  if (prviTekst && !urediSadrzaj.aktivan) {
    const gradivoUputa = document.createElement("p");
    gradivoUputa.className = "meta gradivo-uputa";
    gradivoUputa.textContent = "Tekst lekcije za samostalno učenje. Na času prvo tab Diskusija.";
    prikaz.append(gradivoUputa);
  }
  if (blok.tekst) prikaz.append(...cvoroviProze(blok.tekst, dijagrami));
  else if (urediSadrzaj.aktivan) {
    const prazno = document.createElement("p");
    prazno.className = "kljucna-prazno";
    prazno.textContent = placeholderSekcije(blok);
    prikaz.append(prazno);
  }
  return prikaz;
}

function prikazHighlighta(blok, dijagrami) {
  const kljucna = blok.uloga === "kljucna";
  const telo = document.createElement("div");
  const tekst = blok.tekst || (urediSadrzaj.aktivan && kljucna ? "Upišite jednu jasnu misao koju student pamti posle ovog koraka." : "");
  if (!blok.tekst && urediSadrzaj.aktivan) telo.className = "kljucna-prazno";
  if (tekst) telo.append(...cvoroviProze(tekst, dijagrami));
  else if (urediSadrzaj.aktivan) telo.textContent = placeholderSekcije(blok);
  return telo;
}

function veziListu(sirovi, lista, polje) {
  return () => {
    materijalizuj(sirovi, lista, polje);
    if (polje === "diskusija") uskladiDiskusiju(sirovi);
    else uskladiNasledjenaPolja(sirovi);
  };
}

function stavkaSaIkonom(ikonaIme, natpis, onClick, klasa = "") {
  const dugme = document.createElement("button");
  dugme.type = "button";
  dugme.setAttribute("role", "menuitem");
  dugme.className = klasa ? `sekcija-vrsta ${klasa}` : "sekcija-vrsta";
  saIkonom(dugme, ikonaIme, natpis);
  dugme.addEventListener("click", (dogadjaj) => {
    dogadjaj.stopPropagation();
    onClick();
  });
  return dugme;
}

function meniVrsta(dugme, onIzbor, vrste = VRSTE_SEKCIJE) {
  const panel = document.createElement("div");
  panel.className = "meni-pitanja sekcija-meni";
  panel.hidden = true;
  panel.setAttribute("role", "menu");
  const dugmad = vrste.map((vrsta) => stavkaSaIkonom(vrsta.ikona, vrsta.natpis, () => onIzbor(vrsta), "sekcija-vrsta"));
  panel.append(...dugmad);
  const omot = document.createElement("div");
  omot.className = "sekcija-meni-omot";
  omot.append(dugme, panel);
  napraviPadajucu({ dugme, panel, stavke: () => dugmad });
  return omot;
}

function kljucBloka(prefiks, blok) {
  return kljucPolja(cas, indeksKoraka(), `${prefiks}:${blok.id}`);
}

function bezOlovke() {
  return { umestoOlovke: () => null };
}

function idPitanja(blok) {
  return `${cas}:${indeksKoraka()}:${blok.id}`;
}

function prikazPitanja(blok) {
  const kljuc = idPitanja(blok);
  const otvoreno = objasnjenjePoKoraku.get(kljuc) === true;
  const izbor = blok.oblik === "izbor";
  const odgovor = blok.odgovor || "";
  const pitanjeUnutra = document.createElement("section");
  pitanjeUnutra.className = "pitanje-blok";
  const pitanje = document.createElement("h3");
  if (blok.tekst) pitanje.append(fragmentTeksta(blok.tekst));
  else if (urediSadrzaj.aktivan) {
    const prazno = document.createElement("span");
    prazno.className = "meta";
    prazno.textContent = "Novo pitanje";
    pitanje.append(prazno);
  }
  const mozeOtvoriti = izbor ? true : Boolean(odgovor);
  const red = document.createElement("div");
  red.className = mozeOtvoriti ? "pitanje-red otkriva" : "pitanje-red";
  if (mozeOtvoriti && otvoreno) red.classList.add("otvoreno");
  const znak = ikonica("question");
  if (znak) {
    const omotZnaka = document.createElement("span");
    omotZnaka.className = "pitanje-znak";
    omotZnaka.setAttribute("aria-hidden", "true");
    omotZnaka.append(znak);
    red.append(omotZnaka);
  }
  red.append(pitanje);
  const domId = `pitanje-okidac-${cas}-${indeksKoraka()}-${String(blok.id).replace(/[^a-z0-9_-]/gi, "-")}`;
  if (mozeOtvoriti) {
    const lampica = document.createElement("span");
    lampica.className = "odgovor-ikona";
    lampica.setAttribute("aria-hidden", "true");
    const sijalica = ikonica("lightbulb");
    if (sijalica) lampica.append(sijalica);
    red.append(lampica);
    const okidac = document.createElement("button");
    okidac.type = "button";
    okidac.id = domId;
    okidac.className = "pitanje-okidac";
    okidac.setAttribute("aria-expanded", String(otvoreno));
    okidac.setAttribute("aria-label", otvoreno ? "Sakrij odgovor" : "Prikaži odgovor");
    red.append(okidac);
    red.addEventListener("click", (e) => {
      if (e.target.closest(".pojam-crta")) return;
      objasnjenjePoKoraku.set(kljuc, !otvoreno);
      renderLecture();
      document.getElementById(domId)?.focus();
    });
  }
  pitanjeUnutra.append(red);
  const vidi = otvoreno || urediSadrzaj.aktivan;
  if (!izbor && vidi) {
    const telo = document.createElement("div");
    telo.id = `odgovor-${domId}`;
    telo.className = odgovor ? "odgovor-tekst" : "odgovor-tekst meta";
    if (mozeOtvoriti) red.querySelector(".pitanje-okidac")?.setAttribute("aria-controls", telo.id);
    if (odgovor) telo.append(...cvoroviPasusa(odgovor));
    else telo.textContent = "Nema odgovora.";
    pitanjeUnutra.append(telo);
  }
  if (izbor && vidi) {
    const kratke = document.createElement("div");
    kratke.className = "opcije-mreza";
    kratke.dataset.kviz = "korak";
    const izabran = izborKoraka.get(kljuc) || "";
    for (const opt of blok.opcije || []) {
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
        izborKoraka.set(kljuc, opt.key);
        renderLecture();
      });
      kratke.append(button);
    }
    pitanjeUnutra.append(kratke);
    if (blok.analiza) {
      pitanjeUnutra.append(nacrtajTekstBloka(blok.analiza, "Obrazloženje pitalice", "book-open"));
    } else if (urediSadrzaj.aktivan) {
      const prazno = document.createElement("p");
      prazno.className = "meta";
      prazno.textContent = "Nema obrazloženja — dodajte ga kroz Uredi.";
      pitanjeUnutra.append(prazno);
    }
  }
  return pitanjeUnutra;
}

function teloSekcije(sirovi, blok, dijagrami, prviTekst, vezi, prefiks, crtez) {
  const id = kljucBloka(prefiks, blok);
  if (blok.vrsta === "pitanje") {
    return omotUredjivog(urediSadrzaj, id, prikazPitanja(blok), () => uredjivacSekcije(sirovi, blok, vezi), bezOlovke());
  }
  if (blok.vrsta === "highlight") {
    const kljucna = blok.uloga === "kljucna";
    const okvir = document.createElement("aside");
    okvir.className = kljucna ? "kljucna" : "highlight";
    const znak = document.createElement("span");
    znak.className = "highlight-ikona";
    const ikona = ikonica(ikonaSekcije(blok));
    if (ikona) znak.append(ikona);
    const telo = document.createElement("div");
    telo.className = "highlight-sadrzaj";
    if (!kljucna) {
      const naslov = document.createElement("strong");
      naslov.textContent = natpisSekcije(blok);
      telo.append(naslov);
    }
    telo.append(omotUredjivog(urediSadrzaj, id, prikazHighlighta(blok, dijagrami), () => uredjivacSekcije(sirovi, blok, vezi), bezOlovke()));
    okvir.append(znak, telo);
    return okvir;
  }
  if (blok.vrsta === "tekst") {
    return omotUredjivog(urediSadrzaj, id, prikazTekstSekcije(blok, dijagrami, prviTekst), () => uredjivacSekcije(sirovi, blok, vezi), bezOlovke());
  }
  if (blok.vrsta === "mermaid") {
    return omotUredjivog(urediSadrzaj, id, prikazMermaida(blok, dijagrami, crtez), () => uredjivacSekcije(sirovi, blok, vezi), bezOlovke());
  }
  const natpis = blok.vrsta === "kod" ? naslovKoda(blok) : natpisSekcije(blok);
  const kartica = nacrtajTekstBloka(blok.tekst || "", natpis, ikonaSekcije(blok));
  if (blok.vrsta === "kod" && !natpis) {
    const znak = kartica.querySelector("header span");
    znak?.setAttribute("role", "img");
    znak?.setAttribute("aria-label", "Kod");
  }
  if (blok.vrsta === "kod") {
    const boja = document.createElement("div");
    boja.className = "isecak-akcije";
    boja.append(prekidacPozadineKoda());
    kartica.querySelector("header")?.append(boja);
  }
  return omotUredjivog(urediSadrzaj, id, kartica, () => uredjivacSekcije(sirovi, blok, vezi), bezOlovke());
}

function pozadinaKoda() {
  return lokalno.stanje().podesavanja.pozadinaKoda === "crna" ? "crna" : "bela";
}

function postaviPozadinuKoda(vrednost) {
  const sledeca = vrednost === "crna" ? "crna" : "bela";
  document.documentElement.dataset.pozadinaKoda = sledeca;
  if (lokalno.stanje().podesavanja.pozadinaKoda !== sledeca) {
    lokalno.promeni((stanje) => postaviPodesavanje(stanje, "pozadinaKoda", sledeca));
  }
  for (const dugme of document.querySelectorAll(".kod-boja button")) {
    dugme.setAttribute("aria-pressed", String(dugme.dataset.pozadina === sledeca));
  }
}

function prekidacPozadineKoda() {
  const grupa = document.createElement("div");
  grupa.className = "kod-boja";
  grupa.setAttribute("role", "group");
  grupa.setAttribute("aria-label", "Pozadina koda");
  const sada = pozadinaKoda();
  for (const [vrednost, natpis] of [["bela", "Bela"], ["crna", "Crna"]]) {
    const dugme = document.createElement("button");
    dugme.type = "button";
    dugme.dataset.pozadina = vrednost;
    dugme.textContent = natpis;
    dugme.setAttribute("aria-label", `${natpis} pozadina`);
    dugme.setAttribute("aria-pressed", String(sada === vrednost));
    dugme.addEventListener("click", () => postaviPozadinuKoda(vrednost));
    grupa.append(dugme);
  }
  return grupa;
}

function veziPrevlacenje(rucica, omot, lista, blok, polje) {
  rucica.addEventListener("pointerdown", (dogadjaj) => {
    if (dogadjaj.button !== 0) return;
    dogadjaj.preventDefault();
    try { rucica.setPointerCapture(dogadjaj.pointerId); } catch { /* pokazivač nije uhvaćen */ }
    const pocetak = dogadjaj.clientY;
    let pomeren = false;
    const ocisti = () => {
      document.querySelectorAll(".sekcija-lekcije").forEach((el) => {
        el.classList.remove("sekcija-cilj-iznad", "sekcija-cilj-ispod", "sekcija-prevlaci");
      });
    };
    const pomeri = (ev) => {
      if (Math.abs(ev.clientY - pocetak) > 3) pomeren = true;
      ocisti();
      omot.classList.add("sekcija-prevlaci");
      const cilj = [...document.querySelectorAll(".sekcija-lekcije")].find((el) => {
        if (el === omot) return false;
        const okvir = el.getBoundingClientRect();
        return ev.clientY >= okvir.top && ev.clientY <= okvir.bottom;
      });
      if (!cilj) return;
      const okvir = cilj.getBoundingClientRect();
      cilj.classList.add(ev.clientY < okvir.top + okvir.height / 2 ? "sekcija-cilj-iznad" : "sekcija-cilj-ispod");
    };
    const pusti = () => {
      document.removeEventListener("pointermove", pomeri);
      document.removeEventListener("pointerup", pusti);
      document.removeEventListener("pointercancel", pusti);
      const oznaka = document.querySelector(".sekcija-cilj-iznad, .sekcija-cilj-ispod");
      const iznad = Boolean(oznaka?.classList.contains("sekcija-cilj-iznad"));
      const ciljId = oznaka?.dataset.id || "";
      ocisti();
      if (!pomeren || !ciljId) return;
      void izmeniTekuciKorak((tema, korakIndeks) => (
        spustiSekciju(tema.steps[korakIndeks], lista, blok.id, ciljId, iznad, polje) < 0 ? -1 : korakIndeks
      ));
    };
    document.addEventListener("pointermove", pomeri);
    document.addEventListener("pointerup", pusti);
    document.addEventListener("pointercancel", pusti);
  });
}

function kontroleSekcije(sirovi, lista, blok, omot, { polje, vrste, prefiks }) {
  const rucice = document.createElement("div");
  rucice.className = "sekcija-rucice";
  const rucica = document.createElement("button");
  rucica.type = "button";
  rucica.className = "sekcija-rucica";
  rucica.setAttribute("aria-label", "Prevuci sekciju");
  rucica.title = "Prevuci sekciju";
  const grip = ikonica("grip-vertical");
  if (grip) rucica.append(grip);
  veziPrevlacenje(rucica, omot, lista, blok, polje);
  const plus = document.createElement("button");
  plus.type = "button";
  plus.className = "sekcija-plus";
  plus.setAttribute("aria-haspopup", "menu");
  plus.setAttribute("aria-expanded", "false");
  plus.setAttribute("aria-label", "Ubaci sekciju ispod");
  plus.title = "Ubaci sekciju ispod";
  const znakPlus = ikonica("plus");
  if (znakPlus) plus.append(znakPlus);
  const ubaci = (vrsta) => {
    void izmeniTekuciKorak((tema, korakIndeks) => {
      const id = ubaciSekciju(tema.steps[korakIndeks], lista, blok.id, vrsta, "posle", polje);
      if (!id) return -1;
      urediSadrzaj.otvori(kljucPolja(cas, korakIndeks, `${prefiks}:${id}`));
      return korakIndeks;
    });
  };
  rucice.append(meniVrsta(plus, ubaci, vrste), rucica);
  const jos = document.createElement("button");
  jos.type = "button";
  jos.className = "sekcija-jos";
  jos.setAttribute("aria-haspopup", "menu");
  jos.setAttribute("aria-expanded", "false");
  jos.setAttribute("aria-label", "Opcije sekcije");
  jos.title = "Opcije sekcije";
  const tacke = ikonica("ellipsis");
  if (tacke) jos.append(tacke);
  const panel = document.createElement("div");
  panel.className = "meni-pitanja sekcija-meni";
  panel.hidden = true;
  panel.setAttribute("role", "menu");
  let trenutne = [];
  const postavi = (dugmad) => {
    trenutne = dugmad;
    panel.replaceChildren(...dugmad);
  };
  const prikaziVrste = (natpis, gde) => {
    postavi([
      stavkaSaIkonom("chevron-left", natpis, prikaziKoren),
      ...vrste.map((vrsta) => stavkaSaIkonom(vrsta.ikona, vrsta.natpis, () => {
        void izmeniTekuciKorak((tema, korakIndeks) => {
          const korak = tema.steps[korakIndeks];
          if (gde === "tip") {
            return promeniVrstuSekcije(korak, lista, blok.id, vrsta, polje) < 0 ? -1 : korakIndeks;
          }
          const id = ubaciSekciju(korak, lista, blok.id, vrsta, gde, polje);
          if (!id) return -1;
          urediSadrzaj.otvori(kljucPolja(cas, korakIndeks, `${prefiks}:${id}`));
          return korakIndeks;
        });
      }, "sekcija-vrsta")),
    ]);
  };
  const otvoriUredjivanje = () => {
    urediSadrzaj.otvori(kljucBloka(prefiks, blok));
    urediSadrzaj.osvezi?.();
  };
  const prikaziKoren = () => {
    postavi([
      stavkaSaIkonom("pencil", "Uredi", otvoriUredjivanje),
      stavkaSaIkonom("refresh-cw", "Promeni tip", () => prikaziVrste("Promeni tip", "tip")),
      stavkaSaIkonom("list-plus", "Ubaci ispred", () => prikaziVrste("Ubaci ispred", "pre")),
      stavkaSaIkonom("list-plus", "Ubaci iza", () => prikaziVrste("Ubaci iza", "posle")),
      stavkaSaIkonom("trash", "Obriši", () => {
        void izmeniTekuciKorak((tema, korakIndeks) => {
          const korak = tema.steps[korakIndeks];
          materijalizuj(korak, lista, polje);
          urediSadrzaj.zatvori(kljucBloka(prefiks, blok));
          return obrisiSekciju(korak, blok.id, polje) < 0 ? -1 : korakIndeks;
        });
      }, "opasno"),
    ]);
  };
  prikaziKoren();
  const josOmot = document.createElement("div");
  josOmot.className = "sekcija-jos-omot";
  josOmot.append(jos, panel);
  napraviPadajucu({
    dugme: jos,
    panel,
    stavke: () => trenutne,
    naOtvori: prikaziKoren,
  });
  const akcije = document.createElement("div");
  akcije.className = "sekcija-akcije";
  akcije.append(dugmeUredi(`Uredi: ${natpisSekcije(blok)}`, otvoriUredjivanje), josOmot);
  return [rucice, akcije];
}

function nacrtajSekcije(sirovi, lista, dijagrami, opcije = {}) {
  const polje = opcije.polje || "blokovi";
  const vrste = opcije.vrste || VRSTE_SEKCIJE;
  const prefiks = opcije.prefiks || "sekcija";
  const uputa = opcije.uputa !== false;
  const crtez = opcije.crtez;
  const vezi = veziListu(sirovi, lista, polje);
  let prviTekst = true;
  return lista.map((blok) => {
    const omot = document.createElement("div");
    omot.className = "sekcija-lekcije";
    omot.dataset.vrsta = blok.vrsta;
    omot.dataset.id = blok.id;
    if (blok.oblik) omot.dataset.oblik = blok.oblik;
    if (urediSadrzaj.aktivan && sirovi) {
      const [rucice, akcije] = kontroleSekcije(sirovi, lista, blok, omot, { polje, vrste, prefiks });
      omot.append(rucice, akcije);
    }
    const prvi = uputa && prviTekst && blok.vrsta === "tekst" && blok.veza !== "prica";
    omot.append(teloSekcije(sirovi, blok, dijagrami, prvi, vezi, prefiks, crtez));
    if (blok.vrsta === "tekst") prviTekst = false;
    return omot;
  });
}

function meniDodajSekciju(lista, opcije = {}) {
  const polje = opcije.polje || "blokovi";
  const vrste = opcije.vrste || VRSTE_SEKCIJE;
  const prefiks = opcije.prefiks || "sekcija";
  const dugme = document.createElement("button");
  dugme.type = "button";
  dugme.className = "dodaj-sekciju";
  dugme.setAttribute("aria-haspopup", "menu");
  dugme.setAttribute("aria-expanded", "false");
  saIkonom(dugme, "plus", "Dodaj sekciju");
  const omot = meniVrsta(dugme, (vrsta) => {
    void izmeniTekuciKorak((tema, korakIndeks) => {
      const id = ubaciSekciju(tema.steps[korakIndeks], lista, null, vrsta, "kraj", polje);
      if (!id) return -1;
      urediSadrzaj.otvori(kljucPolja(cas, korakIndeks, `${prefiks}:${id}`));
      return korakIndeks;
    });
  }, vrste);
  omot.classList.add("dodaj-sekciju-omot");
  return omot;
}

function dugmeTrake(ime, natpis, onClick, disabled) {
  const dugme = document.createElement("button");
  dugme.type = "button";
  dugme.className = "traka-ikona";
  dugme.setAttribute("aria-label", natpis);
  dugme.title = natpis;
  saIkonom(dugme, ime, "");
  dugme.disabled = disabled;
  dugme.addEventListener("click", onClick);
  return dugme;
}

function grupaTrake(natpis, dugmad) {
  const grupa = document.createElement("div");
  grupa.className = "traka-grupa";
  grupa.setAttribute("role", "group");
  grupa.setAttribute("aria-label", natpis);
  const oznaka = document.createElement("span");
  oznaka.className = "traka-oznaka";
  oznaka.textContent = natpis;
  grupa.append(oznaka, ...dugmad);
  return grupa;
}

function razdelnikTrake() {
  const linija = document.createElement("span");
  linija.className = "traka-razdelnik";
  linija.setAttribute("aria-hidden", "true");
  return linija;
}

function ikonaStanja() {
  const stanje = znakStanja(urediSadrzaj);
  const omot = document.createElement("span");
  omot.className = `stanje-ikona ${stanje.vrsta}`;
  omot.setAttribute("role", "img");
  omot.setAttribute("aria-label", stanje.natpis);
  omot.title = stanje.natpis;
  const znak = ikonica(stanje.ikona);
  if (znak) omot.append(znak);
  return omot;
}

function osveziTrakuUredjivanja() {
  let trakaUredjivanja = document.querySelector("#traka-uredjivanja");
  if (!urediSadrzaj.aktivan) {
    trakaUredjivanja?.remove();
    document.body.classList.remove("rezim-uredjivanja");
    return;
  }
  document.body.classList.add("rezim-uredjivanja");
  if (!trakaUredjivanja) {
    trakaUredjivanja = document.createElement("div");
    trakaUredjivanja.id = "traka-uredjivanja";
    trakaUredjivanja.className = "traka-uredjivanja";
    document.querySelector(".top").after(trakaUredjivanja);
  }
  trakaUredjivanja.replaceChildren();
  const natpis = document.createElement("p");
  natpis.textContent = "Režim uređivanja";
  const zauzeto = urediSadrzaj.sacuvava;
  const tema = uvod ? null : sirovaTema(cas);
  const imaKorak = Boolean(tema?.steps?.length);
  const indeks = tema ? Math.min(indeksKoraka(), tema.steps.length - 1) : 0;
  const unazad = dugmeTrake("undo-2", "Opozovi", () => {
    void korakIstorije(true);
  }, zauzeto || !urediSadrzaj.istorija.mozeUnazad());
  const napred = dugmeTrake("redo-2", "Ponovi", () => {
    void korakIstorije(false);
  }, zauzeto || !urediSadrzaj.istorija.mozeNapred());
  const koraci = grupaTrake("Koraci", [
    dugmeTrake("chevron-left", "Premesti ulevo", () => {
      void izmeniTekuciKorak((sirova, i) => pomeriKorak(sirova, i, -1));
    }, zauzeto || !imaKorak || indeks === 0),
    dugmeTrake("chevron-right", "Premesti udesno", () => {
      void izmeniTekuciKorak((sirova, i) => pomeriKorak(sirova, i, 1));
    }, zauzeto || !imaKorak || indeks >= tema.steps.length - 1),
    dugmeTrake("trash", "Obriši korak", () => {
      void izmeniTekuciKorak((sirova, i) => obrisiKorak(sirova, i));
    }, zauzeto || !tema || tema.steps.length < 2),
    dugmeTrake("plus", "Dodaj korak", () => {
      void izmeniTekuciKorak((sirova) => dodajKorakNaKraj(sirova));
    }, zauzeto || !imaKorak),
    dugmeTrake("list-plus", "Ubaci korak", () => {
      void izmeniTekuciKorak((sirova, i) => ubaciKorak(sirova, i));
    }, zauzeto || !imaKorak),
  ]);
  trakaUredjivanja.append(natpis, unazad, napred, razdelnikTrake(), koraci, ikonaStanja());
}

async function upisiKursNaServer() {
  dokument.trajanjeTema = dokument.teme.length;
  await sacuvajKursNaServeru(dokument);
  urediSadrzaj.istorija.osveziReferencu();
  urediSadrzaj.prljavo = false;
  urediSadrzaj.greska = "";
}

let redUpisa = Promise.resolve();
let revizijaNacrta = 0;
let tajmerNacrta = 0;
let snimioNacrt = false;

function uReduUpisa(radnja) {
  const rezultat = redUpisa.then(radnja, radnja);
  redUpisa = rezultat.then(() => {}, () => {});
  return rezultat;
}

function zakaziUpisNacrta() {
  if (!urediSadrzaj.aktivan) return;
  revizijaNacrta += 1;
  const revizija = revizijaNacrta;
  urediSadrzaj.nesacuvano = true;
  urediSadrzaj.greska = "";
  osveziTrakuUredjivanja();
  window.clearTimeout(tajmerNacrta);
  tajmerNacrta = window.setTimeout(() => {
    void uReduUpisa(() => upisiNacrte(revizija));
  }, 250);
}

async function upisiNacrte(revizija) {
  if (!urediSadrzaj.aktivan) return;
  const lista = [...urediSadrzaj.otvoreni.values()];
  const menjano = lista.some((info) => info.promenjeno?.());
  if (!menjano && !snimioNacrt) {
    if (revizija === revizijaNacrta) {
      urediSadrzaj.nesacuvano = false;
      osveziTrakuUredjivanja();
    }
    return;
  }
  if (!snimioNacrt) {
    urediSadrzaj.istorija.zabeleziPre();
    snimioNacrt = true;
  }
  for (const info of lista) info.primeni?.();
  urediSadrzaj.sacuvava = true;
  osveziTrakuUredjivanja();
  try {
    osveziLekcije();
    await upisiKursNaServer();
  } catch (greska) {
    urediSadrzaj.greska = greska.message || "Greška pri čuvanju.";
  } finally {
    urediSadrzaj.sacuvava = false;
    if (revizija === revizijaNacrta) urediSadrzaj.nesacuvano = Boolean(urediSadrzaj.greska);
    osveziTrakuUredjivanja();
  }
}

async function korakIstorije(unazad) {
  if (!urediSadrzaj.aktivan || urediSadrzaj.sacuvava) return;
  const pomereno = unazad
    ? urediSadrzaj.istorija.korakUnazad(dokument)
    : urediSadrzaj.istorija.korakNapred(dokument);
  if (!pomereno) return;
  urediSadrzaj.sacuvava = true;
  osveziTrakuUredjivanja();
  try {
    osveziLekcije();
    await upisiKursNaServer();
  } catch (greska) {
    urediSadrzaj.greska = greska.message || "Greška pri čuvanju.";
  } finally {
    urediSadrzaj.sacuvava = false;
    renderLecture();
  }
}

function zatvoriPolje(id) {
  urediSadrzaj.otvoreni.delete(id);
  urediSadrzaj.zatvori(id);
  if (urediSadrzaj.otvoreni.size === 0) snimioNacrt = false;
}

async function potvrdiIzmenuSadrzaja(info, id) {
  window.clearTimeout(tajmerNacrta);
  if (!urediSadrzaj.aktivan) return;
  await uReduUpisa(async () => {
    if (!info.promenjeno?.()) {
      zatvoriPolje(id);
      urediSadrzaj.nesacuvano = [...urediSadrzaj.otvoreni.values()].some((otvoreno) => otvoreno.promenjeno?.());
      renderLecture();
      return;
    }
    if (!snimioNacrt) {
      urediSadrzaj.istorija.zabeleziPre();
      snimioNacrt = true;
    }
    info.primeni?.();
    urediSadrzaj.sacuvava = true;
    osveziTrakuUredjivanja();
    try {
      osveziLekcije();
      await upisiKursNaServer();
      urediSadrzaj.nesacuvano = false;
    } catch (greska) {
      urediSadrzaj.greska = greska.message || "Greška pri čuvanju.";
      urediSadrzaj.nesacuvano = true;
    } finally {
      urediSadrzaj.sacuvava = false;
      zatvoriPolje(id);
      renderLecture();
    }
  });
}

async function otkaziIzmenu(id) {
  window.clearTimeout(tajmerNacrta);
  if (!urediSadrzaj.aktivan) return;
  await uReduUpisa(async () => {
    const info = urediSadrzaj.otvoreni.get(id);
    const vraceno = Boolean(info?.ponisti && (info.promenjeno?.() || snimioNacrt));
    if (vraceno) info.ponisti();
    zatvoriPolje(id);
    if (!vraceno) {
      urediSadrzaj.nesacuvano = [...urediSadrzaj.otvoreni.values()].some((otvoreno) => otvoreno.promenjeno?.());
      renderLecture();
      return;
    }
    urediSadrzaj.sacuvava = true;
    osveziTrakuUredjivanja();
    try {
      osveziLekcije();
      await upisiKursNaServer();
      urediSadrzaj.nesacuvano = false;
    } catch (greska) {
      urediSadrzaj.greska = greska.message || "Greška pri čuvanju.";
      urediSadrzaj.nesacuvano = true;
    } finally {
      urediSadrzaj.sacuvava = false;
      renderLecture();
    }
  });
}

async function sacuvajKurs() {
  if (!urediSadrzaj.aktivan || urediSadrzaj.sacuvava) return;
  urediSadrzaj.sacuvava = true;
  osveziTrakuUredjivanja();
  try {
    await upisiKursNaServer();
  } catch (greska) {
    urediSadrzaj.greska = greska.message || "Greška pri čuvanju.";
  } finally {
    urediSadrzaj.sacuvava = false;
    osveziTrakuUredjivanja();
  }
}

async function izmeniStrukturu(primeni) {
  if (!urediSadrzaj.aktivan || urediSadrzaj.sacuvava || uvod) return -1;
  const indeks = primeni();
  if (indeks < 0) return -1;
  urediSadrzaj.istorija.zabeleziPre();
  urediSadrzaj.sacuvava = true;
  osveziTrakuUredjivanja();
  try {
    osveziLekcije();
    await upisiKursNaServer();
  } catch (greska) {
    urediSadrzaj.greska = greska.message || "Greška pri čuvanju.";
  } finally {
    urediSadrzaj.sacuvava = false;
    renderLecture();
  }
  return indeks;
}

function izmeniTekuciKorak(primeni) {
  const tema = sirovaTema(cas);
  if (!tema) return;
  const i = Math.min(indeksKoraka(), tema.steps.length - 1);
  return izmeniStrukturu(() => {
    const indeks = primeni(tema, i);
    if (indeks >= 0) korakPoCasu.set(cas, indeks);
    return indeks;
  });
}


function nacrtajSkokKoraka(item, i) {
  if (!item?.steps || item.steps.length < 2) return null;
  const nav = document.createElement("nav");
  nav.className = "skok-koraka";
  nav.setAttribute("aria-label", "Susedni koraci");
  nav.append(
    dugmeSkoka(i > 0 ? item.steps[i - 1] : null, i - 1, "nazad"),
    dugmeSkoka(i < item.steps.length - 1 ? item.steps[i + 1] : null, i + 1, "dalje"),
  );
  return nav;
}

function dugmeSkoka(korak, indeks, smer) {
  const nazad = smer === "nazad";
  const natpis = nazad ? "Prethodni" : "Sledeći";
  const dugme = document.createElement("button");
  dugme.type = "button";
  dugme.className = nazad ? "skok-koraka-dugme skok-koraka-nazad" : "skok-koraka-dugme skok-koraka-dalje";
  dugme.disabled = !korak;
  const tekst = document.createElement("span");
  tekst.className = "skok-koraka-tekst";
  const smerEl = document.createElement("span");
  smerEl.className = "skok-koraka-smer";
  smerEl.textContent = natpis;
  tekst.append(smerEl);
  if (korak) {
    const naslov = document.createElement("span");
    naslov.className = "skok-koraka-naslov";
    naslov.textContent = korak.naslov;
    tekst.append(naslov);
    dugme.title = korak.naslov;
    dugme.setAttribute("aria-label", `${natpis}: ${korak.naslov}`);
  } else dugme.setAttribute("aria-label", natpis);
  const znak = ikonica(nazad ? "chevron-left" : "chevron-right");
  if (nazad) {
    if (znak) dugme.append(znak);
    dugme.append(tekst);
  } else {
    dugme.append(tekst);
    if (znak) dugme.append(znak);
  }
  dugme.addEventListener("click", () => {
    if (!korak) return;
    korakPoCasu.set(cas, indeks);
    sakrijPanelSelekcije();
    renderLecture();
    const smanjeno = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: smanjeno ? "auto" : "smooth" });
  });
  return dugme;
}

function vratiNaslovCasa() {
  const glava = document.querySelector(".cas-glava");
  const izbor = document.querySelector(".izbor-red");
  if (!glava || !naslovCasa || naslovCasa.parentElement === glava) return;
  glava.insertBefore(naslovCasa, izbor);
}

function ocistiBirac() {
  posmatracBiraca?.disconnect();
  posmatracBiraca = null;
  vratiNaslovCasa();
  biracMesto.replaceChildren();
}

function postaviRasporedBiraca(birac) {
  const traka = birac.querySelector(".birac-kontrola");
  posmatracBiraca?.disconnect();
  posmatracBiraca = null;
  if (!traka) return;
  const primeni = () => {
    const sirina = traka.getBoundingClientRect().width;
    if (sirina < 1) return;
    traka.dataset.raspored = rasporedBiraca(sirina);
  };
  posmatracBiraca = new ResizeObserver(primeni);
  posmatracBiraca.observe(traka);
  primeni();
}

function nacrtajBirac(item, i) {
  const korak = item.steps[i];
  const birac = document.createElement("div");
  birac.className = "birac";
  const prethodni = document.createElement("button");
  prethodni.type = "button";
  prethodni.className = "birac-nazad";
  prethodni.setAttribute("aria-label", "Prethodni korak");
  const levo = ikonica("chevron-left");
  if (levo) prethodni.append(levo);
  prethodni.disabled = i === 0;
  prethodni.addEventListener("click", () => {
    korakPoCasu.set(cas, i - 1);
    sakrijPanelSelekcije();
    renderLecture();
  });
  const identitet = document.createElement("div");
  identitet.className = "birac-identitet";
  const broj = document.createElement("p");
  broj.className = "korak";
  broj.textContent = `Korak ${i + 1} od ${item.steps.length}`;
  const naslovBiraca = document.createElement("p");
  naslovBiraca.className = "birac-naslov";
  naslovBiraca.textContent = korak.naslov;
  identitet.append(broj, naslovBiraca);
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
      sakrijPanelSelekcije();
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
  daljeKorak.classList.add("birac-dalje");
  daljeKorak.setAttribute("aria-label", "Sledeći korak");
  const desno = ikonica("chevron-right");
  if (desno) daljeKorak.append(desno);
  daljeKorak.disabled = i === item.steps.length - 1;
  daljeKorak.addEventListener("click", () => {
    korakPoCasu.set(cas, i + 1);
    sakrijPanelSelekcije();
    renderLecture();
  });
  akcije.append(sviKoraci, meni);
  const navigacija = document.createElement("div");
  navigacija.className = "birac-navigacija";
  navigacija.append(prethodni, daljeKorak);
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
      sakrijPanelSelekcije();
      renderLecture();
    });
    const krug = document.createElement("span");
    krug.className = ki <= i ? "birac-krug birac-krug-dosegnut" : "birac-krug birac-krug-buduci";
    domacin.append(krug);
    krugovi.append(domacin);
  });
  const kruznici = document.createElement("div");
  kruznici.className = "birac-kruznici";
  kruznici.append(krugovi);
  const sredina = document.createElement("div");
  sredina.className = "birac-sredina";
  sredina.append(kruznici, akcije);
  const traka = document.createElement("div");
  traka.className = "birac-kontrola";
  traka.append(identitet, sredina, navigacija);
  const temaOznaka = document.createElement("p");
  temaOznaka.className = "birac-tema";
  temaOznaka.textContent = `Tema ${item.n}`;
  naslovCasa.textContent = item.title;
  birac.append(temaOznaka, naslovCasa, traka);
  return birac;
}

function nacrtajZaglavlje() {
  document.querySelector("#naslov-kursa-tekst").textContent = dokument.naslov;
  document.querySelector("#ustanova").textContent = dokument.ustanova;
  document.querySelector("#ustanova-red").textContent = dokument.ustanovaRed;
  document.querySelector("#grb").src = dokument.grb;
  document.querySelector("#oznaka").textContent = dokument.oznaka;
  const slika = document.querySelector("#kurs-slika");
  if (!slika) return;
  const put = dokument.slika || "";
  if (slika.getAttribute("src") !== put) slika.src = put;
}

function stavkaUvod(naslov, telo) {
  const blok = document.createElement("section");
  blok.className = "uvod-blok";
  const h = document.createElement("h2");
  h.textContent = naslov;
  blok.append(h, telo);
  return blok;
}

function nacrtajUvod() {
  const podaci = dokument.uvod || {};
  document.title = dokument.naslov;
  nacrtajZaglavlje();
  trakaCasa.osvezi({ uvod: true, teme: lectures, cas, i: 0, koraci: [] });
  popuniStalneIkonice();
  naslovCasa.textContent = podaci.naslov || "Uvod";
  osveziMobilTemu(lectures[0]);
  osveziMobilNavTraka(lectures[0], 0);
  const brojMobil = document.querySelector("#mobil-tema-broj");
  const naslovMobil = document.querySelector("#mobil-tema-naslov");
  const podMobil = document.querySelector("#mobil-tema-podnaslov");
  if (brojMobil) brojMobil.textContent = "Uvod";
  if (naslovMobil) naslovMobil.textContent = podaci.naslov || "Pre prve teme";
  if (podMobil) podMobil.textContent = "Cilj, očekivanje, osnov i pregled tema";
  const brojNed = document.querySelector("#mobil-ned-broj");
  const naslovNed = document.querySelector("#mobil-ned-naslov");
  if (brojNed) brojNed.textContent = "—";
  if (naslovNed) naslovNed.textContent = "Uvod";
  const glavaKor = document.querySelector("#mobil-kor-glava");
  if (glavaKor) glavaKor.textContent = "";
  document.querySelector("#definicija").hidden = true;
  ocistiBirac();
  casEl.replaceChildren();
  const omot = document.createElement("article");
  omot.className = "uvod";
  const cilj = document.createElement("p");
  cilj.textContent = podaci.cilj || "";
  omot.append(stavkaUvod("Cilj predmeta", cilj));
  const ocekivanje = document.createElement("ul");
  for (const rec of podaci.ocekivanje || []) {
    const li = document.createElement("li");
    li.textContent = rec;
    ocekivanje.append(li);
  }
  omot.append(stavkaUvod("Šta se očekuje", ocekivanje));
  const osnov = document.createElement("ul");
  osnov.className = "uvod-osnov";
  for (const izvor of podaci.osnov || []) {
    const li = document.createElement("li");
    const ime = document.createElement("strong");
    if (izvor.veza) {
      const veza = document.createElement("a");
      veza.href = izvor.veza;
      veza.target = "_blank";
      veza.rel = "noopener noreferrer";
      veza.textContent = izvor.naziv;
      ime.append(veza);
    } else ime.textContent = izvor.naziv;
    li.append(ime, document.createTextNode(` ${izvor.recenica || ""}`));
    osnov.append(li);
  }
  const osnovBlok = stavkaUvod("Na čemu je kurs zasnovan", osnov);
  if (podaci.napomenaOsnova) {
    const napomena = document.createElement("p");
    napomena.className = "meta";
    napomena.textContent = podaci.napomenaOsnova;
    osnovBlok.append(napomena);
  }
  omot.append(osnovBlok);
  const pregled = document.createElement("ol");
  pregled.className = "uvod-teme";
  lectures.forEach((lekcija) => {
    const li = document.createElement("li");
    const dugme = document.createElement("button");
    dugme.type = "button";
    dugme.className = "uvod-tema";
    const ime = document.createElement("strong");
    ime.textContent = `${lekcija.n}. ${lekcija.title}`;
    const pod = document.createElement("span");
    pod.textContent = lekcija.podnaslov || lekcija.outcome || "";
    dugme.append(ime, pod);
    dugme.addEventListener("click", () => otvoriTemu(lekcija.n));
    li.append(dugme);
    pregled.append(li);
  });
  omot.append(stavkaUvod("Pregled tema", pregled));
  const dalje = document.createElement("button");
  dalje.type = "button";
  dalje.className = "sledeci-korak uvod-dalje";
  dalje.textContent = "Prva tema";
  dalje.addEventListener("click", () => otvoriTemu(1));
  omot.append(dalje);
  casEl.append(omot);
  diskusijaMesto.replaceChildren();
  for (const ime of ["koraci", "diskusija", "editor"]) {
    document.querySelector(`#sekcija-${ime}`).hidden = ime !== "koraci";
    const tab = document.querySelector(`#tab-${ime}`);
    tab.setAttribute("aria-selected", "false");
    tab.tabIndex = -1;
  }
  document.body.classList.remove("editor-pun");
  paintNav();
}

function renderLecture() {
  const provera = ucitajKurs(dokument);
  const greska = document.querySelector("#greska-kursa");
  if (!provera.ok) {
    greska.hidden = false;
    greska.textContent = provera.greska;
    nav.replaceChildren();
    ocistiBirac();
    return;
  }
  greska.hidden = true;
  document.body.classList.toggle("uvod-otvoren", uvod);
  osveziIzvoz();
  if (uvod) {
    zabeleziOtvoreno(0);
    nacrtajUvod();
    return;
  }
  const item = lecture();
  const i = Math.min(indeksKoraka(), item.steps.length - 1);
  const korak = item.steps[i];
  const sirovi = siroviKorak(cas, i);
  zabeleziOtvoreno(i);
  document.title = dokument.naslov;
  nacrtajZaglavlje();
  trakaCasa.osvezi({ uvod: false, teme: lectures, cas, i, koraci: item.steps });
  popuniStalneIkonice();
  naslovCasa.textContent = item.title;
  osveziMobilTemu(item);
  osveziMobilNavTraka(item, i);
  const profilOznaka = document.querySelector("#mobil-profil-oznaka");
  const profilIme = document.querySelector("#mobil-profil-ime");
  if (profilOznaka) profilOznaka.textContent = dokument.oznaka;
  if (profilIme) profilIme.textContent = dokument.ustanovaBok || dokument.ustanova || "";
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
  beleske.poveziDugmeKoraka(sacuvajKorak);
  metaKoraka.append(nivo, minuta, sacuvajKorak);
  const naslovPrikaz = document.createElement("h2");
  naslovPrikaz.append(fragmentTeksta(korak.naslov));
  const naslovKoraka = omotUredjivog(urediSadrzaj, kljucPolja(cas, i, "naslov"), naslovPrikaz, () =>
    napraviEditorKratkog(korak.naslov, { opis: "naslov koraka" }, (vrednost) => {
      if (sirovi) sirovi.naslov = vrednost;
    })
  );
  const dijagrami = [];
  const imaFiguru = Boolean(korak.figura);
  biracMesto.replaceChildren(birac);
  postaviRasporedBiraca(birac);
  const izvorKoraka = sirovi || korak;
  const lista = blokoviKoraka(izvorKoraka, { prazne: urediSadrzaj.aktivan, figura: imaFiguru });
  const sekcije = nacrtajSekcije(sirovi, lista, dijagrami, { crtez: izvorKoraka.figura });
  casEl.append(metaKoraka, naslovKoraka, ...sekcije);
  if (urediSadrzaj.aktivan && sirovi) casEl.append(meniDodajSekciju(lista));
  for (const [omot, izvor] of dijagrami) void nacrtajMermaid(omot, izvor);
  const skok = nacrtajSkokKoraka(item, i);
  if (skok) casEl.append(skok);
  diskusijaMesto.replaceChildren(nacrtajDiskusijuKoraka(item, i, korak, sirovi));
  osveziTrakuUredjivanja();
  prikaziDeo();
  paintNav();
  fitPanel();
  if (animKoraka && usko()) {
    casEl.classList.remove("mobil-korak-unazad", "mobil-korak-napred");
    casEl.classList.add(animKoraka < 0 ? "mobil-korak-unazad" : "mobil-korak-napred");
    const sm = animKoraka;
    animKoraka = 0;
    window.setTimeout(() => {
      casEl.classList.remove(sm < 0 ? "mobil-korak-unazad" : "mobil-korak-napred");
    }, 260);
  }
  if (animTeme && usko() && mobilNavTraka) {
    mobilNavTraka.classList.remove("mobil-tema-unazad", "mobil-tema-napred");
    mobilNavTraka.classList.add(animTeme < 0 ? "mobil-tema-unazad" : "mobil-tema-napred");
    const sm = animTeme;
    animTeme = 0;
    window.setTimeout(() => {
      mobilNavTraka.classList.remove(sm < 0 ? "mobil-tema-unazad" : "mobil-tema-napred");
    }, 260);
  }
}

function natpisPolja(natpis, polje) {
  const omot = document.createElement("label");
  omot.className = "uredi-natpis";
  const ime = document.createElement("span");
  ime.className = "meta";
  ime.textContent = natpis;
  omot.append(ime, polje);
  return omot;
}


function nacrtajDiskusijuKoraka(item, i, korak, sirovi) {
  const omot = document.createElement("div");
  omot.className = "diskusija-korak";
  omot.setAttribute("aria-label", "Pitalice koraka");
  const naslov = document.createElement("h2");
  naslov.append(document.createTextNode(korak.naslov));
  if (!korak.prica && String(korak.tekst || "").trim()) {
    const kaGradivu = document.createElement("button");
    kaGradivu.type = "button";
    kaGradivu.className = "ka-gradivu";
    kaGradivu.setAttribute("aria-label", "Otvori gradivo");
    kaGradivu.title = "Gradivo";
    const knjiga = ikonica("book-open");
    if (knjiga) kaGradivu.append(knjiga);
    kaGradivu.addEventListener("click", () => {
      otvoriDeo("koraci");
      const panel = document.querySelector("#sekcija-koraci");
      if (panel && !panel.hasAttribute("tabindex")) panel.tabIndex = -1;
      panel?.focus();
    });
    naslov.append(kaGradivu);
  }
  omot.append(naslov);
  const izvor = sirovi || korak;
  const lista = diskusijaKoraka(izvor);
  const dijagrami = [];
  const opcijeSekcije = {
    polje: "diskusija",
    vrste: VRSTE_DISKUSIJE,
    prefiks: "diskusija",
    uputa: false,
  };
  omot.append(...nacrtajSekcije(sirovi, lista, dijagrami, opcijeSekcije));
  for (const [cvor, izvorDijagrama] of dijagrami) void nacrtajMermaid(cvor, izvorDijagrama);
  if (urediSadrzaj.aktivan && sirovi) omot.append(meniDodajSekciju(lista, opcijeSekcije));
  const pitanja = lista.filter((blok) => blok.vrsta === "pitanje" && blok.oblik === "izbor");
  if (pitanja.length) {
    const ponovi = document.createElement("button");
    ponovi.type = "button";
    ponovi.id = "ponovi-pitanje";
    ponovi.className = "ponovi-pitanje";
    saIkonom(ponovi, "refresh-cw", "Ponovi pitanja");
    ponovi.addEventListener("click", () => {
      for (const pitanje of pitanja) {
        const kljuc = `${cas}:${i}:${pitanje.id}`;
        objasnjenjePoKoraku.delete(kljuc);
        izborKoraka.delete(kljuc);
      }
      renderLecture();
    });
    omot.append(ponovi);
    const izlazPodaci = prikaziIzlaz(i, item.steps.length, item.izlaz);
    if (izlazPodaci) {
      const izlaz = document.createElement("p");
      izlaz.className = "log izlaz";
      izlaz.textContent = izlazPodaci.tekst;
      omot.append(izlaz);
    }
  }
  const poslednji = i === item.steps.length - 1;
  if (poslednji && item.problem) {
    const razmak = document.createElement("hr");
    razmak.className = "diskusija-razmak";
    omot.append(razmak, nacrtajDiskusijuTeme(item));
  }
  const skok = nacrtajSkokKoraka(item, i);
  if (skok) omot.append(skok);
  return omot;
}


function zapamtiDiskusiju(dogadaj) {
  const kljuc = kljucDiskusije();
  diskusije.set(kljuc, potez(diskusije.get(kljuc), dogadaj));
  renderLecture();
}

function nacrtajDiskusijuTeme(item) {
  const model = prikazDiskusije(diskusije.get(kljucDiskusije()), item, rezervaPoCasu.get(cas) === true);
  const tema = sirovaTema(cas);
  const rezerva = rezervaPoCasu.get(cas) === true;
  const izvorOpcija = rezerva && tema?.rezerva ? tema.rezerva : tema;
  const blok = document.createElement("section");
  blok.className = "diskusija";
  blok.setAttribute("aria-label", "Duga pitalica");
  const naslov = document.createElement("h2");
  naslov.textContent = model.naslov === "Diskusija" ? "Diskusija cele teme" : model.naslov;
  const fazaEl = document.createElement("p");
  fazaEl.className = "log";
  fazaEl.textContent = `Faza: ${model.faza}`;
  const problemPrikaz = document.createElement("p");
  problemPrikaz.textContent = model.problem;
  const problem = omotUredjivog(
    urediSadrzaj,
    kljucPolja(cas, -1, rezerva ? "rezerva-problem" : "diskusija-problem"),
    problemPrikaz,
    () => {
      if (!izvorOpcija) {
        return { telo: document.createElement("div"), opis: "problem diskusije", promenjeno: () => false, primeni() {} };
      }
      const editor = napraviEditorTeksta(
        izvorOpcija.problem ?? "",
        { redovi: 4, placeholder: "Problem za diskusiju teme." },
        { opis: "problem diskusije" }
      );
      return veziTekst(editor, (vrednost) => {
        izvorOpcija.problem = vrednost;
      });
    }
  );
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
  const opcijeOmot = omotUredjivog(
    urediSadrzaj,
    kljucPolja(cas, -1, rezerva ? "rezerva-opcije" : "diskusija-opcije"),
    options,
    () => {
      if (!izvorOpcija?.options) {
        return { telo: document.createElement("div"), opis: "odgovore diskusije", promenjeno: () => false, primeni() {} };
      }
      const editor = napraviEditorOpcija(izvorOpcija.options, { opis: "odgovore diskusije" });
      return {
        ...editor,
        primeni() {
          editor.primeni(izvorOpcija.options);
        },
        ponisti() {
          editor.ponisti(izvorOpcija.options);
        },
      };
    }
  );
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
  blok.append(naslov, fazaEl, problem, opcijeOmot, tisina, tabla, zakljucak, radnje);
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
  const rezultat = primeni(sesija, dogadaj, { koraci: kursKoraci(), indeks: indeksUKursu(), tema: cas });
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

const dugmeStabla = document.querySelector("#sklopi-stablo");

function postaviStablo(sklopljeno) {
  document.querySelector("#file-layout").classList.toggle("sklopljeno", sklopljeno);
  const natpis = sklopljeno ? "Rasklopi stablo fajlova" : "Sklopi stablo fajlova";
  dugmeStabla.setAttribute("aria-expanded", String(!sklopljeno));
  dugmeStabla.setAttribute("aria-label", natpis);
  dugmeStabla.title = natpis;
}

postaviStablo(lokalno.stanje().podesavanja.stabloSklopljeno);
document.documentElement.dataset.pozadinaKoda = lokalno.stanje().podesavanja.pozadinaKoda === "crna" ? "crna" : "bela";

dugmeStabla.addEventListener("click", () => {
  const sklopljeno = dugmeStabla.getAttribute("aria-expanded") === "true";
  postaviStablo(sklopljeno);
  lokalno.promeni((stanje) => postaviPodesavanje(stanje, "stabloSklopljeno", sklopljeno));
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
    if (!typeahead.hidden) {
      typeahead.hidden = true;
      q.setAttribute("aria-expanded", "false");
    } else {
      q.blur();
    }
  }
});

function skrolujTekst(smer) {
  const koren = document.scrollingElement || document.documentElement;
  const korak = window.innerHeight / 2;
  const max = Math.max(0, koren.scrollHeight - koren.clientHeight);
  koren.scrollTop = Math.min(max, Math.max(0, koren.scrollTop + smer * korak));
}

function pomeriKorakTasterom(smer) {
  if (uvod) return;
  const item = lecture();
  if (!item?.steps.length) return;
  const i = Math.min(indeksKoraka(), item.steps.length - 1);
  const sledeci = i + smer;
  if (sledeci < 0 || sledeci >= item.steps.length) return;
  korakPoCasu.set(cas, sledeci);
  sakrijPanelSelekcije();
  renderLecture();
}

function pomeriTemuTasterom(smer) {
  if (uvod) {
    if (smer > 0) otvoriTemu(1);
    return;
  }
  if (smer < 0 && cas <= 1) {
    otvoriUvod();
    return;
  }
  const sledeca = pomeriTemu(cas, smer, dokument.trajanjeTema);
  if (sledeca !== cas) otvoriTemu(sledeca);
}

function otvoriDeoTasterom(ime) {
  if (uvod || deo === ime) return;
  otvoriDeo(ime);
}

function tasterUnosa(cilj) {
  if (document.querySelector("dialog[open]")) return true;
  if (!(cilj instanceof Element)) return false;
  return Boolean(cilj.closest("input, textarea, select, [contenteditable='true'], .cm-editor, [role='listbox'], [role='menu']"));
}

window.addEventListener("keydown", (event) => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.isComposing) return;
  if (tasterUnosa(event.target)) return;
  const slovo = event.key.length === 1 ? event.key.toLowerCase() : "";
  if (!slovo) return;
  if (event.shiftKey) {
    if (slovo === "j") {
      event.preventDefault();
      pomeriTemuTasterom(1);
    } else if (slovo === "k") {
      event.preventDefault();
      pomeriTemuTasterom(-1);
    }
    return;
  }
  if (slovo === "j") {
    event.preventDefault();
    skrolujTekst(1);
  } else if (slovo === "k") {
    event.preventDefault();
    skrolujTekst(-1);
  } else if (slovo === "h") {
    event.preventDefault();
    pomeriKorakTasterom(-1);
  } else if (slovo === "l") {
    event.preventDefault();
    pomeriKorakTasterom(1);
  } else if (slovo === "u") {
    event.preventDefault();
    otvoriDeoTasterom("koraci");
  } else if (slovo === "i") {
    event.preventDefault();
    otvoriDeoTasterom("diskusija");
  } else if (slovo === "o") {
    event.preventDefault();
    otvoriDeoTasterom("editor");
  }
});

window.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    q.focus();
  }
});

document.querySelector("#pomoc").addEventListener("click", () => {
  document.querySelector("#pomoc-dijalog").showModal();
});

const casTabovi = document.querySelector(".cas-tabovi");
const trakaCasaEl = document.querySelector("#traka-casa");
const casGlava = document.querySelector(".cas-glava");

function postaviTabove() {
  if (!casTabovi) return;
  const izvoz = document.querySelector("#izvoz-omot");
  if (usko()) {
    if (casTabovi.parentElement !== casGlava) mobilNavRed.insertAdjacentElement("afterend", casTabovi);
    if (izvoz && izvoz.parentElement !== casGlava) document.querySelector("#definicija")?.before(izvoz);
  } else {
    if (casTabovi.parentElement !== trakaCasaEl) trakaCasaEl.append(casTabovi);
    if (izvoz && izvoz.parentElement !== trakaCasaEl) trakaCasaEl.append(izvoz);
  }
}

function osveziIzvoz() {
  const naUvodu = uvod;
  const dugme = document.querySelector("#izvoz-dugme");
  if (dugme) dugme.disabled = naUvodu;
  for (const stavka of document.querySelectorAll("#izvoz-meni [data-izvoz]")) stavka.disabled = naUvodu;
}

async function izvrsiIzvoz(vrsta) {
  if (uvod) return;
  const tema = sirovaTema(cas);
  const korak = siroviKorak(cas, indeksKoraka());
  if (!tema || !korak) return;
  if (vrsta === "korak-md") preuzmiTekst(imeIzvoza(korak.naslov, "md"), markdownKoraka(korak));
  else if (vrsta === "tema-md") preuzmiTekst(imeIzvoza(tema.naslov, "md"), markdownTeme(tema));
  else if (vrsta === "korak-pdf") await stampajHtml(htmlKoraka(korak));
  else if (vrsta === "tema-pdf") await stampajHtml(htmlTeme(tema));
}

function poveziIzvoz() {
  const dugme = document.querySelector("#izvoz-dugme");
  const panel = document.querySelector("#izvoz-meni");
  if (!dugme || !panel) return;
  const pad = napraviPadajucu({
    dugme,
    panel,
    stavke: () => [...panel.querySelectorAll("[role='menuitem']:not(:disabled)")],
  });
  panel.addEventListener("click", (dogadjaj) => {
    const stavka = dogadjaj.target.closest("[data-izvoz]");
    if (!stavka || stavka.disabled) return;
    pad.zatvori(false);
    void izvrsiIzvoz(stavka.dataset.izvoz);
  });
}

const trakaCasa = napraviTrakuCasa({
  naUvod: () => otvoriUvod(),
  naTemu: (n) => otvoriTemu(n),
  naKorak: (ki) => {
    korakPoCasu.set(cas, ki);
    sakrijPanelSelekcije();
    renderLecture();
  },
});

function modSada() {
  return modPredavanja() ? "predavanja" : "samostalni";
}

function postaviMod(mod) {
  const sledeci = mod === "samostalni" ? "samostalni" : "predavanja";
  const sacuvan = lokalno.stanje().podesavanja.mod;
  if (sacuvan !== sledeci) lokalno.promeni((stanje) => postaviPodesavanje(stanje, "mod", sledeci));
  if (document.documentElement.dataset.mod === sledeci) {
    osveziOpcije();
    return;
  }
  document.documentElement.dataset.mod = sledeci;
  if (!uvod && deo !== "editor") deo = podrazumevaniDeo();
  renderLecture();
}

function postaviSkalu(skala) {
  if (!SKALE_FONTA.includes(skala)) return;
  document.documentElement.style.setProperty("--skala-fonta", skala);
  lokalno.promeni((stanje) => postaviPodesavanje(stanje, "font", skala));
  osveziOpcije();
}

function temaSada() {
  const zakucana = document.documentElement.dataset.tema;
  if (PALETE_SAJTA.some(([id]) => id === zakucana)) return zakucana;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "pesak" : "ugalj";
}

function zakucajTemu(id) {
  document.documentElement.dataset.tema = id;
  lokalno.promeni((stanje) => postaviPaletu(stanje, id));
  osveziOpcije();
  osveziMermaid();
}

function primeniStanje() {
  const stanje = lokalno.stanje();
  const koren = document.documentElement;
  if (stanje.paleta) koren.dataset.tema = stanje.paleta;
  else delete koren.dataset.tema;
  koren.dataset.mod = stanje.podesavanja.mod === "samostalni" ? "samostalni" : "predavanja";
  koren.style.setProperty("--skala-fonta", stanje.podesavanja.font);
  koren.dataset.pozadinaKoda = stanje.podesavanja.pozadinaKoda === "crna" ? "crna" : "bela";
  postaviStablo(stanje.podesavanja.stabloSklopljeno);
  korakPoCasu.clear();
  deo = podrazumevaniDeo();
  osveziMermaid();
  renderLecture();
}

const kontekstOpcija = {
  ikonica,
  lokalno,
  paletaSada: temaSada,
  zakucajTemu,
  skalaFonta,
  postaviSkalu,
  modSada,
  postaviMod,
  primeniStanje,
  obrisiProgres() {
    lokalno.obrisi();
    primeniStanje();
    prviIzbor.pokaziAkoTreba();
  },
};
const opcije = napraviOpcije(kontekstOpcija);
const mobilOpcije = mobilOpcijeMesto ? nacrtajOdeljke({ ...kontekstOpcija, prefiks: "mobil-opcije" }) : null;
if (mobilOpcije) mobilOpcijeMesto.append(mobilOpcije.koren);
const prviIzbor = napraviPrviIzbor(kontekstOpcija);

function otvoriBelesku(tema, korak) {
  if (uvod) deo = podrazumevaniDeo();
  korakPoCasu.set(tema, korak);
  uvod = false;
  cas = tema;
  sakrijPanelSelekcije();
  if (location.hash !== `#cas-${tema}`) location.hash = `cas-${tema}`;
  else renderLecture();
}

const beleske = napraviBeleske({
  lokalno,
  korakSada() {
    const item = lecture();
    if (uvod || !item || !item.steps.length) return null;
    const i = Math.min(indeksKoraka(), item.steps.length - 1);
    return { tema: cas, korak: i, naslov: item.steps[i].naslov };
  },
  postojiKorak: (tema, korak) => korak < (lectures.find((item) => item.n === tema)?.steps.length ?? 0),
  naslovTeme(tema) {
    const item = lectures.find((sada) => sada.n === tema);
    return item ? `Tema ${tema} – ${item.title}` : `Tema ${tema}`;
  },
  otvoriKorak: otvoriBelesku,
});

function osveziOpcije() {
  opcije.osvezi();
  mobilOpcije?.osvezi();
}

postaviTabove();
poveziIzvoz();
osveziOpcije();

window.addEventListener("hashchange", () => {
  if (location.hash === "#uvod") {
    uvod = true;
    renderLecture();
    return;
  }
  const n = Number((location.hash.match(/cas-(\d+)/) || [])[1]);
  if (n >= 1 && n <= dokument.trajanjeTema) {
    if (uvod || n !== cas) {
      deo = podrazumevaniDeo();
      sakrijPanelSelekcije();
    }
    uvod = false;
    cas = n;
    renderLecture();
  }
});

for (const ime of ["koraci", "diskusija", "editor"]) {
  document.querySelector(`#tab-${ime}`).addEventListener("click", () => {
    otvoriDeo(ime);
  });
}

navPreklop.addEventListener("click", () => {
  navOtvoren = !navOtvoren;
  prikaziNav();
});
function otvoriMobilGradivo() {
  zatvoriMobilProfil();
  zatvoriMobilPretragu();
  zatvoriMobilPadMenije();
  deo = "koraci";
  prikaziDeo();
  navOtvoren = true;
  prikaziNav();
}

document.querySelector("#mobil-kor-nazad")?.addEventListener("click", () => {
  const item = lecture();
  const i = indeksKoraka();
  if (i > 0) {
    korakPoCasu.set(cas, i - 1);
    sakrijPanelSelekcije();
    renderLecture();
  }
});
document.querySelector("#mobil-kor-napred")?.addEventListener("click", () => {
  const item = lecture();
  const i = indeksKoraka();
  if (i < item.steps.length - 1) {
    korakPoCasu.set(cas, i + 1);
    sakrijPanelSelekcije();
    renderLecture();
  }
});
mobilNedPad?.addEventListener("click", prebaciMobilNedSheet);
mobilKorSredina?.addEventListener("click", prebaciMobilKorSheet);
document.querySelector("#mobil-ned-zatvori")?.addEventListener("click", zatvoriMobilIzborSheetove);
document.querySelector("#mobil-kor-zatvori")?.addEventListener("click", zatvoriMobilIzborSheetove);
mobilFtPodesavanja?.addEventListener("click", () => {
  zatvoriMobilNav();
  zatvoriMobilPretragu();
  zatvoriMobilIzborSheetove();
  profilOtvoren = !profilOtvoren;
  prikaziMobilProfil();
});
mobilFtPretraga?.addEventListener("click", () => {
  zatvoriMobilNav();
  zatvoriMobilProfil();
  zatvoriMobilIzborSheetove();
  pretragaOtvorena = !pretragaOtvorena;
  prikaziMobilPretragu();
});
mobilFtTema?.addEventListener("click", () => {
  zatvoriMobilNav();
  zatvoriMobilProfil();
  zatvoriMobilPretragu();
  prebaciMobilNedSheet();
});
mobilNavPrekidac?.addEventListener("click", () => {
  if (!usko()) return;
  const skrol = (window.scrollY || document.documentElement.scrollTop || 0) > MOBIL_SKROL_PRAG;
  mobilNavPrisilno = skrol ? !mobilNavPrisilno : false;
  osveziMobilGlavaSkrol();
});
document.querySelector("#mobil-profil-sacuvaj")?.addEventListener("click", (dogadjaj) => beleske.uredjivac.otvori(dogadjaj.currentTarget));
document.querySelector("#mobil-profil-beleske")?.addEventListener("click", () => beleske.otvoriSve());
mobilZavesa?.addEventListener("click", zatvoriMobilSheetove);
if (usko()) navOtvoren = false;
let bioMobil = usko();
prikaziNav();
prikaziMobilProfil();
prikaziMobilPretragu();
window.addEventListener("resize", () => {
  const sadaMobil = usko();
  if (sadaMobil !== bioMobil) {
    if (sadaMobil) navOtvoren = false;
    else if (!navOtvoren) navOtvoren = true;
    bioMobil = sadaMobil;
  }
  prikaziNav();
  prikaziMobilProfil();
  prikaziMobilPretragu();
  postaviTabove();
});

const navOmot = document.querySelector(".nav-omot");
let vrhNavaZakazan = false;
let visinaVrha = -1;
function postaviVrhNava() {
  vrhNavaZakazan = false;
  const vrh = document.querySelector(".top");
  if (vrh) {
    const visina = vrh.getBoundingClientRect().height;
    if (Math.abs(visina - visinaVrha) >= 0.5) {
      visinaVrha = visina;
      document.documentElement.style.setProperty("--visina-vrha", `${visina}px`);
    }
  }
  navOmot.style.setProperty("--nav-vrh", `${Math.max(0, navOmot.getBoundingClientRect().top)}px`);
}
function zakaziVrhNava() {
  if (vrhNavaZakazan) return;
  vrhNavaZakazan = true;
  requestAnimationFrame(postaviVrhNava);
}
window.addEventListener("scroll", zakaziVrhNava, { passive: true });
window.addEventListener(
  "scroll",
  () => {
    osveziMobilGlavaSkrol();
  },
  { passive: true },
);
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

koraciPanel?.addEventListener(
  "touchstart",
  (dogadjaj) => {
    if (!usko() || deo !== "koraci") return;
    if (dogadjaj.target.closest("input, textarea, select, button, a, label, .cm-editor, .cm-content, pre, .option, .birac-meni")) {
      return;
    }
    const dodir = dogadjaj.touches[0] || dogadjaj.changedTouches[0];
    if (!dodir) return;
    dodirKoraka = { x: dodir.clientX, y: dodir.clientY };
  },
  { passive: true },
);
koraciPanel?.addEventListener(
  "touchend",
  (dogadjaj) => {
    if (!dodirKoraka) return;
    const dodir = dogadjaj.changedTouches[0];
    const dx = dodir.clientX - dodirKoraka.x;
    const dy = dodir.clientY - dodirKoraka.y;
    dodirKoraka = null;
    if (Math.abs(dx) < 56 || Math.abs(dx) < Math.abs(dy) * 1.15) return;
    pomeriKorakPrstom(dx);
  },
  { passive: true },
);
koraciPanel?.addEventListener("touchcancel", () => {
  dodirKoraka = null;
});

function vezniSwipeTeme(element) {
  element?.addEventListener(
    "touchstart",
    (dogadjaj) => {
      if (!usko()) return;
      if (dogadjaj.target.closest("button, a, input, textarea, .korak-red, .tema-red")) return;
      const dodir = dogadjaj.touches[0] || dogadjaj.changedTouches[0];
      if (!dodir) return;
      dodirTeme = { x: dodir.clientX, y: dodir.clientY, u: element };
    },
    { passive: true },
  );
  element?.addEventListener(
    "touchend",
    (dogadjaj) => {
      if (!dodirTeme || dodirTeme.u !== element) return;
      const dodir = dogadjaj.changedTouches[0];
      const dx = dodir.clientX - dodirTeme.x;
      const dy = dodir.clientY - dodirTeme.y;
      dodirTeme = null;
      if (Math.abs(dx) < 56 || Math.abs(dx) < Math.abs(dy) * 1.1) return;
      pomeriTemuPrstom(dx);
    },
    { passive: true },
  );
  element?.addEventListener("touchcancel", () => {
    if (dodirTeme?.u === element) dodirTeme = null;
  });
}
vezniSwipeTeme(mobilNavTraka);
vezniSwipeTeme(mobilGradivoZaglavlje);

function mozePovuciIzborSheet(dogadjaj, sheet) {
  if (dogadjaj.target.closest(".mobil-sheet-hvat, .mobil-izbor-sheet-h")) return true;
  return sheet.scrollTop <= 0;
}

function vezniPovuciNadole(element, zatvori) {
  element?.addEventListener(
    "touchstart",
    (dogadjaj) => {
      if (!usko()) return;
      const dodir = dogadjaj.touches[0] || dogadjaj.changedTouches[0];
      if (!dodir) return;
      dodirSheet = { x: dodir.clientX, y: dodir.clientY, zatvori };
    },
    { passive: true },
  );
  element?.addEventListener(
    "touchend",
    (dogadjaj) => {
      if (!dodirSheet || dodirSheet.zatvori !== zatvori) return;
      const dodir = dogadjaj.changedTouches[0];
      const dx = dodir.clientX - dodirSheet.x;
      const dy = dodir.clientY - dodirSheet.y;
      dodirSheet = null;
      if (dy < 72 || dy < Math.abs(dx) * 1.1) return;
      zatvori();
    },
    { passive: true },
  );
  element?.addEventListener("touchcancel", () => {
    if (dodirSheet?.zatvori === zatvori) dodirSheet = null;
  });
}

function vezniPovuciNadoleIzborSheet(sheet, zatvori) {
  if (!sheet) return;
  sheet.addEventListener(
    "touchstart",
    (dogadjaj) => {
      if (!usko()) return;
      if (!mozePovuciIzborSheet(dogadjaj, sheet)) return;
      const dodir = dogadjaj.touches[0] || dogadjaj.changedTouches[0];
      if (!dodir) return;
      dodirSheet = { x: dodir.clientX, y: dodir.clientY, zatvori, sheet };
    },
    { passive: true },
  );
  sheet.addEventListener(
    "touchend",
    (dogadjaj) => {
      if (!dodirSheet || dodirSheet.sheet !== sheet || dodirSheet.zatvori !== zatvori) return;
      const dodir = dogadjaj.changedTouches[0];
      const dx = dodir.clientX - dodirSheet.x;
      const dy = dodir.clientY - dodirSheet.y;
      dodirSheet = null;
      if (dy < 72 || dy < Math.abs(dx) * 1.1) return;
      zatvori();
    },
    { passive: true },
  );
  sheet.addEventListener("touchcancel", () => {
    if (dodirSheet?.sheet === sheet) dodirSheet = null;
  });
}
vezniPovuciNadole(mobilGradivoZaglavlje, zatvoriMobilNav);
vezniPovuciNadole(mobilPodesavanja?.querySelector(".mobil-sheet-hvat"), zatvoriMobilProfil);
vezniPovuciNadole(mobilPretraga?.querySelector(".mobil-sheet-hvat"), zatvoriMobilPretragu);
vezniPovuciNadoleIzborSheet(mobilNedSheet, zatvoriMobilIzborSheetove);
vezniPovuciNadoleIzborSheet(mobilKorSheet, zatvoriMobilIzborSheetove);

const pocetno = lokalno.stanje().mesto;
const izHesha = Number((location.hash.match(/cas-(\d+)/) || [])[1]);
if (izHesha >= 1 && izHesha <= dokument.trajanjeTema) {
  uvod = false;
  cas = izHesha;
} else if (location.hash === "#uvod" || !location.hash) {
  uvod = true;
} else if (pocetno.tema >= 1 && pocetno.tema <= dokument.trajanjeTema) {
  uvod = false;
  cas = pocetno.tema;
}
async function pripremiUredjivanje() {
  try {
    const odgovor = await fetch(`/kurs.json?sveze=${Date.now()}`, { cache: "no-store" });
    if (!odgovor.ok) return;
    const sveze = await odgovor.json();
    for (const kljuc of Object.keys(dokument)) {
      if (!(kljuc in sveze)) delete dokument[kljuc];
    }
    Object.assign(dokument, sveze);
    osveziLekcije();
  } catch {
    /* ostaje ugrađeni kurs */
  }
}

Promise.all([
  fetch("/recnik")
    .then((odgovor) => odgovor.text())
    .catch(() => ""),
  ucitajIkonice(),
  pripremiUredjivanje(),
]).then(([tekst]) => {
  if (tekst) pojmovi = pojmoviIzTeksta(tekst);
  urediSadrzaj.osvezi = () => renderLecture();
  urediSadrzaj.potvrdiIzmenu = potvrdiIzmenuSadrzaja;
  urediSadrzaj.otkazi = otkaziIzmenu;
  if (urediSadrzaj.aktivan) urediSadrzaj.istorija.osveziReferencu();
  renderLecture();
  prviIzbor.pokaziAkoTreba();
});

if (urediSadrzaj.aktivan) {
  document.addEventListener("input", (dogadjaj) => {
    if (!dogadjaj.target.closest(".uredjivi-editor")) return;
    zakaziUpisNacrta();
  });
  document.addEventListener("change", (dogadjaj) => {
    if (!dogadjaj.target.closest(".uredjivi-editor")) return;
    zakaziUpisNacrta();
  });
  window.addEventListener("keydown", (dogadjaj) => {
    if (!dogadjaj.ctrlKey && !dogadjaj.metaKey) return;
    if (dogadjaj.target.closest("input, textarea, [contenteditable='true']")) return;
    const kljuc = dogadjaj.key.toLowerCase();
    if (kljuc === "z" && !dogadjaj.shiftKey) {
      dogadjaj.preventDefault();
      void korakIstorije(true);
      return;
    }
    if (kljuc === "y" || (kljuc === "z" && dogadjaj.shiftKey)) {
      dogadjaj.preventDefault();
      void korakIstorije(false);
    }
  });
}
if (!location.hash) location.hash = uvod ? "uvod" : `cas-${cas}`;
else window.dispatchEvent(new Event("hashchange"));
