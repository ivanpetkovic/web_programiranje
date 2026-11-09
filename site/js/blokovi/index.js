import { Blok } from "./blok.js";
import { Dijagram } from "./dijagram.js";
import { Highlight } from "./highlight.js";
import { Kod, naslovKoda } from "./kod.js";
import { Mermaid } from "./mermaid.js";
import { Pitanje } from "./pitanje.js";
import { Struktura } from "./struktura.js";
import { Tekst } from "./tekst.js";

const GRADIVO = [Tekst, Highlight, Kod, Mermaid, Dijagram, Struktura];
const SVE = [...GRADIVO, Pitanje];
const REDOSLED_UVOZA = [Pitanje, Highlight, Mermaid, Struktura, Dijagram, Kod];

export { Blok, Dijagram, Highlight, Kod, Mermaid, Pitanje, Struktura, Tekst, naslovKoda };

export const VRSTE_SEKCIJE = GRADIVO.flatMap((klasa) => klasa.meni());
export const VRSTE_DISKUSIJE = SVE.flatMap((klasa) => klasa.meni());

export function blokOd(podaci) {
  const Klasa = SVE.find((klasa) => klasa.vrsta === podaci?.vrsta) || Blok;
  return new Klasa(podaci || {});
}

export function blokIzMd(markdown) {
  const telo = String(markdown ?? "");
  const Klasa = REDOSLED_UVOZA.find((klasa) => klasa.prepoznaje(telo)) || Tekst;
  return Klasa.uvoz(telo);
}

export function natpisSekcije(blok) {
  if (!blok) return "";
  return blokOd(blok).natpis();
}

export function ikonaSekcije(blok) {
  if (!blok) return "text";
  return blokOd(blok).ikona();
}
