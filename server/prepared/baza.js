const { Pool } = require("pg");
const { state } = require("./stanje");

let otvorenaBaza = null;

async function napraviTabele(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ventilator (
      id integer PRIMARY KEY,
      ukljucen boolean NOT NULL
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS istorija (
      id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      komanda text NOT NULL,
      vreme timestamptz NOT NULL DEFAULT now()
    )
  `);
}

async function ubaciPocetniRezim(pool) {
  await pool.query(
    "INSERT INTO ventilator (id, ukljucen) VALUES (1, false) ON CONFLICT (id) DO NOTHING"
  );
}

async function ucitajRezim(pool) {
  const red = await pool.query("SELECT ukljucen FROM ventilator WHERE id = 1");
  state.ukljucen = red.rows[0].ukljucen;
}

async function pripremiBazu() {
  if (!process.env.DATABASE_URL) return;
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  await napraviTabele(pool);
  await ubaciPocetniRezim(pool);
  await ucitajRezim(pool);
  otvorenaBaza = pool;
}

function dohvatiBazu() {
  return otvorenaBaza;
}

module.exports = { pripremiBazu, dohvatiBazu };
