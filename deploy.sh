#!/bin/bash

set -e

# Get the directory of the script to handle relative paths correctly
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "📦 Compiling project..."
"$SCRIPT_DIR/docker/compile.sh"

USERNAME="m-f-1998"
REPO_NAME="my-website"
MODE="${1:-local}"

if [[ "$MODE" == "latest" ]]; then
  TAG="latest"
  echo "🚀 Building for PRODUCTION (tag: $TAG)"
elif [[ "$MODE" == "dev" ]]; then
  TAG="dev"
  echo "🧪 Building for DEVELOPMENT (tag: $TAG)"
else
  echo "❌ Invalid mode specified. Use 'latest' or 'dev'."
  exit 1
fi

IMAGE="ghcr.io/$USERNAME/$REPO_NAME:$TAG"

echo "🐳 Building Docker image: $IMAGE"
cd "$SCRIPT_DIR/docker"
docker build -f Dockerfile -t $IMAGE .

if ! docker info 2>/dev/null | grep -q 'ghcr.io'; then
  if [ -z "$CR_PAT" ]; then
    echo "❌ CR_PAT (GitHub Container Registry Personal Access Token) not provided."
    exit 1
  fi
  echo "🔐 Logging into GitHub Container Registry..."
  echo $CR_PAT | docker login ghcr.io -u $USERNAME --password-stdin
else
  echo "🔓 Already logged into GitHub Container Registry."
fi

echo "📤 Pushing image to GHCR..."
docker push $IMAGE

echo "✅ Success! Image pushed to: $IMAGE"