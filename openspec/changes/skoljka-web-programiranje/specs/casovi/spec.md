# Spec Delta

## MODIFIED Requirements

### Requirement: Nedelja ima naslov i korake
The course MUST be one document that sets its duration as a number of weeks and lists that many weeks, in order, each with a title. The shell MUST use that duration and MUST NOT hardcode a week count. The shipped document MUST set the duration to ten, use the titles below, and give each week 10 to 20 steps. A step there MUST be one fragment, not the whole week. The minute budget MUST stay a teaching label and MUST NOT be a timer.

#### Scenario: Titles are visible
- **WHEN** the teacher opens the shipped course
- **THEN** the weeks appear in order as: Šta browser prikazuje; JavaScript opisuje stanje; Događaji povezuju korisnika; Od naivnog prenosa do HTTP-a, pa Node; Čekanje i neuspeh; Komande i ponavljanje; Trajno stanje i Docker; Koliko je prikaz svež; Ko sme da upravlja; Ceo sistem

#### Scenario: A lecture is a sequence of steps
- **WHEN** the teacher opens any week of the shipped course
- **THEN** that week shows between 10 and 20 steps and each step names the file it changes

#### Scenario: Duration follows the document
- **WHEN** a course document sets a duration other than ten and lists that many weeks
- **THEN** the course reports that duration and those weeks, with no shell change

### Requirement: Redosled unutar koraka
A step MUST show its prose, then the key-idea callout, then the code snippet, then a short quiz with unmarked answers. The snippet MUST be the fragment added to the named file. The example MUST remain checkable on its own, in the manner of `setTimeout` inside a `for` loop.

#### Scenario: Explanation comes after the guess
- **WHEN** a step is opened
- **THEN** the prose, the key idea, and the snippet are visible, and the quiz answers are still unmarked

#### Scenario: Key idea is visible before the quiz
- **WHEN** a step is opened
- **THEN** the key idea and the snippet are above the quiz, and the snippet is the fragment added to the named file

## ADDED Requirements

### Requirement: Trajanje se slaže sa spiskom
The duration MUST equal the number of weeks in the document. When they differ, the site MUST show an error and MUST NOT invent a week or drop a week.

#### Scenario: Count does not match
- **WHEN** the document sets a duration that is not the number of weeks it lists
- **THEN** the site shows an error and does not present a shortened or padded week list

### Requirement: Telo kursa je dokument
The institution, course title, initials, week titles, subtitles, step prose, key ideas, snippets, levels, minute budgets, and quizzes MUST come from the course document. The shell MUST NOT contain that copy. Changing a week or the duration MUST be a change to the document alone.

#### Scenario: Shell has no lecture copy
- **WHEN** a week title in the document changes and the shell is unchanged
- **THEN** the week list shows the new title

#### Scenario: Minutes come from the document
- **WHEN** a week sets a minute budget
- **THEN** the progress card shows that budget and the shell does not substitute a fixed duration
