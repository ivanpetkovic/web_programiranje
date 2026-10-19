# Spec Delta

## ADDED Requirements

### Requirement: HTML nedelje 1 raste
From Stranica through Semantika, the original of `client/index.html` MUST be the whole document after that step. Stranica MUST be a nearly empty document and MUST NOT keep the folder sketch. Each later step of that file MUST keep every line of the previous original of that file and MUST add at least one line about that step. The document MUST still contain 24 and MUST NOT add the machine room or a room request.

#### Scenario: Stranica starts nearly empty
- **WHEN** the teacher shows the original of Stranica
- **THEN** the original is a nearly empty HTML document and does not contain the lines `client/` and `server/`

#### Scenario: Later step keeps the document
- **WHEN** the teacher shows the original of Broj
- **THEN** that original contains every line of Naslov and adds the line that places 24

#### Scenario: Osvežavanje adds a line
- **WHEN** the teacher shows the original of Osvežavanje
- **THEN** it contains every line of the previous `client/index.html` original and adds a line about refresh restoring the document

#### Scenario: Semantika adds a line
- **WHEN** the teacher shows the original of Semantika
- **THEN** it contains every line of the previous `client/index.html` original and adds a line about the heading being a heading

#### Scenario: Temperature stays in the file
- **WHEN** the teacher shows the original of Semantika
- **THEN** the document still contains 24 and does not contain the machine room or `/api/soba`

### Requirement: Nedelja 1 pokazuje HTML
Each step from Stranica through Dugme MUST add one HTML element or attribute, and its key idea MUST name that element or attribute. Broj MUST add the class attribute on the paragraph that contains 24. Dugme MUST add a button with a type attribute.

#### Scenario: Heading is the step
- **WHEN** the teacher opens Naslov
- **THEN** the key idea names the heading element and the snippet is the heading added to the document

#### Scenario: Class marks the number
- **WHEN** the teacher opens Broj
- **THEN** the key idea names the class attribute and the document contains 24

#### Scenario: Button is an element
- **WHEN** the teacher opens Dugme
- **THEN** the key idea names the button element and the type attribute

### Requirement: Stil nedelje 1 je box model
Selektor MUST be the first original of `client/css/soba.css` and MUST be one class rule with one declaration. Okvir MUST add `border` and keep that rule. Unutra MUST add `padding` and keep the earlier declarations. Spolja MUST add `margin` and keep the earlier declarations. Each of those steps MUST name that concept in its key idea.

#### Scenario: Selektor starts the stylesheet
- **WHEN** the teacher shows the original of Selektor
- **THEN** the original is one class rule and is not the finished stylesheet from disk

#### Scenario: Border follows the selector
- **WHEN** the teacher shows the original of Okvir
- **THEN** it contains every line of Selektor and adds a border declaration

#### Scenario: Padding stays inside the border
- **WHEN** the teacher shows the original of Unutra
- **THEN** it contains the border declaration and adds a padding declaration

#### Scenario: Margin finishes the box
- **WHEN** the teacher shows the original of Spolja
- **THEN** the rule contains the class selector, border, padding, and margin

## MODIFIED Requirements

### Requirement: Nedelja 1 sklapa stranicu
Week 1 MUST follow Podela with these steps, in order: Stranica, Glava, Telo, Naslov, Broj, Dugme, Veza, Selektor, Okvir, Unutra, Spolja, Osvežavanje, Alati, Dva zahteva, Soba prekidača, Semantika. Stranica through Dugme MUST add one HTML element or attribute per step. Veza MUST add the link to the stylesheet. Selektor, Okvir, Unutra, and Spolja MUST add the class selector, border, padding, and margin, in that order. The original of each of these steps MUST be the whole file after that step. Weeks 2 through 10 MUST keep the code already stored on each step as that step's original.

#### Scenario: Week 1 order
- **WHEN** the teacher opens week 1
- **THEN** the steps are Podela, Stranica, Glava, Telo, Naslov, Broj, Dugme, Veza, Selektor, Okvir, Unutra, Spolja, Osvežavanje, Alati, Dva zahteva, Soba prekidača, and Semantika, in that order

#### Scenario: Later week keeps its code
- **WHEN** the teacher opens a step in week 2 or later
- **THEN** that step's original is the code the course already stored on the step

#### Scenario: Week 1 original is the whole file
- **WHEN** the teacher shows the original of Broj in week 1
- **THEN** the original is the whole HTML file after that step, including the page begun in Stranica
