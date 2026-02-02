import { Shape } from "./shape";

export class Square extends Shape {

    private a: number;

    constructor(a: number) {
        super();
        this.a = a;
    }

    getArea(): number {
        return Math.pow(this.a, 2);
    }
}