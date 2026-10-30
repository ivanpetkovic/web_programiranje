import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { izborFajla, prikaziIzlaz } from "../site/js/birac.js";
import { mermaidFigura, prikazKoraka, tekstoviFigure } from "../site/js/figura.js";
import { dokument } from "../site/js/lectures.js";

const css = fs.readFileSync(new URL("../site/css/site.css", import.meta.url), "utf8");
const main = fs.readFileSync(new URL("../site/js/main.js", import.meta.url), "utf8");
const crtez = fs.readFileSync(new URL("../site/js/crtez.js", import.meta.url), "utf8");

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

function redosled(izvor, tekstovi) {
  let od = -1;
  for (const tekst of tekstovi) {
    const na = izvor.indexOf(tekst, od + 1);
    assert.ok(na > od, tekst);
    od = na;
  }
}

test("put je Mermaid flowchart koji ređa natpise i ne dodaje tuđ", () => {
  const izvor = mermaidFigura(web);
  assert.deepEqual(tekstoviFigure(web), ["Browser", "URL", "Dokument", "Prikaz"]);
  assert.equal(izvor.split("\n")[0], "flowchart LR");
  redosled(izvor, ['"Browser"', '"URL"', '"Dokument"', '"Prikaz"']);
  assert.match(izvor, /c0 --> c1\n\s*c1 --> c2\n\s*c2 --> c3$/);
  assert.equal(izvor.includes("Kubernetes"), false);
});

test("linija je Mermaid timeline koji ređa godinu pa natpis", () => {
  const izvor = mermaidFigura(istorija);
  const tekstovi = tekstoviFigure(istorija);
  assert.equal(tekstovi.length, 10);
  assert.equal(izvor.split("\n")[0], "timeline");
  assert.match(izvor, /^\s*1969 : Mreža paketa$/m);
  assert.match(izvor, /^\s*čas : server\/ je prazan$/m);
  redosled(izvor, tekstovi);
  assert.equal(izvor.includes("React"), false);
});

test("natpis ne lomi Mermaid sintaksu", () => {
  const put = mermaidFigura({ vrsta: "put", cvorovi: [{ id: "a", natpis: 'Veza "x": #1' }] });
  assert.match(put, /c0\["Veza #quot;x#quot;#58; #35;1"\]/);
  const linija = mermaidFigura({ vrsta: "linija", oznake: [{ godina: "", natpis: "" }] });
  assert.equal(linija, "timeline\n  …");
  assert.equal(mermaidFigura({ vrsta: "nepoznata" }), "");
});

test("LO nema crtež, Hipertekst crta vezu, Stranica otvara index", () => {
  const istorija = dokument.teme[0].steps;
  const lo = prikazKoraka(istorija[0]);
  assert.equal(lo.mermaid, null);
  assert.equal(lo.putanja, null);
  const veza = prikazKoraka(istorija.find((korak) => korak.naslov === "Hipertekst"));
  assert.match(veza.mermaid, /"Veza"/);
  assert.match(veza.mermaid, /"Drugi tekst"/);
  assert.equal(veza.putanja, null);
  const stranica = dokument.teme[1].steps;
  const stranicaKorak = prikazKoraka(stranica.find((korak) => korak.naslov === "Stranica"));
  assert.equal(stranicaKorak.mermaid, null);
  assert.equal(stranicaKorak.putanja, "client/index.html");
  assert.match(main, /putanjaKoraka\.id = "putanja-koraka"/);
  assert.match(main, /if \(figura\) casEl\.append\(figura\)/);
  assert.match(main, /nacrtajFiguru\(figura, korak\.figura\)/);
  assert.match(crtez, /import \{ crtajSvg \} from "\.\/mermaid\.js"/);
  assert.equal(crtez.includes("/vendor/mermaid/"), false);
  assert.equal(fs.existsSync(new URL("../site/vendor/mermaid/mermaid.min.js", import.meta.url)), false);
});

test("izlaz je rečenica na poslednjem koraku, pretpostavke ostaju", () => {
  const tema = dokument.teme[1];
  const poslednji = prikaziIzlaz(tema.steps.length - 1, tema.steps.length, tema.izlaz);
  assert.match(poslednji.tekst, /dokument/i);
  assert.match(poslednji.tekst, /prikaz/i);
  assert.match(poslednji.tekst, /osvežavanje/i);
  assert.equal(poslednji.polje, false);
  assert.equal(prikaziIzlaz(0, tema.steps.length, tema.izlaz), null);
  assert.match(main, /tabla\.className = "pretpostavke"/);
  assert.equal(main.includes("Izlazno pitanje"), false);
  assert.equal(main.includes('textContent = "Osvrt"'), false);
});

test("LO ne otvara soba.css, Stranica otvara index.html", () => {
  const istorija = dokument.teme[0].steps;
  const stranica = dokument.teme[1].steps;
  assert.equal(izborFajla(istorija[0]), null);
  assert.equal(izborFajla(stranica.find((korak) => korak.naslov === "Stranica")), "client/index.html");
  assert.equal(main.includes("fileForLecture"), false);
  assert.equal(main.includes('openPath = { client: "css/soba.css"'), false);
});

test("pokret figure traje jednom i staje uz elise", () => {
  assert.match(css, /\.figura-crtez\[data-pokret\] svg \.crtez-redom \{[^}]*animation:[^;]*\s1\s/);
  assert.match(css, /\.figura-crtez\[data-pokret\] svg \.crtez-redom \{[^}]*animation-delay:[^;]*var\(--redom/);
  const upit = css.match(/@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)\s*\{([\s\S]*?)\n\}/);
  assert.ok(upit);
  assert.match(upit[1], /\.blades\.spin \{[^}]*animation:\s*none/);
  assert.match(upit[1], /\.figura-crtez\[data-pokret\] svg \.crtez-redom \{[^}]*animation:\s*none/);
  assert.match(upit[1], /\.figura-crtez\[data-pokret\] svg \.crtez-redom \{[^}]*opacity:\s*1/);
});
