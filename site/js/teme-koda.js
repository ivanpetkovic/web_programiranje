/* Zadržane službene teme highlight.js 11.12.0. Sklopio sklopi-teme.mjs. */
export const PODRAZUMEVANA_TEMA_KODA = "1c-light";

export const TEME_KODA = [
  {
    "id": "1c-light",
    "natpis": "1c Light",
    "tamna": false
  },
  {
    "id": "ascetic",
    "natpis": "Ascetic",
    "tamna": false
  },
  {
    "id": "equinox",
    "natpis": "Equinox",
    "tamna": false
  },
  {
    "id": "a11y-dark",
    "natpis": "A11y Dark",
    "tamna": true
  },
  {
    "id": "monokai",
    "natpis": "Monokai",
    "tamna": true
  }
];

const PO_ID = new Map(TEME_KODA.map((tema) => [tema.id, tema]));
const STARE = { bela: "1c-light", github: "1c-light", crna: "monokai", "github-dark": "monokai" };

export function temaKodaIz(vrednost) {
  const sirova = STARE[vrednost] || vrednost;
  return PO_ID.has(sirova) ? sirova : PODRAZUMEVANA_TEMA_KODA;
}
