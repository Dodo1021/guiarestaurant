#!/bin/sh
set -e

echo "🔄 Running database migrations..."
npx prisma db push --skip-generate 2>&1 || echo "⚠️ db push failed (may already be in sync)"

echo "🌱 Running seed..."
npx tsx prisma/seed.ts 2>&1 || echo "⚠️ Seed failed (may already exist)"

echo "🚀 Starting application..."
exec node server.js
