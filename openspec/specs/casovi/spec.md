# casovi Specification

## Purpose

Deset nedelja vodi nastavnika od praznog `client/index.html` do iste kontrolne sobe, tako da svaki korak doda jedan delić koji se prekuca u VS Code.

## Requirements

### Requirement: Nedelja ima naslov i korake
The course MUST be one document that sets its duration as a number of weeks and lists that many weeks, in order, each with a title. The shell MUST use that duration and MUST NOT hardcode a week count. The shipped document MUST set the duration to eleven, use the titles below, and give each week 10 to 22 steps. A step that names a file MUST be one fragment, not the whole week. The minute budget MUST stay a teaching label and MUST NOT be a timer.

#### Scenario: Titles are visible
- **WHEN** the teacher opens the shipped course
- **THEN** the weeks appear in order as: Zašto je Web nastao; Šta browser prikazuje; JavaScript opisuje stanje; Događaji povezuju korisnika; Od naivnog prenosa do HTTP-a, pa Node; Čekanje i neuspeh; Komande i ponavljanje; Trajno stanje i Docker; Koliko je prikaz svež; Ko sme da upravlja; Ceo sistem

#### Scenario: A lecture is a sequence of steps
- **WHEN** the teacher opens any week of the shipped course
- **THEN** that week shows between 10 and 22 steps, week 1 shows 20, the week titled Šta browser prikazuje shows 19, and no step of week 1 names a file

#### Scenario: Figure steps name no file
- **WHEN** the teacher opens Hipertekst, TCP i UDP, or Dokument
- **THEN** that step names no file

#### Scenario: Duration follows the document
- **WHEN** a course document sets a duration other than eleven and lists that many weeks
- **THEN** the course reports that duration and those weeks, with no shell change
### Requirement: Redosled unutar koraka
A step that names a file MUST show its prose, then the key-idea callout, then the code snippet, then a short quiz with unmarked answers. The snippet MUST be the fragment added to the named file. A figure step MUST show its prose, then the key-idea callout, then the figure, then a short quiz with unmarked answers, and MUST NOT show a snippet. A step that names no file and has no figure MUST show its prose, then the key-idea callout, then the short quiz, and MUST NOT show a snippet or a file path. The example MUST remain checkable on its own, in the manner of `setTimeout` inside a `for` loop.

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
- **WHEN** the teacher opens a week 1 step that has no figure
- **THEN** the prose and the key idea are visible before the quiz, and no snippet or file path is shown
### Requirement: Arhitektura na početku
The first step of week 1 MUST be titled LO and MUST name no file. Podela MUST be the first step of week 2 and the built-in text of `client/index.html` MUST be empty. The step prose MUST name `client/` as what the browser loads and `server/` as what Node runs, from week 5. Until week 5 the Server tab MUST be absent. The course MUST NOT start by writing the whole application in one file.

#### Scenario: Empty server folder
- **WHEN** the teacher is still before the server lecture
- **THEN** the Server tab is absent and the browser is loading only `client/`

#### Scenario: Podela names the folders
- **WHEN** the teacher opens Podela
- **THEN** the prose names the two folders and the built-in `client/index.html` is empty

#### Scenario: First step is Web
- **WHEN** the teacher opens the first step of week 1
- **THEN** the step is titled LO and names no file

#### Scenario: Server tab arrives with Node
- **WHEN** the teacher opens week 5
- **THEN** the Server tab is present
### Requirement: Čas 2 prikazuje dokument
The week titled Šta browser prikazuje MUST show the loaded client document and nothing the shell adds. The temperature MUST be the static content of `client/index.html`, the number 24, once that document contains it. The shell MUST NOT draw the switch room, the machine room, or the fan. Starting Node MUST NOT be part of this lecture. Refreshing the preview MUST restore the editor document. A change made only in the browser tools MUST be described as a change to the local display.

#### Scenario: Refresh restores 24
- **WHEN** the loaded document contains 24 and the teacher changes the visible 24 to 10 in the browser tools and refreshes the preview
- **THEN** the iframe shows 24 again

#### Scenario: Empty step shows no shell room
- **WHEN** the open step's `client/index.html` is empty
- **THEN** the preview is blank and does not show a heading, a number, or a button

#### Scenario: No room request
- **WHEN** the week titled Šta browser prikazuje is open and the loaded document does not request the room
- **THEN** the network record shows no room API request
### Requirement: Čas 3 drži stanje u objektu
The week titled JavaScript opisuje stanje MUST read a small synchronous program. An object MUST hold the temperature and the desired switch state. The next-step function MUST always increase the temperature by a delta and MUST ignore the fan mode. Values MUST be followed in the console. The DOM MUST NOT be updated yet. An array of points MUST pass through filter, map, and reduce.

#### Scenario: Switch does not change the delta
- **WHEN** the teacher calls the next step while the switch state is on
- **THEN** the console temperature still rises by the delta and the on-screen number stays unchanged

#### Scenario: Const does not freeze the object
- **WHEN** the object is held by const and a second variable points at it
- **THEN** changing a field through one name is visible through the other, and assigning a new object to the const name fails
### Requirement: Čas 4 razdvaja stanje i crtanje
The week titled Događaji povezuju korisnika MUST show the path click, handler, state, display. Changing the temperature in the object MUST NOT change the screen until a separate draw writes the number.

#### Scenario: State changes without a draw
- **WHEN** the temperature in the object changes and the draw is not called
- **THEN** the screen keeps the previous number
### Requirement: Čas 4 crta prekidač i liniju
The same points MUST be drawn as a line. The switch MUST change the desired state in the object, and a separate draw MUST move its label. Display and switch MUST be ES6 classes. The machine room MUST still be absent. A form on the panel MUST NOT reload the document.

#### Scenario: Switch label waits for its draw
- **WHEN** the desired state changes and the switch draw is not called
- **THEN** the label stays as it was
### Requirement: Čas 4 closure nema tajmer
A synchronous closure MAY remember a threshold. A timer MUST NOT be part of that closure example.

#### Scenario: Closure example has no timer
- **WHEN** the teacher opens the closure step
- **THEN** the example returns a function that still sees the threshold and does not schedule a timer
### Requirement: Čas 5 imenuje prenos pa HTTP
The week titled Od naivnog prenosa do HTTP-a, pa Node MUST introduce a naive whole-message transfer, then its failure, then TCP as a reliable byte stream, then HTTP as method, path, headers, body, and status. Those names MUST come before any Node process is started.

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
The week titled Čekanje i neuspeh MUST contrast HTTP 200 with HTTP 500. The prepared 500 MUST be the unplugged fan: a response arrives, the status is 500, and the switch display shows Err. HTTP 200 MUST write the digits. The lecture MUST open a front fragment that already writes Err both for a non-success status and for an absent response, and the teacher MUST be able to change that line. Once await exists, the box interval MUST start. Until then the box temperature MUST stay still.

#### Scenario: 500 is a response
- **WHEN** the fan is unplugged and the browser reads the room
- **THEN** the network record has status 500 and the switch display shows Err

#### Scenario: Stopped process has no status
- **WHEN** the teacher stops the process and reads again
- **THEN** the network record has no HTTP status and the 500 case remains a different failure
### Requirement: Čas 7 šalje željeno stanje
The week titled Komande i ponavljanje MUST send a command that sets the fan to a desired boolean state. The server MUST validate the body, change the mode in memory, and return only the mode. A body that is text instead of a boolean MUST get HTTP 400 and MUST NOT return a mode. Setting the same desired state twice MUST keep that state. Toggling twice MUST undo it. A command MUST NOT change the temperature display.

#### Scenario: Repeat set-on
- **WHEN** the teacher sends the desired state on twice
- **THEN** the mode stays on after the second response

#### Scenario: Invalid body
- **WHEN** the command body carries text instead of a boolean
- **THEN** the response is HTTP 400 and the mode is unchanged
### Requirement: Čas 8 upisuje jednu celinu
The week titled Trajno stanje i Docker MUST store the mode and the command history through parameterized queries in PostgreSQL. Those two writes MUST be one unit. Restarting only the Node process after a successful unit MUST keep the mode. A failed second write MUST withdraw the first. The browser MUST NOT receive database credentials. The demonstration MUST distinguish restarting the process, removing the container, and removing the durable storage.

#### Scenario: Restart keeps the mode
- **WHEN** the mode and history have been stored in one successful unit and only Node restarts
- **THEN** the following read returns that mode
### Requirement: Čas 9 nosi trenutak
The week titled Koliko je prikaz svež MUST treat the still display as a reason for a new read. A reading MUST carry a value and a moment, and the display MUST show its age. An older moment that arrives later MUST NOT replace a newer moment while that check is on.

#### Scenario: Older moment loses
- **WHEN** the freshness check is on and an earlier measurement arrives after a later one
- **THEN** the switch display keeps the newer value
### Requirement: Čas 9 ponavlja čitanje
The shell MAY offer the periodic-reading control on this lecture. A control that turns periodic reading on MUST send one read immediately and then repeat it. A failed round MUST show Err by the same branch as the single read when that branch exists. The machine-room feed MUST stay unnamed. The shell machine room MUST follow that feed. The lecture MUST NOT build SSE or WebSocket and MUST NOT name them on the page.

#### Scenario: Periodic read starts at once
- **WHEN** the loaded document turns periodic reading on
- **THEN** one read is sent immediately and a failed round shows Err only by that document's branch

#### Scenario: Push is not named
- **WHEN** the teacher opens the week titled Koliko je prikaz svež
- **THEN** the page does not name SSE or WebSocket
### Requirement: Čas 10 proverava ulogu na zahtevu
The week titled Ko sme da upravlja MUST prepare an observer key and an operator key in the box. Choosing a role MUST request an HttpOnly cookie with that key. A read MUST NOT require a session. A command without a cookie MUST get 401, an observer command MUST get 403, a bad body MUST get 400, an unplugged fan MUST get 500, and an operator success MUST get 200 with only the mode. Hiding the button MUST leave a command sent outside the screen possible. CORS MUST NOT be treated as authentication.

#### Scenario: Hidden button is not the check
- **WHEN** the observer button is hidden and a command is sent with the observer cookie
- **THEN** the box still returns 403
### Requirement: Čas 11 ne zaključuje iz ćutanja
The week titled Ceo sistem MUST walk one request through the browser, Node, the database, and the log. When the screen says on and no response has arrived, the lecture MUST treat the write as neither proved nor disproved. A repeated toggle MUST be shown as able to undo a write that did succeed. TypeScript MUST appear only as an annotation of the known room object and as the statement that a static check is not runtime validation. The live hour MUST NOT perform a full deployment.

#### Scenario: Silence is not a proof
- **WHEN** the screen shows the fan as on and the command response has not arrived
- **THEN** the lecture states that the log and a new read are required before deciding whether to repeat the command
### Requirement: Panel ne dobija drugi uređaj
The preview MUST keep one shell machine room, one temperature on that room, and one fan. The iframe MUST NOT add a second fan. A lecture MUST NOT add a second scored quiz.

#### Scenario: After the last lecture
- **WHEN** the teacher finishes week 11
- **THEN** the preview still has one shell machine room, one temperature, and one fan beside the iframe
### Requirement: Preduslov nedelje
Each lecture MUST name a prerequisite and an outcome. Week 1's prerequisite MUST say that there is no file yet and that the story starts before the page. Week 1's outcome MUST say that the Web is a service on the Internet, that a page is a document, and that `server/` still has no files. Each later lecture's prerequisite MUST be the outcome the previous lecture already reached.

#### Scenario: Later lecture names the previous outcome
- **WHEN** the teacher opens week 2 or any later week
- **THEN** its prerequisite is the outcome already reached and its own outcome is shown

#### Scenario: Week 1 names the folders
- **WHEN** the teacher opens week 1
- **THEN** the prerequisite says that there is no file yet and that the story starts before the page
### Requirement: Rezerve časova 2 do 6
The week Šta browser prikazuje reserve MUST ask whether the content stays visible when CSS does not arrive. The week JavaScript opisuje stanje reserve MUST ask about strict comparison of the temperature number and its text. The week Događaji povezuju korisnika reserve MUST separate a listener that receives a function from one that receives an immediate call. The week Od naivnog prenosa do HTTP-a, pa Node reserve MUST compare status 404 with a stopped process that has no HTTP status. The week Čekanje i neuspeh reserve MUST ask whether another click works while the first read is still waiting.

#### Scenario: Lecture 4 reserve
- **WHEN** the teacher opens the reserve of Od naivnog prenosa do HTTP-a, pa Node
- **THEN** the question compares a missing path that returns 404 with a stopped process that has no status
### Requirement: Rezerve časova 7 do 10
The week Komande i ponavljanje reserve MUST send a body the form does not offer, with text instead of a boolean. The week Trajno stanje i Docker reserve MUST refuse giving database credentials to the browser. The week Koliko je prikaz svež reserve MUST compare the freshness of the fan icon with the freshness of the reading. The week Ko sme da upravlja reserve MUST separate a browser that cannot read a body from a server that stays silent.

#### Scenario: Lecture 6 reserve
- **WHEN** the teacher opens the reserve of Komande i ponavljanje
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
The lectures MUST NOT quiz microtask order, MUST NOT teach database administration, and MUST NOT include a login form or a built attack.

#### Scenario: No microtask quiz
- **WHEN** the teacher opens the week titled Čekanje i neuspeh
- **THEN** the page has no quiz of microtask execution order

#### Scenario: No database administration
- **WHEN** the teacher opens the week titled Trajno stanje i Docker
- **THEN** the lecture does not teach database administration

#### Scenario: No login and no attack
- **WHEN** the teacher opens the week titled Ko sme da upravlja
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
### Requirement: Nedelja stranice sklapa stranicu
The week titled Šta browser prikazuje MUST follow these steps, in order: Podela, Stranica, Glava, Telo, Naslov, Broj, Dugme, Veza, Selektor, Okvir, Unutra, Spolja, Promenljiva, Calc, Osvežavanje, Alati, Dva zahteva, Soba prekidača, Semantika. It MUST NOT include Web, Internet, or Istorija. Veza MUST add the link to the stylesheet. The original of each of these steps MUST be the whole file after that step. Weeks 3 through 11 MUST keep each step's stored fragment as its contribution. The editor MUST show the snapshot of that file through the step.

#### Scenario: Week 1 order
- **WHEN** the teacher opens the week titled Šta browser prikazuje
- **THEN** the steps are Podela, Stranica, Glava, Telo, Naslov, Broj, Dugme, Veza, Selektor, Okvir, Unutra, Spolja, Promenljiva, Calc, Osvežavanje, Alati, Dva zahteva, Soba prekidača, and Semantika, in that order

#### Scenario: Later week keeps its code
- **WHEN** the teacher opens a step in week 3 or later
- **THEN** that step still stores its own fragment, and the editor's built-in version of its file is the snapshot through that step rather than the finished file on disk

#### Scenario: Week 1 original is the whole file
- **WHEN** the teacher shows the original of Broj in the week titled Šta browser prikazuje
- **THEN** the original is the whole HTML file after that step, including the page begun in Stranica
### Requirement: Minuti prve dve nedelje
The minute labels of week 1 MUST sum to that week's minute budget. The minute labels of the week titled Šta browser prikazuje MUST sum to that week's minute budget.

#### Scenario: Sum is the budget
- **WHEN** the shipped course is read
- **THEN** week 1 and the week titled Šta browser prikazuje each have step minute labels that sum to 90
### Requirement: HTML nedelje stranice
From Stranica through Semantika, the original of `client/index.html` MUST be the whole document after that step. Stranica MUST be a nearly empty document and MUST NOT keep the folder sketch. Each later step of that file MUST keep every line of the previous original of that file and MUST add at least one line about that step. The document MUST still contain 24 and MUST NOT add the machine room or a room request.

#### Scenario: Stranica starts nearly empty
- **WHEN** the teacher shows the original of Stranica
- **THEN** the original is a nearly empty HTML document and does not contain the lines `client/` and `server/`

#### Scenario: Later step keeps the document
- **WHEN** the teacher shows the original of Broj
- **THEN** that original contains every line of Naslov and adds the line that places 24

#### Scenario: Osvežavanje adds a line
- **WHEN** the teacher shows the original of Osvežavanje
- **THEN** it contains every line of the previous `client/index.html` original and adds a line about refresh restoring the document

#### Scenario: Semantika adds a line
- **WHEN** the teacher shows the original of Semantika
- **THEN** it contains every line of the previous `client/index.html` original and adds a line about the heading being a heading

#### Scenario: Temperature stays in the file
- **WHEN** the teacher shows the original of Semantika
- **THEN** the document still contains 24 and does not contain the machine room or `/api/soba`
### Requirement: Nedelja stranice pokazuje HTML
Each step from Stranica through Dugme MUST add one HTML element or attribute, and its key idea MUST name that element or attribute. Broj MUST add the class attribute on the paragraph that contains 24. Dugme MUST add a button with a type attribute.

#### Scenario: Heading is the step
- **WHEN** the teacher opens Naslov
- **THEN** the key idea names the heading element and the snippet is the heading added to the document

#### Scenario: Class marks the number
- **WHEN** the teacher opens Broj
- **THEN** the key idea names the class attribute and the document contains 24

#### Scenario: Button is an element
- **WHEN** the teacher opens Dugme
- **THEN** the key idea names the button element and the type attribute
### Requirement: Stil nedelje stranice je box model
Selektor MUST be the first original of `client/css/soba.css` and MUST be one class rule with one declaration. Okvir MUST add `border` and keep that rule. Unutra MUST add `padding` and keep the earlier declarations. Spolja MUST add `margin` and keep the earlier declarations. Each of those steps MUST name that concept in its key idea.

#### Scenario: Selektor starts the stylesheet
- **WHEN** the teacher shows the original of Selektor
- **THEN** the original is one class rule and is not the finished stylesheet from disk

#### Scenario: Border follows the selector
- **WHEN** the teacher shows the original of Okvir
- **THEN** it contains every line of Selektor and adds a border declaration

#### Scenario: Padding stays inside the border
- **WHEN** the teacher shows the original of Unutra
- **THEN** it contains the border declaration and adds a padding declaration

#### Scenario: Margin finishes the box
- **WHEN** the teacher shows the original of Spolja
- **THEN** the rule contains the class selector, border, padding, and margin
### Requirement: Stil nedelje stranice imenuje dužinu
Promenljiva MUST follow Spolja. Its original of `client/css/soba.css` MUST keep the box-model declarations and MUST add a custom property `--broj: 2rem` plus a `font-size` declaration that reads it with `var(--broj)`. Calc MUST follow Promenljiva. Its original MUST keep `--broj: 2rem` and MUST set `font-size` with `calc(var(--broj) * 2)`. Each of those steps MUST name that concept in its key idea. Neither step MUST change 24 in the HTML document.

#### Scenario: A name holds the length
- **WHEN** the teacher shows the original of Promenljiva
- **THEN** it contains `--broj: 2rem`, `font-size: var(--broj)`, padding, and margin

#### Scenario: Calc multiplies the named length
- **WHEN** the teacher shows the original of Calc
- **THEN** it contains `--broj: 2rem` and `font-size: calc(var(--broj) * 2)`, and still contains the padding and margin declarations
### Requirement: Nedelja istorije je prva
Week 1 MUST be titled Zašto je Web nastao and MUST contain exactly the 20 steps named in the scenario, in that order. No step of week 1 MUST name a file or show a snippet. The step minute labels MUST sum to 90.

#### Scenario: Twenty story steps
- **WHEN** the teacher opens week 1
- **THEN** the steps are LO, Paket, TCP i UDP, Internet, Hipertekst, Predlog, HTML, W3C, Rat browsera, XML, Deset dana, ECMA, Bez dodatka, Web 2.0, Ajax, Striming, Ekonomija, Društvo, Web 3.0, and Dokument, in that order

#### Scenario: Minutes sum to the budget
- **WHEN** the shipped week 1 is read
- **THEN** its step minute labels sum to 90
### Requirement: Korak istorije počinje pitanjem
Each week 1 step MUST open its prose with a question about why that thing came to be. The short quiz MUST ask that same motive, and its answers MUST stay unmarked until the teacher reveals them.

#### Scenario: Question is first
- **WHEN** the teacher opens any step of week 1
- **THEN** the prose begins with a question and the quiz answers are still unmarked
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
### Requirement: Internet i hipertekst
Internet MUST tell the 1 January 1983 flag day, that the Internet is a network of networks, and that the Web does not exist yet. It MUST NOT ask for a reconstruction of DNS or TLS. Hipertekst MUST tell Bush's 1945 Memex and Nelson's 1965 word, and that a link is the address of another text.

#### Scenario: Flag day is not the Web
- **WHEN** the teacher reveals the Internet quiz
- **THEN** the marked answer says the 1983 network is not the Web

#### Scenario: Link is an address
- **WHEN** the teacher reveals the Hipertekst quiz
- **THEN** the marked answer says a link is the address of another text
### Requirement: Predlog i HTML
Predlog MUST tell Berners-Lee's March 1989 CERN proposal and the note "vague but exciting", and that the Web is one service on the Internet. HTML MUST tell that the 1991 public page used tags a person can type, and that early tags name structure rather than paint.

#### Scenario: Web is a service
- **WHEN** the teacher reveals the Predlog quiz
- **THEN** the marked answer says the Web is one service on the Internet

#### Scenario: Tags are structure
- **WHEN** the teacher reveals the HTML quiz
- **THEN** the marked answer says early HTML names structure, not paint
### Requirement: W3C i rat browsera
W3C MUST tell that the 1994 body exists so the next tag is not one company's private word. Rat browsera MUST tell Netscape against Internet Explorer, including blink and marquee, and that a page broke when each browser invented tags.

#### Scenario: One company does not own the tag
- **WHEN** the teacher reveals the W3C quiz
- **THEN** the marked answer says no single vendor owns what a tag means

#### Scenario: Invented tags break the page
- **WHEN** the teacher reveals the Rat browsera quiz
- **THEN** the marked answer says a page broke because browsers invented their own tags
### Requirement: XML nije HTML
XML MUST tell that two programs can exchange a tree without agreeing on a screen, and that HTML remains hypertext for a person. The step MUST NOT teach a schema language or namespaces.

#### Scenario: Record is not a screen
- **WHEN** the teacher reveals the XML quiz
- **THEN** the marked answer says XML carries a record, not a page layout
### Requirement: JavaScript i ECMA
Deset dana MUST tell that Brendan Eich wrote the language in ten days in May 1995, that the names were Mocha, then LiveScript, then JavaScript, and that it is not Java. ECMA MUST tell that JavaScript is a trademark and ECMA-262 names the language ECMAScript, and that ES3, ES5, and ES6 are the same word in different years. The step MUST NOT teach the standard's grammar. Bez dodatka MUST tell that applets, Flash, and Silverlight asked for a plugin and the script was already in the page.

#### Scenario: The name is not Java
- **WHEN** the teacher reveals the Deset dana quiz
- **THEN** the marked answer says the language is not Java

#### Scenario: The standard has another name
- **WHEN** the teacher reveals the ECMA quiz
- **THEN** the marked answer says the standard name is ECMAScript

#### Scenario: Already in the page
- **WHEN** the teacher reveals the Bez dodatka quiz
- **THEN** the marked answer says the language won because it was already in the page
### Requirement: Web 2.0 i Ajax
Web 2.0 MUST tell that the reader becomes an author, naming the 1999 coinage, the 2004 popularization, and Wikipedia. Ajax MUST tell that Garrett named the pattern in February 2005 and that Gmail and Maps keep the document while a request updates a piece. The step MUST say a web application is not a presentation site.

#### Scenario: The reader writes
- **WHEN** the teacher reveals the Web 2.0 quiz
- **THEN** the marked answer says the reader can change the page

#### Scenario: The document stays
- **WHEN** the teacher reveals the Ajax quiz
- **THEN** the marked answer says the document stays and a request updates a piece
### Requirement: Striming, ekonomija i društvo
Striming MUST tell YouTube in 2005 and Netflix leaving discs, and MUST tie a dropped frame back to UDP and a transfer that cannot drop a byte back to TCP. Ekonomija MUST tell that a copy no longer costs a printing and that a listing outlives a newspaper ad. Društvo MUST tell the 1993 Eternal September and Britannica ending print in 2012.

#### Scenario: Play starts early
- **WHEN** the teacher reveals the Striming quiz
- **THEN** the marked answer says playback can start before the whole file arrives

#### Scenario: The listing outlives the paper
- **WHEN** the teacher reveals the Ekonomija quiz
- **THEN** the marked answer says the page reaches a buyer the corner shop cannot

#### Scenario: The club becomes a city
- **WHEN** the teacher reveals the Društvo quiz
- **THEN** the marked answer says publication no longer waits for a printing house
### Requirement: Web 3.0 nije novi Internet
Web 3.0 MUST tell that the name was used for the semantic web and later for a blockchain, and MUST tell the October 2008 Bitcoin paper as a ledger more than one party keeps. It MUST say the ledger is not a new Internet and the page still needs a browser. The step MUST NOT include a wallet, a contract, or a pitch.

#### Scenario: The ledger is not the network
- **WHEN** the teacher reveals the Web 3.0 quiz
- **THEN** the marked answer says the ledger is not a new Internet
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
