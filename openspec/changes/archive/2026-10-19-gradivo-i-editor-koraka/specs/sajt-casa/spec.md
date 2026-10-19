# Spec Delta

## MODIFIED Requirements

### Requirement: Dva stabla
The editor MUST offer a Klijent tab for `client/` and a Server tab for `server/`. The Server tab MUST be absent during weeks 1, 2, and 3, and MUST be present from week 4. Each visible tab MUST show that side's file tree, the open file's path, and a place for an error. Prepared copies MUST stay out of the tree. The Klijent files MUST include `client/index.html`, `client/css/soba.css`, `client/js/korak.js`, `client/js/niz.js`, `client/js/displej.js`, and `client/js/prekidac.js`.

#### Scenario: Tabs stay on their own files
- **WHEN** the teacher switches between Klijent and Server in week 4 or later
- **THEN** each tab shows only the files of that side

#### Scenario: Server tab waits for week 4
- **WHEN** week 1, 2, or 3 is open on Editor
- **THEN** the Server tab is absent and the tree shows only `client/`

#### Scenario: HTML is a file
- **WHEN** the teacher opens the document step
- **THEN** the editor can open `client/index.html` as the file being retyped

#### Scenario: Front tree lists the course files
- **WHEN** the teacher opens the Klijent tab
- **THEN** the tree includes `client/index.html`, `client/css/soba.css`, `client/js/korak.js`, `client/js/niz.js`, `client/js/displej.js`, and `client/js/prekidac.js`

### Requirement: Čuvanje i greška fronta
The text shown in the editor for a Klijent file MUST update the embedded panel without writing that file to disk and without reloading the page. If that text throws, the panel MUST keep the last valid drawing and the editor MUST say that the fragment was not applied. A server error MUST use a different sentence from a front error.

#### Scenario: Bad front file
- **WHEN** the text shown for a Klijent file throws
- **THEN** the previous number remains on the panel and the editor shows that the fragment was not applied

#### Scenario: Style changes the blades
- **WHEN** the fan already exists and the shown stylesheet changes the blade duration, direction, or angle
- **THEN** the machine room shows that change without a page reload

### Requirement: Server se ne izvršava u browseru
The site MUST NOT execute a server file in the browser. The `server/` tree on disk MUST remain the source of a local Node process that speaks HTTP/1.1 without a web framework.

#### Scenario: Back tab does not run the handler
- **WHEN** the teacher opens a file under `server/` in the editor
- **THEN** the browser does not run that file as the room handler

### Requirement: Šta važi posle čuvanja
The running process MUST keep reading `server/soba.js`, `server/ventilator.js`, and `server/sesija.js` from disk, and `server/server.js`, `server/stanje.js`, and `server/baza.js` when the process starts. Text in the editor MUST NOT replace that source. If the process is not up, the panel MUST say so beside the editor and the network record MUST have no successful status for that request.

#### Scenario: Saved room module
- **WHEN** the teacher changes `server/soba.js` in the editor and the browser sends the next room read
- **THEN** that read still uses the file on disk

#### Scenario: Startup file
- **WHEN** the teacher changes `server/server.js` in the editor without restarting the process
- **THEN** the running process does not use that editor text

### Requirement: Rad van toka
The files on disk MUST stay runnable outside the lecture flow: the front by itself, and from the server lecture onward the front together with the Node process. The same files on disk MUST be what the teacher retypes in VS Code. The editor MUST show the step original or the local working copy, and typing there MUST NOT change the files on disk.

#### Scenario: Front runs alone
- **WHEN** the teacher opens `client/index.html` from disk outside the lecture site before the server lecture
- **THEN** the switch room is visible without a Node process

#### Scenario: Typing stays in the browser
- **WHEN** the teacher edits a file in the editor
- **THEN** the file on disk is unchanged

### Requirement: Sintaksna greška ne zamenjuje izvor
A syntax error in a server file in the editor MUST remain in the working copy and MUST NOT replace the file on disk. The next request MUST still use the file on disk.

#### Scenario: Bad server file is kept out
- **WHEN** the teacher introduces a syntax error in a server file in the editor
- **THEN** the editor keeps that text and a following request still uses the file on disk

### Requirement: Tri taba
Below the lecture title the site MUST offer Gradivo, Diskusija, and Editor. Exactly one of those sections MUST be on screen. The title MUST stay visible on every tab. Opening a lecture MUST show Gradivo.

#### Scenario: Discussion replaces the steps
- **WHEN** the teacher opens Diskusija
- **THEN** the discussion is on screen and the steps and the editor are not

#### Scenario: Steps replace the editor
- **WHEN** the teacher opens Gradivo while Editor was open
- **THEN** the steps are on screen and the editor and the preview are not

#### Scenario: Search shows the steps
- **WHEN** the teacher chooses a glossary term while another tab is open
- **THEN** Gradivo is the open tab and the first matching step is open

### Requirement: Editor i pregled
The Editor tab MUST show the file editor on the left and the control-room preview on the right. Those two sides MUST start at equal width. The code surface MUST fill the width from the file tree to the divider. The preview MUST show the text currently in the editor. The other lecture sections MUST NOT be on screen.

#### Scenario: Preview sits on the right
- **WHEN** the teacher opens Editor before moving the bar
- **THEN** the editor takes the left half, the preview takes the right half, and the steps and the discussion are not on screen

#### Scenario: Code fills its column
- **WHEN** the teacher opens a file in the editor
- **THEN** the code surface reaches from the file tree to the divider

#### Scenario: Preview follows the editor
- **WHEN** the text in the editor changes
- **THEN** the preview shows that text

### Requirement: Pregled ostaje trenutan
Opening Editor MUST show the preview of the text then in the editor, including a working copy stored in this browser.

#### Scenario: Return shows the current room
- **WHEN** the teacher leaves Editor and opens Editor again
- **THEN** the preview shows the text then in the editor

### Requirement: Pomoć školjke
Help MUST open a short explanation of the dashed underline, the typeahead, and the three tabs Gradivo, Diskusija, and Editor. It MUST NOT open the editor and MUST NOT send a room request.

#### Scenario: Help stays on the page
- **WHEN** the teacher opens help
- **THEN** that explanation is visible, the editor stays as it was, and no room request is sent

### Requirement: Ključna ideja i isečak
On Gradivo, the key-idea callout MUST be labeled Ključna ideja and MUST be visible without a further click. The code snippet MUST show its title, line numbers, and a control that copies the snippet text.

#### Scenario: Callout is already visible
- **WHEN** the teacher opens a step on Gradivo
- **THEN** the callout is visible and its label is Ključna ideja

#### Scenario: Copy copies the snippet
- **WHEN** the teacher uses the snippet copy control
- **THEN** the clipboard receives the snippet text

### Requirement: Pitanje i primer u pretrazi
The search placeholder MUST be Nađi pojam, pitanje ili primer koda... Choosing a quiz question or a code snippet from the typeahead MUST open the step that contains it.

#### Scenario: Question opens its step
- **WHEN** the teacher chooses a quiz question from the typeahead
- **THEN** the step that asks that question becomes the open lesson on Gradivo

## ADDED Requirements

### Requirement: Žuti hod koraka
On Gradivo, the previous-step and next-step controls MUST sit with the step line. Each MUST have a yellow background `#ffb000` and dark text in both themes, with a left arrow on the previous control and a right arrow on the next control. The temperature control on the panel MUST stay without that yellow background.

#### Scenario: Step controls are yellow
- **WHEN** a step is open on Gradivo and either theme is active
- **THEN** the previous-step and next-step controls have a `#ffb000` background, dark text, and arrow icons

#### Scenario: Temperature control stays plain
- **WHEN** the temperature control is visible on the panel
- **THEN** it does not use the yellow step-control background

### Requirement: Original koraka u editoru
The editor MUST be able to show the original of the open step, the code the course gives for that step. That view MUST be read-only and MUST show line numbers and syntax coloring.

#### Scenario: Original is read-only
- **WHEN** the teacher shows the original of the open step
- **THEN** the course code for that step is on screen and cannot be edited

### Requirement: Razlika prema prethodnom originalu
The original view MUST mark lines added since the original of the previous step of the same file in green, and lines removed since that original in red. The previous step MUST be the latest earlier step in the course that has an original for that file. The comparison MUST ignore the working copy. When no such earlier step exists, the original MUST have no red lines and every line MUST be green.

#### Scenario: Diff uses the previous original
- **WHEN** the teacher shows the original of a step whose file has an earlier original
- **THEN** green lines are lines added since that earlier original and red lines are lines removed since it

#### Scenario: First original is all added
- **WHEN** the teacher shows the original of the first step that has that file
- **THEN** every line is green and no line is red

#### Scenario: Working copy is not the baseline
- **WHEN** a working copy of the file exists and the teacher shows the original
- **THEN** the green and red lines still compare the two originals

### Requirement: Radna verzija fajla
The editor MUST keep one working copy per file in this browser's localStorage, shared across steps, and MUST restore it after reload. Changing the step MUST leave that file's working copy on screen when one exists. Until the teacher edits a file, the editor MUST show that step's original. The working copy MUST show line numbers and syntax coloring, and MUST NOT use the original's green and red lines.

#### Scenario: Step change keeps the typed code
- **WHEN** the teacher edits a file and opens another step of that file
- **THEN** the editor still shows the typed working copy

#### Scenario: Reload keeps the working copy
- **WHEN** the teacher edits a file and loads the page again
- **THEN** that file's working copy is still available

### Requirement: Prekidač verzije
A control beside the file path MUST switch between the working copy and the original of the open step, and MUST NOT delete the working copy. The control MUST show a pencil while the working copy is on screen and a page while the original is on screen, with an accessible name for the view the click will show.

#### Scenario: Toggle shows the original
- **WHEN** the teacher activates the version control while the working copy is on screen
- **THEN** the editor shows the original of the open step and the working copy remains stored

#### Scenario: Toggle returns to the typed code
- **WHEN** the teacher activates the version control while the original is on screen
- **THEN** the editor shows the same stored working copy
