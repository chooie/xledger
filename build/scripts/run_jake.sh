#!/usr/bin/env bash
# Runs Jake from node_modules directory, preventing it from needing to be
# installed globally. Also ensures node modules have been built

if [ ! -f node_modules/.bin/jake ] ; then
  echo "Building npm modules:"
  npm rebuild
fi
node_modules/.bin/jake $*
