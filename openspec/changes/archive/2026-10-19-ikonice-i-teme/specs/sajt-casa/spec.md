# Spec Delta

## REMOVED Requirements

### Requirement: Dve teme
**Reason**: The mocks define four palettes, so a dark theme and a light theme no longer cover the site.
**Migration**: Use Četiri teme. A stored pin `tamna` opens ugalj, and a stored pin `svetla` opens pesak.

## ADDED Requirements

### Requirement: Četiri teme
The lecture site MUST provide mornar, ugalj, pesak, and terakota. Mornar and ugalj MUST use a dark surface and light text. Pesak and terakota MUST use a light surface and dark text. Lecture text, borders, code blocks, and the panel chrome MUST follow the active theme.

#### Scenario: Navy surface
- **WHEN** mornar is active
- **THEN** the page surface is dark navy and the lecture text is light

#### Scenario: Charcoal surface
- **WHEN** ugalj is active
- **THEN** the page surface is near black and the lecture text is light

#### Scenario: Sand surface
- **WHEN** pesak is active
- **THEN** the page surface is light and the lecture text is dark

#### Scenario: Terracotta surface
- **WHEN** terakota is active
- **THEN** the page surface is warm and light and the lecture text is dark

### Requirement: Ikonica nasleđuje boju
A shell icon MUST be the same-named SVG from the currentColor set and MUST paint with `currentColor`. The site MUST NOT show a shell icon from a PNG set.

#### Scenario: Accent icon follows the pin
- **WHEN** the teacher pins another theme
- **THEN** a shell icon painted in the accent color uses that theme's accent and no PNG icon is shown

### Requirement: Ikonice zaglavlja
Search MUST show `search`. Previous week MUST show `chevron-left`. Next week MUST show `chevron-right`. The header save control MUST show `bookmark`. Help MUST show `help-circle`. The initials MUST stay the letters from the course document. The mark MUST stay the course document mark.

#### Scenario: Header icons
- **WHEN** a lecture is open
- **THEN** search, the week controls, header save, and help show those icons, and the initials and the mark are unchanged

### Requirement: Ikonice spiska nedelja
The course head MUST show `book-open`. A week whose every step is saved MUST show `check-circle`. Any other week MUST show `circle`. An expanded week MUST show `chevron-up`. A collapsed week MUST show `chevron-down`. The completed mark MUST NOT be a grade.

#### Scenario: Open week and a finished week
- **WHEN** one week is expanded and another week has every step saved
- **THEN** the course head shows `book-open`, the expanded week shows `chevron-up`, the finished week shows `check-circle`, and a week that is not finished shows `circle`

### Requirement: Ikonice kartice
The progress card MUST show `calendar-days` beside the week label, `book-open` beside the step count, and `clock` beside the minute budget. Those three labels MUST stay.

#### Scenario: Card icons sit beside the labels
- **WHEN** a week with a minute budget is open
- **THEN** the card shows those three icons beside Nedelja {n} od {N}, the step count, and the minute budget

### Requirement: Ikonice tabova
Gradivo MUST show `file-text` and the word Gradivo. Diskusija MUST show `messages-square` and the word Diskusija. Editor MUST show `code-xml` and the word Editor.

#### Scenario: Tab labels stay
- **WHEN** a lecture is open
- **THEN** the three tabs show those icons and those words

### Requirement: Ikonice trake koraka
When the step sets a level, the step bar MUST show `chart-column` beside that level. The minute label MUST show `clock`. Sačuvaj korak MUST show `bookmark` and the words Sačuvaj korak.

#### Scenario: Bar icons
- **WHEN** the open step sets a level and a minute label
- **THEN** the bar shows `chart-column`, `clock`, and `bookmark` with the words Sačuvaj korak

### Requirement: Ikonice isečka
The key-idea callout MUST show `lightbulb`. The snippet title MUST show `folder`. The copy control MUST show `copy` and the word Kopiraj. The file path MUST show `file-text` and the path text.

#### Scenario: Snippet chrome
- **WHEN** the teacher opens a step on Gradivo
- **THEN** the callout, the snippet title, the copy control, and the file path show those icons and the words Kopiraj and Ključna ideja stay

### Requirement: Ikonice pitanja
The question label MUST show `question`. Before the explanation, the chosen option MUST show `circle-dot`, every other option MUST show `circle`, and no option MUST show `check-circle`. After the explanation is open, the correct option MUST show `check-circle`.

#### Scenario: Choice is not yet a check
- **WHEN** the teacher chooses an option and the explanation is still closed
- **THEN** that option shows `circle-dot`, the others show `circle`, and no option shows `check-circle`

#### Scenario: Correct option after the explanation
- **WHEN** the teacher opens the explanation
- **THEN** the correct option shows `check-circle`

### Requirement: Ikonice stabla
A directory in the editor tree MUST show `folder`. A file in the editor tree MUST show `file-text`.

#### Scenario: Tree icons
- **WHEN** the teacher opens Editor and the tree lists a directory and a file
- **THEN** the directory shows `folder` and the file shows `file-text`

### Requirement: Panel bez ikonica školjke
The switch, the temperature control, and the other controls on the panel MUST NOT show a shell icon.

#### Scenario: Panel controls stay plain
- **WHEN** the panel is visible
- **THEN** its controls show their words and no shell icon

## MODIFIED Requirements

### Requirement: Žut korak u tamnoj temi
In mornar and ugalj, the line that names the current step MUST be yellow (`#ffb000`) and MUST NOT use the muted note color.

#### Scenario: Step is yellow on dark paper
- **WHEN** mornar or ugalj is active and a lecture is open
- **THEN** the step line is `#ffb000` and is not the muted note color

### Requirement: Čitljiv korak u svetloj temi
In pesak and terakota, the line that names the current step MUST contrast with its surface at a ratio of at least 4.5:1 and MUST NOT be `#ffb000`.

#### Scenario: Bright yellow is not the light-theme step
- **WHEN** pesak or terakota is active and a lecture is open
- **THEN** the step line contrasts with its surface at a ratio of at least 4.5:1 and is not `#ffb000`

### Requirement: Podrazumevana tema prati sistem
When no theme is pinned, the site MUST use ugalj if the browser prefers dark or states no preference, and pesak if the browser prefers light.

#### Scenario: System asks for dark
- **WHEN** the browser prefers a dark color scheme and no theme is pinned
- **THEN** ugalj is active

#### Scenario: System asks for light
- **WHEN** the browser prefers a light color scheme and no theme is pinned
- **THEN** pesak is active

#### Scenario: No system preference
- **WHEN** the browser states no color-scheme preference and no theme is pinned
- **THEN** ugalj is active

### Requirement: Nastavnik zakuca temu
The site MUST offer a control that lists mornar, ugalj, pesak, and terakota and pins the chosen one. A pinned theme MUST apply at once, MUST override the browser preference, and MUST remain after reload. A stored pin `tamna` MUST open ugalj. A stored pin `svetla` MUST open pesak.

#### Scenario: Pin overrides the system
- **WHEN** the teacher pins pesak while the browser prefers dark
- **THEN** pesak is active without a document reload

#### Scenario: Pin survives reload
- **WHEN** the teacher pins a theme and reloads the page
- **THEN** the pinned theme is still active

#### Scenario: Old pins still open
- **WHEN** the stored pin is `tamna` or `svetla` and the page loads
- **THEN** `tamna` opens ugalj and `svetla` opens pesak

### Requirement: Promena teme ne pomera čas
Choosing a theme MUST NOT reload the document and MUST NOT change the open lecture or the current step.

#### Scenario: Step stays put
- **WHEN** the teacher pins another theme while a lecture step is open
- **THEN** the same lecture and the same step remain open

### Requirement: Beleške ostaju prigušene
In every theme, the phase line, the review line, and status lines MUST use the muted note color, MUST stay distinct from the step line, and MUST contrast with their surface at a ratio of at least 4.5:1.

#### Scenario: Notes are not the step color
- **WHEN** any theme is active and a lecture is open
- **THEN** the phase line and the review line use the muted note color and the step line does not

### Requirement: Cifre ostaju čitljive
Temperature digits MUST contrast with the panel surface at a ratio of at least 3:1 in every theme.

#### Scenario: Digits on a light panel
- **WHEN** pesak or terakota is active
- **THEN** the temperature digits contrast with the panel surface at a ratio of at least 3:1

### Requirement: Bunar grafikona ostaje taman
In every theme the chart well MUST remain a dark surface so the yellow stroke already drawn on it stays visible.

#### Scenario: Chart well in the light theme
- **WHEN** pesak or terakota is active and the chart is shown
- **THEN** the chart well is dark and the yellow stroke on it stays visible

### Requirement: Školjka prati aktivnu temu
The week list, the lesson, the key-idea callout, the snippet, and the progress card MUST follow the active theme. Gold MUST remain the accent in mornar and ugalj. Pesak and terakota MUST use their own accent.

#### Scenario: Regions follow the pinned theme
- **WHEN** the teacher pins another theme
- **THEN** the week list, the lesson, and the progress card use that theme and the open step stays put

#### Scenario: Both themes keep the shell
- **WHEN** any of the four themes is active
- **THEN** the week list, the lesson, and the progress card are all visible

#### Scenario: Gold stays on the dark themes
- **WHEN** mornar or ugalj is active
- **THEN** the accent is `#ffb000`

#### Scenario: Light themes keep their accent
- **WHEN** pesak or terakota is active
- **THEN** the accent is not `#ffb000`

### Requirement: Žuti hod koraka
On Gradivo, the previous-step and next-step controls MUST sit with the step line. In mornar and ugalj each MUST have a yellow background `#ffb000` and dark text. In pesak and terakota each MUST have that theme's accent as its background and text that contrasts with that background at a ratio of at least 4.5:1. The previous control MUST show `chevron-left`. The next control MUST show `chevron-right`. The temperature control on the panel MUST stay without that background.

#### Scenario: Step controls are yellow
- **WHEN** mornar or ugalj is active and a step is open on Gradivo
- **THEN** the previous-step and next-step controls have a `#ffb000` background, dark text, `chevron-left`, and `chevron-right`

#### Scenario: Step controls follow the accent
- **WHEN** a step is open on Gradivo
- **THEN** the previous-step and next-step controls use the active theme's accent background, readable text, `chevron-left`, and `chevron-right`

#### Scenario: Gold walk on dark themes
- **WHEN** mornar or ugalj is active and a step is open on Gradivo
- **THEN** those controls have a `#ffb000` background and dark text

#### Scenario: Temperature control stays plain
- **WHEN** the temperature control is visible on the panel
- **THEN** it does not use the step-control background
