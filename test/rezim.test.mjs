import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import {
  FONT_KLJUC,
  jePredavanje,
  podrazumevaniTab,
  procitajRezim,
  procitajSkaluFonta,
  REZIM_KLJUC,
  upisiRezim,
  upisiSkaluFonta,
} from "../site/js/rezim.js";

const css = fs.readFileSync(new URL("../site/css/site.css", import.meta.url), "utf8");
const main = fs.readFileSync(new URL("../site/js/main.js", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../site/index.html", import.meta.url), "utf8");

test("režim se čuva i podrazumevani tab zavisi od moda", () => {
  const skladiste = {
    mapa: {},
    getItem(k) {
      return this.mapa[k] ?? null;
    },
    setItem(k, v) {
      this.mapa[k] = String(v);
    },
  };
  assert.equal(procitajRezim(skladiste), "samostalno");
  assert.equal(podrazumevaniTab(procitajRezim(skladiste)), "koraci");
  upisiRezim(skladiste, "predavanje");
  assert.equal(procitajRezim(skladiste), "predavanje");
  assert.equal(jePredavanje(procitajRezim(skladiste)), true);
  assert.equal(podrazumevaniTab(procitajRezim(skladiste)), "diskusija");
  upisiSkaluFonta(skladiste, 1.1);
  assert.equal(procitajSkaluFonta(skladiste), 1.1);
  upisiSkaluFonta(skladiste, 9);
  assert.equal(procitajSkaluFonta(skladiste), 1.2);
});

test("sajt vezuje režim, panel i font", () => {
  assert.match(main, /from "\.\/rezim\.js"/);
  assert.match(main, /sklopiPanelAkoPredavanje/);
  assert.match(main, /podrazumevaniTab\(/);
  assert.match(css, /body\.rezim-predavanje/);
  assert.match(css, /--sadrzaj-font/);
  assert.match(html, /rezim-segment/);
  assert.match(html, /id="podesavanja-font"/);
  assert.equal(html.includes(REZIM_KLJUC), false);
  assert.equal(html.includes(FONT_KLJUC), false);
});
