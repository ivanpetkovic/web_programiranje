const assert = require("node:assert/strict");
const http = require("node:http");
const path = require("node:path");
const { spawn } = require("node:child_process");
const test = require("node:test");

const KORENI = path.join(__dirname, "..");
const PORT = 8807;

function zahtev(method, put) {
  return new Promise((resolve, reject) => {
    const req = http.request({ hostname: "127.0.0.1", port: PORT, path: put, method }, (res) => {
      const delovi = [];
      res.on("data", (deo) => delovi.push(deo));
      res.on("end", () => resolve({ status: res.statusCode, body: Buffer.concat(delovi).toString("utf8") }));
    });
    req.on("error", reject);
    req.end();
  });
}

test("pojmovnik je sirov spisak, a soba i dalje vraća očitavanje", async () => {
  const proc = spawn(process.execPath, ["server/server.js"], {
    cwd: KORENI,
    env: { ...process.env, PORT: String(PORT), DATABASE_URL: "postgresql://soba:soba@127.0.0.1:5432/soba" },
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
      proc.on("exit", () => {
        clearTimeout(rok);
        reject(new Error(dnevnik || "server je stao"));
      });
      proveri();
    });
    const spisak = await zahtev("GET", "/pojmovnik");
    assert.equal(spisak.status, 200);
    assert.match(spisak.body, /\*\*Kontrolna soba\*\*/);
    const soba = await zahtev("GET", "/api/soba");
    assert.equal(soba.status, 200);
    const telo = JSON.parse(soba.body);
    assert.equal(typeof telo.temperatura, "number");
    assert.equal(typeof telo.ukljucen, "boolean");
  } finally {
    proc.kill("SIGTERM");
  }
});
