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

### Requirement: Dva stabla
The editor MUST offer a Klijent tab for `client/` and a Server tab for `server/`. The Server tab MUST be absent during weeks 1, 2, and 3, and MUST be present from week 4. Each visible tab MUST show that side's file tree as introduced by a step at or before the open step, the open file's path, and a place for an error. A file MUST appear when such a step first names it and MUST remain on later steps. Prepared copies MUST stay out of the tree.

#### Scenario: Tabs stay on their own files
- **WHEN** the teacher switches between Klijent and Server in week 4 or later
- **THEN** each tab shows only the files of that side introduced at or before the open step

#### Scenario: Server tab waits for week 4
- **WHEN** week 1, 2, or 3 is open on Editor
- **THEN** the Server tab is absent and the tree shows only `client/`

#### Scenario: HTML is a file
- **WHEN** the teacher opens the document step
- **THEN** the editor can open `client/index.html` as the file being retyped

#### Scenario: Front tree lists the course files
- **WHEN** the teacher opens the Klijent tab at the end of week 3
- **THEN** the tree includes `client/index.html`, `client/css/soba.css`, `client/js/korak.js`, `client/js/niz.js`, `client/js/displej.js`, and `client/js/prekidac.js`, and does not include a server file

#### Scenario: Podela lists only the sketch
- **WHEN** the teacher opens Podela on Klijent
- **THEN** the tree lists only `client/index.html`

#### Scenario: Tree grows with the open step
- **WHEN** the teacher opens Objekat
- **THEN** the Klijent tree includes `client/js/korak.js` and does not yet include `client/js/niz.js`

### Requirement: Čuvanje i greška fronta
The text shown in the editor for a Klijent file MUST update the embedded panel without writing that file to disk and without reloading the page. If that text throws, the panel MUST keep the last valid drawing and the editor MUST say that the fragment was not applied. A server error MUST use a different sentence from a front error.

#### Scenario: Bad front file
- **WHEN** the text shown for a Klijent file throws
- **THEN** the previous number remains on the panel and the editor shows that the fragment was not applied

#### Scenario: Style changes the blades
- **WHEN** the fan already exists and the shown stylesheet changes the blade duration, direction, or angle
- **THEN** the machine room shows that change without a page reload

### Requirement: Server se ne izvršava u browseru
The site MUST NOT execute a server file in the browser. The `server/` tree on disk MUST remain the source of a local Node process that speaks HTTP/1.1 without a web framework.

#### Scenario: Back tab does not run the handler
- **WHEN** the teacher opens a file under `server/` in the editor
- **THEN** the browser does not run that file as the room handler

### Requirement: Šta važi posle čuvanja
The running process MUST keep reading `server/soba.js`, `server/ventilator.js`, and `server/sesija.js` from disk, and `server/server.js`, `server/stanje.js`, and `server/baza.js` when the process starts. Text in the editor MUST NOT replace that source. If the process is not up, the panel MUST say so beside the editor and the network record MUST have no successful status for that request.

#### Scenario: Saved room module
- **WHEN** the teacher changes `server/soba.js` in the editor and the browser sends the next room read
- **THEN** that read still uses the file on disk

#### Scenario: Startup file
- **WHEN** the teacher changes `server/server.js` in the editor without restarting the process
- **THEN** the running process does not use that editor text

### Requirement: Panel prati čas
Before the server lecture, the panel MUST NOT send a room read or a command. The network panel MAY still show the document and the stylesheet. The next-step control MUST exist only while the temperature simulation lives in the browser, MUST increase the temperature by a delta, and MUST ignore the switch. From the server lecture on, that control MUST NOT be the source of the reading.

#### Scenario: Early lecture has no room request
- **WHEN** the teacher is on a lecture before the server
- **THEN** the network record has no room-read or command request

### Requirement: Rad van toka
The files on disk MUST stay runnable outside the lecture flow: the front by itself, and from the server lecture onward the front together with the Node process. The same files on disk MUST be what the teacher retypes in VS Code. The editor MUST show the step original or the local working copy, and typing there MUST NOT change the files on disk.

#### Scenario: Front runs alone
- **WHEN** the teacher opens `client/index.html` from disk outside the lecture site before the server lecture
- **THEN** the switch room is visible without a Node process

#### Scenario: Typing stays in the browser
- **WHEN** the teacher edits a file in the editor
- **THEN** the file on disk is unchanged

### Requirement: Tastatura i smanjeno pokretanje
Focus MUST be visible. A concept and a quiz option MUST work from the keyboard. Reduced motion MUST leave the blades in a position that still shows the mode, without endless rotation. A form on the panel MUST NOT reload the document.

#### Scenario: Reduced motion
- **WHEN** the browser asks for reduced motion and the remote mode is on
- **THEN** the blades show the on position and do not rotate endlessly

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
A syntax error in a server file in the editor MUST remain in the working copy and MUST NOT replace the file on disk. The next request MUST still use the file on disk.

#### Scenario: Bad server file is kept out
- **WHEN** the teacher introduces a syntax error in a server file in the editor
- **THEN** the editor keeps that text and a following request still uses the file on disk

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

### Requirement: Tri taba
Below the lecture title the site MUST offer Gradivo, Diskusija, and Editor. Exactly one of those sections MUST be on screen. The title MUST stay visible on every tab. Opening a lecture MUST show Gradivo.

#### Scenario: Discussion replaces the steps
- **WHEN** the teacher opens Diskusija
- **THEN** the discussion is on screen and the steps and the editor are not

#### Scenario: Steps replace the editor
- **WHEN** the teacher opens Gradivo while Editor was open
- **THEN** the steps are on screen and the editor and the preview are not

#### Scenario: Search shows the steps
- **WHEN** the teacher chooses a glossary term while another tab is open
- **THEN** Gradivo is the open tab and the first matching step is open

### Requirement: Editor i pregled
The Editor tab MUST show the file editor on the left and the control-room preview on the right. Those two sides MUST start at equal width. The code surface MUST fill the width from the file tree to the divider. The preview MUST show the text currently in the editor. The other lecture sections MUST NOT be on screen.

#### Scenario: Preview sits on the right
- **WHEN** the teacher opens Editor before moving the bar
- **THEN** the editor takes the left half, the preview takes the right half, and the steps and the discussion are not on screen

#### Scenario: Code fills its column
- **WHEN** the teacher opens a file in the editor
- **THEN** the code surface reaches from the file tree to the divider

#### Scenario: Preview follows the editor
- **WHEN** the text in the editor changes
- **THEN** the preview shows that text

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
Opening Editor MUST show the preview of the text then in the editor, including a working copy stored in this browser.

#### Scenario: Return shows the current room
- **WHEN** the teacher leaves Editor and opens Editor again
- **THEN** the preview shows the text then in the editor

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
On Gradivo, the key-idea callout MUST be labeled Ključna ideja and MUST be visible without a further click. When the step has a code snippet, that snippet MUST show its title, line numbers, and a control that copies the snippet text.

#### Scenario: Callout is already visible
- **WHEN** the teacher opens a step on Gradivo
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

### Requirement: Prečica pretrage
Command+K and Ctrl+K MUST focus the term search.

#### Scenario: Shortcut focuses search
- **WHEN** the teacher presses Command+K or Ctrl+K
- **THEN** the term search is focused

### Requirement: Pomoć školjke
Help MUST open a short explanation of the dashed underline, the typeahead, and the three tabs Gradivo, Diskusija, and Editor. It MUST NOT open the editor and MUST NOT send a room request.

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
- **THEN** the step that asks that question becomes the open lesson on Gradivo

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

### Requirement: Original koraka u editoru
The editor MUST be able to show the built-in original of the open step for the open file. That text MUST be the snapshot of that path at the open step, and MUST NOT be replaced by the finished file on disk when the snapshot has text. That view MUST be read-only and MUST show line numbers and syntax coloring.

#### Scenario: Original is read-only
- **WHEN** the teacher shows the original of the open step
- **THEN** the snapshot for that step is on screen and cannot be edited

#### Scenario: Snapshot beats the disk file
- **WHEN** the teacher shows the built-in version of `client/js/korak.js` on Objekat
- **THEN** the text is that step's snapshot and is not the finished `client/js/korak.js` on disk

### Requirement: Razlika prema prethodnom originalu
The original view MUST mark lines added since the snapshot of the same path at the immediately previous course step in green, and lines removed since that snapshot in red. The comparison MUST ignore the working copy. When that path has no snapshot at the previous step, the original MUST have no red lines and every line MUST be green. When the two snapshots are the same text, the original MUST have no green lines and no red lines.

#### Scenario: Diff uses the previous original
- **WHEN** the teacher shows the original of Broj
- **THEN** green lines are lines added since the snapshot of `client/index.html` on the immediately previous course step, and red lines are lines removed since that snapshot

#### Scenario: First original is all added
- **WHEN** the teacher shows the original of the first step that has that file
- **THEN** every line is green and no line is red

#### Scenario: Working copy is not the baseline
- **WHEN** a working copy of the file exists and the teacher shows the original
- **THEN** the green and red lines still compare the two snapshots

#### Scenario: Unchanged snapshot has no color
- **WHEN** the teacher shows the built-in version of a file the open step did not change
- **THEN** that view has no green lines and no red lines

### Requirement: Radna verzija fajla
The editor MUST keep one working copy per file in this browser's localStorage, shared across steps, and MUST restore it after reload. Changing the step MUST leave that file's working copy on screen when one exists. Until the teacher edits a file, the editor MUST show that step's original. The working copy MUST show line numbers and syntax coloring, and MUST NOT use the original's green and red lines.

#### Scenario: Step change keeps the typed code
- **WHEN** the teacher edits a file and opens another step of that file
- **THEN** the editor still shows the typed working copy

#### Scenario: Reload keeps the working copy
- **WHEN** the teacher edits a file and loads the page again
- **THEN** that file's working copy is still available

### Requirement: Prekidač verzije
A button beside the file path, different from reset, MUST switch between the working copy and the built-in original of the open step, and MUST NOT delete the working copy. The button MUST show a pencil while the working copy is on screen and a page while the built-in original is on screen. Its accessible name MUST say radna verzija or ugrađena verzija, for the view the click will show.

#### Scenario: Toggle shows the original
- **WHEN** the teacher activates the version control while the working copy is on screen
- **THEN** the editor shows the original of the open step and the working copy remains stored

#### Scenario: Toggle returns to the typed code
- **WHEN** the teacher activates the version control while the original is on screen
- **THEN** the editor shows the same stored working copy

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
The key-idea callout MUST show `lightbulb`. When the step has a snippet, the snippet title MUST show `folder`, the copy control MUST show `copy` and the word Kopiraj, and the file path MUST show `file-text` and the path text. A figure step MUST NOT show those snippet icons.

#### Scenario: Snippet chrome
- **WHEN** the teacher opens a step that has a snippet on Gradivo
- **THEN** the callout, the snippet title, the copy control, and the file path show those icons and the words Kopiraj and Ključna ideja stay

#### Scenario: Figure has no snippet chrome
- **WHEN** the teacher opens a figure step on Gradivo
- **THEN** the callout shows `lightbulb` and the snippet title, copy control, and file path are absent

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
In every theme the header, the week list, the lesson title, and the progress card MUST use a sans-serif face.

#### Scenario: Shell face is sans
- **WHEN** any theme is active
- **THEN** the header, the week list, the lesson title, and the progress card use a sans-serif face

### Requirement: Pitalica u jednoj koloni
The short quiz MUST lay each option on its own row at every width. A lesson wider than the single-column layout MUST NOT place two options on the same row.

#### Scenario: Wide quiz stacks
- **WHEN** a short quiz is open and the lesson is wider than the single-column layout
- **THEN** each option is on its own row

#### Scenario: Narrow quiz stacks
- **WHEN** the lecture page is laid out in one column and a short quiz is open
- **THEN** the options are in one column

### Requirement: Snimak fajla na koraku
The built-in version of a file MUST be the snapshot of course steps through the open step. A whole-file original MUST replace that file. A later fragment MUST be appended. The finished file on disk MUST NOT replace a snapshot that has text.

#### Scenario: Podela is the folder sketch
- **WHEN** the teacher shows the built-in version of `client/index.html` on Podela
- **THEN** the text is the folder sketch `client/` and `server/` and contains no script

#### Scenario: Selektor is one rule
- **WHEN** the teacher shows the built-in version of `client/css/soba.css` on Selektor
- **THEN** the text is one class rule and is not the finished stylesheet on disk

#### Scenario: Delta keeps the earlier object
- **WHEN** the teacher shows the built-in version of `client/js/korak.js` on Delta
- **THEN** the text starts with `let delta = 1;`, still contains the earlier `const soba` line, and declares `function korak`

#### Scenario: Class enters with the step that names it
- **WHEN** the teacher shows the built-in version of `client/js/displej.js` on the step that introduces `class Displej`
- **THEN** the text contains `class Displej` and is not the finished file on disk

### Requirement: Vezivanje stranice
Once `client/index.html` has a body and the snapshot contains at least one `client/js` file, that HTML snapshot MUST include a script source for each such file in introduction order and one classic inline script that binds the symbols those files declare. An HTML snapshot with no client script MUST contain no script tag.

#### Scenario: Semantika has no script
- **WHEN** the teacher shows the built-in version of `client/index.html` on Semantika
- **THEN** the document contains no script tag and no `/api/soba`

#### Scenario: Objekat binds the existing script
- **WHEN** the teacher shows the built-in version of `client/index.html` on Objekat
- **THEN** the document loads `js/korak.js` and the click handler sets the digit from `soba.temperatura`

#### Scenario: Classes are constructed when declared
- **WHEN** the teacher shows the built-in version of `client/index.html` on Prekidač
- **THEN** the document loads `js/korak.js` before `js/niz.js`, then `js/prekidac.js`, then `js/displej.js`, and the inline script constructs `Displej` and `Prekidac`

#### Scenario: Canvas appears with the line
- **WHEN** the teacher shows the built-in version of `client/index.html` on Linija
- **THEN** the document contains a canvas of 320 by 120 and mentions `nacrtajLiniju`

### Requirement: Rani klijentski skript
The panel MUST apply `client/js/korak.js` only when the shown text declares `function korak`, `client/js/niz.js` only when it declares both `pripremiLiniju` and `nacrtajLiniju`, `client/js/displej.js` only when it declares `class Displej`, and `client/js/prekidac.js` only when it declares `class Prekidac`. Until then the editor MUST clear the fragment-not-applied message. A shown buffer that declares the symbol and then throws MUST still keep the last drawing and show that message.

#### Scenario: Early object does not report a failure
- **WHEN** the teacher shows `client/js/korak.js` on Objekat and that text does not declare `function korak`
- **THEN** the editor does not say that the fragment was not applied

#### Scenario: Thrown buffer still reports
- **WHEN** the shown text declares the symbol for that file and executing it throws
- **THEN** the panel keeps the last valid drawing and the editor says that the fragment was not applied
