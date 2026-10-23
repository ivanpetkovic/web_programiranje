const adresa = {
    street: "AM",
    number: 14
}

const student = {
    firstName: "Marko",
    lastName: "Markovic",
    score: 8,
    homeAddress: adresa
}

// destrukciona dodela (destruction assignment)

const {firstName, lastName} = student;
console.log(`${firstName} ${lastName}`);

const scores = [10, 20, 30, 40, 50];

const [a, b, ...rest] = scores;

console.log(a,b, rest);

const student2 = {...student};
student2.score = 10;

student2.homeAddress.number = 20;
const student3 = {...student, school: "CS"};

console.log(student, student2, student3);
