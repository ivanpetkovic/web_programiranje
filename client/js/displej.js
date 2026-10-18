class Displej {
  constructor(element) {
    this.element = element;
  }

  crtaj(vrednost) {
    this.element.textContent = String(vrednost);
  }

  posleCitanja(response, data) {
    if (!response.ok) {
      this.crtaj("Err");
      return;
    }
    this.crtaj(data.temperatura);
  }
}
