import { describe, it, expect, vi, beforeEach } from 'vitest'
import { isRedirect } from '@tanstack/react-router'
import { callServerFn, createDbMock, createSupabaseMock } from '@/test/helpers'

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

const { createGoal, startGoalReview, completeGoal } =
  await import('@/goals/goals')

beforeEach(() => {
  supabaseMock = createSupabaseMock(USER)
  dbMock = createDbMock([undefined])
})

describe('createGoal', () => {
  it('redirects to /login when unauthenticated', async () => {
    supabaseMock = createSupabaseMock(null)
    try {
      await callServerFn(() =>
        createGoal({
          data: { totalItems: 10, durationValue: 3, durationUnit: 'month' },
        }),
      )
      expect.unreachable('should have thrown a redirect')
    } catch (err) {
      expect(isRedirect(err)).toBe(true)
    }
  })

  it('inserts an active goal with a month-based end date', async () => {
    await callServerFn(() =>
      createGoal({
        data: { totalItems: 10, durationValue: 3, durationUnit: 'month' },
      }),
    )
    expect(dbMock.db.insert).toHaveBeenCalledOnce()

    const values = dbMock.builders[0].calls.values as {
      userId: string
      totalItems: number
      durationValue: number
      durationUnit: string
      startDate: Date
      endDate: Date
      status: string
    }
    expect(values.userId).toBe(USER.id)
    expect(values.totalItems).toBe(10)
    expect(values.durationValue).toBe(3)
    expect(values.durationUnit).toBe('month')
    expect(values.status).toBe('active')
    // endDate should be durationValue months after startDate.
    const expectedEnd = new Date(values.startDate)
    expectedEnd.setMonth(expectedEnd.getMonth() + 3)
    expect(values.endDate.getTime()).toBe(expectedEnd.getTime())
  })

  it('inserts a goal with a week-based end date', async () => {
    await callServerFn(() =>
      createGoal({
        data: { totalItems: 1, durationValue: 2, durationUnit: 'week' },
      }),
    )
    expect(dbMock.db.insert).toHaveBeenCalledOnce()

    const values = dbMock.builders[0].calls.values as {
      totalItems: number
      durationValue: number
      durationUnit: string
      startDate: Date
      endDate: Date
    }
    expect(values.totalItems).toBe(1)
    expect(values.durationValue).toBe(2)
    expect(values.durationUnit).toBe('week')
    // endDate should be durationValue weeks after startDate.
    const expectedEnd = new Date(values.startDate)
    expectedEnd.setDate(expectedEnd.getDate() + 14)
    expect(values.endDate.getTime()).toBe(expectedEnd.getTime())
  })

  it.each([
    [{ totalItems: 0, durationValue: 1, durationUnit: 'month' as const }],
    [{ totalItems: 101, durationValue: 1, durationUnit: 'month' as const }],
    [{ totalItems: 1.5, durationValue: 1, durationUnit: 'month' as const }],
    [{ totalItems: 10, durationValue: 0, durationUnit: 'month' as const }],
    [{ totalItems: 10, durationValue: 13, durationUnit: 'month' as const }],
    [{ totalItems: 10, durationValue: 53, durationUnit: 'week' as const }],
  ])('rejects out-of-range input %j', async (data) => {
    await expect(callServerFn(() => createGoal({ data }))).rejects.toThrow()
    expect(dbMock.db.insert).not.toHaveBeenCalled()
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
