# Spec Delta

## ADDED Requirements

### Requirement: Iframe učitava klijentsko stablo
The preview MUST be one iframe. Its document MUST be the editor text of `client/index.html` when that file is in the open step's client tree. Every other client file in that tree MUST supply the resource the document loads, using the Moj kod or Lekcija text the editor would show for that file. The shell MUST NOT paint a room inside the preview.

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
The shell MUST NOT send a room read or a command for the preview. The iframe MAY send a request only when the loaded document does. The shell MUST NOT add a next-step control.

#### Scenario: Early lecture has no room request
- **WHEN** the teacher is on a lecture before the server
- **THEN** the network record has no room-read or command request from the shell

### Requirement: Tastatura i smanjeno pokretanje
Focus MUST be visible. A concept and a quiz option MUST work from the keyboard. The preview MUST NOT contain shell blades. The shell MUST NOT add a form that reloads the lecture page.

#### Scenario: Reduced motion
- **WHEN** the browser asks for reduced motion and the remote mode is on
- **THEN** the preview does not show shell blades, and blades in the loaded document show the on position without endless rotation

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

### Requirement: Panel od Node nedelje
**Reason**: The shell no longer adds the machine room, read control, cable, history, periodic reading, or roles.
**Migration**: Those controls appear only when the loaded client document contains them.

### Requirement: Panel bez ikonica školjke
**Reason**: The preview no longer has shell controls.
**Migration**: Controls that remain are the ones in the loaded document.
