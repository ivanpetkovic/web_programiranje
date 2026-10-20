const POCETAK = "<!-- povezi-pocetak -->";
const KRAJ = "<!-- povezi-kraj -->";
const kes = new WeakMap();

function ceoTekst(korak) {
  if (korak.ugradjen) return String(korak.original ?? "");
  if (typeof korak.original === "string" && korak.original !== korak.delic) return korak.original;
  return null;
}

function doprinos(korak, trenutni) {
  const ceo = ceoTekst(korak);
  if (ceo !== null) return ceo;
  const delic = String(korak.delic ?? "").trim();
  const isecak = String(korak.isecak ?? "").trim();
  const klasa = isecak.match(/^class\s+([A-Za-z0-9_]+)/);
  const prva = delic.split("\n")[0].trim();
  if (klasa && prva && isecak.includes(prva) && !new RegExp(`\\bclass\\s+${klasa[1]}\\b`).test(trenutni)) {
    return isecak;
  }
  return delic;
}

export function skiniPovez(html) {
  const tekst = String(html ?? "");
  const a = tekst.indexOf(POCETAK);
  const b = tekst.indexOf(KRAJ);
  if (a < 0 || b < a) return tekst;
  return `${tekst.slice(0, a)}${tekst.slice(b + KRAJ.length)}`.replace(/\n{3,}/g, "\n\n");
}

function vecIma(baza, telo) {
  const tekst = baza.trim();
  if (tekst === telo) return true;
  return baza.includes(`\n${telo}\n`) || baza.endsWith(`\n${telo}`);
}

function ubaciUHtml(html, telo) {
  if (vecIma(html, telo)) return html.endsWith("\n") ? html : `${html}\n`;
  const umetak = telo.startsWith("<") ? telo : `<!-- ${telo.replace(/--/g, "")} -->`;
  return html.replace("</body>", `${umetak}\n</body>`);
}

function dopuni(putanja, tekst) {
  if (putanja !== "client/js/korak.js") return tekst;
  if (!/\bfunction\s+korak\b/.test(tekst) || !/\bdelta\b/.test(tekst)) return tekst;
  if (/\b(?:let|const|var)\s+delta\b/.test(tekst)) return tekst;
  return `let delta = 1;\n${tekst}`;
}

function spoj(trenutni, korak) {
  const baza = skiniPovez(trenutni);
  const dodatak = doprinos(korak, baza);
  if (ceoTekst(korak) !== null) return dodatak;
  const telo = dodatak.trim();
  if (!telo) return baza;
  if (korak.putanja === "client/index.html" && baza.includes("</body>")) return ubaciUHtml(baza, telo);
  if (vecIma(baza, telo)) return baza.endsWith("\n") || baza === "" ? baza : `${baza}\n`;
  if (!baza.trim()) return `${telo}\n`;
  return `${baza.trimEnd()}\n\n${telo}\n`;
}

function deklarisano(tekstovi, ime) {
  return new RegExp(`\\b(?:let|const|var|function|class)\\s+${ime}\\b`).test(tekstovi);
}

function pominje(tekst, ime) {
  return new RegExp(`\\b${ime}\\b`).test(tekst);
}

function inicijal(jsFajlovi, html) {
  const tekstovi = jsFajlovi.map((fajl) => fajl.tekst).join("\n");
  const ima = (ime) => deklarisano(tekstovi, ime);
  const linije = [];
  if (ima("korak") && !ima("delta")) linije.push("let delta = 1;");
  linije.push('const cifra = document.querySelector(".digit");');
  linije.push('const dugme = document.querySelector("button");');
  if (ima("Displej")) linije.push("const displej = cifra ? new Displej(cifra) : null;");
  if (ima("Prekidac")) linije.push("const prekidac = dugme ? new Prekidac(dugme) : null;");
  if (ima("granica")) linije.push("const visoka = granica(24);");
  if (ima("iznadPraga") && ima("soba")) linije.push("const izabrano = iznadPraga([{ temperatura: soba.temperatura }]);");
  if (ima("temperature") && ima("soba")) linije.push("const visine = temperature([{ temperatura: soba.temperatura }]);");
  if (pominje(html, "preventDefault")) {
    linije.push('const forma = document.querySelector("form");');
    linije.push('if (forma) forma.addEventListener("submit", (dogadjaj) => dogadjaj.preventDefault());');
  }
  const unutra = [];
  if (ima("Prekidac")) unutra.push("  if (prekidac) prekidac.crtaj(!prekidac.ukljucen);");
  if (ima("korak") && ima("soba")) unutra.push("  korak(soba);");
  if (ima("Displej") && ima("soba")) unutra.push("  if (displej) displej.crtaj(soba.temperatura);");
  else if (ima("soba")) unutra.push("  if (cifra) cifra.textContent = String(soba.temperatura);");
  if (ima("pripremiLiniju") && ima("soba")) unutra.push("  const spremno = pripremiLiniju([{ temperatura: soba.temperatura }]);");
  if (pominje(tekstovi, "nacrtajLiniju")) {
    unutra.push('  const platno = document.querySelector("canvas");');
    if (ima("pripremiLiniju") && ima("nacrtajLiniju")) unutra.push("  if (platno) nacrtajLiniju(platno, spremno.visine);");
    else unutra.push('  if (platno && typeof nacrtajLiniju === "function") nacrtajLiniju(platno, []);');
  }
  if (unutra.length) {
    linije.push('if (dugme) dugme.addEventListener("click", () => {');
    linije.push(...unutra);
    linije.push("});");
  }
  return linije.join("\n");
}

export function ugradiPovez(html, jsFajlovi) {
  const baza = skiniPovez(html);
  if (!jsFajlovi.length || !baza.includes("</body>")) return baza;
  const src = jsFajlovi.map((fajl) => `<script src="${fajl.src}"></script>`).join("\n");
  const platno = jsFajlovi.some((fajl) => pominje(fajl.tekst, "nacrtajLiniju")) ? '<canvas width="320" height="120"></canvas>\n' : "";
  const blok = `${POCETAK}\n${platno}${src}\n<script>\n${inicijal(jsFajlovi, baza)}\n</script>\n${KRAJ}\n`;
  return baza.replace("</body>", `${blok}</body>`);
}

function poveziKlijent(verzije) {
  if (!verzije.has("client/index.html")) return;
  const js = [];
  for (const putanja of verzije.keys()) {
    if (putanja.startsWith("client/js/") && putanja.endsWith(".js")) {
      js.push({ src: putanja.slice("client/".length), tekst: verzije.get(putanja) });
    }
  }
  verzije.set("client/index.html", ugradiPovez(verzije.get("client/index.html"), js));
}

function izgradi(koraci) {
  const verzije = new Map();
  const redosled = [];
  const snimci = [];
  for (const korak of koraci) {
    if (korak && korak.putanja) {
      if (!verzije.has(korak.putanja)) redosled.push(korak.putanja);
      verzije.set(korak.putanja, dopuni(korak.putanja, spoj(verzije.get(korak.putanja) || "", korak)));
      poveziKlijent(verzije);
    }
    snimci.push({ putanje: redosled.slice(), verzije: Object.fromEntries(verzije) });
  }
  return snimci;
}

function snimci(koraci) {
  let gotovo = kes.get(koraci);
  if (!gotovo) {
    gotovo = izgradi(koraci);
    kes.set(koraci, gotovo);
  }
  return gotovo;
}

export function stabloDo(koraci, indeks) {
  const svi = snimci(koraci);
  if (!svi.length) return { putanje: [], verzije: {} };
  const i = Math.min(Math.max(indeks, 0), svi.length - 1);
  return svi[i];
}

export function fajloviStrane(stablo, strana) {
  const prefiks = `${strana}/`;
  return stablo.putanje.filter((putanja) => putanja.startsWith(prefiks)).map((putanja) => putanja.slice(prefiks.length));
}

export function prethodnaVerzija(koraci, indeks, putanja) {
  if (!koraci.length || indeks <= 0) return null;
  const ranije = stabloDo(koraci, indeks - 1).verzije[putanja];
  return ranije === undefined ? null : ranije;
}
