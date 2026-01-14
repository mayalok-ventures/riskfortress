const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🚀 Building for Cloudflare Pages...')

// Clean previous builds
console.log('🧹 Cleaning previous builds...')
try {
  execSync('rmdir /s /q .next', { stdio: 'inherit' })
} catch (e) {
  // Directory might not exist, continue
}

// Set environment for Cloudflare
process.env.NEXT_PUBLIC_APP_ENV = 'production'
process.env.NEXT_PUBLIC_APP_URL = 'https://riskfortress.com'

// Build the application
console.log('📦 Building Next.js application...')
execSync('next build', { stdio: 'inherit' })

// Create Cloudflare-specific files
console.log('⚙️  Creating Cloudflare configuration...')

// Create _routes.json for Cloudflare Pages
const routesConfig = {
  version: 1,
  include: ['/*'],
  exclude: [
    '/_next/*',
    '/static/*',
    '/api/*',
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml'
  ]
}

fs.writeFileSync(
  path.join('.next', '_routes.json'),
  JSON.stringify(routesConfig, null, 2)
)

// Create _headers file for Cloudflare
const headersConfig = `
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload

/_next/static/*
  Cache-Control: public, max-age=31536000, immutable

/static/*
  Cache-Control: public, max-age=31536000, immutable

/api/*
  Cache-Control: no-cache, no-store, must-revalidate
`

fs.writeFileSync(
  path.join('.next', '_headers'),
  headersConfig.trim()
)

// Create _redirects file
const redirectsConfig = `
/api/* /api/:splat 200
/* /:splat 200
`

fs.writeFileSync(
  path.join('.next', '_redirects'),
  redirectsConfig.trim()
)

console.log('✅ Cloudflare build complete!')
console.log('📁 Build output: .next/')
console.log('🚀 Deploy with: wrangler pages deploy .next --project-name=riskfortress')