export const drugeB = {
"2:Stranica": [
{pitalica:"Zašto fajl koji počinje sa html još nije program?",opcije:[
{key:"A",text:"Zato što browser čita dokument, a oznaka jezika ne pokreće proces.",why:"html i lang otvaraju dokument. Izvršavanje koda je drugi sloj, i na ovom času ga nema.",ok:true},
{key:"B",text:"Zato što lang zabranjuje da se fajl ikad otvori.",why:"lang kaže jezik dokumenta. Browser ga upravo zato učita.",ok:false}],
analizaPitalice:"Ako student iz učitanog fajla zaključi da je program krenuo, pomešao je dokument i proces. Stranica nastaje da bi se tekst video, ne da bi se komanda izvršila."}],
"2:Glava": [
{pitalica:"Šta iz charset-a i title-a u glavi ne sledi?",opcije:[
{key:"A",text:"Da je temperatura sobe već pročitana.",why:"Glava nosi podatke o dokumentu. Merenje nije u head-u i još nema zahtev.",ok:true},
{key:"B",text:"Da browser zna kako da protumači bajtove teksta i koji je naslov dokumenta.",why:"To glava upravo radi. Neuspeh bi bio drugi, ne ovaj.",ok:false}],
analizaPitalice:"Glava postoji da dokument kaže nešto o sebi pre vidljivog dela. Iz toga ne sledi da soba ima stanje."}],
"2:Naslov": [
{pitalica:"Zašto osvežavanje ne zaboravi h1?",opcije:[
{key:"A",text:"Zato što browser pamti naslov i kad fajl nestane.",why:"Bez fajla nema šta da se ponovo učita. Pamćenje prikaza nije izvor naslova.",ok:false},
{key:"B",text:"Zato što h1 stoji u fajlu, a osvežavanje taj fajl ponovo učita.",why:"Naslov je deo dokumenta, ne stanje koje se pamti mimo fajla.",ok:true}],
analizaPitalice:"h1 postoji da uloga naslova bude u dokumentu. Osvežavanje je vraća jer je čita iz fajla, ne iz prethodnog prikaza."}],
"2:Širina kutije": [
{pitalica:"Zašto 200 u width nije ukupna širina kutije?",opcije:[
{key:"A",text:"Zato što content-box meri sadržaj, pa se padding i border dodaju.",why:"Deklarisana širina nije spoljašnja. 200 + 20 + 20 + 2 + 2 daje 244 bez margina.",ok:true},
{key:"B",text:"Zato što roditelj uvek prepiše width.",why:"U ovom primeru roditelj ne menja računicu. Iznenađenje dolazi iz modela kutije.",ok:false}],
analizaPitalice:"Content-box je nastao da width znači širinu sadržaja. Ko ga čita kao ukupnu kutiju, pogreši raspored i ne vidi gde su nestali pikseli."},
{pitalica:"Šta u tih 244 px nije uračunato?",opcije:[
{key:"A",text:"Padding i border.",why:"Oni jesu u 244. To je poenta prethodne računice.",ok:false},
{key:"B",text:"Margin.",why:"Ukupna širina bez margina je 244. Margin stoji van te kutije i ne ulazi u zbir.",ok:true}],
analizaPitalice:"Tačan zbir i dalje ima granicu. Margin nije deo width+padding+border. Sledeći korak koji doda margin ne sme da se sabere u istih 244."}],
"2:Broj": [
{pitalica:"Zašto 24 na početku ne dokazuje merenje?",opcije:[
{key:"A",text:"Zato što je broj upisan u HTML, a zahtev za sobu još ne postoji.",why:"class i p drže tekst. Senzor nije izvor tog znaka.",ok:true},
{key:"B",text:"Zato što class=\"digit\" sam čita kutiju.",why:"Klasa bira element za stil. Ne šalje zahtev i ne meri.",ok:false}],
analizaPitalice:"Statičan broj postoji da bi se videlo šta dokument ume sam. Iz prikaza 24 ne sledi da je soba sada 24."}],
"2:Dugme": [
{pitalica:"Zašto dugme u dokumentu još ne šalje komandu?",opcije:[
{key:"A",text:"Zato što type=\"button\" zabranjuje svaki kasniji zahtev.",why:"Tip sprečava podrazumevano slanje forme. Ne odlučuje da li će kasnije postojati server.",ok:false},
{key:"B",text:"Zato što button imenuje kontrolu, a nema još kome da se zahtev pošalje.",why:"Oznaka nije komanda. Komanda traži server i rutu, a njih ovaj čas nema.",ok:true}],
analizaPitalice:"Dugme nastaje kao deo dokumenta. Klik bez slušaoca i bez rute ne menja ni fajl ni sobu."}],
"2:Veza": [
{pitalica:"Zašto veza ka stilu ne promeni broj 24?",opcije:[
{key:"A",text:"Zato što href traži CSS, a broj i dalje stoji u HTML-u.",why:"link učitava izgled. Ne prepisuje tekst elementa.",ok:true},
{key:"B",text:"Zato što browser odbija stil dok postoji h1.",why:"Naslov i stil stoje zajedno. Jedan ne briše drugi.",ok:false}],
analizaPitalice:"Stil je izdvojen da bi izgled mogao da se zameni bez menjanja broja. Učitan CSS nije merenje."}],
"2:Specifičnost selektora": [
{pitalica:"Zašto poslednje pravilo ne pobedi uvek?",opcije:[
{key:"A",text:"Zato što CSS uopšte ne gleda redosled.",why:"Redosled važi, ali tek posle porekla, važnosti i specifičnosti.",ok:false},
{key:"B",text:"Zato što se redosled gleda tek kad su poreklo, važnost i specifičnost jednaki.",why:"ID je specifičniji od klase iste važnosti, pa kasnije plavo pravilo ne prepisuje crveno.",ok:true}],
analizaPitalice:"Cascade postoji jer „poslednji red u fajlu” nije dovoljan dogovor. Ko to pravilo usvoji, ne ume da kaže zašto je tekst crven."},
{pitalica:"Šta iz crvene boje ovde ne sledi?",opcije:[
{key:"A",text:"Da nijedan drugi poreklo ili !important ne može da promeni boju.",why:"Specifičnost je jedan faktor. Važnost i poreklo mogu da preteknu ID.",ok:true},
{key:"B",text:"Da je, uz istu važnost, ID pobedio klasu.",why:"To upravo sledi iz ovog primera. Šira zabrana ne sledi.",ok:false}],
analizaPitalice:"Tačan odgovor na boju nije teorija da ID zauvek pobeđuje. Sledeći čas koji uvede !important ne sme da se čita ovim primerom."}],
"2:Selektor": [
{pitalica:"Zašto .digit ne oboji svaki element?",opcije:[
{key:"A",text:"Zato što tačka u selektoru znači samo prvi element na strani.",why:"Tačka znači klasu. Redosled u dokumentu nije značenje tačke.",ok:false},
{key:"B",text:"Zato što se poklapa samo element koji ima tu klasu.",why:"Selektor postoji da stil pogodi nameru, ne celu stranu.",ok:true}],
analizaPitalice:"Bez selektora svako pravilo bi bilo globalno. Klasa ne menja tekst 24; bira kome izgled pripada."}],
"2:Okvir": [
{pitalica:"Zašto border ne upiše novi broj u fajl?",opcije:[
{key:"A",text:"Zato što je ivica prikaz kutije, a 24 je tekst dokumenta.",why:"border crta granicu. Ne dira čvor teksta.",ok:true},
{key:"B",text:"Zato što border sme da menja samo marginu.",why:"Border i margina su različiti delovi kutije. Ovde se ne menja ni margina ni broj.",ok:false}],
analizaPitalice:"Ivica postoji da se kutija vidi. Ko iz okvira zaključi da se merenje promenilo, pomešao je sloj prikaza i sadržaj."}],
"2:Osvežavanje": [
{pitalica:"Zašto 10 nestane posle osvežavanja?",opcije:[
{key:"A",text:"Zato što browser pri reload-u upisuje 24 u fajl.",why:"Osvežavanje čita fajl. Ne piše u njega.",ok:false},
{key:"B",text:"Zato što je 10 bio lokalni prikaz, a fajl i dalje kaže 24.",why:"Prikaz može da se odvoji od dokumenta. Reload vraća dokument.",ok:true}],
analizaPitalice:"Ovo je razlog što alati i privremeni tekst nisu izvor istine. Bez fajla kao izvora, 10 bi ostao i posle osvežavanja."}],
"2:Raspored pri uskom ekranu": [
{pitalica:"Zašto jedna kolona nije brisanje druge kontrole?",opcije:[
{key:"A",text:"Zato što grid menja raspored, a kontrola ostaje u dokumentu.",why:"Nema mesta za dve minimalne širine, pa kolone postanu jedna. DOM se ne seče.",ok:true},
{key:"B",text:"Zato što uski ekran uvek izazove horizontalni overflow i time sačuva obe kolone.",why:"To je upravo ishod koji grid ovde izbegava. Overflow nije jedini mogući raspored.",ok:false}],
analizaPitalice:"Prilagođeni raspored nastaje da sadržaj ostane dostižan. Iz jedne kolone ne sledi da je druga kontrola uklonjena iz fajla."}],
"2:Alati": [
{pitalica:"Zašto izmena u alatima ne preživi osvežavanje?",opcije:[
{key:"A",text:"Zato što alati šalju novi HTML na server.",why:"Na ovom času nema upisa. Alati diraju prikaz u ovom browseru.",ok:false},
{key:"B",text:"Zato što je promena lokalni prikaz, a dokument u fajlu ostaje.",why:"Isti razlog kao broj 10: prikaz nije fajl.",ok:true}],
analizaPitalice:"Alati postoje da se vidi razlika. Ko sačuva izmenu alata kao da je sačuvao dokument, ponoviće je posle svakog reload-a."}],
"2:Dva zahteva": [
{pitalica:"Zašto broj 24 ne dokazuje zahtev za sobu?",opcije:[
{key:"A",text:"Zato što Network vidi dokument i stil, a API sobe još nema.",why:"Dva zahteva objašnjavaju prikaz fajlova. Broj je u HTML-u.",ok:true},
{key:"B",text:"Zato što browser za jednu stranu sme da pošalje samo jedan zahtev.",why:"Strana već šalje dva: dokument i stil. Granica nije „jedan zahtev”.",ok:false}],
analizaPitalice:"Mrežni trag nastaje da se vidi šta je stvarno traženo. Iz prikazanog broja ne sledi čitanje senzora."},
{pitalica:"Šta bi se promenilo ako bi se pojavio treći zahtev ka /api/soba?",opcije:[
{key:"A",text:"Ništa: i dalje bi broj morao da bude iz fajla.",why:"Treći zahtev bi bio novi izvor. Dok ga nema, fajl jeste izvor.",ok:false},
{key:"B",text:"Tek tada bi broj mogao da dođe iz odgovora, a ne iz HTML-a.",why:"Do tog zahteva 24 ostaje tekst. Pojavom čitanja izvor se menja, i to treba videti u Network-u.",ok:true}],
analizaPitalice:"Ova pitalica drži granicu časa. Ne uvodi fetch. Kaže samo šta trenutni trag ne sadrži."}],
"2:Semantika": [
{pitalica:"Zašto velika slova nisu zamena za h1?",opcije:[
{key:"A",text:"Zato što server čita temperaturu iz oznake h1.",why:"Server ovde ne čita naslov kao merenje. To je pogrešan razlog za semantiku.",ok:false},
{key:"B",text:"Zato što veličina može da se promeni stilom, a uloga naslova ostaje u oznaci.",why:"Semantika postoji da značenje preživi zamenu izgleda.",ok:true}],
analizaPitalice:"Ako student ofarba pasus i poveća slova, dokument i dalje nema naslov. h1 nije ukras."}],

"3:Objekat": [
{pitalica:"Zašto temperatura stoji u polju, a ne u natpisu dugmeta?",opcije:[
{key:"A",text:"Zato što je stanje podatak programa, a natpis je tekst kontrole.",why:"Objekat postoji da soba ima polja pre bilo kakvog crtanja.",ok:true},
{key:"B",text:"Zato što natpis na dugmetu ne može da bude tekst.",why:"Natpis može da bude tekst. Nije izvor temperature.",ok:false}],
analizaPitalice:"Ako se stanje ostavi u natpisu, sledeći prikaz mora da ga parsira iz DOM-a. Polje postoji da to ne bude izvor."}],
"3:const": [
{pitalica:"Zašto const na objektu sobe, ako polje sme da se menja?",opcije:[
{key:"A",text:"Da bi temperatura ostala 24 zauvek.",why:"const ne zamrzava polja. Taj zaključak je pogrešan i prva pitalica ga već odbija.",ok:false},
{key:"B",text:"Da ime i dalje pokazuje na isti objekat, a ne na novu sobu.",why:"const brani novu dodelu imena. Izmena polja ne pravi drugi objekat.",ok:true}],
analizaPitalice:"const nastaje da se ime ne preveže. Ko ga čita kao Object.freeze, ne ume da objasni zašto temperatura ipak može da se uveća."},
{pitalica:"Šta iz izmene soba.temperatura ne sledi?",opcije:[
{key:"A",text:"Da je const ignorisan.",why:"Ime je i dalje vezano za isti objekat. Zabrana dodele nije prekršena.",ok:true},
{key:"B",text:"Da je promenjeno polje, a veza imena ostala.",why:"To upravo sledi. Ne sledi da je const prestao da važi.",ok:false}],
analizaPitalice:"Dva različita događaja: prevezivanje imena i izmena polja. Samo prvi const brani."}],
"3:Primitivna vrednost i referenca": [
{pitalica:"Zašto prvi ispis ostane 24, a drugi postane 25?",opcije:[
{key:"A",text:"Zato što je broj kopiran, a objekat deli referencu.",why:"Dodela primitiva pravi vrednost. Dodela objekta pravi drugo ime istog objekta, pa izmena polja vidi se kroz njega.",ok:true},
{key:"B",text:"Zato što se svaka dodela u JavaScript-u ponaša kao kopija celog objekta.",why:"Da jeste, oba ispisa bi ostala 24. Primer pokazuje suprotno.",ok:false}],
analizaPitalice:"Razlika postoji da se ne zaključi da je svako ime nezavisna soba. 24 25 je dokaz, ne slučajan ispis."}],
"3:Drugo ime": [
{pitalica:"Šta bi nedostajalo da je drugo ime dobilo kopiju?",opcije:[
{key:"A",text:"Ništa: i dalje bi oba videla 26.",why:"Kopija ne vidi tuđu izmenu. 26 se vidi baš zato što kopije nema.",ok:false},
{key:"B",text:"Izmene kroz jedno ime. Drugo bi i dalje držalo 24.",why:"Deljena referenca je razlog što drugo ime vidi 26. Kopija bi raskinula tu vezu.",ok:true}],
analizaPitalice:"Drugo ime nije rezerva. Ako ga student tretira kao snimak, pogrešiće i const i kasniji prikaz istog objekta."}],
"3:Delta": [
{pitalica:"Zašto uvećanje za deltu ne gleda prekidač?",opcije:[
{key:"A",text:"Zato što ovaj korak još odvaja račun od režima ventilatora.",why:"Funkcija radi jednu stvar: doda deltu. Uticaj prekidača nije u njenom telu.",ok:true},
{key:"B",text:"Zato što ventilator fizički ne može da utiče na broj.",why:"Kasnije može da postoji veza. Ovde je nema u kodu, ne u fizici.",ok:false}],
analizaPitalice:"Funkcija nastaje uska da bi se videlo šta nije uračunato. Iz „uvek doda deltu” ne sledi da prekidač nikad neće imati efekat."}],
"3:Konzola": [
{pitalica:"Zašto ispis u konzoli ne pomeri broj na stranici?",opcije:[
{key:"A",text:"Zato što konzola prati DOM i sama crta displej.",why:"Konzola je drugi izlaz. Nema vezu ka elementu.",ok:false},
{key:"B",text:"Zato što vrednost i prikaz još nisu spojeni.",why:"Log postoji da se stanje vidi bez crtanja. Ekranski broj ostaje dok ga niko ne upiše.",ok:true}],
analizaPitalice:"Ako student čeka da stranica prati konzolu, traži crtanje koje ovaj korak namerno nema."}],
"3:Prototipski lanac": [
{pitalica:"Zašto se ispiše off, a ne on sa prototipa?",opcije:[
{key:"A",text:"Zato što sopstveno svojstvo zasenjuje nasleđeno.",why:"Object.create daje lanac. Traženje staje na prvom svojstvu tog imena.",ok:true},
{key:"B",text:"Zato što prototip uopšte nema svojstvo on.",why:"Ima. Ne vidi se jer bliže svojstvo već odgovara.",ok:false}],
analizaPitalice:"Lanac postoji da se zajedničko ne kopira na svaki objekat. Ko očekuje on, ne vidi gde se traženje zaustavilo."},
{pitalica:"Šta brisanje sopstvenog off ne bi smelo da se tumači kao?",opcije:[
{key:"A",text:"Kao nestanak svakog stanja, uključujući prototip.",why:"Brisanjem sopstvenog svojstva lanac ostaje. Nasleđeno on bi postalo vidljivo.",ok:true},
{key:"B",text:"Kao skidanje senke sa nasleđenog svojstva.",why:"To jeste posledica. Nije nestanak prototipa.",ok:false}],
analizaPitalice:"Senka nije brisanje lanca. Sledeći čas koji doda metodu na prototip oslanja se na istu potragu."}],
"3:filter": [
{pitalica:"Zašto filter ne vrati prosek?",opcije:[
{key:"A",text:"Zato što bira tačke i pravi nov niz, a sažimanje u jedan broj nije njegov posao.",why:"Jedna operacija ostaje jedna. Prosek traži drugi korak.",ok:true},
{key:"B",text:"Zato što filter menja polazni niz u mestu i zato ne sme da računa.",why:"filter ne skraćuje polazni niz u mestu. Vraća novi.",ok:false}],
analizaPitalice:"filter postoji da izbor ne bude pomešan sa zbirom. Ko od njega traži prosek, ne vidi šta je niz posle izbora."}],
"3:map": [
{pitalica:"Zašto map ne ostavi iste tačke?",opcije:[
{key:"A",text:"Zato što map samo sakrije niske, a objekti ostanu.",why:"To bi bio filter po obliku. map pravi novu vrednost po elementu.",ok:false},
{key:"B",text:"Zato što od svake tačke pravi broj, visinu.",why:"map postoji za pretvaranje, ne za biranje.",ok:true}],
analizaPitalice:"Ako map i filter urade istu stvar u glavi studenta, reduce nema odakle da krene. Visine su niz brojeva, ne niz tačaka."}],
"3:Metode, this i klase": [
{pitalica:"Zašto drugi poziv padne, a prvi ispiše 3?",opcije:[
{key:"A",text:"Zato što this zavisi od oblika poziva, a odvojena metoda nema prijemni objekat.",why:"obj.metod() veže this. metod pozvan sam ne vidi obj.",ok:true},
{key:"B",text:"Zato što klasa briše this posle prvog poziva.",why:"Klasa ne troši this. Menja se način poziva.",ok:false}],
analizaPitalice:"this nije skriveno polje koje klasa čuva zauvek. Nastaje iz poziva. TypeError je dokaz da drugi oblik nema objekat."},
{pitalica:"Šta bind ovde popravlja, a šta ne?",opcije:[
{key:"A",text:"Zamrzne objekat da polja više ne mogu da se menjaju.",why:"bind bira prijemni objekat. Ne uvodi const ni freeze.",ok:false},
{key:"B",text:"Sačuva izabrani this, a izmenu polja i dalje ostavlja mogućom.",why:"bind postoji da odvojena funkcija i dalje zna na kome radi.",ok:true}],
analizaPitalice:"Bez bind-a bi se čitalo da klasa „ne radi”. Sa bind-om se vidi da je problem bio poziv, ne podatak."}],
"3:reduce": [
{pitalica:"Zašto prosek u konzoli još ne crta displej?",opcije:[
{key:"A",text:"Zato što reduce vrati jednu vrednost, a crtanje nije deo sažimanja.",why:"Niz visina ostaje podatak. Displej traži kasniji upis u DOM.",ok:true},
{key:"B",text:"Zato što reduce vrati niz, kao map, pa nema šta da se nacrta.",why:"reduce ovde vrati broj. Odsustvo crteža nije zato što je rezultat niz.",ok:false}],
analizaPitalice:"Sažimanje postoji da se od niza dođe do jednog broja. Iz ispisa ne sledi da je stranica već osvežena."}],
"3:Tip": [
{pitalica:"Zašto 24 === \"24\" nije tačno, iako oba izgledaju kao 24?",opcije:[
{key:"A",text:"Zato što strogo poređenje ne pretvara tekst u broj.",why:"=== postoji da se tip ne izgubi. Broj i tekst temperature nisu isti podatak.",ok:true},
{key:"B",text:"Zato što JavaScript ne ume da poredi ništa osim objekata.",why:"Može. Primer upravo poredi i vraća netačno.",ok:false}],
analizaPitalice:"Rezervna provera tipa nastaje jer kasniji unos može da stigne kao tekst. Iz jednakog izgleda ne sledi jednak tip."}],
};
