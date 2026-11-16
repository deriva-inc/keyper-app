#!/usr/bin/env bash
set -euo pipefail

echo "======================================================="
echo "   Keyper App Local Pre-flight Verification            "
echo "======================================================="

echo "1/4: Verifying lockfile and dependencies..."
pnpm install --frozen-lockfile

echo "2/4: Running TypeScript type check..."
pnpm tsc --noEmit

echo "3/4: Running ESLint..."
pnpm lint

echo "4/4: Verifying production Next.js build..."
pnpm build

echo ""
echo "======================================================="
echo "   ALL LOCAL CHECKS PASSED SUCCESSFULLY!               "
echo "======================================================="
