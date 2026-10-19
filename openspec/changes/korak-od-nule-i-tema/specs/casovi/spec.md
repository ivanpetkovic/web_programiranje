# Spec Delta

## ADDED Requirements

### Requirement: HTML nedelje 1 raste
From Stranica through Semantika, the original of `client/index.html` MUST be the whole document after that step. Stranica MUST be a nearly empty document and MUST NOT keep the folder sketch. Each later step MUST keep every line of the previous step's original and MUST add at least one line about that step. The document MUST still contain 24 and MUST NOT add the machine room or a room request.

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

### Requirement: Stil nedelje 1 raste
Razmak MUST be the first original of `client/css/soba.css` and MUST be one small rule. Okvir MUST keep every line of that original and MUST add at least one line about the frame.

#### Scenario: Razmak starts the stylesheet
- **WHEN** the teacher shows the original of Razmak
- **THEN** the original is a small rule and is not the finished stylesheet from disk

#### Scenario: Okvir keeps the spacing
- **WHEN** the teacher shows the original of Okvir
- **THEN** it contains every line of Razmak and adds a line about the frame
