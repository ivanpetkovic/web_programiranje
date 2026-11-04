import { napraviPadajucu } from "./padajuca.js";

export function natpisTemeTrake(tema) {
  return tema ? `Tema ${tema.n} – ${tema.title}` : "Uvod";
}

export function natpisKorakaTrake(i, ukupno, naslov) {
  return `Korak ${i + 1} od ${ukupno} – ${naslov}`;
}

function opcija(tekst, { izabrana, tekuca, naIzbor }) {
  const li = document.createElement("li");
  const dugme = document.createElement("button");
  dugme.type = "button";
  dugme.className = "padajuca-stavka";
  dugme.setAttribute("role", "option");
  dugme.setAttribute("aria-selected", String(izabrana));
  if (tekuca) dugme.setAttribute("aria-current", tekuca);
  dugme.textContent = tekst;
  dugme.title = tekst;
  dugme.addEventListener("click", naIzbor);
  li.append(dugme);
  return li;
}

export function napraviTrakuCasa({ naUvod, naTemu, naKorak }) {
  const temaDugme = document.querySelector("#izbor-teme");
  const temaNatpis = document.querySelector("#izbor-teme-natpis");
  const temaLista = document.querySelector("#izbor-teme-lista");
  const korakDugme = document.querySelector("#izbor-koraka-dugme");
  const korakNatpis = document.querySelector("#izbor-koraka-natpis");
  const korakLista = document.querySelector("#izbor-koraka-lista");
  const prethodni = document.querySelector("#traka-prethodni");
  const sledeci = document.querySelector("#traka-sledeci");
  const izborKoraka = document.querySelector("#izbor-koraka");
  let trenutni = { uvod: true, i: 0, koraci: [] };

  const padTeme = napraviPadajucu({
    dugme: temaDugme,
    panel: temaLista,
    stavke: () => [...temaLista.querySelectorAll("button")],
    naOtvori: () => temaLista.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "nearest" }),
  });
  const padKoraka = napraviPadajucu({
    dugme: korakDugme,
    panel: korakLista,
    stavke: () => [...korakLista.querySelectorAll("button")],
    naOtvori: () => korakLista.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "nearest" }),
  });

  prethodni.addEventListener("click", () => {
    if (trenutni.i > 0) naKorak(trenutni.i - 1);
  });
  sledeci.addEventListener("click", () => {
    if (trenutni.i < trenutni.koraci.length - 1) naKorak(trenutni.i + 1);
  });

  function izaberi(pad, radnja) {
    return () => {
      pad.zatvori();
      radnja();
    };
  }

  return {
    osvezi({ uvod, teme, cas, i, koraci }) {
      trenutni = { uvod, i, koraci: uvod ? [] : koraci };
      const otvorena = uvod ? null : teme.find((tema) => tema.n === cas);
      temaNatpis.textContent = natpisTemeTrake(otvorena);
      temaDugme.title = temaNatpis.textContent;
      temaLista.replaceChildren(
        opcija("Uvod", { izabrana: uvod, tekuca: uvod ? "page" : "", naIzbor: izaberi(padTeme, naUvod) }),
        ...teme.map((tema) =>
          opcija(natpisTemeTrake(tema), {
            izabrana: !uvod && tema.n === cas,
            tekuca: !uvod && tema.n === cas ? "page" : "",
            naIzbor: izaberi(padTeme, () => naTemu(tema.n)),
          }),
        ),
      );
      izborKoraka.hidden = uvod;
      if (uvod) {
        padKoraka.zatvori(false);
        korakLista.replaceChildren();
        return;
      }
      const naslov = koraci[i]?.naslov || "";
      korakNatpis.textContent = natpisKorakaTrake(i, koraci.length, naslov);
      korakDugme.title = korakNatpis.textContent;
      prethodni.disabled = i <= 0;
      sledeci.disabled = i >= koraci.length - 1;
      korakLista.replaceChildren(
        ...koraci.map((korak, ki) =>
          opcija(`${ki + 1}. ${korak.naslov}`, {
            izabrana: ki === i,
            tekuca: ki === i ? "step" : "",
            naIzbor: izaberi(padKoraka, () => naKorak(ki)),
          }),
        ),
      );
    },
  };
}
