export function linijeTeksta(tekst) {
  const s = String(tekst ?? "").replace(/\n$/, "");
  if (s === "") return [];
  return s.split("\n");
}

function linijePrikaza(tekst) {
  const s = String(tekst ?? "");
  if (s === "") return [];
  return s.split("\n");
}

export function spojeniPrikaz(ranije, dodatak) {
  const nove = linijePrikaza(dodatak);
  const stare = linijePrikaza(ranije);
  if (!stare.length || !nove.length) {
    return nove.map((tekst) => ({ tekst, tip: "isto" }));
  }
  const izlaz = stare.map((tekst) => ({ tekst, tip: "isto" }));
  if (izlaz[izlaz.length - 1].tekst !== "") izlaz.push({ tekst: "", tip: "isto" });
  for (const tekst of nove) izlaz.push({ tekst, tip: "dodato" });
  return izlaz;
}

export function razlikaLinija(prethodni, tekuci) {
  const a = linijeTeksta(prethodni);
  const b = linijeTeksta(tekuci);
  const n = a.length;
  const m = b.length;
  const dp = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1));
  for (let i = n - 1; i >= 0; i -= 1) {
    for (let j = m - 1; j >= 0; j -= 1) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const izlaz = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      izlaz.push({ tip: "isto", tekst: b[j] });
      i += 1;
      j += 1;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      izlaz.push({ tip: "obrisano", tekst: a[i] });
      i += 1;
    } else {
      izlaz.push({ tip: "dodato", tekst: b[j] });
      j += 1;
    }
  }
  while (i < n) {
    izlaz.push({ tip: "obrisano", tekst: a[i] });
    i += 1;
  }
  while (j < m) {
    izlaz.push({ tip: "dodato", tekst: b[j] });
    j += 1;
  }
  return izlaz;
}

export function razlikaOriginala(prethodni, tekuci, radna) {
  void radna;
  if (prethodni == null) {
    return linijeTeksta(tekuci).map((tekst) => ({ tip: "dodato", tekst }));
  }
  return razlikaLinija(prethodni, tekuci);
}

export function prethodniUKursu(koraci, indeks) {
  const putanja = koraci[indeks].putanja;
  for (let i = indeks - 1; i >= 0; i -= 1) {
    if (koraci[i].putanja === putanja) return koraci[i].original;
  }
  return null;
}

export function originalDo(koraci, indeks, putanja) {
  for (let i = Math.min(indeks, koraci.length - 1); i >= 0; i -= 1) {
    if (koraci[i].putanja === putanja) return { original: koraci[i].original, indeks: i };
  }
  return null;
}
