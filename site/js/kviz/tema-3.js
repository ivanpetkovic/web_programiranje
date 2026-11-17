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
  izbor(3, 2, 5, "Šta ispiše `console.log(s1)`?", [
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
  ], "Razmak pravi nov spoljašnji objekat. opcije je i dalje isti unutrašnji objekat.", { ...z, ...kod("const a = { opcije: { boja: \"crna\" } };\nconst b = { ...a };\nb.opcije.boja = \"bela\";\nconsole.log(b.opcije.boja);") }),
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
];
