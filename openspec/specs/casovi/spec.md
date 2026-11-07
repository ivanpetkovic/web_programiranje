# casovi Specification

## Purpose

Jedanaest tema vodi nastavnika od praznog `client/index.html` do iste kontrolne sobe, tako da svaki korak doda jedan delić koji se prekuca u VS Code.

## Requirements

### Requirement: Tema ima naslov i korake
The course MUST be one document that sets its duration as a number of weeks and lists that many weeks, in order, each with a title. The shell MUST use that duration and MUST NOT hardcode a week count. The shipped document MUST set the duration to eleven, use the titles below, and give each week 10 to 22 steps. A step that names a file MUST be one fragment, not the whole week. The minute budget MUST stay a teaching label and MUST NOT be a timer.

#### Scenario: Titles are visible
- **WHEN** the teacher opens the shipped course
- **THEN** the weeks appear in order as: Zašto Web postoji: zahtevi i protokoli; Browser: HTML, CSS i prikaz; JavaScript: vrednosti, objekti i prototipovi; DOM, događaji i prikaz stanja; Od mrežnog prenosa do HTTP-a i Node.js-a; Asinhronost, event loop i neuspeh; API komande, validacija i idempotentnost; PostgreSQL, transakcije i Docker; Svežina podataka, periodično čitanje i push; Bezbednost, sesije i prava pristupa; Ceo sistem, dijagnostika i LLM

#### Scenario: A lecture is a sequence of steps
- **WHEN** the teacher opens any week of the shipped course
- **THEN** that week shows between 10 and 15 steps, week 1 shows 10, the week titled Browser: HTML, CSS i prikaz shows 15, and no step of week 1 names a file

#### Scenario: Figure steps name no file
- **WHEN** the teacher opens Hipertekst, TCP i UDP, or Dokument
- **THEN** that step names no file

#### Scenario: Duration follows the document
- **WHEN** a course document sets a duration other than eleven and lists that many weeks
- **THEN** the course reports that duration and those weeks, with no shell change
### Requirement: Redosled unutar koraka
A step that names a file MUST show, on Gradivo, its prose, then the key-idea callout without a Ključna ideja title, then the code snippet. The short quiz MUST appear on Diskusija, with unmarked answers until the explanation is opened. The snippet MUST be the fragment added to the named file. A figure step MUST show, on Gradivo, its prose, then the key-idea callout, then the figure, and MUST NOT show a snippet. A step that names no file and has no figure MUST show, on Gradivo, its prose and the key-idea callout, and MUST NOT show a snippet or a file path. The example MUST remain checkable on its own, in the manner of `setTimeout` inside a `for` loop.

#### Scenario: Explanation comes after the guess
- **WHEN** Gradivo is open on a step that names a file
- **THEN** the prose, the key idea, and the snippet are visible, and the short quiz is not

#### Scenario: Figure comes after the key idea
- **WHEN** Gradivo is open on a figure step
- **THEN** the prose, the key idea, and the figure are visible, and no snippet or short quiz is shown

#### Scenario: Key idea is visible on Gradivo
- **WHEN** Gradivo is open on a step that names a file
- **THEN** the key idea and the snippet are visible, the callout has no Ključna ideja title, and the snippet is the fragment added to the named file

#### Scenario: Story step has no snippet
- **WHEN** the teacher opens Gradivo on a week 1 step that has no figure
- **THEN** the prose and the key idea are visible, and no snippet, file path, or short quiz is shown
### Requirement: Arhitektura na početku
The first step of week 1 MUST be titled Počeci and MUST name no file. The first step of week 2 MUST be titled Stranica. The step prose MUST name `client/` as what the browser loads and `server/` as what Node runs, from week 5. Until week 5 the Server tab MUST be absent. The course MUST NOT start by writing the whole application in one file.

#### Scenario: Empty server folder
- **WHEN** the teacher is still before the server lecture
- **THEN** the Server tab is absent and the browser is loading only `client/`

#### Scenario: First step is Počeci
- **WHEN** the teacher opens the first step of week 1
- **THEN** the step is titled Počeci and names no file

#### Scenario: Server tab arrives with Node
- **WHEN** the teacher opens week 5
- **THEN** the Server tab is present
### Requirement: Čas 2 prikazuje dokument
The week titled Browser: HTML, CSS i prikaz MUST show the loaded client document and nothing the shell adds. The temperature MUST be the static content of `client/index.html`, the number 24, once that document contains it. The shell MUST NOT draw the switch room, the machine room, or the fan. Starting Node MUST NOT be part of this lecture. Refreshing the preview MUST restore the editor document. A change made only in the browser tools MUST be described as a change to the local display.

#### Scenario: Refresh restores 24
- **WHEN** the loaded document contains 24 and the teacher changes the visible 24 to 10 in the browser tools and refreshes the preview
- **THEN** the iframe shows 24 again

#### Scenario: Empty step shows no shell room
- **WHEN** the open step's `client/index.html` is empty
- **THEN** the preview is blank and does not show a heading, a number, or a button

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
The week titled Od mrežnog prenosa do HTTP-a i Node.js-a MUST introduce a naive whole-message transfer, then its failure, then TCP as a reliable byte stream, then HTTP as method, path, headers, body, and status. Those names MUST come before any Node process is started.

#### Scenario: Names come first
- **WHEN** the teacher is still on the transfer steps
- **THEN** `node server/server.js` has not been introduced yet
### Requirement: Čas 5 razlikuje stateless HTTP od stateful veze
After HTTP is named and before any Node process, the lecture MUST say what stateless means: a request stands alone and HTTP does not remember the previous request. It MUST then say why TCP and QUIC are stateful: they remember the connection so a byte that did not arrive can be sent again. HTTP on that connection MUST still not remember the previous request. Those two steps MUST be standalone examples and MUST NOT add lines to `server/server.js`.

#### Scenario: Stateless comes before Node
- **WHEN** the teacher opens Bez sećanja
- **THEN** `node server/server.js` has not been introduced yet, and the marked answer says the second request does not know the first

#### Scenario: The connection remembers bytes
- **WHEN** the teacher opens Veza ispod
- **THEN** the step names TCP and QUIC, and the marked answer says the connection remembers what arrived so it can be sent again, while HTTP does not remember the previous request

### Requirement: Čas 5 pali Node pre fetch-a
After the HTTP steps, the lecture MUST start a plain Node server with a handler, `http.createServer`, `listen`, the command `node server/server.js`, the same address in the browser, and then the route. The createServer step MUST bind the name `http` with `require("http")` before `http.createServer`. The room read MUST be opened by that address before any fetch call. The transfer steps before HTTP MUST be standalone examples and MUST NOT add lines to `server/server.js`.

Each server step MUST carry the whole file it leaves behind, so the assembled `server/server.js` runs with `node` after every step. Before the route, every path MUST get the same answer. The lecture MUST then add, one step at a time and each with its own short question: a JSON body, `writeHead` with status and `content-type`, one helper that writes a JSON response, the route on the path from `req.url` with 404 for an unknown path, 405 for a known path with a method other than GET, and the module `server/soba.js` whose `citaj` returns `{ status, body }` and which `server.js` requires.

#### Scenario: Server starts before fetch
- **WHEN** the teacher follows the server steps
- **THEN** `node server/server.js` is shown and the room read is opened by address before any fetch call

#### Scenario: Assembled week 5 server answers
- **WHEN** the files assembled at the end of week 5 run with `node server/server.js`
- **THEN** `GET /api/soba` returns 200 with the temperature and the mode as JSON, an unknown path returns 404, and `PUT /api/soba` returns 405

#### Scenario: No route yet
- **WHEN** the files assembled at the address step run
- **THEN** an unknown path gets the same body as `/api/soba`
### Requirement: Čas 5 crta kutiju tek posle servera
The shell MUST draw the machine room and its fan beside the iframe only after that server is running. That room is not a file from the editor. From this lecture the server MUST own the temperature, and the room module on disk MUST be the text of the active Moj kod / Lekcija switch. The week 5 fragment MUST NOT contain the Err branch, so a failed read leaves the document's own display unchanged by an Err branch.

#### Scenario: Known path and unknown path
- **WHEN** the saved room module is running
- **THEN** the known path returns the temperature and the mode, and an unknown path returns 404

#### Scenario: No Err branch yet
- **WHEN** a read fails during week 5 and the loaded document has no Err branch
- **THEN** the iframe does not show Err from the shell
### Requirement: Čas 6 razlikuje odgovor od izostanka
The week titled Asinhronost, event loop i neuspeh MUST contrast HTTP 200 with HTTP 500. The prepared 500 MUST be the unplugged fan: a response arrives, the status is 500, and the switch display shows Err. That step MUST add the unplugged check to `citaj` in `server/soba.js`. HTTP 200 MUST write the digits. The lecture MUST open a front fragment that already writes Err both for a non-success status and for an absent response, and the teacher MUST be able to change that line. Once await exists, the box interval MUST start. Until then the box temperature MUST stay still.

#### Scenario: 500 is a response
- **WHEN** the fan is unplugged and the browser reads the room
- **THEN** the network record has status 500 and the switch display shows Err

#### Scenario: Stopped process has no status
- **WHEN** the teacher stops the process and reads again
- **THEN** the network record has no HTTP status and the 500 case remains a different failure
### Requirement: Čas 7 šalje željeno stanje
The week titled API komande, validacija i idempotentnost MUST send a command that sets the fan to a desired boolean state. The server MUST validate the body, change the mode in memory, and return only the mode. A body that is text instead of a boolean MUST get HTTP 400 and MUST NOT return a mode. Setting the same desired state twice MUST keep that state. Toggling twice MUST undo it. A command MUST NOT change the temperature display.

The lecture MUST first ask what the week 5 server answers to `PUT /api/ventilator` (404, no endpoint). It MUST then add the module `server/ventilator.js` whose `komanda(kontekst, telo)` returns `{ status, body }`, reading the body chunk by chunk in `server.js`, the route `PUT /api/ventilator` with 405 for another method, 400 when `JSON.parse` fails, the shape check with 400, 500 when the fan is unplugged, and a body size limit answered with 400. Set and toggle repetition MUST stay standalone examples. Every step that changes `server.js` or `ventilator.js` MUST carry the whole file, and the files assembled at the end of week 7 MUST run with `node server/server.js`.

#### Scenario: Assembled week 7 server takes a command
- **WHEN** the files assembled at the end of week 7 run and receive `PUT /api/ventilator` with `{ "ukljucen": true }`
- **THEN** the response is 200 with `{ "ukljucen": true }`, the next `GET /api/soba` shows the mode on, a body that is not JSON or is too large gets 400, and `GET /api/ventilator` gets 405

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
### Requirement: Čas 9 ponavlja čitanje
The shell MAY offer the periodic-reading control on this lecture. A control that turns periodic reading on MUST send one read immediately and then repeat it. A failed round MUST show Err by the same branch as the single read when that branch exists. The machine-room feed MUST stay unnamed. The shell machine room MUST follow that feed. The lecture MUST NOT build SSE or WebSocket and MUST NOT name them on the page.

#### Scenario: Periodic read starts at once
- **WHEN** the loaded document turns periodic reading on
- **THEN** one read is sent immediately and a failed round shows Err only by that document's branch

#### Scenario: Push is not named
- **WHEN** the teacher opens the week titled Svežina podataka, periodično čitanje i push
- **THEN** the page does not name SSE or WebSocket
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
### Requirement: Preduslov teme
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
The week Ceo sistem, dijagnostika i LLM MUST keep the note about a type and an assistant suggestion as a sentence in that lecture. It MUST NOT open a second vote for that note. The page MUST NOT place that sentence in a review block.

#### Scenario: No second vote
- **WHEN** the main discussion of Ceo sistem, dijagnostika i LLM has used the time
- **THEN** the type and assistant note stays a sentence in the lecture and no reserve quiz opens
### Requirement: Izlaz časa 11
The Ceo sistem, dijagnostika i LLM exit MUST ask where the right is checked, where the state lives, and what a missing response does not prove.

#### Scenario: Exit asks three things
- **WHEN** the teacher reaches the Ceo sistem, dijagnostika i LLM exit
- **THEN** the prompt asks for the right, the state, and what silence does not prove
### Requirement: Nema bloka osvrta
No lecture MUST show a review block or a control labeled Osvrt.

#### Scenario: The word is absent
- **WHEN** the teacher opens any step of any lecture
- **THEN** the page has no control labeled Osvrt and no survey-name list
### Requirement: Čas ne gradi izostavljene alate
The lectures MUST NOT quiz microtask order, MUST NOT teach database administration, and MUST NOT include a login form or a built attack.

#### Scenario: No microtask quiz
- **WHEN** the teacher opens the week titled Asinhronost, event loop i neuspeh
- **THEN** the page has no quiz of microtask execution order

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
- **THEN** the open step shows that budget as a label, the shell does not substitute a fixed duration, and the page has no progress card
### Requirement: Red koraka je dokument
Week 1 of the shipped course MUST be titled Zašto Web postoji: zahtevi i protokoli and MUST list, in order: Počeci, Paket, Kako podaci stižu do odredišta?, TCP i UDP, HTTP: Od pouzdanog prenosa do Weba, Hipertekst: od stranice do stranice, putem linkova, HTTP kao dogovor, HTML, Od URL-a do prikaza, and Dokument. No step of week 1 MUST name a file. The 1969 LO story MUST be the step Počeci, not a step titled LO. Week 2 MUST be titled Browser: HTML, CSS i prikaz and MUST list, in order: Stranica, Glava, Naslov, Širina kutije, Broj, Dugme, Veza, Specifičnost selektora, Selektor, Okvir, Osvežavanje, Raspored pri uskom ekranu, Alati, Dva zahteva, and Semantika. The shell MUST NOT restore the earlier titles Zašto je Web nastao and Šta browser prikazuje, the twenty-step history list that began with LO, or the page-week steps Podela, Telo, Unutra, Spolja, Promenljiva, and Calc.

#### Scenario: Week 1 is the protocol story
- **WHEN** the teacher opens week 1 of the shipped course
- **THEN** those ten steps are present in that order, none names a file, and there is no step titled LO

#### Scenario: Week 2 is the page
- **WHEN** the teacher opens week 2 of the shipped course
- **THEN** those fifteen steps are present in that order and Podela is not among them

### Requirement: Prva tema ne piše stranicu
Week 1 MUST NOT start Node, MUST NOT paint 24 as the document, and MUST NOT send a room request.

#### Scenario: No room request
- **WHEN** week 1 is open
- **THEN** the network record has no room API request and the digits are not 24
