# studio Specification

## Purpose

Studio je strana na kojoj nastavnik dodaje teme i korake, menja sadržaj kursa i taj isti dokument učitava i čuva kao JSON.

## Requirements

### Requirement: Strana studija
The studio MUST be the page at `/studio`. It MUST list every week and that week's steps, and MUST show the open course, week, or step. The page language MUST stay Serbian.

#### Scenario: Studio page opens
- **WHEN** the teacher opens `/studio`
- **THEN** the response is HTTP 200 and the page contains the studio

#### Scenario: List follows the document
- **WHEN** the loaded course has two weeks and the first week has three steps
- **THEN** the list shows those two weeks and those three steps

### Requirement: Otvaranje kurs.json
On open, the studio MUST read the course document with `GET /kurs.json` and show that document. It MUST NOT require a build step.

#### Scenario: Shipped course opens
- **WHEN** the studio loads the shipped `kurs.json`
- **THEN** it shows that course's weeks in order, and the first step of the first week is titled LO

### Requirement: Trajanje prati teme
The studio MUST treat the duration as the number of weeks. When a loaded document's duration differs from that count, the studio MUST set the duration to the count before any save and MUST tell the teacher it was aligned.

#### Scenario: Duration is aligned
- **WHEN** a loaded document sets the duration to 4 and lists 2 weeks
- **THEN** the studio shows 2 weeks and a later save writes the duration as 2

### Requirement: Dodavanje teme
The teacher MUST be able to add a week. The new week MUST have a title and exactly one step. Adding a week MUST leave every other week and its steps unchanged, and MUST set the duration to the new count.

#### Scenario: Week is added
- **WHEN** the course has one week and the teacher adds a week
- **THEN** the course has two weeks, the new week has one step, and the existing week's steps are unchanged

### Requirement: Dodavanje koraka
The teacher MUST be able to add a step to a week, including directly below the open step. The new step MUST have a title. Adding a step MUST leave the other steps of that week unchanged.

#### Scenario: Step is added below
- **WHEN** a week has one step and the teacher adds a step below it
- **THEN** that week has two steps and the original step stays

### Requirement: Izmena sadržaja
The teacher MUST be able to edit the course title, the open week's title and discussion text, and the open step's title, prose, and key idea. Edits MUST stay in the open document until a successful save. The studio MUST NOT write the course file on each keystroke.

#### Scenario: Typing does not write the file
- **WHEN** the teacher changes a step title and has not saved
- **THEN** the open document shows the new title and the course file on disk is unchanged

### Requirement: Redosled
The teacher MUST be able to move a week among the weeks and a step among the steps of its week. A move past either end MUST leave that order unchanged.

#### Scenario: Week moves up
- **WHEN** the second week is moved up
- **THEN** it becomes the first week and the previous first week follows it

#### Scenario: First step does not move up
- **WHEN** the first step of a week is moved up
- **THEN** that week's step order is unchanged

### Requirement: Brisanje
The teacher MUST be able to delete a week. The teacher MUST be able to delete a step only while its week has more than one step. Deleting the only step MUST leave that step in place. Deleting a week MUST set the duration to the remaining count.

#### Scenario: Last step stays
- **WHEN** a week has one step and the teacher deletes that step
- **THEN** the week still has that step

#### Scenario: Week is removed
- **WHEN** the course has two weeks and the teacher deletes the first
- **THEN** one week remains and the duration is 1

### Requirement: Učitaj drugi JSON
Učitaj MUST replace the open document with a chosen JSON file and MUST NOT write the course file. The studio MUST refuse a file that is not JSON, a document without a weeks array, and a week whose steps are missing or not objects. A refusal MUST leave the open document unchanged.

#### Scenario: Bad file is refused
- **WHEN** the teacher loads a file that is not JSON
- **THEN** the studio reports the error and keeps the document that was already open

#### Scenario: Valid file stays unsaved
- **WHEN** the teacher loads a valid course file
- **THEN** the studio shows that course and the course file on disk is unchanged until save

### Requirement: Sačuvaj upisuje JSON
Sačuvaj MUST send the open document as JSON to `PUT /api/kurs`. A course whose duration equals its week count, and whose every week has a steps array of objects, MUST be stored as pretty-printed JSON with a trailing newline. The response MUST be HTTP 200 and a body that reports success. `GET /kurs.json` MUST then return that document. Fields the studio does not edit MUST remain.

#### Scenario: Save writes the course file
- **WHEN** the teacher saves a valid one-week course
- **THEN** the response is HTTP 200, the course file is that document as pretty-printed JSON with a trailing newline, and a later `GET /kurs.json` returns it

#### Scenario: Unknown fields survive
- **WHEN** a week has an extra field and the teacher saves without removing it
- **THEN** the stored week still has that field

### Requirement: Odbijen upis
`PUT /api/kurs` MUST respond HTTP 400 and MUST NOT change the course file when the body is not JSON, when the body exceeds the course size limit, or when the document is not a course. A document is not a course when its duration is not the week count, or when any week lacks a steps array of objects.

#### Scenario: Invalid JSON leaves the file
- **WHEN** the body is not JSON
- **THEN** the response is HTTP 400 and the course file is unchanged

#### Scenario: Duration mismatch leaves the file
- **WHEN** the body lists one week and sets the duration to 3
- **THEN** the response is HTTP 400 and the course file is unchanged

### Requirement: Preuzmi
Preuzmi MUST download the open document as a JSON file named `kurs.json` and MUST NOT write the course file.

#### Scenario: Download is a copy
- **WHEN** the teacher downloads the open course
- **THEN** the browser receives a `kurs.json` file of that document and the course file on disk is unchanged

### Requirement: Nacrt do čuvanja
While the document is unsaved, the studio MUST keep a draft of it in this browser. A successful save MUST remove that draft. A refused or unreachable save MUST download the JSON, MUST NOT report that the course file was written, and MUST leave the draft in place.

#### Scenario: Save clears the draft
- **WHEN** the teacher saves and the response is HTTP 200
- **THEN** the studio reports that `kurs.json` was written and the browser draft is gone

#### Scenario: Failed save downloads a copy
- **WHEN** save is refused or the server is unreachable
- **THEN** the studio downloads `kurs.json` and the draft remains

### Requirement: Povratak nacrta
On open, when a draft differs from the loaded `kurs.json` and still parses, the studio MUST show the loaded file and MUST offer to restore or discard the draft. Restoring MUST show the draft and MUST NOT write the course file. When `kurs.json` cannot be loaded and a valid draft exists, the studio MUST open the draft. When neither loads, the studio MUST open an empty course with no weeks.

#### Scenario: Draft is offered
- **WHEN** the loaded file and a different valid draft both exist
- **THEN** the studio shows the loaded file and offers to restore the draft

#### Scenario: Neither file nor draft
- **WHEN** `kurs.json` cannot be loaded and no valid draft exists
- **THEN** the studio shows an empty course and asks the teacher to load a file

### Requirement: Vrsta koraka
A step MUST be a story, a file step, or a figure. A story MUST have no file path and no figure. A file step MUST keep a path and its snippet. A figure MUST be a path of nodes or a line of labels. Switching to a kind that would drop a path, a snippet, or a figure MUST ask for confirmation before those fields are removed. The step title MUST remain.

#### Scenario: Story switch waits
- **WHEN** a file step has a path and the teacher chooses story once
- **THEN** the path is still present and the control asks to confirm

#### Scenario: Confirmed story drops the path
- **WHEN** the teacher confirms the switch to story
- **THEN** the step has no path and no figure, and its title is unchanged

### Requirement: Isti bajtovi bez izmene
Reading the shipped `kurs.json` and preparing it for save with no edits MUST produce the same bytes, including the trailing newline.

#### Scenario: Shipped file is stable
- **WHEN** the studio reads the shipped course and prepares it for save without edits
- **THEN** the JSON text matches the shipped file
