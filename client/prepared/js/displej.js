class Displej {
  constructor(element) {
    this.element = element;
  }

  crtaj(vrednost) {
    this.element.textContent = String(vrednost);
  }

  prikaziOcitavanje(odgovor, telo) {
    if (!odgovor.ok) {
      this.crtaj("Err");
      return;
    }
    this.crtaj(telo.temperatura);
  }
}
