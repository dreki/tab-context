#!/usr/bin/env bash

# Use inotify to watch for changes in the source directory and rebuild via `yarn build`
# when changes are detected.

# Usage: ./scripts/build-watch.bash

# Exit on error
set -e

inotifywait -m -r -e modify,create,delete,move --format '%w%f' src | while read -r file; do
  echo "Change detected in $file"
  yarn build
done
