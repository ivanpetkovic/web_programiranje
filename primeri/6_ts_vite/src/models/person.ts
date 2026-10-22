export interface Person {
    id: string,
    name: string,
    age: number
}

type Evra = number;

export interface Student extends Person {
    prosekOcena: number;
}

export interface Worker extends Person {
    prosecnaPlata: Evra;
}