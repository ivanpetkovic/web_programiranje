# Spec Delta

## ADDED Requirements

### Requirement: Rezerva po času
Lectures 1 through 9 MUST each have a reserve quiz. It MUST stay closed until the teacher opens it, and it MUST then start again at choice. Lecture 10 MUST NOT open that vote. Its note about a type and an assistant suggestion MUST stay a sentence in the review.

#### Scenario: Lecture 9 reserve starts at choice
- **WHEN** the teacher opens the lecture 9 reserve
- **THEN** the reserve shows unmarked options and hidden reasons

#### Scenario: Lecture 10 reserve is a sentence
- **WHEN** the teacher finishes the lecture 10 discussion without opening a reserve
- **THEN** the review contains the type and assistant sentence and no second set of options

### Requirement: Izlaz časa 10
The lecture 10 exit MUST be free text asking where the right is checked, where the state lives, and what silence does not prove. It MUST NOT offer options and it MUST NOT mark an answer.

#### Scenario: Exit stays free text
- **WHEN** the teacher reaches the lecture 10 exit
- **THEN** the page offers one text entry and no options

### Requirement: Osvrt imenuje teme
The review MUST name that lecture's survey topics. It MUST NOT open a choice phase, a mark, or a new discussion for any of those names.

#### Scenario: A survey name has no quiz
- **WHEN** the teacher opens the review and reads a survey name
- **THEN** that name has no options and no mark
