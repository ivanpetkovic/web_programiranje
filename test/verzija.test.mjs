import assert from "node:assert/strict";
import test from "node:test";
import { lectures } from "../site/js/lectures.js";
import { praznaSesija, primeni } from "../site/js/verzija.js";

const koraci = [
  { putanja: "client/index.html", original: "a\n", ugradjen: true, delic: "a\n" },
  { putanja: "server/soba.js", original: "takt\n", ugradjen: true, delic: "takt\n" },
  { putanja: "client/index.html", original: "a\nb\n", ugradjen: true, delic: "b\n" },
];

function kontekst(indeks, tema) {
  return { koraci, indeks, tema };
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

test("fajl servera pre pete teme ne otvara karticu Server", () => {
  const rezultat = primeni(praznaSesija(), { tip: "fokus", putanja: "server/soba.js", kljuc: "1:1" }, kontekst(1, 1));
  assert.equal(rezultat.sesija.strana, "client");
  assert.equal(rezultat.sesija.verzija, "ugradjena");
});

test("moj kod koji učitava lokalni skript vidi taj fajl pre koraka koji ga uvodi", () => {
  const koraci = lectures.flatMap((cas) => cas.steps);
  const indeks = koraci.findIndex((korak) => korak.naslov === "Destrukturiranje i savremena sintaksa");
  const html = [
    "<!DOCTYPE html>",
    '<html lang="sr">',
    "</html>",
    "",
    "<head>",
    '<meta charset="utf-8">',
    "<title>Soba</title>",
    "</head>",
    "",
    "<h1>Soba prekidača</h1>",
    "",
    '<p class="digit">24</p>',
    "",
    "<button class='ukljuci' type=\"button\">Uključi</button>",
    '<script src="js/korak.js"></script>',
    '<script src="./js/nema.js"></script>',
    '<script src="../server/soba.js"></script>',
    '<script src="https://primer.test/tudj.js"></script>',
    '<script src="/js/korak.js"></script>',
  ].join("\n");
  const kontekst = { koraci, indeks, tema: 3 };
  const sesija = praznaSesija({
    "client/index.html": html,
    "client/js/korak.js": "let delta = 1;\n",
    "client/../tajna.js": "ne",
  });
  const rezultat = primeni(sesija, { tip: "fokus", putanja: "client/index.html", kljuc: "3:7" }, kontekst);
  assert.equal(rezultat.prikaz.fajlovi.includes("lekcije/08-sintaksa.js"), true);
  assert.equal(rezultat.prikaz.fajlovi.includes("lekcije/09-opseg.js"), false);
  assert.equal(rezultat.prikaz.fajlovi.includes("js/korak.js"), true);
  assert.equal(rezultat.prikaz.fajlovi.includes("js/nema.js"), true);
  assert.equal(rezultat.prikaz.fajlovi.includes("../server/soba.js"), false);
  assert.equal(rezultat.prikaz.fajlovi.includes("server/soba.js"), false);
  assert.equal(rezultat.prikaz.fajlovi.filter((put) => put === "js/korak.js").length, 1);
  assert.equal(rezultat.prikaz.klijent["client/js/korak.js"], "let delta = 1;\n");
  assert.equal(rezultat.prikaz.klijent["client/js/nema.js"], "");
  const otvoren = primeni(rezultat.sesija, { tip: "otvori", put: "js/korak.js" }, kontekst);
  assert.equal(otvoren.sesija.otvoreno.client, "js/korak.js");
  assert.equal(otvoren.prikaz.editor.putanja, "client/js/korak.js");
  assert.equal(otvoren.prikaz.editor.tekst, "let delta = 1;\n");
  assert.equal(otvoren.prikaz.editor.samoCitaj, false);
  const lekcija = primeni(rezultat.sesija, { tip: "ugradjena" }, kontekst);
  assert.equal(lekcija.prikaz.fajlovi.includes("js/korak.js"), false);
  assert.equal(lekcija.prikaz.klijent["client/js/korak.js"], undefined);
});

test("kucanje script oznake odmah dodaje fajl u stablo", () => {
  const unos = primeni(
    praznaSesija(),
    { tip: "fokus", putanja: "client/index.html", kljuc: "1:0" },
    kontekst(0, 1),
  );
  const posle = primeni(unos.sesija, { tip: "unos", tekst: '<script src="js/korak.js"></script>' }, kontekst(0, 1));
  assert.equal(posle.prikaz.fajlovi.includes("js/korak.js"), true);
  assert.equal(posle.prikaz.klijent["client/js/korak.js"], "");
  assert.equal(posle.prikaz.editor.tekst, '<script src="js/korak.js"></script>');
});

test("promena strane bira radnu verziju", () => {
  const otvoreno = primeni(praznaSesija(), { tip: "fokus", putanja: "client/index.html", kljuc: "5:1" }, kontekst(1, 5));
  const ugradjena = primeni(otvoreno.sesija, { tip: "ugradjena" }, kontekst(1, 5));
  const server = primeni(ugradjena.sesija, { tip: "strana", strana: "server" }, kontekst(1, 5));
  assert.equal(server.sesija.strana, "server");
  assert.equal(server.sesija.verzija, "radna");
  assert.equal(server.osvezi, true);
});
