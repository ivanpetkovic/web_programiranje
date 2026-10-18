# sajt-casa Specification

## Purpose

Sajt časa je statičan tok u kome nastavnik vodi nedelju pored panela, otvara fajlove iz `client/` i `server/`, i vidi kako sačuvana izmena menja panel ili sledeći zahtev.

## Requirements

### Requirement: Statičan sajt časa
The lecture site MUST be a static page with no build step. It MUST list the ten lectures and open one at a time. The open lecture MUST show its title, the current step, and the embedded panel for that point in the course. The site language MUST stay Serbian.

#### Scenario: One lecture is open
- **WHEN** the teacher opens a lecture
- **THEN** that lecture's title and steps are visible and the other lectures stay closed

### Requirement: Korak na sajtu
Each step MUST show, in order, a small example that is not yet the application, a short quiz with unmarked answers, an explanation, and the fragment that is added to a named file. The next step MUST treat that fragment as already typed. The site MUST show the file path of the fragment.

#### Scenario: Step adds a fragment
- **WHEN** the teacher finishes a step that adds a fragment
- **THEN** the named file contains that fragment and the following step shows it as already present

#### Scenario: Short quiz stays closed
- **WHEN** the short quiz is first shown
- **THEN** no answer is marked correct until the teacher reveals the explanation

### Requirement: Dva stabla
The editor MUST offer a Front tab for `client/` and a Back tab for `server/`. Each tab MUST show that side's file tree, the open file's path, Save, Restore, and a place for an error. Prepared copies MUST stay out of the tree. The front files MUST include `client/index.html`, `client/css/soba.css`, `client/js/korak.js`, `client/js/niz.js`, `client/js/displej.js`, and `client/js/prekidac.js`.

#### Scenario: Tabs stay on their own files
- **WHEN** the teacher switches between Front and Back
- **THEN** each tab shows only the files of that side

#### Scenario: HTML is a file
- **WHEN** the teacher opens the document step
- **THEN** the editor can open `client/index.html` as the file being retyped

#### Scenario: Front tree lists the course files
- **WHEN** the teacher opens the Front tab
- **THEN** the tree includes `client/index.html`, `client/css/soba.css`, `client/js/korak.js`, `client/js/niz.js`, `client/js/displej.js`, and `client/js/prekidac.js`

### Requirement: Čuvanje i greška fronta
Saving MUST write the open file. A front change to style, state, or drawing MUST update the embedded panel without reloading the page. If the front file throws, the panel MUST keep the last valid drawing and the editor MUST say that the fragment was not applied. A server error MUST use a different sentence from a front error.

#### Scenario: Bad front file
- **WHEN** the teacher saves a front file that throws
- **THEN** the previous number remains on the panel and the editor shows that the fragment was not applied

#### Scenario: Style changes the blades
- **WHEN** the fan already exists and the teacher changes the blade duration, direction, or angle
- **THEN** the machine room shows that change without a page reload

### Requirement: Server se ne izvršava u browseru
The site MUST NOT execute a server file in the browser. The `server/` tree MUST be the source of a local Node process that speaks HTTP/1.1 without a web framework.

#### Scenario: Back tab does not run the handler
- **WHEN** the teacher opens a file under `server/` in the editor
- **THEN** the browser does not run that file as the room handler

### Requirement: Šta važi posle čuvanja
After Save, the next request MUST load `server/soba.js`, `server/ventilator.js`, or `server/sesija.js`. `server/server.js`, `server/stanje.js`, and `server/baza.js` MUST be read when the process starts. If the process is not up, the panel MUST say so beside the editor and the network record MUST have no successful status for that request.

#### Scenario: Saved room module
- **WHEN** the teacher saves `server/soba.js` and the browser sends the next room read
- **THEN** that read uses the saved source

#### Scenario: Startup file
- **WHEN** the teacher saves `server/server.js` without restarting the process
- **THEN** the running process does not yet use that source

### Requirement: Panel prati čas
Before the server lecture, the panel MUST NOT send a room read or a command. The network panel MAY still show the document and the stylesheet. The next-step control MUST exist only while the temperature simulation lives in the browser, MUST increase the temperature by a delta, and MUST ignore the switch. From the server lecture on, that control MUST NOT be the source of the reading.

#### Scenario: Early lecture has no room request
- **WHEN** the teacher is on a lecture before the server
- **THEN** the network record has no room-read or command request

### Requirement: Rad van toka
The files the editor opens MUST be runnable outside the lecture flow: the front by itself, and from the server lecture onward the front together with the Node process. The same files MUST be what the teacher retypes in VS Code.

#### Scenario: Front runs alone
- **WHEN** the teacher opens `client/index.html` outside the lecture site before the server lecture
- **THEN** the switch room is visible without a Node process

### Requirement: Tastatura i smanjeno pokretanje
Focus MUST be visible. A concept and a quiz option MUST work from the keyboard. Reduced motion MUST leave the blades in a position that still shows the mode, without endless rotation. A form on the panel MUST NOT reload the document.

#### Scenario: Reduced motion
- **WHEN** the browser asks for reduced motion and the remote mode is on
- **THEN** the blades show the on position and do not rotate endlessly

### Requirement: Osvrt
The review block MUST be a folded list of the survey topics for that lecture. Opening it MUST NOT open the editor and MUST NOT send a request.

#### Scenario: Review stays folded
- **WHEN** the teacher opens the review list
- **THEN** the editor stays as it was and no room request is sent

### Requirement: Pojam se otvara i sklapa
A concept MUST open its explanation and code example on the first click and MUST collapse that item on the next click.

#### Scenario: Second click collapses
- **WHEN** the teacher clicks an open concept again
- **THEN** its explanation and example are hidden

### Requirement: Više pojmova ostaje otvoreno
Several concepts MUST be able to stay open at the same time.

#### Scenario: Two concepts stay open
- **WHEN** the teacher opens one concept and then opens another
- **THEN** both explanations stay visible

### Requirement: Pretraga pojmova
Search MUST narrow the visible concepts and MUST open the first remaining hit.

#### Scenario: Search opens the first hit
- **WHEN** the teacher searches for a concept name
- **THEN** the list shows only matching concepts and the first hit is open

### Requirement: Ponovi pitanje
A repeat-question action MUST clear the mark and the reasons and MUST return that quiz to unmarked answers.

#### Scenario: Marks disappear
- **WHEN** the teacher repeats a quiz whose explanation is open
- **THEN** no answer is marked and the reasons are hidden

### Requirement: Preduslov i ishod
Before its question, the open lecture MUST show its prerequisite and its outcome.

#### Scenario: Outcome is visible first
- **WHEN** the teacher opens a lecture
- **THEN** the prerequisite and the outcome are visible before the quiz

### Requirement: Sintaksna greška ne zamenjuje izvor
A syntax error in a server file MUST remain in the editor and MUST NOT replace the saved source. The next request MUST still use the previous source.

#### Scenario: Bad server file is kept out
- **WHEN** the teacher saves a server file that has a syntax error
- **THEN** the editor shows the error and a following request still uses the previous source
