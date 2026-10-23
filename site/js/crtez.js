import { mermaidFigura, tekstoviFigure } from "./figura.js";

const IZVOR_MERMAIDA = "/vendor/mermaid/mermaid.min.js";
const nacrtano = new Map();
let ucitavanje = null;
let brojac = 0;

function ucitajMermaid() {
  if (ucitavanje) return ucitavanje;
  ucitavanje = new Promise((resolve, reject) => {
    const skripta = document.createElement("script");
    skripta.src = IZVOR_MERMAIDA;
    skripta.onload = () => {
      window.mermaid.initialize({
        startOnLoad: false,
        securityLevel: "strict",
        theme: "base",
        look: "classic",
        fontFamily: "inherit",
        flowchart: { curve: "linear" },
        timeline: { disableMulticolor: true },
      });
      resolve(window.mermaid);
    };
    skripta.onerror = () => {
      ucitavanje = null;
      skripta.remove();
      reject(new Error("Mermaid se nije učitao."));
    };
    document.head.append(skripta);
  });
  return ucitavanje;
}

function oznaciRedosled(mesto) {
  const svg = mesto.querySelector("svg");
  if (!svg) return;
  const redom = (elementi, korak, pomak) => elementi.forEach((element, i) => {
    element.classList.add("crtez-redom");
    element.style.setProperty("--redom", String(i * korak + pomak));
  });
  if (mesto.dataset.vrsta === "put") {
    redom(svg.querySelectorAll(".nodes > .node"), 2, 0);
    redom(svg.querySelectorAll(".edgePaths > path"), 2, 1);
  } else {
    redom(svg.querySelectorAll(":scope > .taskWrapper"), 1, 0);
    redom(svg.querySelectorAll(":scope > .eventWrapper"), 1, 0);
  }
}

// Mermaid timeline vuče isprekidane linije do dna crteža; skraćuju se do prvog događaja i viewBox se steže.
function skratiLiniju(svg) {
  const vrhovi = [...svg.querySelectorAll(":scope > .eventWrapper")]
    .map((dogadjaj) => dogadjaj.transform.baseVal.consolidate()?.matrix.f)
    .filter(Number.isFinite);
  const linije = svg.querySelectorAll(":scope > .lineWrapper > line[stroke-dasharray]");
  if (vrhovi.length === 0) linije.forEach((linija) => linija.parentNode.remove());
  else linije.forEach((linija) => linija.setAttribute("y2", String(Math.min(...vrhovi) - 6)));
}

function stegni(svg) {
  const okvir = svg.getBBox();
  if (!okvir.width || !okvir.height) return;
  const pad = 8;
  const sirina = okvir.width + pad * 2;
  svg.setAttribute("viewBox", `${okvir.x - pad} ${okvir.y - pad} ${sirina} ${okvir.height + pad * 2}`);
  svg.style.maxWidth = `${sirina}px`;
}

function sredi(svg, vrsta) {
  const merilo = document.createElement("div");
  merilo.className = "figura";
  merilo.dataset.vrsta = vrsta;
  merilo.style.cssText = "position:absolute;left:-10000px;top:0;width:760px;visibility:hidden";
  merilo.innerHTML = svg;
  document.body.append(merilo);
  const crtez = merilo.querySelector("svg");
  if (crtez) {
    if (vrsta === "linija") skratiLiniju(crtez);
    stegni(crtez);
  }
  const sredjen = merilo.innerHTML;
  merilo.remove();
  return sredjen;
}

function postaviSvg(mesto, svg) {
  mesto.innerHTML = svg;
  mesto.classList.remove("ceka");
  oznaciRedosled(mesto);
}

// Mermaid crta asinhrono; keš po izvoru drži isti crtež bez treptanja kad se korak ponovo iscrta.
export function nacrtajFiguru(mesto, figura) {
  const izvor = mermaidFigura(figura);
  mesto.dataset.izvor = izvor;
  mesto.dataset.vrsta = figura?.vrsta || "";
  if (figura?.pokret) mesto.dataset.pokret = figura.pokret;
  else delete mesto.dataset.pokret;
  mesto.setAttribute("role", "img");
  mesto.setAttribute("aria-label", tekstoviFigure(figura).join(", "));
  if (nacrtano.has(izvor)) {
    postaviSvg(mesto, nacrtano.get(izvor));
    return Promise.resolve();
  }
  mesto.classList.add("ceka");
  mesto.replaceChildren();
  return ucitajMermaid()
    .then((mermaid) => mermaid.render(`crtez-${++brojac}`, izvor))
    .then(({ svg }) => {
      const sredjen = sredi(svg, figura.vrsta);
      nacrtano.set(izvor, sredjen);
      if (mesto.dataset.izvor === izvor) postaviSvg(mesto, sredjen);
    })
    .catch(() => {
      if (mesto.dataset.izvor !== izvor) return;
      mesto.classList.remove("ceka");
      const greska = document.createElement("p");
      greska.className = "err";
      greska.textContent = "Crtež nije nacrtan.";
      mesto.replaceChildren(greska);
    });
}
