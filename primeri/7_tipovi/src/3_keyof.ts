
// keyof operator

type Point = {
    x: number,
    y: number,
    // z: number
}

// PRIMER 1

type Keys = keyof Point;

const t1: Point = {
    x: 1,
    y: 2
}

function print(key: Keys, point: Point) {
    console.log(`${key}=${point[key]}`);
}

print("x", t1);
