import { blokoviTeksta } from "../mermaid.js";
import { Blok } from "./blok.js";
import { naslovPodebljan, ograda, procitajOgradu } from "./md.js";

export function izvorMermaida(tekst) {
  const sirovo = String(tekst ?? "").trim();
  if (!sirovo) return "";
  if (!sirovo.includes("```")) return sirovo;
  const izvori = blokoviTeksta(sirovo).filter((blok) => blok.vrsta === "mermaid").map((blok) => blok.izvor);
  return izvori.length ? izvori.join("\n") : sirovo;
}

export class Mermaid extends Blok {
  static vrsta = "mermaid";

  static prepoznaje(markdown) {
    const ogradaBloka = procitajOgradu(markdown);
    return Boolean(ogradaBloka) && ogradaBloka.jezik === "mermaid";
  }

  static uvoz(markdown) {
    const ogradaBloka = procitajOgradu(markdown);
    return new this({
      vrsta: "mermaid",
      naslov: naslovPodebljan(ogradaBloka?.pre || "") || "Dijagram",
      tekst: ogradaBloka?.telo || "",
    });
  }

  izvoz() {
    const izvor = izvorMermaida(this.podaci.tekst);
    if (!izvor.trim()) return "";
    const telo = ograda("mermaid", izvor);
    const naslov = this.podaci.naslov || "Dijagram";
    return `**${naslov.replace(/\*/g, "")}**\n\n${telo}`;
  }

  natpis() {
    return this.podaci.naslov || "Dijagram";
  }

  ikona() {
    return "workflow";
  }

  static meni() {
    return [{
      vrsta: "mermaid",
      natpis: "Dijagram",
      ikona: "workflow",
      polja: { naslov: "Dijagram", tekst: "flowchart LR\n  A[Početak] --> B[Kraj]" },
    }];
  }
}
