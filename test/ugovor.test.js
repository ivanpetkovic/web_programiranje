const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { spawn } = require("node:child_process");
const test = require("node:test");

const KORENI = path.join(__dirname, "..");
const PORT = 8798;
const SOBA = path.join(KORENI, "server", "soba.js");
const VENTILATOR = path.join(KORENI, "server", "ventilator.js");
const SESIJA = path.join(KORENI, "server", "sesija.js");

function zahtev(method, put, telo, zaglavlja = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      { hostname: "127.0.0.1", port: PORT, path: put, method, headers: zaglavlja },
      (res) => {
        const delovi = [];
        res.on("data", (deo) => delovi.push(deo));
        res.on("end", () => {
          resolve({
            status: res.statusCode,
            httpVersion: res.httpVersion,
            headers: res.headers,
            body: Buffer.concat(delovi).toString("utf8"),
          });
        });
      }
    );
    req.on("error", reject);
    if (telo !== undefined) req.write(telo);
    req.end();
  });
}

function kolacic(odgovor) {
  const zaglavlje = odgovor.headers["set-cookie"];
  const prvi = Array.isArray(zaglavlje) ? zaglavlje[0] : zaglavlje;
  return prvi.split(";")[0];
}

test("ugovor čitanja, tela, fonta, stabla, istorije i uloge", async (t) => {
  const soba = fs.readFileSync(SOBA, "utf8");
  const ventilator = fs.readFileSync(VENTILATOR, "utf8");
  const sesija = fs.readFileSync(SESIJA, "utf8");
  const izvorServera = fs.readFileSync(path.join(KORENI, "server", "server.js"), "utf8");
  const granica = Number(izvorServera.match(/GRANICA_JSON = (\d+)/)[1]);
  const proc = spawn(process.execPath, ["server/server.js"], {
    cwd: KORENI,
    env: {
      ...process.env,
      PORT: String(PORT),
      DATABASE_URL: "postgresql://soba:soba@127.0.0.1:5432/soba",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let dnevnik = "";
  proc.stdout.on("data", (deo) => {
    dnevnik += deo.toString();
  });
  proc.stderr.on("data", (deo) => {
    dnevnik += deo.toString();
  });
  try {
    await new Promise((resolve, reject) => {
      const rok = setTimeout(() => reject(new Error(dnevnik || "server nije krenuo")), 8000);
      const proveri = () => {
        if (!dnevnik.includes("kontrolna soba")) return;
        clearTimeout(rok);
        resolve();
      };
      proc.stdout.on("data", proveri);
      proc.on("exit", () => {
        clearTimeout(rok);
        reject(new Error(dnevnik || "server je stao"));
      });
      proveri();
    });

    const citanje = await zahtev("GET", "/api/soba");
    assert.equal(citanje.httpVersion, "1.1");
    assert.equal(citanje.status, 200);
    const sobaJson = JSON.parse(citanje.body);
    assert.equal(typeof sobaJson.temperatura, "number");
    assert.equal(typeof sobaJson.ukljucen, "boolean");

    const komanda = await zahtev("PUT", "/api/ventilator", JSON.stringify({ ukljucen: true }), {
      "content-type": "application/json",
    });
    assert.equal(komanda.status, 200);
    assert.deepEqual(JSON.parse(komanda.body), { ukljucen: true });

    const losJson = await zahtev("PUT", "/api/ventilator", "{", {
      "content-type": "application/json",
    });
    assert.equal(losJson.status, 400);
    const posleJson = JSON.parse((await zahtev("GET", "/api/soba")).body);
    assert.equal(posleJson.ukljucen, true);

    const preveliko = await zahtev("PUT", "/api/ventilator", "x".repeat(granica + 1), {
      "content-type": "application/json",
    });
    assert.equal(preveliko.status, 400);
    const posleGranice = JSON.parse((await zahtev("GET", "/api/soba")).body);
    assert.equal(posleGranice.ukljucen, true);

    const sintaksa = await zahtev(
      "POST",
      "/api/fajl",
      JSON.stringify({ strana: "server", put: "soba.js", izvor: "function citaj( {" }),
      { "content-type": "application/json" }
    );
    assert.equal(sintaksa.status, 400);
    assert.equal(fs.readFileSync(SOBA, "utf8"), soba);
    const iDalje = await zahtev("GET", "/api/soba");
    assert.equal(iDalje.status, 200);
    assert.equal(typeof JSON.parse(iDalje.body).temperatura, "number");

    const stranica = await zahtev("GET", "/");
    const stil = await zahtev("GET", "/css/site.css");
    const font = await zahtev("GET", "/fonts/digital-7-mono.ttf");
    assert.match(stranica.body, /id="displej"[^>]*class="digit"|class="digit"[^>]*id="displej"/);
    assert.match(stranica.body, /id="displej-masina"[^>]*class="digit"|class="digit"[^>]*id="displej-masina"/);
    assert.match(stil.body, /font-family:\s*"Digital-7 Mono"/);
    assert.equal(font.status, 200);
    assert.match(font.headers["content-type"], /font\/ttf/);
    assert.ok(font.body.length > 1000);

    const stablo = await zahtev("GET", "/api/stablo?strana=client");
    const fajlovi = JSON.parse(stablo.body).fajlovi.map((put) => `client/${put}`);
    for (const put of [
      "client/index.html",
      "client/css/soba.css",
      "client/js/korak.js",
      "client/js/niz.js",
      "client/js/displej.js",
      "client/js/prekidac.js",
    ]) {
      assert.ok(fajlovi.includes(put), put);
    }
    assert.equal(fajlovi.some((put) => put.includes("prepared")), false);
    assert.ok(fajlovi.includes("client/assets/fonts/digital-7/digital-7 (mono).ttf"));
    assert.ok(fajlovi.includes("client/assets/fonts/digital-7/readme.txt"));

    const fontIzKlijenta = await zahtev(
      "GET",
      "/client/assets/fonts/digital-7/" + encodeURIComponent("digital-7 (mono).ttf")
    );
    assert.equal(fontIzKlijenta.status, 200);
    assert.match(fontIzKlijenta.headers["content-type"], /font\/ttf/);
    assert.ok(fontIzKlijenta.body.length > 1000);

    const binarni = await zahtev(
      "GET",
      "/api/fajl?strana=client&put=" + encodeURIComponent("assets/fonts/digital-7/digital-7 (mono).ttf")
    );
    const teloFonta = JSON.parse(binarni.body);
    assert.equal(teloFonta.binarni, true);
    assert.equal(teloFonta.izvor, undefined);
    assert.match(teloFonta.napomena, /Binarni fajl/);
    const readme = JSON.parse(
      (await zahtev("GET", "/api/fajl?strana=client&put=" + encodeURIComponent("assets/fonts/digital-7/readme.txt"))).body
    );
    assert.match(readme.izvor, /DIGITAL-7/);
    const fontNaDisku = path.join(KORENI, "client", "assets", "fonts", "digital-7", "digital-7 (mono).ttf");
    const velicinaFonta = fs.statSync(fontNaDisku).size;
    const upisFonta = await zahtev(
      "POST",
      "/api/fajl",
      JSON.stringify({
        strana: "client",
        put: "assets/fonts/digital-7/digital-7 (mono).ttf",
        izvor: "nije font",
      }),
      { "content-type": "application/json" }
    );
    assert.equal(upisFonta.status, 400);
    assert.equal(fs.statSync(fontNaDisku).size, velicinaFonta);

    await zahtev("POST", "/api/baza", JSON.stringify({ ukljucen: true }), {
      "content-type": "application/json",
    });
    const preIstorije = JSON.parse((await zahtev("GET", "/api/soba")).body);
    const duzina = preIstorije.istorija.length;
    const upis = await zahtev("PUT", "/api/ventilator", JSON.stringify({ ukljucen: false }), {
      "content-type": "application/json",
    });
    assert.equal(upis.status, 200);
    const posleUpisa = JSON.parse((await zahtev("GET", "/api/soba")).body);
    assert.equal(posleUpisa.istorija.length, duzina + 1);
    assert.equal(posleUpisa.istorija.at(-1), "iskljuci");

    const pokvaren = ventilator.replace(
      "INSERT INTO istorija (komanda) VALUES ($1)",
      "INSERT INTO istorija (nema_kolone) VALUES ($1)"
    );
    const sacuvanLos = await zahtev(
      "POST",
      "/api/fajl",
      JSON.stringify({ strana: "server", put: "ventilator.js", izvor: pokvaren }),
      { "content-type": "application/json" }
    );
    assert.equal(sacuvanLos.status, 200);
    const odbijen = await zahtev("PUT", "/api/ventilator", JSON.stringify({ ukljucen: true }), {
      "content-type": "application/json",
    });
    assert.equal(odbijen.status, 500);
    const posleOdbijanja = JSON.parse((await zahtev("GET", "/api/soba")).body);
    assert.equal(posleOdbijanja.ukljucen, false);
    assert.equal(posleOdbijanja.istorija.length, duzina + 1);
    assert.equal(posleOdbijanja.istorija.includes("ukljuci") ? posleOdbijanja.istorija.at(-1) : "iskljuci", "iskljuci");

    const vracen = await zahtev(
      "POST",
      "/api/fajl",
      JSON.stringify({ strana: "server", put: "ventilator.js", izvor: ventilator }),
      { "content-type": "application/json" }
    );
    assert.equal(vracen.status, 200);

    await zahtev("POST", "/api/uloge", JSON.stringify({ ukljucen: true }), {
      "content-type": "application/json",
    });
    const sesijaOdgovor = await zahtev("POST", "/api/sesija", JSON.stringify({ koja: "posmatrac" }), {
      "content-type": "application/json",
    });
    const kljuc = kolacic(sesijaOdgovor);
    const odbijenPosmatrac = await zahtev("PUT", "/api/ventilator", JSON.stringify({ ukljucen: true }), {
      "content-type": "application/json",
      cookie: kljuc,
    });
    assert.equal(odbijenPosmatrac.status, 403);
    const izmenjena = sesija.replace(
      '[KLJUC_POSMATRACA, "posmatrac"]',
      '[KLJUC_POSMATRACA, "operater"]'
    );
    const sacuvanaUloga = await zahtev(
      "POST",
      "/api/fajl",
      JSON.stringify({ strana: "server", put: "sesija.js", izvor: izmenjena }),
      { "content-type": "application/json" }
    );
    assert.equal(sacuvanaUloga.status, 200);
    const istiKolacic = await zahtev("PUT", "/api/ventilator", JSON.stringify({ ukljucen: true }), {
      "content-type": "application/json",
      cookie: kljuc,
    });
    assert.equal(istiKolacic.status, 200);
    assert.equal(kljuc, kolacic(sesijaOdgovor));
  } finally {
    fs.writeFileSync(SOBA, soba);
    fs.writeFileSync(VENTILATOR, ventilator);
    fs.writeFileSync(SESIJA, sesija);
    proc.kill();
    await new Promise((resolve) => proc.on("exit", resolve));
  }
  assert.equal(t.name.length > 0, true);
});
