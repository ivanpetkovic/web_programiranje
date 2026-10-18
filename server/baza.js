const { Pool } = require("pg");
const { state } = require("./stanje");

let db = null;

async function initDb() {
  if (!process.env.DATABASE_URL) return;
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
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
  await pool.query(
    "INSERT INTO ventilator (id, ukljucen) VALUES (1, false) ON CONFLICT (id) DO NOTHING"
  );
  const row = await pool.query("SELECT ukljucen FROM ventilator WHERE id = 1");
  state.ukljucen = row.rows[0].ukljucen;
  db = pool;
}

function getDb() {
  return db;
}

module.exports = { initDb, getDb };
