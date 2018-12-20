#!/usr/bin/env bash

echo "Running 'dependency-check . --missing'"
echo "Anything listed here should be added to package.json"
echo ""
node_modules/.bin/dependency-check . --missing

missingStatus=$?
echo ""

echo "Running 'dependency-check . --unused'"
echo "Anything listed here should be removed from package.json"
echo "or added to the ignore-module options in tools/check-deps.sh"
echo ""
node_modules/.bin/dependency-check . --unused \
  --no-dev

unusedStatus=$?
echo ""

if [ $missingStatus -ne 0 ]; then exit 1; fi
if [ $unusedStatus -ne 0 ]; then exit 1; fi
