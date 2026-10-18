# Sesija je ključ u cookie-ju, uloga je na kutiji

Nema naloga ni lozinke. U kodu kutije stoje dva neprozirna ključa, jedan za posmatrača i jedan za operatera. Izbor na panelu traži od kutije `Set-Cookie`. Cookie je HttpOnly i nosi ključ, ne ime uloge. Kutija ulogu čita iz svoje mape.

Čitanje ne traži sesiju. Na komandi kutija ide redom: nema cookie-ja pa je 401, ključ je posmatrač pa je 403, telo nije boolean pa je 400, ventilator nije priključen pa je 500, inače 200 i samo režim. Ista komanda sa istim cookie-jem prolazi kad editor promeni ulogu upisanu uz taj ključ.
