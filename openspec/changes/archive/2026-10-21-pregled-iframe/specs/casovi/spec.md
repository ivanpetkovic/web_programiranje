# Spec Delta

## MODIFIED Requirements

### Requirement: Čas 2 prikazuje dokument
The week titled Šta browser prikazuje MUST show the loaded client document and nothing the shell adds. The temperature MUST be the static content of `client/index.html`, the number 24, once that document contains it. The shell MUST NOT draw the switch room, the machine room, or the fan. Starting Node MUST NOT be part of this lecture. Refreshing the preview MUST restore the editor document. A change made only in the browser tools MUST be described as a change to the local display.

#### Scenario: Refresh restores 24
- **WHEN** the loaded document contains 24 and the teacher changes the visible 24 to 10 in the browser tools and refreshes the preview
- **THEN** the iframe shows 24 again

#### Scenario: Empty step shows no shell room
- **WHEN** the open step's `client/index.html` is empty
- **THEN** the preview is blank and does not show a heading, a number, or a button

#### Scenario: No room request
- **WHEN** the week titled Šta browser prikazuje is open and the loaded document does not request the room
- **THEN** the network record shows no room API request

### Requirement: Čas 5 crta kutiju tek posle servera
The shell MUST draw the machine room and its fan beside the iframe only after that server is running. That room is not a file from the editor. From this lecture the server MUST own the temperature, and the room module on disk MUST be the text of the active Moj kod / Lekcija switch. The week 5 fragment MUST NOT contain the Err branch, so a failed read leaves the document's own display unchanged by an Err branch.

#### Scenario: Known path and unknown path
- **WHEN** the saved room module is running
- **THEN** the known path returns the temperature and the mode, and an unknown path returns 404

#### Scenario: No Err branch yet
- **WHEN** a read fails during week 5 and the loaded document has no Err branch
- **THEN** the iframe does not show Err from the shell

### Requirement: Čas 9 ponavlja čitanje
The shell MAY offer the periodic-reading control on this lecture. A control that turns periodic reading on MUST send one read immediately and then repeat it. A failed round MUST show Err by the same branch as the single read when that branch exists. The machine-room feed MUST stay unnamed. The shell machine room MUST follow that feed. The lecture MUST NOT build SSE or WebSocket and MUST NOT name them on the page.

#### Scenario: Periodic read starts at once
- **WHEN** the loaded document turns periodic reading on
- **THEN** one read is sent immediately and a failed round shows Err only by that document's branch

#### Scenario: Push is not named
- **WHEN** the teacher opens the week titled Koliko je prikaz svež
- **THEN** the page does not name SSE or WebSocket

### Requirement: Panel ne dobija drugi uređaj
The preview MUST keep one shell machine room, one temperature on that room, and one fan. The iframe MUST NOT add a second fan. A lecture MUST NOT add a second scored quiz.

#### Scenario: After the last lecture
- **WHEN** the teacher finishes week 11
- **THEN** the preview still has one shell machine room, one temperature, and one fan beside the iframe
