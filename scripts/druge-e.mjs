export const drugeE = {
"10:Dva ključa": [
{pitalica:"Zašto ključ sesije nije ime uloge upisano u browseru?",opcije:[
{key:"A",text:"Zato što browser sme da prikaže tuđu ulogu, a kutija veruje samo nizu koji sama poznaje.",why:"Nasumičan ključ ne nosi ovlašćenje u čitljivom imenu. Uloga ostaje na serveru.",ok:true},
{key:"B",text:"Zato što je ime uloge dovoljan ključ ako je napisano tačno.",why:"Tada bi telo ili lokalni natpis izmišljali operatera. Ključ to ne radi.",ok:false}],
analizaPitalice:"Dva ključa postoje da posmatrač i operater budu dva zapisa, ne dva natpisa. Ko upiše ulogu u browser, zaobišao je kutiju."}],
"10:HttpOnly": [
{pitalica:"Zašto stranica ne sme da pročita ulogu iz tog cookie-ja?",opcije:[
{key:"A",text:"Zato što HttpOnly krije cookie od JS-a, pa sakrivanje dugmeta ne može da se osloni na čitanje ključa.",why:"Ključ ostaje u cookie-ju. Uloga nije tu da je skripta pročita.",ok:true},
{key:"B",text:"Zato što cookie bez HttpOnly i dalje ne ode uz zahtev.",why:"Cookie može da ode uz zahtev i kad ga JS ne čita. HttpOnly ne gasi slanje.",ok:false}],
analizaPitalice:"HttpOnly nastaje da skripta ne ukrade ključ. Ne nastaje da bi browser sam znao ko sme da pritisne dugme."},
{pitalica:"Šta HttpOnly sam ne reši?",opcije:[
{key:"A",text:"Da tuđi sajt ne pošalje cookie uz svoj zahtev ka ovoj kutiji.",why:"Čitanje iz JS-a i slanje cookie-ja nisu isti problem. CSRF traži druga pravila.",ok:true},
{key:"B",text:"Da JS na ovoj strani pročita vrednost cookie-ja.",why:"To HttpOnly upravo sprečava. Ne pokriva cross-site slanje.",ok:false}],
analizaPitalice:"Ova granica se ponavlja na koraku o CSRF-u. Ovde je dovoljno da se ne proglasi cookie celom zaštitom."}],
"10:Mapa": [
{pitalica:"Zašto kutija ne veruje polju uloga u JSON telu?",opcije:[
{key:"A",text:"Zato što telo piše klijent, a mapa na kutiji vezuje ključ iz cookie-ja za ulogu.",why:"Ovlašćenje koje stiže u telu može da se izmisli. Mapa se ne šalje nazad kao dokaz.",ok:true},
{key:"B",text:"Zato što cookie već sadrži ime uloge, pa mapa nije potrebna.",why:"Cookie nosi opaque token. Ime uloge nije u njemu za klijenta.",ok:false}],
analizaPitalice:"Mapa postoji da uloga ne putuje kao podatak kojem se veruje. Ko doda polje uloga u telo, vrati se na natpis."}],
"10:Čitanje": [
{pitalica:"Zašto čitanje sobe ne traži sesiju operatera?",opcije:[
{key:"A",text:"Zato što je čitanje javno u ovom ugovoru, a komanda nije.",why:"Ista kutija sme da razlikuje rute. Ulaz na temperaturu nije ulaz na ventilator.",ok:true},
{key:"B",text:"Zato što je svaki GET bez sesije automatski komanda.",why:"GET čitanja ne postavlja režim. Odsustvo sesije ne pretvara ga u PUT.",ok:false}],
analizaPitalice:"Čitanje bez uloge postoji da se panel vidi i pre prijave. Iz toga ne sledi da PUT sme isto."}],
"10:Sakriveno dugme nije autorizacija": [
{pitalica:"Zašto display:none ne spreči PUT?",opcije:[
{key:"A",text:"Zato što zahtev može da se pošalje mimo ekrana, a pravo proverava server.",why:"Sakrivanje je prikaz. Autorizacija je odluka na ruti.",ok:true},
{key:"B",text:"Zato što browser briše zabranjeni zahtev čim je dugme sakriveno.",why:"Browser i dalje pošalje ono što skripta ili curl pošalju. CSS nije filter rute.",ok:false}],
analizaPitalice:"Dugme se krije da posmatrač ne vidi tuđu komandu. Ko to pročita kao zaštitu, neće tražiti 403."},
{pitalica:"Šta sakriveno dugme ipak sme da uradi?",opcije:[
{key:"A",text:"Da natera server da odbije zahtev.",why:"Ne može. Server ne vidi CSS.",ok:false},
{key:"B",text:"Da osobi na ekranu ne nudi tuđu komandu.",why:"To je prikaz. Ostaje korisno, i nedovoljno.",ok:true}],
analizaPitalice:"Prikaz i pravo stoje zajedno namerno. Uklanjanje dugmeta nije zamena za proveru."}],
"10:401": [
{pitalica:"Zašto komanda bez cookie-ja nije 403?",opcije:[
{key:"A",text:"Zato što 401 kaže da identitet nije predstavljen, a 403 da jeste ali ne sme.",why:"Bez cookie-ja kutija ne zna ni posmatrača. To nije odbijena uloga.",ok:true},
{key:"B",text:"Zato što su 401 i 403 isto, pa redosled nije bitan.",why:"Ista žalba „ne pušta” pokriva dva uzroka. Popravka nije ista.",ok:false}],
analizaPitalice:"401 postoji da se nedostatak ključa ne meša sa posmatračem. Ko vrati 403 bez cookie-ja, laže da je uloga proverena."}],
"10:403": [
{pitalica:"Zašto posmatrač dobije 403 iako je dugme sakriveno?",opcije:[
{key:"A",text:"Zato što sakriveno dugme nije stiglo do servera, pa je status suvišan.",why:"Zahtev mimo ekrana i dalje stiže. 403 je odgovor na njega, i režim se ne menja.",ok:false},
{key:"B",text:"Zato što je uloga poznata i nije dovoljna, bez obzira na prikaz.",why:"Cookie jeste tu. Mapa kaže posmatrač. Komanda staje.",ok:true}],
analizaPitalice:"403 nastaje posle prepoznatog ključa. 200 zato što je dugme skriveno bio bi uspeh bez prava."}],
"10:400 posle uloge": [
{pitalica:"Zašto se telo gleda tek posle uloge?",opcije:[
{key:"A",text:"Zato što loš unos bez sesije ne sme da izgleda kao jedina greška.",why:"Prvo se zna ko pita. 400 stiže kad uloga već sme da komanduje, a telo nije režim.",ok:true},
{key:"B",text:"Zato što je 400 uvek pre cookie-ja, da se šema ne meša sa pravima.",why:"Obrnut red bi rekao neautentikovanoj strani kakvo telo fali, i sakrio 401.",ok:false}],
analizaPitalice:"Redosled postoji da se dijagnoza ne vrti. Telo pre uloge meša „ko si” i „šta si poslao”."}],
"10:500 posle uloge": [
{pitalica:"Zašto izvučen ventilator ostaje 500 i kad je uloga operater?",opcije:[
{key:"A",text:"Zato što pravo da se komanduje nije dokaz da je uređaj priključen.",why:"Autorizacija je prošla. Posao i dalje može da padne.",ok:true},
{key:"B",text:"Zato što se izvučen kabl štiti statusom 403.",why:"403 je uloga. Kabl nije pogrešan korisnik.",ok:false}],
analizaPitalice:"500 posle uloge postoji da se kvar ne preimenuje u zabranu. Operater i dalje vidi neuspeh posla."}],
"10:HttpOnly nije cela CSRF zaštita": [
{pitalica:"Šta ostaje tačno kad HttpOnly već krije cookie od JS-a?",opcije:[
{key:"A",text:"SameSite i Secure i dalje odlučuju kada cookie sme da krene, a CORS nije provera uloge.",why:"Čitanje ključa i slanje ključa nisu isti napad. HttpOnly rešava prvo.",ok:true},
{key:"B",text:"HttpOnly time gasi CSRF, pa SameSite više nema šta da radi.",why:"Browser i dalje može da priloži cookie uz tuđi zahtev, zavisno od SameSite.",ok:false}],
analizaPitalice:"Tri pojma se slivaju u „cookie je bezbedan”. Svaki pokriva drugi smer: čitanje, kanal, cross-site slanje."},
{pitalica:"Šta CORS ne dokazuje?",opcije:[
{key:"A",text:"Koji korisnik sme da promeni režim.",why:"CORS je pravilo browsera o tuđem JS-u. Uloga i dalje stoji u mapi.",ok:true},
{key:"B",text:"Da browser sme da ima pravilo o tome ko čita odgovor.",why:"To CORS jeste. Nije zamena za 401 i 403.",ok:false}],
analizaPitalice:"Zamena CORS-a za prava vraća zaštitu na prikaz. Server i dalje mora da kaže ne."}],
"10:200 operater": [
{pitalica:"Zašto telo uspeha operatera nosi samo režim?",opcije:[
{key:"A",text:"Zato što komanda nije čitanje temperature, pa uspeh ne osvežava merenje.",why:"Isti razlog kao ranije, sada sa ulogom koja jeste smela. Pravo ne širi telo.",ok:true},
{key:"B",text:"Zato što 200 operatera uvek uključi i temperaturu u isti objekat.",why:"Telo ostaje režim. Operater ne dobija drugi ugovor.",ok:false}],
analizaPitalice:"200 sa ulogom i dalje nije sveža soba. Ko doda temperaturu „jer sme”, pomeša pravo i izvor podatka."}],
"10:Sakriveno dugme": [
{pitalica:"Šta sakrivanje uradi na serveru?",opcije:[
{key:"A",text:"Ništa. Zahtev mimo ekrana i dalje stiže do rute.",why:"Prikaz se menja lokalno. Mapa i provera uloge se ne menjaju.",ok:true},
{key:"B",text:"Server zaboravi rutu dok je dugme skriveno.",why:"Ruta ostaje. Zato provera mora da vrati 403, ne tišinu zbog CSS-a.",ok:false}],
analizaPitalice:"Ovaj korak ponavlja granicu na samom prikazu. Ako je prva pitalica već odlučila, druga samo fiksira mesto: server nije video CSS."}],
"10:CORS": [
{pitalica:"Šta zabranjeno čitanje u browseru dokazuje?",opcije:[
{key:"A",text:"Samo šta taj browser dozvoli tom JS-u, ne da server ćuti i ne ko je korisnik.",why:"Odgovor može da postoji, a stranica da ga ne vidi. Tišina u konzoli nije tišina kutije.",ok:true},
{key:"B",text:"Da korisnik nema ulogu operatera.",why:"CORS ne čita mapu. 401 i 403 su drugi odgovori, ako uopšte stignu do JS-a.",ok:false}],
analizaPitalice:"CORS postoji kao pravilo prikaza tuđeg koda. Ko iz njega izvede identitet, neće pogledati status na mreži."}],
"10:Redosled": [
{pitalica:"Zašto 400 ne stiže pre provere cookie-ja?",opcije:[
{key:"A",text:"Zato što je red: nema ključa 401, posmatrač 403, loše telo 400, kabl 500, operater 200.",why:"Svaki status ima mesto. Raniji 400 briše razliku ko je pitao.",ok:true},
{key:"B",text:"Zato što je 400 najteži status, pa uvek ide poslednji.",why:"500 kabla stoji posle 400. Težina nije red. Red je sloj provere.",ok:false}],
analizaPitalice:"Redosled je alat dijagnoze. Ko vrati prvi status koji mu padne na pamet, ne zna koji je sloj pukao."}],

"11:Put": [
{pitalica:"Zašto čas prati jedan zahtev, a ne javni deploy?",opcije:[
{key:"A",text:"Zato što taj zahtev već ima gde da se vidi: browser, Node i baza.",why:"Put je dijagnoza postojećeg toka. Nova adresa ne pokazuje sloj koji je pukao.",ok:true},
{key:"B",text:"Zato što lokalni Node ne šalje pravi HTTP.",why:"Šalje. Deploy nije potreban da bi status, log i red u bazi postojali.",ok:false}],
analizaPitalice:"Jedan zahtev postoji da se slojevi vide na poznatom putu. Deploy bi sakrio isti put iza nove adrese."}],
"11:Ekran požuri": [
{pitalica:"Zašto natpis uključeno ne dokazuje upis?",opcije:[
{key:"A",text:"Zato što ekran može da pokaže želju pre nego što odgovor stigne.",why:"Ishod upisa je u odgovoru i u bazi. Natpis je lokalna žurba.",ok:true},
{key:"B",text:"Zato što svaki natpis na dugmetu čeka COMMIT.",why:"Ne čeka. Zato i jeste opasan kao dokaz.",ok:false}],
analizaPitalice:"Požurili ekran nastaje jer prikaz i potvrda nisu isti trenutak. Ko veruje natpisu, ne traži odgovor."},
{pitalica:"Šta tada sme da se kaže naglas?",opcije:[
{key:"A",text:"Da upis jeste prošao.",why:"Nema odgovora. Nema ni dokaza.",ok:false},
{key:"B",text:"Da ishod upisa još nije poznat.",why:"Nepoznato nije neuspeh i nije uspeh. Čeka se trag.",ok:true}],
analizaPitalice:"Rečenica „nije poznato” je ishod ovog koraka. Sve jače tvrđenje pretiče dokaz."}],
"11:Tri stanja": [
{pitalica:"Zašto ćutanje nije „nije prošlo”?",opcije:[
{key:"A",text:"Zato što izostanak odgovora ne bira između uspeha i neuspeha na serveru.",why:"Tri stanja: prošlo, nije prošlo, nije stiglo. Ćutanje je treće.",ok:true},
{key:"B",text:"Zato što ćutanje uvek znači da je COMMIT gotov.",why:"To bi bilo „prošlo” bez dokaza. Ćutanje to ne kaže.",ok:false}],
analizaPitalice:"Treće stanje postoji da se rupa ne popuni optimizmom ni porazom. Oba su tvrđenja."}],
"11:Nepoznat ishod operacije": [
{pitalica:"Šta klijent pouzdano zna kad odgovor izostane?",opcije:[
{key:"A",text:"Da ishod nije potvrđen klijentu.",why:"Ne zna da ventilator nije uključen, niti da jeste. Zna samo da potvrde nema.",ok:true},
{key:"B",text:"Da operacija nije ni krenula.",why:"Zahtev je mogao da stigne i da se izvrši posle prekida odgovora.",ok:false}],
analizaPitalice:"Odsustvo odgovora je rupa u znanju klijenta. Pretvaranje rupe u „nije urađeno” vodi slepom ponavljanju."},
{pitalica:"Šta iz te rupe ne sledi kao prvi potez?",opcije:[
{key:"A",text:"Da se ista komanda odmah pošalje ponovo, bez čitanja.",why:"Ponavljanje pre nego što se zna efekat može da uradi drugi efekat, ako komanda nije postavljanje.",ok:true},
{key:"B",text:"Da se kaže da potvrde nema.",why:"To sledi. Ne sledi slepa druga komanda.",ok:false}],
analizaPitalice:"Prvi potez je priznati nepoznato, pa trag. Komanda dolazi tek kad se zna šta bi ponavljanje uradilo."}],
"11:Log": [
{pitalica:"Zašto natpis na dugmetu nije dovoljan pre ponavljanja?",opcije:[
{key:"A",text:"Zato što natpis ne kaže da li je upis stigao do baze.",why:"Log i ponovno čitanje sobe daju trag. Dugme daje želju.",ok:true},
{key:"B",text:"Zato što log uvek zamenjuje čitanje, pa je soba suvišna.",why:"Log i čitanje proveravaju različite slojeve. Jedan ne briše drugi.",ok:false}],
analizaPitalice:"Dovoljan dokaz pre ponavljanja je trag, ne ekran. Bez toga se ponavlja naslepo."}],
"11:Ponovi prebacivanje": [
{pitalica:"Zašto slepo ponavljanje prebacivanja može da poništi upis?",opcije:[
{key:"A",text:"Zato što drugi put računa suprotno od stanja koje je prvi put možda već ostavio.",why:"Ako je prvi prošao, drugi ga vrati. Nepoznat ishod čini taj rizik stvarnim.",ok:true},
{key:"B",text:"Zato što prebacivanje uvek ostavi isti efekat, pa je ponavljanje bezbedno.",why:"To važi za postavljanje željenog stanja, ne za prebacivanje.",ok:false}],
analizaPitalice:"Ova komanda je opasna baš kad se ne zna da li je prva prošla. Ponavljanje nije neutralno."}],
"11:Ponovi postavljanje": [
{pitalica:"Zašto drugi put „uključeno” ostavi isti željeni efekat ako je prvi prošao?",opcije:[
{key:"A",text:"Zato što oba traže isto stanje, ne suprotno od trenutnog.",why:"Postavljanje se sme ponoviti kad je to želja. Prebacivanje ne.",ok:true},
{key:"B",text:"Zato što je svako ponavljanje bezbedno čim prvi zahtev nije dobio odgovor.",why:"Bezbednost zavisi od operacije. Ćutanje samo po sebi ne bira komandu.",ok:false}],
analizaPitalice:"Isti željeni efekat je svojstvo ove komande. Nije dozvola da se ćutanje leči bilo kojim drugim zahtevom."}],
"11:LLM pravi suptilnu grešku": [
{pitalica:"Zašto „stigao je JSON” nije dovoljna provera koda koji je LLM predložio?",opcije:[
{key:"A",text:"Zato što telo može da stigne bez r.ok ili bez očekivanog polja, a prikaz to proguta.",why:"Suptilna greška prolazi na srećnom putu. Treba status i oblik pre crtanja.",ok:true},
{key:"B",text:"Zato što svaki JSON odgovor ima temperaturu, pa je provera suvišna.",why:"Ugovor to ne obećava za svaki status. 500 i tuđe telo nisu soba.",ok:false}],
analizaPitalice:"Generisan kod izgleda kao čitanje. Provera nastaje jer model ne izvršava negativan scenario sam."},
{pitalica:"Šta zamena async sa setTimeout ne reši?",opcije:[
{key:"A",text:"Ne proveri status ni strukturu tela.",why:"Drugačije čekanje i dalje crta šta stigne. Greška je u poverenju, ne u rasporedu čekanja.",ok:true},
{key:"B",text:"Ne pusti funkciju da sačeka odgovor.",why:"I await i timer mogu da sačekaju. Ni jedno ni drugo nije validacija.",ok:false}],
analizaPitalice:"Zamena konstrukcije jezika ostavlja istu rupu. Provera je r.ok i oblik."}],
"11:Anotacija": [
{pitalica:"Zašto tip objekta sobe ne proveri ulogu operatera dok zahtev traje?",opcije:[
{key:"A",text:"Zato što je anotacija opis poznatog oblika pre izvršavanja, ne grana na ruti.",why:"TypeScript ne vidi cookie ni mapu u toku zahteva.",ok:true},
{key:"B",text:"Zato što anotacija Soba zamenjuje 401 i 403.",why:"Ne zamenjuje. Uloga je runtime odluka.",ok:false}],
analizaPitalice:"Anotacija postoji da oblik u kodu bude čitljiv. Ko je pročita kao zaštitu, isključiće proveru na kutiji."}],
"11:Runtime": [
{pitalica:"Ko i dalje odbija tekst „da” u toku zahteva?",opcije:[
{key:"A",text:"Provera na kutiji.",why:"Statička anotacija je već gotova pre nego što telo stigne. Ulaz i dalje treba validator.",ok:true},
{key:"B",text:"Anotacija Soba, jer string nije broj u tipu.",why:"Telo HTTP-a nije provereno tipom fajla. „da” prolazi do handlera ako handler ćuti.",ok:false}],
analizaPitalice:"Runtime postoji jer mrežni unos nije vrednost koju je kompajler video."}],
"11:Adrese": [
{pitalica:"Šta dijagram adresa ne traži da se uradi uživo?",opcije:[
{key:"A",text:"Ceo deployment na javnu adresu.",why:"Dijagram drži lokalnu i javnu adresu da se vidi razlika. Izvođenje celog deploya nije čas.",ok:true},
{key:"B",text:"Jedan zahtev na lokalnom Node-u.",why:"To se upravo prati. Javna adresa ostaje na crtežu.",ok:false}],
analizaPitalice:"Adrese stoje da se ne pomešaju mašina i javni ulaz. Crtež nije nalog da se sistem objavi."}],
"11:Tip nije validacija": [
{pitalica:"Šta se desi ako u kod stigne {\"temperatura\":\"nepoznato\"} posle as Soba?",opcije:[
{key:"A",text:"as Soba pretvori string u broj pre toFixed.",why:"Tvrdnja tipa ne menja vrednost u toku. String ostaje string.",ok:false},
{key:"B",text:"Kod može da padne na toFixed, jer tvrđenje tipa nije provera odgovora.",why:"TypeScript je gotov pre izvršavanja. Mrežni podatak traži runtime proveru.",ok:true}],
analizaPitalice:"as postoji kao tvrđenje programera, ne kao filter. Ko mu veruje na odgovoru, sazna grešku tek na pozivu metode."},
{pitalica:"Šta TypeScript ne uradi sa tim odgovorom?",opcije:[
{key:"A",text:"Ne blokira ga na mreži.",why:"Odgovor je već stigao u proces. Tip ga ne presreće.",ok:true},
{key:"B",text:"Ne dozvoljava da se u kodu napiše polje temperatura.",why:"Dozvoljava, i zato primer uopšte pozove toFixed. Rupa je poverenje, ne zabrana polja.",ok:false}],
analizaPitalice:"Blokada na mreži bila bi validacija. Tip je raniji, uži alat."}],
"11:Jedan neuspeh": [
{pitalica:"Šta jedan namerni neuspeh pokaže, a šta ne?",opcije:[
{key:"A",text:"Pokaže gde se odgovor razlikuje od ćutanja, ne da je ceo sistem oboren.",why:"Jedan sloj je dovoljan da se vežba dijagnoza. Rušenje svega briše tu razliku.",ok:true},
{key:"B",text:"Pokaže da nijedna ruta više ne sluša.",why:"Tada se ne vidi razlika statusa i tišine na živom putu.",ok:false}],
analizaPitalice:"Namerni neuspeh postoji kao sočivo. Širi kvar sakrije sloj koji je čas hteo da imenuje."}],
"11:Izlaz": [
{pitalica:"Zašto izlaz nema pečat i opcije?",opcije:[
{key:"A",text:"Zato što je izlaz rečenica koju grupa nosi, ne još jedna ocenjena pitalica.",why:"Pečat bi zatvorio čas ocenom. Rečenica ostaje da se kaže svojim rečima.",ok:true},
{key:"B",text:"Zato što rečenica zamenjuje polje za upis pretpostavke.",why:"Izlaz nema ni polje. Pretpostavke ostaju u diskusiji teme, ne u izlazu.",ok:false}],
analizaPitalice:"Prazan izlaz je namera. Ko doda četiri opcije, vrati čas na glasanje umesto na formulaciju."}],
"11:Jedna soba": [
{pitalica:"Šta jedna temperatura i jedan ventilator na panelu ne dokazuju?",opcije:[
{key:"A",text:"Da je sistem završen za više soba, niti da je rezervna rečenica o tipu postala pitalica sa pečatom.",why:"Panel i dalje ima jednu sobu. Rezerva o tipu ostaje rečenica ako je diskusija pojela vreme.",ok:true},
{key:"B",text:"Da kurs uopšte ima temperaturu na ekranu.",why:"Ima je. Jedna soba nije nula soba. Nije ni druga soba.",ok:false}],
analizaPitalice:"Jedna soba drži granicu: nema novog proizvoda na kraju. Druga pitalica ne uvodi drugu sobu i ne pretvara rezervu u bodovani kviz."}],
};
