export function jedanRed(tekst) {
  return String(tekst ?? "").replace(/\s+/g, " ").trim();
}

export function imaTekst(vrednost) {
  return Boolean(String(vrednost ?? "").trim());
}

function ogradeUravnotezene(tekst) {
  let otvorena = null;
  for (const linija of String(tekst ?? "").split("\n")) {
    const poklapanje = /^[ \t]{0,3}(`{3,})([^`]*)$/.exec(linija);
    if (!poklapanje) continue;
    if (!otvorena) {
      otvorena = poklapanje[1].length;
      continue;
    }
    if (poklapanje[1].length >= otvorena && poklapanje[2].trim() === "") otvorena = null;
  }
  return otvorena === null;
}

export function zastitiOgrade(tekst, uvek = false) {
  const izvor = String(tekst ?? "");
  if (!uvek && ogradeUravnotezene(izvor)) return izvor;
  return izvor
    .split("\n")
    .map((linija) => (/^[ \t]{0,3}`{3,}/.test(linija) ? linija.replace(/^([ \t]{0,3})`/, "$1\\`") : linija))
    .join("\n");
}

export function odzastitiOgrade(tekst) {
  return String(tekst ?? "")
    .split("\n")
    .map((linija) => linija.replace(/^([ \t]{0,3})\\`/, "$1`"))
    .join("\n");
}

function jezikOgrade(jezik) {
  const cist = String(jezik || "").trim();
  return /^[A-Za-z0-9_+-]+$/.test(cist) ? cist : "";
}

export function ograda(jezik, tekst) {
  const telo = String(tekst ?? "").replace(/\n+$/, "");
  let duzina = 3;
  for (const poklapanje of telo.matchAll(/`{3,}/g)) duzina = Math.max(duzina, poklapanje[0].length + 1);
  const crta = "`".repeat(duzina);
  return `${crta}${jezikOgrade(jezik)}\n${telo}\n${crta}`;
}

export function citat(naslov, tekst) {
  const linije = [];
  if (naslov) linije.push(`**${String(naslov).replace(/\*/g, "")}**`, "");
  linije.push(...zastitiOgrade(tekst, true).replace(/\n+$/, "").split("\n"));
  return linije.map((linija) => (linija.length ? `> ${linija}` : ">")).join("\n");
}

export function skiniCitat(markdown) {
  return String(markdown ?? "")
    .split("\n")
    .map((linija) => {
      if (!linija.startsWith(">")) return linija;
      return linija.startsWith("> ") ? linija.slice(2) : linija.slice(1);
    })
    .join("\n")
    .trim();
}

export function naslovITelo(tekst) {
  const poklapanje = /^\*\*([^*]+)\*\*\n\n([\s\S]*)$/.exec(String(tekst ?? "").trim());
  if (!poklapanje) return { naslov: "", telo: String(tekst ?? "").trim() };
  return { naslov: poklapanje[1], telo: poklapanje[2].replace(/\s+$/, "") };
}

export function naslovPodebljan(tekst) {
  const poklapanje = /^\*\*([^*]+)\*\*$/.exec(String(tekst ?? "").trim());
  return poklapanje ? poklapanje[1] : "";
}

export function procitajOgradu(markdown) {
  const linije = String(markdown ?? "").split("\n");
  let pocetak = -1;
  let duzina = 0;
  let jezik = "";
  for (let i = 0; i < linije.length; i += 1) {
    const poklapanje = /^(`{3,})([^`]*)$/.exec(linije[i]);
    if (!poklapanje) continue;
    pocetak = i;
    duzina = poklapanje[1].length;
    jezik = poklapanje[2].trim();
    break;
  }
  if (pocetak < 0) return null;
  let kraj = linije.length;
  for (let i = pocetak + 1; i < linije.length; i += 1) {
    const poklapanje = /^(`{3,})\s*$/.exec(linije[i]);
    if (poklapanje && poklapanje[1].length >= duzina) {
      kraj = i;
      break;
    }
  }
  return {
    jezik,
    telo: linije.slice(pocetak + 1, kraj).join("\n").replace(/\n+$/, ""),
    pre: linije.slice(0, pocetak).join("\n"),
  };
}

export function podeliNaGrupe(markdown) {
  const grupe = [];
  let trenutna = [];
  let uCitu = null;
  const zatvori = () => {
    if (!trenutna.length) return;
    grupe.push(trenutna.join("\n"));
    trenutna = [];
  };
  for (const linija of String(markdown ?? "").split("\n")) {
    const citatLinija = linija.startsWith(">");
    if (uCitu !== null && citatLinija !== uCitu) zatvori();
    uCitu = citatLinija;
    trenutna.push(linija);
  }
  zatvori();
  return grupe;
}
