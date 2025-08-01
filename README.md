# Executive Project - Docker Setup

This project consists of two main services:

-   **API Service**: Go-based API server (port 8100)
-   **Backend Service**: Laravel-based backend (port 8000 for dev, port 80 for prod)

## Prerequisites

-   Docker and Docker Compose installed
-   External database network (`database-network`) must exist

## Development Environment

### Setup

1. Create environment files:

    ```bash
    # For API
    cp api/.env.example api/.env

    # For Backend
    cp backend/.env.example backend/.env
    ```

2. Start development environment:
    ```bash
    docker-compose -f docker-compose.dev.yml up -d
    ```

### Services in Development

-   **API Service**: http://localhost:8100

    -   Hot reloading enabled with Air
    -   Health check: http://localhost:8100/health
    -   Ping endpoint: http://localhost:8100/api/v1/ping

-   **Backend Service**: http://localhost:8000
    -   Laravel development server
    -   Auto-installs composer dependencies

### Development Commands

```bash
# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop services
docker-compose -f docker-compose.dev.yml down

# Rebuild services
docker-compose -f docker-compose.dev.yml up --build -d

# Access API container
docker exec -it executive-api-dev sh

# Access Backend container
docker exec -it executive-backend-dev sh
```

## Production Environment

### Setup

1. Create production environment files:

    ```bash
    # For API
    cp api/.env.example api/.env.prod

    # For Backend
    cp backend/.env.example backend/.env.prod
    ```

2. Update production environment variables in the files above.

3. Start production environment:
    ```bash
    docker-compose -f docker-compose.prod.yml up -d
    ```

### Services in Production

-   **API Service**: http://localhost:8100

    -   Optimized Go binary
    -   Release mode enabled

-   **Backend Service**: http://localhost:80
    -   FrankenPHP server
    -   Optimized Laravel setup

### Production Commands

```bash
# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop services
docker-compose -f docker-compose.prod.yml down

# Update and restart
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

## Network Configuration

Both environments use the external `database-network` network to connect to your database services. Make sure this network exists:

```bash
# Create the network if it doesn't exist
docker network create database-network
```

## Environment Variables

### API Service (.env)

-   `GIN_MODE`: debug/release
-   `PORT`: API port (default: 8080)
-   `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`: Database connection
-   `API_KEY`, `JWT_SECRET`: Security configurations

### Backend Service (.env)

-   Standard Laravel environment variables
-   Database connection settings
-   App configurations

## Volumes

-   `executive_storage`: Laravel storage for uploaded files
-   `executive_logs`: Application logs

## Development Features

-   **Hot Reloading**: API service automatically reloads on code changes
-   **Volume Mounting**: Source code is mounted for live development
-   **Dependency Management**: Automatic composer install in development

## Troubleshooting

1. **Port conflicts**: Make sure ports 8100 and 8000/80 are available
2. **Network issues**: Ensure `database-network` exists and is accessible
3. **Permission issues**: Check file permissions for Laravel storage and cache directories
4. **Environment files**: Ensure all required environment variables are set
