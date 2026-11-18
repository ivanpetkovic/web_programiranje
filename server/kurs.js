const fs = require("fs");
const path = require("path");
const { proveriSemu } = require("../site/js/sema.js");

const sema = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "site", "kurs.json.schema"), "utf8"));

function skiniMinuteBlokova(kurs) {
  for (const tema of kurs?.topics || []) {
    for (const korak of tema?.steps || []) {
      for (const polje of ["blocks", "discussion"]) {
        for (const blok of korak?.[polje] || []) {
          if (blok && typeof blok === "object") delete blok.minutes;
        }
      }
    }
  }
}

function greskeDokumenta(kurs) {
  const greske = [...proveriSemu(sema, kurs).greske];
  const teme = kurs?.topics;
  if (!Array.isArray(teme) || kurs?.themeCount !== teme.length) {
    greske.push("themeCount se ne slaže sa brojem tema.");
  }
  return greske;
}

function dokumentJeKurs(kurs) {
  return greskeDokumenta(kurs).length === 0;
}

module.exports = { dokumentJeKurs, greskeDokumenta, skiniMinuteBlokova };
