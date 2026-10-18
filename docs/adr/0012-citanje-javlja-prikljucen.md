# Čitanje javlja izvučen ventilator, komanda dobija 500

Termometar i ventilator su dve mašine. Izvučen ventilator ostavlja režim isključen, a temperatura i dalje postoji. Čitanje zato vraća 200, broj temperature, režim isključen i `priključen: false`. Displej sobe prekidača iz tog odgovora upisuje cifre.

Svojstvo `failed` na temperaturi bi reklo da merenje nije uspelo. Merenje jeste uspelo. Podatak o kablu stoji na ventilatoru.

Komanda koja traži uključenje, dok kabl nedostaje, i dalje dobija 500. To je zahtev koji kutija ne može da izvrši. Telo uspele komande i dalje nosi samo režim.
