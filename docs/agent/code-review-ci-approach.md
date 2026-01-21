# Code Review Agent in CI (Approach)

This note describes how to run a review‑only Codex agent in GitHub Actions without mixing in the project’s normal `AGENTS.md` context.

## Why this works
- GitHub Actions runs in a fresh checkout of the repo.
- You can overwrite `AGENTS.md` inside the runner’s workspace without touching the repo history.
- The agent only reads what `AGENTS.md` points to.

## Recommended setup
1) Commit a review‑only instruction file:
   - `docs/agent/code-review.md`
   - Keep it minimal and focused on review rules and output format.
2) In the CI job, write a temporary `AGENTS.md` that points only to that file.

## Example GitHub Actions steps
```yaml
- name: Write review-only AGENTS.md
  run: |
    cat > AGENTS.md <<'EOF'
    # Code Review Agent
    See docs/agent/code-review.md for review rules and output format.
    EOF

- name: Run Codex review
  run: codex --review
```

## Notes
- The temporary `AGENTS.md` exists only for that job and is not committed.
- This avoids mixing local dev workflows (Sentry, tooling, etc.) into CI code reviews.
