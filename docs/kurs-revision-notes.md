# Pet prolaza revizije kursa

Status: beleška lokalne revizije od 22. oktobra 2026. Pun tekst od 112 koraka nije spojen u `main`. U `main` su ušli pojmovni ispravci, raspored tačnih odgovora, 70 minuta koraka i 20 minuta diskusije, i editor koji podrazumevano otvara Lekciju. Naslovi nedelja i redosled koraka ostaju oni iz `site/kurs.json` na `main`.



Primenjeno 22. oktobra 2026. Polazna analiza je u [auditu](kurs-audit-plan.md), a univerzitetske reference u [belešci o izvorima](stanford-mit-web-course-references.md). `site/kurs.json` je važeći sadržaj kursa; [glavni plan](../web_programiranje_interaktivni_kurs_predlog.md) i [README](../README.md) opisuju isti okvir.

## Uključena korisnička dopuna

Predavanja uključuju kucanje koda. Sajt je i studentski playground za samostalno menjanje uslova, posmatranje rezultata i oporavak posle greške. Konkretno programiranje više nije opisano kao aktivnost isključivo na vežbama.

Zadržano je 11 časova kako bi redosled odgovarao postojećem otključavanju serverskog panela, takta, baze, svežine i uloga. Svaki čas ima 70 minuta koraka sa objašnjenjem, kucanjem, kratkim proverama i eksperimentima, plus 20 minuta glavne diskusije. Rezervno pitanje koristi isti budžet diskusije. Vreme pojedinačnih koraka varira prema složenosti.

## 1. Tačnost pojmova i pitanja

Ispravljene su granice izvornog HTML-a, živog DOM-a i prikaza; definicije closure-a, callback-a i const-a; odnosi TCP/UDP i odluke aplikacije; parsiranje naspram validacije JSON-a; zbir reduce-a naspram proseka cele funkcije; idempotentnost nameravanog efekta naspram pomoćnog loga; autentifikacija, autorizacija i nastavne sesije.

Izostanak odgovora ostaje nepoznat ishod. Ponovno čitanje pokazuje trenutno stanje, ali pri konkurentnim komandama ne dokazuje koja ga je pojedinačna komanda proizvela. Vreme simuliranog odgovora jasno se razlikuje od vremena fizičkog uzorkovanja.

Pitanja o pečatima, glasanju i instrukcijama asistentu zamenjena su pitanjima o sistemu i novom domenu. Svako pitanje ima jedan označen odgovor i objašnjenje obe opcije. Među 112 kratkih pitanja tačan odgovor je 60 puta A i 52 puta B; raspored nije prosto naizmeničan.

## 2. Obim i vreme

Istorija je svedena na uvod unutar prvog časa; ostatak tog časa obrađuje potrebu korisnika, odgovornosti, model stanja i invarijantu. HTML/CSS sada uključuje označenu formu, Flexbox, prelamanje, media query i vidljiv fokus.

Ponovljena pitanja o pravilima ventilatora ustupila su prostor modulima, konkurentnosti, granicama cache-a, testovima, konfiguraciji, isporuci i korisničkom testiranju. Ukupan obim je 990 minuta (16 sati i 30 minuta). Praktični obim Stanford/MIT referenci i dalje uključuje samostalan rad koji ne treba poistovećivati sa satnicom predavanja.

## 3. Preduslovi i kod u playground-u

Funkcije, argumenti i povratne vrednosti prethode funkciji kao vrednosti i callback-u. Leksički opseg dolazi pre closure-a, metod i this pre klase, a Promise pre async/await i fetch-a. Prvi serverski zahtev posmatra se direktnim otvaranjem URL-a.

Svaki korak koji menja fajl ima kompletan snimak `original`, uz mali isečak `delic`. Time se izbegavaju duple deklaracije i izvršavanje delova koji nisu ceo program. HTML eksplicitno učitava skripte; ručno povezan dokument ne dobija dodatne skrivene handler-e. Pre DOM časa stanje iz konzole ne crta se automatski.

HTTP poruke, dijagrami, adrese, komande terminala, TypeScript i samostalni kod prikazuju se kao označeni primeri bez putanje. Ne postaju sadržaj fajla. Node server na portu 3000 i završni test imaju uputstva za zasebnu lokalnu kopiju. Koraci nude konkretne eksperimente kroz polje `probaj`; editor kursa omogućava uređivanje tih instrukcija i budžeta diskusije.

Serverski playground koristi lokalni proces i njegove fajlove. README sada izričito objašnjava da svaki student treba svoju kopiju projekta i server, dok više browsera nad istim serverom deli serversko stanje. Ovo je postojeće ponašanje, a ne nov sistem izolovanih serverskih sesija.

## 4. Projektovanje i prenos znanja

Primer rezervacije mesta pojavljuje se od prvog časa, zatim uz ponavljanje komandi i na kraju kursa. Pretraga sa dva upita služi kao drugi primer trke odgovora. Završni zadatak povezuje korisnika, pravilo, API, konkurentni zahtev, test neuspeha i nalaz korisničkog testiranja.

Stanford komponentu čine platformske osnove i postepeno povezivanje aplikacije. MIT komponentu čine potreba korisnika, model i invarijanta, odgovornosti modula, odbrana odluke i provera sa drugim korisnikom. React i drugi alati objašnjeni su kroz svrhu; glavna aplikacija ostaje vanilla.

## 5. Jezik i dokumentacija

Objašnjenja su na srpskoj latinici, uz definisanje zadržanih engleskih termina. Ispravljene su gramatičke greške i mešanje temperature sa koordinatom grafikona. `cookie` i `cache` ostaju u skladu sa pojmovnikom; `credential baze` zamenjeno je opisom „pristupni podaci za bazu”.

README, glavni plan i dopuna postojeće odluke usklađeni su na 11 časova i učešće studenata u kucanju koda. Audit je označen kao dokument pre implementacije, kako stari nalazi ne bi bili predstavljeni kao trenutno stanje.

## Provera

Kompletna komanda `node --test --test-timeout=45000 test/*.test.js test/*.test.mjs` prolazi: **101 test, 0 neuspeha i 0 preskočenih**.

Provere obuhvataju:

- izvršavanje svih klijentskih snimaka sa zavisnostima i sintaksu serverskih snimaka;
- jedan handler i jednu deltu po kliku, bez automatskog crtanja u ranijem JS času;
- HTTP, mrežni i neispravan podatak, kao i kasni odgovor prethodnog zahteva;
- polling stop/start tokom nezavršenog zahteva, bez oživljavanja stare petlje;
- odbijanje neispravne komande bez promene režima i povlačenje transakcije posle neuspeha drugog upita;
- pravi browser: izbor fajla, primena izmene, čuvanje radne verzije pri promeni fajla i reset na snimak;
- postojeći HTTP/SQL integracioni ugovor, uz privremeni PostgreSQL 16 bez korišćenja projektnog volumena;
- zbir vremena, strukturu pitanja, raznovrsnost odgovora i učitavanje/uređivanje kursa.

Popravljene su i dve pretpostavke testnog okruženja: dodate su putanje browsera na macOS-u i razdvojeni portovi dva HTTP testa. Pojedinačni testovi koji su zahtevali tačne stare naslove ili instrukcije zamenjeni su proverama novog nastavnog ugovora i ponašanja snimaka.

Ostaje nastavna provera: probno održavanje ranog i kasnog časa treba da potvrdi procenu vremena za kucanje. Potpuna samostalna implementacija i formalno ocenjivanje zahtevaju povezivanje sa stvarnim laboratorijskim zadacima. Javno postavljanje aplikacije prati se na unapred pripremljenom okruženju; ova revizija ne objavljuje sajt.

## Dopuna: početak rada u editoru

Editor podrazumevano otvara „Lekcija”, samo za čitanje. Prvi klik na „Moj kod” kopira sve dostupne fajlove izabranog koraka u lokalno sačuvano radno stanje. Naredni klikovi vraćaju taj rad umesto ponovnog kopiranja lekcije. Prelazak između koraka, fajlova i kartica čuva izabrani prikaz.

Kada naredni korak uvede novi fajl, on se dodaje prazan u radno stanje, čak i ako je trenutno otvorena Lekcija. Prazan ili namerno obrisan radni fajl ne zamenjuje se sadržajem lekcije. Osvežavanje stranice ponovo bira Lekciju, a sačuvani rad ostaje dostupan preko „Moj kod”. Reset ostaje eksplicitno vraćanje samo odabranog fajla na snimak koraka.

Regresione provere obuhvataju kopiranje celog stanja na prvom izboru, čuvanje novih praznih fajlova, prelazak između prikaza i opstanak izmena posle osvežavanja u pravom browseru.
