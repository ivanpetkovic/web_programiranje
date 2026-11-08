import { Blok } from "./blok.js";
import {
  citat,
  imaTekst,
  jedanRed,
  naslovITelo,
  odzastitiOgrade,
  podeliNaGrupe,
  skiniCitat,
  zastitiOgrade,
} from "./md.js";

function parsirajOpciju(linija) {
  const poklapanje = /^- ([^.]+)\. (.*)$/.exec(String(linija).trim());
  if (!poklapanje) return null;
  let text = poklapanje[2];
  let ok = false;
  if (text.endsWith(" ✓")) {
    ok = true;
    text = text.slice(0, -2);
  }
  return { key: poklapanje[1].trim(), text, ok, why: "" };
}

function razloziZasto(tekst) {
  const mapa = new Map();
  for (const linija of String(tekst ?? "").split("\n")) {
    const poklapanje = /^- \*\*([^*]+)\.\*\*\s*(.*)$/.exec(linija.trim());
    if (poklapanje) mapa.set(poklapanje[1].trim(), poklapanje[2].trim());
  }
  return mapa;
}

export class Pitanje extends Blok {
  static vrsta = "pitanje";

  static prepoznaje(markdown) {
    return /^\*\*Pitanje\*\*/.test(String(markdown ?? "").trim());
  }

  static uvoz(markdown) {
    let tekst = "";
    let odgovor = "";
    let analiza = "";
    let oblik = "tekst";
    let opcije = [];
    let zasto = new Map();
    for (const grupa of podeliNaGrupe(String(markdown ?? "").trim())) {
      if (grupa.startsWith(">")) {
        const { naslov, telo } = naslovITelo(skiniCitat(grupa));
        if (naslov === "Zašto") zasto = razloziZasto(telo);
        else if (naslov === "Obrazloženje") analiza = odzastitiOgrade(telo);
        continue;
      }
      let telo = grupa.trim().replace(/^\*\*Pitanje\*\*\s*/, "").trim();
      if (!telo) continue;
      const linije = telo.split("\n");
      const prvaOpcija = linije.findIndex((linija) => /^- \S+\. /.test(linija));
      if (prvaOpcija >= 0) {
        oblik = "izbor";
        tekst = linije.slice(0, prvaOpcija).join("\n").trim();
        opcije = linije.slice(prvaOpcija).map(parsirajOpciju).filter(Boolean);
        continue;
      }
      const odgovorNa = linije.findIndex((linija) => linija.trim() === "**Odgovor**");
      if (odgovorNa >= 0) {
        oblik = "tekst";
        tekst = linije.slice(0, odgovorNa).join("\n").trim();
        odgovor = odzastitiOgrade(linije.slice(odgovorNa + 1).join("\n").trim());
        continue;
      }
      tekst = telo;
    }
    const podaci = { vrsta: "pitanje", oblik, tekst: odzastitiOgrade(tekst) };
    if (oblik === "izbor") {
      podaci.opcije = opcije.map((opcija) => ({ ...opcija, why: zasto.get(opcija.key) || "" }));
    } else if (odgovor) podaci.odgovor = odgovor;
    if (analiza) podaci.analiza = analiza;
    return new this(podaci);
  }

  imaSadrzaj() {
    const blok = this.podaci;
    if (imaTekst(blok.tekst) || imaTekst(blok.odgovor) || imaTekst(blok.analiza)) return true;
    return (blok.opcije || []).some((opcija) => imaTekst(opcija.text) || imaTekst(opcija.why));
  }

  izvoz() {
    if (!this.imaSadrzaj()) return "";
    const blok = this.podaci;
    const delovi = ["**Pitanje**", "", zastitiOgrade(blok.tekst || "").trim()];
    if (blok.oblik === "izbor") {
      const opcije = Array.isArray(blok.opcije) ? blok.opcije : [];
      if (opcije.length) {
        delovi.push(
          "",
          ...opcije.map((opcija) => {
            const tacan = opcija.ok ? " ✓" : "";
            return `- ${jedanRed(opcija.key)}. ${jedanRed(opcija.text)}${tacan}`;
          }),
        );
      }
      const zasto = opcije
        .filter((opcija) => imaTekst(opcija.why))
        .map((opcija) => `> - **${jedanRed(opcija.key)}.** ${jedanRed(opcija.why)}`);
      if (zasto.length) delovi.push("", "> **Zašto**", ">", ...zasto);
    } else if (imaTekst(blok.odgovor)) {
      delovi.push("", "**Odgovor**", "", zastitiOgrade(blok.odgovor).trim());
    }
    if (imaTekst(blok.analiza)) delovi.push("", citat("Obrazloženje", blok.analiza));
    return delovi.join("\n");
  }

  natpis() {
    return this.podaci.oblik === "izbor" ? "Pitanje, izbor" : "Pitanje, tekst";
  }

  ikona() {
    return this.podaci.oblik === "izbor" ? "circle-dot" : "message-circle";
  }

  static meni() {
    return [
      { vrsta: "pitanje", natpis: "Pitanje, tekst", ikona: "message-circle", polja: { oblik: "tekst" } },
      {
        vrsta: "pitanje",
        natpis: "Pitanje, izbor",
        ikona: "circle-dot",
        polja: {
          oblik: "izbor",
          opcije: [
            { key: "A", text: "", ok: false, why: "" },
            { key: "B", text: "", ok: true, why: "" },
          ],
        },
      },
    ];
  }
}
