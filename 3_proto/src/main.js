const a = 4;

const proto = Object.getPrototypeOf(a);

// console.log(proto);

function someFunc() {}
// console.log(someFunc.prototype);

function Person(ime, prezime) {
    this.ime = ime;
    this.prezime = prezime;
    this.print = function() {
        return `Ime: ${this.ime}, Prezime: ${this.prezime}`;
    }
}

const p1 = new Person("marko", "markovic");
const p2 = new Person("petar", "petrovic");
console.log(p1.print());

// Person - konstruktorska fja
// Person.prototype - prototipski objekat
// prototype svojstvo postoji SAMO KOD fja
// p1.__proto__ - prototipski objekat
Person.prototype.getFullName = function() {
    return this.ime + " " + this.prezime;
}

function Student(ime, prezime, indeks) {
  // this._super = Person.call(ime, prezime);
  this.indeks = indeks;

  // zbog nasledjivanja clanova iz roditeljskog konstruktora
  Person.call(this, ime, prezime);
}

Student.prototype = Object.create(Person.prototype);
// Student.__proto__ = Person.prototype; 

Student.prototype.study = () => {
  console.log (`${this.indeks} is studying`);
}

const s1 = new Student("ana", "jovanovic", 1200);
