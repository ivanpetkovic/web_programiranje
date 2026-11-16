import { ispravka, izbor } from "../kviz-oblik.js";

const z = { zamka: true };
const js = { jezik: "js" };
const html = { jezik: "html" };

function kod(tekst) {
  return { kod: tekst, jezik: "js" };
}

export const pitanja = [
  izbor(5, 0, 1, "Isti program menja naslov u dva browsera. Šta JavaScript mora da dobije od browsera?", [
    ["A", "Zajednički model dokumenta i dogovorene operacije.", true],
    ["B", "Interni raspored memorije baš tog browsera.", false],
    ["C", "HTML fajl sa servera, kao jedini objekat.", false],
  ], "Browser sme da čuva dokument kako hoće. Program vidi DOM i API, ne tu memoriju."),
  izbor(5, 0, 2, "U DevTools se promeni tekst naslova. Ništa drugo ne čuva izmenu. Šta je posle osvežavanja?", [
    ["A", "Fajl na serveru ostaje izmenjen.", false],
    ["B", "Najčešće početni dokument. Menjana je živa stranica.", true],
    ["C", "Browser sam upiše izmenu u localStorage.", false],
  ], "DOM je dokument u memoriji. Osvežavanje ponovo čita izvor, ako druga logika ne vrati promenu.", z),
  izbor(5, 0, 3, "Šta stoji unutar ovog paragrafa?", [
    ["A", "Jedno tekstualno svojstvo, strong je samo stil.", false],
    ["B", "Tekstualni čvor i element strong, koji ima svoj tekst.", true],
  ], "Element i čvor nisu isto. strong je element, a tekst oko njega je čvor.", kod("<p>Zdravo <strong>svete</strong></p>")),
  ispravka(5, 0, 4, "app.js odmah traži #naslov, a skripta je obična i stoji ispred naslova. Odloži je atributom defer.", "<script src=\"app.js\"></script>\n<h1 id=\"naslov\">Vesti</h1>", "<h1 id=\"naslov\">Vesti</h1>\n<script src=\"app.js\" defer></script>", "Bez odlaganja pretraga može da vrati null, jer parser još nije stigao do naslova.", html),

  izbor(5, 1, 1, "Pre dodavanja postoji tačno jedan li. Šta ispiše prvi console.log?", [
    ["A", "1. Stari NodeList se ne dopunjava.", true],
    ["B", "2. Svaka lista prati DOM uživo.", false],
    ["C", "0. append briše prethodnu pretragu.", false],
  ], "querySelectorAll vraća statičan NodeList. Novi poziv vidi 2.", { ...z, ...kod("const stavke = document.querySelectorAll(\"li\");\ndocument.querySelector(\"ul\").append(document.createElement(\"li\"));\nconsole.log(stavke.length);") }),
  izbor(5, 1, 2, "Čime se .kartica.aktivna razlikuje od .kartica .aktivna?", [
    ["A", "Ničim. Razmak u selektoru se ignoriše.", false],
    ["B", "Prvi traži isti element sa obe klase. Drugi traži potomka.", true],
  ], "Bez razmaka klase stoje na istom elementu. Razmak je odnos predak–potomak."),
  izbor(5, 1, 3, "querySelector ne nađe ništa. Šta vraća?", [
    ["A", "Prazan niz, kao querySelectorAll.", false],
    ["B", "null. Zato sledeće čitanje svojstva puca ako nema provere.", true],
    ["C", "Prazan string.", false],
  ], "Jedan rezultat je element ili null. Kolekcija može biti prazna, ali nije null."),
  ispravka(5, 1, 4, "Pretraga može da vrati null. Ne čitaj textContent dok element nije nađen.", "const el = document.querySelector(\"#nema\");\nel.textContent = \"X\";", "const el = document.querySelector(\"#nema\");\nif (el) el.textContent = \"X\";", "null nema textContent. Provera odvaja promašaj od upisa.", js),

  izbor(5, 2, 1, "Korisnik u polje upiše znakove <b>Mila</b>. Šta uradi textContent, a šta innerHTML?", [
    ["A", "textContent ostavlja znakove kao tekst. innerHTML pravi element b.", true],
    ["B", "Oba prave element b.", false],
    ["C", "innerHTML odbija znakove < i >.", false],
  ], "Nepouzdan unos u innerHTML parsira se kao HTML. textContent ga ne parsira.", { ...z, ...kod("poruka.textContent = ime.value;\nporuka.innerHTML = ime.value;") }),
  izbor(5, 2, 2, "Posle input.value = \"42\" čitamo input.textContent. Da li je to unos?", [
    ["A", "Da. textContent i value su isti podatak.", false],
    ["B", "Ne. Aktuelni unos kontrole je value.", true],
  ], "textContent čita tekstualne čvorove. Polje drži unos u value.", kod("input.value = \"42\";\ninput.textContent;")),
  izbor(5, 2, 3, "Korisnik kuca u polje. getAttribute(\"value\") prati svaki znak?", [
    ["A", "Ne mora. value je trenutno svojstvo, atribut je oznaka iz HTML-a.", true],
    ["B", "Da. Atribut i svojstvo su uvek isti broj.", false],
  ], "Atribut i živo svojstvo nisu isti kanal. Za unos čitaj value."),
  ispravka(5, 2, 4, "Ime dolazi od korisnika i sme da sadrži HTML znakove. Upiši ga kao tekst, ne kao HTML.", "poruka.innerHTML = ime.value;", "poruka.textContent = ime.value;", "textContent ne pravi elemente iz unosa.", js),

  izbor(5, 3, 1, "Šta daju dva poređenja dataset.id?", [
    ["A", "true, pa false. dataset pretvara broj.", false],
    ["B", "false, pa true. dataset.id je string \"42\".", true],
  ], "data-id u DOM-u stiže kao string. 42 i \"42\" nisu isti tip.", { ...z, ...kod("el.dataset.id === 42;\nel.dataset.id === \"42\";") }),
  izbor(5, 3, 2, "Da li su hidden, disabled i siva boja tri zapisa iste stvari?", [
    ["A", "Da. Sivo dugme se ne može pritisnuti.", false],
    ["B", "Ne. Skrivanje, zabrana i boja imaju različite posledice.", true],
  ], "Siva boja ne gasi dugme. disabled i hidden rade različite stvari."),
  izbor(5, 3, 3, "Klasa alarm je na elementu, a boja ipak nije crvena. Šta prvo proveriti?", [
    ["A", "Da je stanje lažno čim boja nije crvena.", false],
    ["B", "Kaskadu. Drugo pravilo može da pobedi boju klase.", true],
  ], "Klasa kaže stanje. Konačan izgled računa CSS. To nisu isti sloj."),
  ispravka(5, 3, 4, "Alarm neka bude klasa, ne inline boja. CSS za .alarm definiše izgled.", "el.style.color = \"red\";", "el.classList.add(\"alarm\");", "Klasa odvaja stanje od jedne konkretne deklaracije boje.", js),

  izbor(5, 4, 1, "createElement(\"li\") je gotov, append nije pozvan. Gde je stavka?", [
    ["A", "Već je na stranici, jer je element napravljen.", false],
    ["B", "Postoji kao objekat, ali nije u stablu dokumenta.", true],
  ], "Nov čvor postaje vidljiv tek kad uđe u stablo.", kod("const li = document.createElement(\"li\");\nli.textContent = \"Jedan\";")),
  izbor(5, 4, 2, "Isti li ide prvo u levu, pa u desnu listu. Koliko novih li ostaje?", [
    ["A", "Dva. append kopira čvor.", false],
    ["B", "Jedan, na kraju desne liste. append premešta.", true],
  ], "Jedan čvor ima jedno mesto u stablu.", { ...z, ...kod("leva.append(li);\ndesna.append(li);") }),
  izbor(5, 4, 3, "Zašto replaceChildren na listi može da prekine kucanje u polju unutar liste?", [
    ["A", "Stari čvorovi nestaju, a sa njima fokus i unos.", true],
    ["B", "replaceChildren menja samo tekst, čvorovi ostaju.", false],
  ], "Zamena pravi nove čvorove. Fokus je bio na starom polju."),
  ispravka(5, 4, 4, "Stavka je napravljena, ali nije u listi. Dodaj je.", "const li = document.createElement(\"li\");\nli.textContent = \"Jedan\";", "const li = document.createElement(\"li\");\nli.textContent = \"Jedan\";\nlista.append(li);", "Bez append čvor ne ulazi u dokument.", js),

  izbor(5, 5, 1, "Kada se izvrši obradi?", [
    ["A", "Odmah, pri registraciji. Listener dobija undefined.", true],
    ["B", "Tek na klik. Zagrade čekaju događaj.", false],
  ], "Poziv sa zagradama radi se odmah. Listener treba da bude funkcija.", { ...z, ...kod("dugme.addEventListener(\"click\", obradi());") }),
  izbor(5, 5, 2, "Da li su obradi i () => obradi() uvek isti listener?", [
    ["A", "Da. Oba čekaju klik i prosleđuju isti event.", false],
    ["B", "Ne. Oba čekaju klik, ali drugi ne prosleđuje event i drugačiji je objekat funkcije.", true],
  ], "Uklanjanje traži istu referencu. Prazan poziv ne prenosi događaj."),
  izbor(5, 5, 3, "Inicijalizacija tri puta doda novu arrow funkciju na isti klik. Šta jedan klik može?", [
    ["A", "Da izvrši operaciju tri puta.", true],
    ["B", "Browser čuva samo poslednju registraciju.", false],
  ], "Svaka nova funkcija je poseban listener."),
  ispravka(5, 5, 4, "obradi treba da čeka klik. Skloni zagrade iz argumenta.", "dugme.addEventListener(\"click\", obradi());", "dugme.addEventListener(\"click\", obradi);", "Zagrade zovu funkciju odmah. Ime bez zagrada je callback.", js),

  izbor(5, 6, 1, "Capture listener je na spolja, obični su na unutra i na spolja. Klik je na dugme. Koji je red?", [
    ["A", "unutra, pa oba poziva na spolja.", false],
    ["B", "spolja u capture, unutra, pa spolja u bubble.", true],
  ], "Capture ide ka cilju. Bubble se vraća ka precima, ako događaj bubble-uje.", kod("document > div#spolja > button#unutra")),
  izbor(5, 6, 2, "Klik je na span unutar dugmeta. Listener je na kartici. Šta su target i currentTarget?", [
    ["A", "SPAN, pa element kartice.", true],
    ["B", "Oba su kartica.", false],
    ["C", "Oba su SPAN.", false],
  ], "target je čvor na kome je događaj nastao. currentTarget je čvor čiji se listener izvršava.", { ...z, ...kod("kartica.addEventListener(\"click\", (event) => {\n  console.log(event.target.tagName);\n  console.log(event.currentTarget.tagName);\n});") }),
  izbor(5, 6, 3, "Šta radi stopPropagation, a šta preventDefault?", [
    ["A", "Oba prekidaju i širenje i podrazumevanu radnju.", false],
    ["B", "Prvo zaustavlja dalje širenje. Drugo otkazuje podrazumevanu radnju.", true],
  ], "To su odvojeni mehanizmi. Jedan ne radi posao drugog."),
  ispravka(5, 6, 4, "Link ne sme da ode na drugu stranicu. stopPropagation to ne otkazuje. Zovi preventDefault.", "link.addEventListener(\"click\", (event) => {\n  event.stopPropagation();\n});", "link.addEventListener(\"click\", (event) => {\n  event.preventDefault();\n});", "Podrazumevana navigacija se otkazuje preventDefault-om.", js),

  izbor(5, 7, 1, "Klik je na span unutar dugmeta. Uslov traži event.target.matches(\"button\"). Šta se desi?", [
    ["A", "Klik prolazi, jer matches vidi pretka.", false],
    ["B", "Uslov odbije klik. target je span, ne dugme.", true],
  ], "target je najdublji čvor. closest(\"button\") nađe dugme oko teksta.", { ...z, ...kod("if (!event.target.matches(\"button\")) return;") }),
  izbor(5, 7, 2, "closest može da nađe dugme van liste na kojoj je listener. Šta još proveriti?", [
    ["A", "Da lista sadrži to dugme.", true],
    ["B", "Ništa. closest ostaje u elementu listenera.", false],
  ], "contains vezuje pogodak za kontejner koji je smeo da rukuje događajem."),
  izbor(5, 7, 3, "Lista je sortirana, pa korisnik briše treću karticu. Šta identifikuje zapis?", [
    ["A", "Indeks 2, jer je to treće mesto.", false],
    ["B", "Identifikator sa kartice, ne trenutni indeks.", true],
  ], "Indeks je pozicija. Posle sortiranja isti indeks pokazuje drugi zapis."),
  ispravka(5, 7, 4, "Klik na tekst unutar dugmeta treba da prođe, a dugme mora biti unutar liste.", "if (!event.target.matches(\"button\")) return;", "const dugme = event.target.closest(\"button\");\nif (!dugme || !lista.contains(dugme)) return;", "closest penje se do dugmeta. contains odbija dugme van liste.", js),

  izbor(5, 8, 1, "Polje je prazno. Šta uradi provera Number i isFinite?", [
    ["A", "Odbije unos, jer je prazan string NaN.", false],
    ["B", "Prihvati 0. Number(\"\") jeste 0.", true],
  ], "Prazan unos treba odbiti pre Number.", { ...z, ...kod("const broj = Number(input.value);\nif (Number.isFinite(broj)) console.log(\"prihvaceno\", broj);") }),
  izbor(5, 8, 2, "U submit handleru pozvan je preventDefault. Šta je time urađeno?", [
    ["A", "Funkcija je prekinuta i fetch je zabranjen.", false],
    ["B", "Otkazana je podrazumevana radnja. Ostatak handlera ide dalje.", true],
    ["C", "Formular se i dalje šalje kao navigacija.", false],
  ], "preventDefault ne prekida funkciju i ne zabranjuje kasniji fetch."),
  izbor(5, 8, 3, "Dugme unutar forme nema type. Šta je podrazumevano?", [
    ["A", "button. Ne šalje formu.", false],
    ["B", "submit. Enter i klik šalju formu.", true],
  ], "Pomoćno dugme unutar forme treba da ima type=\"button\"."),
  ispravka(5, 8, 4, "Prazan unos ne sme da postane 0. Odbij prazan tekst pre Number.", "const broj = Number(input.value);\nif (Number.isFinite(broj)) primi(broj);", "const tekst = input.value.trim();\nif (tekst === \"\") return;\nconst broj = Number(tekst);\nif (Number.isFinite(broj)) primi(broj);", "Number(\"\") je 0, a 0 jeste konačan broj.", js),

  izbor(5, 9, 1, "Ista temperatura stoji u velikom broju, kartici i naslovu taba, i svako mesto čuva svoju kopiju. U čemu je problem?", [
    ["A", "Nema problema. Tri prikaza moraju imati tri broja.", false],
    ["B", "Tri kopije mogu da se raziđu. Treba jedan podatak.", true],
  ], "Jedan izvor, a prikazi ga čitaju."),
  izbor(5, 9, 2, "Na ekranu piše \"22 °C\". Sledeća akcija čita taj textContent i parsira broj. Zašto je to loše?", [
    ["A", "Prikaz je formatiran i može biti star. Broj treba da stoji u modelu.", true],
    ["B", "Ekran je stanje. Parsiranje je jedini ispravan put.", false],
  ], "Tekst na ekranu nije ugovor modela.", z),
  izbor(5, 9, 3, "U konzoli se izvrši stanje.temperatura += 1. Da li se svi prikazi sami osveže?", [
    ["A", "Da. Objekat je vezan za elemente koji pokazuju temperaturu.", false],
    ["B", "Ne. Potreban je kod koji upisuje DOM.", true],
  ], "Običan objekat ne traži elemente. Render to radi namerno.", z),
  ispravka(5, 9, 4, "Sledeća temperatura ne sme da se čita iz formatiranog teksta. Menjaj broj u modelu.", "function povecaj() {\n  const t = Number(document.querySelector(\"#broj\").textContent);\n  stanje.temperatura = t + 1;\n}", "function povecaj() {\n  stanje.temperatura += 1;\n}", "Model drži broj. Tekst \"22 °C\" nije taj broj.", js),

  izbor(5, 10, 1, "render se pozove tri puta sa istim stanjem. Šta sme da se desi poslovnom broju?", [
    ["A", "Broj raste za 3, jer je render pozvan tri puta.", false],
    ["B", "Ništa. Isti model daje isti prikaz, bez nove poslovne izmene.", true],
  ], "Render upisuje DOM. Ne uvećava stanje samim pozivom."),
  izbor(5, 10, 2, "render je pozvan dok je broj 4, pa stanje.broj postane 5 bez novog rendera. Šta je na ekranu?", [
    ["A", "4", true],
    ["B", "5", false],
  ], "Stanje i ekran se razilaze dok render ponovo ne pročita model.", { ...z, ...kod("const stanje = { broj: 4 };\nfunction render() {\n  izlaz.textContent = String(stanje.broj);\n}\nrender();\nstanje.broj++;") }),
  izbor(5, 10, 3, "Stanje se izmeni pri pokretanju, a prvi render čeka prvi klik. Šta korisnik vidi do klika?", [
    ["A", "Početni HTML, koji ne mora da prati stanje.", true],
    ["B", "Već novo stanje. Ekran prati objekat i bez rendera.", false],
  ], "Prvi prikaz ide čim su podaci spremni, ne tek na klik."),
  ispravka(5, 10, 4, "Posle izmene broja ekran ostaje star. Pozovi render.", "stanje.broj += 1;", "stanje.broj += 1;\nrender(stanje);", "Izmena objekta ne upisuje DOM.", js),

  izbor(5, 11, 1, "Klik zove povecaj, a render se ne zove. Šta ostaje na ekranu?", [
    ["A", "Novi broj. Promena stanja sama crta DOM.", false],
    ["B", "Stari broj, ako nema drugog rendera.", true],
  ], "Događaj i izmena modela nisu upis u DOM.", { ...z, ...kod("dugme.addEventListener(\"click\", () => {\n  povecaj();\n});") }),
  izbor(5, 11, 2, "Handler upisuje temperaturu u jedan element. Drugi element prikazuje isti podatak. Šta fali?", [
    ["A", "Ništa. Jedan upis osveži svaki prikaz tog broja.", false],
    ["B", "Drugi prikaz može da ostane star. Oba treba da čitaju model.", true],
  ], "Direktni upisi se množe sa brojem prikaza."),
  izbor(5, 11, 3, "Temperatura je 30, a maksimum je 30. Ko odbija još jedan plus?", [
    ["A", "render, jer on zna šta sme na ekran.", false],
    ["B", "Funkcija koja menja stanje. render samo pokaže rezultat.", true],
  ], "Pravilo opsega stoji uz izmenu modela, ne u crtanju."),
  ispravka(5, 11, 4, "Posle povecaj nedostaje upis prikaza. Pozovi render.", "dugme.addEventListener(\"click\", () => {\n  povecaj();\n});", "dugme.addEventListener(\"click\", () => {\n  povecaj();\n  render(stanje);\n});", "Handler menja stanje, render upisuje DOM.", js),

  izbor(5, 12, 1, "li.remove() skine karticu, objekat ostaje u nizu, pa render pravi listu iznova. Šta se vidi?", [
    ["A", "Kartica se vrati.", true],
    ["B", "Kartica ostaje obrisana, jer je DOM izvor.", false],
  ], "Niz je izvor. Sledeći render ponovo napravi karticu.", z),
  izbor(5, 12, 2, "Niz a, b, c posle sortiranja postane c, a, b. Klik na drugu karticu treba da menja koji zapis?", [
    ["A", "Zapis sa indeksom 1, zauvek.", false],
    ["B", "Zapis čiji je id na kartici.", true],
  ], "Indeks 1 je trenutna pozicija. Id ostaje isti posle sortiranja."),
  izbor(5, 12, 3, "Zašto listener na listi i replaceChildren dece mogu da ostanu zajedno?", [
    ["A", "Listener je na kontejneru, pa zamena dece ne traži novu registraciju.", true],
    ["B", "replaceChildren briše i listenere predaka.", false],
  ], "Delegiranje drži jedan listener na stabilnom pretku."),
  ispravka(5, 12, 4, "Uklanjanje samo DOM čvora nije dovoljno. Izbaci senzor iz niza, pa ponovo nacrtaj.", "kartica.remove();", "stanje.senzori = stanje.senzori.filter((s) => s.id !== id);\nrender(stanje);", "Ako objekat ostane u nizu, sledeći render vrati karticu.", js),

  izbor(5, 13, 1, "Stavke su {cena:100, kolicina:2} i {cena:50, kolicina:3}. reduce sabira samo cena. Šta je taj zbir, a šta pravi iznos?", [
    ["A", "150, a pravi iznos je 350.", true],
    ["B", "350, jer reduce sam množi količinu.", false],
    ["C", "150, i to jeste pravi iznos.", false],
  ], "Odsustvo izuzetka ne dokazuje formulu. Iznos je cena puta količina."),
  izbor(5, 13, 2, "Niz senzora ima polje aktivan. Da li broj aktivnih treba posebno polje u stanju?", [
    ["A", "Da. Bez posebnog polja broj se ne može znati.", false],
    ["B", "Ne u startu. Broj se računa iz niza.", true],
  ], "Posebna kopija traži da se ne raziđe od niza. Računanje to izbegava dok račun nije skup."),
  izbor(5, 13, 3, "Korisnik je u polju ukucao samo minus. Da li je to već ciljna temperatura uređaja?", [
    ["A", "Da. Svaka izmena polja je potvrđeno stanje.", false],
    ["B", "Ne. To je privremen unos, ne potvrđena vrednost.", true],
  ], "Polje sme da bude nepotpuno dok korisnik kuca."),
  ispravka(5, 13, 4, "Ukupan iznos mora da pomnoži cenu i količinu.", "const ukupno = stavke.reduce((z, s) => z + s.cena, 0);", "const ukupno = stavke.reduce((z, s) => z + s.cena * s.kolicina, 0);", "Suma cena nije suma stavki.", js),

  izbor(5, 14, 1, "setItem dobije objekat, ne string. Šta getItem vrati?", [
    ["A", "Isti objekat, sa poljem temperatura.", false],
    ["B", "String \"[object Object]\".", true],
  ], "localStorage čuva stringove. Objekat ide kroz JSON.stringify.", { ...z, ...kod("localStorage.setItem(\"soba\", { temperatura: 23 });\nlocalStorage.getItem(\"soba\");") }),
  izbor(5, 14, 2, "U skladištu je string \"{pokvareno\". Šta JSON.parse uradi?", [
    ["A", "Vrati null.", false],
    ["B", "Baci izuzetak.", true],
  ], "Pokvaren JSON ne postaje null. try/catch vodi na podrazumevano stanje.", z),
  izbor(5, 14, 3, "JSON.parse vrati { ciljnaTemperatura: -400 }. Da li je vrednost time proverena?", [
    ["A", "Da. Uspešan parse znači ispravan poslovni podatak.", false],
    ["B", "Ne. Parse proverava sintaksu, ne opseg.", true],
  ], "Posle parse-a ide provera oblika i dozvoljenih brojeva."),
  ispravka(5, 14, 4, "Objekat ne sme u setItem kao objekat. Sačuvaj JSON string.", "localStorage.setItem(\"soba\", { temperatura: 23 });", "localStorage.setItem(\"soba\", JSON.stringify({ temperatura: 23 }));", "Bez stringify skladište dobije \"[object Object]\".", js),

  izbor(5, 15, 1, "div ima klasu dugme i click listener. Radi mišem. Šta već nudi pravo button?", [
    ["A", "Fokus i aktiviranje tastaturom, uz ulogu dugmeta.", true],
    ["B", "Ništa više. div sa click-om hvata i Enter.", false],
  ], "Akcija ide na button. Klasa ne dodaje tastaturu."),
  izbor(5, 15, 2, "Na div je dodat aria-label \"Uključi\". Da li je time postao dugme za Space i Enter?", [
    ["A", "Da. aria-label uvodi i ponašanje kontrole.", false],
    ["B", "Ne. Ime nije fokus, uloga ni tastatura.", true],
  ], "ARIA ne zamenjuje element koji već zna da bude dugme.", z),
  izbor(5, 15, 3, "Korisnik piše u polju kartice, a render pozove replaceChildren na celoj listi. Šta može da nestane?", [
    ["A", "Fokus i unos u tom polju.", true],
    ["B", "Ništa. Novi čvorovi nasleđuju fokus starog polja.", false],
  ], "Novi čvor nije polje u kome je korisnik bio."),
  ispravka(5, 15, 4, "Akcija ne sme da bude div. Neka bude dugme koje ne šalje formu.", "<div class=\"dugme\">Uključi</div>", "<button type=\"button\">Uključi</button>", "button dobija fokus i tastaturu. type=\"button\" ga odvaja od submit.", html),

  izbor(5, 16, 1, "Stiže 100 očitavanja u sekundi, a korisnik vidi trenutno stanje. Mora li DOM da se menja 100 puta?", [
    ["A", "Da. Svaki podatak mora odmah na ekran.", false],
    ["B", "Ne. Podaci se mogu obraditi češće nego što se ekran crta.", true],
  ], "Učestalost merenja i učestalost crtanja nisu isti ugovor."),
  izbor(5, 16, 2, "Tri poziva postave 20, pa 21, pa 22, i svi traže isti zakazani render. Šta callback treba da pokaže?", [
    ["A", "20, prvo očitavanje.", false],
    ["B", "22, stanje u trenutku crtanja.", true],
  ], "Jedan render čita model kad se izvrši, ne u trenutku zakazivanja.", kod("novoOcitavanje(20);\nnovoOcitavanje(21);\nnovoOcitavanje(22);")),
  izbor(5, 16, 3, "Brojač se menja samo na klik. Da li requestAnimationFrame nužno pomaže?", [
    ["A", "Ne. Običan render je dovoljan dok merenje ne pokaže problem.", true],
    ["B", "Da. Svaki upis u DOM mora kroz requestAnimationFrame.", false],
  ], "Zakazivanje frame-a nije podrazumevana pobeda za retku izmenu."),
  ispravka(5, 16, 4, "Rani return odbacuje novo očitavanje. Prvo upiši vrednost, pa zakaži jedan render ako već nije zakazan.", "function novo(v) {\n  if (zakazano) return;\n  zakazano = true;\n  stanje.vrednost = v;\n  requestAnimationFrame(crtaj);\n}", "function novo(v) {\n  stanje.vrednost = v;\n  if (zakazano) return;\n  zakazano = true;\n  requestAnimationFrame(crtaj);\n}", "Grupisanje crtanja ne sme da baci poslednji podatak.", js),

  izbor(5, 17, 1, "Log kaže da je handler radio, stanje.temperatura je nova, ekran je star. Gde suziti potragu?", [
    ["A", "Na render, njegov poziv ili element u koji upisuje.", true],
    ["B", "Na registraciju listenera. Handler očigledno nije pozvan.", false],
  ], "Trag je prošao događaj i izmenu. Ostaje put do DOM-a."),
  izbor(5, 17, 2, "Jedan klik poveća brojač za dva. Koja su dva moguća uzroka?", [
    ["A", "Dva listenera ili dva handlera na putu događaja.", true],
    ["B", "click u browseru uvek šalje dva događaja.", false],
  ], "Breakpoint pokazuje da li se akcija zove dvaput."),
  izbor(5, 17, 3, "Posle replaceChildren direktni listener na dugmetu više ne radi. Zašto?", [
    ["A", "addEventListener posle zamene čvorova prestaje da postoji u jeziku.", false],
    ["B", "Listener je bio na starom čvoru. Novi čvor ga nema.", true],
  ], "Delegiranje na stabilnom pretku preživljava zamenu dece.", z),
  ispravka(5, 17, 4, "Kartica nestane, pa se vrati na sledeći render. Ukloni senzor iz modela, ne samo čvor.", "function ukloni(id) {\n  document.querySelector(`[data-id=\"${id}\"]`).remove();\n}", "function ukloni(id) {\n  stanje.senzori = stanje.senzori.filter((s) => s.id !== id);\n  render(stanje);\n}", "Sledeći render crta ono što je ostalo u nizu.", js),
];
