interface Coordinate {
    x: number;
    y: number;
}

interface Location extends Coordinate{
    name: string;
}
// type alias
type Centimeters = number;

interface Size {
    width: Centimeters;
    height: Centimeters;
}


const point = {
    x: 34,
    y: 23,
    name: "Nis"
}

const point2 = {
    x: 23,
    y: 27,
    z: 26
}

interface DistanceCalculator {
    (coords: Coordinate): number,
}

const getDistance2: DistanceCalculator = (coords: Coordinate) => {
    return coords.y;
}

function getDistance(coords: Coordinate): number {
    return Math.sqrt(coords.x * coords.x + coords.y * coords.y);
}

console.log("tacka=", point);
console.log(`Distanca je ${getDistance(point)}`);
// type inferrence, duck typing

const room: Size = {
    width: 30,
    height: 20
}

console.log(room);