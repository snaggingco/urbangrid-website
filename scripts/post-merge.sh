#!/bin/bash
set -e
# Source synchronization must never mutate an existing production schema.
npm ci
