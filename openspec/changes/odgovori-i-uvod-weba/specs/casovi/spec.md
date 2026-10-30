# Spec Delta

## REMOVED Requirements

### Requirement: Osvrt časova 1 do 3
**Reason**: The review only names topics. Week 1 now teaches the Web, the Internet, and a short history; semantic HTML, accessibility, and the sketch stay as existing steps.
**Migration**: Do not show the name list. Do not add lessons for the lecture 2 and lecture 3 names that were only in the review.

### Requirement: Osvrt časova 4 i 5
**Reason**: The page no longer names untaught survey topics.
**Migration**: Do not show the name list. The ban on a microtask-order quiz moves to „Čas ne gradi izostavljene alate”.

### Requirement: Osvrt časova 6 do 8
**Reason**: The page no longer names untaught survey topics.
**Migration**: Do not show the name list. The ban on database administration stays in „Čas ne gradi izostavljene alate”. Lecture 8 no longer names SSE or WebSocket.

### Requirement: Osvrt časova 9 i 10
**Reason**: The page no longer names untaught survey topics.
**Migration**: Do not show the name list. Lecture 9 still has no login form and no built attack. Lecture 10 still does not deploy live. The type-and-assistant sentence stays in the lecture 10 step.

## ADDED Requirements

### Requirement: Tema 1 počinje Webom
The first three steps of week 1 MUST be titled Web, Internet, and Istorija, in that order. Each MUST be a figure step and MUST name no file. Podela MUST be the next step.

#### Scenario: Opening order
- **WHEN** the teacher opens week 1
- **THEN** the first four steps are Web, Internet, Istorija, and Podela

### Requirement: Korak Web
The Web step MUST teach that the Web is documents a browser fetches by a URL and draws, and that the display is not the document. Its figure MUST show the browser, the URL, the document, and the display.

#### Scenario: Web figure
- **WHEN** the teacher opens Web
- **THEN** the figure shows those four parts and the quiz answers are still unmarked

#### Scenario: Display is not the document
- **WHEN** the teacher reveals the Web quiz
- **THEN** the marked answer says the display is not the document

### Requirement: Korak Internet
The Internet step MUST teach that the Internet is the network and the Web is one service on it. Its figure MUST place the network between the browser and the document. The step MUST NOT ask for a reconstruction of DNS or TLS.

#### Scenario: Network sits between
- **WHEN** the teacher opens Internet
- **THEN** the figure shows the network between the browser and the document

#### Scenario: Marked answer separates them
- **WHEN** the teacher reveals the Internet quiz
- **THEN** the marked answer says the Internet and the Web are not the same thing

### Requirement: Korak Istorija
The Istorija step MUST show a timeline with a packet network in 1969, TCP/IP in 1983, the linked-document proposal in 1989, the public Web in 1991, and this course's page while `server/` is still empty.

#### Scenario: Timeline order
- **WHEN** the teacher opens Istorija
- **THEN** those marks are visible in that chronological order

#### Scenario: Packet network is not the Web
- **WHEN** the teacher reveals the Istorija quiz
- **THEN** the marked answer says the 1969 packet network is not the Web

### Requirement: Minuti teme 1
The minute labels of the week 1 steps MUST sum to that week's minute budget.

#### Scenario: Sum is the budget
- **WHEN** the shipped week 1 is read
- **THEN** its step minute labels sum to 90

### Requirement: Nema bloka osvrta
No lecture MUST show a review block or a control labeled Osvrt.

#### Scenario: The word is absent
- **WHEN** the teacher opens any step of any lecture
- **THEN** the page has no control labeled Osvrt and no survey-name list

### Requirement: Čas ne gradi izostavljene alate
The lectures MUST NOT quiz microtask order, MUST NOT teach database administration, and MUST NOT include a login form or a built attack.

#### Scenario: No microtask quiz
- **WHEN** the teacher opens lecture 5
- **THEN** the page has no quiz of microtask execution order

#### Scenario: No database administration
- **WHEN** the teacher opens lecture 7
- **THEN** the lecture does not teach database administration

#### Scenario: No login and no attack
- **WHEN** the teacher opens lecture 9
- **THEN** the page has no login form and no built attack

## MODIFIED Requirements

### Requirement: Tema ima naslov i korake
The course MUST be one document that sets its duration as a number of weeks and lists that many weeks, in order, each with a title. The shell MUST use that duration and MUST NOT hardcode a week count. The shipped document MUST set the duration to ten, use the titles below, and give each week 10 to 20 steps. A step that names a file MUST be one fragment, not the whole week. The minute budget MUST stay a teaching label and MUST NOT be a timer.

#### Scenario: Titles are visible
- **WHEN** the teacher opens the shipped course
- **THEN** the weeks appear in order as: Šta browser prikazuje; JavaScript opisuje stanje; Događaji povezuju korisnika; Od naivnog prenosa do HTTP-a, pa Node; Čekanje i neuspeh; Komande i ponavljanje; Trajno stanje i Docker; Koliko je prikaz svež; Ko sme da upravlja; Ceo sistem

#### Scenario: A lecture is a sequence of steps
- **WHEN** the teacher opens any week of the shipped course
- **THEN** that week shows between 10 and 20 steps, week 1 shows 20, and every step except Web, Internet, and Istorija names the file it changes

#### Scenario: Figure steps name no file
- **WHEN** the teacher opens Web, Internet, or Istorija
- **THEN** that step names no file

#### Scenario: Duration follows the document
- **WHEN** a course document sets a duration other than ten and lists that many weeks
- **THEN** the course reports that duration and those weeks, with no shell change

### Requirement: Redosled unutar koraka
A step that names a file MUST show its prose, then the key-idea callout, then the code snippet, then a short quiz with unmarked answers. The snippet MUST be the fragment added to the named file. A figure step MUST show its prose, then the key-idea callout, then the figure, then a short quiz with unmarked answers, and MUST NOT show a snippet. The example MUST remain checkable on its own, in the manner of `setTimeout` inside a `for` loop.

#### Scenario: Explanation comes after the guess
- **WHEN** a step that names a file is opened
- **THEN** the prose, the key idea, and the snippet are visible, and the quiz answers are still unmarked

#### Scenario: Figure comes after the key idea
- **WHEN** a figure step is opened
- **THEN** the prose, the key idea, and the figure are visible before the quiz, and no snippet is shown

#### Scenario: Key idea is visible before the quiz
- **WHEN** a step that names a file is opened
- **THEN** the key idea and the snippet are above the quiz, and the snippet is the fragment added to the named file

### Requirement: Arhitektura na početku
The first step of week 1 MUST be titled Web and MUST name no file. Podela MUST keep its original as the two lines `client/` and `server/`. `client/` MUST be what the browser loads. `server/` MUST be what Node runs, from week 4. Until week 4 the Server tab MUST be absent. The course MUST NOT start by writing the whole application in one file.

#### Scenario: Empty server folder
- **WHEN** the teacher is still before the server lecture
- **THEN** the Server tab is absent and the browser is loading only `client/`

#### Scenario: Podela names the folders
- **WHEN** the teacher opens Podela
- **THEN** its original is `client/` and `server/`

#### Scenario: First step is Web
- **WHEN** the teacher opens the first step of week 1
- **THEN** the step is titled Web and names no file

#### Scenario: Server tab arrives with Node
- **WHEN** the teacher opens week 4
- **THEN** the Server tab is present

### Requirement: Rezerva časa 10
Lecture 10 MUST keep the note about a type and an assistant suggestion as a sentence in that lecture. It MUST NOT open a second vote for that note. The page MUST NOT place that sentence in a review block.

#### Scenario: No second vote
- **WHEN** the main discussion of lecture 10 has used the time
- **THEN** the type and assistant note stays a sentence in the lecture and no reserve quiz opens

### Requirement: Čas 8 ponavlja čitanje
Turning periodic reading on MUST send one read immediately and then repeat it. A failed round MUST show Err by the same branch as the single read. The machine-room feed MUST stay unnamed and MUST NOT drive the switch display. The lecture MUST NOT build SSE or WebSocket and MUST NOT name them on the page.

#### Scenario: Periodic read starts at once
- **WHEN** the teacher turns periodic reading on
- **THEN** one read is sent immediately and a failed round shows Err

#### Scenario: Push is not named
- **WHEN** the teacher opens lecture 8
- **THEN** the page does not name SSE or WebSocket and the switch display is still fed by reading

### Requirement: Panel ne dobija drugi uređaj
Every lecture MUST keep one room pair, one temperature reading, and one fan. A later lecture MUST add data to that same panel. A lecture MUST NOT add a second scored quiz.

#### Scenario: After the last lecture
- **WHEN** the teacher finishes lecture 10
- **THEN** the panel still has one switch room, one machine room, one temperature, and one fan

### Requirement: Tema 1 sklapa stranicu
Week 1 MUST follow Istorija with Podela and then these steps, in order: Stranica, Glava, Telo, Naslov, Broj, Dugme, Veza, Selektor, Okvir, Unutra, Spolja, Osvežavanje, Alati, Dva zahteva, Soba prekidača, Semantika. Veza MUST add the link to the stylesheet. The original of each of these steps MUST be the whole file after that step. Weeks 2 through 10 MUST keep each step's stored fragment as its contribution. The editor MUST show the snapshot of that file through the step.

#### Scenario: Week 1 order
- **WHEN** the teacher opens week 1
- **THEN** the steps are Web, Internet, Istorija, Podela, Stranica, Glava, Telo, Naslov, Broj, Dugme, Veza, Selektor, Okvir, Unutra, Spolja, Osvežavanje, Alati, Dva zahteva, Soba prekidača, and Semantika, in that order

#### Scenario: Later week keeps its code
- **WHEN** the teacher opens a step in week 2 or later
- **THEN** that step still stores its own fragment, and the editor's built-in version of its file is the snapshot through that step rather than the finished file on disk

#### Scenario: Week 1 original is the whole file
- **WHEN** the teacher shows the original of Broj in week 1
- **THEN** the original is the whole HTML file after that step, including the page begun in Stranica
