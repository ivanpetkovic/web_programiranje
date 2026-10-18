class Prekidac {
  constructor(element) {
    this.element = element;
    this.ukljucen = element.getAttribute("aria-pressed") === "true";
  }

  crtaj(ukljucen) {
    this.ukljucen = ukljucen;
    this.element.setAttribute("aria-pressed", String(this.ukljucen));
    this.element.textContent = this.ukljucen ? "Isključi" : "Uključi";
  }
}
