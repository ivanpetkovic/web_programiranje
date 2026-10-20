# Spec Delta

## ADDED Requirements

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

## RENAMED Requirements

- FROM: `### Requirement: Pitalice prvih pet časova`
- TO: `### Requirement: Pitalice časova 2 do 6`
- FROM: `### Requirement: Pitalice drugih pet časova`
- TO: `### Requirement: Pitalice časova 7 do 11`
- FROM: `### Requirement: Izlaz časa 10`
- TO: `### Requirement: Izlaz časa 11`

## MODIFIED Requirements

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
