import { AsyncLocalStorage } from 'node:async_hooks'
import { vi } from 'vitest'

/**
 * Invoke a `createServerFn` handler inside a minimal Start AsyncLocalStorage
 * context. Calling a server fn directly (test env, no Vite transform) routes
 * through `executeMiddleware`, which reads `getStartContext()` — so without a
 * context it throws "No Start context found". An empty context is enough.
 *
 * `@tanstack/start-storage-context` is a transitive dep, so rather than depend
 * on it directly we reuse the exact same `AsyncLocalStorage` instance it stashes
 * on `globalThis` under a well-known `Symbol.for` key.
 *
 * NOTE: in this transform-free path the framework does not surface the handler's
 * plain return value, so tests assert on side effects (db calls) and thrown
 * errors/redirects rather than on the resolved value.
 */
const STORAGE_KEY = Symbol.for('tanstack-start:start-storage-context')
type GlobalWithStorage = typeof globalThis & {
  [STORAGE_KEY]?: AsyncLocalStorage<unknown>
}
const globalObj = globalThis as GlobalWithStorage
if (!globalObj[STORAGE_KEY]) {
  globalObj[STORAGE_KEY] = new AsyncLocalStorage()
}
const startStorage = globalObj[STORAGE_KEY]!

export function callServerFn<T>(fn: () => Promise<T>): Promise<T> {
  return startStorage.run({}, fn)
}

/**
 * A chainable Drizzle query-builder stub.
 *
 * Real Drizzle builders are thenable and chain methods like
 * `.from().where().limit()` / `.set().where()` / `.values()`. This stub records
 * every call's arguments and resolves (when awaited, or via `.limit()`) to a
 * value pulled from a per-instance results queue, so a test can assert both the
 * shape of the query (e.g. scoping clauses) and feed it fake rows.
 */
export interface QueryBuilderStub {
  from: ReturnType<typeof vi.fn>
  where: ReturnType<typeof vi.fn>
  set: ReturnType<typeof vi.fn>
  values: ReturnType<typeof vi.fn>
  limit: ReturnType<typeof vi.fn>
  then: (resolve: (v: unknown) => unknown, reject?: (e: unknown) => unknown) => Promise<unknown>
  // Captured arguments for assertions.
  calls: { from?: unknown; where?: unknown; set?: unknown; values?: unknown; limit?: unknown }
}

function makeBuilder(result: unknown): QueryBuilderStub {
  const builder = {
    calls: {},
  } as QueryBuilderStub

  builder.from = vi.fn((arg: unknown) => {
    builder.calls.from = arg
    return builder
  })
  builder.where = vi.fn((arg: unknown) => {
    builder.calls.where = arg
    return builder
  })
  builder.set = vi.fn((arg: unknown) => {
    builder.calls.set = arg
    return builder
  })
  builder.values = vi.fn((arg: unknown) => {
    builder.calls.values = arg
    return builder
  })
  builder.limit = vi.fn((arg: unknown) => {
    builder.calls.limit = arg
    return builder
  })
  // Make the builder awaitable so `await db.update(...).where(...)` resolves.
  builder.then = (resolve, reject) => Promise.resolve(result).then(resolve, reject)

  return builder
}

/**
 * Build a `db` mock whose `select`/`insert`/`update`/`delete` each return a
 * fresh chainable builder. Results are dequeued in call order so a handler that
 * runs several queries gets each configured row set in turn.
 */
export function createDbMock(results: unknown[] = []) {
  const queue = [...results]
  const builders: QueryBuilderStub[] = []

  const next = () => {
    const result = queue.length > 0 ? queue.shift() : undefined
    const builder = makeBuilder(result)
    builders.push(builder)
    return builder
  }

  const db = {
    select: vi.fn(() => next()),
    insert: vi.fn(() => next()),
    update: vi.fn(() => next()),
    delete: vi.fn(() => next()),
  }

  return { db, builders }
}

/**
 * Build a Supabase server-client mock that resolves `auth.getUser()` to the
 * given user (or `null` to simulate an unauthenticated request).
 */
export function createSupabaseMock(user: { id: string } | null) {
  return {
    auth: {
      getUser: vi.fn(async () => ({ data: { user }, error: null })),
      signOut: vi.fn(async () => ({ error: null })),
    },
  }
}
