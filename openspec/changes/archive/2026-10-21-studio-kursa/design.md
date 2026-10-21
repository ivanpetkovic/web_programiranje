# Design

## Context

Sajt časa je statična stranica bez koraka izgradnje. Kurs je jedan JSON, `site/kurs.json`, sa `trajanjeNedelja` i nizom `nedelje`, a svaka nedelja ima `steps`. Čas taj fajl čita i ne piše ga. Vidi `proposal.md` za razlog i `specs/studio/spec.md` za ponašanje. U radnom stablu već stoje `site/studio.html`, `site/js/studio.js`, `site/js/studio-strana.js`, `site/css/studio.css`, `server/kurs.js` i `PUT /api/kurs` u `server/server.js`.

## Goals / Non-Goals

**Goals:**

- Jedna strana `/studio` menja isti dokument koji čas čita.
- Dodavanje nedelje i koraka, redosled, brisanje i izmena sadržaja ostaju u browseru dok Sačuvaj ne uspe.
- Upis je jedan JSON fajl, lepo odštampan, sa novim redom na kraju.
- Postojeći moduli ostaju. Apply ne pravi drugu stranu ni drugi format.

**Non-Goals:**

- Novi oblik dokumenta, baza, nalog ili više istovremenih urednika.
- Izmena časova, pitalica, panela ili prikaza lekcije.
- Korak izgradnje ili nova npm zavisnost.
- Automatski upis na svaki taster.

## Decisions

### Isti `kurs.json`, ne novi šablon

Studio čita `GET /kurs.json` i Sačuvaj šalje `PUT /api/kurs`. Telo je ceo dokument. Polja koja studio ne prikazuje ostaju u objektu i vraćaju se u fajl. `trajanjeNedelja` u studiju postaje broj nedelja pre slanja. Server prima samo dokument čije trajanje već jeste taj broj, i čije svake nedelje `steps` jesu objekti. Čas i dalje vidi jedan fajl.

Alternativa: poseban studio JSON ili tabela. Odbijena jer čas ne bi čitao ono što je nastavnik sačuvao. Alternativa: server sam ispravlja trajanje. Odbijena jer ručni `PUT` sa pogrešnim trajanjem onda tiho menja dokument. Studio poravna trajanje pre slanja i kaže nastavniku.

### Strana bez izgradnje

`GET /studio` i `GET /studio/` serviraju `site/studio.html`. Skripte su moduli iz `site/js/`, stil iz `site/css/studio.css`. Model nedelje i koraka (`site/js/studio.js`) ne dira DOM. Strana (`site/js/studio-strana.js`) crta spisak i polja. Provera dokumenta za upis je `server/kurs.js`, da test servera ne vuče DOM.

Alternativa: ugraditi studio u tab časa. Odbijena jer izmena kursa nije hod kroz lekciju, a čas ne sme da piše `kurs.json` usput.

### Upis je privremen fajl pa preimenovanje

`PUT /api/kurs` čita telo do 2 000 000 bajtova, odvojeno od granice komande ventilatora. Neispravan JSON, predugačko telo i dokument koji nije kurs vraćaju HTTP 400 i ne diraju fajl. Ispravan dokument se piše kao `JSON.stringify(kurs, null, 2)` plus novi red, prvo u `.kurs-studio.tmp` pored fajla, pa `rename` preko `kurs.json`. Putanja fajla je `site/kurs.json`, osim kad `KURS_DATOTEKA` pokazuje na drugi fajl u testu.

Alternativa: pisati pravo u `kurs.json`. Odbijena jer prekid ostavlja isečen fajl koji čas onda ne učita.

### Nacrt je u ovom browseru

Ključ je `studio:kurs`. Vrednost je isti tekst koji bi Sačuvaj poslao. Upis nacrta ide posle kratke pauze, ne na svaki taster u fajl na disku. Uspešan odgovor briše ključ. Ako `localStorage` baci, dokument ostaje u memoriji. Sledeće otvaranje, ako se nacrt razlikuje od učitanog fajla i još se čita, ostavlja fajl na ekranu i nudi vraćanje ili odbacivanje. Vraćanje ne piše disk. Ako fajl ne stigne, a nacrt jeste čitljiv, studio otvara nacrt. Ako nema nijednog, otvara prazan kurs bez nedelja.

Alternativa: čuvati na svaki taster. Odbijena jer čas odmah vidi polovičan kurs.

### Korak ostaje priča, fajl ili figura

Vrsta se čita iz polja koja čas već zna: `figura`, pa putanja ili isečak, inače priča. Prelazak na drugu vrstu skida polja one koja otpadaju. Ako bi putanja, isečak ili figura nestali, prvi klik traži potvrdu. Naslov koraka ostaje. Nova nedelja kreće sa jednim praznim korakom. Poslednji korak nedelje se ne briše, jer nedelja bez koraka nije dokument koji server primi.

Alternativa: nedelja sme da ostane bez koraka. Odbijena jer učitavanje i upis takvu nedelju već odbijaju.

## Risks / Trade-offs

- [Dva browsera pišu isti fajl] → Poslednji uspešan Sačuvaj ostaje. Studio nije zajednički urednik. Nacrt u drugom browseru i dalje se nudi na sledećem otvaranju.
- [Sačuvaj prepiše ceo fajl] → Klijent i server štampaju isto, sa uvlačenjem 2 i novim redom. Test isporučenog `kurs.json` traži iste bajtove kad nema izmene.
- [localStorage ne primi veliki kurs] → Izmena ostaje u memoriji. Sačuvaj i Preuzmi i dalje nose dokument. Nacrt za taj browser tada ne postoji.
- [Ručni `PUT` sa drugim redosledom ključeva promeni bajtove] → Server štampa primljeni objekat. Studio šalje redosled koji je učitao. Test stabilnosti ide kroz pripremu studija, ne kroz proizvoljan `PUT`.

## Migration Plan

Nema novog fajla podataka. `site/kurs.json` ostaje. Vraćanje je prethodni commit studija i, ako je Sačuvaj već pisao, prethodna verzija `kurs.json`. Čas radi i bez `/studio`.

## Open Questions

Nema. Dokument je postojeći `kurs.json`, strana je `/studio`, a upis je `PUT /api/kurs`.
