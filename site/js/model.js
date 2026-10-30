export function ucitajKurs(dokument) {
  const teme = dokument && Array.isArray(dokument.teme) ? dokument.teme : null;
  if (!teme || dokument.trajanjeTema !== teme.length) {
    return { ok: false, greska: "Trajanje se ne slaže sa brojem tema.", teme: null };
  }
  return { ok: true, greska: "", kurs: dokument, teme };
}

export function natpisTeme(kurs, n) {
  return `Tema ${n} od ${kurs.trajanjeTema}`;
}

export function procenat(n, trajanje) {
  return Math.round((n / trajanje) * 100);
}

export function polozajiKlizaca(kurs, tekuca) {
  const polozaji = [];
  for (let n = 1; n <= kurs.trajanjeTema; n += 1) {
    polozaji.push({ n, tekuci: n === tekuca, broj: n === tekuca ? String(n) : "" });
  }
  return polozaji;
}

export function pomeriTemu(n, smer, trajanje) {
  const sledeca = n + smer;
  if (sledeca < 1 || sledeca > trajanje) return n;
  return sledeca;
}
