# Executive Project - E-Commerce Platform

A complete e-commerce platform built with modern technologies including Laravel Filament for admin panel, React frontend, and Go API services.

## 🏗️ Architecture

This project consists of three main services:

-   **API Service**: Go-based API server (port 8100) - Main API endpoints
-   **Backend Service**: Laravel-based backend with Filament admin panel (port 8000 for dev, port 80 for prod)
-   **Frontend Service**: React-based customer interface
-   **Database**: MySQL 8.0 with Redis for caching

## 📋 Prerequisites

Before starting, ensure you have the following installed on your system:

### Required Software
-   **Docker** (version 20.10 or higher)
-   **Docker Compose** (version 2.0 or higher)
-   **Git** for version control

### System Requirements
-   **RAM**: Minimum 4GB (8GB recommended)
-   **Storage**: At least 10GB free space
-   **OS**: Linux, macOS, or Windows with WSL2

### Network Setup
-   External database network (`database-network`) must exist
-   Ports 8000, 8100, 3000, and 80 should be available

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/nantalira/executive-g.git
cd executive-g
```

### 2. Create Docker Network
```bash
# Create the network if it doesn't exist
docker network create database-network
```

### 3. Setup Environment Files
```bash
# For Laravel Backend (choose one based on your environment)
cp laravel/.env.development laravel/.env  # For development
# OR
cp laravel/.env.production laravel/.env   # For production

# For React Frontend
cp react-frontend/.env.example react-frontend/.env
```

### 4. Generate Laravel Keys
```bash
# Generate application key and JWT secret
cd laravel
docker run --rm -v $(pwd):/app composer:latest composer install --no-dev --optimize-autoloader
docker run --rm -v $(pwd):/app php:8.2-cli php artisan key:generate
docker run --rm -v $(pwd):/app php:8.2-cli php artisan jwt:secret
cd ..
```

### 5. Start the Application
```bash
# For development
docker-compose -f docker-compose.dev.yml up -d

# For production
docker-compose -f docker-compose.prod.yml up -d
```

## Development Environment

### Setup

1. Create development environment files:

    ```bash

    # For Laravel Backend
    cp laravel/.env.example laravel/.env
    
    # For React Frontend
    cp react-frontend/.env.example react-frontend/.env
    ```

    Set the required environment variables in these files.
    
    ```bash
    APP_DEBUG=true 
    LOG_LEVEL=debug 
    CACHE_STORE=array 
    MAIL_MAILER=log 
    FORCE_HTTPS=false 
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

# View specific service logs
docker-compose -f docker-compose.dev.yml logs -f executive-backend
docker-compose -f docker-compose.dev.yml logs -f executive-api

# Stop services
docker-compose -f docker-compose.dev.yml down

# Rebuild services
docker-compose -f docker-compose.dev.yml up --build -d

# Restart specific service
docker-compose -f docker-compose.dev.yml restart executive-backend

# Access containers
docker exec -it executive-api-dev sh
docker exec -it executive-backend-dev sh

# Laravel specific commands
docker exec -it executive-backend-dev php artisan migrate
docker exec -it executive-backend-dev php artisan db:seed
docker exec -it executive-backend-dev php artisan cache:clear
docker exec -it executive-backend-dev php artisan config:cache
```

## Production Environment

### Setup

1. Create production environment files:

    ```bash

    # For Laravel Backend
    cp laravel/.env.example laravel/.env
    
    # For React Frontend
    cp react-frontend/.env.example react-frontend/.env
    ```

    Set the required environment variables in these files.
    
    ```bash
    APP_DEBUG=false
    LOG_LEVEL=error
    CACHE_STORE=redis
    MAIL_MAILER=smtp
    FORCE_HTTPS=true
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

# View specific service logs
docker-compose -f docker-compose.prod.yml logs -f executive-backend
docker-compose -f docker-compose.prod.yml logs -f executive-api

# Stop services
docker-compose -f docker-compose.prod.yml down

# Update and restart
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d

# Restart specific service only
docker-compose -f docker-compose.prod.yml restart executive-backend

# Database migrations and optimizations
docker exec -it executive-backend-prod php artisan migrate --force
docker exec -it executive-backend-prod php artisan config:cache
docker exec -it executive-backend-prod php artisan route:cache
docker exec -it executive-backend-prod php artisan view:cache
docker exec -it executive-backend-prod php artisan optimize

# Backup database
docker exec mysql-8.0 mysqldump -u root -p executive > backup_$(date +%Y%m%d_%H%M%S).sql
```

## 🔧 Initial Setup & Configuration

### Database Setup

1. **Create Database Network**
```bash
docker network create database-network
```

2. **Start Database Services** (if not already running)
```bash
# Start MySQL and Redis containers
docker run -d --name mysql-8.0 \
  --network database-network \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=your_password \
  -e MYSQL_DATABASE=executive \
  -v mysql_data:/var/lib/mysql \
  mysql:8.0

docker run -d --name redis \
  --network database-network \
  -p 6379:6379 \
  redis:alpine
```

3. **Run Database Migrations**
```bash
# After starting the application
docker exec -it executive-backend-dev php artisan migrate
docker exec -it executive-backend-dev php artisan db:seed
```

### Laravel Configuration

1. **Generate Application Keys**
```bash
docker exec -it executive-backend-dev php artisan key:generate
docker exec -it executive-backend-dev php artisan jwt:secret
```

2. **Create Storage Link**
```bash
docker exec -it executive-backend-dev php artisan storage:link
```

3. **Create Filament Admin User**
```bash
docker exec -it executive-backend-dev php artisan make:filament-user
```

### File Permissions (Linux/Mac)
```bash
# Set proper permissions for Laravel
sudo chown -R $USER:$USER laravel/
sudo chmod -R 755 laravel/
sudo chmod -R 775 laravel/storage laravel/bootstrap/cache
```

## Network Configuration

Both environments use the external `database-network` network to connect to your database services.

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

## 🔍 Health Checks & Monitoring

### Service Health Checks
```bash
# Check all services status
docker-compose -f docker-compose.prod.yml ps

# Test API endpoints
curl http://localhost:8100/health
curl http://localhost:8100/api/v1/ping

# Test Laravel backend
curl http://localhost:8000  # Development
curl http://localhost:80    # Production
```

### Database Connection Test
```bash
# Test database connection
docker exec -it executive-backend-prod php artisan tinker
# In tinker: DB::connection()->getPdo();
```

## 🛠️ Management Scripts

### Useful Shell Scripts
```bash
# Create a management script
cat > manage.sh << 'EOF'
#!/bin/bash

case "$1" in
  "dev-start")
    docker-compose -f docker-compose.dev.yml up -d
    ;;
  "prod-start") 
    docker-compose -f docker-compose.prod.yml up -d
    ;;
  "dev-stop")
    docker-compose -f docker-compose.dev.yml down
    ;;
  "prod-stop")
    docker-compose -f docker-compose.prod.yml down
    ;;
  "logs")
    docker-compose -f docker-compose.prod.yml logs -f ${2:-}
    ;;
  "migrate")
    docker exec -it executive-backend-prod php artisan migrate
    ;;
  "seed")
    docker exec -it executive-backend-prod php artisan db:seed
    ;;
  "optimize")
    docker exec -it executive-backend-prod php artisan optimize
    ;;
  *)
    echo "Usage: $0 {dev-start|prod-start|dev-stop|prod-stop|logs|migrate|seed|optimize}"
    exit 1
    ;;
esac
EOF

chmod +x manage.sh

# Usage examples:
./manage.sh dev-start
./manage.sh logs executive-backend
./manage.sh migrate
```

## 🚨 Troubleshooting

### Common Issues

1. **Port conflicts**: 
   ```bash
   # Check which process is using the port
   sudo lsof -i :8100
   sudo lsof -i :8000
   
   # Kill the process if needed
   sudo kill -9 <PID>
   ```

2. **Network issues**: 
   ```bash
   # Ensure database-network exists
   docker network ls | grep database-network
   
   # Recreate if missing
   docker network rm database-network
   docker network create database-network
   ```

3. **Permission issues**: 
   ```bash
   # Fix Laravel permissions
   sudo chown -R www-data:www-data laravel/storage laravel/bootstrap/cache
   sudo chmod -R 775 laravel/storage laravel/bootstrap/cache
   ```

4. **Environment files**: 
   ```bash
   # Verify environment variables
   docker exec -it executive-backend-prod php artisan config:show
   
   # Clear and rebuild config cache
   docker exec -it executive-backend-prod php artisan config:clear
   docker exec -it executive-backend-prod php artisan config:cache
   ```

5. **Mixed Content Issues (HTTPS)**:
   ```bash
   # Set proper environment variables
   FORCE_HTTPS=true
   APP_URL=https://yourdomain.com
   
   # Clear caches
   docker exec -it executive-backend-prod php artisan cache:clear
   docker exec -it executive-backend-prod php artisan config:cache
   ```

6. **Database Connection Failed**:
   ```bash
   # Check database container
   docker logs mysql-8.0
   
   # Test connection
   docker exec -it mysql-8.0 mysql -u root -p -e "SHOW DATABASES;"
   ```

### Performance Optimization

```bash
# Enable PHP OPcache (production)
docker exec -it executive-backend-prod php -m | grep -i opcache

# Laravel optimizations
docker exec -it executive-backend-prod php artisan optimize
docker exec -it executive-backend-prod php artisan config:cache
docker exec -it executive-backend-prod php artisan route:cache
docker exec -it executive-backend-prod php artisan view:cache

# Check Laravel performance
docker exec -it executive-backend-prod php artisan about
```

## 📚 Additional Resources

- [Laravel Documentation](https://laravel.com/docs)
- [Filament Documentation](https://filamentphp.com/docs)
- [Docker Documentation](https://docs.docker.com)
- [Environment Configuration Guide](./ENV_GUIDE.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
