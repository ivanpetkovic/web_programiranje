# sajt-casa Specification

## Purpose

Sajt časa je statičan tok u kome nastavnik vodi nedelju pored panela, otvara fajlove iz `client/` i `server/`, i vidi kako sačuvana izmena menja panel ili sledeći zahtev.

## Requirements

### Requirement: Statičan sajt časa
The lecture site MUST be a static page with no build step. It MUST read one course document and open one week at a time. The open week MUST show its title. The week count on screen MUST be that document's duration, and the shell MUST NOT hardcode a week count. The current step and the embedded panel MUST NOT be on screen together. The site language MUST stay Serbian.

#### Scenario: One lecture is open
- **WHEN** the teacher opens a week
- **THEN** that week's title and steps are visible, the other weeks stay collapsed, and the embedded panel is not on screen

#### Scenario: Duration is not ten
- **WHEN** the course document sets a duration other than ten and lists that many weeks
- **THEN** the page lists that many weeks and does not add or remove weeks to reach ten

### Requirement: Korak na sajtu
Each step MUST show, in order, the step prose, the key-idea callout, the code snippet, and a short quiz with unmarked answers. The next step MUST treat that step's file fragment as already typed. The site MUST show the file path of the fragment.

#### Scenario: Callout comes before the quiz
- **WHEN** the teacher opens a step
- **THEN** the prose, the key idea, and the snippet are visible before the quiz, and no quiz answer is marked

#### Scenario: Step adds a fragment
- **WHEN** the teacher finishes a step that adds a fragment
- **THEN** the named file contains that fragment and the following step shows it as already present

#### Scenario: Short quiz stays closed
- **WHEN** the short quiz is first shown
- **THEN** no answer is marked correct until the teacher reveals the explanation

### Requirement: Dva stabla
The editor MUST offer a Front tab for `client/` and a Back tab for `server/`. Each tab MUST show that side's file tree, the open file's path, Save, Restore, and a place for an error. Prepared copies MUST stay out of the tree. The front files MUST include `client/index.html`, `client/css/soba.css`, `client/js/korak.js`, `client/js/niz.js`, `client/js/displej.js`, and `client/js/prekidac.js`.

#### Scenario: Tabs stay on their own files
- **WHEN** the teacher switches between Front and Back
- **THEN** each tab shows only the files of that side

#### Scenario: HTML is a file
- **WHEN** the teacher opens the document step
- **THEN** the editor can open `client/index.html` as the file being retyped

#### Scenario: Front tree lists the course files
- **WHEN** the teacher opens the Front tab
- **THEN** the tree includes `client/index.html`, `client/css/soba.css`, `client/js/korak.js`, `client/js/niz.js`, `client/js/displej.js`, and `client/js/prekidac.js`

### Requirement: Čuvanje i greška fronta
Saving MUST write the open file. A front change to style, state, or drawing MUST update the embedded panel without reloading the page. If the front file throws, the panel MUST keep the last valid drawing and the editor MUST say that the fragment was not applied. A server error MUST use a different sentence from a front error.

#### Scenario: Bad front file
- **WHEN** the teacher saves a front file that throws
- **THEN** the previous number remains on the panel and the editor shows that the fragment was not applied

#### Scenario: Style changes the blades
- **WHEN** the fan already exists and the teacher changes the blade duration, direction, or angle
- **THEN** the machine room shows that change without a page reload

### Requirement: Server se ne izvršava u browseru
The site MUST NOT execute a server file in the browser. The `server/` tree MUST be the source of a local Node process that speaks HTTP/1.1 without a web framework.

#### Scenario: Back tab does not run the handler
- **WHEN** the teacher opens a file under `server/` in the editor
- **THEN** the browser does not run that file as the room handler

### Requirement: Šta važi posle čuvanja
After Save, the next request MUST load `server/soba.js`, `server/ventilator.js`, or `server/sesija.js`. `server/server.js`, `server/stanje.js`, and `server/baza.js` MUST be read when the process starts. If the process is not up, the panel MUST say so beside the editor and the network record MUST have no successful status for that request.

#### Scenario: Saved room module
- **WHEN** the teacher saves `server/soba.js` and the browser sends the next room read
- **THEN** that read uses the saved source

#### Scenario: Startup file
- **WHEN** the teacher saves `server/server.js` without restarting the process
- **THEN** the running process does not yet use that source

### Requirement: Panel prati čas
Before the server lecture, the panel MUST NOT send a room read or a command. The network panel MAY still show the document and the stylesheet. The next-step control MUST exist only while the temperature simulation lives in the browser, MUST increase the temperature by a delta, and MUST ignore the switch. From the server lecture on, that control MUST NOT be the source of the reading.

#### Scenario: Early lecture has no room request
- **WHEN** the teacher is on a lecture before the server
- **THEN** the network record has no room-read or command request

### Requirement: Rad van toka
The files the editor opens MUST be runnable outside the lecture flow: the front by itself, and from the server lecture onward the front together with the Node process. The same files MUST be what the teacher retypes in VS Code.

#### Scenario: Front runs alone
- **WHEN** the teacher opens `client/index.html` outside the lecture site before the server lecture
- **THEN** the switch room is visible without a Node process

### Requirement: Tastatura i smanjeno pokretanje
Focus MUST be visible. A concept and a quiz option MUST work from the keyboard. Reduced motion MUST leave the blades in a position that still shows the mode, without endless rotation. A form on the panel MUST NOT reload the document.

#### Scenario: Reduced motion
- **WHEN** the browser asks for reduced motion and the remote mode is on
- **THEN** the blades show the on position and do not rotate endlessly

### Requirement: Osvrt
The review block MUST be a folded list of the survey topics for that lecture. Opening it MUST NOT open the editor and MUST NOT send a request.

#### Scenario: Review stays folded
- **WHEN** the teacher opens the review list
- **THEN** the editor stays as it was and no room request is sent

### Requirement: Pojam se otvara i sklapa
A glossary headword that occurs as a whole phrase in the lesson text MUST be underlined with a dashed line. Pointing at it, focusing it, or activating it MUST show a tooltip with the same glossary fields the typeahead shows. Activating that term again MUST hide the tooltip.

#### Scenario: Dashed term shows the glossary
- **WHEN** the teacher points at, focuses, or activates a dashed term
- **THEN** the tooltip shows the same fields as the typeahead result for that term

#### Scenario: Second click collapses
- **WHEN** the teacher activates a term whose tooltip is open
- **THEN** the tooltip is hidden

### Requirement: Više pojmova ostaje otvoreno
Several glossary terms in the same lesson MUST stay dashed at the same time. Only one tooltip MUST be open.

#### Scenario: Two concepts stay open
- **WHEN** the teacher opens the tooltip of one dashed term and then opens another
- **THEN** both terms stay dashed and only the second tooltip is visible

### Requirement: Pretraga pojmova
Search MUST be a typeahead over the course glossary. Each result MUST show the same fields as that term's tooltip. Choosing a term MUST show its definition and MUST open every lesson in which the glossary headword occurs as a whole phrase. The search MUST NOT hide the lesson behind a filter of the open week.

#### Scenario: Search opens the first hit
- **WHEN** the teacher chooses a glossary term from the typeahead
- **THEN** the definition is visible and the first lesson where that term occurs is the open step

#### Scenario: Typeahead matches the tooltip
- **WHEN** the teacher types the start of a glossary term
- **THEN** the list shows that term with the same fields the tooltip shows for it

#### Scenario: Choice opens every lesson
- **WHEN** the teacher chooses a term that occurs in more than one lesson
- **THEN** the definition is visible, every week that contains the term is expanded, and the first matching step is the open lesson

#### Scenario: Term with no lesson
- **WHEN** the teacher chooses a glossary term that occurs in no lesson
- **THEN** the definition is visible and no week is expanded for that term

### Requirement: Ponovi pitanje
A repeat-question action MUST clear the mark and the reasons and MUST return that quiz to unmarked answers.

#### Scenario: Marks disappear
- **WHEN** the teacher repeats a quiz whose explanation is open
- **THEN** no answer is marked and the reasons are hidden

### Requirement: Preduslov i ishod
Before its question, the open lecture MUST show its prerequisite and its outcome.

#### Scenario: Outcome is visible first
- **WHEN** the teacher opens a lecture
- **THEN** the prerequisite and the outcome are visible before the quiz

### Requirement: Sintaksna greška ne zamenjuje izvor
A syntax error in a server file MUST remain in the editor and MUST NOT replace the saved source. The next request MUST still use the previous source.

#### Scenario: Bad server file is kept out
- **WHEN** the teacher saves a server file that has a syntax error
- **THEN** the editor shows the error and a following request still uses the previous source

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

### Requirement: Tri taba
Below the lecture title the site MUST offer Koraci, Diskusija, and Editor. Exactly one of those sections MUST be on screen. The title MUST stay visible on every tab. Opening a lecture MUST show Koraci.

#### Scenario: Discussion replaces the steps
- **WHEN** the teacher opens Diskusija
- **THEN** the discussion is on screen and the steps and the editor are not

#### Scenario: Steps replace the editor
- **WHEN** the teacher opens Koraci while Editor was open
- **THEN** the steps are on screen and the editor and the preview are not

#### Scenario: Search shows the steps
- **WHEN** the teacher chooses a glossary term while another tab is open
- **THEN** Koraci is the open tab and the first matching step is open

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

### Requirement: Zaglavlje školjke
The header MUST show the institution, its mark, and the course title from the course document, plus term search, the week slider, previous week, next week, save-step, help, the initials from the document, and the control that pins the theme. The site title MUST NOT be Kontrolna soba.

#### Scenario: Shipped title
- **WHEN** the shipped course is open
- **THEN** the header title is Web Programming and the site title is not Kontrolna soba

#### Scenario: Next week
- **WHEN** the teacher activates next week and a later week exists
- **THEN** that later week opens

### Requirement: Klizač nedelja
The header MUST show Nedelja {n} od {N}, where N is the course duration and n is the open week. The slider MUST have one position per week. Only the current position MUST print its week number. The page MUST NOT show a row of the numbers 1 through N.

#### Scenario: Only the current number is printed
- **WHEN** week 10 of a course whose duration is 15 is open
- **THEN** the header reads Nedelja 10 od 15, the slider has 15 positions, and the only week number printed on the slider is 10

#### Scenario: Slider opens a week
- **WHEN** the teacher chooses another position on the slider
- **THEN** that week opens

### Requirement: Sklopivi spisak nedelja
The left column MUST list every week in the course document. A week MUST show its number, title, and subtitle, and MUST collapse and expand. The open week MUST be expanded and MUST list the same steps as the lesson. Choosing a step MUST open it. A week whose every step is saved MUST show a completed mark, and that mark MUST NOT be a grade.

#### Scenario: Other weeks stay collapsed
- **WHEN** the teacher opens one week
- **THEN** that week lists its steps and every other week shows its title and subtitle without its steps

#### Scenario: Step in the list
- **WHEN** the teacher chooses a step in the expanded week
- **THEN** that step is the open lesson

### Requirement: Zaglavlje lekcije
The open lesson MUST show the course breadcrumb, the week title, the week subtitle, one step control per step, and the step bar. The step bar MUST show the step index, the level when the document sets one, the minute label, and the save-step control.

#### Scenario: Step controls match the week
- **WHEN** a week with 11 steps is open on the first step
- **THEN** eleven step controls are shown, the first is current, and the bar reads Korak 1 od 11

#### Scenario: Level comes from the document
- **WHEN** the open step sets a level
- **THEN** the step bar shows that level

### Requirement: Ključna ideja i isečak
On Koraci, the key-idea callout MUST be labeled Ključna ideja and MUST be visible without a further click. The code snippet MUST show its title, line numbers, and a control that copies the snippet text.

#### Scenario: Callout is already visible
- **WHEN** the teacher opens a step on Koraci
- **THEN** the callout is visible and its label is Ključna ideja

#### Scenario: Copy copies the snippet
- **WHEN** the teacher uses the snippet copy control
- **THEN** the clipboard receives the snippet text

### Requirement: Kartica napretka
The progress card MUST show Nedelja {n} od {N}, the percentage n/N rounded to the nearest whole number, the open week's step count, and that week's minute budget as a label. The budget MUST NOT count down.

#### Scenario: Share follows the duration
- **WHEN** week 10 of a course whose duration is 15 is open
- **THEN** the card shows Nedelja 10 od 15 and 67 percent

#### Scenario: Budget is a label
- **WHEN** the open week declares a minute budget
- **THEN** the card shows that budget and does not count it down

### Requirement: Školjka prati aktivnu temu
The week list, the lesson, the key-idea callout, the snippet, and the progress card MUST follow the active theme. Pinning a theme, the unpinned default, and the step-line colors MUST stay as they are. Gold MUST remain the accent in both themes.

#### Scenario: Regions follow the pinned theme
- **WHEN** the teacher pins the other theme
- **THEN** the week list, the lesson, and the progress card use that theme and the open step stays put

#### Scenario: Both themes keep the shell
- **WHEN** either theme is active
- **THEN** the week list, the lesson, and the progress card are all visible

### Requirement: Prečica pretrage
Command+K and Ctrl+K MUST focus the term search.

#### Scenario: Shortcut focuses search
- **WHEN** the teacher presses Command+K or Ctrl+K
- **THEN** the term search is focused

### Requirement: Pomoć školjke
Help MUST open a short explanation of the dashed underline, the typeahead, and the three tabs. It MUST NOT open the editor and MUST NOT send a room request.

#### Scenario: Help stays on the page
- **WHEN** the teacher opens help
- **THEN** that explanation is visible, the editor stays as it was, and no room request is sent

### Requirement: Sačuvan korak
The header save control and Sačuvaj korak MUST record the current step in this browser. Loading the page again MUST restore that week and step. The record MUST NOT be a grade and MUST NOT be sent to the server.

#### Scenario: Reload restores the step
- **WHEN** the teacher saves a step and loads the page again
- **THEN** that week and that step are open

### Requirement: Pitanje i primer u pretrazi
The search placeholder MUST be Nađi pojam, pitanje ili primer koda... Choosing a quiz question or a code snippet from the typeahead MUST open the step that contains it.

#### Scenario: Question opens its step
- **WHEN** the teacher chooses a quiz question from the typeahead
- **THEN** the step that asks that question becomes the open lesson on Koraci
