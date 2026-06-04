#!/usr/bin/env bash
set -euo pipefail

show_help() {
  cat <<'EOF'
Usage: scripts/prepare.sh <input>

Prepare assembly outputs for a source file.

Arguments:
  input    Base path to the assembly source without the .s extension

Example:
  scripts/prepare.sh src/backend/asm/programs/demo
EOF
}

if [[ $# -eq 0 ]]; then
  show_help
  exit 0
fi

npm run assemble -- "$1.s" -b
npm run assemble -- "$1.s"
uv run scripts/romgen.py "$1.hex"
