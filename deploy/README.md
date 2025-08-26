# Deploy Scripts

- `build.sh`: Builds and pushes all three Docker images (proxy, legacy-app, new-app) to Azure Container Registry (ACR) using credentials from Pulumi stack outputs.
- `deploy.sh`: Deploys all three containers to Azure Container Apps with proper network configuration using Azure CLI and Pulumi stack outputs.

## Architecture

- **Proxy Container**: Publicly accessible via HTTPS, routes traffic to internal services
- **Legacy-App Container**: Private, only accessible from within the Container Apps environment
- **New-App Container**: Private, only accessible from within the Container Apps environment
- **Network**: All containers are deployed in the same Container Apps environment with VNet integration for secure internal communication

## Usage

1. **Deploy Infrastructure**: Run `pulumi up` in the `infrastructure` folder to create:
   - Resource Group
   - Container Registry
   - Virtual Network with delegated subnet
   - Container Apps Environment with VNet integration
   - All three Container Apps (proxy, legacy-app, new-app)

2. **Build and Push Images**: Run `./build.sh` to build and push all Docker images to ACR

3. **Deploy/Update Containers**: Run `./deploy.sh` to update the Container Apps with the latest images

## Prerequisites

- Azure CLI logged in (`az login`)
- Pulumi CLI installed and configured
- Docker installed and running
- Infrastructure deployed with `pulumi up` in the `infrastructure` folder

## Network Security

- **Public Access**: Only the proxy container is accessible from the internet
- **Private Communication**: Legacy-app and new-app containers can only be reached by the proxy container
- **Internal DNS**: Container Apps use internal service discovery for communication
