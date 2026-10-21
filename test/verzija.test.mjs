import assert from "node:assert/strict";
import test from "node:test";
import { praznaSesija, primeni } from "../site/js/verzija.js";

const koraci = [
  { putanja: "client/index.html", original: "a\n", ugradjen: true, delic: "a\n" },
  { putanja: "server/soba.js", original: "takt\n", ugradjen: true, delic: "takt\n" },
  { putanja: "client/index.html", original: "a\nb\n", ugradjen: true, delic: "b\n" },
];

function kontekst(indeks, nedelja) {
  return { koraci, indeks, nedelja };
}

test("korak bira radnu verziju, prazan nacrt ostaje ugrađeni tekst", () => {
  const rezultat = primeni(praznaSesija(), { tip: "fokus", putanja: "client/index.html", kljuc: "1:0" }, kontekst(0, 1));
  assert.equal(rezultat.sesija.verzija, "radna");
  assert.equal(rezultat.prikaz.editor.tekst, "a\n");
  assert.equal(rezultat.prikaz.editor.samoCitaj, false);
  assert.equal(rezultat.prikaz.editor.linije, null);
  assert.equal(rezultat.upis, null);
});

test("sačuvana radna verzija ostaje na sledećem koraku istog fajla", () => {
  const saNacrtom = praznaSesija({ "client/index.html": "ukucano\n" });
  const rezultat = primeni(saNacrtom, { tip: "fokus", putanja: "client/index.html", kljuc: "1:2" }, kontekst(2, 1));
  assert.equal(rezultat.prikaz.editor.tekst, "ukucano\n");
  assert.equal(rezultat.prikaz.klijent["client/index.html"], "ukucano\n");
});

test("ugrađena verzija je samo za čitanje i nosi razliku prema prethodnom snimku", () => {
  const otvoreno = primeni(praznaSesija(), { tip: "fokus", putanja: "client/index.html", kljuc: "1:2" }, kontekst(2, 1));
  const ugradjena = primeni(otvoreno.sesija, { tip: "ugradjena" }, kontekst(2, 1));
  assert.equal(ugradjena.sesija.verzija, "ugradjena");
  assert.equal(ugradjena.prikaz.editor.samoCitaj, true);
  assert.equal(ugradjena.prikaz.editor.tekst, "a\nb\n");
  assert.equal(ugradjena.sesija.radne["client/index.html"], undefined);
  assert.deepEqual(
    ugradjena.prikaz.editor.linije.map((linija) => linija.tip),
    ["isto", "dodato"],
  );
});

test("učitaj bira ugrađenu verziju i ne traži upis", () => {
  const otvoreno = primeni(
    praznaSesija({ "client/index.html": "ukucano\n" }),
    { tip: "fokus", putanja: "client/index.html", kljuc: "1:0" },
    kontekst(0, 1),
  );
  const ucitano = primeni(otvoreno.sesija, { tip: "ucitaj" }, kontekst(0, 1));
  assert.equal(ucitano.sesija.verzija, "ugradjena");
  assert.equal(ucitano.upis, null);
  assert.equal(ucitano.sesija.radne["client/index.html"], "ukucano\n");
  assert.equal(ucitano.prikaz.editor.tekst, "a\n");
});

test("sačuvaj na ugrađenoj verziji ne menja nacrt, sačuvaj na radnoj traži upis", () => {
  const otvoreno = primeni(praznaSesija(), { tip: "fokus", putanja: "client/index.html", kljuc: "1:0" }, kontekst(0, 1));
  const lekcija = primeni(otvoreno.sesija, { tip: "ugradjena" }, kontekst(0, 1));
  const odbijeno = primeni(lekcija.sesija, { tip: "sacuvaj", tekst: "novo" }, kontekst(0, 1));
  assert.equal(odbijeno.upis, null);
  assert.equal(odbijeno.sesija.radne["client/index.html"], undefined);
  const upis = primeni(otvoreno.sesija, { tip: "sacuvaj", tekst: "novo" }, kontekst(0, 1));
  assert.deepEqual(upis.upis, { putanja: "client/index.html", tekst: "novo" });
  assert.equal(upis.zivo, false);
});

test("reset menja samo otvoreni fajl i vraća radnu verziju", () => {
  const sesija = praznaSesija({ "client/index.html": "ukucano\n", "server/soba.js": "moj takt\n" });
  const naServeru = primeni(sesija, { tip: "fokus", putanja: "server/soba.js", kljuc: "5:1" }, kontekst(1, 5));
  const reset = primeni(naServeru.sesija, { tip: "reset" }, kontekst(1, 5));
  assert.equal(reset.sesija.verzija, "radna");
  assert.equal(reset.upis.tekst, "takt\n");
  assert.equal(reset.sesija.radne["server/soba.js"], "takt\n");
  assert.equal(reset.sesija.radne["client/index.html"], "ukucano\n");
  assert.equal(reset.prikaz.server["server/soba.js"], "takt\n");
  assert.equal(reset.prikaz.klijent["client/index.html"], "ukucano\n");
});

test("isti prekidač bira tekst serverskih fajlova", () => {
  const sesija = praznaSesija({ "server/soba.js": "moj takt\n" });
  const radna = primeni(sesija, { tip: "fokus", putanja: "client/index.html", kljuc: "5:1" }, kontekst(1, 5));
  assert.equal(radna.prikaz.server["server/soba.js"], "moj takt\n");
  const ugradjena = primeni(radna.sesija, { tip: "ugradjena" }, kontekst(1, 5));
  assert.equal(ugradjena.prikaz.server["server/soba.js"], "takt\n");
});

test("fajl servera pre pete nedelje ne otvara karticu Server", () => {
  const rezultat = primeni(praznaSesija(), { tip: "fokus", putanja: "server/soba.js", kljuc: "1:1" }, kontekst(1, 1));
  assert.equal(rezultat.sesija.strana, "client");
  assert.equal(rezultat.sesija.verzija, "ugradjena");
});

test("promena strane bira radnu verziju", () => {
  const otvoreno = primeni(praznaSesija(), { tip: "fokus", putanja: "client/index.html", kljuc: "5:1" }, kontekst(1, 5));
  const ugradjena = primeni(otvoreno.sesija, { tip: "ugradjena" }, kontekst(1, 5));
  const server = primeni(ugradjena.sesija, { tip: "strana", strana: "server" }, kontekst(1, 5));
  assert.equal(server.sesija.strana, "server");
  assert.equal(server.sesija.verzija, "radna");
  assert.equal(server.osvezi, true);
});
