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
  assert.equal(tamna.korak, "#ffb000");
  assert.equal(tamna.zlato, "#e8a317");
  assert.equal(tamna["na-zlatu"], "#1a1204");
  assert.equal(tamna.bg, "#100f0c");
  assert.equal(tamna.paper, "#1c1a16");
  assert.equal(tamna.naslov, "#f7f4ee");
  assert.equal(tamna.chart, "#111111");
  assert.match(blok(css, "(?:^|[^\\w-]):root\\s*\\{"), /color-scheme:\s*dark/);
  assert.ok(kontrast("#ffb000", "#111111") >= 3);
  assert.ok(kontrast(tamna.amber, tamna.paper) >= 3, "cifre");
});

test("svetla tema čita korak, beleške i cifre, a bunar ostaje taman", () => {
  assert.match(css, /@media\s*\(\s*prefers-color-scheme:\s*light\s*\)/);
  for (const svetla of [svetlaZakucana, svetlaSistem]) {
    assert.equal(svetla.korak, "#8a5600");
    assert.notEqual(svetla.korak, "#ffb000");
    assert.equal(svetla.zlato, "#e8a317");
    assert.equal(svetla["na-zlatu"], "#1a1204");
    assert.equal(svetla.muted, "#5e564c");
    assert.equal(svetla.good, "#3f6212");
    assert.equal(svetla.bad, "#9f2d22");
    assert.equal(svetla.paper, "#ffffff");
    assert.equal(svetla.bg, "#fafafb");
    assert.equal(svetla.ink, "#1c2430");
    assert.equal(svetla.naslov, "#0a0a36");
    assert.equal(svetla.chart, "#111111");
    assert.ok(kontrast(svetla.korak, svetla.paper) >= 4.5, "korak");
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

test("jedno dugme teme nosi ikonicu i ime sledeće teme", () => {
  assert.equal(html.match(/id="tema"/g).length, 1);
  assert.equal(html.includes(">Svetla tema<"), false);
  assert.equal(html.includes(">Tamna tema<"), false);
  assert.match(main, /const sledeca = temaSada\(\) === "tamna" \? "Svetla tema" : "Tamna tema"/);
  assert.match(main, /temaDugme\.setAttribute\("aria-label", sledeca\)/);
  assert.match(main, /temaDugme\.replaceChildren\(ikonaTeme/);
  assert.match(main, /document\.documentElement\.dataset\.tema = sledeca/);
  assert.match(main, /localStorage\.setItem\("tema", sledeca\)/);
});

test("zakucana tema se čita pre stilova", () => {
  const skripta = html.indexOf('localStorage.getItem("tema")');
  const stil = html.indexOf('href="/css/site.css"');
  assert.ok(skripta > 0 && skripta < stil);
  assert.match(html, /tema === "tamna" \|\| tema === "svetla"/);
  assert.match(html, /document\.documentElement\.dataset\.tema = tema/);
  assert.match(html, /catch\s*\(/);
});

test("gradivo, jedna kolona i žuti hod", () => {
  assert.match(html, /id="tab-koraci"[^>]*>Gradivo</);
  assert.match(html, /Gradivo, Diskusija i Editor su tri taba/);
  assert.match(html, /otvaraju taj korak u Gradivu/);
  assert.equal(html.includes(">Koraci<"), false);
  assert.match(html, /aria-label="Gradivo nedelje"/);
  assert.match(css, /\.opcije-mreza\s*\{\s*display:\s*grid;\s*grid-template-columns:\s*1fr;\s*gap:\s*0\.55rem;\s*\}/);
  assert.match(css, /@media\s*\(\s*min-width:\s*861px\s*\)\s*\{\s*\.opcije-mreza\s*\{\s*grid-template-columns:\s*1fr\s+1fr;\s*\}/);
  const hod = blok(css, "\\.hod-koraka\\s*\\{");
  assert.match(hod, /background:\s*#ffb000/);
  assert.match(hod, /color:\s*#1a1204/);
  assert.ok(kontrast("#ffb000", "#1a1204") >= 4.5, "žuti hod");
  assert.match(main, /className = "hod-koraka"/);
  assert.match(main, /trakaKoraka\.append\(prethodni, broj, daljeKorak/);
  assert.match(main, /strelica\("levo"\)/);
  assert.match(main, /strelica\("desno"\)/);
  assert.equal(main.includes('hod.append(prethodni, daljeKorak)'), false);
  assert.equal(css.includes("#sledeci"), false);
  assert.equal(html.includes('id="sledeci" class="hod-koraka"'), false);
});

test("boje razlike drže kontrast u obe teme", () => {
  assert.ok(kontrast(tamna["diff-dodato"], tamna.code) >= 4.5, "tamno dodato");
  assert.ok(kontrast(tamna["diff-obrisano"], tamna.code) >= 4.5, "tamno obrisano");
  for (const svetla of [svetlaZakucana, svetlaSistem]) {
    assert.ok(kontrast(svetla["diff-dodato"], svetla.code) >= 4.5, "svetlo dodato");
    assert.ok(kontrast(svetla["diff-obrisano"], svetla.code) >= 4.5, "svetlo obrisano");
  }
  assert.match(css, /\.cm-linija-dodato[^{]*\{[^}]*var\(--diff-dodato\)/);
  assert.match(css, /\.cm-linija-obrisano[^{]*\{[^}]*var\(--diff-obrisano\)/);
});

test("red koraka koristi ćilibar, a beleške ostaju prigušene", () => {
  assert.match(main, /broj\.className = "korak"/);
  assert.match(main, /Korak \$\{i \+ 1\} od \$\{item\.steps\.length\}/);
  assert.match(css, /\.korak\s*\{\s*color:\s*var\(--korak\);\s*\}/);
  assert.match(css, /\.brand\s*\{\s*color:\s*var\(--zlato\)/);
  assert.match(css, /#kartica-popuna\s*\{[^}]*background:\s*var\(--zlato\)/);
  assert.match(css, /\.koraci-kontrole button\[aria-current="page"\]\s*\{[^}]*background:\s*var\(--zlato\)/);
  assert.match(css, /\.option\.izabrano\s*\{[^}]*border-color:\s*var\(--zlato\)/);
  assert.match(css, /font-family:\s*system-ui,\s*"Segoe UI",\s*sans-serif/);
  assert.match(css, /\.cas-glava h1\s*\{\s*color:\s*var\(--naslov\)/);
  assert.match(css, /\.digit\s*\{[^}]*font-family:\s*"Digital-7 Mono"/);
  assert.match(css, /\.meta,\s*\.starost,\s*\.log\s*\{\s*color:\s*var\(--muted\);\s*\}/);
});
