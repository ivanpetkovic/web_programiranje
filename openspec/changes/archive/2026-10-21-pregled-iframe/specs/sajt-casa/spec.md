# Spec Delta

## ADDED Requirements

### Requirement: Iframe učitava klijentsko stablo
The preview MUST be one iframe beside the shell machine room. Its document MUST be the editor text of `client/index.html` when that file is in the open step's client tree. Every other client file in that tree MUST supply the resource the document loads, using the Moj kod or Lekcija text the editor would show for that file. The shell MUST NOT paint a switch room inside the iframe. An absolute font or asset URL that the editor does not hold as text MUST stay a request to the running Node process.

#### Scenario: Stylesheet comes from the tree
- **WHEN** `client/index.html` links `css/soba.css` and that file is in the tree
- **THEN** the iframe uses the editor text of that stylesheet and not the file on disk

#### Scenario: Script runs in the iframe
- **WHEN** the document loads a client script that is in the tree
- **THEN** that script runs inside the iframe from the editor text

### Requirement: Dodat element se vidi
An element the teacher adds to the client document MUST appear in the iframe. The preview MUST NOT limit the visible document to a heading, a digit, and one button.

#### Scenario: Extra paragraph is visible
- **WHEN** the teacher adds a paragraph the course snapshot did not contain
- **THEN** the iframe shows that paragraph

### Requirement: Putanja van stabla nije disk
A client URL in the loaded document that is not a file in the editor tree MUST NOT be filled from disk.

#### Scenario: Missing stylesheet is not the finished file
- **WHEN** `client/index.html` links `css/soba.css` and that file is not yet in the tree
- **THEN** the iframe does not receive the finished stylesheet from disk

### Requirement: Server prati Moj kod i Lekciju
The preview MUST send every server file in the open step's tree to `POST /api/fajl` as the whole text the Moj kod / Lekcija switch selects. The Node process MUST write that text and reload `soba.js`, `ventilator.js`, and `sesija.js` from disk. The browser MUST NOT run that file.

#### Scenario: Lekcija writes the snapshot
- **WHEN** the teacher selects Lekcija and the tree contains `server/soba.js`
- **THEN** the next room read uses the step snapshot of `server/soba.js` written to disk

#### Scenario: Moj kod writes the working copy
- **WHEN** the teacher selects Moj kod and `server/soba.js` has a working copy
- **THEN** the next room read uses that working copy written to disk

#### Scenario: Moj kod without a working copy
- **WHEN** Moj kod is selected and `server/ventilator.js` has no working copy
- **THEN** the file written to disk is that step's snapshot

#### Scenario: Switch while a client file is open
- **WHEN** the open file is `client/index.html` and the teacher changes Moj kod / Lekcija
- **THEN** every server file in the tree is written from that same switch

## MODIFIED Requirements

### Requirement: Editor i pregled
The Editor tab MUST show the file editor on the left and the preview on the right. Those two sides MUST start at equal width. The code surface MUST fill the width from the file tree to the divider. The preview MUST be an iframe of the client tree in the editor. The Gradivo section and the discussion MUST NOT be on screen. The step selector MUST stay on screen.

#### Scenario: Preview sits on the right
- **WHEN** the teacher opens Editor before moving the bar
- **THEN** the editor takes the left half, the preview takes the right half, the step selector is on screen, and the Gradivo section and the discussion are not

#### Scenario: Code fills its column
- **WHEN** the teacher opens a file in the editor
- **THEN** the code surface reaches from the file tree to the divider

#### Scenario: Preview follows the editor
- **WHEN** the text of a client file in the tree changes
- **THEN** the iframe renders the client document from that tree

#### Scenario: Empty document leaves the preview empty
- **WHEN** the editor shows an empty `client/index.html`
- **THEN** the iframe is blank and shows no shell heading, number, or button

### Requirement: Pregled ostaje trenutan
Opening Editor MUST show the iframe of the client tree then in the editor, including a working copy stored in this browser.

#### Scenario: Return shows the current room
- **WHEN** the teacher leaves Editor and opens Editor again
- **THEN** the iframe shows the client tree then in the editor

### Requirement: Čuvanje i greška fronta
The text shown in the editor for a Klijent file MUST update the iframe without writing that file to disk and without reloading the lecture page. The shell MUST NOT execute that file in the lecture page and MUST NOT keep a previous simulated number. A server error MUST use a different sentence from a front error.

#### Scenario: Bad front file
- **WHEN** the text shown for a Klijent file throws
- **THEN** the shell does not put back a previous number and does not say that the fragment was not applied

#### Scenario: Style changes the blades
- **WHEN** the loaded document already draws a fan and the shown stylesheet changes the blade duration, direction, or angle
- **THEN** the iframe shows that change without a lecture-page reload

### Requirement: Panel prati čas
Before the server lecture, the shell MUST NOT send a room read or a command. From that lecture, the shell machine room MUST follow the live box, and a shell read control MAY send one room read. The iframe MAY send a request only when the loaded document does. The shell MUST NOT add a next-step control.

#### Scenario: Early lecture has no room request
- **WHEN** the teacher is on a lecture before the server
- **THEN** the network record has no room-read or command request from the shell

### Requirement: Tastatura i smanjeno pokretanje
Focus MUST be visible. A concept and a quiz option MUST work from the keyboard. Reduced motion MUST leave the shell fan in a position that still shows the mode, without endless rotation. The shell MUST NOT add a form that reloads the lecture page.

#### Scenario: Reduced motion
- **WHEN** the browser asks for reduced motion and the remote mode is on
- **THEN** the shell fan shows the on position and does not rotate endlessly

### Requirement: Server se ne izvršava u browseru
The site MUST NOT execute a server file in the browser. The running Node process MUST be the source that speaks HTTP/1.1 without a web framework, using the server files the preview has written for the active switch.

#### Scenario: Back tab does not run the handler
- **WHEN** the teacher opens a file under `server/` in the editor
- **THEN** the browser does not run that file as the room handler

### Requirement: Šta važi posle čuvanja
The running process MUST keep reading `server/soba.js`, `server/ventilator.js`, and `server/sesija.js` from disk, and `server/server.js`, `server/stanje.js`, and `server/baza.js` when the process starts. While Editor is open, the preview MUST replace each server file in the open step's tree with the text of the active Moj kod / Lekcija switch. If the process is not up, the panel MUST say so beside the editor and the network record MUST have no successful status for that request.

#### Scenario: Saved room module
- **WHEN** the teacher changes `server/soba.js` in the editor and the browser sends the next room read
- **THEN** that read uses the file written from the active switch

#### Scenario: Startup file
- **WHEN** the teacher changes `server/server.js` in the editor without restarting the process
- **THEN** the running process does not use that editor text

### Requirement: Rad van toka
The finished client files on disk MUST stay openable outside the lecture flow. From the server lecture onward the Node process MUST run the server files the preview last wrote. The editor MUST show the step original or the local working copy according to the switch. Editing a client file MUST NOT change that client file on disk.

#### Scenario: Front runs alone
- **WHEN** the teacher opens `client/index.html` from disk outside the lecture site before the server lecture
- **THEN** the page loads without a Node process

#### Scenario: Typing stays in the browser
- **WHEN** the teacher edits a client file in the editor
- **THEN** that client file on disk is unchanged

### Requirement: Prekidač verzije
A button beside the file path, different from reset, MUST switch between the working copy and the built-in original of the open step, and MUST NOT delete the working copy. The button MUST show a pencil while the working copy is on screen and a page while the built-in original is on screen. Its accessible name MUST say radna verzija or ugrađena verzija, for the view the click will show. The same switch MUST select the text written for every server file in the open step's tree.

#### Scenario: Toggle shows the original
- **WHEN** the teacher activates the version control while the working copy is on screen
- **THEN** the editor shows the original of the open step, the working copy remains stored, and each server file in the tree on disk is that step's snapshot

#### Scenario: Toggle returns to the typed code
- **WHEN** the teacher activates the version control while the original is on screen
- **THEN** the editor shows the same stored working copy, and each server file that has a working copy is written from that copy

### Requirement: Panel od Node nedelje
The shell machine room MUST show beside the iframe from Od naivnog prenosa do HTTP-a, pa Node onward. That room is not a file from the editor. The waiting label and the cable control MUST show from Čekanje i neuspeh onward. History and the database flag MUST show from Trajno stanje i Docker onward. Periodic reading, freshness, and age MUST show from Koliko je prikaz svež onward. Roles MUST show from Ko sme da upravlja onward.

#### Scenario: Node week shows the machine room
- **WHEN** the teacher opens Od naivnog prenosa do HTTP-a, pa Node
- **THEN** the machine room and the read control are visible and roles are hidden

#### Scenario: Later weeks open their controls
- **WHEN** the teacher opens Ko sme da upravlja
- **THEN** roles, history, and periodic reading are visible

## REMOVED Requirements

### Requirement: Rani klijentski skript
**Reason**: The shell no longer executes client scripts or keeps a simulated drawing.
**Migration**: Scripts in the client tree run inside the preview iframe.

### Requirement: Panel nedelje istorije
**Reason**: Week 1 has no client document for the shell to paint.
**Migration**: With no `client/index.html` in the tree, the iframe is blank and the shell sends no room request.

### Requirement: Panel nedelje stranice
**Reason**: The shell no longer paints 24, a log, or a chart.
**Migration**: The iframe shows 24, a log, or a chart only when the loaded document contains them.

### Requirement: Panel bez ikonica školjke
**Reason**: The preview no longer has shell controls.
**Migration**: Controls that remain are the ones in the loaded document.
