import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const html = fs.readFileSync(new URL("../site/index.html", import.meta.url), "utf8");
const main = fs.readFileSync(new URL("../site/js/main.js", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../site/css/site.css", import.meta.url), "utf8");

test("predavanja i samostalni rad", () => {
  assert.match(html, /id="mod-predavanja"/);
  assert.match(html, />Predavanja</);
  assert.match(html, /id="mod-samostalni"/);
  assert.match(html, />Samostalni rad</);
  assert.match(html, /id="font-segment"/);
  assert.match(html, /data-skala="1"/);
  assert.match(html, /dataset\.mod = mod === "samostalni" \? "samostalni" : "predavanja"/);
  assert.match(html, /web-programiranje:mod/);
  assert.match(html, /web-programiranje:font/);
  assert.match(main, /function modPredavanja\(\)/);
  assert.match(main, /function podrazumevaniDeo\(\) \{\n  return modPredavanja\(\) \? "diskusija" : "koraci";\n\}/);
  assert.match(main, /let deo = podrazumevaniDeo\(\)/);
  assert.match(main, /function sakrijPanelSelekcije\(\) \{\n  if \(!modPredavanja\(\)\) return;/);
  assert.match(main, /sakrijPanelSelekcije\(\);\n  if \(location\.hash !== `#cas-\$\{n\}`\)/);
  assert.match(main, /if \(modPredavanja\(\)\) zatvoriMobilIzborSheetove\(\)/);
  assert.match(main, /if \(!uvod && deo !== "editor"\) deo = podrazumevaniDeo\(\)/);
  assert.match(main, /pitalica-samo-ikona/);
  assert.match(css, /--skala-predavanja:\s*1\.3/);
  assert.match(css, /html\[data-mod="predavanja"\]\s*\{\s*font-size:\s*calc\(16px \* var\(--skala-predavanja\)\)/);
  assert.match(css, /html\[data-mod="predavanja"\] \.top #font-segment \{ display: none; \}/);
});
