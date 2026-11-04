# Spec Delta

## Purpose

Beleška koraka je obeleživač jednog koraka teme sa kratkim komentarom studenta, npr. šta mu u tom koraku nije jasno. Beleške se vide u zaglavlju i u spisku svih beleški, i čuvaju se u lokalnom stanju.

## ADDED Requirements

### Requirement: Beleška na koraku
Every step of every week MUST be able to carry one note. A note MUST record the week, the step index, the step title at the time it was saved, an optional comment of at most 500 characters, and the time it was last changed. A note MUST NOT be a grade and MUST NOT be sent to the server.

#### Scenario: Note with a comment
- **WHEN** the student saves step 3 of week 3 with the comment Razlika u čuvanju u memoriji
- **THEN** the state holds one note for week 3, step 3, with that comment and the step title

#### Scenario: Note without a comment
- **WHEN** the student saves a step and leaves the comment empty
- **THEN** the note is kept and its comment is empty

#### Scenario: Comment is capped
- **WHEN** the student types more than 500 characters into the comment
- **THEN** the field stops at 500 characters

### Requirement: Sačuvaj korak otvara belešku
Sačuvaj korak in the lesson MUST open a small editor anchored to that control, with the comment field labeled Šta nije jasno u ovom koraku?, Sačuvaj, and, when the step already has a note, Ukloni. When the open step has a note, Sačuvaj korak MUST show `bookmark-filled` and MUST be pressed.

#### Scenario: First save
- **WHEN** the student activates Sačuvaj korak on a step without a note, types a comment, and activates Sačuvaj
- **THEN** the note is stored and Sačuvaj korak shows `bookmark-filled` and is pressed

#### Scenario: Remove
- **WHEN** the student opens the note editor on a step that has a note and activates Ukloni
- **THEN** the note is gone and Sačuvaj korak shows `bookmark` and is not pressed

#### Scenario: Escape keeps the note
- **WHEN** the note editor is open and the student presses Escape
- **THEN** the editor closes, the stored note is unchanged, and focus returns to Sačuvaj korak

### Requirement: Sačuvane beleške u zaglavlju
The header MUST show a notes control with `bookmark` and `chevron-down`. Activating it MUST open a dropdown titled Sačuvane beleške with the note count, the five most recently changed notes, and Prikaži sve beleške. Each row MUST show `sticky-note`, Korak {n} – {step title} truncated to one line, and, when present, the comment with `message-circle`.

#### Scenario: Two notes
- **WHEN** the student has two notes and opens the notes control
- **THEN** the dropdown reads Sačuvane beleške and 2 beleške and lists both notes, newest first

#### Scenario: No notes
- **WHEN** the student has no notes and opens the notes control
- **THEN** the dropdown reads Nema sačuvanih beleški and still offers Prikaži sve beleške

### Requirement: Broj beleški
The note count MUST use the Serbian plural: beleška after a number ending in 1 but not 11, beleške after a number ending in 2 to 4 but not 12 to 14, and beležaka otherwise.

#### Scenario: Plural forms
- **WHEN** the student has 1, 3, 5, 12, or 21 notes
- **THEN** the count reads 1 beleška, 3 beleške, 5 beležaka, 12 beležaka, or 21 beleška

### Requirement: Beleška vodi na korak
Choosing a note in the dropdown or in the full list MUST open that week and step, MUST keep the open tab, and MUST close the dropdown or list.

#### Scenario: Jump from the header
- **WHEN** week 1 is open on Editor and the student chooses the note for step 3 of week 3
- **THEN** week 3, step 3 is open on Editor and the dropdown is closed

### Requirement: Spisak svih beleški
Prikaži sve beleške MUST open a dialog that lists every note grouped by week in week order, then by step order. Each note MUST let the student change its comment and remove it. The dialog MUST close with Escape and return focus to the notes control.

#### Scenario: Edit in the list
- **WHEN** the student changes a comment in the full list and leaves the field
- **THEN** the stored note has the new comment and the header dropdown shows it

#### Scenario: Remove in the list
- **WHEN** the student removes a note in the full list
- **THEN** that note disappears from the list, from the dropdown, and from the state

### Requirement: Beleška koraka koji više ne postoji
A note whose step index no longer exists in the course document MUST stay in the full list with its stored title and the label Korak više ne postoji. Choosing it MUST NOT open a step.

#### Scenario: Course lost a step
- **WHEN** the state holds a note for step 15 of a week that now has 12 steps
- **THEN** the full list shows that note with Korak više ne postoji and choosing it does not change the open step

### Requirement: Beleške sa tastature
The notes control, every dropdown row, Prikaži sve beleške, and every control in the note editor and the full list MUST work from the keyboard. Arrow keys MUST move between dropdown rows, Escape MUST close the dropdown, and focus MUST stay visible.

#### Scenario: Keyboard only
- **WHEN** the student focuses the notes control, presses Enter, then the down arrow twice and Enter
- **THEN** the second note's step is open and focus has left the closed dropdown
