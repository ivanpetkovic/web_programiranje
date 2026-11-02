export const REZIM_KLJUC = "web-programiranje:rezim";
export const FONT_KLJUC = "web-programiranje:font-skala";

const MIN_FONT = 0.85;
const MAX_FONT = 1.2;

export function procitajRezim(skladiste = localStorage) {
  try {
    const vrednost = skladiste.getItem(REZIM_KLJUC);
    if (vrednost === "predavanje" || vrednost === "samostalno") return vrednost;
  } catch {
    /* localStorage nedostupan */
  }
  return "samostalno";
}

export function upisiRezim(skladiste, rezim) {
  if (rezim !== "predavanje" && rezim !== "samostalno") return;
  try {
    skladiste.setItem(REZIM_KLJUC, rezim);
  } catch {
    /* localStorage pun ili blokiran */
  }
}

export function procitajSkaluFonta(skladiste = localStorage) {
  try {
    const vrednost = Number(skladiste.getItem(FONT_KLJUC));
    if (Number.isFinite(vrednost) && vrednost >= MIN_FONT && vrednost <= MAX_FONT) return vrednost;
  } catch {
    /* localStorage nedostupan */
  }
  return 1;
}

export function upisiSkaluFonta(skladiste, skala) {
  const vrednost = Number(skala);
  if (!Number.isFinite(vrednost)) return;
  const ograniceno = Math.min(MAX_FONT, Math.max(MIN_FONT, Math.round(vrednost * 100) / 100));
  try {
    skladiste.setItem(FONT_KLJUC, String(ograniceno));
  } catch {
    /* localStorage pun ili blokiran */
  }
}

export function jePredavanje(rezim = procitajRezim()) {
  return rezim === "predavanje";
}

export function podrazumevaniTab(rezim = procitajRezim()) {
  return jePredavanje(rezim) ? "diskusija" : "koraci";
}

export function primeniRezimNaStranicu(doc = document, rezim = procitajRezim(), skala = procitajSkaluFonta()) {
  const { body, documentElement } = doc;
  if (!body) return;
  body.classList.toggle("rezim-predavanje", rezim === "predavanje");
  body.classList.toggle("rezim-samostalno", rezim === "samostalno");
  documentElement.style.setProperty("--podesavanje-font", String(skala));
}

export { MIN_FONT, MAX_FONT };
