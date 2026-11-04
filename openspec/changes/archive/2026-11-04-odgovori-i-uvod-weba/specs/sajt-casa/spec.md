# Spec Delta

## REMOVED Requirements

### Requirement: Osvrt
**Reason**: The folded block only names topics the lecture does not teach, and the label explains nothing.
**Migration**: Week 1 teaches the Web, the Internet, and a short history as figure steps. Other former names are not shown. The lecture 10 sentence about a type and an assistant stays in that lecture's step.

### Requirement: Pitalica u dva stupca
**Reason**: A wide lesson puts short-quiz answers side by side, which fights the one-row rule in `pitalice`.
**Migration**: Short-quiz answers use one column at every width, including a lesson wider than the single-column layout.

## ADDED Requirements

### Requirement: Pitalica u jednoj koloni
The short quiz MUST lay each option on its own row at every width. A lesson wider than the single-column layout MUST NOT place two options on the same row.

#### Scenario: Wide quiz stacks
- **WHEN** a short quiz is open and the lesson is wider than the single-column layout
- **THEN** each option is on its own row

#### Scenario: Narrow quiz stacks
- **WHEN** the lecture page is laid out in one column and a short quiz is open
- **THEN** the options are in one column

### Requirement: Crtez iz dokumenta
A figure step MUST draw the diagram or timeline from the course document, using that document's labels. The shell MUST NOT hardcode those labels.

#### Scenario: Labels come from the document
- **WHEN** the teacher opens the Web figure
- **THEN** the figure shows the document's labels for the browser, the URL, the document, and the display

### Requirement: Pokret crteža
A path animation MUST play once and MUST NOT loop. A timeline MUST reveal its marks in order once. Reduced motion MUST show the finished figure with every mark visible and with nothing traveling.

#### Scenario: Path plays once
- **WHEN** the teacher opens the Internet figure and the browser allows motion
- **THEN** a marker travels from the browser to the document once and does not repeat

#### Scenario: Reduced motion is still
- **WHEN** the browser asks for reduced motion and a figure step is open
- **THEN** the finished figure is visible, every timeline mark is visible, and nothing travels

### Requirement: Izlazna rečenica
The exit sentence MUST appear only on the last step of the open lecture. The page MUST NOT offer a text field for that sentence. An earlier step of that lecture MUST NOT show the sentence.

#### Scenario: Last step shows the sentence
- **WHEN** the teacher opens the last step of a lecture
- **THEN** the exit sentence is visible and the page has no text field for an answer

#### Scenario: Earlier step hides it
- **WHEN** the teacher opens any earlier step of that lecture
- **THEN** the exit sentence is not shown

## MODIFIED Requirements

### Requirement: Korak na sajtu
A step that names a file MUST show, in order, the step prose, the key-idea callout, the code snippet, and a short quiz with unmarked answers. The next step MUST treat that step's file fragment as already typed. The site MUST show the file path of the fragment. A figure step MUST show the prose, the key-idea callout, the figure, and the short quiz, and MUST NOT show a code snippet or a file path.

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

### Requirement: Beleške ostaju prigušene
In every theme, the phase line and status lines MUST use the muted note color, MUST stay distinct from the step line, and MUST contrast with their surface at a ratio of at least 4.5:1. The exit sentence MUST use that same muted note color. The page MUST NOT show a review line.

#### Scenario: Notes are not the step color
- **WHEN** any theme is active and a lecture is open
- **THEN** the phase line uses the muted note color and the step line does not

#### Scenario: No review line
- **WHEN** any lecture step is open
- **THEN** the page has no review line

#### Scenario: Exit sentence is a note
- **WHEN** the last step of a lecture is open
- **THEN** the exit sentence uses the muted note color

### Requirement: Ključna ideja i isečak
On Gradivo, the key-idea callout MUST be labeled Ključna ideja and MUST be visible without a further click. When the step has a code snippet, that snippet MUST show its title, line numbers, and a control that copies the snippet text.

#### Scenario: Callout is already visible
- **WHEN** the teacher opens a step on Gradivo
- **THEN** the callout is visible and its label is Ključna ideja

#### Scenario: Copy copies the snippet
- **WHEN** the teacher uses the snippet copy control
- **THEN** the clipboard receives the snippet text

### Requirement: Ikonice isečka
The key-idea callout MUST show `lightbulb`. When the step has a snippet, the snippet title MUST show `folder`, the copy control MUST show `copy` and the word Kopiraj, and the file path MUST show `file-text` and the path text. A figure step MUST NOT show those snippet icons.

#### Scenario: Snippet chrome
- **WHEN** the teacher opens a step that has a snippet on Gradivo
- **THEN** the callout, the snippet title, the copy control, and the file path show those icons and the words Kopiraj and Ključna ideja stay

#### Scenario: Figure has no snippet chrome
- **WHEN** the teacher opens a figure step on Gradivo
- **THEN** the callout shows `lightbulb` and the snippet title, copy control, and file path are absent
