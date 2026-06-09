import { test, expect } from '@playwright/test'
import {
  TEST_USER,
  ensureTestUser,
  uniqueEmail,
  waitForHydration,
} from './helpers/auth'

// Make sure the shared login user exists before the login/logout tests run.
test.beforeAll(async () => {
  await ensureTestUser()
})

test.describe('protected routes', () => {
  test('redirects unauthenticated users from /dashboard to /login', async ({
    page,
  }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/login$/)
    await expect(
      page.getByRole('heading', { name: /welcome back to sokay/i }),
    ).toBeVisible()
  })
})

test.describe('signup (email/password)', () => {
  test('creates an account and lands on the dashboard', async ({ page }) => {
    const email = uniqueEmail()
    await page.goto('/signup')
    await waitForHydration(page)

    await page.getByLabel('Display name').fill('New Tester')
    await page.getByLabel('Email').fill(email)
    await page.getByLabel('Password', { exact: true }).fill('sokay-test-pw-123')
    await page.getByLabel('Confirm Password').fill('sokay-test-pw-123')
    await page.getByRole('button', { name: /create account/i }).click()

    await expect(page).toHaveURL(/\/dashboard$/)
    await expect(page.getByRole('button', { name: /log out/i })).toBeVisible()
  })

  test('shows an error when passwords do not match', async ({ page }) => {
    await page.goto('/signup')
    await waitForHydration(page)
    await page.getByLabel('Email').fill(uniqueEmail())
    await page.getByLabel('Password', { exact: true }).fill('sokay-test-pw-123')
    await page.getByLabel('Confirm Password').fill('different-password')
    await page.getByRole('button', { name: /create account/i }).click()

    await expect(page.getByText(/passwords do not match/i)).toBeVisible()
    await expect(page).toHaveURL(/\/signup$/)
  })
})

test.describe('login (email/password)', () => {
  test('logs in with valid credentials and lands on the dashboard', async ({
    page,
  }) => {
    await page.goto('/login')
    await waitForHydration(page)
    await page.getByLabel('Email').fill(TEST_USER.email)
    await page.getByLabel('Password', { exact: true }).fill(TEST_USER.password)
    await page.getByRole('button', { name: /^sign in$/i }).click()

    await expect(page).toHaveURL(/\/dashboard$/)
    await expect(page.getByRole('button', { name: /log out/i })).toBeVisible()
  })

  test('shows an error for invalid credentials', async ({ page }) => {
    await page.goto('/login')
    await waitForHydration(page)
    await page.getByLabel('Email').fill(TEST_USER.email)
    await page.getByLabel('Password', { exact: true }).fill('wrong-password')
    await page.getByRole('button', { name: /^sign in$/i }).click()

    await expect(page.getByText(/invalid login credentials/i)).toBeVisible()
    await expect(page).toHaveURL(/\/login$/)
  })
})

test.describe('logout', () => {
  test('logs out, returns home, and re-protects the dashboard', async ({
    page,
  }) => {
    // Log in first.
    await page.goto('/login')
    await waitForHydration(page)
    await page.getByLabel('Email').fill(TEST_USER.email)
    await page.getByLabel('Password', { exact: true }).fill(TEST_USER.password)
    await page.getByRole('button', { name: /^sign in$/i }).click()
    await expect(page).toHaveURL(/\/dashboard$/)

    // Log out.
    await page.getByRole('button', { name: /log out/i }).click()
    await expect(page).toHaveURL(/\/$/)

    // Dashboard is protected again.
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/login$/)
  })
})

test.describe('GitHub OAuth', () => {
  test('initiates the GitHub OAuth redirect from the login page', async ({
    page,
  }) => {
    await page.goto('/login')
    await waitForHydration(page)

    // We only verify the OAuth flow is *initiated* (the browser is sent to
    // GoTrue's authorize endpoint for GitHub). We don't complete GitHub login.
    const authorizeRequest = page.waitForRequest(
      (req) =>
        /\/auth\/v1\/authorize/.test(req.url()) &&
        /provider=github/.test(req.url()),
    )
    await page.getByRole('button', { name: /continue with github/i }).click()
    await authorizeRequest
  })
})
