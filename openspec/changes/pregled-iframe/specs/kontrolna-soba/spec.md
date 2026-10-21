# Spec Delta

## ADDED Requirements

### Requirement: Soba mašina je školjka
The preview MUST show one machine room beside the iframe once the server lecture has started. That room MUST show the box temperature and one fan. It MUST NOT be a file from the editor. It MUST follow the live process. Before the server lecture the machine room MUST stay hidden.

#### Scenario: Document without a fan
- **WHEN** the loaded client document has no fan and the server lecture is open
- **THEN** the shell machine room still shows one fan

#### Scenario: Fan is absent before the server lecture
- **WHEN** the lecture has not yet introduced the Node server
- **THEN** the machine room is hidden

## MODIFIED Requirements

### Requirement: Jedan panel i dve sobe
The preview MUST show the client document in the iframe and, once the server exists, one shell machine room. The machine room shows the fan. The box MUST remain one temperature and one fan. The preview MUST NOT add a second device, a second room, or a second fan.

#### Scenario: Fan is absent before the server
- **WHEN** the lecture has not yet introduced the Node server
- **THEN** the shell does not draw fan blades

#### Scenario: Fan appears with the server
- **WHEN** the lecture has introduced the running server
- **THEN** the shell machine room shows one fan whose blades spin only while the remote mode is on

### Requirement: Čitanje sobe
A successful room read MUST return HTTP 200 with the temperature and the fan mode as JSON text. The shell preview MUST NOT paint dashes or digits. A loaded document that parses the response MUST update its own display from that text.

#### Scenario: Direct read before fetch
- **WHEN** the teacher opens the room read in the browser address bar
- **THEN** the response is HTTP/1.1 with status 200 and a JSON body that contains the temperature and the mode

#### Scenario: Switch display follows the read
- **WHEN** the loaded document completes a successful read
- **THEN** its display shows the digits from that response, and the shell does not paint digits or take the temperature from a machine-room feed

### Requirement: Neuspešno čitanje
A read while the fan is unplugged MUST return HTTP 500 and MUST NOT include a temperature for a switch display. The shell MUST NOT paint Err. A loaded document that handles this failure MAY show Err. While the request is in flight, the shell MUST NOT change the iframe. An absent response MUST remain distinct from HTTP 500.

#### Scenario: Unplugged fan
- **WHEN** the fan is unplugged and a client requests the room
- **THEN** the response status is 500 and the shell does not paint Err

#### Scenario: Process is down
- **WHEN** the Node process is not running and the browser sends a read
- **THEN** the network record has no HTTP status from that process

### Requirement: Komanda željenog stanja
The command MUST send the desired fan state as a JSON object whose only field is a boolean. A successful command MUST return HTTP 200 and only the mode. It MUST NOT return a temperature and MUST NOT write a temperature onto a display. The shell fan MUST follow the remote mode. Repeating the same desired state MUST leave that state in place.

#### Scenario: Operator turns the fan on
- **WHEN** an authorized command sends the desired state on and the fan is plugged in
- **THEN** the response is HTTP 200 with only the mode and the shell blades follow that remote mode

#### Scenario: Command body is not a mode
- **WHEN** the command body is not JSON, or is JSON that is not exactly one boolean field for the desired state
- **THEN** the response is HTTP 400, the body is not a mode, and the stored mode is unchanged

#### Scenario: Turn on while unplugged
- **WHEN** the command asks to turn the fan on while it is unplugged
- **THEN** the response is HTTP 500 and the stored mode is not turned on by the shell

### Requirement: Svežina očitavanja
Once freshness is part of the lecture, a successful read MUST include the moment of the reading. The shell MUST NOT paint that age and MUST NOT add a periodic-reading control. While the freshness check is on, a reading with an older moment MUST NOT replace a reading with a newer moment in a document that implements that check. While the check is off, an older moment that arrives later MUST replace the newer reading in that document. A command response MUST NOT refresh a temperature the shell paints, because the shell paints none.

#### Scenario: Late older reading
- **WHEN** the freshness check is on and a slower read that was measured earlier arrives after a faster newer read
- **THEN** a document that implements the check keeps the newer temperature, and the shell paints neither

#### Scenario: Check is off
- **WHEN** the freshness check is off and an older moment arrives after a newer one
- **THEN** a document that implements the check shows the older temperature

#### Scenario: Periodic read
- **WHEN** the teacher turns on periodic reading
- **THEN** the shell does not send a repeated room read, and a control in the loaded document that turns periodic reading on sends one read immediately and then repeats it

### Requirement: Sesija nosi ključ
The shell MUST NOT offer observer or operator controls. A control in the loaded document that chooses a prepared role MUST make the box send an HttpOnly cookie with an opaque key. The box MUST keep the role in its own map and MUST NOT trust a role name sent by the browser.

#### Scenario: Cookie does not carry the role name
- **WHEN** the loaded document chooses operator
- **THEN** the box sends an HttpOnly cookie and decides the role from its own map

### Requirement: Dovod sobe mašina
The page MUST receive the box temperature and mode through a one-way feed that updates only the shell machine-room display and the blades. The lecture MUST NOT name that feed. The iframe display MUST ignore it unless the loaded document reads the room itself. Server-sent events and WebSocket MAY be named as other ways to feed a switch room and MUST NOT be that feed.

#### Scenario: Machine room moves without a read
- **WHEN** the box temperature or mode changes and the loaded document has not read again
- **THEN** the machine-room display and the blades follow the box

### Requirement: Prag upozorenja
The shell MUST NOT show a warning threshold. A threshold in the loaded document MUST NOT add a device, a room, or a fan.

#### Scenario: Threshold sits beside the reading
- **WHEN** the lecture has introduced the warning threshold
- **THEN** the shell does not show a threshold number, and the preview shows one only when the loaded document shows it beside the temperature

### Requirement: Istorija na panelu
The shell MUST NOT list stored commands. A command whose write was withdrawn MUST NOT appear in a list the loaded document shows.

#### Scenario: Stored commands are listed
- **WHEN** a command has been stored in a successful unit
- **THEN** the shell does not list that command, and a list in the loaded document includes it

#### Scenario: Withdrawn command stays off the list
- **WHEN** the history write in a unit fails and the loaded document lists commands
- **THEN** that command is absent from that list

### Requirement: Font displeja
The shell machine-room temperature and a temperature the loaded document shows MUST render with Digital-7 Mono (Style-7). The course MUST be allowed to embed that font for educational use.

#### Scenario: Both rooms use the face
- **WHEN** the shell machine room and the loaded document both show a temperature
- **THEN** both displays use Digital-7 Mono

### Requirement: Različita svežina ikonice
The shell MUST NOT draw a fan icon. A fan icon and a temperature in the loaded document MUST be allowed different freshness lifetimes. A fresh fan icon MUST NOT reset the age of the temperature.

#### Scenario: Icon is fresh and the number is old
- **WHEN** the loaded document shows a fresh fan icon and a temperature reading that is ten minutes old
- **THEN** the temperature age stays ten minutes

### Requirement: Tri stanja čitanja
The shell MUST NOT paint waiting, data, or error on a switch display. A read painted by the loaded document, from the lecture that introduces read failure, MUST be waiting, data, or error. Waiting MUST keep the glyphs that document already showed. Data MUST show the digits of a successful read. Error MUST show Err.

#### Scenario: Waiting keeps glyphs
- **WHEN** a read is in flight during that lecture
- **THEN** the shell does not replace the dashes, digits, or Err the loaded document already showed

#### Scenario: Data and error
- **WHEN** the loaded document finishes a read with HTTP 200, or with a non-success status
- **THEN** that document shows digits for HTTP 200 and Err for a non-success status
