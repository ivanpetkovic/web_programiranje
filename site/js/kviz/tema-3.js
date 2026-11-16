import { ispravka, izbor } from "../kviz-oblik.js";

const z = { zamka: true };
const js = { jezik: "js" };

function kod(tekst) {
  return { kod: tekst, jezik: "js" };
}

export const pitanja = [
  izbor(3, 0, 1, "Zašto stranici sa dugmetom treba JavaScript, kad već ima HTML i CSS?", [
    ["A", "HTML opisuje elemente, CSS izgled, JavaScript programsko ponašanje.", true],
    ["B", "HTML opisuje izgled, CSS izvršava logiku, JavaScript samo zove server.", false],
    ["C", "Sve tri rade isto. Razlikuje se samo sintaksa.", false],
  ], "Dugme u dokumentu još ništa ne radi dok nema ponašanja."),
  izbor(3, 0, 2, "Isti JavaScript jezik u Chrome-u i u Node-u znači da su mogućnosti iste.", [
    ["A", "Da. Sve što vidiš u browseru deo je jezika.", false],
    ["B", "Ne. Engine izvršava jezik. Okruženje dodaje svoje API-je.", true],
  ], "document postoji u browseru. process nije deo jezika.", z),
  izbor(3, 0, 3, "Ko izvršava instrukcije JavaScripta?", [
    ["A", "Engine.", true],
    ["B", "CSS kaskada.", false],
    ["C", "Samo W3C, pre nego što kod stigne do browsera.", false],
  ], "Okruženje daje mogućnosti prema spolja. Engine izvršava jezik."),
  izbor(3, 0, 4, "Šta će biti ispis?", [
    ["A", "2", true],
    ["B", "\"12\"", false],
    ["C", "undefined", false],
  ], "Oba operanda su brojevi. + ih sabira.", kod("console.log(1 + 1);")),
  ispravka(3, 0, 5, "Funkcija treba da vrati zbir. Ispravi telo.", "function zbir(a, b) {\n  a + b;\n}", "function zbir(a, b) {\n  return a + b;\n}", "Bez return funkcija vraća undefined.", js),
  izbor(3, 0, 6, "alert je deo jezika JavaScript, isto kao i +.", [
    ["A", "Da. Svaki engine mora da ima prozor.", false],
    ["B", "Ne. alert daje browser. Jezik je sabiranje, funkcija i vrednost.", true],
  ], "Isti jezik, različita okruženja.", z),
  izbor(3, 0, 7, "HTML fajl sa script oznakom i dalje je dokument. Skripta je ponašanje uz njega.", [
    ["A", "Da.", true],
    ["B", "Ne. Čim postoji script, fajl postaje Node program i browser ga ne čita.", false],
  ], "Browser i dalje učitava dokument. Skriptu izvršava engine u tom okruženju."),

  izbor(3, 1, 1, "Šta je typeof null?", [
    ["A", "\"object\"", true],
    ["B", "\"null\"", false],
    ["C", "\"undefined\"", false],
  ], "Stara zamka jezika: null nije objekat, ali typeof kaže \"object\".", { ...z, ...kod("console.log(typeof null);") }),
  izbor(3, 1, 2, "Šta važi za const?", [
    ["A", "Vezivanje se ne sme ponovo dodeliti. Sadržaj objekta i dalje može da se menja.", true],
    ["B", "const zamrzne i svako svojstvo objekta.", false],
    ["C", "const sme da se deklariše bez vrednosti, kao let.", false],
  ], "const štiti ime, ne dubinu objekta."),
  izbor(3, 1, 3, "Šta će biti ispis?", [
    ["A", "\"number\", pa \"string\"", true],
    ["B", "\"string\", pa \"string\"", false],
    ["C", "\"number\", pa \"number\"", false],
  ], "Broj i niz znakova istog izgleda nisu isti tip.", kod("console.log(typeof 24);\nconsole.log(typeof \"24\");")),
  izbor(3, 1, 4, "let x; pa čitanje x pre dodele daje 0.", [
    ["A", "Da. Prazna promenljiva je nula.", false],
    ["B", "Ne. Vrednost je undefined.", true],
  ], "Nema automatske nule. undefined znači da dodela još nije stigla.", z),
  ispravka(3, 1, 5, "Druga dodela istom const imenu je greška. Neka druga linija uvede novo ime.", "const temperatura = 24;\nconst temperatura = 25;", "const temperatura = 24;\nconst nova = 25;", "const ne dozvoljava novo vezivanje istog imena.", js),
  izbor(3, 1, 6, "Šta je vrednost, a šta promenljiva?", [
    ["A", "24 je vrednost. temperatura je ime vezano za vrednost.", true],
    ["B", "Ime je vrednost, a 24 je tip dokumenta.", false],
  ], "Promenljiva nije kutija koja „jeste” broj zauvek. Ime je vezano za vrednost.", kod("const temperatura = 24;")),
  izbor(3, 1, 7, "NaN === NaN je true.", [
    ["A", "Da. Isti natpis, ista vrednost.", false],
    ["B", "Ne. NaN nije jednak ni sam sebi.", true],
  ], "Poređenje NaN je zamka. Number.isNaN proverava drugačije.", { ...z, ...kod("console.log(NaN === NaN);") }),

  izbor(3, 2, 1, "Šta ispiše a.n?", [
    ["A", "2", true],
    ["B", "1", false],
    ["C", "undefined", false],
  ], "b i a pokazuju na isti objekat. Izmena preko b vidi se i preko a.", kod("const a = { n: 1 };\nconst b = a;\nb.n = 2;\nconsole.log(a.n);")),
  izbor(3, 2, 2, "const b = a kopira objekat.", [
    ["A", "Da. Dalje izmene b ne diraju a.", false],
    ["B", "Ne. Kopira se referenca. Oba imena gledaju isti objekat.", true],
  ], "Nova referenca nije duboka kopija.", z),
  izbor(3, 2, 3, "Šta važi posle Object.assign ili plitkog razmaka, ako je unutra još jedan objekat?", [
    ["A", "Spoljašnji objekat je nov. Ugnježdeni se i dalje deli.", true],
    ["B", "Sve je duboko kopirano, uključujući svako ugnježdeno svojstvo.", false],
  ], "Plitka kopija ne preseca unutrašnje reference."),
  ispravka(3, 2, 4, "b treba da bude nov objekat sa istim n, ne isto vezivanje. Ispravi drugu liniju.", "const a = { n: 1 };\nconst b = a;", "const a = { n: 1 };\nconst b = { n: a.n };", "Dodela imena deli objekat. Novi literal dobija svoju vrednost n.", js),
  izbor(3, 2, 5, "Šta ispiše drugi log?", [
    ["A", "\"Ana\"", true],
    ["B", "\"Mia\"", false],
  ], "s2 je nova niska. Zamena s2 ne menja s1. Niske se ne mutiraju ovom dodelom.", kod("let s1 = \"Ana\";\nlet s2 = s1;\ns2 = \"Mia\";\nconsole.log(s1);")),
  izbor(3, 2, 6, "Brisanje svojstva na jednoj referenci vidi se i na drugoj, ako je objekat isti.", [
    ["A", "Da.", true],
    ["B", "Ne. delete važi samo za ime sa leve strane.", false],
  ], "delete skida svojstvo objekta, ne ime promenljive.", kod("const a = { n: 1 };\nconst b = a;\ndelete b.n;")),
  izbor(3, 2, 7, "Dva posebna literala { n: 1 } jesu isti objekat jer imaju isti sadržaj.", [
    ["A", "Ne. Svaki literal pravi nov objekat.", true],
    ["B", "Da. === za objekte poredi sadržaj.", false],
  ], "=== za objekte poredi referencu, ne polja.", { ...z, ...kod("console.log({ n: 1 } === { n: 1 });") }),

  izbor(3, 3, 1, "Šta ispiše 24 + \"C\"?", [
    ["A", "\"24C\"", true],
    ["B", "24", false],
    ["C", "NaN", false],
  ], "Ako je jedan operand niska, + spaja. Broj se pretvori u tekst.", kod("console.log(24 + \"C\");")),
  izbor(3, 3, 2, "0 == \"\" je false, jer tipovi nisu isti.", [
    ["A", "Tačno za ===. Za == oba se svode tako da poređenje prođe.", false],
    ["B", "Netačno. 0 == \"\" jeste true. 0 === \"\" jeste false.", true],
  ], "Labavo poređenje pravi zamke. Kurs drži strogo poređenje kao jasno pravilo.", { ...z, ...kod("console.log(0 == \"\");\nconsole.log(0 === \"\");") }),
  izbor(3, 3, 3, "Šta su a i b?", [
    ["A", "a je false, b je true", true],
    ["B", "oba su true", false],
    ["C", "oba su false", false],
  ], "0 je falsy. \"0\" je neprazna niska, pa je truthy.", kod("const a = Boolean(0);\nconst b = Boolean(\"0\");")),
  ispravka(3, 3, 4, "Poređenje ne sme da dodeljuje. Neka uslov bude strogo jednak 24.", "if (temperatura = 24) {\n  radi();\n}", "if (temperatura === 24) {\n  radi();\n}", "= dodeljuje i uslov postaje 24, što je truthy. === poredi.", js),
  izbor(3, 3, 5, "Šta ispiše ovo sabiranje decimala?", [
    ["A", "false", true],
    ["B", "true", false],
  ], "0.1 + 0.2 nije tačno 0.3 u binarnom zapisu.", { ...z, ...kod("console.log(0.1 + 0.2 === 0.3);") }),
  izbor(3, 3, 6, "null == undefined i null === undefined daju isti odgovor.", [
    ["A", "Ne. == da, === ne.", true],
    ["B", "Da. Oba su true.", false],
    ["C", "Da. Oba su false.", false],
  ], "Labavo poređenje tretira null i undefined kao par. Strogo ne.", kod("console.log(null == undefined);\nconsole.log(null === undefined);")),

  izbor(3, 4, 1, "Šta ispiše program?", [
    ["A", "\"hladno\"", true],
    ["B", "\"toplo\"", false],
    ["C", "oba natpisa", false],
  ], "24 nije veće od 30. Grana else se izvrši.", kod("const t = 24;\nif (t > 30) console.log(\"toplo\");\nelse console.log(\"hladno\");")),
  izbor(3, 4, 2, "else if se proverava i kad je prvi uslov već true.", [
    ["A", "Da. Sve grane rade.", false],
    ["B", "Ne. Čim jedna grana prođe, ostale se preskoče.", true],
  ], "Lanac if / else if bira jednu granu.", z),
  izbor(3, 4, 3, "Koliko puta se telo izvrši?", [
    ["A", "3", true],
    ["B", "4", false],
    ["C", "2", false],
  ], "i ide 0, 1, 2. Kad je i === 3, uslov i < 3 više ne važi.", kod("let n = 0;\nfor (let i = 0; i < 3; i += 1) n += 1;")),
  ispravka(3, 4, 4, "Petlja treba da sabere 1+2+3. Uslov staje jedan broj prerano. Ispravi ga.", "let zbir = 0;\nfor (let i = 1; i < 3; i += 1) {\n  zbir += i;\n}", "let zbir = 0;\nfor (let i = 1; i <= 3; i += 1) {\n  zbir += i;\n}", "i < 3 preskoči 3. i <= 3 uzme i 3.", js),
  izbor(3, 4, 5, "Šta break uradi u petlji?", [
    ["A", "Prekine petlju.", true],
    ["B", "Prekine samo trenutni krug i nastavi sledeći, kao continue.", false],
    ["C", "Vrati vrednost iz fajla, kao return iz modula.", false],
  ], "continue ide na sledeći krug. break izlazi."),
  izbor(3, 4, 6, "Uslov if (\"0\") je false, jer je nula.", [
    ["A", "Da. Navodnici se ignorišu.", false],
    ["B", "Ne. Neprazna niska je truthy. \"0\" ulazi u granu.", true],
  ], "Falsy su 0, \"\", null, undefined, NaN, false. \"0\" nije među njima.", { ...z, ...kod("if (\"0\") console.log(\"da\");") }),
  izbor(3, 4, 7, "switch poredi case strogo, kao ===.", [
    ["A", "Da.", true],
    ["B", "Ne. switch koristi ==.", false],
  ], "case 24 ne hvata \"24\".", kod("switch (\"24\") {\n  case 24: console.log(\"broj\"); break;\n  default: console.log(\"nije broj\");\n}")),

  izbor(3, 5, 1, "Funkcija je vrednost koja može da stoji u promenljivoj.", [
    ["A", "Da.", true],
    ["B", "Ne. Funkcija postoji samo kao naredba, ne kao vrednost.", false],
  ], "Ime funkcije i izraz funkcije oba daju vrednost koja se može pozvati."),
  izbor(3, 5, 2, "Šta ispiše poziv?", [
    ["A", "6", true],
    ["B", "undefined", false],
    ["C", "\"23\"", false],
  ], "Argumenti su brojevi. return vraća zbir.", kod("function zbir(a, b) { return a + b; }\nconsole.log(zbir(2, 4));")),
  izbor(3, 5, 3, "Šta funkcija vrati?", [
    ["A", "undefined", true],
    ["B", "5", false],
  ], "Nema return. Izraz a + b se izračuna i baci.", { ...z, ...kod("function zbir(a, b) { a + b; }\nconsole.log(zbir(2, 3));") }),
  ispravka(3, 5, 4, "pozdrav treba da bude funkcija koja vraća \"Zdravo\". Sada je poziv umesto vrednosti.", "const pozdrav = \"Zdravo\";\nconsole.log(pozdrav());", "const pozdrav = function () {\n  return \"Zdravo\";\n};\nconsole.log(pozdrav());", "Zagrada poziva funkciju. Niska se ne poziva.", js),

  izbor(3, 6, 1, "Šta ispiše map?", [
    ["A", "[2, 4, 6]", true],
    ["B", "[1, 2, 3]", false],
    ["C", "6", false],
  ], "map pravi nov niz. Svaki element udvostruči.", kod("const a = [1, 2, 3];\nconsole.log(a.map((n) => n * 2));")),
  izbor(3, 6, 2, "push menja postojeći niz.", [
    ["A", "Da. push mutira niz na koji referenca pokazuje.", true],
    ["B", "Ne. push uvek vraća nov niz, a stari ostaje iste dužine.", false],
  ], "Ista priča kao mutacija objekta. Drugo ime istog niza vidi novu stavku.", kod("const a = [1];\nconst b = a;\nb.push(2);")),
  izbor(3, 6, 3, "Šta je dužina posle filter?", [
    ["A", "2", true],
    ["B", "3", false],
    ["C", "1", false],
  ], "filter ostavlja elemente za koje predikat važi. 2 i 4 su parni.", kod("console.log([1, 2, 4].filter((n) => n % 2 === 0).length);")),
  ispravka(3, 6, 4, "map treba da vrati udvostručen broj. Strelica sa viticastom zagradom traži return.", "const b = [1, 2].map((n) => { n * 2; });", "const b = [1, 2].map((n) => n * 2);", "Blok bez return daje undefined za svaku stavku.", js),
  izbor(3, 6, 5, "sort bez funkcije poredi brojeve po veličini.", [
    ["A", "Da. [10, 2] postane [2, 10].", false],
    ["B", "Ne. Podrazumevano sortira kao tekst. \"10\" dolazi pre \"2\".", true],
  ], "Zamka: sort pretvara u niske. Za brojeve treba (a, b) => a - b.", { ...z, ...kod("console.log([10, 2, 1].sort());") }),

  izbor(3, 7, 1, "Šta ispiše ime?", [
    ["A", "\"Ana\"", true],
    ["B", "undefined", false],
    ["C", "22", false],
  ], "Destrukturiranje izvlači svojstvo po imenu.", kod("const osoba = { ime: \"Ana\", godine: 22 };\nconst { ime } = osoba;\nconsole.log(ime);")),
  izbor(3, 7, 2, "Šta ispiše b.opcije.boja?", [
    ["A", "\"bela\"", true],
    ["B", "\"crna\"", false],
    ["C", "greška", false],
  ], "Razmak pravi nov spoljašnji objekat. opcije je i dalje isti unutrašnji objekat.", { ...z, ...kod("const a = { opcije: { boja: \"crna\" } };\nconst b = { ...a };\nb.opcije.boja = \"bela\";") }),
  izbor(3, 7, 3, "Šta su a i b?", [
    ["A", "a je 10, b je 0", true],
    ["B", "oba su 10", false],
    ["C", "oba su 0", false],
  ], "|| zameni svaku falsy vrednost. ?? zameni samo null i undefined. 0 ostaje.", kod("const broj = 0;\nconst a = broj || 10;\nconst b = broj ?? 10;")),
  ispravka(3, 7, 4, "Podrazumevana temperatura treba da sačuva 0. || ga briše. Zameni operator.", "const t = merenje || 24;", "const t = merenje ?? 24;", "0 je ispravno merenje. ?? ne tretira 0 kao izostanak.", js),
  izbor(3, 7, 5, "const { ime: nadimak } = osoba čita svojstvo nadimak.", [
    ["A", "Ne. Čita ime, a lokalno ime vezivanja je nadimak.", true],
    ["B", "Da. Sa desne strane dvotačke je svojstvo objekta.", false],
  ], "U obrascu levo je izvor, desno je novo ime.", { ...z, ...kod("const osoba = { ime: \"Ana\" };\nconst { ime: nadimak } = osoba;") }),
  izbor(3, 7, 6, "Šta radi ostatak niza?", [
    ["A", "ostalo je [2, 3], prvo je 1.", true],
    ["B", "ostalo je 1, prvo je [2, 3].", false],
  ], "Prvi obrazac uzme prvu stavku. Ostatak skupi ostale u nov niz.", kod("const [prvo, ...ostalo] = [1, 2, 3];")),
  izbor(3, 7, 7, "Podrazumevana vrednost u obrascu važi i kad svojstvo postoji i jeste undefined? A kad je 0?", [
    ["A", "undefined aktivira podrazumevano. 0 ne aktivira.", true],
    ["B", "0 takođe aktivira podrazumevano, kao ||.", false],
  ], "Podrazumevano u destrukturiranju prati undefined, ne sve falsy vrednosti.", kod("const { n = 5 } = { n: 0 };")),

  izbor(3, 8, 1, "Šta se desi?", [
    ["A", "Ispiše se 30, zatim ReferenceError jer b nije van funkcije.", true],
    ["B", "Ispišu se 30 i 20.", false],
    ["C", "Funkcija ne vidi a.", false],
  ], "a je u spoljašnjem opsegu. b živi samo u funkciji.", kod("const a = 10;\nfunction primer() {\n  const b = 20;\n  console.log(a + b);\n}\nprimer();\nconsole.log(b);")),
  izbor(3, 8, 2, "Funkcija traži promenljivu tamo gde je pozvana.", [
    ["A", "Ne. Traži je tamo gde je definisana.", true],
    ["B", "Da. Poziv iz drugog bloka menja koja je x.", false],
  ], "Leksički opseg prati definiciju, ne mesto poziva.", { ...z, ...kod("const x = 10;\nfunction prikazi() { console.log(x); }\nfunction omot() {\n  const x = 20;\n  prikazi();\n}\nomot();") }),
  izbor(3, 8, 3, "Šta ispiše primer?", [
    ["A", "\"Unutra\"", true],
    ["B", "\"Spolja\"", false],
  ], "Unutrašnje ime senči spoljašnje u telu funkcije.", kod("const poruka = \"Spolja\";\nfunction primer() {\n  const poruka = \"Unutra\";\n  console.log(poruka);\n}")),
  ispravka(3, 8, 4, "b je let unutar bloka i ne sme da se čita napolju. Prebaci let u opseg u kome se čita.", "if (true) {\n  let b = 20;\n}\nconsole.log(b);", "let b = 20;\nif (true) {\n  b = 20;\n}\nconsole.log(b);", "let je vidljiv od bloka u kome je uveden, ne izvan njega.", js),
  izbor(3, 8, 5, "Šta var uradi, a let ne, u ovom if bloku?", [
    ["A", "var a vidi se i posle bloka. let b ne.", true],
    ["B", "Oba se vide posle bloka.", false],
    ["C", "Nijedan se ne vidi. Oba su blokovska.", false],
  ], "var je funkcijski, ne blokovski. Zato kurs drži let i const.", kod("function primer() {\n  if (true) {\n    var a = 10;\n    let b = 20;\n  }\n  console.log(a);\n}")),
  izbor(3, 8, 6, "Pozvana funkcija vidi lokalne promenljive onoga ko je pozvao, čim je poziv ugnježden.", [
    ["A", "Ne. Vidi ono što je u opsegu definicije.", true],
    ["B", "Da. Stek poziva jeste opseg.", false],
  ], "Mesto poziva ne otvara tuđe lokalne promenljive.", z),

  izbor(3, 9, 1, "Šta ispiše poziv pre deklaracije funkcije?", [
    ["A", "5", true],
    ["B", "ReferenceError", false],
    ["C", "undefined", false],
  ], "Deklaracija funkcije dostupna je u celom opsegu. Zbir 2 i 3 jeste 5.", kod("console.log(saberi(2, 3));\nfunction saberi(a, b) { return a + b; }")),
  izbor(3, 9, 2, "Isti zapis, ali kao const izraz. Šta se desi na prvom redu?", [
    ["A", "ReferenceError", true],
    ["B", "9", false],
    ["C", "undefined", false],
  ], "Izraz funkcije postaje pozivljiv tek kad izvršavanje stigne do dodele.", { ...z, ...kod("console.log(kvadrat(3));\nconst kvadrat = function (x) { return x * x; };") }),
  izbor(3, 9, 3, "Šta uradi var pre dodele, a šta let?", [
    ["A", "var ispiše undefined. let baci ReferenceError.", true],
    ["B", "Oba ispišu undefined.", false],
    ["C", "Oba ispišu 10.", false],
  ], "var se podigne kao ime bez vrednosti. let postoji, ali je u vremenskoj zoni do dodele. Dva programa su odvojena.", kod("// poseban program\nconsole.log(a);\nvar a = 10;\n// poseban program\nconsole.log(b);\nlet b = 10;")),
  ispravka(3, 9, 4, "kvadrat treba da može da se pozove iznad dodele. Neka bude deklaracija funkcije, ne const izraz.", "console.log(kvadrat(3));\nconst kvadrat = function (x) {\n  return x * x;\n};", "console.log(kvadrat(3));\nfunction kvadrat(x) {\n  return x * x;\n}", "Deklaracija funkcije je spremna pre prolaza izvršavanja. const dodela nije.", js),
  izbor(3, 9, 5, "Dva poziva iste funkcije dele lokalne promenljive.", [
    ["A", "Ne. Svaki poziv ima sopstveno izvršavanje.", true],
    ["B", "Da. rezultat je jedno zajedničko ime za sve pozive.", false],
  ], "Stek pamti gde da se vrati. Lokalna vezivanja nisu zajednička.", kod("function saberi(x) {\n  const rezultat = x + 1;\n  return rezultat;\n}")),

  izbor(3, 10, 1, "Šta ispišu dva poziva?", [
    ["A", "1, pa 2", true],
    ["B", "1, pa 1", false],
    ["C", "Greška, jer je napraviBrojac već završena.", false],
  ], "Vraćena funkcija i dalje vidi broj iz okruženja u kome je nastala.", kod("function napraviBrojac() {\n  let broj = 0;\n  return function () {\n    broj += 1;\n    return broj;\n  };\n}\nconst broji = napraviBrojac();\nconsole.log(broji());\nconsole.log(broji());")),
  izbor(3, 10, 2, "Dva brojača iz dva poziva napraviBrojac dele isti broj.", [
    ["A", "Da. Funkcija je ista, pa je i stanje isto.", false],
    ["B", "Ne. Svaki poziv napravi svoje okruženje. drugi() vrati 1.", true],
  ], "Ista definicija, odvojena izvršavanja.", { ...z, ...kod("function napraviBrojac() {\n  let broj = 0;\n  return function () {\n    broj += 1;\n    return broj;\n  };\n}\nconst prvi = napraviBrojac();\nconst drugi = napraviBrojac();\nprvi();\nconsole.log(drugi());") }),
  izbor(3, 10, 3, "Closure može da drži stanje koje spolja nema ime.", [
    ["A", "Da. Spolja ostaje samo ono što funkcija vrati.", true],
    ["B", "Ne. Svaka lokalna promenljiva postane globalna čim se unutrašnja funkcija vrati.", false],
  ], "stanje u napraviRacun nije svojstvo koje pozivalac sme da dodeli."),
  ispravka(3, 10, 4, "Brojač treba da raste. Sada svaki poziv vraća 1 jer se broj pravi unutar poziva. Izvuci let napolje, u napraviBrojac.", "function napraviBrojac() {\n  return function () {\n    let broj = 0;\n    broj += 1;\n    return broj;\n  };\n}", "function napraviBrojac() {\n  let broj = 0;\n  return function () {\n    broj += 1;\n    return broj;\n  };\n}", "Promenljiva mora da živi u okruženju koje pozivi dele.", js),
  izbor(3, 10, 5, "Kad spoljašnja funkcija završi, njene lokalne promenljive uvek nestanu, i vraćena funkcija ne sme da ih čita.", [
    ["A", "Ne sme da ih čita.", false],
    ["B", "Sme. Closure drži to okruženje.", true],
  ], "Zato brojač pamti broj između poziva.", z),
  izbor(3, 10, 6, "Šta vrati drugi poziv ako je stanje krenulo od 100 i uplata je 20?", [
    ["A", "120", true],
    ["B", "20", false],
    ["C", "100", false],
  ], "uplati menja stanje u closure-u. procitaj čita isto stanje.", kod("function napraviRacun() {\n  let stanje = 100;\n  return {\n    uplati(iznos) { stanje += iznos; },\n    procitaj() { return stanje; },\n  };\n}")),
  izbor(3, 10, 7, "Globalna promenljiva i closure su isti mehanizam čuvanja stanja, sa istom vidljivošću.", [
    ["A", "Ne. Closure može da sakrije ime od spolja.", true],
    ["B", "Da. I jedno i drugo vidi svaki fajl.", false],
  ], "Privatno stanje ovde nema klasu. Ima opseg.", z),

  izbor(3, 11, 1, "Šta vrati procitajIme posle preuzimanja na drugi objekat?", [
    ["A", "\"Marko\"", true],
    ["B", "\"Ana\"", false],
    ["C", "undefined", false],
  ], "Obična funkcija dobija this od poziva. Poziv je metoda objekta drugi.", kod("const prvi = { ime: \"Ana\", procitajIme() { return this.ime; } };\nconst drugi = { ime: \"Marko\", procitajIme: prvi.procitajIme };\nconsole.log(drugi.procitajIme());")),
  izbor(3, 11, 2, "Izdvojena metoda i dalje vidi objekat, jer je u njemu napisana.", [
    ["A", "Da. this je mesto definicije.", false],
    ["B", "Ne. Obična funkcija gleda kako je pozvana. Samo ime funkcija() nema objekat ispred tačke.", true],
  ], "this nije leksički za običnu funkciju.", { ...z, ...kod("const korisnik = {\n  ime: \"Ana\",\n  procitajIme() { return this.ime; },\n};\nconst funkcija = korisnik.procitajIme;\nfunkcija();") }),
  izbor(3, 11, 3, "Arrow funkcija kao metoda koristi this poziva, kao obična metoda.", [
    ["A", "Da. Obe su svojstva istog objekta.", false],
    ["B", "Ne. Arrow nema sopstveni this. Uzima ga iz okruženja u kome je napisana.", true],
  ], "Zato arrow i obična metoda u istom objektu ne moraju da vide isto ime.", z),
  ispravka(3, 11, 4, "procitaj treba da bude obična metoda, da this bude objekat na kome se poziva.", "const nalog = {\n  ime: \"Ana\",\n  procitaj: () => this.ime,\n};", "const nalog = {\n  ime: \"Ana\",\n  procitaj() { return this.ime; },\n};", "Arrow ne dobija this od poziva nalog.procitaj().", js),
  izbor(3, 11, 5, "Šta call uradi?", [
    ["A", "Pozove funkciju tako da this bude dati objekat.", true],
    ["B", "Kopira funkciju u objekat zauvek.", false],
    ["C", "Zabrani svaki dalji poziv.", false],
  ], "call bira this za taj jedan poziv.", kod("function procitaj() { return this.ime; }\nprocitaj.call({ ime: \"Ana\" });")),
  izbor(3, 11, 6, "Metoda je posebna vrsta vrednosti, različita od funkcije.", [
    ["A", "Ne. Metoda je funkcija koja stoji kao svojstvo i pozvana je na objektu.", true],
    ["B", "Da. Metod ne sme da se dodeli drugom objektu.", false],
  ], "Ista funkcija može da pređe na drugi objekat. Menja se poziv, ne natpis funkcije."),
  izbor(3, 11, 7, "Ugneždena obična funkcija unutar metode vidi this metode automatski.", [
    ["A", "Ne. Unutrašnji obični poziv ima svoj this.", true],
    ["B", "Da. this se nasledjuje kao promenljiva.", false],
  ], "Zato se this često sačuva u ime, ili se unutra koristi arrow.", { ...z, ...kod("const o = {\n  ime: \"Ana\",\n  radi() {\n    function unutra() { return this.ime; }\n    return unutra();\n  },\n};") }),

  izbor(3, 12, 1, "Kako korisnik ima pozdrav koji nije upisan na njemu?", [
    ["A", "JavaScript traži svojstvo i duž prototipskog lanca.", true],
    ["B", "Kopira metodu u korisnik pri čitanju.", false],
    ["C", "Svi objekti su globalni, pa vide tuđu metodu po imenu.", false],
  ], "Svojstvo može biti na prototipu, ne na samom objektu.", kod("const zajednicko = { pozdrav() { return \"Zdravo\"; } };\nconst korisnik = Object.create(zajednicko);")),
  izbor(3, 12, 2, "Sopstveno svojstvo istog imena gubi od prototipa.", [
    ["A", "Da. Prototip je uvek jači.", false],
    ["B", "Ne. Sopstveno svojstvo se nađe prvo.", true],
  ], "Lanac se pita tek ako objekat nema svoje ime.", { ...z, ...kod("const osnova = { vrednost: 10 };\nconst objekat = Object.create(osnova);\nobjekat.vrednost = 3;") }),
  izbor(3, 12, 3, "Da li new kopira metodu u svaki objekat?", [
    ["A", "Ne. Oba objekta koriste metodu sa zajedničkog prototipa.", true],
    ["B", "Da. Svaki new pravi svoju kopiju funkcije.", false],
    ["C", "Funkcija pripada samo prvom objektu.", false],
  ], "prototype deli ponašanje. this i dalje zavisi od poziva.", kod("function Korisnik(ime) { this.ime = ime; }\nKorisnik.prototype.pozdrav = function () {\n  return this.ime;\n};")),
  ispravka(3, 12, 4, "pozdrav treba da stoji na prototipu, ne da se pravi iznova u konstruktoru.", "function Korisnik(ime) {\n  this.ime = ime;\n  this.pozdrav = function () {\n    return this.ime;\n  };\n}", "function Korisnik(ime) {\n  this.ime = ime;\n}\nKorisnik.prototype.pozdrav = function () {\n  return this.ime;\n};", "Zajednička metoda ide na prototype. Konstruktor drži stanje instance.", js),
  izbor(3, 12, 5, "class ukida prototipski lanac.", [
    ["A", "Ne. class je drugi zapis za konstruktor i zajedničke metode.", true],
    ["B", "Da. class kopira metode kao u jezicima sa klasama koje nisu prototipske.", false],
  ], "Nasleđivanje i dalje ide lancem. Menja se sintaksa.", z),
  izbor(3, 12, 6, "Šta hasOwn vidi za metodu koja živi samo na prototipu?", [
    ["A", "Nije sopstveno svojstvo.", true],
    ["B", "Jeste, čim poziv uspe.", false],
  ], "Čitanje kroz lanac nije isto što i sopstveno svojstvo.", kod("const osnova = { pozdrav() { return \"Zdravo\"; } };\nconst o = Object.create(osnova);\nObject.hasOwn(o, \"pozdrav\");")),

  izbor(3, 13, 1, "U fajlu stoji const x = ; bez izraza. Šta try oko te linije može dok program radi?", [
    ["A", "Ništa. To je sintaksna greška i fajl se ne pokrene.", true],
    ["B", "catch dobije Error i ostatak fajla nastavi.", false],
  ], "Sintaksa se lomi pre pokretanja. Čitanje null.ime je druga stvar: TypeError u toku, i try može da ga uhvati.", z),
  izbor(3, 13, 2, "Šta try/catch uradi sa throw?", [
    ["A", "catch dobije izuzetak i tok može da nastavi posle try/catch.", true],
    ["B", "throw uvek gasi ceo proces, catch se ne poziva.", false],
    ["C", "catch vidi samo sintaksne greške.", false],
  ], "Izuzetak prekida normalan tok do prvog catch-a, ne nužno ceo program.", kod("function procenat(deo, ukupno) {\n  if (ukupno === 0) throw new Error(\"nula\");\n  return deo / ukupno;\n}")),
  izbor(3, 13, 3, "Pogrešan rezultat bez throw-a i dalje je programska greška, ali nije izuzetak.", [
    ["A", "Da. Izuzetak je signal u toku, ne svaka netačna zamisao.", true],
    ["B", "Ne. Svaki pogrešan broj sam baci Error.", false],
  ], "24 umesto 25 može biti tiha greška. Niko nije bacio izuzetak."),
  ispravka(3, 13, 4, "Čitanje imena sa null treba da bude uhvaćeno. Dodaj try/catch oko čitanja i u catch vrati praznu nisku.", "function ime(osoba) {\n  return osoba.ime;\n}", "function ime(osoba) {\n  try {\n    return osoba.ime;\n  } catch {\n    return \"\";\n  }\n}", "Bez catch, TypeError prekida poziv.", js),
  izbor(3, 13, 5, "Call stack pri grešci služi čemu?", [
    ["A", "Pokazuje koji poziv je vodio do throw-a.", true],
    ["B", "Briše lokalne promenljive da se greška ne bi ponovila.", false],
    ["C", "Pretvara sintaksnu grešku u upozorenje.", false],
  ], "Stek je trag poziva: prva, druga, treca.", kod("function treca() { throw new Error(\"Problem\"); }\nfunction druga() { treca(); }\nfunction prva() { druga(); }")),
  izbor(3, 13, 6, "finally se preskače ako je catch već odradio posao.", [
    ["A", "Ne. finally radi i kad ima catch i kad nema izuzetka.", true],
    ["B", "Da. finally je samo drugi naziv za catch.", false],
  ], "finally je za čišćenje koje treba u oba ishoda.", z),
  izbor(3, 13, 7, "console.log ispred linije koja puca dovoljan je da se vidi stanje, ali ne hvata izuzetak.", [
    ["A", "Da. Log je posmatranje. catch je hvatanje.", true],
    ["B", "Ne. console.log guta sledeći throw.", false],
  ], "Debagovanje i upravljanje izuzetkom nisu ista alatka."),

  izbor(3, 14, 1, "Zašto deliti kod na module?", [
    ["A", "Da ime i zavisnost budu izričiti, umesto jedne gomile u jednom fajlu.", true],
    ["B", "Zato što jedan fajl ne sme da ima više od jedne funkcije.", false],
    ["C", "Zato što browser ne učitava fajl duži od stranice.", false],
  ], "Modul kaže šta izvozi i šta uvozi."),
  izbor(3, 14, 2, "JavaScript objekat i JSON su isto.", [
    ["A", "Da. Viticaste zagrade su JSON.", false],
    ["B", "Ne. JSON je tekst. Objekat je vrednost u memoriji.", true],
  ], "JSON ne prenosi funkcije ni prototip. Tekst treba parsirati.", { ...z, ...kod("const osoba = { ime: \"Ana\", aktivan: true };") }),
  izbor(3, 14, 3, "Šta od ovoga daje okruženje browsera, a ne jezik?", [
    ["A", "document.querySelector", true],
    ["B", "JSON.parse", false],
    ["C", "Array.prototype.map", false],
  ], "map i JSON.parse putuju sa jezikom. document je API browsera.", kod("document.querySelector(\".digit\")")),
  ispravka(3, 14, 4, "JSON tekst treba da postane objekat. Sada se niska samo dodeljuje.", "const tekst = '{\"temperatura\":24}';\nconst soba = tekst;", "const tekst = '{\"temperatura\":24}';\nconst soba = JSON.parse(tekst);", "Bez parse, soba je niska. soba.temperatura ne čita polje.", js),
  izbor(3, 14, 5, "Kako podaci sa servera uđu u program?", [
    ["A", "Browser preko mrežnog API-ja dobije tekst odgovora. JavaScript ga zatim čita kao podatak, na primer JSON.parse.", true],
    ["B", "JavaScript čita memoriju servera direktno.", false],
    ["C", "JSON sam izvrši funkcije koje stoje na serveru.", false],
  ], "Mreža donese reprezentaciju. Jezik je protumači. To nisu isti koraci."),
  izbor(3, 14, 6, "export šalje vrednost drugom fajlu. Bez uvoza taj fajl ne vidi lokalno ime.", [
    ["A", "Da. Modul ne deli svako lokalno ime sa svima.", true],
    ["B", "Ne. Svaka const postane globalna čim fajl postoji.", false],
  ], "Zato matematika.js izvozi funkciju, a main.js je uvozi.", kod("export function zbir(a, b) { return a + b; }")),
];
