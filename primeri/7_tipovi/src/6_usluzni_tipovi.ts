
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

const taskPreview: TaskPreview = {
    title: "Polozi wp",
    completed: false
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


