# Kutija prima zahtev, nepriključen ventilator vraća 500

Prekidač ne uključuje ventilator sam. Zahtev ide do kutije, a kutija je server. Ako je ventilator priključen, zahtev se vidi i kablom do njega i režim može da se promeni. Ako nije priključen, kutija i dalje odgovori, status je 500, prekidač može da ostane upaljen, lopatice se ne vrte. 500 je ovde pripremljen neuspeh sa odgovorom, ne izostanak veze.

Kad kutija postoji, ona je izvor temperature. Dugme „Sledeći korak” na frontu do tada samo diže lokalni broj i ne gleda ventilator.
