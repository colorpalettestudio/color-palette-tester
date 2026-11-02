#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

# Reconcile dependencies with the merged lockfile without interactive prompts.
npm ci --include=dev --no-audit --no-fund --prefer-offline

npm run check
node --import tsx --test client/src/lib/*.test.ts
npm run build
