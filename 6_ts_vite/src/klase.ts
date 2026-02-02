import { Circle } from "./models/circle";
import { Community } from "./models/community";
import { Person, Student, Worker } from "./models/person";
import { Square } from "./models/square";


const krug = new Circle(3.0);
console.log(`Pk=${krug.getArea()}`);

const kvadrat = new Square(4);
console.log(`Pkv=${kvadrat.getArea()}`);

const marko: Student = {
    id: "w3532w5",
    name: "Marko",
    age: 20,
    prosekOcena: 8.4
}

const petar: Worker = {
    id: "34t4",
    name: "Petar",
    age: 23,
    prosecnaPlata: 1000
}

const community = new Community<Person>();
community.add(marko);
community.add(petar);
console.log(`Prosek godina je ${community.getAverageAge()}`);
