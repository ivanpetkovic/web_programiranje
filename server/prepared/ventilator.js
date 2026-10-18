function teloJeRezim(telo) {
  const kljucevi = Object.keys(telo);
  return typeof telo.ukljucen === "boolean" && kljucevi.every((kljuc) => kljuc === "ukljucen");
}

function nazivKomande(ukljucen) {
  if (ukljucen) return "ukljuci";
  return "iskljuci";
}

async function upisiCelinu(baza, ukljucen) {
  const veza = await baza.connect();
  try {
    await veza.query("BEGIN");
    await veza.query("UPDATE ventilator SET ukljucen = $1 WHERE id = 1", [ukljucen]);
    await veza.query("INSERT INTO istorija (komanda) VALUES ($1)", [nazivKomande(ukljucen)]);
    await veza.query("COMMIT");
    return null;
  } catch {
    await veza.query("ROLLBACK");
    return { status: 500, body: { greska: "celina nije upisana" } };
  } finally {
    veza.release();
  }
}

async function komanda(kontekst, telo) {
  if (!teloJeRezim(telo)) return { status: 400, body: { greska: "telo nije boolean rezim" } };
  if (telo.ukljucen && !kontekst.state.prikljucen) {
    return { status: 500, body: { greska: "ventilator nije prikljucen" } };
  }
  if (kontekst.state.baza) {
    if (!kontekst.db) return { status: 503, body: { greska: "baza nije pokrenuta" } };
    const greskaUpisa = await upisiCelinu(kontekst.db, telo.ukljucen);
    if (greskaUpisa) return greskaUpisa;
  }
  kontekst.state.ukljucen = telo.ukljucen;
  return { status: 200, body: { ukljucen: kontekst.state.ukljucen } };
}

module.exports = { komanda };
