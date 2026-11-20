#!/bin/sh
set -eu

npm ci
npx playwright install chromium
npm test
