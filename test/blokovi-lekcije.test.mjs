import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import {
  VRSTE_DISKUSIJE,
  VRSTE_SEKCIJE,
  blokFajla,
  blokoviKoraka,
  diskusijaKoraka,
  dodajSekciju,
  materijalizuj,
  naslovKoda,
  natpisSekcije,
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
  const id = dodajSekciju(korak, VRSTE_SEKCIJE.find((vrsta) => vrsta.natpis === "Kod"));
  assert.equal(korak.blokovi.length, 5);
  assert.deepEqual(korak.blokovi.map((blok) => blok.vrsta), ["tekst", "highlight", "kod", "dijagram", "kod"]);
  assert.equal(korak.blokovi[1].uloga, "kljucna");
  assert.equal(korak.blokovi[2].pozadina, undefined);
  assert.equal(korak.blokovi[2].veza, "samostalniPrimer");
  assert.equal(korak.blokovi[2].jezik, "text");
  assert.equal(korak.blokovi[2].naslov, undefined);
  assert.equal(naslovKoda(korak.blokovi[2]), "");
  assert.equal(korak.blokovi.at(-1).id, id);
  assert.equal(korak.blokovi.at(-1).pozadina, undefined);
  assert.equal(korak.blokovi.at(-1).naslov, undefined);
  assert.equal(natpisSekcije(korak.blokovi.at(-1)), "Kod");
  assert.equal(naslovKoda({ vrsta: "kod", naslov: "Mali eksperiment" }), "");
  assert.equal(naslovKoda({ vrsta: "kod", naslov: "Zahtev" }), "Zahtev");
  assert.equal(natpisSekcije({ vrsta: "kod", naslov: "Zahtev" }), "Zahtev");
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
  const kod = VRSTE_SEKCIJE.find((vrsta) => vrsta.natpis === "Kod");
  const id = ubaciSekciju(korak, lista, "nasledje:tekst", kod, "pre");
  assert.equal(korak.blokovi[0].id, id);
  assert.equal(korak.blokovi[0].pozadina, undefined);
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

test("doprinos fajla je sekcija koda i prati delic", () => {
  const korak = {
    naslov: "Izvršavanje",
    putanja: "client/lekcije/01-izvrsavanje.js",
    isecakJezik: "javascript",
    delic: "// Izrazi\n2 + 3\n",
    original: "ne diraj\n",
    blokovi: [
      { id: "t", vrsta: "tekst", tekst: "Uvod" },
      { id: "c", vrsta: "kod", naslov: "Izrazi", jezik: "javascript", tekst: "2 + 3" },
    ],
  };
  const lista = blokoviKoraka(korak);
  const fajl = lista.at(-1);
  assert.equal(fajl.veza, "fajl");
  assert.equal(fajl.vrsta, "kod");
  assert.equal(fajl.naslov, "01-izvrsavanje.js");
  assert.equal(fajl.jezik, "javascript");
  assert.equal(fajl.tekst, "// Izrazi\n2 + 3\n");
  assert.equal(korak.blokovi.some((blok) => blok.veza === "fajl"), false);
  assert.equal(blokoviKoraka(korak).filter((blok) => blok.veza === "fajl").length, 1);
  materijalizuj(korak, lista);
  assert.equal(blokFajla({ putanja: "client/a.js", isecak: "x", delic: "x", isecakJezik: "javascript" }).naslov, "a.js");
  const crtez = {
    putanja: "client/a.js",
    delic: "// x\n",
    isecakJezik: "javascript",
    blokovi: [{ id: "t", vrsta: "tekst", tekst: "A" }],
  };
  assert.equal(blokoviKoraka(crtez, { figura: true }).some((blok) => blok.veza === "fajl"), false);
  assert.equal(blokoviKoraka(crtez).at(-1).naslov, "a.js");
  fajl.tekst = "console.log(1);\n";
  uskladiNasledjenaPolja(korak);
  assert.equal(korak.delic, "console.log(1);\n");
  assert.equal(korak.isecak, undefined);
  assert.equal(korak.original, "ne diraj\n");
  obrisiSekciju(korak, "fajl");
  assert.equal(korak.delic, "");
  assert.equal(blokoviKoraka(korak).some((blok) => blok.veza === "fajl"), false);
  const dokument = prazanKurs();
  const tema = praznaTema();
  tema.steps[0].blokovi = [{ id: "fajl", vrsta: "kod", naslov: "a.js", jezik: "javascript", veza: "fajl", tekst: "1" }];
  dokument.teme = [tema];
  dokument.trajanjeTema = 1;
  assert.deepEqual(proveriSemu(sema, dokument).greske, []);
});

test("meni ima jedan blok koda, bez tamne i svetle verzije", () => {
  const kod = VRSTE_SEKCIJE.filter((vrsta) => vrsta.vrsta === "kod");
  assert.equal(kod.length, 1);
  assert.equal(kod[0].natpis, "Kod");
  assert.equal("pozadina" in kod[0].polja, false);
  const main = fs.readFileSync(new URL("../site/js/main.js", import.meta.url), "utf8");
  const css = fs.readFileSync(new URL("../site/css/site.css", import.meta.url), "utf8");
  const html = fs.readFileSync(new URL("../site/index.html", import.meta.url), "utf8");
  assert.equal(main.includes("isecak-crna"), false);
  assert.equal(main.includes("isecak-bela"), false);
  assert.match(main, /postaviPodesavanje\(stanje, "pozadinaKoda", sledeca\)/);
  assert.match(css, /html\[data-pozadina-koda="crna"\]/);
  assert.equal(css.includes(".isecak-crna"), false);
  assert.match(html, /dataset\.pozadinaKoda = pozadinaKoda === "crna" \? "crna" : "bela"/);
});

test("crtež koraka je dijagram blok u gradivu", () => {
  const korak = {
    naslov: "Hipertekst",
    tekst: "URL određuje adresu.",
    kljucnaIdeja: "",
    figura: {
      vrsta: "put",
      cvorovi: [
        { id: "tekst", natpis: "Tekst" },
        { id: "veza", natpis: "Veza" },
        { id: "drugi", natpis: "Drugi tekst" },
      ],
    },
  };
  const lista = blokoviKoraka(korak);
  const dijagram = lista.at(-1);
  assert.equal(dijagram.vrsta, "mermaid");
  assert.equal(dijagram.veza, "figura");
  assert.equal(dijagram.naslov, "Dijagram");
  assert.match(dijagram.tekst, /"Tekst"/);
  assert.match(dijagram.tekst, /"Veza"/);
  assert.match(dijagram.tekst, /"Drugi tekst"/);
  assert.equal(lista.filter((blok) => blok.veza === "figura").length, 1);
  assert.equal(lista.some((blok) => blok.veza === "fajl"), false);
  const saBlokovima = {
    ...korak,
    blokovi: [{ id: "t", vrsta: "tekst", tekst: "Već sekcija." }],
  };
  const ublokovima = blokoviKoraka(saBlokovima);
  assert.equal(ublokovima.at(-1).veza, "figura");
  assert.equal(ublokovima.filter((blok) => blok.vrsta === "mermaid").length, 1);
  materijalizuj(saBlokovima, ublokovima);
  assert.equal(saBlokovima.blokovi.at(-1).id, "figura");
  const kod = VRSTE_SEKCIJE.find((vrsta) => vrsta.natpis === "Kod");
  promeniVrstuSekcije(saBlokovima, saBlokovima.blokovi, "figura", kod);
  assert.equal(saBlokovima.figura, undefined);
  assert.equal(blokoviKoraka(saBlokovima).some((blok) => blok.veza === "figura"), false);
  const ponovo = {
    tekst: "A",
    figura: { vrsta: "put", cvorovi: [{ id: "a", natpis: "A" }, { id: "b", natpis: "B" }] },
  };
  const prikaz = blokoviKoraka(ponovo, { prazne: true });
  materijalizuj(ponovo, prikaz);
  obrisiSekciju(ponovo, "figura");
  assert.equal(ponovo.figura, undefined);
  assert.equal(blokoviKoraka(ponovo).some((blok) => blok.veza === "figura"), false);
  const dokument = prazanKurs();
  const tema = praznaTema();
  tema.steps[0].blokovi = [{ id: "figura", vrsta: "mermaid", naslov: "Dijagram", veza: "figura", tekst: "flowchart LR\n  A-->B" }];
  tema.steps[0].figura = { vrsta: "put", cvorovi: [{ id: "a", natpis: "A" }] };
  dokument.teme = [tema];
  dokument.trajanjeTema = 1;
  assert.deepEqual(proveriSemu(sema, dokument).greske, []);
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

  const kod = VRSTE_DISKUSIJE.find((vrsta) => vrsta.natpis === "Kod");
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
