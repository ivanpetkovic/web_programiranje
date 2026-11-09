import { Blok } from "./blok.js";
import { naslovPodebljan, ograda, procitajOgradu } from "./md.js";

export function naslovKoda(blok) {
  const naslov = String(blok?.naslov || "").trim();
  if (!naslov || naslov === "Mali eksperiment") return "";
  return naslov;
}

export class Kod extends Blok {
  static vrsta = "kod";

  static prepoznaje(markdown) {
    const ogradaBloka = procitajOgradu(markdown);
    return Boolean(ogradaBloka) && ogradaBloka.jezik !== "mermaid" && ogradaBloka.jezik !== "struktura";
  }

  static uvoz(markdown) {
    const ogradaBloka = procitajOgradu(markdown);
    const podaci = {
      vrsta: "kod",
      tekst: ogradaBloka?.telo || "",
      jezik: ogradaBloka?.jezik || "text",
    };
    const naslov = naslovPodebljan(ogradaBloka?.pre || "");
    if (naslov) podaci.naslov = naslov;
    return new this(podaci);
  }

  naslovZaIzvoz() {
    return naslovKoda(this.podaci);
  }

  izvoz() {
    const tekst = String(this.podaci.tekst ?? "");
    if (!tekst.trim()) return "";
    const telo = ograda(this.podaci.jezik || "", tekst);
    const naslov = this.naslovZaIzvoz();
    return naslov ? `**${naslov.replace(/\*/g, "")}**\n\n${telo}` : telo;
  }

  natpis() {
    return this.naslovZaIzvoz() || "Kod";
  }

  ikona() {
    return "code-xml";
  }

  static meni() {
    return [{ vrsta: "kod", natpis: "Kod", ikona: "code-xml", polja: { jezik: "text" } }];
  }
}
