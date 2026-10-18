const assert = require("node:assert/strict");
const test = require("node:test");
const { komanda } = require("../server/ventilator");

function kontekst() {
  return { state: { ukljucen: false, prikljucen: true, baza: false }, db: null };
}

test("prazno, null i tekst nisu režim", async () => {
  for (const telo of [null, undefined, "da", 1, [], { ukljucen: "da" }, { ukljucen: true, visak: 1 }]) {
    const ctx = kontekst();
    const odgovor = await komanda(ctx, telo);
    assert.equal(odgovor.status, 400);
    assert.equal(ctx.state.ukljucen, false);
  }
});

test("uključivanje izvučenog ventilatora je 500 i ne menja režim", async () => {
  const ctx = kontekst();
  ctx.state.prikljucen = false;
  const odgovor = await komanda(ctx, { ukljucen: true });
  assert.equal(odgovor.status, 500);
  assert.equal(ctx.state.ukljucen, false);
});

test("boolean režim se upisuje i vraća samo režim", async () => {
  const ctx = kontekst();
  const odgovor = await komanda(ctx, { ukljucen: true });
  assert.equal(odgovor.status, 200);
  assert.deepEqual(odgovor.body, { ukljucen: true });
  assert.equal(ctx.state.ukljucen, true);
});
