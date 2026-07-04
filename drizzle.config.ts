import { defineConfig } from 'drizzle-kit'

// Node 22 builtin — loads DATABASE_URL without a dotenv dependency
process.loadEnvFile('.env.local')

export default defineConfig({
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
