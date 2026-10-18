export const recnik = [
  {
    id: "alati-browsera",
    en: "DevTools",
    tekst: "Ugrađeni alati browsera. Izmena u njima menja prikaz u ovom browseru, a dokument ostaje isti.",
    oblici: ["alatima browsera", "alati browsera", "alatima", "alati"],
  },
  {
    id: "osvezavanje",
    en: "refresh",
    tekst: "Ponovno učitavanje dokumenta. Prikaz se pravi iznova iz fajla.",
    oblici: ["osvežavanje", "osvežava", "osveži"],
  },
  {
    id: "semanticki-html",
    en: "semantic HTML",
    tekst: "HTML koji imenuje ulogu dela stranice, ne samo kako taj deo izgleda.",
    oblici: ["semantički HTML"],
  },
  {
    id: "pristupacnost",
    en: "accessibility",
    tekst: "Svojstvo da se sadržaj može koristiti i kad izgled ili jedan način unosa nedostaje.",
    oblici: ["pristupačna forma", "pristupačnost"],
  },
  {
    id: "kolacic",
    en: "cookie",
    tekst: "Zapis koji browser čuva i šalje uz zahtev. U kursu nosi ključ sesije, ne ime uloge.",
    oblici: ["kolačića", "kolačiću", "kolačić"],
  },
  {
    id: "ocitavanje",
    en: "reading",
    tekst: "Izmerena ili simulirana vrednost zajedno sa trenutkom na koji se odnosi.",
    oblici: ["očitavanja", "očitavanje"],
  },
  {
    id: "zeljeno-stanje",
    en: "desired state",
    tekst: "Stanje koje korisnik traži komandom. Nije samo po sebi potvrda da je promena primenjena.",
    oblici: ["željenog stanja", "željeno stanje"],
  },
  {
    id: "posmatrac",
    en: "observer",
    tekst: "Uloga koja sme da pregleda stanje kontrolne sobe, ali ne i da upravlja ventilatorom.",
    oblici: ["posmatrača", "posmatrač"],
  },
  {
    id: "operater",
    en: "operator",
    tekst: "Uloga koja sme da pregleda stanje i izdaje dozvoljene komande uređajima.",
    oblici: ["operatera", "operater"],
  },
  {
    id: "kontejner",
    en: "container",
    tekst: "Omot procesa. Nije disk na kome zapis ostaje, niti jedna celina upisa.",
    oblici: ["kontejnera", "kontejner"],
  },
  {
    id: "middleware",
    en: "middleware",
    tekst: "Sloj koji zahtev prođe pre rute. Kurs ga imenuje i ne gradi ga.",
    oblici: ["middleware"],
  },
  {
    id: "optimisticki-prikaz",
    en: "optimistic UI",
    tekst: "Prikaz koji se promeni pre potvrde da je komanda prošla.",
    oblici: ["optimistički prikaz"],
  },
  {
    id: "token",
    en: "token",
    tekst: "Zapis koji dokazuje pravo umesto lozinke. Kurs ga imenuje i ne gradi prijavu.",
    oblici: ["tokeni", "token"],
  },
  {
    id: "virtuelna-masina",
    en: "virtual machine",
    tekst: "Računar u softveru, sa svojim sistemom. Nije kontejner.",
    oblici: ["virtuelna mašina"],
  },
  {
    id: "transakcija",
    en: "transaction",
    tekst: "Jedna celina upisa. Oba upisa uspeju, ili se oba povuku.",
    oblici: ["transakcije", "transakcija"],
  },
];

const poObliku = new Map();
for (const pojam of recnik) {
  for (const oblik of pojam.oblici) poObliku.set(oblik.toLowerCase(), pojam);
}

const uzorak = recnik
  .flatMap((pojam) => pojam.oblici)
  .sort((a, b) => b.length - a.length)
  .map((oblik) => oblik.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
  .join("|");

const trazi = new RegExp(`(?<![\\p{L}\\p{N}])(?:${uzorak})(?![\\p{L}\\p{N}])`, "giu");

export function razbij(tekst) {
  const delovi = [];
  let od = 0;
  for (const pogodak of tekst.matchAll(trazi)) {
    const na = pogodak.index;
    if (na > od) delovi.push({ tip: "tekst", vrednost: tekst.slice(od, na) });
    const pojam = poObliku.get(pogodak[0].toLowerCase());
    delovi.push({
      tip: "pojam",
      vrednost: pogodak[0],
      id: pojam.id,
      en: pojam.en,
      tekst: pojam.tekst,
    });
    od = na + pogodak[0].length;
  }
  if (od < tekst.length) delovi.push({ tip: "tekst", vrednost: tekst.slice(od) });
  return delovi;
}
