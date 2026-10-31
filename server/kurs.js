const fs = require("node:fs");
const path = require("node:path");
const Ajv = require("ajv");

const schema = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "site", "kurs.json.schema"), "utf8")
);
const ajv = new Ajv({ allErrors: true, strict: false, validateSchema: false });
const validirajShemu = ajv.compile(schema);

function koraciSuObjekti(teme) {
  return teme.every((tema) => {
    if (!tema || typeof tema !== "object" || Array.isArray(tema) || !Array.isArray(tema.steps)) {
      return false;
    }
    return tema.steps.every((korak) => korak && typeof korak === "object" && !Array.isArray(korak));
  });
}

function dokumentJeKurs(kurs) {
  if (!kurs || typeof kurs !== "object" || Array.isArray(kurs)) return false;
  if (!validirajShemu(kurs)) return false;
  if (!Array.isArray(kurs.teme) || kurs.trajanjeTema !== kurs.teme.length) return false;
  return koraciSuObjekti(kurs.teme);
}

function greskeKursa(kurs) {
  const greske = [];
  if (!kurs || typeof kurs !== "object" || Array.isArray(kurs)) {
    greske.push("Dokument nije objekat.");
    return greske;
  }
  if (!validirajShemu(kurs)) {
    for (const greska of validirajShemu.errors || []) {
      greske.push(`${greska.instancePath || "/"} ${greska.message}`);
    }
  }
  if (Array.isArray(kurs.teme) && kurs.trajanjeTema !== kurs.teme.length) {
    greske.push("trajanjeTema mora biti jednako broju tema.");
  }
  if (Array.isArray(kurs.teme) && !koraciSuObjekti(kurs.teme)) {
    greske.push("Svaka tema mora imati niz steps sa objektima.");
  }
  return greske;
}

module.exports = { dokumentJeKurs, greskeKursa, schema };
