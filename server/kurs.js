function dokumentJeKurs(kurs) {
  if (!kurs || typeof kurs !== "object" || Array.isArray(kurs)) return false;
  if (!Array.isArray(kurs.nedelje) || kurs.trajanjeNedelja !== kurs.nedelje.length) return false;
  return kurs.nedelje.every((nedelja) => {
    if (!nedelja || typeof nedelja !== "object" || Array.isArray(nedelja) || !Array.isArray(nedelja.steps)) return false;
    return nedelja.steps.every((korak) => korak && typeof korak === "object" && !Array.isArray(korak));
  });
}

module.exports = { dokumentJeKurs };
