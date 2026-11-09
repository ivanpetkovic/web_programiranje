function dekodiraj(vrednost) {
  try {
    return decodeURIComponent(vrednost);
  } catch {
    return vrednost;
  }
}

function deoIzAdrese(vrednost) {
  if (vrednost === "gradivo" || vrednost === "koraci") return "koraci";
  if (vrednost === "diskusija" || vrednost === "editor") return vrednost;
  return null;
}

function prazno(vrsta) {
  return { vrsta, cas: 0, korak: null, deo: null, blok: null, fajl: null };
}

function teloAdrese(adresa) {
  return String(adresa || "")
    .replace(/^#/, "")
    .replace(/^\/+/, "");
}

export function procitajMesto(adresa) {
  const telo = teloAdrese(adresa);
  if (!telo) return prazno("prazno");
  if (telo === "uvod") return prazno("uvod");
  const pogodak = telo.match(/^(?:cas-|tema\/)(\d+)(?:\/(.*))?$/);
  if (!pogodak) return prazno("nepoznato");
  const mesto = {
    vrsta: "cas",
    cas: Number(pogodak[1]),
    korak: null,
    deo: null,
    blok: null,
    fajl: null,
  };
  const ostatak = pogodak[2] || "";
  if (!ostatak) return mesto;
  const oznakaFajla = `/fajl/`;
  const fajlNa = ostatak.indexOf(oznakaFajla);
  const preFajla = fajlNa >= 0 ? ostatak.slice(0, fajlNa) : ostatak;
  if (fajlNa >= 0) {
    const put = ostatak
      .slice(fajlNa + oznakaFajla.length)
      .split(`/`)
      .map(dekodiraj)
      .join(`/`);
    mesto.fajl = put || null;
  }
  const delovi = preFajla.split(`/`).filter((deo) => deo !== "");
  for (let i = 0; i < delovi.length; i += 2) {
    const kljuc = delovi[i];
    const vrednost = delovi[i + 1];
    if (!vrednost) continue;
    if (kljuc === "k" && /^[1-9]\d*$/.test(vrednost)) mesto.korak = Number(vrednost) - 1;
    else if (kljuc === "deo") mesto.deo = deoIzAdrese(vrednost);
    else if (kljuc === "blok") mesto.blok = dekodiraj(vrednost);
  }
  return mesto;
}

export function dopunaMesta(hash, mesto) {
  const procitano = procitajMesto(hash);
  if (!mesto || mesto.uvod) return procitano.vrsta === "uvod" || procitano.vrsta === "prazno";
  if (procitano.vrsta !== "cas" || procitano.cas !== mesto.cas) return false;
  if (procitano.korak != null && procitano.korak !== mesto.korak) return false;
  if (procitano.deo && procitano.deo !== mesto.deo) return false;
  if (procitano.blok && procitano.blok !== (mesto.blok || null)) return false;
  if (procitano.fajl && procitano.fajl !== (mesto.fajl || null)) return false;
  return true;
}

export function sastaviMesto(mesto) {
  if (!mesto || mesto.uvod) return `/uvod`;
  let put = `/tema/${mesto.cas}`;
  if (Number.isInteger(mesto.korak) && mesto.korak >= 0) put += `/k/${mesto.korak + 1}`;
  if (mesto.deo === "koraci" || mesto.deo === "diskusija" || mesto.deo === "editor") {
    put += `/deo/${mesto.deo === "koraci" ? "gradivo" : mesto.deo}`;
  }
  if (mesto.blok && mesto.deo !== "editor") put += `/blok/${encodeURIComponent(mesto.blok)}`;
  if (mesto.fajl && mesto.deo === "editor") {
    put += `/fajl/${mesto.fajl.split(`/`).map((deo) => encodeURIComponent(deo)).join(`/`)}`;
  }
  return put;
}
