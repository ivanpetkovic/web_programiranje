# kontrolna-soba Specification

## Purpose

Jedan panel kontrolne sobe deli prikaz sa kutijom: soba prekidača čita, soba mašina drži ventilator, a stanje preživi restart procesa tek kad je upisano u bazu.

## Requirements

### Requirement: Jedan panel i dve sobe
Panel MUST show one switch room and, once the server exists, one machine room. The switch room shows temperature, humidity is not required, and one control for the desired fan state. The machine room shows the fan. The panel MUST NOT add a second device, a second room, or a second fan.

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
Once freshness is part of the lecture, a successful read MUST include the moment of the reading and the display MUST show its age. A reading with an older moment MUST NOT replace a reading with a newer moment. A command response MUST NOT refresh the switch-room temperature.

#### Scenario: Late older reading
- **WHEN** a slower read that was measured earlier arrives after a faster newer read
- **THEN** the switch display keeps the newer temperature

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
