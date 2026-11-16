import { Blok } from "./blok.js";
import { naslovPodebljan, ograda, procitajOgradu } from "./md.js";

export const LEGENDA_RASPOREDA = "Isprekidana strelica `__proto__` je interna veza `[[Prototype]]`. `Object.getPrototypeOf` je čita. Strelica `prototype` polazi od funkcije ka prototipu. Strelica `constructor` polazi od prototipa ka funkciji.";

export class Raspored extends Blok {
  static vrsta = "raspored";

  static prepoznaje(markdown) {
    const ogradaBloka = procitajOgradu(markdown);
    return Boolean(ogradaBloka) && ogradaBloka.jezik === "raspored";
  }

  static uvoz(markdown) {
    const ogradaBloka = procitajOgradu(markdown);
    return new this({
      vrsta: "raspored",
      naslov: naslovPodebljan(ogradaBloka?.pre || "") || "Prototipski lanac",
      tekst: ogradaBloka?.telo || "",
    });
  }

  izvoz() {
    const naslov = this.podaci.naslov || "Prototipski lanac";
    const tekst = String(this.podaci.tekst ?? "").replace(/\n+$/, "");
    return `**${naslov.replace(/\*/g, "")}**\n\n${ograda("raspored", tekst)}`;
  }

  natpis() {
    return this.podaci.naslov || "Prototipski lanac";
  }

  ikona() {
    return "workflow";
  }

  static meni() {
    return [{
      vrsta: "raspored",
      natpis: "Prototipski lanac",
      ikona: "workflow",
      polja: { naslov: "Prototipski lanac", tekst: LEGENDA_RASPOREDA },
    }];
  }
}
