# Spec Delta

## ADDED Requirements

### Requirement: Panel nedelje istorije
While week 1 is open the panel MUST NOT paint 24, MUST NOT show Sledeći, MUST NOT show the machine room, the log, or the chart, and MUST NOT send a room request. The digits MUST NOT be the failed-read dashes.

#### Scenario: History panel stays quiet
- **WHEN** the teacher opens week 1
- **THEN** the digits are not 24, Sledeći is absent, the machine room is hidden, and no room request is sent

### Requirement: Panel nedelje stranice
The week Šta browser prikazuje MUST paint 24 and MUST hide the machine room. The log MUST show only on JavaScript opisuje stanje. The chart MUST show only on Događaji povezuju korisnika.

#### Scenario: Page week paints 24
- **WHEN** the teacher opens Šta browser prikazuje
- **THEN** the digits are 24 and the machine room is hidden

#### Scenario: Log and chart stay on their weeks
- **WHEN** the teacher opens JavaScript opisuje stanje and then Događaji povezuju korisnika
- **THEN** the log shows only on the first of those weeks and the chart shows only on the second

### Requirement: Panel od Node nedelje
The machine room and the read control MUST show from Od naivnog prenosa do HTTP-a, pa Node onward. The waiting label and the cable control MUST show from Čekanje i neuspeh onward. History and the database flag MUST show from Trajno stanje i Docker onward. Periodic reading, freshness, and age MUST show from Koliko je prikaz svež onward. Roles MUST show from Ko sme da upravlja onward.

#### Scenario: Node week shows the machine room
- **WHEN** the teacher opens Od naivnog prenosa do HTTP-a, pa Node
- **THEN** the machine room and the read control are visible and roles are hidden

#### Scenario: Later weeks open their controls
- **WHEN** the teacher opens Ko sme da upravlja
- **THEN** roles, history, and periodic reading are visible

## MODIFIED Requirements

### Requirement: Korak na sajtu
A step that names a file MUST show, in order, the step prose, the key-idea callout, the code snippet, and a short quiz with unmarked answers. The next step MUST treat that step's file fragment as already typed. The site MUST show the file path of the fragment. A figure step MUST show the prose, the key-idea callout, the figure, and the short quiz, and MUST NOT show a code snippet or a file path. A step that names no file and has no figure MUST show the prose, the key-idea callout, and the short quiz, and MUST NOT show a snippet, a file path, or a figure.

#### Scenario: Callout comes before the quiz
- **WHEN** the teacher opens a step that names a file
- **THEN** the prose, the key idea, and the snippet are visible before the quiz, and no quiz answer is marked

#### Scenario: Figure comes before the quiz
- **WHEN** the teacher opens a figure step
- **THEN** the prose, the key idea, and the figure are visible before the quiz, and no snippet or file path is shown

#### Scenario: Step adds a fragment
- **WHEN** the teacher finishes a step that adds a fragment
- **THEN** the named file contains that fragment and the following step shows it as already present

#### Scenario: Short quiz stays closed
- **WHEN** the short quiz is first shown
- **THEN** no answer is marked correct until the teacher reveals the explanation

#### Scenario: Story step has no figure
- **WHEN** the teacher opens LO
- **THEN** the prose and the key idea are visible before the quiz, and no snippet, file path, or figure is shown

### Requirement: Dva stabla
The editor MUST offer a Klijent tab for `client/` and a Server tab for `server/`. The Server tab MUST be absent during weeks 1, 2, 3, and 4, and MUST be present from week 5. Each visible tab MUST show that side's file tree as introduced by a step at or before the open step, the open file's path, and a place for an error. A file MUST appear when such a step first names it and MUST remain on later steps. Prepared copies MUST stay out of the tree. During week 1 the editor MUST NOT open a buffer.

#### Scenario: Tabs stay on their own files
- **WHEN** the teacher switches between Klijent and Server in week 5 or later
- **THEN** each tab shows only the files of that side introduced at or before the open step

#### Scenario: Server tab waits for week 4
- **WHEN** week 1, 2, 3, or 4 is open on Editor
- **THEN** the Server tab is absent and the tree shows only `client/`

#### Scenario: HTML is a file
- **WHEN** the teacher opens the document step
- **THEN** the editor can open `client/index.html` as the file being retyped

#### Scenario: Front tree lists the course files
- **WHEN** the teacher opens the Klijent tab at the end of week 4
- **THEN** the tree includes `client/index.html`, `client/css/soba.css`, `client/js/korak.js`, `client/js/niz.js`, `client/js/displej.js`, and `client/js/prekidac.js`, and does not include a server file

#### Scenario: Podela lists only the sketch
- **WHEN** the teacher opens Podela on Klijent
- **THEN** the tree lists only `client/index.html`

#### Scenario: Tree grows with the open step
- **WHEN** the teacher opens Objekat
- **THEN** the Klijent tree includes `client/js/korak.js` and does not yet include `client/js/niz.js`

#### Scenario: History week opens no buffer
- **WHEN** the teacher opens any step of week 1 on Editor
- **THEN** no file buffer is open and the Server tab is absent

### Requirement: Ikonice isečka
The key-idea callout MUST show `lightbulb`. When the step has a snippet, the snippet title MUST show `folder`, the copy control MUST show `copy` and the word Kopiraj, and the file path MUST show `file-text` and the path text. A figure step MUST NOT show those snippet icons. A step with no snippet and no figure MUST NOT show those snippet icons.

#### Scenario: Snippet chrome
- **WHEN** the teacher opens a step that has a snippet on Gradivo
- **THEN** the callout, the snippet title, the copy control, and the file path show those icons and the words Kopiraj and Ključna ideja stay

#### Scenario: Figure has no snippet chrome
- **WHEN** the teacher opens a figure step on Gradivo
- **THEN** the callout shows `lightbulb` and the snippet title, copy control, and file path are absent

#### Scenario: Story step has no snippet chrome
- **WHEN** the teacher opens LO on Gradivo
- **THEN** the callout shows `lightbulb` and the snippet title, copy control, and file path are absent
