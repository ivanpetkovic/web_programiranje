import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import fs from "node:fs";
import { createRequire } from "node:module";
import http from "node:http";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import { lectures } from "../site/js/lectures.js";
import { stabloDo } from "../site/js/stablo.js";

const koraci = lectures.flatMap((cas) => cas.steps);
const MODULI = ["server/soba.js", "server/ventilator.js", "server/sesija.js"];

function krajNedelje(n) {
  return lectures.slice(0, n).reduce((zbir, cas) => zbir + cas.steps.length, 0) - 1;
}

function indeks(nedelja, naslov) {
  const pocetak = krajNedelje(nedelja - 1) + 1;
  const i = lectures[nedelja - 1].steps.findIndex((korak) => korak.naslov === naslov);
  assert.ok(i >= 0, `${nedelja}/${naslov}`);
  return pocetak + i;
}

function slobodanPort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

function sklopi(indeksKoraka) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "kurs-server-"));
  const verzije = stabloDo(koraci, indeksKoraka).verzije;
  for (const [putanja, tekst] of Object.entries(verzije)) {
    if (!putanja.startsWith("server/") || !putanja.endsWith(".js")) continue;
    const cilj = path.join(dir, putanja);
    fs.mkdirSync(path.dirname(cilj), { recursive: true });
    fs.writeFileSync(cilj, tekst);
  }
  return { dir, verzije };
}

async function pokreni(indeksKoraka, t) {
  const { dir, verzije } = sklopi(indeksKoraka);
  const port = await slobodanPort();
  const fajl = path.join(dir, "server", "server.js");
  fs.writeFileSync(fajl, verzije["server/server.js"].replaceAll("8787", String(port)));
  const proc = spawn(process.execPath, [fajl], { cwd: dir, stdio: ["ignore", "pipe", "pipe"] });
  let log = "";
  proc.stdout.on("data", (deo) => { log += deo; });
  proc.stderr.on("data", (deo) => { log += deo; });
  t.after(() => {
    proc.kill();
    fs.rmSync(dir, { recursive: true, force: true });
  });
  await new Promise((resolve, reject) => {
    const rok = setTimeout(() => reject(new Error(`server nije krenuo: ${log}`)), 5000);
    proc.stdout.on("data", () => {
      if (!log.includes(`server sluša port ${port}`)) return;
      clearTimeout(rok);
      resolve();
    });
    proc.on("exit", () => {
      clearTimeout(rok);
      reject(new Error(`server je stao: ${log}`));
    });
  });
  return { port, proc, log: () => log };
}

function zahtev(port, metod, putanja, telo) {
  return new Promise((resolve, reject) => {
    const req = http.request({ host: "127.0.0.1", port, method: metod, path: putanja }, (res) => {
      let tekst = "";
      res.setEncoding("utf8");
      res.on("data", (deo) => { tekst += deo; });
      res.on("end", () => resolve({ status: res.statusCode, tip: res.headers["content-type"], telo: tekst ? JSON.parse(tekst) : null }));
    });
    req.on("error", reject);
    if (telo !== undefined) req.write(telo);
    req.end();
  });
}

function ucitaj(tekst, ime) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "kurs-modul-"));
  const fajl = path.join(dir, ime);
  fs.writeFileSync(fajl, tekst);
  try {
    return createRequire(fajl)(fajl);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function stanje(izmene = {}) {
  return { temperatura: 24, ukljucen: false, prikljucen: true, proveriUlogu: false, takt: false, baza: false, ...izmene };
}

test("sklopljen server 5. nedelje: ruta vraća 200, nepoznata putanja 404, pogrešan metod 405", async (t) => {
  const { port, log } = await pokreni(krajNedelje(5), t);
  const soba = await zahtev(port, "GET", "/api/soba");
  assert.equal(soba.status, 200);
  assert.match(soba.tip, /application\/json/);
  assert.deepEqual(soba.telo, { temperatura: 24, ukljucen: false });
  assert.equal((await zahtev(port, "GET", "/api/soba?x=1")).status, 200);
  const nema = await zahtev(port, "GET", "/bilo-sta");
  assert.equal(nema.status, 404);
  assert.deepEqual(nema.telo, { greska: "nema putanje" });
  const metod = await zahtev(port, "PUT", "/api/soba", "{}");
  assert.equal(metod.status, 405);
  assert.deepEqual(metod.telo, { greska: "metod nije dozvoljen" });
  assert.equal((await zahtev(port, "PUT", "/api/ventilator", '{"ukljucen":true}')).status, 404);
  assert.match(log(), /server sluša port/);
});

test("pre rute, sklopljen server isto odgovara na svaku putanju", async (t) => {
  const { port } = await pokreni(indeks(5, "Adresa"), t);
  const soba = await new Promise((resolve, reject) => {
    http.get({ host: "127.0.0.1", port, path: "/bilo-sta" }, (res) => {
      let tekst = "";
      res.on("data", (deo) => { tekst += deo; });
      res.on("end", () => resolve({ status: res.statusCode, tekst }));
    }).on("error", reject);
  });
  assert.deepEqual(soba, { status: 200, tekst: "soba" });
});

test("sklopljen server 7. nedelje prima komandu i odbija loše telo", async (t) => {
  const { port, proc } = await pokreni(krajNedelje(7), t);
  const komanda = await zahtev(port, "PUT", "/api/ventilator", '{"ukljucen":true}');
  assert.equal(komanda.status, 200);
  assert.deepEqual(komanda.telo, { ukljucen: true });
  assert.deepEqual((await zahtev(port, "GET", "/api/soba")).telo, { temperatura: 24, ukljucen: true });
  const ponovo = await zahtev(port, "PUT", "/api/ventilator", '{"ukljucen":true}');
  assert.deepEqual(ponovo.telo, { ukljucen: true });
  assert.equal((await zahtev(port, "PUT", "/api/ventilator", "da")).status, 400);
  const tekst = await zahtev(port, "PUT", "/api/ventilator", '{"ukljucen":"da"}');
  assert.equal(tekst.status, 400);
  assert.deepEqual(tekst.telo, { greska: "telo nije boolean rezim" });
  assert.equal((await zahtev(port, "PUT", "/api/ventilator", '{"ukljucen":false,"temperatura":30}')).status, 400);
  assert.equal((await zahtev(port, "PUT", "/api/ventilator", JSON.stringify({ ukljucen: false, x: "a".repeat(5000) }))).status, 400);
  assert.equal((await zahtev(port, "GET", "/api/ventilator")).status, 405);
  assert.deepEqual((await zahtev(port, "GET", "/api/soba")).telo, { temperatura: 24, ukljucen: true });
  assert.equal(proc.exitCode, null);
});

test("svaki sklopljeni serverski fajl od 5. nedelje do kraja kursa je JavaScript koji Node prihvata", () => {
  const pocetak = krajNedelje(4) + 1;
  for (let i = pocetak; i <= krajNedelje(7); i += 1) {
    const tekst = stabloDo(koraci, i).verzije["server/server.js"];
    if (tekst === undefined) continue;
    assert.doesNotThrow(() => new vm.Script(tekst, { filename: "server.js" }), `${koraci[i].naslov}`);
  }
  for (let i = pocetak; i < koraci.length; i += 1) {
    const verzije = stabloDo(koraci, i).verzije;
    for (const putanja of MODULI) {
      if (verzije[putanja] === undefined) continue;
      assert.doesNotThrow(() => new vm.Script(verzije[putanja], { filename: putanja }), `${koraci[i].naslov} ${putanja}`);
    }
  }
});

test("svaka verzija modula koju pregled upiše ispunjava ugovor procesa", async () => {
  const vidjeno = new Set();
  for (let i = krajNedelje(4) + 1; i < koraci.length; i += 1) {
    const verzije = stabloDo(koraci, i).verzije;
    for (const putanja of MODULI) {
      const tekst = verzije[putanja];
      if (tekst === undefined || vidjeno.has(tekst)) continue;
      vidjeno.add(tekst);
      const modul = ucitaj(tekst, path.basename(putanja));
      const gde = `${koraci[i].naslov} ${putanja}`;
      if (putanja === "server/soba.js") {
        const citanje = await modul.citaj({ state: stanje(), db: null, svezina: false });
        assert.equal(citanje.status, 200, gde);
        assert.deepEqual(citanje.body, { temperatura: 24, ukljucen: false }, gde);
      }
      if (putanja === "server/ventilator.js") {
        const state = stanje();
        const odgovor = await modul.komanda({ state, db: null }, { ukljucen: true });
        assert.equal(odgovor.status, 200, gde);
        assert.deepEqual(odgovor.body, { ukljucen: true }, gde);
        assert.equal(state.ukljucen, true, gde);
      }
      if (putanja === "server/sesija.js") {
        assert.equal(typeof modul.kljucZaUlogu("operater"), "string", gde);
        assert.equal(typeof modul.odbijenaKomanda, "function", gde);
        modul.odbijenaKomanda({ headers: {} });
      }
    }
  }
  assert.ok(vidjeno.size >= 15);
});

test("izvučen kabl u 6. nedelji: modul sobe vraća 500", async () => {
  const i = indeks(6, "Izvučen kabl");
  assert.equal(koraci[i].putanja, "server/soba.js");
  const pre = ucitaj(stabloDo(koraci, i - 1).verzije["server/soba.js"], "soba.js");
  const posle = ucitaj(stabloDo(koraci, i).verzije["server/soba.js"], "soba.js");
  assert.equal(pre.citaj({ state: stanje({ prikljucen: false }) }).status, 200);
  assert.deepEqual(posle.citaj({ state: stanje({ prikljucen: false }) }), { status: 500, body: { greska: "ventilator nije prikljucen" } });
});

test("kurs se završava pripremljenim modulima servera", () => {
  const kraj = stabloDo(koraci, koraci.length - 1).verzije;
  for (const putanja of MODULI) {
    const disk = fs.readFileSync(new URL(`../server/prepared/${path.basename(putanja)}`, import.meta.url), "utf8");
    assert.equal(kraj[putanja], disk, putanja);
  }
});

test("5. nedelja uvodi rutu redom: adresa, telo, status, 404, 405, modul", () => {
  const redosled = ["Komanda", "Adresa", "JSON telo", "Status i zaglavlje", "Jedan odgovor", "Ruta", "Metod", "Modul sobe", "Stanje na serveru"]
    .map((naslov) => indeks(5, naslov));
  assert.deepEqual([...redosled].sort((a, b) => a - b), redosled);
  for (const naslov of ["Cela poruka", "Pad pretpostavke", "Potvrda", "TCP"]) {
    const korak = koraci[indeks(5, naslov)];
    assert.equal(korak.putanja, undefined, naslov);
    assert.ok(korak.samostalniPrimer?.tekst, naslov);
  }
});
