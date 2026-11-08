import assert from "node:assert/strict";
import test from "node:test";
import { blokIzMd, Dijagram, Highlight, Kod, Mermaid, Pitanje, Tekst } from "../site/js/blokovi/index.js";

function krug(klasa, podaci) {
  const markdown = new klasa(podaci).izvoz();
  const uvoz = klasa.uvoz(markdown);
  assert.equal(uvoz.izvoz(), markdown);
  return uvoz.podaci;
}

test("svaka vrsta bloka uvozi sopstveni markdown", () => {
  assert.deepEqual(krug(Tekst, { vrsta: "tekst", tekst: "Browser šalje **zahtev**.\n\n- prvo" }), {
    vrsta: "tekst",
    tekst: "Browser šalje **zahtev**.\n\n- prvo",
  });
  assert.deepEqual(krug(Highlight, { vrsta: "highlight", uloga: "kljucna", tekst: "HTTP je razmena." }), {
    vrsta: "highlight",
    uloga: "kljucna",
    tekst: "HTTP je razmena.",
  });
  assert.deepEqual(krug(Highlight, { vrsta: "highlight", uloga: "obicna", naslov: "Napomena", tekst: "Pogledaj granicu." }), {
    vrsta: "highlight",
    uloga: "obicna",
    naslov: "Napomena",
    tekst: "Pogledaj granicu.",
  });
  assert.deepEqual(krug(Kod, { vrsta: "kod", naslov: "Zahtev", jezik: "text", tekst: "GET / HTTP/1.1\n```\nHost: localhost" }), {
    vrsta: "kod",
    naslov: "Zahtev",
    jezik: "text",
    tekst: "GET / HTTP/1.1\n```\nHost: localhost",
  });
  assert.equal(new Kod({ vrsta: "kod", naslov: "Mali eksperiment", jezik: "text", tekst: "GET /" }).izvoz().includes("Mali eksperiment"), false);
  assert.deepEqual(krug(Mermaid, { vrsta: "mermaid", naslov: "Dijagram", tekst: "flowchart LR\n  Browser --> Server" }), {
    vrsta: "mermaid",
    naslov: "Dijagram",
    tekst: "flowchart LR\n  Browser --> Server",
  });
  assert.deepEqual(krug(Dijagram, { vrsta: "dijagram", naslov: "Tekstualni dijagram", tekst: "A --> B" }), {
    vrsta: "dijagram",
    naslov: "Tekstualni dijagram",
    tekst: "A --> B",
  });
  const izbor = {
    vrsta: "pitanje",
    oblik: "izbor",
    tekst: "Ko šalje zahtev?",
    opcije: [
      { key: "A", text: "Server", ok: false, why: "Server odgovara." },
      { key: "B", text: "Browser", ok: true, why: "Browser otvara vezu." },
    ],
    analiza: "Zahtev kreće od klijenta.",
  };
  assert.deepEqual(krug(Pitanje, izbor), izbor);
  assert.match(new Pitanje(izbor).izvoz(), /- B\. Browser ✓/);
  const tekst = {
    vrsta: "pitanje",
    oblik: "tekst",
    tekst: "Zašto paket?",
    odgovor: "Da veza ne stoji prazna.",
    analiza: "Pauza u razgovoru.",
  };
  assert.deepEqual(krug(Pitanje, tekst), tekst);
});

test("blok iz markdowna bira klasu po obliku", () => {
  assert.equal(blokIzMd("**Pitanje**\n\nKo?\n\n- A. Ne\n- B. Da ✓").constructor.vrsta, "pitanje");
  assert.equal(blokIzMd("> **Ključna ideja**\n>\n> Jedna rečenica.").podaci.uloga, "kljucna");
  assert.equal(blokIzMd("```mermaid\nflowchart LR\n  A --> B\n```").constructor.vrsta, "mermaid");
  assert.equal(blokIzMd("**Tekstualni dijagram**\n\n```text\nA --> B\n```").constructor.vrsta, "dijagram");
  assert.equal(blokIzMd("```javascript\nconst a = 1;\n```").podaci.jezik, "javascript");
  assert.equal(blokIzMd("Običan pasus.").constructor.vrsta, "tekst");
});
