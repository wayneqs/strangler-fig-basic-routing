# Deploy Scripts

- `build.sh`: Builds and pushes the proxy Docker image to Azure Container Registry (ACR) using credentials from Pulumi stack outputs.
- `deploy.sh`: Deploys the proxy image to Azure Container Apps using Azure CLI and Pulumi stack outputs.

## Usage

1. Run `build.sh` to build and push the Docker image.
2. Run `deploy.sh` to deploy the image to Azure Container Apps.

Both scripts require you to be logged in to Azure CLI and have run `pulumi up` in the `infrastructure` folder first.
