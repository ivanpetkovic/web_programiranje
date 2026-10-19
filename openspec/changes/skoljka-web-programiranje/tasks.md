# Tasks

## 1. Dokument kursa

- [ ] 1.1 Prepisati nedelje iz `site/js/lectures.js` u `site/kurs.json` sa poljima iz `design.md`: ustanova, naslov `Web Programming`, oznaka, grb, `trajanjeNedelja`, podnaslov, minuta, nivo, tekst, ključna ideja i isečak. Proveriti da `node --test test/koraci.test.mjs` i dalje vidi deset naslova redom i 10 do 20 koraka po nedelji.
- [ ] 1.2 Svesti `site/js/lectures.js` na adapter koji čita `site/kurs.json` i i dalje izvozi `lectures` i `preduslovCasa`, bez upisanih naslova. Proveriti da u tom fajlu nema niza naslova nedelja i da `npm test` prolazi.
- [ ] 1.3 U `site/js/model.js` odbiti dokument čije se `trajanjeNedelja` ne slaže sa brojem nedelja. Proveriti testom: neusaglašen dokument daje grešku i ne vraća skraćen ni dopunjen spisak.

## 2. Trajanje, klizač i pojmovnik

- [ ] 2.1 U modelu računati natpis `Nedelja {n} od {N}` i procenat `Math.round(n / N * 100)` iz dokumenta, bez ugrađenog 10 ili 15. Proveriti testom: nedelja 10 od 15 daje natpis „Nedelja 10 od 15” i 67; kurs od 3 nedelje daje tri položaja klizača i broj samo na tekućem.
- [ ] 2.2 Parser `site/js/pojmovnik.js` čita `GLOSSARY.md`: ime, definicija i red izbegavanja. Proveriti testom da **Kontrolna soba** i **Čitanje** imaju istu definiciju koju bi tooltip pokazao, i da naslov `##` nije termin.
- [ ] 2.3 Pogodak pojma je ceo izraz u tekstu koraka, ključnoj ideji, pitalici, opcijama ili isečku. Izbor vraća svaku takvu nedelju i prvi korak. Proveriti testom sa dve nedelje koje dele glavu i sa glavom koja se ne javlja ni u jednoj.
- [ ] 2.4 Typeahead uz pojam vraća i pitanje i isečak čiji tekst počinje upitom. Proveriti testom da izbor pitanja vraća korak koji to pitanje postavlja.

## 3. Ruta pojmovnika

- [ ] 3.1 `GET /pojmovnik` u `server/server.js` vraća sirov `GLOSSARY.md`. Proveriti testom da telo sadrži `**Kontrolna soba**` i da `GET /api/soba` i dalje vraća temperaturu i režim.

## 4. Školjka

- [ ] 4.1 Zaglavlje: ustanova i grb iz dokumenta, naslov kursa, pretraga sa placeholderom „Nađi pojam, pitanje ili primer koda...”, klizač, prethodna i sledeća nedelja, sačuvaj korak, pomoć, oznaka. Ukloniti natpis „Kontrolna soba” i traku brojeva 1–N. Proveriti na isporučenom kursu da zaglavlje kaže Web Programming i „Nedelja 1 od 10”, a da klizač ispisuje samo broj tekuće nedelje.
- [ ] 4.2 Leva kolona je sklopiv spisak svih nedelja iz dokumenta; otvorena nedelja lista iste korake kao čas. Proveriti: ostale nedelje pokažu naslov i podnaslov bez koraka, a izbor koraka otvori taj korak.
- [ ] 4.3 Centar na Koracima: mrvice, naslov, podnaslov, kontrole koraka, traka „Korak i od M”, nivo i minuta iz dokumenta, pa tekst, poziv „Ključna ideja”, isečak sa brojevima redova i kopiranjem, pa pitalica. Proveriti na prvom koraku prve nedelje da su ključna ideja i isečak vidljivi pre pitalice i da nijedna opcija nije označena kao tačna.
- [ ] 4.4 Izbor opcije samo je istakne. Otvaranje razloga i dalje pokazuje koja opcija drži. Proveriti: pre razloga nema pečata, posle razloga tačna opcija jeste označena.
- [ ] 4.5 Desna kartica: „Nedelja n od N”, procenat, broj koraka i budžet minuta kao natpis, bez odbrojavanja. Proveriti na nedelji 1 da procenat odgovara 1/10 i da se natpis minuta ne menja sam.
- [ ] 4.6 Pojam iz pojmovnika u tekstu lekcije podvući isprekidanom crtom. Tooltip i stavka typeahead-a pokazuju ista polja. Izbor pojma koji se ponavlja širi svaku takvu nedelju, otvara prvi korak i tab Koraci. Command+K i Ctrl+K fokusiraju polje. Proveriti sa dva koraka koja dele glavu, i sa Diskusije.
- [ ] 4.7 Sačuvan korak u `localStorage` pod `web-programiranje:korak` vraća istu nedelju i korak posle ponovnog učitavanja. Nedelja dobija oznaku završetka tek kad su svi njeni koraci sačuvani. Pomoć objašnjava crtu, typeahead i tri taba i ne šalje zahtev sobi. Proveriti ponovnim učitavanjem i mrežom.
- [ ] 4.8 Svetla i tamna tema dele raspored nove školjke. Zakucavanje teme i podrazumevana tamna tema kad sistem ćuti ostaju. Red tekućeg koraka je `#ffb000` na tamnoj, a na svetloj ima kontrast bar 4.5:1 i nije `#ffb000`. Ispod 860px spisak, čas i kartica idu jedan ispod drugog. Proveriti `node --test test/tema.test.mjs` i obe šeme: regioni ostaju, čas se ne pomera, editor i traka i dalje rade.
- [ ] 4.9 Heš i strelice primaju bilo koji broj nedelje iz dokumenta, ne samo 1–10. Proveriti učitavanjem probnog dokumenta od 15 nedelja, otvorenog na desetoj: natpis „Nedelja 10 od 15”, 15 položaja, kartica 67, i nedelja 11 se otvara.

## 5. Provera celine

- [ ] 5.1 Pokrenuti `npm test` i proveriti da prolaze testovi dokumenta, modela, rute i postojeći ugovor kutije.
- [ ] 5.2 U browseru, na svetloj i tamnoj šemi, proći isporučeni kurs: zaglavlje, klizač, sklopivi spisak, ključna ideja, isečak, neoznačena pitalica, typeahead, tooltip, tri taba i editor.

## Workflow follow-up

- Sync u `openspec/specs/` tek kad su zadaci gotovi, uz arhivu.
- Ne dirati change `kontrolna-soba-kurs`.
