# casovi Specification

## Purpose

Deset nedelja vodi nastavnika od praznog `client/index.html` do iste kontrolne sobe, tako da svaki korak doda jedan delić koji se prekuca u VS Code.

## Requirements

### Requirement: Nedelja ima naslov i korake
The course MUST be one document that sets its duration as a number of weeks and lists that many weeks, in order, each with a title. The shell MUST use that duration and MUST NOT hardcode a week count. The shipped document MUST set the duration to ten, use the titles below, and give each week 10 to 20 steps. A step there MUST be one fragment, not the whole week. The minute budget MUST stay a teaching label and MUST NOT be a timer.

#### Scenario: Titles are visible
- **WHEN** the teacher opens the shipped course
- **THEN** the weeks appear in order as: Šta browser prikazuje; JavaScript opisuje stanje; Događaji povezuju korisnika; Od naivnog prenosa do HTTP-a, pa Node; Čekanje i neuspeh; Komande i ponavljanje; Trajno stanje i Docker; Koliko je prikaz svež; Ko sme da upravlja; Ceo sistem

#### Scenario: A lecture is a sequence of steps
- **WHEN** the teacher opens any week of the shipped course
- **THEN** that week shows between 10 and 20 steps and each step names the file it changes

#### Scenario: Duration follows the document
- **WHEN** a course document sets a duration other than ten and lists that many weeks
- **THEN** the course reports that duration and those weeks, with no shell change

### Requirement: Redosled unutar koraka
A step MUST show its prose, then the key-idea callout, then the code snippet, then a short quiz with unmarked answers. The snippet MUST be the fragment added to the named file. The example MUST remain checkable on its own, in the manner of `setTimeout` inside a `for` loop.

#### Scenario: Explanation comes after the guess
- **WHEN** a step is opened
- **THEN** the prose, the key idea, and the snippet are visible, and the quiz answers are still unmarked

#### Scenario: Key idea is visible before the quiz
- **WHEN** a step is opened
- **THEN** the key idea and the snippet are above the quiz, and the snippet is the fragment added to the named file

### Requirement: Arhitektura na početku
The first step of week 1 MUST be titled Podela and its original MUST be the two lines `client/` and `server/`. `client/` MUST be what the browser loads. `server/` MUST be what Node runs, from week 4. Until week 4 the Server tab MUST be absent. The course MUST NOT start by writing the whole application in one file.

#### Scenario: Empty server folder
- **WHEN** the teacher is still before the server lecture
- **THEN** the Server tab is absent and the browser is loading only `client/`

#### Scenario: Podela names the folders
- **WHEN** the teacher opens the first step of week 1
- **THEN** the step is titled Podela and its original is `client/` and `server/`

#### Scenario: Server tab arrives with Node
- **WHEN** the teacher opens week 4
- **THEN** the Server tab is present

### Requirement: Čas 1 prikazuje dokument
Lecture 1 MUST leave only the switch room on screen. The temperature MUST be the static content of `client/index.html`, the number 24. The machine room and the fan MUST NOT be drawn. Starting Node MUST NOT be part of this lecture. Refreshing the page MUST restore the document. A change made only in the browser tools MUST be described as a change to the local display.

#### Scenario: Refresh restores 24
- **WHEN** the teacher changes the visible 24 °C to 10 °C in the browser tools and refreshes
- **THEN** the document shows 24 °C again

#### Scenario: No room request
- **WHEN** lecture 1 is open
- **THEN** the network record shows the document and the style, and no room API request

### Requirement: Čas 2 drži stanje u objektu
Lecture 2 MUST read a small synchronous program. An object MUST hold the temperature and the desired switch state. The next-step function MUST always increase the temperature by a delta and MUST ignore the fan mode. Values MUST be followed in the console. The DOM MUST NOT be updated yet. An array of points MUST pass through filter, map, and reduce.

#### Scenario: Switch does not change the delta
- **WHEN** the teacher calls the next step while the switch state is on
- **THEN** the console temperature still rises by the delta and the on-screen number stays unchanged

#### Scenario: Const does not freeze the object
- **WHEN** the object is held by const and a second variable points at it
- **THEN** changing a field through one name is visible through the other, and assigning a new object to the const name fails

### Requirement: Čas 3 razdvaja stanje i crtanje
Lecture 3 MUST show the path click, handler, state, display. Changing the temperature in the object MUST NOT change the screen until a separate draw writes the number.

#### Scenario: State changes without a draw
- **WHEN** the temperature in the object changes and the draw is not called
- **THEN** the screen keeps the previous number

### Requirement: Čas 3 crta prekidač i liniju
The same points MUST be drawn as a line. The switch MUST change the desired state in the object, and a separate draw MUST move its label. Display and switch MUST be ES6 classes. The machine room MUST still be absent. A form on the panel MUST NOT reload the document.

#### Scenario: Switch label waits for its draw
- **WHEN** the desired state changes and the switch draw is not called
- **THEN** the label stays as it was

### Requirement: Čas 3 closure nema tajmer
A synchronous closure MAY remember a threshold. A timer MUST NOT be part of that closure example.

#### Scenario: Closure example has no timer
- **WHEN** the teacher opens the closure step
- **THEN** the example returns a function that still sees the threshold and does not schedule a timer

### Requirement: Čas 4 imenuje prenos pa HTTP
Lecture 4 MUST introduce a naive whole-message transfer, then its failure, then TCP as a reliable byte stream, then HTTP as method, path, headers, body, and status. Those names MUST come before any Node process is started.

#### Scenario: Names come first
- **WHEN** the teacher is still on the transfer steps
- **THEN** `node server/server.js` has not been introduced yet

### Requirement: Čas 4 pali Node pre fetch-a
After the HTTP steps, the lecture MUST start a plain Node server with `http.createServer`, `listen`, the command `node server/server.js`, the same address in the browser, and then the route. The room read MUST be opened by that address before any fetch call.

#### Scenario: Server starts before fetch
- **WHEN** the teacher follows the server steps
- **THEN** `node server/server.js` is shown and the room read is opened by address before any fetch call

### Requirement: Čas 4 crta kutiju tek posle servera
The box, the machine room, and the fan MUST be drawn only after that server is running. From this lecture the server MUST own the temperature. The lecture 4 fragment MUST NOT contain the Err branch, so a failed read leaves dashes.

#### Scenario: Known path and unknown path
- **WHEN** the saved room module is running
- **THEN** the known path returns the temperature and the mode, and an unknown path returns 404

#### Scenario: No Err branch yet
- **WHEN** a read fails during lecture 4
- **THEN** the switch display keeps dashes and does not show Err

### Requirement: Čas 5 razlikuje odgovor od izostanka
Lecture 5 MUST contrast HTTP 200 with HTTP 500. The prepared 500 MUST be the unplugged fan: a response arrives, the status is 500, and the switch display shows Err. HTTP 200 MUST write the digits. The lecture MUST open a front fragment that already writes Err both for a non-success status and for an absent response, and the teacher MUST be able to change that line. Once await exists, the box interval MUST start. Until then the box temperature MUST stay still.

#### Scenario: 500 is a response
- **WHEN** the fan is unplugged and the browser reads the room
- **THEN** the network record has status 500 and the switch display shows Err

#### Scenario: Stopped process has no status
- **WHEN** the teacher stops the process and reads again
- **THEN** the network record has no HTTP status and the 500 case remains a different failure

### Requirement: Čas 6 šalje željeno stanje
Lecture 6 MUST send a command that sets the fan to a desired boolean state. The server MUST validate the body, change the mode in memory, and return only the mode. A body that is text instead of a boolean MUST get HTTP 400 and MUST NOT return a mode. Setting the same desired state twice MUST keep that state. Toggling twice MUST undo it. A command MUST NOT change the temperature display.

#### Scenario: Repeat set-on
- **WHEN** the teacher sends the desired state on twice
- **THEN** the mode stays on after the second response

#### Scenario: Invalid body
- **WHEN** the command body carries text instead of a boolean
- **THEN** the response is HTTP 400 and the mode is unchanged

### Requirement: Čas 7 upisuje jednu celinu
Lecture 7 MUST store the mode and the command history through parameterized queries in PostgreSQL. Those two writes MUST be one unit. Restarting only the Node process after a successful unit MUST keep the mode. A failed second write MUST withdraw the first. The browser MUST NOT receive database credentials. The demonstration MUST distinguish restarting the process, removing the container, and removing the durable storage.

#### Scenario: Restart keeps the mode
- **WHEN** the mode and history have been stored in one successful unit and only Node restarts
- **THEN** the following read returns that mode

### Requirement: Čas 8 nosi trenutak
Lecture 8 MUST treat the still display as a reason for a new read. A reading MUST carry a value and a moment, and the display MUST show its age. An older moment that arrives later MUST NOT replace a newer moment while that check is on.

#### Scenario: Older moment loses
- **WHEN** the freshness check is on and an earlier measurement arrives after a later one
- **THEN** the switch display keeps the newer value

### Requirement: Čas 8 ponavlja čitanje
Turning periodic reading on MUST send one read immediately and then repeat it. A failed round MUST show Err by the same branch as the single read. The machine-room feed MUST stay unnamed and MUST NOT drive the switch display. SSE and WebSocket MUST be named only as ways this lecture does not build.

#### Scenario: Periodic read starts at once
- **WHEN** the teacher turns periodic reading on
- **THEN** one read is sent immediately and a failed round shows Err

### Requirement: Čas 9 proverava ulogu na zahtevu
Lecture 9 MUST prepare an observer key and an operator key in the box. Choosing a role MUST request an HttpOnly cookie with that key. A read MUST NOT require a session. A command without a cookie MUST get 401, an observer command MUST get 403, a bad body MUST get 400, an unplugged fan MUST get 500, and an operator success MUST get 200 with only the mode. Hiding the button MUST leave a command sent outside the screen possible. CORS MUST NOT be treated as authentication.

#### Scenario: Hidden button is not the check
- **WHEN** the observer button is hidden and a command is sent with the observer cookie
- **THEN** the box still returns 403

### Requirement: Čas 10 ne zaključuje iz ćutanja
Lecture 10 MUST walk one request through the browser, Node, the database, and the log. When the screen says on and no response has arrived, the lecture MUST treat the write as neither proved nor disproved. A repeated toggle MUST be shown as able to undo a write that did succeed. TypeScript MUST appear only as an annotation of the known room object and as the statement that a static check is not runtime validation. The live hour MUST NOT perform a full deployment.

#### Scenario: Silence is not a proof
- **WHEN** the screen shows the fan as on and the command response has not arrived
- **THEN** the lecture states that the log and a new read are required before deciding whether to repeat the command

### Requirement: Panel ne dobija drugi uređaj
Every lecture MUST keep one room pair, one temperature reading, and one fan. A later lecture MUST add data to that same panel. The review of a lecture MUST NOT add a second scored quiz.

#### Scenario: After the last lecture
- **WHEN** the teacher finishes lecture 10
- **THEN** the panel still has one switch room, one machine room, one temperature, and one fan

### Requirement: Preduslov nedelje
Each lecture MUST name a prerequisite and an outcome. Lecture 1's prerequisite MUST say that the browser loads `client/` and that `server/` has no files yet. Each later lecture's prerequisite MUST be the outcome the previous lecture already reached.

#### Scenario: Later lecture names the previous outcome
- **WHEN** the teacher opens lecture 2 or any later lecture
- **THEN** its prerequisite is the outcome already reached and its own outcome is shown

#### Scenario: Week 1 names the folders
- **WHEN** the teacher opens week 1
- **THEN** the prerequisite says that the browser loads `client/` and that `server/` has no files yet

### Requirement: Rezerve prvih pet časova
Lecture 1's reserve MUST ask whether the content stays visible when CSS does not arrive. Lecture 2's reserve MUST ask about strict comparison of the temperature number and its text. Lecture 3's reserve MUST separate a listener that receives a function from one that receives an immediate call. Lecture 4's reserve MUST compare status 404 with a stopped process that has no HTTP status. Lecture 5's reserve MUST ask whether another click works while the first read is still waiting.

#### Scenario: Lecture 4 reserve
- **WHEN** the teacher opens the lecture 4 reserve
- **THEN** the question compares a missing path that returns 404 with a stopped process that has no status

### Requirement: Rezerve časova 6 do 9
Lecture 6's reserve MUST send a body the form does not offer, with text instead of a boolean. Lecture 7's reserve MUST refuse giving database credentials to the browser. Lecture 8's reserve MUST compare the freshness of the fan icon with the freshness of the reading. Lecture 9's reserve MUST separate a browser that cannot read a body from a server that stays silent.

#### Scenario: Lecture 6 reserve
- **WHEN** the teacher opens the lecture 6 reserve
- **THEN** the counterexample is a command body whose field is text rather than a boolean

### Requirement: Rezerva časa 10
Lecture 10 MUST keep the note about a type and an assistant suggestion in the review. It MUST NOT open a second vote for that note.

#### Scenario: No second vote
- **WHEN** the main discussion of lecture 10 has used the time
- **THEN** the type and assistant note stays a sentence in the review and no reserve quiz opens

### Requirement: Izlaz časa 10
The lecture 10 exit MUST ask where the right is checked, where the state lives, and what a missing response does not prove.

#### Scenario: Exit asks three things
- **WHEN** the teacher reaches the lecture 10 exit
- **THEN** the prompt asks for the right, the state, and what silence does not prove

### Requirement: Osvrt časova 1 do 3
The lecture 1 review MUST name Internet naspram Weba, put od URL-a do prikaza, semantički HTML, osnovnu pristupačnost i skicu. The lecture 2 review MUST name dinamičke tipove, mesto TypeScript provere, JS okruženja i dve verzije iste funkcije. The lecture 3 review MUST name responsive prikaz, jedinice, animaciju, pristupačnu formu, klase i `this`, i komponentu kao razlog biblioteke. The site MUST NOT build those topics.

#### Scenario: Lecture 1 names the map
- **WHEN** the teacher opens the lecture 1 review
- **THEN** the named topics are visible and none of them is a working tool in the panel

### Requirement: Osvrt časova 4 i 5
The lecture 4 review MUST name IP, UDP, TLS, HTTP/2, HTTP/3, XML, SOAP, RPC, gRPC, GraphQL, Express i middleware. The lecture 5 review MUST name a spoljni API, timeout, prekid jednog zahteva, više zahteva odjednom, call stack i postojanje task i microtask redova. The lecture MUST NOT quiz microtask order. The site MUST NOT build those topics.

#### Scenario: No microtask quiz
- **WHEN** the teacher opens the lecture 5 review
- **THEN** the queues are named and the page has no quiz of their execution order

### Requirement: Osvrt časova 6 do 8
The lecture 6 review MUST name REST, stateless obradu, optimistički prikaz i prihvaćenu komandu naspram potvrde fizičkog uređaja. The lecture 7 review MUST name the relational model against the document model, and a virtual machine against a container, and MUST NOT teach database administration. The lecture 8 review MUST name SSE, WebSocket, History API, SPA, React hooks, storage, PWA i offline. The site MUST NOT build those topics.

#### Scenario: Lecture 8 names push it does not build
- **WHEN** the teacher opens the lecture 8 review
- **THEN** SSE and WebSocket are named and the switch display is still fed by reading

### Requirement: Osvrt časova 9 i 10
The lecture 9 review MUST name prijavu preko treće strane, tokene, XSS, SQL injection, CSRF i HTTPS, and MUST NOT include a login form or a built attack. The lecture 10 review MUST name proxy, CDN, cloud, Kubernetes, serverless, mesto nastanka HTML-a, logove, CI i blockchain kao evidenciju koja ne dokazuje tačnost senzora. The site MUST NOT build those topics.

#### Scenario: Lecture 10 names the map
- **WHEN** the teacher opens the lecture 10 review
- **THEN** those names are visible and the hour still does not perform a full deployment

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

### Requirement: Nedelja 1 sklapa stranicu
Week 1 MUST follow Podela with these steps, in order: Stranica, Glava, Telo, Naslov, Broj, Dugme, Veza, Selektor, Okvir, Unutra, Spolja, Osvežavanje, Alati, Dva zahteva, Soba prekidača, Semantika. Veza MUST add the link to the stylesheet. The original of each of these steps MUST be the whole file after that step. Weeks 2 through 10 MUST keep the code already stored on each step as that step's original.

#### Scenario: Week 1 order
- **WHEN** the teacher opens week 1
- **THEN** the steps are Podela, Stranica, Glava, Telo, Naslov, Broj, Dugme, Veza, Selektor, Okvir, Unutra, Spolja, Osvežavanje, Alati, Dva zahteva, Soba prekidača, and Semantika, in that order

#### Scenario: Later week keeps its code
- **WHEN** the teacher opens a step in week 2 or later
- **THEN** that step's original is the code the course already stored on the step

#### Scenario: Week 1 original is the whole file
- **WHEN** the teacher shows the original of Broj in week 1
- **THEN** the original is the whole HTML file after that step, including the page begun in Stranica

### Requirement: HTML nedelje 1 raste
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

### Requirement: Nedelja 1 pokazuje HTML
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

### Requirement: Stil nedelje 1 je box model
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
