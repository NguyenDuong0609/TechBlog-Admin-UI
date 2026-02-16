#!/bin/sh

# Exit immediately if a command exits with a non-zero status
set -e

# Ensure data directory exists (redundant if Docker handles volume, but safe)
mkdir -p /app/data

echo "Syncing database schema..."
prisma db push --accept-data-loss --skip-generate

# Auto-seed if not already seeded
if [ ! -f "/app/data/.seeded" ]; then
  echo "Seeding database with sample data..."
  npx tsx prisma/seed.ts
  touch /app/data/.seeded
  echo "Database seeded successfully."
else
  echo "Database already seeded. Skipping."
fi

echo "Database is ready (file:/app/data/dev.db). Starting the application..."
exec "$@"
