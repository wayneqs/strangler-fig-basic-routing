#!/bin/bash
set -e

# Deploy all containers to Azure Container Apps
# Requires Pulumi stack outputs and Azure CLI login
# Infrastructure must be deployed first with 'pulumi up'

STACK_NAME="dev"
INFRA_DIR="../infrastructure"

cd "$(dirname "$0")"

# Get outputs from Pulumi stack
cd "$INFRA_DIR"
RESOURCE_GROUP=$(pulumi stack output rgName)
ENV_NAME=$(pulumi stack output envName)
REGISTRY_SERVER=$(pulumi stack output registryLoginServer)
cd - > /dev/null

echo "Deploying to resource group: $RESOURCE_GROUP"
echo "Container Apps Environment: $ENV_NAME"
echo "Registry: $REGISTRY_SERVER"
echo ""
echo "Note: Container apps are already defined in the infrastructure."
echo "This script will trigger a revision update by updating the images."

# Update Legacy App
echo "Updating legacy-app..."
az containerapp update \
  --name "legacy-app" \
  --resource-group "$RESOURCE_GROUP" \
  --image "$REGISTRY_SERVER/legacy-app:latest"
echo "✓ Legacy-app updated"

# Update New App
echo "Updating new-app..."
az containerapp update \
  --name "new-app" \
  --resource-group "$RESOURCE_GROUP" \
  --image "$REGISTRY_SERVER/new-app:latest"
echo "✓ New-app updated"

# Update Proxy App
echo "Updating proxy..."
az containerapp update \
  --name "proxy" \
  --resource-group "$RESOURCE_GROUP" \
  --image "$REGISTRY_SERVER/proxy:latest"
echo "✓ Proxy updated"

echo ""
echo "🎉 All containers deployed successfully!"

# Get the proxy public URL
echo "Getting proxy public URL..."
PROXY_URL=$(az containerapp show \
  --name "proxy" \
  --resource-group "$RESOURCE_GROUP" \
  --query "properties.configuration.ingress.fqdn" \
  --output tsv)

echo ""
echo "📍 Your application is available at: https://$PROXY_URL"
echo "📍 Legacy routes (/, /claims, etc.): https://$PROXY_URL/"
echo "📍 New app routes (/billing): https://$PROXY_URL/billing"
