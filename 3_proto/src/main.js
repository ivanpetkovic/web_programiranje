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

