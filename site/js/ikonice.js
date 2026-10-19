const NS = "http://www.w3.org/2000/svg";
let spremno = null;
let ucitano = false;

export function ucitajIkonice() {
  if (spremno) return spremno;
  spremno = fetch("/icons/sprite.svg")
    .then((odgovor) => {
      if (!odgovor.ok) throw new Error("sprite");
      return odgovor.text();
    })
    .then((tekst) => {
      const drzac = document.createElement("div");
      drzac.hidden = true;
      drzac.innerHTML = tekst;
      document.body.append(drzac);
      ucitano = true;
    })
    .catch(() => {
      ucitano = false;
    });
  return spremno;
}

export function ikonica(ime) {
  if (!ucitano) return null;
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("class", "ikona");
  svg.setAttribute("width", "20");
  svg.setAttribute("height", "20");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("color", "currentColor");
  const use = document.createElementNS(NS, "use");
  use.setAttribute("href", `#${ime}`);
  svg.append(use);
  return svg;
}
