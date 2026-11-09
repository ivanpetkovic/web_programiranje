import { Blok } from "./blok.js";
import { naslovPodebljan, ograda, procitajOgradu } from "./md.js";

const PRIMER = {
  kod: [
    "function primer() {",
    { t: "  return 1;", boja: "plava", ka: "a" },
    "}",
  ],
  okviri: [{ id: "a", boja: "plava", redovi: ["primer"] }],
};

export class Struktura extends Blok {
  static vrsta = "struktura";

  static prepoznaje(markdown) {
    const ogradaBloka = procitajOgradu(markdown);
    return Boolean(ogradaBloka) && ogradaBloka.jezik === "struktura";
  }

  static uvoz(markdown) {
    const ogradaBloka = procitajOgradu(markdown);
    return new this({
      vrsta: "struktura",
      naslov: naslovPodebljan(ogradaBloka?.pre || "") || "Strukturni dijagram",
      tekst: ogradaBloka?.telo || "",
    });
  }

  izvoz() {
    const tekst = String(this.podaci.tekst ?? "").trim();
    if (!tekst) return "";
    const telo = ograda("struktura", tekst);
    const naslov = this.podaci.naslov || "Strukturni dijagram";
    return `**${naslov.replace(/\*/g, "")}**\n\n${telo}`;
  }

  natpis() {
    return this.podaci.naslov || "Strukturni dijagram";
  }

  ikona() {
    return "layers";
  }

  static meni() {
    return [{
      vrsta: "struktura",
      natpis: "Strukturni dijagram",
      ikona: "layers",
      polja: { naslov: "Strukturni dijagram", tekst: JSON.stringify(PRIMER, null, 2) },
    }];
  }
}
