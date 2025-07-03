#!/bin/bash

# Docker Setup Test Script for Markly
# This script tests the Docker setup to ensure all services work correctly

set -e

echo "🚀 Testing Markly Docker Setup..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_warning ".env file not found. Creating from .env.example..."
    cp .env.example .env
    print_status ".env file created"
else
    print_status ".env file exists"
fi

# Stop any existing containers
echo "🧹 Cleaning up existing containers..."
docker-compose down -v 2>/dev/null || true

# Build and start services
echo "🏗️ Building and starting services..."
docker-compose up -d --build

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if containers are running
echo "🔍 Checking container status..."

if docker-compose ps | grep -q "markly-mysql.*Up"; then
    print_status "MySQL container is running"
else
    print_error "MySQL container is not running"
    exit 1
fi

if docker-compose ps | grep -q "markly-backend.*Up"; then
    print_status "Backend container is running"
else
    print_error "Backend container is not running"
    exit 1
fi

if docker-compose ps | grep -q "markly-frontend.*Up"; then
    print_status "Frontend container is running"
else
    print_error "Frontend container is not running"
    exit 1
fi

# Test database connection
echo "🗄️ Testing database connection..."
if docker-compose exec -T mysql mysqladmin ping -h localhost -u root -prootpassword >/dev/null 2>&1; then
    print_status "Database is responding"
else
    print_error "Database is not responding"
    exit 1
fi

# Test backend health endpoint
echo "🔧 Testing backend health endpoint..."
if curl -f http://localhost:8080/health >/dev/null 2>&1; then
    print_status "Backend health endpoint is responding"
else
    print_error "Backend health endpoint is not responding"
    exit 1
fi

# Test GraphQL endpoint
echo "📊 Testing GraphQL endpoint..."
if curl -f -X POST -H "Content-Type: application/json" -d '{"query":"query{__schema{queryType{name}}}"}' http://localhost:8080/graphql >/dev/null 2>&1; then
    print_status "GraphQL endpoint is responding"
else
    print_error "GraphQL endpoint is not responding"
    exit 1
fi

# Test frontend
echo "🌐 Testing frontend..."
if curl -f http://localhost:3000 >/dev/null 2>&1; then
    print_status "Frontend is responding"
else
    print_error "Frontend is not responding"
    exit 1
fi

echo ""
echo "🎉 All tests passed! Docker setup is working correctly."
echo ""
echo "Services available at:"
echo "  • Frontend: http://localhost:3000"
echo "  • Backend: http://localhost:8080"
echo "  • GraphQL Playground: http://localhost:8080"
echo "  • Database: localhost:3306"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop services: docker-compose down"