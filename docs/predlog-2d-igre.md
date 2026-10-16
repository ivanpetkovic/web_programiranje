# Predlog povezujuće aplikacije: 2D igra

Status: arhiva ranijih kandidata. Izabrana je Kontrolna soba; videti [razradu](reaktor-i-kontrolna-soba.md) i [važeći plan](../web_programiranje_interaktivni_kurs_predlog.md). Okvir je 12 predavanja po 90 minuta, bez planiranja vežbi, uz PostgreSQL u Dockeru.

Naknadno preciziranje: cilj je demonstracija koncepata, pitalice i obrazloženje odluka. Aplikacija daje poznat kontekst; njeno pisanje radi se na vežbama. Koriste se vanilla JS i Node.js bez framework-a. Sve identifikovane teme van primera kratko se predstavljaju. Detaljno poređenje druga dva kandidata je u [Reaktor i Kontrolna soba](reaktor-i-kontrolna-soba.md); preporuka „Poslednji signal” ispod predstavlja raniji predlog, a izbor ostaje otvoren.

## Preporuka: „Poslednji signal”

Mala potezna 2D igra u kojoj robot na oštećenoj svemirskoj stanici uzima energetsku ćeliju i nosi je do komunikacionog terminala. Tabla je mala matrica sa podom, zidovima, ćelijom, robotom i terminalom. Jedna komanda pomera robota za jedno polje; zid blokira potez; ulazak na ćeliju znači preuzimanje; terminal završava igru samo ako robot nosi ćeliju. Osnovna verzija ima jedan unapred zadat nivo.

Tema daje karakter jednostavnim pravilima bez potrebe za izradom grafičkog pogona. Tabla se prikazuje običnim DOM elementima i CSS Grid rasporedom; dugmad za smer su dovoljan početni unos. Tastatura može doći kasnije. Canvas, animaciona petlja, fizika, AI i generisanje lavirinta nisu preduslovi. Nije potrebna pretraga putanje: smer bira igrač.

Ovo jeste 2D igra, ali potezna. Za kurs o HTTP komunikaciji svaki potez može jasno da se vidi kao jedan zahtev i jedan odgovor, bez problema sinhronizacije real-time multiplayer-a.

## Zašto je server prirodan deo primera

Prvo igra radi lokalno: stanje → pravilo poteza → novo stanje → prikaz. Potom istu funkciju pravila premeštamo na server. Browser šalje nameru, npr. smer `left`, a server odlučuje da li je potez dozvoljen i vraća stanje. Tako studenti mogu da uporede istu radnju pre i posle uvođenja mreže.

Server ne treba da primi gotov rezultat tipa „pobedio sam za dva poteza” i samo ga upiše. Provera pravila i vlasništva partije ostaje na serveru. To demonstrira granicu poverenja; ne rešava automatski botove, varanje ili sva bezbednosna pitanja.

Primer predloženog API-ja:

| Zahtev | Namena |
|---|---|
| `GET /api/level` | Učitavanje jedinog početnog nivoa |
| `POST /api/games` | Početak nove partije |
| `GET /api/games/:id` | Nastavljanje postojeće partije |
| `POST /api/games/:id/moves` sa `{ "direction": "left" }` | Slanje jedne komande i vraćanje novog stanja |

U početku je partija u memoriji; zatim se čuva u PostgreSQL-u. Primer prirodno pokazuje šta znači restart servera, gde se nalazi stanje i zašto ponovno otvaranje browsera nije isto što i nova partija. Na spor odgovor UI privremeno onemogući novo slanje poteza; neuspeh zahteva dobija vidljivu poruku. Automatsko ponavljanje POST poteza se ne uvodi bez objašnjenja rizika dupliranja. Konkurentne komande iz više tabova su jasno ograničenje osnovne demonstracije, ne skriveno obećanje ispravnosti.

Veza sa sesijama može biti anonimna serverska sesija koja poseduje partiju. Objasniti da takva sesija još nije autentifikovan korisnički nalog. Za demonstraciju autentifikacije potreban je poseban pripremljeni primer, ili izričito proširenje igre. Provera prava pristupa može pokazati zašto samo poznavanje ID-a tuđe partije ne daje pravo na potez.

## Postepene verzije za predavanja

1. Statična tabla: HTML, osnovni CSS, raspored i legenda.
2. Stanje kao JS objekat i mala matrica; obična funkcija proverava potez.
3. DOM događaj poziva funkciju i ponovo prikazuje stanje.
4. Node vraća opis nivoa; zahtev se pregleda u Network panelu.
5. `fetch` učitava nivo; prikazuju se čekanje i greška.
6. Pravila se izvršavaju na Node serveru; browser šalje komandu poteza.
7. PostgreSQL u Dockeru čuva partiju; zatvaranje i ponovno otvaranje stranice pokazuje nastavak.
8. Na postojećem kodu izdvojiti module i objasniti scope/closure odvojenim malim primerom; ne menjati pravila igre samo radi teme.
9. Pokazati neispravan smer, nedozvoljen pristup i browser/server granice; CORS zahteva posebnu demonstraciju sa drugim origin-om.
10. Po potrebi tipizirati `Direction` i stanje partije kao kratak TS uvod.

Ovo su verzije primera, ne novi raspored deset predavanja. Raspored 12 nedelja sledi tek po izboru aplikacije. Pripremljeni snimci koda i demonstracije treba da stanu u čas; ne planiramo učioničke vežbe niti kompletnu izradu od nule na svakom predavanju.

## Alternative

| Kandidat | Šta dobija kurs | Dodatni teret |
|---|---|---|
| „Poslednji signal”, potezna 2D tabla | Stanje, događaji, server kao autoritet, HTTP komande, čuvanje i nastavak | Mala pravila kretanja i prikaz matrice |
| „Reaktor”, 2D prekidači koji menjaju susedne ćelije | Još kraća logika, lako ponavljanje poteza, server proverava završetak | Slabiji osećaj kretanja i istraživanja; zagonetku treba ručno osmisliti |
| „Kontrolna soba”, upravljanje virtuelnim staklenikom | Forme, status uređaja, komande, istorija u bazi i simulacija senzora | Razlikovati simulirane podatke od stvarnog hardvera; real-time nije potreban |

Preporuka je „Poslednji signal” ako je cilj prepoznatljiva 2D igra, odnosno „Reaktor” ako najmanji mogući kod ima prednost.

## Šta nije prirodno pokriveno

Igra ne zamenjuje sistematsko objašnjenje semantičkog HTML-a, širih CSS tehnika, pristupačnosti, navigacije, bezbednosti ili različitih arhitektura. Za poređenje sa konkretnim Stanford i MIT kursevima videti [spisak tema i izvore](teme-izvan-igre-izvori.md). Praznina u primeru ne znači da temu treba izostaviti iz kursa; nekad je bolji mali nezavisan primer.
