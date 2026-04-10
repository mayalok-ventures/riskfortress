import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
    testDir: './tests/e2e',
    timeout: 30000,
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: [
        ['html', { outputFolder: 'playwright-report', open: 'never' }],
        ['json', { outputFile: 'playwright-results.json' }],
        ['junit', { outputFile: 'test-results/junit-e2e.xml' }],
        ['list', { printSteps: true }],
    ],

    use: {
        baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',
        trace: process.env.CI ? 'on-first-retry' : 'on',
        screenshot: process.env.CI ? 'only-on-failure' : 'on',
        video: process.env.CI ? 'retain-on-failure' : 'off',
        actionTimeout: 10000,
        navigationTimeout: 30000,
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,
        userAgent: 'RiskFortress E2E Testing/1.0.0',
    },

    projects: [
        // Desktop Browsers
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                channel: 'chrome',
            },
        },
        {
            name: 'firefox',
            use: {
                ...devices['Desktop Firefox'],
                launchOptions: {
                    firefoxUserPrefs: {
                        'dom.webnotifications.enabled': false,
                        'media.volume_scale': '0.0',
                    },
                },
            },
        },
        {
            name: 'webkit',
            use: {
                ...devices['Desktop Safari'],
                launchOptions: {
                    slowMo: 100,
                },
            },
        },

        // Mobile Devices
        {
            name: 'Mobile Chrome',
            use: {
                ...devices['Pixel 5'],
                isMobile: true,
                hasTouch: true,
            },
        },
        {
            name: 'Mobile Safari',
            use: {
                ...devices['iPhone 12'],
                isMobile: true,
                hasTouch: true,
            },
        },

        // Tablet Devices
        {
            name: 'Tablet Chrome',
            use: {
                ...devices['Galaxy Tab S4'],
                isMobile: true,
                hasTouch: true,
            },
        },

        // API Testing
        {
            name: 'API Tests',
            testMatch: '**/*.api.spec.ts',
            use: {
                baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',
                extraHTTPHeaders: {
                    'Content-Type': 'application/json',
                    'X-Test-Environment': 'e2e',
                },
            },
        },
    ],

    webServer: {
        command: process.env.CI ? 'npm run start' : 'npm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        timeout: 120000,
        stdout: 'pipe',
        stderr: 'pipe',
        env: {
            NODE_ENV: 'test',
            NEXT_PUBLIC_APP_ENV: 'test',
            PLAYWRIGHT_TEST: 'true',
        },
    },

    // Global Setup and Teardown
    globalSetup: require.resolve('./tests/e2e/config/global-setup'),
    globalTeardown: require.resolve('./tests/e2e/config/global-teardown'),

    // Test Results
    outputDir: 'test-results/e2e',

    // Expect Configuration
    expect: {
        timeout: 10000,
        toHaveScreenshot: {
            maxDiffPixels: 100,
            threshold: 0.2,
        },
        toMatchSnapshot: {
            maxDiffPixelRatio: 0.1,
        },
    },

    // Timeouts
    timeout: 60000,
    expect: {
        timeout: 10000,
    },

    // Test Ignore Patterns
    testIgnore: [
        '**/node_modules/**',
        '**/.next/**',
        '**/dist/**',
        '**/out/**',
        '**/playwright-report/**',
        '**/test-results/**',
    ],

    // Snapshot Configuration
    snapshotDir: './tests/e2e/__snapshots__',

    // Metadata
    metadata: {
        platform: process.platform,
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
    },
})