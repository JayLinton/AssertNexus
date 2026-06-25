#!/bin/bash
# Test Docker build

echo "Building Docker image..."
docker-compose build

if [ $? -eq 0 ]; then
    echo "✓ Build successful"
    echo ""
    echo "To start the service:"
    echo "  cd docker"
    echo "  docker-compose up -d"
    echo ""
    echo "To test locally:"
    echo "  open http://localhost:3000"
else
    echo "✗ Build failed"
    exit 1
fi
