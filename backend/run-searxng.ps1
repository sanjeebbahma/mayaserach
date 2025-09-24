# MAYA Search Engine - SearXNG Docker Setup Script (PowerShell)
# This script sets up and runs SearXNG using Docker Compose

Write-Host "Starting MAYA Search Engine with SearXNG..." -ForegroundColor Green

# Check if Docker is running
try {
    docker info | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw "Docker not running"
    }
} catch {
    Write-Host "Docker is not running. Please start Docker and try again." -ForegroundColor Red
    exit 1
}

# Check if Docker Compose is available
try {
    docker compose version | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw "Docker Compose not available"
    }
} catch {
    Write-Host "Docker Compose is not available. Please install Docker Compose." -ForegroundColor Red
    exit 1
}

# Generate secret key if not already set
$settingsContent = Get-Content "searxng/settings.yml" -Raw
if ($settingsContent -match "ultrasecretkey") {
    Write-Host "Generating secret key..." -ForegroundColor Yellow
    
    # Generate random bytes for secret key
    $randomBytes = New-Object byte[] 32
    (New-Object Security.Cryptography.RNGCryptoServiceProvider).GetBytes($randomBytes)
    $secretKey = -join ($randomBytes | ForEach-Object { "{0:x2}" -f $_ })
    
    # Replace the secret key in settings.yml
    (Get-Content "searxng/settings.yml") -replace 'ultrasecretkey', $secretKey | Set-Content "searxng/settings.yml"
    Write-Host "Secret key generated and updated" -ForegroundColor Green
}

# Start the services
Write-Host "Starting Docker containers..." -ForegroundColor Blue
docker compose up -d

if ($LASTEXITCODE -eq 0) {
    # Wait for services to be ready
    Write-Host "Waiting for services to start..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
    
    # Check if services are running
    $searxngRunning = docker ps | Select-String "searxng"
    if ($searxngRunning) {
        Write-Host "SearXNG is running successfully!" -ForegroundColor Green
        Write-Host "Access your search engine at: http://localhost" -ForegroundColor Cyan
        Write-Host "API endpoint: http://localhost/search?q=test&format=json" -ForegroundColor Cyan
        Write-Host "To view logs: docker compose logs -f" -ForegroundColor Cyan
        Write-Host "To stop: docker compose down" -ForegroundColor Cyan
    } else {
        Write-Host "Failed to start SearXNG. Check logs with: docker compose logs" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Failed to start Docker containers. Check Docker status." -ForegroundColor Red
    exit 1
}
