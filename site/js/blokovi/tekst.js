import { Blok } from "./blok.js";
import { odzastitiOgrade, zastitiOgrade } from "./md.js";

export class Tekst extends Blok {
  static vrsta = "tekst";

  static uvoz(markdown) {
    const tekst = odzastitiOgrade(String(markdown ?? "").replace(/^\n+/, "").replace(/\s+$/, ""));
    return new this({ vrsta: "tekst", tekst });
  }

  izvoz() {
    const tekst = String(this.podaci.tekst ?? "");
    if (!tekst.trim()) return "";
    return zastitiOgrade(tekst).replace(/^\n+/, "").replace(/\s+$/, "");
  }

  natpis() {
    return "Tekst";
  }

  ikona() {
    return "text";
  }

  static meni() {
    return [{ vrsta: "tekst", natpis: "Tekst", ikona: "text", polja: {} }];
  }
}
