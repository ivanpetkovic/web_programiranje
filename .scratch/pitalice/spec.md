Status: ready-for-agent

## Problem Statement

Pitalica lako postane kviz koji odmah označi tačan odgovor. Nastavnik onda izgubi mesto na kome grupa bira, poredi razloge i čuje pogrešnu pretpostavku pre pečata. Treba da bude jasno gde se diskusija vodi i šta svaka pitalica treba da izvuče na sto.

## Solution

Diskusija se vodi na glavnoj pitalici sajta časa, pred ugrađenom Kontrolnom sobom. Razgovor je u učionici. Sajt drži pitanje, neoznačene opcije, izbor, zabeležene pretpostavke i, tek posle zajedničke analize, razlog svake opcije.

Jedan čas ima jednu glavnu pitalicu. Njoj pripada ceo budžet razgovora. Rezervna pitalica stoji zatvorena dok nastavnik ne odluči da je glavna razjašnjena. Osvrt, editor i rekapitulacija ne otvaraju novu diskusiju.

Panel pored pitalice služi kao kontraprimer: pretpostavka se proverava na njemu, ne u novom scenariju.

## User Stories

1. Kao nastavnik, hoću da diskusija stoji na bloku pitalice, odmah uz panel, da grupa gleda jedno pitanje i jedan staklenik.
2. Kao student, hoću da opcije na početku nemaju pečat, da izbor bude moj pre tuđeg razloga.
3. Kao student, hoću da prvo odgovorim sam, da par čuje moj razlog a ne obrnuti redosled.
4. Kao nastavnik, hoću da sajt pamti izbor dok razlozi još nisu otvoreni, da glasanje ne otkrije šta drži.
5. Kao nastavnik, hoću mesto za pretpostavke koje čujem, uključujući pogrešne, da ostanu na tabli dok ih ne proverimo.
6. Kao nastavnik, hoću da pogrešno obrazloženje ostane na tabli dok ga panel ne proveri, da ga ne prekinem rečenicom „netačno”.
7. Kao nastavnik, hoću da razloge svih opcija otvorim jednom radnjom, tek kad analiza krene, da nijedna opcija ne ostane bez zašto.
8. Kao student, hoću da posle razloga ponovo biram, da drugi izbor stoji pored prvog.
9. Kao student, hoću da svojim rečima preformulišem zaključak na sajtu, da pečat ne zameni rečenicu grupe.
10. Kao nastavnik, hoću rezervnu pitalicu zatvorenu dok je ne otvorim, da druga tema ne pojede glavnu.
11. Kao nastavnik, hoću da rezervu ostavim zatvorenom i ostanem na istoj ideji, kad glavna još nije razjašnjena.
12. Kao nastavnik, hoću da osvrt nema izbor ni pečat, da pregledna tema ne postane druga diskusija.
13. Kao nastavnik, hoću da editor služi kao provera pretpostavke, a da se razgovor i dalje vodi na pitalici.
14. Kao nastavnik, hoću poslednjih par minuta izlazno pitanje, odvojeno od glavne pitalice, da čujem šta je ostalo nejasno.
15. Kao nastavnik, hoću da sledeći čas može da počne nerazjašnjenom pitalicom prethodnog, uz kraći rezervni primer.
16. Kao student, hoću da na času 1 sporimo da li je „10 °C” u alatima merenje, dokument ili prikaz, i da osvežavanje vrati 24.
17. Kao student, hoću da na času 1 rezerva ostane na pitanju da li stranica ostaje prazna bez CSS-a, tek ako je prikaz naspram merenja već jasan.
18. Kao student, hoću da na času 2 sporimo šta `const` brani i šta druga promenljiva vidi, na jednom objektu temperature.
19. Kao student, hoću da na času 3 sporimo da li objekat sam menja tekst, pa da izostanak crtanja ostavi ekran star.
20. Kao student, hoću da na času 3 rezerva razdvoji funkciju koja čeka klik od poziva koji se desi odmah.
21. Kao student, hoću da na času 4 sporimo šta Node sme da uradi dugmetu, pa da handler koji zove DOM ne uspe.
22. Kao student, hoću da na času 4 rezerva uporedi 404 i ugašen port u Network panelu.
23. Kao student, hoću da na času 5 sporimo da li 500 ulazi u `catch`, uz odgovor koji postoji i status koji nije uspeh.
24. Kao student, hoću da na času 5 rezerva proveri drugi klik dok prvi zahtev još čeka.
25. Kao student, hoću da na času 6 sporimo koju komandu smemo da ponovimo, tako što istu pošaljemo dvaput.
26. Kao student, hoću da na času 6 rezerva pošalje telo koje forma ne nudi, da server i dalje proverava ulaz.
27. Kao student, hoću da na času 7 sporimo da li je evidencija pouzdana kad režim jeste upisan a istorija nije.
28. Kao student, hoću da na času 7 rezerva odbije ideju da browser dobije kredencijale baze.
29. Kao student, hoću da na času 8 sporimo da li 24 °C staro deset minuta jeste sadašnja temperatura.
30. Kao student, hoću da na času 8 rezerva uporedi svežinu ikonice i svežinu očitavanja.
31. Kao student, hoću da na času 9 sporimo da li sakriveno dugme štiti server, pa da zahtev mimo ekrana i dalje stigne.
32. Kao student, hoću da na času 9 rezerva razdvoji „JS ne čita telo” od „server ćuti”.
33. Kao student, hoću da na času 10 sporimo šta sme da se kaže kad ekran kaže „uključeno” a odgovor nije stigao.
34. Kao nastavnik, hoću da na času 10 rezervu o tipu i asistentu ostavim u osvrtu, bez drugog glasanja, ako glavna diskusija potroši vreme.
35. Kao student, hoću da na izlazu zapišem gde je pravo, gde je stanje i šta ćutanje ne dokazuje, bez nove četiri opcije.

## Implementation Decisions

Diskusija ima jedno mesto: blok glavne pitalice na koraku časa, uz panel. Par i cela grupa govore u učionici, gledajući taj blok. Sajt ne zamenjuje razgovor foruma ni ćaskanjem.

Faze glavne pitalice, tim redom, i samo nastavnik prelazi dalje:

1. Izbor. Opcije su vidljive, pečata nema. Student bira jednu. Izbor sme da stoji na njegovom ekranu bez otkrivanja ostalima.
2. Poređenje. Sajt i dalje ćuti o tome šta drži. Parovi porede razloge uživo.
3. Pretpostavke. Nastavnik upisuje rečenice koje je čuo, i one koje ne drže. Upis ne otvara pečat.
4. Analiza. Jedna radnja otvara razlog svake opcije i pečat. Panel izvodi kontraprimer vezan za tu pitalicu.
5. Ponovni izbor. Student bira opet. Prvi i drugi izbor ostaju vidljivi nastavniku. Grupa upisuje jednu zajedničku rečenicu zaključka.
6. Rezerva ili ostanak. Nastavnik ili otvara rezervnu pitalicu, ili ostaje na istoj ideji i ponavlja kontraprimer. Rezerva kreće od faze izbora, kraće, istim pravilima.

Budžet od 35 minuta pripada celom času i ovoj jednoj diskusiji, ne svakoj pitalici i ne osvrtu. Sajt nema tajmer koji gura nastavnika. Poslednji deo časa je izlazno pitanje: slobodan upis, bez opcija i bez pečata.

Osvrt nema faze izbora. Editor menja panel dok traje faza pretpostavki ili analize, ali razlozi se ne otvaraju sami od izmene koda.

Pogrešna pretpostavka ostaje zapisana posle pečata, da se vidi šta je panel opovrgnuo.

Ako grupa iz prethodnog časa izađe bez zaključka, sledeći čas sme da otvori tu istu glavnu pitalicu pre novog gradiva. Rezervni primer tog novog časa se tada skraćuje; sajt i dalje ima obe pitalice, nastavnik bira da rezervu ne otvori.

### Gde koji čas vodi razgovor

Svaka stavka je glavna pitalica, pretpostavka koju vredi sačuvati, i kontraprimer na panelu. Rezerva je navedena da bi ostala zatvorena dok glavna ne padne.

- Čas 1. Glavna: „24 °C” u alatima postaje „10 °C”. Vodi se o tome da li je dirao merenje, dokument ili prikaz. Pretpostavka koju treba čuti: ekran jeste stanje staklenika. Kontraprimer: osvežavanje vraća 24. Rezerva: HTML stigao, CSS nije; vodi se o tome da sadržaj može ostati bez izgleda.
- Čas 2. Glavna: `const` drži objekat, druga promenljiva pokazuje na njega. Vodi se o imenu naspram polja i o kopiji naspram reference. Pretpostavka: `const` zamrzava objekat, ili drugo ime pravi kopiju. Kontraprimer: izmena temperature kroz jedno ime vidi se kroz drugo, a nova dodela imena ne prolazi. Rezerva: strogo poređenje teksta i broja temperature.
- Čas 3. Glavna: da li izmena objekta sama menja broj na stranici. Vodi se o crtanju kao posebnom koraku. Pretpostavka: objekat ili `const` sami osvežavaju DOM. Kontraprimer: bez poziva crtanja ekran ostaje star. Rezerva: listener dobija funkciju ili rezultat poziva; vodi se o trenutku poziva, ne o novom događaju.
- Čas 4. Glavna: šta Node sme da uradi dugmetu. Vodi se o tome čiji je DOM. Pretpostavka: server vidi isti dokument, ili 404 i ugašen port jesu isto. Kontraprimer: poziv DOM-a u handleru ne menja dugme; poznata putanja vraća JSON, a browser tek onda crta. Rezerva: 404 naspram izostanka statusa, u Network panelu.
- Čas 5. Glavna: `fetch` je dobio 500. Vodi se o odgovoru naspram izuzetka. Pretpostavka: svaki neuspeh je `catch`, ili 500 znači da odgovora nema. Kontraprimer: status postoji, uspeh se čita iz njega; drugi klik za vreme čekanja i dalje radi. Rezerva: čekanje ne blokira browser. Ako je to već palo u glavnoj, rezerva se ne otvara.
- Čas 6. Glavna: koja se komanda sme ponoviti. Vodi se o smislu, ne o statusu 200. Pretpostavka: prebacivanje je bezbednije jer „vraća nazad”, ili forma garantuje telo. Kontraprimer: dva slanja prebacivanja menjaju ishod, dva slanja „uključeno” ostavljaju isti željeni efekat. Rezerva: telo mimo forme, tekst umesto boolean vrednosti.
- Čas 7. Glavna: režim je upisan, istorija nije. Vodi se o tome da li je evidencija cela. Pretpostavka: bitno stanje je sačuvano pa je istorija sporedna, ili kontejner sam čuva oba upisa. Kontraprimer: celina ili upiše oba ili ne upiše nijedan; restart Node-a ne spaja odvojene upite. Rezerva: kredencijali baze ne idu u browser.
- Čas 8. Glavna: na panelu piše 24 °C, očitavanje je staro deset minuta. Vodi se o poslednjem poznatom naspram sadašnjeg. Pretpostavka: broj na ekranu jeste sadašnja temperatura, ili stariji odgovor sme da pregazi noviji. Kontraprimer: prikaz starosti; stariji trenutak merenja ne menja noviji broj kad je provera uključena. Rezerva: ikonica i temperatura ne dele rok svežine.
- Čas 9. Glavna: posmatrač nema dugme „Uključi”. Vodi se o tome gde je granica poverenja. Pretpostavka: ko ne vidi dugme, ne može da pošalje komandu, ili CORS dokazuje korisnika. Kontraprimer: ista komanda mimo ekrana, posmatrač odbijen, operater primljen. Rezerva: alat van browsera čita telo koje JS drugog origin-a ne mora da sme.
- Čas 10. Glavna: ekran kaže „uključeno”, odgovor nije stigao. Vodi se o tri stanja i o smislu ponavljanja. Pretpostavka: ćutanje znači da upis nije prošao, ili ekran znači da jeste. Kontraprimer: log i ponovno čitanje; ponovljeno prebacivanje može da poništi upis, ponovljeno postavljanje na uključeno ostavlja isti željeni efekat. Rezerva o tipu i asistentu nema glasanje ako je glavna potrošila razgovor; ostaje rečenica u osvrtu. Izlaz: gde se proverava pravo, gde stoji stanje, šta ćutanje ne dokazuje.

## Testing Decisions

Jedan šav ostaje sajt časa u browseru. Za diskusiju se gleda blok pitalice, ne editor.

Vredi proveriti da pečat ne postoji u fazi izbora i u fazi pretpostavki; da zapis pogrešne pretpostavke ne otvara razloge; da analiza otvori razlog svake opcije glavne pitalice; da rezerva nije vidljiva pre nastavnikove radnje; da osvrt nema opcije; da kontraprimer časa 1 vrati 24 posle osvežavanja, a časa 9 odbije posmatrača. Ponovni izbor ne briše prvi.

Ne vredi meriti minute ni broj studenata koji su govorili. To ostaje u učionici.

## Out of Scope

- Automatsko bodovanje izbora i rang lista.
- Forum, ćaskanje i obaveza da svaki student govori pred celom grupom.
- Nova pitalica po svakoj preglednoj temi.
- Tajmer koji zatvara fazu.
- Druga diskusija u editoru ili u osvrtu.
- Otkrivanje pečata čim prvi student izabere.

## Further Notes

Tekst opcija i tačan zaključak stoje u specifikaciji časova. Ovde je redosled razgovora i mesto na kome se on vodi: glavna pitalica uz panel. Rezerva je ventil, ne drugi čas.
