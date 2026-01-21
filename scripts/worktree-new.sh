#!/usr/bin/env bash
set -euo pipefail

if [ $# -lt 1 ]; then
  echo "Usage: $0 <branch> [base=staging] [dir]" >&2
  exit 1
fi

branch="$1"
base="${2:-staging}"
repo_name="$(basename "$(pwd)")"
safe_branch="${branch//\//-}"
dir="${3:-../${repo_name}-${safe_branch}}"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Not inside a git repository." >&2
  exit 1
fi

git fetch origin "$base" >/dev/null 2>&1 || {
  echo "Warning: could not fetch origin/${base}; using local base." >&2
}

if [ -e "$dir" ]; then
  echo "Directory already exists: ${dir}" >&2
  exit 1
fi

if git show-ref --verify --quiet "refs/heads/${branch}"; then
  git worktree add "$dir" "$branch"
else
  if git show-ref --verify --quiet "refs/remotes/origin/${base}"; then
    git worktree add -b "$branch" "$dir" "origin/${base}"
  else
    git worktree add -b "$branch" "$dir" "$base"
  fi
fi

echo "Worktree created: ${dir} (branch: ${branch})"
