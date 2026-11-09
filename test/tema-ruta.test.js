const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const net = require("node:net");
const test = require("node:test");

function slobodanPort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      server.close((greska) => (greska ? reject(greska) : resolve(port)));
    });
  });
}

test("GET /tema i /uvod vraćaju stranicu časa", async () => {
  const port = await slobodanPort();
  const dete = spawn(process.execPath, ["server/server.js"], {
    env: { ...process.env, PORT: String(port), DATABASE_URL: "" },
    stdio: "ignore",
  });
  const koren = `http://127.0.0.1:${port}`;
  async function sačekaj(put) {
    let poslednja = "";
    for (let i = 0; i < 50; i++) {
      try {
        return await fetch(`${koren}${put}`);
      } catch (greska) {
        poslednja = greska.message;
        await new Promise((resolve) => setTimeout(resolve, 40));
      }
    }
    throw new Error(`nema odgovora ${put}: ${poslednja}`);
  }
  try {
    const tema = await sačekaj("/tema/2/k/1/deo/diskusija");
    assert.equal(tema.status, 200);
    assert.match(await tema.text(), /<title>Web programiranje<\/title>/);
    const uvod = await sačekaj("/uvod");
    assert.equal(uvod.status, 200);
    assert.match(await uvod.text(), /href="\/uvod"/);
    const css = await sačekaj("/css/site.css");
    assert.equal(css.status, 200);
    const nema = await sačekaj("/nema-ove-putanje");
    assert.equal(nema.status, 404);
  } finally {
    dete.kill("SIGTERM");
    await new Promise((resolve) => {
      if (dete.exitCode !== null) resolve();
      else dete.once("exit", resolve);
    });
  }
});
