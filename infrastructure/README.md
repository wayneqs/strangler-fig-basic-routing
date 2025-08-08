# Infrastructure (Pulumi)

This folder contains Pulumi code (TypeScript) to provision Azure resources for the strangler-fig basic routing solution.

## How to Use

1. Install dependencies:
   ```sh
   cd infrastructure
   npm install
   ```
2. Login to Pulumi (local or cloud):
   ```sh
   pulumi login
   ```
3. Set up your stack and Azure region:
   ```sh
   pulumi stack init dev
   pulumi config set azure-native:location <your-azure-region>
   ```
4. Deploy resources:
   ```sh
   pulumi up
   ```
5. Outputs (registry credentials, resource group, etc.) will be used by deploy scripts.

## Files

- `Pulumi.yaml`: Pulumi project config
- `index.ts`: Main Pulumi program
- `package.json`, `tsconfig.json`: Node.js project config
