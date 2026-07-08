#!/bin/bash
set -e

# Business Starter — Build, Deploy, and Push to GitHub
# Usage: ./deploy.sh ["optional commit message"]

cd "$(dirname "$0")"

COMMIT_MSG="${1:-auto: deploy $(date '+%Y-%m-%d %H:%M')}"

echo "🔨 Building frontend..."
npm run build

echo "🐳 Building Docker image..."
docker compose build

echo "🚀 Deploying container..."
docker compose up -d

echo "📝 Committing changes to git..."
git add -A

if git diff --cached --quiet; then
  echo "✅ No changes to commit — already up to date."
else
  git commit -m "$COMMIT_MSG"
  echo "⬆️ Pushing to GitHub..."
  git push origin main
  echo "✅ Pushed to GitHub."
fi

echo ""
echo "✅ Deploy complete!"
echo "   App:  http://localhost:3001"
echo "   Git:  $(git remote get-url origin)"
echo "   Rev:  $(git rev-parse --short HEAD)"