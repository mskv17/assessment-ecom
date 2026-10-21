import { test, expect } from '@playwright/test'

test.describe('Storefront User Journeys', () => {
  test('navigates from Home to Shop and filters products', async ({ page }) => {
    await page.goto('/')

    // Hero title and CTA
    await expect(page.locator('h1')).toContainText('Purity from Soil to Savor')
    const ctaButton = page.getByRole('button', { name: /Explore Fresh Pantry/i })
    await expect(ctaButton).toBeVisible()

    // Click CTA to navigate to Shop
    await ctaButton.click()
    await expect(page).toHaveURL(/\/shop/)

    // Search for honey
    const searchInput = page.getByPlaceholder(/Search by ingredient/i)
    await searchInput.fill('honey')

    // Expect search results to show honey products
    await expect(page.getByText(/Raw Himalayan Wild White Honey/i).first()).toBeVisible({ timeout: 5000 })
  })

  test('views Product Details and opens Demo Checkout', async ({ page }) => {
    await page.goto('/shop')

    // Find and click on A2 Vedic Ghee product
    const productLink = page.getByText('A2 Vedic Bilona Cow Ghee').first()
    await productLink.click()

    await expect(page).toHaveURL(/\/product\/a2-vedic-bilona-cow-ghee/)
    await expect(page.locator('h1')).toContainText('A2 Vedic Bilona Cow Ghee')

    // Check pricing and Add to Basket
    await expect(page.getByText('₹1,450').first()).toBeVisible()
    const addToBasketBtn = page.getByRole('button', { name: /Add to Basket/i }).first()
    await addToBasketBtn.click()

    // Open Basket Drawer
    const basketButton = page.getByRole('button', { name: /View cart with 1 items/i })
    await basketButton.click()

    // Verify basket drawer content
    await expect(page.getByText('Your Harvest Basket')).toBeVisible()
    await expect(page.getByText('Proceed to Demo Checkout')).toBeVisible()

    // Trigger demo checkout modal
    await page.getByRole('button', { name: /Proceed to Demo Checkout/i }).click()
    await expect(page.getByText(/Honest Demonstration Store/i)).toBeVisible()
  })

  test('handles unknown routes with designed 404 page', async ({ page }) => {
    await page.goto('/this-route-does-not-exist')
    await expect(page.getByText('404 • Page Not Found')).toBeVisible()
    await expect(page.getByRole('button', { name: /Explore Fresh Pantry/i })).toBeVisible()
  })
})
