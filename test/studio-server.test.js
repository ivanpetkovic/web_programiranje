const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");
const test = require("node:test");
const { dokumentJeKurs } = require("../server/kurs");

const KORENI = path.join(__dirname, "..");
const PORT = 8807;
const DATOTEKA = path.join(os.tmpdir(), `kurs-studio-${process.pid}.json`);

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

test("upis kursa ide preko privremenog fajla", () => {
  const server = fs.readFileSync(path.join(KORENI, "server", "server.js"), "utf8");
  assert.match(server, /\.kurs-studio\.tmp/);
  assert.match(server, /renameSync\(privremeno, KURS\)/);
  assert.match(server, /KURS_DATOTEKA/);
});

test("dokument kursa poznaje isporučeni kurs.json", () => {
  const kurs = JSON.parse(fs.readFileSync(path.join(KORENI, "site", "kurs.json"), "utf8"));
  assert.equal(dokumentJeKurs(kurs), true);
  assert.equal(dokumentJeKurs({ trajanjeNedelja: 1, nedelje: [] }), false);
  assert.equal(dokumentJeKurs({ trajanjeNedelja: 1, nedelje: [{ steps: [null] }] }), false);
});

test("čuvanje kursa piše JSON i odbija dokument koji čas ne bi učitao", async () => {
  fs.writeFileSync(DATOTEKA, "{}\n");
  const proc = spawn(process.execPath, ["server/server.js"], {
    cwd: KORENI,
    env: {
      ...process.env,
      PORT: String(PORT),
      KURS_DATOTEKA: DATOTEKA,
      DATABASE_URL: "",
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
        if (!dnevnik.includes("Web Programiranje")) return;
        clearTimeout(rok);
        resolve();
      };
      proc.stdout.on("data", proveri);
      proc.stderr.on("data", proveri);
      proveri();
    });

    const kurs = {
      naslov: "Proba",
      trajanjeNedelja: 1,
      nedelje: [{ naslov: "Jedna", steps: [{ naslov: "Korak" }] }],
    };
    const sacuvan = await zahtev("PUT", "/api/kurs", JSON.stringify(kurs), {
      "content-type": "application/json",
    });
    assert.equal(sacuvan.status, 200);
    assert.deepEqual(JSON.parse(sacuvan.body), { ok: true });
    assert.equal(fs.readFileSync(DATOTEKA, "utf8"), `${JSON.stringify(kurs, null, 2)}\n`);

    const los = await zahtev("PUT", "/api/kurs", "{", { "content-type": "application/json" });
    assert.equal(los.status, 400);
    assert.equal(fs.readFileSync(DATOTEKA, "utf8"), `${JSON.stringify(kurs, null, 2)}\n`);

    const trajanje = await zahtev(
      "PUT",
      "/api/kurs",
      JSON.stringify({ trajanjeNedelja: 3, nedelje: [{ naslov: "A", steps: [{}] }] }),
      { "content-type": "application/json" }
    );
    assert.equal(trajanje.status, 400);
    assert.equal(JSON.parse(fs.readFileSync(DATOTEKA, "utf8")).naslov, "Proba");

    const saViskom = {
      naslov: "Proba",
      trajanjeNedelja: 1,
      nedelje: [{ naslov: "Jedna", visak: "ostaje", steps: [{ naslov: "Korak" }] }],
    };
    const visak = await zahtev("PUT", "/api/kurs", JSON.stringify(saViskom), {
      "content-type": "application/json",
    });
    assert.equal(visak.status, 200);
    assert.equal(JSON.parse(fs.readFileSync(DATOTEKA, "utf8")).nedelje[0].visak, "ostaje");

    const preveliko = await zahtev("PUT", "/api/kurs", "x".repeat(2_000_001), {
      "content-type": "application/json",
    });
    assert.equal(preveliko.status, 400);
    assert.equal(JSON.parse(preveliko.body).greska, "telo je preveliko");
    assert.equal(JSON.parse(fs.readFileSync(DATOTEKA, "utf8")).nedelje[0].visak, "ostaje");

    const serverFajl = path.join(KORENI, "server", "server.js");
    const preServera = fs.readFileSync(serverFajl, "utf8");
    const skica = await zahtev(
      "POST",
      "/api/fajl",
      JSON.stringify({ strana: "server", put: "server.js", izvor: "const http = require(\"http\");\n" }),
      { "content-type": "application/json" }
    );
    assert.equal(skica.status, 200);
    assert.deepEqual(JSON.parse(skica.body), { sacuvan: false, pokretanje: true });
    assert.equal(fs.readFileSync(serverFajl, "utf8"), preServera);

    const stranica = await zahtev("GET", "/studio");
    assert.equal(stranica.status, 200);
    assert.match(stranica.body, /id="studio"/);
    const kosa = await zahtev("GET", "/studio/");
    assert.equal(kosa.status, 200);
    assert.match(kosa.body, /id="studio"/);
  } finally {
    proc.kill();
    await new Promise((resolve) => proc.on("exit", resolve));
    fs.rmSync(DATOTEKA, { force: true });
    fs.rmSync(path.join(path.dirname(DATOTEKA), ".kurs-studio.tmp"), { force: true });
  }
});
