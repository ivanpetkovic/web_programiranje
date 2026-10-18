# kontrolna-soba Specification

## Purpose

Jedan panel kontrolne sobe deli prikaz sa kutijom: soba prekidača čita, soba mašina drži ventilator, a stanje preživi restart procesa tek kad je upisano u bazu.

## Requirements

### Requirement: Jedan panel i dve sobe
Panel MUST show one switch room and, once the server exists, one machine room. The switch room shows temperature and one control for the desired fan state. The machine room shows the fan. The panel MUST NOT add a second device, a second room, or a second fan.

#### Scenario: Fan is absent before the server
- **WHEN** the lecture has not yet introduced the Node server
- **THEN** the panel draws only the switch room and does not draw fan blades

#### Scenario: Fan appears with the server
- **WHEN** the lecture has introduced the running server
- **THEN** the machine room shows one fan whose blades spin only while the remote mode is on

### Requirement: Čitanje sobe
A successful room read MUST return HTTP 200 with the temperature and the fan mode as JSON text. The browser MUST parse that text before updating the switch-room display. Before the first successful read, that display MUST show dashes. A successful read MUST then show that reading's digits.

#### Scenario: Direct read before fetch
- **WHEN** the teacher opens the room read in the browser address bar
- **THEN** the response is HTTP/1.1 with status 200 and a JSON body that contains the temperature and the mode

#### Scenario: Switch display follows the read
- **WHEN** the switch room completes a successful read
- **THEN** its display shows the digits from that response and does not take the temperature from the machine-room feed

### Requirement: Neuspešno čitanje
A read while the fan is unplugged MUST return HTTP 500 and MUST NOT include a temperature for the switch display. From the lecture that introduces this failure, the switch display MUST show Err. While the request is in flight, the switch display MUST keep the dashes, digits, or Err it already showed. An absent response MUST remain distinct from HTTP 500.

#### Scenario: Unplugged fan
- **WHEN** the fan is unplugged and the switch room reads the room
- **THEN** the response status is 500 and the switch display shows Err

#### Scenario: Process is down
- **WHEN** the Node process is not running and the browser sends a read
- **THEN** the network record has no HTTP status from that process

### Requirement: Komanda željenog stanja
The command MUST send the desired fan state as a JSON object whose only field is a boolean. A successful command MUST return HTTP 200 and only the mode. It MUST NOT return a temperature and MUST NOT write a temperature onto the switch display. Repeating the same desired state MUST leave that state in place.

#### Scenario: Operator turns the fan on
- **WHEN** an authorized command sends the desired state on and the fan is plugged in
- **THEN** the response is HTTP 200 with only the mode and the blades follow that remote mode

#### Scenario: Command body is not a mode
- **WHEN** the command body is not JSON, or is JSON that is not exactly one boolean field for the desired state
- **THEN** the response is HTTP 400, the body is not a mode, and the stored mode is unchanged

#### Scenario: Turn on while unplugged
- **WHEN** the command asks to turn the fan on while it is unplugged
- **THEN** the response is HTTP 500, the blades do not spin, and the switch may stay on

### Requirement: Takt kutije
Once waiting on a response is part of the lecture, the box process MUST change the temperature on its own interval. The temperature MUST rise while the mode is off and fall while the mode is on. The tick MUST NOT be caused by the fan animation. An unplugged fan MUST leave the mode off, so the temperature still rises. Before that interval exists, the box MUST hold the temperature still.

#### Scenario: Mode off
- **WHEN** the interval is running and the mode is off
- **THEN** a later read returns a higher temperature

#### Scenario: Front step is no longer the source
- **WHEN** the box owns the temperature
- **THEN** the front-only next-step control no longer supplies the displayed reading

### Requirement: Svežina očitavanja
Once freshness is part of the lecture, a successful read MUST include the moment of the reading and the display MUST show its age. While the freshness check is on, a reading with an older moment MUST NOT replace a reading with a newer moment. While the check is off, an older moment that arrives later MUST replace the newer reading. A command response MUST NOT refresh the switch-room temperature.

#### Scenario: Late older reading
- **WHEN** the freshness check is on and a slower read that was measured earlier arrives after a faster newer read
- **THEN** the switch display keeps the newer temperature

#### Scenario: Check is off
- **WHEN** the freshness check is off and an older moment arrives after a newer one
- **THEN** the switch display shows the older temperature

#### Scenario: Periodic read
- **WHEN** the teacher turns on periodic reading
- **THEN** the panel sends one read immediately and then repeats it, and the single-read button still sends one read

### Requirement: Sesija nosi ključ
From the authorization lecture, the panel MUST offer the prepared roles observer and operator. Choosing a role MUST make the box send an HttpOnly cookie with an opaque key. The box MUST keep the role in its own map and MUST NOT trust a role name sent by the browser.

#### Scenario: Cookie does not carry the role name
- **WHEN** the teacher chooses operator
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
The page MUST receive the box temperature and mode through a one-way feed that updates only the machine-room display and the blades. The lecture MUST NOT name that feed. The switch-room display MUST ignore it. Server-sent events and WebSocket MAY be named as other ways to feed the switch room and MUST NOT be that feed.

#### Scenario: Machine room moves without a read
- **WHEN** the box temperature or mode changes and the switch room has not read again
- **THEN** the machine-room display and the blades follow the box, and the switch-room digits stay as they were

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
Once the lecture shows the warning threshold, the panel MUST show that threshold as a number beside the temperature. The threshold MUST NOT add a device, a room, or a fan.

#### Scenario: Threshold sits beside the reading
- **WHEN** the lecture has introduced the warning threshold
- **THEN** the switch room shows the threshold number next to the temperature

### Requirement: Istorija na panelu
Once commands are stored, the panel MUST list those commands beside the same fan. A command whose write was withdrawn MUST NOT appear in that list.

#### Scenario: Stored commands are listed
- **WHEN** a command has been stored in a successful unit
- **THEN** the panel list includes that command

#### Scenario: Withdrawn command stays off the list
- **WHEN** the history write in a unit fails
- **THEN** that command is absent from the panel list

### Requirement: Font displeja
Both temperature displays MUST render with Digital-7 Mono (Style-7). The course MUST be allowed to embed that font for educational use.

#### Scenario: Both rooms use the face
- **WHEN** the switch room and the machine room both show a temperature
- **THEN** both displays use Digital-7 Mono

### Requirement: Različita svežina ikonice
The fan icon and the temperature MUST be allowed different freshness lifetimes. A fresh fan icon MUST NOT reset the age of the temperature.

#### Scenario: Icon is fresh and the number is old
- **WHEN** the fan icon is fresh and the temperature reading is ten minutes old
- **THEN** the temperature age stays ten minutes

### Requirement: Drugi klik tokom čekanja
While a read is still waiting, another control on the page MUST remain usable. The wait MUST NOT freeze the rest of the page.

#### Scenario: Second click during await
- **WHEN** a read has not finished and the teacher activates another control
- **THEN** that control still runs

### Requirement: Tri stanja čitanja
From the lecture that introduces read failure, a read on the switch display MUST be waiting, data, or error. Waiting MUST keep the glyphs already shown. Data MUST show the digits of a successful read. Error MUST show Err.

#### Scenario: Waiting keeps glyphs
- **WHEN** a read is in flight during that lecture
- **THEN** the switch display keeps the dashes, digits, or Err it already showed

#### Scenario: Data and error
- **WHEN** the read finishes with HTTP 200, or with a non-success status
- **THEN** HTTP 200 shows digits and a non-success status shows Err

### Requirement: Uloga uz isti ključ
The editor MUST be able to change the role stored for a key. The next command MUST follow that role while the browser keeps the same cookie.

#### Scenario: Same cookie, new role
- **WHEN** the teacher saves a different role for the key already in the cookie and sends the same command
- **THEN** the status follows the new role and the cookie value is unchanged
