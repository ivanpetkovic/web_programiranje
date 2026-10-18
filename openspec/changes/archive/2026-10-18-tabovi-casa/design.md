# Design

## Context

Sajt časa je jedna statična stranica. `site/index.html` u `.layout` istovremeno drži članak `#cas`, panel kontrolne sobe i sekciju `#files`. Diskusija se crta unutar članka, ispod koraka. Front i Back su tabovi unutar editora. Uski ekran, ispod 860px, već slaže kolone jednu ispod druge. Vidi `proposal.md` za razlog.

## Goals / Non-Goals

**Goals:**

- Tri sekcije nedelje menjaju se tabom, a naslov ostaje.
- Editor i postojeći panel dele jednu sekciju, sa trakom koja menja širine.

**Non-Goals:**

- Novi prozor, iframe ili drugi dokument za pregled.
- Promena Front/Back, sadržaja koraka, faza diskusije ili ugovora kutije.
- Čuvanje odnosa širina posle ponovnog učitavanja stranice.

## Decisions

### Tri taba iznad postojećeg sadržaja

Ispod naslova časa stoji `tablist` sa Koraci, Diskusija i Editor. Koraci nose ono što članak već crta osim bloka diskusije: preduslov, ishod, korak, pojmove, osvrt i izlaz. Diskusija nosi postojeći blok diskusije. Editor nosi `#files` i panel.

Otvaranje časa bira Koraci. Pretraga pojma pre crtanja bira Koraci, jer pojmovi žive tamo. Sakrivena sekcija ima `hidden`, tako da ne zauzima mesto.

Treći tab nije imenovan u zahtevu. Koraci su ta sekcija jer su jedini preostali deo stranice pored diskusije i editora. Pregled nije tab.

Alternativa: pregled kao treći tab. Odbijena jer zahtev stavlja pregled na desnu polovinu editora.

### Pregled je postojeći panel

Desna strana je isti panel sobe prekidača i sobe mašina. Nije `client/index.html` u okviru. Sačuvana izmena fronta i dalje menja taj panel bez ponovnog učitavanja.

Dok je Editor zatvoren, čitanje, takt i dovod i dalje rade. Povratak na Editor pokazuje sobu kakva jeste, ne sliku od trenutka zatvaranja.

Alternativa: pauzirati kutiju dok tab nije otvoren. Odbijena jer bi povratak pokazao zastarelu sobu.

### Traka

Podrazumevani odnos je pola-pola, preko dve kolone iste širine. Traka je `separator` između njih. Prevlačenje pokazivačem menja udele. Fokusirana traka isto radi strelicama levo i desno. Ni jedna strana ne sme da padne na nulu: udeo ostaje između petine i četiri petine.

Odnos živi u memoriji stranice i preživljava smenu taba i časa. Ne ide u skladište browsera.

Na uskom rasporedu, onom koji već slaže stranicu u jednu kolonu, editor je iznad pregleda i traka se ne prikazuje.

Alternativa: biblioteka za podelu. Odbijena jer stranica nema korak izgradnje ni novu zavisnost.

### Front i Back ostaju unutra

Tabovi Front i Back i dalje biraju stablo `client/` ili `server/` unutar leve strane. Nisu tabovi nedelje.

## Risks / Trade-offs

- [Test koji traži panel i korak u istom prikazu] → Panel je u DOM-u i kad je sakriven. Provera gleda `hidden`, ne samo postojanje čvora.
- [Sakriven panel i dalje šalje čitanje] → To je namerno, da povratak pokaže trenutnu sobu. Rani čas i dalje ne šalje čitanje sobe.
- [Uski ekran nema traku] → Odnos širina važi samo dok su dve kolone. Jedna kolona i dalje pokazuje editor i pregled, jedan ispod drugog.

## Migration Plan

Raspored je samo u statičnom sajtu. Vraćanje je prethodni raspored članka, panela i editora. Nema migracije podataka.

## Open Questions

- Tačan korak strelice, sve dok udeo ostaje između petine i četiri petine i dok obe strane ostaju vidljive.
