# pitalice Specification

## Purpose

Pitalice drže razgovor na projektoru: kratka provera u svakom koraku i jedna duga diskusija po nedelji, bez pamćenja glasova i bez bodovanja.

## Requirements

### Requirement: Kratka pitalica koraka
Every step MUST have one short quiz about its step. The answers MUST stay unmarked until the teacher reveals the reasons. Selecting an option MUST highlight only that selection and MUST NOT reveal which option holds. The short quiz MUST show its options together on the lesson page, one under another. It MUST NOT use the assumption board, the comparison phase, or a second half-hour discussion.

#### Scenario: Step quiz stays unmarked
- **WHEN** the teacher opens a step
- **THEN** the short quiz shows its answers with none marked, and the reasons are still closed

#### Scenario: Selection is not the mark
- **WHEN** the teacher selects an option before the reasons are revealed
- **THEN** that option is highlighted and no option is marked as the one that holds

#### Scenario: Options stack
- **WHEN** the teacher opens a step on a wide page
- **THEN** each short-quiz option is on its own row
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
The last step of the lecture MUST show the exit question as a sentence, without options, without a mark, and without a text field. If the group leaves without a conclusion, the next lecture MAY open that same main quiz before the new material. The site MUST still contain both quizzes, and the teacher MUST be able to leave the new lecture's reserve closed. The discussion MUST still offer a field for heard assumptions and a field for one shared concluding sentence.

#### Scenario: Exit has no options
- **WHEN** the teacher reaches the exit question
- **THEN** the page shows the sentence and offers no text field and no four-option quiz

#### Scenario: Discussion fields stay
- **WHEN** the teacher reaches the assumptions phase of the discussion
- **THEN** the page still offers a field for the heard sentences
### Requirement: Pitalice časova 2 do 6
Each main quiz MUST use the counterexample named for that lecture. The week Šta browser prikazuje MUST ask whether tools changed the measurement, the document, or the display, and refresh MUST restore 24. The week JavaScript opisuje stanje MUST ask what a second name for a const object shares. The week Događaji povezuju korisnika MUST ask whether changing the object by itself changes the page. The week Od naivnog prenosa do HTTP-a, pa Node MUST ask whether the handler can change the button through the DOM. The week Čekanje i neuspeh MUST ask whether HTTP 500 by itself enters catch.

#### Scenario: Lecture 1 counterexample
- **WHEN** the main quiz of Šta browser prikazuje is analyzed
- **THEN** the marked answer is the local display and the panel counterexample is that refresh restores 24
### Requirement: Pitalice časova 7 do 11
The week Komande i ponavljanje MUST ask whether repeating a command is safe. The week Trajno stanje i Docker MUST ask whether the record is reliable before the mode and the history are one unit. The week Koliko je prikaz svež MUST ask whether 24 °C from ten minutes ago is the current temperature. The week Ko sme da upravlja MUST ask whether hiding the button protects the server. The week Ceo sistem MUST ask what may be claimed when the screen says on and no response has arrived.

#### Scenario: Lecture 10 stays undecided
- **WHEN** the Ceo sistem main quiz is analyzed
- **THEN** the marked answer says the missing response neither proves nor disproves the write
### Requirement: Editor ne otvara razlog
The editor MAY change the panel during assumptions or analysis. Changing the code MUST NOT open the reasons by itself. The page MUST NOT include a review block.

#### Scenario: Code change is not analysis
- **WHEN** the teacher edits the open file during assumptions
- **THEN** the panel may change and the quiz reasons stay closed
### Requirement: Rezerva po času
Weeks 1 through 10 MUST each have a reserve quiz. It MUST stay closed until the teacher opens it, and it MUST then start again at choice. Week 11 MUST NOT open that vote. Its note about a type and an assistant suggestion MUST stay a sentence in the lecture.

#### Scenario: Lecture 9 reserve starts at choice
- **WHEN** the teacher opens the reserve of Ko sme da upravlja
- **THEN** the reserve shows unmarked options and hidden reasons

#### Scenario: Lecture 10 reserve is a sentence
- **WHEN** the teacher finishes the Ceo sistem discussion without opening a reserve
- **THEN** the lecture contains the type and assistant sentence and no second set of options
### Requirement: Izlaz časa 11
The Ceo sistem exit MUST be a sentence asking where the right is checked, where the state lives, and what silence does not prove. It MUST NOT offer options, a text field, or a mark.

#### Scenario: Exit stays free text
- **WHEN** the teacher reaches the Ceo sistem exit
- **THEN** the page shows that sentence and no text field and no options
### Requirement: Diskusija nedelje istorije
The week 1 main quiz MUST ask what a 1991 page already is when one word covers the network, that page, Gmail, and a ledger. The marked answer MUST say it is a hypertext document fetched by a URL, and MUST deny that it is the network, an application, or a ledger.

#### Scenario: The page is a document
- **WHEN** the week 1 main quiz is analyzed
- **THEN** the marked answer is the hypertext document and not the network, the application, or the ledger
### Requirement: Rezerva nedelje istorije
The week 1 reserve MUST ask whether a late video frame waits for the byte. The marked answer MUST say the frame may be dropped and a document may not lose a byte. The reserve MUST stay closed until the teacher opens it.

#### Scenario: Reserve starts closed
- **WHEN** the teacher has not opened the week 1 reserve
- **THEN** the reserve is not shown

#### Scenario: Frame may drop
- **WHEN** the teacher opens the week 1 reserve and reaches analysis
- **THEN** the marked answer says the frame may be dropped and a document may not lose a byte
### Requirement: Izlaz nedelje istorije
The week 1 exit MUST be a sentence asking what hypertext is, how TCP differs from UDP, and what Ajax adds that the first page does not have. It MUST NOT offer options, a text field, or a mark.

#### Scenario: Exit stays a sentence
- **WHEN** the teacher reaches the week 1 exit
- **THEN** the page shows that sentence and no text field and no options
