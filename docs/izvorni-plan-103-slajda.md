# Web programiranje: interaktivni kurs (12 nedelja)

**Status:** Predlog sadržaja i didaktičkog pristupa pre izrade konačne prezentacije.  
**Struktura:** 103 planirana slajda, u tri tematske celine, uz predloge za unapređenje.  
**Cilj:** Razvijanje kritičkog razmišljanja, razumevanje temeljnih koncepata i problema koji su doveli do nastanka web tehnologija.

## Pedagoški koncept

Predavanja nisu zamišljena kao monolog ni kao vodič koji studenti mogu samostalno pročitati. Svaka složenija tema kreće od problema, bez unapred otkrivenog naziva tehnologije ili rešenja.

**Osnovna sekvenca:**

1. **Problem** – profesor postavlja pitanje ili konkretan scenario.
2. **Predlozi i diskusija** – studenti biraju ili osmišljavaju mogućnosti, uz obrazloženje.
3. **Komplikacija** – profesor uvodi ograničenje ili režim otkaza kojim testira rešenja.
4. **Otkrivanje** – postepeno se predstavlja postojeće rešenje, koncept ili tehnologija.
5. **Primena** – novi problem u kojem studenti moraju da primene naučeno.

Kod pitalica prvo prikazati sve opcije, saslušati glasanje i argumente, pa redom objasniti zašto je svaka opcija tačna, pogrešna ili zavisi od uslova. Otkrivanje odgovora predvideti po koracima, animacijama ili odvojenim *reveal* slajdovima.

## Raspored

| Celina | Nedelje | Fokus |
|---|---:|---|
| I. Web aplikacije | 1–6 | Kako i zašto Web funkcioniše; komunikacija, arhitektura, infrastruktura, sigurnost |
| II. JavaScript | 7–9 | Jezički model, prototipovi, izvršavanje i asinhronost |
| III. TypeScript | 10–12 | Modelovanje stanja i ugovora, generici i transformacije tipova |

---

# I. Web aplikacije

## Nedelja 1 — Od nastanka Interneta do učitavanja web stranice

**Cilj:** Razumeti razliku između Interneta i Weba i korake od URL-a do prikazane stranice.

### Slajd 1. Web programiranje: razmišljanje pre sintakse

- Web nije samo HTML + CSS + JavaScript: on je složen distribuirani sistem.
- Važno je razumeti koji problem određena tehnologija rešava.
- Počinjemo problemom, a ne definicijom.

### Slajd 2. Kako će izgledati predavanja?

- Profesor postavlja problem bez predstavljanja rešenja.
- Studenti predlažu pristupe i obrazlažu ih.
- Uvodimo dodatna ograničenja i tražimo slabosti rešenja.
- Tek zatim otkrivamo odgovarajuću tehnologiju.

### Slajd 3. Mapa kursa

- Web kao infrastruktura i arhitektura.
- JavaScript kao jezik i model izvršavanja.
- TypeScript kao sistem statičke provere tipova.
- Prikaz međusobne veze tri celine.

### Slajd 4. Šta zapravo treba da naučimo?

- Zašto mrežni zahtevi mogu da zakažu?
- Zašto postoje različite arhitekture web aplikacija?
- Zašto JavaScript ima event loop?
- Koje greške TypeScript može, a koje ne može da spreči?

### Slajd 5. Ulaz u oblast: Web kao sistem

**Vizuelno:** Browser → Internet → web server → aplikacija → baza podataka.

**Pitanje:** Koliko različitih sistema učestvuje u otvaranju jedne obične stranice?

### Slajd 6. Pitalica: Ko zna gde je server?

Korisnik ukuca `https://shop.example`.

- A. Browser zna IP adrese svih sajtova.
- B. DNS sistem pronalazi odgovarajuću adresu.
- C. HTTP server šalje svoju IP adresu.
- D. Ruter pronalazi server po domenskom imenu.

**Tok:** Glasanje → obrazloženja → otkrivanje B → diskusija o DNS kešu i otkazima.

### Slajd 7. Kako radi DNS?

- Razlika između domenskog imena i IP adrese.
- DNS resolver i keširanje.
- Šta ako se IP adresa servera promeni?
- Zašto DNS može da zakaže i kada aplikacija radi?

### Slajd 8. Kratka istorija: Kako je nastao Web?

**Animirana vremenska linija:**

- ARPANET i umrežavanje udaljenih računara.
- TCP/IP i interoperabilnost mreža.
- Tim Berners-Lee; WWW, URL, HTTP i HTML.
- JavaScript i interaktivnost.
- AJAX i aplikacije bez potpunog osvežavanja stranice.
- Cloud, SPA i savremeni Web.

**Pitanje:** Ako je Internet već postojao, koji problem je Web rešio?

### Slajd 9. Šta se dešava kada unesemo URL?

**Postepeno otkrivanje:** URL → DNS → mrežna veza → TLS → HTTP → odgovor → parsiranje → prikaz.

**Pitanje za svaki korak:** Šta bi korisnik video da ovaj korak zakaže?

### Slajd 10. Pitalica: Internet ili Web?

- Da li su Internet i Web isto?
- Navesti internet usluge koje nisu WWW.
- Odvojiti infrastrukturu od aplikacione usluge.

### Slajd 11. Internet nije Web

- Internet je infrastruktura povezanih mreža.
- Web koristi tu infrastrukturu i odgovarajuće protokole.
- E-mail, SSH i druge usluge mogu raditi bez Weba.

### Slajd 12. Rekonstrukcija jednog web zahteva

**Zadatak:** Studenti samostalno objašnjavaju put od unosa URL-a do prikaza stranice, uz mesta mogućih grešaka.

## Nedelja 2 — Prenos podataka, TCP, UDP i HTTP

**Cilj:** Da studenti postupno dođu do mehanizama pouzdanog prenosa podataka i razumeju slojeve protokola.

### Slajd 13. Problem: Kako preneti 1 GB između dva računara?

Dva udaljena računara povezana su nepouzdanom mrežom.

- A. Pošaljemo sve kao jedan ogroman paket.
- B. Delimo podatke na manje delove.
- C. Šaljemo svaki deo deset puta.
- D. Šaljemo jedan po jedan bajt.

**Pitanje:** Šta ako neki deo nestane? Ne otkrivati unapred TCP.

### Slajd 14. Šta ako paketi nestaju ili stižu pogrešnim redosledom?

**Postepeno otkrivanje:**

- Segmentacija podataka.
- Redni brojevi.
- Potvrde prijema.
- Ponovno slanje izgubljenog.
- Kontrola protoka i kontrola zagušenja.

**Zaključak:** TCP pruža pouzdan tok bajtova. Posebno objasniti da **TCP segmentacija i IP fragmentacija nisu isto**.

### Slajd 15. Slojevi mrežne komunikacije

**Vizuelno:** Ethernet/Wi-Fi → IP → TCP ili UDP → TLS/QUIC (u odgovarajućim granama steka) → HTTP.

- Svaki sloj rešava drugi problem.
- Ne mešati transportne protokole sa aplikacionim.

### Slajd 16. Zašto se HTTP menjao?

- HTTP/1.1: trajne veze i ograničenja pri većem broju zahteva.
- HTTP/2: multiplexing i kompresija zaglavlja.
- HTTP/3: QUIC, nezavisni tokovi i ponašanje pri gubitku paketa.

**Pitanje:** Zašto HTTP/3 ako HTTP/2 već podržava više tokova?

### Slajd 17. Pitalica: Da li su HTTP i UDP konkurenti?

- A. Da, oba rešavaju istu vrstu komunikacije.
- B. HTTP/3 koristi QUIC, a QUIC koristi UDP.
- C. UDP garantuje pouzdanu isporuku.
- D. HTTP upravlja IP rutiranjem.

### Slajd 18. Kako se odnose TCP, UDP, QUIC i HTTP?

- UDP: datagrami bez ugrađene garancije isporuke.
- TCP: pouzdan uređeni tok bajtova.
- QUIC: transportni protokol izgrađen nad UDP-om, sa pouzdanim tokovima i drugim mehanizmima.
- HTTP: aplikaciona semantika zahteva i odgovora.

**Otkrivanje:** Objasniti zašto je odgovor B tačan, a ostali nisu.

### Slajd 19. Izazov: Šta ako prenos stane na 92%?

- Kako nastaviti prekinut prenos?
- Razlika između TCP retransmisije u aktivnoj vezi i nastavka fajl-transfera na aplikacionom nivou.
- Primer HTTP Range za preuzimanje i resumable upload pristupa za slanje.

## Nedelja 3 — Browser, HTML, CSS, JavaScript i formati podataka

**Cilj:** Razumeti kako browser pretvara dokumente i podatke u interaktivnu aplikaciju.

### Slajd 20. Šta je potrebno da se prikaže web stranica?

**Problem:** Imamo tekst, slike, raspored elemenata i dugme koje reaguje na klik. Kako raspodeliti odgovornosti?

### Slajd 21. Razdvajanje strukture, izgleda i ponašanja

- HTML: struktura i semantika.
- CSS: izgled i raspored.
- JavaScript: ponašanje i interakcije.
- Razdvajanje odgovornosti i održavanje.

### Slajd 22. Kako browser renderuje stranicu?

- HTML → DOM.
- CSS → CSSOM.
- Render tree, layout, paint i compositing.
- JavaScript i izmene DOM-a.

**Pitanje:** Zašto nekontrolisane promene DOM-a mogu biti spore?

### Slajd 23. Kako razmenjujemo strukturisane podatke?

- JSON: strukturisani podaci, čest u web API-jima.
- XML: markup sa atributima, namespace-ovima i šemama.
- HTML: markup za dokumente sa browser semantikom.
- Uporediti male primere istog sadržaja.

### Slajd 24. Pitalica: JSON ili XML?

**Scenario:** Partner zahteva stroge šeme, namespace-ove i kompatibilnost sa postojećim enterprise sistemima. Šta bi studenti izabrali i zašto?

### Slajd 25. Kada XML i dalje ima prednosti?

- XSD i formalizovana validacija.
- Namespaces.
- Postojeći industrijski standardi.
- Dokumentno orijentisani podaci.

**Zaključak:** Ni JSON ni XML nisu univerzalno bolji.

### Slajd 26. Web aplikacija i mobilna aplikacija: šta je zajedničko?

- Browser i native runtime.
- Zajednički backend/API.
- Različiti UI i sistemske mogućnosti.
- PWA, service workers i offline režim.
- Kompromisi oko distribucije.

### Slajd 27. Završni zadatak: Skicirati browser aplikaciju

**Zadatak:** Nacrtati komponente uključene u prikaz podataka i promenu podataka nakon klika.

## Nedelja 4 — Web servisi, REST i HTTP semantika

**Cilj:** Razumeti API dizajn kroz posledice odluka, umesto pukog učenja HTTP metoda.

### Slajd 28. Problem: Kako promeniti e-mail adresu korisnika?

Mogući API-ji:

- `POST /changeEmail`
- `PUT /users/42`
- `PATCH /users/42`

**Pitanje:** Koji izabrati i pod kojim uslovima?

### Slajd 29. Šta kada klijent ponovi isti zahtev?

- POST, PUT i PATCH semantika.
- Idempotentnost.
- Retry i dupliranje operacija.
- Veza dizajna API-ja i ponašanja klijenta.

### Slajd 30. Šta je web servis?

- SOAP.
- REST API.
- RPC/gRPC.
- GraphQL.

**Diskusija:** Koji problem svaki pristup pokušava da reši?

### Slajd 31. REST nije samo JSON preko HTTP-a

- Resursi i identifikatori.
- HTTP metode i semantika.
- Stateless komunikacija.
- Keširanje.
- Status kodovi i reprezentacije resursa.

### Slajd 32. Pitalica: Može li REST servis imati bazu podataka?

**Pitanje:** Da li baza automatski znači da servis nije *stateless*?

### Slajd 33. Stateless ne znači da sistem nema stanje

- Stanje domena naspram stanja klijentske sesije u obradi zahteva.
- Zašto stateless zahtevi olakšavaju skaliranje.
- Kako se identitet i neophodan kontekst prenose kroz zahtev.

### Slajd 34. Zašto nam trebaju HTTP status kodovi?

- 2xx: uspeh.
- 4xx: problem sa zahtevom, pristupom ili resursom.
- 5xx: serverska greška.
- Posebno: 200/201/204, 400/401/403/404/409/500.

### Slajd 35. API design challenge

**Zadatak:** Dizajnirati API za biblioteku sa knjigama, korisnicima i pozajmicama. Obrazložiti metode, URL-ove, statuse i ponavljanje zahteva.

## Nedelja 5 — Arhitekture web aplikacija i cloud

**Cilj:** Razumeti gde se izvršava logika, kako se aplikacija isporučuje i skalira.

### Slajd 36. Gde treba generisati korisnički interfejs?

**Scenario:** Javni marketinški sajt naspram složenog korisničkog dashboard-a.

**Pitanje:** Da li je optimalno koristiti istu arhitekturu?

### Slajd 37. Zašto ne postoji najbolja arhitektura za sve?

- Prvi prikaz.
- SEO i indeksiranje.
- Interaktivnost.
- Opterećenje servera.
- Održavanje i složenost.

### Slajd 38. MPA, SPA, SSR, CSR, SSG i hibridni pristup

- Prikazati tok zahteva za svaki pristup.
- Odvojiti arhitekturu navigacije (MPA/SPA) od načina renderovanja (SSR/CSR/SSG).

**Pitanje:** Kada je SPA lošiji izbor od klasičnog server-rendered sajta?

### Slajd 39. Ko stoji između browsera i servera?

- Forward proxy.
- Reverse proxy.
- Load balancer.
- IaaS, PaaS, SaaS i FaaS.

**Napomena:** Odvojiti mrežne posrednike od cloud servisnih modela.

### Slajd 40. Pitalica: Ko koga zastupa?

Komponenta prima javni saobraćaj, završava TLS i prosleđuje zahteve internim servisima. Da li je forward ili reverse proxy?

### Slajd 41. Reverse i forward proxy

- Forward proxy radi u ime klijenta.
- Reverse proxy stoji ispred servera.
- Routing, TLS termination, load balancing, cache.
- Primer sa Nginx-om.

### Slajd 42. Zašto ne treba svaki zahtev da stigne do servera?

- Browser cache.
- CDN/edge cache.
- Application cache.
- Latencija i skaliranje.
- Invalidacija keša.

**Pitanje:** Šta ako korisnik vidi staru cenu proizvoda?

### Slajd 43. Arhitektonski zadatak: 10 ili 100.000 korisnika

**Zadatak:** Predložiti evoluciju jednog servera u distribuiran sistem, uz obrazloženje ograničenja i troškova.

## Nedelja 6 — Deployment, virtualizacija, kontejneri i sigurnost

**Cilj:** Razumeti prelazak u produkciju i osnovne mehanizme zaštite i dijagnostike.

### Slajd 44. Problem: Radi na mom računaru, ali ne i na serveru

**Pitanje:** Kako obezbediti ponovljivo izvršno okruženje?

### Slajd 45. Container image kao prenosiv artefakt

- Aplikacija i zavisnosti.
- Image i container.
- Ponovljiv deployment.
- Dokumentovanje zavisnosti naspram njihovog pakovanja.

### Slajd 46. VM, kontejner, Docker i Kubernetes

- VM virtualizuje hardver i ima sopstveni operativni sistem.
- Kontejner izoluje procese i deli kernel hosta.
- Docker: alati za slike i kontejnere.
- Kubernetes: orkestracija kontejnera.

**Pitanje:** Zašto Kubernetes nije potreban svakoj aplikaciji?

### Slajd 47. Četiri različita bezbednosna pitanja

- Ko je korisnik? Authentication.
- Šta sme da uradi? Authorization.
- Da li je komunikacija zaštićena? TLS/HTTPS.
- Da li aplikacija ima ranjivosti? XSS, CSRF, SQL injection, SSRF.

### Slajd 48. Pitalica: Uspešan login, zabranjena operacija

**Scenario:** Prijavljen korisnik pozove `DELETE /users/42`.

**Pitanje:** Koji mehanizam treba da spreči nedozvoljenu akciju?

### Slajd 49. Authentication i authorization nisu isto

- Identitet nije pravo pristupa.
- Pravo zavisi i od konkretnog resursa.
- Ne smeju se čitati tuđi podaci samo zato što je korisnik prijavljen.
- Server proverava prava nezavisno od UI-ja.

### Slajd 50. Kako saznati zašto produkcija ne radi?

- Logs: šta se dogodilo.
- Metrics: koliko često, koliko sporo.
- Distributed tracing: tok zahteva kroz servise.

### Slajd 51. Završni scenario: Sistem je spor, a korisnici prijavljuju greške

**Zadatak:** Predložiti redosled provera: DNS, TLS, proxy, aplikacija, baza, cache, metrike.

---

# II. JavaScript

## Nedelja 7 — Osnove jezika, scope, closures i mutabilnost

**Cilj:** Razumeti model izvršavanja jezika, a ne samo sintaksu.

### Slajd 52. JavaScript nije samo skriptni jezik za browser

- Izvršava se u različitim okruženjima.
- Funkcije su vrednosti.
- Dinamički sistem tipova.
- Leksički opseg i objekti.

### Slajd 53. Pitalica: Šta će ispisati ovaj kod?

```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
```

**Zadatak:** Predvideti izlaz pre pokretanja.

### Slajd 54. Zašto dobijamo 3, 3, 3?

- Function scope i block scope.
- `var`, `let`, `const`.
- Closure zadržava pristup binding-u.
- Nova promenljiva po iteraciji petlje sa `let`.

### Slajd 55. Scope i closures kao mentalni model

- Leksički scope.
- Closure.
- Funkcije kao vrednosti.
- Callback, enkapsulacija i factory funkcije.

### Slajd 56. Pitalica: `==` ili `===`?

- Implicitna konverzija tipova.
- Predvidljivost izraza.
- Kratki primeri neočekivanih rezultata.

### Slajd 57. Kada implicitna konverzija postaje problem?

- Loose naspram strict equality.
- Zašto je `===` dobar podrazumevani izbor.
- Kada `==` može imati smislenu upotrebu.
- Poređenje objekata po referenci.

### Slajd 58. Da li `const` znači immutable?

- Promenljiva deklarisana `const` može referencirati promenljiv objekat.
- Binding naspram sadržaja objekta.
- `Object.freeze`.
- Plitka i duboka nepromenljivost.

### Slajd 59. Mini izazov: Predvidi ponašanje koda

**Zadatak:** Nekoliko kratkih primera koji kombinuju scope, closure, equality i reference. Obrazložiti predviđanja.

## Nedelja 8 — Objekti, prototipovi, ES6 klase i moduli

**Cilj:** Razumeti prototipski model i pravila vezivanja `this`.

### Slajd 60. Problem: Funkcija je izgubila `this`

```js
const f = user.printName;
f();
```

**Pitanje:** Zašto rezultat može biti drugačiji nego pri `user.printName()`?

### Slajd 61. `this` zavisi od načina poziva

- Poziv metode.
- Običan funkcijski poziv.
- `call`, `apply`, `bind`.
- Leksički `this` kod arrow funkcije.

### Slajd 62. Kako JavaScript objekti pronalaze svojstva?

**Animacija:** Prototype chain.

- Own properties.
- Prototype lookup.
- `Object.prototype`.
- Kraj lanca.

### Slajd 63. Kako `this` funkcioniše?

- Metode i izdvojene funkcije.
- Callback i arrow funkcije.
- ES moduli `import` / `export` za organizovanje koda.

### Slajd 64. Pitalica: Da li su ES6 klase zamenile prototipove?

**Pitanje:** Gde je metoda instance klase? Odgovore prikazati pre objašnjenja.

### Slajd 65. ES6 klase koriste prototipski model

- `class` sintaksa.
- `constructor`.
- `extends`, `super`.
- Metode na prototipu.
- Razlike od običnih constructor funkcija.

### Slajd 66. Nasleđivanje ili kompozicija?

- *Is-a* odnosi.
- Kompozicija objekata i funkcija.
- Problemi dubokih hijerarhija.
- Uloga modula.

### Slajd 67. Izazov: Dizajn malog sistema bez framework-a

**Zadatak:** Modelovati ponašanje izborom između klasa, kompozicije i modula i obrazložiti pristup.

## Nedelja 9 — Event loop, asinhronost i mrežna komunikacija

**Cilj:** Razumeti redosled izvršavanja, Promise i obradu neuspeha.

### Slajd 68. Pitalica: Kojim redosledom se ispisuje?

```js
console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("D");
```

**Zadatak:** Glasanje između mogućih redosleda.

### Slajd 69. Zašto je odgovor A, D, C, B?

- Sinhroni kod završava prvi.
- Promise callback je microtask.
- Timer callback je task.
- `setTimeout(..., 0)` ne znači trenutno izvršavanje.

### Slajd 70. Animacija JavaScript event loop-a

**Komponente:** Call stack, Web APIs / runtime, task queue, microtask queue i event loop.

**Interakcija:** Studenti raspoređuju korake i predviđaju sledeću operaciju.

### Slajd 71. Od callback-a do async/await

- Callback-based API.
- Promise.
- `.then`, `.catch`, `.finally`.
- `async/await`.
- Obrada grešaka.

### Slajd 72. Pitalica: Da li async znači paralelno?

```js
await loadA();
await loadB();
```

**Pitanje:** Da li se pozivi pokreću istovremeno?

### Slajd 73. Sekvencijalno i konkurentno izvršavanje

- Kada se pokreće drugi poziv.
- `Promise.all`.
- `Promise.allSettled`.
- Konkurentnost naspram paralelizma.
- Kada jedan zahtev zakaže.

### Slajd 74. Šta ako HTTP zahtev nikada ne završi?

- Timeout.
- `AbortController`.
- Retry.
- Partial failure.
- Idempotentnost zahteva.

**Povezati** sa REST-om iz četvrte nedelje.

### Slajd 75. Završni problem: Pet servisa, jedan UI

**Zadatak:** Dizajnirati učitavanje iz pet servisa, loading/error stanja i otkazivanje nepotrebnih zahteva.

---

# III. TypeScript

## Nedelja 10 — Sistemi tipova i modeliranje stanja

**Cilj:** Razumeti šta statički tipovi garantuju, a šta ne.

### Slajd 76. Zašto TypeScript?

- Mnoge JavaScript greške inače otkrivamo tek pri izvršavanju.
- TypeScript proverava ograničen model programa pre izvršavanja.
- Tipovi izražavaju nameru i ugovore.

### Slajd 77. Pitalica: Da li `as User` proverava API odgovor?

```ts
const user = await response.json() as User;
```

**Pitanje:** Da li ovo dokazuje da je server poslao ispravan objekat?

### Slajd 78. Type assertion nije validacija

- `as` menja način na koji compiler tretira vrednost.
- Ne proverava stvarne podatke.
- Za spoljne podatke potrebna je runtime validacija.

### Slajd 79. TypeScript se izvršava kao JavaScript

- Type checking.
- Kompajliranje/transpilacija.
- Type erasure.
- Compile-time naspram runtime provera.

### Slajd 80. Osnovni alati TypeScript-a

- Inference.
- Union types.
- Narrowing.
- Structural typing.
- `unknown`, `any`, `never`.

### Slajd 81. Pitalica: `any` ili `unknown`?

**Scenario:** Primamo podatke iz nepouzdanog spoljnog sistema.

**Pitanje:** Koji tip zahteva proveru pre upotrebe?

### Slajd 82. Zašto je `unknown` bezbedniji?

- `any` zaobilazi proveru tipova.
- `unknown` zahteva narrowing.
- Type guards.
- Runtime validacija JSON podataka.

### Slajd 83. Kako tipom zabraniti nemoguća stanja?

```ts
type State =
  | { status: "loading" }
  | { status: "success"; data: User }
  | { status: "error"; error: Error };
```

- Discriminated unions.
- Exhaustiveness checking.
- Prednost u odnosu na više nezavisnih booleana.

### Slajd 84. Izazov: Modelujte UI bez kontradiktornih stanja

**Zadatak:** Tipizirati učitavanje, uspeh, neuspeh i ponovno pokušavanje operacije.

## Nedelja 11 — Generics i mapirani tipovi

**Cilj:** Razumeti kako tipovi mogu da opisuju odnose i transformacije.

### Slajd 85. Problem: Kako napisati type-safe `get`?

```ts
get(user, "name")
```

**Pitanje:** Kako obezbediti da polje postoji i da povratna vrednost ima odgovarajući tip?

### Slajd 86. Zašto `string` i `any` nisu dovoljno dobri?

- Gubitak informacija o tipu.
- `keyof`.
- Indexed access types.
- Veza između ulaznog i izlaznog tipa.

### Slajd 87. Generics kao mehanizam čuvanja odnosa

```ts
function get<T, K extends keyof T>(
  obj: T,
  key: K
): T[K] {
  return obj[key];
}
```

**Zadatak:** Objasniti svaku komponentu deklaracije.

### Slajd 88. Kako transformisati postojeći tip?

```ts
type Flags<T> = {
  [K in keyof T]: boolean
};
```

- `keyof`.
- `[K in ...]`.
- `T[K]`.
- `optional` / `readonly` modifikatori.

### Slajd 89. Pitalica: Šta proizvodi `Flags<User>`?

Studenti predviđaju rezultat za konkretan `User` interfejs.

### Slajd 90. Kako rade mapped types?

**Animacija:** Za svako svojstvo izvornog tipa generiše se novo svojstvo.

**Teza:** Menja se tip, ne runtime objekat.

### Slajd 91. Utility types

- `Partial<T>`.
- `Required<T>`.
- `Readonly<T>`.
- `Pick<T, K>`.
- `Omit<T, K>`.
- `Record<K, V>`.

**Fokus:** Razumeti princip njihove implementacije, ne memorisati nazive.

### Slajd 92. Izazov: Dizajnirajte tipizirani API klijent

**Zadatak:** Izvesti tipove zahteva i odgovora iz modela resursa.

## Nedelja 12 — Napredni TypeScript, arhitektura i budućnost Weba

**Cilj:** Povezati napredne tipove i arhitektonsko rasuđivanje.

### Slajd 93. Problem: Možemo li generisati tip iz drugog tipa?

**Primer:** Nazivi događaja `click`, `focus` → `onClick`, `onFocus`.

### Slajd 94. Template literal types

- Transformacije string literal tipova.
- Kombinovanje tipova u nove nazive.
- Primeri za nazive događaja.

### Slajd 95. Conditional types i napredna transformacija tipova

- `T extends U ? X : Y`.
- `infer`.
- Template literal types.
- Primeri: događaji, rute, API ugovori.
- Kada napredni tipovi postaju prekomplikovani.

### Slajd 96. Završni sistemski izazov

**Scenario:** Web i mobilna aplikacija za zajedničko uređivanje beleški.

**Timovi odlučuju:**

- Arhitektura.
- API stil.
- Authentication i authorization.
- Deployment.
- Cache.
- Skaliranje.
- Komunikacija u realnom vremenu.

### Slajd 97. Pitalica: Da li nam treba blockchain?

**Scenario:** Jedna kompanija poseduje aplikaciju, bazu i infrastrukturu, ali želi pouzdanu evidenciju promena.

**Pitanje:** Koje rešenje je opravdano?

### Slajd 98. Kada blockchain ima, a kada nema smisla?

- Decentralizovano poverenje.
- Više nezavisnih strana.
- Trošak distribuiranog konsenzusa.
- Baza + audit log kao alternativa kod centralnog operatora.

### Slajd 99. Kako AI menja web development?

- Generisanje koda.
- Testovi.
- Specifikacije.
- Code review.
- Bezbednosni rizici.
- Promena uloge programera.

### Slajd 100. Pitalica: AI je napisao kod koji se kompajlira. Da li je ispravan?

**Zadatak:** Objasniti šta kompajliranje zaista dokazuje i koje vrste grešaka ostaju.

### Slajd 101. Zašto kompajliranje nije dokaz ispravnosti?

- Type checker ne garantuje poslovnu korektnost.
- Runtime podaci mogu biti pogrešni.
- Bezbednosne ranjivosti mogu ostati.
- Testovi i arhitektonsko razumevanje su i dalje potrebni.

### Slajd 102. Šta treba da ostane nakon kursa?

Student bi trebalo da ume da:

- Identifikuje problem pre izbora tehnologije.
- Objasni zašto rešenje funkcioniše.
- Predvidi važne režime otkaza.
- Uporedi arhitektonske kompromise.
- Kritički proverava kod, uključujući AI-generisan.

### Slajd 103. Literatura i dokumentacija

- MDN Web Docs.
- RFC dokumenti za HTTP i relevantne protokole.
- OWASP.
- ECMAScript specifikacija.
- TypeScript Handbook.
- Zvanična dokumentacija relevantnih tehnologija.

---

# Šta bih promenio pre konačne prezentacije

Prethodna struktura daje osnovu, ali nije konačan raspored. Posebno treba rasteretiti 6. i 12. nedelju i razviti duže problemske sekvence.

## 1. Teme koje treba dodatno obraditi

| Tema | Pitanje koje otvara problem | Prioritet |
|---|---|---|
| Cookies, sessions, JWT | Kako server zna da smo i dalje prijavljeni? | Visok |
| Same-origin policy i CORS | Zašto browser blokira zahtev koji `curl` može da pošalje? | Visok |
| HTTP headers, body, content negotiation | Kako server zna šta mu šaljemo i šta klijent prihvata? | Visok |
| TLS i sertifikati | Kako znamo da pričamo sa pravim serverom? | Visok |
| WebSocket, SSE, polling | Kako server obaveštava browser da se nešto promenilo? | Visok |
| Baze i transakcije | Šta ako dva korisnika istovremeno menjaju isti podatak? | Visok |
| Browser storage i service workers | Kako aplikacija radi kada nema Interneta? | Srednji |
| CI/CD i testiranje | Kako bezbedno isporučivati promene više puta dnevno? | Visok |
| JavaScript DOM događaji i delegacija | Kako obraditi klik na hiljadu elemenata? | Srednji |
| TypeScript `satisfies` i `as const` | Kako proveriti ugovor bez nepotrebnog proširivanja tipova? | Srednji |

## 2. Rasteretiti pretrpane nedelje

- **Nedelja 6:** VM, Docker, Kubernetes, bezbednost i observability zaslužuju više prostora nego što trenutno imaju.
- **Nedelja 12:** Napredni TypeScript, blockchain, AI i završni arhitektonski izazov teško staju u jednu nedelju.
- **Predlog:** Blockchain i AI prebaciti u kraće problemske diskusije prve celine; završnu nedelju osloboditi za integracioni zadatak.

## 3. Duži problemi, više otkrivanja: primer prenos velikog fajla

Jedan scenario razviti kroz šest uzastopnih koraka umesto jedne definicije TCP-a.

| Korak | Pitanje studentima | Koncept koji se otkriva |
|---|---|---|
| 1. Prenos 1 GB | Kako biste poslali podatke između dva računara? | Ograničenje veličine jedinica prenosa; podela toka na manje delove |
| 2. Nedostaje deo | Od 1.000 delova stiglo je 998. Kako znamo koji nedostaju? | Redni brojevi, potvrde i retransmisija |
| 3. Pogrešan redosled | Deo 7 stiže pre dela 6. Odbaciti ili sačuvati? | Baferovanje i rekonstrukcija redosleda |
| 4. Spor primalac | Pošiljalac šalje brže nego što primalac obrađuje. | Kontrola protoka |
| 5. Zagušenje mreže | Milion pošiljalaca šalje istovremeno. Da li ubrzavati slanje? | Kontrola zagušenja |
| 6. Veza puca na 92% | Da li mora da se krene od početka? | Razlika transportne pouzdanosti i nastavka prenosa na aplikacionom nivou |

**Ključna didaktička poenta:** Tek na kraju imenovati TCP kao protokol koji integriše većinu prethodno izvedenih mehanizama. Poslednji korak dodatno pokazuje problem koji sam TCP ne rešava nakon gubitka veze.

## 4. Manje pitanja sa očiglednim odgovorima

Umesto faktografskih kvizova sa jednim očigledno tačnim i tri apsurdna odgovora, koristiti pitanja sa više razumno odbranjivih opcija.

**Primer:** „Imamo 10.000 korisnika. Da li jedan server može biti dovoljan?”

Studenti moraju da zatraže ili procene:

- Učestalost i intenzitet zahteva.
- Složenost obrade.
- Performanse baze podataka.
- Keširanje.
- Zahteve za raspoloživost.
- Troškove i operativnu složenost.

**Poenta:** Odgovor zavisi od uslova; važniji je argument nego pogodak.

## 5. Jedna aplikacija kao povezujući primer

Kroz 12 nedelja postepeno razvijati **sistem za rezervacije**:

1. Browser i jedan server.
2. HTTP i API.
3. Baza i konkurentne izmene rezervacija.
4. Authentication, sessions i authorization.
5. Arhitektura aplikacije, cache i skaliranje.
6. Deployment, sigurnost i monitoring.
7. JavaScript klijent i događaji.
8. Objekti, prototipovi i organizacija koda.
9. Asinhrona komunikacija i obrada neuspeha.
10. Tipizirani modeli stanja.
11. Generički API klijent i mapped types.
12. Integraciona arhitektonska vežba i revizija odluka.

## 6. Predlog za konačnu strukturu

Zadržati **12 nedelja i tri tematske celine**, ali pre konačne prezentacije grupisati sadržaj u **25–30 većih problemskih scenarija**, od kojih svaki sadrži nekoliko slajdova:

1. Pitanje, bez rešenja.
2. Odgovori ili alternative za razmatranje.
3. Nova komplikacija / režim otkaza.
4. Postepeno otkrivanje koncepta.
5. Primena na zajedničkoj aplikaciji.

Cilj nije da studenti zapamte spisak tehnologija, već da umeju da objasne **zašto tehnologije postoje, šta rešavaju, koje pretpostavke imaju i u kojim slučajevima podbacuju**.
