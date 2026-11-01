export const drugeD = {
"7:Željeno stanje": [
{pitalica:"Zašto telo komande ne nosi trenutne stepene?",opcije:[
{key:"A",text:"Zato što komanda postavlja režim, a temperatura je čitanje, ne želja.",why:"Boolean uključen kaže šta treba da važi. Stepeni nisu taj zahtev.",ok:true},
{key:"B",text:"Zato što ventilator ne može da bude uključen bez broja u telu.",why:"Režim i merenje su odvojeni. Telo režima nema temperaturu.",ok:false}],
analizaPitalice:"Komanda nastaje kao želja, ne kao izveštaj. Ko u telo stavi stepene, meša PUT sobe sa GET-om."}],
"7:PUT": [
{pitalica:"Zašto komanda nije GET /api/soba?",opcije:[
{key:"A",text:"Zato što GET te rute čita, a ovde se postavlja režim na drugu rutu.",why:"PUT /api/ventilator postoji da upis ne izgleda kao čitanje.",ok:true},
{key:"B",text:"Zato što GET ne sme da postoji ako postoji PUT.",why:"Obe rute postoje. Razlikuju se po nameri.",ok:false}],
analizaPitalice:"Isti server sme da ima oba zahteva. Iz uspešnog čitanja ne sledi da je komanda otišla."}],
"7:Jedno polje": [
{pitalica:"Zašto telo sa temperaturom uz ukljucen ne prolazi?",opcije:[
{key:"A",text:"Zato što je JSON ispravan, pa suvišno polje sme da se ignoriše.",why:"Ugovor traži tačno jedno polje. Višak nije „isto, samo bogatije”.",ok:false},
{key:"B",text:"Zato što ugovor prima samo ukljucen, da komanda ne prošvercuje merenje.",why:"Jedno polje drži granicu između režima i temperature.",ok:true}],
analizaPitalice:"Suvišno polje izgleda bezazleno. Ako prođe, klijent može da poveruje da je temperatura deo komande."}],
"7:Ugovor u šemi": [
{pitalica:"Zašto {\"ukljucen\":\"da\"} ne zadovoljava šemu iako je JSON?",opcije:[
{key:"A",text:"Zato što šema traži boolean, a sintaksno ispravan tekst nije tip.",why:"Parse može da prođe. Ugovor i dalje odbija string.",ok:true},
{key:"B",text:"Zato što šema proverava samo da li je fajl commitovan.",why:"Šema opisuje oblik. Commit nije provera tipa.",ok:false}],
analizaPitalice:"Šema postoji da „validan JSON” ne postane „validan režim”. Ko izjednači ta dva, pustiće tekst da."}],
"7:Validator na granici": [
{pitalica:"Zašto fajl šeme sam ne zaustavi loše telo?",opcije:[
{key:"A",text:"Zato što je šema dokument dok je handler ne pozove posle parse-a.",why:"Runtime provera je poziv. Fajl na disku ne filtrira zahtev.",ok:true},
{key:"B",text:"Zato što commit šeme uključi proveru na svakoj ruti.",why:"Commit čuva tekst. Ne registruje middleware.",ok:false}],
analizaPitalice:"Granica postoji u kodu koji prima zahtev. Šema bez poziva je komentar."}],
"7:Samo režim": [
{pitalica:"Zašto uspešan odgovor komande ne nosi temperaturu?",opcije:[
{key:"A",text:"Zato što bi broj u tom telu izgledao kao novo merenje, a komanda ga nije čitala.",why:"Odgovor potvrđuje režim. Svežina temperature ostaje na čitanju.",ok:true},
{key:"B",text:"Zato što 200 sme da ima samo prazno telo, pa je režim greška.",why:"Režim jeste u telu. Nema temperature, ne zato što je telo zabranjeno.",ok:false}],
analizaPitalice:"Usko telo postoji da displej ne povuče lažnu svežinu iz komande."}],
"7:Ponovljen PUT i toggle": [
{pitalica:"Zašto ponovljeno postavljanje ima isti željeni efekat, a prebacivanje nema?",opcije:[
{key:"A",text:"Zato što postavljanje kaže koje stanje treba, a prebacivanje kaže „suprotno od sada”.",why:"Idempotentnost je svojstvo željenog efekta pri ponavljanju, ne svojstvo statusa 200.",ok:true},
{key:"B",text:"Zato što je svaki PUT idempotentan samim imenom metode.",why:"Ime metode ne zna matematiku operacije. Toggle može da stoji i na PUT-u, i da ne bude idempotentan.",ok:false}],
analizaPitalice:"Razlika nastaje da se ponavljanje ne proglasi bezbednim zbog slova PUT. Gleda se efekat, ne glagol."},
{pitalica:"Šta iz idempotentnog postavljanja ne sledi?",opcije:[
{key:"A",text:"Da sme da se ponovi i komanda koja prebacuje režim.",why:"Prebacivanje menja ishod drugim slanjem. Isti željeni efekat važi samo za postavljanje.",ok:true},
{key:"B",text:"Da dva ista postavljanja ostave uključeno ako je to traženo.",why:"To sledi. Ne sledi pravilo za svaku komandu.",ok:false}],
analizaPitalice:"Ova granica se vraća kad ekran ćuti i neko hoće da pošalje komandu ponovo."}],
"7:Displej miruje": [
{pitalica:"Zašto komanda ne upiše novu temperaturu na displej?",opcije:[
{key:"A",text:"Zato što odgovor nema novo merenje, pa poslednje čitanje ostaje.",why:"Displej temperature čeka čitanje. Komanda nije taj izvor.",ok:true},
{key:"B",text:"Zato što 200 uvek briše cifre.",why:"Cifre ostaju. Miruju, ne nestaju.",ok:false}],
analizaPitalice:"Miruje da se uspeh komande ne protumači kao sveža soba."}],
"7:400": [
{pitalica:"Zašto tekst umesto boolean dobije 400, a ne 200?",opcije:[
{key:"A",text:"Zato što forma u browseru već sprečava takav unos, pa server sme da veruje.",why:"Forma nije granica. Telo mimo forme i dalje stiže, i ugovor ga odbija.",ok:false},
{key:"B",text:"Zato što telo nije režim, pa uspeh ne sme da se glumi.",why:"400 kaže da komanda nije prihvaćena. Nije temperatura i nije tišina.",ok:true}],
analizaPitalice:"400 postoji da loš oblik ne postane uključen ventilator. HTML forma nije taj filter."}],
"7:Dvaput uključeno": [
{pitalica:"Zašto drugi put „uključeno” ne isključi?",opcije:[
{key:"A",text:"Zato što oba slanja traže isto željeno stanje.",why:"Ponavljanje postavljanja ne menja cilj. Nema prebacivanja.",ok:true},
{key:"B",text:"Zato što server ignoriše svaki drugi PUT.",why:"Drugi se primenjuje. Efekat je isti, ne zato što je zahtev bačen.",ok:false}],
analizaPitalice:"Isti efekat nije dokaz da drugi zahtev nije stigao. Dokaz je da cilj nije zavisio od prethodnog stanja."}],
"7:Prebacivanje": [
{pitalica:"Zašto drugi put prebacivanja vrati prethodno stanje?",opcije:[
{key:"A",text:"Zato što svako slanje računa suprotno od onog što trenutno važi.",why:"Efekat zavisi od stanja u trenutku primene. Zato ponavljanje nije isto.",ok:true},
{key:"B",text:"Zato što je prebacivanje idempotentno, pa drugi put ne radi ništa.",why:"Upravo radi nešto drugo. Zato nije postavljanje.",ok:false}],
analizaPitalice:"Ovo je kontrapunkt dvaput uključenom. Slepo ponavljanje ovde može da poništi ono što je prvi put uradio."}],
"7:Ne veruj HTML formi": [
{pitalica:"Zašto server ne pretvori \"da\" u true?",opcije:[
{key:"A",text:"Zato što je ulaz mogao da zaobiđe formu, a ugovor traži boolean.",why:"Pogađanje značenja krije grešku. 400 je jasan odbijeni unos.",ok:true},
{key:"B",text:"Zato što browser više ne šalje telo ako je forma jednom proverena.",why:"Klijent nije jedini pošiljalac. curl i tuđi JS stižu istoj ruti.",ok:false}],
analizaPitalice:"Validacija na serveru nastaje jer je forma prikaz, ne dokaz. Ko veruje formi, pusti tekst u režim."},
{pitalica:"Šta provera forme na klijentu ipak sme da uradi?",opcije:[
{key:"A",text:"Da zameni proveru na serveru.",why:"Ne sme. Sme samo da pomogne osobi pre slanja.",ok:false},
{key:"B",text:"Da ranije kaže osobi za grešku, a server i dalje proveri telo.",why:"Dve provere imaju dva mesta. Klijentska ne skida serversku.",ok:true}],
analizaPitalice:"Odbaciti formu skroz nije cilj. Cilj je da se ne poveruje da je dovoljna."}],
"7:200 nije smisao": [
{pitalica:"Zašto 200 ne kaže da smeju obe komande da se ponove?",opcije:[
{key:"A",text:"Zato što status javlja ishod ovog odgovora, ne matematiku drugog slanja.",why:"I postavljanje i prebacivanje mogu da vrate 200. Efekat ponavljanja nije u tom broju.",ok:true},
{key:"B",text:"Zato što 200 znači da je zahtev odbijen.",why:"200 je uspeh tog zahteva. Nije odbijanje i nije opis ponavljanja.",ok:false}],
analizaPitalice:"Status i smisao se razdvajaju da se iz uspeha ne izvuče pravilo koje važi samo za jednu operaciju."}],
"7:Kabl napolju": [
{pitalica:"Zašto lopatice ne krenu ako prekidač kaže uključi, a ventilator nije priključen?",opcije:[
{key:"A",text:"Zato što 500 kaže da komanda nije izvršena, a natpis želje nije fizički efekat.",why:"Prekidač sme da ostane na uključi kao želja. Kabl i dalje nije tu.",ok:true},
{key:"B",text:"Zato što 500 uključi ventilator na daljinu.",why:"500 je neuspeh. Lopatice stoje.",ok:false}],
analizaPitalice:"Želja na ekranu i stanje uređaja se razilaze namerno u ovom primeru. Ko poveruje natpisu, ne gleda status."}],
"7:Granica": [
{pitalica:"Zašto preveliko telo ne dobije 200 i odsečen JSON?",opcije:[
{key:"A",text:"Zato što odsecanje pravi lažan objekat, a odbijenica kaže da unos nije postao režim.",why:"Granica postoji pre upisa. Polovičan JSON nije komanda.",ok:true},
{key:"B",text:"Zato što veliko telo uvek znači da je ventilator uključen.",why:"Veličina nije režim. Neuspeo parse nije uključenje.",ok:false}],
analizaPitalice:"Granica nastaje da se loš unos zaustavi pre posledice. 200 na odsečenom telu bi bio izmišljen uspeh."}],

"8:Parametar": [
{pitalica:"Zašto se vrednost ne lepi u tekst upita?",opcije:[
{key:"A",text:"Zato što ulaz koji postane deo SQL-a može da promeni naredbu, a $1 ostaje podatak.",why:"Parametar postoji da komanda i podatak ne dele isti string.",ok:true},
{key:"B",text:"Zato što $1 ubrzava upit tako što ga PostgreSQL ne čita.",why:"Baza čita upit. Parametar menja ulogu vrednosti, ne ukida izvršavanje.",ok:false}],
analizaPitalice:"Lepljenje izgleda kraće dok unos ne sadrži navodnik. Tada više nije vrednost režima."}],
"8:Dva reda": [
{pitalica:"Zašto evidencija traži i režim i istoriju?",opcije:[
{key:"A",text:"Zato što trenutno stanje bez zapisa komande ne kaže šta je traženo.",why:"Jedan red nije cela evidencija. Oba moraju da pripadaju istom upisu.",ok:true},
{key:"B",text:"Zato što istorija sme da se izgubi ako je režim tačan.",why:"Tada evidencija laže da komande nije bilo, ili obrnuto ako režim nedostaje.",ok:false}],
analizaPitalice:"Dva reda nastaju jer stanje i trag nisu isti podatak. Sledeći korak ih stavlja u jednu transakciju baš zato."}],
"8:BEGIN": [
{pitalica:"Šta BEGIN još ne uradi?",opcije:[
{key:"A",text:"Ne potvrdi upis i ne pokrene novi Node proces.",why:"Otvara transakciju. Dok nema COMMIT, izmene te celine nisu prihvaćene kao gotove.",ok:true},
{key:"B",text:"Ne grupiše naredne upite.",why:"Upravo ih stavlja u jednu celinu. Ne sledi da je celina već trajna.",ok:false}],
analizaPitalice:"BEGIN postoji da dva upita imaju granicu. Ko ga čita kao COMMIT, ne vidi šta ROLLBACK još može da povuče."}],
"8:COMMIT": [
{pitalica:"Zašto posle COMMIT-a oba reda ostanu i posle restarta procesa?",opcije:[
{key:"A",text:"Zato što je potvrda transakcije na bazi, ne u memoriji Node-a.",why:"Restart procesa ne briše potvrđen upis. To je razlog što COMMIT uopšte postoji.",ok:true},
{key:"B",text:"Zato što COMMIT drži podatak samo do gašenja node procesa.",why:"To bi bio upis u memoriju procesa. Ovde ostaje baza.",ok:false}],
analizaPitalice:"COMMIT je granica posle koje oba reda važe zajedno. Iz njega ne sledi da je disk neuništiv."}],
"8:Zašto SQL parametri?": [
{pitalica:"Šta parametar ne zameni?",opcije:[
{key:"A",text:"Ne zameni transakciju: bezbedan podatak i dalje može da ostane upola upisan ako upiti nisu jedna celina.",why:"$1 sprečava da unos postane SQL. Ne spaja dva reda u atomski upis.",ok:true},
{key:"B",text:"Ne sprečava da se vrednost tretira kao podatak.",why:"To upravo radi. Ne radi posao BEGIN/COMMIT.",ok:false}],
analizaPitalice:"Dve zaštite se lako spoje u „baza je bezbedna”. Parametar i transakcija nastaju iz različitih rupa."},
{pitalica:"Zašto PostgreSQL ne „ignoriše grešku” umesto parametra?",opcije:[
{key:"A",text:"Zato što ignorisanje ne bi razlikovalo podatak od naredbe.",why:"Greška u strukturi je upravo ono što lepljenje može da izazove namerno.",ok:true},
{key:"B",text:"Zato što parametar ukida potrebu za bilo kojim upitom.",why:"Upit ostaje. Menja se samo kako vrednost ulazi.",ok:false}],
analizaPitalice:"Prva pitalica već kaže da je $1 podatak. Ova odbija utehu da će baza sama progutati opasan unos."}],
"8:ROLLBACK": [
{pitalica:"Zašto posle neuspelog drugog upita ne ostane samo režim?",opcije:[
{key:"A",text:"Zato što bi režim bez istorije te transakcije bio pola evidencije.",why:"ROLLBACK vraća oba. Jedan uspeo upit unutar nepotvrđene celine ne sme da preživi sam.",ok:true},
{key:"B",text:"Zato što prvi upit uvek stoji, a istorija može kasnije.",why:"To je ishod bez transakcije. Ovde je upravo odbijen.",ok:false}],
analizaPitalice:"Pola upisa izgleda kao uspeh dok neko ne potraži komandu koje nema. Zato se prvi upit povlači."}],
"8:Restart procesa": [
{pitalica:"Zašto novi Node proces i dalje vidi režim?",opcije:[
{key:"A",text:"Zato što je režim u bazi posle uspele transakcije, a proces ga ne drži kao jedini primerak.",why:"Restart procesa nije restart podatka. Podrazumevano isključeno važi samo ako upisa nema.",ok:true},
{key:"B",text:"Zato što Node pri gašenju prepisuje RAM u tabele.",why:"Proces ne čuva tabele. Čita ono što je COMMIT ostavio.",ok:false}],
analizaPitalice:"Ovaj restart postoji da se proces ne pomeša sa diskom. Sledeći korak pokazuje šta restart ne ume da spoji."}],
"8:Dva odvojena upita": [
{pitalica:"Zašto restart ne spoji dva upita koji su bili „za istu komandu”?",opcije:[
{key:"A",text:"Zato što namera u kodu nije granica baze, a bez transakcije svaki upit važi sam.",why:"Ako drugi ne stigne, prvi ostaje. Restart to ne popravlja unazad.",ok:true},
{key:"B",text:"Zato što svaka dva uzastopna upita automatski dele BEGIN.",why:"Ne dele, dok ga kod ne otvori. Zato primer i postoji.",ok:false}],
analizaPitalice:"Odvojeni upiti nastaju kao kontrapunkt COMMIT-u. Želja da pripadaju istoj komandi ne pravi transakciju."}],
"8:Kontejner": [
{pitalica:"Zašto ugašen kontejner ne briše režim ako disk ostane?",opcije:[
{key:"A",text:"Zato što proces baze nestane, a podatak nije živeo samo u tom procesu.",why:"Kontejner nije atomičnost ni trajnost. On pokreće proces.",ok:true},
{key:"B",text:"Zato što Docker drži svaki upis u memoriji kontejnera i nigde više.",why:"Tada bi režim nestao sa procesom. Ako disk ostane, čitanje i dalje vidi upis.",ok:false}],
analizaPitalice:"Kontejner se lako pročita kao baza. Nije. Trajnost je na disku koji preživi proces."}],
"8:Transakcija i pad procesa": [
{pitalica:"Šta važi ako proces baze padne pre COMMIT-a?",opcije:[
{key:"A",text:"Nepotvrđene izmene te transakcije se povlače.",why:"Atomski upis znači oba ili nijedan. Pad pre potvrde nije pola uspeha.",ok:true},
{key:"B",text:"UPDATE mora ostati, a INSERT će se sam izvršiti posle dizanja.",why:"Baza ne dovršava nagađanjem drugu naredbu. Celina nije potvrđena.",ok:false}],
analizaPitalice:"Pad procesa je test granice, ne razlog da se prvi upit proglasi svetim."}],
"8:Disk": [
{pitalica:"Zašto čitanje posle uklanjanja trajnog skladišta vidi početno stanje?",opcije:[
{key:"A",text:"Zato što Docker pamti režim i bez diska.",why:"Bez trajnog skladišta nema starog upisa. Početno stanje nije „isti režim”.",ok:false},
{key:"B",text:"Zato što je podatak bio na tom skladištu, ne u imenu kontejnera.",why:"Restart procesa i brisanje kontejnera nisu isto što i brisanje diska. Ovde nestaje disk.",ok:true}],
analizaPitalice:"Tri uklanjanja postoje da se ne saberu u „Docker je pao”. Samo gubitak diska briše potvrđen režim."}],
"8:Credential": [
{pitalica:"Zašto odgovor browseru ne sme da nosi credential baze?",opcije:[
{key:"A",text:"Zato što je lozinka baze ovlašćenje procesa, ne podatak sobe.",why:"Browser treba temperaturu ili režim. Credential u telu je odavanje pristupa.",ok:true},
{key:"B",text:"Zato što temperatura sme da stoji samo u bazi, ne u JSON-u.",why:"Temperatura sme da se vrati. Zabranjen je tajni pristup bazi.",ok:false}],
analizaPitalice:"Odgovor postoji za klijenta sobe. Ko u njega stavi vezu ka bazi, pomerio je granicu poverenja na svakog ko vidi JSON."}],
"8:Put": [
{pitalica:"Zašto je provera tela na kutiji, pre upisa?",opcije:[
{key:"A",text:"Zato što browser već proveri formu, pa kutija samo čuva.",why:"Browser nije granica. Baza ne sme da vidi telo koje nije režim.",ok:false},
{key:"B",text:"Zato što neispravan unos ne sme da postane red.",why:"Put je: proveri, pa upiši. Obrnut red ostavlja đubre u tabeli.",ok:true}],
analizaPitalice:"Mesto provere je deo ishoda časa. Baza nije validator HTTP tela."}],
"8:Istorija nije sporedna": [
{pitalica:"Kada evidencija postane cela?",opcije:[
{key:"A",text:"Kad režim i istorija uspeju ili padnu kao jedna transakcija.",why:"Do tada trag i stanje mogu da se raziđu. Trenutno stanje samo nije evidencija.",ok:true},
{key:"B",text:"Kad trenutni režim izgleda ispravno, bez obzira na istoriju.",why:"Tada se ne zna koja je komanda dovela do njega, niti da li je zapis kompletan.",ok:false}],
analizaPitalice:"Sporedna istorija je lažna uteha. Transakcija postoji baš zato što oba reda moraju da važe zajedno."}],

"9:Miruje": [
{pitalica:"Zašto displej stoji iako soba može da se promeni?",opcije:[
{key:"A",text:"Zato što ga ni takt ni odgovor komande ne pomeraju.",why:"Stoji jer niko ne donosi novo čitanje. Ne zato što je merenje stalo.",ok:true},
{key:"B",text:"Zato što je takt već uključen i samo čeka crtež.",why:"Na ovom koraku takt još ne pomera displej. To je poenta.",ok:false}],
analizaPitalice:"Miruje da se vidi rupa: prikaz nije senzor. Takt nastaje kasnije baš zato."}],
"9:Trenutak": [
{pitalica:"Zašto očitavanje nosi i trenutak, ne samo temperaturu?",opcije:[
{key:"A",text:"Zato što broj bez vremena merenja ne kaže da li je ovo sada.",why:"Dva broja 24 mogu biti različita očitavanja. Trenutak ih razlikuje.",ok:true},
{key:"B",text:"Zato što trenutak zamenjuje vrednost, pa temperatura sme da se odbaci.",why:"Oba putuju. Trenutak ne briše stepene.",ok:false}],
analizaPitalice:"Trenutak postoji da svežina ima podatak, ne utisak. Samo temperatura ostavlja 24 bez starosti."}],
"9:Starost": [
{pitalica:"Zašto 24 od pre deset minuta nije sadašnja temperatura?",opcije:[
{key:"A",text:"Zato što je displej pokazao broj, pa broj mora da je svež.",why:"Prikaz ne osvežava merenje. Starost kaže da je očitavanje staro.",ok:false},
{key:"B",text:"Zato što je to poslednje očitavanje, a soba je mogla da se promeni posle njega.",why:"Broj bez svežine laže sadašnjost. Starost to prekida.",ok:true}],
analizaPitalice:"Starost postoji da se poslednji poznati broj ne pročita kao sada. Deset minuta je kontrapunkt, ne ukras."}],
"9:Odmah jedno": [
{pitalica:"Zašto se ne čeka pun interval pre prvog čitanja?",opcije:[
{key:"A",text:"Zato što uključivanje inače ostavi stari ekran još jedan ceo rok.",why:"Jedno čitanje odmah daje trenutni pokušaj. Interval dolazi posle, za ponavljanje.",ok:true},
{key:"B",text:"Zato što interval zabranjuje svako čitanje u prvoj minuti.",why:"Interval meri razmak ponavljanja. Ne brani prvi zahtev.",ok:false}],
analizaPitalice:"Odmah jedno nastaje jer čekanje punog takta izgleda kao kvar. Prvo čitanje i ritam nisu isti događaj."}],
"9:Novije merenje stiže ranije": [
{pitalica:"Zašto poslednje primljeno nije uvek ono koje treba da ostane?",opcije:[
{key:"A",text:"Zato što vreme prijema nije vreme merenja.",why:"Starije merenje može da zakasni i da stigne posle novijeg. Verzija je trenutak merenja.",ok:true},
{key:"B",text:"Zato što mreža uvek isporučuje očitavanja redom merenja.",why:"Da jeste, provera ne bi trebala. Kašnjenje je razlog pravila.",ok:false}],
analizaPitalice:"Pravilo nastaje iz obrnutog redosleda. Ko ostavi A jer je stiglo poslednje, prikaže stariju sobu."},
{pitalica:"Šta provera trenutka ne zna?",opcije:[
{key:"A",text:"Da li je novije merenje i fizički tačno.",why:"Bira noviju verziju među primljenima. Ne baždari senzor.",ok:true},
{key:"B",text:"Koje od dva očitavanja ima noviji trenutak.",why:"To upravo zna, ako oba nose trenutak. Ne zna istinitost senzora.",ok:false}],
analizaPitalice:"Svežina nije tačnost instrumenta. Mešanje ta dva zaustavlja dijagnozu na pogrešnom sloju."}],
"9:Neuspeo krug": [
{pitalica:"Zašto neuspeo krug ne uvodi novu granu za Err?",opcije:[
{key:"A",text:"Zato što je i dalje jedno čitanje koje nije uspelo, pa prikaz već ima tu granu.",why:"Periodično čitanje ne izmišlja drugi neuspeh. Deli put sa Pročitaj.",ok:true},
{key:"B",text:"Zato što takt ne sme da piše Err, pa ostavi cifre i kad zahtev padne.",why:"Tada bi stari broj izgledao kao svež uspeh. Err je isti znak.",ok:false}],
analizaPitalice:"Ista grana postoji da takt i dugme ne lažu različito. Novi server se ovde ne uvodi."}],
"9:Stariji gubi": [
{pitalica:"Šta ekran pokaže ako provera stoji, a stariji odgovor stigne poslednji?",opcije:[
{key:"A",text:"Noviji broj. Stariji ne sme da ga pregazi.",why:"Provera poredi trenutke. Red prijema gubi.",ok:true},
{key:"B",text:"Stariji broj, jer je poslednji događaj uvek istina ekrana.",why:"To važi tek bez provere. Sa proverom poslednji prijem nije pravilo.",ok:false}],
analizaPitalice:"Korak postoji da se vidi efekat pravila, ne samo priča o njemu."}],
"9:Komanda nije čitanje": [
{pitalica:"Zašto 200 komande ne osveži starost temperature?",opcije:[
{key:"A",text:"Zato što taj odgovor ne nosi novo očitavanje temperature.",why:"Režim i merenje imaju različite odgovore. Starost čeka novo čitanje.",ok:true},
{key:"B",text:"Zato što je svaki 200 novo merenje, pa starost mora na nulu.",why:"Status ne kaže šta je mereno. Komanda nije čitanje sobe.",ok:false}],
analizaPitalice:"Osvežavanje starosti na komandi bi prikazalo lažnu svežinu. Zato displej temperature čeka svoj zahtev."}],
"9:Push": [
{pitalica:"Zašto push ne hrani sobu prekidača?",opcije:[
{key:"A",text:"Zato što ovaj push puni sobu mašina, a prekidač i dalje povlači čitanje.",why:"Dva izvora se ne spajaju zato što oba jesu „podatak”. Ugovor push-a je uži.",ok:true},
{key:"B",text:"Zato što push zamenjuje svaki GET u aplikaciji.",why:"Ne zamenjuje čitanje prekidača. To bi bio drugi ugovor.",ok:false}],
analizaPitalice:"Push nastaje kao uži kanal. Ko ga pročita kao sva čitanja, ugasiće Pročitaj bez razloga."}],
"9:Interval i preklapanje": [
{pitalica:"Zašto setInterval ne čeka await prethodnog čitanja?",opcije:[
{key:"A",text:"Zato što takt zakazuje sledeći poziv po satu, ne po završetku prethodnog Promise-a.",why:"Naivni interval može da pokrene drugi zahtev dok prvi traje.",ok:true},
{key:"B",text:"Zato što browser dozvoljava samo jedan aktivan zahtev, pa preklop nije moguć.",why:"Dva zahteva smeju da budu u letu. Zato preklop jeste opasnost.",ok:false}],
analizaPitalice:"Preklop postoji kao rupa takta. Ko veruje da await usporava interval, neće videti dva odgovora van reda."},
{pitalica:"Šta preklop sam po sebi ne dokazuje?",opcije:[
{key:"A",text:"Da je noviji odgovor obavezno i novije merenje.",why:"Dva zahteva u letu i dalje mogu da se vrate obrnutim redom merenja. Treba trenutak, ne samo preklop.",ok:true},
{key:"B",text:"Da je drugi zahtev mogao da krene pre nego što je prvi gotov.",why:"To preklop jeste. Ne dokazuje svežinu.",ok:false}],
analizaPitalice:"Interval i provera trenutka rešavaju susedne, ne iste probleme."}],
"9:Nema push": [
{pitalica:"Šta čas od sobe prekidača ne pravi?",opcije:[
{key:"A",text:"Ne pravi push na taj displej i ne uvodi novi server.",why:"Displej i dalje čita. Push ostaje na sobi mašina.",ok:true},
{key:"B",text:"Ne ostavlja čitanje, jer je push podrazumevan čim postoji interval.",why:"Interval je i dalje povlačenje. Nije push.",ok:false}],
analizaPitalice:"Odsustvo push-a je odluka granice časa. Ko ga doda „jer je modernije”, meša dva modela svežine."}],
"9:Pročitaj ostaje": [
{pitalica:"Zašto interval ne zameni dugme Pročitaj?",opcije:[
{key:"A",text:"Zato što jedno čitanje i dalje treba kad čovek hoće broj sada, ne na sledećem taktu.",why:"Dugme ostaje poseban zahtev. Ritam ga ne briše.",ok:true},
{key:"B",text:"Zato što interval prestane da radi ako dugme postoji.",why:"Oba mogu da stoje. Jedno ne gasi drugo.",ok:false}],
analizaPitalice:"Pročitaj ostaje da takt ne postane jedini način da se vidi soba."}],
"9:Bez provere": [
{pitalica:"Šta stariji odgovor uradi kad je odbacivanje isključeno?",opcije:[
{key:"A",text:"I dalje gubi, jer je server poslao oba.",why:"Server šalje oba. Bez provere na prikazu, poslednji prijem pregazi ekran.",ok:false},
{key:"B",text:"Pregazi noviji broj.",why:"Jedna promena u editoru skida pravilo. Ekran tada veruje redu prijema.",ok:true}],
analizaPitalice:"Isključena provera je kontrapunkt. Ko i dalje vidi da stariji gubi, nije isključio onu liniju."}],
"9:Dva roka": [
{pitalica:"Zašto ikonica i temperatura ne moraju isti rok cache-a?",opcije:[
{key:"A",text:"Zato što svežina zavisi od toga šta zastareva, a stranica nije jedan cache.",why:"Ikonica sme da traje duže od merenja. Isti rok bi ili kasnio sliku ili lažirao temperaturu.",ok:true},
{key:"B",text:"Zato što browser ima jedan rok za sve odgovore te adrese.",why:"Različiti odgovori smeju da imaju različita pravila. Stranica nije jedan zapis.",ok:false}],
analizaPitalice:"Dva roka postoje da se cache ne pročita kao jedno dugme. Zastarela ikonica nije zastarela soba, i obrnuto."}],
};
