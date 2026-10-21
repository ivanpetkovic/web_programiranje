# kontrolna-soba Specification

## Purpose

Jedan panel kontrolne sobe deli prikaz sa kutijom: soba prekidača čita, soba mašina drži ventilator, a stanje preživi restart procesa tek kad je upisano u bazu.

## Requirements

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

### Requirement: Takt kutije
Once waiting on a response is part of the lecture, the box process MUST change the temperature on its own interval. The temperature MUST rise while the mode is off and fall while the mode is on. The tick MUST NOT be caused by the fan animation. An unplugged fan MUST leave the mode off, so the temperature still rises. Before that interval exists, the box MUST hold the temperature still.

#### Scenario: Mode off
- **WHEN** the interval is running and the mode is off
- **THEN** a later read returns a higher temperature

#### Scenario: Front step is no longer the source
- **WHEN** the box owns the temperature
- **THEN** the front-only next-step control no longer supplies the displayed reading

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

### Requirement: Komanda zavisi od uloge
A room read MUST NOT require a session. A command without a cookie MUST return 401. A command from the observer MUST return 403. The box MUST check the body only after the role check. Hiding the button MUST NOT stop a command sent outside the screen.

#### Scenario: Observer is refused
- **WHEN** the observer session sends a command
- **THEN** the response is 403 and the mode is unchanged

#### Scenario: Operator is accepted
- **WHEN** the operator session sends a valid desired state and the fan is plugged in
- **THEN** the response is 200 and only the mode

### Requirement: Trajno stanje
Once the database is part of the lecture, the mode and the command history MUST be stored in PostgreSQL. The mode write and the history write MUST be one unit: both succeed or both are withdrawn. The browser MUST NOT receive database credentials. After a successful unit, restarting only the Node process MUST keep the mode. Removing the database storage MUST drop it.

#### Scenario: Process restart
- **WHEN** a command has been stored in one successful unit and only the Node process restarts
- **THEN** the next read returns the same mode

#### Scenario: Second write fails
- **WHEN** the history write in the same unit fails
- **THEN** the mode write from that unit is not kept

### Requirement: Dovod sobe mašina
The page MUST receive the box temperature and mode through a one-way feed that updates only the shell machine-room display and the blades. The lecture MUST NOT name that feed. The iframe display MUST ignore it unless the loaded document reads the room itself. Server-sent events and WebSocket MAY be named as other ways to feed a switch room and MUST NOT be that feed.

#### Scenario: Machine room moves without a read
- **WHEN** the box temperature or mode changes and the loaded document has not read again
- **THEN** the machine-room display and the blades follow the box

### Requirement: Imena ruta
The room read MUST be `GET /api/soba`. The command MUST be `PUT /api/ventilator`. The command JSON MUST use the boolean field `ukljucen` as the desired state.

#### Scenario: Named read
- **WHEN** the teacher opens `/api/soba`
- **THEN** the response is HTTP/1.1 and the JSON body uses `temperatura` and `ukljucen`

#### Scenario: Named command
- **WHEN** an authorized command sends `{ "ukljucen": true }` and the fan is plugged in
- **THEN** the response is HTTP 200 and the JSON body is only `{ "ukljucen": true }`

### Requirement: Granica i neispravan JSON
Before the box treats a command body as a desired state, it MUST reject a body over the size limit and a body that is not JSON. Both refusals MUST be HTTP 400 and MUST leave the stored mode unchanged.

#### Scenario: Body is too large
- **WHEN** the command body exceeds the size limit
- **THEN** the response is HTTP 400 and the mode is unchanged

#### Scenario: Body is not JSON
- **WHEN** the command body is not JSON
- **THEN** the response is HTTP 400, the body is not a mode, and the mode is unchanged

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

### Requirement: Drugi klik tokom čekanja
While a read is still waiting, another control on the page MUST remain usable. The wait MUST NOT freeze the rest of the page.

#### Scenario: Second click during await
- **WHEN** a read has not finished and the teacher activates another control
- **THEN** that control still runs

### Requirement: Tri stanja čitanja
The shell MUST NOT paint waiting, data, or error on a switch display. A read painted by the loaded document, from the lecture that introduces read failure, MUST be waiting, data, or error. Waiting MUST keep the glyphs that document already showed. Data MUST show the digits of a successful read. Error MUST show Err.

#### Scenario: Waiting keeps glyphs
- **WHEN** a read is in flight during that lecture
- **THEN** the shell does not replace the dashes, digits, or Err the loaded document already showed

#### Scenario: Data and error
- **WHEN** the loaded document finishes a read with HTTP 200, or with a non-success status
- **THEN** that document shows digits for HTTP 200 and Err for a non-success status

### Requirement: Uloga uz isti ključ
The editor MUST be able to change the role stored for a key. The next command MUST follow that role while the browser keeps the same cookie.

#### Scenario: Same cookie, new role
- **WHEN** the teacher saves a different role for the key already in the cookie and sends the same command
- **THEN** the status follows the new role and the cookie value is unchanged

### Requirement: Soba mašina je školjka
The preview MUST show one machine room beside the iframe once the server lecture has started. That room MUST show the box temperature and one fan. It MUST NOT be a file from the editor. It MUST follow the live process. Before the server lecture the machine room MUST stay hidden.

#### Scenario: Document without a fan
- **WHEN** the loaded client document has no fan and the server lecture is open
- **THEN** the shell machine room still shows one fan

#### Scenario: Fan is absent before the server lecture
- **WHEN** the lecture has not yet introduced the Node server
- **THEN** the machine room is hidden
