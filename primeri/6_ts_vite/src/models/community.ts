import { Person } from "./person";

export class Community<T extends Person> {
    private members: T[];

    constructor() {
        this.members = [];
    }

    add(newMember: T) {
        this.members.push(newMember);
    }

    getAverageAge() {
        const suma = this.members.reduce((acc, member: T) => acc += member.age, 0);
        return suma / this.members.length;
    }

}