import { test, expect } from '@playwright/test'

test.describe('Secure Intake E2E', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/secure-intake')
    })

    test('has correct title', async ({ page }) => {
        await expect(page).toHaveTitle(/Secure Intelligence Intake/)
    })

    test('validates corporate email', async ({ page }) => {
        // Fill form with personal email
        await page.fill('input[name="email"]', 'test@gmail.com')
        await page.click('button[type="submit"]')

        // Should show error for personal email
        await expect(page.getByText('Please use a corporate email address')).toBeVisible()
    })

    test('submits form successfully', async ({ page }) => {
        // Fill form with valid data
        await page.fill('input[name="firstName"]', 'John')
        await page.fill('input[name="lastName"]', 'Doe')
        await page.fill('input[name="company"]', 'Test Corporation')
        await page.fill('input[name="email"]', 'john@testcorporation.com')
        await page.fill('input[name="phone"]', '9876543210')

        // Accept terms
        await page.click('input[name="agreeToTerms"]')

        // Submit form
        await page.click('button[type="submit"]')

        // Should show success message
        await expect(page.getByText('Intake received and secured')).toBeVisible({
            timeout: 10000
        })
    })

    test('handles rate limiting', async ({ page }) => {
        // Try multiple rapid submissions
        for (let i = 0; i < 6; i++) {
            await page.goto('/secure-intake')
            await page.click('button[type="submit"]')
        }

        // Should show rate limit error
        await expect(page.getByText('Rate limit exceeded')).toBeVisible()
    })
})