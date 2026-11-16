import { ispravka, izbor } from "../kviz-oblik.js";

const z = { zamka: true };
const js = { jezik: "js" };

function kod(tekst) {
  return { kod: tekst, jezik: "js" };
}

export const pitanja = [
  izbor(4, 0, 1, "Šta se desi?", [
    ["A", "Ispiše se 30, zatim ReferenceError jer b nije van funkcije.", true],
    ["B", "Ispišu se 30 i 20.", false],
    ["C", "Funkcija ne vidi a.", false],
  ], "a je u spoljašnjem opsegu. b živi samo u funkciji.", kod("const a = 10;\nfunction primer() {\n  const b = 20;\n  console.log(a + b);\n}\nprimer();\nconsole.log(b);")),
  izbor(4, 0, 2, "Funkcija traži promenljivu tamo gde je pozvana.", [
    ["A", "Ne. Traži je tamo gde je definisana.", true],
    ["B", "Da. Poziv iz drugog bloka menja koja je x.", false],
  ], "Leksički opseg prati definiciju, ne mesto poziva.", { ...z, ...kod("const x = 10;\nfunction prikazi() { console.log(x); }\nfunction omot() {\n  const x = 20;\n  prikazi();\n}\nomot();") }),
  izbor(4, 0, 3, "Šta ispiše primer?", [
    ["A", "\"Unutra\"", true],
    ["B", "\"Spolja\"", false],
  ], "Unutrašnje ime senči spoljašnje u telu funkcije.", kod("const poruka = \"Spolja\";\nfunction primer() {\n  const poruka = \"Unutra\";\n  console.log(poruka);\n}")),
  ispravka(4, 0, 4, "b je let unutar bloka i ne sme da se čita napolju. Prebaci let u opseg u kome se čita.", "if (true) {\n  let b = 20;\n}\nconsole.log(b);", "let b = 20;\nif (true) {\n  b = 20;\n}\nconsole.log(b);", "let je vidljiv od bloka u kome je uveden, ne izvan njega.", js),
  izbor(4, 0, 5, "Šta var uradi, a let ne, u ovom if bloku?", [
    ["A", "var a vidi se i posle bloka. let b ne.", true],
    ["B", "Oba se vide posle bloka.", false],
    ["C", "Nijedan se ne vidi. Oba su blokovska.", false],
  ], "var je funkcijski, ne blokovski. Zato kurs drži let i const.", kod("function primer() {\n  if (true) {\n    var a = 10;\n    let b = 20;\n  }\n  console.log(a);\n}")),
  izbor(4, 0, 6, "Pozvana funkcija vidi lokalne promenljive onoga ko je pozvao, čim je poziv ugnježden.", [
    ["A", "Ne. Vidi ono što je u opsegu definicije.", true],
    ["B", "Da. Stek poziva jeste opseg.", false],
  ], "Mesto poziva ne otvara tuđe lokalne promenljive.", z),
  izbor(4, 1, 1, "Šta ispiše poziv pre deklaracije funkcije?", [
    ["A", "5", true],
    ["B", "ReferenceError", false],
    ["C", "undefined", false],
  ], "Deklaracija funkcije dostupna je u celom opsegu. Zbir 2 i 3 jeste 5.", kod("console.log(saberi(2, 3));\nfunction saberi(a, b) { return a + b; }")),
  izbor(4, 1, 2, "Isti zapis, ali kao const izraz. Šta se desi na prvom redu?", [
    ["A", "ReferenceError", true],
    ["B", "9", false],
    ["C", "undefined", false],
  ], "Izraz funkcije postaje pozivljiv tek kad izvršavanje stigne do dodele.", { ...z, ...kod("console.log(kvadrat(3));\nconst kvadrat = function (x) { return x * x; };") }),
  izbor(4, 1, 3, "Šta uradi var pre dodele, a šta let?", [
    ["A", "var ispiše undefined. let baci ReferenceError.", true],
    ["B", "Oba ispišu undefined.", false],
    ["C", "Oba ispišu 10.", false],
  ], "var se podigne kao ime bez vrednosti. let postoji, ali je u vremenskoj zoni do dodele. Dva programa su odvojena.", kod("// poseban program\nconsole.log(a);\nvar a = 10;\n// poseban program\nconsole.log(b);\nlet b = 10;")),
  ispravka(4, 1, 4, "kvadrat treba da može da se pozove iznad dodele. Neka bude deklaracija funkcije, ne const izraz.", "console.log(kvadrat(3));\nconst kvadrat = function (x) {\n  return x * x;\n};", "console.log(kvadrat(3));\nfunction kvadrat(x) {\n  return x * x;\n}", "Deklaracija funkcije je spremna pre prolaza izvršavanja. const dodela nije.", js),
  izbor(4, 1, 5, "Dva poziva iste funkcije dele lokalne promenljive.", [
    ["A", "Ne. Svaki poziv ima sopstveno izvršavanje.", true],
    ["B", "Da. rezultat je jedno zajedničko ime za sve pozive.", false],
  ], "Stek pamti gde da se vrati. Lokalna vezivanja nisu zajednička.", kod("function saberi(x) {\n  const rezultat = x + 1;\n  return rezultat;\n}")),
  izbor(4, 2, 1, "Šta ispišu dva poziva?", [
    ["A", "1, pa 2", true],
    ["B", "1, pa 1", false],
    ["C", "Greška, jer je napraviBrojac već završena.", false],
  ], "Vraćena funkcija i dalje vidi broj iz okruženja u kome je nastala.", kod("function napraviBrojac() {\n  let broj = 0;\n  return function () {\n    broj += 1;\n    return broj;\n  };\n}\nconst broji = napraviBrojac();\nconsole.log(broji());\nconsole.log(broji());")),
  izbor(4, 2, 2, "Dva brojača iz dva poziva napraviBrojac dele isti broj.", [
    ["A", "Da. Funkcija je ista, pa je i stanje isto.", false],
    ["B", "Ne. Svaki poziv napravi svoje okruženje. drugi() vrati 1.", true],
  ], "Ista definicija, odvojena izvršavanja.", { ...z, ...kod("function napraviBrojac() {\n  let broj = 0;\n  return function () {\n    broj += 1;\n    return broj;\n  };\n}\nconst prvi = napraviBrojac();\nconst drugi = napraviBrojac();\nprvi();\nconsole.log(drugi());") }),
  izbor(4, 2, 3, "Closure može da drži stanje koje spolja nema ime.", [
    ["A", "Da. Spolja ostaje samo ono što funkcija vrati.", true],
    ["B", "Ne. Svaka lokalna promenljiva postane globalna čim se unutrašnja funkcija vrati.", false],
  ], "stanje u napraviRacun nije svojstvo koje pozivalac sme da dodeli."),
  ispravka(4, 2, 4, "Brojač treba da raste. Sada svaki poziv vraća 1 jer se broj pravi unutar poziva. Izvuci let napolje, u napraviBrojac.", "function napraviBrojac() {\n  return function () {\n    let broj = 0;\n    broj += 1;\n    return broj;\n  };\n}", "function napraviBrojac() {\n  let broj = 0;\n  return function () {\n    broj += 1;\n    return broj;\n  };\n}", "Promenljiva mora da živi u okruženju koje pozivi dele.", js),
  izbor(4, 2, 5, "Kad spoljašnja funkcija završi, njene lokalne promenljive uvek nestanu, i vraćena funkcija ne sme da ih čita.", [
    ["A", "Ne sme da ih čita.", false],
    ["B", "Sme. Closure drži to okruženje.", true],
  ], "Zato brojač pamti broj između poziva.", z),
  izbor(4, 2, 6, "Šta vrati drugi poziv ako je stanje krenulo od 100 i uplata je 20?", [
    ["A", "120", true],
    ["B", "20", false],
    ["C", "100", false],
  ], "uplati menja stanje u closure-u. procitaj čita isto stanje.", kod("function napraviRacun() {\n  let stanje = 100;\n  return {\n    uplati(iznos) { stanje += iznos; },\n    procitaj() { return stanje; },\n  };\n}")),
  izbor(4, 2, 7, "Globalna promenljiva i closure su isti mehanizam čuvanja stanja, sa istom vidljivošću.", [
    ["A", "Ne. Closure može da sakrije ime od spolja.", true],
    ["B", "Da. I jedno i drugo vidi svaki fajl.", false],
  ], "Privatno stanje ovde nema klasu. Ima opseg.", z),
  izbor(4, 3, 1, "Šta vrati procitajIme posle preuzimanja na drugi objekat?", [
    ["A", "\"Marko\"", true],
    ["B", "\"Ana\"", false],
    ["C", "undefined", false],
  ], "Obična funkcija dobija this od poziva. Poziv je metoda objekta drugi.", kod("const prvi = { ime: \"Ana\", procitajIme() { return this.ime; } };\nconst drugi = { ime: \"Marko\", procitajIme: prvi.procitajIme };\nconsole.log(drugi.procitajIme());")),
  izbor(4, 3, 2, "Izdvojena metoda i dalje vidi objekat, jer je u njemu napisana.", [
    ["A", "Da. this je mesto definicije.", false],
    ["B", "Ne. Obična funkcija gleda kako je pozvana. Samo ime funkcija() nema objekat ispred tačke.", true],
  ], "this nije leksički za običnu funkciju.", { ...z, ...kod("const korisnik = {\n  ime: \"Ana\",\n  procitajIme() { return this.ime; },\n};\nconst funkcija = korisnik.procitajIme;\nfunkcija();") }),
  izbor(4, 3, 3, "Arrow funkcija kao metoda koristi this poziva, kao obična metoda.", [
    ["A", "Da. Obe su svojstva istog objekta.", false],
    ["B", "Ne. Arrow nema sopstveni this. Uzima ga iz okruženja u kome je napisana.", true],
  ], "Zato arrow i obična metoda u istom objektu ne moraju da vide isto ime.", z),
  ispravka(4, 3, 4, "procitaj treba da bude obična metoda, da this bude objekat na kome se poziva.", "const nalog = {\n  ime: \"Ana\",\n  procitaj: () => this.ime,\n};", "const nalog = {\n  ime: \"Ana\",\n  procitaj() { return this.ime; },\n};", "Arrow ne dobija this od poziva nalog.procitaj().", js),
  izbor(4, 3, 5, "Šta call uradi?", [
    ["A", "Pozove funkciju tako da this bude dati objekat.", true],
    ["B", "Kopira funkciju u objekat zauvek.", false],
    ["C", "Zabrani svaki dalji poziv.", false],
  ], "call bira this za taj jedan poziv.", kod("function procitaj() { return this.ime; }\nprocitaj.call({ ime: \"Ana\" });")),
  izbor(4, 3, 6, "Metoda je posebna vrsta vrednosti, različita od funkcije.", [
    ["A", "Ne. Metoda je funkcija koja stoji kao svojstvo i pozvana je na objektu.", true],
    ["B", "Da. Metod ne sme da se dodeli drugom objektu.", false],
  ], "Ista funkcija može da pređe na drugi objekat. Menja se poziv, ne natpis funkcije."),
  izbor(4, 3, 7, "Ugneždena obična funkcija unutar metode vidi this metode automatski.", [
    ["A", "Ne. Unutrašnji obični poziv ima svoj this.", true],
    ["B", "Da. this se nasledjuje kao promenljiva.", false],
  ], "Zato se this često sačuva u ime, ili se unutra koristi arrow.", { ...z, ...kod("const o = {\n  ime: \"Ana\",\n  radi() {\n    function unutra() { return this.ime; }\n    return unutra();\n  },\n};") }),
  izbor(4, 4, 1, "Kako korisnik ima pozdrav koji nije upisan na njemu?", [
    ["A", "JavaScript traži svojstvo i duž prototipskog lanca.", true],
    ["B", "Kopira metodu u korisnik pri čitanju.", false],
    ["C", "Svi objekti su globalni, pa vide tuđu metodu po imenu.", false],
  ], "Svojstvo može biti na prototipu, ne na samom objektu.", kod("const zajednicko = { pozdrav() { return \"Zdravo\"; } };\nconst korisnik = Object.create(zajednicko);")),
  izbor(4, 4, 2, "Sopstveno svojstvo istog imena gubi od prototipa.", [
    ["A", "Da. Prototip je uvek jači.", false],
    ["B", "Ne. Sopstveno svojstvo se nađe prvo.", true],
  ], "Lanac se pita tek ako objekat nema svoje ime.", { ...z, ...kod("const osnova = { vrednost: 10 };\nconst objekat = Object.create(osnova);\nobjekat.vrednost = 3;") }),
  izbor(4, 4, 3, "Da li new kopira metodu u svaki objekat?", [
    ["A", "Ne. Oba objekta koriste metodu sa zajedničkog prototipa.", true],
    ["B", "Da. Svaki new pravi svoju kopiju funkcije.", false],
    ["C", "Funkcija pripada samo prvom objektu.", false],
  ], "prototype deli ponašanje. this i dalje zavisi od poziva.", kod("function Korisnik(ime) { this.ime = ime; }\nKorisnik.prototype.pozdrav = function () {\n  return this.ime;\n};")),
  ispravka(4, 4, 4, "pozdrav treba da stoji na prototipu, ne da se pravi iznova u konstruktoru.", "function Korisnik(ime) {\n  this.ime = ime;\n  this.pozdrav = function () {\n    return this.ime;\n  };\n}", "function Korisnik(ime) {\n  this.ime = ime;\n}\nKorisnik.prototype.pozdrav = function () {\n  return this.ime;\n};", "Zajednička metoda ide na prototype. Konstruktor drži stanje instance.", js),
  izbor(4, 4, 5, "class ukida prototipski lanac.", [
    ["A", "Ne. class je drugi zapis za konstruktor i zajedničke metode.", true],
    ["B", "Da. class kopira metode kao u jezicima sa klasama koje nisu prototipske.", false],
  ], "Nasleđivanje i dalje ide lancem. Menja se sintaksa.", z),
  izbor(4, 4, 6, "Šta hasOwn vidi za metodu koja živi samo na prototipu?", [
    ["A", "Nije sopstveno svojstvo.", true],
    ["B", "Jeste, čim poziv uspe.", false],
  ], "Čitanje kroz lanac nije isto što i sopstveno svojstvo.", kod("const osnova = { pozdrav() { return \"Zdravo\"; } };\nconst o = Object.create(osnova);\nObject.hasOwn(o, \"pozdrav\");")),
  izbor(4, 5, 1, "U fajlu stoji const x = ; bez izraza. Šta try oko te linije može dok program radi?", [
    ["A", "Ništa. To je sintaksna greška i fajl se ne pokrene.", true],
    ["B", "catch dobije Error i ostatak fajla nastavi.", false],
  ], "Sintaksa se lomi pre pokretanja. Čitanje null.ime je druga stvar: TypeError u toku, i try može da ga uhvati.", z),
  izbor(4, 5, 2, "Šta try/catch uradi sa throw?", [
    ["A", "catch dobije izuzetak i tok može da nastavi posle try/catch.", true],
    ["B", "throw uvek gasi ceo proces, catch se ne poziva.", false],
    ["C", "catch vidi samo sintaksne greške.", false],
  ], "Izuzetak prekida normalan tok do prvog catch-a, ne nužno ceo program.", kod("function procenat(deo, ukupno) {\n  if (ukupno === 0) throw new Error(\"nula\");\n  return deo / ukupno;\n}")),
  izbor(4, 5, 3, "Pogrešan rezultat bez throw-a i dalje je programska greška, ali nije izuzetak.", [
    ["A", "Da. Izuzetak je signal u toku, ne svaka netačna zamisao.", true],
    ["B", "Ne. Svaki pogrešan broj sam baci Error.", false],
  ], "24 umesto 25 može biti tiha greška. Niko nije bacio izuzetak."),
  ispravka(4, 5, 4, "Čitanje imena sa null treba da bude uhvaćeno. Dodaj try/catch oko čitanja i u catch vrati praznu nisku.", "function ime(osoba) {\n  return osoba.ime;\n}", "function ime(osoba) {\n  try {\n    return osoba.ime;\n  } catch {\n    return \"\";\n  }\n}", "Bez catch, TypeError prekida poziv.", js),
  izbor(4, 5, 5, "Call stack pri grešci služi čemu?", [
    ["A", "Pokazuje koji poziv je vodio do throw-a.", true],
    ["B", "Briše lokalne promenljive da se greška ne bi ponovila.", false],
    ["C", "Pretvara sintaksnu grešku u upozorenje.", false],
  ], "Stek je trag poziva: prva, druga, treca.", kod("function treca() { throw new Error(\"Problem\"); }\nfunction druga() { treca(); }\nfunction prva() { druga(); }")),
  izbor(4, 5, 6, "finally se preskače ako je catch već odradio posao.", [
    ["A", "Ne. finally radi i kad ima catch i kad nema izuzetka.", true],
    ["B", "Da. finally je samo drugi naziv za catch.", false],
  ], "finally je za čišćenje koje treba u oba ishoda.", z),
  izbor(4, 5, 7, "console.log ispred linije koja puca dovoljan je da se vidi stanje, ali ne hvata izuzetak.", [
    ["A", "Da. Log je posmatranje. catch je hvatanje.", true],
    ["B", "Ne. console.log guta sledeći throw.", false],
  ], "Debagovanje i upravljanje izuzetkom nisu ista alatka."),
  izbor(4, 6, 1, "Zašto deliti kod na module?", [
    ["A", "Da ime i zavisnost budu izričiti, umesto jedne gomile u jednom fajlu.", true],
    ["B", "Zato što jedan fajl ne sme da ima više od jedne funkcije.", false],
    ["C", "Zato što browser ne učitava fajl duži od stranice.", false],
  ], "Modul kaže šta izvozi i šta uvozi."),
  izbor(4, 6, 2, "JavaScript objekat i JSON su isto.", [
    ["A", "Da. Viticaste zagrade su JSON.", false],
    ["B", "Ne. JSON je tekst. Objekat je vrednost u memoriji.", true],
  ], "JSON ne prenosi funkcije ni prototip. Tekst treba parsirati.", { ...z, ...kod("const osoba = { ime: \"Ana\", aktivan: true };") }),
  izbor(4, 6, 3, "Šta od ovoga daje okruženje browsera, a ne jezik?", [
    ["A", "document.querySelector", true],
    ["B", "JSON.parse", false],
    ["C", "Array.prototype.map", false],
  ], "map i JSON.parse putuju sa jezikom. document je API browsera.", kod("document.querySelector(\".digit\")")),
  ispravka(4, 6, 4, "JSON tekst treba da postane objekat. Sada se niska samo dodeljuje.", "const tekst = '{\"temperatura\":24}';\nconst soba = tekst;", "const tekst = '{\"temperatura\":24}';\nconst soba = JSON.parse(tekst);", "Bez parse, soba je niska. soba.temperatura ne čita polje.", js),
  izbor(4, 6, 5, "Kako podaci sa servera uđu u program?", [
    ["A", "Browser preko mrežnog API-ja dobije tekst odgovora. JavaScript ga zatim čita kao podatak, na primer JSON.parse.", true],
    ["B", "JavaScript čita memoriju servera direktno.", false],
    ["C", "JSON sam izvrši funkcije koje stoje na serveru.", false],
  ], "Mreža donese reprezentaciju. Jezik je protumači. To nisu isti koraci."),
  izbor(4, 6, 6, "export šalje vrednost drugom fajlu. Bez uvoza taj fajl ne vidi lokalno ime.", [
    ["A", "Da. Modul ne deli svako lokalno ime sa svima.", true],
    ["B", "Ne. Svaka const postane globalna čim fajl postoji.", false],
  ], "Zato matematika.js izvozi funkciju, a main.js je uvozi.", kod("export function zbir(a, b) { return a + b; }")),
];
