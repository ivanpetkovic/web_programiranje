const INK = "#241f1a";
const MUTED = "#5e584e";
const PLAVA = "#1a4f8b";
const PAPIR = "#f7f4ee";
const TRAKA = "#e4eaf8";
const KUTIJA = "#fffcf7";
const SANS = "system-ui, sans-serif";
const KOD = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

const W = 1020;
const H = 1068;
const RED = { K: 168, S: 376, O: 584, F: 800 };
const FUN = { x: 348, w: 204, h: 70 };
const PROTO = { x: 692, w: 220, h: 60 };
const POLUPR = 34;

const OPIS = "Prototipski lanac. ana i marko vode na Korisnik.prototype, o1 i o2 na Object.prototype. Korisnik.prototype vodi na Osoba.prototype, a Osoba.prototype i Function.prototype vode na Object.prototype. Object.prototype vodi na null. Funkcije Korisnik, Osoba, Object i Function vode na Function.prototype. Svaka funkcija ima svojstvo prototype, a svaki prototip svojstvo constructor.";

let broj = 0;

function esc(tekst) {
  return String(tekst ?? "").replace(/[&<>"]/g, (znak) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
  })[znak]);
}

function natpis(x, y, tekst, {
  size = 13,
  weight = 500,
  anchor = "middle",
  fill = INK,
  font = SANS,
  halo = false,
  style = "",
} = {}) {
  const obrub = halo ? ` stroke="${PAPIR}" stroke-width="4" paint-order="stroke fill" stroke-linejoin="round"` : "";
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" fill="${fill}" font-family="${font}" font-size="${size}" font-weight="${weight}"${obrub}${style}>${esc(tekst)}</text>`;
}

function redovi(x, y, linije, opcije) {
  const visina = opcije.razmak || 16;
  const pocetak = y - ((linije.length - 1) * visina) / 2;
  return linije.map((linija, i) => natpis(x, pocetak + i * visina, linija, opcije)).join("");
}

export function svgRasporeda() {
  const id = `proto-${broj += 1}`;
  const deo = [];
  const funDesno = FUN.x + FUN.w;
  const funSredina = FUN.x + FUN.w / 2;
  const protoLevo = PROTO.x;
  const protoDesno = PROTO.x + PROTO.w;
  const protoSredina = PROTO.x + PROTO.w / 2;

  const strelica = (od, ka, vrsta, d) => {
    const crta = vrsta === "proto" ? ' stroke-dasharray="5 4"' : "";
    deo.push(`<path data-veza="${vrsta}" data-od="${esc(od)}" data-ka="${esc(ka)}" d="${d}" fill="none" stroke="${INK}" stroke-width="1.55"${crta} marker-end="url(#${id})" stroke-linejoin="round"/>`);
  };

  deo.push(`<rect x="318" y="46" width="262" height="804" fill="${TRAKA}"/>`);

  deo.push(natpis(164, 28, "Instance", { size: 15, weight: 700 }));
  deo.push(natpis(funSredina, 28, "Funkcije", { size: 15, weight: 700 }));
  deo.push(natpis(protoSredina, 28, "Prototipovi", { size: 15, weight: 700 }));

  const par = (zadnje, prednje, natpisZadnjeg, natpisPrednjeg) => {
    deo.push(`<circle cx="${zadnje.x}" cy="${zadnje.y}" r="${POLUPR}" fill="${KUTIJA}" stroke="${INK}" stroke-width="1.6"/>`);
    deo.push(`<circle cx="${prednje.x}" cy="${prednje.y}" r="${POLUPR}" fill="${KUTIJA}" stroke="${INK}" stroke-width="1.6"/>`);
    deo.push(natpis(zadnje.x - 2, zadnje.y + 5, natpisZadnjeg, { size: 13 }));
    deo.push(natpis(prednje.x, prednje.y + 5, natpisPrednjeg, { size: 15, weight: 700, fill: PLAVA }));
  };

  par({ x: 140, y: RED.K - 22 }, { x: 184, y: RED.K + 18 }, "marko", "ana");
  par({ x: 140, y: RED.O + 24 }, { x: 184, y: RED.O - 18 }, "o2", "o1");
  deo.push(natpis(164, 96, "… = new Korisnik()", { size: 13, fill: MUTED }));
  deo.push(natpis(164, 512, "… = new Object()", { size: 13, fill: MUTED }));
  deo.push(`<circle cx="218" cy="${RED.K + 18}" r="3.4" fill="${INK}"/>`);
  deo.push(`<circle cx="218" cy="${RED.O - 18}" r="3.4" fill="${INK}"/>`);

  const funkcija = (red, ime) => {
    const y = red - FUN.h / 2;
    deo.push(`<rect x="${FUN.x}" y="${y}" width="${FUN.w}" height="${FUN.h}" fill="${KUTIJA}" stroke="${INK}" stroke-width="1.7"/>`);
    deo.push(natpis(funSredina, red - 6, "function", { size: 13, fill: MUTED }));
    deo.push(natpis(funSredina, red + 16, `${ime}()`, { size: 17, weight: 700, font: KOD }));
  };
  funkcija(RED.K, "Korisnik");
  funkcija(RED.S, "Osoba");
  funkcija(RED.O, "Object");
  funkcija(RED.F, "Function");

  const prototip = (red, ime) => {
    const y = red - PROTO.h / 2;
    deo.push(`<rect x="${PROTO.x}" y="${y}" width="${PROTO.w}" height="${PROTO.h}" rx="30" fill="${KUTIJA}" stroke="${INK}" stroke-width="1.7"/>`);
    deo.push(natpis(protoSredina, red + 5, ime, { size: 14, weight: 650, font: KOD }));
  };
  prototip(RED.K, "Korisnik.prototype");
  prototip(RED.S, "Osoba.prototype");
  prototip(RED.O, "Object.prototype");
  prototip(RED.F, "Function.prototype");
  deo.push(natpis(978, RED.O + 4, "null", { size: 18, weight: 700, anchor: "start", style: ' font-style="italic"' }));

  const vodoravno = (red, ime) => {
    const gore = red - 12;
    const dole = red + 14;
    strelica(ime, `${ime}.prototype`, "prototype", `M ${funDesno} ${gore} L ${protoLevo} ${gore}`);
    strelica(`${ime}.prototype`, ime, "constructor", `M ${protoLevo} ${dole} L ${funDesno} ${dole}`);
    deo.push(natpis(622, gore - 7, "prototype", { size: 12, fill: MUTED, halo: true }));
    deo.push(natpis(622, dole + 15, "constructor", { size: 12, fill: MUTED, halo: true }));
  };
  vodoravno(RED.K, "Korisnik");
  vodoravno(RED.S, "Osoba");
  vodoravno(RED.O, "Object");
  vodoravno(RED.F, "Function");

  strelica("ana", "Korisnik.prototype", "proto", `M 220 ${RED.K + 14} C 330 58, 620 54, 760 ${RED.K - PROTO.h / 2 + 2}`);
  deo.push(natpis(500, 74, "__proto__", { size: 12, fill: MUTED, halo: true, font: KOD }));

  strelica("o1", "Object.prototype", "proto", `M 220 ${RED.O - 22} C 360 470, 560 490, 750 ${RED.O - PROTO.h / 2 + 2}`);
  deo.push(natpis(430, 486, "__proto__", { size: 12, fill: MUTED, halo: true, font: KOD }));

  strelica("Korisnik.prototype", "Osoba.prototype", "proto", `M ${protoSredina} ${RED.K + PROTO.h / 2} L ${protoSredina} ${RED.S - PROTO.h / 2}`);
  deo.push(natpis(protoSredina - 8, (RED.K + RED.S) / 2 + 4, "__proto__", { size: 12, fill: MUTED, halo: true, font: KOD, anchor: "end" }));

  strelica("Osoba.prototype", "Object.prototype", "proto", `M ${protoSredina} ${RED.S + PROTO.h / 2} L ${protoSredina} ${RED.O - PROTO.h / 2}`);
  deo.push(natpis(protoSredina - 8, (RED.S + RED.O) / 2 + 4, "__proto__", { size: 12, fill: MUTED, halo: true, font: KOD, anchor: "end" }));

  strelica("Function.prototype", "Object.prototype", "proto", `M ${protoSredina + 72} ${RED.F - PROTO.h / 2} L ${protoSredina + 72} ${RED.O + PROTO.h / 2}`);
  deo.push(natpis(protoSredina + 80, (RED.O + RED.F) / 2 + 4, "__proto__", { size: 12, fill: MUTED, halo: true, font: KOD, anchor: "start" }));

  strelica("Object.prototype", "null", "proto", `M ${protoDesno} ${RED.O - 16} C 948 ${RED.O - 16}, 958 ${RED.O - 8}, 968 ${RED.O - 2}`);

  const dnoFunkcije = (red) => red + FUN.h / 2;
  strelica("Korisnik", "Function.prototype", "proto", `M ${FUN.x} ${dnoFunkcije(RED.K) - 4} C 200 210, 40 250, 40 340 L 40 990 C 40 1032, 160 1036, 340 1036 L 840 1036 C 980 1036, 968 880, 888 ${RED.F + PROTO.h / 2 + 2}`);
  deo.push(natpis(520, 1024, "__proto__", { size: 12, fill: MUTED, halo: true, font: KOD }));

  strelica("Osoba", "Function.prototype", "proto", `M ${FUN.x} ${RED.S + 16} C 180 392, 78 392, 78 460 L 78 948 C 78 978, 200 982, 360 982 L 760 982 C 900 982, 860 870, 812 ${RED.F + PROTO.h / 2 + 2}`);
  deo.push(natpis(480, 970, "__proto__", { size: 12, fill: MUTED, halo: true, font: KOD }));
  deo.push(redovi(108, 860, ["Korisnik i Osoba", "su funkcije"], {
    size: 12, fill: MUTED, anchor: "start", style: ' font-style="italic"', razmak: 15,
  }));

  strelica("Object", "Function.prototype", "proto", `M ${funSredina + 30} ${dnoFunkcije(RED.O)} C 560 700, 700 730, 820 ${RED.F - PROTO.h / 2 - 1}`);
  deo.push(natpis(640, 694, "(Function pravi Object)", { size: 12, fill: MUTED, halo: true, style: ' font-style="italic"' }));
  deo.push(natpis(700, 742, "__proto__", { size: 12, fill: MUTED, halo: true, font: KOD }));

  strelica("Function", "Function.prototype", "proto", `M 420 ${dnoFunkcije(RED.F)} C 420 910, 680 910, 748 ${RED.F + PROTO.h / 2 + 2}`);
  deo.push(natpis(560, 898, "__proto__", { size: 12, fill: MUTED, halo: true, font: KOD }));

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(OPIS)}" style="height:auto;max-width:none"><defs><marker id="${id}" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="${INK}"/></marker></defs>${deo.join("")}</svg>`;
}
