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
const editorWrap = document.querySelector("#editor-wrap");
const editorSloj = document.querySelector("#editor-sloj");
const ucitaj = document.querySelector("#ucitaj");
const povrati = document.querySelector("#povrati");
const starost = document.querySelector("#starost");

const soba = { temperatura: 24, zeljeno: false };
let cas = 1;
let pollId = 0;
let dovod = null;
let lastSpin = "1.2s";
let editorMode = "";
let delta = 1;
const cssSnippet = ".blades {\n  animation-duration: 1.2s;\n}\n";
const frontSnippet = "let delta = 1;\nfunction korak(soba) {\n  soba.temperatura += delta;\n}\n";

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

function setDigit(node, value) {
  node.textContent = value;
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
  editorWrap.hidden = false;
  starost.hidden = cas < 8;
  showEditor();
  log.hidden = cas !== 2;
  if (cas < 4) {
    setDigit(displej, cas < 3 ? "24" : String(soba.temperatura));
    bladesLocal.classList.toggle("spin", cas === 1 || (cas === 3 && soba.zeljeno));
  } else {
    setDigit(displej, "----");
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

function showEditor() {
  const mode = cas >= 4 ? "server" : cas === 1 ? "css" : "front";
  editorSloj.textContent = mode === "server" ? "Editor, server" : "Editor, front";
  ucitaj.hidden = mode !== "server";
  povrati.hidden = mode !== "server";
  if (mode === editorMode) return;
  editorMode = mode;
  editorErr.textContent = "";
  if (mode === "css") editor.value = cssSnippet;
  else if (mode === "front") editor.value = frontSnippet;
  else {
    fetch("/api/handler")
      .then((response) => response.json())
      .then((data) => {
        editor.value = data.izvor;
      });
    return;
  }
  applyFront();
}

function applyFront() {
  if (editorMode === "css") {
    const match = editor.value.match(/animation-duration:\s*([0-9.]+)s/);
    if (!match) {
      editorErr.textContent = "Traje prethodno trajanje. Upiši animation-duration u sekundama.";
      return;
    }
    editorErr.textContent = "";
    lastSpin = `${match[1]}s`;
    bladesLocal.style.setProperty("--spin", lastSpin);
    blades.style.setProperty("--spin", lastSpin);
    return;
  }
  if (editorMode !== "front") return;
  try {
    const fn = new Function(`${editor.value}\nreturn { korak, delta };`);
    const api = fn();
    if (typeof api.korak !== "function" || typeof api.delta !== "number") {
      throw new Error("Isečak treba funkciju korak i broj delta.");
    }
    delta = api.delta;
    window.__korak = api.korak;
    editorErr.textContent = "";
  } catch (err) {
    editorErr.textContent = err.message;
  }
}

function connectDovod() {
  dovod = new EventSource("/dovod");
  dovod.onmessage = (event) => {
    const data = JSON.parse(event.data);
    setDigit(displejMasina, String(data.temperatura));
    blades.classList.toggle("spin", data.ukljucen && data.prikljucen);
    kabl.textContent = data.prikljucen ? "Kabl je u kutiji" : "Kabl je izvučen";
  };
}

async function readRoom() {
  const path = cas >= 8 ? "/api/soba?svezina=1" : "/api/soba";
  try {
    const response = await fetch(path);
    if (!response.ok) {
      setDigit(displej, "Err");
      starost.textContent = "";
      kutijaMsg.textContent = `HTTP ${response.status}`;
      return;
    }
    const data = await response.json();
    setDigit(displej, String(data.temperatura));
    prekidac.setAttribute("aria-pressed", String(data.ukljucen));
    prekidac.textContent = data.ukljucen ? "Isključi" : "Uključi";
    if (data.trenutak) starost.textContent = data.trenutak;
    kutijaMsg.textContent = "HTTP 200";
  } catch {
    setDigit(displej, "Err");
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
    prekidac.setAttribute("aria-pressed", String(data.ukljucen));
    prekidac.textContent = data.ukljucen ? "Isključi" : "Uključi";
  }
}

prekidac.addEventListener("click", () => {
  if (cas < 3) return;
  if (cas < 4) {
    soba.zeljeno = !soba.zeljeno;
    prekidac.setAttribute("aria-pressed", String(soba.zeljeno));
    prekidac.textContent = soba.zeljeno ? "Isključi" : "Uključi";
    bladesLocal.classList.toggle("spin", soba.zeljeno);
    return;
  }
  const next = prekidac.getAttribute("aria-pressed") !== "true";
  sendCommand(next);
});

sledeci.addEventListener("click", () => {
  if (typeof window.__korak === "function") window.__korak(soba);
  else soba.temperatura += delta;
  if (cas === 2) {
    log.hidden = false;
    log.textContent = `konzola: temperatura ${soba.temperatura}`;
    return;
  }
  if (cas === 3) setDigit(displej, String(soba.temperatura));
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

editor.addEventListener("input", applyFront);
ucitaj.addEventListener("click", async () => {
  const response = await fetch("/api/handler", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ izvor: editor.value }),
  });
  const data = await response.json();
  editorErr.textContent = response.ok ? "Handler je učitan. Sledeći zahtev ga koristi." : data.greska;
});
povrati.addEventListener("click", async () => {
  const response = await fetch("/api/handler/povrati", { method: "POST" });
  const data = await response.json();
  editor.value = data.izvor;
  editorErr.textContent = "Vraćen je pripremljeni isečak.";
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

if (!location.hash) location.hash = "cas-1";
else window.dispatchEvent(new Event("hashchange"));
