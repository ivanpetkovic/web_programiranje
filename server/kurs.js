function dokumentJeKurs(kurs) {
  if (!kurs || typeof kurs !== "object" || Array.isArray(kurs)) return false;
  if (!Array.isArray(kurs.teme) || kurs.trajanjeTema !== kurs.teme.length) return false;
  return kurs.teme.every((tema) => {
    if (!tema || typeof tema !== "object" || Array.isArray(tema) || !Array.isArray(tema.steps)) return false;
    return tema.steps.every((korak) => korak && typeof korak === "object" && !Array.isArray(korak));
  });
}

module.exports = { dokumentJeKurs };
