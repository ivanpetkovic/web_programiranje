console.log("Hello world");

const x = {
    ime: "Milan",
    prezime: "Ivanovic"
};
let y = x;
y.prezime = "Markovic";

console.log(max(4, 7));


function max(a, b) {
    return a > b ? a : b;
}

const max2 = (a, b) => a > b ? a : b;

// console.log(max2(10, 5));

// console.log(typeof max2);


const niz = [2, 4, 7, 8, 10, 15, 21];

// const niz2 = niz.map( (broj) => broj + 3);
// console.log(niz2);
// console.log(typeof niz);

const suma = niz
    .map( (broj) => broj + 3)
    .filter((broj) => broj % 2 === 0)
    .reduce((acc, current) => acc += current, 0);


// console.log(`Suma: ${suma}`);

const recenica = "Web programiranje je predmet na 3. godini";
const niz2 = recenica.split("")
    .filter(c => c !== "e" && c !== " ")
    .join("");
// console.log(niz2);


const noviElement = document.createElement("p");
noviElement.innerHTML = "Ja sam novi element";
noviElement.className = "clickable";
document.body.appendChild(noviElement);

const listItems = document.querySelectorAll("p.clickable");
listItems.forEach((el) => {
    el.addEventListener("click", (event) => {
        el.style.border = "3px dashed black";
        // event.target.style.border = "3px dashed black";
        console.log("HI!", event.target);
    });
})

// console.log(listItems);
