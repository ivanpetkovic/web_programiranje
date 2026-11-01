import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { lectures } from "../site/js/lectures.js";

const html = fs.readFileSync(new URL("../site/index.html", import.meta.url), "utf8");
const main = fs.readFileSync(new URL("../site/js/main.js", import.meta.url), "utf8");

test("diskusija je podrazumevani tab, gradivo je skriveno", () => {
  assert.match(html, /id="tab-diskusija"[^>]*aria-selected="true"/);
  assert.match(html, /id="sekcija-koraci"[^>]*hidden/);
  assert.equal(html.includes('id="sekcija-diskusija" hidden'), false);
  assert.match(main, /let deo = "diskusija"/);
  assert.match(main, /else if \(n !== cas\) deo = "diskusija"/);
});

test("pitalica koraka ide u diskusiju, ne u gradivo", () => {
  assert.match(main, /pitalicaKoraka\.className = "pitalica-koraka"/);
  assert.match(main, /diskusijaMesto\.replaceChildren\(pitalicaKoraka, nacrtajDiskusiju\(item\)\)/);
  assert.equal(main.includes("casEl.append(pitanjeBlok"), false);
  assert.match(main, /Pitalica ovog koraka je na Diskusiji/);
  assert.match(main, /Tekst lekcije ovog koraka je na Gradivu/);
  assert.match(main, /naslov\.textContent = model\.naslov === "Rezerva" \? "Rezerva" : "Pitanje teme"/);
});

test("pretraga pitanja otvara diskusiju, a primer gradivo", () => {
  assert.match(main, /stavka\.vrsta === "pitanje" \? "diskusija" : "koraci"/);
  assert.match(main, /otvoriTemu\(lekcije\.prvi\.tema, lekcije\.prvi\.korak, "koraci"\)/);
});

test("pitalice prve teme idu od potrebe, a zaključci ostaju", () => {
  const tema = lectures[0];
  const pitalica = (naslov) => tema.steps.find((korak) => korak.naslov === naslov).pitalica;
  const tacan = (naslov) => tema.steps.find((korak) => korak.naslov === naslov).opcije.find((opcija) => opcija.ok).text;
  assert.match(pitalica("LO"), /potrebu za stranicom/);
  assert.match(pitalica("Paket"), /Zašto je uopšte seći poruku/);
  assert.match(pitalica("HTTP kao dogovor"), /404 ipak moraju da postoje/);
  assert.match(tacan("LO"), /1969.*nije Web/);
  assert.match(tacan("TCP i UDP"), /Kadar sme da se odbaci/);
  assert.match(tacan("Ajax"), /Dokument ostaje/);
  for (const korak of lectures.flatMap((cas) => cas.steps)) {
    assert.ok(korak.pitalica.length > 40, korak.naslov);
    assert.equal(korak.opcije.filter((opcija) => opcija.ok).length, 1);
    for (const opcija of korak.opcije) assert.ok(opcija.why.length > 30, `${korak.naslov} ${opcija.key}`);
  }
});
