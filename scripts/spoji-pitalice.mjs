import fs from "fs";
import kurs from "../site/kurs.json" with { type: "json" };
import { drugeA } from "./druge-a.mjs";
import { drugeB } from "./druge-b.mjs";
import { drugeC } from "./druge-c.mjs";
import { drugeD } from "./druge-d.mjs";
import { drugeE } from "./druge-e.mjs";

const druge = { ...drugeA, ...drugeB, ...drugeC, ...drugeD, ...drugeE };

function izmesaj(p, indeks) {
  const tacan = structuredClone(p.opcije.find((o) => o.ok));
  const netacan = structuredClone(p.opcije.find((o) => !o.ok));
  const stanje = indeks % 4;
  const tacanKljuc = stanje % 2 === 0 ? "A" : "B";
  const tacanPrvi = stanje === 0 || stanje === 3;
  tacan.key = tacanKljuc;
  tacan.ok = true;
  netacan.key = tacanKljuc === "A" ? "B" : "A";
  netacan.ok = false;
  return {
    pitalica: p.pitalica,
    opcije: tacanPrvi ? [tacan, netacan] : [netacan, tacan],
    analizaPitalice: p.analizaPitalice,
  };
}

let indeks = 0;
const vidjeno = new Set();
for (const [ti, tema] of kurs.teme.entries()) {
  for (const korak of tema.steps) {
    const kljuc = `${ti + 1}:${korak.naslov}`;
    vidjeno.add(kljuc);
    const extra = druge[kljuc];
    if (!extra?.length) throw new Error(`nema druge pitalice: ${kljuc}`);
    if (!korak.pitalica || !Array.isArray(korak.opcije)) throw new Error(`nema prvu: ${kljuc}`);
    korak.pitalice = [
      {
        pitalica: korak.pitalica,
        opcije: korak.opcije,
        analizaPitalice: korak.analizaPitalice || "",
      },
      ...extra.map((p) => izmesaj(p, indeks++)),
    ];
  }
}
const visak = Object.keys(druge).filter((k) => !vidjeno.has(k));
if (visak.length) throw new Error(`višak: ${visak.join(", ")}`);

fs.writeFileSync(new URL("../site/kurs.json", import.meta.url), `${JSON.stringify(kurs, null, 2)}\n`);
console.log(`upisano ${indeks} dodatnih pitalica na ${vidjeno.size} koraka`);
