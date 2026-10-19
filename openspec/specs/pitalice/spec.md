# pitalice Specification

## Purpose

Pitalice drže razgovor na projektoru: kratka provera u svakom koraku i jedna duga diskusija po nedelji, bez pamćenja glasova i bez bodovanja.

## Requirements

### Requirement: Kratka pitalica koraka
Every step MUST have one short quiz about its step. The answers MUST stay unmarked until the teacher reveals the reasons. Selecting an option MUST highlight only that selection and MUST NOT reveal which option holds. The short quiz MUST show its options together on the lesson page. It MUST NOT use the assumption board, the comparison phase, or a second half-hour discussion.

#### Scenario: Step quiz stays unmarked
- **WHEN** the teacher opens a step
- **THEN** the short quiz shows its answers with none marked, and the reasons are still closed

#### Scenario: Selection is not the mark
- **WHEN** the teacher selects an option before the reasons are revealed
- **THEN** that option is highlighted and no option is marked as the one that holds

### Requirement: Jedna duga diskusija
Each lecture MUST have one main discussion quiz on the projector. The site MUST NOT remember a vote. The teacher MUST be the only one who advances the phase. The 35-minute budget MUST belong to the whole lecture and that one discussion, and the site MUST NOT show a timer.

#### Scenario: No stored vote
- **WHEN** a student answers the main quiz out loud
- **THEN** the site does not record that answer and does not mark an option by itself

### Requirement: Redosled faza
The main quiz MUST move only in this order: choice, comparison, assumptions, analysis, second choice, then either the reserve quiz or staying on the same idea. Only the teacher MUST advance a phase.

#### Scenario: Phases stay in order
- **WHEN** the teacher advances the main quiz
- **THEN** the next phase is the next name in that order

### Requirement: Izbor ćuti o tačnom
During choice, options MUST be visible and unmarked. The teacher MAY underline one option for the current majority. Underlining MUST NOT reveal the answer. During comparison the site MUST stay silent about which option holds.

#### Scenario: Reasons stay closed
- **WHEN** the main quiz is in choice or comparison
- **THEN** no option is marked and the reasons are hidden

### Requirement: Pretpostavke i analiza
During assumptions the teacher MUST be able to write heard sentences, including ones that do not hold, without revealing the answer. Analysis MUST open every option's reason and the mark. A written wrong assumption MUST remain after the mark.

#### Scenario: Analysis opens the mark
- **WHEN** the teacher starts analysis
- **THEN** every option shows its reason, one option is marked, and a written wrong assumption stays visible

### Requirement: Ponovni izbor i rezerva
The second choice MUST let the teacher move the underline and write one shared concluding sentence. The reserve quiz MUST start again at choice with the same rules, and MUST stay closed until the teacher opens it.

#### Scenario: Reserve stays shut
- **WHEN** the teacher has not opened the reserve quiz
- **THEN** the reserve quiz is not shown, even if the main discussion is still open

### Requirement: Izlaz i prenos
The last part of the lecture MUST be an exit question as free text, without options and without a mark. If the group leaves without a conclusion, the next lecture MAY open that same main quiz before the new material. The site MUST still contain both quizzes, and the teacher MUST be able to leave the new lecture's reserve closed.

#### Scenario: Exit has no options
- **WHEN** the teacher reaches the exit question
- **THEN** the page offers a free-text entry and no four-option quiz

### Requirement: Pitalice prvih pet časova
Each main quiz MUST use the counterexample named for that lecture. Lecture 1 MUST ask whether tools changed the measurement, the document, or the display, and refresh MUST restore 24. Lecture 2 MUST ask what a second name for a const object shares. Lecture 3 MUST ask whether changing the object by itself changes the page. Lecture 4 MUST ask whether the handler can change the button through the DOM. Lecture 5 MUST ask whether HTTP 500 by itself enters catch.

#### Scenario: Lecture 1 counterexample
- **WHEN** the lecture 1 main quiz is analyzed
- **THEN** the marked answer is the local display and the panel counterexample is that refresh restores 24

### Requirement: Pitalice drugih pet časova
Lecture 6 MUST ask whether repeating a command is safe. Lecture 7 MUST ask whether the record is reliable before the mode and the history are one unit. Lecture 8 MUST ask whether 24 °C from ten minutes ago is the current temperature. Lecture 9 MUST ask whether hiding the button protects the server. Lecture 10 MUST ask what may be claimed when the screen says on and no response has arrived.

#### Scenario: Lecture 10 stays undecided
- **WHEN** the lecture 10 main quiz is analyzed
- **THEN** the marked answer says the missing response neither proves nor disproves the write

### Requirement: Editor ne otvara razlog
The editor MAY change the panel during assumptions or analysis. Changing the code MUST NOT open the reasons by itself. The review block MUST NOT have choice phases.

#### Scenario: Code change is not analysis
- **WHEN** the teacher edits the open file during assumptions
- **THEN** the panel may change and the quiz reasons stay closed

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
