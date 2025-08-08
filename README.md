# Strangler Fig Pattern Proof of Concept

This project demonstrates the Strangler Fig pattern using two Next.js applications (a "legacy" app and a "new" app) and a nginx proxy. The proxy routes traffic between the two applications, allowing for incremental replacement of the legacy application.

## Project Overview

The core of this demonstration is the `proxy` service, which is an nginx server. It is configured to route requests to different applications based on the URL path. This is the key to the Strangler Fig pattern.

-   **Legacy Application**: A simple Next.js application that represents the existing system.
-   **New Application**: Another Next.js application that will gradually replace the legacy application.
-   **Proxy**: An nginx server that acts as a facade, routing requests to either the legacy or new application based on the URL.

Initially, all traffic is routed to the legacy application. As new features are built in the new application, the nginx configuration is updated to route specific URL paths to the new application.

In this example, requests to `/billing` are routed to the new application, while all other requests are routed to the legacy application.

## Dependencies

To run this project, you will need to have the following installed on your local machine:

-   [Docker](https://docs.docker.com/get-docker/)
-   [Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    ```

2.  **Start the services:**

    Navigate to the root of the project and run the following command:

    ```bash
    docker-compose up
    ```

    This will build the Docker images for the legacy app, new app, and the proxy, and then start the containers.

## Testing the Application

Once the containers are running, you can access the applications in your browser:

-   **Legacy App (anything not `/billing`)**:
    -   [http://localhost/](http://localhost/)
    -   [http://localhost/claims](http://localhost/claims)
    -   [http://localhost/customer-servicing](http://localhost/customer-servicing)
    -   [http://localhost/finance](http://localhost/finance)
    -   [http://localhost/quote](http://localhost/quote)
    -   [http://localhost/underwriting](http://localhost/underwriting)
-   **New App (`/billing`)**:
    -   [http://localhost/billing](http://localhost/billing)
