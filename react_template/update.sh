#!/bin/bash

# Update Node.js
echo "Updating Node.js..."
sudo apt update
sudo apt install -y nodejs

# Update pnpm
echo "Updating pnpm..."
npm install -g pnpm@latest

# Clean cache
echo "Cleaning pnpm cache..."
pnpm store prune

# Remove existing dependencies
echo "Removing existing dependencies..."
rm -rf node_modules pnpm-lock.yaml

# Reinstall dependencies
echo "Installing dependencies..."
pnpm install

# Run lint
echo "Running lint..."
pnpm run lint

echo "Update completed successfully!"