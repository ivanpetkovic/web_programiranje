# opcije-sajta Specification

## Purpose

Opcije su jedan padajući panel u zaglavlju sajta časa za paletu, veličinu teksta, način korišćenja i lokalno stanje. Način korišćenja se bira jednom, pri prvom otvaranju sajta.

## Requirements

### Requirement: Dugme Opcije
The header MUST show an Opcije control with `settings`, the word Opcije, and `chevron-down` while closed or `chevron-up` while open. Activating it MUST open the Opcije panel below the control, aligned to its right edge. Escape, a click outside, or activating the control again MUST close the panel and return focus to the control.

#### Scenario: Open and close
- **WHEN** the student activates Opcije and then presses Escape
- **THEN** the panel was shown with `chevron-up` on the control, and after Escape the panel is hidden, the control shows `chevron-down`, and the control has focus

#### Scenario: One dropdown at a time
- **WHEN** Sačuvane beleške is open and the student activates Opcije
- **THEN** Sačuvane beleške closes and Opcije opens

### Requirement: Odeljci Opcija
The Opcije panel MUST show four sections in this order, separated by a rule: Paleta (`palette`, Izaberite temu boja aplikacije.), Veličina fonta (`a-large-small`, Podesite veličinu teksta na desktopu.), Način korišćenja (`layers`, Odredite način na koji koristite aplikaciju.), and Lokalno stanje (`database`).

#### Scenario: Sections in order
- **WHEN** the student opens Opcije
- **THEN** the panel shows Paleta, Veličina fonta, Način korišćenja, and Lokalno stanje in that order, each with its icon and its line of help

### Requirement: Paleta u Opcijama
Paleta MUST show one tile per palette, in the order mornar, ugalj, pesak, terakota. Each tile MUST show that palette's existing image from `site/icons/teme/` and MUST carry its existing name (Plava, Ugalj, Pesak, Terakota) as its accessible name and tooltip. The active tile MUST show an accent border and a round check badge. Choosing a tile MUST pin that palette at once and MUST keep the panel open.

#### Scenario: Pin from the tiles
- **WHEN** the student chooses the Terakota tile
- **THEN** terakota is active without a document reload, the Terakota tile shows the check badge, the other tiles do not, and Opcije stays open

#### Scenario: Tiles use the shipped images
- **WHEN** Opcije is open
- **THEN** each tile shows `/icons/teme/{id}.png` for its palette and no tile uses a color swatch from the mock

### Requirement: Veličina fonta na desktopu
Veličina fonta MUST offer A−, A, and A+ as one segmented control, with the chosen size pressed. The sizes MUST scale the lesson text by 0.875, 1, and 1.125. The control MUST work in Predavanja and in Samostalni rad, on desktop and in the mobile settings sheet. In Predavanja the chosen size MUST multiply the larger lecture text size.

#### Scenario: Desktop lecture mode
- **WHEN** Predavanja is active on a desktop width and the student chooses A+
- **THEN** A+ is pressed and the lesson text grows to 1.125 times the lecture text size

#### Scenario: Self-study mode
- **WHEN** Samostalni rad is active and the student chooses A−
- **THEN** the lesson text is 0.875 times the base size

### Requirement: Način korišćenja u Opcijama
Način korišćenja MUST show two cards: Predavanja with `monitor` and Samostalni rad with `book-open-text`, each with its icon above its label. The active card MUST show an accent border, an accent tint, and a round check badge. Choosing a card MUST switch the work mode at once and MUST keep the open week and step.

#### Scenario: Switch mode
- **WHEN** Predavanja is active and the student chooses Samostalni rad in Opcije
- **THEN** Samostalni rad shows the check badge, the work mode is Samostalni rad without a document reload, and the same week and step are open

#### Scenario: Mode control left the lesson
- **WHEN** a lecture is open on a desktop width
- **THEN** the Predavanja | Samostalni rad control is not under the step selector

### Requirement: Režim se bira pri prvom otvaranju
When the state holds no work mode, the site MUST show a modal choice titled Kako koristite aplikaciju? with the same two cards, before the student can use the lesson. Choosing a card MUST store that mode and close the choice. Dismissing the choice MUST store Predavanja. Once a mode is stored the choice MUST NOT appear again until the state is cleared.

#### Scenario: First visit
- **WHEN** the site opens in a browser with no state record
- **THEN** the mode choice is shown with Predavanja and Samostalni rad

#### Scenario: Second visit
- **WHEN** the student chose Samostalni rad and loads the page again
- **THEN** the mode choice is not shown and Samostalni rad is active

#### Scenario: Dismissed with Escape
- **WHEN** the mode choice is shown and the student presses Escape
- **THEN** the choice closes, Predavanja is stored, and the choice does not appear on the next load

### Requirement: Lokalno stanje u Opcijama
Lokalno stanje MUST show a badge, one line that says the progress and settings stay in this browser, and three controls: Load with `upload`, Save with `download`, and Obriši progres with `trash` in the danger color. The badge MUST read Sačuvano lokalno with `check` on the success color when the last write succeeded, and Nije sačuvano on the warning color when it failed.

#### Scenario: Normal state
- **WHEN** the student opens Opcije after a change was written
- **THEN** the badge reads Sačuvano lokalno with `check`, and Load, Save, and Obriši progres are visible with their icons

#### Scenario: Danger control
- **WHEN** Opcije is open in any palette
- **THEN** Obriši progres uses the danger color for its border, icon, and text, and Load and Save do not

### Requirement: Opcije prate maketu
At a 1672 by 941 viewport with pesak active and Opcije open, the panel and every control in it MUST match the boxes of `maketa.png` in this change within 4 pixels in position and size. The panel MUST use pixel sizes that do not grow with the text-size setting or the lecture text size.

#### Scenario: Overlay against the mock
- **WHEN** the page is rendered at 1672 by 941 with pesak active and Opcije open
- **THEN** the panel box, the four section headings, the palette tiles, the font segment, the two mode cards, the badge, and the three local-state controls are each within 4 pixels of the mock

#### Scenario: Text size does not move the panel
- **WHEN** the student chooses A+ while Opcije is open
- **THEN** the panel keeps the same box and the lesson text behind it grows

### Requirement: Opcije sa tastature
Every control in the Opcije panel and in the first-run choice MUST work from the keyboard and MUST show visible focus. The palette tiles, the font segment, and the mode cards MUST expose their pressed or selected state to assistive technology.

#### Scenario: Keyboard pin
- **WHEN** the student tabs to the Pesak tile and presses Enter
- **THEN** pesak is active and the tile reports that it is selected

### Requirement: Opcije na mobilnom
On a single-column layout the Podešavanja sheet MUST show the same Paleta, Veličina fonta, Način korišćenja, and Lokalno stanje sections with the same behavior, stacked to the sheet width. The pixel match with the mock MUST NOT apply there.

#### Scenario: Mobile settings
- **WHEN** the lecture page is laid out in one column and the student opens Podešavanja
- **THEN** the sheet shows the four sections and choosing A+ changes the lesson text size
