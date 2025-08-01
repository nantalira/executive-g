#!/bin/bash

# Executive Dashboard Docker Management Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker first."
        exit 1
    fi
}

# Check if network exists
check_network() {
    if ! docker network ls | grep -q "database-network"; then
        print_warning "database-network not found. Creating network..."
        docker network create database-network
        print_success "Network database-network created"
    else
        print_info "Network database-network already exists"
    fi
}

# Development commands
dev_up() {
    print_info "Starting development environment..."
    check_docker
    check_network
    docker-compose -f docker-compose.dev.yml up -d
    print_success "Development environment started"
    print_info "Frontend: http://localhost:3000"
    print_info "Backend API: http://localhost:8000/api"
}

dev_down() {
    print_info "Stopping development environment..."
    docker-compose -f docker-compose.dev.yml down
    print_success "Development environment stopped"
}

dev_logs() {
    docker-compose -f docker-compose.dev.yml logs -f
}

dev_rebuild() {
    print_info "Rebuilding development environment..."
    docker-compose -f docker-compose.dev.yml down
    docker-compose -f docker-compose.dev.yml up --build -d
    print_success "Development environment rebuilt"
}

# Production commands
prod_up() {
    print_info "Starting production environment..."
    check_docker
    check_network
    docker-compose -f docker-compose.prod.yml up -d
    print_success "Production environment started"
    print_info "Frontend: http://localhost:80"
    print_info "Backend API: http://localhost:8000/api"
}

prod_down() {
    print_info "Stopping production environment..."
    docker-compose -f docker-compose.prod.yml down
    print_success "Production environment stopped"
}

prod_logs() {
    docker-compose -f docker-compose.prod.yml logs -f
}

prod_rebuild() {
    print_info "Rebuilding production environment..."
    docker-compose -f docker-compose.prod.yml down
    docker-compose -f docker-compose.prod.yml up --build -d
    print_success "Production environment rebuilt"
}

# Utility commands
status() {
    print_info "Docker containers status:"
    docker ps --filter "name=executive" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
}

clean() {
    print_warning "This will remove all stopped containers, unused networks, and dangling images"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker system prune -f
        print_success "Docker system cleaned"
    else
        print_info "Clean operation cancelled"
    fi
}

health() {
    print_info "Checking API health..."
    if curl -s http://localhost:8000/api/health > /dev/null; then
        print_success "API is healthy"
        curl -s http://localhost:8000/api/health | jq '.'
    else
        print_error "API is not responding"
    fi
}

# Help function
show_help() {
    echo "Executive Dashboard Docker Management Script"
    echo
    echo "Usage: $0 [COMMAND]"
    echo
    echo "Development Commands:"
    echo "  dev:up        Start development environment"
    echo "  dev:down      Stop development environment"
    echo "  dev:logs      Show development logs"
    echo "  dev:rebuild   Rebuild development environment"
    echo
    echo "Production Commands:"
    echo "  prod:up       Start production environment"
    echo "  prod:down     Stop production environment"
    echo "  prod:logs     Show production logs"
    echo "  prod:rebuild  Rebuild production environment"
    echo
    echo "Utility Commands:"
    echo "  status        Show container status"
    echo "  health        Check API health"
    echo "  clean         Clean Docker system"
    echo
    echo "Examples:"
    echo "  $0 dev:up     # Start development"
    echo "  $0 prod:up    # Start production"
    echo "  $0 status     # Check status"
    echo "  $0 health     # Check API health"
}

# Main command handler
case "${1:-}" in
    "dev:up")
        dev_up
        ;;
    "dev:down")
        dev_down
        ;;
    "dev:logs")
        dev_logs
        ;;
    "dev:rebuild")
        dev_rebuild
        ;;
    "prod:up")
        prod_up
        ;;
    "prod:down")
        prod_down
        ;;
    "prod:logs")
        prod_logs
        ;;
    "prod:rebuild")
        prod_rebuild
        ;;
    "status")
        status
        ;;
    "health")
        health
        ;;
    "clean")
        clean
        ;;
    "help"|"--help"|"-h")
        show_help
        ;;
    "")
        print_error "No command specified"
        show_help
        exit 1
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac
