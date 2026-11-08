# Kurs

Nastavni okvir predmeta. Tekst tema, koraka i pitalica je `kursevi/web_programiranje/kurs.json`. Ovaj fajl ne ponavlja taj sadržaj.

## Cilj

Student koji već zna objektno programiranje, algoritme i SQL treba da:

- objasni tok korisničke radnje od browsera do servera i baze;
- razlikuje prikaz u browseru od merodavnog stanja;
- obrazloži grešku, izostanak odgovora i ponovljeni zahtev;
- prepozna granicu poverenja: šta sme da se veruje ekranu, a šta mora da proveri server.

JavaScript specifičnosti ne dolaze same od sebe. Poznavanje petlje ne podrazumeva leksički opseg, callback ni asinhronost. Čas ih uvodi kad primer do njih dođe.

Šire teme (okviri, protokoli, isporuka) ostaju orijentacija: koji problem rešavaju i kada postaju relevantne. Konkretno programiranje je na vežbama. Predavanje drži pripremljenu demonstraciju i diskusiju.

## Kako se objašnjava

Jedna nastavna sekvenca ide ovim redom:

1. Poznat scenario, pre nove terminologije.
2. Osnove koje taj scenario traži.
3. Mali primer, sa početnim i završnim stanjem.
4. Pitalica: svako prvo bira odgovor.
5. Obrazloženje svih odgovora, i onih koji ne drže.
6. Promena jednog uslova, pa ponovo isti sud.

Pogrešno obrazloženje se ne prekida odmah. Traži se pretpostavka koja ga drži, pa se proveri primerom. Pitanje ne traži sintaksu koja još nije pokazana.

Jedna duga diskusija pripada celoj temi. Kratke pitalice koraka proveravaju prethodno objašnjeno i ne troše budžet te diskusije. Dokument kursa nosi i ishod teme i tekst pitanja.

## Povezujući primer

Kontrolna soba je jedna aplikacija kojoj se časovi vraćaju. Jedan panel, temperatura i jedan ventilator. Nema stvarnog hardvera.

Crtež ima dve sobe. Soba prekidača je ono što browser prikazuje i postoji pre servera. Soba mašina, u kojoj se ventilator prvi put vidi, crta se tek kad se uvodi server.

Primer raste sa temama. Dok servera nema, panel živi u browseru, u `client/`. Od teme koja uvodi Node, panel sluša `server/server.js`, modul `http`, bez web okvira. Od teme koja uvodi trajno stanje, režim i istorija ostaju u PostgreSQL-u.

Tehnologija primera je vanilla: HTML, CSS i JavaScript u browseru, Node i PostgreSQL u Dockeru. React, Express i Next.js ostaju mapa oblasti. U primeru se ne pišu.

Kucanje u editoru sajta ne menja fajlove na disku. Isti `client/` i `server/` nastavnik prekucava i u svom editoru.
