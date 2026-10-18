# casovi Specification

## Purpose

Deset nedelja vodi nastavnika od praznog `client/index.html` do iste kontrolne sobe, tako da svaki korak doda jedan delić koji se prekuca u VS Code.

## Requirements

### Requirement: Nedelja ima naslov i korake
The course MUST contain exactly ten lectures, in order, each with a title. Each lecture MUST contain 10 to 20 steps. A step MUST be one function or one fragment, not the whole lecture. The lecture duration from the plan MUST remain a teaching budget and MUST NOT be a timer in the site.

#### Scenario: Titles are visible
- **WHEN** the teacher opens the course
- **THEN** the lectures appear in order as: Šta browser prikazuje; JavaScript opisuje stanje; Događaji povezuju korisnika; Od naivnog prenosa do HTTP-a, pa Node; Čekanje i neuspeh; Komande i ponavljanje; Trajno stanje i Docker; Koliko je prikaz svež; Ko sme da upravlja; Ceo sistem

#### Scenario: A lecture is a sequence of steps
- **WHEN** the teacher opens any lecture
- **THEN** that lecture shows between 10 and 20 steps and each step names the file it changes

### Requirement: Redosled unutar koraka
A step MUST show a small example that is not yet the application, then a short quiz with unmarked answers, then the explanation, and only then the fragment added to the main application. The example MUST be checkable on its own, in the manner of `setTimeout` inside a `for` loop.

#### Scenario: Explanation comes after the guess
- **WHEN** a step is opened
- **THEN** the example and the unmarked quiz are visible before the explanation and the application fragment

### Requirement: Arhitektura na početku
One of the first steps MUST show the split between `client/` and `server/`. `client/` MUST be what the browser loads. `server/` MUST be what Node runs. Until the server exists, `server/` MUST remain visible as an empty place. The course MUST NOT start by writing the whole application in one file.

#### Scenario: Empty server folder
- **WHEN** the teacher is still before the server lecture
- **THEN** `server/` is visible as an empty place and the browser is loading only `client/`

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
