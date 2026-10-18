class Prekidac {
  constructor(element) {
    this.element = element;
    this.ukljucen = element.getAttribute("aria-pressed") === "true";
  }

  natpis() {
    if (this.ukljucen) return "Isključi";
    return "Uključi";
  }

  crtaj(ukljucen) {
    this.ukljucen = ukljucen;
    this.element.setAttribute("aria-pressed", String(this.ukljucen));
    this.element.textContent = this.natpis();
  }
}
