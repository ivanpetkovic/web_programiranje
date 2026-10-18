const state = {
  temperatura: 24,
  ukljucen: false,
  prikljucen: true,
  proveriUlogu: false,
  takt: false,
  baza: false,
};

const sse = new Set();

function snapshot() {
  return {
    temperatura: state.temperatura,
    ukljucen: state.ukljucen,
    prikljucen: state.prikljucen,
  };
}

function broadcast() {
  const chunk = `data: ${JSON.stringify(snapshot())}\n\n`;
  for (const res of sse) res.write(chunk);
}

setInterval(() => {
  if (!state.takt) return;
  state.temperatura += state.ukljucen ? -0.5 : 0.5;
  state.temperatura = Math.round(state.temperatura * 10) / 10;
  if (state.temperatura < 16) state.temperatura = 16;
  if (state.temperatura > 40) state.temperatura = 40;
  broadcast();
}, 1000);

module.exports = { state, sse, snapshot, broadcast };
