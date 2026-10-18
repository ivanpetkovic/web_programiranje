# Spec Delta

## ADDED Requirements

### Requirement: Preduslov nedelje
Each lecture MUST name a prerequisite and an outcome. Lecture 1's prerequisite MUST be the split between `client/` and an empty `server/`. Each later lecture's prerequisite MUST be the outcome the previous lecture already reached.

#### Scenario: Later lecture names the previous outcome
- **WHEN** the teacher opens lecture 2 or any later lecture
- **THEN** its prerequisite is the outcome already reached and its own outcome is shown

### Requirement: Rezerve prvih pet časova
Lecture 1's reserve MUST ask whether the content stays visible when CSS does not arrive. Lecture 2's reserve MUST ask about strict comparison of the temperature number and its text. Lecture 3's reserve MUST separate a listener that receives a function from one that receives an immediate call. Lecture 4's reserve MUST compare status 404 with a stopped process that has no HTTP status. Lecture 5's reserve MUST ask whether another click works while the first read is still waiting.

#### Scenario: Lecture 4 reserve
- **WHEN** the teacher opens the lecture 4 reserve
- **THEN** the question compares a missing path that returns 404 with a stopped process that has no status

### Requirement: Rezerve časova 6 do 9
Lecture 6's reserve MUST send a body the form does not offer, with text instead of a boolean. Lecture 7's reserve MUST refuse giving database credentials to the browser. Lecture 8's reserve MUST compare the freshness of the fan icon with the freshness of the reading. Lecture 9's reserve MUST separate a browser that cannot read a body from a server that stays silent.

#### Scenario: Lecture 6 reserve
- **WHEN** the teacher opens the lecture 6 reserve
- **THEN** the counterexample is a command body whose field is text rather than a boolean

### Requirement: Rezerva časa 10
Lecture 10 MUST keep the note about a type and an assistant suggestion in the review. It MUST NOT open a second vote for that note.

#### Scenario: No second vote
- **WHEN** the main discussion of lecture 10 has used the time
- **THEN** the type and assistant note stays a sentence in the review and no reserve quiz opens

### Requirement: Izlaz časa 10
The lecture 10 exit MUST ask where the right is checked, where the state lives, and what a missing response does not prove.

#### Scenario: Exit asks three things
- **WHEN** the teacher reaches the lecture 10 exit
- **THEN** the prompt asks for the right, the state, and what silence does not prove

### Requirement: Osvrt časova 1 do 3
The lecture 1 review MUST name Internet naspram Weba, put od URL-a do prikaza, semantički HTML, osnovnu pristupačnost i skicu. The lecture 2 review MUST name dinamičke tipove, mesto TypeScript provere, JS okruženja i dve verzije iste funkcije. The lecture 3 review MUST name responsive prikaz, jedinice, animaciju, pristupačnu formu, klase i `this`, i komponentu kao razlog biblioteke. The site MUST NOT build those topics.

#### Scenario: Lecture 1 names the map
- **WHEN** the teacher opens the lecture 1 review
- **THEN** the named topics are visible and none of them is a working tool in the panel

### Requirement: Osvrt časova 4 i 5
The lecture 4 review MUST name IP, UDP, TLS, HTTP/2, HTTP/3, XML, SOAP, RPC, gRPC, GraphQL, Express i middleware. The lecture 5 review MUST name a spoljni API, timeout, prekid jednog zahteva, više zahteva odjednom, call stack i postojanje task i microtask redova. The lecture MUST NOT quiz microtask order. The site MUST NOT build those topics.

#### Scenario: No microtask quiz
- **WHEN** the teacher opens the lecture 5 review
- **THEN** the queues are named and the page has no quiz of their execution order

### Requirement: Osvrt časova 6 do 8
The lecture 6 review MUST name REST, stateless obradu, optimistički prikaz i prihvaćenu komandu naspram potvrde fizičkog uređaja. The lecture 7 review MUST name the relational model against the document model, and a virtual machine against a container, and MUST NOT teach database administration. The lecture 8 review MUST name SSE, WebSocket, History API, SPA, React hooks, storage, PWA i offline. The site MUST NOT build those topics.

#### Scenario: Lecture 8 names push it does not build
- **WHEN** the teacher opens the lecture 8 review
- **THEN** SSE and WebSocket are named and the switch display is still fed by reading

### Requirement: Osvrt časova 9 i 10
The lecture 9 review MUST name prijavu preko treće strane, tokene, XSS, SQL injection, CSRF i HTTPS, and MUST NOT include a login form or a built attack. The lecture 10 review MUST name proxy, CDN, cloud, Kubernetes, serverless, mesto nastanka HTML-a, logove, CI i blockchain kao evidenciju koja ne dokazuje tačnost senzora. The site MUST NOT build those topics.

#### Scenario: Lecture 10 names the map
- **WHEN** the teacher opens the lecture 10 review
- **THEN** those names are visible and the hour still does not perform a full deployment
