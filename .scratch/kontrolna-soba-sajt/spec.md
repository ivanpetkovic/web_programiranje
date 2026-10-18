Status: ready-for-agent

## Problem Statement

Predavanja iz web programiranja treba da drže pažnju i da pokažu put od ekrana do servera. Slajdovi ostavljaju ventilator kao natpis, a mrežu kao crtež. Nastavnik hoće jedan poznat panel kroz svih deset časova, da u njemu kuca i front i server, i da u DevTools panelu Network vidi pravi protokol kad komunikacija krene.

## Solution

Povezujući primer ostaje Kontrolna soba: jedna prostorija, jedno očitavanje temperature i jedan ventilator. Lopatice se vrte. Željeno stanje šalje browser, režim drži server, ekran crta poslednji odgovor.

Umesto slajdova, sajt časa vodi korak: problem, neoznačeni odgovori, razlozi, pojam koji se otvara u objašnjenje i primer koda. U koraku koji uvodi fajl, editor otvara isečak koji već radi. Nastavnik menja jednu stvar. Front se odmah vidi na ugrađenom panelu. Serverski editor je isti izvor koji izvršava lokalni Node; panel ga pogodi zahtevom. Izmena handlera važi kad se taj proces ponovo učita.

Posle kursa isti fajlovi su jedna aplikacija: prvo samo front, zatim front i Node. Pregledne teme ostaju osvrt uz ovaj panel.

## User Stories

1. Kao nastavnik, hoću sajt časa umesto slajdova, da bih prošao korak i pokazao kako panel reaguje.
2. Kao nastavnik, hoću da čas počne problemom i odgovorima bez označene tačne, da bi studenti birali pre obrazloženja.
3. Kao student, hoću razlog uz svaku opciju kad se izbor otvori, da vidim zašto odgovor drži ili pada.
4. Kao nastavnik, hoću da klik na pojam otvori objašnjenje i primer koda, da reč i kod ostanu zajedno.
5. Kao nastavnik, hoću vidljive animacije panela, da prostorija deluje živo tokom časa.
6. Kao nastavnik, hoću da u editoru na sajtu kucam front, da panel odmah primeni izmenu.
7. Kao nastavnik, hoću da u editoru na istom sajtu kucam server, da handler koji objašnjavam bude onaj koji panel zove.
8. Kao nastavnik, hoću da serverski kod izvršava lokalni Node, da zahtev bude stvaran.
9. Kao nastavnik, hoću da izmena handlera važi posle ponovnog učitavanja tog procesa, da sledeći zahtev koristi novi kod.
10. Kao nastavnik, hoću da editor otvori isečak koji već radi, da menjam jednu stvar umesto da pišem fajl od nule.
11. Kao nastavnik, hoću da fajlovi posle kursa ostanu jedna pokretna aplikacija, da front radi sam, a zatim i sa Node-om.
12. Kao student, hoću jednu prostoriju kroz svih deset časova, da scenario ostane prepoznatljiv.
13. Kao student, hoću jedno očitavanje temperature, da razlikujem prikaz od merenja.
14. Kao student, hoću jedan ventilator čije se lopatice vrte CSS transformacijom, da pokret pokaže transformaciju.
15. Kao student, hoću da se lopatice vrte samo dok je režim uključen, da pokret prati tu jednu činjenicu.
16. Kao nastavnik, hoću komandu željenog stanja kao uključeno ili isključeno, da browser šalje nameru a server odlučuje.
17. Kao nastavnik, hoću dugme „Sledeći korak” dok servera nema, da simulacija napreduje bez tajmera.
18. Kao nastavnik, hoću da lokalna izmena CSS-a i stanja ne pravi red Kontrolne sobe u Network panelu, da se vidi da browser još ne razgovara.
19. Kao nastavnik, hoću da se `GET /api/room` i `PUT` željenog stanja vide u DevTools panelu Network, da protokol bude vidljiv.
20. Kao nastavnik, hoću u koloni Protocol vrednost HTTP/1.1, da ugrađeni Node HTTP bude ono što gledamo.
21. Kao student, hoću u tom redu metod, status, zaglavlja, JSON telo i vreme, da pratim jedan zahtev.
22. Kao nastavnik, hoću na prvom času statičan broj i lopatice u HTML-u i CSS-u, da razdvojim dokument, prikaz i merenje.
23. Kao nastavnik, hoću na drugom času objekat sa temperaturom i režimom, da pokažem ime, referencu i pravilo koraka.
24. Kao nastavnik, hoću na trećem času klik, crtanje i transformaciju, da prikaz ne prati objekat sam od sebe.
25. Kao nastavnik, hoću na četvrtom času `GET /api/room`, da server vrati podatak a browser promeni sopstveni prikaz.
26. Kao nastavnik, hoću na petom času isti zahtev u uspehu, sa statusom 500 i uz ugašen port, da razdvojim odgovor od izostanka odgovora.
27. Kao nastavnik, hoću na šestom času `PUT` željenog stanja i ponovljeni zahtev, da uporedim postavljanje režima i prebacivanje režima.
28. Kao nastavnik, hoću na sedmom času režim i istoriju komandi u PostgreSQL-u, da povezani upisi budu jedna celina.
29. Kao nastavnik, hoću na osmom času vreme očitavanja na istom broju, da zastareo odgovor ne pregazi noviji prikaz.
30. Kao nastavnik, hoću na devetom času uloge posmatrača i operatera nad istom komandom, da ovlašćenje bude odluka servera.
31. Kao nastavnik, hoću na desetom času željeno, serversko i prikazano stanje ventilatora u jednom izostalom odgovoru, da ćutanje ne dokazuje ishod upisa.
32. Kao nastavnik, hoću unapred pripremljene sesije posmatrača i operatera preko cookie-ja, da pokažem autorizaciju bez sistema naloga.
33. Kao student, hoću da server odbije komandu ventilatora posmatraču, da sakriveno dugme nije zaštita.
34. Kao student, hoću da server prihvati istu komandu operateru, da razlika bude uloga.
35. Kao nastavnik, hoću nalog, lozinku i prijavu preko treće strane kao kratak osvrt, da čas ne postane sistem registracije.
36. Kao nastavnik, hoću prag upozorenja kao broj pored temperature, da granica bude podatak a ne novi uređaj.
37. Kao nastavnik, hoću istoriju kao listu već poslatih komandi, da evidencija ostane uz isti ventilator.
38. Kao nastavnik, hoću da pregledne teme ostanu osvrt uz ovaj panel, da kurs ne dobije drugi sistem.
39. Kao student, hoću da posle deset časova prepoznam isti panel, da novi čas menja jedan uslov a ne scenu.

## Implementation Decisions

- Sajt časa je statičan tok. Kontrolna soba je panel ugrađen u taj tok, ne druga aplikacija pored sajta.
- Jedan korak časa nosi problem, odgovore, razloge i pojam. Pojam se otvara u objašnjenje i primer koda.
- Editor u koraku vezan je za jedan fajl. Isečak na otvaranju već radi. Nastavnik menja jednu stvar.
- Redosled fajlova prati časove: HTML panela, CSS lopatica uključujući transformaciju i animaciju, JS stanja i crtanja u browseru, zatim Node.
- Dok servera nema, editor dira samo front. Izmena CSS-a, stanja i crtanja odmah menja ugrađeni panel. „Sledeći korak” pomera temperaturu lokalno.
- Serverski editor ne izvršava kod u browseru. Izvor izvršava lokalni Node. Panel šalje zahtev tom procesu.
- Ugovor panela i servera: čitanje sobe vraća temperaturu i režim; komanda šalje željeno stanje ventilatora, a uspešan odgovor vraća samo režim. Kad čas uvede svežinu, čitanje nosi i trenutak očitavanja. Kad čas uvede uloge, ista komanda zavisi od sesije.
- Protokol koji DevTools treba da pokaže je HTTP/1.1, jer server koristi ugrađeni Node HTTP, bez web framework-a.
- Izmena handlera stupa na snagu kad se Node proces ponovo učita. Sledeći zahtev panela koristi novi handler.
- Do servera sajt crta samo sobu prekidača. Kutija i soba mašina crtaju se tek posle puta od naivnog prenosa do TCP-a i HTTP-a.
- Zahtev se vidi od prekidača do kutije, pa kablom do ventilatora samo ako je priključen. Ako nije, kutija odgovori statusom 500, prekidač može da ostane upaljen, lopatice se ne vrte.
- Kad kutija postoji, ona drži temperaturu. „Sledeći korak” na frontu tada više nije izvor očitavanja. Takt je `setInterval` u tom procesu i kreće tek kad `await` već postoji. Diže temperaturu dok je režim isključen, a spušta je dok je uključen.
- Časovi 1–3 crtaju lokalnu temperaturu na isti sedmosegmentni broj. „Sledeći korak” ga menja kroz crtanje.
- Od časa 4 taj broj je displej. Soba mašina pokazuje živu temperaturu kutije. Displej, dok prvo čitanje ne uspe, pokazuje crte. Uspešno čitanje upisuje cifre i režim na crtež. Posle toga displej čuva poslednje uspelo očitavanje. Uspešan odgovor komande nosi samo režim, pa displej iz njega nema šta da prepiše. Oba broja su Digital-7 Mono (Style-7), uz dozvolu za obrazovnu upotrebu, da razlika bude u tome koji se pomera.
- Dugme „Pročitaj” ostaje i šalje jedno čitanje. Od časa 8 poseban prekidač uključuje periodično čitanje, a „Pročitaj” i dalje šalje jedno. Server push se imenuje kao drugi način i ne uvodi se u primer.
- Sledeći korak na frontu uvećava temperaturu za deltu. Režim ne ulazi u tu računicu.
- Lopatice se prvi put vrte u sobi mašina i pokazuju udaljeni režim, ne položaj prekidača. Trajanje CSS animacije nije drugi režim.
- Elementi panela su jedna prostorija, jedno očitavanje temperature, jedan ventilator, komanda željenog stanja i, pre servera, „Sledeći korak”. Kasnije na isti panel dolaze vreme očitavanja, prag upozorenja, istorija komandi, posmatrač i operater.
- Autorizacija je deo kursa. Server na svakoj komandi gleda ulogu iz pripremljene sesije. Posmatrač sme da čita. Operater sme da menja režim. Nema registracije, lozinke ni prijave preko treće strane.
- Baza, kad stigne, čuva režim i istoriju komandi u PostgreSQL-u. Povezani upisi su jedna celina. Browser ne dobija kredencijale baze.
- Isti fajlovi posle kursa pokreću se kao aplikacija: samo front, zatim front zajedno sa Node-om.
- Front je vanilla HTML, CSS i JS. Pregledne teme se pominju uz panel i ne ulaze u primer kao alat.

## Testing Decisions

Dobar test gleda ponašanje koje nastavnik vidi u browseru. Jedan šav: sajt časa sa ugrađenim panelom, uz lokalni Node kad je korak već uveo server.

Na tom šavu vredi proveriti: pojam se otvori u objašnjenje i kod; izmena fronta promeni lopatice ili temperaturu; pre servera Network nema red Kontrolne sobe; posle servera red ima metod, status i HTTP/1.1; posmatrač na komandi bude odbijen, operater prihvaćen; ponovno učitavanje Node-a pusti izmenjeni handler.

Ne vredi vezati test za unutrašnja imena editora, redosled CSS klasa ni način na koji se animacija implementira, sve dok se lopatice vrte u skladu sa režimom. U repozitorijumu nema postojećeg testa sajta časa; ovaj šav je nov.

## Out of Scope

- Sistem naloga: registracija, lozinka, reset i prijava preko treće strane.
- Mini igra, bodovanje, fizika staklenika i drugi uređaji, uključujući pumpu i drugu prostoriju.
- Izvršavanje serverskog koda unutar browsera.
- Pisanje fajla od prazne stranice tokom časa i studentske vežbe.
- Ugradnja preglednih tema u primer: React, Next.js, Express, GraphQL, Kubernetes, blockchain, napredni TypeScript, microtask kviz, closure sa tajmerom.
- Stvarni hardver, MQTT i drugi protokol osim HTTP ka lokalnom Node procesu.
- Više prostorija, više ventilatora i više istovremenih operatera kao obavezan deo primera.

## Further Notes

Kontrolna soba je već izabrana kao povezujući primer, pre Reaktora i potezne igre. Ovaj dogovor je zadržava i zaoštrava: ventilator se vidi kako se vrti, sajt zamenjuje slajdove, a komunikacija je pravi zahtev čim čas dođe do Node-a.

Jedna prostorija, jedno očitavanje i jedan ventilator dovoljni su za svih deset časova. Kasniji čas dodaje podatak na isti panel. Autorizacija nije izvan kursa; izvan kursa je izrada sistema za prijavu.

Tok svakog časa razrađen je u specifikaciji časova. Ponašanje sajta i editora razrađeno je u specifikaciji interaktivnog sajta. Faze diskusije i cilj svake pitalice razrađeni su u specifikaciji pitalica. Ovaj dokument ostaje zajednički ugovor panela, mreže i uloga.
