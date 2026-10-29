import assert from "node:assert/strict";
import vm from "node:vm";
import test from "node:test";
import { lectures } from "../site/js/lectures.js";
import { jeShell, prikazPriloga } from "../site/js/prilog.js";
import { stabloDo, vecUFajlu } from "../site/js/stablo.js";

const koraci = lectures.flatMap((cas) => cas.steps);

function greskaSintakse(izvor, ime) {
  if (!String(ime).endsWith(".js") || !String(izvor ?? "").trim()) return null;
  try {
    new vm.Script(izvor, { filename: ime });
    return null;
  } catch (greska) {
    return greska.message;
  }
}

function indeks(naslov) {
  const nadjen = koraci.findIndex((korak) => korak.naslov === naslov);
  assert.ok(nadjen >= 0, naslov);
  return nadjen;
}

function ranijeDo(indeksKoraka, putanja) {
  const cas = lectures.find((c) => c.steps.includes(koraci[indeksKoraka]));
  const pocetak = koraci.indexOf(cas.steps[0]);
  return vecUFajlu(koraci, pocetak, indeksKoraka, putanja);
}

test("komanda nije red imenovanog fajla", () => {
  const i = indeks("Komanda");
  const korak = koraci[i];
  const tekst = stabloDo(koraci, i).verzije["server/server.js"];
  const prikaz = prikazPriloga(korak, ranijeDo(i, "server/server.js"));
  assert.equal(prikaz.fajl.ime, "server.js");
  assert.equal(prikaz.komanda, "node server/server.js");
  assert.equal(tekst.includes("node server/server.js"), false);
  assert.equal(prikaz.fajl.linije.some((linija) => jeShell(linija.tekst)), false);
  assert.match(tekst, /const http = require\("http"\)/);
  assert.match(tekst, /http\.createServer/);
  assert.match(tekst, /server\.listen\(8787\);/);
  assert.ok(greskaSintakse("node server/server.js", "server.js"));
  assert.equal(greskaSintakse("const server = http.createServer(obrada);\nserver.listen(8787);\n", "server.js"), null);
});

test("docker nije red baza.js", () => {
  const i = indeks("Kontejner");
  const korak = koraci[i];
  const tekst = stabloDo(koraci, i).verzije["server/baza.js"];
  const prikaz = prikazPriloga(korak, ranijeDo(i, korak.putanja));
  assert.equal(prikaz.fajl.ime, "baza.js");
  assert.equal(prikaz.komanda, "docker compose down");
  assert.equal(tekst.includes("docker compose down"), false);
  assert.equal(prikaz.fajl.linije.some((linija) => linija.tekst.includes("docker compose down")), false);
});

test("restart pokazuje SQL u fajlu i node kao komandu", () => {
  const i = indeks("Restart procesa");
  const korak = koraci[i];
  const prikaz = prikazPriloga(korak, ranijeDo(i, korak.putanja));
  assert.equal(prikaz.fajl.ime, "baza.js");
  assert.equal(prikaz.komanda, "node server/server.js");
  assert.equal(prikaz.fajl.linije.some((linija) => linija.tekst.includes("node server")), false);
  assert.equal(prikaz.fajl.linije.some((linija) => linija.tip === "dodato" && linija.tekst.includes("SELECT ukljucen")), true);
  assert.match(stabloDo(koraci, i).verzije["server/baza.js"], /SELECT ukljucen/);
});

test("nijedan sklopljeni js fajl ne sadrži shell liniju", () => {
  for (let i = 0; i < koraci.length; i += 1) {
    const verzije = stabloDo(koraci, i).verzije;
    for (const [putanja, tekst] of Object.entries(verzije)) {
      if (!putanja.endsWith(".js")) continue;
      for (const linija of String(tekst).split("\n")) {
        assert.equal(jeShell(linija), false, `${putanja} korak ${i}: ${linija}`);
      }
    }
  }
});

test("HTTP red nije u server.js, a sklopljeni fajl prolazi proveru", () => {
  const http = indeks("HTTP");
  const komanda = indeks("Komanda");
  const prikaz = prikazPriloga(koraci[http], ranijeDo(http, "server/server.js"));
  const tekst = stabloDo(koraci, komanda).verzije["server/server.js"];
  assert.equal(prikaz.http, "GET /api/soba HTTP/1.1");
  assert.equal(prikaz.fajl.ime, "server.js");
  assert.equal(prikaz.fajl.linije.some((linija) => linija.tekst.includes("GET /api/soba")), false);
  assert.equal(tekst.includes("GET /api/soba"), false);
  assert.equal(tekst.includes("node server/server.js"), false);
  assert.match(tekst, /require\("http"\)/);
  assert.match(tekst, /createServer/);
  assert.match(tekst, /listen/);
  assert.equal(greskaSintakse(tekst, "server/server.js"), null);
});

test("korak sa celim fajlom označi samo nove redove, na svom mestu", () => {
  const i = indeks("createServer");
  const korak = koraci[i];
  const prikaz = prikazPriloga(korak, ranijeDo(i, korak.putanja));
  const tekst = prikaz.fajl.linije.map((linija) => linija.tekst).join("\n");
  assert.equal(`${tekst}\n`, korak.original);
  const dodato = prikaz.fajl.linije.filter((linija) => linija.tip === "dodato").map((linija) => linija.tekst);
  assert.deepEqual(dodato, ['const http = require("http");', "const server = http.createServer(obrada);"]);
  const requireRed = prikaz.fajl.linije.findIndex((linija) => linija.tekst.includes('require("http")'));
  const createRed = prikaz.fajl.linije.findIndex((linija) => linija.tekst.includes("http.createServer"));
  assert.ok(requireRed >= 0 && requireRed < createRed);
});

test("komanda posle koraka sa celim fajlom pokazuje ceo server.js", () => {
  const i = indeks("Komanda");
  const prikaz = prikazPriloga(koraci[i], ranijeDo(i, "server/server.js"));
  const tekst = prikaz.fajl.linije.map((linija) => linija.tekst).join("\n");
  assert.equal(`${tekst}\n`, stabloDo(koraci, i).verzije["server/server.js"]);
  assert.equal(prikaz.fajl.linije.some((linija) => linija.tip === "dodato"), false);
});
