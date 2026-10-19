# Proposal

## Why

Tab „Koraci” zvuči kao deo diskusije, a editor otvara gotov fajl celog časa. Nastavnik hoće da gradivo i kod idu korak po korak: original koraka pokazuje šta je dodato i obrisano prema originalu prethodnog koraka istog fajla, a ukucani kod ostaje isti dok se hoda kroz korake.

## What Changes

- Tab „Koraci” postaje Gradivo. U njemu ostaju preduslov, ishod, korak, kratka provera, pojmovi, osvrt i izlaz. Diskusija ostaje poseban tab i jedina duga pitalica.
- Hod kroz korak dobija žuta dugmad sa strelicama, uz red koraka. Dugme temperature na panelu se ne menja.
- Odgovori kratke provere stoje jedan ispod drugog.
- **BREAKING**: Front i Back postaju Klijent i Server. Tab Server se ne pojavljuje u nedeljama 1–3. Node i tab Server počinju u nedelji 4.
- **BREAKING**: Editor više ne otvara gotov fajl sa diska kao kod koraka. Original je kod koji kurs daje za taj korak. Zeleno i crveno porede taj original sa originalom poslednjeg ranijeg koraka istog fajla u kursu, ako takav korak postoji.
- Radna verzija svakog fajla pamti se u `localStorage` i prati nastavnika iz koraka u korak. Dugme sa ikonicom menja prikaz između radne verzije i originala tog koraka i ne briše ukucano. Pregled sobe crta ono što editor trenutno pokazuje.
- Kod u editoru puni širinu od stabla do trake. Pregled ostaje desno, početna podela je pola-pola.
- Prvi korak nedelje 1 zove se Podela. Posle njega nedelja sklapa stranicu, pa elemente, pa CSS. Svaki taj korak u originalu drži ceo fajl posle koraka. Nedelje 2–10 zadržavaju kod koji već stoji na koraku.
- Jedna postojeća biblioteka editora ulazi kao gotovi fajlovi, bez alata za izgradnju. To je izuzetak od ranijeg „nema nove zavisnosti”.

## Capabilities

### New Capabilities

### Modified Capabilities

- `sajt-casa`: ime taba Gradivo, žuti hod, Klijent i Server, editor koji prati korak, razlika originala, radna verzija u browseru, širina koda i pregled koji crta editor.
- `casovi`: Podela umesto Reza, redosled nedelje 1, tab Server od nedelje 4, original nedelje 1 je ceo fajl posle koraka.
- `pitalice`: odgovori kratke provere stoje jedan ispod drugog.

## Impact

- `site/index.html`, `site/css/site.css`, `site/js/main.js` i `site/kurs.json`. Pomoć koja imenuje tab Koraci menja natpis.
- Editor prestaje da upisuje hod kroz čas u fajlove na disku. Fajlovi koje čas pokreće van sajta ostaju na disku. Pregled fronta crta bafer editora. Serverski bafer se ne izvršava u browseru i ne zamenjuje proces.
- Jedna vendored biblioteka u `site/vendor/`, bez bundlera. Jezik sajta ostaje srpski.
- Testovi školjke, koraka i editora koji traže tab Koraci, Front/Back, gotov fajl ili čuvanje na disk treba uskladiti sa deltom.
