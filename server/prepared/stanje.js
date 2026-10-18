const KORAK_TEMPERATURE = 0.5;
const NAJNIZA_TEMPERATURA = 16;
const NAJVISA_TEMPERATURA = 40;
const PERIOD_TAKTA_MS = 1000;

const state = {
  temperatura: 24,
  ukljucen: false,
  prikljucen: true,
  proveriUlogu: false,
  takt: false,
  baza: false,
};

const dovodi = new Set();

function trenutnoStanje() {
  return {
    temperatura: state.temperatura,
    ukljucen: state.ukljucen,
    prikljucen: state.prikljucen,
  };
}

function objaviStanje() {
  const poruka = `data: ${JSON.stringify(trenutnoStanje())}\n\n`;
  for (const dovod of dovodi) dovod.write(poruka);
}

function zaokruziNaDesetinku(broj) {
  return Math.round(broj * 10) / 10;
}

function pomeriTemperaturu() {
  const smer = state.ukljucen ? -1 : 1;
  const sledeca = zaokruziNaDesetinku(state.temperatura + smer * KORAK_TEMPERATURE);
  state.temperatura = Math.min(NAJVISA_TEMPERATURA, Math.max(NAJNIZA_TEMPERATURA, sledeca));
}

function otkucaj() {
  if (!state.takt) return;
  pomeriTemperaturu();
  objaviStanje();
}

setInterval(otkucaj, PERIOD_TAKTA_MS);

module.exports = { state, dovodi, trenutnoStanje, objaviStanje };
