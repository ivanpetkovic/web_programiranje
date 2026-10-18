const SESIJE = new Map([
  ["kljuc-posmatraca", "posmatrac"],
  ["kljuc-operatera", "operater"],
]);

function kljucIzKolacica(req) {
  const raw = req.headers.cookie || "";
  const hit = raw
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("sesija="));
  return hit ? decodeURIComponent(hit.slice("sesija=".length)) : "";
}

function uloga(req, proveri) {
  if (!proveri) return null;
  const key = kljucIzKolacica(req);
  if (!key || !SESIJE.has(key)) return { status: 401, body: { greska: "nema sesije" } };
  if (SESIJE.get(key) !== "operater") return { status: 403, body: { greska: "posmatrac" } };
  return null;
}

function kljucZa(koja) {
  if (koja === "operater") return "kljuc-operatera";
  if (koja === "posmatrac") return "kljuc-posmatraca";
  return "";
}

module.exports = { uloga, kljucZa };
