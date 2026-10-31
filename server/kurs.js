const fs = require("fs");
const path = require("path");
const { proveriSemu } = require("../site/js/sema.js");

const sema = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "site", "kurs.json.schema"), "utf8"));

function dokumentJeKurs(kurs) {
  if (!proveriSemu(sema, kurs).ok) return false;
  return Array.isArray(kurs.teme) && kurs.trajanjeTema === kurs.teme.length;
}

module.exports = { dokumentJeKurs };
