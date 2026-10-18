const prag = 24;
const BOJA_LINIJE = "#ffb000";
const DEBLJINA_LINIJE = 2;
const MARGINA = 8;
const NAJMANJE_VISINA = 2;

function iznadPraga(tacke) {
  return tacke.filter((tacka) => tacka.temperatura >= prag);
}

function temperature(tacke) {
  return tacke.map((tacka) => tacka.temperatura);
}

function prosek(brojevi) {
  if (brojevi.length === 0) return 0;
  const zbir = brojevi.reduce((ukupno, broj) => ukupno + broj, 0);
  return zbir / brojevi.length;
}

function pripremiLiniju(tacke) {
  const visine = temperature(iznadPraga(tacke));
  return { visine, prosek: prosek(visine) };
}

function polozaj(visina, indeks, skala) {
  const x = (indeks / (skala.broj - 1)) * (skala.sirina - 2 * MARGINA) + MARGINA;
  const y =
    skala.visina - MARGINA - ((visina - skala.najniza) / skala.raspon) * (skala.visina - 2 * MARGINA);
  return { x, y };
}

function povuciSegmente(olovka, visine, sirina, visina) {
  const najniza = Math.min(...visine);
  const najvisa = Math.max(...visine);
  const skala = {
    broj: visine.length,
    sirina,
    visina,
    najniza,
    raspon: najvisa - najniza || 1,
  };
  olovka.strokeStyle = BOJA_LINIJE;
  olovka.lineWidth = DEBLJINA_LINIJE;
  olovka.beginPath();
  visine.forEach((vrednost, indeks) => {
    const tacka = polozaj(vrednost, indeks, skala);
    if (indeks === 0) olovka.moveTo(tacka.x, tacka.y);
    else olovka.lineTo(tacka.x, tacka.y);
  });
  olovka.stroke();
}

function nacrtajLiniju(canvas, visine) {
  const olovka = canvas.getContext("2d");
  olovka.clearRect(0, 0, canvas.width, canvas.height);
  if (visine.length < NAJMANJE_VISINA) return;
  povuciSegmente(olovka, visine, canvas.width, canvas.height);
}
