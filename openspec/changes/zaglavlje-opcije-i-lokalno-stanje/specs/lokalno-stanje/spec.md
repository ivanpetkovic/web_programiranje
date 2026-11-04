# Spec Delta

## Purpose

Lokalno stanje je jedan zapis sajta časa u ovom browseru: napredak po temi, podešavanja, paleta i beleške koraka. Zapis se učitava, čuva, briše, izvozi i uvozi bez servera.

## ADDED Requirements

### Requirement: Jedan zapis stanja
The lecture site MUST keep its local state as one versioned JSON record under the localStorage key `web-programiranje:stanje`. The record MUST hold progress per week, settings (text size, work mode, collapsed editor tree), the pinned palette, and step notes. The editor's working copies MUST stay outside that record, under their own key.

#### Scenario: One key holds the state
- **WHEN** the student opens a step, pins a palette, changes the text size, and adds a note
- **THEN** localStorage has one record under `web-programiranje:stanje` that holds all four, and no separate `tema`, `web-programiranje:mod`, `web-programiranje:font`, or `web-programiranje:korak` key is written

#### Scenario: Working copies stay apart
- **WHEN** the student edits a client file in the editor
- **THEN** the working copy is stored under its own key and the state record does not contain the file text

### Requirement: Učitavanje stanja
Loading MUST read the record and return a complete state. A missing, unreadable, or invalid record MUST yield the default state without throwing. A field with a wrong type or an unknown value MUST fall back to its default while the valid fields are kept.

#### Scenario: Empty browser
- **WHEN** the site opens in a browser with no state record
- **THEN** the state has no pinned palette, no work mode, text size `1`, no viewed steps, and no notes

#### Scenario: Broken record
- **WHEN** the stored record is not valid JSON
- **THEN** the site opens with the default state and does not show a script error

#### Scenario: One bad field
- **WHEN** the stored record has an unknown palette and a valid list of notes
- **THEN** the palette follows the system preference and the notes are kept

### Requirement: Čuvanje stanja
Every change to progress, settings, palette, or notes MUST write the whole record at once. When the write fails, the site MUST keep working with the state in memory and MUST tell the student that the state is not saved.

#### Scenario: Change survives reload
- **WHEN** the student pins Terakota, sets A+, and reloads the page
- **THEN** Terakota and A+ are active after the reload

#### Scenario: Storage refuses the write
- **WHEN** localStorage throws on write
- **THEN** the page keeps the change on screen and the local-state badge reads Nije sačuvano instead of Sačuvano lokalno

### Requirement: Brisanje stanja
Clearing MUST remove the state record and return the site to the default state without a document reload. It MUST NOT remove the editor's working copies. The site MUST ask for confirmation before clearing.

#### Scenario: Clear after confirmation
- **WHEN** the student activates Obriši progres and confirms
- **THEN** progress and notes are gone, the palette follows the system preference, the text size is `1`, the first-run mode choice is shown again, and the editor working copies are unchanged

#### Scenario: Clear is cancelled
- **WHEN** the student activates Obriši progres and cancels the confirmation
- **THEN** the state record is unchanged

### Requirement: Stanje važi pre prvog crtanja
The palette, the work mode, and the text size from the state record MUST be applied before the page is first painted, so the page does not flash another palette or size.

#### Scenario: Pinned palette on load
- **WHEN** the record pins mornar and the page loads in a browser that prefers light
- **THEN** the first painted frame uses mornar

### Requirement: Prenos starih ključeva
When no state record exists, loading MUST read the earlier keys `tema`, `web-programiranje:mod`, `web-programiranje:font`, `web-programiranje:korak`, and `stabloSklopljeno` once, write their values into the new record, and remove those keys. A stored palette `tamna` MUST become ugalj and `svetla` MUST become pesak. A stored text size `1.25` MUST become `1.125`. Each earlier saved step MUST become a viewed step.

#### Scenario: Old browser keeps its choices
- **WHEN** a browser holds `tema=svetla`, `web-programiranje:mod=samostalni`, and saved steps `3:0` and `3:1`, and the site opens
- **THEN** pesak and Samostalni rad are active, steps 1 and 2 of week 3 are viewed, the first-run mode choice is not shown, and the earlier keys are removed

#### Scenario: Prenos runs once
- **WHEN** a state record already exists and an earlier key is also present
- **THEN** the record wins and the earlier key is ignored

### Requirement: Napredak teme
Opening a step MUST record that step as viewed for its week and MUST record it as that week's last open step. The site MUST also record the last open week. Viewing MUST NOT be a grade.

#### Scenario: Reload returns to the place
- **WHEN** the student opens step 4 of week 3 and loads the page again without a week in the address
- **THEN** week 3 and step 4 are open

#### Scenario: Each week keeps its last step
- **WHEN** the student leaves week 3 on step 4, opens week 5, and returns to week 3
- **THEN** step 4 of week 3 is open

### Requirement: Izvoz stanja u fajl
Save MUST download the current state record as a JSON file named `veb-programiranje-stanje.json`. The file MUST NOT contain the editor's working copies.

#### Scenario: Download
- **WHEN** the student activates Save in Opcije
- **THEN** the browser downloads `veb-programiranje-stanje.json` and its content is the same record that localStorage holds

### Requirement: Uvoz stanja iz fajla
Load MUST let the student pick a JSON file, validate it like a stored record, replace the state with it, apply palette, mode, and text size at once, and save it. A file that is not a state record MUST leave the state unchanged and MUST show a message.

#### Scenario: Import on another computer
- **WHEN** the student loads a file exported from another browser
- **THEN** its notes, progress, palette, mode, and text size are active without a document reload

#### Scenario: Wrong file
- **WHEN** the student loads a file that is not JSON or has no state version
- **THEN** the state is unchanged and Opcije shows that the file is not a saved state

### Requirement: Stanje ne ide na server
The state record, its export, and its import MUST stay in the browser. The site MUST NOT send any part of the state in a network request.

#### Scenario: No request on save
- **WHEN** the student changes a setting, adds a note, or exports the state
- **THEN** the network record has no request that carries state content
