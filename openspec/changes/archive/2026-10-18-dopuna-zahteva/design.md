# Design

## Context

Glavne specifikacije u `openspec/specs/` već drže kičmu kursa. Ovaj change dodaje zahteve koji su ostali u `.scratch/` i ADR-ovima. Vidi `proposal.md` za razlog. `GET /api/soba`, `PUT /api/ventilator`, polje `ukljucen`, granica JSON tela i provera sintakse pre upisa fajla već rade u `server/server.js`. Digital-7 Mono već se servira za oba broja. Rezerva, ishod, izlaz i osvrt već stoje kao podaci u `site/js/lectures.js`, a deo toga sajt još ne sprovodi kao zahtev.

## Goals / Non-Goals

**Goals:**

- Delta nad četiri postojeće sposobnosti, bez nove sposobnosti i bez diranja change-a `kontrolna-soba-kurs`.
- Ponašanje koje kod već ima postaje zahtev i test. Ponašanje kojeg nema dobija isti panel, na času koji ga uvodi.

**Non-Goals:**

- Nova ruta, Express, React, SSE ili WebSocket za displej sobe prekidača.
- Login forma, bodovanje, drugi uređaj i izrada preglednih tema.
- Prepisivanje doslovnih rečenica sitnih primera.

## Decisions

### Srpski domen i postojeće putanje

Čitanje ostaje `GET /api/soba`. Komanda ostaje `PUT /api/ventilator` sa poljem `ukljucen`. Odgovor čitanja i dalje nosi `temperatura` i `ukljucen`. Granica tela ostaje postojeća granica JSON-a u `server/server.js`. Neispravan JSON i preveliko telo vraćaju HTTP 400 pre nego što se telo protumači kao režim.

Kad je provera uloge uključena, red ostaje onaj iz glavne specifikacije: nema cookie-ja pa je 401, posmatrač pa je 403, tek onda telo. Granica i JSON ne preskaču tu proveru.

Alternativa: odbijati JSON pre uloge. Odbijena jer bi 400 stigao i bez sesije, a čas 9 uči obrnut red.

### Err, dovod i prepared

Od časa 5 završen neuspeh i izostanak odgovora pišu Err. Čas 4 i dalje ostavlja crte. Dok zahtev traje, displej zadržava crte, cifre ili Err. Tri stanja čitanja su čekanje, podatak i greška. Čekanje ne dobija četvrti znak: to su glyphovi koji već stoje, a drugi klik i dalje radi.

Dovod sobe mašina ostaje neimenovan i puni samo taj displej i lopatice. `prepared/` ostaje van stabla.

Alternativa: poseban znak za čekanje. Odbijena jer bi obrisala razliku između crta, cifara i Err dok zahtev traje.

### Prag, istorija i dva roka svežine

Prag upozorenja je broj pored temperature od časa 8, uz starost očitavanja. Nije novi uređaj i ne menja ventilator. Istorija je lista komandi na panelu od časa 7, iz iste celine koja već upisuje `istorija`. Povučena celina ne dodaje red.

Ikonica ventilatora prati dovod sobe mašina. Starost temperature prati poslednje čitanje sobe prekidača. Osvežavanje ikonice ne sme da obriše tu starost. Provera svežine dobija isključivanje: ugašena provera dozvoljava da stariji trenutak pregazi noviji.

Alternativa: prag na času 3, uz closure. Odbijena jer je tamo prag filtera u kodu, a na panelu broj stiže kad stiže i vreme očitavanja.

### Uloga, pojmovi i čuvanje

Promena uloge je izmena mape u `server/sesija.js`. Taj fajl se i dalje učitava na sledećem zahtevu. Cookie vrednost se ne menja. Pretraga sužava pojmove otvorenog časa i otvara prvi preostali pogodak. Više pojmova sme da ostane otvoreno i posle ponovnog crtanja časa. „Ponovi pitanje” sklanja pečat i razloge te pitalice.

Sintaksna greška serverskog fajla već se odbija pre `writeFile`. Zahtev ostaje: sačuvani izvor se ne zamenjuje, a sledeći zahtev i dalje koristi prethodni.

Preduslov časa 1 je rez `client/` i prazan `server/`. Preduslov svakog sledećeg časa je ishod prethodnog.

### Osvrt i rezerva

Imena preglednih tema ostaju tekst osvrta. Sajt ih ne pretvara u alat. Rezerve časova 1–9 ostaju zatvorene dok nastavnik ne otvori. Čas 10 nema glasanje o tipu i asistentu. Ta rečenica ostaje u osvrtu. Izlaz časa 10 pita gde je pravo, gde je stanje i šta ćutanje ne dokazuje.

## Risks / Trade-offs

- [Isključena svežina protivreči staroj rečenici da stariji trenutak nikad ne pregazi noviji] → Izmena je u `MODIFIED` zahtevu „Svežina očitavanja”. Uključena provera i dalje čuva noviji broj.
- [Deo zahteva kod već ispunjava, pa apply može da „doda” prazan diff] → Zadaci za postojeće ponašanje vezuju test, a ne prepisuju handler.
- [Lista istorije traži čitanje iz baze na statičnom sajtu] → Lista stiže istim čitanjem sobe kad je čas 7 uveo bazu, ne novom rutom.
- [Pretraga danas skače na drugi čas i otvara pogodak] → Sužavanje liste je nova radnja. Skoči na čas samo ako pogodak nije u otvorenom času, i tamo suzi listu.

## Migration Plan

Izmene ostaju u istom repozitorijumu. Vraćanje je povratak na prethodni commit. Glavne specifikacije se ažuriraju tek sync-om posle apply-a. Change `kontrolna-soba-kurs` se ne otvara iznova.

## Open Questions

- Doslovna rečenica praga upozorenja na panelu, dok broj stoji pored temperature i ne uvodi uređaj.
