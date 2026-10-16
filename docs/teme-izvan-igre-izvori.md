# Šta mala 2D igra ne pokriva iz uporednih kurseva

Provera: 16. oktobar 2026. Poređenje konkretnih izvođenja: Stanford CS193X i CS142 (2023), MIT web.lab (2025). Ovo nije zahtev da lokalni kurs preuzme sve njihove teme. Klasifikacija pokrivenosti i preporuke u nastavku predstavljaju našu nastavnu procenu.

Polazni primer pri nastanku analize bila je potezna slagalica. Naknadno je izabrana Kontrolna soba; [glavni plan](../web_programiranje_interaktivni_kurs_predlog.md) mapira sve navedene teme na predavanja. Izvori i poređenje ispod ostaju relevantni, dok ocene odnosa prema igri opisuju raniji kandidat.

## Jezgro koje primer prirodno pokriva

HTML/CSS osnove, JS, DOM i događaji, stanje i prikaz, moduli, JSON, asinhronost i `fetch`, HTTP zahtev/odgovor, rute, serverska validacija, trajno čuvanje i sesija. To opisuje predloženi primer, ne tvrdi da su sva ta znanja automatski naučena samim njegovim izvođenjem. SQL je poznat preduslov, pa se objašnjava povezivanje aplikacije sa bazom.

## Potvrđene teme van jezgra ili samo delimično pokrivene

### Stanford CS193X, 2023

Zvanični [raspored predavanja](https://web.stanford.edu/class/cs193x/lectures.html) navodi sledeće oblasti:

| Tema iz rasporeda | Odnos prema igri |
|---|---|
| API za spoljne resurse | Sopstveni API pokriva mehanizam; nezavisni servis traži zaseban primer. |
| Forme, box model, Flexbox, jedinice i pozicioniranje | Delimično; tabla nije dovoljna za širu izradu stranica. |
| Organizacija aplikacije i History API | Organizacija prirodno; URL, navigacija i Back/Forward traže dodatak. |
| Git | Posebna razvojna praksa. |
| Prijava preko treće strane | Osnovna sesija ne objašnjava Google prijavu. |
| Mobilni prikaz, animacije, ikonice | Zahtevaju eksplicitnu demonstraciju. |
| Pristupačnost | Mora se posebno obraditi, čak i kada se koristi isti primer. |
| Express middleware i CORS | Mogu ući u server; jedna ista origin adresa ne demonstrira CORS. |
| MongoDB | Alternativni model skladištenja; PostgreSQL ga ne pokriva. |

Sve su navedene u rasporedu redovnih predavanja; iz toga ne zaključujemo da je svaka obavezni zahtev projekta. React nije posebno naveden u ovom rasporedu.

### Stanford CS142, 2023

Zvanični [raspored predavanja](https://web.stanford.edu/class/cs142/lectures.html) proširuje jezgro ovim temama:

| Tema iz rasporeda | Odnos prema igri |
|---|---|
| React | Van igre napisane standardnim JS-om. |
| SPA | Interakcija bez reload-a jeste početak; navigacija i organizacija više prikaza nisu time objašnjene. |
| Responsive design | Potrebno posebno pokazati. |
| Full stack upravljanje stanjem | Delimično: server i browser imaju kopije stanja; širi obrasci ostaju dodatak. |
| Browser isolation; mrežni i sesijski napadi; injection, phishing, DoS | Validacija poteza i sesija pokrivaju mali deo bezbednosti. |
| Aplikacije velikog obima i data centri | Van male lokalne aplikacije. |

Ovo su redovne nastavne jedinice. Raspored sam ne daje dovoljno detalja za izjednačavanje svake teme sa obaveznim projektnim ishodom.

### MIT web.lab, 2025

Zvanični [raspored](https://webdevelopment.mit.edu/schedule/) sadrži: React i hooks, router/context, UI/Figma, napredni CSS/biblioteke, Git i saradnju, debugging, accounts/auth, sockets, TypeScript, igre, Next.js/serverless, LLM radionicu i deployment. Vanilla JS potezna igra sama ne pokriva React, alate za dizajn, timski rad, TS, sockets, Next.js, LLM i objavljivanje; auth i debugging obuhvata samo delimično. Raspored eksplicitno razlikuje sponzorska/gostujuća predavanja; ne označava ostale napredne teme kao obavezne ili izborne. Direktno otvaranje vratilo je 502; korišćen je indeksirani sadržaj zvanične stranice.

[Pravila projekta](https://webdevelopment.mit.edu/about/) izričito zahtevaju naloge, sadržaj iz baze, dinamičku interakciju i GitHub/verzionisanje. Spoljni API je jedna od mogućnosti, a ne univerzalni zahtev. Prisustvo napredne teme u rasporedu nije dokaz da svaki projekat mora da je koristi.

## Šta ne treba pripisivati izvorima

U pregledanim rasporedima nema izričite nastavne jedinice za blockchain ili Docker, niti jasno imenovanog bloka automatizovanog testiranja. To nije dokaz da se nigde u materijalima ne pominju. Debugging nije isto što i automatizovano testiranje. MIT navodi sockets, pa bez provere radionice ne treba tvrditi da je reč o detaljnoj obradi samog WebSocket protokola.

## Preporuka za 18 sati predavanja

Potvrđen zahtev korisnika: sve navedene teme kratko predstaviti na predavanjima, bez detaljne obrade. Odvojiti kratke primere za pristupačnost i prilagođavanje ekranu; bezbednost vezati za ulaz, sesiju i ovlašćenje. Prikazati osnovni deployment i objasniti razliku lokalno/javno. History/URL može se pokazati odvojenim primerom. React, sockets/multiplayer, Next.js, širi cloud i LLM pomenuti kroz svrhu i mali scenario; framework-i se ne koriste u aplikaciji. Osnovni TS može biti kratka naknadna anotacija poznatog modela; ne treba odlagati HTTP zbog njega. Blockchain ima zaseban konceptualni blok i nema potvrđeno uporište u ovim rasporedima. Predlog povezivanja svih preglednih tema je u [razradi Reaktora i Kontrolne sobe](reaktor-i-kontrolna-soba.md).
