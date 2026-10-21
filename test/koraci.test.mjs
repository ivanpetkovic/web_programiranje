import assert from "node:assert/strict";
import test from "node:test";
import { dokument, lectures, mapirajKorak, preduslovCasa } from "../site/js/lectures.js";

test("original je polje koraka, inače delić", () => {
  const bez = mapirajKorak({ delic: "samo delić", tekst: "", kljucnaIdeja: "", isecak: "" });
  assert.equal(bez.original, "samo delić");
  const sa = mapirajKorak({ delic: "delić", original: "ceo fajl", tekst: "", kljucnaIdeja: "", isecak: "" });
  assert.equal(sa.original, "ceo fajl");
});

function tekst(korak) {
  return [korak.naslov, korak.primer, korak.kod, korak.pitalica, korak.objasnjenje, korak.delic, korak.putanja].join("\n");
}

test("jedanaest časova ima naslov i 10 do 22 koraka", () => {
  assert.equal(lectures.length, 11);
  const naslovi = [
    "Zašto je Web nastao",
    "Šta browser prikazuje",
    "JavaScript opisuje stanje",
    "Događaji povezuju korisnika",
    "Od naivnog prenosa do HTTP-a, pa Node",
    "Čekanje i neuspeh",
    "Komande i ponavljanje",
    "Trajno stanje i Docker",
    "Koliko je prikaz svež",
    "Ko sme da upravlja",
    "Ceo sistem",
  ];
  lectures.forEach((cas, i) => {
    assert.equal(cas.n, i + 1);
    assert.equal(cas.title, naslovi[i]);
    assert.ok(cas.steps.length >= 10 && cas.steps.length <= 22, `čas ${cas.n}: ${cas.steps.length}`);
    for (const korak of cas.steps) {
      assert.ok(korak.primer);
      assert.ok(korak.pitalica);
      assert.ok(korak.opcije.length >= 2);
      assert.equal(korak.opcije.filter((opcija) => opcija.ok).length, 1);
      assert.ok(korak.objasnjenje);
      if (cas.n === 1) assert.match(korak.primer, /^\S[^?]*\?/);
      if (korak.figura || cas.n === 1) {
        assert.equal(korak.putanja, undefined);
        assert.equal(korak.delic, undefined);
        continue;
      }
      assert.ok(korak.putanja.includes("/"));
      assert.equal(typeof korak.delic, "string");
      if (korak.naslov !== "Podela") assert.ok(korak.delic);
    }
  });
});

test("čas istorije nema Node, čas stranice ima client/index.html", () => {
  const istorija = lectures[0];
  const stranica = lectures[1];
  assert.equal(istorija.steps.some((korak) => tekst(korak).includes("node server/server.js")), false);
  assert.equal(istorija.steps.some((korak) => korak.putanja === "client/index.html"), false);
  assert.match(istorija.options.find((opcija) => opcija.ok).text, /Hipertekstni dokument/);
  assert.equal(stranica.steps.some((korak) => tekst(korak).includes("node server/server.js")), false);
  assert.equal(stranica.steps.some((korak) => korak.putanja === "client/index.html"), true);
  assert.match(stranica.options.find((opcija) => opcija.ok).why, /Osvežavanje vraća dokument/);
});

test("čas 5 otvara adresu pre fetch-a i nema Err", () => {
  const cas = lectures[4];
  const saNode = cas.steps.findIndex((korak) => tekst(korak).includes("node server/server.js"));
  const saAdresom = cas.steps.findIndex((korak) => tekst(korak).includes("127.0.0.1"));
  const saFetch = cas.steps.findIndex((korak) => /\bfetch\b/.test(tekst(korak)));
  assert.ok(saNode > 0);
  assert.ok(saAdresom > saNode);
  assert.equal(saFetch, -1);
  assert.equal(cas.steps.some((korak) => /\bErr\b/.test(korak.delic)), false);
});

test("preduslov časa 1 je priča pre stranice, a časa 2 je ishod istorije", () => {
  assert.equal(preduslovCasa(1), "Još nema fajla. Priča počinje pre stranice.");
  assert.equal(preduslovCasa(2), lectures[0].outcome);
  assert.match(lectures[0].outcome, /Web je usluga na Internetu/);
  assert.match(lectures[0].outcome, /Stranica je dokument/);
  assert.match(lectures[0].outcome, /server\/ još nema fajlove/);
});

test("nedelja istorije drži dvadeset koraka bez fajla", () => {
  const redosled = [
    "LO", "Paket", "TCP i UDP", "Internet", "Hipertekst", "Predlog", "HTML", "W3C",
    "Rat browsera", "XML", "Deset dana", "ECMA", "Bez plugina", "Web 2.0", "Ajax",
    "Streaming", "Ekonomija", "Društvo", "Web 3.0", "Dokument",
  ];
  const sirovi = dokument.nedelje[0].steps;
  assert.deepEqual(sirovi.map((korak) => korak.naslov), redosled);
  assert.equal(sirovi.reduce((zbir, korak) => zbir + korak.minuta, 0), 90);
  const tacan = (naslov) => sirovi.find((korak) => korak.naslov === naslov).opcije.find((opcija) => opcija.ok).text;
  assert.match(tacan("LO"), /1969.*nije Web/);
  assert.match(tacan("TCP i UDP"), /Kadar sme da se odbaci/);
  assert.match(tacan("Deset dana"), /nije Java/);
  assert.match(tacan("Ajax"), /Dokument ostaje/);
  assert.match(tacan("Web 3.0"), /nije novi Internet/);
  for (const korak of sirovi) {
    assert.equal("putanja" in korak, false);
    assert.equal("isecak" in korak, false);
    assert.equal("delic" in korak, false);
  }
  assert.equal(sirovi.filter((korak) => korak.figura).map((korak) => korak.naslov).join(","), "TCP i UDP,Hipertekst,Dokument");
  assert.equal(sirovi.find((korak) => korak.naslov === "Dokument").figura.pokret, "redom");
  assert.deepEqual(
    sirovi.find((korak) => korak.naslov === "Dokument").figura.oznake.map((oznaka) => oznaka.godina),
    ["1969", "1989", "1995", "2005", "2008", "sledeća"],
  );
});

test("nedelja stranice sklapa stranicu, a kasnije nedelje nemaju original", () => {
  const redosled = [
    "Podela", "Stranica", "Glava", "Telo", "Naslov", "Broj", "Dugme", "Veza",
    "Selektor", "Okvir", "Unutra", "Spolja", "Promenljiva", "Calc", "Osvežavanje", "Alati", "Dva zahteva", "Soba prekidača", "Semantika",
  ];
  const sirovi = dokument.nedelje[1].steps;
  assert.deepEqual(sirovi.map((korak) => korak.naslov), redosled);
  assert.equal(sirovi.length, 19);
  assert.equal(sirovi.find((korak) => korak.naslov === "Podela").original, "");
  const broj = sirovi.find((korak) => korak.naslov === "Broj");
  assert.match(broj.original, /<!DOCTYPE html>/);
  assert.match(broj.original, /<p class="digit">24<\/p>/);
  assert.match(broj.kljucnaIdeja, /class/);
  assert.match(sirovi.find((korak) => korak.naslov === "Naslov").kljucnaIdeja, /h1/);
  assert.match(sirovi.find((korak) => korak.naslov === "Dugme").kljucnaIdeja, /button/);
  assert.match(sirovi.find((korak) => korak.naslov === "Dugme").kljucnaIdeja, /type/);
  const selektor = sirovi.find((korak) => korak.naslov === "Selektor");
  const okvir = sirovi.find((korak) => korak.naslov === "Okvir");
  const unutra = sirovi.find((korak) => korak.naslov === "Unutra");
  const spolja = sirovi.find((korak) => korak.naslov === "Spolja");
  assert.match(selektor.original, /^\.digit \{\n  letter-spacing: 0\.08em;\n\}\n$/);
  assert.match(selektor.kljucnaIdeja, /selektor/i);
  assert.equal(okvir.isecak, "border: 1px solid #3a342c;");
  assert.match(okvir.original, /letter-spacing: 0\.08em;/);
  assert.match(okvir.original, /border:/);
  assert.match(unutra.original, /border:/);
  assert.match(unutra.original, /padding:/);
  assert.match(spolja.original, /\.digit/);
  assert.match(spolja.original, /border:/);
  assert.match(spolja.original, /padding:/);
  assert.match(spolja.original, /margin:/);
  assert.match(spolja.kljucnaIdeja, /margin/);
  const promenljiva = sirovi.find((korak) => korak.naslov === "Promenljiva");
  const calc = sirovi.find((korak) => korak.naslov === "Calc");
  assert.match(promenljiva.original, /--broj: 2rem;/);
  assert.match(promenljiva.original, /font-size: var\(--broj\);/);
  assert.match(promenljiva.original, /padding:/);
  assert.match(promenljiva.original, /margin:/);
  assert.match(promenljiva.kljucnaIdeja, /var\(--broj\)/);
  assert.equal(promenljiva.isecak, "--broj: 2rem;\nfont-size: var(--broj);");
  assert.match(calc.original, /--broj: 2rem;/);
  assert.match(calc.original, /font-size: calc\(var\(--broj\) \* 2\);/);
  assert.match(calc.original, /padding:/);
  assert.match(calc.original, /margin:/);
  assert.match(calc.kljucnaIdeja, /calc/);
  assert.equal(calc.isecak, "font-size: calc(var(--broj) * 2);");
  assert.match(dokument.nedelje[1].pojmoviCasa.find((pojam) => pojam.id === "css").body, /calc/);
  const html = sirovi.filter((korak) => korak.putanja === "client/index.html");
  for (let i = 1; i < html.length; i += 1) {
    if (html[i].naslov === "Stranica") continue;
    for (const linija of html[i - 1].original.split("\n")) {
      if (linija) assert.ok(html[i].original.includes(linija), `${html[i].naslov} gubi ${linija}`);
    }
    assert.ok(html[i].original.length > html[i - 1].original.length, html[i].naslov);
  }
  assert.match(sirovi.find((korak) => korak.naslov === "Osvežavanje").original, /osvežavanje vraća dokument/);
  const semantika = sirovi.find((korak) => korak.naslov === "Semantika");
  assert.match(semantika.original, /naslov je h1/);
  assert.match(semantika.original, /24/);
  assert.match(semantika.original, /nema \/api\/soba/);
  assert.equal(semantika.original.includes("soba mašina"), false);
  assert.equal(sirovi.reduce((zbir, korak) => zbir + korak.minuta, 0), 90);
  assert.equal(sirovi.some((korak) => ["Web", "Internet", "Istorija"].includes(korak.naslov)), false);
  for (const nedelja of dokument.nedelje.slice(2)) {
    for (const korak of nedelja.steps) {
      assert.equal("original" in korak, false);
      assert.equal(mapirajKorak(korak).original, korak.delic);
    }
  }
});

test("rezerve 1–9 imaju pitanje, čas 10 nema glasanje", () => {
  const trag = [
    /CSS/,
    /Strogo poređenje/,
    /Funkcija čeka klik/,
    /404/,
    /Drugi klik/,
    /HTTP 400/,
    /Browser ih ne dobija/,
    /[Cc]ache ikonice/,
    /server ćuti/,
  ];
  const istorija = lectures[0];
  const tekstIstorije = [istorija.rezerva.problem, ...istorija.rezerva.options.map((opcija) => opcija.text)].join("\n");
  assert.match(tekstIstorije, /Kadar sme da se odbaci/);
  assert.match(tekstIstorije, /dokument ne sme da izgubi bajt/);
  lectures.slice(1, 10).forEach((cas, i) => {
    assert.ok(cas.rezerva);
    assert.ok(cas.rezerva.options.length >= 2);
    assert.equal(cas.rezerva.options.filter((opcija) => opcija.ok).length, 1);
    const tekstRezerve = [cas.rezerva.problem, ...cas.rezerva.options.map((opcija) => opcija.text)].join("\n");
    assert.match(tekstRezerve, trag[i]);
  });
  const poslednji = lectures[10];
  assert.equal(poslednji.rezerva, null);
  assert.match(poslednji.izlaz, /gde se proverava pravo/i);
  assert.match(poslednji.izlaz, /gde stoji stanje/);
  assert.match(poslednji.izlaz, /ne dokazuje/);
  const soba = poslednji.steps.find((korak) => korak.naslov === "Jedna soba");
  assert.match(soba.primer, /Tip i predlog asistenta/);
  assert.equal(/osvrt/i.test(JSON.stringify(soba)), false);
});

test("gradivo ne krije termin kalkom", () => {
  const telo = JSON.stringify(dokument);
  for (const rec of [
    "žica", "knjigu na lancu", "lanac blokova", "dan zastave", "beli papir",
    "večni septembar", "Striming", "kolačić", "kredencijal", "neprozirn",
    "framework-a", "celina upisa", "dovod", "guranja",
  ]) {
    assert.equal(telo.includes(rec), false, rec);
  }
  assert.match(telo, /veza od kraja do kraja/);
  assert.match(telo, /flag day/);
  assert.match(telo, /blockchain/);
  assert.match(telo, /White paper/);
  assert.match(telo, /opaque token/);
  assert.match(telo, /credential baze/);
  assert.match(telo, /Eternal September/);
});

test("nema preglednog spiska ni naslova Osvrt", () => {
  for (const cas of lectures) assert.equal(cas.overview, undefined);
  for (const nedelja of dokument.nedelje) assert.equal("overview" in nedelja, false);
  const naslovi = dokument.nedelje.flatMap((nedelja) => nedelja.steps.map((korak) => korak.naslov));
  assert.equal(naslovi.includes("Osvrt"), false);
  assert.equal(JSON.stringify(dokument).includes("SSE"), false);
  assert.equal(JSON.stringify(dokument).includes("WebSocket"), false);
});

test("čas 11 ne tvrdi da je upis prošao", () => {
  const cas = lectures[10];
  const tacno = cas.options.find((opcija) => opcija.ok);
  assert.match(tacno.text, /Ne znamo ishod/);
  assert.doesNotMatch(cas.outcome, /upis jeste prošao/);
  assert.equal(cas.steps.some((korak) => korak.objasnjenje.includes("upis jeste prošao")), false);
});
