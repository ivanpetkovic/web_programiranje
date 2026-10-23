import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { blokoviTeksta, imaMermaid, svgJeBezbedan } from "../site/js/mermaid.js";

const main = fs.readFileSync(new URL("../site/js/main.js", import.meta.url), "utf8");
const strana = fs.readFileSync(new URL("../site/js/studio-strana.js", import.meta.url), "utf8");
const biblioteka = fs.readFileSync(new URL("../site/vendor/mermaid/mermaid.js", import.meta.url), "utf8");

test("običan tekst nema dijagram i ostaje jedan blok", () => {
  const tekst = "Browser šalje zahtev.\nOdgovor stiže kasnije.";
  assert.equal(imaMermaid(tekst), false);
  assert.deepEqual(blokoviTeksta(tekst), [{ vrsta: "tekst", tekst }]);
});

test("ograda mermaid izdvaja izvor, a tekst ostaje sa obe strane", () => {
  const tekst = [
    "Na dijagramu stoje dve adrese.",
    "",
    "```mermaid",
    "flowchart LR",
    "  Lokalna[127.0.0.1] --> Javna",
    "```",
    "",
    "Ceo deployment se ne izvodi.",
  ].join("\n");
  assert.equal(imaMermaid(tekst), true);
  assert.deepEqual(blokoviTeksta(tekst), [
    { vrsta: "tekst", tekst: "Na dijagramu stoje dve adrese." },
    { vrsta: "mermaid", izvor: "flowchart LR\n  Lokalna[127.0.0.1] --> Javna" },
    { vrsta: "tekst", tekst: "Ceo deployment se ne izvodi." },
  ]);
});

test("dva dijagrama, uvlačenje i prazan izvor", () => {
  const tekst = "```Mermaid\nA-->B\n```\nizmeđu\n  ```mermaid\n```";
  assert.deepEqual(blokoviTeksta(tekst), [
    { vrsta: "mermaid", izvor: "A-->B" },
    { vrsta: "tekst", tekst: "između" },
    { vrsta: "mermaid", izvor: "" },
  ]);
});

test("nezatvorena ograda i tuđa ograda ostaju tekst", () => {
  assert.equal(imaMermaid("```html\n<div>\n```"), false);
  const otvoreno = "Rečenica.\n```mermaid\nA-->B";
  assert.equal(imaMermaid(otvoreno), true);
  assert.deepEqual(blokoviTeksta(otvoreno), [
    { vrsta: "tekst", tekst: "Rečenica.\n```mermaid\nA-->B" },
  ]);
});

test("svg iz mermaida ostaje crtež, skripta ne prolazi", () => {
  assert.equal(svgJeBezbedan('<svg xmlns="http://www.w3.org/2000/svg"></svg>'), true);
  assert.equal(svgJeBezbedan('<svg><script>alert(1)</script></svg>'), false);
  assert.equal(svgJeBezbedan('<svg><a href="javascript:alert(1)">x</a></svg>'), false);
  assert.equal(svgJeBezbedan("nema"), false);
});

test("čas i studio crtaju vendored mermaid iz bloka u prozi", () => {
  assert.match(main, /cvoroviProze\(korak\.tekst/);
  assert.match(main, /cvoroviProze\(korak\.kljucnaIdeja/);
  assert.match(main, /nacrtajMermaid\(dijagram, izvor\)/);
  assert.match(main, /osveziMermaid\(\)/);
  assert.match(strana, /poljeSaDijagramom\("Tekst"/);
  assert.match(strana, /poljeSaDijagramom\("Ključna ideja"/);
  assert.match(strana, /```mermaid/);
  assert.match(biblioteka, /globalThis\["mermaid"\]/);
  assert.match(biblioteka, /version:"11\.17\.2"/);
});
