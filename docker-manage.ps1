# Executive Dashboard Docker Management Script (PowerShell)

param(
    [Parameter(Position=0)]
    [string]$Command
)

# Colors for output
function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Check if docker is running
function Test-Docker {
    try {
        docker info | Out-Null
        return $true
    }
    catch {
        Write-Error "Docker is not running. Please start Docker first."
        exit 1
    }
}

# Check if network exists
function Test-Network {
    $networkExists = docker network ls | Select-String "database-network"
    if (-not $networkExists) {
        Write-Warning "database-network not found. Creating network..."
        docker network create database-network
        Write-Success "Network database-network created"
    }
    else {
        Write-Info "Network database-network already exists"
    }
}

# Development commands
function Start-Development {
    Write-Info "Starting development environment..."
    Test-Docker
    Test-Network
    docker-compose -f docker-compose.dev.yml up -d
    Write-Success "Development environment started"
    Write-Info "Frontend: http://localhost:3000"
    Write-Info "Backend API: http://localhost:8000/api"
}

function Stop-Development {
    Write-Info "Stopping development environment..."
    docker-compose -f docker-compose.dev.yml down
    Write-Success "Development environment stopped"
}

function Show-DevelopmentLogs {
    docker-compose -f docker-compose.dev.yml logs -f
}

function Rebuild-Development {
    Write-Info "Rebuilding development environment..."
    docker-compose -f docker-compose.dev.yml down
    docker-compose -f docker-compose.dev.yml up --build -d
    Write-Success "Development environment rebuilt"
}

# Production commands
function Start-Production {
    Write-Info "Starting production environment..."
    Test-Docker
    Test-Network
    docker-compose -f docker-compose.prod.yml up -d
    Write-Success "Production environment started"
    Write-Info "Frontend: http://localhost:80"
    Write-Info "Backend API: http://localhost:8000/api"
}

function Stop-Production {
    Write-Info "Stopping production environment..."
    docker-compose -f docker-compose.prod.yml down
    Write-Success "Production environment stopped"
}

function Show-ProductionLogs {
    docker-compose -f docker-compose.prod.yml logs -f
}

function Rebuild-Production {
    Write-Info "Rebuilding production environment..."
    docker-compose -f docker-compose.prod.yml down
    docker-compose -f docker-compose.prod.yml up --build -d
    Write-Success "Production environment rebuilt"
}

# Utility commands
function Show-Status {
    Write-Info "Docker containers status:"
    docker ps --filter "name=executive" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
}

function Clear-Docker {
    Write-Warning "This will remove all stopped containers, unused networks, and dangling images"
    $response = Read-Host "Are you sure? (y/N)"
    if ($response -eq "y" -or $response -eq "Y") {
        docker system prune -f
        Write-Success "Docker system cleaned"
    }
    else {
        Write-Info "Clean operation cancelled"
    }
}

function Test-Health {
    Write-Info "Checking API health..."
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:8000/api/health" -Method Get -TimeoutSec 10
        Write-Success "API is healthy"
        $response | ConvertTo-Json -Depth 3
    }
    catch {
        Write-Error "API is not responding"
    }
}

# Help function
function Show-Help {
    Write-Host "Executive Dashboard Docker Management Script" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage: .\docker-manage.ps1 [COMMAND]" -ForegroundColor White
    Write-Host ""
    Write-Host "Development Commands:" -ForegroundColor Yellow
    Write-Host "  dev:up        Start development environment"
    Write-Host "  dev:down      Stop development environment"
    Write-Host "  dev:logs      Show development logs"
    Write-Host "  dev:rebuild   Rebuild development environment"
    Write-Host ""
    Write-Host "Production Commands:" -ForegroundColor Yellow
    Write-Host "  prod:up       Start production environment"
    Write-Host "  prod:down     Stop production environment"
    Write-Host "  prod:logs     Show production logs"
    Write-Host "  prod:rebuild  Rebuild production environment"
    Write-Host ""
    Write-Host "Utility Commands:" -ForegroundColor Yellow
    Write-Host "  status        Show container status"
    Write-Host "  health        Check API health"
    Write-Host "  clean         Clean Docker system"
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor Green
    Write-Host '  .\docker-manage.ps1 dev:up     # Start development'
    Write-Host '  .\docker-manage.ps1 prod:up    # Start production'
    Write-Host '  .\docker-manage.ps1 status     # Check status'
    Write-Host '  .\docker-manage.ps1 health     # Check API health'
}

# Main command handler
switch ($Command) {
    "dev:up" {
        Start-Development
    }
    "dev:down" {
        Stop-Development
    }
    "dev:logs" {
        Show-DevelopmentLogs
    }
    "dev:rebuild" {
        Rebuild-Development
    }
    "prod:up" {
        Start-Production
    }
    "prod:down" {
        Stop-Production
    }
    "prod:logs" {
        Show-ProductionLogs
    }
    "prod:rebuild" {
        Rebuild-Production
    }
    "status" {
        Show-Status
    }
    "health" {
        Test-Health
    }
    "clean" {
        Clear-Docker
    }
    { $_ -in @("help", "--help", "-h") } {
        Show-Help
    }
    { [string]::IsNullOrEmpty($_) } {
        Write-Error "No command specified"
        Show-Help
        exit 1
    }
    default {
        Write-Error "Unknown command: $Command"
        Show-Help
        exit 1
    }
}
