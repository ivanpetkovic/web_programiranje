import { Proizvod } from "./props.js";

function crtajDugme() {
  const el = document.createElement("button");
  el.innerHTML = "Dodaj";
  document.body.appendChild(el);
  el.addEventListener('click', (event) => {
    p1.kolicina = ++p1.kolicina;
  })
}
const p1 = new Proizvod(123, "Laptop", 30);
crtajDugme();
