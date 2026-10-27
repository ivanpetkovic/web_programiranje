import assert from "node:assert/strict";
import test from "node:test";
import { imaParametarUredjivanja, postaviIsecakKoraka } from "../site/js/uredi-sadrzaj.js";

test("edit=true uključuje režim uređivanja", () => {
  assert.equal(imaParametarUredjivanja("?edit=true"), true);
  assert.equal(imaParametarUredjivanja("?edit=false"), false);
  assert.equal(imaParametarUredjivanja(""), false);
});

test("postaviIsecakKoraka usklađuje delic i original", () => {
  const korak = { isecak: "a", delic: "b", original: "c\n" };
  postaviIsecakKoraka(korak, "novo");
  assert.equal(korak.isecak, "novo");
  assert.equal(korak.delic, "novo");
  assert.equal(korak.original, "novo\n");
});
