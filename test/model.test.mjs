import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { natpisTeme, pomeriTemu, polozajiKlizaca, procenat, ucitajKurs } from "../site/js/model.js";
import { dokument, lectures } from "../site/js/lectures.js";

test("neusaglašeno trajanje ne vraća spisak", () => {
  const rezultat = ucitajKurs({ trajanjeTema: 4, teme: [{ naslov: "A" }, { naslov: "B" }] });
  assert.equal(rezultat.ok, false);
  assert.equal(rezultat.teme, null);
  assert.match(rezultat.greska, /Trajanje/);
});

test("tema 10 od 15 ima natpis, 67 i jedan broj na klizaču", () => {
  const teme = Array.from({ length: 15 }, (_, i) => ({ naslov: `N${i + 1}`, steps: [{}] }));
  const kurs = { trajanjeTema: 15, teme };
  const ucitan = ucitajKurs(kurs);
  assert.equal(ucitan.ok, true);
  assert.equal(ucitan.teme.length, 15);
  assert.equal(natpisTeme(kurs, 10), "Tema 10 od 15");
  assert.equal(procenat(10, 15), 67);
  const polozaji = polozajiKlizaca(kurs, 10);
  assert.equal(polozaji.length, 15);
  assert.deepEqual(polozaji.filter((polozaj) => polozaj.broj).map((polozaj) => polozaj.broj), ["10"]);
  assert.equal(pomeriTemu(10, 1, 15), 11);
});

test("kurs od tri teme ima tri položaja", () => {
  const kurs = { trajanjeTema: 3, teme: [{}, {}, {}] };
  assert.equal(ucitajKurs(kurs).ok, true);
  assert.equal(polozajiKlizaca(kurs, 2).length, 3);
  assert.deepEqual(polozajiKlizaca(kurs, 2).filter((polozaj) => polozaj.broj).map((polozaj) => polozaj.n), [2]);
  assert.equal(natpisTeme(kurs, 2), "Tema 2 od 3");
  assert.equal(procenat(1, 10), 10);
});

test("adapter čita dokument i ne drži naslove", () => {
  const izvor = fs.readFileSync(new URL("../site/js/lectures.js", import.meta.url), "utf8");
  assert.equal(izvor.includes("Šta browser prikazuje"), false);
  assert.equal(izvor.includes("JavaScript opisuje stanje"), false);
  assert.equal(dokument.naslov, "Web programiranje");
  assert.equal(dokument.slika, "assets/kurs.png");
  const znak = fs.readFileSync(new URL("../kursevi/web_programiranje/assets/kurs.png", import.meta.url));
  assert.equal(znak.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
  assert.equal(fs.existsSync(new URL("../kursevi/web_programiranje/assets/elfak_logo.png", import.meta.url)), true);
  assert.equal(dokument.ustanova, "Elektronski fakultet");
  assert.equal(dokument.ustanovaRed, "Univerzitet u Nišu");
  assert.equal(dokument.grb, "assets/elfak_logo.png");
  assert.equal(dokument.uvod.slika, "/icons/uvod.svg");
  assert.equal(dokument.uvod.ikona, undefined);
  const uvodSvg = fs.readFileSync(new URL("../site/icons/uvod.svg", import.meta.url), "utf8");
  assert.match(uvodSvg, /viewBox="0 0 64 64"/);
  assert.match(uvodSvg, /aria-label="Uvod"/);
  const znakovi = [
    ["/icons/tema-01.png", "Zašto Web postoji: zahtevi i protokoli"],
    ["/icons/tema-02.png", "Browser: HTML, CSS i prikaz"],
    ["/icons/tema-03.png", "JavaScript: vrednosti, objekti i funkcije"],
    ["/icons/tema-04.png", "JavaScript: leksičko okruženje, prototip i modul"],
    ["/icons/tema-05.png", "DOM, događaji i prikaz stanja"],
    ["/icons/tema-06.png", "Node.js, HTTP server i Web API"],
    ["/icons/tema-07.png", "Asinhronost, event loop i neuspeh"],
    ["/icons/tema-08.png", "API komande, validacija i idempotentnost"],
    ["/icons/tema-09.png", "PostgreSQL, transakcije i Docker"],
    ["/icons/tema-10.png", "Svežina podataka, periodično čitanje i push"],
    ["/icons/tema-11.svg", "Bezbednost, sesije i prava pristupa"],
    ["/icons/tema-12.svg", "Ceo sistem, dijagnostika i LLM"],
  ];
  dokument.teme.forEach((tema, i) => {
    const [slika, naslov] = znakovi[i];
    assert.equal(tema.naslov, naslov);
    assert.equal(tema.slika, slika, tema.naslov);
    assert.equal(tema.ikona, undefined, tema.naslov);
    const fajl = fs.readFileSync(new URL(`../site${slika}`, import.meta.url));
    if (slika.endsWith(".png")) {
      assert.equal(fajl.subarray(0, 8).toString("hex"), "89504e470d0a1a0a", slika);
      assert.equal(fajl.readUInt32BE(16), 256, slika);
      assert.equal(fajl.readUInt32BE(20), 256, slika);
    } else {
      const tekst = fajl.toString("utf8");
      assert.match(tekst, /viewBox="0 0 64 64"/, slika);
      assert.match(tekst, new RegExp(`aria-label="${naslov.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`), slika);
      assert.equal(tekst.includes("<script"), false, slika);
    }
  });
  assert.equal(lectures[1].slika, "/icons/tema-02.png");
  assert.equal(lectures[0].slika, "/icons/tema-01.png");
  assert.equal(lectures[0].ikona, "");
  assert.equal(dokument.trajanjeTema, 12);
  assert.equal(lectures.length, 12);
  assert.equal(lectures[0].title, "Zašto Web postoji: zahtevi i protokoli");
  assert.equal(lectures[1].title, "Browser: HTML, CSS i prikaz");
  assert.equal(lectures[0].steps[0].nivo, "Osnovno");
  assert.equal(lectures[0].minuta, 90);
  assert.ok(lectures[0].steps[0].minuta > 0);
});
