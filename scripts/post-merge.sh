#!/bin/bash
set -e
npm install
# Schema application is a separately approved UK onboarding step.
# Never push the inherited UAE schema automatically after a code merge.
echo "UK database schema changes are not applied automatically."
