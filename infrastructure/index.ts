import * as azure from "@pulumi/azure-native";
import * as pulumi from "@pulumi/pulumi";

// Config
const config = new pulumi.Config();
const location = config.get("location") || "westeurope";
const resourceGroupName = "strangler-fig-rg";
const containerAppEnvName = "strangler-fig-env";
const registryName = pulumi.interpolate`stranglerfig${pulumi.getStack()}`.apply(
  (n) =>
    n
      .replace(/[^a-zA-Z0-9]/g, "")
      .toLowerCase()
      .substring(0, 24)
);

// Resource Group
const resourceGroup = new azure.resources.ResourceGroup(resourceGroupName, {
  location,
});

// Container Registry
const registry = new azure.containerregistry.Registry(registryName, {
  resourceGroupName: resourceGroup.name,
  location: resourceGroup.location,
  sku: { name: "Basic" },
  adminUserEnabled: true,
});

// Container Apps Environment
const env = new azure.app.ManagedEnvironment(containerAppEnvName, {
  resourceGroupName: resourceGroup.name,
  location: resourceGroup.location,
});

// Export outputs
export const rgName = resourceGroup.name;
export const registryLoginServer = registry.loginServer;
export const registryUsername = registry.adminUserEnabled
  .apply((_) =>
    azure.containerregistry.listRegistryCredentials({
      resourceGroupName: resourceGroup.name,
      registryName: registry.name,
    })
  )
  .apply((creds) => creds.username!);
export const registryPassword = registry.adminUserEnabled
  .apply((_) =>
    azure.containerregistry.listRegistryCredentials({
      resourceGroupName: resourceGroup.name,
      registryName: registry.name,
    })
  )
  .apply((creds) => creds.passwords![0].value!);
export const envName = env.name;
