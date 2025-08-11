#!/bin/bash
set -e

# Build and push Docker images for all containers
# Requires Azure CLI login and Pulumi stack outputs

STACK_NAME="dev"
INFRA_DIR="../infrastructure"

cd "$(dirname "$0")"

# Get registry info from Pulumi stack output
cd "$INFRA_DIR"
REGISTRY_SERVER=$(pulumi stack output registryLoginServer)
REGISTRY_USERNAME=$(pulumi stack output registryUsername)
REGISTRY_PASSWORD=$(pulumi stack output registryPassword)
cd - > /dev/null

echo "Registry: $REGISTRY_SERVER"

# Login to registry
echo "$REGISTRY_PASSWORD" | docker login "$REGISTRY_SERVER" -u "$REGISTRY_USERNAME" --password-stdin

echo "Building and pushing images..."

# Build and push proxy image
echo "Building proxy..."
docker build -t "$REGISTRY_SERVER/proxy:latest" ../proxy
docker push "$REGISTRY_SERVER/proxy:latest"
echo "✓ Proxy image pushed: $REGISTRY_SERVER/proxy:latest"

# Build and push legacy-app image
echo "Building legacy-app..."
docker build -t "$REGISTRY_SERVER/legacy-app:latest" ../legacy-app
docker push "$REGISTRY_SERVER/legacy-app:latest"
echo "✓ Legacy-app image pushed: $REGISTRY_SERVER/legacy-app:latest"

# Build and push new-app image
echo "Building new-app..."
docker build -t "$REGISTRY_SERVER/new-app:latest" ../new-app
docker push "$REGISTRY_SERVER/new-app:latest"
echo "✓ New-app image pushed: $REGISTRY_SERVER/new-app:latest"

echo ""
echo "🎉 All images built and pushed successfully!"
echo "Next step: Run ./deploy.sh to deploy the containers to Azure Container Apps"
