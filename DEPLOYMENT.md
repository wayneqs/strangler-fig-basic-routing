# Quick Deployment Guide

This guide walks you through deploying the complete Strangler Fig architecture to Azure Container Apps with proper network security.

## Architecture Overview

```
Internet → Proxy (Public) → Legacy App (Private)
                         → New App (Private)
```

- **Proxy**: Public-facing nginx reverse proxy (HTTPS accessible)
- **Legacy App**: Private Next.js application (internal access only)
- **New App**: Private Next.js application (internal access only)
- **Network**: All containers run in the same Container Apps environment with VNet integration

## Prerequisites

- Azure CLI: `az login` or Or use `pulumi login --local` if manging deployment state locally.
- Pulumi CLI: `pulumi login`
- Docker: Ensure Docker is running
- Node.js: For infrastructure dependencies

## Step-by-Step Deployment

### 1. Deploy Infrastructure (One-time setup)

```bash
cd infrastructure
npm install
pulumi stack init dev  # If new stack
pulumi config set azure-native:location westeurope  # or your preferred region
pulumi up
```

This creates:

- ✅ Resource Group
- ✅ Container Registry (ACR)
- ✅ Virtual Network with delegated subnet
- ✅ Container Apps Environment
- ✅ All three Container Apps (proxy, legacy-app, new-app)

### 2. Build and Push Images

```bash
cd ../deploy
./build.sh
```

This builds and pushes:

- ✅ `proxy:latest` → ACR
- ✅ `legacy-app:latest` → ACR
- ✅ `new-app:latest` → ACR

### 3. Deploy/Update Containers

```bash
./deploy.sh
```

This updates the Container Apps with the latest images and outputs your public URL.

## Verification

After deployment, you'll get a URL like: `https://proxy--<random-id>.<region>.azurecontainerapps.io`

Test the routing:

- `/` → Legacy App
- `/billing` → New App
- `/claims` → Legacy App
- All other routes → Legacy App

## Network Security Verification

- ✅ **Proxy**: Accessible from internet (external ingress)
- ❌ **Legacy App**: Not directly accessible (internal ingress only)
- ❌ **New App**: Not directly accessible (internal ingress only)

## Updating Code

1. Make changes to your applications
2. Run `./build.sh` to rebuild and push images
3. Run `./deploy.sh` to update the running containers

## Troubleshooting

- **Build fails**: Check Docker login and registry permissions
- **Deploy fails**: Ensure `pulumi up` completed successfully
- **Routing issues**: Check nginx.conf configuration
- **Container not starting**: Check Container Apps logs in Azure Portal

## Cleanup

```bash
cd infrastructure
pulumi destroy
```

This removes all Azure resources.
