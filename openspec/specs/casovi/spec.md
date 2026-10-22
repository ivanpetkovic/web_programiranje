# casovi Specification

## Purpose

Deset nedelja vodi nastavnika od praznog `client/index.html` do iste kontrolne sobe, tako da svaki korak doda jedan delić koji se prekuca u VS Code.

## Requirements

### Requirement: Nedelja ima naslov i korake
The course MUST be one document that sets its duration as a number of weeks and lists that many weeks, in order, each with a title. The shell MUST use that duration and MUST NOT hardcode a week count. The shipped document MUST set the duration to eleven, use the titles below, and give each week 10 to 22 steps. A step that names a file MUST be one fragment, not the whole week. The minute budget MUST stay a teaching label and MUST NOT be a timer.

#### Scenario: Titles are visible
- **WHEN** the teacher opens the shipped course
- **THEN** the weeks appear in order as: Zašto Web postoji: zahtevi i protokoli; Browser: HTML, CSS i prikaz; JavaScript: vrednosti, objekti i prototipovi; DOM, događaji i prikaz stanja; Od mrežnog prenosa do HTTP-a i Node.js-a; Asinhronost, event loop i neuspeh; API komande, validacija i idempotentnost; PostgreSQL, transakcije i Docker; Svežina podataka, periodično čitanje i push; Bezbednost, sesije i prava pristupa; Ceo sistem, dijagnostika i LLM

#### Scenario: A lecture is a sequence of steps
- **WHEN** the teacher opens any week of the shipped course
- **THEN** that week shows between 10 and 22 steps, week 1 shows 12, the week titled Browser: HTML, CSS i prikaz shows 15, and no step of week 1 names a file

#### Scenario: Figure steps name no file
- **WHEN** the teacher opens Hipertekst, TCP i UDP, or Dokument
- **THEN** that step names no file

#### Scenario: Duration follows the document
- **WHEN** a course document sets a duration other than eleven and lists that many weeks
- **THEN** the course reports that duration and those weeks, with no shell change
### Requirement: Redosled unutar koraka
A step that names a file MUST show its prose, then the key-idea callout, then the code snippet, then a short quiz with unmarked answers. The snippet MUST be the fragment added to the named file. A figure step MUST show its prose, then the key-idea callout, then the figure, then a short quiz with unmarked answers, and MUST NOT show a snippet. A step that names no file and has no figure MUST show its prose, then the key-idea callout, then the short quiz, and MUST NOT show a file path. An isolated example on that step MUST show as Mali eksperiment. A diagram on a step that has no figure MUST show as Dijagram. The analysis sentence MUST stay hidden until the explanation is open.

#### Scenario: Explanation comes after the guess
- **WHEN** a step that names a file is opened
- **THEN** the prose, the key idea, and the snippet are visible, and the quiz answers are still unmarked

#### Scenario: Figure comes after the key idea
- **WHEN** a figure step is opened
- **THEN** the prose, the key idea, and the figure are visible before the quiz, and no snippet is shown

#### Scenario: Key idea is visible before the quiz
- **WHEN** a step that names a file is opened
- **THEN** the key idea and the snippet are above the quiz, and the snippet is the fragment added to the named file

#### Scenario: Story step has no snippet
- **WHEN** the teacher opens a week 1 step that has no figure and no isolated example
- **THEN** the prose and the key idea are visible before the quiz, and no snippet or file path is shown
### Requirement: Čas 2 prikazuje dokument
The week titled Browser: HTML, CSS i prikaz MUST show the loaded client document and nothing the shell adds. The temperature MUST be the static content of `client/index.html`, the number 24, once that document contains it. The shell MUST NOT draw the switch room, the machine room, or the fan. Starting Node MUST NOT be part of this lecture. Refreshing the preview MUST restore the editor document. A change made only in the browser tools MUST be described as a change to the local display.

#### Scenario: Refresh restores 24
- **WHEN** the loaded document contains 24 and the teacher changes the visible 24 to 10 in the browser tools and refreshes the preview
- **THEN** the iframe shows 24 again

#### Scenario: Empty step shows no shell room
- **WHEN** the teacher opens Stranica
- **THEN** the preview has no heading, no number, and no button, and the shell does not draw a room

#### Scenario: No room request
- **WHEN** the week titled Browser: HTML, CSS i prikaz is open and the loaded document does not request the room
- **THEN** the network record shows no room API request
### Requirement: Čas 3 drži stanje u objektu
The week titled JavaScript: vrednosti, objekti i prototipovi MUST read a small synchronous program. An object MUST hold the temperature and the desired switch state. The next-step function MUST always increase the temperature by a delta and MUST ignore the fan mode. Values MUST be followed in the console. The DOM MUST NOT be updated yet. An array of points MUST pass through filter, map, and reduce.

#### Scenario: Switch does not change the delta
- **WHEN** the teacher calls the next step while the switch state is on
- **THEN** the console temperature still rises by the delta and the on-screen number stays unchanged

#### Scenario: Const does not freeze the object
- **WHEN** the object is held by const and a second variable points at it
- **THEN** changing a field through one name is visible through the other, and assigning a new object to the const name fails
### Requirement: Čas 4 razdvaja stanje i crtanje
The week titled DOM, događaji i prikaz stanja MUST show the path click, handler, state, display. Changing the temperature in the object MUST NOT change the screen until a separate draw writes the number.

#### Scenario: State changes without a draw
- **WHEN** the temperature in the object changes and the draw is not called
- **THEN** the screen keeps the previous number
### Requirement: Čas 4 closure nema tajmer
A synchronous closure MAY remember a threshold. A timer MUST NOT be part of that closure example.

#### Scenario: Closure example has no timer
- **WHEN** the teacher opens the closure step
- **THEN** the example returns a function that still sees the threshold and does not schedule a timer
### Requirement: Čas 5 imenuje prenos pa HTTP
The week titled Od mrežnog prenosa do HTTP-a i Node.js-a MUST introduce a naive whole-message transfer, then its failure, then TCP as a reliable byte stream, then HTTP as method, path, headers, body, and status. Those names MUST come before any Node process is started.

#### Scenario: Names come first
- **WHEN** the teacher is still on the transfer steps
- **THEN** `node server/server.js` has not been introduced yet
### Requirement: Čas 5 pali Node pre fetch-a
After the HTTP steps, the lecture MUST start a plain Node server with `http.createServer`, `listen`, the command `node server/server.js`, the same address in the browser, and then the route. The room read MUST be opened by that address before any fetch call.

#### Scenario: Server starts before fetch
- **WHEN** the teacher follows the server steps
- **THEN** `node server/server.js` is shown and the room read is opened by address before any fetch call
### Requirement: Čas 5 crta kutiju tek posle servera
The shell MUST draw the machine room and its fan beside the iframe only after that server is running. That room is not a file from the editor. From this lecture the server MUST own the temperature, and the room module on disk MUST be the text of the active Moj kod / Lekcija switch. The week 5 fragment MUST NOT contain the Err branch, so a failed read leaves the document's own display unchanged by an Err branch.

#### Scenario: Known path and unknown path
- **WHEN** the saved room module is running
- **THEN** the known path returns the temperature and the mode, and an unknown path returns 404

#### Scenario: No Err branch yet
- **WHEN** a read fails during week 5 and the loaded document has no Err branch
- **THEN** the iframe does not show Err from the shell
### Requirement: Čas 6 razlikuje odgovor od izostanka
The week titled Asinhronost, event loop i neuspeh MUST contrast HTTP 200 with HTTP 500. The prepared 500 MUST be the unplugged fan: a response arrives, the status is 500, and the switch display shows Err. HTTP 200 MUST write the digits. The lecture MUST open a front fragment that already writes Err both for a non-success status and for an absent response, and the teacher MUST be able to change that line. Once await exists, the box interval MUST start. Until then the box temperature MUST stay still.

#### Scenario: 500 is a response
- **WHEN** the fan is unplugged and the browser reads the room
- **THEN** the network record has status 500 and the switch display shows Err

#### Scenario: Stopped process has no status
- **WHEN** the teacher stops the process and reads again
- **THEN** the network record has no HTTP status and the 500 case remains a different failure
### Requirement: Čas 7 šalje željeno stanje
The week titled API komande, validacija i idempotentnost MUST send a command that sets the fan to a desired boolean state. The server MUST validate the body, change the mode in memory, and return only the mode. A body that is text instead of a boolean MUST get HTTP 400 and MUST NOT return a mode. Setting the same desired state twice MUST keep that state. Toggling twice MUST undo it. A command MUST NOT change the temperature display.

#### Scenario: Repeat set-on
- **WHEN** the teacher sends the desired state on twice
- **THEN** the mode stays on after the second response

#### Scenario: Invalid body
- **WHEN** the command body carries text instead of a boolean
- **THEN** the response is HTTP 400 and the mode is unchanged
### Requirement: Čas 8 upisuje jednu celinu
The week titled PostgreSQL, transakcije i Docker MUST store the mode and the command history through parameterized queries in PostgreSQL. Those two writes MUST be one unit. Restarting only the Node process after a successful unit MUST keep the mode. A failed second write MUST withdraw the first. The browser MUST NOT receive database credentials. The demonstration MUST distinguish restarting the process, removing the container, and removing the durable storage.

#### Scenario: Restart keeps the mode
- **WHEN** the mode and history have been stored in one successful unit and only Node restarts
- **THEN** the following read returns that mode
### Requirement: Čas 9 nosi trenutak
The week titled Svežina podataka, periodično čitanje i push MUST treat the still display as a reason for a new read. A reading MUST carry a value and a moment, and the display MUST show its age. An older moment that arrives later MUST NOT replace a newer moment while that check is on.

#### Scenario: Older moment loses
- **WHEN** the freshness check is on and an earlier measurement arrives after a later one
- **THEN** the switch display keeps the newer value
### Requirement: Čas 10 proverava ulogu na zahtevu
The week titled Bezbednost, sesije i prava pristupa MUST prepare an observer key and an operator key in the box. Choosing a role MUST request an HttpOnly cookie with that key. A read MUST NOT require a session. A command without a cookie MUST get 401, an observer command MUST get 403, a bad body MUST get 400, an unplugged fan MUST get 500, and an operator success MUST get 200 with only the mode. Hiding the button MUST leave a command sent outside the screen possible. CORS MUST NOT be treated as authentication.

#### Scenario: Hidden button is not the check
- **WHEN** the observer button is hidden and a command is sent with the observer cookie
- **THEN** the box still returns 403
### Requirement: Čas 11 ne zaključuje iz ćutanja
The week titled Ceo sistem, dijagnostika i LLM MUST walk one request through the browser, Node, the database, and the log. When the screen says on and no response has arrived, the lecture MUST treat the write as neither proved nor disproved. A repeated toggle MUST be shown as able to undo a write that did succeed. TypeScript MUST appear only as an annotation of the known room object and as the statement that a static check is not runtime validation. The live hour MUST NOT perform a full deployment.

#### Scenario: Silence is not a proof
- **WHEN** the screen shows the fan as on and the command response has not arrived
- **THEN** the lecture states that the log and a new read are required before deciding whether to repeat the command
### Requirement: Panel ne dobija drugi uređaj
The preview MUST keep one shell machine room, one temperature on that room, and one fan. The iframe MUST NOT add a second fan. A lecture MUST NOT add a second scored quiz.

#### Scenario: After the last lecture
- **WHEN** the teacher finishes week 11
- **THEN** the preview still has one shell machine room, one temperature, and one fan beside the iframe
### Requirement: Preduslov nedelje
Each lecture MUST name a prerequisite and an outcome in the course document. Week 1's prerequisite MUST say that there is no file yet and that the story starts before the page. Week 1's outcome MUST say that the Web is a service on the Internet, that a page is a document, and that `server/` still has no files. Each later lecture's prerequisite MUST be the outcome the previous lecture already reached. The lecture page MUST NOT display that prerequisite or that outcome.

#### Scenario: Later lecture names the previous outcome
- **WHEN** the teacher opens week 2 or any later week
- **THEN** the course document's prerequisite for that week is the outcome already reached, and the page shows the week title without a prerequisite line or an outcome line

#### Scenario: Week 1 names the folders
- **WHEN** the teacher opens week 1
- **THEN** the course document's prerequisite says that there is no file yet and that the story starts before the page, and the page does not show that sentence
### Requirement: Rezerve časova 2 do 6
The week Browser: HTML, CSS i prikaz reserve MUST ask whether the content stays visible when CSS does not arrive. The week JavaScript: vrednosti, objekti i prototipovi reserve MUST ask about strict comparison of the temperature number and its text. The week DOM, događaji i prikaz stanja reserve MUST separate a listener that receives a function from one that receives an immediate call. The week Od mrežnog prenosa do HTTP-a i Node.js-a reserve MUST compare status 404 with a stopped process that has no HTTP status. The week Asinhronost, event loop i neuspeh reserve MUST ask whether another click works while the first read is still waiting.

#### Scenario: Lecture 4 reserve
- **WHEN** the teacher opens the reserve of Od mrežnog prenosa do HTTP-a i Node.js-a
- **THEN** the question compares a missing path that returns 404 with a stopped process that has no status
### Requirement: Rezerve časova 7 do 10
The week API komande, validacija i idempotentnost reserve MUST send a body the form does not offer, with text instead of a boolean. The week PostgreSQL, transakcije i Docker reserve MUST refuse giving database credentials to the browser. The week Svežina podataka, periodično čitanje i push reserve MUST compare the freshness of the fan icon with the freshness of the reading. The week Bezbednost, sesije i prava pristupa reserve MUST separate a browser that cannot read a body from a server that stays silent.

#### Scenario: Lecture 6 reserve
- **WHEN** the teacher opens the reserve of API komande, validacija i idempotentnost
- **THEN** the counterexample is a command body whose field is text rather than a boolean
### Requirement: Rezerva časa 11
The week Ceo sistem MUST keep the note about a type and an assistant suggestion as a sentence in that lecture. It MUST NOT open a second vote for that note. The page MUST NOT place that sentence in a review block.

#### Scenario: No second vote
- **WHEN** the main discussion of Ceo sistem has used the time
- **THEN** the type and assistant note stays a sentence in the lecture and no reserve quiz opens
### Requirement: Izlaz časa 11
The Ceo sistem exit MUST ask where the right is checked, where the state lives, and what a missing response does not prove.

#### Scenario: Exit asks three things
- **WHEN** the teacher reaches the Ceo sistem exit
- **THEN** the prompt asks for the right, the state, and what silence does not prove
### Requirement: Nema bloka osvrta
No lecture MUST show a review block or a control labeled Osvrt.

#### Scenario: The word is absent
- **WHEN** the teacher opens any step of any lecture
- **THEN** the page has no control labeled Osvrt and no survey-name list
### Requirement: Čas ne gradi izostavljene alate
The lectures MUST NOT teach database administration, and MUST NOT include a login form or a built attack. The week titled Asinhronost, event loop i neuspeh MAY include one isolated quiz of print order across the call stack, the microtask queue, and the task queue.

#### Scenario: No microtask quiz
- **WHEN** the teacher opens the week titled Asinhronost, event loop i neuspeh
- **THEN** the page has one isolated print-order quiz that names the call stack, the microtask queue, and the task queue, and it does not teach database administration

#### Scenario: No database administration
- **WHEN** the teacher opens the week titled PostgreSQL, transakcije i Docker
- **THEN** the lecture does not teach database administration

#### Scenario: No login and no attack
- **WHEN** the teacher opens the week titled Bezbednost, sesije i prava pristupa
- **THEN** the page has no login form and no built attack
### Requirement: Trajanje se slaže sa spiskom
The duration MUST equal the number of weeks in the document. When they differ, the site MUST show an error and MUST NOT invent a week or drop a week.

#### Scenario: Count does not match
- **WHEN** the document sets a duration that is not the number of weeks it lists
- **THEN** the site shows an error and does not present a shortened or padded week list
### Requirement: Telo kursa je dokument
The institution, course title, initials, week titles, subtitles, step prose, key ideas, snippets, levels, minute budgets, and quizzes MUST come from the course document. The shell MUST NOT contain that copy. Changing a week or the duration MUST be a change to the document alone.

#### Scenario: Shell has no lecture copy
- **WHEN** a week title in the document changes and the shell is unchanged
- **THEN** the week list shows the new title

#### Scenario: Minutes come from the document
- **WHEN** a week sets a minute budget
- **THEN** the progress card shows that budget and the shell does not substitute a fixed duration
### Requirement: Nedelja stranice pokazuje HTML
Stranica, Glava, Naslov, Broj, and Dugme MUST each add one HTML element or attribute, and the key idea MUST name that element or attribute. Širina kutije sits between Naslov and Broj and MUST NOT add an HTML element. Broj MUST add the class attribute on the paragraph that contains 24. Dugme MUST add a button with a type attribute.

#### Scenario: Heading is the step
- **WHEN** the teacher opens Naslov
- **THEN** the key idea names the heading element and the snippet is the heading added to the document

#### Scenario: Class marks the number
- **WHEN** the teacher opens Broj
- **THEN** the key idea names the class attribute and the document contains 24

#### Scenario: Button is an element
- **WHEN** the teacher opens Dugme
- **THEN** the key idea names the button element and the type attribute
### Requirement: LO i paket
LO MUST tell that on 29 October 1969 the UCLA-to-SRI message was the letters LO and then a crash, and that this packet network is not the Web. Paket MUST tell why a message is cut into packets instead of reserving one wire from end to end.

#### Scenario: LO is not the Web
- **WHEN** the teacher reveals the LO quiz
- **THEN** the marked answer says the 1969 message is not the Web

#### Scenario: A broken wire is not the end
- **WHEN** the teacher reveals the Paket quiz
- **THEN** the marked answer says a broken wire does not have to kill the message
### Requirement: TCP nije UDP
TCP i UDP MUST contrast a reliable byte stream with a datagram that may be dropped. The prose MUST ask whether a late video frame waits for the byte. The step MUST say a document needs every byte and a voice or picture may drop one.

#### Scenario: Frame may drop
- **WHEN** the teacher reveals the TCP i UDP quiz
- **THEN** the marked answer says a late frame may be dropped and a document may not lose a byte
### Requirement: Predlog i HTML
Predlog MUST tell Berners-Lee's March 1989 CERN proposal and the note "vague but exciting", and that the Web is one service on the Internet. HTML MUST tell that the 1991 public page used tags a person can type, and that early tags name structure rather than paint.

#### Scenario: Web is a service
- **WHEN** the teacher reveals the Predlog quiz
- **THEN** the marked answer says the Web is one service on the Internet

#### Scenario: Tags are structure
- **WHEN** the teacher reveals the HTML quiz
- **THEN** the marked answer says early HTML names structure, not paint
### Requirement: Dokument zatvara istoriju
Dokument MUST ask which of this week the next page still lacks. Its timeline MUST mark 1969 as the packet, 1989 as the proposal, 1995 as the language, 2005 as Ajax, 2008 as the ledger, and the next week as the document. The step MUST say `server/` is still empty.

#### Scenario: Next week is the document
- **WHEN** the teacher opens Dokument
- **THEN** those marks are visible in that chronological order and the quiz answers are still unmarked
### Requirement: Crteži samo gde je redosled
Hipertekst, TCP i UDP, and Dokument MUST be the only week 1 steps with a figure. Hipertekst MUST show a path that names a link and another text. TCP i UDP MUST show a path that names TCP and UDP. Dokument MUST show the timeline in its own requirement.

#### Scenario: Other steps have no figure
- **WHEN** the teacher opens LO, Paket, or Ajax
- **THEN** no figure is shown
### Requirement: Istorija ne piše stranicu
Week 1 MUST NOT start Node, MUST NOT paint 24 as the document, and MUST NOT send a room request.

#### Scenario: No room request
- **WHEN** week 1 is open
- **THEN** the network record has no room API request and the digits are not 24
### Requirement: Početak časa
The first step of week 1 MUST be titled LO and MUST name no file. The first step that names a file MUST be Stranica in week 2. Its built-in `client/index.html` MUST be the doctype and the `html` element with `lang="sr"`, and MUST NOT be empty and MUST NOT be the two lines `client/` and `server/`. Until week 5 the Server tab MUST be absent. The course MUST NOT start by writing the whole application in one file.

#### Scenario: First step is LO
- **WHEN** the teacher opens the first step of week 1
- **THEN** the step is titled LO and names no file

#### Scenario: Stranica opens the document
- **WHEN** the teacher opens Stranica
- **THEN** the built-in `client/index.html` contains the doctype and does not contain a heading, the number 24, or a script

#### Scenario: Server tab arrives with Node
- **WHEN** the teacher opens week 5
- **THEN** the Server tab is present
### Requirement: Nedelja zahteva je prva
Week 1 MUST be titled Zašto Web postoji: zahtevi i protokoli and MUST contain exactly the twelve steps named in the scenario, in that order. No step of week 1 MUST name a file. The step minute labels MUST sum to 55. The week minute budget MUST stay 90.

#### Scenario: Twelve story steps
- **WHEN** the teacher opens week 1
- **THEN** the steps are LO, Paket, Paket ili rezervisana veza, TCP i UDP, Hipertekst, Predlog, HTTP kao dogovor, HTML, Rat browsera, Od URL-a do prikaza, Ajax, and Dokument, in that order
### Requirement: Korak nedelje zahteva
A week 1 story step MAY open its prose with a question. An isolated example MAY open with a situation and MUST NOT name a file. The short quiz MUST stay unmarked until the teacher reveals it.

#### Scenario: LO opens with a question
- **WHEN** the teacher opens LO
- **THEN** the prose begins with a question and the quiz answers are still unmarked

#### Scenario: Isolated step has no file
- **WHEN** the teacher opens HTTP kao dogovor
- **THEN** the step names no file and shows a small experiment
### Requirement: Hipertekst je veza
Hipertekst MUST tell Bush's 1945 Memex and Nelson's 1965 word, and that a link is the address of another text. Week 1 MUST NOT contain a step titled Internet.

#### Scenario: Link is an address
- **WHEN** the teacher reveals the Hipertekst quiz
- **THEN** the marked answer says a link is the address of another text
### Requirement: Rat browsera kvari stranicu
Rat browsera MUST tell Netscape against Internet Explorer, including blink and marquee, and that a page broke when each browser invented tags. Week 1 MUST NOT contain a step titled W3C.

#### Scenario: Invented tags break the page
- **WHEN** the teacher reveals the Rat browsera quiz
- **THEN** the marked answer says a page broke because browsers invented their own tags
### Requirement: Ajax ostavlja dokument
Ajax MUST tell that Garrett named the pattern in February 2005 and that Gmail and Maps keep the document while a request updates a piece. The marked answer MUST say the document stays.

#### Scenario: The document stays
- **WHEN** the teacher reveals the Ajax quiz
- **THEN** the marked answer says the document stays and a request updates a piece
### Requirement: Nedelja stranice sklapa dokument
The week titled Browser: HTML, CSS i prikaz MUST contain exactly the steps named in the scenario, in that order.

#### Scenario: Page week order
- **WHEN** the teacher opens the week titled Browser: HTML, CSS i prikaz
- **THEN** the steps are Stranica, Glava, Naslov, Širina kutije, Broj, Dugme, Veza, Specifičnost selektora, Selektor, Okvir, Osvežavanje, Raspored pri uskom ekranu, Alati, Dva zahteva, and Semantika, in that order

#### Scenario: Old page steps are absent
- **WHEN** the teacher opens that week
- **THEN** it does not include Podela, Telo, Unutra, Spolja, Promenljiva, Calc, or Soba prekidača

#### Scenario: Link step adds the stylesheet
- **WHEN** the teacher opens Veza
- **THEN** the fragment adds the link to the stylesheet
### Requirement: Kasnija nedelja čuva delić
Weeks 3 through 11 MUST keep each step's stored fragment as its contribution. The editor MUST show the snapshot through that step.

#### Scenario: Later week keeps its fragment
- **WHEN** the teacher opens a step in week 3 or later
- **THEN** that step still stores its own fragment, and the editor's built-in version of its file is the snapshot through that step rather than the finished file on disk
### Requirement: Delić je doprinos fajla
A step that names a file MUST contribute its fragment. The shipped document MUST NOT contain an `original` field. The editor snapshot MUST be the accumulation of those fragments through the open step.

#### Scenario: Closed html gets no script
- **WHEN** the teacher shows the built-in version of `client/index.html` after a fragment that follows the closing `html` tag
- **THEN** that fragment stays after `</html>` and the snapshot contains no script tag added by the shell

#### Scenario: Broj keeps the heading
- **WHEN** the teacher shows the built-in version of `client/index.html` on Broj
- **THEN** the snapshot contains the heading from Naslov and adds the paragraph with class digit and 24

#### Scenario: Semantika has no script
- **WHEN** the teacher shows the built-in version of `client/index.html` on Semantika
- **THEN** the snapshot contains 24, contains no script tag, and does not contain `/api/soba`
### Requirement: Stil nedelje stranice
Selektor MUST be the first contribution to `client/css/soba.css` and MUST be the declaration `letter-spacing: 0.08em;`. Okvir MUST add `border: 1px solid #3a342c;` and MUST keep the letter-spacing declaration. Raspored pri uskom ekranu MUST add a `.panel` grid rule and MUST keep the earlier declarations. The snapshot at Selektor MUST NOT be the finished stylesheet on disk. Širina kutije and Specifičnost selektora MUST NOT write that file.

#### Scenario: Selektor is one declaration
- **WHEN** the teacher shows the built-in version of `client/css/soba.css` on Selektor
- **THEN** the text is `letter-spacing: 0.08em;` and is not the finished stylesheet from disk

#### Scenario: Border follows the selector
- **WHEN** the teacher shows the built-in version of `client/css/soba.css` on Okvir
- **THEN** it contains the letter-spacing declaration and adds a border declaration
### Requirement: Širina kutije je izolovan primer
Širina kutije MUST be an isolated CSS example of content-box sizing and MUST NOT name a file. Its marked answer MUST be 244 px for width 200, padding 20 on each side, and a 2 px border on each side.

#### Scenario: The box is not in the stylesheet
- **WHEN** the teacher opens Širina kutije
- **THEN** the page shows the small experiment, the step names no file, and the client tree does not gain `css/soba.css` from this step
### Requirement: Izolovan primer ne ulazi u stablo
A step marked as an isolated example MUST NOT name a file. The lesson MUST show that example under the heading Mali eksperiment. Running or showing it MUST NOT write an application file and MUST NOT add a path to the editor tree.

#### Scenario: Experiment stays off the tree
- **WHEN** the teacher opens an isolated example
- **THEN** the lesson shows Mali eksperiment and the editor tree does not gain a file from that step
### Requirement: Dijagram koraka
A step that carries a diagram and no figure MUST show that diagram under the heading Dijagram, after the key idea and before the quiz. A figure step MUST still show the figure and MUST NOT also be required to show that diagram block.

#### Scenario: Diagram is visible
- **WHEN** the teacher opens Širina kutije
- **THEN** the diagram of content, padding, and border is visible before the quiz
### Requirement: Analiza čeka obrazloženje
Every shipped step MUST carry an analysis sentence in the course document. The lesson page MUST NOT show that sentence until the teacher opens the explanation for that step. Opening the explanation MUST show the sentence and the mark.

#### Scenario: Analysis stays closed
- **WHEN** the teacher opens Širina kutije and has not opened the explanation
- **THEN** the analysis sentence is not on the page

#### Scenario: Analysis opens with the mark
- **WHEN** the teacher opens the explanation on Širina kutije
- **THEN** the analysis sentence is visible and option C is marked
### Requirement: Nivo koraka
Each step MUST carry a level of Osnovno or Primena. The lesson MUST show that level from the document. Širina kutije MUST be Primena.

#### Scenario: Level is visible
- **WHEN** the teacher opens Širina kutije
- **THEN** the lesson shows Primena
### Requirement: Minuti koraka i budžet nedelje
Each shipped week MUST set its minute budget to 90. The step minute labels of each shipped week MUST sum to 55. The progress card MUST show the week budget. The sum of step labels MUST NOT be required to equal that budget.

#### Scenario: Labels sum below the budget
- **WHEN** the shipped course is read
- **THEN** every week has step minute labels that sum to 55 and a week budget of 90
### Requirement: Čas 4 crta prekidač
The week titled DOM, događaji i prikaz stanja MUST let the switch change the desired state in the object, and a separate draw MUST move its label. Display and switch MUST be ES6 classes. The machine room MUST still be absent. A form on the panel MUST NOT reload the document. The week MUST NOT add a canvas and MUST NOT contain a step titled Linija.

#### Scenario: Switch label waits for its draw
- **WHEN** the desired state changes and the switch draw is not called
- **THEN** the label stays as it was

#### Scenario: No canvas
- **WHEN** the teacher opens Prekidač
- **THEN** the built-in `client/index.html` contains no canvas
### Requirement: Čas 9 ponavlja čitanje i imenuje push
On the week titled Svežina podataka, periodično čitanje i push, turning periodic reading on MUST send one read immediately and then repeat it. A failed round MUST show Err by the same branch as the single read. The switch display MUST still read.

#### Scenario: Periodic read starts at once
- **WHEN** the loaded document turns periodic reading on
- **THEN** one read is sent immediately and a failed round shows Err only by that document's branch

#### Scenario: Push is named and not built
- **WHEN** the teacher opens the week titled Svežina podataka, periodično čitanje i push
- **THEN** the lecture names push, the glossary supplement may name SSE and WebSocket, the lecture does not build them, and the switch display still obtains the number by reading
