# Spec Delta

## MODIFIED Requirements

### Requirement: Statičan sajt časa
The lecture site MUST be a static page with no build step. It MUST list the ten lectures and open one at a time. The open lecture MUST show its title. The current step and the embedded panel MUST NOT be on screen together. The site language MUST stay Serbian.

#### Scenario: One lecture is open
- **WHEN** the teacher opens a lecture
- **THEN** that lecture's title and steps are visible, the other lectures stay closed, and the embedded panel is not on screen

## ADDED Requirements

### Requirement: Tri taba
Below the lecture title the site MUST offer Koraci, Diskusija, and Editor. Exactly one of those sections MUST be on screen. The title MUST stay visible on every tab. Opening a lecture MUST show Koraci.

#### Scenario: Discussion replaces the steps
- **WHEN** the teacher opens Diskusija
- **THEN** the discussion is on screen and the steps and the editor are not

#### Scenario: Steps replace the editor
- **WHEN** the teacher opens Koraci while Editor was open
- **THEN** the steps are on screen and the editor and the preview are not

#### Scenario: Search shows the steps
- **WHEN** the teacher searches for a concept while another tab is open
- **THEN** Koraci is the open tab and the first matching concept is open

### Requirement: Editor i pregled
The Editor tab MUST show the file editor on the left and the control-room preview on the right. Those two sides MUST start at equal width. The other lecture sections MUST NOT be on screen.

#### Scenario: Preview sits on the right
- **WHEN** the teacher opens Editor before moving the bar
- **THEN** the editor takes the left half, the preview takes the right half, and the steps and the discussion are not on screen

### Requirement: Traka editora
A vertical bar between the editor and the preview MUST move and MUST change their widths. The pointer and the arrow keys, while the bar has focus, MUST both move it. The bar MUST NOT hide either side.

#### Scenario: Drag changes the ratio
- **WHEN** the teacher drags the vertical bar toward the preview
- **THEN** the editor grows, the preview shrinks, and both stay visible

#### Scenario: Arrow key moves the bar
- **WHEN** the bar has focus and the teacher presses the right arrow key
- **THEN** the preview grows and the editor stays visible

#### Scenario: Narrow page stacks
- **WHEN** the lecture page is laid out in one column and Editor is open
- **THEN** the editor is above the preview and the bar is not shown

### Requirement: Pregled ostaje trenutan
While Editor is closed, the preview MUST keep up with the room. Opening Editor again MUST show the room as it is then.

#### Scenario: Return shows the current room
- **WHEN** the teacher leaves Editor, the room changes, and the teacher opens Editor again
- **THEN** the preview shows the room as it is now
