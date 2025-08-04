#!/usr/bin/env bash
# Adds the VLA environment variable to the user's shell profile so it
# persists across terminal sessions. Optionally accepts a custom path
# as the first argument.

set -e

VLA_PATH="${1:-/Users/kse/Documents/GitHub/VLA/dist/test}"
PROFILE="${HOME}/.${SHELL##*/}rc"
SET_SCRIPT="${HOME}/set_vla.sh"
EXPORT_LINE="export VLA=\"${VLA_PATH}\""
SOURCE_LINE="source \"${SET_SCRIPT}\""

# Write export line to helper script to be sourced each session.
echo "${EXPORT_LINE}" > "${SET_SCRIPT}"
chmod +x "${SET_SCRIPT}"
echo "Created ${SET_SCRIPT}"

# Ensure profile sources the helper script.
if [ -f "${PROFILE}" ]; then
  if grep -Fxq "${SOURCE_LINE}" "${PROFILE}"; then
    echo "Profile already sources ${SET_SCRIPT}"
  else
    echo "${SOURCE_LINE}" >> "${PROFILE}"
    echo "Added source line to ${PROFILE}"
  fi
else
  echo "${SOURCE_LINE}" > "${PROFILE}"
  echo "Created ${PROFILE} and added source line"
fi

# If the script is sourced, export VLA for the current shell session so
# it can be used immediately without restarting the terminal.
if [[ "${BASH_SOURCE[0]}" != "$0" ]]; then
  export VLA="${VLA_PATH}"
  echo "Exported VLA environment variable for current shell"
else
  echo "VLA environment variable will be available in new sessions"
fi

