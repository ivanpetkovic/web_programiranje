## Context

Birač se danas crta u `nacrtajBirac` i ubacuje u `#cas`, unutar `#sekcija-koraci`. `prikaziDeo` krije tu sekciju kad su Diskusija ili Editor otvoreni, pa birač nestaje zajedno sa Gradivom. Linija ispod reda je `.birac-traka`. Glavna specifikacija puni je brojem sačuvanih koraka preko `popunaKoraka`. Kad ništa nije sačuvano, traka je prazna i čita se kao razdelnik.

Sačuvani koraci ostaju u `localStorage` ključu `web-programiranje:korak`. Spisak nedelja i dalje označava nedelju čiji su svi koraci sačuvani. Kartica napretka i dalje pokazuje udeo nedelje u trajanju kursa.

## Goals / Non-Goals

**Goals:**

- Birač je izvan `#sekcija-koraci` i vidljiv je na Gradivu, Diskusiji i Editoru.
- Donja linija birača je progress bar otvorenog koraka, širine n/N.
- Prethodni, Svi koraci i Sledeći menjaju korak a ne menjaju otvoreni tab.

**Non-Goals:**

- Brisanje čuvanja koraka, oznake završene nedelje ili kartice napretka.
- Menjanje tela Gradiva, Diskusije ili Editora.
- Nova zavisnost ili korak izgradnje.

## Decisions

1. Jedno mesto, `#birac-mesto`, stoji u `site/index.html` između `.cas-glava` i tri sekcije. `renderLecture` ubacuje birač tamo, a nivo, minute i Sačuvaj korak ostaju u `#cas`. Alternativa je da se birač ponovi u svakoj sekciji. Odbijena je jer bi tri kopije morale da prate isti indeks.

2. Širina popune je `(i + 1) / item.steps.length`. Traka ima `role="progressbar"`, `aria-valuenow` jednak n, `aria-valuemax` jednak N i natpis Napredak kroz korake. Alternativa je da širina ostane `popunaKoraka`. Odbijena je jer nesačuvana nedelja crta praznu liniju ispod natpisa Korak n od N. `popunaKoraka` ostaje izvezena i pokrivena `test/birac.test.mjs`. Birač je ne zove.

3. Traka je donja ivica kartice `.birac`, pune širine, sa podlogom `--line` i popunom `--amber`. Nije poseban okvir ispod kartice. Meni Svi koraci mora da izađe iz kartice. `overflow: hidden` na `.birac` ne sme da ga odseče.

4. Klik na Prethodni, Sledeći ili stavku menija i dalje zove `renderLecture`. `deo` se ne menja, pa Diskusija ili Editor ostaju otvoreni.

## Risks / Trade-offs

- [Traka više ne pokazuje koliko je koraka sačuvano] → Sačuvaj korak i oznaka završene nedelje ostaju. Kartica i dalje pokazuje udeo nedelje, ne udeo koraka.
- [Birač zauzima visinu i u Editoru] → To je traženi prikaz. `editor-pun` i dalje krije spisak nedelja i karticu, ne birač.
- [Meni može da bude odsečen ako kartica seče preliv] → Meni ostaje iznad sadržaja i van odsečka trake.

## Migration Plan

Nema prenosa podataka. Sačuvani koraci ostaju u browseru. Vraćanje je vraćanje birača u `#cas` i širine na `popunaKoraka`.

## Open Questions

Nema.
