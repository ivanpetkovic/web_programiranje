import { blokoviKoraka, diskusijaKoraka, naslovKoda } from "./blokovi-lekcije.js";
import { blokOd } from "./blokovi/index.js";
import { izvorMermaida } from "./blokovi/mermaid.js";
import { imaTekst, jedanRed, zastitiOgrade } from "./blokovi/md.js";
import { blokoviTeksta } from "./mermaid.js";
import { blokoviProze } from "./proza.js";

export { izvorMermaida };

function deoBloka(blok) {
  if (!blok || !blokOd(blok).izvoz().trim()) return null;
  return { vrsta: "blok", blok };
}

function dokumentKoraka(korak) {
  const gradivo = blokoviKoraka(korak, { prazne: false }).map(deoBloka).filter(Boolean);
  const diskusija = diskusijaKoraka(korak).map(deoBloka).filter(Boolean);
  const delovi = [];
  if (gradivo.length && diskusija.length) {
    delovi.push({ vrsta: "naslov", nivo: 2, tekst: "Gradivo" }, ...gradivo);
    delovi.push({ vrsta: "naslov", nivo: 2, tekst: "Diskusija" }, ...diskusija);
  } else {
    delovi.push(...gradivo, ...diskusija);
  }
  return { naslov: jedanRed(korak?.naslov) || "Korak", delovi };
}

function dokumentTeme(tema) {
  return {
    naslov: jedanRed(tema?.naslov) || "Tema",
    podnaslov: imaTekst(tema?.podnaslov) ? String(tema.podnaslov).trim() : "",
    ishod: imaTekst(tema?.ishod) ? String(tema.ishod).trim() : "",
    koraci: (tema?.steps || []).map(dokumentKoraka),
  };
}

function markdownDela(deo) {
  if (deo.vrsta === "naslov") return `${"#".repeat(deo.nivo)} ${deo.tekst}`;
  if (deo.vrsta === "blok") return blokOd(deo.blok).izvoz();
  return "";
}

function pomeriNivo(delovi, nivoNaslova) {
  const pomeraj = nivoNaslova - 1;
  return delovi.map((deo) => (deo.vrsta === "naslov" ? { ...deo, nivo: Math.min(6, deo.nivo + pomeraj) } : deo));
}

function markdownDokumenta(dok, nivoNaslova) {
  const naslov = { vrsta: "naslov", nivo: nivoNaslova, tekst: dok.naslov };
  const delovi = [naslov, ...pomeriNivo(dok.delovi, nivoNaslova)];
  return delovi.map(markdownDela).filter(Boolean).join("\n\n");
}

export function markdownKoraka(korak) {
  return `${markdownDokumenta(dokumentKoraka(korak), 1)}\n`;
}

export function markdownTeme(tema) {
  const dok = dokumentTeme(tema);
  const delovi = [`# ${dok.naslov}`];
  if (dok.podnaslov) delovi.push(zastitiOgrade(dok.podnaslov));
  if (dok.ishod) delovi.push(`**Ishod.** ${zastitiOgrade(dok.ishod)}`);
  for (const korak of dok.koraci) delovi.push(markdownDokumenta(korak, 2));
  return `${delovi.join("\n\n").trim()}\n`;
}

export function markdownJeIspravan(tekst) {
  if (typeof tekst !== "string" || !tekst.endsWith("\n") || tekst.includes("\0")) return false;
  let otvorena = null;
  for (const linija of tekst.split("\n")) {
    const poklapanje = /^(`{3,})([^`]*)$/.exec(linija);
    if (!poklapanje) continue;
    if (!otvorena) {
      otvorena = poklapanje[1].length;
      continue;
    }
    if (poklapanje[1].length >= otvorena && poklapanje[2].trim() === "") otvorena = null;
  }
  return otvorena === null;
}

export function imeIzvoza(naslov, ekstenzija) {
  const osnova = jedanRed(naslov)
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80) || "izvoz";
  return `${osnova}.${ekstenzija}`;
}

function escapeHtml(tekst) {
  return String(tekst ?? "").replace(/[&<>"]/g, (znak) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[znak]);
}

function htmlDelova(delovi) {
  return delovi.map((deo) => {
    const tekst = escapeHtml(deo.tekst).replace(/\n/g, "<br>");
    if (deo.jako) return `<strong>${tekst}</strong>`;
    if (deo.kod) return `<code>${tekst}</code>`;
    return tekst;
  }).join("");
}

function htmlProze(tekst) {
  return blokoviTeksta(tekst).map((blok) => {
    if (blok.vrsta === "mermaid") return `<div class="figura-mermaid">${escapeHtml(blok.izvor)}</div>`;
    return blokoviProze(blok.tekst).map((deo) => {
      if (deo.vrsta === "naslov") {
        const nivo = Math.min(6, deo.nivo);
        return `<h${nivo}>${htmlDelova(deo.delovi)}</h${nivo}>`;
      }
      if (deo.vrsta === "lista") return `<ul>${deo.stavke.map((stavka) => `<li>${htmlDelova(stavka)}</li>`).join("")}</ul>`;
      if (deo.vrsta === "brojna") return `<ol>${deo.stavke.map((stavka) => `<li>${htmlDelova(stavka)}</li>`).join("")}</ol>`;
      if (deo.vrsta === "tabela") {
        const red = (celije, oznaka) => `<tr>${celije.map((celija) => `<${oznaka}>${htmlDelova(celija)}</${oznaka}>`).join("")}</tr>`;
        return `<table><thead>${red(deo.zaglavlje, "th")}</thead><tbody>${deo.redovi.map((redTabele) => red(redTabele, "td")).join("")}</tbody></table>`;
      }
      return `<p>${htmlDelova(deo.delovi)}</p>`;
    }).join("\n");
  }).join("\n");
}

function htmlNaslovBloka(naslov) {
  return naslov ? `<p><strong>${escapeHtml(naslov)}</strong></p>` : "";
}

function htmlBloka(blok) {
  if (blok.vrsta === "tekst") return htmlProze(blok.tekst);
  if (blok.vrsta === "highlight") {
    const naslov = blok.uloga === "kljucna" ? "Ključna ideja" : blok.naslov || "Napomena";
    return `<blockquote><p><strong>${escapeHtml(naslov)}</strong></p>${htmlProze(blok.tekst)}</blockquote>`;
  }
  if (blok.vrsta === "kod") {
    return `${htmlNaslovBloka(naslovKoda(blok))}<pre><code>${escapeHtml(blok.tekst)}</code></pre>`;
  }
  if (blok.vrsta === "dijagram") {
    return `${htmlNaslovBloka(blok.naslov || "Tekstualni dijagram")}<pre><code>${escapeHtml(blok.tekst)}</code></pre>`;
  }
  if (blok.vrsta === "mermaid") {
    const izvor = izvorMermaida(blok.tekst);
    return `${htmlNaslovBloka(blok.naslov || "Dijagram")}<div class="figura-mermaid">${escapeHtml(izvor)}</div>`;
  }
  if (blok.vrsta === "pitanje") return htmlPitanja(blok);
  return "";
}

function htmlPitanja(blok) {
  const delovi = [`<p><strong>Pitanje</strong></p>`, htmlProze(blok.tekst || "")];
  if (blok.oblik === "izbor") {
    const opcije = Array.isArray(blok.opcije) ? blok.opcije : [];
    if (opcije.length) {
      delovi.push(`<ul>${opcije.map((opcija) => {
        const tacan = opcija.ok ? " ✓" : "";
        return `<li>${escapeHtml(jedanRed(opcija.key))}. ${escapeHtml(jedanRed(opcija.text))}${tacan}</li>`;
      }).join("")}</ul>`);
    }
    const zasto = opcije.filter((opcija) => imaTekst(opcija.why));
    if (zasto.length) {
      delovi.push(`<blockquote><p><strong>Zašto</strong></p><ul>${zasto.map((opcija) => `<li><strong>${escapeHtml(jedanRed(opcija.key))}.</strong> ${escapeHtml(jedanRed(opcija.why))}</li>`).join("")}</ul></blockquote>`);
    }
  } else if (imaTekst(blok.odgovor)) {
    delovi.push(`<p><strong>Odgovor</strong></p>`, htmlProze(blok.odgovor));
  }
  if (imaTekst(blok.analiza)) {
    delovi.push(`<blockquote><p><strong>Obrazloženje</strong></p>${htmlProze(blok.analiza)}</blockquote>`);
  }
  if (imaTekst(blok.dodatno)) {
    delovi.push(`<blockquote><p><strong>Dodatno</strong></p>${htmlProze(blok.dodatno)}</blockquote>`);
  }
  if (imaTekst(blok.dodatniOdgovor)) {
    delovi.push(`<blockquote><p><strong>Odgovor na dodatno</strong></p>${htmlProze(blok.dodatniOdgovor)}</blockquote>`);
  }
  if (Number.isInteger(blok.minuta) && blok.minuta > 0) {
    delovi.push(`<blockquote><p><strong>Trajanje</strong></p><p>${blok.minuta} min</p></blockquote>`);
  }
  return delovi.filter(Boolean).join("\n");
}

function htmlDela(deo) {
  if (deo.vrsta === "naslov") {
    const nivo = Math.min(6, deo.nivo);
    return `<h${nivo}>${escapeHtml(deo.tekst)}</h${nivo}>`;
  }
  if (deo.vrsta === "blok") return htmlBloka(deo.blok);
  return "";
}

function htmlOmot(naslov, telo) {
  return `<!DOCTYPE html>
<html lang="sr">
<head>
<meta charset="utf-8">
<title>${escapeHtml(naslov)}</title>
<style>
  @page { margin: 16mm; }
  body { margin: 0; color: #1c1a16; background: #fff; font: 16px/1.5 system-ui, "Segoe UI", sans-serif; }
  main { max-width: 42rem; margin: 0 auto; padding: 1.25rem 0 2rem; }
  h1, h2, h3 { line-height: 1.25; }
  pre { white-space: pre-wrap; background: #f6f3ee; padding: 0.8rem 1rem; border-radius: 8px; }
  blockquote { margin-left: 0; padding-left: 0.85rem; border-left: 3px solid #c4a15a; }
  table { border-collapse: collapse; width: 100%; }
  th, td { border: 1px solid #d9d3c7; padding: 0.35rem 0.5rem; text-align: left; }
  .figura-mermaid svg { max-width: 100%; height: auto; }
  code { font-family: ui-monospace, "Cascadia Code", monospace; }
</style>
</head>
<body>
<main>
${telo}
</main>
<script src="/vendor/mermaid/mermaid.js"></script>
<script>
  const cvorovi = [...document.querySelectorAll(".figura-mermaid")];
  function javiSpremnost() {
    const poruka = { izvoz: "spreman" };
    try {
      const cilj = location.origin && location.origin !== "null" ? location.origin : "*";
      window.parent.postMessage(poruka, cilj);
    } catch (greska) {
      window.parent.postMessage(poruka, "*");
    }
  }
  async function crtaj() {
    try {
      if (window.mermaid && cvorovi.length) {
        window.mermaid.initialize({ startOnLoad: false, securityLevel: "strict", suppressErrorRendering: true });
        for (let i = 0; i < cvorovi.length; i += 1) {
          const izvor = cvorovi[i].textContent;
          try {
            const crtez = await window.mermaid.render("izvoz" + i, izvor);
            cvorovi[i].innerHTML = crtez.svg;
          } catch (greska) {
            const pre = document.createElement("pre");
            pre.textContent = izvor;
            cvorovi[i].replaceChildren(pre);
          }
        }
      }
    } finally {
      javiSpremnost();
    }
  }
  crtaj();
</script>
</body>
</html>
`;
}

function htmlDokumenta(dok, nivoNaslova) {
  const naslov = { vrsta: "naslov", nivo: nivoNaslova, tekst: dok.naslov };
  const telo = [naslov, ...pomeriNivo(dok.delovi, nivoNaslova)].map(htmlDela).filter(Boolean).join("\n");
  return htmlOmot(dok.naslov, telo);
}

export function htmlKoraka(korak) {
  return htmlDokumenta(dokumentKoraka(korak), 1);
}

export function htmlTeme(tema) {
  const dok = dokumentTeme(tema);
  const uvod = [
    dok.podnaslov ? htmlProze(dok.podnaslov) : "",
    dok.ishod ? `<p><strong>Ishod.</strong></p>\n${htmlProze(dok.ishod)}` : "",
    ...dok.koraci.map((korak) => {
      const naslov = { vrsta: "naslov", nivo: 2, tekst: korak.naslov };
      return [naslov, ...pomeriNivo(korak.delovi, 2)].map(htmlDela).filter(Boolean).join("\n");
    }),
  ].filter(Boolean).join("\n");
  return htmlOmot(dok.naslov, `<h1>${escapeHtml(dok.naslov)}</h1>\n${uvod}`);
}

export function preuzmiTekst(ime, tekst, tip = "text/markdown") {
  const url = URL.createObjectURL(new Blob([tekst], { type: `${tip};charset=utf-8` }));
  const veza = document.createElement("a");
  veza.href = url;
  veza.download = ime;
  document.body.append(veza);
  veza.click();
  veza.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function stampajHtml(html, dokument = document) {
  return new Promise((resolve) => {
    let okvir = dokument.getElementById("izvoz-stampa");
    if (!okvir) {
      okvir = dokument.createElement("iframe");
      okvir.id = "izvoz-stampa";
      okvir.title = "Pregled izvoza";
      dokument.body.append(okvir);
    }
    let gotovo = false;
    const zavrsi = () => {
      if (gotovo) return;
      gotovo = true;
      window.removeEventListener("message", naPoruku);
      try {
        okvir.contentWindow?.focus();
        okvir.contentWindow?.print();
      } catch {
        /* pregled štampe nije dostupan */
      }
      resolve();
    };
    const naPoruku = (dogadjaj) => {
      if (dogadjaj.source !== okvir.contentWindow || dogadjaj.data?.izvoz !== "spreman") return;
      zavrsi();
    };
    window.addEventListener("message", naPoruku);
    window.setTimeout(zavrsi, 12000);
    okvir.srcdoc = html;
  });
}
