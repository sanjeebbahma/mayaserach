#!/bin/bash

# MAYA Search Engine - SearXNG Docker Setup Script
# This script sets up and runs SearXNG using Docker Compose

echo "🚀 Starting MAYA Search Engine with SearXNG..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not available. Please install Docker Compose."
    exit 1
fi

# Generate secret key if not already set
if grep -q "ultrasecretkey" searxng/settings.yml; then
    echo "🔐 Generating secret key..."
    if command -v openssl &> /dev/null; then
        SECRET_KEY=$(openssl rand -hex 32)
        sed -i "s|ultrasecretkey|$SECRET_KEY|g" searxng/settings.yml
        echo "✅ Secret key generated and updated"
    else
        echo "⚠️  OpenSSL not found. Please manually update the secret_key in searxng/settings.yml"
    fi
fi

# Start the services
echo "🐳 Starting Docker containers..."
if command -v docker-compose &> /dev/null; then
    docker-compose up -d
else
    docker compose up -d
fi

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are running
if docker ps | grep -q searxng; then
    echo "✅ SearXNG is running successfully!"
    echo "🌐 Access your search engine at: http://localhost"
    echo "🔗 API endpoint: http://localhost/search?q=test&format=json"
    echo "📊 To view logs: docker compose logs -f"
    echo "🛑 To stop: docker compose down"
else
    echo "❌ Failed to start SearXNG. Check logs with: docker compose logs"
    exit 1
fi
