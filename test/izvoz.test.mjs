import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { VRSTE_SEKCIJE, dodajSekciju } from "../site/js/blokovi-lekcije.js";
import {
  htmlKoraka,
  htmlTeme,
  imeIzvoza,
  izvorMermaida,
  markdownJeIspravan,
  markdownKoraka,
  markdownTeme,
} from "../site/js/izvoz.js";
import { proveriSemu } from "../site/js/sema.js";
import { prazanKurs, praznaTema } from "../site/js/studio.js";

const sema = JSON.parse(fs.readFileSync(new URL("../site/kurs.json.schema", import.meta.url), "utf8"));

test("novi dijagram je mermaid blok sa početnim izvorom", () => {
  const korak = { naslov: "Korak", tekst: "Uvod.", kljucnaIdeja: "" };
  const vrsta = VRSTE_SEKCIJE.find((stavka) => stavka.natpis === "Dijagram");
  assert.equal(vrsta.vrsta, "mermaid");
  dodajSekciju(korak, vrsta);
  const blok = korak.blokovi.at(-1);
  assert.equal(blok.vrsta, "mermaid");
  assert.match(blok.tekst, /^flowchart LR/);
  assert.equal(izvorMermaida("```mermaid\nflowchart LR\n  A-->B\n```"), "flowchart LR\n  A-->B");
});

test("korak od blokova je ispravan markdown, a dijagram je mermaid ograda", () => {
  const korak = {
    naslov: "Zahtev i odgovor",
    blokovi: [
      { id: "t", vrsta: "tekst", tekst: "Browser šalje **zahtev**.\n\n- prvo\n- drugo" },
      { id: "k", vrsta: "highlight", uloga: "kljucna", tekst: "HTTP je razmena." },
      { id: "h", vrsta: "highlight", uloga: "obicna", naslov: "Napomena", tekst: "Pogledaj granicu." },
      { id: "c", vrsta: "kod", naslov: "Zahtev", jezik: "text", tekst: "GET / HTTP/1.1\n```\nHost: localhost" },
      { id: "m", vrsta: "mermaid", naslov: "Dijagram", tekst: "flowchart LR\n  Browser --> Server" },
      { id: "d", vrsta: "dijagram", naslov: "Tekstualni dijagram", tekst: "A --> B" },
    ],
    diskusija: [
      { id: "p", vrsta: "tekst", veza: "prica", tekst: "Priča koraka." },
      {
        id: "q",
        vrsta: "pitanje",
        oblik: "izbor",
        tekst: "Ko šalje zahtev?",
        opcije: [
          { key: "A", text: "Server", ok: false, why: "Server odgovara." },
          { key: "B", text: "Browser", ok: true, why: "Browser otvara vezu." },
        ],
        analiza: "Zahtev kreće od klijenta.",
      },
    ],
  };
  const md = markdownKoraka(korak);
  assert.equal(markdownJeIspravan(md), true);
  assert.match(md, /^# Zahtev i odgovor\n/);
  assert.match(md, /## Gradivo/);
  assert.match(md, /## Diskusija/);
  assert.match(md, /\*\*Ključna ideja\*\*/);
  assert.match(md, /````text\nGET \/ HTTP\/1\.1\n```\nHost: localhost\n````/);
  assert.match(md, /```mermaid\nflowchart LR\n  Browser --> Server\n```/);
  assert.match(md, /- B\. Browser ✓/);
  assert.match(md, /Priča koraka\./);
  const html = htmlKoraka(korak);
  assert.match(html, /<h1>Zahtev i odgovor<\/h1>/);
  assert.match(html, /<div class="figura-mermaid">flowchart LR\n  Browser --&gt; Server<\/div>/);
  assert.equal(html.includes("<script>alert"), false);
  assert.match(html, /src="\/vendor\/mermaid\/mermaid\.js"/);
});

test("kod bez naslova ne nosi natpis Mali eksperiment", () => {
  const korak = {
    naslov: "Korak",
    blokovi: [{ id: "c", vrsta: "kod", naslov: "Mali eksperiment", jezik: "text", tekst: "GET /" }],
  };
  const md = markdownKoraka(korak);
  assert.equal(md.includes("Mali eksperiment"), false);
  assert.match(md, /```text\nGET \/\n```/);
  assert.equal(htmlKoraka(korak).includes("Mali eksperiment"), false);
  const saNaslovom = markdownKoraka({
    naslov: "Korak",
    blokovi: [{ id: "c", vrsta: "kod", naslov: "Zahtev", jezik: "text", tekst: "GET /" }],
  });
  assert.match(saNaslovom, /\*\*Zahtev\*\*/);
});

test("nezatvorena ograda u tekstu ne lomi markdown fajl", () => {
  const korak = {
    naslov: "Korak",
    blokovi: [{ id: "t", vrsta: "tekst", tekst: "Tekst.\n```mermaid\nA-->B" }],
  };
  const md = markdownKoraka(korak);
  assert.equal(markdownJeIspravan(md), true);
  assert.match(md, /\\`/);
});

test("pdf html ne šalje spremnost na nevažeće poreklo srcdoc okvira", () => {
  const html = htmlTeme({ naslov: "Veza", steps: [] });
  assert.equal(html.includes('postMessage({ izvoz: "spreman" }, location.origin)'), false);
  assert.match(html, /location\.origin !== "null" \? location\.origin : "\*"/);
});

test("tema spaja korake u jedan markdown i pdf html", () => {
  const tema = {
    naslov: "Veza",
    podnaslov: "Od zahteva do odgovora",
    ishod: "Student razlikuje klijenta i server.",
    steps: [
      { naslov: "Prvi", tekst: "Pasus.", kljucnaIdeja: "Jedna misao." },
      {
        naslov: "Drugi",
        blokovi: [{ id: "m", vrsta: "mermaid", naslov: "Dijagram", tekst: "flowchart TD\n  A-->B" }],
      },
    ],
  };
  const md = markdownTeme(tema);
  assert.equal(markdownJeIspravan(md), true);
  assert.match(md, /^# Veza\n/);
  assert.match(md, /## Prvi/);
  assert.match(md, /## Drugi/);
  assert.match(md, /```mermaid\nflowchart TD\n  A-->B\n```/);
  assert.match(md, /\*\*Ishod\.\*\*/);
  const html = htmlTeme(tema);
  assert.match(html, /<h1>Veza<\/h1>/);
  assert.match(html, /<h2>Drugi<\/h2>/);
  assert.match(html, /class="figura-mermaid"/);
  assert.equal(imeIzvoza("Širina kutije", "pdf"), "sirina-kutije.pdf");
  assert.equal(imeIzvoza("Veza", "md"), "veza.md");
});

test("šema prima mermaid sekciju", () => {
  const dokument = prazanKurs();
  const tema = praznaTema();
  tema.steps[0].blokovi = [
    { id: "m", vrsta: "mermaid", naslov: "Dijagram", tekst: "flowchart LR\n  A-->B" },
  ];
  dokument.teme = [tema];
  dokument.trajanjeTema = 1;
  assert.deepEqual(proveriSemu(sema, dokument).greske, []);
});

test("fajl koraka izlazi kao obična ograda, bez posebnog delića", () => {
  const kurs = JSON.parse(fs.readFileSync(new URL("../kursevi/web_programiranje/kurs.json", import.meta.url), "utf8"));
  const korak = kurs.teme[2].steps[0];
  const md = markdownKoraka(korak);
  assert.equal(markdownJeIspravan(md), true);
  assert.match(md, /\*\*01-izvrsavanje\.js\*\*\n\n```javascript\n\/\/ Šta je JavaScript/);
  assert.match(md, /console\.log\(2 \+ 3\);/);
  assert.equal(md.includes("Kopiraj"), false);
  assert.equal(md.toLowerCase().includes("delic"), false);
});

test("postojeći korak kursa ostaje ispravan markdown", () => {
  const kurs = JSON.parse(fs.readFileSync(new URL("../kursevi/web_programiranje/kurs.json", import.meta.url), "utf8"));
  const tema = kurs.teme[0];
  const md = markdownTeme(tema);
  assert.equal(markdownJeIspravan(md), true);
  assert.match(md, /```mermaid|```text|Browser/);
});
