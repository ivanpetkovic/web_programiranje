# Spec Delta

## MODIFIED Requirements

### Requirement: Dva stabla
The editor MUST offer a Klijent tab for `client/` and a Server tab for `server/`. The Server tab MUST be absent during weeks 1, 2, and 3, and MUST be present from week 4. Each visible tab MUST show that side's file tree as introduced by a step at or before the open step, the open file's path, and a place for an error. A file MUST appear when such a step first names it and MUST remain on later steps. Prepared copies MUST stay out of the tree.

#### Scenario: Tabs stay on their own files
- **WHEN** the teacher switches between Klijent and Server in week 4 or later
- **THEN** each tab shows only the files of that side introduced at or before the open step

#### Scenario: Server tab waits for week 4
- **WHEN** week 1, 2, or 3 is open on Editor
- **THEN** the Server tab is absent and the tree shows only `client/`

#### Scenario: HTML is a file
- **WHEN** the teacher opens the document step
- **THEN** the editor can open `client/index.html` as the file being retyped

#### Scenario: Front tree lists the course files
- **WHEN** the teacher opens the Klijent tab at the end of week 3
- **THEN** the tree includes `client/index.html`, `client/css/soba.css`, `client/js/korak.js`, `client/js/niz.js`, `client/js/displej.js`, and `client/js/prekidac.js`, and does not include a server file

#### Scenario: Podela lists only the sketch
- **WHEN** the teacher opens Podela on Klijent
- **THEN** the tree lists only `client/index.html`

#### Scenario: Tree grows with the open step
- **WHEN** the teacher opens Objekat
- **THEN** the Klijent tree includes `client/js/korak.js` and does not yet include `client/js/niz.js`

### Requirement: Original koraka u editoru
The editor MUST be able to show the built-in original of the open step for the open file. That text MUST be the snapshot of that path at the open step, and MUST NOT be replaced by the finished file on disk when the snapshot has text. That view MUST be read-only and MUST show line numbers and syntax coloring.

#### Scenario: Original is read-only
- **WHEN** the teacher shows the original of the open step
- **THEN** the snapshot for that step is on screen and cannot be edited

#### Scenario: Snapshot beats the disk file
- **WHEN** the teacher shows the built-in version of `client/js/korak.js` on Objekat
- **THEN** the text is that step's snapshot and is not the finished `client/js/korak.js` on disk

### Requirement: Razlika prema prethodnom originalu
The original view MUST mark lines added since the snapshot of the same path at the immediately previous course step in green, and lines removed since that snapshot in red. The comparison MUST ignore the working copy. When that path has no snapshot at the previous step, the original MUST have no red lines and every line MUST be green. When the two snapshots are the same text, the original MUST have no green lines and no red lines.

#### Scenario: Diff uses the previous original
- **WHEN** the teacher shows the original of Broj
- **THEN** green lines are lines added since the snapshot of `client/index.html` on the immediately previous course step, and red lines are lines removed since that snapshot

#### Scenario: First original is all added
- **WHEN** the teacher shows the original of the first step that has that file
- **THEN** every line is green and no line is red

#### Scenario: Working copy is not the baseline
- **WHEN** a working copy of the file exists and the teacher shows the original
- **THEN** the green and red lines still compare the two snapshots

#### Scenario: Unchanged snapshot has no color
- **WHEN** the teacher shows the built-in version of a file the open step did not change
- **THEN** that view has no green lines and no red lines

## ADDED Requirements

### Requirement: Snimak fajla na koraku
The built-in version of a file MUST be the snapshot of course steps through the open step. A whole-file original MUST replace that file. A later fragment MUST be appended. The finished file on disk MUST NOT replace a snapshot that has text.

#### Scenario: Podela is the folder sketch
- **WHEN** the teacher shows the built-in version of `client/index.html` on Podela
- **THEN** the text is the folder sketch `client/` and `server/` and contains no script

#### Scenario: Selektor is one rule
- **WHEN** the teacher shows the built-in version of `client/css/soba.css` on Selektor
- **THEN** the text is one class rule and is not the finished stylesheet on disk

#### Scenario: Delta keeps the earlier object
- **WHEN** the teacher shows the built-in version of `client/js/korak.js` on Delta
- **THEN** the text starts with `let delta = 1;`, still contains the earlier `const soba` line, and declares `function korak`

#### Scenario: Class enters with the step that names it
- **WHEN** the teacher shows the built-in version of `client/js/displej.js` on the step that introduces `class Displej`
- **THEN** the text contains `class Displej` and is not the finished file on disk

### Requirement: Vezivanje stranice
Once `client/index.html` has a body and the snapshot contains at least one `client/js` file, that HTML snapshot MUST include a script source for each such file in introduction order and one classic inline script that binds the symbols those files declare. An HTML snapshot with no client script MUST contain no script tag.

#### Scenario: Semantika has no script
- **WHEN** the teacher shows the built-in version of `client/index.html` on Semantika
- **THEN** the document contains no script tag and no `/api/soba`

#### Scenario: Objekat binds the existing script
- **WHEN** the teacher shows the built-in version of `client/index.html` on Objekat
- **THEN** the document loads `js/korak.js` and the click handler sets the digit from `soba.temperatura`

#### Scenario: Classes are constructed when declared
- **WHEN** the teacher shows the built-in version of `client/index.html` on Prekidač
- **THEN** the document loads `js/korak.js` before `js/niz.js`, then `js/prekidac.js`, then `js/displej.js`, and the inline script constructs `Displej` and `Prekidac`

#### Scenario: Canvas appears with the line
- **WHEN** the teacher shows the built-in version of `client/index.html` on Linija
- **THEN** the document contains a canvas of 320 by 120 and mentions `nacrtajLiniju`

### Requirement: Rani klijentski skript
The panel MUST apply `client/js/korak.js` only when the shown text declares `function korak`, `client/js/niz.js` only when it declares both `pripremiLiniju` and `nacrtajLiniju`, `client/js/displej.js` only when it declares `class Displej`, and `client/js/prekidac.js` only when it declares `class Prekidac`. Until then the editor MUST clear the fragment-not-applied message. A shown buffer that declares the symbol and then throws MUST still keep the last drawing and show that message.

#### Scenario: Early object does not report a failure
- **WHEN** the teacher shows `client/js/korak.js` on Objekat and that text does not declare `function korak`
- **THEN** the editor does not say that the fragment was not applied

#### Scenario: Thrown buffer still reports
- **WHEN** the shown text declares the symbol for that file and executing it throws
- **THEN** the panel keeps the last valid drawing and the editor says that the fragment was not applied
