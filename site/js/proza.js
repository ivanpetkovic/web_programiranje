function dodajDeo(delovi, tekst, oznaka) {
  if (!tekst && !oznaka) return;
  const prethodni = delovi.at(-1);
  if (!oznaka && prethodni && !prethodni.jako && !prethodni.kod) {
    prethodni.tekst += tekst;
    return;
  }
  delovi.push(oznaka ? { tekst, ...oznaka } : { tekst });
}

export function deloviReda(tekst) {
  const delovi = [];
  const izvor = String(tekst ?? "");
  let i = 0;
  while (i < izvor.length) {
    const jako = izvor.indexOf("**", i);
    const kod = izvor.indexOf("`", i);
    const kandidati = [jako, kod].filter((mesto) => mesto >= 0);
    if (kandidati.length === 0) {
      dodajDeo(delovi, izvor.slice(i));
      break;
    }
    const od = Math.min(...kandidati);
    if (od > i) dodajDeo(delovi, izvor.slice(i, od));
    if (od === jako) {
      const kraj = izvor.indexOf("**", od + 2);
      if (kraj < 0) {
        dodajDeo(delovi, izvor.slice(od));
        break;
      }
      dodajDeo(delovi, izvor.slice(od + 2, kraj), { jako: true });
      i = kraj + 2;
      continue;
    }
    const kraj = izvor.indexOf("`", od + 1);
    if (kraj < 0) {
      dodajDeo(delovi, izvor.slice(od));
      break;
    }
    dodajDeo(delovi, izvor.slice(od + 1, kraj), { kod: true });
    i = kraj + 1;
  }
  if (delovi.length === 0) delovi.push({ tekst: "" });
  return delovi;
}

function celijeTabele(linija) {
  const sredina = linija.trim().replace(/^\|/, "").replace(/\|$/, "");
  if (!sredina.includes("|")) return null;
  const celije = sredina.split("|").map((celija) => celija.trim());
  if (celije.length < 2 || celije.some((celija) => celija === "")) return null;
  return celije;
}

function razdelnikTabele(linija) {
  return /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(linija.trim());
}

function naslovLinije(linija) {
  return /^(#{1,6})\s+(\S.*)$/.exec(linija.trim());
}

function blokOdLinija(linije) {
  if (linije.every((linija) => /^-\s+\S/.test(linija.trim()))) {
    return {
      vrsta: "lista",
      stavke: linije.map((linija) => deloviReda(linija.trim().replace(/^-\s+/, ""))),
    };
  }
  if (linije.every((linija) => /^\d+\.\s+\S/.test(linija.trim()))) {
    return {
      vrsta: "brojna",
      stavke: linije.map((linija) => deloviReda(linija.trim().replace(/^\d+\.\s+/, ""))),
    };
  }
  const bezRazdelnika = linije.filter((linija) => !razdelnikTabele(linija));
  const tabela = bezRazdelnika.map(celijeTabele);
  if (
    tabela.length >= 2
    && tabela.every((red) => red && red.length === tabela[0].length)
  ) {
    return {
      vrsta: "tabela",
      zaglavlje: tabela[0].map((celija) => deloviReda(celija)),
      redovi: tabela.slice(1).map((red) => red.map((celija) => deloviReda(celija))),
    };
  }
  return { vrsta: "pasus", delovi: deloviReda(linije.join("\n")) };
}

export function blokoviProze(tekst) {
  const izvor = String(tekst ?? "");
  if (!izvor.trim()) return [{ vrsta: "pasus", delovi: [{ tekst: izvor }] }];
  const blokovi = [];
  for (const komad of izvor.split(/\n{2,}/)) {
    const linije = komad.split(/\n/).map((linija) => linija.trimEnd()).filter((linija) => linija.trim() !== "");
    if (linije.length === 0) {
      blokovi.push({ vrsta: "pasus", delovi: [{ tekst: "" }] });
      continue;
    }
    let tekuce = [];
    const zatvori = () => {
      if (!tekuce.length) return;
      blokovi.push(blokOdLinija(tekuce));
      tekuce = [];
    };
    for (const linija of linije) {
      const naslov = naslovLinije(linija);
      if (!naslov) {
        tekuce.push(linija);
        continue;
      }
      zatvori();
      blokovi.push({ vrsta: "naslov", nivo: naslov[1].length, delovi: deloviReda(naslov[2].trim()) });
    }
    zatvori();
  }
  return blokovi;
}
