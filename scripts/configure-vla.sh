#!/usr/bin/env bash
# Adds the VLA environment variable to the user's shell profiles so it
# persists across terminal sessions. Optionally accepts a custom path
# as the first argument.

set -e

VLA_PATH="${1:-/Users/kse/Documents/GitHub/VLA/dist/test}"
SHELL_NAME="$(basename "$SHELL")"

# Determine profile files for the detected shell
if [[ "$SHELL_NAME" == "bash" ]]; then
  PROFILES=("${HOME}/.bashrc" "${HOME}/.bash_profile")
elif [[ "$SHELL_NAME" == "zsh" ]]; then
  PROFILES=("${HOME}/.zshrc" "${HOME}/.zprofile")
else
  PROFILES=("${HOME}/.${SHELL_NAME}rc")
fi

LINE="export VLA=\"${VLA_PATH}\""

for PROFILE in "${PROFILES[@]}"; do
  if [[ -f "$PROFILE" ]]; then
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
done

# Export for the current session so the user doesn't have to restart immediately
export VLA="${VLA_PATH}"
echo "VLA environment variable set for current session"

