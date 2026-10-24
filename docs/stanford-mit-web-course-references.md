# Stanford i MIT kao reference za univerzitetski kurs veb programiranja

Provereno 22. oktobra 2026. Ovo su primarni izvori i preporuke izvedene iz poređenja. Stanford stranice ispod prikazuju proleće 2023; MIT 6.1040 prikazuje jesen 2026. Dostupna stranica nije automatski dokaz da se isti program izvodi danas.

## Koje programe porediti

| Referenca | Šta predstavlja | Šta preuzeti kao kriterijum |
|---|---|---|
| Stanford CS193X, proleće 2023. | Osnove razvoja veb aplikacija za studente koji već programiraju | Standardni JavaScript, HTML/CSS, DOM, API, asinhroni rad, trajno čuvanje podataka i samostalni projekat |
| Stanford CS142, proleće 2023. | Širi kurs veb aplikacija sa većim programerskim preduslovima | Integracija slojeva, niz programskih zadataka, bezbednost i kvalitet implementacije |
| MIT 6.1040, jesen 2026. | Napredniji predmet projektovanja softvera kroz veb aplikacije | Modelovanje, modularnost, stvarne potrebe korisnika, provera dizajna, iterativan individualni i timski projekat |
| MIT 6.9620 web.lab, januar 2026. | Uvodni intenzivni laboratorijski predmet | Celovita aplikacija, svakodnevne radionice i samostalan timski rad; obim i tempo razlikuju se od semestralnih predavanja |

Tabela je izbor referenci za lokalni kurs, a ne tvrdnja da su ovi predmeti međusobno ekvivalentni. Dokazi su ispod.

## Stanford: osnove i implementacija

CS193X ne zahteva prethodno veb iskustvo, ali očekuje programiranje, algoritme i strukture podataka na nivou CS106B. Namerno naglašava standardni JavaScript i znanje koje opstaje pri promeni biblioteka. Ishodi obuhvataju semantički HTML, CSS box model i Flexbox, mobilni prikaz i pristupačnost, DOM i događaje, klase i module, `fetch`/`async`, mali REST API u Nodeu i skladištenje podataka. Zadaci traju jednu do dve nedelje; završni projekat ima predlog i međurok. Rad je individualan; funkcionalnost i stil imaju jednaku težinu, a završni projekat nosi 30% ocene. [CS193X: informacije i ocenjivanje](https://web.stanford.edu/class/cs193x/info.html)

Objavljeni raspored uvodi JavaScript u prvoj nedelji, klase/module i DOM/događaje u drugoj, forme/CSS u trećoj i četvrtoj, API/JSON/asinhroni rad u petoj, Node u šestoj, Express i MongoDB u sedmoj. Kasnije slede organizacija aplikacije, autentifikacija, mobilni prikaz i pristupačnost. [CS193X: raspored 2023](https://web.stanford.edu/class/cs193x/lectures.html)

CS142 očekuje CS107/CS108, odnosno iskustvo sa komandnom linijom, dokumentacijom, novim jezicima/okvirima i otklanjanjem grešaka. Koristi MongoDB, Express, React i Node. Ima osam projekata; kasniji zadaci nadograđuju prethodne. [CS142: informacije](https://web.stanford.edu/class/cs142/info.html)

Projekti idu od HTML/CSS i JavaScript vežbi preko DOM-a, Reacta i SPA do servera/baze, sesija/unosa i završnog razvoja aplikacije. Druga polovina zahteva više vremena. [CS142: zadaci 2023](https://web.stanford.edu/class/cs142/projects.html)

Raspored uključuje responzivni dizajn, kolačiće/sesije, validaciju i upravljanje stanjem kroz ceo sistem. Osma nedelja posvećena je izolaciji u pregledaču, mrežnim i sesijskim napadima, ubacivanju koda, phishingu i uskraćivanju usluge. [CS142: raspored 2023](https://web.stanford.edu/class/cs142/lectures.html)

## MIT: projektovanje i dokaz samostalnosti

Zvanični katalog za jesen 2026. navodi 6.1040 Software Design, preduslove 6.1020 i 6.1200, i satnicu 4-0-11. Opis povezuje potrebe korisnika, prototipove, vizuelni dizajn, korisničko testiranje, konceptualno projektovanje i društvene/etičke posledice sa klijentsko-serverskim aplikacijama, reaktivnim interfejsima i bazama. Predviđa individualne i veći timski projekat. [MIT: katalog za jesen 2026](https://student.mit.edu/catalog/m6a.html)

Vodič definiše predmet kao 15-unit kurs treće/četvrte godine. Očekuje specifikacije, interfejse, invarijante i apstrakciju, JavaScript, osnovni Node/Express i matematičko modelovanje. Pored dva predavanja od 80 minuta i vežbi od 50 minuta nedeljno, postoje pripreme i projekti. Prvi projekat je individualan, drugi se radi u četvoročlanim timovima. Alati uključuju GitHub, postavljanje aplikacije, Node/Express, MongoDB i reaktivni frontend; vodič još označava izbor okvira kao privremen. [MIT: vodič 2026](https://61040.github.io/fa26/guide/)

Raspored precizira Vue u tehničkoj pripremi od 8. oktobra. Predavanja obrađuju modularnost, stanje, klijent/server, interakciju, vizuelni dizajn i korisničku evaluaciju; projekti prolaze dizajn, MVP, beta izdanje, postavljanje i korisničko testiranje. Kasniji deo rasporeda planira bezbednost i privatnost. To su planirane teme izvođenja koje je u toku, a ne potvrda da su sve već održane. [MIT: raspored 2026](https://61040.github.io/fa26/schedule/)

Spisak zadataka eksplicitno razdvaja individualne vežbe, lični projekat i završni timski projekat, sa definisanjem problema, dizajnom, izdanjima i testiranjem sa korisnicima. [MIT: zadaci 2026](https://61040.github.io/fa26/assignments/)

MIT upozorava da osnovno programiranje bez sigurnog JavaScripta nije dovoljno za lak prelazak na ovaj predmet. Težište je na projektovanju, uz tehnologije celog veb sistema. [MIT: FAQ 2026](https://61040.github.io/fa26/faq/)

## Posledice za lokalni plan — preporuke autora analize

- Kombinacija treba da znači Stanfordove osnove razvoja plus MIT-ov način projektovanja i dokazivanja znanja. Dodavanje Reacta samo po sebi ne postiže taj cilj; CS193X je korisna referenca upravo bez obaveznog oslanjanja na takav okvir.
- Precizno navesti preduslove lokalnog kursa. Poznavanje funkcija, nizova, objekata i osnovnog otklanjanja grešaka mora biti potvrđeno ili obezbeđeno pripremnim blokom; to se ne može sakriti iza uslova „student univerziteta”.
- Izloženost pojmu, praćenje demonstracije i samostalna implementacija različiti su nivoi ishoda. Ako `kurs.json` opisuje predavanja, laboratorijske vežbe i ocenjivanje mogu biti zasebni dokumenti, ali moraju biti eksplicitno povezani sa svakom nedeljom.
- Zadržati zajednički primer kontrolne sobe, ali zahtevati i samostalan prenos znanja na drugu malu aplikaciju: API, trajno čuvanje, validacija, greške, ovlašćenja i funkcionalan interfejs.
- Za MIT komponentu dodati kratak opis korisničke potrebe, model stanja i odgovornosti modula, pregled dizajna, dva projektna međuroka i testiranje sa korisnikom. Ne zahtevati čitav MIT obim u 11 predavanja od 90 minuta.
- Za Stanford komponentu proveriti da li studenti samostalno izrađuju semantičku i pristupačnu formu, responzivan raspored, DOM obradu događaja, modularan JavaScript, asinhroni API poziv i serverski handler. Sitne demonstracije nisu dovoljan dokaz ovih kompetencija.
- Postojeći naglasak na razlikovanju komande i očitavanja, greškama, ponavljanju zahteva, transakcijama i ovlašćenjima može biti jaka sistemska osnova. Potrebno ga je uravnotežiti korisničkim interfejsom, projektovanjem i ocenjenim samostalnim radom.

## MIT web.lab kao uvodna praktična referenca

Zvanična objava MIT EECS za januar 2026. potvrđuje web.lab kao osnovni predmet od šest jedinica sa ocenjivanjem položio/nije položio. Studenti rade u timovima od jednog do tri člana; prethodno programiranje se preporučuje. Gradivo uključuje verzionisanje, HTML/CSS, JavaScript, React, Node.js, baze, autentifikaciju i WebSockets. Predavanja i radionice traju svakog radnog dana od 11 do 15 časova, 5–16. januara; slede konsultacije, rad na projektu i završni događaj 29. januara. [MIT EECS: IAP 2026, odeljak 6.9620](https://www.eecs.mit.edu/academics/iap-offerings/iap-2026/)

Stariji FAQ navodi dve nedelje predavanja, zatim dve nedelje rada na projektu i najmanje 40 sati projektnog rada kod uspešnih timova. To je istorijski dokaz intenziteta, bez tvrdnje da je taj broj obavezan uslov za svako izvođenje. [MIT web.lab: FAQ](https://webdevelopment.mit.edu/faq/)

Preporuka: za lokalne tehničke ishode kombinovati Stanford CS193X i uvodni MIT web.lab; iz 6.1040 uzeti odabrane projektantske prakse. Ne predstavljati tri različita nivoa i formata kao jedinstven nastavni plan koji staje u 11 susreta.

## Ograničenja izvora

Postojeća beleška [analiza-kursa-izvori.md](analiza-kursa-izvori.md) već opisuje web.lab 2025. Direktno ponovno otvaranje pojedinih starih web.lab stranica nije uspelo, ali pretraga je vratila indeksirani sadržaj zvaničnih stranica. Za izvođenje 2026. ovde se koristi posebna, zvanična objava MIT EECS, pa se stari datumi ne predstavljaju kao tekući.

MIT izvori imaju administrativne nedoslednosti: vodič i FAQ različito opisuju dostupnost snimaka; vodič navodi dva problem seta, a indeks zadataka tri individualne vežbe; nazivi/oznake nekih kasnijih međurokova razlikuju se u rasporedu i indeksu. Za poređenje su korišćeni zajednički, jasno potvrđeni elementi programa, bez preuzimanja tih detalja kao univerzalnog pravila. [Vodič](https://61040.github.io/fa26/guide/), [FAQ](https://61040.github.io/fa26/faq/), [zadaci](https://61040.github.io/fa26/assignments/), [raspored](https://61040.github.io/fa26/schedule/)
