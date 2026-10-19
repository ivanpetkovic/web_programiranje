import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const css = fs.readFileSync(new URL("../site/css/site.css", import.meta.url), "utf8");
const main = fs.readFileSync(new URL("../site/js/main.js", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../site/index.html", import.meta.url), "utf8");

function lin(kanal) {
  const c = kanal / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function kontrast(a, b) {
  const lum = (hex) => {
    const h = hex.slice(1);
    const r = lin(parseInt(h.slice(0, 2), 16));
    const g = lin(parseInt(h.slice(2, 4), 16));
    const bl = lin(parseInt(h.slice(4, 6), 16));
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const svetlo = Math.max(lum(a), lum(b));
  const tamno = Math.min(lum(a), lum(b));
  return (svetlo + 0.05) / (tamno + 0.05);
}

function blok(izvor, pocetak) {
  const re = new RegExp(pocetak, "g");
  const nadjeni = [];
  let m;
  while ((m = re.exec(izvor))) {
    const otvor = izvor.indexOf("{", m.index);
    let dubina = 0;
    let i = otvor;
    for (; i < izvor.length; i++) {
      if (izvor[i] === "{") dubina += 1;
      else if (izvor[i] === "}") {
        dubina -= 1;
        if (dubina === 0) break;
      }
    }
    nadjeni.push(izvor.slice(otvor + 1, i));
  }
  assert.equal(nadjeni.length, 1, pocetak);
  return nadjeni[0];
}

function tokeni(tekst) {
  const izlaz = {};
  for (const m of tekst.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})/g)) {
    izlaz[m[1]] = m[2].toLowerCase();
  }
  return izlaz;
}

const tamna = tokeni(blok(css, "(?:^|[^\\w-]):root\\s*\\{"));
const svetlaZakucana = tokeni(blok(css, 'html\\[data-tema="svetla"\\]\\s*\\{'));
const svetlaSistem = tokeni(blok(css, ":root:not\\(\\[data-tema\\]\\)\\s*\\{"));

test("tamni ćilibar ostaje žut, a bunar taman", () => {
  assert.equal(tamna.amber, "#ffb000");
  assert.equal(tamna.chart, "#111111");
  assert.match(blok(css, "(?:^|[^\\w-]):root\\s*\\{"), /color-scheme:\s*dark/);
  assert.ok(kontrast("#ffb000", "#111111") >= 3);
});

test("svetla tema čita korak, beleške i cifre, a bunar ostaje taman", () => {
  assert.match(css, /@media\s*\(\s*prefers-color-scheme:\s*light\s*\)/);
  for (const svetla of [svetlaZakucana, svetlaSistem]) {
    assert.equal(svetla.amber, "#8a5600");
    assert.notEqual(svetla.amber, "#ffb000");
    assert.equal(svetla.muted, "#5e564c");
    assert.equal(svetla["on-amber"], "#fffdf8");
    assert.equal(svetla.good, "#3f6212");
    assert.equal(svetla.bad, "#9f2d22");
    assert.equal(svetla.paper, "#fffdf8");
    assert.equal(svetla.ink, "#1c1a16");
    assert.equal(svetla.chart, "#111111");
    assert.ok(kontrast(svetla.amber, svetla.paper) >= 4.5, "korak");
    assert.ok(kontrast(svetla.muted, svetla.paper) >= 4.5, "beleške");
    assert.ok(kontrast(svetla.amber, svetla.paper) >= 3, "cifre");
    assert.ok(kontrast(svetla.ink, svetla.bg) >= 4.5, "mastilo");
  }
  assert.match(blok(css, 'html\\[data-tema="svetla"\\]\\s*\\{'), /color-scheme:\s*light/);
  assert.match(blok(css, ":root:not\\(\\[data-tema\\]\\)\\s*\\{"), /color-scheme:\s*light/);
  assert.match(css, /#grafikon\s*\{[^}]*background:\s*var\(--chart\)/);
  assert.match(css, /pre\s*\{[^}]*background:\s*var\(--code\)/);
  assert.match(css, /\.skip:focus\s*\{[^}]*color:\s*var\(--on-amber\)/);
});

test("zakucana tema se čita pre stilova", () => {
  const skripta = html.indexOf('localStorage.getItem("tema")');
  const stil = html.indexOf('href="/css/site.css"');
  assert.ok(skripta > 0 && skripta < stil);
  assert.match(html, /tema === "tamna" \|\| tema === "svetla"/);
  assert.match(html, /document\.documentElement\.dataset\.tema = tema/);
  assert.match(html, /catch\s*\(/);
});

test("red koraka koristi ćilibar, a beleške ostaju prigušene", () => {
  assert.match(main, /broj\.className = "korak"/);
  assert.match(main, /Korak \$\{i \+ 1\} od \$\{item\.steps\.length\}/);
  assert.match(css, /\.korak\s*\{\s*color:\s*var\(--amber\);\s*\}/);
  assert.match(css, /\.meta,\s*\.starost,\s*\.log\s*\{\s*color:\s*var\(--muted\);\s*\}/);
});
