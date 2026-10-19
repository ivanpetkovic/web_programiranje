# Spec Delta

## ADDED Requirements

### Requirement: Reset radne verzije
The editor MUST offer a reset button for the open file, separate from the version switch. Activating it MUST replace that file's stored working copy with the built-in original of the open step and MUST show that text. It MUST NOT change the file on disk or any other file's working copy.

#### Scenario: Reset drops the typed draft
- **WHEN** the teacher has typed into a file and activates reset
- **THEN** the editor shows the built-in original of the open step and the stored working copy of that file is that same text

#### Scenario: Another file stays
- **WHEN** the teacher resets one file while another file has a stored working copy
- **THEN** the other working copy is unchanged and the file on disk is unchanged

#### Scenario: Reset while the built-in version is shown
- **WHEN** the built-in version is on screen and the teacher activates reset
- **THEN** the stored working copy becomes the built-in original of the open step

### Requirement: Školjka je sans
In both themes the header, the week list, the lesson title, and the progress card MUST use a sans-serif face.

#### Scenario: Shell face is sans
- **WHEN** either theme is active
- **THEN** the header, the week list, the lesson title, and the progress card use a sans-serif face

### Requirement: Svetla školjka
The light theme MUST use a near-white page, white cards, and a dark navy lesson title.

#### Scenario: Light surfaces
- **WHEN** the light theme is active and a step is open on Gradivo
- **THEN** the page is near-white, the lesson card is white, and the lesson title is dark navy

### Requirement: Tamna školjka
The dark theme MUST use a near-black page, a card darker than the lesson title, and a light lesson title.

#### Scenario: Dark surfaces
- **WHEN** the dark theme is active and a step is open on Gradivo
- **THEN** the page is near-black, the lesson card is darker than the lesson title, and the lesson title is light

### Requirement: Isto zlato u obe teme
The course title, the current step control, the progress fill, and the selected quiz border MUST use the same gold accent in both themes.

#### Scenario: Gold stays in both themes
- **WHEN** the teacher pins the other theme while a step is open
- **THEN** the course title, the current step control, the progress fill, and the selected quiz border use that same gold accent

### Requirement: Pitalica u dva stupca
On a wide lesson the short quiz MUST lay its options out in two columns. In the single-column layout the options MUST be in one column.

#### Scenario: Quiz uses two columns
- **WHEN** a short quiz is open and the lesson is wider than the single-column layout
- **THEN** the options are in two columns

#### Scenario: Narrow quiz stacks
- **WHEN** the lecture page is laid out in one column and a short quiz is open
- **THEN** the options are in one column

## MODIFIED Requirements

### Requirement: Nastavnik zakuca temu
The site MUST offer one button in the header that pins the other theme. The button's accessible name MUST name the theme the click will pin. A pinned theme MUST apply at once, MUST override the browser preference, and MUST remain after reload.

#### Scenario: Pin overrides the system
- **WHEN** the teacher pins the light theme while the browser prefers dark
- **THEN** the light theme is active without a document reload

#### Scenario: Pin survives reload
- **WHEN** the teacher pins a theme and reloads the page
- **THEN** the pinned theme is still active

#### Scenario: The button toggles
- **WHEN** the dark theme is active and the teacher activates the theme button
- **THEN** the light theme is pinned and the button's accessible name names the dark theme

### Requirement: Prekidač verzije
A button beside the file path, different from reset, MUST switch between the working copy and the built-in original of the open step, and MUST NOT delete the working copy. The button MUST show a pencil while the working copy is on screen and a page while the built-in original is on screen. Its accessible name MUST say radna verzija or ugrađena verzija, for the view the click will show.

#### Scenario: Toggle shows the original
- **WHEN** the teacher activates the version control while the working copy is on screen
- **THEN** the editor shows the original of the open step and the working copy remains stored

#### Scenario: Toggle returns to the typed code
- **WHEN** the teacher activates the version control while the original is on screen
- **THEN** the editor shows the same stored working copy
