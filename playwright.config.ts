import { defineConfig, devices } from '@playwright/test'

/**
 * E2E auth flow tests. These run against the LOCAL dev stack:
 *   - Vite dev server on http://localhost:3000  (`pnpm dev`)
 *   - local Supabase on http://127.0.0.1:54321   (`supabase start`)
 *
 * Both must be running. `webServer` below will start `pnpm dev` if nothing is
 * listening on :3000, but Supabase must be started separately.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 120_000,
  },
})
