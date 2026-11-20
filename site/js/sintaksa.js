import { obojenHtml } from "../vendor/highlight/highlight.js";

export function popuniKod(cvor, tekst, jezik) {
  const telo = String(tekst ?? "");
  const html = obojenHtml(jezik, telo);
  cvor.classList.add("kod-sintaksa", "hljs");
  if (html) cvor.innerHTML = html;
  else cvor.textContent = telo;
}
