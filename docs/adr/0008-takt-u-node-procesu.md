# Takt temperature živi u Node procesu

Sistemski cron nije teži za pokrenuti, ali živi van fajla koji se na času čita i obično ne radi češće od jednog minuta. Takt je `setInterval` u istom Node procesu. Uvodi se tek kad `await` već postoji, da klik u browseru i dalje radi dok kutija menja broj. Do tada kutija drži temperaturu mirnu.

Takt diže temperaturu dok je režim isključen, a spušta je dok je uključen. Gleda režim, ne prekidač. Nepriključen ventilator zato i dalje greje: režim je ostao isključen, a prekidač može da bude upaljen.
