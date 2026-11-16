const INK = "#241f1a";
const MUTED = "#5e584e";
const TIHA = "#a39e94";
const PLAVA = "#1a4f8b";
const PAPIR = "#f7f4ee";
const TRAKA = "#e4eaf8";
const KUTIJA = "#fffcf7";
const SANS = "system-ui, sans-serif";
const KOD = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

const OPIS_LANCA = "Prototipski lanac, bez Function.prototype. Funkcije su levo, prototipovi u sredini, instance desno. ana i marko vode na Korisnik.prototype, o1 i o2 na Object.prototype. Korisnik.prototype vodi na Osoba.prototype, Osoba.prototype na Object.prototype, Object.prototype na null. Svaka funkcija ima svojstvo prototype, a svaki prototip svojstvo constructor.";
const OPIS_FUNKCIJE = "Isti prototipski lanac, a levo od konstruktorskih funkcija stoji Function.prototype. Korisnik, Osoba i Object vode na Function.prototype tišom isprekidanom strelicom. Instance ostaju desno od prototipova.";

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

function svgOd(opis, sirina, visina, crtaj) {
  const id = `proto-${broj += 1}`;
  const tihi = `${id}-tiho`;
  const deo = [];
  const strelica = (od, ka, vrsta, d, tiho = false) => {
    const crta = vrsta === "proto" ? ' stroke-dasharray="5 4"' : "";
    const boja = tiho ? TIHA : INK;
    const marker = tiho ? tihi : id;
    deo.push(`<path data-veza="${vrsta}" data-od="${esc(od)}" data-ka="${esc(ka)}" data-tiho="${tiho ? "da" : "ne"}" d="${d}" fill="none" stroke="${boja}" stroke-width="${tiho ? 1.35 : 1.55}"${crta} marker-end="url(#${marker})" stroke-linejoin="round"/>`);
  };
  crtaj(strelica, deo);
  const marker = (oznaka, boja) => `<marker id="${oznaka}" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="${boja}"/></marker>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${sirina}" viewBox="0 0 ${sirina} ${visina}" role="img" aria-label="${esc(opis)}" style="height:auto;max-width:none"><defs>${marker(id, INK)}${marker(tihi, TIHA)}</defs>${deo.join("")}</svg>`;
}

function lanac(strelica, deo, pomak) {
  const RED = { K: 156, S: 336, O: 516 };
  const FUN = { x: 28 + pomak, w: 188, h: 66 };
  const PROTO = { x: 304 + pomak, w: 220, h: 56 };
  const POLUPR = 32;
  const funDesno = FUN.x + FUN.w;
  const funSredina = FUN.x + FUN.w / 2;
  const protoLevo = PROTO.x;
  const protoDesno = PROTO.x + PROTO.w;
  const protoSredina = PROTO.x + PROTO.w / 2;
  const inst = { prednje: protoDesno + 156, zadnje: protoDesno + 200 };

  deo.push(`<rect x="${FUN.x - 12}" y="44" width="${FUN.w + 24}" height="530" fill="${TRAKA}"/>`);
  deo.push(natpis(funSredina, 30, "Funkcije", { size: 15, weight: 700 }));
  deo.push(natpis(protoSredina, 30, "Prototipovi", { size: 15, weight: 700 }));
  deo.push(natpis((inst.prednje + inst.zadnje) / 2, 30, "Instance", { size: 15, weight: 700 }));

  const par = (red, zadnjeIme, prednjeIme) => {
    const zadnje = { x: inst.zadnje, y: red - 20 };
    const prednje = { x: inst.prednje, y: red + 16 };
    deo.push(`<circle cx="${zadnje.x}" cy="${zadnje.y}" r="${POLUPR}" fill="${KUTIJA}" stroke="${INK}" stroke-width="1.6"/>`);
    deo.push(`<circle cx="${prednje.x}" cy="${prednje.y}" r="${POLUPR}" fill="${KUTIJA}" stroke="${INK}" stroke-width="1.6"/>`);
    deo.push(natpis(zadnje.x, zadnje.y + 5, zadnjeIme, { size: 13 }));
    deo.push(natpis(prednje.x, prednje.y + 5, prednjeIme, { size: 15, weight: 700, fill: PLAVA }));
    deo.push(`<circle cx="${prednje.x - POLUPR - 4}" cy="${prednje.y}" r="3.2" fill="${INK}"/>`);
    return prednje.x - POLUPR - 6;
  };

  const anaX = par(RED.K, "marko", "ana");
  const o1X = par(RED.O, "o2", "o1");
  deo.push(natpis((inst.prednje + inst.zadnje) / 2, RED.K - 68, "… = new Korisnik()", { size: 13, fill: MUTED }));
  deo.push(natpis((inst.prednje + inst.zadnje) / 2, RED.O - 68, "… = new Object()", { size: 13, fill: MUTED }));

  const funkcija = (red, ime) => {
    deo.push(`<rect x="${FUN.x}" y="${red - FUN.h / 2}" width="${FUN.w}" height="${FUN.h}" fill="${KUTIJA}" stroke="${INK}" stroke-width="1.7"/>`);
    deo.push(natpis(funSredina, red - 6, "function", { size: 13, fill: MUTED }));
    deo.push(natpis(funSredina, red + 16, `${ime}()`, { size: 17, weight: 700, font: KOD }));
  };
  funkcija(RED.K, "Korisnik");
  funkcija(RED.S, "Osoba");
  funkcija(RED.O, "Object");

  const prototip = (red, ime) => {
    deo.push(`<rect x="${PROTO.x}" y="${red - PROTO.h / 2}" width="${PROTO.w}" height="${PROTO.h}" rx="28" fill="${KUTIJA}" stroke="${INK}" stroke-width="1.7"/>`);
    deo.push(natpis(protoSredina, red + 5, ime, { size: 14, weight: 650, font: KOD }));
  };
  prototip(RED.K, "Korisnik.prototype");
  prototip(RED.S, "Osoba.prototype");
  prototip(RED.O, "Object.prototype");

  const vodoravno = (red, ime) => {
    const gore = red - 12;
    const dole = red + 14;
    const sredina = (funDesno + protoLevo) / 2;
    strelica(ime, `${ime}.prototype`, "prototype", `M ${funDesno} ${gore} L ${protoLevo} ${gore}`);
    strelica(`${ime}.prototype`, ime, "constructor", `M ${protoLevo} ${dole} L ${funDesno} ${dole}`);
    deo.push(natpis(sredina, gore - 7, "prototype", { size: 12, fill: MUTED, halo: true }));
    deo.push(natpis(sredina, dole + 15, "constructor", { size: 12, fill: MUTED, halo: true }));
  };
  vodoravno(RED.K, "Korisnik");
  vodoravno(RED.S, "Osoba");
  vodoravno(RED.O, "Object");

  strelica("ana", "Korisnik.prototype", "proto", `M ${anaX} ${RED.K + 16} C ${anaX - 40} ${RED.K + 8}, ${protoDesno + 36} ${RED.K - 6}, ${protoDesno} ${RED.K - 4}`);
  deo.push(natpis(protoDesno + 48, RED.K - 16, "__proto__", { size: 12, fill: MUTED, halo: true, font: KOD }));

  strelica("o1", "Object.prototype", "proto", `M ${o1X} ${RED.O + 16} C ${o1X - 36} ${RED.O - 8}, ${protoDesno + 40} ${RED.O - 10}, ${protoDesno} ${RED.O - 2}`);
  deo.push(natpis(protoDesno + 48, RED.O - 22, "__proto__", { size: 12, fill: MUTED, halo: true, font: KOD }));

  strelica("Korisnik.prototype", "Osoba.prototype", "proto", `M ${protoSredina} ${RED.K + PROTO.h / 2} L ${protoSredina} ${RED.S - PROTO.h / 2}`);
  deo.push(natpis(protoSredina - 8, (RED.K + RED.S) / 2 + 4, "__proto__", { size: 12, fill: MUTED, halo: true, font: KOD, anchor: "end" }));

  strelica("Osoba.prototype", "Object.prototype", "proto", `M ${protoSredina} ${RED.S + PROTO.h / 2} L ${protoSredina} ${RED.O - PROTO.h / 2}`);
  deo.push(natpis(protoSredina - 8, (RED.S + RED.O) / 2 + 4, "__proto__", { size: 12, fill: MUTED, halo: true, font: KOD, anchor: "end" }));

  strelica("Object.prototype", "null", "proto", `M ${protoDesno - 28} ${RED.O + PROTO.h / 2} C ${protoDesno - 8} ${RED.O + 46}, ${protoDesno + 16} ${RED.O + 48}, ${protoDesno + 28} ${RED.O + 40}`);
  deo.push(natpis(protoDesno + 36, RED.O + 46, "null", { size: 18, weight: 700, anchor: "start", style: ' font-style="italic"' }));

  return { RED, FUN, funDesno };
}

function svgLanca() {
  return svgOd(OPIS_LANCA, 800, 620, (strelica, deo) => {
    lanac(strelica, deo, 0);
  });
}

function svgFunkcije() {
  const pomak = 248;
  return svgOd(OPIS_FUNKCIJE, 1048, 620, (strelica, deo) => {
    const { RED, FUN } = lanac(strelica, deo, pomak);
    const pill = { x: 16, w: 206, h: 56, y: RED.S };
    const desno = pill.x + pill.w;
    deo.push(`<rect x="${pill.x}" y="${pill.y - pill.h / 2}" width="${pill.w}" height="${pill.h}" rx="28" fill="${KUTIJA}" stroke="${INK}" stroke-width="1.7"/>`);
    deo.push(natpis(pill.x + pill.w / 2, pill.y + 5, "Function.prototype", { size: 13, weight: 650, font: KOD }));
    const kaPillu = (ime, red, yKraja) => {
      strelica(ime, "Function.prototype", "proto", `M ${FUN.x} ${red} C ${FUN.x - 36} ${red}, ${desno + 28} ${yKraja}, ${desno} ${yKraja}`, true);
    };
    kaPillu("Korisnik", RED.K, pill.y - 16);
    kaPillu("Osoba", RED.S, pill.y);
    kaPillu("Object", RED.O, pill.y + 16);
    deo.push(natpis((FUN.x + desno) / 2, RED.S - 22, "__proto__", { size: 12, fill: TIHA, halo: true, font: KOD }));
  });
}

export function svgRasporeda(naslov = "") {
  return /Function\.prototype/.test(String(naslov)) ? svgFunkcije() : svgLanca();
}
