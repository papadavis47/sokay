import { describe, it, expect, vi, beforeEach } from 'vitest'
import { isRedirect } from '@tanstack/react-router'
import { callServerFn, createDbMock, createSupabaseMock } from '@/test/helpers'

// Mocks are reassigned per-test via the closures below.
let supabaseMock: ReturnType<typeof createSupabaseMock>
let dbMock: ReturnType<typeof createDbMock>

vi.mock('@/lib/supabase/server', () => ({
  createClient: () => supabaseMock,
}))
vi.mock('@/lib/db', () => ({
  get db() {
    return dbMock.db
  },
}))

const USER = { id: 'user-1' }
const ACTIVE_GOAL = {
  id: 'goal-1',
  userId: USER.id,
  totalItems: 5,
  status: 'active' as const,
}

// Imported after mocks are registered.
const { createDebit, updateDebit, deleteDebit } = await import('@/goals/debits')

beforeEach(() => {
  supabaseMock = createSupabaseMock(USER)
  dbMock = createDbMock()
})

describe('createDebit', () => {
  it('redirects to /login when unauthenticated', async () => {
    supabaseMock = createSupabaseMock(null)
    try {
      await callServerFn(() =>
        createDebit({ data: { goalId: 'goal-1', foodName: 'Cake' } }),
      )
      expect.unreachable('should have thrown a redirect')
    } catch (err) {
      expect(isRedirect(err)).toBe(true)
    }
  })

  it('throws when the goal is not found', async () => {
    dbMock = createDbMock([[] /* goal lookup → none */])
    await expect(
      callServerFn(() =>
        createDebit({ data: { goalId: 'missing', foodName: 'Cake' } }),
      ),
    ).rejects.toThrow('Goal not found.')
  })

  it('throws when the goal is no longer active', async () => {
    dbMock = createDbMock([[{ ...ACTIVE_GOAL, status: 'reviewing' }]])
    await expect(
      callServerFn(() =>
        createDebit({ data: { goalId: 'goal-1', foodName: 'Cake' } }),
      ),
    ).rejects.toThrow('no longer active')
  })

  it('enforces the hard cap when items are used up', async () => {
    dbMock = createDbMock([
      [ACTIVE_GOAL], // goal lookup
      [{ used: 5 }], // count == totalItems
    ])
    await expect(
      callServerFn(() =>
        createDebit({ data: { goalId: 'goal-1', foodName: 'Cake' } }),
      ),
    ).rejects.toThrow('used all your sokay items')
  })

  it('rejects notes longer than 250 characters', async () => {
    dbMock = createDbMock([[ACTIVE_GOAL], [{ used: 0 }]])
    await expect(
      callServerFn(() =>
        createDebit({
          data: { goalId: 'goal-1', foodName: 'Cake', notes: 'x'.repeat(251) },
        }),
      ),
    ).rejects.toThrow('250 characters or fewer')
  })

  it('inserts a debit scoped to the user, trimming notes', async () => {
    dbMock = createDbMock([[ACTIVE_GOAL], [{ used: 1 }]])
    await callServerFn(() =>
      createDebit({
        data: { goalId: 'goal-1', foodName: 'Cake', notes: '  birthday  ' },
      }),
    )

    // builders[2] is the insert (after goal-select and count-select).
    const insertBuilder = dbMock.builders[2]
    expect(insertBuilder.calls.values).toEqual({
      goalId: 'goal-1',
      userId: USER.id,
      foodName: 'Cake',
      notes: 'birthday',
    })
  })

  it('stores null notes when notes are blank', async () => {
    dbMock = createDbMock([[ACTIVE_GOAL], [{ used: 0 }]])
    await callServerFn(() =>
      createDebit({
        data: { goalId: 'goal-1', foodName: 'Cake', notes: '   ' },
      }),
    )
    expect(dbMock.builders[2].calls.values).toMatchObject({ notes: null })
  })
})

describe('updateDebit', () => {
  it('redirects to /login when unauthenticated', async () => {
    supabaseMock = createSupabaseMock(null)
    try {
      await callServerFn(() =>
        updateDebit({ data: { debitId: 'd-1', foodName: 'Pie' } }),
      )
      expect.unreachable('should have thrown a redirect')
    } catch (err) {
      expect(isRedirect(err)).toBe(true)
    }
  })

  it('updates with the new values', async () => {
    dbMock = createDbMock([undefined])
    await callServerFn(() =>
      updateDebit({
        data: { debitId: 'd-1', foodName: 'Pie', notes: 'a slice' },
      }),
    )
    expect(dbMock.db.update).toHaveBeenCalledOnce()
    expect(dbMock.builders[0].calls.set).toEqual({
      foodName: 'Pie',
      notes: 'a slice',
    })
  })
})

describe('deleteDebit', () => {
  it('redirects to /login when unauthenticated', async () => {
    supabaseMock = createSupabaseMock(null)
    try {
      await callServerFn(() => deleteDebit({ data: { debitId: 'd-1' } }))
      expect.unreachable('should have thrown a redirect')
    } catch (err) {
      expect(isRedirect(err)).toBe(true)
    }
  })

  it('issues a scoped delete', async () => {
    dbMock = createDbMock([undefined])
    await callServerFn(() => deleteDebit({ data: { debitId: 'd-1' } }))
    expect(dbMock.db.delete).toHaveBeenCalledOnce()
    expect(dbMock.builders[0].where).toHaveBeenCalledOnce()
  })
})
