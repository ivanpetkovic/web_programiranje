// PRIMER 1

interface Person {
    age: number
}

type Grupa = {
    [key: string] : Person
}

const grupa: Grupa = {
    ana : {
        age: 20
    },
    marko: {
        age: 30
    }
}

console.log(grupa);

// PRIMER 2

type Soldier = {
    run: () => void,
    attack: () => void,
    defend: () => void,
    cooperate: () => void
}

type Skills<T> = {
    [Property in keyof T]: number;
}

const skillTree: Skills<Soldier> = {
    attack: 10,
    cooperate: 3,
    defend: 8,
    run: 8
};

// PRIMER 3

type MojTip<T> = {
    [K in keyof T]: T[K]
}

let g2: MojTip<Point>;
