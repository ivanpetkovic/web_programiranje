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

export function blokoviProze(tekst) {
  const izvor = String(tekst ?? "");
  if (!izvor.trim()) return [{ vrsta: "pasus", delovi: [{ tekst: izvor }] }];
  return izvor.split(/\n{2,}/).map((komad) => {
    const linije = komad.split(/\n/).map((linija) => linija.trimEnd()).filter((linija) => linija.trim() !== "");
    if (linije.length === 0) return { vrsta: "pasus", delovi: [{ tekst: "" }] };
    const naslov = linije.length === 1 ? /^(#{1,6})\s+(\S.*)$/.exec(linije[0].trim()) : null;
    if (naslov) {
      return { vrsta: "naslov", nivo: naslov[1].length, delovi: deloviReda(naslov[2].trim()) };
    }
    if (linije.every((linija) => /^-\s+\S/.test(linija.trim()))) {
      return {
        vrsta: "lista",
        stavke: linije.map((linija) => deloviReda(linija.trim().replace(/^-\s+/, ""))),
      };
    }
    return { vrsta: "pasus", delovi: deloviReda(linije.join("\n")) };
  });
}
