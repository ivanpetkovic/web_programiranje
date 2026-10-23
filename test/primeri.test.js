const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");
const test = require("node:test");
const { spisakPrimera, ucitajPrimer } = require("../server/primeri");

const KORENI = path.join(__dirname, "..");
const PRIMERI = path.join(KORENI, "primeri");

test("spisak stavlja kontrolnu sobu prvu, pa foldere iz primeri/", () => {
  const primeri = spisakPrimera(PRIMERI);
  assert.equal(primeri[0].id, "kontrolna-soba");
  assert.equal(primeri[0].naslov, "Kontrolna soba");
  assert.equal(primeri.some((primer) => primer.id === "2_fje" && primer.naslov === "Funkcije"), true);
  assert.equal(primeri.some((primer) => primer.id === "1_htm, css, js" && primer.naslov === "HTML, CSS i JS"), true);
  assert.equal(primeri.some((primer) => primer.id === "node_modules"), false);
});

test("učitavanje čita više fajlova i preskače node_modules i primer.json", () => {
  const privremeno = fs.mkdtempSync(path.join(os.tmpdir(), "primeri-"));
  const dir = path.join(privremeno, "skica");
  fs.mkdirSync(path.join(dir, "src"), { recursive: true });
  fs.mkdirSync(path.join(dir, "node_modules", "tajna"), { recursive: true });
  fs.writeFileSync(path.join(dir, "primer.json"), JSON.stringify({ naslov: "Skica" }));
  fs.writeFileSync(path.join(dir, "index.html"), "<p>skica</p>\n");
  fs.writeFileSync(path.join(dir, "src", "main.js"), "const a = 1;\n");
  fs.writeFileSync(path.join(dir, "node_modules", "tajna", "index.js"), "tajna\n");
  fs.writeFileSync(path.join(dir, "package-lock.json"), "{}\n");
  try {
    const primer = ucitajPrimer(privremeno, "skica");
    assert.equal(primer.naslov, "Skica");
    assert.deepEqual(primer.fajlovi, ["index.html", "src/main.js"]);
    assert.equal(primer.verzije["src/main.js"], "const a = 1;\n");
    assert.equal(primer.verzije["primer.json"], undefined);
    assert.equal(JSON.stringify(primer).includes("tajna"), false);
  } finally {
    fs.rmSync(privremeno, { recursive: true, force: true });
  }
});

test("kontrolna soba nema fajlove sa diska, a putanja van foldera se odbija", () => {
  const ugradjen = ucitajPrimer(PRIMERI, "kontrolna-soba");
  assert.equal(ugradjen.ugradjen, true);
  assert.equal(ugradjen.fajlovi, undefined);
  assert.equal(ucitajPrimer(PRIMERI, "../server"), null);
  assert.equal(ucitajPrimer(PRIMERI, "2_fje/src"), null);
  assert.equal(ucitajPrimer(PRIMERI, "nema-ovog"), null);
});

test("postojeći primer funkcija nosi index i izvore", () => {
  const primer = ucitajPrimer(PRIMERI, "2_fje");
  assert.equal(primer.fajlovi.includes("index.html"), true);
  assert.equal(primer.fajlovi.includes("src/main.js"), true);
  assert.match(primer.verzije["index.html"], /<script/);
});

test("GET /api/primeri servira foldere, ne kontrolnu sobu sa diska", async () => {
  const port = 8819;
  const proc = spawn(process.execPath, ["server/server.js"], {
    cwd: KORENI,
    env: { ...process.env, PORT: String(port), DATABASE_URL: "" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let dnevnik = "";
  proc.stdout.on("data", (deo) => {
    dnevnik += deo.toString();
  });
  proc.stderr.on("data", (deo) => {
    dnevnik += deo.toString();
  });
  function zahtev(put) {
    return new Promise((resolve, reject) => {
      http
        .get({ hostname: "127.0.0.1", port, path: put }, (res) => {
          const delovi = [];
          res.on("data", (deo) => delovi.push(deo));
          res.on("end", () => resolve({ status: res.statusCode, body: Buffer.concat(delovi).toString("utf8") }));
        })
        .on("error", reject);
    });
  }
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
    const spisak = await zahtev("/api/primeri");
    assert.equal(spisak.status, 200);
    const telo = JSON.parse(spisak.body);
    assert.equal(telo.podrazumevani, "kontrolna-soba");
    assert.equal(telo.primeri[0].id, "kontrolna-soba");
    assert.equal(telo.primeri.some((primer) => primer.naslov === "Funkcije"), true);

    const funkcije = await zahtev(`/api/primeri/fajlovi?id=${encodeURIComponent("2_fje")}`);
    assert.equal(funkcije.status, 200);
    const fajlovi = JSON.parse(funkcije.body);
    assert.equal(fajlovi.fajlovi.includes("src/closures1.js"), true);
    assert.equal(typeof fajlovi.verzije["src/closures1.js"], "string");

    const soba = await zahtev("/api/primeri/fajlovi?id=kontrolna-soba");
    assert.equal(JSON.parse(soba.body).ugradjen, true);

    const beg = await zahtev(`/api/primeri/fajlovi?id=${encodeURIComponent("../server")}`);
    assert.equal(beg.status, 404);
  } finally {
    if (proc.exitCode === null) {
      proc.kill();
      await new Promise((resolve) => proc.on("exit", resolve));
    }
  }
});
