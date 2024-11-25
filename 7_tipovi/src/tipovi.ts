
// keyof operator

type Point = {
    x: number,
    y: number,
    // z: number
}

type Keys = keyof Point;

const t1: Point = {
    x: 1,
    y: 2
}

function print(key: Keys, point: Point) {
    console.log(`${key}=${point[key]}`);
}

print("x", t1);

// mapirani tipovi

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

type MojTip<T> = {
    [K in keyof T]: T[K]
}

let g2: MojTip<Point>;

interface Task {
    title: string;
    description: string;
    completed: boolean;
}

type TaskPreview = Pick<Task, "completed" | "title">;

const task1: Task = {
    title: "Spremi wp",
    description: "spremi, nauci, itd",
    completed: true,
}


const tp1: TaskPreview = task1;

interface TaskDuration extends Task {
    duration: number,
    subTasks: TaskDuration[],
    finish: () => void
}

type TaskDescription = Omit<Task, "completed">;

const td1: TaskDescription = task1;

let td2: Readonly<TaskDescription>;
// td2.description = "wr";

const task2: TaskDuration = {
    title: "Spremi RWA",
    description: "spremi, nauci, itd",
    completed: false,
    duration: 0,
    subTasks: [],
    finish: () => {
        console.log("finished");
    }
}

type TaskNoFunc = Omit<TaskDuration, "finish">;
const task2nf: TaskNoFunc = task2;


// pokupi kljuceve propertija koji su fje
type FuncPropKeys<T> = {
    [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

type NonFuncProps<T> = Omit<T, FuncPropKeys<T>>;

const t3: NonFuncProps<TaskDuration> = task2;


