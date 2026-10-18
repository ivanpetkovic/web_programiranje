const KLJUC_POSMATRACA = "kljuc-posmatraca";
const KLJUC_OPERATERA = "kljuc-operatera";
const ULOGA_PO_KLJUCU = new Map([
  [KLJUC_POSMATRACA, "posmatrac"],
  [KLJUC_OPERATERA, "operater"],
]);

function kljucIzKolacica(zahtev) {
  const zaglavlje = zahtev.headers.cookie || "";
  const kolacic = zaglavlje
    .split(";")
    .map((deo) => deo.trim())
    .find((deo) => deo.startsWith("sesija="));
  if (!kolacic) return "";
  return decodeURIComponent(kolacic.slice("sesija=".length));
}

function odbijenaKomanda(zahtev) {
  const kljuc = kljucIzKolacica(zahtev);
  if (!kljuc || !ULOGA_PO_KLJUCU.has(kljuc)) {
    return { status: 401, body: { greska: "nema sesije" } };
  }
  if (ULOGA_PO_KLJUCU.get(kljuc) !== "operater") {
    return { status: 403, body: { greska: "posmatrac" } };
  }
  return null;
}

function kljucZaUlogu(naziv) {
  if (naziv === "operater") return KLJUC_OPERATERA;
  if (naziv === "posmatrac") return KLJUC_POSMATRACA;
  return "";
}

module.exports = { odbijenaKomanda, kljucZaUlogu };
