# Curriculum and Serbian language audit of `site/kurs.json`

Status: audit pre implementacije, 22. oktobra 2026. Nalazi opisuju tadašnji `site/kurs.json`. Deo ispravki je u `main`: objašnjenje `===`, definicija closure-a, UDP i odluka aplikacije, nastavni ključevi, živi DOM, zbir naspram proseka, HTTP 500 kao slučaj primera, raspored tačnih odgovora i budžet 70+20. Prepravljeni redosled od 112 koraka nije spojen.



Reviewed 22 October 2026. This records the audit before implementation. The five passes were subsequently applied with lecture code typing and student playground use explicitly included; see [revision notes](kurs-revision-notes.md). Session numbers below are the site's one-based numbers: history is session 1, HTML/CSS session 2, JavaScript session 3.

## Verdict and scope

The course has a useful university-level spine: browser/server separation, explicit state, HTTP failures, validation, persistence, transactions, authorization, and reasoning about retries. The control-room example makes these ideas concrete.

It is not yet a balanced Stanford/MIT-inspired web programming curriculum. It spends too much time repeating the example's rules, while foundations and broader design skills remain thin. Some questions test knowledge of the classroom script rather than web programming. The principal problem is allocation and precision, rather than a lack of advanced technology names.

This audit covers the lecture artifact, its glossary, and its stated relationship to the README and main plan. The main plan explicitly excludes labs and grading. Their absence from this JSON is therefore not evidence that the whole course lacks programming assignments. Before claiming parity with a project-based university course, map lecture outcomes to the actual labs and student work.

## Reference model

Use Stanford CS193X's progression through standard JavaScript, DOM, CSS, APIs and Node as the main introductory reference. Its official Spring 2023 schedule also includes mobile web development, accessibility and authentication. CS142 supplies another reference for incremental application projects and frontend/backend integration. These are specific historical offerings, not verified 2026 syllabi. [CS193X schedule](https://web.stanford.edu/class/cs193x/lectures.html), [CS142 projects](https://web.stanford.edu/class/cs142/projects.html).

Use MIT web.lab for connecting implementation to a student-built application, and MIT 6.1040 selectively for requirements, conceptual design, specifications, and user evaluation. The latter is an advanced software design course with substantial prerequisites; it is not an interchangeable introductory web syllabus. Separate reference facts and workload constraints are recorded in [the source comparison](stanford-mit-web-course-references.md). [MIT web.lab, official 2026 listing](https://www.eecs.mit.edu/academics/iap-offerings/iap-2026/), [MIT 6.1040, Fall 2026](https://61040.github.io/fa26/).

Recommended blend: Stanford-style language/platform foundations and incremental implementation, plus MIT-style explanation of design decisions and transfer to a new problem. These are editorial recommendations drawn from the references, not an official joint curriculum or an experimentally established best sequence.

Vanilla JavaScript and Node's `http` module are defensible for the lecture example. CS193X supports a standards-first approach. React is not a prerequisite for rigor. Briefly explain what routing, middleware and component frameworks automate; adding a second implementation stack should depend on the lab workload.

## Findings, ordered by impact

| Priority | Evidence | Why it matters | Proposed correction |
|---|---|---|---|
| P0 | All **147** per-step questions mark B correct. `site/js/main.js` renders those options in supplied order. | Students can exploit position instead of reasoning. | Rewrite weak distractors and distribute correct positions; preserve each answer's explanation when moving it. Shuffling alone cannot repair weak questions. |
| P0 | Session 3, `Tip`, line 1617: the explanation for `24 === "24"` discusses copying an object's field. | An unrelated explanation teaches the wrong reasoning. | Explain different types and the absence of coercion under `===`; review every stem/code/answer/explanation quartet. |
| P0 | Session 11, `Izlaz`, lines 4569–4584: the stem asks what the exit has *no* place for; A says an input area, B says a stamp/options. The preceding text excludes both. | Both answers fit the supplied description, although only B is marked correct. | Replace this with a question about the request/state/permission chain. |
| P0 | Session 2 repeatedly says DevTools changes the picture but leaves the document unchanged, e.g. line 1125. | This hides the distinction between source HTML and the live document/DOM. | State that editing an element changes the live DOM in that browser, without changing the server's source file or simulated measurement. [DOM Standard](https://dom.spec.whatwg.org/#introduction-to-the-dom). |
| P0 | Session 4, line 1933: closure is defined as a synchronous function returning a function. | This describes one example, not the concept; later asynchronous callbacks can also close over bindings. | Define a function together with access to its lexical environment; retain the synchronous returned-function example. [Mozilla closure guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures). |
| P0 | Session 1, lines 87, 175 and 495: UDP is associated with discarding late frames, streaming with UDP, and financial transfers with TCP. | Transport properties and application policies become conflated. | Teach that UDP does not guarantee delivery/order; applications decide whether late media is useful. Streaming does not imply UDP. Reliable byte delivery does not prove a transaction committed. [RFC 768](https://www.rfc-editor.org/rfc/rfc768.html), [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html). |
| P0 | Session 10 presents hard-coded role-named keys, yet line 3956 calls them random. | The example implies security properties the literals do not have. | Label the role selector and keys as teaching fixtures. Explain unpredictable session identifiers and distinguish authentication from authorization. `HttpOnly` restricts script access, not the user's ability to inspect or manipulate their browser. Add HTTPS, `Secure`, `SameSite`, expiry and CSRF at conceptual depth. [Mozilla cookie guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies). |
| P1 | JSON has 11 × 90-minute sessions; README and main plan specify 10 × 90. Sessions 3–11 each allocate 12 × 8 = 96 minutes. Total step time is 1,044 minutes against 990 advertised minutes. | The live sequence exceeds its stated budget before any additional discussion. | Choose one duration and numbering, synchronize the three documents, and budget transitions/discussion explicitly. Do not keep 96-minute mandatory sequences. |
| P1 | All 11 `ishod` fields duplicate `podnaslov`. | Topic summaries do not consistently specify observable student capability. | Write outcomes such as “Student razlikuje HTTP 500 od mrežnog neuspeha i obrazlaže obe grane obrade.” Include an aligned explanation or transfer task. |
| P1 | Session 3 uses arrows, callbacks and `reduce`; session 4 introduces classes and `this`; session 5's JSON concept already contains `await`, although the next session introduces it. No explicit Promise foundation appears. | Knowing OOP in another language does not establish these JavaScript prerequisites. | Introduce function values, arguments/returns, lexical scope and arrow syntax before callback-based array methods; explain method calls/`this` before classes; introduce Promise before `await`. Move the asynchronous JSON snippet or explain JSON synchronously first. |
| P1 | HTML/CSS receives 90 minutes but splits `head`, `body`, margins and padding into many small steps; no explicit Flexbox/Grid, responsive layout or form-label sequence exists. Keyboard focus appears only briefly. | The student sees syntax without enough ability to structure a usable interface. | Group boilerplate, retain the box model, and add one layout method, viewport/media query example, labeled input, keyboard interaction and safe status feedback. |
| P1 | Later sessions repeatedly ask whether commands move the display, which room draws a fan, or which classroom action is allowed. Session 11 ends with `Izlaz` and `Jedna soba`, including instructions about votes and an assistant. | Time is spent learning this simulation's script rather than transferable principles. | Keep one example per misconception; replace duplicates with another domain, a bug explanation, a design choice, or a short request trace. Move instructor directions into separate notes. |
| P1 | No explicit teaching sequence for testing, module boundaries, configuration or a working deployment appears. Final deployment content is a diagram. | Students cannot yet explain how an application is maintained and delivered. | Add one focused engineering session with module responsibilities, a behavior test, environment configuration, logs and a prepared deployment/HTTPS trace. Link to lab work where students implement it. |
| P2 | `500` is tightly associated with an unplugged fan; log plus readback is presented as sufficient before retries. | Local demonstration conventions can become false general rules. | Qualify fan failure as this simulator's chosen 500 case. Explain that logs/readback aid diagnosis but need not prove a particular command's outcome under concurrency. Define idempotence by intended effect; repeated requests may still produce separate audit rows. [RFC 9110 §9.2.2](https://www.rfc-editor.org/rfc/rfc9110.html#section-9.2.2). |
| P2 | Session 3's `reduce` question marks “ovde prosek” correct, but the `reduce` call computes a sum and the enclosing function then divides. | The explanation conflates a method's result and its caller's result. | Ask about `reduce` (sum), or explicitly ask about `prosek` (average). |

## Serbian language and terminology

Use Serbian Latin, ekavian forms, and full grammatical sentences for explanations. Keep API names, identifiers and protocol tokens unchanged. Introduce technical English alongside a Serbian explanation on first occurrence; choose one subsequent form. English terms are not inherently translation errors.

The glossary currently deliberately prefers `browser`, `cookie`, `cache`, `opaque token` and other English forms. Follow that policy consistently until it is intentionally revised. Do not silently translate only some occurrences, or replace identifiers when editing prose. The glossary itself also needs conceptual corrections: its DevTools and session definitions repeat some of the issues above. Terminology changes affect glossary lookup and tests and should be coordinated.

| Current wording / location | Proposed wording or treatment |
|---|---|
| “Ekran je još ne crta.”, lines 1237–1238 | “Prikaz još ne koristi tu vrednost.” |
| “Ekran je još ne čita objekat.”, line 1325 | “Kod za prikaz još ne čita vrednost iz objekta.” |
| “Oskudan postane pažnja, ne papir.”, line 539 | “Pažnja postaje oskudan resurs.” |
| “Stranica dosegne kupca kome radnja na uglu ne dosegne.”, line 518 | “Veb stranica može da dopre do kupca do kog lokalna prodavnica ne može.” |
| “Kolačić je ključ posmatrača.”, line 4077 | “Cookie nosi ključ sesije posmatrača.” This also fixes the container/value distinction and matches the existing glossary. |
| `map` “vadi visinu”, lines 1305, 1523–1539 | Say it extracts temperature values; explain separately how temperature maps to the graph's vertical coordinate. |
| `Handler`, `Listener`, `callback` | First use: “funkcija za obradu događaja (handler)”, “registrovana funkcija za događaj (listener)” and “funkcija prosleđena drugoj funkciji (callback)”. Explain the relationship, rather than treating all three as interchangeable unexplained labels. |
| “runtime validacija” | “provera podataka tokom izvršavanja”; retain `runtime` parenthetically if useful for reading English documentation. |
| `Credential`, `credential baze` | “pristupni podaci za bazu (credentials)” on first use; then one agreed form. This is a proposed terminology revision, not a claim that the current glossary permits it. |
| `deploy`, `deployment` | “postavljanje aplikacije na server (deployment)” on first use; use one form afterward. |
| `Ledger`, `ledger`, `white paper` | If retained in optional history, explain them once. Their prominence currently exceeds their contribution to the programming outcomes. |
| “ES3, ES5 i ES6 su godine”, line 108 | “ES3, ES5 i ES6 označavaju izdanja standarda ECMAScript.” They are edition numbers, not years. [Ecma publication archive](https://ecma-international.org/publications-and-standards/standards/ecma-262/). |
| “Četiri odgovora”, line 4233, followed by five statuses | “Pet mogućih odgovora” or “Redosled provera i odgovora”. |

Keep the room metaphor for motivation, but pair it with conventional terms: browser/klijent, Node/server, database, DOM, API, session, authorization. Students must be able to explain an unfamiliar web application without needing the words `kutija` and `soba mašina`.

## Proposed 11-session structure

This is a working recommendation based on the current JSON count, not a claim that an eleventh session has been approved. If the binding limit remains ten, combine the final two sessions and move optional TypeScript/framework material to reading. Lab workload still needs its own mapping.

| Session | Focus and observable outcome |
|---|---|
| 1 | Web/Internet distinction and URL/request overview, with 10–15 minutes of history; semantic HTML, CSS box model, one responsive layout and DevTools. Student distinguishes server source, DOM and rendering. |
| 2 | JavaScript bridge from existing programming knowledge: types, bindings/references, functions, arrows, scope, objects and arrays. Student traces and changes a small synchronous program. |
| 3 | DOM selection and mutation, events, forms, keyboard access, separating state and rendering; a small closure example after scope. Student explains a click from event to state to DOM. |
| 4 | HTTP request/response and minimal Node server; URL parts, methods, headers, status, JSON, runtime and module boundaries. Student traces a request in Network and server logs. Compress transport reconstruction. |
| 5 | Promise, `async`/`await`, `fetch`, parsing, success/loading/error, and a basic event-loop model. Student distinguishes HTTP failure, network failure and pending work. |
| 6 | API/resource design, request bodies, server validation, PUT versus toggle, and idempotence. Student explains what a repeated command guarantees. |
| 7 | PostgreSQL integration, parametrized SQL, transaction boundaries, process memory versus persistent state, Docker/volume configuration. Student explains rollback and restart behavior. |
| 8 | Freshness, concurrent responses, polling lifecycle, cache policy, and a short polling/push comparison. Student explains a stale-response race and a defense. |
| 9 | Authentication versus authorization, sessions, origin/CORS, XSS and CSRF, HTTPS and cookie attributes. Student identifies which boundary enforces which rule. |
| 10 | Engineering and delivery: module responsibilities, observable behavior tests, configuration, logs and a prepared deployment. Student diagnoses one failure using evidence from each layer. |
| 11 | MIT-inspired design and transfer: a new small application, user need, model/invariant, API choices and failure tradeoffs. Explain one whole request and defend the design. Optional TS/framework comparison only after core outcomes are met. |

A practical 90-minute budget is 5 minutes of retrieval, 20 of foundations, 20 of demonstration, 30 of one main reasoning task, 10 of transfer, and 5 of exit explanation. Step allocations must include their questions; these blocks are not extra time added after the step totals. Choose realistic blocks rather than assigning every step eight minutes.

## Implementation order and completion criteria

1. **Correctness pass:** fix the P0 concepts, unrelated explanations, ambiguous answers and answer-position pattern. Keep all examples clearly marked as executable code, pseudocode or protocol text.
2. **Structure pass:** settle 10 versus 11 sessions; synchronize README, main plan and JSON. Reclaim most history time and repeated simulator rules for foundations and engineering. Give every session a measurable outcome and explicit prerequisite chain.
3. **Question pass:** keep brief retrieval prompts as needed, with one main discussion. Add prediction with justification, one-condition variations and tasks in another domain. Replace every question about instructor choreography. Distinguish wrong assertions from wrong justifications.
4. **Language pass:** agree the glossary policy, repair grammar, explain retained English terms and remove accidental synonyms. Review displayed prose separately from code and API identifiers.
5. **Verification pass:** validate JSON and the site's course mapper; check every session's complete time budget; verify one defensible correct answer per single-answer question; review answer distribution and explanation relevance; verify prerequisites before use. Run the existing suite after implementation and update tests that assert wording or obsolete structure. Current tests include exact text expectations, which do not establish pedagogical correctness.
6. **Teaching check:** rehearse one early and one late class to validate timing. Map lecture outcomes to existing labs and require evidence of independent implementation/design there before describing the whole course as comparable in scope to the reference courses.

This review used JSON parsing, structural counts, direct text inspection and official reference reading. No application tests were run because this change adds review documents only.
