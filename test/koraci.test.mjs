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

test("Počeci uopštava web, pa priča LO i zašto to nije web", () => {
  const lo = dokument.teme[0].steps[0];
  assert.equal(lo.naslov, "Počeci");
  assert.match(lo.prica, /Šta čini web/);
  assert.match(lo.prica, /sat vremena kasnije/);
  assert.match(lo.prica, /informacija pošalje na udaljeni računar/);
  assert.match(lo.tekst, /Komunikacioni put je put kojim podaci prolaze od izvornog do odredišnog uređaja/);
  assert.match(lo.tekst, /više rutera i komunikacionih veza/);
  assert.match(lo.tekst, /Različiti paketi ne moraju uvek prolaziti istim putem/);
  assert.match(lo.tekst, /dokument mora da ima lokaciju/);
  assert.match(lo.tekst, /ne otvara udaljeni računar/);
  assert.match(lo.tekst, /To još nije web/);
  assert.equal(lo.tekst.includes("otvara tuđi"), false);
  assert.match(lo.pitalice[0].odgovor, /dokumenti na drugom računaru/);
  assert.match(lo.pitalice[1].odgovor, /Udaljeni računar se ne otvara/);
  assert.match(lo.pitalice[1].odgovor, /Dokument mora da ima lokaciju/);
  assert.deepEqual(
    lo.pitalice.map((p) => p.pitalica),
    [
      "Šta čini web, i kako smo do njega došli?",
      "Zašto prijava LO još nije web?",
    ],
  );
  assert.equal(lo.pitalice.every((p) => !p.opcije && p.odgovor), true);
  assert.equal("opcije" in lo, false);
});

test("Paket na Diskusiji ima priču i retorička pitanja", () => {
  const paket = dokument.teme[0].steps[1];
  assert.equal(paket.naslov, "Paket");
  assert.match(paket.prica, /poseban komunikacioni put samo za ta dva računara/);
  assert.match(paket.prica, /komutacija paketa/);
  assert.match(paket.prica, /ARPANET/);
  assert.match(paket.tekst, /komutacija kola/);
  assert.match(paket.tekst, /Zajednički mrežni resursi/);
  assert.match(paket.tekst, /komunikaciona veza/);
  assert.match(paket.tekst, /Komunikacioni put može obuhvatati više rutera i komunikacionih veza/);
  assert.match(paket.tekst, /Različiti paketi ne moraju uvek prolaziti istim putem/);
  assert.match(paket.tekst, /kako primalac razume sadržaj poruke/);
  assert.equal(paket.tekst.includes("veza od kraja do kraja"), false);
  assert.equal(paket.tekst.includes("Internet Protocol"), false);
  assert.match(paket.tekst, /ne obezbeđuje da će svi delovi stići/);
  assert.match(paket.kljucnaIdeja, /nije rana verzija samog HTTP-a/);
  assert.match(paket.pitalice[0].odgovor, /tokom tih pauza ostajao zauzet/);
  assert.match(paket.pitalice[1].odgovor, /dodatna pravila komunikacije — protokoli/);
  assert.match(paket.pitalice[2].odgovor, /nije rana verzija samog HTTP-a/);
  assert.deepEqual(
    paket.pitalice.map((p) => p.pitalica),
    [
      "Zašto deliti poruku na pakete, umesto rezervisati komunikacioni put?",
      "Šta se dešava ako se neka komunikaciona veza prekine tokom prenosa?",
      "Kako nas ovo vodi ka HTTP-u?",
    ],
  );
  assert.equal(paket.pitalice.every((p) => !p.opcije && p.odgovor), true);
  assert.equal("opcije" in paket, false);
});

test("Kako podaci stižu razdvaja adresu, redosled i gubitak", () => {
  const korak = dokument.teme[0].steps[2];
  assert.equal(korak.naslov, "Kako podaci stižu do odredišta?");
  assert.match(korak.prica, /IP obezbeđuje adresiranje i prosleđivanje paketa/);
  assert.match(korak.tekst, /tabele rutiranja/);
  assert.match(korak.tekst, /ne garantuje da će paket zaista stići/);
  assert.match(korak.tekst, /TCP numeriše bajtove/);
  assert.match(korak.tekst, /niz zasebnih poruka/);
  assert.match(korak.tekst, /potvrde prijema/);
  assert.match(korak.tekst, /veza može biti prekinuta/);
  assert.match(korak.tekst, /kako server zna šta oni znače/);
  assert.equal(korak.tekst.includes("komutacija kola"), false);
  assert.equal(korak.tekst.includes("404 Not Found"), false);
  assert.equal(korak.tekst.includes("HTTPS"), false);
  assert.equal(korak.tekst.includes("Metode, statusi i zaglavlja"), false);
  assert.match(korak.tekst, /Internet Protocol/);
  assert.match(korak.kljucnaIdeja, /HTTP kaže šta zahtev i odgovor znače/);
  assert.equal(korak.pitalice.length, 4);
  assert.equal(korak.pitalica, korak.pitalice[0].pitalica);
  assert.deepEqual(
    korak.pitalice.map((p) => p.pitalica),
    [
      "Kako mreža zna gde treba da pošalje paket?",
      "Kako sastaviti podatke ako paketi stignu različitim redosledom?",
      "Šta ako neki deo podataka uopšte ne stigne?",
      "Šta su IP i TCP rešili, a šta ostaje?",
    ],
  );
  assert.match(korak.pitalice[0].odgovor, /Internet Protocol/);
  assert.match(korak.pitalice[0].odgovor, /ne garantuje da će paket zaista stići/);
  assert.match(korak.pitalice[1].odgovor, /1000–1999/);
  assert.match(korak.pitalice[1].odgovor, /niz zasebnih poruka/);
  assert.match(korak.pitalice[2].odgovor, /potvrde prijema/);
  assert.match(korak.pitalice[2].odgovor, /duplikate/);
  assert.match(korak.pitalice[2].odgovor, /veza između krajnjih uređaja/);
  assert.match(korak.tekst, /veza između krajnjih uređaja/);
  assert.match(korak.pitalice[3].odgovor, /kako server zna šta oni znače/);
  assert.match(korak.pitalice[3].odgovor, /HTTP definiše šta zahtev i odgovor znače/);
  assert.equal(korak.pitalice.every((p) => !p.opcije && p.odgovor), true);
  assert.equal("opcije" in korak, false);
});

test("Paket ili rezervisana veza gleda kasni deo, ne ponavlja slojeve", () => {
  const korak = dokument.teme[0].steps[3];
  assert.equal(korak.naslov, "Paket ili rezervisana veza");
  assert.match(korak.prica, /P2 kasni/);
  assert.match(korak.prica, /P3 može da stigne pre njega/);
  assert.match(korak.tekst, /Fragment nije segment/);
  assert.match(korak.tekst, /nije rezervisan kanal/);
  assert.match(korak.pitalice[2].odgovor, /ne mora da vrati celu poruku/);
  assert.equal(korak.tekst.includes("Šta je tačno ako P3 stigne pre P2?"), false);
  assert.match(korak.kljucnaIdeja, /nisu isto sečenje/);
  assert.match(korak.samostalniPrimer.tekst, /P3 može stići pre njega/);
  assert.deepEqual(
    korak.pitalice.map((p) => p.pitalica),
    [
      "Šta je tačno ako P3 stigne pre P2?",
      "Zašto TCP uopšte čeka P2 ako je P3 već stigao?",
      "Da li je sečenje IP datagrama isto što i sečenje TCP toka?",
    ],
  );
  assert.match(korak.pitalice[0].odgovor, /ne mora da vidi P3 pre P2/);
  assert.match(korak.pitalice[1].odgovor, /rupu u bajtovima/);
  assert.match(korak.pitalice[2].odgovor, /Fragment nije segment/);
  assert.equal(korak.pitalice.every((p) => !p.opcije && p.odgovor), true);
  assert.equal("opcije" in korak, false);
});

test("HTTP korak drži dve pitalice na Diskusiji", () => {
  const korak = dokument.teme[0].steps.find((stavka) => stavka.naslov === "HTTP: Od pouzdanog prenosa do Weba");
  assert.equal(korak.pitalica, korak.pitalice[0].pitalica);
  assert.deepEqual(
    korak.pitalice.map((p) => p.pitalica),
    [
      "Ako TCP pouzdano prenosi podatke, zašto nam je potreban još jedan protokol?",
      "Da li je HTTP dovoljan da bismo imali Web?",
    ],
  );
  assert.equal(korak.pitalice.every((p) => !p.opcije && p.odgovor), true);
  assert.match(korak.pitalice[0].odgovor, /ne određuje njihovo značenje/);
  assert.match(korak.pitalice[0].odgovor, /HTTP definiše strukturu zahteva i odgovora/);
  assert.match(korak.pitalice[1].odgovor, /^Ne\./);
  assert.match(korak.pitalice[1].odgovor, /URL identifikuje resurs/);
  assert.match(korak.pitalice[1].odgovor, /Reprezentacija/);
});

test("TCP i UDP poredi zakasneli kadar sa bajtom dokumenta", () => {
  const korak = dokument.teme[0].steps.find((korak) => korak.naslov === "TCP i UDP");
  assert.equal(korak.naslov, "TCP i UDP");
  assert.match(korak.prica, /Kadar filma zakasni/);
  assert.match(korak.prica, /ne čekaju/);
  assert.match(korak.tekst, /bez ugrađene garancije/);
  assert.match(korak.tekst, /HTTP\/3 koristi QUIC/);
  assert.equal(korak.tekst.includes("ventilator"), false);
  assert.equal(korak.tekst.includes("Šta radimo sa zakasnelim kadrom?"), false);
  assert.match(korak.kljucnaIdeja, /UDP ne garantuje isporuku/);
  assert.equal(korak.figura.cvorovi.map((cvor) => cvor.natpis).join(","), "Bajt,TCP,UDP");
  assert.deepEqual(
    korak.pitalice.map((p) => p.pitalica),
    [
      "Šta radimo sa zakasnelim kadrom?",
      "Zašto kadar sme da se odbaci, a bajt dokumenta ne?",
      "Ako se izgubi deo podataka tokom video-poziva, da li ga uvek treba ponovo poslati?",
      "Ako HTTP/3 koristi UDP, da li to znači da web stranica može da stigne nepotpuna?",
    ],
  );
  assert.match(korak.pitalice[0].odgovor, /Kadar sme da se odbaci/);
  assert.match(korak.pitalice[1].odgovor, /više nije ovaj trenutak/);
  assert.match(korak.pitalice[2].odgovor, /Odluku donosi aplikacija, a ne UDP/);
  assert.match(korak.pitalice[3].odgovor, /QUIC preko UDP-a/);
  assert.match(korak.pitalice[3].odgovor, /Sam UDP tu pouzdanost nema/);
  assert.equal(korak.pitalice.every((p) => !p.opcije && p.odgovor), true);
  assert.equal("opcije" in korak, false);
});

test("jedanaest časova ima naslov i 10 do 22 koraka", () => {
  assert.equal(lectures.length, 11);
  const naslovi = [
    "Zašto Web postoji: zahtevi i protokoli",
    "Browser: HTML, CSS i prikaz",
    "JavaScript, jezik, objekti i model izvršavanja",
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
      assert.ok(korak.objasnjenje);
      const diskusijaPrazna = Array.isArray(korak.diskusija) && korak.diskusija.length === 0;
      if (!diskusijaPrazna) assert.ok(korak.pitalica);
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

test("tema jezika ima 15 koraka, diskusiju po koraku i fajl po koraku", () => {
  const tema = dokument.teme[2];
  const cas = lectures[2];
  assert.equal(tema.naslov, "JavaScript, jezik, objekti i model izvršavanja");
  assert.equal(tema.steps.length, 15);
  assert.equal(tema.steps.reduce((zbir, korak) => zbir + korak.minuta, 0), 55);
  assert.match(tema.izlaz, /okruženju/);
  const naslovi = [
    "Šta je JavaScript i kako se izvršava?",
    "Vrednosti, tipovi podataka i promenljive",
    "Objekti, svojstva, reference i mutacija",
    "Izrazi, operatori i poređenja",
    "Kontrola toka programa",
    "Funkcije kao vrednosti",
    "Nizovi i obrada kolekcija",
    "Destrukturiranje i savremena sintaksa",
    "Opseg važenja i leksičko okruženje",
    "Execution context, call stack i hoisting",
    "Closure: kako funkcija zadržava pristup svom okruženju",
    "Metode objekata i this",
    "Prototipi, prototipski lanac i klase",
    "Greške, izuzeci i debagovanje",
    "Moduli, JSON i priprema za Web",
  ];
  assert.deepEqual(tema.steps.map((korak) => korak.naslov), naslovi);
  const ocekivano = [3, 3, 4, 4, 3, 4, 5, 3, 4, 4, 3, 3, 4, 3, 4];
  const minute = [8, 10, 12, 12, 8, 12, 18, 10, 12, 16, 12, 12, 14, 10, 14];
  tema.steps.forEach((korak, i) => {
    const pitanja = korak.diskusija.filter((blok) => blok.vrsta === "pitanje");
    assert.equal(pitanja.length, ocekivano[i], korak.naslov);
    assert.equal(pitanja.reduce((zbir, blok) => zbir + blok.minuta, 0), minute[i], korak.naslov);
    assert.equal(korak.pitalice.length, pitanja.length);
    for (const blok of pitanja) {
      assert.ok(blok.dodatno, blok.id);
      assert.ok(blok.dodatniOdgovor, blok.id);
      if (blok.oblik === "izbor") assert.equal(blok.opcije.filter((opcija) => opcija.ok).length, 1);
      else assert.ok(blok.odgovor, blok.id);
    }
    assert.match(korak.putanja, /^client\/lekcije\/\d{2}-/);
    assert.match(korak.delic, new RegExp(`^// ${korak.naslov}`));
    assert.equal(korak.blokovi.some((blok) => blok.vrsta === "highlight" && blok.uloga === "kljucna"), true);
    assert.equal(korak.blokovi.some((blok) => blok.vrsta === "kod"), true);
    assert.equal(cas.steps[i].putanja, korak.putanja);
    assert.equal(cas.steps[i].delic, korak.delic);
  });
  assert.match(tema.steps[1].delic, /\/\/ const x = 5;/);
  assert.match(tema.steps[6].tekst, /map\(\)/);
  assert.match(tema.steps[6].delic, /brojevi\.map/);
  assert.match(tema.steps[14].delic, /export function saberi/);
  assert.match(tema.steps[14].delic, /JSON\.parse/);
  assert.match(tema.steps[14].delic, /\/\/ import \{ saberi, PI \}/);
  const moduli = tema.steps[14].blokovi.find((blok) => blok.naslov === "main.js");
  assert.match(moduli.tekst, /import \{ saberi, PI \}/);
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
    "Počeci", "Paket", "Kako podaci stižu do odredišta?", "Paket ili rezervisana veza", "TCP i UDP", "Hipertekst", "Predlog",
    "HTTP kao dogovor", "HTML", "Rat browsera", "Od URL-a do prikaza", "Ajax", "Dokument",
  ];
  const sirovi = dokument.teme[0].steps;
  assert.deepEqual(sirovi.map((korak) => korak.naslov), redosled);
  assert.equal(sirovi.reduce((zbir, korak) => zbir + korak.minuta, 0), 60);
  const tacan = (naslov) => sirovi.find((korak) => korak.naslov === naslov).opcije.find((opcija) => opcija.ok).text;
  assert.equal(sirovi.find((korak) => korak.naslov === "Počeci").pitalice.every((p) => !p.opcije), true);
  assert.match(
    sirovi.find((korak) => korak.naslov === "TCP i UDP").pitalice[0].odgovor,
    /Kadar sme da se odbaci/,
  );
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
  assert.equal(telo.includes("veza od kraja do kraja"), false);
  assert.match(telo, /komutacija paketa/);
  assert.match(telo, /veza između krajnjih uređaja/);
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
  let bezDiskusije = 0;
  const kljucevi = { A: 0, B: 0 };
  for (const tema of dokument.teme) {
    for (const korak of tema.steps) {
      if (Array.isArray(korak.diskusija) && korak.diskusija.length === 0) {
        assert.equal(korak.pitalice, undefined, korak.naslov);
        assert.equal(korak.pitalica, undefined, korak.naslov);
        bezDiskusije += 1;
        continue;
      }
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
  assert.equal(bezDiskusije, 0);
  assert.equal(saDrugom, dokument.teme.reduce((n, t) => n + t.steps.length, 0) - bezDiskusije);
  assert.ok(kljucevi.A > 40 && kljucevi.B > 40);
});

test("čas 11 ne tvrdi da je upis prošao", () => {
  const cas = lectures[10];
  const tacno = cas.options.find((opcija) => opcija.ok);
  assert.match(tacno.text, /Ne znamo ishod/);
  assert.doesNotMatch(cas.outcome, /upis jeste prošao/);
  assert.equal(cas.steps.some((korak) => korak.objasnjenje.includes("upis jeste prošao")), false);
});
