import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import {
  VRSTE_DISKUSIJE,
  VRSTE_SEKCIJE,
  blokoviKoraka,
  diskusijaKoraka,
  dodajSekciju,
  nasledjeniBlokovi,
  obrisiSekciju,
  pomeriSekciju,
  promeniVrstuSekcije,
  spustiSekciju,
  ubaciSekciju,
  uskladiDiskusiju,
  uskladiNasledjenaPolja,
} from "../site/js/blokovi-lekcije.js";
import { listaPitalica } from "../site/js/lectures.js";
import { proveriSemu } from "../site/js/sema.js";
import { prazanKurs, praznaTema } from "../site/js/studio.js";

const sema = JSON.parse(fs.readFileSync(new URL("../site/kurs.json.schema", import.meta.url), "utf8"));

test("prva dodata sekcija preuzima tekst, ključnu ideju, kod i dijagram", () => {
  const korak = {
    tekst: "HTTP uvodi granicu.",
    kljucnaIdeja: "HTTP definiše zahtev.",
    samostalniPrimer: { jezik: "text", izolovan: true, tekst: "GET / HTTP/1.1" },
    dijagram: { format: "text", tekst: "Browser --> server" },
  };
  const id = dodajSekciju(korak, VRSTE_SEKCIJE.find((vrsta) => vrsta.natpis === "Kod, crna pozadina"));
  assert.equal(korak.blokovi.length, 5);
  assert.deepEqual(korak.blokovi.map((blok) => blok.vrsta), ["tekst", "highlight", "kod", "dijagram", "kod"]);
  assert.equal(korak.blokovi[1].uloga, "kljucna");
  assert.equal(korak.blokovi[2].pozadina, "bela");
  assert.equal(korak.blokovi[2].veza, "samostalniPrimer");
  assert.equal(korak.blokovi[2].jezik, "text");
  assert.equal(korak.blokovi.at(-1).id, id);
  assert.equal(korak.blokovi.at(-1).pozadina, "crna");
  assert.equal(korak.tekst, "HTTP uvodi granicu.");
  assert.equal(korak.kljucnaIdeja, "HTTP definiše zahtev.");
});

test("izmena vezanog koda i dijagrama ostaje na starim poljima", () => {
  const korak = {
    tekst: "A",
    kljucnaIdeja: "B",
    samostalniPrimer: { jezik: "javascript", izolovan: true, tekst: "const a = 1" },
    dijagram: { format: "text", tekst: "A --> B" },
  };
  korak.blokovi = nasledjeniBlokovi(korak);
  korak.blokovi[0].tekst = "Novi pasus";
  korak.blokovi[1].tekst = "Nova ideja";
  korak.blokovi[2].tekst = "const b = 2";
  korak.blokovi[3].tekst = "A --> C";
  uskladiNasledjenaPolja(korak);
  assert.equal(korak.tekst, "Novi pasus");
  assert.equal(korak.kljucnaIdeja, "Nova ideja");
  assert.equal(korak.samostalniPrimer.tekst, "const b = 2");
  assert.equal(korak.samostalniPrimer.jezik, "javascript");
  assert.equal(korak.dijagram.tekst, "A --> C");
  assert.equal(korak.dijagram.format, "text");
});

test("sekcija se pomera i briše, a highlight nije ključna ideja", () => {
  const korak = { tekst: "A", kljucnaIdeja: "B" };
  dodajSekciju(korak, VRSTE_SEKCIJE.find((vrsta) => vrsta.natpis === "Highlight"));
  const highlight = korak.blokovi.at(-1);
  assert.equal(highlight.uloga, "obicna");
  assert.equal(highlight.naslov, "Napomena");
  assert.equal(pomeriSekciju(korak, highlight.id, 1), -1);
  assert.equal(pomeriSekciju(korak, highlight.id, -1), 1);
  assert.equal(korak.blokovi[1].id, highlight.id);
  assert.equal(korak.kljucnaIdeja, "B");
  obrisiSekciju(korak, korak.blokovi.find((blok) => blok.vrsta === "tekst").id);
  assert.equal(korak.tekst, "");
  assert.equal(korak.blokovi.find((blok) => blok.uloga === "kljucna").tekst, "B");
});

test("prevlačenje, promena tipa i ubacivanje čuvaju tekst", () => {
  const korak = {
    tekst: "Pasus",
    kljucnaIdeja: "Ideja",
    samostalniPrimer: { jezik: "text", izolovan: true, tekst: "GET /" },
  };
  const lista = blokoviKoraka(korak, { prazne: true });
  const kod = VRSTE_SEKCIJE.find((vrsta) => vrsta.natpis === "Kod, crna pozadina");
  const id = ubaciSekciju(korak, lista, "nasledje:tekst", kod, "pre");
  assert.equal(korak.blokovi[0].id, id);
  assert.equal(korak.blokovi[0].pozadina, "crna");
  assert.equal(korak.blokovi[1].tekst, "Pasus");
  assert.equal(spustiSekciju(korak, korak.blokovi, id, "nasledje:kljucna", false), 2);
  assert.equal(korak.blokovi[2].id, id);
  const highlight = VRSTE_SEKCIJE.find((vrsta) => vrsta.natpis === "Highlight");
  promeniVrstuSekcije(korak, korak.blokovi, "nasledje:kod", highlight);
  const pretvoren = korak.blokovi.find((blok) => blok.id === "nasledje:kod");
  assert.equal(pretvoren.vrsta, "highlight");
  assert.equal(pretvoren.uloga, "obicna");
  assert.equal(pretvoren.tekst, "GET /");
  assert.equal(korak.samostalniPrimer.tekst, "GET /");
});

test("šema prima niz sekcija lekcije", () => {
  const dokument = prazanKurs();
  const tema = praznaTema();
  tema.steps[0].blokovi = [
    { id: "t1", vrsta: "tekst", tekst: "Pasus sa **markdown**." },
    { id: "h1", vrsta: "highlight", uloga: "obicna", naslov: "Napomena", tekst: "Vidi granicu." },
    { id: "k1", vrsta: "highlight", uloga: "kljucna", tekst: "Jedna misao." },
    { id: "c1", vrsta: "kod", pozadina: "crna", naslov: "Kod", jezik: "javascript", tekst: "const a = 1" },
    { id: "c2", vrsta: "kod", pozadina: "bela", naslov: "Kod", jezik: "text", tekst: "GET /" },
    { id: "d1", vrsta: "dijagram", naslov: "Dijagram", tekst: "A --> B" },
  ];
  dokument.teme = [tema];
  dokument.trajanjeTema = 1;
  assert.deepEqual(proveriSemu(sema, dokument).greske, []);
});

test("diskusija se sklapa iz priče i oba oblika pitanja", () => {
  const izbor = [
    { key: "A", text: "Ne", ok: false, why: "zato" },
    { key: "B", text: "Da", ok: true, why: "jer" },
  ];
  const korak = {
    naslov: "Korak",
    prica: "Priča koraka.",
    pitalica: "Prvo?",
    opcije: izbor,
    analizaPitalice: "Razlog.",
    pitalice: [
      { pitalica: "Prvo?", opcije: izbor, analizaPitalice: "Razlog." },
      { pitalica: "Drugo?", odgovor: "Tekst odgovora." },
    ],
  };
  const blokovi = diskusijaKoraka(korak);
  assert.deepEqual(
    blokovi.map((blok) => [blok.vrsta, blok.oblik || blok.veza]),
    [
      ["tekst", "prica"],
      ["pitanje", "izbor"],
      ["pitanje", "tekst"],
    ]
  );
  assert.equal(blokovi[2].odgovor, "Tekst odgovora.");
  assert.equal(blokovi[1].analiza, "Razlog.");
  assert.notEqual(blokovi[1].opcije, izbor);

  const kod = VRSTE_DISKUSIJE.find((vrsta) => vrsta.natpis === "Kod, bela pozadina");
  const id = ubaciSekciju(korak, blokovi, blokovi[1].id, kod, "posle", "diskusija");
  assert.equal(korak.diskusija.find((blok) => blok.id === id).vrsta, "kod");
  assert.deepEqual(korak.pitalice.map((pitanje) => pitanje.pitalica), ["Prvo?", "Drugo?"]);
  assert.equal(korak.prica, "Priča koraka.");
  assert.equal(korak.pitalica, "Prvo?");
  assert.equal(korak.opcije[1].ok, true);

  const tekst = VRSTE_DISKUSIJE.find((vrsta) => vrsta.natpis === "Pitanje, tekst");
  promeniVrstuSekcije(korak, korak.diskusija, blokovi[1].id, tekst, "diskusija");
  const pretvoreno = korak.diskusija.find((blok) => blok.id === blokovi[1].id);
  assert.equal(pretvoreno.oblik, "tekst");
  assert.equal(pretvoreno.tekst, "Prvo?");
  assert.equal(pretvoreno.analiza, "Razlog.");
  assert.equal(korak.opcije, undefined);
  assert.equal(korak.analizaPitalice, "Razlog.");

  obrisiSekciju(korak, "nasledje:prica", "diskusija");
  assert.equal(korak.prica, undefined);
  uskladiDiskusiju(korak);
  assert.equal(listaPitalica(korak).map((pitanje) => pitanje.pitalica).join("|"), "Prvo?|Drugo?");

  const dokument = prazanKurs();
  const tema = praznaTema();
  tema.steps[0] = korak;
  dokument.teme = [tema];
  dokument.trajanjeTema = 1;
  assert.deepEqual(proveriSemu(sema, dokument).greske, []);
});
