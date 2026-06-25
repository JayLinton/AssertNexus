@echo off
REM Test Docker build

echo Building Docker image...
docker-compose build

if %errorlevel% equ 0 (
    echo ✓ Build successful
    echo.
    echo To start the service:
    echo   cd docker
    echo   docker-compose up -d
    echo.
    echo To test locally:
    echo   open http://localhost:3000
) else (
    echo ✗ Build failed
    exit /b 1
)
