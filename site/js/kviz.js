import { ikonica } from "./ikonice.js";
import { novaPitanja } from "./kviz-banka.js";
import { bazen, deloviKvizTeksta, izaberiPitanja, mozeOcena, oceni, sazetakPitanja, seOcenjuje, temeSaKvizom, zbir } from "./kviz-logika.js";
import { nacrtajMermaid } from "./mermaid.js";
import { deloviReda } from "./proza.js";

const MAKSIMUMI = [
  { id: "3", maksimum: 3, natpis: "3" },
  { id: "10", maksimum: 10, natpis: "10" },
  { id: "po-temi-1", poTemi: 1, natpis: "1 po temi" },
  { id: "po-temi-3", poTemi: 3, natpis: "3 po temi" },
  { id: "sve", natpis: "Neograničeno" },
];

function el(oznaka, klasa, tekst) {
  const cvor = document.createElement(oznaka);
  if (klasa) cvor.className = klasa;
  if (tekst !== undefined) cvor.textContent = tekst;
  return cvor;
}

function slot(ime) {
  const cvor = el("span", "ikona-slot");
  cvor.dataset.ikona = ime;
  cvor.setAttribute("aria-hidden", "true");
  const znak = ikonica(ime);
  if (znak) cvor.append(znak);
  return cvor;
}

export function napraviKviz(ctx) {
  const dijalog = document.querySelector("#kviz");
  const dugme = document.querySelector("#kviz-dugme");
  const telo = dijalog.querySelector(".kviz-telo");
  const naslov = dijalog.querySelector("#kviz-naslov");
  let povratak = null;
  let stanje = {
    opseg: "tema",
    maksimumId: "10",
    ocenjivanje: true,
  };
  let runda = null;

  function lekcije() {
    return ctx.lekcije();
  }

  function pitanja() {
    return bazen(lekcije(), novaPitanja);
  }

  function pokrivene() {
    return temeSaKvizom(novaPitanja);
  }

  function otvori() {
    povratak = document.activeElement;
    runda = null;
    naslov.textContent = "Kviz";
    nacrtajPodesavanja();
    if (!dijalog.open) dijalog.showModal();
    dugme?.setAttribute("aria-expanded", "true");
  }

  function zatvori() {
    dijalog.close();
    if (povratak instanceof HTMLElement) povratak.focus();
  }

  dijalog.addEventListener("close", () => dugme?.setAttribute("aria-expanded", "false"));
  dijalog.querySelector(".kviz-zatvori").addEventListener("click", zatvori);

  function nacrtajPodesavanja() {
    const sada = ctx.temaSada();
    const pokriveno = pokrivene();
    const imaTemu = Boolean(sada && pokriveno.includes(sada.tema));
    if (!imaTemu) stanje.opseg = "sve";
    telo.replaceChildren();
    const uvod = el("p", "kviz-napomena", "Kviz za sada pokriva prve tri teme. Ostale dolaze kad gradivo bude provereno. Pitanja su iz koraka i nova: zamke, šta kod ispiše, i ispravka koda.");
    telo.append(uvod);

    telo.append(grupaOpsega(sada, imaTemu, pokriveno));
    telo.append(grupa("Najviše pitanja", MAKSIMUMI.map((stavka) => ({
      pritisnuto: stanje.maksimumId === stavka.id,
      natpis: stavka.natpis,
      onClick: () => {
        stanje.maksimumId = stavka.id;
        nacrtajPodesavanja();
      },
    }))));

    const ocenjivanje = el("label", "kviz-ocena");
    const kvacica = document.createElement("input");
    kvacica.type = "checkbox";
    kvacica.checked = ocenjujeSe();
    kvacica.disabled = neograniceno();
    kvacica.addEventListener("change", () => {
      stanje.ocenjivanje = kvacica.checked;
      const napomena = telo.querySelector("[data-kviz-ocena]");
      if (napomena) napomena.textContent = tekstOcene();
    });
    ocenjivanje.append(kvacica, el("span", "", "Oceni kviz"));
    telo.append(ocenjivanje);
    const napomenaOcene = el("p", "kviz-napomena", tekstOcene());
    napomenaOcene.dataset.kvizOcena = "";
    telo.append(napomenaOcene);

    const kreni = el("button", "kviz-kreni", "Počni");
    kreni.type = "button";
    kreni.addEventListener("click", () => pokreni(sada));
    telo.append(kreni);
    telo.querySelector(".kviz-segment button")?.focus();
  }

  function grupaOpsega(sada, imaTemu, pokriveno) {
    const natpisTeme = imaTemu ? `Ova tema: ${sada.naslov}` : "Ova tema";
    const omot = grupa("Obim", [
      {
        pritisnuto: stanje.opseg === "tema",
        natpis: natpisTeme,
        onemoguceno: !imaTemu,
        onClick: () => {
          stanje.opseg = "tema";
          nacrtajPodesavanja();
        },
      },
      {
        pritisnuto: stanje.opseg === "sve",
        natpis: "Celo gradivo sa kvizom",
        onClick: () => {
          stanje.opseg = "sve";
          nacrtajPodesavanja();
        },
      },
    ]);
    if (!imaTemu) {
      const razlog = sada
        ? "Ova tema još nema kviz."
        : "Uvod nema kviz. Može celo gradivo koje je pokriveno.";
      omot.append(el("p", "kviz-napomena", `${razlog} Pokrivene teme: ${pokriveno.join(", ")}.`));
    }
    return omot;
  }

  function grupa(natpis, stavke) {
    const omot = el("fieldset", "kviz-grupa");
    omot.append(el("legend", "", natpis));
    const segment = el("div", "kviz-segment");
    segment.setAttribute("role", "group");
    segment.setAttribute("aria-label", natpis);
    for (const stavka of stavke) {
      const dugme = el("button", "", stavka.natpis);
      dugme.type = "button";
      dugme.setAttribute("aria-pressed", String(Boolean(stavka.pritisnuto)));
      if (stavka.onemoguceno) dugme.disabled = true;
      dugme.addEventListener("click", stavka.onClick);
      segment.append(dugme);
    }
    omot.append(segment);
    return omot;
  }

  function neograniceno() {
    return stanje.maksimumId === "sve";
  }

  function parametriIzbora(sada) {
    const stavka = MAKSIMUMI.find((kandidat) => kandidat.id === stanje.maksimumId) || MAKSIMUMI[1];
    return {
      opseg: stanje.opseg,
      tema: sada?.tema,
      maksimum: "maksimum" in stavka ? stavka.maksimum : null,
      poTemi: stavka.poTemi,
      ocenjivanje: stanje.ocenjivanje,
    };
  }

  function ocenjujeSe() {
    return seOcenjuje(parametriIzbora());
  }

  function tekstOcene() {
    if (neograniceno()) {
      return "Neograničen broj pitanja nema ocenu. Tačan odgovor i objašnjenje vide se čim izabereš opciju.";
    }
    if (!stanje.ocenjivanje) {
      return "Bez ocene, tačan odgovor i objašnjenje vide se čim izabereš opciju. Otvorena pitanja ulaze u izbor.";
    }
    return "Ocena važi za ABC pitanja i ispravke koda. Kod se poredi bez belina. Kad je ocena uključena, otvorena pitanja ne ulaze u izbor.";
  }

  function pokreni(sada) {
    const izbor = parametriIzbora(sada);
    const izabrana = izaberiPitanja(pitanja(), izbor);
    if (!izabrana.length) {
      telo.querySelector(".kviz-prazno")?.remove();
      telo.append(el("p", "kviz-prazno", "Nema pitanja za ovaj izbor."));
      return;
    }
    runda = {
      pitanja: izabrana,
      indeks: 0,
      odgovori: {},
      otkriveno: new Set(),
      ocenjivanje: seOcenjuje(izbor),
      predato: false,
    };
    nacrtajPitanje();
  }

  function nacrtajPitanje() {
    const pitanje = runda.pitanja[runda.indeks];
    naslov.textContent = runda.ocenjivanje ? "Kviz" : "Kviz bez ocene";
    telo.replaceChildren();
    const meta = el("p", "kviz-meta");
    meta.append(`${runda.indeks + 1} / ${runda.pitanja.length}`);
    meta.append(el("span", "", natpisMesta(pitanje)));
    meta.append(el("span", "kviz-bedz", natpisVrste(pitanje.vrsta)));
    if (pitanje.zamka) meta.append(el("span", "kviz-bedz kviz-zamka", "Zamka"));
    if (!mozeOcena(pitanje)) meta.append(el("span", "kviz-bedz", "Bez ocene"));
    telo.append(meta);

    telo.append(omotTeksta(pitanje.tekst));
    if (pitanje.dijagram) telo.append(figuraMermaid(pitanje.dijagram));
    if (pitanje.kod) telo.append(blokKoda(pitanje.kod));

    if (pitanje.vrsta === "izbor") telo.append(prikazIzbora(pitanje));
    else if (pitanje.vrsta === "ispravka") telo.append(prikazIspravke(pitanje));
    else telo.append(el("p", "kviz-napomena", "Otvoreno pitanje ne ulazi u ocenu. Odgovor iz gradiva može da se otvori."));

    const otkriveno = runda.otkriveno.has(pitanje.id) || runda.predato;
    if (otkriveno) telo.append(prikazOdgovora(pitanje));
    else if (!runda.ocenjivanje) {
      const otvoriOdgovor = el("button", "kviz-sporedno", "Prikaži odgovor");
      otvoriOdgovor.type = "button";
      otvoriOdgovor.addEventListener("click", () => {
        runda.otkriveno.add(pitanje.id);
        nacrtajPitanje();
      });
      telo.append(otvoriOdgovor);
    }

    const navigacija = el("div", "kviz-navigacija");
    const nazad = el("button", "kviz-sporedno", "Nazad");
    nazad.type = "button";
    nazad.disabled = runda.indeks === 0;
    nazad.addEventListener("click", () => {
      runda.indeks -= 1;
      nacrtajPitanje();
    });
    const dalje = el("button", "kviz-kreni", runda.indeks === runda.pitanja.length - 1 ? (runda.ocenjivanje ? "Predaj" : "Završi") : "Dalje");
    dalje.type = "button";
    dalje.addEventListener("click", () => {
      if (runda.indeks === runda.pitanja.length - 1) nacrtajRezultat();
      else {
        runda.indeks += 1;
        nacrtajPitanje();
      }
    });
    navigacija.append(nazad, dalje);
    telo.append(navigacija);
    nacrtajDijagrame(telo);
    telo.querySelector(".kviz-tekst")?.focus?.();
  }

  function prikazIzbora(pitanje) {
    const mreza = el("div", "opcije-mreza");
    const izabran = runda.odgovori[pitanje.id] || "";
    const otkriveno = runda.otkriveno.has(pitanje.id) || runda.predato;
    for (const opcija of pitanje.opcije || []) {
      const dugme = el("button", "option");
      dugme.type = "button";
      if (opcija.key === izabran) dugme.classList.add("izabrano");
      if (otkriveno && opcija.ok) dugme.classList.add("holds");
      if (otkriveno && opcija.key === izabran && !opcija.ok) dugme.classList.add("kviz-promaseno");
      const znak = ikonica(otkriveno && opcija.ok ? "check-circle" : opcija.key === izabran ? "circle-dot" : "circle");
      if (znak) dugme.append(znak);
      const natpis = el("span");
      natpis.append(document.createTextNode(`${opcija.key}. `));
      dodajDelove(natpis, opcija.text);
      dugme.append(natpis);
      if (otkriveno && opcija.why) {
        const zasto = el("p", "why");
        dodajDelove(zasto, opcija.why);
        dugme.append(zasto);
      }
      dugme.addEventListener("click", () => {
        if (runda.predato) return;
        runda.odgovori[pitanje.id] = opcija.key;
        if (!runda.ocenjivanje) runda.otkriveno.add(pitanje.id);
        nacrtajPitanje();
      });
      mreza.append(dugme);
    }
    return mreza;
  }

  function prikazIspravke(pitanje) {
    const omot = el("div", "kviz-ispravka");
    const polje = document.createElement("textarea");
    polje.className = "kviz-polje";
    polje.spellcheck = false;
    polje.rows = 8;
    polje.setAttribute("aria-label", "Ispravljen kod");
    polje.value = runda.odgovori[pitanje.id] ?? pitanje.polazno ?? "";
    if (runda.predato) polje.readOnly = true;
    polje.addEventListener("input", () => {
      runda.odgovori[pitanje.id] = polje.value;
    });
    omot.append(el("p", "kviz-napomena", "Ispravi kod. Pri oceni beline se odbacuju: razmaci, tabovi i novi redovi."));
    omot.append(polje);
    return omot;
  }

  function prikazOdgovora(pitanje) {
    const ocena = oceni(pitanje, runda.odgovori[pitanje.id]);
    const okvir = el("div", "kviz-odgovor");
    if (ocena.ocenjivo) {
      okvir.append(el("p", ocena.tacno ? "kviz-tacno" : "kviz-netacno", ocena.tacno ? "Tačno." : "Nije tačno."));
    }
    if (pitanje.vrsta === "izbor") {
      for (const tacna of (pitanje.opcije || []).filter((opcija) => opcija.ok)) {
        const red = el("p", "kviz-tacan");
        const jak = document.createElement("strong");
        jak.textContent = `Tačan odgovor: ${tacna.key}. `;
        red.append(jak);
        dodajDelove(red, tacna.text);
        okvir.append(red);
      }
    }
    if (pitanje.vrsta === "ispravka") {
      okvir.append(el("p", "meta", "Rešenje"));
      okvir.append(blokKoda(pitanje.resenje || ""));
    } else if (pitanje.vrsta === "tekst" && pitanje.odgovor) {
      okvir.append(el("p", "meta", "Odgovor iz gradiva"));
      okvir.append(prozaBlok(pitanje.odgovor));
    }
    if (pitanje.analiza) {
      okvir.append(el("p", "meta", "Obrazloženje"));
      okvir.append(prozaBlok(pitanje.analiza));
    }
    return okvir;
  }

  function nacrtajRezultat() {
    runda.predato = true;
    const zbirno = zbir(runda.pitanja, runda.odgovori);
    naslov.textContent = runda.ocenjivanje ? "Rezultat" : "Pregled";
    telo.replaceChildren();
    if (runda.ocenjivanje) {
      const ocena = el("p", "kviz-skor", `${zbirno.tacnih} od ${zbirno.ocenjivih}`);
      ocena.setAttribute("role", "status");
      telo.append(ocena);
      telo.append(el("p", "kviz-napomena", "U zbir ulaze samo ABC pitanja i ispravke koda."));
    } else {
      telo.append(el("p", "kviz-napomena", "Kviz nije ocenjen. Ispod je pregled odgovora."));
    }
    const spisak = el("ol", "kviz-spisak");
    runda.pitanja.forEach((pitanje, indeks) => {
      const stavka = el("li", "kviz-stavka");
      const ocena = zbirno.stavke[indeks];
      if (!ocena.ocenjivo) stavka.classList.add("bez-ocene");
      else stavka.classList.add(ocena.tacno ? "tacno" : "netacno");
      const glava = el("button", "kviz-stavka-dugme");
      dodajDelove(glava, sazetakPitanja(pitanje.tekst));
      glava.type = "button";
      glava.addEventListener("click", () => {
        runda.indeks = indeks;
        runda.otkriveno.add(pitanje.id);
        nacrtajPitanje();
      });
      stavka.append(glava);
      if (ocena.ocenjivo) stavka.append(el("p", "meta", ocena.tacno ? "Tačno" : "Nije tačno"));
      else stavka.append(el("p", "meta", "Bez ocene"));
      spisak.append(stavka);
    });
    telo.append(spisak);
    const navigacija = el("div", "kviz-navigacija");
    const ponovo = el("button", "kviz-kreni", "Novi izbor");
    ponovo.type = "button";
    ponovo.addEventListener("click", () => {
      runda = null;
      naslov.textContent = "Kviz";
      nacrtajPodesavanja();
    });
    const kraj = el("button", "kviz-sporedno", "Zatvori");
    kraj.type = "button";
    kraj.addEventListener("click", zatvori);
    navigacija.append(ponovo, kraj);
    telo.append(navigacija);
  }

  function natpisMesta(pitanje) {
    const lekcija = lekcije().find((stavka) => stavka.n === pitanje.tema);
    const korak = lekcija?.steps?.[pitanje.korak];
    const ime = korak?.naslov ? ` · ${korak.naslov}` : "";
    return `Tema ${pitanje.tema}, korak ${pitanje.korak + 1}${ime}`;
  }

  function natpisVrste(vrsta) {
    if (vrsta === "ispravka") return "Ispravka koda";
    if (vrsta === "tekst") return "Iz gradiva";
    return "Izbor";
  }

  function dodajDelove(cvor, tekst) {
    for (const deo of deloviReda(tekst)) {
      if (deo.kod) {
        const kod = document.createElement("code");
        kod.textContent = deo.tekst;
        cvor.append(kod);
      } else if (deo.jako) {
        const jako = document.createElement("strong");
        jako.textContent = deo.tekst;
        cvor.append(jako);
      } else if (deo.tekst) cvor.append(document.createTextNode(deo.tekst));
    }
  }

  function blokoviTeksta(tekst, naslov) {
    const cvorovi = [];
    let prvaProza = true;
    for (const deo of deloviKvizTeksta(tekst)) {
      if (deo.vrsta === "kod") {
        cvorovi.push(blokKoda(deo.tekst));
        continue;
      }
      if (deo.vrsta === "mermaid") {
        cvorovi.push(figuraMermaid(deo.tekst));
        continue;
      }
      const pasusi = deo.tekst.split(/\n{2,}/).map((pasus) => pasus.trim()).filter(Boolean);
      for (const pasus of pasusi) {
        const cvor = document.createElement(naslov && prvaProza ? "h3" : "p");
        prvaProza = false;
        if (cvor.tagName === "P") cvor.className = "kviz-nastavak";
        dodajDelove(cvor, pasus.replace(/\n+/g, " "));
        cvorovi.push(cvor);
      }
    }
    return cvorovi;
  }

  function omotTeksta(tekst) {
    const omot = el("div", "kviz-tekst");
    omot.tabIndex = -1;
    const cvorovi = blokoviTeksta(tekst, true);
    if (cvorovi.length) omot.append(...cvorovi);
    return omot;
  }

  function prozaBlok(tekst) {
    const omot = el("div", "kviz-proza");
    const cvorovi = blokoviTeksta(tekst, false);
    if (cvorovi.length) omot.append(...cvorovi);
    return omot;
  }

  function figuraMermaid(izvor) {
    const figura = el("div", "kviz-dijagram figura figura-mermaid");
    figura.dataset.izvor = izvor;
    return figura;
  }

  function nacrtajDijagrame(koren) {
    for (const figura of koren.querySelectorAll(".figura-mermaid")) {
      void nacrtajMermaid(figura, figura.dataset.izvor || "");
    }
  }

  function blokKoda(tekst) {
    const pre = el("pre", "kviz-kod");
    const code = document.createElement("code");
    code.textContent = tekst;
    pre.append(code);
    return pre;
  }

  document.querySelector("#kviz-dugme")?.addEventListener("click", otvori);
  return { otvori };
}
