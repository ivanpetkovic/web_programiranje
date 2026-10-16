# Primarni izvori za analizu redosleda gradiva

Provereno 16. oktobra 2026. Ovo su konkretna ranija izvođenja, a ne tvrdnja o tekućim programima. Redosled na prestižnom univerzitetu nije dokaz da je pedagoški najbolji; koristan je kao poređenje preduslova, tempa i obima.

## MIT web.lab: intenzivni januarski format, 2025.

Zvanični raspored ima četiri nedelje, 6. januar–2. februar. Počinje Gitom, HTML/CSS uvodom i radionicom, pa uvodom u JavaScript 6. januara. Nizovi i callback funkcije dolaze 7. januara, pre Reacta. API-ji i Promise dolaze 8. januara, zatim serveri i Node i radionica dodavanja backenda. Baze slede 9. januara; dodatna obrada Promise/await je 10. januara. Izvor ne pokazuje da se closure sa tajmerima koristi pre uvoda u jezik. [MIT: raspored](https://webdevelopment.mit.edu/schedule/)

Ovo je intenzivni format: predavanja i radionice su u prve dve nedelje, a druge dve služe timskom projektu. FAQ navodi da uspešni timovi često provedu najmanje 40 sati na projektu tokom poslednjih nekoliko nedelja. Zato njegov dnevni tempo nije neposredan model za kurs od 12 nedelja sa manjom nedeljnom satnicom. [MIT: FAQ](https://webdevelopment.mit.edu/faq/)

Godina 2025. potvrđena je eksplicitnim datumima na stranici opisa. Ta stranica ima međusobno neusaglašene rokove, pa za redosled nastave koristimo raspored, a za godinu i strukturu opis. [MIT: opis](https://webdevelopment.mit.edu/about/)

Ograničenje provere: direktno otvaranje MIT stranica vraćalo je grešku; sadržaj je dostupan kroz indeksirani prikaz zvaničnih stranica u pretrazi. Ne tumačimo taj prikaz kao potvrdu programa za 2026.

## Stanford CS193X: Web Programming Fundamentals, proleće 2023.

| Nedelja | Objavljene teme |
|---|---|
| 1 | HTML; uvod u JavaScript, sintaksa i osnovni koncepti |
| 2 | Strukture podataka, klase i moduli; DOM i događaji |
| 3–4 | Forme, DOM, CSS i raspored |
| 5 | `async`/`await`, API, JSON i `fetch`; REST i HTTP zahtev/odgovor |
| 6 | REST i greške; uvod u Node i web servere |
| 7 | Node/Express API, middleware i CORS; baze |
| 8–10 | Organizacija aplikacije, autentifikacija, mobilni prikaz, pristupačnost i završne teme |

Ovaj pregled prikazuje konkretno desetonedeljno izvođenje, uz završni projekat u ispitnoj nedelji. [Stanford CS193X: raspored 2023](https://web.stanford.edu/class/cs193x/lectures.html)

Kurs ne zahteva prethodno web iskustvo, ali očekuje programiranje, algoritme i strukture podataka na nivou CS106B. Naglasak je na standardnom JavaScriptu; cilj uključuje API implementiran u Nodeu. Brzinu uvođenja sintakse zato ne treba preuzeti za potpune početnike u programiranju. [Stanford CS193X: informacije](https://web.stanford.edu/class/cs193x/info.html)

## Stanford CS142: proleće 2023.

Raspored počinje HTML/CSS temama u prvoj nedelji, JavaScript osnovama i programiranjem u drugoj, a DOM-om i događajima u trećoj. React je u četvrtoj. Komunikacija browser/server i web serveri su u petoj, Node/Express i skladištenje u šestoj; sesije i validacija u sedmoj. Ovo je desetonedeljni raspored. [Stanford CS142: predavanja](https://web.stanford.edu/class/cs142/lectures.html)

Projekti prate sled HTML/CSS → JavaScript vežbe → JavaScript i DOM → React → SPA → server i baza → sesije i ulaz → završni razvoj aplikacije. Stranica upozorava da druga polovina zahteva više vremena. [Stanford CS142: projekti](https://web.stanford.edu/class/cs142/projects.html)

Preduslovi CS107 i CS108 predstavljaju očekivanje iskustva sa komandnom linijom, novim jezicima i okvirima, dokumentacijom i otklanjanjem grešaka. Kurs koristi JavaScript u browseru i na serveru; kasniji projekti zavise od prethodnih. To nije kurs bez programerskih preduslova. [Stanford CS142: informacije](https://web.stanford.edu/class/cs142/info.html)

## Predlog izveden iz poređenja

Sledeće je naša preporuka za lokalni kurs, a ne zaključak koji izvori eksperimentalno dokazuju:

- Pre zadatka sa `for` i `setTimeout` obraditi promenljive i `let`/`const`, tipove, uslove, petlje, funkcije, parametre, povratne vrednosti i scope. Zatim uvesti callback i asinhrono izvršavanje na odvojenom primeru; tek potom closure i razliku `var`/`let` kao objašnjen dodatni primer.
- Osnovni niz zavisnosti je JavaScript → DOM i događaji → HTTP/JSON i asinhroni rad → `fetch` → mali Node server → povezivanje fronta i backenda. Kratak konceptualni prikaz HTTP-a može doći ranije; samostalni zadatak mora čekati obrađene preduslove.
- JavaScript na obe strane omogućava jednostavan zajednički primer: browser traži `GET /api/poruka`, Node vraća JSON, browser prikazuje rezultat. Pre baze i autentifikacije dovoljno je stanje u memoriji, uz objašnjenje da nestaje pri restartu.
- Za plan od 12 nedelja obezbediti vreme za vođeni primer, malu izmenu i samostalnu vežbu u svakoj celini. React, baze i autentifikaciju uključiti samo ako satnica i prethodno znanje ostavljaju prostor za ove osnove.
