import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const css = fs.readFileSync(new URL("../site/css/site.css", import.meta.url), "utf8");
const main = fs.readFileSync(new URL("../site/js/main.js", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../site/index.html", import.meta.url), "utf8");
const editor = fs.readFileSync(new URL("../site/js/cm-editor.js", import.meta.url), "utf8");

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

const ugalj = tokeni(blok(css, "(?:^|[^\\w-]):root\\s*\\{"));
const ugaljZakucan = tokeni(blok(css, 'html\\[data-tema="ugalj"\\]\\s*\\{'));
const mornar = tokeni(blok(css, 'html\\[data-tema="mornar"\\]\\s*\\{'));
const pesak = tokeni(blok(css, 'html\\[data-tema="pesak"\\]\\s*\\{'));
const terakota = tokeni(blok(css, 'html\\[data-tema="terakota"\\]\\s*\\{'));
const pesakSistem = tokeni(blok(css, ":root:not\\(\\[data-tema\\]\\)\\s*\\{"));
const palete = { ugalj, ugaljZakucan, mornar, pesak, terakota, pesakSistem };

test("svaka paleta drži kontrast, zlato samo na tamnima, bunar taman", () => {
  assert.match(css, /@media\s*\(\s*prefers-color-scheme:\s*light\s*\)/);
  assert.deepEqual(ugalj, ugaljZakucan);
  assert.deepEqual(pesak, pesakSistem);
  assert.match(blok(css, "(?:^|[^\\w-]):root\\s*\\{"), /color-scheme:\s*dark/);
  assert.match(blok(css, 'html\\[data-tema="ugalj"\\]\\s*\\{'), /color-scheme:\s*dark/);
  assert.match(blok(css, 'html\\[data-tema="mornar"\\]\\s*\\{'), /color-scheme:\s*dark/);
  assert.match(blok(css, 'html\\[data-tema="pesak"\\]\\s*\\{'), /color-scheme:\s*light/);
  assert.match(blok(css, 'html\\[data-tema="terakota"\\]\\s*\\{'), /color-scheme:\s*light/);
  assert.match(blok(css, ":root:not\\(\\[data-tema\\]\\)\\s*\\{"), /color-scheme:\s*light/);
  for (const [ime, tema] of Object.entries(palete)) {
    assert.equal(tema.chart, "#111111", ime);
    assert.ok(kontrast(tema.amber, tema.paper) >= 4.5, `${ime} korak`);
    assert.ok(kontrast(tema.muted, tema.paper) >= 4.5, `${ime} beleške`);
    assert.ok(kontrast(tema.amber, tema.paper) >= 3, `${ime} cifre`);
    assert.ok(kontrast(tema.ink, tema.bg) >= 4.5, `${ime} mastilo`);
    assert.ok(kontrast(tema["on-amber"], tema.amber) >= 4.5, `${ime} hod`);
    assert.ok(kontrast(tema["diff-dodato"], tema.code) >= 4.5, `${ime} dodato`);
    assert.ok(kontrast(tema["diff-obrisano"], tema.code) >= 4.5, `${ime} obrisano`);
    assert.ok(kontrast("#ffb000", tema.chart) >= 3, `${ime} bunar`);
  }
  for (const tema of [ugalj, mornar]) {
    assert.equal(tema.amber, "#ffb000");
    assert.equal(tema.korak, "#ffb000");
    assert.equal(tema["korak-buduci"], "#d9d3c7");
    assert.ok(kontrast(tema["korak-buduci"], tema.paper) >= 3, "buduci");
    assert.equal(tema.naslov, "#f7f4ee");
    assert.equal(tema["on-amber"], "#1a1204");
  }
  for (const tema of [pesak, terakota]) {
    assert.notEqual(tema.amber, "#ffb000");
    assert.equal(tema.korak, tema.amber);
    assert.equal(tema["korak-buduci"], "#8f897f");
    assert.ok(kontrast(tema["korak-buduci"], tema.paper) >= 3, "buduci");
    assert.equal(tema.naslov, tema.ink);
  }
  assert.equal(pesakSistem.korak, pesak.korak);
  assert.equal(pesakSistem.naslov, pesak.naslov);
  assert.equal(mornar.bg, "#011835");
  assert.equal(mornar.paper, "#051c38");
  assert.equal(mornar.code, "#081b33");
  assert.equal(pesak.bg, "#fbfbfb");
  assert.equal(pesak.paper, "#fefefe");
  assert.equal(pesak.amber, "#a86300");
  assert.equal(terakota.bg, "#fcf4eb");
  assert.equal(terakota.paper, "#fef8f1");
  assert.equal(terakota.amber, "#b81400");
  assert.match(css, /#grafikon\s*\{[^}]*background:\s*var\(--chart\)/);
  assert.match(css, /pre\s*\{[^}]*background:\s*var\(--code\)/);
  assert.match(css, /\.skip:focus\s*\{[^}]*color:\s*var\(--on-amber\)/);
});

test("zakucana tema se čita pre stilova", () => {
  const skripta = html.indexOf('localStorage.getItem("tema")');
  const stil = html.indexOf('href="/css/site.css"');
  assert.ok(skripta > 0 && skripta < stil);
  assert.match(html, /tamna:\s*"ugalj"/);
  assert.match(html, /svetla:\s*"pesak"/);
  assert.match(html, /mornar:\s*"mornar"/);
  assert.match(html, /ugalj:\s*"ugalj"/);
  assert.match(html, /pesak:\s*"pesak"/);
  assert.match(html, /terakota:\s*"terakota"/);
  assert.match(html, /document\.documentElement\.dataset\.tema = tema/);
  assert.match(html, /catch\s*\(/);
});

test("gradivo, jedna kolona i birač", () => {
  assert.match(html, /id="tab-koraci"[^>]*>Gradivo</);
  assert.match(html, /Gradivo, Diskusija i Editor su tri taba/);
  assert.match(html, /otvaraju taj korak u Gradivu/);
  assert.equal(html.includes(">Koraci<"), false);
  assert.equal(html.includes(">Uređivač<"), false);
  assert.equal(html.includes('id="koraci-kontrole"'), false);
  assert.equal(main.includes("#koraci-kontrole"), false);
  assert.equal(main.includes("pill.textContent"), false);
  const tabovi = html.indexOf('class="cas-tabovi"');
  const mesto = html.indexOf('id="birac-mesto"');
  const sekcija = html.indexOf('id="sekcija-koraci"');
  assert.ok(mesto > 0 && mesto < tabovi && tabovi < sekcija);
  assert.equal(html.match(/id="birac-mesto"/g).length, 1);
  assert.match(main, /querySelector\("#birac-mesto"\)/);
  assert.match(main, /biracMesto\.replaceChildren\(birac\)/);
  assert.equal(main.includes("casEl.append(birac"), false);
  assert.match(main, /casEl\.append\(metaKoraka, naslovKoraka, \.\.\.proza, kljucna\)/);
  assert.match(css, /\.opcije-mreza\s*\{\s*display:\s*grid;\s*grid-template-columns:\s*1fr;\s*gap:\s*0\.55rem;\s*\}/);
  assert.equal(/@media\s*\(\s*min-width:\s*861px\s*\)\s*\{[^}]*\.opcije-mreza\s*\{\s*grid-template-columns:\s*1fr\s+1fr/.test(css), false);
  assert.equal(main.includes('className = "hod-koraka"'), false);
  assert.equal(css.includes(".hod-koraka"), false);
  assert.match(main, /className = "sledeci-korak"/);
  assert.equal(main.includes("Napredak kroz korake"), false);
  assert.equal(main.includes("progressbar"), false);
  assert.equal(main.includes("((i + 1) / item.steps.length) * 100"), false);
  assert.match(main, /aria-label", "Koraci"/);
  assert.match(main, /item\.steps\.forEach\(\(korakNed, ki\) => \{[\s\S]*krug\.className = ki <= i \? "birac-krug birac-krug-dosegnut" : "birac-krug birac-krug-buduci"/);
  assert.match(main, /krug\.setAttribute\("aria-label", `\$\{ki \+ 1\} \$\{korakNed\.naslov\}`\)/);
  assert.match(main, /krug\.setAttribute\("aria-current", "step"\)/);
  assert.equal(/krug\.className[\s\S]{0,120}sacuvani/.test(main), false);
  assert.match(main, /korakPoCasu\.set\(cas, ki\)/);
  assert.match(main, /naslovBiraca\.textContent = korak\.naslov/);
  assert.match(main, /Korak \$\{i \+ 1\} od \$\{item\.steps\.length\}/);
  assert.match(main, /saIkonom\(sviKoraci, "menu", "Svi koraci"\)/);
  assert.match(main, /ikonica\("chevron-left"\)/);
  assert.match(main, /ikonica\("chevron-right"\)/);
  assert.equal(main.includes("Sledeći korak časa"), false);
  assert.equal(main.includes("function strelica"), false);
  assert.equal(html.includes('id="sledeci" class="hod-koraka"'), false);
  assert.equal(html.includes('id="sledeci" class="sledeci-korak"'), false);
  const sledeci = blok(css, "\\.sledeci-korak\\s*\\{");
  assert.match(sledeci, /background:\s*var\(--ink\)/);
  assert.match(sledeci, /color:\s*var\(--paper\)/);
  assert.equal(sledeci.includes("var(--amber)"), false);
  for (const [ime, tema] of [["ugalj", ugalj], ["mornar", mornar], ["pesak", pesak], ["terakota", terakota]]) {
    assert.ok(kontrast(tema.ink, tema.paper) >= 4.5, ime);
  }
  const segment = blok(css, '\\.segment button\\[aria-pressed="true"\\]\\s*\\{');
  assert.match(segment, /background:\s*var\(--amber\)/);
  assert.match(segment, /color:\s*var\(--on-amber\)/);
  const stablo = blok(css, '\\.tree button\\[aria-current="true"\\]\\s*\\{');
  assert.match(stablo, /background:\s*var\(--amber-dim\)/);
  const tab = blok(css, '\\.cas-tabovi button\\[aria-selected="true"\\]\\s*\\{');
  assert.match(tab, /border-color:\s*var\(--amber\)/);
  assert.match(tab, /background:\s*var\(--amber-dim\)/);
  assert.equal(html.includes('id="mrvice"'), false);
  assert.equal(html.includes('id="podnaslov-casa"'), false);
  assert.equal(html.includes('id="preduslov"'), false);
  assert.equal(css.includes(".preduslov"), false);
  assert.equal(main.includes("Preduslov:"), false);
});

test("boje razlike prate token palete", () => {
  assert.match(css, /\.cm-linija-dodato[^{]*\{[^}]*var\(--diff-dodato\)/);
  assert.match(css, /\.cm-linija-obrisano[^{]*\{[^}]*var\(--diff-obrisano\)/);
});

test("spisak tema zakuca paletu i ne pomera čas", () => {
  for (const natpis of ["Mornar", "Ugalj", "Pesak", "Terakota"]) {
    assert.match(main, new RegExp(natpis));
  }
  assert.match(main, /return window\.matchMedia\("\(prefers-color-scheme: light\)"\)\.matches \? "pesak" : "ugalj"/);
  const telo = main.slice(main.indexOf("function zakucajTemu"), main.indexOf("for (const [id, natpis] of TEME)"));
  assert.match(telo, /dataset\.tema = id/);
  assert.match(telo, /localStorage\.setItem\("tema", id\)/);
  assert.equal(telo.includes("otvoriNedelju"), false);
  assert.equal(telo.includes("cas ="), false);
  assert.match(telo, /if \(pogled\) osveziEditor\(\)/);
});

test("editor prati četiri teme", () => {
  assert.match(editor, /zakucana === "mornar" \|\| zakucana === "ugalj"/);
  assert.match(editor, /zakucana === "pesak" \|\| zakucana === "terakota"/);
  assert.equal(editor.includes('zakucana === "tamna"'), false);
  assert.equal(editor.includes('zakucana === "svetla"'), false);
  assert.match(main, /postaviPogled\(pogled/);
});

test("red koraka koristi ćilibar, a beleške ostaju prigušene", () => {
  assert.match(main, /broj\.className = "korak"/);
  assert.match(main, /Korak \$\{i \+ 1\} od \$\{item\.steps\.length\}/);
  assert.match(css, /\.korak\s*\{\s*color:\s*var\(--korak\);\s*\}/);
  assert.match(css, /\.brand\s*\{\s*color:\s*var\(--amber\)/);
  assert.match(css, /#kartica-popuna\s*\{[^}]*background:\s*var\(--amber\)/);
  assert.equal(css.includes(".koraci-kontrole"), false);
  assert.equal(css.includes(".birac-traka"), false);
  const mesto = blok(css, "#birac-mesto\\s*\\{");
  assert.match(mesto, /justify-self:\s*start/);
  assert.match(mesto, /max-width:\s*100%/);
  const birac = blok(css, "\\.birac\\s*\\{");
  assert.match(birac, /width:\s*max-content/);
  assert.match(birac, /max-width:\s*100%/);
  assert.equal(birac.includes("overflow:"), false);
  assert.equal(/\.birac-red > div:nth-child\(2\)\s*\{[^}]*flex:\s*1/.test(css), false);
  const naslov = blok(css, "\\.birac-naslov\\s*\\{");
  assert.match(naslov, /max-width:\s*16rem/);
  assert.match(naslov, /text-overflow:\s*ellipsis/);
  const krugovi = blok(css, "\\.birac-krugovi\\s*\\{");
  assert.match(krugovi, /display:\s*flex/);
  assert.match(krugovi, /flex-wrap:\s*wrap/);
  assert.match(krugovi, /gap:\s*0\.35rem/);
  assert.equal(krugovi.includes("%"), false);
  const krug = blok(css, "\\.birac-krug\\s*\\{");
  assert.match(krug, /width:\s*0\.7rem/);
  assert.match(krug, /height:\s*0\.7rem/);
  assert.match(krug, /border-radius:\s*999px/);
  assert.match(krug, /font-size:\s*0/);
  assert.match(css, /\.birac-krug-dosegnut\s*\{[^}]*background:\s*var\(--amber\)/);
  assert.match(css, /\.birac-krug-buduci\s*\{[^}]*background:\s*var\(--korak-buduci\)/);
  assert.equal(ugalj.amber, "#ffb000");
  assert.equal(mornar.amber, "#ffb000");
  assert.match(css, /\.option\.izabrano\s*\{[^}]*border-color:\s*var\(--amber\)/);
  assert.match(css, /font-family:\s*system-ui,\s*"Segoe UI",\s*sans-serif/);
  assert.match(css, /\.cas-glava h1\s*\{\s*color:\s*var\(--naslov\)/);
  assert.match(css, /\.digit\s*\{[^}]*font-family:\s*"Digital-7 Mono"/);
  assert.match(css, /\.meta,\s*\.starost,\s*\.log\s*\{\s*color:\s*var\(--muted\);\s*\}/);
});
