export class Blok {
  static vrsta = "";

  constructor(podaci = {}) {
    this.podaci = podaci && typeof podaci === "object" ? podaci : {};
  }

  static prepoznaje() {
    return false;
  }

  static uvoz() {
    return new this({ vrsta: this.vrsta, tekst: "" });
  }

  izvoz() {
    return "";
  }

  natpis() {
    return "";
  }

  ikona() {
    return "text";
  }

  static meni() {
    return [];
  }
}
