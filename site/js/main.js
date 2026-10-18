import { lectures } from "./lectures.js";

const nav = document.querySelector("#nav");
const casEl = document.querySelector("#cas");
const q = document.querySelector("#q");
const displej = document.querySelector("#displej");
const displejMasina = document.querySelector("#displej-masina");
const sobaMasina = document.querySelector("#soba-masina");
const prekidac = document.querySelector("#prekidac");
const sledeci = document.querySelector("#sledeci");
const procitaj = document.querySelector("#procitaj");
const polling = document.querySelector("#polling");
const fanLocal = document.querySelector("#fan-local");
const bladesLocal = document.querySelector("#blades-local");
const blades = document.querySelector("#blades");
const kabl = document.querySelector("#kabl");
const sesije = document.querySelector("#sesije");
const log = document.querySelector("#log");
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

const soba = { temperatura: 24, zeljeno: false };
let cas = 1;
let pollId = 0;
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
  posleCitanja(response, data) {
    this.crtaj(!response.ok ? "Err" : data.temperatura);
  },
};
let displejMasine = {
  crtaj(vrednost) {
    displejMasina.textContent = String(vrednost);
  },
};
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

function renderLecture() {
  const item = lecture();
  casEl.replaceChildren();
  const h = document.createElement("h1");
  h.textContent = `${item.n}. ${item.title}`;
  const outcome = document.createElement("p");
  outcome.textContent = item.outcome;
  const problem = document.createElement("p");
  problem.textContent = item.problem;
  const options = document.createElement("div");
  options.className = "options";
  let opened = false;
  function showReasons() {
    opened = true;
    for (const button of options.querySelectorAll("button")) {
      const opt = item.options.find((entry) => entry.key === button.dataset.key);
      button.classList.toggle("holds", opt.ok);
      if (!button.querySelector(".why")) {
        const why = document.createElement("p");
        why.className = "why";
        why.textContent = opt.why;
        button.append(why);
      }
    }
  }
  for (const opt of item.options) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option";
    button.dataset.key = opt.key;
    button.textContent = `${opt.key}. ${opt.text}`;
    button.addEventListener("click", showReasons);
    options.append(button);
  }
  const again = document.createElement("button");
  again.type = "button";
  again.textContent = "Ponovi pitanje";
  again.addEventListener("click", () => renderLecture());
  const show = document.createElement("button");
  show.type = "button";
  show.textContent = "Pokaži razloge";
  show.addEventListener("click", () => {
    if (!opened) showReasons();
  });
  const terms = document.createElement("div");
  terms.className = "terms";
  terms.id = "pojmovi";
  for (const term of item.terms) {
    const wrap = document.createElement("div");
    const button = document.createElement("button");
    button.type = "button";
    button.id = `pojam-${term.id}`;
    button.textContent = `${term.name} — ${term.hint}`;
    const body = document.createElement("div");
    body.hidden = true;
    const p = document.createElement("p");
    p.textContent = term.body;
    const pre = document.createElement("pre");
    pre.textContent = term.code;
    body.append(p, pre);
    button.addEventListener("click", () => {
      body.hidden = !body.hidden;
    });
    wrap.append(button, body);
    terms.append(wrap);
  }
  const overview = document.createElement("p");
  overview.className = "log";
  overview.textContent = `Osvrt: ${item.overview}`;
  casEl.append(h, outcome, problem, options, show, again, terms, overview);
  paintNav();
  fitPanel();
}

function fitPanel() {
  const local = cas < 4;
  sobaMasina.hidden = local;
  sledeci.hidden = cas > 3;
  procitaj.hidden = cas < 4;
  polling.hidden = cas < 8;
  kabl.hidden = cas < 5;
  sesije.hidden = cas < 9;
  fanLocal.hidden = cas > 3;
  starost.hidden = cas < 8;
  focusFile();
  loadSide();
  log.hidden = cas !== 2;
  if (cas < 4) {
    displejSobe.crtaj(cas < 3 ? "24" : soba.temperatura);
    bladesLocal.classList.toggle("spin", cas === 1 || (cas === 3 && soba.zeljeno));
  } else {
    displejSobe.crtaj("----");
  }
  if (cas >= 4 && !dovod) connectDovod();
  if (cas >= 5) fetch("/api/takt", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ukljucen: true }) });
  fetch("/api/uloge", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ukljucen: cas >= 9 }),
  });
  fetch("/api/baza", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ukljucen: cas >= 7 }),
  });
}

function fileForLecture(n) {
  if (n === 1) return ["client", "css/soba.css"];
  if (n === 2) return ["client", "js/korak.js"];
  if (n === 3) return ["client", "js/prekidac.js"];
  if (n === 5) return ["client", "js/displej.js"];
  if (n === 6 || n === 7) return ["server", "ventilator.js"];
  if (n === 9) return ["server", "sesija.js"];
  return ["server", "soba.js"];
}

function focusFile() {
  if (openedForCas === cas) return;
  openedForCas = cas;
  const [side, put] = fileForLecture(cas);
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
    if (typeof sobaInstanca.crtaj !== "function" || typeof sobaInstanca.posleCitanja !== "function") {
      throw new Error("Klasa Displej treba crtaj i posleCitanja.");
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

function applyLive() {
  const put = openPath[strana];
  if (strana === "client" && put === "css/soba.css") return applyCss(editor.value);
  if (strana === "client" && put === "js/korak.js") return applyKorak(editor.value);
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
  try {
    const response = await fetch(path);
    const data = response.ok ? await response.json() : null;
    if (!response.ok) {
      if (cas >= 5) displejSobe.posleCitanja(response, data);
      starost.textContent = "";
      kutijaMsg.textContent = `HTTP ${response.status}`;
      return;
    }
    displejSobe.posleCitanja(response, data);
    prekidacSobe.crtaj(data.ukljucen);
    if (data.trenutak) starost.textContent = data.trenutak;
    kutijaMsg.textContent = "HTTP 200";
  } catch {
    if (cas >= 5) displejSobe.posleCitanja({ ok: false }, null);
    kutijaMsg.textContent = "nema statusa";
  }
}

async function sendCommand(ukljucen) {
  const response = await fetch("/api/ventilator", {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ukljucen }),
  });
  kutijaMsg.textContent = `HTTP ${response.status}`;
  if (response.ok) {
    const data = await response.json();
    prekidacSobe.crtaj(data.ukljucen);
  }
}

prekidac.addEventListener("click", () => {
  if (cas < 3) return;
  if (cas < 4) {
    soba.zeljeno = !soba.zeljeno;
    prekidacSobe.crtaj(soba.zeljeno);
    bladesLocal.classList.toggle("spin", soba.zeljeno);
    return;
  }
  const next = !prekidacSobe.ukljucen;
  sendCommand(next);
});

sledeci.addEventListener("click", () => {
  if (typeof window.__korak === "function") window.__korak(soba);
  else soba.temperatura += 1;
  if (cas === 2) {
    log.hidden = false;
    log.textContent = `konzola: temperatura ${soba.temperatura}`;
    return;
  }
  if (cas === 3) displejSobe.crtaj(soba.temperatura);
});

procitaj.addEventListener("click", readRoom);
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
  if (!needle) return;
  for (const item of lectures) {
    const term = item.terms.find((entry) => `${entry.name} ${entry.hint} ${entry.body}`.toLowerCase().includes(needle));
    if (!term) continue;
    location.hash = `cas-${item.n}`;
    requestAnimationFrame(() => {
      const button = document.querySelector(`#pojam-${term.id}`);
      if (!button) return;
      button.click();
      if (button.nextElementSibling.hidden) button.click();
      button.focus();
    });
    return;
  }
});

window.addEventListener("hashchange", () => {
  const n = Number((location.hash.match(/cas-(\d+)/) || [])[1]);
  if (n >= 1 && n <= 10) {
    cas = n;
    renderLecture();
  }
});

prime("js/korak.js", (source) => applyKorak(source, true));
prime("js/displej.js", (source) => applyDisplej(source, true));
prime("js/prekidac.js", (source) => applyPrekidac(source, true));
if (!location.hash) location.hash = "cas-1";
else window.dispatchEvent(new Event("hashchange"));
