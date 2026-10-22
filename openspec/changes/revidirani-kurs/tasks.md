# Tasks

## 1. Dokument kursa

- [x] 1.1 `docs/kurs.xml` je revidirani dokument verzije 2.0, a `site/kurs.json` se iz njega puni: 11 nedelja, 137 koraka. Zbir minuta koraka je 55, osim nedelje PostgreSQL i Docker koja zbraja 20. Budžet nedelje je 90. Provera: `xmllint --noout docs/kurs.xml` i čitanje `verzija`, `trajanjeNedelja` i broja koraka iz JSON-a.

- [x] 1.2 Korak bez celog originala: `original` u prikazu pada na `delic`, izolovan primer i dijagram se crtaju pre pitalice, analiza tek kad je obrazloženje otvoreno. Provera: `node --test test/koraci.test.mjs test/stablo.test.mjs test/editor-izbor.test.mjs` i otvaranje Širine kutije na Gradivu.

## 2. Glavni spec

- [x] 2.1 Spoji delte `casovi`, `pitalice` i `sajt-casa` u `openspec/specs/`. Purpose ostaje. Posle spajanja `openspec validate revidirani-kurs --type change --strict` i `openspec validate --specs` prolaze, a glavni spec nema naslove ADDED, MODIFIED, REMOVED ni RENAMED.

## Workflow follow-up

- Arhiviraj `revidirani-kurs` kad pregled speca prođe. Purpose u `casovi` i dalje kaže „Deset nedelja”; to se menja ručno u glavnom specu, ne arhivom.
