function obradi(tacke) {
  const izabrane = tacke.filter((tacka) => tacka.temperatura >= 24);
  const visine = izabrane.map((tacka) => tacka.temperatura);
  const zbir = visine.reduce((zbir, visina) => zbir + visina, 0);
  const prosek = visine.length ? zbir / visine.length : 0;
  return { visine, prosek };
}

function nacrtaj(canvas, visine) {
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  if (visine.length < 2) return;
  const min = Math.min(...visine);
  const max = Math.max(...visine);
  const span = max - min || 1;
  ctx.strokeStyle = "#ffb000";
  ctx.lineWidth = 2;
  ctx.beginPath();
  visine.forEach((visina, i) => {
    const x = (i / (visine.length - 1)) * (w - 16) + 8;
    const y = h - 8 - ((visina - min) / span) * (h - 16);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
}
