# pitalice Specification

## Purpose

Mehanizam pitalice na sajtu časa. Tekst pitanja i odgovora je `kursevi/web_programiranje/kurs.json`. Ova specifikacija ne imenuje pitanja tema.

## Requirements

### Requirement: Kratka pitalica je na Diskusiji
The short quiz of the open step MUST appear on Diskusija. Gradivo MUST NOT show it. The question and its example MUST stay on screen. Its answers MUST stay hidden until the teacher opens that question. Opening a choice question MUST show its options, mark the one that holds, and show the explanation.

#### Scenario: Gradivo has no step quiz
- **WHEN** the teacher opens Gradivo on a step
- **THEN** the short quiz is not on screen

#### Scenario: Answers stay hidden
- **WHEN** the teacher opens Diskusija and has not opened a question
- **THEN** no quiz answer is on screen

#### Scenario: Opening a question reveals its answer
- **WHEN** the teacher opens a question on Diskusija
- **THEN** that question's answer is visible

### Requirement: Diskusija cele teme
The long discussion MUST appear on the last step of the open week, on Diskusija, after that step's short quiz. Its phases MUST be Izbor, Poređenje, Pretpostavke, Analiza, and Ponovni izbor, in that order. Before Analiza the page MUST NOT reveal which option holds. The site MUST NOT store a vote. The reserve MUST stay closed until the teacher opens it.

#### Scenario: Last step carries the discussion
- **WHEN** the teacher opens Diskusija on the last step of a week
- **THEN** the week discussion is on screen and its phase is Izbor

#### Scenario: Earlier step has no week discussion
- **WHEN** the teacher opens Diskusija on a step that is not the last
- **THEN** the week discussion is not on screen

#### Scenario: Izbor does not reveal the answer
- **WHEN** the phase is Izbor or Poređenje
- **THEN** no option is marked as the one that holds

### Requirement: Izlaz nema polje
The exit sentence MUST appear only on the last step of the open week. The page MUST NOT offer a text field for that sentence.

#### Scenario: Last step shows the sentence
- **WHEN** the teacher opens the last step of a week
- **THEN** the exit sentence is visible and the page has no text field for an answer
