async function citaj(ctx) {
  if (!ctx.state.prikljucen) {
    return { status: 500, body: { greska: "ventilator nije prikljucen" } };
  }
  const body = {
    temperatura: ctx.state.temperatura,
    ukljucen: ctx.state.ukljucen,
  };
  if (ctx.svezina) body.trenutak = new Date().toISOString();
  return { status: 200, body };
}

module.exports = { citaj };
