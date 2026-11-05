import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const css = fs.readFileSync(new URL("../site/css/site.css", import.meta.url), "utf8");
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

test("ikonice Opcija i beleški postoje kao fajl i kao simbol", () => {
  const nove = ["settings", "a-large-small", "layers", "database", "upload", "download", "trash", "external-link", "book-open-text", "monitor-code", "sticky-note", "bookmark-filled", "undo-2", "redo-2", "plus", "list-plus", "x", "loader", "ellipsis"];
  for (const ime of nove) {
    const fajl = fs.readFileSync(new URL(`../site/icons/svg_currentColor/${ime}.svg`, import.meta.url), "utf8");
    assert.match(fajl, /viewBox="0 0 24 24"/);
    assert.match(fajl, /stroke="currentColor"/);
    assert.match(fajl, /stroke-width="1\.75"/);
    assert.equal(/png/i.test(fajl), false);
    assert.match(sprite, new RegExp(`<symbol id="${ime}" viewBox="0 0 24 24"[^>]*stroke="currentColor"[^>]*stroke-width="1\\.75"`));
  }
  const ispuna = sprite.slice(sprite.indexOf('id="bookmark-filled"'), sprite.indexOf("</symbol>", sprite.indexOf('id="bookmark-filled"')));
  assert.match(ispuna, /fill="currentColor"/);
});

test("natpis pretrage ostaje u polju i ne preklapa grb", () => {
  assert.match(html, /<label class="sr" for="q">Nađi pojam<\/label>/);
  const sr = css.slice(css.indexOf("\n.sr {"), css.indexOf("}", css.indexOf("\n.sr {")) + 1);
  assert.match(sr, /overflow:\s*hidden/);
  assert.match(sr, /clip-path:\s*inset\(50%\)/);
  assert.equal(/left:\s*-999px/.test(sr), false);
  assert.match(css, /\.skip\s*\{[^}]*left:\s*-999px/);
});

test("zaglavlje u jednom redu nosi ikonice i nema klizač tema", () => {
  const zaglavlje = html.slice(html.indexOf('<header class="top">'), html.indexOf("</header>"));
  const redosled = ['class="ustanova"', 'class="top-razdelnik"', 'data-ikona="monitor-code"', 'id="search-form"', 'id="pomoc"', 'id="beleske-dugme"', 'id="opcije-dugme"', 'id="oznaka"'];
  const mesta = redosled.map((deo) => zaglavlje.indexOf(deo));
  assert.ok(mesta.every((m, i) => m > 0 && (i === 0 || m > mesta[i - 1])), JSON.stringify(mesta));
  assert.match(zaglavlje, /id="pomoc"[^>]*data-ikona="help-circle"/);
  assert.match(zaglavlje, /id="beleske-dugme"[\s\S]*?data-ikona="bookmark"[\s\S]*?data-ikona="chevron-down"[\s\S]*?<\/button>/);
  assert.match(zaglavlje, /id="opcije-dugme"[\s\S]*?data-ikona="settings"[\s\S]*?<span>Opcije<\/span>[\s\S]*?data-ikona="chevron-down"/);
  for (const staro of ['id="klizac"', 'id="natpis-teme"', 'id="prethodna-tema"', 'id="sledeca-tema"', 'id="sacuvaj-zaglavlje"', 'class="tema-meni"', 'id="font-kontrole"']) {
    assert.equal(html.includes(staro), false, staro);
  }
  for (const staro of ["#klizac", "#natpis-teme", "#prethodna-tema", "#sledeca-tema", "#sacuvaj-zaglavlje", "polozajiKlizaca"]) {
    assert.equal(main.includes(staro), false, staro);
  }
  const opcije = fs.readFileSync(new URL("../site/js/opcije.js", import.meta.url), "utf8");
  assert.match(opcije, /strelicom\("chevron-up"\)/);
  assert.match(opcije, /naZatvori: \(\) => strelicom\("chevron-down"\)/);
});

test("zaglavlje, spisak i kartica nose ikonice", () => {
  for (const ime of ["search", "chevron-left", "chevron-right", "bookmark", "help-circle", "book-open", "check-circle", "circle", "chevron-up", "chevron-down", "calendar-days", "clock"]) {
    assert.match(izvor, new RegExp(ime));
  }
  assert.match(html, /id="oznaka"/);
  assert.match(html, /id="grb"/);
  assert.match(main, /dokument\.oznaka/);
  assert.match(main, /dokument\.grb/);
  assert.match(main, /temaZavrsena\(item\) \? "check-circle" : "circle"/);
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
  assert.match(main, /beleske\.poveziDugmeKoraka\(sacuvajKorak\)/);
  const beleske = fs.readFileSync(new URL("../site/js/beleske.js", import.meta.url), "utf8");
  assert.match(beleske, /slot\(ima \? "bookmark-filled" : "bookmark"\), el\("span", "", "Sačuvaj korak"\)/);
  assert.match(main, /saIkonom\(kljucnaNaslov, "lightbulb", "Ključna ideja"\)/);
  assert.match(main, /saIkonom\(naslov, "folder", fajl\.ime\)/);
  assert.match(main, /natpisKopiranja\("Kopiraj"\)/);
  assert.match(main, /ikonica\("file-text"\)/);
  assert.match(main, /ikonica\("chevron-left"\)/);
  assert.match(main, /ikonica\("chevron-right"\)/);
});

test("pitanje, stablo, olovka i panel", () => {
  assert.match(main, /omotZnaka\.className = "pitanje-znak"/);
  assert.match(main, /ikonica\("question"\)/);
  assert.match(main, /okidac\.className = "pitanje-okidac"/);
  assert.match(main, /ikonica\("lightbulb"\)/);
  assert.match(main, /e\.target\.closest\("\.pojam-crta"\)/);
  assert.equal(main.includes("natpisPitalice"), false);
  assert.equal(main.includes("pitalica-samo-ikona"), false);
  assert.match(css, /\.pitanje-red\.otkriva/);
  assert.match(css, /\.pitanje-okidac/);
  assert.match(main, /saIkonom\(ponovi, "refresh-cw", "Ponovi pitanja"\)/);
  assert.equal(main.includes("Obrazloženje je otvoreno"), false);
  assert.match(main, /const mozeOtvoriti = retoricko \? Boolean\(odgovor\) : true/);
  assert.match(main, /if \(otkriveno && opt\.ok\) return ikonica\("check-circle"\)/);
  assert.match(main, /if \(!otkriveno && opt\.key === izabran\) return ikonica\("circle-dot"\)/);
  assert.match(main, /return ikonica\("circle"\)/);
  assert.match(main, /ikonica\("folder"\)/);
  assert.match(main, /ikonica\("file-text"\)/);
  assert.equal(main.includes("ikonaVerzije"), false);
  assert.match(html, /<div class="putanja-red">\s*<span id="putanja">[^<]*<\/span>\s*<p id="editor-napomena" hidden><\/p>\s*<\/div>/);
  assert.match(html, /data-ikona="monitor">Klijent/);
  assert.match(html, /data-ikona="server">Server/);
  assert.match(html, /id="ucitaj" data-ikona="folder">Učitaj/);
  assert.match(html, /id="sacuvaj-radnu" data-ikona="save">Sačuvaj/);
  assert.match(html, /id="resetuj" data-ikona="refresh-cw">Resetuj/);
  assert.match(html, />Fajlovi</);
  assert.match(html, /id="sklopi-stablo"[^>]*aria-expanded="true"[^>]*aria-controls="tree"[^>]*data-ikona="panel-left"/);
  assert.match(main, /classList\.toggle\("sklopljeno", sklopljeno\)/);
  assert.match(main, /postaviPodesavanje\(stanje, "stabloSklopljeno", sklopljeno\)/);
  assert.match(html, /<h2>Pregled<\/h2>/);
  assert.match(html, /<p id="pregled-adresa"><\/p>/);
  assert.match(main, /adresaPregleda\(location\.origin/);
  assert.match(main, /serverTabVidljiv\(cas\)/);
  assert.match(main, /saIkonom\(sviKoraci, "menu", "Svi koraci"\)/);
  assert.equal(html.includes('id="mrvice"'), false);
  assert.equal(html.includes('id="podnaslov-casa"'), false);
  assert.equal(html.includes('id="preduslov"'), false);
  assert.equal(main.includes("Preduslov:"), false);
  const osvezi = main.slice(main.indexOf("function osveziPregled"), main.indexOf("function connectDovod"));
  assert.match(osvezi, /primeniDogadaj\(\{ tip: "zivo" \}\)/);
  assert.equal(osvezi.includes("location.reload"), false);
  assert.match(html, /id="procitaj"/);
  assert.equal(main.includes("procitaj.append(ikonica"), false);
  assert.equal(main.includes("prekidac.append(ikonica"), false);
  assert.equal(html.includes('id="sledeci" class="hod-koraka"'), false);
});
