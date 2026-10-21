# Spec Delta

## MODIFIED Requirements

### Requirement: Zaglavlje lekcije
The open lesson MUST show the course breadcrumb, the week title, the week subtitle, and the step selector outside the Gradivo section. The selector MUST stay on screen on Gradivo, Diskusija, and Editor. The selector MUST show one circle per step. The lesson body MUST NOT show a numbered row of step buttons. The level, when the document sets one, the minute label, and Sačuvaj korak MUST stay in the Gradivo section and MUST NOT sit inside the selector.

#### Scenario: The selector replaces a button per step
- **WHEN** a week is open on its first step
- **THEN** the selector reads Korak 1 od N, where N is that week's step count, shows N circles, and the lesson body does not show N numbered step buttons

#### Scenario: Level comes from the document
- **WHEN** the open step sets a level and Gradivo is open
- **THEN** the Gradivo section shows that level outside the selector

### Requirement: Birač koraka
The selector MUST sit outside the Gradivo section and MUST stay on screen while Gradivo, Diskusija, or Editor is open. It MUST show Korak {n} od {N}, the open step's title, a previous control, Svi koraci, Sledeći, and one circle per step of the open week. It MUST NOT show a progress bar. A circle at or before the open step MUST use the theme accent, which MUST be `#ffb000` on mornar and ugalj. A later circle MUST be light gray. Saved steps MUST NOT set those colors. A circle MUST NOT print a number. Choosing a circle MUST open that step and MUST keep the open tab. The open circle MUST expose `aria-current="step"`. The previous control MUST show only `chevron-left` and MUST be named Prethodni korak. Sledeći MUST show that word and `chevron-right`, and MUST use the theme ink as its background. Sledeći MUST NOT use the accent background. The temperature control on the panel MUST stay without that background. The page MUST NOT show the sentence Progress indicates completed steps, not just the current position.

#### Scenario: Step title sits under the count
- **WHEN** a step is open
- **THEN** the selector reads Korak {n} od {N} and that step's title, and shows one circle per step

#### Scenario: Discussion keeps the selector
- **WHEN** the teacher opens Diskusija
- **THEN** the selector stays on screen and still reads the open step

#### Scenario: Editor keeps the selector
- **WHEN** the teacher opens Editor
- **THEN** the selector stays on screen, shows one circle per step, and does not show a progress bar

#### Scenario: The bar follows the open step
- **WHEN** the open week has 12 steps and the first step is open
- **THEN** there is no progress bar, the first circle uses the accent, and the other 11 are light gray

#### Scenario: Next advances the bar
- **WHEN** the teacher activates Sledeći while Diskusija or Editor is open
- **THEN** the next step of that week opens, that step's circle uses the accent, there is no progress bar, and the same tab stays open

#### Scenario: Saved steps do not fill the bar
- **WHEN** the open week has 17 steps, three are saved, and the open step is the first
- **THEN** there is no progress bar, only the first circle uses the accent, and the other 16 are light gray

#### Scenario: A future circle opens that step
- **WHEN** the teacher chooses a light-gray circle while Diskusija or Editor is open
- **THEN** that step opens, its circle and every earlier circle use the accent, and the same tab stays open

#### Scenario: The open circle matches the earlier ones
- **WHEN** a step after the first is open
- **THEN** the open circle uses the same accent as the earlier circles and exposes `aria-current="step"`

#### Scenario: Next is not yellow
- **WHEN** any theme is active
- **THEN** Sledeći uses the ink background and does not use the accent background

#### Scenario: Temperature control stays plain
- **WHEN** the temperature control is visible on the panel
- **THEN** it does not use the Sledeći background

## ADDED Requirements

### Requirement: Širina birača
The selector MUST be only as wide as its content and MUST NOT stretch to the lesson column. The circle row MUST grow with that week's step count and MUST NOT use a percentage of the column. The selector MUST stay within the column. Circles that do not fit on one line MUST wrap.

#### Scenario: A short week stays narrow
- **WHEN** the open week has 3 steps and the lesson column is wider than the selector
- **THEN** the selector is narrower than the column and shows 3 circles

#### Scenario: A long week wraps
- **WHEN** the open week has 19 steps and those circles do not fit on one line
- **THEN** the selector stays within the column and the circles wrap onto another line
