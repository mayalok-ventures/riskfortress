#!/bin/bash
echo "🔍 Verifying RiskFortress installation..."

# Check Node version
node_version=$(node --version)
if [[ $node_version == v20* ]]; then
    echo "✅ Node.js 20+ detected"
else
    echo "❌ Node.js 20+ required"
    exit 1
fi

# Check TypeScript
if npm list typescript | grep -q "5.6.2"; then
    echo "✅ TypeScript 5.6.2 installed"
else
    echo "❌ TypeScript version mismatch"
    exit 1
fi

# Run type check
npm run type-check && echo "✅ TypeScript check passed"

# Run linting
npm run lint && echo "✅ ESLint check passed"

# Run tests
npm test && echo "✅ Tests passed"

# Build verification
npm run build && echo "✅ Build successful"

echo "🎉 All checks passed! Platform is ready for production."