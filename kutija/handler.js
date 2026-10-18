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

async function komanda(ctx, telo) {
  if (typeof telo.ukljucen !== "boolean" || Object.keys(telo).some((key) => key !== "ukljucen")) {
    return { status: 400, body: { greska: "telo nije boolean rezim" } };
  }
  if (telo.ukljucen && !ctx.state.prikljucen) {
    return { status: 500, body: { greska: "ventilator nije prikljucen" } };
  }
  if (ctx.state.baza) {
    if (!ctx.db) return { status: 503, body: { greska: "baza nije pokrenuta" } };
    const client = await ctx.db.connect();
    try {
      await client.query("BEGIN");
      await client.query("UPDATE ventilator SET ukljucen = $1 WHERE id = 1", [telo.ukljucen]);
      await client.query(
        "INSERT INTO istorija (komanda) VALUES ($1)",
        [telo.ukljucen ? "ukljuci" : "iskljuci"]
      );
      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      return { status: 500, body: { greska: "celina nije upisana" } };
    } finally {
      client.release();
    }
  }
  ctx.state.ukljucen = telo.ukljucen;
  return { status: 200, body: { ukljucen: ctx.state.ukljucen } };
}

module.exports = { citaj, komanda };
