# Protokoli se grade pre crteža servera

Soba prekidača postoji pre Node-a. Soba mašina, u kojoj je ventilator, crta se tek kad se uvodi server. Neposredno pre tog crteža čas gradi komunikaciju: prvo naivna cela poruka koja stiže redom, zatim gubitak ili zamenjen redosled, zatim delovi, brojevi i potvrde, pa ime TCP, pa HTTP kao smisao nad tokom bajtova. Server se ne pokazuje dok HTTP zahtev nema šta da znači.

TCP i HTTP/2 i QUIC ostaju u osvrtu posle toga. Naivni korak nije zadatak da studenti rekonstruišu specifikaciju protokola.
