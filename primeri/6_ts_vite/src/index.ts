let x: number = 0;

function max(a: number, b: number): number {
    return a > b ? a : b;
}

console.log(max(5, 7));

const niz: number[] = [2, 5, -8, 9, -1, 4, 7, -7];
const suma = niz
    .filter((x) => x > 0)
    .reduce((acc: number, x) => {
        acc += x;
        return acc;
    }, 0);

console.log(`Suma je ${suma}`);

enum Status {
    OK = 1,
    Warning = 2,
    Error = 3
}

const networkStatus: Status = Status.OK;
console.log(`Status = ${networkStatus}`);