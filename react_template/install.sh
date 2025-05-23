#!/bin/bash

# Detect Ubuntu version
VERSION=$(lsb_release -rs)
echo "Detected Ubuntu version: $VERSION"

# Update system
sudo apt update && sudo apt upgrade -y

# Install curl if not installed
sudo apt install -y curl

# Add NodeSource repository based on Ubuntu version
if [ "$VERSION" = "20.04" ] || [ "$VERSION" = "22.04" ] || [ "$VERSION" = "24.04" ]; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
else
    echo "Unsupported Ubuntu version"
    exit 1
fi

# Install Node.js and npm
sudo apt install -y nodejs

# Verify installation
node --version
npm --version

# Install pnpm
npm install -g pnpm

# Install project dependencies
pnpm install

# Create .env if not exists
if [ ! -f .env ]; then
    cp .env.example .env
fi

echo "Installation completed successfully!"
echo "Please configure your .env file with your specific settings."