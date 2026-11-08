import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { VRSTE_DISKUSIJE, VRSTE_SEKCIJE, blokoviKoraka, diskusijaKoraka } from "../site/js/blokovi-lekcije.js";
import { markdownKoraka } from "../site/js/izvoz.js";
import { dokument } from "../site/js/lectures.js";

const main = fs.readFileSync(new URL("../site/js/main.js", import.meta.url), "utf8");
const VRSTE_GRADIVA = new Set(VRSTE_SEKCIJE.map((vrsta) => vrsta.vrsta));

function teloRendera() {
  const pocetak = main.indexOf("function renderLecture");
  const kraj = main.indexOf("\nfunction natpisPolja", pocetak);
  return main.slice(pocetak, kraj);
}

test("kolona gradiva crta samo blokove, uz hrom koraka", () => {
  const dodaci = [...teloRendera().matchAll(/casEl\.append\(([\s\S]*?)\);/g)].map((poklapanje) => poklapanje[1].replace(/\s+/g, " ").trim());
  assert.deepEqual(dodaci, [
    "metaKoraka, naslovKoraka, ...sekcije",
    "meniDodajSekciju(lista)",
    "skok",
  ]);
});

test("svaki korak kursa ima gradivo samo od blokova, a pitanje je blok diskusije", () => {
  assert.equal(VRSTE_GRADIVA.has("pitanje"), false);
  assert.ok(VRSTE_DISKUSIJE.some((vrsta) => vrsta.vrsta === "pitanje" && vrsta.polja.oblik === "tekst"));
  assert.ok(VRSTE_DISKUSIJE.some((vrsta) => vrsta.vrsta === "pitanje" && vrsta.polja.oblik === "izbor"));
  for (const tema of dokument.teme) {
    for (const korak of tema.steps) {
      const gde = `${tema.naslov} / ${korak.naslov}`;
      const blokovi = blokoviKoraka(korak);
      assert.ok(blokovi.length > 0, gde);
      for (const blok of blokovi) {
        assert.equal(typeof blok.id, "string", gde);
        assert.ok(blok.id, gde);
        assert.equal(typeof blok.tekst, "string", gde);
        assert.ok(VRSTE_GRADIVA.has(blok.vrsta), `${gde}: ${blok.vrsta}`);
      }
      const md = markdownKoraka(korak);
      for (const blok of blokovi) {
        const prviRed = String(blok.tekst || "").trim().split("\n")[0].slice(0, 48);
        if (!prviRed || blok.vrsta === "mermaid") continue;
        assert.ok(md.includes(prviRed), `${gde} nema u markdownu: ${prviRed}`);
      }
      for (const blok of diskusijaKoraka(korak)) {
        assert.equal(typeof blok.id, "string", gde);
        assert.equal(typeof blok.tekst, "string", gde);
        if (blok.vrsta !== "pitanje") continue;
        assert.ok(blok.oblik === "tekst" || blok.oblik === "izbor", gde);
        if (blok.oblik === "izbor") assert.ok(Array.isArray(blok.opcije) && blok.opcije.length >= 2, gde);
      }
    }
  }
});

test("markdown pitanja nosi oznake po kojima se čita izbor ili tekst", () => {
  const izbor = markdownKoraka({
    naslov: "Izbor",
    diskusija: [{
      id: "q",
      vrsta: "pitanje",
      oblik: "izbor",
      tekst: "Ko šalje zahtev?",
      opcije: [
        { key: "A", text: "Server", ok: false, why: "Server odgovara." },
        { key: "B", text: "Browser", ok: true, why: "Browser otvara vezu." },
      ],
      analiza: "Zahtev kreće od klijenta.",
    }],
  });
  assert.match(izbor, /\*\*Pitanje\*\*\n\nKo šalje zahtev\?/);
  assert.match(izbor, /- A\. Server/);
  assert.match(izbor, /- B\. Browser ✓/);
  assert.match(izbor, /> - \*\*B\.\*\* Browser otvara vezu\./);
  assert.match(izbor, /\*\*Obrazloženje\*\*/);

  const tekst = markdownKoraka({
    naslov: "Tekst",
    diskusija: [{
      id: "q",
      vrsta: "pitanje",
      oblik: "tekst",
      tekst: "Zašto paket?",
      odgovor: "Da veza ne stoji prazna.",
      analiza: "Pauza u razgovoru.",
    }],
  });
  assert.match(tekst, /\*\*Pitanje\*\*\n\nZašto paket\?/);
  assert.match(tekst, /\*\*Odgovor\*\*\n\nDa veza ne stoji prazna\./);
  assert.equal(tekst.includes("✓"), false);
});

test("HTTP i komanda su kod blokovi gradiva", () => {
  const http = dokument.teme.flatMap((tema) => tema.steps).find((korak) => korak.naslov === "HTTP" && korak.isecak?.startsWith("GET "));
  const komanda = dokument.teme.flatMap((tema) => tema.steps).find((korak) => korak.naslov === "Komanda" && korak.isecak?.startsWith("node "));
  const httpBlok = blokoviKoraka(http).find((blok) => blok.veza === "http");
  const komandaBlok = blokoviKoraka(komanda).find((blok) => blok.veza === "komanda");
  assert.equal(httpBlok.vrsta, "kod");
  assert.equal(httpBlok.naslov, "HTTP");
  assert.match(httpBlok.tekst, /^GET /);
  assert.equal(komandaBlok.vrsta, "kod");
  assert.equal(komandaBlok.naslov, "Komanda");
  assert.match(komandaBlok.tekst, /^node /);
  assert.match(markdownKoraka(http), /```text\nGET /);
  assert.match(markdownKoraka(komanda), /```text\nnode /);
});
