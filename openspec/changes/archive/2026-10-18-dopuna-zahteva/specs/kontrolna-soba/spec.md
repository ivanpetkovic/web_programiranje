# Spec Delta

## MODIFIED Requirements

### Requirement: Jedan panel i dve sobe
Panel MUST show one switch room and, once the server exists, one machine room. The switch room shows temperature and one control for the desired fan state. The machine room shows the fan. The panel MUST NOT add a second device, a second room, or a second fan.

#### Scenario: Fan is absent before the server
- **WHEN** the lecture has not yet introduced the Node server
- **THEN** the panel draws only the switch room and does not draw fan blades

#### Scenario: Fan appears with the server
- **WHEN** the lecture has introduced the running server
- **THEN** the machine room shows one fan whose blades spin only while the remote mode is on

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

## ADDED Requirements

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
