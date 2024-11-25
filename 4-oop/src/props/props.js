export class Proizvod {

  constructor(sifra, naziv, cena) {
    this.sifra = sifra;
    this.naziv = naziv;
    this._cena = cena;
    this._kolicina = 0;
  }

  get kolicina() {
    return this._kolicina;
  }

  set kolicina(novaKolicina) {
    this._kolicina = novaKolicina;
    console.log(`%c Cena ${this.cena}`, 'background-color:blue; color:white');
  }

  get cena() {
    if (this._kolicina > 10 ) {
      return this._cena * 0.8;
    } else if (this._kolicina < 5) {
      return this._cena  * 1.5;
    } else {
      return this._cena;
    }
  }
 
  
}


