# Proposal

## Why

Otvoren čas danas drži korake, diskusiju, editor i panel na istom ekranu. Nastavnik ne može da vodi jednu od te tri celine bez ostalih dve, niti da sam odredi koliko mesta editor uzima u odnosu na pregled.

## What Changes

- Ispod naslova nedelje stoje tri taba: Koraci, Diskusija i Editor. Na ekranu je tačno jedna od te tri sekcije. Naslov ostaje vidljiv na svakom tabu.
- Koraci su podrazumevani tab. Tu ostaju preduslov, ishod, korak, pojmovi, osvrt i izlaz.
- Diskusija je posebna sekcija. Njen sadržaj se ne menja.
- Editor deli svoju sekciju na levu i desnu polovinu. Levo je postojeći editor fajlova, desno je postojeći panel kontrolne sobe kao pregled. Vertikalna traka između njih pomera se i menja odnos širina. Ni jedna strana ne sme da nestane.
- Front i Back ostaju unutar editora. Nisu tabovi nedelje.
- Pretpostavka: treći tab, koji u zahtevu nije imenovan, jeste Koraci. Pregled nije zaseban tab.

## Capabilities

### New Capabilities

### Modified Capabilities

- `sajt-casa`: otvoren čas više ne pokazuje korak i panel u isto vreme. Dobija tri taba i podelu editora i pregleda.

## Impact

- `site/index.html`, `site/css/site.css` i `site/js/main.js` menjaju raspored. `site/js/lectures.js` i server se ne menjaju.
- Zahtev „Statičan sajt časa” gubi rečenicu da su korak i ugrađeni panel istovremeno na ekranu. Ostali zahtevi časa, pitalica i kutije ostaju.
- Nema nove zavisnosti. Domen ostaje na srpskom.
