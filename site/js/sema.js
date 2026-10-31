const NAZIVI = {
  string: "tekst",
  number: "broj",
  boolean: "logička vrednost",
  object: "objekat",
  array: "niz",
  null: "null",
  integer: "ceo broj",
};

export function proveriSemu(sema, vrednost) {
  const greske = [];
  cvor(sema, vrednost, "kurs", greske, sema);
  return { ok: greske.length === 0, greske };
}

function cvor(sema, vrednost, put, greske, koren) {
  if (typeof sema.$ref === "string") {
    cvor(odrediste(koren, sema.$ref), vrednost, put, greske, koren);
    return;
  }
  if (Array.isArray(sema.enum) && !sema.enum.includes(vrednost)) {
    greske.push(`${put}: vrednost nije dozvoljena.`);
    return;
  }
  if (sema.type !== undefined && !tipOdgovara(sema.type, vrednost)) {
    greske.push(`${put}: očekivan je ${nazivTipa(sema.type)}.`);
    return;
  }
  if (Array.isArray(vrednost)) {
    if (typeof sema.minItems === "number" && vrednost.length < sema.minItems) {
      greske.push(`${put}: očekivano je najmanje ${sema.minItems}.`);
    }
    if (sema.items) vrednost.forEach((stavka, i) => cvor(sema.items, stavka, `${put}/${i}`, greske, koren));
    return;
  }
  if (!vrednost || typeof vrednost !== "object") return;
  const svojstva = sema.properties || {};
  for (const ime of sema.required || []) {
    if (!Object.hasOwn(vrednost, ime)) greske.push(`${put}: nedostaje ${ime}.`);
  }
  for (const [ime, val] of Object.entries(vrednost)) {
    if (svojstva[ime]) cvor(svojstva[ime], val, `${put}/${ime}`, greske, koren);
    else if (sema.additionalProperties === false) greske.push(`${put}: polje ${ime} nije u šemi.`);
  }
}

function odrediste(koren, ref) {
  let trenutni = koren;
  for (const deo of ref.slice(2).split("/")) trenutni = trenutni[deo];
  return trenutni;
}

function tipOdgovara(tip, vrednost) {
  const tipovi = Array.isArray(tip) ? tip : [tip];
  return tipovi.some((ime) => {
    if (ime === "array") return Array.isArray(vrednost);
    if (ime === "object") return vrednost !== null && typeof vrednost === "object" && !Array.isArray(vrednost);
    if (ime === "null") return vrednost === null;
    if (ime === "integer") return typeof vrednost === "number" && Number.isInteger(vrednost);
    return typeof vrednost === ime;
  });
}

function nazivTipa(tip) {
  const tipovi = Array.isArray(tip) ? tip : [tip];
  return tipovi.map((ime) => NAZIVI[ime] || ime).join(" ili ");
}
