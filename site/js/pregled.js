export const PORUKA = "Delić nije primenjen.";

const SKRIPTOVI = new Set([
  "client/js/korak.js",
  "client/js/niz.js",
  "client/js/displej.js",
  "client/js/prekidac.js",
]);

export function punaPutanja(strana, put) {
  if (put.startsWith("client/") || put.startsWith("server/")) return put;
  return `${strana}/${put}`;
}

export function citajHtmlSobu(tekst) {
  if (typeof tekst !== "string" || (tekst.includes("<") && !tekst.includes(">"))) {
    throw new Error(PORUKA);
  }
  const cifra = tekst.match(/class="digit"[^>]*>([^<]*)</);
  const naslov = tekst.match(/<h1[^>]*>([^<]*)</);
  const dugme = tekst.match(/<button[^>]*>([^<]*)</);
  return {
    cifra: cifra ? cifra[1] : undefined,
    naslov: naslov ? naslov[1] : undefined,
    dugme: dugme ? dugme[1] : undefined,
  };
}

export function trajanjeLopatica(css) {
  const pogodak = String(css).match(/animation-duration:\s*([0-9.]+)s/);
  return pogodak ? `${pogodak[1]}s` : null;
}

export function primeniPrikaz(stanje, ulaz) {
  const put = punaPutanja(ulaz.strana, ulaz.put);
  const sacuvanFajl = false;
  if (ulaz.strana === "server" || put.startsWith("server/")) {
    return { ...stanje, poruka: "", sacuvanFajl, crtao: false };
  }
  try {
    if (put === "client/index.html") {
      const deo = citajHtmlSobu(ulaz.tekst);
      const crtez = { ...stanje.crtez };
      if (deo.cifra !== undefined) crtez.cifra = deo.cifra;
      if (deo.naslov !== undefined) crtez.naslov = deo.naslov;
      if (deo.dugme !== undefined) crtez.dugme = deo.dugme;
      return { ...stanje, crtez, poruka: "", sacuvanFajl, crtao: true };
    }
    if (put === "client/css/soba.css") {
      const trajanje = trajanjeLopatica(ulaz.tekst);
      return {
        ...stanje,
        stil: ulaz.tekst,
        trajanje: trajanje || stanje.trajanje,
        poruka: "",
        sacuvanFajl,
        crtao: true,
      };
    }
    if (SKRIPTOVI.has(put)) {
      const prolaz = new Function(`${ulaz.tekst}\nreturn true;`)();
      if (prolaz !== true) throw new Error(PORUKA);
      return { ...stanje, skript: put, izvor: ulaz.tekst, poruka: "", sacuvanFajl, crtao: true };
    }
    return { ...stanje, poruka: "", sacuvanFajl, crtao: false };
  } catch {
    return { ...stanje, poruka: PORUKA, sacuvanFajl, crtao: false };
  }
}
