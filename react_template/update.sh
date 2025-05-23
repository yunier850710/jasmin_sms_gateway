#!/bin/bash

# Update package lists
apt-get update

# Upgrade Node.js to latest LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Update npm to latest version
npm install -g npm@latest

# Update pnpm to latest version
npm install -g pnpm@latest

# Update project dependencies
pnpm install

# Run lint to check for any issues
pnpm run lint

echo "Update completed successfully!"
echo "Node.js version: $(node -v)"
echo "npm version: $(npm -v)"
echo "pnpm version: $(pnpm -v)"
