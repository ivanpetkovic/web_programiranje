# Spec Delta

## MODIFIED Requirements

### Requirement: Nedelja 1 sklapa stranicu
Week 1 MUST follow Podela with these steps, in order: Stranica, Glava, Telo, Naslov, Broj, Dugme, Veza, Selektor, Okvir, Unutra, Spolja, Osvežavanje, Alati, Dva zahteva, Soba prekidača, Semantika. Veza MUST add the link to the stylesheet. The original of each of these steps MUST be the whole file after that step. Weeks 2 through 10 MUST keep each step's stored fragment as its contribution. The editor MUST show the snapshot of that file through the step.

#### Scenario: Week 1 order
- **WHEN** the teacher opens week 1
- **THEN** the steps are Podela, Stranica, Glava, Telo, Naslov, Broj, Dugme, Veza, Selektor, Okvir, Unutra, Spolja, Osvežavanje, Alati, Dva zahteva, Soba prekidača, and Semantika, in that order

#### Scenario: Later week keeps its code
- **WHEN** the teacher opens a step in week 2 or later
- **THEN** that step still stores its own fragment, and the editor's built-in version of its file is the snapshot through that step rather than the finished file on disk

#### Scenario: Week 1 original is the whole file
- **WHEN** the teacher shows the original of Broj in week 1
- **THEN** the original is the whole HTML file after that step, including the page begun in Stranica
