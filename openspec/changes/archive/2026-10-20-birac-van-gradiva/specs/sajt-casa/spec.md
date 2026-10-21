## MODIFIED Requirements

### Requirement: Statičan sajt časa
The lecture site MUST be a static page with no build step. It MUST read one course document and open one week at a time. The open week MUST show its title. The week count on screen MUST be that document's duration, and the shell MUST NOT hardcode a week count. The Gradivo section and the embedded panel MUST NOT be on screen together. The step selector MAY stay on screen with the panel. The site language MUST stay Serbian.

#### Scenario: One lecture is open
- **WHEN** the teacher opens a week
- **THEN** that week's title and steps are visible, the other weeks stay collapsed, and the embedded panel is not on screen

#### Scenario: Duration is not ten
- **WHEN** the course document sets a duration other than ten and lists that many weeks
- **THEN** the page lists that many weeks and does not add or remove weeks to reach ten

### Requirement: Tri taba
Below the lecture title the site MUST offer Gradivo, Diskusija, and Editor. Exactly one of those sections MUST be on screen. The title and the step selector MUST stay visible on every tab. Opening a lecture MUST show Gradivo.

#### Scenario: Discussion replaces the steps
- **WHEN** the teacher opens Diskusija
- **THEN** the discussion and the step selector are on screen, and the Gradivo section and the editor are not

#### Scenario: Steps replace the editor
- **WHEN** the teacher opens Gradivo while Editor was open
- **THEN** the Gradivo section and the step selector are on screen, and the editor and the preview are not

#### Scenario: Search shows the steps
- **WHEN** the teacher chooses a glossary term while another tab is open
- **THEN** Gradivo is the open tab and the first matching step is open

### Requirement: Editor i pregled
The Editor tab MUST show the file editor on the left and the control-room preview on the right. Those two sides MUST start at equal width. The code surface MUST fill the width from the file tree to the divider. The preview MUST show the text currently in the editor. The Gradivo section and the discussion MUST NOT be on screen. The step selector MUST stay on screen.

#### Scenario: Preview sits on the right
- **WHEN** the teacher opens Editor before moving the bar
- **THEN** the editor takes the left half, the preview takes the right half, the step selector is on screen, and the Gradivo section and the discussion are not

### Requirement: Zaglavlje lekcije
The open lesson MUST show the course breadcrumb, the week title, the week subtitle, and the step selector outside the Gradivo section. It MUST NOT show one button per step. The level, when the document sets one, the minute label, and Sačuvaj korak MUST stay in the Gradivo section and MUST NOT sit inside the selector.

#### Scenario: The selector replaces a button per step
- **WHEN** a week is open on its first step
- **THEN** the selector reads Korak 1 od N, where N is that week's step count, and the lesson does not show N step buttons

#### Scenario: Level comes from the document
- **WHEN** the open step sets a level and Gradivo is open
- **THEN** the Gradivo section shows that level outside the selector

### Requirement: Birač koraka
The selector MUST sit outside the Gradivo section and MUST stay on screen while Gradivo, Diskusija, or Editor is open. It MUST show Korak {n} od {N}, the open step's title, a previous control, Svi koraci, Sledeći, and a progress bar filled by the open step. The filled width MUST be n/N. The number of saved steps MUST NOT set that width. It MUST NOT show one button per step. The previous control MUST show only `chevron-left` and MUST be named Prethodni korak. Sledeći MUST show that word and `chevron-right`, and MUST use the theme ink as its background. Sledeći MUST NOT use the accent background. The temperature control on the panel MUST stay without that background. The page MUST NOT show the sentence Progress indicates completed steps, not just the current position.

#### Scenario: Step title sits under the count
- **WHEN** a step is open
- **THEN** the selector reads Korak {n} od {N} and that step's title, and does not show a button for every step

#### Scenario: Discussion keeps the selector
- **WHEN** the teacher opens Diskusija
- **THEN** the selector stays on screen and still reads the open step

#### Scenario: Editor keeps the selector
- **WHEN** the teacher opens Editor
- **THEN** the selector stays on screen and the page does not show one button per step

#### Scenario: The bar follows the open step
- **WHEN** the open week has 12 steps and the first step is open
- **THEN** the progress bar is filled to 1/12

#### Scenario: Next advances the bar
- **WHEN** the teacher activates Sledeći while Diskusija or Editor is open
- **THEN** the next step of that week opens, the bar fills to the new n/N, and the same tab stays open

#### Scenario: Saved steps do not fill the bar
- **WHEN** the open week has 17 steps, three are saved, and the open step is the first
- **THEN** the filled portion is 1/17

#### Scenario: Next is not yellow
- **WHEN** any theme is active
- **THEN** Sledeći uses the ink background and does not use the accent background

#### Scenario: Temperature control stays plain
- **WHEN** the temperature control is visible on the panel
- **THEN** it does not use the Sledeći background
