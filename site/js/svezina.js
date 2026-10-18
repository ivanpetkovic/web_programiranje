export function prihvatiOcitavanje(proveraUkljucena, poznatiTrenutak, pristigliTrenutak) {
  if (!proveraUkljucena) return true;
  return ocitavanjeJeNovije(poznatiTrenutak, pristigliTrenutak);
}

export function ocitavanjeJeNovije(poznatiTrenutak, pristigliTrenutak) {
  if (!pristigliTrenutak || !poznatiTrenutak) return true;
  const poznato = Date.parse(poznatiTrenutak);
  const pristiglo = Date.parse(pristigliTrenutak);
  if (Number.isNaN(poznato) || Number.isNaN(pristiglo)) return true;
  return pristiglo >= poznato;
}
