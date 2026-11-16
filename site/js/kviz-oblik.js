export function izbor(tema, korak, red, tekst, opcije, analiza, extra = {}) {
  return {
    id: `novo-${tema}-${korak}-${red}`,
    tema,
    korak,
    vrsta: "izbor",
    izvor: "novo",
    zamka: Boolean(extra.zamka),
    tekst,
    kod: extra.kod || "",
    jezik: extra.jezik || "",
    dijagram: extra.dijagram || "",
    analiza: analiza || "",
    opcije: opcije.map(([key, text, ok, why = ""]) => ({ key, text, ok: Boolean(ok), why })),
  };
}

export function ispravka(tema, korak, red, tekst, polazno, resenje, analiza, extra = {}) {
  return {
    id: `novo-${tema}-${korak}-${red}`,
    tema,
    korak,
    vrsta: "ispravka",
    izvor: "novo",
    zamka: false,
    tekst,
    polazno,
    resenje,
    jezik: extra.jezik || "js",
    dijagram: extra.dijagram || "",
    analiza: analiza || "",
  };
}
