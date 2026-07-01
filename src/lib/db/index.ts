import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

// `prepare: false` is required when connecting through Supabase's transaction
// pooler (Supavisor, port 6543) — the mode serverless functions must use, since
// prepared statements can't span pooled connections. Harmless on a direct
// connection, so it's safe for local dev too.
const client = postgres(process.env.DATABASE_URL!, { prepare: false })

export const db = drizzle(client, { schema })
