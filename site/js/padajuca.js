let otvorena = null;

export function napraviPadajucu({ dugme, panel, stavke = () => [], naOtvori, naZatvori }) {
  const padajuca = {
    otvorena: () => !panel.hidden,
    otvori() {
      if (!panel.hidden) return;
      if (otvorena && otvorena !== padajuca) otvorena.zatvori(false);
      otvorena = padajuca;
      panel.hidden = false;
      dugme.setAttribute("aria-expanded", "true");
      naOtvori?.();
    },
    zatvori(vratiFokus = true) {
      if (panel.hidden) return;
      panel.hidden = true;
      dugme.setAttribute("aria-expanded", "false");
      if (otvorena === padajuca) otvorena = null;
      naZatvori?.();
      if (vratiFokus) dugme.focus();
    },
    prebaci() {
      if (panel.hidden) padajuca.otvori();
      else padajuca.zatvori();
    },
  };

  dugme.addEventListener("click", () => padajuca.prebaci());
  dugme.addEventListener("keydown", (dogadjaj) => {
    if (dogadjaj.key !== "ArrowDown" || !panel.hidden) return;
    dogadjaj.preventDefault();
    padajuca.otvori();
    stavke()[0]?.focus();
  });
  panel.addEventListener("keydown", (dogadjaj) => {
    if (dogadjaj.key === "Escape") {
      dogadjaj.preventDefault();
      dogadjaj.stopPropagation();
      padajuca.zatvori();
      return;
    }
    if (dogadjaj.key !== "ArrowDown" && dogadjaj.key !== "ArrowUp") return;
    const lista = stavke();
    if (!lista.length) return;
    const sada = lista.indexOf(document.activeElement);
    if (sada < 0 && !dogadjaj.target.closest("[role='option'], .padajuca-stavka")) return;
    dogadjaj.preventDefault();
    const korak = dogadjaj.key === "ArrowDown" ? 1 : -1;
    const sledeci = sada < 0 ? 0 : Math.min(lista.length - 1, Math.max(0, sada + korak));
    lista[sledeci].focus();
  });
  document.addEventListener("click", (dogadjaj) => {
    if (panel.hidden) return;
    if (panel.contains(dogadjaj.target) || dugme.contains(dogadjaj.target)) return;
    if (!dogadjaj.target.isConnected) return;
    const fokusUnutra = panel.contains(document.activeElement);
    padajuca.zatvori(fokusUnutra || document.activeElement === document.body);
  });
  window.addEventListener("keydown", (dogadjaj) => {
    if (dogadjaj.key !== "Escape" || panel.hidden) return;
    if (document.activeElement === dugme) padajuca.zatvori();
  });
  return padajuca;
}

export function zatvoriOtvorenu() {
  otvorena?.zatvori(false);
}
