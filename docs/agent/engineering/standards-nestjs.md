# NestJS Engineering Addendum

These standards extend the global engineering standards for NestJS repositories.

## Style Exceptions
- Single-line `if` statements may omit braces (example: `if (ok) return;`).

## Framework Exceptions
- NestJS framework-required classes (controllers, providers, guards, interceptors, pipes, filters) may use class syntax where required by the framework.

## Function Signatures (Docblocks)
- For HTTP endpoints, include `@endpoint` with the route path and a brief request summary in the description.

## Validation Patterns
- Use Zod schemas for request validation in new pipes.
- Prefer `safeParse` and map issues into a field error map, keeping the first error per field.
- Keep validation schemas in `src/validation/` and name them `<feature>.schema.ts`.

## Logging Style
- Log messages should be inline (no temp variables) and follow the `[key: value]` bracket pattern.
- Error logs should follow the same bracket pattern: `Failed to <action> [key: value]`, passing `error.stack` as the second argument.

## Types Organization
- When adding request/response or domain types, extend the existing domain type file (e.g., `src/types/Order.ts`, `src/types/Scheduler.ts`) instead of creating new type modules unless none exist yet.

## Testing Expectations
- Unit tests must be colocated with the code under test (same folder), using `*.spec.ts`.
- Keep integration/e2e tests in `test/` only.
- Contract (Pact) tests must follow the repo's Pact structure.

## Contract Test Standards (Pact)
- Provider tests live in `test/pact/providers/` and are named `*.provider.pact.spec.ts`.
- State handlers live in `test/pact/state-handlers/`.
- Shared helpers live in `test/pact/helpers/`.
- Mocks and fixtures live in `test/pact/mocks/` and `test/pact/fixtures/`.
- Use `startPactApp` to boot the Nest app and `createPactVerifier` to verify contracts.
- Provider state handlers must be wired into the verifier.
- Use stable mocks/fixtures from `test/pact/mocks/` and `test/pact/fixtures/` instead of inline constants when possible.
- Use `beforeAll` to boot the app and `afterAll` to close it; avoid per-test app startups.
- If contracts require auth, generate tokens using the shared helper in `test/pact/helpers/`.
