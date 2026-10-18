# Izvučen ventilator je HTTP 500

Klijent čitanjem pita temperaturu i režim. Ako ventilator nije na kablu, to je greška tog zahteva, ne još jedno polje u uspelom telu. Čitanje tada vraća HTTP 500. Displej sobe prekidača piše Err i ne uzima broj iz tog odgovora.

HTTP 200 znači da je čitanje uspelo. Telo nosi temperaturu i režim. Režim isključen, dok je ventilator priključen, i dalje je 200.

Komanda koja traži uključenje bez kabla takođe dobija HTTP 500. Uspeh komande i dalje nosi samo režim. Razlika 200 i 500 je status odgovora, ne svojstvo `failed` ili `priključen` u JSON-u.

Displej sobe mašina i dalje pokazuje temperaturu koju takt menja. Taj crtež ne dolazi iz ovog HTTP odgovora.
