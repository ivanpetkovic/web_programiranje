function ocitavanje(stanje) {
  return {
    temperatura: stanje.temperatura,
    ukljucen: stanje.ukljucen,
  };
}

function svezeOcitavanje(stanje) {
  return { ...ocitavanje(stanje), trenutak: new Date().toISOString() };
}

async function citaj(kontekst) {
  if (!kontekst.state.prikljucen) {
    return { status: 500, body: { greska: "ventilator nije prikljucen" } };
  }
  const body = kontekst.svezina ? svezeOcitavanje(kontekst.state) : ocitavanje(kontekst.state);
  return { status: 200, body };
}

module.exports = { citaj };
