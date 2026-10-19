# Spec Delta

## ADDED Requirements

### Requirement: Žut korak u tamnoj temi
In the dark theme, the line that names the current step MUST be yellow (`#ffb000`) and MUST NOT use the muted note color.

#### Scenario: Step is yellow on dark paper
- **WHEN** the dark theme is active and a lecture is open
- **THEN** the step line is `#ffb000` and is not the muted note color

### Requirement: Čitljiv korak u svetloj temi
In the light theme, the line that names the current step MUST contrast with its surface at a ratio of at least 4.5:1 and MUST NOT be `#ffb000`.

#### Scenario: Bright yellow is not the light-theme step
- **WHEN** the light theme is active and a lecture is open
- **THEN** the step line contrasts with its surface at a ratio of at least 4.5:1 and is not `#ffb000`

### Requirement: Dve teme
The lecture site MUST provide a dark theme and a light theme. The dark theme MUST use a dark surface and light text. The light theme MUST use a light surface and dark text. Lecture text, borders, code blocks, and the panel chrome MUST follow the active theme.

#### Scenario: Dark surface
- **WHEN** the dark theme is active
- **THEN** the page surface is dark and the lecture text is light

#### Scenario: Light surface
- **WHEN** the light theme is active
- **THEN** the page surface is light and the lecture text is dark

### Requirement: Podrazumevana tema prati sistem
When no theme is pinned, the site MUST use the dark theme if the browser prefers dark or states no preference, and the light theme if the browser prefers light.

#### Scenario: System asks for dark
- **WHEN** the browser prefers a dark color scheme and no theme is pinned
- **THEN** the dark theme is active

#### Scenario: System asks for light
- **WHEN** the browser prefers a light color scheme and no theme is pinned
- **THEN** the light theme is active

#### Scenario: No system preference
- **WHEN** the browser states no color-scheme preference and no theme is pinned
- **THEN** the dark theme is active

### Requirement: Nastavnik zakuca temu
The site MUST offer a control that pins either theme. A pinned theme MUST apply at once, MUST override the browser preference, and MUST remain after reload.

#### Scenario: Pin overrides the system
- **WHEN** the teacher pins the light theme while the browser prefers dark
- **THEN** the light theme is active without a document reload

#### Scenario: Pin survives reload
- **WHEN** the teacher pins a theme and reloads the page
- **THEN** the pinned theme is still active

### Requirement: Promena teme ne pomera čas
Choosing a theme MUST NOT reload the document and MUST NOT change the open lecture or the current step.

#### Scenario: Step stays put
- **WHEN** the teacher pins the other theme while a lecture step is open
- **THEN** the same lecture and the same step remain open

### Requirement: Beleške ostaju prigušene
In both themes, the phase line, the review line, and status lines MUST use the muted note color, MUST stay distinct from the step line, and MUST contrast with their surface at a ratio of at least 4.5:1.

#### Scenario: Notes are not the step color
- **WHEN** either theme is active and a lecture is open
- **THEN** the phase line and the review line use the muted note color and the step line does not

### Requirement: Cifre ostaju čitljive
Temperature digits MUST contrast with the panel surface at a ratio of at least 3:1 in both themes.

#### Scenario: Digits on a light panel
- **WHEN** the light theme is active
- **THEN** the temperature digits contrast with the panel surface at a ratio of at least 3:1

### Requirement: Bunar grafikona ostaje taman
In both themes the chart well MUST remain a dark surface so the yellow stroke already drawn on it stays visible.

#### Scenario: Chart well in the light theme
- **WHEN** the light theme is active and the chart is shown
- **THEN** the chart well is dark and the yellow stroke on it stays visible
