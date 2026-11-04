import { writeFileSync } from "node:fs";
import { otvoriStranu, pauza, slobodanPort } from "./chrome.mjs";

// node test/snimak-strane.mjs <url> <sirina> <visina> <izlaz.png> [js pre snimka] [paleta]
const [url, sirina, visina, izlaz, radnja = "", paleta = ""] = process.argv.slice(2);
const strana = await otvoriStranu(await slobodanPort(), { paleta: paleta || undefined });
try {
  await strana.posalji("Emulation.setDeviceMetricsOverride", { width: Number(sirina), height: Number(visina), deviceScaleFactor: 1, mobile: Number(sirina) <= 860 });
  await strana.idi(url);
  await pauza(500);
  if (radnja) {
    const vrednost = await strana.vrednost(radnja);
    if (vrednost !== undefined) console.log(JSON.stringify(vrednost, null, 1));
    await pauza(300);
  }
  const slika = await strana.posalji("Page.captureScreenshot", { format: "png" });
  writeFileSync(izlaz, Buffer.from(slika.data, "base64"));
} finally {
  strana.zatvori();
}
