# Spec Delta

## MODIFIED Requirements

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

## ADDED Requirements

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
