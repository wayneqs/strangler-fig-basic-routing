# Strangler Fig Pattern Proof of Concept

This project demonstrates the Strangler Fig pattern using two Next.js applications (a "legacy" app and a "new" app) and a nginx proxy. The proxy routes traffic between the two applications, allowing for incremental replacement of the legacy application.

## Project Overview

The core of this demonstration is the `proxy` service, which is an nginx server. It is configured to route requests to different applications based on the URL path. This is the key to the Strangler Fig pattern.

- **Legacy Application**: A simple Next.js application that represents the existing system.
- **New Application**: Another Next.js application that will gradually replace the legacy application.
- **Proxy**: An nginx server that acts as a facade, routing requests to either the legacy or new application based on the URL.

Initially, all traffic is routed to the legacy application. As new features are built in the new application, the nginx configuration is updated to route specific URL paths to the new application.

In this example, requests to `/billing` are routed to the new application, while all other requests are routed to the legacy application.

## Dependencies

To run this project, you will need to have the following installed on your local machine:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd strangler-fig-basic-routing
```

---

## Local Deployment (Recommended for Development)

You can run the full stack locally using Docker Compose. This will start the legacy app, new app, and the nginx proxy, allowing you to test the Strangler Fig pattern on your machine.

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Steps

1. **Start all services locally:**

```bash
docker-compose up --build
```

This will build and start the containers for the legacy app, new app, and proxy. You can then access the applications at [http://localhost](http://localhost).

2. **Stop the services:**
   Press `Ctrl+C` in the terminal, then run:

```bash
docker-compose down
```

---

## Deploy to Azure

The infrastructure is managed using [Pulumi](https://www.pulumi.com/) and provisions Azure resources including a resource group, Azure Container Registry, and Azure Container Apps environment.

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Pulumi CLI](https://www.pulumi.com/docs/get-started/install/)
- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
- Azure subscription

### Steps

1. **Install dependencies:**

```bash
cd infrastructure
npm install
```

2. **Login to Pulumi and Azure:**

```bash
pulumi login
az login
```

3. **Set up your Pulumi stack and Azure region:**

```bash
pulumi stack init dev   # Only if this is a new stack
pulumi config set azure-native:location <your-azure-region>
```

4. **Deploy the infrastructure:**

```bash
pulumi up
```

This will provision the required Azure resources. Pulumi stack outputs (such as registry credentials) will be used by the deploy scripts.

### 3. Build and Deploy the Applications

The deployment scripts in the `deploy` folder will build the proxy Docker image, push it to Azure Container Registry, and deploy it to Azure Container Apps.

#### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
- Pulumi stack must be deployed (see above)

#### Steps

1. **Build and push the proxy Docker image:**

```bash
cd ../deploy
./build.sh
```

2. **Deploy the proxy to Azure Container Apps:**

```bash
./deploy.sh
```

This will create (or update) the proxy container app in Azure using the image from Azure Container Registry.

> **Note:** The legacy and new Next.js apps are not deployed to Azure Container Apps by default in this setup. You can extend the infrastructure and deployment scripts to containerize and deploy these apps similarly if desired.

## Testing the Application

Once the containers are running, you can access the applications in your browser:

- **Legacy App (anything not `/billing`)**:
  - [http://localhost/](http://localhost/)
  - [http://localhost/claims](http://localhost/claims)
  - [http://localhost/customer-servicing](http://localhost/customer-servicing)
  - [http://localhost/finance](http://localhost/finance)
  - [http://localhost/quote](http://localhost/quote)
  - [http://localhost/underwriting](http://localhost/underwriting)
- **New App (`/billing`)**:
  - [http://localhost/billing](http://localhost/billing)
