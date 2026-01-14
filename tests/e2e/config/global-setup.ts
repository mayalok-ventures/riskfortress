import { FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
    console.log('🔄 Setting up RiskFortress E2E Test Environment')

    // Set test environment variables
    process.env.NODE_ENV = 'test'
    process.env.NEXT_PUBLIC_APP_ENV = 'test'
    process.env.PLAYWRIGHT_TEST = 'true'

    // Create test data directory
    const fs = require('fs')
    const path = require('path')

    const testDirs = [
        'test-results',
        'playwright-report',
        'tests/e2e/test-data',
        'tests/e2e/__snapshots__',
    ]

    testDirs.forEach(dir => {
        const dirPath = path.join(__dirname, '..', '..', '..', dir)
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true })
        }
    })

    console.log('✅ E2E Test Environment Setup Complete')
}

export default globalSetup