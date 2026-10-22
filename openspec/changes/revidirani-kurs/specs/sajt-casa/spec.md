# Spec Delta

## MODIFIED Requirements

### Requirement: Korak na sajtu
A step that names a file MUST show, in order, the step prose, the key-idea callout, the code snippet, and a short quiz with unmarked answers. The next step MUST treat that step's file fragment as already typed. The site MUST show the file path of the fragment. A figure step MUST show the prose, the key-idea callout, the figure, and the short quiz, and MUST NOT show a code snippet or a file path. A step that names no file and has no figure MUST show the prose, the key-idea callout, and the short quiz, and MUST NOT show a file path. When that step carries an isolated example, the site MUST show it as Mali eksperiment before the quiz. When it carries a diagram and no figure, the site MUST show it as Dijagram before the quiz. The analysis sentence MUST stay hidden until the explanation is open.

#### Scenario: Callout comes before the quiz
- **WHEN** the teacher opens a step that names a file
- **THEN** the prose, the key idea, and the snippet are visible before the quiz, and no quiz answer is marked

#### Scenario: Figure comes before the quiz
- **WHEN** the teacher opens a figure step
- **THEN** the prose, the key idea, and the figure are visible before the quiz, and no snippet or file path is shown

#### Scenario: Step adds a fragment
- **WHEN** the teacher finishes a step that adds a fragment
- **THEN** the named file contains that fragment and the following step shows it as already present

#### Scenario: Short quiz stays closed
- **WHEN** the short quiz is first shown
- **THEN** no answer is marked correct until the teacher reveals the explanation

#### Scenario: Story step has no figure
- **WHEN** the teacher opens LO
- **THEN** the prose and the key idea are visible before the quiz, and no snippet, file path, or figure is shown

#### Scenario: Isolated example comes before the quiz
- **WHEN** the teacher opens Širina kutije
- **THEN** Mali eksperiment is visible before the quiz, no file path is shown, and the analysis sentence stays hidden until the explanation is open

### Requirement: Dva stabla
The editor MUST offer a Klijent tab for `client/` and a Server tab for `server/`. The Server tab MUST be absent during weeks 1, 2, 3, and 4, and MUST be present from week 5. Each visible tab MUST show that side's file tree as introduced by a step at or before the open step, the open file's path, and a place for an error. A file MUST appear when such a step first names it and MUST remain on later steps. Prepared copies MUST stay out of the tree. During week 1 the editor MUST NOT open a buffer.

#### Scenario: Tabs stay on their own files
- **WHEN** the teacher switches between Klijent and Server in week 5 or later
- **THEN** each tab shows only the files of that side introduced at or before the open step

#### Scenario: Server tab waits for week 4
- **WHEN** week 1, 2, 3, or 4 is open on Editor
- **THEN** the Server tab is absent and the tree shows only `client/`

#### Scenario: HTML is a file
- **WHEN** the teacher opens the document step
- **THEN** the editor can open `client/index.html` as the file being retyped

#### Scenario: Front tree lists the course files
- **WHEN** the teacher opens the Klijent tab at the end of week 4
- **THEN** the tree includes `client/index.html`, `client/css/soba.css`, `client/js/korak.js`, `client/js/niz.js`, `client/js/displej.js`, and `client/js/prekidac.js`, and does not include a server file

#### Scenario: Podela lists only the sketch
- **WHEN** the teacher opens Stranica on Klijent
- **THEN** the tree lists only `client/index.html`

#### Scenario: Tree grows with the open step
- **WHEN** the teacher opens Objekat
- **THEN** the Klijent tree includes `client/js/korak.js` and does not yet include `client/js/niz.js`

#### Scenario: History week opens no buffer
- **WHEN** the teacher opens any step of week 1 on Editor
- **THEN** no file buffer is open and the Server tab is absent

### Requirement: Ikonice isečka
The key-idea callout MUST show `lightbulb`. When the step has a snippet, the snippet title MUST show `folder`, the copy control MUST show `copy` and the word Kopiraj, and the file path MUST show `file-text` and the path text. A figure step MUST NOT show those snippet icons. A step with no snippet, no figure, no isolated example, and no diagram MUST NOT show those snippet icons. Mali eksperiment and Dijagram MUST show `file-text` on their title and MUST NOT show `folder`, Kopiraj, or a file path.

#### Scenario: Snippet chrome
- **WHEN** the teacher opens a step that has a snippet on Gradivo
- **THEN** the callout, the snippet title, the copy control, and the file path show those icons and the words Kopiraj and Ključna ideja stay

#### Scenario: Figure has no snippet chrome
- **WHEN** the teacher opens a figure step on Gradivo
- **THEN** the callout shows `lightbulb` and the snippet title, copy control, and file path are absent

#### Scenario: Story step has no snippet chrome
- **WHEN** the teacher opens LO on Gradivo
- **THEN** the callout shows `lightbulb` and the snippet title, copy control, and file path are absent

#### Scenario: Isolated block has a title icon
- **WHEN** the teacher opens Širina kutije on Gradivo
- **THEN** Mali eksperiment shows `file-text`, and the copy control and the file path are absent

### Requirement: Snimak fajla na koraku
The built-in version of a file MUST be the snapshot of course fragments through the open step. A later fragment MUST be appended. The finished file on disk MUST NOT replace a snapshot that has text. The shipped document MUST NOT store a separate whole-file original.

#### Scenario: Podela is an empty document
- **WHEN** the teacher shows the built-in version of `client/index.html` on Stranica
- **THEN** the text starts with a doctype and an `html` element in Serbian, contains no heading and no script, and is not the finished file on disk

#### Scenario: Selektor is one rule
- **WHEN** the teacher shows the built-in version of `client/css/soba.css` on Selektor
- **THEN** the text is the declaration `letter-spacing: 0.08em;` and is not the finished stylesheet on disk

#### Scenario: Delta keeps the earlier object
- **WHEN** the teacher shows the built-in version of `client/js/korak.js` on Delta
- **THEN** the text starts with `let delta = 1;`, still contains the earlier `const soba` line, and declares `function korak`

#### Scenario: Class enters with the step that names it
- **WHEN** the teacher shows the built-in version of `client/js/displej.js` on the step that introduces `class Displej`
- **THEN** the text contains `class Displej` and is not the finished file on disk

### Requirement: Vezivanje stranice
Script tags MUST be inserted into an HTML snapshot only when that snapshot contains `</body>`. The shipped page document closes `</html>` before later fragments, so those fragments MUST be appended after `</html>` and MUST NOT add a script tag. An HTML snapshot with no client script MUST contain no script tag.

#### Scenario: Semantika has no script
- **WHEN** the teacher shows the built-in version of `client/index.html` on Semantika
- **THEN** the document contains no script tag and no `/api/soba`

#### Scenario: Objekat binds the existing script
- **WHEN** the teacher shows the built-in version of `client/index.html` on Objekat
- **THEN** the document does not load `js/korak.js` and contains no script tag, while `client/js/korak.js` holds the room object

#### Scenario: Classes are constructed when declared
- **WHEN** the teacher shows the built-in version of `client/index.html` on Prekidač
- **THEN** the document does not construct `Displej` or `Prekidac`, and those classes live in `client/js/displej.js` and `client/js/prekidac.js`

#### Scenario: Canvas appears with the line
- **WHEN** the teacher shows the built-in version of `client/index.html` at the end of the week titled DOM, događaji i prikaz stanja
- **THEN** the document contains no canvas and does not mention `nacrtajLiniju`

### Requirement: Panel od Node nedelje
The shell machine room MUST show beside the iframe from Od mrežnog prenosa do HTTP-a i Node.js-a onward. That room is not a file from the editor. The waiting label and the cable control MUST show from Asinhronost, event loop i neuspeh onward. History and the database flag MUST show from PostgreSQL, transakcije i Docker onward. Periodic reading, freshness, and age MUST show from Svežina podataka, periodično čitanje i push onward. Roles MUST show from Bezbednost, sesije i prava pristupa onward.

#### Scenario: Node week shows the machine room
- **WHEN** the teacher opens Od mrežnog prenosa do HTTP-a i Node.js-a
- **THEN** the machine room and the read control are visible and roles are hidden

#### Scenario: Later weeks open their controls
- **WHEN** the teacher opens Bezbednost, sesije i prava pristupa
- **THEN** roles, history, and periodic reading are visible
