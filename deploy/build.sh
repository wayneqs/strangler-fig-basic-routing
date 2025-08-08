#!/bin/bash
set -e

# Build and push Docker image for the proxy
# Requires Azure CLI login and Pulumi stack outputs

IMAGE_NAME="proxy"
STACK_NAME="dev"
INFRA_DIR="../infrastructure"

cd "$(dirname "$0")"

# Get registry info from Pulumi stack output
cd "$INFRA_DIR"
REGISTRY_SERVER=$(pulumi stack output registryLoginServer)
REGISTRY_USERNAME=$(pulumi stack output registryUsername)
REGISTRY_PASSWORD=$(pulumi stack output registryPassword)
cd - > /dev/null

# Build image
docker build -t "$REGISTRY_SERVER/$IMAGE_NAME:latest" ../proxy

echo "$REGISTRY_PASSWORD" | docker login "$REGISTRY_SERVER" -u "$REGISTRY_USERNAME" --password-stdin

docker push "$REGISTRY_SERVER/$IMAGE_NAME:latest"

echo "Image pushed: $REGISTRY_SERVER/$IMAGE_NAME:latest"
