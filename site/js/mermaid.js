const OTVORI = /^[ \t]*```[ \t]*mermaid[ \t]*$/im;
const ZATVORI = /^[ \t]*```[ \t]*$/;
const OPASNO = /<script\b|javascript:|on(?:error|load|click|mouse\w+|focus|toggle)\s*=/i;

const izvori = new WeakMap();
const tokeni = new WeakMap();
let red = Promise.resolve();
let ucitavanje = null;
let broj = 0;

export function imaMermaid(tekst) {
  return OTVORI.test(String(tekst ?? ""));
}

export function blokoviTeksta(tekst) {
  const blokovi = [];
  const tekstualni = [];
  let izvor = null;
  let otvaranje = "";
  const zatvoriTekst = () => {
    const spojeno = tekstualni.join("\n").trim();
    tekstualni.length = 0;
    if (spojeno) blokovi.push({ vrsta: "tekst", tekst: spojeno });
  };
  for (const redTeksta of String(tekst ?? "").split(/\r?\n/)) {
    if (izvor && ZATVORI.test(redTeksta)) {
      zatvoriTekst();
      blokovi.push({ vrsta: "mermaid", izvor: izvor.join("\n") });
      izvor = null;
      continue;
    }
    if (!izvor && OTVORI.test(redTeksta)) {
      otvaranje = redTeksta;
      izvor = [];
      continue;
    }
    if (izvor) izvor.push(redTeksta);
    else tekstualni.push(redTeksta);
  }
  if (izvor) tekstualni.push(otvaranje, ...izvor);
  zatvoriTekst();
  return blokovi;
}

export function svgJeBezbedan(svg) {
  return typeof svg === "string" && svg.includes("<svg") && !OPASNO.test(svg);
}

function uRed(posao) {
  const rezultat = red.then(posao, posao);
  red = rezultat.then(() => {}, () => {});
  return rezultat;
}

function ucitajBiblioteku() {
  if (globalThis.mermaid?.render) return Promise.resolve(globalThis.mermaid);
  if (!ucitavanje) {
    ucitavanje = new Promise((resolve, reject) => {
      const skripta = document.createElement("script");
      skripta.src = "/vendor/mermaid/mermaid.js";
      skripta.onload = () => {
        if (globalThis.mermaid?.render) resolve(globalThis.mermaid);
        else reject(new Error("nema"));
      };
      skripta.onerror = () => reject(new Error("nema"));
      document.head.append(skripta);
    }).catch((greska) => {
      ucitavanje = null;
      throw greska;
    });
  }
  return ucitavanje;
}

function temaMermaida() {
  const stil = getComputedStyle(document.documentElement);
  const tamna = stil.colorScheme !== "light";
  const uzmi = (ime) => stil.getPropertyValue(ime).trim();
  const mastilo = uzmi("--ink") || (tamna ? "#f4efe4" : "#1c1a16");
  const papir = uzmi("--paper") || (tamna ? "#1c1a16" : "#fefefe");
  const linija = uzmi("--line") || "#3a342c";
  const pozadina = uzmi("--bg") || (tamna ? "#12110e" : "#fbfbfb");
  const font = 'system-ui, "Segoe UI", sans-serif';
  return {
    startOnLoad: false,
    securityLevel: "strict",
    suppressErrorRendering: true,
    logLevel: "fatal",
    theme: "base",
    fontFamily: font,
    themeVariables: {
      darkMode: tamna,
      background: "transparent",
      fontFamily: font,
      fontSize: "16px",
      primaryColor: papir,
      primaryTextColor: mastilo,
      primaryBorderColor: linija,
      secondaryColor: uzmi("--amber-dim") || "#6a4a12",
      tertiaryColor: pozadina,
      lineColor: uzmi("--muted") || mastilo,
      textColor: mastilo,
      mainBkg: papir,
      nodeBorder: linija,
      clusterBkg: pozadina,
      titleColor: uzmi("--naslov") || mastilo,
      edgeLabelBackground: papir,
    },
  };
}

function recenica(tekst) {
  const p = document.createElement("p");
  p.className = "meta";
  p.textContent = tekst;
  return p;
}

function ocistiPrivremeno(id) {
  for (const el of document.querySelectorAll(`[id="${id}"], [id="d${id}"]`)) {
    if (!el.closest(".figura-mermaid")) el.remove();
  }
}

export function nacrtajMermaid(dom, izvor) {
  const tekst = String(izvor ?? "");
  const token = {};
  tokeni.set(dom, token);
  izvori.set(dom, tekst);
  dom.setAttribute("aria-busy", "true");
  return uRed(async () => {
    if (tokeni.get(dom) !== token || !dom.isConnected) return;
    if (!tekst.trim()) {
      dom.removeAttribute("aria-busy");
      dom.replaceChildren(recenica("Nema izvora."));
      return;
    }
    const id = `mmd${broj += 1}`;
    try {
      const mermaid = await ucitajBiblioteku();
      if (tokeni.get(dom) !== token || !dom.isConnected) return;
      mermaid.initialize(temaMermaida());
      const { svg } = await mermaid.render(id, tekst);
      ocistiPrivremeno(id);
      if (tokeni.get(dom) !== token || !dom.isConnected) return;
      if (!svgJeBezbedan(svg)) throw new Error("svg");
      dom.removeAttribute("aria-busy");
      dom.setAttribute("aria-label", "Dijagram");
      dom.innerHTML = svg;
    } catch (greska) {
      ocistiPrivremeno(id);
      if (tokeni.get(dom) !== token || !dom.isConnected) return;
      dom.removeAttribute("aria-busy");
      dom.removeAttribute("aria-label");
      const pre = document.createElement("pre");
      pre.textContent = tekst;
      const detalj = String(greska?.message || "").split("\n").map((red) => red.trim()).find(Boolean) || "";
      const poruka = detalj && detalj !== "svg" && detalj !== "nema" && detalj.length <= 160
        ? `Dijagram se ne crta. ${detalj}`
        : "Dijagram se ne crta.";
      dom.replaceChildren(recenica(poruka), pre);
    }
  });
}

export function crtajSvg(id, izvor, podesavanja) {
  return uRed(async () => {
    try {
      const mermaid = await ucitajBiblioteku();
      mermaid.initialize({ ...podesavanja, startOnLoad: false, securityLevel: "strict", suppressErrorRendering: true });
      const { svg } = await mermaid.render(id, izvor);
      if (!svgJeBezbedan(svg)) throw new Error("svg");
      return svg;
    } finally {
      ocistiPrivremeno(id);
    }
  });
}

export function osveziMermaid() {
  for (const dom of document.querySelectorAll(".figura-mermaid")) {
    if (izvori.has(dom)) void nacrtajMermaid(dom, izvori.get(dom));
  }
}
