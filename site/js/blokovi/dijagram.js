import { Blok } from "./blok.js";
import { naslovPodebljan, ograda, procitajOgradu } from "./md.js";

export class Dijagram extends Blok {
  static vrsta = "dijagram";

  static prepoznaje(markdown) {
    const ogradaBloka = procitajOgradu(markdown);
    if (!ogradaBloka || ogradaBloka.jezik === "mermaid") return false;
    return naslovPodebljan(ogradaBloka.pre) === "Tekstualni dijagram";
  }

  static uvoz(markdown) {
    const ogradaBloka = procitajOgradu(markdown);
    const naslov = naslovPodebljan(ogradaBloka?.pre || "") || "Tekstualni dijagram";
    return new this({
      vrsta: "dijagram",
      naslov,
      tekst: ogradaBloka?.telo || "",
    });
  }

  izvoz() {
    const tekst = String(this.podaci.tekst ?? "");
    if (!tekst.trim()) return "";
    const naslov = this.podaci.naslov || "Tekstualni dijagram";
    return `**${naslov.replace(/\*/g, "")}**\n\n${ograda("text", tekst)}`;
  }

  natpis() {
    return this.podaci.naslov || "Tekstualni dijagram";
  }

  ikona() {
    return "file-text";
  }

  static meni() {
    return [{ vrsta: "dijagram", natpis: "Tekstualni dijagram", ikona: "file-text", polja: { naslov: "Tekstualni dijagram" } }];
  }
}
