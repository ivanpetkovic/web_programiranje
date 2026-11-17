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
  const i = indeks("Projekat, moduli i npm");
  const korak = koraci[i];
  const tekst = stabloDo(koraci, i).verzije["client/lekcije/35-moduli.js"];
  const prikaz = prikazPriloga(korak, ranijeDo(i, korak.putanja));
  assert.equal(prikaz.fajl.ime, "35-moduli.js");
  assert.equal(prikaz.komanda, "npm start");
  assert.equal(tekst.includes("npm start"), false);
  assert.equal(prikaz.fajl.linije.some((linija) => jeShell(linija.tekst)), false);
  assert.match(tekst, /export function pozdrav/);
  assert.ok(greskaSintakse("npm start", "35-moduli.js"));
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

test("HTTP red nije u fajlu lekcije", () => {
  const http = indeks("Anatomija HTTP zahteva i odgovora");
  const korak = koraci[http];
  const prikaz = prikazPriloga(korak, ranijeDo(http, korak.putanja));
  const tekst = stabloDo(koraci, http).verzije[korak.putanja];
  assert.equal(prikaz.http, "GET /uredjaji?tip=senzor HTTP/1.1");
  assert.equal(prikaz.fajl.ime, "37-zahtev.js");
  assert.equal(prikaz.fajl.linije.some((linija) => linija.tekst.includes("GET /uredjaji")), false);
  assert.equal(tekst.includes("GET /uredjaji"), false);
  assert.match(tekst, /url\.pathname/);
});

test("korak sa celim fajlom pokazuje ceo HTTP server", () => {
  const i = indeks("Od programa do HTTP servera");
  const korak = koraci[i];
  const prikaz = prikazPriloga(korak, ranijeDo(i, korak.putanja));
  const tekst = prikaz.fajl.linije.map((linija) => linija.tekst).join("\n");
  assert.equal(`${tekst}\n`, korak.original);
  assert.match(tekst, /import http from 'node:http'/);
  assert.match(tekst, /http\.createServer/);
  const kraj = tekst.indexOf("res.end('Zdravo sa servera')");
  const slusanje = tekst.indexOf("server.listen(3000");
  assert.ok(kraj > 0 && kraj < slusanje);
  assert.equal(prikaz.fajl.linije.every((linija) => linija.tip === "isto"), true);
});

test("komanda posle celog fajla ne ulazi u taj fajl", () => {
  const i = indeks("Od programa do HTTP servera");
  const prikaz = prikazPriloga(koraci[i], ranijeDo(i, koraci[i].putanja));
  const tekst = prikaz.fajl.linije.map((linija) => linija.tekst).join("\n");
  assert.equal(`${tekst}\n`, stabloDo(koraci, i).verzije[koraci[i].putanja]);
  assert.equal(tekst.includes("curl"), false);
  assert.equal(prikaz.fajl.linije.some((linija) => jeShell(linija.tekst)), false);
});
