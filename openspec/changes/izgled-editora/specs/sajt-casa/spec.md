# Spec Delta

## REMOVED Requirements

### Requirement: Žuti hod koraka
**Reason**: The step mock replaces the amber previous and next buttons with one selector.
**Migration**: Use Birač koraka. Previous is an icon button. Next is Sledeći with an ink fill. The temperature control on the panel stays plain.

## MODIFIED Requirements

### Requirement: Zaglavlje lekcije
The open lesson MUST show the course breadcrumb, the week title, the week subtitle, one step control per step, and the step selector. The level, when the document sets one, the minute label, and Sačuvaj korak MUST stay in the lesson and MUST NOT sit inside the selector.

#### Scenario: Step controls match the week
- **WHEN** a week with 11 steps is open on the first step
- **THEN** eleven step controls are shown, the first is current, and the selector reads Korak 1 od 11

#### Scenario: Level comes from the document
- **WHEN** the open step sets a level
- **THEN** the lesson shows that level outside the selector

### Requirement: Ikonice trake koraka
When the step sets a level, the lesson MUST show `chart-column` beside that level, outside the selector. The minute label MUST show `clock`. Sačuvaj korak MUST show `bookmark` and the words Sačuvaj korak. Those three MUST NOT sit inside the selector.

#### Scenario: Bar icons
- **WHEN** the open step sets a level and a minute label
- **THEN** the lesson shows `chart-column`, `clock`, and `bookmark` with the words Sačuvaj korak, outside the selector

### Requirement: Reset radne verzije
The editor MUST offer Resetuj for the open file, separate from the version switch. The refresh icon beside the path MUST perform that same reset. Activating it MUST replace that file's stored working copy with the built-in original of the open step, MUST show that text, and MUST select Moj kod. It MUST NOT change the file on disk or any other file's working copy.

#### Scenario: Reset drops the typed draft
- **WHEN** the teacher has typed into a file and activates reset
- **THEN** the editor shows the built-in original of the open step and the stored working copy of that file is that same text

#### Scenario: Another file stays
- **WHEN** the teacher resets one file while another file has a stored working copy
- **THEN** the other working copy is unchanged and the file on disk is unchanged

#### Scenario: Reset while the built-in version is shown
- **WHEN** the built-in version is on screen and the teacher activates reset
- **THEN** the stored working copy becomes the built-in original of the open step and Moj kod is selected

## ADDED Requirements

### Requirement: Birač koraka
On Gradivo, the selector MUST show Korak {n} od {N}, the open step's title, a previous control, Svi koraci, and Sledeći. It MUST NOT show the week title as that second line, and MUST NOT be on screen on Editor or Diskusija.

#### Scenario: Step title sits under the count
- **WHEN** week 1 is open on Alati
- **THEN** the selector reads Korak 14 od 17 and Alati

#### Scenario: Editor hides the selector
- **WHEN** the teacher opens Editor
- **THEN** the selector is not on screen and the numbered step controls remain

### Requirement: Traka završenih koraka
The selector bar MUST fill by the number of saved steps in the open week divided by that week's step count. The open index MUST NOT set the fill. The page MUST NOT show the sentence Progress indicates completed steps, not just the current position.

#### Scenario: Fill ignores the open index
- **WHEN** the open week has 17 steps, three are saved, and the open step is the 14th and is not saved
- **THEN** the filled portion is 3/17

#### Scenario: Saving fills one more step
- **WHEN** the teacher saves the open step
- **THEN** that step counts toward the fill

#### Scenario: Nothing saved leaves the bar empty
- **WHEN** no step of the open week is saved
- **THEN** the bar is empty

### Requirement: Svi koraci
Svi koraci MUST list every step of the open week in order, with its number and title. Choosing one MUST open that step. The control MUST show `menu` and the words Svi koraci, and MUST work from the keyboard.

#### Scenario: The menu opens a step
- **WHEN** the teacher chooses a step from Svi koraci
- **THEN** that step is the open lesson

### Requirement: Sledeći i prethodni
The previous control MUST show only `chevron-left`, MUST be named Prethodni korak, and MUST be disabled on the first step. Sledeći MUST show that word and `chevron-right`, MUST be disabled on the last step, and MUST use the theme ink as its background with text that contrasts at 4.5:1 or more. Sledeći MUST NOT use the accent background. The temperature control MUST stay without that background.

#### Scenario: Next opens the following step
- **WHEN** the teacher activates Sledeći and a later step exists
- **THEN** that later step opens

#### Scenario: Ends do not move
- **WHEN** the first step is open
- **THEN** the previous control is disabled, and on the last step Sledeći is disabled

#### Scenario: Next is not yellow
- **WHEN** any theme is active and Gradivo is open
- **THEN** Sledeći uses the ink background and does not use the accent background

#### Scenario: Temperature control stays plain
- **WHEN** the temperature control is visible on the panel
- **THEN** it does not use the Sledeći background

### Requirement: Traka fajla
Above the file tree, Editor MUST show Učitaj with `folder`, Sačuvaj with `save`, and Resetuj with `refresh-cw`. Those icons MUST be currentColor SVGs. The Server tab MUST stay absent in weeks 1, 2, and 3.

#### Scenario: Week 1 has no Server tab
- **WHEN** week 1 is open on Editor
- **THEN** Učitaj, Sačuvaj, and Resetuj are visible and the Server tab is absent

### Requirement: Učitaj lekciju
Učitaj MUST show the built-in original of the open file and MUST select Lekcija. It MUST NOT delete the working copy, MUST NOT read the finished file from disk, and MUST NOT reload the page.

#### Scenario: Load shows the lesson
- **WHEN** the teacher activates Učitaj while Moj kod is on screen
- **THEN** the original is on screen, it cannot be edited, and the working copy remains stored

### Requirement: Sačuvaj u editoru
Sačuvaj MUST write the text of Moj kod into this browser's working copy for the open file. It MUST NOT write the file on disk, MUST NOT record the step, and MUST NOT send a request. While Lekcija is on screen, Sačuvaj MUST leave the stored working copy unchanged.

#### Scenario: Save keeps the typed copy
- **WHEN** Moj kod is on screen and the teacher activates Sačuvaj
- **THEN** that text is the stored working copy and the file on disk is unchanged

#### Scenario: Lesson view does not overwrite
- **WHEN** Lekcija is on screen and the teacher activates Sačuvaj
- **THEN** the stored working copy is unchanged

### Requirement: Moj kod i Lekcija
Moj kod MUST show the working copy and MUST be editable. Lekcija MUST show the built-in original and MUST be read-only. The segment and the version button beside the path MUST select the same view. Moj kod MUST show `pencil` on that button. Lekcija MUST show `file-text` on that button. The selected segment MUST use the accent fill.

#### Scenario: Segment returns to the typed code
- **WHEN** the teacher chooses Moj kod while Lekcija is on screen
- **THEN** the editor shows the stored working copy and the path button shows `pencil`

#### Scenario: Lesson matches the version button
- **WHEN** the teacher chooses Lekcija
- **THEN** the path button shows `file-text` and the working copy remains stored

### Requirement: Okvir pregleda
The preview MUST be titled Pregled and MUST wrap the room in a browser frame. The frame MUST show decorative traffic lights, a decorative lock, and the open file as a URL on the page origin. That address MUST NOT be editable and MUST NOT navigate. Refresh in the frame MUST reapply the editor text to the preview and MUST NOT reload the lecture page. The address MUST NOT hardcode port 3000.

#### Scenario: Address follows the open file
- **WHEN** `client/index.html` is the open file
- **THEN** the frame shows the page origin plus `/client/index.html` and the address is not a text field

#### Scenario: Refresh does not reload the lecture
- **WHEN** the teacher activates refresh in the frame
- **THEN** the preview shows the editor text and the lecture page does not reload

### Requirement: Ikonice strana i stabla
Klijent MUST show `monitor` and the word Klijent. When Server is present it MUST show `server` and the word Server. The tree MUST be labeled Fajlovi. The open file's row MUST be the current row. New icons MUST be currentColor SVGs and MUST NOT come from a PNG.

#### Scenario: Client tab and the open file
- **WHEN** the teacher opens Editor and a file is current
- **THEN** Klijent shows `monitor`, the tree is labeled Fajlovi, and that file's row is current

### Requirement: Poziv preduslova
The prerequisite line MUST show `graduation-cap` and MUST begin with Preduslov:.

#### Scenario: Callout names the prerequisite
- **WHEN** the teacher opens a lecture
- **THEN** the prerequisite shows `graduation-cap` and begins with Preduslov:

### Requirement: Izabrani tab časa
The selected tab among Gradivo, Diskusija, and Editor MUST use the accent border and an accent-tinted background. The other two MUST stay plain. The three words and their icons MUST stay.

#### Scenario: Editor is the marked tab
- **WHEN** Editor is the open tab
- **THEN** Editor has the accent border and an accent-tinted background, and Gradivo and Diskusija stay plain
