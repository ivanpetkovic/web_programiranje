# casovi Specification

## Purpose

Tekst tema, koraka i pitalica je `site/kurs.json`. Ova specifikacija ne opisuje sadržaj kursa. Opisuje samo odnos ljuske i dokumenta. Ponašanje stranice je u `sajt-casa`.

## Requirements

### Requirement: Telo kursa je dokument
The shell MUST read week titles, step prose, key ideas, snippets, quizzes, and outcomes from the course document. The shell MUST NOT hardcode a week title, a step list, or lecture prose.

#### Scenario: A title change is a document change
- **WHEN** a week title in the document changes and the shell is unchanged
- **THEN** the week list shows the new title

### Requirement: Trajanje se slaže sa spiskom
The duration MUST equal the number of weeks in the document. When they differ, the site MUST show an error and MUST NOT invent a week or drop a week.

#### Scenario: Count does not match
- **WHEN** the document sets a duration that is not the number of weeks it lists
- **THEN** the site shows an error and does not present a shortened or padded week list
