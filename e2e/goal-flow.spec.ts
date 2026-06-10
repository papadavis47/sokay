import { test, expect, type Page } from '@playwright/test'
import { uniqueEmail, waitForHydration } from './helpers/auth'

/**
 * Goal lifecycle flows. Each test signs up a brand-new user so it starts from
 * the empty "Welcome to Sokay!" state and can't collide with parallel tests.
 * Signup navigates client-side to /dashboard, so only the initial /signup
 * load needs the hydration wait.
 */

async function signUpNewUser(page: Page): Promise<void> {
  await page.goto('/signup')
  await waitForHydration(page)
  await page.getByLabel('Display name').fill('Goal Tester')
  await page.getByLabel('Email').fill(uniqueEmail('e2e-goal'))
  await page.getByLabel('Password', { exact: true }).fill('sokay-test-pw-123')
  await page.getByLabel('Confirm Password').fill('sokay-test-pw-123')
  await page.getByRole('button', { name: /create account/i }).click()
  await expect(page).toHaveURL(/\/dashboard$/)
  await expect(
    page.getByRole('heading', { name: /welcome to sokay/i }),
  ).toBeVisible()
}

async function createGoal(page: Page, items: number): Promise<void> {
  await page.getByLabel('Sokay Items').fill(String(items))
  await page.getByRole('button', { name: /start my journey/i }).click()
  await expect(page.getByText(`0 of ${items} used`)).toBeVisible()
}

async function logItem(page: Page, food: string): Promise<void> {
  await page.getByRole('button', { name: /log an item/i }).click()
  await page.getByLabel('Food or Drink').fill(food)
  await page.getByRole('button', { name: /^log item$/i }).click()
}

test.describe('goal setup', () => {
  test('creates a goal with a weeks duration and lands on the balance card', async ({
    page,
  }) => {
    await signUpNewUser(page)

    await page.getByLabel('Sokay Items').fill('3')

    // Switch the duration unit to weeks, then pick a value from the
    // weeks-only dropdown.
    await page.getByRole('button', { name: /^weeks$/i }).click()
    await expect(
      page.getByText(/your goal will run for 1 week\./i),
    ).toBeVisible()
    await page.getByRole('combobox').click()
    await page.getByRole('option', { name: /^2 weeks$/i }).click()
    await expect(
      page.getByText(/your goal will run for 2 weeks\./i),
    ).toBeVisible()

    await page.getByRole('button', { name: /start my journey/i }).click()

    await expect(page.getByText('Items Remaining')).toBeVisible()
    await expect(page.getByText('0 of 3 used')).toBeVisible()
    // A 2-week goal counts down from 14 days.
    await expect(page.getByText(/14 days remaining/i)).toBeVisible()
  })
})

test.describe('logging items', () => {
  test('logs an item and decrements the balance', async ({ page }) => {
    await signUpNewUser(page)
    await createGoal(page, 3)

    await logItem(page, 'Ice cream')

    await expect(page.getByText('1 of 3 used')).toBeVisible()
    await expect(page.getByText('Ice cream')).toBeVisible()
  })

  test('hides the log button and shows the at-limit notice when items run out', async ({
    page,
  }) => {
    await signUpNewUser(page)
    await createGoal(page, 1)

    await logItem(page, 'Soda')

    await expect(
      page.getByText(/you've used all 1 of your sokay items/i),
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: /log an item/i }),
    ).not.toBeVisible()
    await expect(
      page.getByRole('button', { name: /review & start over/i }),
    ).toBeVisible()
  })
})

test.describe('ending a goal early', () => {
  test('ends the goal from the balance card and starts fresh after review', async ({
    page,
  }) => {
    await signUpNewUser(page)
    await createGoal(page, 5)

    await page.getByRole('button', { name: /end goal early/i }).click()
    await expect(
      page.getByRole('heading', { name: /end this goal early\?/i }),
    ).toBeVisible()
    await page.getByRole('button', { name: /end & review/i }).click()

    await expect(page).toHaveURL(/\/goal\/review\/[0-9a-f-]+$/)
    await expect(
      page.getByRole('heading', { name: /goal complete!/i }),
    ).toBeVisible()

    await page
      .getByRole('button', { name: /complete goal & start fresh/i })
      .click()

    await expect(page).toHaveURL(/\/dashboard$/)
    await expect(page.getByText('Set Your Sokay Goal')).toBeVisible()
  })

  test('keep going dismisses the dialog without ending the goal', async ({
    page,
  }) => {
    await signUpNewUser(page)
    await createGoal(page, 5)

    await page.getByRole('button', { name: /end goal early/i }).click()
    await page.getByRole('button', { name: /keep going/i }).click()

    await expect(
      page.getByRole('heading', { name: /end this goal early\?/i }),
    ).not.toBeVisible()
    await expect(page.getByText('0 of 5 used')).toBeVisible()
    await expect(page).toHaveURL(/\/dashboard$/)
  })
})
