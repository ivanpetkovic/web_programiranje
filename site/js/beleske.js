import { nadjiBelesku, postaviBelesku, ukloniBelesku } from "./lokalno-stanje.js";
import { ikonica } from "./ikonice.js";
import { napraviPadajucu } from "./padajuca.js";

export const NAJVISE_KOMENTARA = 500;

export function brojBeleski(n) {
  const desetica = n % 100;
  const jedinica = n % 10;
  if (jedinica === 1 && desetica !== 11) return `${n} beleška`;
  if (jedinica >= 2 && jedinica <= 4 && (desetica < 12 || desetica > 14)) return `${n} beleške`;
  return `${n} beležaka`;
}

export function najnovije(beleske, koliko = 5) {
  return [...beleske].sort((a, b) => (a.izmenjeno < b.izmenjeno ? 1 : a.izmenjeno > b.izmenjeno ? -1 : 0)).slice(0, koliko);
}

export function poTemama(beleske) {
  const grupe = new Map();
  for (const beleska of beleske) {
    if (!grupe.has(beleska.tema)) grupe.set(beleska.tema, []);
    grupe.get(beleska.tema).push(beleska);
  }
  return [...grupe.entries()]
    .sort(([a], [b]) => a - b)
    .map(([tema, spisak]) => ({ tema, beleske: spisak.sort((a, b) => a.korak - b.korak) }));
}

export function natpisBeleske(beleska) {
  return `Korak ${beleska.korak + 1} – ${beleska.naslov}`;
}

function el(oznaka, klasa, tekst) {
  const cvor = document.createElement(oznaka);
  if (klasa) cvor.className = klasa;
  if (tekst !== undefined) cvor.textContent = tekst;
  return cvor;
}

function slot(ime, klasa = "") {
  const cvor = el("span", `ikona-slot ${klasa}`.trim());
  cvor.dataset.ikona = ime;
  cvor.setAttribute("aria-hidden", "true");
  const znak = ikonica(ime);
  if (znak) cvor.append(znak);
  return cvor;
}

function dugme(klasa, ikona, natpis) {
  const cvor = el("button", klasa);
  cvor.type = "button";
  if (ikona) cvor.append(slot(ikona));
  if (natpis) cvor.append(el("span", "", natpis));
  return cvor;
}

export function napraviBeleske(ctx) {
  const { lokalno } = ctx;
  const dugmeZaglavlja = document.querySelector("#beleske-dugme");
  const lista = document.querySelector("#beleske-lista");
  const dijalog = document.querySelector("#sve-beleske");
  const telo = dijalog.querySelector(".sve-beleske-telo");
  const uredjivac = napraviUredjivac();
  let dugmeKoraka = null;

  const padajuca = napraviPadajucu({
    dugme: dugmeZaglavlja,
    panel: lista,
    stavke: () => [...lista.querySelectorAll("button")],
    naOtvori: nacrtajListu,
  });

  function otvori(beleska, zatvori) {
    if (!ctx.postojiKorak(beleska.tema, beleska.korak)) return;
    zatvori();
    ctx.otvoriKorak(beleska.tema, beleska.korak);
  }

  function nacrtajListu() {
    const beleske = lokalno.stanje().beleske;
    const glava = el("div", "beleske-glava");
    glava.append(slot("bookmark", "beleske-glava-ikona"), el("h3", "beleske-naslov", "Sačuvane beleške"));
    glava.append(el("span", "beleske-broj", beleske.length ? brojBeleski(beleske.length) : ""));
    const redovi = el("ul", "beleske-redovi");
    for (const beleska of najnovije(beleske, 5)) {
      const red = el("li");
      const izbor = el("button", "beleska-red padajuca-stavka");
      izbor.type = "button";
      izbor.dataset.tema = String(beleska.tema);
      izbor.dataset.korak = String(beleska.korak);
      const tekst = el("span", "beleska-red-tekst");
      tekst.append(el("span", "beleska-red-naslov", natpisBeleske(beleska)));
      if (beleska.komentar) {
        const komentar = el("span", "beleska-red-komentar");
        komentar.append(slot("message-circle"), el("span", "", beleska.komentar));
        tekst.append(komentar);
      }
      izbor.append(slot("sticky-note", "beleska-red-ikona"), tekst);
      izbor.addEventListener("click", () => otvori(beleska, () => padajuca.zatvori(false)));
      red.append(izbor);
      redovi.append(red);
    }
    const sadrzaj = [glava];
    if (beleske.length) sadrzaj.push(redovi);
    else sadrzaj.push(el("p", "beleske-prazno", "Nema sačuvanih beleški"));
    const sve = dugme("beleske-sve padajuca-stavka", "external-link", "Prikaži sve beleške");
    sve.append(el("span", "beleske-sve-strelica", "→"));
    sve.addEventListener("click", () => {
      padajuca.zatvori(false);
      otvoriSve();
    });
    sadrzaj.push(sve);
    lista.replaceChildren(...sadrzaj);
  }

  function nacrtajSve() {
    const beleske = lokalno.stanje().beleske;
    if (!beleske.length) {
      telo.replaceChildren(el("p", "beleske-prazno", "Nema sačuvanih beleški"));
      return;
    }
    const grupe = poTemama(beleske).map(({ tema, beleske: spisak }) => {
      const grupa = el("section", "sve-beleske-grupa");
      const naslovId = `sve-beleske-tema-${tema}`;
      grupa.setAttribute("aria-labelledby", naslovId);
      const h = el("h3", "sve-beleske-tema", ctx.naslovTeme(tema));
      h.id = naslovId;
      const ul = el("ul", "sve-beleske-spisak");
      for (const beleska of spisak) ul.append(stavkaSvih(beleska));
      grupa.append(h, ul);
      return grupa;
    });
    telo.replaceChildren(...grupe);
  }

  function stavkaSvih(beleska) {
    const li = el("li", "sve-beleske-stavka");
    const postoji = ctx.postojiKorak(beleska.tema, beleska.korak);
    const glava = el("div", "sve-beleske-glava");
    if (postoji) {
      const izbor = dugme("sve-beleske-korak", "sticky-note", natpisBeleske(beleska));
      izbor.addEventListener("click", () => otvori(beleska, () => dijalog.close()));
      glava.append(izbor);
    } else {
      const naslov = el("span", "sve-beleske-korak sve-beleske-nema");
      naslov.append(slot("sticky-note"), el("span", "", natpisBeleske(beleska)));
      glava.append(naslov, el("span", "oznaka-nema", "Korak više ne postoji"));
    }
    const ukloni = dugme("sve-beleske-ukloni", "trash", "Ukloni");
    ukloni.setAttribute("aria-label", `Ukloni belešku: ${natpisBeleske(beleska)}`);
    ukloni.addEventListener("click", () => {
      const sledeca = li.nextElementSibling || li.previousElementSibling;
      const grupa = li.closest(".sve-beleske-grupa");
      lokalno.promeni((stanje) => ukloniBelesku(stanje, beleska.tema, beleska.korak));
      li.remove();
      if (grupa && !grupa.querySelector("li")) grupa.remove();
      if (!telo.querySelector("li")) nacrtajSve();
      (sledeca?.querySelector("textarea") || dijalog.querySelector(".sve-beleske-zatvori"))?.focus();
    });
    glava.append(ukloni);
    const oznaka = el("label", "sr", `Komentar: ${natpisBeleske(beleska)}`);
    const polje = el("textarea", "sve-beleske-komentar");
    polje.id = `sve-beleske-komentar-${beleska.tema}-${beleska.korak}`;
    oznaka.htmlFor = polje.id;
    polje.maxLength = NAJVISE_KOMENTARA;
    polje.rows = 2;
    polje.value = beleska.komentar;
    polje.placeholder = "Šta nije jasno u ovom koraku?";
    polje.addEventListener("change", () => {
      const sada = nadjiBelesku(lokalno.stanje(), beleska.tema, beleska.korak);
      if (!sada) return;
      lokalno.promeni((stanje) => postaviBelesku(stanje, { ...sada, komentar: polje.value.slice(0, NAJVISE_KOMENTARA) }));
    });
    li.append(glava, oznaka, polje);
    return li;
  }

  function otvoriSve() {
    povratakSvih = document.activeElement;
    nacrtajSve();
    dijalog.showModal();
    (dijalog.querySelector("textarea") || dijalog.querySelector(".sve-beleske-zatvori"))?.focus();
  }

  dijalog.querySelector(".sve-beleske-zatvori").addEventListener("click", () => dijalog.close());
  let povratakSvih = null;
  dijalog.addEventListener("close", () => {
    const cilj = povratakSvih?.isConnected && povratakSvih.offsetParent ? povratakSvih : dugmeZaglavlja;
    povratakSvih = null;
    cilj.focus();
  });

  function napraviUredjivac() {
    const koren = el("div", "beleska-uredjivac");
    koren.id = "beleska-uredjivac";
    koren.setAttribute("role", "dialog");
    koren.setAttribute("aria-label", "Beleška koraka");
    koren.hidden = true;
    const oznaka = el("label", "beleska-uredjivac-oznaka", "Šta nije jasno u ovom koraku?");
    const polje = el("textarea", "beleska-uredjivac-polje");
    polje.id = "beleska-komentar";
    oznaka.htmlFor = polje.id;
    polje.maxLength = NAJVISE_KOMENTARA;
    polje.rows = 3;
    const dugmad = el("div", "beleska-uredjivac-dugmad");
    const sacuvaj = dugme("beleska-sacuvaj", "bookmark-filled", "Sačuvaj");
    const ukloni = dugme("beleska-ukloni", "trash", "Ukloni");
    dugmad.append(sacuvaj, ukloni);
    koren.append(oznaka, polje, dugmad);
    document.body.append(koren);
    let korak = null;
    let povratak = null;

    function zatvori(vratiFokus = true) {
      if (koren.hidden) return;
      koren.hidden = true;
      korak = null;
      const cilj = povratak?.isConnected ? povratak : dugmeKoraka;
      povratak = null;
      if (vratiFokus) cilj?.focus();
    }

    function postavi(sidro) {
      const kutija = sidro.getBoundingClientRect();
      const sirina = koren.offsetWidth;
      const levo = Math.max(8, Math.min(kutija.right - sirina, window.innerWidth - sirina - 8));
      koren.style.left = `${levo + window.scrollX}px`;
      koren.style.top = `${kutija.bottom + 6 + window.scrollY}px`;
    }

    sacuvaj.addEventListener("click", () => {
      if (!korak) return;
      const { tema, korak: i, naslov } = korak;
      const komentar = polje.value.slice(0, NAJVISE_KOMENTARA);
      zatvori();
      lokalno.promeni((stanje) => postaviBelesku(stanje, { tema, korak: i, naslov, komentar }));
    });
    ukloni.addEventListener("click", () => {
      if (!korak) return;
      const { tema, korak: i } = korak;
      zatvori();
      lokalno.promeni((stanje) => ukloniBelesku(stanje, tema, i));
    });
    koren.addEventListener("keydown", (dogadjaj) => {
      if (dogadjaj.key !== "Escape") return;
      dogadjaj.preventDefault();
      dogadjaj.stopPropagation();
      zatvori();
    });
    document.addEventListener("click", (dogadjaj) => {
      if (koren.hidden || koren.contains(dogadjaj.target) || povratak?.contains(dogadjaj.target)) return;
      if (!dogadjaj.target.isConnected) return;
      zatvori(false);
    });

    return {
      otvoren: () => !koren.hidden,
      zatvori,
      otvori(sidro) {
        const sada = ctx.korakSada();
        if (!sada) return;
        if (!koren.hidden && povratak === sidro) {
          zatvori();
          return;
        }
        padajuca.zatvori(false);
        korak = sada;
        povratak = sidro;
        const postojeca = nadjiBelesku(lokalno.stanje(), sada.tema, sada.korak);
        polje.value = postojeca ? postojeca.komentar : "";
        ukloni.hidden = !postojeca;
        koren.hidden = false;
        postavi(sidro);
        polje.focus();
      },
    };
  }

  function osveziDugmeKoraka() {
    if (!dugmeKoraka) return;
    const sada = ctx.korakSada();
    const ima = Boolean(sada && nadjiBelesku(lokalno.stanje(), sada.tema, sada.korak));
    dugmeKoraka.setAttribute("aria-pressed", String(ima));
    dugmeKoraka.classList.toggle("ima-belesku", ima);
    dugmeKoraka.replaceChildren(slot(ima ? "bookmark-filled" : "bookmark"), el("span", "", "Sačuvaj korak"));
  }

  lokalno.naPromenu(() => {
    osveziDugmeKoraka();
    if (padajuca.otvorena()) nacrtajListu();
  });

  return {
    padajuca,
    uredjivac,
    otvoriSve,
    poveziDugmeKoraka(cvor) {
      uredjivac.zatvori(false);
      dugmeKoraka = cvor;
      cvor.id = "sacuvaj-korak";
      cvor.classList.add("sacuvaj-korak");
      cvor.setAttribute("aria-haspopup", "dialog");
      cvor.setAttribute("aria-controls", "beleska-uredjivac");
      cvor.addEventListener("click", () => uredjivac.otvori(cvor));
      osveziDugmeKoraka();
    },
    osveziDugmeKoraka,
  };
}
