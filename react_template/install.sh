#!/bin/bash

# Update package lists
apt-get update

# Install curl if not present
apt-get install -y curl

# Install Node.js repository based on Ubuntu version
UBUNTU_VERSION=$(lsb_release -rs)

if [ "$UBUNTU_VERSION" = "20.04" ] || [ "$UBUNTU_VERSION" = "22.04" ] || [ "$UBUNTU_VERSION" = "24.04" ]; then
    # Install Node.js 20.x LTS
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs

    # Install latest npm
    npm install -g npm@latest

    # Install pnpm
    npm install -g pnpm@latest

    # Install other dependencies
    apt-get install -y build-essential python3-pip

    echo "Installation completed successfully!"
    echo "Node.js version: $(node -v)"
    echo "npm version: $(npm -v)"
    echo "pnpm version: $(pnpm -v)"
else
    echo "Unsupported Ubuntu version: $UBUNTU_VERSION"
    echo "This script supports Ubuntu 20.04, 22.04, and 24.04"
    exit 1
fi
