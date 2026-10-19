# Design

## Context

Isporučena nedelja 1 u `site/kurs.json` već drži original kao ceo fajl posle koraka, od Stranice. Dva koraka ne dodaju liniju: original Osvežavanja jednak je originalu Veze, a original Semantike jednak je originalu Sobe prekidača. `site/js/radna.js` drži jednu radnu verziju po putanji u `localStorage` ključu `radnaVerzija`. Dugme `#verzija` menja režim i ne briše tu mapu. Dugme `#tema` već zakuca `tamna` ili `svetla`. Školjka je serif, sa `--bg: #f3efe6` na svetloj i `#12110e` na tamnoj, a svetli `--amber` je `#8a5600` jer red koraka na svetloj ne sme biti `#ffb000`. Vidi `proposal.md` za razlog. Ponašanje je u deltama `casovi` i `sajt-casa`.

## Goals / Non-Goals

**Goals:**

- Prva nedelja u kodu pokaže HTML element ili atribut, pa klasni selektor i tri ivice kutije: border, padding, margin.
- Reset upisuje ugrađeni original otvorenog koraka u radnu verziju samo te putanje.
- Tokeni školjke prate obe slike, a postojeća pravila kontrasta ostaju na posebnom tokenu reda koraka.

**Non-Goals:**

- Novi nastavni plan od petnaest nedelja i natpisi iz spiska na slici.
- Vraćanje taba na natpis Koraci.
- Izmena fajlova na disku u `client/` i `server/`, fonta Digital-7 Mono, bunara grafikona ili ugovora kutije.
- Nova zavisnost ili preuzeti font.

## Decisions

### Prva nedelja prvo pokaže HTML, pa kutiju

Naslov nedelje ostaje „Šta browser prikazuje”. Podela ostaje `client/` i `server/`. Stranica i dalje počinje skoro prazan dokument. Ključna ideja od Stranice do Dugmeta imenuje ono što korak doda: `html` i `lang`, `head` sa `charset` i `title`, `body`, `h1`, `p` sa `class`, `button` sa `type`. Veza i dalje doda `link` i `href`. Broj 24 ostaje sadržaj pasusa. Soba mašina i `/api/soba` ne ulaze.

Razmak se zove Selektor. Njegov original je jedna klasa:

```css
.digit {
  letter-spacing: 0.08em;
}
```

Okvir zadrži to pravilo i doda `border: 1px solid #3a342c;`. Unutra doda `padding: 1rem;`. Spolja doda `margin: 1rem;`. Svaki taj korak u ključnoj ideji kaže selektor, border, padding ili margin. `isecak` je samo nova deklaracija. Original je celo pravilo. Novi koraci dele minute Razmaka i Okvira tako da zbir nedelje ostane 90.

Osvežavanje i dalje doda `<!-- osvežavanje vraća dokument -->`, a Semantika `<!-- naslov je h1, ne pasus -->`. Kasniji HTML originali zadržavaju raniju liniju. To nisu koraci box modela; pokrivaju ostatak nedelje koji već postoji.

Alternativa: posebna stranica koja nije soba prekidača. Odbijena jer čas 1 i dalje ostavlja samo tu sobu i broj 24.

Alternativa: zadržati ime Razmak i jednu ivicu. Odbijena jer prva nedelja onda ne pokaže selektor ni tri dela kutije.

### Reset piše u istu mapu, prekidač je drugo dugme

Novo dugme `#reset-radne` stoji pored `#verzija`. Klik zove `upisiRadnu` sa ugrađenim originalom otvorenog koraka za otvorenu putanju, postavlja režim na radnu verziju i ne dira ostale ključeve mape ni disk. Ako original koraka nije HTML (Podela), u mapu ide baš taj original, ne fajl sa diska. `#verzija` i dalje samo menja režim. Pristupačno ime je „Prikaži radnu verziju” ili „Prikaži ugrađenu verziju”. Olovka i list ostaju.

Alternativa: reset briše ključ putanje, pa `polazniTekst` opet uzme disk za CSS i za Podelu. Odbijena jer bi posle reseta ekran pokazao gotov fajl sa diska, ne ugrađeni original koraka.

### Zlato kontrole i boja reda koraka su dva tokena

Slike koriste isto svetlo zlato na dugmadima u obe teme. Red koraka na svetloj i dalje ne sme biti `#ffb000`. Zato:

- `--zlato: #e8a317` i `--na-zlatu: #1a1204` u obe teme: naslov kursa, trenutni broj koraka, popuna kartice, ivica izabrane opcije, poziv ključne ideje.
- Hod koraka ostaje na `#ffb000` sa tamnim tekstom, kako zahtev već kaže.
- `--korak` je `#ffb000` na tamnoj i `#8a5600` na svetloj. Klasa `.korak` čita `--korak`, ne `--zlato`.

Svetla školjka: `--bg: #fafafb`, `--paper: #ffffff`, `--naslov: #0a0a36`, `--ink: #1c2430`, `--line: #e4e7ee`, poziv `#fff6e0`, kod `#f3f6fb`. Tamna: `--bg: #100f0c`, `--paper: #1c1a16`, `--naslov: #f7f4ee`, poziv `#2a2418`, kod `#121418`. `h1` lekcije koristi `--naslov`. Lice školjke je `system-ui, "Segoe UI", sans-serif`. Cifre ostaju Digital-7 Mono. Bunar ostaje `#111111`.

Mreža pitalice je dva stupca iznad 860px, jedan ispod, na istom prelomu na kome se editor već slaže.

Dugme teme ostaje jedno, u zaglavlju, sa imenom „Svetla tema” ili „Tamna tema” prema temi koju klik zakuca. Tekst dugmeta se ne ispisuje u zaglavlju; vidi se ikonica, ime ide u `aria-label`. Ključ `tema` i skripta u `head` ostaju.

Alternativa: jedan `--amber` za sve, pa svetla tema potamni zlato da prođe kontrast. Odbijena jer slike drže svetlo zlato na trenutnom koraku u obe teme, a red koraka ima zaseban zahtev.

## Risks / Trade-offs

- [Komentar u originalu ulazi u zelenu razliku] → To je dodatak koraka. Prethodne linije ostaju, pa crveno i dalje znači obrisano.
- [Naslov kursa u `#e8a317` na beloj podlozi nije 4.5:1] → Red koraka, beleške i cifre i dalje koriste svoje tokene. Zlato je akcenat, ne tekst lekcije.
- [Reset Podele sačuva skicu umesto HTML-a] → Pregled tog koraka pokazuje skicu. Sledeći korak i dalje ima svoj original. Disk se ne menja.
- [Stari nacrt u `radnaVerzija` ostaje posle izmene originala] → Namerno, dok nastavnik ne pritisne reset. Nema prepisivanja tuđeg ključa.

## Migration Plan

Nema nove putanje ni novog ključa skladišta. Stara radna verzija važi dok se fajl ne resetuje. Vraćanje izmene je vraćanje `kurs.json` i tokena; skladište browsera se ne briše samo od sebe.
