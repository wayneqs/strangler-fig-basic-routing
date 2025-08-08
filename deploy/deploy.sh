#!/bin/bash
set -e

# Deploy the proxy container to Azure Container Apps
# Requires Pulumi stack outputs and Azure CLI login

STACK_NAME="dev"
INFRA_DIR="../infrastructure"

cd "$(dirname "$0")"

# Get outputs from Pulumi stack
cd "$INFRA_DIR"
RESOURCE_GROUP=$(pulumi stack output rgName)
ENV_NAME=$(pulumi stack output envName)
REGISTRY_SERVER=$(pulumi stack output registryLoginServer)
REGISTRY_USERNAME=$(pulumi stack output registryUsername)
REGISTRY_PASSWORD=$(pulumi stack output registryPassword)
cd - > /dev/null

IMAGE="$REGISTRY_SERVER/proxy:latest"
APP_NAME="strangler-fig-proxy"

az containerapp create \
  --name "$APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --environment "$ENV_NAME" \
  --image "$IMAGE" \
  --registry-server "$REGISTRY_SERVER" \
  --registry-username "$REGISTRY_USERNAME" \
  --registry-password "$REGISTRY_PASSWORD" \
  --ingress external --target-port 80

echo "Deployed $APP_NAME to Azure Container Apps."
