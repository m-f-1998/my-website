#!/bin/bash

set -e

USERNAME="m-f-1998"
REPO_NAME="my-website"
MODE="${1:-local}"

if [[ "$MODE" == "prod" ]]; then
  TAG="latest"
  ANGULAR_CONFIG="production"
  PUSH=true
  echo "🚀 Building for PRODUCTION (tag: $TAG)"
elif [[ "$MODE" == "dev" ]]; then
  TAG="dev"
  ANGULAR_CONFIG="beta"
  PUSH=true
  echo "🧪 Building for DEVELOPMENT (tag: $TAG)"
else
  TAG="local"
  ANGULAR_CONFIG="development"
  PUSH=false
  echo "🛠️  Local build only (no push, no GHCR tag)"
fi

# GitHub Container Registry Personal Access Token Should 

IMAGE="ghcr.io/$USERNAME/$REPO_NAME:$TAG"

echo "🔄 Cleaning previous builds..."
rm -rf ../client/dist ../server/dist

echo "📦 Installing client dependencies..."
cd ../client
npm ci

echo "⚙️ Building Angular app..."
npm run build --configuration production
cd ..

echo "📦 Installing server dependencies..."
cd server
npm ci

echo "⚙️ Compiling backend (TypeScript)..."
npx tsc
cd ..

echo "✅ Build complete."

echo "🐳 Building Docker image: $IMAGE"
docker build -f docker/Dockerfile -t $IMAGE .

if [ "$PUSH" = true ]; then
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
else
  echo "📦 Local build complete. No image was pushed."
fi