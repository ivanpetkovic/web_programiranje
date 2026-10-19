# Spec Delta

## MODIFIED Requirements

### Requirement: Arhitektura na početku
The first step of week 1 MUST be titled Podela and its original MUST be the two lines `client/` and `server/`. `client/` MUST be what the browser loads. `server/` MUST be what Node runs, from week 4. Until week 4 the Server tab MUST be absent. The course MUST NOT start by writing the whole application in one file.

#### Scenario: Empty server folder
- **WHEN** the teacher is still before the server lecture
- **THEN** the Server tab is absent and the browser is loading only `client/`

#### Scenario: Podela names the folders
- **WHEN** the teacher opens the first step of week 1
- **THEN** the step is titled Podela and its original is `client/` and `server/`

#### Scenario: Server tab arrives with Node
- **WHEN** the teacher opens week 4
- **THEN** the Server tab is present

### Requirement: Preduslov nedelje
Each lecture MUST name a prerequisite and an outcome. Lecture 1's prerequisite MUST say that the browser loads `client/` and that `server/` has no files yet. Each later lecture's prerequisite MUST be the outcome the previous lecture already reached.

#### Scenario: Later lecture names the previous outcome
- **WHEN** the teacher opens lecture 2 or any later lecture
- **THEN** its prerequisite is the outcome already reached and its own outcome is shown

#### Scenario: Week 1 names the folders
- **WHEN** the teacher opens week 1
- **THEN** the prerequisite says that the browser loads `client/` and that `server/` has no files yet

## ADDED Requirements

### Requirement: Nedelja 1 sklapa stranicu
Week 1 MUST follow Podela with these steps, in order: Stranica, Glava, Telo, Naslov, Broj, Dugme, Veza, Razmak, Okvir, Osvežavanje, Alati, Dva zahteva, Soba prekidača, Semantika. Stranica through Dugme MUST build the HTML document, then the elements. Veza, Razmak, and Okvir MUST add the stylesheet. The original of each of these steps MUST be the whole file after that step. Weeks 2 through 10 MUST keep the code already stored on each step as that step's original.

#### Scenario: Week 1 order
- **WHEN** the teacher opens week 1
- **THEN** the steps are Podela, Stranica, Glava, Telo, Naslov, Broj, Dugme, Veza, Razmak, Okvir, Osvežavanje, Alati, Dva zahteva, Soba prekidača, and Semantika, in that order

#### Scenario: Later week keeps its code
- **WHEN** the teacher opens a step in week 2 or later
- **THEN** that step's original is the code the course already stored on the step

#### Scenario: Week 1 original is the whole file
- **WHEN** the teacher shows the original of Broj in week 1
- **THEN** the original is the whole HTML file after that step, including the page begun in Stranica
