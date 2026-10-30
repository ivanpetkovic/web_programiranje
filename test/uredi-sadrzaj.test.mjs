import assert from "node:assert/strict";
import test from "node:test";
import {
  imaParametarUredjivanja,
  napraviIstoriju,
  postaviIsecakKoraka,
  primeniSnapshot,
} from "../site/js/uredi-sadrzaj.js";

test("edit=true uključuje režim uređivanja", () => {
  assert.equal(imaParametarUredjivanja("?edit=true"), true);
  assert.equal(imaParametarUredjivanja("?edit=false"), false);
  assert.equal(imaParametarUredjivanja(""), false);
});

test("istorija opoziva i ponavlja izmenu dokumenta", () => {
  const dokument = { naslov: "A", teme: [{ naslov: "N1", steps: [{ naslov: "k1" }] }] };
  const istorija = napraviIstoriju(dokument);
  istorija.zabeleziPre();
  dokument.naslov = "B";
  assert.equal(dokument.naslov, "B");
  assert.equal(istorija.korakUnazad(dokument), true);
  assert.equal(dokument.naslov, "A");
  assert.equal(istorija.korakNapred(dokument), true);
  assert.equal(dokument.naslov, "B");
});

test("primeniSnapshot zamenjuje ceo kurs", () => {
  const dokument = { naslov: "Staro", teme: [] };
  primeniSnapshot(dokument, JSON.stringify({ naslov: "Novo", teme: [{ steps: [] }] }));
  assert.equal(dokument.naslov, "Novo");
  assert.equal(dokument.teme.length, 1);
});

test("postaviIsecakKoraka usklađuje delic i original", () => {
  const korak = { isecak: "a", delic: "b", original: "c\n" };
  postaviIsecakKoraka(korak, "novo");
  assert.equal(korak.isecak, "novo");
  assert.equal(korak.delic, "novo");
  assert.equal(korak.original, "novo\n");
});
