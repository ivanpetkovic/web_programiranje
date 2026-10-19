# Tasks

## 1. Original koraka u dokumentu

- [ ] 1.1 U `site/js/lectures.js` prosledi `original` sa koraka. Kad polja nema, original je `delic`. Proveri učitavanjem modula: korak sa `original` vraća taj tekst, korak bez njega vraća `delic`.
- [ ] 1.2 U `site/kurs.json` preimenuj prvi korak nedelje 1 u Podela, stavi preduslov da browser učitava `client/` a `server/` još nema fajlove, i poredaj korake: Podela, Stranica, Glava, Telo, Naslov, Broj, Dugme, Veza, Razmak, Okvir, Osvežavanje, Alati, Dva zahteva, Soba prekidača, Semantika. Svaki od tih koraka dobija `original` koji je ceo fajl posle koraka, a Podela je `client/` i `server/`. Nedelje 2–10 ne dobijaju novo polje. Ažuriraj `test/koraci.test.mjs` i pokreni `node --test test/koraci.test.mjs`.

## 2. Gradivo, hod i odgovori

- [ ] 2.1 Tab, pomoć i pretraga kažu Gradivo umesto Koraci. Kratka provera je jedna kolona i na širokoj strani. Prethodni i sledeći korak stoje u traci koraka, sa žutom pozadinom `#ffb000`, tamnim mastilom i strelicama. Dugme temperature na panelu nema tu pozadinu. Proveri čitanjem `site/index.html`, `site/css/site.css` i `site/js/main.js` u testu, uključujući kontrast žute podloge i tamnog mastila od najmanje 4.5:1.

## 3. Editor bez upisa na disk

- [ ] 3.1 Ubaci CodeMirror 6 u `site/vendor/codemirror/` i import mapu u `site/index.html`. Ne dodaji skriptu za izgradnju u `package.json`. Proveri da vendor fajlovi postoje i da `package.json` i dalje nema korak izgradnje sajta.
- [ ] 3.2 Izvezi čistu razliku linija: zeleno je dodato, crveno obrisano, prema originalu poslednjeg ranijeg koraka istog fajla. Prvi original fajla je sav zelen i nema crvenih linija. Radna verzija se ne poredi. Test pokriva ta tri slučaja.
- [ ] 3.3 Zameni `textarea` editorom. Original je samo za čitanje i nosi razliku, brojeve linija i bojenje. Radna verzija je jedna po putanji u `localStorage` pod ključem `radnaVerzija`, deli se kroz korake i vraća se posle učitavanja. Promena koraka otvara fajl koraka i, ako radna verzija postoji, ostavlja nju na ekranu. Dugme pored putanje menja prikaz, ne briše mapu, i nosi olovku ili list sa natpisom „Prikaži original” ili „Prikaži radnu verziju”. Tab Server je sakriven u nedeljama 1–3. Kod puni širinu od stabla do trake. Sačuvaj i Povrati nestaju, a kucanje ne šalje upis fajla. Proveri čistim funkcijama za izbor teksta i vidljivost taba Server, i testom koji čita `site/index.html` i `site/js/main.js` da nema dugmadi za upis na disk.

## 4. Pregled prati bafer

- [ ] 4.1 Prikazani `client/index.html` menja sobu prekidača, a prikazani `client/css/soba.css` menja stil, bez upisa na disk i bez učitavanja stranice. Bafer koji baci ostavlja poslednji ispravan crtež i rečenicu da delić nije primenjen. Tekst iz `server/` ne pokreće rukovalac i ne menja izvor procesa. Proveri da primena klijentskog bafera ne zove čuvanje fajla, i da serverski tekst ne ulazi u crtanje sobe.

## Workflow follow-up

- Arhiviraj izmenu kad zadaci prođu i delte su usklađene sa glavnim specifikacijama.
