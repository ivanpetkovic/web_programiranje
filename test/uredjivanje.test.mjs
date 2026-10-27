import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { dokument } from "../site/js/lectures.js";
import { editMod, izvorUgradjenog, objasnjenjaKoraka, smisaoKljucne } from "../site/js/uredjivanje.js";

const main = fs.readFileSync(new URL("../site/js/main.js", import.meta.url), "utf8");

function korakPoNaslovu(naslov) {
  for (let i = 0; i < dokument.nedelje.length; i += 1) {
    const korak = dokument.nedelje[i].steps.find((stavka) => stavka.naslov === naslov);
    if (korak) return { indeks: i, korak };
  }
  return null;
}

test("edit mod je samo query edit=true", () => {
  assert.equal(editMod("?edit=true"), true);
  assert.equal(editMod("edit=true"), true);
  assert.equal(editMod("?edit=false"), false);
  assert.equal(editMod("?tema=edit"), false);
  assert.equal(editMod(""), false);
});

test("HTTP kao dogovor otvara objašnjenje iz kasnije nedelje", () => {
  const korak = dokument.nedelje[0].steps.find((stavka) => stavka.naslov === "HTTP kao dogovor");
  const lista = objasnjenjaKoraka(dokument, 0, korak);
  const http = lista.find((pojam) => /HTTP/.test(pojam.ime));
  assert.ok(http);
  assert.match(http.telo, /status/);
  assert.equal(lista.some((pojam) => pojam.ime === "XML"), false);
});

test("korak HTTP drži objašnjenje svoje nedelje", () => {
  const nadjen = korakPoNaslovu("HTTP");
  const lista = objasnjenjaKoraka(dokument, nadjen.indeks, nadjen.korak);
  const http = lista.find((pojam) => pojam.id === "http");
  assert.match(http.telo, /metod/);
  assert.match(http.kod, /GET/);
});

test("korak bez pojma nema knjigu", () => {
  const korak = dokument.nedelje[0].steps.find((stavka) => stavka.naslov === "LO");
  assert.deepEqual(objasnjenjaKoraka(dokument, 0, korak), []);
});

test("kratka ključna ideja dobija smisao tačnog odgovora", () => {
  const korak = dokument.nedelje.flatMap((nedelja) => nedelja.steps).find((stavka) => stavka.naslov === "const");
  const smisao = smisaoKljucne(korak);
  assert.match(smisao.recenica, /const ne zamrzava/);
  assert.match(smisao.dopuna, /temperatura/);
  assert.equal(smisao.dopuna.includes("Proveriti posledicu"), false);
});

test("posebna analiza ostaje uz ključnu ideju", () => {
  const korak = dokument.nedelje[0].steps.find((stavka) => stavka.naslov === "HTTP kao dogovor");
  const smisao = smisaoKljucne(korak);
  assert.match(smisao.recenica, /HTTP definiše zahtev/);
  assert.match(smisao.dopuna, /browser/);
});

test("šablon analize se ne prepisuje u ključnu ideju", () => {
  const smisao = smisaoKljucne({
    kljucnaIdeja: "Ideja stoji.",
    tekst: "Isti tekst.",
    analiza: "Zašto: Ideja stoji. U ovom koraku: Isti tekst. Proveriti posledicu na konkretnom primeru.",
    opcije: [{ ok: true, why: "Ta pretpostavka zanemaruje ključnu razliku." }],
  });
  assert.equal(smisao.recenica, "Ideja stoji.");
  assert.equal(smisao.dopuna, "");
});

test("prazna ključna ideja uzima prvu rečenicu lekcije", () => {
  const smisao = smisaoKljucne({ kljucnaIdeja: "", tekst: "Prva rečenica. Druga ostaje.", opcije: [] });
  assert.equal(smisao.recenica, "Prva rečenica.");
  assert.equal(smisao.dopuna, "");
});

test("ugrađeni kod bira polje koje čas pokazuje", () => {
  assert.deepEqual(izvorUgradjenog({ ugradjen: true, original: "ceo", isecak: "deo" }, "fajl"), { polje: "original", tekst: "ceo" });
  assert.deepEqual(izvorUgradjenog({ isecak: "GET / HTTP/1.1" }, "http"), { polje: "isecak", tekst: "GET / HTTP/1.1" });
  assert.deepEqual(izvorUgradjenog({ samostalniPrimer: { tekst: "1+1" } }, "eksperiment"), { polje: "samostalniPrimer", tekst: "1+1" });
  assert.deepEqual(izvorUgradjenog({ isecak: "const a = 1;" }, "fajl"), { polje: "isecak", tekst: "const a = 1;" });
});

test("čas crta olovku, knjigu i dugmad odgovora samo u edit modu", () => {
  assert.match(main, /editMod\(location\.search\)/);
  assert.match(main, /saIkonom\(naslovKnjige, "book-open", "Objašnjenje"\)/);
  assert.match(main, /Uredi lekciju/);
  assert.match(main, /Uredi pitalicu/);
  assert.match(main, /Uredi diskusiju/);
  assert.match(main, /Uredi ugrađeni kod/);
  assert.match(main, /Dodaj odgovor/);
  assert.match(main, /Ukloni odgovor/);
  assert.match(main, /if \(!uEditModu\) return null/);
});
