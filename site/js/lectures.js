function k(putanja, naslov, primer, kod, pitalica, odgovori, objasnjenje, delic, jos) {
  const slova = ["A", "B", "C", "D"];
  return {
    putanja,
    naslov,
    primer,
    kod,
    pitalica,
    objasnjenje,
    delic,
    opcije: odgovori.map((odgovor, i) => ({
      key: slova[i],
      text: odgovor[0],
      why: odgovor[1],
      ok: odgovor[2] === true,
    })),
    ...jos,
  };
}

const da = true;

export const lectures = [
  {
    n: 1,
    title: "Šta browser prikazuje",
    outcome: "Dokument, prikaz i merenje nisu ista stvar.",
    problem: "U alatima browsera „24 °C” postane „10 °C”. Šta je promenjeno?",
    pretpostavka: "Ekran jeste stanje kutije.",
    options: [
      { key: "A", text: "Merenje temperature.", ok: false, why: "Merenje nismo dirali. Broj na ekranu nije nova temperatura." },
      { key: "B", text: "HTML dokument.", ok: false, why: "Nema zahteva koji menja dokument. Osvežavanje vraća 24." },
      { key: "C", text: "Lokalni prikaz u ovom browseru.", ok: true, why: "Alati menjaju sliku u ovom browseru. Osvežavanje vraća dokument sa 24." },
      { key: "D", text: "I merenje i dokument, jer ekran jeste stanje kutije.", ok: false, why: "Ekran nije stanje kutije. Osvežavanje vraća dokument." },
    ],
    rezerva: {
      problem: "HTML je stigao, CSS nije. Šta ostaje na strani?",
      options: [
        { key: "A", text: "Sadržaj može ostati vidljiv bez očekivanog izgleda.", ok: true, why: "Stil opisuje izgled. Dokument i dalje nosi tekst." },
        { key: "B", text: "Bez CSS-a stranica je prazna.", ok: false, why: "Browser i dalje prikaže sadržaj dokumenta." },
        { key: "C", text: "CSS jeste dokument, pa ništa nije stiglo.", ok: false, why: "Dokument i stil su dva zahteva." },
      ],
    },
    izlaz: "Gde je dokument, gde je prikaz, a šta osvežavanje vraća?",
    terms: [
      { id: "prikaz", name: "Prikaz", hint: "ono što ovaj browser crta", body: "Prikaz je slika dokumenta u jednom browseru. Izmena u alatima ostaje u toj slici.", code: "<p>24</p>\n<!-- alati pokažu 10, dokument i dalje kaže 24 -->" },
      { id: "dokument", name: "Dokument", hint: "HTML koji stigne", body: "Dokument je HTML koji browser učita. Iz prikaza se ne šalje nazad.", code: "GET /\n\n<p class=\"digit\">24</p>" },
      { id: "css", name: "CSS", hint: "izgled istog dokumenta", body: "CSS opisuje izgled. Ako stil ne stigne, sadržaj i dalje može da se pročita.", code: ".digit {\n  letter-spacing: 0.08em;\n}" },
    ],
    overview: "Internet naspram Weba, put od URL-a do prikaza, semantički HTML, osnovna pristupačnost, skica.",
    steps: [
      k("client/index.html", "Rez", "Dva foldera stoje jedan pored drugog pre ijedne funkcije.", "client/\nserver/", "Šta browser učitava na ovom času?", [
        ["Oba foldera odjednom.", "Server još ne radi.", false],
        ["client/. server/ je prazno mesto.", "Browser učitava klijent. Server čeka Node.", da],
      ], "client/ je ono što browser učita. server/ stoji prazan da se vidi rez.", "client/\nserver/"),
      k("client/index.html", "Skelet", "Stranica počinje praznim dokumentom, ne panelom.", "<!DOCTYPE html>\n<html lang=\"sr\">\n</html>", "Šta je ovaj fajl?", [
        ["Naredba koju Node pokreće.", "Node se na ovom času ne pokreće.", false],
        ["HTML dokument koji browser učita.", "Ovo je dokument, ne proces.", da],
      ], "Dokument živi u client/index.html. Pokretanje Node-a nije deo ove nedelje.", "<!DOCTYPE html>\n<html lang=\"sr\">\n<head><meta charset=\"utf-8\"><title>Soba</title></head>\n<body>\n</body>\n</html>"),
      k("client/index.html", "Naslov", "Naslov je deo dokumenta, ne merenje.", "<h1>Soba prekidača</h1>", "Osvežavanje stranice...", [
        ["Zaboravlja naslov.", "Naslov je u fajlu.", false],
        ["Ponovo učita naslov iz fajla.", "Dokument se čita iznova.", da],
      ], "Naslov dolazi iz fajla. Prikaz ga samo pokaže.", "<h1>Soba prekidača</h1>"),
      k("client/index.html", "Broj 24", "U pasusu stoji broj, kao običan tekst.", "<p class=\"digit\">24</p>", "Odakle je 24 na početku?", [
        ["Iz merenja kutije.", "Kutije još nema.", false],
        ["Iz statičnog teksta dokumenta.", "24 je sadržaj HTML-a.", da],
      ], "Temperatura na ovom času jeste sadržaj client/index.html.", "<p class=\"digit\">24</p>"),
      k("client/index.html", "Dugme", "Dugme je element dokumenta. Još ništa ne šalje.", "<button type=\"button\">Uključi</button>", "Klik na ovo dugme na času 1...", [
        ["Šalje komandu ventilatoru.", "Ventilatora i servera još nema.", false],
        ["Ne menja dokument.", "Dugme još nema ponašanje.", da],
      ], "Dugme je u dokumentu. Komanda dolazi tek kad postoji server.", "<button type=\"button\">Uključi</button>"),
      k("client/css/soba.css", "Razmak", "Isti tekst može da izgleda ređe.", ".digit { letter-spacing: 0.08em; }", "Ako stil ne stigne, broj...", [
        ["Nestane, jer je stil deo broja.", "Broj je u HTML-u.", false],
        ["Može ostati čitljiv, samo bez tog razmaka.", "Sadržaj ne zavisi od stila.", da],
      ], "CSS menja izgled broja. Dokument i dalje kaže 24.", ".digit {\n  letter-spacing: 0.08em;\n}"),
      k("client/index.html", "Osvežavanje", "U alatima je neko prekucao 24 u 10.", "dokument: 24\nprikaz: 10", "Šta osvežavanje uradi?", [
        ["Upisuje 10 u fajl.", "Alati nisu sačuvali fajl.", false],
        ["Vraća dokument, opet 24.", "Prikaz se pravi iznova iz fajla.", da],
      ], "Osvežavanje vraća dokument. 10 je bio samo lokalni prikaz.", "<p class=\"digit\">24</p>"),
      k("client/index.html", "Alati", "Izmena u alatima vidi se odmah na ekranu.", "element.textContent = \"10\"", "Šta je time promenjeno?", [
        ["Merenje.", "Merenja nema.", false],
        ["Lokalni prikaz, ne dokument.", "Fajl i dalje drži 24.", da],
        ["I merenje i dokument.", "Ekran nije stanje kutije.", false],
      ], "Alati menjaju sliku u ovom browseru. Dokument ostaje.", "<!-- prikaz može da kaže 10; fajl i dalje kaže 24 -->"),
      k("client/index.html", "Dva zahteva", "Stranica traži dokument, pa stil.", "GET /\nGET /css/soba.css", "Da li se vidi zahtev za sobu?", [
        ["Da, inače broj ne bi postojao.", "Broj je u dokumentu.", false],
        ["Ne. Nema zahteva za API sobe.", "Na ovom času Network nema GET /api/soba.", da],
      ], "Network pokazuje dokument i stil. Čitanje sobe još ne postoji.", "<!-- nema /api/soba -->"),
      k("client/index.html", "Soba prekidača", "Na ekranu je jedna soba i jedan broj.", "soba prekidača\n24", "Gde je ventilator?", [
        ["U sobi prekidača, mali.", "Taj crtež ne postoji.", false],
        ["Nigde. Soba mašina se ne crta.", "Ventilator čeka server.", da],
      ], "Čas 1 crta samo sobu prekidača. Lopatice nisu deo ovog prikaza.", "<!-- samo soba prekidača -->"),
      k("client/index.html", "Semantika", "Naslov nije podebljan pasus.", "<h1>Soba prekidača</h1>", "Zašto h1, a ne samo velika slova?", [
        ["Zato što server tako čita temperaturu.", "Server se ne pokreće.", false],
        ["Zato što dokument kaže šta je naslov.", "Izgled može da se doda kasnije.", da],
      ], "Semantički HTML ostaje i kad se stil promeni.", "<h1>Soba prekidača</h1>"),
    ],
  },
  {
    n: 2,
    title: "JavaScript opisuje stanje",
    outcome: "Objekat drži temperaturu. Ekran je još ne crta.",
    problem: "Objekat je u const, a druga promenljiva pokazuje na njega. Šta sme?",
    pretpostavka: "const zamrzava objekat, ili drugo ime pravi kopiju.",
    options: [
      { key: "A", text: "Polje sme da se menja, i drugo ime vidi istu izmenu.", ok: true, why: "const drži ime, ne zamrzava polja. Drugo ime nije kopija." },
      { key: "B", text: "const zamrzne objekat.", ok: false, why: "Zabrana važi za novu dodelu imena, ne za polje." },
      { key: "C", text: "Drugo ime pravi kopiju.", ok: false, why: "Oba imena pokazuju na isti objekat." },
      { key: "D", text: "Polje sme da se menja samo uz let.", ok: false, why: "let nije uslov za izmenu polja." },
    ],
    rezerva: {
      problem: "temperatura === \"24\" kad je u objektu broj 24. Šta važi?",
      options: [
        { key: "A", text: "Strogo poređenje je netačno. Tekst i broj nisu isti tip.", ok: true, why: "=== ne pretvara tip." },
        { key: "B", text: "Uvek je tačno, jer oba izgledaju kao 24.", ok: false, why: "Izgled na ekranu nije tip vrednosti." },
      ],
    },
    izlaz: "Šta const drži, a šta polje objekta sme?",
    terms: [
      { id: "const", name: "const", hint: "ime se ne dodeljuje ponovo", body: "const vezuje ime. Polje objekta i dalje sme da se promeni.", code: "const soba = { temperatura: 24 };\nsoba.temperatura = 25;" },
      { id: "referenca", name: "Referenca", hint: "dva imena, isti objekat", body: "Dodela objekta kopira referencu. Izmena kroz jedno ime vidi se kroz drugo.", code: "const a = { temperatura: 24 };\nconst b = a;\nb.temperatura = 25;" },
      { id: "niz", name: "map, filter, reduce", hint: "niz tačaka, bez petlje", body: "iznadPraga bira tačke, temperature vadi visinu, prosek sabira. Svaka funkcija radi jednu stvar.", code: "function iznadPraga(tacke) {\n  return tacke.filter((tacka) => tacka.temperatura >= 24);\n}" },
    ],
    overview: "Dinamički tipovi, mesto TypeScript provere, JS okruženja, dve verzije iste funkcije.",
    steps: [
      k("client/js/korak.js", "Objekat", "Stanje stane u jedan objekat, pre bilo kog ekrana.", "const soba = { temperatura: 24, zeljeno: false };", "Gde je temperatura?", [
        ["U natpisu na dugmetu.", "Ekran je još ne čita objekat.", false],
        ["U polju objekta.", "Objekat drži broj.", da],
      ], "Objekat drži temperaturu i željeno stanje prekidača.", "const soba = { temperatura: 24, zeljeno: false };"),
      k("client/js/korak.js", "const", "Ime je vezano. Polje nije.", "const soba = { temperatura: 24 };\nsoba.temperatura = 25;", "Šta const brani?", [
        ["Svaku izmenu polja.", "Polje i dalje sme da se menja.", false],
        ["Novu dodelu tog imena.", "soba = {} ne prolazi. soba.temperatura = 25 prolazi.", da],
      ], "const ne zamrzava objekat.", "soba.temperatura = 25;"),
      k("client/js/korak.js", "Drugo ime", "Dva imena mogu pokazivati na isti objekat.", "const drugo = soba;\ndrugo.temperatura = 26;", "Šta drugo vidi?", [
        ["Kopiju, pa soba ostaje 24.", "Nema kopije objekta.", false],
        ["Isti objekat, pa se vidi 26.", "Dodela kopira referencu.", da],
      ], "Izmena kroz jedno ime vidi se kroz drugo.", "const drugo = soba;"),
      k("client/js/korak.js", "Nova dodela", "Ime const ne sme da pokaže na drugi objekat.", "soba = { temperatura: 24 };", "Šta se desi?", [
        ["Polje se vrati na 24.", "Ovo nije izmena polja.", false],
        ["Dodela imena ne prolazi.", "const brani novo vezivanje imena.", da],
      ], "Nova dodela imena ne prolazi. Polje je i dalje slobodno.", "// soba = { temperatura: 24 } ne prolazi"),
      k("client/js/korak.js", "Delta", "Jedna funkcija diže broj za fiksnu deltu.", "let delta = 1;\nfunction korak(soba) {\n  soba.temperatura += delta;\n}", "Da li funkcija gleda prekidač?", [
        ["Da, inače bi ventilator uticao.", "Režim ne ulazi u računicu.", false],
        ["Ne. Uvek doda deltu.", "Željeno stanje se ignoriše.", da],
      ], "Sledeći korak uveća temperaturu za deltu i ne gleda prekidač.", "function korak(soba) {\n  soba.temperatura += delta;\n}"),
      k("client/js/korak.js", "Prekidač uključen", "Prekidač je na uključeno, pa se zove korak.", "soba.zeljeno = true;\nkorak(soba);", "Šta konzola vidi?", [
        ["Isti broj, jer je prekidač uključen.", "Delta ne pita prekidač.", false],
        ["Broj veći za deltu.", "Računica je uvek ista.", da],
      ], "Sledeći poziv daje višu temperaturu i kad je prekidač na uključeno.", "korak(soba);"),
      k("client/js/korak.js", "Konzola", "Broj se prati ispisom, ne na displeju.", "console.log(soba.temperatura);", "Šta ekranski broj uradi?", [
        ["Prati konzolu.", "Crtanja još nema.", false],
        ["Ostaje. Konzola je drugi izlaz.", "Displej čeka čas 3.", da],
      ], "Vrednosti se prate u konzoli. DOM se ne vezuje.", "console.log(soba.temperatura);"),
      k("client/js/niz.js", "filter", "Niz tačaka bira one iznad praga.", "function iznadPraga(tacke) {\n  return tacke.filter((t) => t.temperatura >= 24);\n}", "Šta filter vrati?", [
        ["Jedan broj, prosek.", "Prosek je reduce.", false],
        ["Nov niz tačaka koje prolaze.", "filter bira, ne crta.", da],
      ], "filter radi jednu stvar: bira tačke.", "function iznadPraga(tacke) {\n  return tacke.filter((tacka) => tacka.temperatura >= 24);\n}"),
      k("client/js/niz.js", "map", "Od tačke ostane visina.", "function temperature(tacke) {\n  return tacke.map((t) => t.temperatura);\n}", "Šta map promeni?", [
        ["Iste tačke, samo sakrije niske.", "To radi filter.", false],
        ["Svaku tačku pretvori u broj.", "Izlaz je niz visina.", da],
      ], "map vadi visinu. Petlja ostaje za crtanje, kasnije.", "function temperature(tacke) {\n  return tacke.map((tacka) => tacka.temperatura);\n}"),
      k("client/js/niz.js", "reduce", "Visine se saberu u jedan broj.", "function prosek(visine) {\n  const zbir = visine.reduce((s, v) => s + v, 0);\n  return visine.length ? zbir / visine.length : 0;\n}", "Šta reduce vrati?", [
        ["Niz, kao map.", "reduce skuplja u jednu vrednost.", false],
        ["Jednu vrednost, ovde prosek.", "Zbir pa deljenje.", da],
      ], "Konzola ispiše visine i prosek. Taj niz još ne crta displej.", "const zbir = visine.reduce((s, v) => s + v, 0);"),
      k("client/js/niz.js", "Prag", "Jedna izmena menja koji redovi ostanu.", "tacka.temperatura >= prag", "Ako prag poraste, prosek...", [
        ["Uvek ostane isti.", "Manje tačaka uđe u sabiranje.", false],
        ["Računa se iz tačaka iznad novog praga.", "filter bira pre reduce.", da],
      ], "Editor sme da promeni prag filtera. Ekranski broj i dalje stoji.", "const prag = 24;"),
      k("client/js/korak.js", "Tip", "Broj i tekst istog zapisa nisu ista vrednost.", "24 === \"24\"", "Šta === kaže?", [
        ["Tačno, oba su 24.", "Strogo poređenje ne pretvara tip.", false],
        ["Netačno. Broj nije tekst.", "Jedna promena: kopija polja u novi objekat više ne prati izmenu.", da],
      ], "Rezervna provera je strogo poređenje broja i teksta temperature.", "24 === \"24\" // false"),
    ],
  },
  {
    n: 3,
    title: "Događaji povezuju korisnika",
    outcome: "Klik menja stanje. Poseban kod crta prikaz.",
    problem: "Menjanje objekta menja tekst na stranici…",
    pretpostavka: "Objekat ili const sami osvežavaju DOM.",
    options: [
      { key: "A", text: "Samo ako postoji kod koji crta prikaz.", ok: true, why: "Objekat i ekran su razdvojeni dok crtanje ne pozovemo." },
      { key: "B", text: "Uvek, jer je objekat na stranici.", ok: false, why: "Bez poziva crtanja ekran ostaje star." },
      { key: "C", text: "Samo ako je objekat u const.", ok: false, why: "const ne crta." },
    ],
    rezerva: {
      problem: "Listener dobije funkciju, ili rezultat poziva. Šta čeka klik?",
      options: [
        { key: "A", text: "Funkcija čeka klik. Poziv sa zagradama odradi se odmah.", ok: true, why: "Zagrade znače poziv sada, ne kasnije." },
        { key: "B", text: "Oba čekaju klik.", ok: false, why: "Rezultat poziva nije funkcija koju klik može da zove." },
      ],
    },
    izlaz: "Ko menja objekat, a ko upisuje broj na ekran?",
    terms: [
      { id: "dom", name: "DOM", hint: "stablo koje browser drži", body: "DOM je objekat dokumenta u browseru. Crtanje upisuje tekst u to stablo.", code: "class Displej {\n  crtaj(vrednost) {\n    this.element.textContent = String(vrednost);\n  }\n}" },
      { id: "handler", name: "Handler", hint: "funkcija na događaj", body: "Listener čeka događaj ako dobije funkciju. Poziv sa zagradama odradi se odmah.", code: "dugme.addEventListener(\"click\", nacrtaj);" },
      { id: "closure", name: "Closure", hint: "unutrašnja funkcija pamti prag", body: "Sinhrona funkcija vrati funkciju koja i dalje vidi prag. Tajmer nije deo ovog primera.", code: "function granica(prag) {\n  return (t) => t >= prag;\n}" },
    ],
    overview: "Responsive prikaz, jedinice, animacija, pristupačna forma, klase i this, komponenta kao razlog biblioteke.",
    steps: [
      k("client/js/prekidac.js", "Put klika", "Klik nije još crtež.", "klik → handler → stanje → prikaz", "Šta je prvi korak posle klika?", [
        ["Browser sam upiše novi broj.", "Broj čeka posebno crtanje.", false],
        ["Handler. Crtanje je kasnije.", "Put je klik, handler, stanje, prikaz.", da],
      ], "Ishod časa je taj put, ne jedan poziv koji radi sve.", "dugme.addEventListener(\"click\", naKlik);"),
      k("client/js/prekidac.js", "Funkcija", "Listener dobija funkciju, ne njen rezultat.", "addEventListener(\"click\", naKlik)", "Kada se naKlik zove?", [
        ["Dok se red registruje.", "Bez zagrada nema poziva sada.", false],
        ["Kad klik stigne.", "Listener čuva funkciju.", da],
      ], "Listener sa funkcijom čeka klik.", "addEventListener(\"click\", naKlik);"),
      k("client/js/prekidac.js", "Poziv odmah", "Zagrade na registraciji znače poziv sada.", "addEventListener(\"click\", naKlik())", "Šta klik kasnije ima da zove?", [
        ["Istu funkciju.", "U listener je ušao rezultat, ne funkcija.", false],
        ["Ništa, ako je rezultat undefined.", "Poziv se desio odmah.", da],
      ], "Listener sa pozivom dobija povratnu vrednost i klik nema šta da zove.", "addEventListener(\"click\", naKlik());"),
      k("client/js/korak.js", "Stanje", "Handler menja objekat.", "korak(soba);", "Da li je ekran već nov?", [
        ["Da, objekat jeste ekran.", "Još nema crtanja.", false],
        ["Ne. Broj je samo u objektu.", "Prikaz je poseban korak.", da],
      ], "Sledeći korak menja temperaturu u objektu.", "korak(soba);", { crta: false }),
      k("client/js/displej.js", "Bez crtanja", "Na ovom koraku panel ne zove crtaj.", "soba.temperatura += delta;", "Šta displej pokaže?", [
        ["Novi broj, jer se objekat promenio.", "Niko nije upisao tekst.", false],
        ["Stari broj.", "Stanje i prikaz su razdvojeni.", da],
      ], "Izostanak crtanja ostavlja novi broj u stanju i star na ekranu.", "// crtaj se ne zove", { crta: false }),
      k("client/js/displej.js", "crtaj", "Klasa upisuje tekst u element.", "class Displej {\n  crtaj(vrednost) {\n    this.element.textContent = String(vrednost);\n  }\n}", "Ko upisuje cifre?", [
        ["Sam objekat sobe.", "Objekat nema element.", false],
        ["Displej.crtaj.", "this je instanca na kojoj je metod pozvan.", da],
      ], "Displej.crtaj upisuje broj. Ista klasa kasnije dobija i sobu mašina.", "crtaj(vrednost) {\n  this.element.textContent = String(vrednost);\n}"),
      k("client/js/niz.js", "Linija", "Isti niz tačaka može da se vidi kao linija.", "nacrtajLiniju(platno, visine)", "Da li linija zameni displej?", [
        ["Da, jedan prikaz je dovoljan.", "Linija je slika visina. Displej je poseban.", false],
        ["Ne. Oba postoje, svaki crta svoje.", "filter i map pripreme visine.", da],
      ], "Linija je slika visina posle filter i map.", "nacrtajLiniju(platno, visine);"),
      k("client/js/prekidac.js", "Prekidač", "Klasa pomera natpis, ne temperaturu.", "class Prekidac {\n  crtaj(ukljucen) {\n    this.element.textContent = ukljucen ? \"Isključi\" : \"Uključi\";\n  }\n}", "Šta crtaj prekidača menja?", [
        ["Broj temperature.", "To radi Displej.", false],
        ["Natpis željenog stanja.", "Željeno stanje stoji u objektu, natpis na dugmetu.", da],
      ], "Prekidac.crtaj pomera natpis. Oba su ES6 klase.", "crtaj(ukljucen) {\n  this.element.textContent = ukljucen ? \"Isključi\" : \"Uključi\";\n}"),
      k("client/index.html", "Forma", "Forma na panelu ne sme da osveži dokument.", "forma.addEventListener(\"submit\", (e) => e.preventDefault());", "Šta submit uradi bez preventDefault?", [
        ["Ostane na istoj strani i samo promeni broj.", "Podrazumevano šalje formu i učita dokument iznova.", false],
        ["Učita dokument iznova.", "Zaustavljanje submita čuva prikaz.", da],
      ], "Forma na panelu ne osvežava dokument.", "e.preventDefault();"),
      k("client/js/niz.js", "Closure", "Spoljašnja funkcija vrati unutrašnju i pamti prag.", "function granica(prag) {\n  return (t) => t >= prag;\n}", "Šta unutrašnja funkcija i dalje vidi?", [
        ["Samo argumente svog kasnijeg poziva.", "Vidi i prag iz spolja.", false],
        ["Prag koji je granica dobila.", "To je sinhroni closure.", da],
      ], "Closure je sinhrona funkcija koja vrati funkciju i pamti prag.", "function granica(prag) {\n  return (t) => t >= prag;\n}"),
      k("client/js/niz.js", "Bez tajmera", "Ovaj primer ne zakazuje posao.", "const visoka = granica(24);", "Gde je setTimeout?", [
        ["Unutar granice, da sačeka prag.", "Tajmer nije deo ovog primera.", false],
        ["Nigde u ovom primeru.", "Poziv je sinhron.", da],
      ], "Tajmer nije deo closure primera na trećem času.", "const visoka = granica(24);"),
      k("client/index.html", "Soba mašina", "Druga soba još nema šta da pokaže.", "<!-- soba mašina kasnije -->", "Da li se ventilator crta?", [
        ["Da, lopatice u sobi prekidača.", "Lopatica nema pre servera.", false],
        ["Ne. Soba mašina još nije na ekranu.", "Ista klasa Displej čeka drugi čas.", da],
      ], "Soba mašina se ne crta. Fokus stiže i sa tastature.", "<!-- nema sobe mašina -->"),
    ],
  },
  {
    n: 4,
    title: "Od naivnog prenosa do HTTP-a, pa Node",
    outcome: "Jedan zahtev i jedan odgovor. Kutija drži temperaturu.",
    problem: "Handler u Node-u pozove document i ugasi dugme. Šta se desi?",
    pretpostavka: "Server vidi isti dokument, ili 404 i ugašen port jesu isto.",
    options: [
      { key: "A", text: "Server vrati podatak, a browser menja prikaz kad obradi odgovor.", ok: true, why: "DOM ostaje u browseru. Handler vraća JSON ili dokument." },
      { key: "B", text: "Server vidi isto dugme i ugasi ga.", ok: false, why: "Poziv DOM-a na serveru ne menja dugme u browseru." },
      { key: "C", text: "404 i ugašen port jesu ista tišina.", ok: false, why: "404 ima status. Ugašen port nema HTTP status." },
    ],
    rezerva: {
      problem: "Putanja koje nema i ugašen port. Da li je ista greška?",
      options: [
        { key: "A", text: "Nije. 404 ima status. Ugašen port nema HTTP status.", ok: true, why: "Network razlikuje ta dva reda." },
        { key: "B", text: "Jeste. Oba znače da odgovora nema.", ok: false, why: "404 jeste odgovor." },
      ],
    },
    izlaz: "Čiji je DOM, a ko vraća JSON?",
    terms: [
      { id: "http", name: "HTTP zahtev", hint: "metod, putanja, status", body: "HTTP daje smisao toku bajtova: metod, putanja, zaglavlja, telo, status. Ovde je to HTTP/1.1.", code: "GET /api/soba HTTP/1.1\n\nHTTP/1.1 200 OK" },
      { id: "json", name: "JSON", hint: "tekst, ne objekat", body: "Telo je tekst. Panel pravi vrednost tek kad pročita taj tekst.", code: "const tekst = await response.text();\nconst soba = JSON.parse(tekst);" },
    ],
    overview: "IP, UDP, TLS, HTTP/2, HTTP/3, XML, SOAP, RPC, gRPC, GraphQL, Express i middleware.",
    steps: [
      k("server/server.js", "Cela poruka", "Soba prekidača pošalje jednu celu poruku i čeka da stigne cela.", "pošalji(celaPoruka)", "Šta ovaj prenos pretpostavlja?", [
        ["Da delovi smeju da zamene red.", "To pretpostavka još ne priznaje.", false],
        ["Da poruka stigne cela i redom.", "Naivan prenos.", da],
      ], "Naivan prenos pretpostavlja celu poruku, redom.", "pošalji(celaPoruka);"),
      k("server/server.js", "Pad pretpostavke", "Poruka se izgubi, ili dve polovine zamene red.", "polovina B stiže pre polovine A", "Šta je time palo?", [
        ["HTTP status.", "HTTP još nije imenovan.", false],
        ["Pretpostavka da cela poruka stigne redom.", "Zato treba delovi i redni brojevi.", da],
      ], "Pretpostavka padne pre nego što se bilo koji protokol imenuje.", "// poruka nije stigla cela"),
      k("server/server.js", "Potvrda", "Popravka još nema ime: delovi, redni brojevi, potvrda prijema.", "deo, redniBroj, potvrda", "Šta potvrda kaže pošiljaocu?", [
        ["Koji je ventilator uključen.", "Smisao zahteva još ne postoji.", false],
        ["Koji deo je primljen.", "Red se popravlja bez imena protokola.", da],
      ], "Delovi, redni brojevi i potvrda prijema popravljaju naivan prenos.", "potvrdi(redniBroj);"),
      k("server/server.js", "TCP", "Tek sada se imenuje pouzdan tok bajtova.", "TCP", "Šta TCP garantuje ovde?", [
        ["Da će ventilator biti uključen.", "Tok bajtova nema taj smisao.", false],
        ["Da bajtovi stignu pouzdano i redom.", "Segmentacija TCP-a nije IP fragmentacija.", da],
      ], "TCP je pouzdan tok bajtova. Još ne znači „uključi ventilator”.", "// TCP: pouzdan tok bajtova"),
      k("server/server.js", "HTTP", "Na tok se stavi metod, putanja, zaglavlja, telo i status.", "GET /api/soba HTTP/1.1", "Šta HTTP doda na TCP?", [
        ["Još jedan redni broj.", "Red već drži TCP.", false],
        ["Smisao: šta se traži i koji je status odgovora.", "Metod, putanja, zaglavlja, telo, status.", da],
      ], "HTTP daje smisao. Protokol koji čas gleda jeste HTTP/1.1.", "GET /api/soba HTTP/1.1"),
      k("server/server.js", "createServer", "Običan Node, bez framework-a.", "const server = http.createServer(obrada);", "Šta ova linija uradi?", [
        ["Otvori browser.", "Browser je druga strana.", false],
        ["Napravi server koji za svaki zahtev zove obradu.", "Još ne sluša port.", da],
      ], "http.createServer dolazi pre slušanja porta.", "const server = http.createServer(obrada);"),
      k("server/server.js", "listen", "Server kaže na kom portu čeka.", "server.listen(8787);", "Da li je adresa već u browseru?", [
        ["Da, listen otvori i stranicu.", "listen samo čeka vezu.", false],
        ["Ne. Port je otvoren, stranicu još niko nije tražio.", "Adresa dolazi sledeća.", da],
      ], "listen otvara port. Zahtev još nije poslat.", "server.listen(8787);"),
      k("server/server.js", "Komanda", "Proces se podiže iz terminala.", "node server/server.js", "Šta ova komanda pokrene?", [
        ["Samo CSS sobe.", "To nije Node.", false],
        ["Node proces koji sluša port.", "Isti fajl koji ima createServer i listen.", da],
      ], "Komanda je node server/server.js. Browser je i dalje poseban korak.", "node server/server.js"),
      k("server/soba.js", "Adresa", "Ista adresa se otvori u browseru, kao stranica, ne iz koda.", "http://127.0.0.1:8787/api/soba", "Kako čas prvi put vidi čitanje?", [
        ["Pozivom iz koda stranice.", "Poziv iz koda dolazi kasnije.", false],
        ["Tako što se adresa otvori u browseru.", "Odgovor se vidi i u logu procesa.", da],
      ], "Čitanje sobe se prvo otvara direktno u browseru. U telu je JSON tekst.", "GET /api/soba HTTP/1.1"),
      k("server/soba.js", "Ruta", "Poznata putanja vraća temperaturu i režim.", "if (putanja === \"/api/soba\") return 200;", "Šta nepoznata putanja vrati?", [
        ["Isti JSON, da panel ne pukne.", "Nepoznata putanja nije soba.", false],
        ["404.", "Status postoji. To nije ugašen port.", da],
      ], "Poznata putanja vraća temperaturu i režim. Ostale vraćaju 404.", "if (putanja !== \"/api/soba\") return 404;"),
      k("server/soba.js", "Soba mašina", "Tek sada se crtaju kutija, soba mašina i ventilator.", "soba mašina, ventilator priključen", "Gde se lopatice vrte?", [
        ["U sobi prekidača, od prve nedelje.", "Taj crtež ne postoji.", false],
        ["U sobi mašina, samo dok je udaljeni režim uključen.", "CSS transformacija pokazuje režim kutije.", da],
      ], "Ventilator se crta tek kad server radi, i samo u sobi mašina.", "<!-- soba mašina -->"),
      k("server/soba.js", "Bez Err", "Isečak ovog časa nema granu koja piše Err.", "if (response.ok) displej.textContent = telo.temperatura;", "Šta neuspeh uradi displeju?", [
        ["Upiše Err.", "Tu grane još nema.", false],
        ["Ostavi crte.", "Nema broja za neuspeh i nema reči Err.", da],
      ], "Neuspeh na času 4 ostavlja crte. Dugme Pročitaj šalje jedno čitanje. Sledeći korak na frontu više nije izvor temperature.", "if (response.ok) displej.textContent = String(telo.temperatura);"),
    ],
  },
  {
    n: 5,
    title: "Čekanje i neuspeh",
    outcome: "Čekanje, podatak i greška. 200 nije 500, a 500 nije ugašen port.",
    problem: "fetch je dobio HTTP 500. Da li je to catch?",
    pretpostavka: "Svaki neuspeh je catch, ili 500 znači da odgovora nema.",
    options: [
      { key: "A", text: "Odgovor postoji. Uspeh se čita iz statusa.", ok: true, why: "500 ne ulazi sam u catch. Ugašen server nema taj odgovor." },
      { key: "B", text: "Svaki neuspeh je catch.", ok: false, why: "Status koji nije uspeh i dalje je odgovor." },
      { key: "C", text: "500 znači da odgovora nema.", ok: false, why: "Odgovor jeste stigao. Nema ga kad je proces ugašen." },
    ],
    rezerva: {
      problem: "Zahtev još čeka. Da li je ceo browser stao?",
      options: [
        { key: "A", text: "Nije. await zaustavlja tu funkciju. Drugi klik i dalje važi.", ok: true, why: "Čekanje nije blokada browsera." },
        { key: "B", text: "Jeste. Dok odgovor ne stigne, ništa ne prima klik.", ok: false, why: "Samo ta funkcija čeka." },
      ],
    },
    izlaz: "Koja greška ima status, a koja nema odgovor?",
    terms: [
      { id: "await", name: "await", hint: "ova funkcija čeka", body: "await zaustavlja tu funkciju, ne ceo browser. Drugi klik i dalje važi.", code: "const response = await fetch(\"/api/soba\");\nif (!response.ok) displej.textContent = \"Err\";" },
      { id: "takt", name: "Takt", hint: "kutija sama menja broj", body: "Takt je setInterval u Node procesu. Diže temperaturu dok je režim isključen.", code: "setInterval(() => {\n  temperatura += ukljucen ? -0.5 : 0.5;\n}, 1000);" },
    ],
    overview: "Spoljni API, timeout, prekid jednog zahteva, više zahteva odjednom, call stack, postojanje task i microtask redova.",
    steps: [
      k("client/js/displej.js", "Tri stanja", "Ekran čeka, ima podatak, ili ima grešku.", "čeka | cifre | greška", "Koliko je vidljivih stanja displeja?", [
        ["Jedno: uvek cifre.", "Čekanje i greška se vide.", false],
        ["Tri.", "Čekanje nije još ni podatak ni greška.", da],
      ], "Dugme učitava temperaturu. Ekran je u jednom od ta tri stanja.", "displej.textContent = \"----\";"),
      k("client/js/displej.js", "200", "Uspeh nosi temperaturu i režim.", "HTTP/1.1 200 OK\n{\"temperatura\":24,\"ukljucen\":false}", "Šta displej upiše?", [
        ["Err, jer je broj sa servera.", "200 je uspeh.", false],
        ["Cifre iz tela.", "response.ok jeste uspeh.", da],
      ], "HTTP 200 sa temperaturom i režimom upisuje cifre.", "if (response.ok) displej.textContent = String(telo.temperatura);"),
      k("server/ventilator.js", "Izvučen kabl", "Pripremljeni 500 jeste ventilator koji nije priključen.", "if (!prikljucen) return 500;", "Da li je odgovor stigao?", [
        ["Nije. 500 znači tišinu.", "Status postoji.", false],
        ["Jeste. Status je 500.", "Telo nema temperaturu za displej.", da],
      ], "Izvučen ventilator vraća HTTP 500. Odgovor stiže.", "return { status: 500 };"),
      k("client/js/displej.js", "Err", "Završen neuspeh više ne ostavlja crte.", "if (!response.ok) displej.textContent = \"Err\";", "Šta soba prekidača pokaže na 500?", [
        ["Poslednje cifre, kao da je uspeh.", "Neuspeh ima svoju granu.", false],
        ["Err.", "Nema broja u tom odgovoru.", da],
      ], "Završen status koji nije uspeh piše Err.", "if (!response.ok) displej.textContent = \"Err\";"),
      k("client/js/displej.js", "Nema statusa", "Proces se ugasi. Zahtev nema HTTP status.", "catch { displej.textContent = \"Err\"; }", "Po čemu se ovo razlikuje od 500?", [
        ["Ni po čemu. Oba su catch.", "500 ima status u Network panelu.", false],
        ["Network nema status. 500 ima status 500.", "Ista reč Err na ekranu ne briše tu razliku.", da],
      ], "Isečak piše Err i za status koji nije uspeh i za izostanak odgovora. Nastavnik tu liniju može da izmeni.", "catch {\n  displej.textContent = \"Err\";\n}"),
      k("client/js/displej.js", "fetch", "Čitanje iz koda dolazi tek sada.", "const response = await fetch(\"/api/soba\");", "Da li je fetch prvi način da se soba vidi?", [
        ["Da, adresa u browseru ne važi.", "Adresa je bila na času 4.", false],
        ["Ne. Adresa je već pokazala isti odgovor.", "fetch je poziv iz koda.", da],
      ], "Isti zahtev sada polazi iz koda. Protokol je i dalje HTTP/1.1.", "const response = await fetch(\"/api/soba\");"),
      k("client/js/displej.js", "Nije catch", "500 ne skače sam u catch.", "const response = await fetch(\"/api/soba\");\nif (!response.ok) { /* Err */ }", "Gde se 500 vidi?", [
        ["Samo u catch.", "fetch se razreši odgovorom.", false],
        ["U statusu odgovora.", "Uspeh se čita iz statusa.", da],
      ], "500 ne vodi samo po sebi u catch. Odgovor postoji.", "if (!response.ok) displej.textContent = \"Err\";"),
      k("client/js/displej.js", "await", "Čekanje stoji unutar jedne funkcije.", "async function procitaj() {\n  const response = await fetch(\"/api/soba\");\n}", "Šta await zaustavi?", [
        ["Ceo browser.", "Drugi klik i dalje važi.", false],
        ["Tu funkciju.", "Ostatak stranice i dalje prima događaje.", da],
      ], "await zaustavlja tu funkciju, ne ceo browser.", "const response = await fetch(\"/api/soba\");"),
      k("server/stanje.js", "Takt", "Kad await već postoji, u proces ulazi interval.", "setInterval(() => {\n  temperatura += ukljucen ? -0.5 : 0.5;\n}, 1000);", "Kad temperatura krene da se menja sama?", [
        ["Od časa 1.", "Do await-a kutija drži broj miran.", false],
        ["Tek kad interval postoji u procesu.", "Diže dok je režim isključen, spušta dok je uključen.", da],
      ], "Takt je setInterval u Node procesu. Nepriključen ventilator ostavlja režim isključen, pa temperatura i dalje raste.", "setInterval(pomeriTemperaturu, 1000);"),
      k("server/stanje.js", "Režim isključen", "Kabl je izvučen, prekidač na ekranu kaže uključi.", "ukljucen === false", "Šta takt uradi?", [
        ["Spusti temperaturu, jer prekidač tako kaže.", "Režim kutije je isključen.", false],
        ["Diže je. Režim je isključen.", "Prekidač nije režim kutije.", da],
      ], "Soba mašina pokazuje temperaturu koju takt menja. Čitanje i dalje može da vrati 500.", "temperatura += ukljucen ? -0.5 : 0.5;"),
      k("client/js/displej.js", "Posle uspeha", "Uspeh upiše cifre. Sledeći neuspeh ih zameni.", "Err", "Šta ostane na displeju posle 200, dok nema novog čitanja?", [
        ["Crte, jer je čitanje gotovo.", "Cifre ostaju do sledećeg čitanja.", false],
        ["Poslednje cifre.", "Komanda ih ne briše.", da],
      ], "Posle HTTP 200 displej čuva poslednje cifre dok browser ponovo ne pročita kutiju.", "displej.textContent = String(telo.temperatura);"),
      k("client/js/displej.js", "Drugi klik", "Prvi zahtev još čeka. Stigne drugi klik.", "procitaj(); procitaj();", "Da li drugi klik važi?", [
        ["Ne, browser je u await-u.", "await nije brava stranice.", false],
        ["Da. Čekanje ne blokira browser.", "Rezerva ako je glavna pitalica već to rekla.", da],
      ], "Drugi klik za vreme čekanja i dalje radi.", "procitaj();\nprocitaj();"),
    ],
  },
  {
    n: 6,
    title: "Komande i ponavljanje",
    outcome: "Željeno stanje, provera tela i smisao ponavljanja.",
    problem: "Koju komandu smemo da pošaljemo dvaput?",
    pretpostavka: "Prebacivanje je bezbednije jer vraća nazad, ili forma garantuje telo.",
    options: [
      { key: "A", text: "Postavljanje na uključeno.", ok: true, why: "Drugi put ostavlja isti željeni efekat." },
      { key: "B", text: "Prebacivanje režima, jer vraća nazad.", ok: false, why: "Drugi put poništi prvi efekat." },
      { key: "C", text: "Bilo koju koja vrati 200.", ok: false, why: "Status 200 ne znači da ponavljanje ima isti efekat." },
    ],
    rezerva: {
      problem: "Telo je {\"ukljucen\":\"da\"}. Šta server vrati?",
      options: [
        { key: "A", text: "HTTP 400. Telo nije režim.", ok: true, why: "Tekst nije boolean. Forma to ne sprečava." },
        { key: "B", text: "HTTP 200 i režim uključen.", ok: false, why: "Server ne pogađa tekst." },
      ],
    },
    izlaz: "Koja komanda sme dvaput, a koja drugi put poništi efekat?",
    terms: [
      { id: "zeljeno", name: "Željeno stanje", hint: "šta komanda traži", body: "Komanda šalje uključeno ili isključeno. Uspeh vraća samo režim. Temperatura nije u tom telu.", code: "PUT /api/ventilator\n{\"ukljucen\":true}" },
      { id: "validacija", name: "Validacija", hint: "server proverava telo", body: "Tekst umesto boolean vrednosti dobija HTTP 400. Forma ne sprečava drugačije telo.", code: "{\"ukljucen\":\"da\"}\n\nHTTP/1.1 400" },
    ],
    overview: "REST, stateless obrada, optimistički prikaz, prihvaćena komanda naspram potvrde fizičkog uređaja.",
    steps: [
      k("server/ventilator.js", "Željeno stanje", "Komanda kaže u kom stanju ventilator treba da bude.", "{ \"ukljucen\": true }", "Šta telo nosi?", [
        ["Koliko je sada stepeni.", "Temperatura nije u komandi.", false],
        ["Boolean željenog stanja.", "Jedno polje.", da],
      ], "Komanda postavlja ventilator na uključeno ili isključeno.", "ukljucen: true"),
      k("server/ventilator.js", "PUT", "Metod i putanja su deo zahteva.", "PUT /api/ventilator", "Koji je zahtev?", [
        ["GET /api/soba", "To je čitanje.", false],
        ["PUT /api/ventilator", "Telo nosi željeno stanje.", da],
      ], "Komanda je PUT /api/ventilator.", "PUT /api/ventilator"),
      k("server/ventilator.js", "Jedno polje", "Telo sme da ima samo ukljucen, i to boolean.", "Object.keys(telo)", "Šta prolazi?", [
        ["{ ukljucen: true, temperatura: 24 }", "Suvišno polje nije režim.", false],
        ["{ ukljucen: true }", "Tačno jedno boolean polje.", da],
      ], "Server prima tačno jedno polje ukljucen.", "typeof telo.ukljucen === \"boolean\""),
      k("server/ventilator.js", "Samo režim", "Uspeh ne vraća sobu.", "HTTP/1.1 200 OK\n{\"ukljucen\":true}", "Šta nije u telu?", [
        ["Režim.", "Režim jeste odgovor.", false],
        ["Temperatura.", "Displej temperature menja samo čitanje.", da],
      ], "Uspešan odgovor nosi samo režim.", "{ \"ukljucen\": true }"),
      k("client/js/prekidac.js", "Displej miruje", "Stigao je 200 na komandu.", "odgovor: { ukljucen: true }", "Šta displej temperature uradi?", [
        ["Upisuje novu temperaturu iz odgovora.", "U odgovoru je nema.", false],
        ["Ostaje na poslednjem čitanju.", "Komanda ne crta cifre.", da],
      ], "Komanda ne menja displej sobe prekidača.", "// cifre ostaju"),
      k("server/ventilator.js", "400", "Neko pošalje tekst umesto boolean vrednosti.", "{ \"ukljucen\": \"da\" }", "Koji je status?", [
        ["200, forma bi to ionako sprečila.", "Forma ne sprečava drugačije telo.", false],
        ["400. Telo nije režim.", "Režim u kutiji se ne menja.", da],
      ], "Telo mimo forme, sa tekstom umesto boolean vrednosti, dobija HTTP 400.", "return { status: 400 };"),
      k("server/ventilator.js", "Dvaput uključeno", "Ista komanda ode dvaput.", "PUT { \"ukljucen\": true }\nPUT { \"ukljucen\": true }", "Šta ostane?", [
        ["Isključeno, jer je drugi put poništio.", "Ovo nije prebacivanje.", false],
        ["Uključeno.", "Postavljanje na isto stanje ostaje.", da],
      ], "Dva slanja „uključeno” ostavljaju isti željeni efekat.", "ukljucen = true;"),
      k("server/ventilator.js", "Prebacivanje", "Druga komanda samo okrene trenutni režim.", "ukljucen = !ukljucen", "Šta drugi put uradi?", [
        ["Ostavi isti efekat.", "Drugi put poništi prvi.", false],
        ["Vrati prethodno stanje.", "Zato prebacivanje nije bezbedno za ponavljanje.", da],
      ], "Dva slanja prebacivanja menjaju ishod.", "ukljucen = !ukljucen;"),
      k("server/ventilator.js", "200 nije smisao", "Obe komande mogu da vrate 200.", "200 i 200", "Šta status kaže o ponavljanju?", [
        ["Da smeju obe, jer je 200 uspeh.", "Status ne kaže da li drugi put poništava.", false],
        ["Ništa o smislu drugog slanja.", "Smisao je u tome šta telo traži.", da],
      ], "Status 200 ne znači da ponavljanje ima isti efekat.", "// 200 nije smisao ponavljanja"),
      k("server/ventilator.js", "Kabl napolju", "Komanda traži uključeno, ventilator nije priključen.", "return 500", "Šta lopatice urade?", [
        ["Krenu, jer prekidač tako kaže.", "Nema kabla. Režim se ne uključi.", false],
        ["Ne vrte se. Prekidač sme da ostane na uključi.", "Odgovor je 500.", da],
      ], "Komanda koja traži uključenje dok ventilator nije priključen dobija HTTP 500.", "if (telo.ukljucen && !prikljucen) return 500;"),
      k("server/ventilator.js", "Granica", "Pomoćni kod za telo ima granicu veličine.", "if (telo.length > granica) odbij", "Šta veliko telo dobije?", [
        ["200 i odsečen JSON.", "Neispravan ili prevelik unos se odbija.", false],
        ["Odbijenicu, pre nego što postane režim.", "Režim se ne pogađa iz otpada.", da],
      ], "Pomoćni kod odbija prevelik unos i neispravan JSON.", "if (preveliko) return 400;"),
      k("client/js/prekidac.js", "Forma nije brava", "Dugme šalje boolean. Alat pošalje nešto drugo.", "curl -X PUT --data '{\"ukljucen\":\"da\"}'", "Da li forma to spreči?", [
        ["Da, server vidi samo formu.", "Zahtev mimo ekrana i dalje stiže.", false],
        ["Ne. Server i dalje proverava telo.", "400 ostaje na serveru.", da],
      ], "Forma ne sprečava drugačije telo.", "PUT /api/ventilator"),
    ],
  },
  {
    n: 7,
    title: "Trajno stanje i Docker",
    outcome: "Režim i istorija su jedna celina upisa.",
    problem: "Režim je upisan, istorija nije. Da li je evidencija cela?",
    pretpostavka: "Bitno stanje je sačuvano pa je istorija sporedna, ili kontejner sam čuva oba upisa.",
    options: [
      { key: "A", text: "Nije, dok oba upisa nisu jedna celina.", ok: true, why: "Ili oba uspeju, ili se oba povuku." },
      { key: "B", text: "Jeste, istorija je sporedna.", ok: false, why: "Istorija je deo evidencije komande." },
      { key: "C", text: "Kontejner sam čuva oba upisa.", ok: false, why: "Kontejner ne spaja dva odvojena upita." },
    ],
    rezerva: {
      problem: "Gde smeju da stoje kredencijali baze?",
      options: [
        { key: "A", text: "Na kutiji. Browser ih ne dobija.", ok: true, why: "Stranica ne otvara bazu." },
        { key: "B", text: "U odgovoru JSON-a, da panel proveri vezu.", ok: false, why: "Kredencijal u browseru više nije tajna kutije." },
      ],
    },
    izlaz: "Šta restart procesa čuva, a šta brisanje skladišta briše?",
    terms: [
      { id: "transakcija", name: "Transakcija", hint: "oba upisa ili nijedan", body: "Povezani upis režima i istorije je jedna celina. Restart procesa ne spaja odvojene upite.", code: "BEGIN;\nUPDATE ventilator SET ukljucen = $1;\nINSERT INTO istorija(komanda) VALUES ($2);\nCOMMIT;" },
    ],
    overview: "Relacioni i dokumentni model, virtuelna mašina i kontejner.",
    steps: [
      k("server/ventilator.js", "Parametar", "Vrednost ulazi kao parametar, ne lepljenjem teksta.", "UPDATE ventilator SET ukljucen = $1", "Zašto $1?", [
        ["Da se tekst komande spoji u SQL.", "Lepljenje teksta je drugi čas, kao opomena.", false],
        ["Da vrednost ostane podatak, ne deo upita.", "Upit je parametrizovan.", da],
      ], "Upit je parametrizovan.", "UPDATE ventilator SET ukljucen = $1 WHERE id = 1"),
      k("server/baza.js", "Dva reda", "Režim i istorija su dva upisa.", "UPDATE ...\nINSERT INTO istorija ...", "Šta evidencija traži?", [
        ["Samo režim.", "Istorija nije sporedna.", false],
        ["Oba reda.", "Komanda bez istorije nije cela evidencija.", da],
      ], "Čitanje i izmena režima idu uz zapis komande.", "INSERT INTO istorija (komanda) VALUES ($1)"),
      k("server/ventilator.js", "BEGIN", "Dva upita ulaze u jednu celinu.", "BEGIN", "Šta BEGIN otvori?", [
        ["Novi Node proces.", "Proces već radi.", false],
        ["Celinu koja još nije potvrđena.", "COMMIT ili ROLLBACK je zatvaraju.", da],
      ], "Povezani upis režima i istorije je jedna celina.", "BEGIN;"),
      k("server/ventilator.js", "COMMIT", "Oba upita su prošla.", "COMMIT", "Šta posle COMMIT-a važi?", [
        ["Samo do restarta procesa.", "Baza drži red i posle procesa.", false],
        ["Oba reda ostaju.", "Celina je uspela.", da],
      ], "Ili oba uspeju, ili se oba povuku.", "COMMIT;"),
      k("server/ventilator.js", "ROLLBACK", "Drugi upit u celini padne.", "ROLLBACK", "Šta ostane od prvog upita?", [
        ["Režim, istorija može kasnije.", "Celina se povlači cela.", false],
        ["Ni režim ni istorija te celine.", "Restart ne spaja ono što nije bilo jedna celina.", da],
      ], "Jedna promena: drugi upit ne uspe, pa se prvi povuče.", "ROLLBACK;"),
      k("server/baza.js", "Restart procesa", "Node se ugasi i ponovo podigne. Baza ostane.", "node server/server.js", "Šta sledeće čitanje vidi?", [
        ["Podrazumevano isključeno, proces je nov.", "Uspešna celina je u bazi.", false],
        ["Režim iz uspele celine.", "Restart samo procesa ne briše bazu.", da],
      ], "Restart samo Node procesa čuva režim upisan u jednoj celini.", "SELECT ukljucen FROM ventilator WHERE id = 1"),
      k("server/baza.js", "Dva odvojena upita", "Neko uradi UPDATE, pa kasnije INSERT, bez BEGIN.", "UPDATE;\n-- proces padne\nINSERT;", "Šta restart spoji?", [
        ["Oba, jer su bila namenjena istoj komandi.", "Namera nije celina.", false],
        ["Ništa. Odvojeni upiti nisu jedna celina.", "Prvi može da ostane bez drugog.", da],
      ], "Restart ne spaja dva odvojena upita.", "// nema BEGIN"),
      k("server/baza.js", "Kontejner", "Kontejner se obriše. Disk baze ostane.", "docker compose down", "Šta nestane?", [
        ["I režim, jer je kontejner držao podatak u sebi.", "Trajnost je na disku, ne u imenu kontejnera.", false],
        ["Proces baze. Podatak ostaje ako disk ostane.", "Kontejner nije atomičnost upisa.", da],
      ], "Kontejner sam ne čini upise atomskim ni trajnim.", "docker compose down"),
      k("server/baza.js", "Disk", "Obriše se i trajno skladište.", "volume", "Šta čitanje posle toga vidi?", [
        ["Isti režim. Docker pamti sam.", "Bez diska nema prethodnog reda.", false],
        ["Početno stanje, ne stari režim.", "Volume je bio trajnost.", da],
      ], "Demonstracija razlikuje restart procesa, uklanjanje kontejnera i uklanjanje trajnog skladišta.", "# volume"),
      k("server/baza.js", "Kredencijal", "Browser traži sobu.", "GET /api/soba", "Šta odgovor ne sme da nosi?", [
        ["Temperaturu.", "To jeste čitanje.", false],
        ["Kredencijale baze.", "Oni ostaju na kutiji.", da],
      ], "Browser ne dobija kredencijale baze.", "// nema lozinke u JSON-u"),
      k("server/ventilator.js", "Put", "Zahtev dođe, upit prođe, rezultat se vrati.", "zahtev → upit → rezultat → odgovor", "Gde je provera tela u tom putu?", [
        ["U browseru, pre slanja.", "Browser nije jedina provera.", false],
        ["Na kutiji, pre upisa.", "Loše telo ne otvara celinu.", da],
      ], "Ishod časa je taj put. Baza ne vidi telo koje nije režim.", "if (!teloJeRezim(telo)) return 400;"),
      k("server/baza.js", "Istorija nije sporedna", "Režim jeste upisan, red istorije nije.", "UPDATE bez INSERT", "Da li je evidencija cela?", [
        ["Jeste. Bitno je samo trenutno stanje.", "Istorija je deo komande.", false],
        ["Nije, dok nisu jedna celina.", "Oba ili nijedan.", da],
      ], "Evidencija nije pouzdana dok režim i istorija nisu jedna celina.", "BEGIN; UPDATE; INSERT; COMMIT;"),
    ],
  },
  {
    n: 8,
    title: "Koliko je prikaz svež",
    outcome: "Displej čuva poslednje čitanje. Takt ga ne pomera.",
    problem: "Displej kaže 24 °C, a očitavanje je staro deset minuta. Šta taj broj znači?",
    pretpostavka: "Broj na ekranu jeste sadašnja temperatura, ili stariji odgovor sme da pregazi noviji.",
    options: [
      { key: "A", text: "Poslednje očitavanje, ne sadašnju temperaturu.", ok: true, why: "Broj nosi vrednost i trenutak. Starost je deo prikaza." },
      { key: "B", text: "Sadašnju temperaturu kutije.", ok: false, why: "Kutija je u međuvremenu mogla da promeni broj." },
      { key: "C", text: "Stariji odgovor sme da pregazi noviji jer je sa servera.", ok: false, why: "Stariji trenutak ne pobedi samo zato što je stigao kasnije." },
    ],
    rezerva: {
      problem: "Ikonica je sveža, temperatura je stara deset minuta. Da li dele rok?",
      options: [
        { key: "A", text: "Ne moraju. Keš ikonice i keš temperature nisu isti rok.", ok: true, why: "Svežina jednog resursa ne važi za drugi." },
        { key: "B", text: "Moraju. Stranica je jedna.", ok: false, why: "Stranica sklapa više odgovora." },
      ],
    },
    izlaz: "Šta broj na ekranu dokazuje o trenutku merenja?",
    terms: [
      { id: "ocitavanje", name: "Očitavanje", hint: "vrednost i trenutak", body: "Čitanje od ovog časa nosi i trenutak. Displej pokazuje starost.", code: "{\"temperatura\":24,\"ukljucen\":false,\"trenutak\":\"2026-10-18T08:00:00Z\"}" },
      { id: "polling", name: "Periodično čitanje", hint: "isto čitanje, samo se ponavlja", body: "Prekidač odmah pošalje jedno čitanje, pa ga ponavlja. SSE i WebSocket ostaju imena drugog načina.", code: "procitaj();\nconst id = setInterval(procitaj, 4000);" },
    ],
    overview: "SSE, WebSocket, History API, SPA, React hooks, storage, PWA i offline. Dovod sobe mašina čas ne imenuje.",
    steps: [
      k("client/js/displej.js", "Miruje", "Takt u kutiji menja broj. Displej sobe prekidača stoji.", "displej ostaje 24", "Zašto displej stoji?", [
        ["Zato što je takt stao.", "Takt i dalje radi u procesu.", false],
        ["Zato što ga ni takt ni komanda ne pomeraju.", "Treba novo čitanje.", da],
      ], "Displej stoji jer ga ne pomera ni takt ni odgovor komande.", "// cifre čekaju čitanje"),
      k("server/soba.js", "Trenutak", "Očitavanje više nije samo broj.", "{ temperatura: 24, trenutak }", "Šta očitavanje nosi?", [
        ["Samo temperaturu.", "Starost se ne vidi iz samog broja.", false],
        ["Vrednost i trenutak.", "Displej može da pokaže starost.", da],
      ], "Očitavanje nosi vrednost i trenutak.", "trenutak"),
      k("client/js/displej.js", "Starost", "Pored cifara stoji trenutak.", "starost.textContent = trenutak", "Šta 24 od pre deset minuta znači?", [
        ["Sadašnju temperaturu.", "To je poslednje očitavanje.", false],
        ["Poslednje očitavanje.", "Starost je deo prikaza.", da],
      ], "Displej pokazuje starost. Broj nije sam od sebe sadašnjost.", "starost.textContent = trenutak;"),
      k("client/js/displej.js", "Odmah jedno", "Prekidač periodičnog čitanja se uključi.", "procitaj();\nsetInterval(procitaj, 4000);", "Šta se desi u tom trenutku?", [
        ["Čeka se pun interval, pa prvo čitanje.", "Čas šalje jedno odmah.", false],
        ["Ode jedno čitanje odmah, pa se ponavlja.", "Dugme Pročitaj i dalje šalje jedno.", da],
      ], "Uključivanje odmah pošalje jedno čitanje, pa ga ponavlja.", "procitaj();\nsetInterval(procitaj, 4000);"),
      k("client/js/displej.js", "Neuspeo krug", "Jedan krug u nizu dobije 500.", "if (!response.ok) displej.textContent = \"Err\"", "Koja grana piše Err?", [
        ["Nova, samo za periodično čitanje.", "Ista grana kao Pročitaj.", false],
        ["Ista kao jedno čitanje.", "Neuspeh je i dalje neuspeh.", da],
      ], "Neuspeo krug piše Err istom granom kao Pročitaj.", "if (!response.ok) displej.textContent = \"Err\";"),
      k("client/js/displej.js", "Stariji gubi", "Sporiji zahtev, meren ranije, stiže posle bržeg.", "pristigliTrenutak < poznatiTrenutak", "Šta ostane na ekranu dok je provera uključena?", [
        ["Stariji broj, jer je stigao poslednji.", "Poslednji dolazak nije novije merenje.", false],
        ["Noviji broj.", "Stariji trenutak se odbaci.", da],
      ], "Sa proverom, noviji broj ostaje. Bez provere, stariji pregazi ekran.", "if (pristigli < poznati) return;"),
      k("client/js/displej.js", "Komanda nije čitanje", "Stigao je 200 na PUT.", "{ ukljucen: true }", "Da li se starost temperature osveži?", [
        ["Da, svaki 200 je novo očitavanje.", "U telu nema temperature ni trenutka čitanja.", false],
        ["Ne. Temperatura čeka novo čitanje.", "Komanda ne upisuje cifre.", da],
      ], "Odgovor komande ne osvežava temperaturu sobe prekidača.", "// PUT ne nosi trenutak čitanja"),
      k("client/js/displej.js", "Dovod", "Soba mašina se pomeri iako Pročitaj nije pritisnut.", "soba mašina dobije broj", "Kako čas zove taj dovod?", [
        ["SSE ili WebSocket, i okreće ga na sobu prekidača.", "Čas ga ne imenuje i ne okreće ga tamo.", false],
        ["Ne imenuje ga. Soba prekidača ga ne koristi.", "Ona i dalje čita.", da],
      ], "Postojeći dovod puni samo sobu mašina. Čas ga ne imenuje.", "// soba prekidača ignoriše dovod"),
      k("client/js/displej.js", "Imena koja se ne grade", "Treba drugi način da soba prekidača sazna broj.", "SSE, WebSocket", "Šta čas od njih napravi?", [
        ["Server koji gura cifre na displej prekidača.", "Ovaj čas to ne pravi.", false],
        ["Imena. Displej prekidača i dalje čita.", "Polling ostaje ovde.", da],
      ], "SSE i WebSocket se imenuju kao drugi način i ne uvode se kao dovod sobe prekidača.", "// nema novog servera za SSE"),
      k("client/js/displej.js", "Pročitaj ostaje", "Periodično čitanje je uključeno.", "dugme Pročitaj", "Šta Pročitaj i dalje radi?", [
        ["Ništa. Zamenjeno je intervalom.", "Ostaje i šalje jedno čitanje.", false],
        ["Jedno čitanje.", "Interval je poseban prekidač.", da],
      ], "Dugme Pročitaj ostaje.", "procitaj();"),
      k("client/js/displej.js", "Bez provere", "Ista trka, provera isključena.", "uvek upiši pristigli broj", "Šta stariji odgovor uradi?", [
        ["I dalje gubi, jer je server poslao oba.", "Bez provere poslednji dolazak pobedi.", false],
        ["Pregazi noviji broj.", "Zato provera postoji.", da],
      ], "Jedna promena u editoru uključuje ili isključuje odbacivanje starijeg trenutka.", "return true; // primi i stariji"),
      k("client/js/displej.js", "Dva roka", "Ikonica stila je nova. Temperatura je stara.", "Cache-Control nije jedan rok za sve", "Da li dele svežinu?", [
        ["Da, stranica je jedan keš.", "Resursi imaju svoje odgovore.", false],
        ["Ne moraju.", "Keš ikonice i keš temperature nisu isti rok.", da],
      ], "Keš ikonice i keš temperature ne moraju isti rok.", "// dva resursa, dva roka"),
    ],
  },
  {
    n: 9,
    title: "Ko sme da upravlja",
    outcome: "Cookie nosi ključ. Kutija drži ulogu.",
    problem: "Posmatrač nema dugme „Uključi”. Da li je server zaštićen?",
    pretpostavka: "Ko ne vidi dugme, ne može da pošalje komandu, ili CORS dokazuje korisnika.",
    options: [
      { key: "A", text: "Nije. Server proverava ulogu na zahtevu.", ok: true, why: "Sakriveno dugme ne zaustavlja komandu mimo ekrana." },
      { key: "B", text: "Jeste, ko ne vidi dugme ne može da pošalje komandu.", ok: false, why: "Isti zahtev i dalje stiže." },
      { key: "C", text: "CORS dokazuje ko je korisnik.", ok: false, why: "CORS nije autentifikacija." },
    ],
    rezerva: {
      problem: "Alat van browsera pročita telo. JS druge stranice ne mora da sme. Šta CORS dokazuje?",
      options: [
        { key: "A", text: "JS ne čita telo. To nije dokaz da server ćuti.", ok: true, why: "CORS nije autentifikacija. Alat van browsera i dalje čita telo." },
        { key: "B", text: "Da je pozivalac operater.", ok: false, why: "Pregledačko pravilo nije uloga na kutiji." },
      ],
    },
    izlaz: "Gde se proverava pravo: na dugmetu ili na zahtevu?",
    terms: [
      { id: "sesija", name: "Sesija", hint: "ključ u cookie-ju, uloga na kutiji", body: "Dva neprozirna ključa stoje u kodu. HttpOnly cookie ne nosi ime uloge.", code: "Set-Cookie: sesija=kljuc-posmatraca; HttpOnly" },
      { id: "statusi", name: "401 i 403", hint: "nema sesije, ili uloga ne sme", body: "Komanda bez cookie-ja je 401. Posmatrač je 403. Loše telo je 400. Izvučen ventilator je 500.", code: "nema cookie → 401\nposmatrac → 403\noperater → 200" },
    ],
    overview: "Prijava preko treće strane, tokeni, XSS, SQL injection, CSRF, HTTPS. Bez login forme.",
    steps: [
      k("server/sesija.js", "Dva ključa", "U kodu kutije stoje dva neprozirna ključa.", "kljuc-posmatraca\nkljuc-operatera", "Šta ključ nije?", [
        ["Nasumičan niz koji kutija poznaje.", "To jeste.", false],
        ["Ime uloge upisano u browseru.", "Uloga nije deo onoga što browser sme da kaže.", da],
      ], "Dve sesije su pripremljene: posmatrač i operater.", "const KLJUC_POSMATRACA = \"kljuc-posmatraca\";"),
      k("server/sesija.js", "HttpOnly", "Izbor na panelu traži kolačić.", "Set-Cookie: sesija=...; HttpOnly", "Šta stranica sme da pročita iz tog kolačića?", [
        ["Ulogu, da sakrije dugme pouzdano.", "HttpOnly se ne čita iz JS-a, a uloga ionako nije u njemu.", false],
        ["Ništa iz JS-a. Ključ ostaje u kolačiću.", "Kutija po ključu nađe ulogu.", da],
      ], "Cookie je HttpOnly i nosi neproziran ključ.", "Set-Cookie: sesija=kljuc; HttpOnly"),
      k("server/sesija.js", "Mapa", "Isti kolačić, druga reč u mapi.", "mapa.set(kljuc, uloga)", "Kome kutija veruje?", [
        ["Polju uloga u JSON telu.", "Browser bi to sam napisao.", false],
        ["Svojoj mapi, po ključu iz kolačića.", "Ime uloge iz browsera se ne čita.", da],
      ], "Uloga ostaje u mapi na kutiji.", "ULOGA_PO_KLJUCU.get(kljuc)"),
      k("server/soba.js", "Čitanje", "Neko traži GET /api/soba bez kolačića.", "GET /api/soba", "Šta čitanje traži?", [
        ["Sesiju operatera.", "Čitanje ne traži sesiju.", false],
        ["Ništa o ulozi.", "Komanda je ta koja proverava.", da],
      ], "Čitanje ne traži sesiju.", "GET /api/soba"),
      k("server/sesija.js", "401", "Komanda ode bez kolačića.", "nema cookie", "Koji je status?", [
        ["403, kao posmatrač.", "Posmatrač ima ključ.", false],
        ["401.", "Nema sesije.", da],
      ], "Komanda bez cookie-ja dobija 401.", "return { status: 401 };"),
      k("server/sesija.js", "403", "Kolačić je ključ posmatrača.", "uloga === \"posmatrac\"", "Koji je status?", [
        ["200, dugme je ionako sakriveno.", "Sakriveno dugme nije provera.", false],
        ["403.", "Uloga ne sme da komanduje.", da],
      ], "Komanda posmatrača dobija 403. Režim se ne menja.", "return { status: 403 };"),
      k("server/ventilator.js", "400 posle uloge", "Operater pošalje tekst umesto boolean vrednosti.", "{ \"ukljucen\": \"da\" }", "Šta se gleda prvo?", [
        ["Telo. 400 stiže i bez sesije.", "Uloga se gleda pre tela.", false],
        ["Uloga, pa telo. Ovo je 400.", "Loš unos nije 401.", da],
      ], "Tek posle uloge kutija gleda telo: loš unos je 400.", "if (!teloJeRezim(telo)) return 400;"),
      k("server/ventilator.js", "500 posle uloge", "Operater traži uključeno, kabl je napolju.", "prikljucen === false", "Koji je status?", [
        ["403, ventilator se štiti ulogom.", "Uloga je prošla.", false],
        ["500.", "Izvučen ventilator nije odbijena uloga.", da],
      ], "Izvučen ventilator je 500 i posle provere uloge.", "return { status: 500 };"),
      k("server/ventilator.js", "200 operater", "Operater pošalje { ukljucen: true }, kabl je u kutiji.", "HTTP/1.1 200", "Šta telo odgovora nosi?", [
        ["Temperaturu i režim.", "Komanda ne vraća temperaturu.", false],
        ["Samo režim.", "Uspeh je 200.", da],
      ], "Operater dobija 200 i samo režim.", "{ \"ukljucen\": true }"),
      k("client/js/prekidac.js", "Sakriveno dugme", "Dugme se skine sa ekrana. Zahtev i dalje ode.", "PUT /api/ventilator", "Šta sakrivanje uradi?", [
        ["Server više ne prima tu komandu.", "Zahtev mimo ekrana stiže.", false],
        ["Ništa na serveru.", "Provera je na zahtevu.", da],
      ], "Dugme može da se sakrije, a zahtev mimo ekrana i dalje stiže.", "prekidac.hidden = true;"),
      k("server/sesija.js", "CORS", "Drugi origin. Browser zabrani JS-u da pročita telo.", "Access-Control", "Šta je time dokazano?", [
        ["Ko je korisnik.", "CORS nije autentifikacija.", false],
        ["Samo šta taj browser dozvoli tom JS-u.", "Alat van browsera i dalje čita telo.", da],
      ], "Čitanje koje browser zabrani ne dokazuje da server ćuti.", "// CORS nije uloga"),
      k("server/sesija.js", "Redosled", "Četiri odgovora na komandu imaju red.", "401, 403, 400, 500, 200", "Kad stiže 400?", [
        ["Pre provere kolačića.", "Telo se gleda posle uloge.", false],
        ["Posle 401 i 403, a pre 500 izvučenog kabla.", "Uspeh je tek na kraju.", da],
      ], "Red je: nema kolačića 401, posmatrač 403, loše telo 400, izvučen ventilator 500, operater 200.", "401 → 403 → 400 → 500 → 200"),
    ],
  },
  {
    n: 10,
    title: "Ceo sistem",
    outcome: "Ekran „uključeno” nije dokaz upisa. Ćutanje nije ni dokaz ni opovrgavanje.",
    problem: "Ekran kaže „uključeno”, odgovor nije stigao. Šta znamo?",
    pretpostavka: "Ćutanje znači da upis nije prošao, ili ekran znači da jeste.",
    options: [
      { key: "A", text: "Ne znamo ishod upisa. Treba log i ponovno čitanje.", ok: true, why: "Ćutanje nije ni dokaz ni opovrgavanje. Ponavljanje zavisi od smisla komande." },
      { key: "B", text: "Upis nije prošao.", ok: false, why: "Odgovor može da stigne kasnije, ili da je upis prošao a odgovor izgubljen." },
      { key: "C", text: "Upis jeste prošao, jer ekran tako kaže.", ok: false, why: "Ekran može da požuri pre odgovora." },
    ],
    rezerva: null,
    izlaz: "Zapiši gde se proverava pravo, gde stoji stanje, i šta izostanak odgovora ne dokazuje.",
    terms: [
      { id: "tri", name: "Tri stanja", hint: "nije stiglo, prošlo je, nije prošlo", body: "Dok odgovor nije stigao, upis nije ni dokazan ni opovrgnut.", code: "ekran: uključeno\nodgovor: još nema\n→ čitaj log i sobu" },
      { id: "ts", name: "TypeScript", hint: "anotacija nije provera uloge", body: "Anotacija poznatog objekta sobe nije runtime validacija. Tip ne dokazuje ulogu.", code: "type Soba = { temperatura: number; ukljucen: boolean };" },
    ],
    overview: "Proxy, CDN, cloud, Kubernetes, serverless, mesto nastanka HTML-a, logovi, CI. Tip i predlog asistenta ostaju rečenica u osvrtu, bez drugog glasanja. Blockchain kao evidencija ne dokazuje tačnost senzora.",
    steps: [
      k("server/server.js", "Put", "Jedan zahtev prođe kroz već pripremljene delove.", "browser → Node → baza → log", "Šta čas prati?", [
        ["Novi deploy na javnu adresu.", "Ceo deployment se ne izvodi uživo.", false],
        ["Jedan zahtev koji već ima gde da se vidi.", "Network i log.", da],
      ], "Demonstracija je jedan zahtev kroz browser, Node i PostgreSQL.", "browser → Node → baza → log"),
      k("client/js/prekidac.js", "Ekran požuri", "Natpis kaže uključeno. Odgovor još nije stigao.", "ekran: uključeno\nodgovor: nema", "Šta ekran dokazuje o upisu?", [
        ["Da upis jeste prošao.", "Ekran može da se promeni pre odgovora.", false],
        ["Ništa o ishodu upisa.", "Treba log i ponovno čitanje.", da],
      ], "Kad ekran kaže uključeno a odgovor nije stigao, ne znamo ishod upisa.", "// odgovor još nema"),
      k("server/baza.js", "Tri stanja", "Upis je ili nepoznat, ili prošao, ili nije.", "nije stiglo | prošlo je | nije prošlo", "U koje stanje spada ćutanje?", [
        ["Nije prošlo.", "To bi bio zaključak bez odgovora.", false],
        ["Nije stiglo. Ishod je nepoznat.", "Ćutanje nije ni dokaz ni opovrgavanje.", da],
      ], "Upis nije ni dokazan ni opovrgnut samim ekranom.", "nije stiglo"),
      k("server/server.js", "Log", "Treba odluka da li komandu ponoviti.", "log + novo čitanje", "Šta je dovoljno pre ponavljanja?", [
        ["Sam natpis na dugmetu.", "Natpis nije evidencija upisa.", false],
        ["Log i ponovno čitanje sobe.", "Tek onda smisao komande.", da],
      ], "Treba log i ponovno čitanje, pa odluka o ponavljanju.", "čitaj log\nGET /api/soba"),
      k("server/ventilator.js", "Ponovi prebacivanje", "Komanda koja prebacuje režim možda jeste prošla, odgovor se izgubio.", "ukljucen = !ukljucen", "Šta slepo ponavljanje može?", [
        ["Samo da dovrši isto.", "Drugi put poništi upis koji jeste prošao.", false],
        ["Da poništi upis koji jeste prošao.", "Zato smisao komande ulazi u odluku.", da],
      ], "Slepo ponavljanje komande koja prebacuje režim može da poništi upis.", "ukljucen = !ukljucen;"),
      k("server/ventilator.js", "Ponovi postavljanje", "Ista komanda kaže uključeno, dvaput.", "{ \"ukljucen\": true }", "Šta drugi put ostavi, ako je prvi prošao?", [
        ["Suprotan režim.", "Ovo nije prebacivanje.", false],
        ["Isti željeni efekat.", "Ponavljanje postavljanja ne okreće režim.", da],
      ], "Ponovljeno postavljanje na uključeno ostavlja isti željeni efekat.", "{ \"ukljucen\": true }"),
      k("server/soba.js", "Anotacija", "Objekat sobe dobije tip.", "type Soba = { temperatura: number; ukljucen: boolean };", "Šta tip proveri dok proces radi?", [
        ["Ulogu operatera na zahtevu.", "Tip nije provera uloge.", false],
        ["Ništa u toku zahteva. To je anotacija.", "Statička provera nije runtime validacija.", da],
      ], "TypeScript je anotacija poznatog objekta sobe. Nema posebnog TS zadatka.", "type Soba = { temperatura: number; ukljucen: boolean };"),
      k("server/ventilator.js", "Runtime", "Telo i dalje stiže kao JSON tekst.", "teloJeRezim(telo)", "Šta i dalje odbija tekst „da”?", [
        ["Anotacija Soba.", "Anotacija ne radi u zahtevu.", false],
        ["Provera na kutiji, u toku zahteva.", "To ostaje 400.", da],
      ], "Statička provera nije runtime validacija.", "if (!teloJeRezim(telo)) return 400;"),
      k("server/server.js", "Adrese", "Na dijagramu stoje dve adrese.", "127.0.0.1 i javna adresa", "Šta se uživo ne radi?", [
        ["Jedan zahtev na lokalnom Node-u.", "To jeste demonstracija.", false],
        ["Ceo deployment.", "Jedan namerni neuspeh je dovoljan.", da],
      ], "Lokalna i javna adresa stoje na dijagramu. Ceo deployment se ne izvodi.", "// dijagram, ne deploy"),
      k("server/server.js", "Jedan neuspeh", "Dovoljno je da jedan zahtev namerno ne uspe.", "500 ili nema statusa", "Šta taj neuspeh pokaže?", [
        ["Da je ceo sistem oboren.", "Jedan zahtev nije deploy.", false],
        ["Gde se vidi razlika između odgovora i ćutanja.", "Network i log.", da],
      ], "Jedan namerni neuspeh je dovoljan.", "// jedan zahtev"),
      k("client/index.html", "Izlaz", "Nema četiri opcije. Ima slobodan upis.", "gde je pravo, gde je stanje, šta ćutanje ne dokazuje", "Šta izlaz nema?", [
        ["Mesto za rečenicu.", "Ima ga.", false],
        ["Pečat i opcije.", "Nema glasanja.", da],
      ], "Izlaz je slobodan upis, bez opcija i bez pečata.", "gde je pravo\ngde je stanje\nšta ćutanje ne dokazuje"),
      k("server/server.js", "Osvrt", "Tip i predlog asistenta ostanu rečenica, bez novog glasanja.", "osvrt, bez opcija", "Ako je glavna diskusija potrošila vreme, rezerva o tipu...", [
        ["Postane druga pitalica sa pečatom.", "Ostaje u osvrtu.", false],
        ["Ostane rečenica u osvrtu.", "Nema novog glasanja.", da],
      ], "Rezervna pitalica o tipu ostaje ilustracija u osvrtu. Panel i dalje ima jednu temperaturu i jedan ventilator.", "// osvrt nema opcije"),
    ],
  },
];

export function preduslovCasa(n) {
  if (n === 1) return "Rez client/ i prazan server/.";
  return lectures[n - 2].outcome;
}
