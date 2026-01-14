import { FullConfig } from '@playwright/test'

async function globalTeardown(config: FullConfig) {
    console.log('🧹 Cleaning up RiskFortress E2E Test Environment')

    // Clean up test files
    const fs = require('fs')
    const path = require('path')

    const cleanupDirs = [
        'tests/e2e/test-data/temp',
    ]

    cleanupDirs.forEach(dir => {
        const dirPath = path.join(__dirname, '..', '..', '..', dir)
        if (fs.existsSync(dirPath)) {
            fs.rmSync(dirPath, { recursive: true, force: true })
        }
    })

    console.log('✅ E2E Test Environment Cleanup Complete')

    // Generate test report summary
    const resultsPath = path.join(__dirname, '..', '..', '..', 'test-results')
    if (fs.existsSync(resultsPath)) {
        const files = fs.readdirSync(resultsPath)
        const testFiles = files.filter((f: string) => f.endsWith('.xml'))

        console.log(`📊 Test Results: ${testFiles.length} report files generated`)
    }
}

export default globalTeardown