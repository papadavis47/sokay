import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import type { Page } from '@playwright/test'

const here = dirname(fileURLToPath(import.meta.url))

/** Minimal .env.local reader (no dotenv dependency). */
function loadEnvLocal(): Record<string, string> {
  const path = resolve(here, '../../.env.local')
  const out: Record<string, string> = {}
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    out[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim()
  }
  return out
}

const env = loadEnvLocal()
export const SUPABASE_URL = env.VITE_SUPABASE_URL
export const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY

/** A known user that login tests can rely on existing. */
export const TEST_USER = {
  email: 'e2e-login-2@example.com',
  password: 'sokay-test-pw-123',
  displayName: 'E2E Login',
}

/**
 * Wait until React has hydrated the SSR form. Without this, Playwright can fill
 * and submit the server-rendered form before the client JS attaches React's
 * `onSubmit`/`onClick` handlers — the click then triggers a native GET submit
 * (URL becomes `/login?`) instead of the SPA flow. After hydration React tags
 * DOM nodes carrying event handlers with `__reactProps$<id>` keys, so we poll
 * the form for one.
 */
export async function waitForHydration(page: Page): Promise<void> {
  await page.waitForFunction(() => {
    const form = document.querySelector('form')
    return (
      !!form && Object.keys(form).some((k) => k.startsWith('__reactProps$'))
    )
  })
}

/** Unique email per run so signup tests never collide. */
export function uniqueEmail(prefix = 'e2e-signup'): string {
  return `${prefix}+${Date.now()}-${Math.floor(Math.random() * 1e6)}@example.com`
}

/**
 * Ensure a confirmed user exists by hitting GoTrue's signup endpoint directly
 * with the publishable/anon key. Local Supabase has email confirmations
 * disabled, so the user is immediately usable. A 4xx (user already registered)
 * is fine — we only need the account to exist.
 */
export async function ensureTestUser(
  email = TEST_USER.email,
  password = TEST_USER.password,
  displayName = TEST_USER.displayName,
): Promise<void> {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({
      email,
      password,
      data: { display_name: displayName },
    }),
  })
  // 200 = created, 4xx with "already registered" = also fine.
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    const msg = JSON.stringify(body)
    if (!/already|registered|exists/i.test(msg)) {
      throw new Error(`Failed to ensure test user (${res.status}): ${msg}`)
    }
  }
}
