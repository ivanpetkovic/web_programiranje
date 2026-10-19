export function ucitajKurs(dokument) {
  const nedelje = dokument && Array.isArray(dokument.nedelje) ? dokument.nedelje : null;
  if (!nedelje || dokument.trajanjeNedelja !== nedelje.length) {
    return { ok: false, greska: "Trajanje se ne slaže sa brojem nedelja.", nedelje: null };
  }
  return { ok: true, greska: "", kurs: dokument, nedelje };
}

export function natpisNedelje(kurs, n) {
  return `Nedelja ${n} od ${kurs.trajanjeNedelja}`;
}

export function procenat(n, trajanje) {
  return Math.round((n / trajanje) * 100);
}

export function polozajiKlizaca(kurs, tekuca) {
  const polozaji = [];
  for (let n = 1; n <= kurs.trajanjeNedelja; n += 1) {
    polozaji.push({ n, tekuci: n === tekuca, broj: n === tekuca ? String(n) : "" });
  }
  return polozaji;
}

export function pomeriNedelju(n, smer, trajanje) {
  const sledeca = n + smer;
  if (sledeca < 1 || sledeca > trajanje) return n;
  return sledeca;
}
