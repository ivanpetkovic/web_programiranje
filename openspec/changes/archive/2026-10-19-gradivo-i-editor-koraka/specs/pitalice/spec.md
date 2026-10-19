# Spec Delta

## MODIFIED Requirements

### Requirement: Kratka pitalica koraka
Every step MUST have one short quiz about its step. The answers MUST stay unmarked until the teacher reveals the reasons. Selecting an option MUST highlight only that selection and MUST NOT reveal which option holds. The short quiz MUST show its options together on the lesson page, one under another. It MUST NOT use the assumption board, the comparison phase, or a second half-hour discussion.

#### Scenario: Step quiz stays unmarked
- **WHEN** the teacher opens a step
- **THEN** the short quiz shows its answers with none marked, and the reasons are still closed

#### Scenario: Selection is not the mark
- **WHEN** the teacher selects an option before the reasons are revealed
- **THEN** that option is highlighted and no option is marked as the one that holds

#### Scenario: Options stack
- **WHEN** the teacher opens a step on a wide page
- **THEN** each short-quiz option is on its own row
