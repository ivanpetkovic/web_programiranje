import { ispravka, izbor } from "../kviz-oblik.js";
import { DIJAGRAM_KUTIJE_244 } from "../kviz-logika.js";

const z = { zamka: true };
const html = { jezik: "html" };
const css = { jezik: "css" };

export const pitanja = [
  izbor(2, 0, 1, "Fajl počinje sa html. To je program koji Node pokreće.", [
    ["A", "Da. lang=\"sr\" je naredba procesa.", false],
    ["B", "Ne. To je HTML dokument. Browser ga čita, oznaka jezika ne pokreće proces.", true],
  ], "Element html i atribut lang otvaraju dokument. Još nema programa.", { ...z, kod: "<!DOCTYPE html>\n<html lang=\"sr\">\n</html>", jezik: "html" }),
  izbor(2, 0, 2, "Čemu služi lang=\"sr\" na html?", [
    ["A", "Kaže jezik dokumenta. Ne meri temperaturu i ne pokreće server.", true],
    ["B", "Bira port na kome Node sluša.", false],
    ["C", "Uključuje ventilator.", false],
  ], "Atribut opisuje dokument. Nije komanda sobi."),
  izbor(2, 0, 3, "DOCTYPE je CSS pravilo za širinu stranice.", [
    ["A", "Da. Bez njega width ne važi.", false],
    ["B", "Ne. DOCTYPE kaže da je ovo HTML dokument, ne stil.", true],
  ], "Stil dolazi kasnije, zasebnim resursom.", z),
  ispravka(2, 0, 4, "Ispravi koren dokumenta. Jezik je sr, oznaka je html.", "<htm lang=\"sr\"></htm>", "<html lang=\"sr\"></html>", "Koren je html. Skraćenica htm nije ta oznaka.", html),
  izbor(2, 0, 5, "Prazan html već prikazuje temperaturu sobe.", [
    ["A", "Da. Browser je sam izmeri.", false],
    ["B", "Ne. U dokumentu još nema ni naslova ni broja. Merenja nema.", true],
  ], "Stranica je dokument. Broj koji nije upisan ne postoji na ekranu.", z),
  izbor(2, 0, 6, "Šta browser radi sa ovim fajlom?", [
    ["A", "Učita ga kao dokument.", true],
    ["B", "Pošalje ga PostgreSQL-u kao upit.", false],
    ["C", "Izvrši ga kao JavaScript modul.", false],
  ], "HTML nije ni upit ni modul. Browser ga čita kao dokument.", { kod: "<!DOCTYPE html>\n<html lang=\"sr\">\n</html>", jezik: "html" }),
  ispravka(2, 0, 7, "Dokument treba da bude na srpskom. Ispravi lang.", "<html lang=\"en\"></html>", "<html lang=\"sr\"></html>", "lang imenuje jezik dokumenta. en nije sr.", html),
  izbor(2, 0, 8, "Ako fajl nema vidljiv tekst, browser ipak ima dokument.", [
    ["A", "Da. html može da postoji i pre naslova, broja i dugmeta.", true],
    ["B", "Ne. Bez teksta fajl nije HTML.", false],
  ], "Dokument se otvara oznakom. Sadržaj sobe dolazi u narednim koracima."),

  izbor(2, 1, 1, "Gde stoje charset i title?", [
    ["A", "U glavi dokumenta, u elementu head.", true],
    ["B", "U merenju temperature.", false],
    ["C", "U telu, kao vidljivi broj 24.", false],
  ], "head nosi charset i title. U sobi se to još ne vidi.", { kod: "<meta charset=\"utf-8\">\n<title>Soba</title>", jezik: "html" }),
  izbor(2, 1, 2, "Iz charset-a i title-a sledi da je temperatura već pročitana.", [
    ["A", "Da. title je broj sa senzora.", false],
    ["B", "Ne. Browser zna kako da čita bajtove i koji je naslov. Soba još nije pitana.", true],
  ], "Glava opisuje dokument. Ne donosi merenje.", z),
  izbor(2, 1, 3, "Čemu služi charset=\"utf-8\"?", [
    ["A", "Kaže kako da se protumače bajtovi teksta.", true],
    ["B", "Postavlja širinu kutije na 8 piksela.", false],
    ["C", "Otvara TCP vezu.", false],
  ], "Charset je dogovor o tekstu, ne o mreži i ne o kutiji."),
  ispravka(2, 1, 4, "Naslov dokumenta treba da bude Soba, a skup znakova utf-8. Ispravi glavu.", "<meta charset=\"ascii\">\n<title>Temperatura</title>", "<meta charset=\"utf-8\">\n<title>Soba</title>", "Kurs u ovom koraku stavlja utf-8 i title Soba. ascii i drugi naslov nisu taj dokument.", html),
  izbor(2, 1, 5, "title je isto što i h1 na stranici.", [
    ["A", "Da. Oba su uvek isti vidljivi natpis u sobi.", false],
    ["B", "Ne. title je naslov dokumenta u glavi. h1 je naslov u sadržaju, i još ga nema.", true],
  ], "Glava još nema onoga što se vidi kao soba.", z),
  izbor(2, 1, 6, "Pogrešan charset može pokvariti slova, a da temperatura i dalje ne postoji.", [
    ["A", "Da. Tumačenje bajtova i merenje sobe su odvojeni.", true],
    ["B", "Ne. Čim se slova vide, senzor je pročitan.", false],
  ], "Vidljiv tekst i dalje može biti upisan u fajl, ne izmeren."),
  ispravka(2, 1, 7, "charset i title stoje u glavi. Ispravi mesto: umesto body treba head.", "<body>\n<meta charset=\"utf-8\">\n<title>Soba</title>\n</body>", "<head>\n<meta charset=\"utf-8\">\n<title>Soba</title>\n</head>", "Glava dokumenta je head. body je sadržaj koji se vidi.", html),
  izbor(2, 1, 8, "Šta title ne radi?", [
    ["A", "Ne čita senzor i ne šalje zahtev za sobu.", true],
    ["B", "Ne sme da postoji u HTML-u.", false],
    ["C", "Briše charset.", false],
  ], "Naslov dokumenta je metapodatak. Zahtev za sobu još ne postoji."),

  izbor(2, 2, 1, "Šta je h1?", [
    ["A", "Naslov, ne pasus i ne stil velikih slova.", true],
    ["B", "Merenje temperature.", false],
    ["C", "Komanda ventilatoru.", false],
  ], "Oznaka kaže ulogu. h1 je naslov dokumenta u sadržaju.", { kod: "<h1>Soba prekidača</h1>", jezik: "html" }),
  izbor(2, 2, 2, "Osvežavanje zaboravlja h1 ako fajl i dalje ima tu oznaku.", [
    ["A", "Da. Browser pamti naslov samo do prvog reload-a.", false],
    ["B", "Ne. Osvežavanje ponovo učita naslov iz fajla.", true],
  ], "h1 stoji u fajlu. Reload čita taj fajl.", z),
  izbor(2, 2, 3, "Zašto velika slova nisu zamena za h1?", [
    ["A", "Veličina može da se promeni stilom. Uloga naslova ostaje u oznaci.", true],
    ["B", "Server čita temperaturu iz veličine slova.", false],
    ["C", "Browser ne ume da prikaže h1.", false],
  ], "Semantika ostaje i kad se stil promeni."),
  ispravka(2, 2, 4, "Naslov treba da bude h1, ne pasus. Tekst ostaje Soba prekidača.", "<p>Soba prekidača</p>", "<h1>Soba prekidača</h1>", "p je pasus. Naslov je h1.", html),
  izbor(2, 2, 5, "h1 šalje zahtev za temperaturu.", [
    ["A", "Da. Tekst naslova je putanja API-ja.", false],
    ["B", "Ne. h1 je tekst u dokumentu. Zahtev za sobu još ne postoji.", true],
  ], "Naslov se vidi jer je upisan, ne jer je izmeren.", z),
  izbor(2, 2, 6, "Šta osvežavanje uradi sa naslovom koji jeste u fajlu?", [
    ["A", "Ponovo ga učita.", true],
    ["B", "Upiše prazan naslov u fajl.", false],
    ["C", "Pretvori h1 u dugme.", false],
  ], "Reload vraća dokument iz fajla."),
  ispravka(2, 2, 7, "Ispravi zatvaranje. Oznaka naslova mora da se zatvori istim imenom.", "<h1>Soba prekidača</p>", "<h1>Soba prekidača</h1>", "Početna i završna oznaka su par. p ne zatvara h1.", html),
  izbor(2, 2, 8, "Ako fajl nestane, browser i dalje „pamti” h1 zauvek.", [
    ["A", "Da. Naslov živi u browseru i bez fajla.", false],
    ["B", "Ne. Naslov dolazi iz fajla. Nema fajla, nema ni tog učitavanja.", true],
  ], "Osvežavanje ne čuva naslov mimo dokumenta.", z),

  izbor(2, 3, 1, "Kolika je ukupna širina ove kutije, bez margina?", [
    ["A", "200 px", false],
    ["B", "240 px", false],
    ["C", "244 px", true],
    ["D", "Zavisi od roditelja.", false],
  ], "content-box: 200 + 2×20 + 2×2 = 244. Margin nije u tom zbiru.", { kod: ".box { width: 200px; padding: 20px; border: 2px solid; }", jezik: "css", dijagram: DIJAGRAM_KUTIJE_244 }),
  izbor(2, 3, 2, "width: 200px u content-box modelu već jeste cela kutija sa paddingom i borderom.", [
    ["A", "Da. 200 je uvek spoljašnja mera.", false],
    ["B", "Ne. 200 je sadržaj. Padding i border se dodaju.", true],
  ], "Podrazumevani model meri sadržaj. Padding i border se dodaju na width.", z),
  izbor(2, 3, 3, "Kutija je content-box: width 200px, padding 20px i border 2px. Na dijagramu je taj zbir, 244 px. Šta u njemu nije uračunato?", [
    ["A", "Padding.", false],
    ["B", "Border.", false],
    ["C", "Margin.", true],
  ], "Margin stoji van width + padding + border.", { kod: ".box { width: 200px; padding: 20px; border: 2px solid; }", jezik: "css", dijagram: DIJAGRAM_KUTIJE_244 }),
  izbor(2, 3, 4, "Uz box-sizing: border-box, kolika je spoljašnja širina ove kutije, bez margina?", [
    ["A", "200 px. Padding i border ulaze u deklarisanih 200.", true],
    ["B", "244 px. border-box i dalje sabira isto.", false],
    ["C", "240 px. Border se ignoriše, padding ne.", false],
  ], "border-box uključuje padding i border u width. Sadržaj ostane uži.", { kod: ".box { box-sizing: border-box; width: 200px; padding: 20px; border: 2px solid; }", jezik: "css" }),
  ispravka(2, 3, 5, "Kutija treba da meri spolja 200 px zajedno sa paddingom i borderom. Dodaj box-sizing. Ostale deklaracije ostaju.", ".box {\n  width: 200px;\n  padding: 20px;\n  border: 2px solid;\n}", ".box {\n  box-sizing: border-box;\n  width: 200px;\n  padding: 20px;\n  border: 2px solid;\n}", "Bez border-box, width je samo sadržaj i kutija izađe na 244 px.", css),
  izbor(2, 3, 6, "Kutija bez margina meri 244 px: width 200px, padding 20px i border 2px. Margin od 8 px sa obe strane diže spoljašnju meru na 260. Ta 260 je i dalje width.", [
    ["A", "Da. Margin je deo width.", false],
    ["B", "Ne. Margin nije u 244. Width, padding i border su drugi zbir.", true],
  ], "Sledeći sloj van kutije ne ulazi u prethodni zbir.", { ...z, kod: ".box { width: 200px; padding: 20px; border: 2px solid; margin: 8px; }", jezik: "css", dijagram: DIJAGRAM_KUTIJE_244 }),
  izbor(2, 3, 7, "Kutija ima width 200px, padding 20px i border 2px. Zašto 240 px nije tačan zbir bez margina?", [
    ["A", "Uračunat je padding 2×20, a zaboravljena je ivica 2×2.", true],
    ["B", "Zato što roditelj uvek prepiše width.", false],
    ["C", "Zato što border ne postoji u CSS-u.", false],
  ], "200 + 40 = 240, pa još 4 px ivice daju 244.", { kod: ".box { width: 200px; padding: 20px; border: 2px solid; }", jezik: "css", dijagram: DIJAGRAM_KUTIJE_244 }),

  izbor(2, 4, 1, "Odakle je broj 24 u ovom pasusu?", [
    ["A", "Iz statičnog teksta dokumenta.", true],
    ["B", "Iz merenja kutije.", false],
    ["C", "Iz odgovora /api/soba.", false],
  ], "Broj je upisan u HTML. Zahtev za sobu još ne postoji.", { kod: "<p class=\"digit\">24</p>", jezik: "html" }),
  izbor(2, 4, 2, "class=\"digit\" sam čita senzor.", [
    ["A", "Da. Klasa je ime merenja.", false],
    ["B", "Ne. Klasa bira element za stil. Broj i dalje piše u HTML-u.", true],
  ], "24 ne dokazuje merenje.", z),
  izbor(2, 4, 3, "Šta bi se promenilo ako u fajlu piše 19 umesto 24?", [
    ["A", "Prikaz bi pokazao 19, i dalje bez merenja.", true],
    ["B", "Senzor bi se pokvario.", false],
    ["C", "Server bi vratio 24 uprkos fajlu.", false],
  ], "Dok broj stoji u dokumentu, ekran prati dokument."),
  ispravka(2, 4, 4, "Broj treba da stoji u pasusu sa klasom digit i da bude 24.", "<p class=\"broj\">19</p>", "<p class=\"digit\">24</p>", "Klasa u ovom koraku je digit, a tekst je upisani 24.", html),
  izbor(2, 4, 5, "Ako CSS sakrije .digit, merenje i dalje stiže u pozadini.", [
    ["A", "Da. Klasa je vezana za API.", false],
    ["B", "Ne. Skrivanje menja prikaz. Broj je i dalje tekst fajla, ne merenje.", true],
  ], "Prikaz i merenje nisu isto. Merenja još nema.", z),
  izbor(2, 4, 6, "Atribut class i element p rade različite poslove.", [
    ["A", "p drži tekst. class daje ime po kome stil može da ga nađe.", true],
    ["B", "Oba šalju HTTP zahtev.", false],
    ["C", "class zamenjuje tekst 24 brojem sa senzora.", false],
  ], "Struktura i ime za stil stoje u dokumentu."),
  ispravka(2, 4, 7, "Zatvori pasus. Klasa i broj ostaju.", "<p class=\"digit\">24", "<p class=\"digit\">24</p>", "Otvorena oznaka nije ceo element.", html),
  izbor(2, 4, 8, "Dva elementa sa klasom digit dele isti upisani tekst samo ako oba tako pišu u HTML-u.", [
    ["A", "Da. Klasa ne kopira merenje iz prvog u drugi.", true],
    ["B", "Ne. Klasa znači da browser meri jednom i upiše svuda.", false],
  ], "Isto ime klase nije isto merenje."),

  izbor(2, 5, 1, "Klik na ovo dugme šalje komandu ventilatoru.", [
    ["A", "Da. type=\"button\" je PUT ka ventilatoru.", false],
    ["B", "Ne. Dugme je u dokumentu i još nema kome da pošalje zahtev.", true],
  ], "button imenuje kontrolu. Komanda dolazi tek kad postoji server.", { ...z, kod: "<button type=\"button\">Uključi</button>", jezik: "html" }),
  izbor(2, 5, 2, "Šta type=\"button\" na ovom dugmetu radi?", [
    ["A", "Imenuje dugme koje samo ne šalje formu i ne šalje komandu.", true],
    ["B", "Zabranjuje svaki kasniji zahtev, zauvek.", false],
    ["C", "Uključuje ventilator čim se HTML učita.", false],
  ], "Tip odvaja ovo dugme od podrazumevanog slanja forme. Nije mrežna komanda.", { kod: "<button type=\"button\">Uključi</button>", jezik: "html" }),
  izbor(2, 5, 3, "Natpis Uključi znači da je ventilator već uključen.", [
    ["A", "Da. Tekst dugmeta je stanje sa servera.", false],
    ["B", "Ne. Natpis je tekst u dokumentu.", true],
  ], "Ista zamka kao broj 24: upisano nije izmereno.", z),
  ispravka(2, 5, 4, "Kontrola treba da bude button, tipa button, sa natpisom Uključi.", "<div type=\"submit\">Uključi</div>", "<button type=\"button\">Uključi</button>", "div nije ta kontrola, a submit nije tip ovog dugmeta.", html),
  izbor(2, 5, 5, "Zašto dugme u dokumentu još ne menja sobu?", [
    ["A", "Nema još kome da se zahtev pošalje. Oznaka samo stoji u stranici.", true],
    ["B", "Zato što browser ignoriše svaki button.", false],
    ["C", "Zato što type=\"button\" briše HTML.", false],
  ], "Komanda je kasniji sloj. Sada postoji samo kontrola u dokumentu."),
  izbor(2, 5, 6, "Ako se natpis promeni u Isključi, šta se stvarno promenilo?", [
    ["A", "Tekst u fajlu. Stanje ventilatora i dalje niko nije pitao.", true],
    ["B", "Režim na serveru.", false],
    ["C", "TCP komanda.", false],
  ], "Dokument i stanje sobe nisu isti zapis."),
  ispravka(2, 5, 7, "Ispravi tip. Ovo dugme ne sme da bude submit.", "<button type=\"submit\">Uključi</button>", "<button type=\"button\">Uključi</button>", "U koraku je type=\"button\". submit je drugi dogovor, slanje forme.", html),
  izbor(2, 5, 8, "Dugme bez JavaScripta i bez servera i dalje je deo dokumenta.", [
    ["A", "Da. Kontrola može da postoji pre ponašanja.", true],
    ["B", "Ne. button bez skripte se ne učitava.", false],
  ], "HTML imenuje kontrolu. Ponašanje dolazi kasnije."),

  izbor(2, 6, 1, "Šta ova veza radi?", [
    ["A", "Traži da browser učita stil.", true],
    ["B", "Šalje komandu ventilatoru.", false],
    ["C", "Menja broj 24 u 10.", false],
  ], "link i href učitavaju stil. Broj i dalje stoji u HTML-u.", { kod: "<link rel=\"stylesheet\" href=\"css/soba.css\">", jezik: "html" }),
  izbor(2, 6, 2, "Veza ka stilu promeni broj 24.", [
    ["A", "Da. CSS sme da prepiše tekst čvora.", false],
    ["B", "Ne. href traži CSS. Broj i dalje stoji u HTML-u.", true],
  ], "Stil menja prikaz, ne upisani tekst.", z),
  izbor(2, 6, 3, "rel=\"stylesheet\" kaže šta je resurs.", [
    ["A", "Da. Browser treba da ga tretira kao stil, ne kao sledeću stranicu.", true],
    ["B", "Ne. rel je lozinka.", false],
    ["C", "Ne. rel uključuje ventilator.", false],
  ], "href je adresa. rel je uloga tog resursa."),
  ispravka(2, 6, 4, "Stil je css/soba.css. Ispravi href. rel ostaje stylesheet.", "<link rel=\"stylesheet\" href=\"js/soba.js\">", "<link rel=\"stylesheet\" href=\"css/soba.css\">", "Putanja stila u ovom koraku je css/soba.css, ne skripta.", html),
  izbor(2, 6, 5, "Učitavanje CSS-a je poseban zahtev, ne deo teksta 24.", [
    ["A", "Da. Dokument i stil mogu stići odvojenim zahtevima.", true],
    ["B", "Ne. href upisuje CSS u pasus umesto broja.", false],
  ], "Broj ostaje u HTML-u i kad stil stigne."),
  izbor(2, 6, 6, "Ako se css/soba.css ne nađe, HTML broj nestaje iz fajla.", [
    ["A", "Da. Bez stila dokument se briše.", false],
    ["B", "Ne. Dokument i dalje ima svoj tekst. Nedostaje stil.", true],
  ], "Neuspeh jednog zahteva nije brisanje drugog resursa.", z),
  ispravka(2, 6, 7, "Oznaka za stil je link, ne a. Adresa ostaje css/soba.css.", "<a rel=\"stylesheet\" href=\"css/soba.css\">css/soba.css</a>", "<link rel=\"stylesheet\" href=\"css/soba.css\">", "a je hipertekst u sadržaju. link u glavi traži stil.", html),
  izbor(2, 6, 8, "Šta href na ovoj vezi nije?", [
    ["A", "Nije komanda ventilatoru i nije novi broj temperature.", true],
    ["B", "Nije adresa resursa.", false],
  ], "Adresa stila i komanda sobi nisu ista rečenica.", { kod: "<link rel=\"stylesheet\" href=\"css/soba.css\">", jezik: "html" }),

  izbor(2, 7, 1, "Iste važnosti. Koja boja pobedi?", [
    ["A", "Plava, jer je klasa bliža elementu.", false],
    ["B", "Crvena, jer je ID specifičniji.", true],
    ["C", "Uvek poslednje pravilo u fajlu.", false],
  ], "Specifičnost se gleda pre redosleda kad je poreklo i važnost ista.", { kod: "p { color: green; }\n.tekst { color: blue; }\n#naslov { color: red; }", jezik: "css" }),
  izbor(2, 7, 2, "Poslednje pravilo uvek pobedi.", [
    ["A", "Da. CSS gleda samo red u fajlu.", false],
    ["B", "Ne. Redosled se gleda tek kad su poreklo, važnost i specifičnost jednaki.", true],
  ], "Kaskada ima više koraka. Red je jedan od kasnijih.", z),
  izbor(2, 7, 3, "Crvena boja uz ove deklaracije znači da !important više ništa ne može da promeni.", [
    ["A", "Da. ID je poslednja reč kaskade.", false],
    ["B", "Ne. Drugačije poreklo ili !important i dalje mogu da prevagnu.", true],
  ], "Iz pobede ID nad klasom ne sledi da je kaskada gotova.", { ...z, kod: "p { color: green; }\n.tekst { color: blue; }\n#naslov { color: red; }", jezik: "css" }),
  izbor(2, 7, 4, "Dva pravila iste specifičnosti i važnosti. Koje važi?", [
    ["A", "Ono koje dolazi kasnije.", true],
    ["B", "Uvek ono sa kraćim imenom.", false],
    ["C", "Nijedno. Browser javi grešku.", false],
  ], "Tek kad su jači kriterijumi jednaki, redosled bira."),
  ispravka(2, 7, 5, "Pravilo za ID treba da boji crveno. Selektor je pogrešan: tačka bira klasu. Ispravi selektor.", ".naslov { color: red; }", "#naslov { color: red; }", "Tačka je klasa. ID u CSS-u počinje sa #.", css),
  izbor(2, 7, 6, "Klasa .naslov i ID #naslov biraju isti skup samo zato što im je ime isto.", [
    ["A", "Da. Znak ispred imena je ukras.", false],
    ["B", "Ne. . bira klasu, # bira ID. To su različiti selektori.", true],
  ], "Isto ime nije ista specifičnost.", z),
  izbor(2, 7, 7, "Inline stil na elementu i pravilo u fajlu iste osobine. Šta kurs kaže da se poredi pre redosleda?", [
    ["A", "Poreklo i važnost, pa specifičnost.", true],
    ["B", "Samo broj slova u selektoru.", false],
    ["C", "Samo to da li je fajl sačuvan.", false],
  ], "Kaskada prvo poredi poreklo i važnost, pa specifičnost, pa red."),

  izbor(2, 8, 1, "Šta .digit bira?", [
    ["A", "Element sa klasom digit.", true],
    ["B", "Svaki element na stranici.", false],
    ["C", "Samo prvi element, jer tačka znači prvi.", false],
  ], "Klasni selektor se poklapa sa tom klasom. Broj u dokumentu i dalje može biti 24.", { kod: ".digit { letter-spacing: 0.08em; }", jezik: "css" }),
  izbor(2, 8, 2, "letter-spacing menja broj 24 u fajlu.", [
    ["A", "Da. Razmak slova upisuje novu temperaturu.", false],
    ["B", "Ne. Menja prikaz slova. Tekst ostaje 24.", true],
  ], "Stil nije upis u dokument.", z),
  izbor(2, 8, 3, "Element bez klase digit dobija pravilo .digit { letter-spacing: 0.08em; }.", [
    ["A", "Ne. Nema poklapanja.", true],
    ["B", "Da. Tačka znači sve elemente.", false],
  ], "Selektor je uslov, ne boja cele stranice.", { kod: ".digit { letter-spacing: 0.08em; }", jezik: "css" }),
  ispravka(2, 8, 4, "Selektor treba da bude klasa digit. Ispravi tačku koja fali.", "digit { letter-spacing: 0.08em; }", ".digit { letter-spacing: 0.08em; }", "Bez tačke ovo je selektor oznake digit, ne klase.", css),
  izbor(2, 8, 5, "Dva elementa sa klasom digit dele pravilo. Da li dele i tekst?", [
    ["A", "Dele pravilo. Tekst svako ima svoj, iz HTML-a.", true],
    ["B", "Dele i tekst, jer CSS kopira prvi broj.", false],
  ], "Selektor bira kome stil važi. Ne prepisuje sadržaj."),
  izbor(2, 8, 6, "Ako se klasa ukloni iz HTML-a, pravilo .digit i dalje boji taj element.", [
    ["A", "Da. Browser pamti klasu zauvek.", false],
    ["B", "Ne. Nema klase, nema poklapanja.", true],
  ], "Selektor gleda dokument koji je učitan.", z),
  ispravka(2, 8, 7, "Razmak slova treba da bude 0.08em, na klasi digit.", ".digit { letter-spacing: 8px; }", ".digit { letter-spacing: 0.08em; }", "Vrednost iz koraka je 0.08em, ne 8px.", css),
  izbor(2, 8, 8, "Zašto .digit ne oboji svaki element?", [
    ["A", "Zato što se poklapa samo element koji ima tu klasu.", true],
    ["B", "Zato što CSS važi samo za h1.", false],
  ], "Uslov selektora je klasa, ne „sve”."),

  izbor(2, 9, 1, "Šta border menja?", [
    ["A", "Ivicu kutije.", true],
    ["B", "Broj 24 u dokumentu.", false],
    ["C", "Merenje senzora.", false],
  ], "border je ivica. Tekst fajla i dalje može biti 24.", { kod: ".digit { border: 1px solid #3a342c; }", jezik: "css" }),
  izbor(2, 9, 2, "border upisuje novi broj u fajl.", [
    ["A", "Da. Ivica je novo merenje.", false],
    ["B", "Ne. Ivica je prikaz kutije. 24 je tekst dokumenta.", true],
  ], "Prikaz kutije i sadržaj fajla ostaju odvojeni.", z),
  izbor(2, 9, 3, "U content-box modelu, border od 1px sa obe strane ulazi u deklarisani width.", [
    ["A", "Ne. Dodaje se na širinu sadržaja.", true],
    ["B", "Da. width već uključuje svaku ivicu.", false],
  ], "Ista poenta kao kod 244 px: ivica je van width dok je model content-box."),
  ispravka(2, 9, 4, "Ivica treba da bude 1px solid #3a342c na klasi digit.", ".digit { border: 10px dashed red; }", ".digit { border: 1px solid #3a342c; }", "Debljina, stil i boja u koraku su 1px, solid i #3a342c.", css),
  izbor(2, 9, 5, "Ako se border skine, broj u HTML-u se promeni.", [
    ["A", "Ne. Gubi se ivica, tekst ostaje.", true],
    ["B", "Da. Bez ivice browser briše tekst.", false],
  ], "Ivica nije sadržaj."),
  izbor(2, 9, 6, "border i margin su ista merna linija.", [
    ["A", "Da. Oba su unutar width.", false],
    ["B", "Ne. border je ivica kutije. margin je prostor van nje.", true],
  ], "Zbir 244 nije uključio margin. Ivica jeste deo te računice u content-box.", z),
  ispravka(2, 9, 7, "Ispravi ime osobine. Treba ivica, ne margina. Vrednost ostaje.", ".digit { margin: 1px solid #3a342c; }", ".digit { border: 1px solid #3a342c; }", "margin ne prima solid i boju na ovaj način. Osobina je border.", css),
  izbor(2, 9, 8, "Boja ivice #3a342c je temperatura.", [
    ["A", "Ne. To je boja prikaza.", true],
    ["B", "Da. Heksadecimalni broj je senzor.", false],
  ], "Boja nije merenje sobe.", z),

  izbor(2, 10, 1, "U alatima broj privremeno postane 10. Šta osvežavanje uradi?", [
    ["A", "Vrati dokument, opet 24, ako fajl i dalje kaže 24.", true],
    ["B", "Upiše 10 u fajl.", false],
    ["C", "Pošalje 10 kao novo merenje.", false],
  ], "10 je bio lokalni prikaz. Osvežavanje vraća dokument."),
  izbor(2, 10, 2, "Osvežavanje upisuje u fajl ono što se trenutno vidi.", [
    ["A", "Da. Reload je čuvanje.", false],
    ["B", "Ne. Reload ponovo čita fajl. Lokalna izmena prikaza nestane.", true],
  ], "Prikaz i fajl nisu isti zapis.", z),
  izbor(2, 10, 3, "Ako u fajlu piše 24, a na ekranu posle izmene u alatima piše 10, šta je dokument?", [
    ["A", "I dalje 24.", true],
    ["B", "10, jer ekran jeste fajl.", false],
  ], "Ekran može da laže o fajlu dok se ne osveži."),
  ispravka(2, 10, 4, "Komentar meša prikaz i fajl. Ispravi ga.", "// Osvežavanje upisuje 10 u fajl.", "// Osvežavanje vraća 24 iz fajla.", "10 nije upisan. Fajl i dalje drži 24.", { jezik: "js" }),
  izbor(2, 10, 5, "Zašto 10 nestane posle osvežavanja?", [
    ["A", "Zato što je 10 bio lokalni prikaz, a fajl i dalje kaže 24.", true],
    ["B", "Zato što browser pri reload-u uvek upisuje 24 u fajl.", false],
  ], "24 se vraća jer je u fajlu, ne jer ga reload izmišlja."),
  izbor(2, 10, 6, "h1 i broj imaju isto pravilo osvežavanja.", [
    ["A", "Da. Oba se ponovo čitaju iz fajla.", true],
    ["B", "Ne. Broj ostaje lokalno, naslov se čita iz fajla.", false],
  ], "Šta je u dokumentu, to osvežavanje vrati. Šta je samo prikaz, to nestane."),
  ispravka(2, 10, 7, "U fajlu treba da ostane 24. Ispravi pasus koji je neko zamenio lokalnim prikazom.", "<p class=\"digit\">10</p>", "<p class=\"digit\">24</p>", "Dokument drži 24. 10 je bio samo ekran.", html),
  izbor(2, 10, 8, "Ako se fajl sačuva sa 10, osvežavanje i dalje mora da vrati 24.", [
    ["A", "Ne. Tada je 10 dokument. Osvežavanje učita 10.", true],
    ["B", "Da. 24 je ugrađeno u browser.", false],
  ], "Osvežavanje vraća ono što fajl jeste, ne neki večiti broj.", z),

  izbor(2, 11, 1, "Grid nema mesta za dve kolone minimalne širine. Šta sme da uradi?", [
    ["A", "Da pređe na jednu kolonu.", true],
    ["B", "Uvek crta dve kolone i širi stranicu.", false],
    ["C", "Sam briše drugu kontrolu iz dokumenta.", false],
  ], "Raspored se menja. Kontrola ostaje u dokumentu.", { kod: ".panel {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));\n}", jezik: "css" }),
  izbor(2, 11, 2, "Jedna kolona znači da je druga kontrola obrisana.", [
    ["A", "Da. Uski ekran seče HTML.", false],
    ["B", "Ne. Grid menja raspored. Obe kontrole ostaju u dokumentu.", true],
  ], "Prikaz kolona nije sadržaj fajla.", z),
  izbor(2, 11, 3, "Čemu služe minmax i auto-fit u ovom pravilu?", [
    ["A", "Da broj kolona prati raspoloživu širinu, umesto da bude zauvek dve.", true],
    ["B", "Da izmere temperaturu.", false],
    ["C", "Da pošalju zahtev za stil još jednom.", false],
  ], "Ovo je raspored, ne merenje i ne mreža.", { kod: ".panel {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));\n}", jezik: "css" }),
  ispravka(2, 11, 4, "Panel treba da bude grid, ne flex. Ostale deklaracije ostaju kako jesu u polaznom kodu.", ".panel {\n  display: flex;\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));\n}", ".panel {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));\n}", "grid-template-columns važi za grid. display treba da bude grid.", css),
  izbor(2, 11, 5, "Horizontalni overflow je jedini dozvoljen ishod uskog ekrana.", [
    ["A", "Ne. Grid može da spusti stavke u jednu kolonu.", true],
    ["B", "Da. CSS ne sme da menja broj kolona.", false],
  ], "Kurs upravo razdvaja prelom rasporeda od brisanja kontrole.", z),
  izbor(2, 11, 6, "Ako se prozor proširi, druga kolona može da se vrati bez izmene HTML-a.", [
    ["A", "Da. Raspored prati širinu. Dokument se nije menjao.", true],
    ["B", "Ne. Jednom spuštena kontrola nestane iz fajla.", false],
  ], "Isti HTML, drugi prikaz."),
  ispravka(2, 11, 7, "Ispravi komentar.", "/* Uska širina briše drugo dugme iz HTML-a. */", "/* Uska širina menja raspored. Dugme ostaje u HTML-u. */", "Grid ne seče dokument.", css),
  izbor(2, 11, 8, "gap menja tekst dugmeta.", [
    ["A", "Ne. gap je razmak u rasporedu.", true],
    ["B", "Da. gap upisuje novi natpis.", false],
  ], "Razmak nije sadržaj.", z),

  izbor(2, 12, 1, "Izmena u alatima browsera promeni fajl na disku.", [
    ["A", "Ne. Menja lokalni prikaz u ovom browseru. Dokument ostaje.", true],
    ["B", "Da. Alati šalju novi HTML na server.", false],
    ["C", "Da. Time se menja i merenje senzora.", false],
  ], "Alati menjaju sliku. Fajl se ne čuva sam.", z),
  izbor(2, 12, 2, "Zašto izmena u alatima ne preživi osvežavanje?", [
    ["A", "Zato što je promena lokalni prikaz, a dokument u fajlu ostaje.", true],
    ["B", "Zato što osvežavanje uvek briše CSS sa diska.", false],
  ], "Isto pravilo kao kad broj privremeno postane 10."),
  izbor(2, 12, 3, "Šta je time promenjeno ako u alatima piše 10, a u fajlu 24?", [
    ["A", "Lokalni prikaz, ne dokument i ne merenje.", true],
    ["B", "I merenje i dokument.", false],
    ["C", "Samo server.", false],
  ], "Tri stvari ostaju odvojene: ekran, fajl, senzor."),
  ispravka(2, 12, 4, "Ispravi komentar iznad izmene u alatima.", "// element.textContent = \"10\" čuva 10 u fajlu.", "// element.textContent = \"10\" menja samo lokalni prikaz.", "textContent u alatima ne snima fajl.", { jezik: "js" }),
  izbor(2, 12, 5, "Isti broj u dva browsera znači da oba čitaju isti fajl, ne da alati jednog važe i u drugom.", [
    ["A", "Da. Lokalna izmena jednog browsera ne putuje sama.", true],
    ["B", "Ne. Alati su deo fajla.", false],
  ], "Prikaz je u tom browseru."),
  izbor(2, 12, 6, "Ako posle izmene u alatima sačuvaš fajl iz editora lekcije, šta postaje dokument?", [
    ["A", "Ono što editor upiše u fajl, ne ono što je slučajno ostalo u alatima.", true],
    ["B", "Uvek poslednji broj iz alata, i bez čuvanja.", false],
  ], "Čuvanje fajla i privremeni prikaz nisu isti gest."),
  ispravka(2, 12, 7, "Vrati tekst čvora na dokument. U fajlu je 24.", "element.textContent = \"10\"", "element.textContent = \"24\"", "10 je lokalna zamena. Dokument kaže 24.", { jezik: "js" }),
  izbor(2, 12, 8, "Alati mogu da pokažu kako bi stil izgledao. To još nije nova verzija fajla.", [
    ["A", "Da.", true],
    ["B", "Ne. Svaki pregled je čuvanje.", false],
  ], "Pokus u browseru nije upis dok ga neko ne sačuva."),

  izbor(2, 13, 1, "Stranica pokazuje 24. Da li se u mreži vidi zahtev za sobu?", [
    ["A", "Ne. Vide se dokument i stil. API sobe još nema.", true],
    ["B", "Da. Inače broj ne bi postojao.", false],
  ], "Broj je u HTML-u. Treći zahtev ka /api/soba još ne postoji.", { ...z, kod: "GET /\nGET /css/soba.css", jezik: "text" }),
  izbor(2, 13, 2, "Dva zahteva znače da browser sme da pošalje samo dva, zauvek.", [
    ["A", "Da. Treći zahtev je zabranjen.", false],
    ["B", "Ne. Sada ih je dva jer stranica traži dokument i stil. Treći sme da se pojavi kasnije.", true],
  ], "Broj zahteva prati resurse, nije zakon stranice.", z),
  izbor(2, 13, 3, "Šta bi treći zahtev ka /api/soba promenio u tumačenju broja?", [
    ["A", "Tek tada broj može da dođe iz odgovora, a ne samo iz HTML-a.", true],
    ["B", "Ništa. Broj zauvek mora biti iz fajla.", false],
    ["C", "Obrisao bi CSS.", false],
  ], "Dok tog zahteva nema, 24 je tekst dokumenta."),
  ispravka(2, 13, 4, "U spisku zahteva nema API-ja sobe. Izbaci liniju koje nema.", "GET /\nGET /css/soba.css\nGET /api/soba", "GET /\nGET /css/soba.css", "U ovom koraku Network vidi dokument i stil.", { jezik: "text" }),
  izbor(2, 13, 5, "GET / i GET stila su isti zahtev, samo dvaput zapisan.", [
    ["A", "Ne. Jedan traži dokument, drugi stil.", true],
    ["B", "Da. Browser duplira prvi zahtev u dnevnik.", false],
  ], "Dva resursa, dva zahteva."),
  izbor(2, 13, 6, "Ako stil ne stigne, zahtev za dokument i dalje je mogao da uspe.", [
    ["A", "Da. Zahtevi su odvojeni.", true],
    ["B", "Ne. Padnu ili uspeju samo zajedno.", false],
  ], "Jedna stranica nije jedan uspeh."),
  izbor(2, 13, 7, "Broj 24 u HTML-u dokazuje da je /api/soba vraćen 200.", [
    ["A", "Ne. Broj može stajati u fajlu i bez tog zahteva.", true],
    ["B", "Da. Svaki broj na stranici je JSON sa servera.", false],
  ], "Dokaz merenja je zahtev i odgovor, ne cifra u dokumentu.", z),

  izbor(2, 14, 1, "Zašto h1, a ne samo velika slova?", [
    ["A", "Zato što dokument kaže šta je naslov.", true],
    ["B", "Zato što server tako čita temperaturu.", false],
    ["C", "Zato što velika slova nisu dozvoljena u HTML-u.", false],
  ], "Semantički HTML ostaje i kad se stil promeni."),
  izbor(2, 14, 2, "Velika slova jesu zamena za h1.", [
    ["A", "Da. Uloga prati veličinu fonta.", false],
    ["B", "Ne. Veličina može da se promeni stilom. Uloga naslova ostaje u oznaci.", true],
  ], "Izgled i uloga nisu isto.", z),
  izbor(2, 14, 3, "Ako CSS smanji h1 na veličinu pasusa, šta ostaje?", [
    ["A", "Uloga naslova u oznaci.", true],
    ["B", "Ništa. h1 postane p.", false],
    ["C", "Server počne da čita temperaturu iz te oznake.", false],
  ], "Stil menja prikaz. Oznaka ostaje."),
  ispravka(2, 14, 4, "Naslov treba da bude h1. Velika slova u pasusu nisu ta oznaka. Tekst ostaje Soba.", "<p>SOBA</p>", "<h1>Soba</h1>", "Uloga naslova je u h1, ne u veličini slova.", html),
  izbor(2, 14, 5, "button i dalje imenuje kontrolu i kad CSS skine okvir dugmeta.", [
    ["A", "Da. Uloga je u oznaci, ne u ivici.", true],
    ["B", "Ne. Bez bordera to više nije dugme.", false],
  ], "Ista poenta kao za h1."),
  izbor(2, 14, 6, "Semantika zamenjuje potrebu za kasnijim zahtevom ka sobi.", [
    ["A", "Ne. Oznaka kaže šta je deo stranice. Merenje i dalje nije obavljeno.", true],
    ["B", "Da. h1 je API.", false],
  ], "Ispravna oznaka nije senzor.", z),
  ispravka(2, 14, 7, "Ispravi komentar.", "/* Velika slova jesu naslov, oznaka nije bitna. */", "/* Naslov je h1. Velika slova su samo stil. */", "Uloga ostaje u oznaci.", css),
  izbor(2, 14, 8, "Čitač ekrana može da koristi h1 i kad je vizuelno sitan.", [
    ["A", "Da. Oznaka nosi ulogu i van boje i veličine.", true],
    ["B", "Ne. Čita se samo najveći font.", false],
  ], "Zato kurs ne zamenjuje h1 velikim slovima."),
];
