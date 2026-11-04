# Spec Delta

## MODIFIED Requirements

### Requirement: Zaglavlje školjke
The header MUST show, from left to right, the institution and its mark, a divider, the course title from the course document beside `monitor-code`, term search, help, the Sačuvane beleške control, the Opcije control, and the initials from the document. The header MUST NOT show the week slider, previous week, next week, or the palette, text-size, and mode controls. The site title MUST NOT be Kontrolna soba.

#### Scenario: Shipped title
- **WHEN** the shipped course is open
- **THEN** the header title is Veb programiranje and the site title is not Kontrolna soba

#### Scenario: Next week
- **WHEN** the teacher chooses the following week in the toolbar week picker and a later week exists
- **THEN** that later week opens and the header itself has no next-week control

#### Scenario: Header order
- **WHEN** a lecture is open on a desktop width
- **THEN** the header shows the mark and institution, the course title with `monitor-code`, search, help, Sačuvane beleške, Opcije, and the initials in that order, on one row

#### Scenario: No week controls in the header
- **WHEN** a lecture is open on a desktop width
- **THEN** the header has no week slider and no previous-week or next-week control

### Requirement: Ikonice zaglavlja
Search MUST show `search`. Help MUST show `help-circle`. The Sačuvane beleške control MUST show `bookmark` and `chevron-down`. The Opcije control MUST show `settings`. The course title MUST show `monitor-code`. The initials MUST stay the letters from the course document. The mark MUST stay the course document mark.

#### Scenario: Header icons
- **WHEN** a lecture is open
- **THEN** search, help, Sačuvane beleške, Opcije, and the course title show those icons, and the initials and the mark are unchanged

### Requirement: Tri taba
The lesson toolbar MUST offer Gradivo, Diskusija, and Editor. Exactly one of those sections MUST be on screen. The title and the step selector MUST stay visible on every tab. Opening a lecture MUST show Diskusija with the open step's short quiz.

#### Scenario: Opening shows the step quiz
- **WHEN** the teacher opens a week
- **THEN** Diskusija is the open tab and the open step's short quiz is visible with unmarked answers

#### Scenario: Discussion replaces the steps
- **WHEN** the teacher opens Diskusija
- **THEN** the discussion and the step selector are on screen, and the Gradivo section and the editor are not

#### Scenario: Steps replace the editor
- **WHEN** the teacher opens Gradivo while Editor was open
- **THEN** the Gradivo section and the step selector are on screen, and the editor and the preview are not

#### Scenario: Search shows the steps
- **WHEN** the teacher chooses a glossary term while another tab is open
- **THEN** Gradivo is the open tab and the first matching step is open

#### Scenario: Tabs sit in the toolbar
- **WHEN** a lecture is open on a desktop width
- **THEN** Gradivo, Diskusija, and Editor are in the lesson toolbar under the header and not under the lecture title

### Requirement: Nastavnik zakuca temu
The Paleta section of Opcije MUST list mornar, ugalj, pesak, and terakota and MUST pin the chosen one. A pinned theme MUST apply at once, MUST override the browser preference, and MUST remain after reload because it is kept in the local state. A stored pin `tamna` MUST open ugalj. A stored pin `svetla` MUST open pesak.

#### Scenario: Pin overrides the system
- **WHEN** the teacher pins pesak while the browser prefers dark
- **THEN** pesak is active without a document reload

#### Scenario: Pin survives reload
- **WHEN** the teacher pins a theme and reloads the page
- **THEN** the pinned theme is still active

#### Scenario: Old pins still open
- **WHEN** the stored pin is `tamna` or `svetla` and the page loads
- **THEN** `tamna` opens ugalj and `svetla` opens pesak

### Requirement: Sačuvan korak
Loading the page without a week in the address MUST restore the last open week and its last open step from the local state. Sačuvaj korak MUST store a note for the current step in the local state and MUST NOT mark the step as done. The record MUST NOT be a grade and MUST NOT be sent to the server.

#### Scenario: Reload restores the step
- **WHEN** the teacher opens a step and loads the page again
- **THEN** that week and that step are open

#### Scenario: Save is a note
- **WHEN** the teacher activates Sačuvaj korak and saves
- **THEN** the step has a note in Sačuvane beleške and the week's progress is unchanged by that action

### Requirement: Sklopivi spisak tema
The left column MUST list every week in the course document. A week MUST show its number, title, and subtitle, and MUST collapse and expand. The open week MUST be expanded and MUST list the same steps as the lesson. Choosing a step MUST open it. A week whose every step has been viewed MUST show a completed mark, and that mark MUST NOT be a grade.

#### Scenario: Other weeks stay collapsed
- **WHEN** the teacher opens one week
- **THEN** that week lists its steps and every other week shows its title and subtitle without its steps

#### Scenario: Step in the list
- **WHEN** the teacher chooses a step in the expanded week
- **THEN** that step is the open lesson

#### Scenario: Viewing every step finishes the week
- **WHEN** the teacher has opened every step of a week
- **THEN** that week shows the completed mark without any save action

### Requirement: Ikonice spiska tema
The course head MUST show `book-open`. A week whose every step has been viewed MUST show `check-circle`. Any other week MUST show `circle`. An expanded week MUST show `chevron-up`. A collapsed week MUST show `chevron-down`. The completed mark MUST NOT be a grade.

#### Scenario: Open week and a finished week
- **WHEN** one week is expanded and another week has every step viewed
- **THEN** the course head shows `book-open`, the expanded week shows `chevron-up`, the finished week shows `check-circle`, and a week that is not finished shows `circle`

## ADDED Requirements

### Requirement: Traka časa
Directly under the header the site MUST show one lesson toolbar with, from left to right, the week picker, the step picker, and the tabs Gradivo, Diskusija, and Editor. The toolbar MUST stay on screen on every tab. The preface MUST show the week picker and MUST NOT show the step picker or the tabs. On a single-column layout the mobile navigation row MUST take the toolbar's place.

#### Scenario: Single column
- **WHEN** the lecture page is laid out in one column
- **THEN** the lesson toolbar is not shown and the mobile navigation row offers the week and step choice

#### Scenario: Toolbar on a lecture
- **WHEN** a lecture is open on a desktop width
- **THEN** the row under the header shows the week picker, the step picker, and the three tabs in that order

#### Scenario: Toolbar on the preface
- **WHEN** the preface is open
- **THEN** the row under the header shows the week picker and no step picker or tabs

### Requirement: Izbor teme u traci
The week picker MUST show `layers`, Tema {n} – {week title} truncated to one line, and `chevron-down`. Activating it MUST open a list of Uvod and every week in the course document, with the open week marked current. Choosing an entry MUST open it. The list MUST work from the keyboard.

#### Scenario: Pick another week
- **WHEN** week 3 is open and the teacher chooses week 5 in the week picker
- **THEN** week 5 opens on its last open step and the picker reads Tema 5 – that week's title

#### Scenario: Back to the preface
- **WHEN** the teacher chooses Uvod in the week picker
- **THEN** the preface is open

### Requirement: Izbor koraka u traci
The step picker MUST show a previous control with `chevron-left`, Korak {n} od {N} – {step title} truncated to one line, and a next control with `chevron-right`. Previous MUST be disabled on the first step and next on the last. Activating the middle MUST list every step of the open week. Choosing a step MUST keep the open tab.

#### Scenario: Next from the toolbar
- **WHEN** step 3 of 12 is open on Diskusija and the teacher activates next in the toolbar
- **THEN** step 4 is open, the picker reads Korak 4 od 12 and that step's title, and Diskusija stays open

#### Scenario: Edges are disabled
- **WHEN** the first step of a week is open
- **THEN** the toolbar previous control is disabled and next is enabled

## REMOVED Requirements

### Requirement: Klizač tema
**Reason**: The week slider and the previous/next week controls leave the header. The week picker in the lesson toolbar replaces them, and the progress card still shows Tema {n} od {N}.
**Migration**: Choose a week in the toolbar week picker or in the left column.
