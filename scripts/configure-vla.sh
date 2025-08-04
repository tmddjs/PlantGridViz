#!/usr/bin/env bash
# Adds the VLA environment variable to the user's shell profile so it
# persists across terminal sessions. Optionally accepts a custom path
# as the first argument.

set -e

VLA_PATH="${1:-/Users/kse/Documents/GitHub/VLA/dist/test}"
PROFILE="${HOME}/.${SHELL##*/}rc"
LINE="export VLA=\"${VLA_PATH}\""

if [ -f "$PROFILE" ]; then
  if grep -Fxq "$LINE" "$PROFILE"; then
    echo "VLA environment variable already configured in $PROFILE"
  else
    echo "$LINE" >> "$PROFILE"
    echo "Added VLA environment variable to $PROFILE"
  fi
else
  echo "$LINE" > "$PROFILE"
  echo "Created $PROFILE and added VLA environment variable"
fi

# If the script is sourced, export VLA for the current shell session so
# it can be used immediately without restarting the terminal.
if [[ "${BASH_SOURCE[0]}" != "$0" ]]; then
  export VLA="${VLA_PATH}"
  echo "Exported VLA environment variable for current shell"
else
  echo "VLA environment variable will be available in new sessions"
fi

