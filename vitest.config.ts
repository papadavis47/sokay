import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

// NOTE: intentionally does NOT use the tanstackStart() Vite plugin. Without the
// plugin's transform, `createServerFn(...).handler(fn)` keeps `fn` as the
// "extractedFn", so calling the server function directly in a test invokes the
// handler inline (no RPC/HTTP). That lets us unit-test handler logic by mocking
// `@/lib/supabase/server` and `@/lib/db`.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'styled-system': fileURLToPath(new URL('./styled-system', import.meta.url)),
    },
  },
})
