# Code Review Agent Rules

Scope: review only PR diff unless a surrounding file is required to verify logic or contracts.

Output format:
- Findings only; no praise.
- Each finding includes severity, file path, and a short fix suggestion.

Severity:
- BLOCKER: correctness, security, or data loss risk.
- MAJOR: logical flaws, contract/API breakage, missing tests for critical paths.
- MINOR: style or maintainability.

Global standards:
- Follow `docs/agent/engineering/global-standards.md`.

Exceptions:
- Legacy areas may be flagged as MINOR with a note to align on touch.
- Vendor SDK patterns are acceptable if required by the SDK; note the constraint.

Review rules (project-specific):
1) Semicolons are mandatory wherever optional; flag any missing semicolons.
2) Single-line if blocks must be one line with braces (no multi-line block when only one statement). Example: `if (ok) { return; }`
3) Prefer functional style over class-based logic unless a framework requires a class.
4) Use try/catch/finally for async flows; do not use Promise chaining (.then/.catch/.finally).
5) Enforce single-responsibility in functions and logic; each function should do one thing only. Flag multi-purpose functions.

Testing expectations:
- When new logic or branches are introduced, require a unit test unless explicitly out of scope.
- If the repo has no test runner configured, call out the gap and suggest adding tests or deferring with rationale.

Exclusions:
- Ignore dist/, node_modules/, coverage/, and generated files.
