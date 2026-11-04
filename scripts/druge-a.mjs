export const drugeA = {
"1:LO": [
{pitalica:"Zašto „LO” nije dokaz da Web već postoji?",opcije:[
{key:"A",text:"Zato što je poruka stigla, a stigla poruka i jeste Web.",why:"Prenos dva slova pokazuje samo da mreža nosi podatak. Web traži dokument koji se traži po adresi.",ok:false},
{key:"B",text:"Zato što prenos bajtova još ne kaže šta je dokument ni kako se traži.",why:"Web nastaje kad dokument ima adresu i vezu, ne u trenutku kad mreža prenese prva dva slova.",ok:true}],
analizaPitalice:"Mreža iz 1969. rešava prenos između udaljenih računara. Iz uspeha prenosa ne sledi hipertekst, URL ni HTTP. Ako te slojeve pomešamo, svaki kasniji status mreže pogrešno čitamo kao uspeh stranice."},
{pitalica:"Šta bi nedostajalo i da je stigla cela reč LOGIN?",opcije:[
{key:"A",text:"I dalje nema dokumenta u browseru ni adrese kojom se taj dokument traži.",why:"Dužina poruke ne menja sloj. Cela reč i dalje je samo bajtovi na mreži.",ok:true},
{key:"B",text:"Tada bi to već bio HTML, jer je poruka potpuna.",why:"Potpunost poruke nije oznaka dokumenta. HTML imenuje strukturu teksta, ne uspeh prijave.",ok:false}],
analizaPitalice:"Pitanje „koliko je stiglo” skreće sa pitanja „šta taj prenos predstavlja”. Web ne nastaje dužom porukom."}],
"1:Paket": [
{pitalica:"Klijent pošalje HTTP zahtev serveru. TCP potvrdi da su svi bajtovi uspešno preneti. Da li to znači da je server uspešno izvršio zahtev?",opcije:[
{key:"A",text:"Da. Pouzdan prenos bajtova i jeste uspeh operacije.",why:"TCP ne zna šta zahtev znači niti da li ga je server izvršio.",ok:false},
{key:"B",text:"Ne. TCP garantuje prenos bajtova, ne i da je operacija izvršena.",why:"Pouzdan tok nije značenje zahteva niti uspeh operacije.",ok:true}],
analizaPitalice:"TCP potvrda kaže da su bajtovi stigli. Ne kaže da je server razumeo zahtev niti da je operacija uspela."}],
"1:Kasni deo": [
{pitalica:"Zašto TCP uopšte čeka P2 ako je P3 već stigao?",opcije:[
{key:"A",text:"Zato što aplikacija koja čita dokument ne sme da vidi rupu u bajtovima.",why:"TCP daje uređeni tok. Dokument ne zna za pakete; rupa bi bila izgubljen znak, ne „kasniji paket”.",ok:true},
{key:"B",text:"Zato što IP zabranjuje da P3 stigne pre P2.",why:"IP ne obećava red. Čekanje je odluka TCP-a, ne svojstvo svakog paketa.",ok:false}],
analizaPitalice:"Ako student zaključi da mreža uvek isporučuje redom, ne vidi zašto TCP postoji. TCP nastaje baš zato što IP to ne radi."}],
"1:TCP i UDP": [
{pitalica:"Zašto kadar sme da se odbaci, a bajt dokumenta ne?",opcije:[
{key:"A",text:"Zato što su oba na istoj mreži, pa važi isto pravilo.",why:"Ista mreža ne znači isti zahtev aplikacije. Slika koja zakasni više nije ovaj trenutak; dokument sa rupom nije dokument.",ok:false},
{key:"B",text:"Zato što slika koja zakasni više nije ovaj trenutak, a dokument sa izgubljenim bajtom više nije taj dokument.",why:"UDP ne garantuje isporuku; aplikacija sme da odbaci kadar. TCP čuva tok bajtova dokumenta ili prijavi neuspeh veze.",ok:true}],
analizaPitalice:"TCP i UDP nisu „brži i sporiji Internet”. Nastaju jer različite aplikacije različito trpe gubitak. Iz imena protokola ne sledi da ventilator jeste uključen."},
{pitalica:"Šta iz pouzdanog TCP toka ne sledi?",opcije:[
{key:"A",text:"Da je komanda „uključi” izvršena.",why:"TCP isporučuje bajtove. Ne zna šta bajt znači niti da li je uređaj poslušao.",ok:false},
{key:"B",text:"Samo da su bajtovi stigli redom dok veza radi, ne i šta oni znače.",why:"Značenje komande dolazi iznad TCP-a. Pouzdan tok nije poslovni uspeh.",ok:true}],
analizaPitalice:"Ova granica se vraća kad ekran kaže uključeno, a odgovor nije stigao. Mrežni uspeh i efekat u sobi nisu isto."}],
"1:Hipertekst": [
{pitalica:"Zašto veza ne vodi na „sledeću stranicu” kao u knjizi?",opcije:[
{key:"A",text:"Zato što čitalac prati ideju, a adresa drugog teksta ne mora biti sledeći broj.",why:"Hipertekst nastaje jer unapred zadat redosled stranica ne prati vezu među dokumentima različitih autora.",ok:true},
{key:"B",text:"Zato što browser ne ume da broji stranice.",why:"Browser ume da prati adresu. Ograničenje nije u brojanju, nego u modelu čitanja.",ok:false}],
analizaPitalice:"Ako veza ostane „sledeći broj”, Web ne rešava problem razbacanih dokumenata. URL postoji da bi odredište bilo imenovano, ne poredano."}],
"1:Predlog": [
{pitalica:"Zašto je Web napravljen povrh Interneta, a ne kao nova mreža?",opcije:[
{key:"A",text:"Zato što je problem bio povezivanje dokumenata, a prenos između računara je već postojao.",why:"CERN-ov problem nije bio izum novog kabla. Web je usluga: dokument po adresi, preko mreže koja već prenosi bajtove.",ok:true},
{key:"B",text:"Zato što su Internet i Web isto, samo noviji naziv.",why:"Isto ime u govoru ne briše sloj. Bez Interneta Web nema kuda, ali Internet bez URL-a i dokumenta nije Web.",ok:false}],
analizaPitalice:"Student koji izjednači reči ne ume da kaže gde je greška: u imenu, u vezi ili u dokumentu. Nova usluga ne zahteva novu mrežu."},
{pitalica:"Šta stranica iz 1991. već jeste, a Gmail još nije?",opcije:[
{key:"A",text:"Aplikacija, jer se nešto već vidi u browseru.",why:"Prikaz dokumenta nije aplikacija. Aplikacija nastaje kad zahtev menja deo, a dokument ostaje.",ok:false},
{key:"B",text:"Hipertekstni dokument dovežen po URL-u, ne mreža i ne aplikacija.",why:"Ista reč „web” pokriva četiri stvari. Stranica iz 1991. je samo prva od njih.",ok:true}],
analizaPitalice:"Ovo je isto pitanje kao diskusija teme, svedeno na korak. Nastavnik može da ga preskoči ako diskusija teme već stoji na kraju."}],
"1:HTTP kao dogovor": [
{pitalica:"Zašto TCP nije dovoljan da se kaže šta znači GET /?",opcije:[
{key:"A",text:"Zato što TCP vidi samo tok bajtova, ne granicu zahteva, metod ni status.",why:"HTTP nastaje da bi dve strane imale zajedničko značenje: šta se traži i kako se odgovor tumači.",ok:true},
{key:"B",text:"Zato što GET / ne može da se pošalje preko TCP-a.",why:"Može. Bajti prolaze. Nedostaje dogovor šta ti bajti znače.",ok:false}],
analizaPitalice:"Bez HTTP-a uspešan TCP i dalje ne zna da li je resurs nađen. Status 404 je smisao, ne svojstvo kabla."},
{pitalica:"Šta status 200 sam po sebi ne kaže?",opcije:[
{key:"A",text:"Da je ventilator fizički promenio stanje.",why:"Status opisuje HTTP odgovor. Efekat na uređaju traži poseban model potvrde.",ok:true},
{key:"B",text:"Da je odgovor uopšte stigao.",why:"200 jeste stigao odgovor. To nije sporno. Sporno je šta iz njega sme da se zaključi o sobi.",ok:false}],
analizaPitalice:"Ova pitalica priprema kasnije časove: 200, 4xx i 5xx nisu isto, i nijedan sam ne dokazuje fizički efekat."}],
"1:HTML": [
{pitalica:"Zašto rana oznaka imenuje ulogu dela teksta, a ne boju?",opcije:[
{key:"A",text:"Zato što izgled može da se zameni, a naslov mora da ostane naslov.",why:"HTML nastaje da bi dokument imao značenje i kad se prikaz promeni. Boja nije razlog oznake.",ok:true},
{key:"B",text:"Zato što browser iz 1991. nije umeo da prikaže boju, pa boja nije postojala kao ideja.",why:"Ograničenje prikaza nije razlog semantike. Semantika ostaje i kad boja postoji.",ok:false}],
analizaPitalice:"Ako student ofarba naslov i zaključi da je time promenio dokument, pomešao je sloj. CSS kasnije postoji baš da bi izgled izašao iz oznake."}],
"1:Rat browsera": [
{pitalica:"Zašto privatna oznaka jednog browsera ne preživi u drugom?",opcije:[
{key:"A",text:"Zato što je mreža između njih drugačija.",why:"Stranica puca i kad je mreža ista. Puca dogovor o značenju oznake.",ok:false},
{key:"B",text:"Zato što značenje oznake nije privatna reč jedne firme.",why:"Standard nastaje da bi isti dokument imao isto značenje kod više proizvođača.",ok:true}],
analizaPitalice:"Iz „kod mene radi” ne sledi da dokument važi. W3C i kasnije WHATWG postoje zbog te pukotine, ne zbog lepšeg izgleda."}],
"1:Od URL-a do prikaza": [
{pitalica:"Zašto DNS neuspeh nije isto što i HTTP 404?",opcije:[
{key:"A",text:"Zato što 404 znači da HTTP odgovor jeste stigao, a ime nije nađeno pre zahteva.",why:"Svaki korak ima drugi dokaz. Greška u imenu ne dokazuje da resurs ne postoji, niti obrnuto.",ok:true},
{key:"B",text:"Zato što su oba „stranica ne radi”, pa je dijagnoza ista.",why:"Ista žalba korisnika pokriva različite slojeve. Bez razlikovanja ne zna se šta da se popravi.",ok:false}],
analizaPitalice:"Put od URL-a do prikaza postoji da bi se greška locirala. DNS ne preuzima dokument, TLS ga ne parsira, HTTP ne crta piksele."}],
"1:Ajax": [
{pitalica:"Zašto Ajax nije novi mrežni protokol?",opcije:[
{key:"A",text:"Zato što je i dalje HTTP zahtev; novo je to što dokument ostaje, a menja se deo.",why:"Potreba je nastala jer zamena cele strane gubi ono što korisnik već gleda. Protokol prenosa nije zamenjen.",ok:true},
{key:"B",text:"Zato što Ajax zamenjuje TCP.",why:"TCP i dalje nosi bajtove. Ajax ne uvodi novi transport.",ok:false}],
analizaPitalice:"Dobijeni podaci sami ne menjaju prikaz. Aplikacija mora da osveži deo. Iz „stigao je odgovor” ne sledi da je ekran već nov."},
{pitalica:"Šta Ajax ne rešava sam?",opcije:[
{key:"A",text:"Da li je broj na ekranu svež i da li komanda jeste izvršena.",why:"Zahtev koji menja deo i dalje može da donese star podatak ili da ne dobije potvrdu efekta.",ok:true},
{key:"B",text:"Da li browser ume da pošalje zahtev bez zamene dokumenta.",why:"To Ajax upravo ume. Sledeći problemi su svežina i dokaz efekta, ne sam zahtev.",ok:false}],
analizaPitalice:"Ova pitalica najavljuje kasnije teme, a ne uvodi ih. Na času se staje na granici: dokument ostaje."}],
"1:Dokument": [
{pitalica:"Zašto sledeća tema počinje od dokumenta, a ne od servera?",opcije:[
{key:"A",text:"Zato što 24 na početku još nije merenje, nego tekst. Server nema šta da „osveži” dok prikaz nije odvojen od tog teksta.",why:"Potreba za stanjem i komunikacijom vidi se tek kad statički broj ostane isti iako se soba promenila.",ok:true},
{key:"B",text:"Zato što server ne može da postoji pre HTML fajla na disku klijenta.",why:"Server može da postoji. Kurs ga odlaže da bi se videlo šta dokument sam ne ume.",ok:false}],
analizaPitalice:"Ako se server, jezik i Ajax otvore odjednom, ne vidi se rupa koju svaki od njih zatvara. Dokument sa brojem 24 je ta rupa."}]
};
