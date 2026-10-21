# Spec Delta

## REMOVED Requirements

### Requirement: Osvrt imenuje teme
**Reason**: A review that only names topics is not lesson material, and the page no longer has that block.
**Migration**: Week 1 teaches the Web, the Internet, and a short history as steps. Other former names are not shown and are not quizzed.

## MODIFIED Requirements

### Requirement: Izlaz i prenos
The last step of the lecture MUST show the exit question as a sentence, without options, without a mark, and without a text field. If the group leaves without a conclusion, the next lecture MAY open that same main quiz before the new material. The site MUST still contain both quizzes, and the teacher MUST be able to leave the new lecture's reserve closed. The discussion MUST still offer a field for heard assumptions and a field for one shared concluding sentence.

#### Scenario: Exit has no options
- **WHEN** the teacher reaches the exit question
- **THEN** the page shows the sentence and offers no text field and no four-option quiz

#### Scenario: Discussion fields stay
- **WHEN** the teacher reaches the assumptions phase of the discussion
- **THEN** the page still offers a field for the heard sentences

### Requirement: Editor ne otvara razlog
The editor MAY change the panel during assumptions or analysis. Changing the code MUST NOT open the reasons by itself. The page MUST NOT include a review block.

#### Scenario: Code change is not analysis
- **WHEN** the teacher edits the open file during assumptions
- **THEN** the panel may change and the quiz reasons stay closed

### Requirement: Rezerva po času
Lectures 1 through 9 MUST each have a reserve quiz. It MUST stay closed until the teacher opens it, and it MUST then start again at choice. Lecture 10 MUST NOT open that vote. Its note about a type and an assistant suggestion MUST stay a sentence in the lecture.

#### Scenario: Lecture 9 reserve starts at choice
- **WHEN** the teacher opens the lecture 9 reserve
- **THEN** the reserve shows unmarked options and hidden reasons

#### Scenario: Lecture 10 reserve is a sentence
- **WHEN** the teacher finishes the lecture 10 discussion without opening a reserve
- **THEN** the lecture contains the type and assistant sentence and no second set of options

### Requirement: Izlaz časa 10
The lecture 10 exit MUST be a sentence asking where the right is checked, where the state lives, and what silence does not prove. It MUST NOT offer options, a text field, or a mark.

#### Scenario: Exit stays free text
- **WHEN** the teacher reaches the lecture 10 exit
- **THEN** the page shows that sentence and no text field and no options
