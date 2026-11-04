import { izveziStanje, uveziStanje } from "./lokalno-stanje.js";
import { napraviPadajucu } from "./padajuca.js";

export const PALETE_SAJTA = [
  ["mornar", "Plava"],
  ["ugalj", "Ugalj"],
  ["pesak", "Pesak"],
  ["terakota", "Terakota"],
];

export const VELICINE = [
  ["0.875", "A−", "Sitniji tekst"],
  ["1", "A", "Normalan tekst"],
  ["1.125", "A+", "Krupniji tekst"],
];

export const NACINI = [
  ["predavanja", "Predavanja", "monitor"],
  ["samostalni", "Samostalni rad", "book-open-text"],
];

export const IME_FAJLA_STANJA = "veb-programiranje-stanje.json";

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
  return cvor;
}

function bedz() {
  const cvor = el("span", "opcije-bedz");
  cvor.append(slot("check"));
  return cvor;
}

function glava(ikona, naslov, opis, id) {
  const omot = el("div", "opcije-glava");
  const tekst = el("div", "opcije-glava-tekst");
  const h = el("h3", "opcije-naslov", naslov);
  h.id = id;
  tekst.append(h);
  if (opis) tekst.append(el("p", "opcije-opis", opis));
  omot.append(slot(ikona, "opcije-glava-ikona"), tekst);
  return omot;
}

function odeljak(ime, id) {
  const cvor = el("section", `opcije-odeljak opcije-${ime}`);
  cvor.setAttribute("aria-labelledby", id);
  return cvor;
}

export function nacrtajKarticeModa({ modSada, naIzbor, prefiks }) {
  const omot = el("div", "kartice-moda");
  omot.setAttribute("role", "group");
  omot.setAttribute("aria-label", "Način korišćenja");
  const dugmad = NACINI.map(([id, natpis, ikona]) => {
    const dugme = el("button", "kartica-moda");
    dugme.type = "button";
    dugme.id = `${prefiks}-${id}`;
    dugme.dataset.mod = id;
    dugme.append(slot(ikona, "kartica-moda-ikona"), el("span", "kartica-moda-natpis", natpis), bedz());
    dugme.addEventListener("click", () => naIzbor(id));
    return dugme;
  });
  omot.append(...dugmad);
  return {
    koren: omot,
    osvezi() {
      const sada = modSada();
      for (const dugme of dugmad) dugme.setAttribute("aria-pressed", String(dugme.dataset.mod === sada));
    },
  };
}

export function nacrtajOdeljke(ctx) {
  const { prefiks } = ctx;
  const koren = el("div", "opcije-odeljci");

  const paleta = odeljak("paleta", `${prefiks}-paleta-naslov`);
  paleta.append(glava("palette", "Paleta", "Izaberite temu boja aplikacije.", `${prefiks}-paleta-naslov`));
  const plocice = el("div", "palete");
  plocice.setAttribute("role", "group");
  plocice.setAttribute("aria-label", "Paleta");
  const dugmadPalete = PALETE_SAJTA.map(([id, ime]) => {
    const dugme = el("button", "paleta-plocica");
    dugme.type = "button";
    dugme.dataset.paleta = id;
    dugme.setAttribute("aria-label", ime);
    dugme.title = ime;
    const slika = el("img");
    slika.src = `/icons/teme/${id}.png`;
    slika.alt = "";
    slika.width = 66;
    slika.height = 40;
    dugme.append(slika, bedz());
    dugme.addEventListener("click", () => ctx.zakucajTemu(id));
    return dugme;
  });
  plocice.append(...dugmadPalete);
  paleta.append(plocice);

  const font = odeljak("font", `${prefiks}-font-naslov`);
  font.append(glava("a-large-small", "Veličina fonta", "Podesite veličinu teksta na desktopu.", `${prefiks}-font-naslov`));
  const segment = el("div", "segment-fonta");
  segment.setAttribute("role", "group");
  segment.setAttribute("aria-label", "Veličina fonta");
  const dugmadFonta = VELICINE.map(([skala, natpis, opis]) => {
    const dugme = el("button", "", natpis);
    dugme.type = "button";
    dugme.dataset.skala = skala;
    dugme.setAttribute("aria-label", opis);
    dugme.addEventListener("click", () => ctx.postaviSkalu(skala));
    return dugme;
  });
  segment.append(...dugmadFonta);
  font.append(segment);

  const nacin = odeljak("nacin", `${prefiks}-nacin-naslov`);
  nacin.append(glava("layers", "Način korišćenja", "Odredite način na koji koristite aplikaciju.", `${prefiks}-nacin-naslov`));
  const kartice = nacrtajKarticeModa({ modSada: ctx.modSada, naIzbor: ctx.postaviMod, prefiks });
  nacin.append(kartice.koren);

  const stanje = odeljak("stanje", `${prefiks}-stanje-naslov`);
  const glavaStanja = glava("database", "Lokalno stanje", "", `${prefiks}-stanje-naslov`);
  const bedzStanja = el("span", "bedz-stanja");
  bedzStanja.setAttribute("role", "status");
  const bedzIkona = slot("check");
  const bedzTekst = el("span", "", "Sačuvano lokalno");
  bedzStanja.append(bedzIkona, bedzTekst);
  glavaStanja.append(bedzStanja);
  const opisStanja = el("p", "opcije-opis opis-stanja", "Napredak, beleške i podešavanja čuvaju se samo u ovom browseru, ne na serveru.");
  const dugmadStanja = el("div", "dugmad-stanja");
  const ucitaj = el("button", "dugme-stanja");
  ucitaj.type = "button";
  ucitaj.append(slot("upload"), el("span", "", "Load"));
  ucitaj.setAttribute("aria-label", "Load: učitaj stanje iz fajla");
  const sacuvaj = el("button", "dugme-stanja");
  sacuvaj.type = "button";
  sacuvaj.append(slot("download"), el("span", "", "Save"));
  sacuvaj.setAttribute("aria-label", "Save: sačuvaj stanje u fajl");
  const obrisi = el("button", "dugme-stanja dugme-opasno");
  obrisi.type = "button";
  obrisi.append(slot("trash"), el("span", "", "Obriši progres"));
  const fajl = el("input", "sr");
  fajl.type = "file";
  fajl.accept = "application/json,.json";
  fajl.tabIndex = -1;
  fajl.setAttribute("aria-hidden", "true");
  const poruka = el("p", "poruka-stanja");
  poruka.setAttribute("role", "status");
  poruka.hidden = true;
  dugmadStanja.append(ucitaj, sacuvaj, obrisi);
  stanje.append(glavaStanja, opisStanja, dugmadStanja, poruka, fajl);

  function javi(tekst, greska = false) {
    poruka.textContent = tekst;
    poruka.classList.toggle("poruka-greska", greska);
    poruka.hidden = !tekst;
  }

  ucitaj.addEventListener("click", () => {
    javi("");
    fajl.value = "";
    fajl.click();
  });
  fajl.addEventListener("change", async () => {
    const izabran = fajl.files?.[0];
    if (!izabran) return;
    const ishod = uveziStanje(await izabran.text());
    if (!ishod.ok) {
      javi(ishod.greska, true);
      return;
    }
    ctx.lokalno.zameni(ishod.stanje);
    ctx.primeniStanje();
    javi("Stanje je učitano.");
  });
  sacuvaj.addEventListener("click", () => {
    javi("");
    const blob = new Blob([izveziStanje(ctx.lokalno.stanje())], { type: "application/json" });
    const adresa = URL.createObjectURL(blob);
    const veza = el("a");
    veza.href = adresa;
    veza.download = IME_FAJLA_STANJA;
    document.body.append(veza);
    veza.click();
    veza.remove();
    setTimeout(() => URL.revokeObjectURL(adresa), 1000);
  });
  obrisi.addEventListener("click", () => {
    javi("");
    if (!window.confirm("Obrisati napredak, beleške i podešavanja sačuvane u ovom browseru? Radne verzije editora ostaju.")) return;
    ctx.obrisiProgres();
  });

  const razdelnik = () => el("hr", "opcije-razdelnik");
  koren.append(paleta, razdelnik(), font, razdelnik(), nacin, razdelnik(), stanje);

  function osvezi() {
    const sadaPaleta = ctx.paletaSada();
    for (const dugme of dugmadPalete) dugme.setAttribute("aria-pressed", String(dugme.dataset.paleta === sadaPaleta));
    const skala = ctx.skalaFonta();
    for (const dugme of dugmadFonta) dugme.setAttribute("aria-pressed", String(dugme.dataset.skala === skala));
    kartice.osvezi();
    const ok = ctx.lokalno.poslednjiUpisOk();
    bedzStanja.classList.toggle("bedz-upozorenje", !ok);
    bedzIkona.dataset.ikona = ok ? "check" : "info";
    bedzIkona.replaceChildren();
    const znak = ctx.ikonica?.(bedzIkona.dataset.ikona);
    if (znak) bedzIkona.append(znak);
    bedzTekst.textContent = ok ? "Sačuvano lokalno" : "Nije sačuvano";
  }

  ctx.lokalno.naPromenu(osvezi);
  osvezi();
  return { koren, osvezi };
}

export function napraviOpcije(ctx) {
  const dugme = document.querySelector("#opcije-dugme");
  const panel = document.querySelector("#opcije-panel");
  const strelica = dugme.querySelector(".opcije-strelica");
  const odeljci = nacrtajOdeljke({ ...ctx, prefiks: "opcije" });
  panel.append(odeljci.koren);

  function strelicom(ime) {
    strelica.dataset.ikona = ime;
    strelica.replaceChildren();
    const znak = ctx.ikonica(ime);
    if (znak) strelica.append(znak);
  }

  const padajuca = napraviPadajucu({
    dugme,
    panel,
    stavke: () => [...panel.querySelectorAll("button")],
    naOtvori: () => {
      odeljci.osvezi();
      strelicom("chevron-up");
    },
    naZatvori: () => strelicom("chevron-down"),
  });
  return { padajuca, osvezi: odeljci.osvezi };
}

export function napraviPrviIzbor(ctx) {
  const dijalog = document.querySelector("#prvi-izbor");
  const mesto = dijalog.querySelector(".prvi-izbor-kartice");
  const kartice = nacrtajKarticeModa({
    modSada: () => null,
    prefiks: "prvi-izbor",
    naIzbor: (mod) => {
      ctx.postaviMod(mod);
      dijalog.close();
    },
  });
  mesto.replaceChildren(kartice.koren);
  kartice.osvezi();
  dijalog.addEventListener("cancel", () => {
    ctx.postaviMod("predavanja");
  });
  return {
    pokaziAkoTreba() {
      if (ctx.lokalno.stanje().podesavanja.mod !== null || dijalog.open) return;
      dijalog.showModal();
      dijalog.querySelector(".kartica-moda")?.focus();
    },
  };
}
