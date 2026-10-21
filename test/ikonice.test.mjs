import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const pomocnik = fs.readFileSync(new URL("../site/js/ikonice.js", import.meta.url), "utf8");
const sprite = fs.readFileSync(new URL("../site/icons/sprite.svg", import.meta.url), "utf8");
const main = fs.readFileSync(new URL("../site/js/main.js", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../site/index.html", import.meta.url), "utf8");
const izvor = `${main}\n${html}`;

test("pomoćnik crta currentColor preko use i ne vuče PNG", () => {
  assert.match(pomocnik, /createElementNS\([\s\S]*"use"\)/);
  assert.match(pomocnik, /color", "currentColor"/);
  assert.match(pomocnik, /aria-hidden", "true"/);
  assert.match(pomocnik, /if \(!ucitano\) return null/);
  assert.equal(pomocnik.includes("png_256_transparent"), false);
  assert.match(sprite, /stroke="currentColor"/);
  assert.equal(sprite.includes("png"), false);
  for (const ime of ["monitor", "server", "save", "refresh-cw", "pencil"]) {
    assert.match(sprite, new RegExp(`id="${ime}"[^>]*stroke="currentColor"`));
    assert.equal(sprite.includes(`${ime}.png`), false);
  }
});

test("zaglavlje, spisak i kartica nose ikonice", () => {
  for (const ime of ["search", "chevron-left", "chevron-right", "bookmark", "help-circle", "book-open", "check-circle", "circle", "chevron-up", "chevron-down", "calendar-days", "clock"]) {
    assert.match(izvor, new RegExp(ime));
  }
  assert.match(html, /id="oznaka"/);
  assert.match(html, /id="grb"/);
  assert.match(main, /dokument\.oznaka/);
  assert.match(main, /dokument\.grb/);
  assert.match(main, /nedeljaZavrsena\(item, mesto\) \? "check-circle" : "circle"/);
  assert.match(main, /otvoren \? "chevron-up" : "chevron-down"/);
  assert.equal(main.includes('kvaka.textContent'), false);
  assert.equal(main.includes("●"), false);
  assert.equal(main.includes("○"), false);
});

test("tabovi, traka i isečak zadržavaju natpise", () => {
  assert.match(main, /saIkonom\(document\.querySelector\("#tab-koraci"\), "file-text", "Gradivo"\)/);
  assert.match(main, /saIkonom\(document\.querySelector\("#tab-diskusija"\), "messages-square", "Diskusija"\)/);
  assert.match(main, /saIkonom\(document\.querySelector\("#tab-editor"\), "code-xml", "Editor"\)/);
  assert.equal(html.includes(">Koraci<"), false);
  assert.match(main, /ikonica\("chart-column"\)/);
  assert.match(main, /saIkonom\(sacuvajKorak, "bookmark", "Sačuvaj korak"\)/);
  assert.match(main, /saIkonom\(kljucnaNaslov, "lightbulb", "Ključna ideja"\)/);
  assert.match(main, /saIkonom\(naslov, "folder", korak\.isecakNaslov\)/);
  assert.match(main, /natpisKopiranja\("Kopiraj"\)/);
  assert.match(main, /ikonica\("file-text"\)/);
  assert.match(main, /ikonica\("chevron-left"\)/);
  assert.match(main, /ikonica\("chevron-right"\)/);
});

test("pitanje, stablo, olovka i panel", () => {
  assert.match(main, /saIkonom\(pitanjeNad, "question", "Pitanje"\)/);
  assert.match(main, /saIkonom\(otvori, otvoreno \? "check-circle" : "info", otvoreno \? "Obrazloženje je otvoreno" : "Obrazloženje"\)/);
  assert.match(main, /saIkonom\(ponovi, "refresh-cw", "Ponovi pitanje"\)/);
  assert.match(main, /if \(otkriveno && opt\.ok\) return ikonica\("check-circle"\)/);
  assert.match(main, /if \(!otkriveno && opt\.key === izabran\) return ikonica\("circle-dot"\)/);
  assert.match(main, /return ikonica\("circle"\)/);
  assert.match(main, /ikonica\("folder"\)/);
  assert.match(main, /ikonica\("file-text"\)/);
  assert.match(main, /function ikonaVerzije/);
  assert.match(main, /vrsta === "olovka"/);
  assert.match(main, /ikonaVerzije\(radnaNaEkranu \? "olovka" : "list"\)/);
  assert.match(html, /id="reset-radne"[\s\S]*M13\.5 8a5\.5/);
  assert.equal(main.includes("staviIkonu(dugmeVerzije"), false);
  assert.equal(main.includes("staviIkonu(dugmeReseta"), false);
  assert.match(html, /data-ikona="monitor">Klijent/);
  assert.match(html, /data-ikona="server">Server/);
  assert.match(html, /id="ucitaj" data-ikona="folder">Učitaj/);
  assert.match(html, /id="sacuvaj-radnu" data-ikona="save">Sačuvaj/);
  assert.match(html, /id="resetuj" data-ikona="refresh-cw">Resetuj/);
  assert.match(html, />Fajlovi</);
  assert.match(html, /<h2>Pregled<\/h2>/);
  assert.match(html, /<p id="pregled-adresa"><\/p>/);
  assert.match(main, /adresaPregleda\(location\.origin/);
  assert.match(main, /serverTabVidljiv\(cas\)/);
  assert.match(main, /saIkonom\(sviKoraci, "menu", "Svi koraci"\)/);
  assert.match(main, /graduation-cap[\s\S]{0,20}Preduslov:/);
  const osvezi = main.slice(main.indexOf("function osveziPregled"), main.indexOf("function connectDovod"));
  assert.match(osvezi, /primeniDogadaj\(\{ tip: "zivo" \}\)/);
  assert.equal(osvezi.includes("location.reload"), false);
  assert.match(html, /id="procitaj"/);
  assert.equal(main.includes("procitaj.append(ikonica"), false);
  assert.equal(main.includes("prekidac.append(ikonica"), false);
  assert.equal(html.includes('id="sledeci" class="hod-koraka"'), false);
});
