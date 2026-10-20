import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { izborFajla, prikaziIzlaz } from "../site/js/birac.js";
import { prikazKoraka, svgFigura, tekstoviFigure } from "../site/js/figura.js";
import { dokument } from "../site/js/lectures.js";

const css = fs.readFileSync(new URL("../site/css/site.css", import.meta.url), "utf8");
const main = fs.readFileSync(new URL("../site/js/main.js", import.meta.url), "utf8");

const web = {
  vrsta: "put",
  cvorovi: [
    { id: "browser", natpis: "Browser" },
    { id: "url", natpis: "URL" },
    { id: "dokument", natpis: "Dokument" },
    { id: "prikaz", natpis: "Prikaz" },
  ],
};

const istorija = {
  vrsta: "linija",
  pokret: "redom",
  oznake: [
    { godina: "1969", natpis: "Mreža paketa" },
    { godina: "1983", natpis: "TCP/IP" },
    { godina: "1989", natpis: "Povezani dokumenti" },
    { godina: "1991", natpis: "Javni Web" },
    { godina: "čas", natpis: "server/ je prazan" },
  ],
};

function redosled(svg, tekstovi) {
  let od = -1;
  for (const tekst of tekstovi) {
    const na = svg.indexOf(tekst, od + 1);
    assert.ok(na > od, tekst);
    od = na;
  }
}

test("put ređa natpise i ne dodaje tuđ", () => {
  const svg = svgFigura(web);
  assert.deepEqual(tekstoviFigure(web), ["Browser", "URL", "Dokument", "Prikaz"]);
  redosled(svg, ["Browser", "URL", "Dokument", "Prikaz"]);
  assert.equal(svg.includes("Kubernetes"), false);
  assert.equal(svg.includes("figura-marker"), false);
});

test("linija ređa godinu pa natpis", () => {
  const svg = svgFigura(istorija);
  const tekstovi = tekstoviFigure(istorija);
  assert.equal(tekstovi.length, 10);
  redosled(svg, tekstovi);
  assert.equal(svg.includes("React"), false);
});

test("LO nema crtež, Hipertekst crta vezu, Podela otvara index", () => {
  const istorija = dokument.nedelje[0].steps;
  const lo = prikazKoraka(istorija[0]);
  assert.equal(lo.svg, null);
  assert.equal(lo.putanja, null);
  const veza = prikazKoraka(istorija.find((korak) => korak.naslov === "Hipertekst"));
  assert.match(veza.svg, />Veza</);
  assert.match(veza.svg, />Drugi tekst</);
  assert.equal(veza.putanja, null);
  const stranica = dokument.nedelje[1].steps;
  const podela = prikazKoraka(stranica.find((korak) => korak.naslov === "Podela"));
  assert.equal(podela.svg, null);
  assert.equal(podela.putanja, "client/index.html");
  assert.match(main, /putanjaKoraka\.id = "putanja-koraka"/);
  assert.match(main, /if \(figura\) casEl\.append\(figura\)/);
});

test("izlaz je rečenica na poslednjem koraku, pretpostavke ostaju", () => {
  const nedelja = dokument.nedelje[1];
  const poslednji = prikaziIzlaz(nedelja.steps.length - 1, nedelja.steps.length, nedelja.izlaz);
  assert.match(poslednji.tekst, /dokument/i);
  assert.match(poslednji.tekst, /prikaz/i);
  assert.match(poslednji.tekst, /osvežavanje/i);
  assert.equal(poslednji.polje, false);
  assert.equal(prikaziIzlaz(0, nedelja.steps.length, nedelja.izlaz), null);
  assert.match(main, /tabla\.className = "pretpostavke"/);
  assert.equal(main.includes("Izlazno pitanje"), false);
  assert.equal(main.includes('textContent = "Osvrt"'), false);
});

test("LO ne otvara soba.css, Podela otvara index.html", () => {
  const istorija = dokument.nedelje[0].steps;
  const stranica = dokument.nedelje[1].steps;
  assert.equal(izborFajla(istorija[0]), null);
  assert.equal(izborFajla(stranica.find((korak) => korak.naslov === "Podela")), "client/index.html");
  assert.equal(main.includes("fileForLecture"), false);
  assert.equal(main.includes('openPath = { client: "css/soba.css"'), false);
});

test("pokret figure traje jednom i staje uz elise", () => {
  assert.match(css, /\.figura-put\[data-pokret="jednom"\] \.figura-marker \{[^}]*animation:[^;]*\s1\s/);
  assert.match(css, /\.figura-linija\[data-pokret="redom"\] \.figura-oznaka \{[^}]*animation:[^;]*\s1\s/);
  const upit = css.match(/@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)\s*\{([\s\S]*?)\n\}/);
  assert.ok(upit);
  assert.match(upit[1], /\.blades\.spin \{[^}]*animation:\s*none/);
  assert.match(upit[1], /\.figura-marker \{[^}]*animation:\s*none/);
  assert.match(upit[1], /\.figura-marker \{[^}]*offset-distance:\s*100%/);
  assert.match(upit[1], /\.figura-oznaka \{[^}]*animation:\s*none/);
  assert.match(upit[1], /\.figura-oznaka \{[^}]*opacity:\s*1/);
});
