import { lectures, preduslovCasa } from "./lectures.js";
import { prihvatiOcitavanje } from "./svezina.js";

const nav = document.querySelector("#nav");
const casEl = document.querySelector("#cas");
const naslovCasa = document.querySelector("#naslov-casa");
const diskusijaMesto = document.querySelector("#sekcija-diskusija");
const podela = document.querySelector("#podela");
const traka = document.querySelector("#traka");
const q = document.querySelector("#q");
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
const editor = document.querySelector("#editor");
const editorErr = document.querySelector("#editor-err");
const putanja = document.querySelector("#putanja");
const tree = document.querySelector("#tree");
const tabFront = document.querySelector("#tab-front");
const tabBack = document.querySelector("#tab-back");
const sacuvaj = document.querySelector("#sacuvaj");
const povrati = document.querySelector("#povrati");
const starost = document.querySelector("#starost");
const otvoreniPojmovi = new Set();
let pojamFilter = "";

const soba = { temperatura: 24, zeljeno: false };
const tacke = [
  { temperatura: 22 },
  { temperatura: 24 },
  { temperatura: 26 },
  { temperatura: 23 },
];
let cas = 1;
let deo = "koraci";
let udeoEditora = 50;
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
let sideToken = 0;
let openToken = 0;
const openPath = { client: "css/soba.css", server: "soba.js" };
const drafts = new Map();
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

function paintNav() {
  nav.replaceChildren(
    ...lectures.map((item) => {
      const a = document.createElement("a");
      a.href = `#cas-${item.n}`;
      a.textContent = String(item.n);
      a.setAttribute("aria-current", item.n === cas ? "page" : "false");
      a.addEventListener("click", (event) => {
        event.preventDefault();
        location.hash = `cas-${item.n}`;
      });
      return a;
    })
  );
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

function renderLecture() {
  const item = lecture();
  const i = Math.min(indeksKoraka(), item.steps.length - 1);
  const korak = item.steps[i];
  const otvoreno = objasnjenjePoKoraku.get(`${cas}:${i}`) === true;
  casEl.replaceChildren();
  naslovCasa.textContent = `${item.n}. ${item.title}`;
  const preduslov = document.createElement("p");
  preduslov.id = "preduslov";
  preduslov.textContent = `Preduslov: ${preduslovCasa(item.n)}`;
  const outcome = document.createElement("p");
  outcome.id = "ishod";
  outcome.textContent = `Ishod: ${item.outcome}`;
  const broj = document.createElement("p");
  broj.className = "log";
  broj.textContent = `Korak ${i + 1} od ${item.steps.length}: ${korak.naslov}`;
  const primer = document.createElement("p");
  primer.textContent = korak.primer;
  const primerKod = document.createElement("pre");
  primerKod.textContent = korak.kod;
  const pitanje = document.createElement("p");
  pitanje.textContent = korak.pitalica;
  const kratke = document.createElement("div");
  kratke.className = "options";
  kratke.dataset.kviz = "korak";
  for (const opt of korak.opcije) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option";
    button.dataset.key = opt.key;
    button.textContent = `${opt.key}. ${opt.text}`;
    if (otvoreno && opt.ok) button.classList.add("holds");
    if (otvoreno) {
      const why = document.createElement("p");
      why.className = "why";
      why.textContent = opt.why;
      button.append(why);
    }
    button.addEventListener("click", () => {
      button.focus();
    });
    kratke.append(button);
  }
  const otvori = document.createElement("button");
  otvori.type = "button";
  otvori.textContent = otvoreno ? "Objašnjenje je otvoreno" : "Otvori objašnjenje";
  otvori.addEventListener("click", () => {
    objasnjenjePoKoraku.set(`${cas}:${i}`, true);
    renderLecture();
  });
  const objasnjenje = document.createElement("p");
  objasnjenje.className = "objasnjenje";
  objasnjenje.hidden = !otvoreno;
  objasnjenje.textContent = korak.objasnjenje;
  const put = document.createElement("p");
  put.hidden = !otvoreno;
  const putanjaKoraka = document.createElement("span");
  putanjaKoraka.id = "putanja-koraka";
  putanjaKoraka.textContent = korak.putanja;
  put.append("Fajl: ", putanjaKoraka);
  const vec = document.createElement("pre");
  vec.className = "vec";
  const ranije = vecUkucano(item, i, korak.putanja);
  vec.hidden = !ranije;
  vec.textContent = ranije ? `Već u fajlu:\n${ranije}` : "";
  const delic = document.createElement("pre");
  delic.className = "delic";
  delic.hidden = !otvoreno;
  delic.textContent = korak.delic;
  const hod = document.createElement("div");
  hod.className = "row";
  const prethodni = document.createElement("button");
  prethodni.type = "button";
  prethodni.textContent = "Prethodni korak";
  prethodni.disabled = i === 0;
  prethodni.addEventListener("click", () => {
    korakPoCasu.set(cas, i - 1);
    renderLecture();
  });
  const daljeKorak = document.createElement("button");
  daljeKorak.type = "button";
  daljeKorak.textContent = "Sledeći korak časa";
  daljeKorak.disabled = i === item.steps.length - 1;
  daljeKorak.addEventListener("click", () => {
    korakPoCasu.set(cas, i + 1);
    renderLecture();
  });
  hod.append(prethodni, daljeKorak);
  const diskusija = nacrtajDiskusiju(item);
  const terms = document.createElement("div");
  terms.className = "terms";
  terms.id = "pojmovi";
  const vidljivi = pojamFilter
    ? item.terms.filter((term) => `${term.name} ${term.hint} ${term.body}`.toLowerCase().includes(pojamFilter))
    : item.terms;
  for (const term of vidljivi) {
    const kljuc = `${item.n}:${term.id}`;
    const wrap = document.createElement("div");
    const button = document.createElement("button");
    button.type = "button";
    button.id = `pojam-${term.id}`;
    button.textContent = `${term.name} — ${term.hint}`;
    const body = document.createElement("div");
    body.hidden = !otvoreniPojmovi.has(kljuc);
    const p = document.createElement("p");
    p.textContent = term.body;
    const pre = document.createElement("pre");
    pre.textContent = term.code;
    body.append(p, pre);
    button.addEventListener("click", () => {
      if (otvoreniPojmovi.has(kljuc)) otvoreniPojmovi.delete(kljuc);
      else otvoreniPojmovi.add(kljuc);
      body.hidden = !otvoreniPojmovi.has(kljuc);
    });
    wrap.append(button, body);
    terms.append(wrap);
  }
  const overview = document.createElement("p");
  overview.className = "log";
  overview.id = "osvrt";
  overview.textContent = `Osvrt: ${item.overview}`;
  const izlaz = document.createElement("label");
  izlaz.className = "izlaz";
  izlaz.textContent = item.izlaz;
  const izlazPolje = document.createElement("textarea");
  izlazPolje.rows = 3;
  izlazPolje.setAttribute("aria-label", "Izlazno pitanje");
  const ponovi = document.createElement("button");
  ponovi.type = "button";
  ponovi.id = "ponovi-pitanje";
  ponovi.textContent = "Ponovi pitanje";
  ponovi.addEventListener("click", () => {
    objasnjenjePoKoraku.delete(`${cas}:${i}`);
    fazaPoCasu.set(kljucDiskusije(), 0);
    podvucenoPoCasu.delete(kljucDiskusije());
    renderLecture();
  });
  casEl.append(preduslov, outcome, broj, primer, primerKod, pitanje, kratke, otvori, ponovi, objasnjenje, put, vec, delic, hod, terms, overview, izlaz, izlazPolje);
  diskusijaMesto.replaceChildren(diskusija);
  prikaziDeo();
  paintNav();
  fitPanel();
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
    button.textContent = `${opt.key}. ${opt.text}`;
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
  const local = cas < 4;
  sobaMasina.hidden = local;
  sledeci.hidden = cas > 3;
  procitaj.hidden = cas < 4;
  polling.hidden = cas < 8;
  svezina.hidden = cas < 8;
  prag.hidden = cas < 8;
  stanjeCitanja.hidden = cas < 5;
  istorija.hidden = cas < 7;
  kabl.hidden = cas < 5;
  sesije.hidden = cas < 9;
  fanLocal.hidden = true;
  bladesLocal.classList.remove("spin");
  starost.hidden = cas < 8;
  focusFile();
  loadSide();
  log.hidden = cas !== 2;
  grafikon.hidden = cas !== 3;
  if (cas < 8) zaustaviPeriodicno();
  if (cas === 2 || cas === 3) osveziNiz();
  if (cas < 3) displejSobe.crtaj("24");
  else if (cas >= 4) displejSobe.crtaj(cifreSobe === null ? "----" : cifreSobe);
  if (cas >= 4 && !dovod) connectDovod();
  uskladiKutiju();
}

function zaustaviPeriodicno() {
  clearInterval(pollId);
  pollId = 0;
  polling.setAttribute("aria-pressed", "false");
}

function zapamtiCifreSobe() {
  if (cas >= 4) cifreSobe = displej.textContent;
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
    uskladiZastavicu("takt", "/api/takt", cas >= 5),
    uskladiZastavicu("uloge", "/api/uloge", cas >= 9),
    uskladiZastavicu("baza", "/api/baza", cas >= 7),
  ]).then(() => {
    if (cas >= 7) return osveziIstoriju();
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
  if (cas < 7) return;
  const response = await fetch("/api/soba");
  const data = await response.json().catch(() => null);
  if (!data || !data.istorija) return;
  nacrtajIstoriju(data.istorija);
}

function fileForLecture(n) {
  if (n === 1) return ["client", "css/soba.css"];
  if (n === 2) return ["client", "js/niz.js"];
  if (n === 3) return ["client", "js/prekidac.js"];
  if (n === 5) return ["client", "js/displej.js"];
  if (n === 6 || n === 7) return ["server", "ventilator.js"];
  if (n === 9) return ["server", "sesija.js"];
  return ["server", "soba.js"];
}

function focusFile() {
  const korak = trenutniKorak();
  const putanjaKoraka = korak ? korak.putanja : null;
  const [side, put] = putanjaKoraka
    ? [putanjaKoraka.slice(0, putanjaKoraka.indexOf("/")), putanjaKoraka.slice(putanjaKoraka.indexOf("/") + 1)]
    : fileForLecture(cas);
  const kljuc = `${cas}:${indeksKoraka()}:${side}:${put}`;
  if (openedForCas === kljuc) return;
  openedForCas = kljuc;
  strana = side;
  openPath[side] = put;
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
    span.textContent = `${name}/`;
    li.append(span, renderNode(child));
    ul.append(li);
  }
  for (const file of node.files) {
    const li = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = file.name;
    button.dataset.put = file.put;
    button.setAttribute("aria-current", file.put === openPath[strana] ? "true" : "false");
    button.addEventListener("click", () => openFile(file.put));
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

async function loadSide() {
  const token = ++sideToken;
  const side = strana;
  tabFront.setAttribute("aria-selected", String(side === "client"));
  tabBack.setAttribute("aria-selected", String(side === "server"));
  const response = await fetch(`/api/stablo?strana=${side}`);
  const data = await response.json();
  if (token !== sideToken) return;
  paintTree(data.fajlovi);
  await openFile(openPath[side]);
}

async function openFile(put) {
  const token = ++openToken;
  const side = strana;
  openPath[side] = put;
  putanja.textContent = `${side}/${put}`;
  markOpen(put);
  const key = `${side}:${put}`;
  if (drafts.has(key)) {
    editor.value = drafts.get(key);
    applyLive();
    return;
  }
  const response = await fetch(`/api/fajl?strana=${side}&put=${encodeURIComponent(put)}`);
  const data = await response.json();
  if (token !== openToken) return;
  editor.value = data.izvor || "";
  drafts.set(key, editor.value);
  editorErr.textContent = "";
  applyLive();
}

function applyCss(source) {
  const match = source.match(/animation-duration:\s*([0-9.]+)s/);
  if (!match) {
    editorErr.textContent = "Traje prethodno trajanje. Upiši animation-duration u sekundama.";
    return false;
  }
  editorErr.textContent = "";
  lastSpin = `${match[1]}s`;
  bladesLocal.style.animationDuration = lastSpin;
  blades.style.animationDuration = lastSpin;
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
    if (!quiet) editorErr.textContent = err.message;
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
    if (!quiet) editorErr.textContent = err.message;
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
    if (!quiet) editorErr.textContent = err.message;
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
    if (!quiet) editorErr.textContent = err.message;
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
    if (strana === "client" && openPath.client === "js/niz.js") editorErr.textContent = err.message;
    return;
  }
  if (cas === 2) {
    log.hidden = false;
    const prosek = Math.round(slika.prosek * 10) / 10;
    log.textContent = `konzola: temperatura ${soba.temperatura} | visine ${slika.visine.join(", ")} | prosek ${prosek}`;
  }
  if (cas === 3) {
    try {
      nacrtajNiz(grafikon, slika.visine);
    } catch (err) {
      if (strana === "client" && openPath.client === "js/niz.js") editorErr.textContent = err.message;
    }
  }
}

function applyLive() {
  const put = openPath[strana];
  if (strana === "client" && put === "css/soba.css") return applyCss(editor.value);
  if (strana === "client" && put === "js/korak.js") return applyKorak(editor.value);
  if (strana === "client" && put === "js/niz.js") return applyNiz(editor.value);
  if (strana === "client" && put === "js/displej.js") return applyDisplej(editor.value);
  if (strana === "client" && put === "js/prekidac.js") return applyPrekidac(editor.value);
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
  const path = cas >= 8 ? "/api/soba?svezina=1" : "/api/soba";
  const provera = svezina.getAttribute("aria-pressed") === "true";
  if (cas >= 5) stanjeCitanja.textContent = "čekanje";
  try {
    const response = await fetch(path);
    const data = response.ok ? await response.json() : null;
    if (response.ok && !prihvatiOcitavanje(provera, poslednjiTrenutak, data && data.trenutak)) {
      if (cas >= 5) stanjeCitanja.textContent = "podatak";
      return;
    }
    if (!response.ok) {
      if (cas === 4) displejSobe.crtaj("----");
      if (cas >= 5) {
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
    if (cas >= 5) stanjeCitanja.textContent = "podatak";
    if (cas >= 7) nacrtajIstoriju(data.istorija);
    kutijaMsg.textContent = "HTTP 200";
    zapamtiCifreSobe();
  } catch {
    if (cas === 4) displejSobe.crtaj("----");
    if (cas >= 5) {
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
      if (cas >= 7) await osveziIstoriju();
      return;
    }
    if (response.status !== 500) prekidacSobe.crtaj(prethodno);
  } catch {
    kutijaMsg.textContent = "nema statusa";
  }
}

prekidac.addEventListener("click", () => {
  if (cas < 2) return;
  if (cas < 4) {
    soba.zeljeno = !soba.zeljeno;
    prekidacSobe.crtaj(soba.zeljeno);
    return;
  }
  sendCommand(!prekidacSobe.ukljucen);
});

sledeci.addEventListener("click", () => {
  if (typeof window.__korak === "function") window.__korak(soba);
  else soba.temperatura += 1;
  if (cas === 2 || cas === 3) {
    tacke.push({ temperatura: soba.temperatura });
    if (tacke.length > 40) tacke.shift();
  }
  if (cas === 2) {
    osveziNiz();
    return;
  }
  if (cas === 3) {
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

editor.addEventListener("input", () => {
  drafts.set(`${strana}:${openPath[strana]}`, editor.value);
  applyLive();
});

tabFront.addEventListener("click", () => {
  if (strana === "client") return;
  strana = "client";
  loadSide();
});
tabBack.addEventListener("click", () => {
  if (strana === "server") return;
  strana = "server";
  loadSide();
});

sacuvaj.addEventListener("click", async () => {
  const put = openPath[strana];
  const response = await fetch("/api/fajl", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ strana, put, izvor: editor.value }),
  });
  const data = await response.json();
  if (!response.ok) {
    editorErr.textContent = data.greska;
    return;
  }
  drafts.set(`${strana}:${put}`, editor.value);
  if (strana === "client") editorErr.textContent = "Sačuvano. Panel već koristi ovu izmenu.";
  else if (data.pokretanje) editorErr.textContent = "Sačuvano. Ovaj fajl se čita kad se proces pokrene.";
  else editorErr.textContent = "Sačuvano. Sledeći zahtev koristi ovaj fajl.";
});

povrati.addEventListener("click", async () => {
  const put = openPath[strana];
  const response = await fetch("/api/fajl/povrati", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ strana, put }),
  });
  const data = await response.json();
  if (!response.ok) {
    editorErr.textContent = data.greska;
    return;
  }
  editor.value = data.izvor;
  drafts.set(`${strana}:${put}`, data.izvor);
  if (!applyLive()) return;
  editorErr.textContent = data.pokretanje
    ? "Vraćen je pripremljeni fajl. Ovaj fajl se čita kad se proces pokrene."
    : "Vraćen je pripremljeni fajl.";
});

document.querySelector("#search-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const needle = q.value.trim().toLowerCase();
  pojamFilter = needle;
  if (!needle) {
    renderLecture();
    return;
  }
  const red = [lecture(), ...lectures.filter((item) => item.n !== cas)];
  for (const item of red) {
    const term = item.terms.find((entry) => `${entry.name} ${entry.hint} ${entry.body}`.toLowerCase().includes(needle));
    if (!term) continue;
    otvoreniPojmovi.add(`${item.n}:${term.id}`);
    deo = "koraci";
    cas = item.n;
    location.hash = `cas-${item.n}`;
    renderLecture();
    return;
  }
  renderLecture();
});

window.addEventListener("hashchange", () => {
  const n = Number((location.hash.match(/cas-(\d+)/) || [])[1]);
  if (n >= 1 && n <= 10) {
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
if (!location.hash) location.hash = "cas-1";
else window.dispatchEvent(new Event("hashchange"));
