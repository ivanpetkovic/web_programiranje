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

test("uvod stoji pre tema i nije tema", () => {
  assert.equal(dokument.teme.length, 11);
  assert.equal(dokument.teme.some((tema) => tema.naslov === "Uvod"), false);
  assert.match(dokument.uvod.cilj, /Kontrolne sobe/);
  assert.ok(dokument.uvod.ocekivanje.length >= 3);
  assert.deepEqual(
    dokument.uvod.osnov.map((izvor) => izvor.naziv),
    ["Stanford CS193X", "Stanford CS142", "MIT web.lab"],
  );
  assert.match(dokument.uvod.napomenaOsnova, /tempo/);
});

test("LO na Diskusiji ima priču i retorička pitanja, bez odgovora", () => {
  const lo = dokument.teme[0].steps[0];
  assert.equal(lo.naslov, "LO");
  assert.match(lo.prica, /sat vremena kasnije/);
  assert.match(lo.tekst, /dokument mora da ima lokaciju/);
  assert.match(lo.tekst, /ne otvara udaljeni računar/);
  assert.equal(lo.tekst.includes("otvara tuđi"), false);
  assert.match(lo.pitalice[0].odgovor, /Udaljeni računar se ne otvara/);
  assert.match(lo.pitalice[1].odgovor, /Dokument mora da ima lokaciju/);
  assert.deepEqual(
    lo.pitalice.map((p) => p.pitalica),
    [
      "Prijava na udaljeni računar već radi. Zašto Web ipak nije nastao te noći?",
      "Šta je moralo da se pojavi da bi jedan dokument vodio na drugi, na drugom računaru?",
    ],
  );
  assert.equal(lo.pitalice.every((p) => !p.opcije && p.odgovor), true);
  assert.equal("opcije" in lo, false);
});

test("Paket na Diskusiji ima priču i retorička pitanja", () => {
  const paket = dokument.teme[0].steps[1];
  assert.equal(paket.naslov, "Paket");
  assert.match(paket.prica, /poseban kanal samo za ta dva računara/);
  assert.match(paket.prica, /veza od kraja do kraja/);
  assert.match(paket.prica, /ARPANET/);
  assert.match(paket.tekst, /ne obezbeđuje da će svi delovi stići/);
  assert.match(paket.tekst, /veza od kraja do kraja/);
  assert.match(paket.kljucnaIdeja, /nije rana verzija samog HTTP-a/);
  assert.match(paket.pitalice[0].odgovor, /tokom tih pauza ostajao zauzet/);
  assert.match(paket.pitalice[1].odgovor, /dodatna pravila komunikacije — protokoli/);
  assert.match(paket.pitalice[2].odgovor, /nije rana verzija samog HTTP-a/);
  assert.deepEqual(
    paket.pitalice.map((p) => p.pitalica),
    [
      "Zašto deliti poruku na pakete, umesto rezervisati vezu od početka do kraja?",
      "Šta se dešava ako se neka mrežna veza prekine tokom prenosa?",
      "Kako nas ovo vodi ka HTTP-u?",
    ],
  );
  assert.equal(paket.pitalice.every((p) => !p.opcije && p.odgovor), true);
  assert.equal("opcije" in paket, false);
});

test("Od paketa do stranice razdvaja IP, TCP i HTTP", () => {
  const korak = dokument.teme[0].steps[2];
  assert.equal(korak.naslov, "Od paketa do stranice");
  assert.match(korak.prica, /Paketi mogu da putuju kroz mrežu/);
  assert.equal(korak.pitalice.length, 18);
  assert.equal(korak.pitalica, korak.pitalice[0].pitalica);
  assert.match(korak.pitalice[1].odgovor, /Internet Protocol/);
  assert.match(korak.pitalice[3].odgovor, /ne podrazumeva rezervisan fizički put/);
  assert.match(korak.pitalice[5].odgovor, /Jedno čitanje iz TCP veze ne mora da vrati celu HTTP poruku/);
  assert.equal(korak.tekst.includes("Šta je IP u nazivu TCP/IP?"), false);
  assert.equal(korak.tekst.includes("Da li HTTP uvek koristi TCP?"), false);
  assert.match(korak.tekst, /Internet Protocol/);
  assert.match(korak.tekst, /Protokol \| Glavni zadatak/);
  assert.match(korak.tekst, /Kom resursu pristupamo\?/);
  assert.match(korak.kljucnaIdeja, /HTTP kaže šta zahtev i odgovor znače/);
  assert.match(korak.pitalice.at(-1).odgovor, /Sam TCP ne šifruje/);
  assert.equal(korak.pitalice.every((p) => !p.opcije && p.odgovor), true);
  assert.equal("opcije" in korak, false);
});

test("jedanaest časova ima naslov i 10 do 22 koraka", () => {
  assert.equal(lectures.length, 11);
  const naslovi = [
    "Zašto Web postoji: zahtevi i protokoli",
    "Browser: HTML, CSS i prikaz",
    "JavaScript: vrednosti, objekti i prototipovi",
    "DOM, događaji i prikaz stanja",
    "Od mrežnog prenosa do HTTP-a i Node.js-a",
    "Asinhronost, event loop i neuspeh",
    "API komande, validacija i idempotentnost",
    "PostgreSQL, transakcije i Docker",
    "Svežina podataka, periodično čitanje i push",
    "Bezbednost, sesije i prava pristupa",
    "Ceo sistem, dijagnostika i LLM",
  ];
  lectures.forEach((cas, i) => {
    assert.equal(cas.n, i + 1);
    assert.equal(cas.title, naslovi[i]);
    assert.ok(cas.steps.length >= 10 && cas.steps.length <= 22, `čas ${cas.n}: ${cas.steps.length}`);
    for (const korak of cas.steps) {
      assert.ok(korak.primer);
      assert.ok(korak.pitalica);
      assert.ok(korak.objasnjenje);
      if (korak.opcije.length) {
        assert.ok(korak.opcije.length >= 2);
        assert.equal(korak.opcije.filter((opcija) => opcija.ok).length, 1);
      }
      if (!korak.putanja) {
        assert.equal(korak.delic, undefined);
        continue;
      }
      assert.ok(korak.putanja.includes("/"));
      assert.equal(typeof korak.delic, "string");
      assert.ok(korak.delic);
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

test("čas 5 stavlja HTTP posle TCP, pa createServer pa listen", () => {
  const cas = lectures[4];
  const naslov = (ime) => cas.steps.findIndex((korak) => korak.naslov === ime);
  const tcp = naslov("TCP");
  const http = naslov("HTTP");
  const kreiraj = naslov("createServer");
  const slusaj = naslov("listen");
  const komanda = naslov("Komanda");
  const adresa = naslov("Adresa");
  assert.ok(tcp < http && http < kreiraj && kreiraj < slusaj && slusaj < komanda && komanda < adresa);
  assert.match(cas.steps[kreiraj].original, /const http = require\("http"\)/);
  assert.match(cas.steps[kreiraj].isecak, /http\.createServer\(obrada\)/);
  assert.equal(cas.steps[kreiraj].isecak.includes("require"), false);
  assert.match(cas.steps[adresa].primer, /fetch dolazi kasnije/);
});

test("čas 5 otvara adresu posle komande, fetch je u tom objašnjenju", () => {
  const cas = lectures[4];
  const saNode = cas.steps.findIndex((korak) => tekst(korak).includes("node server/server.js"));
  const saAdresom = cas.steps.findIndex((korak) => tekst(korak).includes("127.0.0.1"));
  const saFetch = cas.steps.findIndex((korak) => /\bfetch\b/.test(tekst(korak)));
  assert.ok(saNode > 0);
  assert.ok(saAdresom > saNode);
  assert.equal(saFetch, saAdresom);
  assert.equal(cas.steps.some((korak) => /\bErr\b/.test(korak.delic)), false);
});

test("preduslov časa 1 je priča pre stranice, a časa 2 je ishod istorije", () => {
  assert.equal(preduslovCasa(1), "Još nema fajla. Priča počinje pre stranice.");
  assert.equal(preduslovCasa(2), lectures[0].outcome);
  assert.match(lectures[0].outcome, /Web je usluga na Internetu/);
  assert.match(lectures[0].outcome, /Stranica je dokument/);
  assert.match(lectures[0].outcome, /server\/ još nema fajlove/);
});

test("tema istorije drži korake bez fajla", () => {
  const redosled = [
    "LO", "Paket", "Od paketa do stranice", "Paket ili rezervisana veza", "TCP i UDP", "Hipertekst", "Predlog",
    "HTTP kao dogovor", "HTML", "Rat browsera", "Od URL-a do prikaza", "Ajax", "Dokument",
  ];
  const sirovi = dokument.teme[0].steps;
  assert.deepEqual(sirovi.map((korak) => korak.naslov), redosled);
  assert.equal(sirovi.reduce((zbir, korak) => zbir + korak.minuta, 0), 60);
  const tacan = (naslov) => sirovi.find((korak) => korak.naslov === naslov).opcije.find((opcija) => opcija.ok).text;
  assert.equal(sirovi.find((korak) => korak.naslov === "LO").pitalice.every((p) => !p.opcije), true);
  assert.match(tacan("TCP i UDP"), /Kadar sme da se odbaci/);
  assert.match(tacan("Ajax"), /Dokument ostaje/);
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

test("tema stranice drži isečke dokumenta, bez ugrađenog originala", () => {
  const redosled = [
    "Stranica", "Glava", "Naslov", "Širina kutije", "Broj", "Dugme", "Veza",
    "Specifičnost selektora", "Selektor", "Okvir", "Osvežavanje", "Raspored pri uskom ekranu",
    "Alati", "Dva zahteva", "Semantika",
  ];
  const sirovi = dokument.teme[1].steps;
  assert.deepEqual(sirovi.map((korak) => korak.naslov), redosled);
  const broj = sirovi.find((korak) => korak.naslov === "Broj");
  assert.match(broj.isecak, /<p class="digit">24<\/p>/);
  assert.match(broj.kljucnaIdeja, /class/);
  assert.match(sirovi.find((korak) => korak.naslov === "Naslov").kljucnaIdeja, /h1/);
  assert.match(sirovi.find((korak) => korak.naslov === "Dugme").kljucnaIdeja, /button/);
  assert.match(sirovi.find((korak) => korak.naslov === "Dugme").kljucnaIdeja, /type/);
  const selektor = sirovi.find((korak) => korak.naslov === "Selektor");
  const okvir = sirovi.find((korak) => korak.naslov === "Okvir");
  assert.equal(selektor.isecak, "letter-spacing: 0.08em;");
  assert.match(selektor.kljucnaIdeja, /selektor/i);
  assert.equal(okvir.isecak, "border: 1px solid #3a342c;");
  assert.match(dokument.teme[1].pojmoviCasa.find((pojam) => pojam.id === "css").body, /calc/);
  assert.match(sirovi.find((korak) => korak.naslov === "Osvežavanje").isecak, /osvežavanje vraća dokument/);
  const semantika = sirovi.find((korak) => korak.naslov === "Semantika");
  assert.match(semantika.isecak, /naslov je h1/);
  assert.equal(semantika.isecak.includes("soba mašina"), false);
  assert.equal(sirovi.reduce((zbir, korak) => zbir + korak.minuta, 0), 55);
  for (const tema of dokument.teme) {
    for (const korak of tema.steps) {
      if ("original" in korak) {
        assert.equal(typeof korak.putanja, "string", korak.naslov);
        assert.equal(mapirajKorak(korak).original, korak.original);
        assert.equal(mapirajKorak(korak).ugradjen, true);
      } else if (korak.delic) {
        assert.equal(mapirajKorak(korak).original, korak.delic);
      }
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
  assert.equal(poslednji.rezerva ?? null, null);
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
    "večni septembar", "Striming", "kolačić", "kredencijal",
    "framework-a", "celina upisa", "dovod", "guranja",
  ]) {
    assert.equal(telo.includes(rec), false, rec);
  }
  assert.match(telo, /veza od kraja do kraja/);
  assert.match(telo, /blockchain/);
  assert.match(telo, /opaque token/);
  assert.match(telo, /credential baze/);
});

test("nema preglednog spiska ni naslova Osvrt", () => {
  for (const cas of lectures) assert.equal(cas.overview, undefined);
  for (const tema of dokument.teme) assert.equal("overview" in tema, false);
  const naslovi = dokument.teme.flatMap((tema) => tema.steps.map((korak) => korak.naslov));
  assert.equal(naslovi.includes("Osvrt"), false);
  assert.match(dokument.dopunaGlosara.find((pojam) => pojam.id === "push").body, /SSE/);
  assert.match(dokument.dopunaGlosara.find((pojam) => pojam.id === "push").body, /WebSocket/);
});

test("svaki korak nosi pitalice redom, prva ostaje postojeća", () => {
  let saDrugom = 0;
  const kljucevi = { A: 0, B: 0 };
  for (const tema of dokument.teme) {
    for (const korak of tema.steps) {
      assert.ok(Array.isArray(korak.pitalice) && korak.pitalice.length >= 2, korak.naslov);
      assert.equal(korak.pitalice[0].pitalica, korak.pitalica);
      assert.equal(korak.pitalice[0].analizaPitalice || "", korak.analizaPitalice || "");
      const mapiran = mapirajKorak(korak);
      assert.equal(mapiran.pitalice.length, korak.pitalice.length);
      assert.equal(mapiran.pitalica, korak.pitalica);
      const saOdgovorom = (korak.opcije || []).some((o) => o.ok);
      if (saOdgovorom) {
        assert.equal(mapiran.opcije.find((o) => o.ok).text, korak.opcije.find((o) => o.ok).text);
      }
      for (const p of korak.pitalice) {
        assert.ok(p.pitalica, korak.naslov);
        if (!(p.opcije || []).length) continue;
        assert.ok(p.analizaPitalice, korak.naslov);
        assert.equal(p.opcije.filter((o) => o.ok).length, 1, p.pitalica);
      }
      if (korak.pitalice.length >= 2) saDrugom += 1;
      for (const p of korak.pitalice.slice(1)) {
        const drzi = (p.opcije || []).find((o) => o.ok);
        if (drzi) kljucevi[drzi.key] += 1;
      }
    }
  }
  assert.equal(saDrugom, dokument.teme.reduce((n, t) => n + t.steps.length, 0));
  assert.ok(kljucevi.A > 40 && kljucevi.B > 40);
});

test("čas 11 ne tvrdi da je upis prošao", () => {
  const cas = lectures[10];
  const tacno = cas.options.find((opcija) => opcija.ok);
  assert.match(tacno.text, /Ne znamo ishod/);
  assert.doesNotMatch(cas.outcome, /upis jeste prošao/);
  assert.equal(cas.steps.some((korak) => korak.objasnjenje.includes("upis jeste prošao")), false);
});
