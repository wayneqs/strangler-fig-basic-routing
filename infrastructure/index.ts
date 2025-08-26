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

// Virtual Network for private networking
const vnet = new azure.network.VirtualNetwork("strangler-fig-vnet", {
  resourceGroupName: resourceGroup.name,
  location: resourceGroup.location,
  addressSpace: {
    addressPrefixes: ["10.0.0.0/16"],
  },
});

// Subnet for Container Apps
const subnet = new azure.network.Subnet("container-apps-subnet", {
  resourceGroupName: resourceGroup.name,
  virtualNetworkName: vnet.name,
  addressPrefix: "10.0.1.0/24",
  delegations: [
    {
      name: "container-apps-delegation",
      serviceName: "Microsoft.App/environments",
    },
  ],
});

// Container Apps Environment with VNet integration
const env = new azure.app.ManagedEnvironment(containerAppEnvName, {
  resourceGroupName: resourceGroup.name,
  location: resourceGroup.location,
  vnetConfiguration: {
    infrastructureSubnetId: subnet.id,
    internal: false, // Set to false so proxy can have public access
  },
});

// Get admin credentials for registry
const registryUsername = registry.adminUserEnabled
  .apply((_) =>
    azure.containerregistry.listRegistryCredentials({
      resourceGroupName: resourceGroup.name,
      registryName: registry.name,
    })
  )
  .apply((creds) => creds.username!);

const registryPassword = registry.adminUserEnabled
  .apply((_) =>
    azure.containerregistry.listRegistryCredentials({
      resourceGroupName: resourceGroup.name,
      registryName: registry.name,
    })
  )
  .apply((creds) => creds.passwords![0].value!);

// Legacy App Container App (private - no external ingress)
const legacyApp = new azure.app.ContainerApp("legacy-app", {
  resourceGroupName: resourceGroup.name,
  location: resourceGroup.location,
  managedEnvironmentId: env.id,
  configuration: {
    registries: [
      {
        server: registry.loginServer,
        username: registryUsername,
        passwordSecretRef: "registry-password",
      },
    ],
    secrets: [
      {
        name: "registry-password",
        value: registryPassword,
      },
    ],
    ingress: {
      external: false, // Internal only - can't be accessed from internet
      targetPort: 3000,
      traffic: [
        {
          latestRevision: true,
          weight: 100,
        },
      ],
    },
  },
  template: {
    containers: [
      {
        name: "legacy-app",
        image: pulumi.interpolate`${registry.loginServer}/legacy-app:latest`,
        resources: {
          cpu: 0.25,
          memory: "0.5Gi",
        },
      },
    ],
    scale: {
      minReplicas: 1,
      maxReplicas: 3,
    },
  },
});

// New App Container App (private - no external ingress)
const newApp = new azure.app.ContainerApp("new-app", {
  resourceGroupName: resourceGroup.name,
  location: resourceGroup.location,
  managedEnvironmentId: env.id,
  configuration: {
    registries: [
      {
        server: registry.loginServer,
        username: registryUsername,
        passwordSecretRef: "registry-password",
      },
    ],
    secrets: [
      {
        name: "registry-password",
        value: registryPassword,
      },
    ],
    ingress: {
      external: false, // Internal only - can't be accessed from internet
      targetPort: 3000,
      traffic: [
        {
          latestRevision: true,
          weight: 100,
        },
      ],
    },
  },
  template: {
    containers: [
      {
        name: "new-app",
        image: pulumi.interpolate`${registry.loginServer}/new-app:latest`,
        resources: {
          cpu: 0.25,
          memory: "0.5Gi",
        },
      },
    ],
    scale: {
      minReplicas: 1,
      maxReplicas: 3,
    },
  },
});

// Proxy Container App (public - external ingress enabled)
const proxyApp = new azure.app.ContainerApp("proxy", {
  resourceGroupName: resourceGroup.name,
  location: resourceGroup.location,
  managedEnvironmentId: env.id,
  configuration: {
    registries: [
      {
        server: registry.loginServer,
        username: registryUsername,
        passwordSecretRef: "registry-password",
      },
    ],
    secrets: [
      {
        name: "registry-password",
        value: registryPassword,
      },
    ],
    ingress: {
      external: true, // Public access
      targetPort: 80,
      traffic: [
        {
          latestRevision: true,
          weight: 100,
        },
      ],
    },
  },
  template: {
    containers: [
      {
        name: "proxy",
        image: pulumi.interpolate`${registry.loginServer}/proxy:latest`,
        resources: {
          cpu: 0.25,
          memory: "0.5Gi",
        },
      },
    ],
    scale: {
      minReplicas: 1,
      maxReplicas: 5,
    },
  },
});

// Export outputs
export const rgName = resourceGroup.name;
export const envName = env.name;
export const registryLoginServer = registry.loginServer;
export const legacyAppFqdn = legacyApp.configuration.apply(c => c?.ingress?.fqdn || "");
export const newAppFqdn = newApp.configuration.apply(c => c?.ingress?.fqdn || "");
export const proxyFqdn = proxyApp.configuration.apply(c => c?.ingress?.fqdn || "");
