import { test, expect } from '@playwright/test'

test.describe('Navigation E2E', () => {
    test('navigates between pages', async ({ page }) => {
        await page.goto('/')

        // Check home page
        await expect(page.getByText('Deciphering Uncertainty')).toBeVisible()

        // Navigate to capabilities
        await page.click('a[href="/capabilities"]')
        await expect(page).toHaveURL('/capabilities')
        await expect(page.getByText('Intelligence Capabilities')).toBeVisible()

        // Navigate to dossiers
        await page.click('a[href="/dossiers"]')
        await expect(page).toHaveURL('/dossiers')
        await expect(page.getByText('Risk Intelligence Dossiers')).toBeVisible()

        // Navigate to council
        await page.click('a[href="/council"]')
        await expect(page).toHaveURL('/council')
        await expect(page.getByText('Security Intelligence Council')).toBeVisible()

        // Navigate to secure intake
        await page.click('a[href="/secure-intake"]')
        await expect(page).toHaveURL('/secure-intake')
        await expect(page.getByText('Secure Intelligence Intake')).toBeVisible()
    })

    test('mobile menu works', async ({ page }) => {
        // Set mobile viewport
        await page.setViewportSize({ width: 375, height: 667 })
        await page.goto('/')

        // Open mobile menu
        await page.click('button[aria-label="Toggle menu"]')

        // Check menu items
        await expect(page.getByText('Capabilities')).toBeVisible()
        await expect(page.getByText('Risk Dossiers')).toBeVisible()

        // Navigate via mobile menu
        await page.click('a[href="/capabilities"]')
        await expect(page).toHaveURL('/capabilities')
    })

    test('footer navigation works', async ({ page }) => {
        await page.goto('/')

        // Scroll to footer
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

        // Click footer link
        await page.click('footer a[href="/privacy"]')
        await expect(page).toHaveURL('/privacy')
    })
})