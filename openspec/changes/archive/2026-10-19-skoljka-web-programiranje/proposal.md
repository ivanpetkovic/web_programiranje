# Proposal

## Why

Sajt časa i dalje nosi natpis „Kontrolna soba”, u zaglavlju ispisuje fiksnih deset časova i nudi nedelje kao brojeve 1–10. Mock školjke je kurs „Web Programming”: klizač nedelje, sklopiv spisak, ključna ideja, isečak koda i tamna tema. Trajanje i telo kursa treba da se menjaju na jednom mestu, ne u školjci.

## What Changes

- Natpis u zaglavlju je naslov kursa iz dokumenta. Dokument koji se isporučuje kaže „Web Programming”. „Kontrolna soba” ostaje ime povezujućeg primera unutar editora, ne natpis sajta.
- Trajanje kursa je polje dokumenta, broj nedelja. Klizač, spisak, natpis „Nedelja n od N” i procenat čitaju to polje. Školjka nema ugrađen broj 10 ni 15. Traka brojeva 1–N se uklanja; položaj nedelje je klizač, a broj nosi samo tekuća nedelja.
- Ceo kurs je taj dokument: ustanova, naslov, nedelje, koraci, tekst, ključna ideja, isečak, pitalica i budžet minuta. Izmena kursa ne dira renderer.
- Traženje pojma je typeahead nad pojmovnikom. Isti zapis pojmovnika vidi se u tooltipu kad je pojam u tekstu lekcije podvučen isprekidanom crtom. Izbor pojma pokazuje definiciju i otvara svaku lekciju u kojoj se pojam ponavlja.
- Otvoren korak prati mock: tekst, poziv „Ključna ideja”, isečak sa kopiranjem, pa kratka pitalica. Levo je sklopiv spisak nedelja. Desno je kartica napretka.
- Svetla i tamna tema i dalje postoje, sa zakucavanjem koje sajt već ima. Nova školjka u obe teme prati mock: isti regioni, zlato kao akcenat.
- **BREAKING** za školjku: fiksnih deset nedelja i pretraga koja sužava pojmove samo unutar otvorenog časa više ne važe. Deset postojećih nedelja ostaje sadržaj dokumenta koji se isporučuje, sa trajanjem postavljenim na deset.

## Capabilities

### New Capabilities

### Modified Capabilities

- `sajt-casa`: školjka po mocku, obe teme, klizač umesto brojeva nedelja, sklopiv spisak, korak sa ključnom idejom i isečkom, typeahead i tooltip iz pojmovnika.
- `casovi`: trajanje i telo kursa dolaze iz dokumenta. Školjka ne zna koliko nedelja ima. Dokument koji se isporučuje i dalje drži postojećih deset nedelja, redom.
- `pitalice`: kratka pitalica i dalje ne otkriva tačan odgovor sama. Izbor opcije sme da je istakne kao izabranu, u rasporedu sa mocka.

## Impact

- `site/index.html`, `site/css/site.css` i `site/js/main.js` crtaju školjku i čitaju dokument. `site/js/lectures.js` prestaje da bude izvor koji školjka broji; telo kursa prelazi u jedan dokument, predviđeno `site/kurs.json`. `GLOSSARY.md` ostaje jedini spisak pojmova.
- `test/koraci.test.mjs` i dalje proverava dokument koji se isporučuje. Novi test školjke učitava kurs kraći i duži od deset nedelja, uključujući dokument od 15 nedelja na desetoj, kakav mock pokazuje.
- Editor, Front/Back, faze duge diskusije i ugovor kutije se ne menjaju.
- Nema nove zavisnosti. Jezik sajta ostaje srpski. Budžet minuta ostaje natpis, ne tajmer.
