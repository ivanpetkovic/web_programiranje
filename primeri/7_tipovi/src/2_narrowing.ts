// unija tipova
type Id = number | string;

type Fish = {
    swim: () => void
}

type Bird = {
    fly: () => void
}

type Animal = Fish | Bird ;

function padLeft(padding: number | string, input: string) {
    if (typeof padding == "number") {
        return " ".repeat(padding) + input;
    }
    return padding + input;
}

console.log(padLeft(20, "Programiranje"));
console.log(padLeft("Web ", "Programiranje"));

function move(animal: Fish | Bird) {
    if ("swim" in animal) {
        return animal.swim();
    }
    return animal.fly();

}