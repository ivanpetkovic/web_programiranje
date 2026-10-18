const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.env.PORT) || 8787;
const ROOT = path.join(__dirname, "..", "site");
const FONT = path.join(
  __dirname,
  "..",
  "assets",
  "fonts",
  "digital-7",
  "digital-7 (mono).ttf"
);

const SESIJE = new Map([
  ["kljuc-posmatraca", "posmatrac"],
  ["kljuc-operatera", "operater"],
]);

const state = {
  temperatura: 24,
  ukljucen: false,
  prikljucen: true,
  proveriUlogu: false,
  takt: false,
};

const sse = new Set();

function snapshot() {
  return {
    temperatura: state.temperatura,
    ukljucen: state.ukljucen,
    prikljucen: state.prikljucen,
  };
}

function broadcast() {
  const chunk = `data: ${JSON.stringify(snapshot())}\n\n`;
  for (const res of sse) res.write(chunk);
}

setInterval(() => {
  if (!state.takt) return;
  state.temperatura += state.ukljucen ? -0.5 : 0.5;
  state.temperatura = Math.round(state.temperatura * 10) / 10;
  if (state.temperatura < 16) state.temperatura = 16;
  if (state.temperatura > 40) state.temperatura = 40;
  broadcast();
}, 1000);

function send(res, status, body, headers = {}) {
  const payload = body === undefined ? "" : JSON.stringify(body);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    ...headers,
  });
  res.end(payload);
}

function cookie(req) {
  const raw = req.headers.cookie || "";
  const hit = raw.split(";").map((p) => p.trim()).find((p) => p.startsWith("sesija="));
  return hit ? decodeURIComponent(hit.slice("sesija=".length)) : "";
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > 4096) {
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

async function jsonBody(req) {
  const text = await readBody(req);
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    throw Object.assign(new Error("json"), { status: 400, body: { greska: "neispravan json" } });
  }
}

function commandGate(req, res) {
  if (!state.proveriUlogu) return true;
  const key = cookie(req);
  if (!key || !SESIJE.has(key)) {
    send(res, 401, { greska: "nema sesije" });
    return false;
  }
  if (SESIJE.get(key) !== "operater") {
    send(res, 403, { greska: "posmatrac" });
    return false;
  }
  return true;
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
    res.writeHead(200, { "content-type": types[ext] || "application/octet-stream" });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  try {
    if (req.method === "GET" && url.pathname === "/api/soba") {
      if (!state.prikljucen) {
        send(res, 500, { greska: "ventilator nije prikljucen" });
        return;
      }
      const body = { temperatura: state.temperatura, ukljucen: state.ukljucen };
      if (url.searchParams.get("svezina") === "1") body.trenutak = new Date().toISOString();
      send(res, 200, body);
      return;
    }

    if (req.method === "PUT" && url.pathname === "/api/ventilator") {
      if (!commandGate(req, res)) return;
      const body = await jsonBody(req);
      if (typeof body.ukljucen !== "boolean" || Object.keys(body).some((k) => k !== "ukljucen")) {
        send(res, 400, { greska: "telo nije boolean rezim" });
        return;
      }
      if (body.ukljucen && !state.prikljucen) {
        send(res, 500, { greska: "ventilator nije prikljucen" });
        return;
      }
      state.ukljucen = body.ukljucen;
      broadcast();
      send(res, 200, { ukljucen: state.ukljucen });
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
      const key = body.koja === "operater" ? "kljuc-operatera" : body.koja === "posmatrac" ? "kljuc-posmatraca" : "";
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

    if (req.method === "GET") {
      const rel = url.pathname === "/" ? "/index.html" : url.pathname;
      const file = path.normalize(path.join(ROOT, rel));
      if (!file.startsWith(ROOT)) {
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

server.listen(PORT, "0.0.0.0", () => {
  console.log(`kutija http://127.0.0.1:${PORT}`);
});
