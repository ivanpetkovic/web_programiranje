const http = require("http");
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { state, sse, snapshot, broadcast } = require("./stanje");
const { initDb, getDb } = require("./baza");

const PORT = Number(process.env.PORT) || 8787;
const SITE = path.join(__dirname, "..", "site");
const CLIENT = path.join(__dirname, "..", "client");
const FONT = path.join(__dirname, "..", "assets", "fonts", "digital-7", "digital-7 (mono).ttf");
const SIDES = { client: CLIENT, server: __dirname };
const HOT = new Set(["soba.js", "ventilator.js", "sesija.js"]);
const BOOT = new Set(["server.js", "stanje.js", "baza.js"]);

function fresh(name) {
  const file = path.join(__dirname, name);
  delete require.cache[require.resolve(file)];
  return require(file);
}

function send(res, status, body, headers = {}) {
  const payload = body === undefined ? "" : JSON.stringify(body);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    ...headers,
  });
  res.end(payload);
}

function readBody(req, limit) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > limit) {
        reject(Object.assign(new Error("veliko"), { status: 400 }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

async function jsonBody(req, limit = 4096) {
  const text = await readBody(req, limit);
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    throw Object.assign(new Error("json"), { status: 400, body: { greska: "neispravan json" } });
  }
}

function serveFile(res, file) {
  const ext = path.extname(file);
  const types = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".ttf": "font/ttf",
    ".svg": "image/svg+xml",
  };
  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      res.end("nema");
      return;
    }
    res.writeHead(200, {
      "content-type": types[ext] || "application/octet-stream",
      "cache-control": "no-store",
    });
    res.end(data);
  });
}

function listFiles(root) {
  const out = [];
  function walk(dir) {
    for (const name of fs.readdirSync(dir)) {
      if (name === "prepared" || name === "node_modules") continue;
      const full = path.join(dir, name);
      if (fs.statSync(full).isDirectory()) walk(full);
      else out.push(path.relative(root, full).split(path.sep).join("/"));
    }
  }
  walk(root);
  return out.sort();
}

function resolveFile(strana, put) {
  const root = SIDES[strana];
  if (!root || typeof put !== "string" || put.length === 0 || put.length > 200) return null;
  if (put.includes("\0") || path.isAbsolute(put)) return null;
  const rel = path.normalize(put);
  if (rel.startsWith("..") || rel.split(path.sep).includes("..")) return null;
  const parts = rel.split(path.sep);
  if (parts.includes("prepared") || parts.includes("node_modules")) return null;
  const file = path.join(root, rel);
  const back = path.relative(root, file);
  if (back.startsWith("..") || path.isAbsolute(back)) return null;
  return file;
}

function reloadIfHot(file) {
  const base = path.basename(file);
  if (!HOT.has(base)) return;
  delete require.cache[require.resolve(file)];
  require(file);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  try {
    if (req.method === "GET" && url.pathname === "/api/soba") {
      const result = await fresh("soba.js").citaj({
        state,
        db: getDb(),
        svezina: url.searchParams.get("svezina") === "1",
      });
      send(res, result.status, result.body);
      return;
    }

    if (req.method === "PUT" && url.pathname === "/api/ventilator") {
      const odbijeno = fresh("sesija.js").uloga(req, state.proveriUlogu);
      if (odbijeno) {
        send(res, odbijeno.status, odbijeno.body);
        return;
      }
      const body = await jsonBody(req);
      const result = await fresh("ventilator.js").komanda({ state, db: getDb() }, body);
      if (result.status === 200) broadcast();
      send(res, result.status, result.body);
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/stablo") {
      const strana = url.searchParams.get("strana");
      if (!SIDES[strana]) {
        send(res, 400, { greska: "nepoznata strana" });
        return;
      }
      send(res, 200, { fajlovi: listFiles(SIDES[strana]) });
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/fajl") {
      const file = resolveFile(url.searchParams.get("strana"), url.searchParams.get("put"));
      if (!file || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
        send(res, 404, { greska: "nema fajla" });
        return;
      }
      send(res, 200, { izvor: fs.readFileSync(file, "utf8") });
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/fajl") {
      const body = await jsonBody(req, 200000);
      const file = resolveFile(body.strana, body.put);
      if (!file || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
        send(res, 404, { greska: "nema fajla" });
        return;
      }
      if (typeof body.izvor !== "string") {
        send(res, 400, { greska: "nema izvora" });
        return;
      }
      if (file.endsWith(".js")) {
        try {
          new vm.Script(body.izvor, { filename: body.put });
        } catch (err) {
          send(res, 400, { greska: err.message });
          return;
        }
      }
      const previous = fs.readFileSync(file, "utf8");
      fs.writeFileSync(file, body.izvor);
      try {
        reloadIfHot(file);
      } catch (err) {
        fs.writeFileSync(file, previous);
        reloadIfHot(file);
        send(res, 400, { greska: err.message });
        return;
      }
      send(res, 200, { sacuvan: true, pokretanje: BOOT.has(path.basename(file)) });
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/fajl/povrati") {
      const body = await jsonBody(req);
      const file = resolveFile(body.strana, body.put);
      const root = SIDES[body.strana];
      if (!file || !root) {
        send(res, 404, { greska: "nema fajla" });
        return;
      }
      const prepared = path.join(root, "prepared", path.relative(root, file));
      if (!fs.existsSync(prepared)) {
        send(res, 404, { greska: "nema pripremljene verzije" });
        return;
      }
      fs.copyFileSync(prepared, file);
      reloadIfHot(file);
      send(res, 200, {
        izvor: fs.readFileSync(file, "utf8"),
        pokretanje: BOOT.has(path.basename(file)),
      });
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/sesija") {
      const body = await jsonBody(req);
      if (!body.koja) {
        send(res, 204, undefined, {
          "set-cookie": "sesija=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax",
          "content-type": "text/plain; charset=utf-8",
        });
        return;
      }
      const key = fresh("sesija.js").kljucZa(body.koja);
      if (!key) {
        send(res, 400, { greska: "nepoznata sesija" });
        return;
      }
      send(res, 204, undefined, {
        "set-cookie": `sesija=${key}; HttpOnly; Path=/; SameSite=Lax`,
        "content-type": "text/plain; charset=utf-8",
      });
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/prikljucen") {
      const body = await jsonBody(req);
      state.prikljucen = Boolean(body.prikljucen);
      if (!state.prikljucen) state.ukljucen = false;
      broadcast();
      send(res, 200, { prikljucen: state.prikljucen });
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/takt") {
      const body = await jsonBody(req);
      state.takt = Boolean(body.ukljucen);
      send(res, 200, { takt: state.takt });
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/uloge") {
      const body = await jsonBody(req);
      state.proveriUlogu = Boolean(body.ukljucen);
      send(res, 200, { proveriUlogu: state.proveriUlogu });
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/baza") {
      const body = await jsonBody(req);
      state.baza = Boolean(body.ukljucen);
      send(res, 200, { baza: state.baza, dostupna: Boolean(getDb()) });
      return;
    }

    if (req.method === "GET" && url.pathname === "/dovod") {
      res.writeHead(200, {
        "content-type": "text/event-stream; charset=utf-8",
        "cache-control": "no-store",
        connection: "keep-alive",
      });
      res.write(`data: ${JSON.stringify(snapshot())}\n\n`);
      sse.add(res);
      req.on("close", () => sse.delete(res));
      return;
    }

    if (req.method === "GET" && url.pathname === "/fonts/digital-7-mono.ttf") {
      serveFile(res, FONT);
      return;
    }

    if (req.method === "GET" && url.pathname.startsWith("/client/")) {
      const rel = decodeURIComponent(url.pathname.slice("/client/".length));
      const file = resolveFile("client", rel);
      if (!file) {
        res.writeHead(403);
        res.end();
        return;
      }
      serveFile(res, file);
      return;
    }

    if (req.method === "GET") {
      const rel = url.pathname === "/" ? "/index.html" : url.pathname;
      const file = path.normalize(path.join(SITE, rel));
      if (file !== SITE && !file.startsWith(SITE + path.sep)) {
        res.writeHead(403);
        res.end();
        return;
      }
      serveFile(res, file);
      return;
    }

    send(res, 404, { greska: "nema putanje" });
  } catch (err) {
    if (!res.headersSent) send(res, err.status || 500, err.body || { greska: "kvar" });
  }
});

initDb()
  .catch((err) => {
    console.error("baza nije dostupna:", err.message);
  })
  .finally(() => {
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`kontrolna soba http://127.0.0.1:${PORT}`);
    });
  });
