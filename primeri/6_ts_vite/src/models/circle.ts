import { Shape } from "./shape";

export class Circle extends Shape {
    private r: number;

    constructor(r: number) {
        super();
        this.r = r;
    }

    getArea(): number {
        return Math.PI * Math.pow(this.r, 2);
    }
}
