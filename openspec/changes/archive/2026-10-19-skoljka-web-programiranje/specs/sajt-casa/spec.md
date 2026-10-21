# Spec Delta

## MODIFIED Requirements

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

## ADDED Requirements

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
