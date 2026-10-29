import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const tsc = path.join(path.dirname(require.resolve("typescript/package.json")), "bin", "tsc");
const chromeBin = process.env.CHROME_BIN || "/opt/google/chrome/chrome";
const kurs = JSON.parse(fs.readFileSync(new URL("../site/kurs.json", import.meta.url), "utf8"));

function sviPrimeri() {
  return kurs.nedelje.flatMap((nedelja, i) =>
    (nedelja.dodatniPrimeri || []).map((primer) => ({ ...primer, nedelja: i + 1 })),
  );
}

function primer(id) {
  const nadjen = sviPrimeri().find((p) => p.id === id);
  assert.ok(nadjen, id);
  return nadjen;
}

function korak(naslov) {
  for (const nedelja of kurs.nedelje) {
    const nadjen = nedelja.steps.find((s) => s.naslov === naslov);
    if (nadjen) return nadjen;
  }
  assert.fail(naslov);
}

function runNode(code, timeout = 2500) {
  const wrapped = [
    "import { createRequire } from 'node:module';",
    "const require = createRequire('/workspace/package.json');",
    "const __logs = [];",
    "console.log = (...a) => __logs.push(a.map((v) => typeof v === 'string' ? v : JSON.stringify(v)).join(' '));",
    "const __report = (name, message) => { process.stdout.write(JSON.stringify({ throw: name, message, logs: __logs })); };",
    "process.on('unhandledRejection', (e) => { __report(e?.name || 'Rejection', String(e?.message || e)); process.exit(0); });",
    "process.on('beforeExit', () => { __report(null, ''); });",
    "try {",
    code,
    "} catch (e) { __report(e.name, e.message); process.exit(0); }",
  ].join("\n");
  return new Promise((resolve) => {
    const proc = spawn(process.execPath, ["--input-type=module", "-e", wrapped], {
      stdio: ["ignore", "pipe", "pipe"],
    });
    let out = "";
    let err = "";
    proc.stdout.on("data", (d) => {
      out += d;
    });
    proc.stderr.on("data", (d) => {
      err += d;
    });
    const timer = setTimeout(() => {
      proc.kill("SIGKILL");
      resolve({ timeout: true, out, err });
    }, timeout);
    proc.on("exit", () => {
      clearTimeout(timer);
      let parsed = null;
      try {
        parsed = JSON.parse(out.trim().split("\n").pop());
      } catch {
        parsed = null;
      }
      resolve({ timeout: false, parsed, out, err });
    });
  });
}

function logsOf(result) {
  assert.equal(result.timeout, false, result.err || result.out);
  assert.ok(result.parsed, result.out + result.err);
  return result.parsed;
}

function stdout(result) {
  const parsed = logsOf(result);
  assert.equal(parsed.throw, null, parsed.message);
  return parsed.logs.join(" ");
}

function syntaxCheck(code) {
  const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "sintaksa-")), "p.js");
  fs.writeFileSync(file, code);
  const run = spawnSync(process.execPath, ["--check", file], { encoding: "utf8" });
  return run.status === 0 ? "" : run.stderr || run.stdout;
}

function runSync(cmd, args, input) {
  return new Promise((resolve) => {
    const proc = spawn(cmd, args, { stdio: ["pipe", "pipe", "pipe"] });
    let out = "";
    let err = "";
    proc.stdout.on("data", (d) => {
      out += d;
    });
    proc.stderr.on("data", (d) => {
      err += d;
    });
    if (input) proc.stdin.end(input);
    else proc.stdin.end();
    proc.on("exit", (code) => resolve({ code, out, err }));
  });
}

function httpJson(method, port, urlPath) {
  return new Promise((resolve, reject) => {
    const req = http.request({ hostname: "127.0.0.1", port, path: urlPath, method }, (res) => {
      let body = "";
      res.on("data", (c) => {
        body += c;
      });
      res.on("end", () => resolve({ status: res.statusCode, body }));
    });
    req.on("error", reject);
    req.end();
  });
}

async function startChrome() {
  const port = 9344;
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "chrome-kurs-"));
  const proc = spawn(
    chromeBin,
    [
      "--headless=new",
      "--no-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
      `--remote-debugging-port=${port}`,
      "--remote-allow-origins=*",
      `--user-data-dir=${profile}`,
      "about:blank",
    ],
    { detached: true, stdio: "ignore" },
  );
  let version = null;
  for (let i = 0; i < 40; i += 1) {
    try {
      version = JSON.parse((await httpJson("GET", port, "/json/version")).body);
      break;
    } catch {
      await new Promise((r) => setTimeout(r, 100));
    }
  }
  if (!version) throw new Error("Chrome DevTools nije dostupan");
  return {
    port,
    async stop() {
      try {
        process.kill(-proc.pid, "SIGKILL");
      } catch {
        proc.kill("SIGKILL");
      }
      fs.rmSync(profile, { recursive: true, force: true });
    },
    async html(html, { width = 800, height = 600 } = {}) {
      const page = JSON.parse((await httpJson("PUT", port, "/json/new?about:blank")).body);
      const ws = new WebSocket(page.webSocketDebuggerUrl);
      let id = 0;
      const pending = new Map();
      const waiters = [];
      ws.addEventListener("message", (ev) => {
        const msg = JSON.parse(ev.data);
        if (msg.id && pending.has(msg.id)) {
          pending.get(msg.id)(msg);
          pending.delete(msg.id);
        }
        for (const waiter of waiters) waiter(msg);
      });
      await new Promise((resolve, reject) => {
        ws.addEventListener("open", resolve);
        ws.addEventListener("error", reject);
      });
      const send = (method, params) => {
        const msgId = ++id;
        return new Promise((resolve) => {
          pending.set(msgId, resolve);
          ws.send(JSON.stringify({ id: msgId, method, params }));
        });
      };
      await send("Page.enable");
      await send("Emulation.setDeviceMetricsOverride", {
        width,
        height,
        deviceScaleFactor: 1,
        mobile: false,
      });
      const loaded = new Promise((resolve) => {
        const timer = setTimeout(resolve, 1500);
        waiters.push((msg) => {
          if (msg.method === "Page.loadEventFired") {
            clearTimeout(timer);
            resolve();
          }
        });
      });
      await send("Page.navigate", { url: `data:text/html;charset=utf-8,${encodeURIComponent(html)}` });
      await loaded;
      const evaluated = await send("Runtime.evaluate", {
        expression: "document.body && document.body.dataset.result",
        returnByValue: true,
      });
      ws.close();
      await httpJson("GET", port, `/json/close/${page.id}`).catch(() => {});
      let value = evaluated.result?.result?.value;
      if (typeof value !== "string") {
        const htmlNow = await send("Runtime.evaluate", {
          expression: "document.documentElement ? document.documentElement.outerHTML.slice(0, 400) : 'nema'",
          returnByValue: true,
        });
        value = JSON.stringify({ evaluated, html: htmlNow.result?.result?.value, url: html.slice(0, 180) });
        throw new Error(value);
      }
      return value;
    },
  };
}

function page(parts) {
  return `<!doctype html><meta charset="utf-8"><body>${parts.html || ""}<script>
window.alert = () => {};
const __logs = [];
console.log = (...a) => __logs.push(a.map((v) => typeof v === "string" ? v : JSON.stringify(v)).join(" "));
let __throw = null;
let __posle = [];
try {
  ${parts.prep || ""}
  ${parts.code || ""}
  __posle = __logs.slice();
  ${parts.posle || ""}
} catch (e) { __throw = e.name + ": " + e.message; }
document.body.dataset.result = JSON.stringify({ logs: __logs, posle: __posle, throw: __throw });
</script></body>`;
}

async function uBrowseru(chrome, parts, width) {
  const raw = await chrome.html(page(parts), { width });
  return JSON.parse(raw);
}

function python(source) {
  return runSync("python3", ["-c", source]);
}

test("svi primeri se izvršavaju, a namerno pogrešni ne daju ispravan ishod", { timeout: 120_000 }, async (t) => {
  const chrome = await startChrome();
  t.after(() => chrome.stop());
  const vidjeni = new Set();
  const greske = [];

  function evidentiraj(id, ok, detalj) {
    vidjeni.add(id);
    console.log(`${ok ? "OK" : "FAIL"} ${id} ${detalj}`);
    if (!ok) greske.push(`${id}: ${detalj}`);
  }

  async function izlaz(id, ocekivano) {
    const rezultat = await runNode(primer(id).kod);
    const tekst = rezultat.parsed && !rezultat.parsed.throw ? rezultat.parsed.logs.join(" ") : JSON.stringify(rezultat);
    evidentiraj(id, tekst === ocekivano, tekst);
  }

  for (const [id, ocekivano] of [
    ["01-r01", "/soba ?uredjaj=2 #panel"],
    ["03-e01", "25"],
    ["03-e02", "off"],
    ["03-e04", "20 21"],
    ["03-r01", "1 false"],
    ["03-r02", "1 2 1"],
    ["05-e03", "string 24"],
    ["05-r02", "string 25"],
    ["06-e01", "A D C B"],
    ["06-e02", "C A D B"],
    ["06-r01", "1 4 3 2"],
    ["06-r02", "C A D B"],
    ["07-e01", "true"],
    ["07-e02", "false"],
    ["07-r01", "true"],
    ["07-r02", "true"],
    ["09-r02", "2"],
    ["10-r01", "false"],
  ]) {
    await izlaz(id, ocekivano);
  }

  {
    const id = "09-e02";
    const rezultat = logsOf(await runNode(primer(id).kod, 400));
    const tekst = rezultat.logs.join(" ");
    evidentiraj(id, tekst === "2" && !rezultat.throw, tekst);
  }

  {
    const id = "03-e03";
    const polomljen = logsOf(await runNode(primer(id).kod));
    const ispravan = stdout(await runNode('"use strict";\nconst prikaz = { v:24, show(){ return this.v; } };\nconst f=prikaz.show.bind(prikaz);\nconsole.log(f());'));
    evidentiraj(id, polomljen.throw === "TypeError" && ispravan === "24", `${polomljen.throw} / ${ispravan}`);
  }

  {
    const id = "03-r03";
    const polomljen = logsOf(await runNode(primer(id).kod));
    const ispravan = stdout(await runNode('"use strict";\nconst soba={temperatura:24, procitaj(){return this.temperatura;}};\nconst f = soba.procitaj.bind(soba); console.log(f());'));
    evidentiraj(id, polomljen.throw === "TypeError" && ispravan === "24", `${polomljen.throw} / ${ispravan}`);
  }

  {
    const id = "07-r03";
    const polomljen = stdout(await runNode(primer(id).kod));
    const ispravan = logsOf(await runNode('let ukljucen = false;\nconst body = JSON.parse(\'{"ukljucen":"da"}\');\nif (typeof body.ukljucen !== "boolean") throw new Error("neispravno telo");\nukljucen = body.ukljucen;\nconsole.log(typeof ukljucen);'));
    evidentiraj(id, polomljen === "string" && ispravan.throw === "Error", `${polomljen} / ${ispravan.throw}`);
  }

  {
    const id = "06-r04";
    const tekst = stdout(await runNode(primer(id).kod));
    evidentiraj(id, tekst === "P T", `tvrdnja da timer prethodi je netačna, izlaz je ${tekst}`);
  }

  const browser = async (id, parts, width, predikat, opis) => {
    const stanje = await uBrowseru(chrome, { code: primer(id).kod, ...parts }, width);
    const ok = predikat(stanje);
    evidentiraj(id, ok, opis(stanje));
  };

  await browser("04-r01", {}, 800, (s) => s.logs.join(" ") === "capture target bubble" && !s.throw, (s) => s.logs.join(" "));
  await browser("04-r02", {}, 800, (s) => s.logs.join(" ") === "27 24" && !s.throw, (s) => s.logs.join(" "));
  await browser(
    "04-e01",
    { prep: primer("04-e01").pripremaTestOkruzenja, posle: "button.click();" },
    800,
    (s) => s.posle.length === 0 && s.logs.join(" ") === "klik" && !s.throw,
    (s) => JSON.stringify(s),
  );
  await browser(
    "04-e02",
    { html: primer("04-e02").pripremaTestOkruzenja },
    800,
    (s) => s.logs.join(" ") === "24",
    (s) => s.logs.join(" ") || s.throw,
  );
  await browser(
    "04-e03",
    { prep: primer("04-e03").pripremaTestOkruzenja, posle: 'list.querySelector("button").click();' },
    800,
    (s) => s.posle.length === 0 && s.logs.join(" ") === "BUTTON",
    (s) => JSON.stringify(s),
  );
  await browser(
    "04-e04",
    { prep: primer("04-e04").pripremaTestOkruzenja, posle: "dugme.click();" },
    800,
    (s) => s.posle.join(" ") === "klik" && s.logs.join(" ") === "klik",
    (s) => `pre klika ${s.posle.join(" ")}; posle još jednog klika i dalje ${s.logs.join(" ")}`,
  );
  await browser(
    "04-r03",
    { posle: "b.click();" },
    800,
    (s) => s.posle.join(" ") === "klik" && s.logs.join(" ") === "klik",
    (s) => JSON.stringify(s),
  );
  {
    const stanje = await uBrowseru(chrome, {
      prep: 'const dugme=document.createElement("button"); document.body.append(dugme); function ukljuci(){console.log("klik")}; dugme.addEventListener("click", ukljuci);',
      posle: "dugme.click();",
    });
    evidentiraj("04-e04-popravka", stanje.posle.length === 0 && stanje.logs.join(" ") === "klik", JSON.stringify(stanje));
  }
  {
    const stanje = await uBrowseru(chrome, {
      code: 'function stanje(){console.log("klik")}; const b=document.createElement("button"); b.addEventListener("click", stanje);',
      posle: "b.click();",
    });
    evidentiraj("04-r03-popravka", stanje.posle.length === 0 && stanje.logs.join(" ") === "klik", JSON.stringify(stanje));
  }
  await browser("10-r02", {}, 800, (s) => s.logs.join(" ") === "true", (s) => s.logs.join(" ") || s.throw);

  const sakriveno = JSON.parse(await chrome.html(page({
    html: '<button id="ukljuci">Uključi</button>',
    code: 'document.querySelector("#ukljuci").hidden = true; console.log(String(document.querySelector("#ukljuci").hidden));',
  })));
  evidentiraj("10-e01", sakriveno.logs.join(" ") === "true" && !sakriveno.throw, sakriveno.logs.join(" ") || sakriveno.throw);

  const xss = JSON.parse(await chrome.html(page({
    prep: primer("10-e04").pripremaTestOkruzenja,
    code: primer("10-e04").kod + '\nconsole.log(String(element.querySelector("img") !== null));',
  })));
  const xssFix = JSON.parse(await chrome.html(page({
    prep: primer("10-e04").pripremaTestOkruzenja,
    code: 'const korisnik="<img src=x onerror=alert(1)>"; element.textContent=korisnik; console.log(String(element.querySelector("img")===null), element.textContent);',
  })));
  evidentiraj(
    "10-e04",
    xss.logs.join(" ") === "true" && xssFix.logs[0] === "true <img src=x onerror=alert(1)>",
    `innerHTML pravi img=${xss.logs.join(" ")}; textContent=${xssFix.logs.join(" | ")}`,
  );

  const kutija = await chrome.html(`<!doctype html><style>.box { width: 200px; padding: 20px; border: 2px solid; }</style><div class="box" id="b">Merenje</div><script>document.body.dataset.result = String(document.getElementById("b").offsetWidth);</script>`);
  evidentiraj("02-e01", kutija === "244", kutija);

  const razmak = JSON.parse(await chrome.html(`<!doctype html><body>
<div id="sa" style="display:flex;gap:8px"><button>A</button><button>B</button></div>
<div id="bez" style="display:flex"><button>A</button><button>B</button></div>
<script>
const a = document.querySelector("#sa button");
const b = document.querySelector("#bez button");
document.body.dataset.result = JSON.stringify({ gap: getComputedStyle(document.getElementById("sa")).gap, ista: a.offsetWidth === b.offsetWidth });
</script></body>`));
  evidentiraj("02-e02", razmak.gap === "8px" && razmak.ista === true, JSON.stringify(razmak));

  const boja = async (html) => chrome.html(`<!doctype html>${html}<script>document.body.dataset.result = getComputedStyle(document.querySelector("p, #temp, #displej, strong, .temperatura") ).color;</script>`);
  evidentiraj("02-e03", (await boja(primer("02-e03").kod)) === "rgb(255, 0, 0)", await boja(primer("02-e03").kod));
  const lose = await boja(primer("02-e04").kod);
  const popravkaBoje = await boja(primer("02-e04").kod.replace("#temperatura", ".temperatura"));
  evidentiraj("02-e04", lose === "rgb(0, 0, 0)" && popravkaBoje === "rgb(255, 0, 0)", `${lose} -> ${popravkaBoje}`);
  const dete = await chrome.html(`<!doctype html>${primer("02-r03").kod}<script>document.body.dataset.result = getComputedStyle(document.querySelector("strong")).color;</script>`);
  const deteFix = await chrome.html(`<!doctype html>${primer("02-r03").kod.replace(".digit > strong", ".digit strong")}<script>document.body.dataset.result = getComputedStyle(document.querySelector("strong")).color;</script>`);
  evidentiraj("02-r03", dete === "rgb(0, 0, 0)" && deteFix === "rgb(255, 0, 0)", `${dete} -> ${deteFix}`);
  const llm = await boja(primer("02-r04").kod);
  evidentiraj("02-r04", llm === "rgb(0, 0, 255)", `LLM kaže crveno, prikaz je ${llm}`);

  const kolone = async (css, sirina) => {
    const vrednost = await chrome.html(
      `<!doctype html><style>${css}</style><div class="panel" id="p"><div>Displej</div><div>Prekidač</div></div><script>document.body.dataset.result = getComputedStyle(document.getElementById("p")).gridTemplateColumns;</script>`,
      { width: sirina, height: 600 },
    );
    return vrednost.trim().split(/\s+/).length;
  };
  const e05siroko = await kolone(primer("02-e05").kod, 800);
  const e05usko = await kolone(primer("02-e05").kod, 500);
  evidentiraj("02-e05", e05siroko === 2 && e05usko === 1, `${e05siroko} kolona na 800px, ${e05usko} na 500px`);
  evidentiraj("02-r02", (await kolone(primer("02-r02").kod, 550)) === 1, "550px");

  const flex = JSON.parse(await chrome.html(`<!doctype html>${primer("02-r01").kod}<script>
const p = document.querySelector("div");
const [a, b] = p.children;
document.body.dataset.result = JSON.stringify({ a: a.offsetWidth, b: b.offsetWidth, client: p.clientWidth, scroll: p.scrollWidth });
</script>`));
  evidentiraj("02-r01", flex.a === 100 && flex.b === 100 && flex.scroll > flex.client && flex.client === 180, JSON.stringify(flex));

  const staticki = await chrome.html(`${primer("01-e04").kod}<script>const uredjaj = 27; document.body.dataset.result = document.querySelector("#temp").textContent + "|" + uredjaj;</script>`);
  evidentiraj("01-e04", staticki === "24 °C|27", staticki);

  {
    const id = "05-e04";
    const polomljen = stdout(await runNode('const headers = {}; const res = { writeHead(s, h){ this.status = s; Object.assign(headers, h || {}); }, end(b){ this.body = b; } };\n' + primer(id).kod + '\nconsole.log(headers["Content-Type"] || "nema", res.body);'));
    const ispravan = stdout(await runNode('const headers = {}; const res = { writeHead(s, h){ this.status = s; Object.assign(headers, h || {}); }, end(b){ this.body = b; } };\nres.writeHead(200,{"Content-Type":"application/json; charset=utf-8"});\nres.end(JSON.stringify({t:24}));\nconsole.log(headers["Content-Type"]);'));
    evidentiraj(id, polomljen.startsWith("nema ") && ispravan === "application/json; charset=utf-8", `${polomljen} / ${ispravan}`);
  }

  {
    const id = "05-r01";
    const tekst = stdout(await runNode(`
const httpMod = require("node:http");
let handler;
const original = httpMod.createServer;
httpMod.createServer = (fn) => { handler = fn; return original.call(httpMod, fn); };
${primer(id).kod}
const res = { status: 0, body: "", writeHead(s){ this.status = s; }, end(b){ this.body = b; } };
handler({}, res);
console.log(res.status, res.body);
`));
    evidentiraj(id, tekst === "404 nema", tekst);
  }

  {
    const id = "05-r03";
    const izvor = primer(id).kod.replace(
      ".listen(8787)",
      '.listen(0,"127.0.0.1",function(){console.log("PORT "+this.address().port)})',
    );
    const proc = spawn(process.execPath, ["-e", izvor], { stdio: ["ignore", "pipe", "pipe"] });
    let portLog = "";
    proc.stdout.on("data", (d) => {
      portLog += d;
    });
    const port = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(portLog || "nema porta")), 2000);
      const proveri = () => {
        const m = portLog.match(/PORT (\d+)/);
        if (!m) return;
        clearTimeout(timer);
        resolve(Number(m[1]));
      };
      proc.stdout.on("data", proveri);
      proveri();
    });
    const hung = await new Promise((resolve) => {
      const req = http.get({ hostname: "127.0.0.1", port, path: "/" }, (res) => {
        res.on("data", () => {});
        res.on("end", () => resolve(false));
      });
      req.setTimeout(400, () => {
        req.destroy();
        resolve(true);
      });
      req.on("error", () => resolve(true));
    });
    proc.kill("SIGKILL");
    const fixFile = `const http=require('node:http'); const server=http.createServer((req,res)=>{ res.statusCode=200; res.end('ok'); }); server.listen(0,'127.0.0.1', async () => { const r = await fetch('http://127.0.0.1:'+server.address().port+'/'); const t = await r.text(); console.log(r.status, t); server.close(); });`;
    const fix = await runSync(process.execPath, ["-e", fixFile]);
    evidentiraj(id, hung === true && fix.out.includes("200 ok"), `visenje=${hung}; popravka=${fix.out.trim()}`);
  }

  async function fetch500(id, kod, ocekujeGresku) {
    const rezultat = logsOf(await runNode(`
const show = (...a) => console.log("SHOW", ...a.map((v) => typeof v === "string" ? v : JSON.stringify(v)));
const showError = (e) => console.log("ERR", e && e.message ? e.message : e);
const fetch = async () => new Response(JSON.stringify({greska:"simulirano"}), {status:500, headers:{"Content-Type":"application/json"}});
${kod}
`));
    const tekst = rezultat.logs.join(" | ");
    const pogresnoPrikazuje = tekst.includes("simulirano") && !tekst.includes("ERR") && !rezultat.throw;
    evidentiraj(id, ocekujeGresku ? !pogresnoPrikazuje : pogresnoPrikazuje, tekst || rezultat.throw);
  }
  await fetch500("06-e03", primer("06-e03").kod, false);
  await fetch500("06-e03-popravka", 'try {const r=await fetch("/api/soba"); if(!r.ok) throw new Error(`HTTP ${r.status}`); show(await r.json())} catch(e){showError(e)}', true);
  await fetch500("06-r03", primer("06-r03").kod + "\nconsole.log(JSON.stringify(await procitaj()));", false);
  await fetch500("06-r03-popravka", 'async function procitaj(){ const r=await fetch("/api/soba"); if(!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); }\ntry { console.log("SHOW", JSON.stringify(await procitaj())); } catch(e) { console.log("ERR", e.message); }', true);
  await fetch500("11-e03", primer("11-e03").kod, false);
  await fetch500("11-e03-popravka", 'const r=await fetch("/api/soba"); if(!r.ok) throw new Error(`HTTP ${r.status}`); show(await r.json());', true);
  await fetch500("11-r03", primer("11-r03").kod, false);
  await fetch500(
    "11-r03-popravka",
    `async function procitaj() {
  const odgovor = await fetch("/api/soba");
  if (!odgovor.ok) throw new Error("HTTP " + odgovor.status);
  const telo = await odgovor.json();
  if (typeof telo.temperatura !== "number") throw new Error("Neispravno očitavanje");
  return telo;
}
procitaj().then((v) => console.log("SHOW", JSON.stringify(v))).catch((e) => console.log("ERR", e.message));`,
    true,
  );

  {
    const id = "07-e03";
    const polomljen = stdout(await runNode(`
const form = { valid: true };
const data = { ukljucen: "da" };
const fetch = async (url, opts) => { console.log("POSLATO", opts.body); return { ok: true }; };
${primer(id).kod}
await new Promise((r) => setTimeout(r, 0));
`));
    const ispravan = logsOf(await runNode(`
const data = { ukljucen: "da" };
function badRequest(){ throw new Error("bad"); }
if (typeof data?.ukljucen !== "boolean") badRequest();
`));
    evidentiraj(id, polomljen.includes('POSLATO {"ukljucen":"da"}') && ispravan.throw === "Error", `${polomljen} / ${ispravan.throw}`);
  }

  {
    const id = "08-e01";
    const naziv = "a'; DROP TABLE ventilator;--";
    const polomljen = await python(`
import sqlite3
naziv = ${JSON.stringify(naziv)}
sql = "UPDATE ventilator SET naziv = '%s' WHERE id=1" % naziv
con = sqlite3.connect(":memory:")
c = con.cursor()
c.execute("CREATE TABLE ventilator (id INTEGER PRIMARY KEY, naziv TEXT)")
c.execute("INSERT INTO ventilator VALUES (1, 'stari')")
try:
    c.executescript(sql)
except Exception as e:
    print("ERR", type(e).__name__)
print("TABELE", c.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall())
`);
    const ispravan = await python(`
import sqlite3
naziv = ${JSON.stringify(naziv)}
con = sqlite3.connect(":memory:")
c = con.cursor()
c.execute("CREATE TABLE ventilator (id INTEGER PRIMARY KEY, naziv TEXT)")
c.execute("INSERT INTO ventilator VALUES (1, 'stari')")
c.execute("UPDATE ventilator SET naziv=$1 WHERE id=1", {"1": naziv})
print(c.execute("SELECT naziv FROM ventilator").fetchone()[0])
print(c.execute("SELECT count(*) FROM sqlite_master WHERE type='table'").fetchone()[0])
`);
    const lose = polomljen.out.includes("TABELE []");
    const dobro = ispravan.out.includes(naziv) && ispravan.out.includes("\n1");
    evidentiraj(id, lose && dobro && polomljen.code === 0 && ispravan.code === 0, `drop=${polomljen.out.trim()} param=${ispravan.out.trim()}`);
  }

  {
    const sql = await python(`
import sqlite3
con = sqlite3.connect(":memory:")
c = con.cursor()
c.execute("CREATE TABLE ventilator (id INTEGER PRIMARY KEY, ukljucen INTEGER)")
c.execute("CREATE TABLE istorija (komanda TEXT)")
c.execute("INSERT INTO ventilator VALUES (1, 0)")
c.executescript("""
BEGIN;
UPDATE ventilator SET ukljucen=true WHERE id=1;
INSERT INTO istorija(komanda) VALUES ('on');
ROLLBACK;
""")
print("e02", c.execute("SELECT ukljucen FROM ventilator").fetchone()[0], c.execute("SELECT COUNT(*) FROM istorija").fetchone()[0])
c.execute("BEGIN")
c.execute("UPDATE ventilator SET ukljucen=1 WHERE id=1")
c.execute("ROLLBACK")
print("r02", c.execute("SELECT ukljucen FROM ventilator").fetchone()[0])
print("r01", c.execute("SELECT id FROM ventilator WHERE id = $1", {"1": 1}).fetchone()[0])
`);
    const redovi = sql.out.trim().split("\n");
    evidentiraj("08-e02", redovi[0] === "e02 0 0", redovi[0] || sql.err);
    evidentiraj("08-r02", redovi[1] === "r02 0", redovi[1] || sql.err);
    evidentiraj("08-r01", redovi[2] === "r01 1", redovi[2] || sql.err);
  }

  async function pool(kod) {
    return logsOf(await runNode(`
const trag = [];
const pool = {
  async query(sql) { const n = trag.length % 2; trag.push(n + ":" + sql); },
  async connect() {
    const log = [];
    return { async query(sql){ log.push(sql); console.log("ISTA", log.length); }, async release(){} };
  }
};
${kod}
console.log(trag.join("|"));
`));
  }
  {
    const polomljen = await pool(primer("08-e04").kod);
    const ispravan = await pool('const client=await pool.connect(); try {await client.query("BEGIN"); await client.query("UPDATE ventilator SET ukljucen=true"); await client.query("COMMIT")} catch(e){await client.query("ROLLBACK");throw e} finally{client.release()}');
    const razdvojeno = polomljen.logs.some((l) => l.startsWith("0:BEGIN") && l.includes("1:UPDATE") && l.includes("0:COMMIT"));
    evidentiraj("08-e04", razdvojeno && ispravan.logs.filter((l) => l.startsWith("ISTA")).length === 3, polomljen.logs.join(" ; "));
    const polomljen2 = await pool(primer("08-r03").kod);
    evidentiraj("08-r03", polomljen2.logs.some((l) => l.includes("0:BEGIN") && l.includes("1:UPDATE")), polomljen2.logs.join(" ; "));
  }

  {
    const id = "09-r03";
    const polomljen = stdout(await runNode(primer(id).kod));
    const ispravan = stdout(await runNode(`
const poznataVerzija = 12;
const prikazi = v => console.log(v);
const odgovor = {version:11, temperatura:22};
if (odgovor.version >= poznataVerzija) prikazi(odgovor.temperatura);
console.log("kraj");
`));
    evidentiraj(id, polomljen === "22" && ispravan === "kraj", `${polomljen} / ${ispravan}`);
  }

  {
    const id = "11-e04";
    const trka = stdout(await runNode(`
const shown = [];
const show = (v) => { shown.push(v); console.log(v.t); };
let n = 0;
const fetch = () => {
  const id = ++n;
  const delay = id === 1 ? 40 : 5;
  const value = id === 1 ? { t: 24 } : { t: 26 };
  return new Promise((res) => setTimeout(() => res({ json: async () => value }), delay));
};
async function tick(){ const r = await fetch("/api/soba"); show(await r.json()); }
await Promise.all([tick(), tick()]);
console.log("poslednje", shown.at(-1).t);
`));
    evidentiraj(id, tekstPoslednje(trka) === 24, trka);
  }

  async function kompilacija(id, kod, ocekivaniIzlaz) {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ts-"));
    const fajl = path.join(dir, "p.ts");
    fs.writeFileSync(fajl, kod);
    const prevod = await runSync(process.execPath, [tsc, "--strict", "--noEmit", "--target", "ES2022", "--module", "commonjs", "--lib", "es2022,dom", fajl]);
    const izvrsen = await runSync(process.execPath, ["--experimental-strip-types", fajl]);
    const izlaz = izvrsen.out.trim();
    evidentiraj(id, prevod.code === 0 && izlaz === ocekivaniIzlaz, `tsc=${prevod.code} ${prevod.err.trim()} izlaz=${izlaz}`);
  }
  await kompilacija("11-e02", primer("11-e02").kod, "string");
  await kompilacija("11-r02", primer("11-r02").kod, "string");

  const konceptualni = sviPrimeri().filter((p) => p.jezik === "text").map((p) => p.id);
  for (const id of konceptualni) {
    const p = primer(id);
    const ok = p.okruzenje === "konceptualni-zapis" || p.okruzenje === "analiza-llm";
    const tacan = (p.opcije || []).filter((o) => o.ok);
    evidentiraj(id, ok && tacan.length === 1 && tacan[0].text === p.tacanOdgovor && p.ocekivaniRezultat === p.tacanOdgovor, p.okruzenje);
  }

  const sintakse = [];
  for (const nedelja of kurs.nedelje) {
    for (const kor of nedelja.steps) {
      for (const [jezik, kod] of [
        [kor.isecakJezik, kor.isecak],
        [kor.originalJezik, kor.original],
        [kor.samostalniPrimer?.jezik, kor.samostalniPrimer?.tekst],
      ]) {
        if (jezik === "javascript" && kod) {
          const greska = syntaxCheck(kod);
          if (greska) sintakse.push(`${kor.naslov}: ${greska.split("\n")[0]}`);
        }
      }
    }
    for (const p of nedelja.dodatniPrimeri || []) {
      if (p.jezik === "javascript") {
        const greska = syntaxCheck(p.kod);
        if (greska) sintakse.push(`${p.id}: ${greska.split("\n")[0]}`);
      }
    }
  }
  evidentiraj("sintaksa-js", sintakse.length === 0, sintakse.join("; ") || "svi JS isečci prolaze node --check");

  const primitiv = stdout(await runNode(korak("Primitivna vrednost i referenca").samostalniPrimer.tekst));
  evidentiraj("sam-primitiv", primitiv === "24 25", primitiv);
  const proto = stdout(await runNode(korak("Prototipski lanac").samostalniPrimer.tekst));
  evidentiraj("sam-proto", proto === "off", proto);
  const metod = logsOf(await runNode(korak("Metode, this i klase").samostalniPrimer.tekst));
  evidentiraj("sam-this", metod.logs.join(" ") === "3" && metod.throw === "TypeError", JSON.stringify(metod));
  const klasa = stdout(await runNode(korak("Class je sintaksa iznad prototipa").samostalniPrimer.tekst));
  evidentiraj("sam-class", klasa === "true", klasa);
  const petlja = stdout(await runNode(korak("Event loop: redosled izvršavanja").samostalniPrimer.tekst));
  evidentiraj("sam-loop", petlja === "A D C B", petlja);
  const cekanje = stdout(await runNode(korak("async/await ne blokira stranicu").samostalniPrimer.tekst));
  evidentiraj("sam-async", cekanje === "1 3 2", cekanje);
  const mehur = JSON.parse(await chrome.html(page({
    prep: 'const outer=document.createElement("div"); const inner=document.createElement("button"); outer.append(inner); document.body.append(outer);',
    code: korak("Event bubbling").samostalniPrimer.tekst,
    posle: "inner.click();",
  })));
  evidentiraj("sam-bubble", mehur.logs.join(" ") === "inner outer", mehur.logs.join(" "));
  const spec = await chrome.html(`<!doctype html><style>.broj { color: blue; } #v { color: red; }</style><p id="v" class="broj">24</p><script>document.body.dataset.result=getComputedStyle(document.getElementById("v")).color;</script>`);
  evidentiraj("sam-spec", spec === "rgb(255, 0, 0)", spec);
  const closure = stdout(await runNode(korak("Closure").isecak + "\nconst f = granica(24);\nconsole.log(f(24), f(23));"));
  evidentiraj("sam-closure", closure === "true false", closure);
  const pad = await python(`
import sqlite3, os, tempfile
p = tempfile.mktemp()
con = sqlite3.connect(p)
c = con.cursor()
c.execute("CREATE TABLE ventilator (id INTEGER PRIMARY KEY, ukljucen INTEGER)")
c.execute("CREATE TABLE istorija (komanda TEXT)")
c.execute("INSERT INTO ventilator VALUES (1, 0)")
con.commit()
c.execute("BEGIN")
c.execute("UPDATE ventilator SET ukljucen=1 WHERE id=1")
c.execute("INSERT INTO istorija(komanda) VALUES ('on')")
con.close()
con = sqlite3.connect(p)
print(con.execute("SELECT ukljucen FROM ventilator").fetchone()[0], con.execute("SELECT COUNT(*) FROM istorija").fetchone()[0])
`);
  evidentiraj("sam-rollback", pad.out.trim() === "0 0", pad.out.trim() || pad.err);
  const commit = await python(`
import sqlite3
con = sqlite3.connect(":memory:")
c = con.cursor()
c.execute("CREATE TABLE ventilator (id INTEGER PRIMARY KEY, ukljucen INTEGER)")
c.execute("CREATE TABLE istorija (komanda TEXT)")
c.execute("INSERT INTO ventilator VALUES (1, 0)")
c.executescript("""BEGIN;
UPDATE ventilator SET ukljucen=true WHERE id=1;
INSERT INTO istorija(komanda) VALUES ('on');
COMMIT;""")
print(c.execute("SELECT ukljucen FROM ventilator").fetchone()[0], c.execute("SELECT COUNT(*) FROM istorija").fetchone()[0])
`);
  evidentiraj("sam-commit", commit.out.trim() === "1 1", commit.out.trim() || commit.err);
  const dirTs = fs.mkdtempSync(path.join(os.tmpdir(), "ts-sam-"));
  fs.writeFileSync(path.join(dirTs, "p.ts"), 'declare const response: { json(): Promise<unknown> };\n' + korak("Tip nije validacija").samostalniPrimer.tekst + "\nexport {};\n");
  const tsOk = await runSync(process.execPath, [tsc, "--strict", "--noEmit", "--target", "ES2022", "--module", "es2022", "--lib", "es2022,dom", path.join(dirTs, "p.ts")]);
  fs.writeFileSync(path.join(dirTs, "r.ts"), 'const response = { async json() { return { temperatura: "nepoznato" }; } };\n' + korak("Tip nije validacija").samostalniPrimer.tekst);
  const tsRun = await runSync(process.execPath, ["--experimental-strip-types", path.join(dirTs, "r.ts")]);
  evidentiraj("sam-ts", tsOk.code === 0 && tsRun.code !== 0 && /toFixed/.test(tsRun.err), `tsc=${tsOk.code} run=${tsRun.code} ${tsRun.err.split("\n")[0]}`);
  const tip = fs.mkdtempSync(path.join(os.tmpdir(), "ts-tip-"));
  fs.writeFileSync(path.join(tip, "p.ts"), korak("Anotacija").isecak + "\nexport {};\n");
  const tipRun = await runSync(process.execPath, [tsc, "--strict", "--noEmit", "--target", "ES2022", "--module", "commonjs", path.join(tip, "p.ts")]);
  evidentiraj("sam-anotacija", tipRun.code === 0, tipRun.err.trim() || "tsc 0");

  const ocekivani = new Set(sviPrimeri().map((p) => p.id));
  for (const id of ["04-e04-popravka", "04-r03-popravka", "06-e03-popravka", "06-r03-popravka", "11-e03-popravka", "11-r03-popravka", "sintaksa-js", "sam-primitiv", "sam-proto", "sam-this", "sam-class", "sam-loop", "sam-async", "sam-bubble", "sam-spec", "sam-closure", "sam-rollback", "sam-commit", "sam-ts", "sam-anotacija"]) {
    ocekivani.add(id);
  }
  const fali = [...ocekivani].filter((id) => !vidjeni.has(id));
  const visak = [...vidjeni].filter((id) => !ocekivani.has(id));
  assert.deepEqual(fali, [], "nije provereno");
  assert.deepEqual(visak, []);
  assert.deepEqual(greske, []);
});

function tekstPoslednje(tekst) {
  const m = tekst.match(/poslednje (\d+)/);
  return m ? Number(m[1]) : null;
}
