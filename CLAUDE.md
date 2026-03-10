# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

`gen-cmt` is an AI-powered git commit message generator that uses OpenRouter as the LLM backend. It reads staged git diffs and generates conventional commit messages, then writes the result to `/tmp/ai_commit_msg.txt` for the shell script to pick up.

## Commands

```bash
# Install dependencies
npm install

# Run the full interactive commit flow (generates message, prompts y/e/n)
npm run commit

# Run the generator directly (writes to /tmp/ai_commit_msg.txt, no interaction)
node src/index.mjs

# Run with CLI overrides
node src/index.mjs --model "openai/gpt-4o-mini" --language en
```

## Architecture

The flow: `scripts/ai-commit.sh` → `src/index.mjs` → `src/openrouter.mjs`

- **`src/index.mjs`** — Entry point (CLI binary `gen-cmt`). Runs `git diff --cached`, calls OpenRouter, writes commit message to `config.outputFile`.
- **`src/config.mjs`** — Config resolution with priority: CLI args > project `.commitai.json` > global `~/.commitai.json` > env vars > defaults.
- **`src/prompt.mjs`** — System prompt builder. Supports `language` (ko/en/ja/zh), `customPrompt` (file path or string), and `promptExtras` for appending extra rules.
- **`src/openrouter.mjs`** — Raw `fetch` call to `https://openrouter.ai/api/v1/chat/completions`.
- **`scripts/ai-commit.sh`** — Wraps the node CLI, shows the generated message, prompts `y`/`e`/`n` to commit, edit in vim, or cancel.

## Configuration

API key via env var or config file:

```bash
# .env.local or .env
OPENROUTER_API_KEY=sk-or-...
```

Project-level config at `.commitai.json`:

```json
{
  "model": "nvidia/nemotron-3-nano-30b-a3b:free",
  "language": "ko",
  "temperature": 0.1,
  "maxTokens": 2048,
  "maxFirstLineLength": 60,
  "fallbackMessage": "chore: 코드 변경사항 커밋",
  "customPrompt": "",
  "promptExtras": ""
}
```

Global config at `~/.commitai.json` uses the same schema.

## Commit Message Format

Generated messages follow conventional commits: `[type]: [summary]` where type is one of `feat|fix|refactor|docs|style|test|chore`. First line ≤ 60 chars, followed by 2–5 bullet points explaining what changed and why.
