import { describe, it, expect, vi, beforeEach } from 'vitest'
import { isRedirect } from '@tanstack/react-router'
import { callServerFn, createDbMock, createSupabaseMock } from './helpers'

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

const { createGoal, startGoalReview, completeGoal } = await import('@/server/goals')

beforeEach(() => {
  supabaseMock = createSupabaseMock(USER)
  dbMock = createDbMock([undefined])
})

describe('createGoal', () => {
  it('redirects to /login when unauthenticated', async () => {
    supabaseMock = createSupabaseMock(null)
    try {
      await callServerFn(() =>
        createGoal({ data: { totalItems: 10, durationMonths: 3 } }),
      )
      expect.unreachable('should have thrown a redirect')
    } catch (err) {
      expect(isRedirect(err)).toBe(true)
    }
  })

  it('inserts an active goal for the user with a computed end date', async () => {
    await callServerFn(() =>
      createGoal({ data: { totalItems: 10, durationMonths: 3 } }),
    )
    expect(dbMock.db.insert).toHaveBeenCalledOnce()

    const values = dbMock.builders[0].calls.values as {
      userId: string
      totalItems: number
      durationMonths: number
      startDate: Date
      endDate: Date
      status: string
    }
    expect(values.userId).toBe(USER.id)
    expect(values.totalItems).toBe(10)
    expect(values.durationMonths).toBe(3)
    expect(values.status).toBe('active')
    // endDate should be durationMonths after startDate.
    const expectedEnd = new Date(values.startDate)
    expectedEnd.setMonth(expectedEnd.getMonth() + 3)
    expect(values.endDate.getTime()).toBe(expectedEnd.getTime())
  })
})

describe('startGoalReview', () => {
  it('redirects to /login when unauthenticated', async () => {
    supabaseMock = createSupabaseMock(null)
    try {
      await callServerFn(() => startGoalReview({ data: { goalId: 'goal-1' } }))
      expect.unreachable('should have thrown a redirect')
    } catch (err) {
      expect(isRedirect(err)).toBe(true)
    }
  })

  it('sets status to reviewing', async () => {
    await callServerFn(() => startGoalReview({ data: { goalId: 'goal-1' } }))
    expect(dbMock.db.update).toHaveBeenCalledOnce()
    expect(dbMock.builders[0].calls.set).toEqual({ status: 'reviewing' })
  })
})

describe('completeGoal', () => {
  it('redirects to /login when unauthenticated', async () => {
    supabaseMock = createSupabaseMock(null)
    try {
      await callServerFn(() => completeGoal({ data: { goalId: 'goal-1' } }))
      expect.unreachable('should have thrown a redirect')
    } catch (err) {
      expect(isRedirect(err)).toBe(true)
    }
  })

  it('sets status to completed', async () => {
    await callServerFn(() => completeGoal({ data: { goalId: 'goal-1' } }))
    expect(dbMock.db.update).toHaveBeenCalledOnce()
    expect(dbMock.builders[0].calls.set).toEqual({ status: 'completed' })
  })
})
