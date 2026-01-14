#!/bin/bash
echo "🚀 Setting up RiskFortress Enterprise Platform..."

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
echo "Please edit .env.local with your configuration"

# Set up Git hooks
npm run prepare

# Generate encryption key
openssl rand -base64 32 > .encryption.key
echo "Generated encryption key: .encryption.key"

# Build the application
npm run build

echo "✅ Setup complete! Run 'npm run dev' to start development server."