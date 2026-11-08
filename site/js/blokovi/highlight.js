import { Blok } from "./blok.js";
import { citat, naslovITelo, odzastitiOgrade, skiniCitat } from "./md.js";

export class Highlight extends Blok {
  static vrsta = "highlight";

  static prepoznaje(markdown) {
    const linije = String(markdown ?? "").split("\n").filter((linija) => linija.trim());
    return linije.length > 0 && linije.every((linija) => linija.startsWith(">"));
  }

  static uvoz(markdown) {
    const { naslov, telo } = naslovITelo(skiniCitat(markdown));
    const podaci = { vrsta: "highlight", tekst: odzastitiOgrade(telo) };
    if (naslov === "Ključna ideja") podaci.uloga = "kljucna";
    else {
      podaci.uloga = "obicna";
      if (naslov) podaci.naslov = naslov;
    }
    return new this(podaci);
  }

  izvoz() {
    const tekst = String(this.podaci.tekst ?? "");
    if (!tekst.trim()) return "";
    const naslov = this.podaci.uloga === "kljucna" ? "Ključna ideja" : this.podaci.naslov || "Napomena";
    return citat(naslov, tekst);
  }

  natpis() {
    if (this.podaci.uloga === "kljucna") return "Ključna ideja";
    return this.podaci.naslov || "Highlight";
  }

  ikona() {
    return this.podaci.uloga === "kljucna" ? "lightbulb" : "callout";
  }

  static meni() {
    return [
      { vrsta: "highlight", natpis: "Highlight", ikona: "callout", polja: { uloga: "obicna", naslov: "Napomena" } },
      { vrsta: "highlight", natpis: "Ključna ideja", ikona: "lightbulb", polja: { uloga: "kljucna" } },
    ];
  }
}
